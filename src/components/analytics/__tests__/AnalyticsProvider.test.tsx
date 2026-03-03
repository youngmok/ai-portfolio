/**
 * Integration tests for src/components/analytics/AnalyticsProvider.tsx
 *
 * Strategy:
 *  - next/navigation is resolved to src/__mocks__/next/navigation.ts via
 *    the alias in vitest.config.ts, so usePathname is a vi.fn().
 *  - All three analytics functions (initAnalytics, trackPageView, flushEvents)
 *    are mocked at the module level so this suite stays focused on the
 *    Provider's React behaviour (mount, route changes, unmount).
 *  - React is rendered into a real jsdom DOM tree without @testing-library;
 *    we use ReactDOM.createRoot directly and wrap assertions in
 *    act() to flush effects.
 */

import React from "react";
import * as ReactDOM from "react-dom/client";
import { act } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Mock analytics module
// ---------------------------------------------------------------------------

vi.mock("@/lib/analytics", () => ({
  initAnalytics: vi.fn(),
  trackPageView: vi.fn(),
  flushEvents: vi.fn(),
}));

// Import mocked functions for assertion
import { initAnalytics, trackPageView, flushEvents } from "@/lib/analytics";

// Import the component AFTER mocks are set up
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";

// ---------------------------------------------------------------------------
// DOM container helpers
// ---------------------------------------------------------------------------

let container: HTMLDivElement;
let root: ReactDOM.Root;

function renderProvider(pathname: string) {
  vi.mocked(usePathname).mockReturnValue(pathname);
  act(() => {
    root.render(
      <AnalyticsProvider>
        <span data-testid="child">child</span>
      </AnalyticsProvider>
    );
  });
}

function unmountProvider() {
  act(() => {
    root.unmount();
  });
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = ReactDOM.createRoot(container);

  // Ensure a clean mock state before every test
  vi.mocked(initAnalytics).mockClear();
  vi.mocked(trackPageView).mockClear();
  vi.mocked(flushEvents).mockClear();
  vi.mocked(usePathname).mockReturnValue("/");
});

afterEach(() => {
  // Unmount silently if still mounted
  try {
    act(() => {
      root.unmount();
    });
  } catch {
    // already unmounted — ignore
  }
  container.remove();
});

// ---------------------------------------------------------------------------
// Mount behaviour
// ---------------------------------------------------------------------------

describe("AnalyticsProvider — mount", () => {
  it("renders children without crashing", () => {
    renderProvider("/");
    expect(container.querySelector("[data-testid='child']")).not.toBeNull();
  });

  it("calls initAnalytics exactly once on mount", () => {
    renderProvider("/");
    expect(initAnalytics).toHaveBeenCalledOnce();
  });

  it("does NOT call initAnalytics again on re-render with same pathname", () => {
    renderProvider("/");
    renderProvider("/"); // re-render — isInitialized.current is true
    expect(initAnalytics).toHaveBeenCalledOnce();
  });

  it("calls trackPageView on initial mount with the current pathname", () => {
    renderProvider("/blog");
    // trackPageView is gated on isInitialized.current being true;
    // the init effect and the pathname effect run in order
    expect(trackPageView).toHaveBeenCalledWith("/blog", expect.any(String));
  });
});

// ---------------------------------------------------------------------------
// Route change behaviour
// ---------------------------------------------------------------------------

describe("AnalyticsProvider — route changes", () => {
  it("calls trackPageView again when pathname changes", () => {
    renderProvider("/");
    vi.mocked(trackPageView).mockClear();

    // Simulate navigation: Next.js updates the pathname returned by usePathname
    renderProvider("/about");

    expect(trackPageView).toHaveBeenCalledWith("/about", expect.any(String));
    expect(trackPageView).toHaveBeenCalledOnce();
  });

  it("calls trackPageView for every distinct route change", () => {
    renderProvider("/");
    renderProvider("/projects");
    renderProvider("/blog");

    // Each render with a new pathname triggers the pathname effect
    const calls = vi.mocked(trackPageView).mock.calls.map((c) => c[0]);
    expect(calls).toContain("/projects");
    expect(calls).toContain("/blog");
  });

  it("does NOT call trackPageView when pathname remains unchanged", () => {
    renderProvider("/career");
    const callsAfterFirst = vi.mocked(trackPageView).mock.calls.length;

    // Re-render with identical pathname — React batches the same value
    vi.mocked(usePathname).mockReturnValue("/career");
    act(() => {
      root.render(
        <AnalyticsProvider>
          <span />
        </AnalyticsProvider>
      );
    });

    expect(vi.mocked(trackPageView).mock.calls.length).toBe(callsAfterFirst);
  });
});

// ---------------------------------------------------------------------------
// Unmount / beforeunload behaviour
// ---------------------------------------------------------------------------

describe("AnalyticsProvider — unmount and flush", () => {
  it("registers a beforeunload listener on mount", () => {
    const addEventSpy = vi.spyOn(window, "addEventListener");
    renderProvider("/");

    const unloadCalls = addEventSpy.mock.calls.filter(([evt]) => evt === "beforeunload");
    expect(unloadCalls.length).toBeGreaterThanOrEqual(1);

    addEventSpy.mockRestore();
  });

  it("removes the beforeunload listener on unmount (no memory leak)", () => {
    const removeEventSpy = vi.spyOn(window, "removeEventListener");
    renderProvider("/");
    unmountProvider();

    const unloadRemovals = removeEventSpy.mock.calls.filter(([evt]) => evt === "beforeunload");
    expect(unloadRemovals.length).toBeGreaterThanOrEqual(1);

    removeEventSpy.mockRestore();
  });

  it("calls flushEvents when beforeunload fires", () => {
    renderProvider("/");
    window.dispatchEvent(new Event("beforeunload"));

    expect(flushEvents).toHaveBeenCalledOnce();
  });

  it("does NOT call flushEvents on unmount itself (only on beforeunload)", () => {
    renderProvider("/");
    vi.mocked(flushEvents).mockClear();

    unmountProvider();

    // flushEvents should NOT have been called by the cleanup of the useEffect,
    // only the beforeunload listener triggers it
    expect(flushEvents).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Children passthrough
// ---------------------------------------------------------------------------

describe("AnalyticsProvider — children", () => {
  it("renders nested children correctly", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    act(() => {
      root.render(
        <AnalyticsProvider>
          <main>
            <h1>Title</h1>
            <p>Paragraph</p>
          </main>
        </AnalyticsProvider>
      );
    });

    expect(container.querySelector("h1")?.textContent).toBe("Title");
    expect(container.querySelector("p")?.textContent).toBe("Paragraph");
  });

  it("renders multiple children without a wrapper element", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    act(() => {
      root.render(
        <AnalyticsProvider>
          <div id="a" />
          <div id="b" />
        </AnalyticsProvider>
      );
    });

    // AnalyticsProvider returns <>{children}</>, so no extra wrapper div
    expect(container.querySelector("#a")).not.toBeNull();
    expect(container.querySelector("#b")).not.toBeNull();
  });
});
