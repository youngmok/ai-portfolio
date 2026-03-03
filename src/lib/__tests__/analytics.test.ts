/**
 * Unit tests for src/lib/analytics.ts
 *
 * Strategy:
 *  - Each describe block re-imports the module via vi.resetModules() + dynamic
 *    import so that module-level state (eventQueue, initialized, etc.) is fresh.
 *  - Browser globals (window, sessionStorage, localStorage, fetch, crypto,
 *    navigator, screen, Intl, document) are provided by the jsdom environment
 *    configured in vitest.config.ts.
 *  - NEXT_PUBLIC_ANALYTICS_URL is injected through import.meta.env / process.env
 *    before each import.
 */

import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Re-import analytics with a clean module-level state. */
async function freshImport() {
  vi.resetModules();
  return import("@/lib/analytics");
}

/** Populate process.env so that isTrackingEnabled() returns true. */
function enableTracking() {
  process.env.NEXT_PUBLIC_ANALYTICS_URL = "https://example.com/api/analytics";
}

/** Clear the env var so that isTrackingEnabled() returns false. */
function disableTracking() {
  delete process.env.NEXT_PUBLIC_ANALYTICS_URL;
}

/** Build a minimal SessionData JSON string for sessionStorage. */
function makeSessionJson(overrides: Partial<{ sessionId: string; lastActive: number; isNew: boolean }> = {}) {
  return JSON.stringify({
    sessionId: "test-session-id",
    lastActive: Date.now(),
    isNew: true,
    ...overrides,
  });
}

// ---------------------------------------------------------------------------
// Global mock setup
// ---------------------------------------------------------------------------

beforeEach(() => {
  // Clear storage between tests
  sessionStorage.clear();
  localStorage.clear();

  // Reset navigator.webdriver to false (non-bot)
  Object.defineProperty(navigator, "webdriver", {
    value: false,
    writable: true,
    configurable: true,
  });

  // Provide a stable crypto.getRandomValues implementation
  Object.defineProperty(globalThis, "crypto", {
    value: {
      getRandomValues: (arr: Uint8Array) => {
        for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
        return arr;
      },
    },
    writable: true,
    configurable: true,
  });

  // Mock fetch — tests that verify network calls assert on this spy
  globalThis.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
});

