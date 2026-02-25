"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Shield, BarChart3, Users, PoundSterling, Activity, ChevronLeft, Brain } from "lucide-react";
import { anyApi } from "convex/server";
import { cn } from "@/lib/utils/helpers";
import Link from "next/link";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

const ADMIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/revenue", label: "Revenue", icon: PoundSterling },
  { href: "/advocates", label: "Advocates", icon: Users },
  { href: "/ai-usage", label: "AI Usage", icon: Brain },
  { href: "/system", label: "System", icon: Activity },
];

function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[240px] fixed inset-y-0 left-0 bg-navy border-r border-court-border z-40">
      {/* Header */}
      <div className="h-16 flex items-center px-5 border-b border-court-border">
        <Shield size={20} className="text-gold mr-2.5" />
        <span className="font-serif text-court-base text-court-text font-bold tracking-wide">
          Admin
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {ADMIN_NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-court text-court-sm transition-colors",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-court-text-sec hover:bg-white/5 hover:text-court-text"
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Back to app */}
      <div className="px-3 py-4 border-t border-court-border">
        <Link
          href="/home"
          className="flex items-center gap-2 px-3 py-2 text-court-text-sec text-court-xs hover:text-court-text transition-colors"
        >
          <ChevronLeft size={14} />
          <span>Back to Ratio</span>
        </Link>
      </div>
    </aside>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-navy">
      <AdminSidebar />
      <div className="flex-1 md:ml-[240px]">
        {/* Mobile header */}
        <header className="md:hidden h-14 flex items-center px-4 border-b border-court-border bg-navy sticky top-0 z-30">
          <Shield size={18} className="text-gold mr-2" />
          <span className="font-serif text-court-sm text-court-text font-bold">Admin</span>
          <Link href="/home" className="ml-auto text-court-text-sec text-court-xs">
            Back
          </Link>
        </header>
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}

function AdminLayoutWithConvex({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const adminRole = useQuery(
    anyApi.admin.getMyAdminRole,
    isAuthenticated ? {} : "skip"
  );
  const [checkedAuth, setCheckedAuth] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Redirect non-admins
  useEffect(() => {
    if (isAuthenticated && adminRole !== undefined) {
      setCheckedAuth(true);
      if (adminRole === null) {
        router.push("/home");
      }
    }
  }, [isAuthenticated, adminRole, router]);

  // Loading state
  if (isLoading || !checkedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="text-center">
          <Loader2 size={32} className="text-gold animate-spin mx-auto mb-3" />
          <p className="text-court-text-sec text-court-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !adminRole) {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  // Demo mode — redirect to home (no admin in demo)
  if (!CONVEX_URL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <p className="text-court-text-sec text-court-sm">Admin not available in demo mode.</p>
      </div>
    );
  }
  return <AdminLayoutWithConvex>{children}</AdminLayoutWithConvex>;
}
