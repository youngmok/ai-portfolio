"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initAnalytics, trackPageView, flushEvents } from "@/lib/analytics";

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const isInitialized = useRef(false);

  // Initialize analytics once on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    initAnalytics();
  }, []);

  // Track page view on every route change (including initial load)
  useEffect(() => {
    if (!isInitialized.current) return;
    trackPageView(pathname, document.title);
  }, [pathname]);

  // Flush remaining events when the page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      flushEvents();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return <>{children}</>;
}
