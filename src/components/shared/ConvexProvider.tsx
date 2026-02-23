"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// Placeholder URL used in demo mode so useQuery returns undefined instead of crashing.
// The client never connects — pages detect demo mode via CONVEX_URL and use hardcoded data.
const DEMO_PLACEHOLDER = "https://happy-demo-000.convex.cloud";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const client = useMemo(
    () => new ConvexReactClient(CONVEX_URL || DEMO_PLACEHOLDER),
    []
  );

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
