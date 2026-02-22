import AppLayoutClient from "./layout-client";

// Prevent Next.js from statically prerendering (app) pages at build time.
// All pages under (app) require Convex auth context which is only available at runtime.
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
