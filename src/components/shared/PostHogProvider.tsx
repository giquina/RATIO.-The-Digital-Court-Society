"use client";

import posthog from "posthog-js";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

/**
 * PostHog Product Analytics
 *
 * Initialises PostHog with cookie-consent awareness:
 * - If consent already granted (localStorage), init immediately
 * - If consent not yet given, wait for "ratio-consent-granted" event
 * - Tracks SPA page views on route changes
 *
 * Respects the same cookie consent flow as GA4 (CookieConsent.tsx).
 */

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!POSTHOG_KEY) return;

    // Skip first render — PostHog captures initial pageview on init
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    posthog.capture("$pageview", {
      $current_url: window.location.origin + url,
    });
  }, [pathname, searchParams]);

  return null;
}

function initPostHog() {
  if (typeof window === "undefined" || !POSTHOG_KEY) return;
  if (posthog.__loaded) return; // Already initialised

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: true, // Auto-capture initial page view
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage+cookie",
    loaded: (ph) => {
      // In development, enable debug mode
      if (process.env.NODE_ENV === "development") {
        ph.debug();
      }
    },
  });
}

export function PostHogAnalytics() {
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    // Check if user already consented
    try {
      const consent = localStorage.getItem("ratio-cookie-consent");
      if (consent === "accepted") {
        initPostHog();
      }
    } catch {
      // localStorage unavailable
    }

    // Listen for future consent grants
    const handleConsentGranted = () => {
      initPostHog();
    };

    window.addEventListener("ratio-consent-granted", handleConsentGranted);
    return () =>
      window.removeEventListener("ratio-consent-granted", handleConsentGranted);
  }, []);

  if (!POSTHOG_KEY) return null;

  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
