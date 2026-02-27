"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useEffect, useMemo } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// Placeholder URL used in demo mode so useQuery returns undefined instead of crashing.
// The client never connects — pages detect demo mode via CONVEX_URL and use hardcoded data.
const DEMO_PLACEHOLDER = "https://happy-demo-000.convex.cloud";

/**
 * Catches unhandled promise rejections from @convex-dev/auth token refresh.
 *
 * The auth library internally calls verifyCodeAndSetToken → fetch(convex.cloud/api/action).
 * When the Convex backend is momentarily unreachable (network blip, cold start),
 * this throws TypeError: Failed to fetch as an unhandled rejection.
 * The library retries on its own — we just prevent it from reaching Sentry as noise.
 */
function useConvexAuthErrorHandler() {
  useEffect(() => {
    function handleRejection(e: PromiseRejectionEvent) {
      const msg = e.reason?.message || String(e.reason || "");
      const stack = e.reason?.stack || "";

      // Only suppress Convex auth token-refresh fetch failures
      const isConvexFetch =
        msg.includes("Failed to fetch") &&
        (msg.includes("convex.cloud") ||
          stack.includes("convex-dev/auth") ||
          stack.includes("ConvexHttpClient"));

      if (isConvexFetch) {
        e.preventDefault(); // Stop it reaching Sentry / global error handlers
        console.warn(
          "[ConvexAuth] Token refresh failed (transient network issue, will retry):",
          msg
        );
      }
    }

    window.addEventListener("unhandledrejection", handleRejection);
    return () =>
      window.removeEventListener("unhandledrejection", handleRejection);
  }, []);
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(
    () => new ConvexReactClient(CONVEX_URL || DEMO_PLACEHOLDER),
    []
  );

  // Catch transient auth-refresh failures so they don't pollute Sentry
  useConvexAuthErrorHandler();

  // Demo mode — wrap in plain ConvexProvider (no auth) so useQuery won't crash
  if (!CONVEX_URL) {
    return (
      <ConvexProvider client={client}>
        {children}
      </ConvexProvider>
    );
  }

  return (
    <ConvexAuthProvider client={client}>
      {children}
    </ConvexAuthProvider>
  );
}