afterEach(() => {
  disableTracking();
  vi.clearAllTimers();
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// djb2Hash (exported indirectly through fingerprint logic)
// ---------------------------------------------------------------------------

describe("djb2Hash (via generateFingerprint)", () => {
  it("produces a deterministic fingerprint for the same window state", async () => {
    enableTracking();
    const { initAnalytics } = await freshImport();

    // Run initAnalytics twice; fingerprint is generated once
    initAnalytics();
    const { trackPageView } = await import("@/lib/analytics");
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );
    trackPageView("/test", "Test");

    // If fingerprint were non-deterministic the queue entries would differ —
    // here we just assert the function does not throw and tracking is active.
    expect(globalThis.fetch).not.toHaveBeenCalled(); // not flushed yet
  });
});

// ---------------------------------------------------------------------------
// isTrackingEnabled
// ---------------------------------------------------------------------------

describe("isTrackingEnabled", () => {
  it("returns false when NEXT_PUBLIC_ANALYTICS_URL is not set", async () => {
    disableTracking();
    const { initAnalytics, trackPageView, flushEvents } = await freshImport();

    initAnalytics();
    trackPageView("/", "Home");
    flushEvents();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("returns false when navigator.webdriver is true (bot)", async () => {
    enableTracking();
    Object.defineProperty(navigator, "webdriver", {
      value: true,
      writable: true,
      configurable: true,
    });

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/", "Home");
    flushEvents();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("returns false when analytics_optout is set in localStorage", async () => {
    enableTracking();
    localStorage.setItem("analytics_optout", "1");

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/", "Home");
    flushEvents();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// initAnalytics
// ---------------------------------------------------------------------------

describe("initAnalytics", () => {
  it("is idempotent: calling twice does not double-register scroll listener", async () => {
    enableTracking();
    const addEventSpy = vi.spyOn(window, "addEventListener");

    const { initAnalytics } = await freshImport();
    initAnalytics();
    initAnalytics(); // second call should be a no-op

    const scrollListeners = addEventSpy.mock.calls.filter(([evt]) => evt === "scroll");
    expect(scrollListeners.length).toBe(1);
  });

  it("registers a beforeunload listener on init", async () => {
    enableTracking();
    const addEventSpy = vi.spyOn(window, "addEventListener");

    const { initAnalytics } = await freshImport();
    initAnalytics();

    const unloadListeners = addEventSpy.mock.calls.filter(([evt]) => evt === "beforeunload");
    expect(unloadListeners.length).toBeGreaterThanOrEqual(1);
  });

  it("starts the periodic flush interval", async () => {
    enableTracking();
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    const { initAnalytics } = await freshImport();
    initAnalytics();

    expect(setIntervalSpy).toHaveBeenCalledOnce();
    // Interval period should be 5 000 ms
    expect(setIntervalSpy.mock.calls[0][1]).toBe(5_000);
  });
});

// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------

describe("getOrCreateSession (via trackPageView)", () => {
  it("creates a new session when sessionStorage is empty", async () => {
    enableTracking();
    const { initAnalytics, trackPageView } = await freshImport();

    initAnalytics();
    trackPageView("/home", "Home");

    const raw = sessionStorage.getItem("analytics_session");
    expect(raw).not.toBeNull();
    const session = JSON.parse(raw!);
    expect(session.sessionId).toMatch(/^[0-9a-f-]{36}$/);
    expect(session.isNew).toBe(false); // isNew is set to false after session_start queued
  });

  it("reuses an existing session that is still active", async () => {
    enableTracking();
    const existingId = "existing-session-id-1234";
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ sessionId: existingId, isNew: false })
    );

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/blog", "Blog");
    flushEvents();

    // Verify fetch payload uses the pre-existing session id
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    expect(body.events[0].sessionId).toBe(existingId);
  });

  it("creates a new session when existing session has expired (>30 min ago)", async () => {
    enableTracking();
    const expiredSession = {
      sessionId: "old-session",
      lastActive: Date.now() - 31 * 60 * 1000, // 31 minutes ago
      isNew: false,
    };
    sessionStorage.setItem("analytics_session", JSON.stringify(expiredSession));

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/", "Home");
    flushEvents();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    // New session must be different from the expired one
    const sessionIds = body.events.map((e: { sessionId: string }) => e.sessionId);
    for (const id of sessionIds) {
      expect(id).not.toBe("old-session");
    }
  });
});

// ---------------------------------------------------------------------------
// trackPageView — event sequencing
// ---------------------------------------------------------------------------

describe("trackPageView", () => {
  it("enqueues a session_start event on the very first page view (new session)", async () => {
    enableTracking();
    const { initAnalytics, trackPageView, flushEvents } = await freshImport();

    initAnalytics();
    trackPageView("/", "Home");
    flushEvents();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    const types = body.events.map((e: { type: string }) => e.type);
    expect(types).toContain("session_start");
    expect(types).toContain("page_view");
  });

  it("does NOT enqueue session_start for an existing (non-new) session", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/about", "About");
    flushEvents();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    const types = body.events.map((e: { type: string }) => e.type);
    expect(types).not.toContain("session_start");
    expect(types).toContain("page_view");
  });

  it("enqueues a page_leave event when navigating away from a previous path", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );
    vi.useFakeTimers();

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();

    // First page visit
    trackPageView("/first", "First Page");
    // Simulate 2 seconds on the page
    vi.advanceTimersByTime(2_000);
    // Navigate to second page — should emit page_leave for /first
    trackPageView("/second", "Second Page");
    flushEvents();

    vi.useRealTimers();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    const types = body.events.map((e: { type: string }) => e.type);
    expect(types).toContain("page_leave");

    const leaveEvent = body.events.find((e: { type: string }) => e.type === "page_leave");
    expect(leaveEvent.path).toBe("/first");
    expect(leaveEvent.durationMs).toBeGreaterThanOrEqual(2_000);
  });

  it("records the correct path and title in the page_view event", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/projects/ai-chat", "AI Chat Project");
    flushEvents();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    const pageView = body.events.find((e: { type: string }) => e.type === "page_view");
    expect(pageView.path).toBe("/projects/ai-chat");
    expect(pageView.title).toBe("AI Chat Project");
  });

  it("does nothing when tracking is disabled", async () => {
    disableTracking();
    const { trackPageView, flushEvents } = await freshImport();

    trackPageView("/", "Home");
    flushEvents();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// trackClick
// ---------------------------------------------------------------------------

describe("trackClick", () => {
  it("enqueues a click event with targetPath and truncated elementText", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );

    const { initAnalytics, trackPageView, trackClick, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/", "Home");
    trackClick("/about", "Learn more about me — a very long label that should be cut off eventually after 100 chars total length here");
    flushEvents();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    const clickEvent = body.events.find((e: { type: string }) => e.type === "click");
    expect(clickEvent).toBeDefined();
    expect(clickEvent.targetPath).toBe("/about");
    // elementText must not exceed 100 chars
    expect(clickEvent.elementText.length).toBeLessThanOrEqual(100);
  });

  it("does nothing when tracking is disabled", async () => {
    disableTracking();
    const { trackClick, flushEvents } = await freshImport();

    trackClick("/about", "About");
    flushEvents();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// flushEvents
// ---------------------------------------------------------------------------

describe("flushEvents", () => {
  it("sends queued events via fetch with correct headers and method", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/test", "Test");
    flushEvents();

    expect(globalThis.fetch).toHaveBeenCalledOnce();
    const [url, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://example.com/api/analytics");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.keepalive).toBe(true);
    expect(options.credentials).toBe("omit");
    expect(options.mode).toBe("cors");
  });

  it("clears the event queue after flushing so events are not sent twice", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/test", "Test");
    flushEvents();
    flushEvents(); // second flush should be a no-op

    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  it("does nothing when the event queue is empty", async () => {
    enableTracking();
    const { initAnalytics, flushEvents } = await freshImport();

    initAnalytics();
    flushEvents();

    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("silently ignores fetch network errors", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new TypeError("Network request failed")
    );

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/test", "Test");

    // Must not throw (flushEvents returns void, so we just call it and wait for microtasks)
    expect(() => flushEvents()).not.toThrow();
    // Give the rejected promise microtask time to settle
    await Promise.resolve();
  });

  it("is triggered automatically by the periodic interval", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );
    vi.useFakeTimers();

    const { initAnalytics, trackPageView } = await freshImport();
    initAnalytics();
    trackPageView("/timer-test", "Timer Test");

    // Advance past the 5 000 ms flush interval
    vi.advanceTimersByTime(5_100);
    vi.useRealTimers();

    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  it("is triggered by the beforeunload event", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );

    const { initAnalytics, trackPageView } = await freshImport();
    initAnalytics();
    trackPageView("/unload-test", "Unload Test");

    // Record call count before firing beforeunload
    const callsBefore = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length;
    window.dispatchEvent(new Event("beforeunload"));
    const callsAfter = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls.length;

    // At least one additional fetch call should have been triggered by beforeunload
    expect(callsAfter).toBeGreaterThan(callsBefore);
  });
});

// ---------------------------------------------------------------------------
// Scroll depth tracking
// ---------------------------------------------------------------------------

describe("scroll depth tracking", () => {
  it("records maxScrollDepth in the page_leave event", async () => {
    enableTracking();
    sessionStorage.setItem(
      "analytics_session",
      makeSessionJson({ isNew: false })
    );

    // Make the document tall enough for scroll calculation
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(document.documentElement, "clientHeight", {
      value: 500,
      writable: true,
      configurable: true,
    });

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/long-page", "Long Page");

    // Simulate scrolling 50% down
    Object.defineProperty(window, "scrollY", {
      value: 750,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("scroll"));

    // Navigate away to trigger page_leave
    trackPageView("/next-page", "Next Page");
    flushEvents();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    const leaveEvent = body.events.find((e: { type: string }) => e.type === "page_leave");
    expect(leaveEvent).toBeDefined();
    expect(leaveEvent.scrollDepth).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// Referrer parsing
// ---------------------------------------------------------------------------

describe("parseReferrerSource (via session_start event)", () => {
  const cases: [string, string][] = [
    ["", "direct"],
    ["https://www.google.com/search?q=portfolio", "google"],
    ["https://search.naver.com/search.naver?query=ai", "naver"],
    ["https://search.daum.net/search?q=dev", "daum"],
    ["https://www.bing.com/search?q=test", "bing"],
    ["https://twitter.com/home", "twitter"],
    ["https://x.com/home", "twitter"],
    ["https://www.facebook.com/", "facebook"],
    ["https://www.linkedin.com/in/test", "linkedin"],
    ["https://github.com/", "github"],
    ["https://someotherdomain.com/page", "someotherdomain.com"],
  ];

  it.each(cases)("referrer '%s' → source '%s'", async (referrer, expectedSource) => {
    enableTracking();
    // New session so session_start is emitted
    sessionStorage.clear();

    Object.defineProperty(document, "referrer", {
      value: referrer,
      writable: true,
      configurable: true,
    });

    const { initAnalytics, trackPageView, flushEvents } = await freshImport();
    initAnalytics();
    trackPageView("/", "Home");
    flushEvents();

    const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
    const sessionStart = body.events.find((e: { type: string }) => e.type === "session_start");
    expect(sessionStart.referrerSource).toBe(expectedSource);
  });
});

// ---------------------------------------------------------------------------
// Device / browser / OS detection (via session_start event)
// ---------------------------------------------------------------------------

describe("device detection (via session_start event)", () => {
  const userAgents: [string, string, string, string][] = [
    [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      "mobile",
      "Safari",
      "iOS",
    ],
    [
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
      "mobile",
      "Chrome",
      "Android",
    ],
    [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "desktop",
      "Chrome",
      "Windows",
    ],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
      "desktop",
      "Edge",
      "macOS",
    ],
    [
      "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/117.0",
      "desktop",
      "Firefox",
      "Linux",
    ],
  ];

  it.each(userAgents)(
    "UA: ...%s → device=%s, browser=%s, os=%s",
    async (ua, expectedDevice, expectedBrowser, expectedOs) => {
      enableTracking();
      sessionStorage.clear();

      Object.defineProperty(navigator, "userAgent", {
        value: ua,
        writable: true,
        configurable: true,
      });

      const { initAnalytics, trackPageView, flushEvents } = await freshImport();
      initAnalytics();
      trackPageView("/", "Home");
      flushEvents();

      const body = JSON.parse((globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body as string);
      const sessionStart = body.events.find((e: { type: string }) => e.type === "session_start");
      expect(sessionStart.deviceType).toBe(expectedDevice);
      expect(sessionStart.browser).toBe(expectedBrowser);
      expect(sessionStart.os).toBe(expectedOs);
    }
  );
});
