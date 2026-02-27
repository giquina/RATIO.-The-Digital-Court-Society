"use client";

/**
 * PostHog Analytics Provider
 *
 * WHY THIS EXISTS:
 * PostHog gives us deeper product analytics than Vercel Analytics or GA4 —
 * session replays, funnels, feature flags, and user journey tracking.
 * This pairs with our existing analytics stack (Vercel + GA4 + Sentry).
 *
 * HOW IT WORKS:
 * 1. Loads PostHog only when the env var is set (safe for local dev)
 * 2. Starts with cookie-less tracking (respects "declined" users)
 * 3. Upgrades to full tracking when cookie consent is granted
 * 4. Auto-tracks page views on Next.js route changes (SPA navigations)
 *
 * COOKIE CONSENT:
 * Uses the same "ratio-cookie-consent" localStorage key and
 * "ratio-consent-granted" event as GA4 — see CookieConsent.tsx.
 */

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const CONSENT_KEY = "ratio-cookie-consent";

export function PostHogProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialised = useRef(false);

  // ── 1. Initialise PostHog once on mount ────────────────────────────
  useEffect(() => {
    if (!POSTHOG_KEY || initialised.current) return;

    // Check if user already gave consent in a previous session
    let hasConsent = false;
    try {
      hasConsent = localStorage.getItem(CONSENT_KEY) === "accepted";
    } catch {
      // localStorage unavailable — default to no persistence
    }

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,

      // Only persist (cookies/localStorage) if user already consented.
      // Without consent we still get anonymous pageview counts — just
      // no cross-session identity stitching.
      persistence: hasConsent ? "localStorage+cookie" : "memory",

      // We handle pageviews manually below (see effect #3)
      capture_pageview: false,

      // Capture clicks on links and buttons automatically
      autocapture: hasConsent,

      // Don't show PostHog's own survey popups (we have our own)
      disable_surveys: true,

      // Respect Do Not Track browser setting
      respect_dnt: true,

      // Load session replay only with consent (saves bandwidth)
      disable_session_recording: !hasConsent,
    });

    initialised.current = true;
  }, []);

  // ── 2. Listen for consent changes ──────────────────────────────────
  useEffect(() => {
    // When user clicks "Accept" in the cookie banner
    const handleConsentGranted = () => {
      if (!POSTHOG_KEY) return;

      // Upgrade PostHog to use persistent storage
      posthog.set_config({
        persistence: "localStorage+cookie",
        autocapture: true,
        disable_session_recording: false,
      });

      // Opt the user in (enables full tracking)
      posthog.opt_in_capturing();
    };

    window.addEventListener("ratio-consent-granted", handleConsentGranted);
    return () =>
      window.removeEventListener("ratio-consent-granted", handleConsentGranted);
  }, []);

  // ── 2b. Handle consent declined ────────────────────────────────────
  useEffect(() => {
    const handleConsentDeclined = () => {
      if (!POSTHOG_KEY) return;
      posthog.opt_out_capturing();
    };

    window.addEventListener("ratio-consent-declined", handleConsentDeclined);
    return () =>
      window.removeEventListener("ratio-consent-declined", handleConsentDeclined);
  }, []);

  // ── 3. Track SPA page views on route changes ──────────────────────
  useEffect(() => {
    if (!POSTHOG_KEY) return;

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    posthog.capture("$pageview", {
      $current_url: window.location.origin + url,
    });
  }, [pathname, searchParams]);

  // This is a "headless" provider — no visible UI
  return null;
}
