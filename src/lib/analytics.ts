/**
 * Client-side analytics tracker
 * - No PII collected (no IP, no cookies)
 * - Disabled when NEXT_PUBLIC_ANALYTICS_URL is not set
 * - Disabled when analytics_optout exists in localStorage
 * - Disabled when navigator.webdriver is true (bot filtering)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DeviceType = "desktop" | "tablet" | "mobile";

export interface AnalyticsEvent {
  type: "page_view" | "page_leave" | "click" | "session_start";
  fingerprint: string;
  sessionId: string;
  path: string;
  title?: string;
  referrerSource?: string;
  referrerUrl?: string;
  timestamp: string;
  // session_start fields (device info)
  deviceType?: DeviceType;
  browser?: string;
  os?: string;
  screenSize?: string;
  // page_leave fields
  durationMs?: number;
  scrollDepth?: number;
  // click fields
  targetPath?: string;
  elementText?: string;
}

interface SessionData {
  sessionId: string;
  lastActive: number;
  isNew: boolean; // true if session_start not yet sent
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const FLUSH_INTERVAL_MS = 5_000;
const SESSION_KEY = "analytics_session";
const OPTOUT_KEY = "analytics_optout";

// ---------------------------------------------------------------------------
// Module-level state
// ---------------------------------------------------------------------------

let eventQueue: AnalyticsEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;
let pageEnterTime = 0;
let maxScrollDepth = 0;
let currentPath = "";
let fingerprint = "";
let initialized = false;

// ---------------------------------------------------------------------------
// Simple hash function (djb2 — no crypto dependency, < 2 KB budget)
// ---------------------------------------------------------------------------

function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // keep as unsigned 32-bit
  }
  return hash.toString(16).padStart(8, "0");
}

// ---------------------------------------------------------------------------
// Visitor fingerprint
// ---------------------------------------------------------------------------

function generateFingerprint(): string {
  const { screen, navigator } = window;
  const raw = [
    screen.width,
    screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    navigator.userAgent,
  ].join("|");
  return djb2Hash(raw);
}

// ---------------------------------------------------------------------------
// UUID v4 (crypto.getRandomValues — available in all modern browsers)
// ---------------------------------------------------------------------------

function uuidV4(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// ---------------------------------------------------------------------------
// Session management (sessionStorage)
// ---------------------------------------------------------------------------

function getOrCreateSession(): SessionData {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const data: SessionData = JSON.parse(raw);
      const now = Date.now();
      if (now - data.lastActive < SESSION_TIMEOUT_MS) {
        data.lastActive = now;
        data.isNew = false;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // sessionStorage may be unavailable (private browsing edge cases)
  }

  const newSession: SessionData = {
    sessionId: uuidV4(),
    lastActive: Date.now(),
    isNew: true,
  };

  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  } catch {
    // ignore write errors
  }

  return newSession;
}

function touchSession(): void {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const data: SessionData = JSON.parse(raw);
      data.lastActive = Date.now();
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    }
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Device detection
// ---------------------------------------------------------------------------

function detectDeviceType(): DeviceType {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPod/i.test(ua)) return "mobile";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\//i.test(ua)) return "Opera";
  if (/Chrome\//i.test(ua)) return "Chrome";
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return "Safari";
  if (/AppleWebKit/i.test(ua) && /Mobile/i.test(ua)) return "Safari";
  if (/Firefox\//i.test(ua)) return "Firefox";
  return "Unknown";
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "Windows";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Android/i.test(ua)) return "Android";
  if (/iOS|iPhone|iPad/i.test(ua)) return "iOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Unknown";
}

// ---------------------------------------------------------------------------
// Referrer parsing
// ---------------------------------------------------------------------------

function parseReferrerSource(referrer: string): string {
  if (!referrer) return "direct";
  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();
    if (host.includes("google")) return "google";
    if (host.includes("naver")) return "naver";
    if (host.includes("daum")) return "daum";
    if (host.includes("bing")) return "bing";
    if (host.includes("twitter") || host.includes("x.com")) return "twitter";
    if (host.includes("facebook") || host.includes("fb.com")) return "facebook";
    if (host.includes("linkedin")) return "linkedin";
    if (host.includes("github")) return "github";
    return host;
  } catch {
    return "unknown";
  }
}

// ---------------------------------------------------------------------------
// Guard: should we track?
// ---------------------------------------------------------------------------

function isTrackingEnabled(): boolean {
  if (typeof window === "undefined") return false;

  const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_URL;
  if (!analyticsUrl) return false;

  // Bot filter
  if (navigator.webdriver) return false;

  // Opt-out check
  try {
    if (localStorage.getItem(OPTOUT_KEY) !== null) return false;
  } catch {
    // localStorage unavailable — allow tracking
  }

  return true;
}

// ---------------------------------------------------------------------------
// Event builders
// ---------------------------------------------------------------------------

function buildSessionStartEvent(sessionId: string): AnalyticsEvent {
  const referrer = document.referrer ?? "";
  return {
    type: "session_start",
    fingerprint,
    sessionId,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    referrerSource: parseReferrerSource(referrer),
    referrerUrl: referrer || undefined,
    deviceType: detectDeviceType(),
    browser: detectBrowser(),
    os: detectOS(),
    screenSize: `${window.screen.width}x${window.screen.height}`,
  };
}

function buildPageEvent(
  type: "page_view" | "page_leave",
  path: string,
  title: string,
  sessionId: string
): AnalyticsEvent {
  return {
    type,
    fingerprint,
    sessionId,
    path,
    title,
    timestamp: new Date().toISOString(),
  };
}

function buildClickEvent(
  path: string,
  title: string,
  sessionId: string,
  targetPath: string,
  elementText: string
): AnalyticsEvent {
  return {
    type: "click",
    fingerprint,
    sessionId,
    path,
    title,
    timestamp: new Date().toISOString(),
    targetPath,
    elementText: elementText.slice(0, 100),
  };
}

// ---------------------------------------------------------------------------
// Flush / send
// ---------------------------------------------------------------------------

export function flushEvents(): void {
  if (!isTrackingEnabled()) return;
  if (eventQueue.length === 0) return;

  const analyticsUrl = process.env.NEXT_PUBLIC_ANALYTICS_URL!;
  const payload = JSON.stringify({ events: eventQueue });
  eventQueue = [];

  // Use fetch with keepalive (survives page unload like sendBeacon)
  // credentials: "omit" avoids CORS issues with wildcard origins
  fetch(analyticsUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
    credentials: "omit",
    mode: "cors",
  }).catch(() => {
    // Silently ignore network errors
  });
}

function enqueue(event: AnalyticsEvent): void {
  eventQueue.push(event);
  touchSession();
}

// ---------------------------------------------------------------------------
// Scroll depth tracking
// ---------------------------------------------------------------------------

function handleScroll(): void {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight =
    document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (docHeight <= 0) return;
  const depth = Math.min(100, Math.round((scrollTop / docHeight) * 100));
  if (depth > maxScrollDepth) maxScrollDepth = depth;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function initAnalytics(): void {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (!isTrackingEnabled()) return;

  initialized = true;
  fingerprint = generateFingerprint();

  // Scroll depth listener
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Periodic flush
  flushTimer = setInterval(() => {
    flushEvents();
  }, FLUSH_INTERVAL_MS);

  // beforeunload — flush remaining events
  window.addEventListener("beforeunload", () => {
    flushEvents();
  });
}

export function trackPageView(path: string, title: string): void {
  if (!isTrackingEnabled()) return;

  const session = getOrCreateSession();

  // Emit session_start for new sessions
  if (session.isNew) {
    enqueue(buildSessionStartEvent(session.sessionId));
    // Mark session as no longer new
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const data: SessionData = JSON.parse(raw);
        data.isNew = false;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
      }
    } catch {
      // ignore
    }
  }

  // Emit page_leave for the previous page
  if (currentPath && pageEnterTime > 0) {
    const leaveEvent = buildPageEvent("page_leave", currentPath, document.title, session.sessionId);
    leaveEvent.durationMs = Date.now() - pageEnterTime;
    leaveEvent.scrollDepth = maxScrollDepth;
    enqueue(leaveEvent);
  }

  // Reset per-page state
  currentPath = path;
  pageEnterTime = Date.now();
  maxScrollDepth = 0;

  const event = buildPageEvent("page_view", path, title, session.sessionId);
  enqueue(event);
}

export function trackClick(targetPath: string, elementText: string): void {
  if (!isTrackingEnabled()) return;

  const session = getOrCreateSession();
  const event = buildClickEvent(currentPath, document.title, session.sessionId, targetPath, elementText);
  enqueue(event);
}
