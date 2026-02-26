"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useRef } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Tracks client-side (SPA) route changes.
 *
 * Uses gtag('event','page_view') — NOT gtag('config') — because
 * gtag('config') re-initialises the tag and implicitly sends a
 * duplicate page_view.
 */
function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!GA_ID) return;

    // The initial page_view is sent by the config script below.
    // Skip the first effect to avoid a duplicate.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window.gtag !== "function") return;

    const url =
      pathname +
      (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  // Listen for first-time consent grant (user clicks Accept in CookieConsent).
  // Returning-user consent is handled by the synchronous <head> script
  // in layout.tsx — it fires before this component even mounts.
  useEffect(() => {
    const handleConsentGranted = () => {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
    };

    window.addEventListener("ratio-consent-granted", handleConsentGranted);
    return () =>
      window.removeEventListener("ratio-consent-granted", handleConsentGranted);
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      {/* 1. Load the gtag.js library */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />

      {/* 2. Configure GA4 + send initial page_view explicitly.
             send_page_view:false prevents config from auto-firing one,
             then we fire our own so we control the timing. */}
      <Script
        id="google-analytics-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer=window.dataLayer||[];
            if(!window.gtag){window.gtag=function(){dataLayer.push(arguments);};}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
              send_page_view: false
            });
            gtag('event', 'page_view', {
              page_path: window.location.pathname,
              page_location: window.location.href,
              page_title: document.title
            });
          `,
        }}
      />

      {/* 3. Track SPA route changes */}
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
    </>
  );
}
