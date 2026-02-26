import LandingPageClient from "./page-client";

// Prevent Next.js from statically prerendering the landing page at build time.
// The page uses useConvexAuth() to show auth-aware UI, which requires the
// ConvexAuthProvider — only available at runtime.
export const dynamic = "force-dynamic";

export default function LandingPage() {
  return <LandingPageClient />;
}
