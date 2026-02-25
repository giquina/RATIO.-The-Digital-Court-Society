import AdminLayoutClient from "./layout-client";

// Prevent Next.js from statically prerendering admin pages at build time.
// Admin pages require Convex auth context which is only available at runtime.
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
