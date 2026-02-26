"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Suspense, useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function AnalyticsPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_ID) return;
    if (!(window as any).gtag) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    (window as any).gtag("config", GA_ID, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

export function Analytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Check existing consent on mount
    try {
      if (localStorage.getItem("ratio-cookie-consent") === "accepted") {
        setConsentGranted(true);
      }
    } catch {
      // localStorage unavailable
    }

    // Listen for real-time consent granted (no page reload needed)
    const handler = () => setConsentGranted(true);
    window.addEventListener("ratio-consent-granted", handler);
    return () => window.removeEventListener("ratio-consent-granted", handler);
  }, []);

  if (!GA_ID || !consentGranted) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
    </>
  );
}
