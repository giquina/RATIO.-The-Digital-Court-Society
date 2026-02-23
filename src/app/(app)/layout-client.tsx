"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { BottomNav } from "@/components/shared/BottomNav";
import { Sidebar } from "@/components/shared/Sidebar";
import { Loader2 } from "lucide-react";
import { anyApi } from "convex/server";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils/helpers";
import { TheClerk } from "@/components/shared/TheClerk";
import { SplashScreen } from "@/components/shared/SplashScreen";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarStore();
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className={cn(
        "flex-1 pb-20 md:pb-0 md:ml-[72px]",
        !collapsed && "lg:ml-[240px]"
      )}>
        {children}
      </main>
      <BottomNav />
      <TheClerk />
    </div>
  );
}

function AppLayoutWithConvex({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasProfile = useQuery(
    anyApi.users.hasProfile,
    isAuthenticated ? {} : "skip"
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router]);

  // Redirect to onboarding if authenticated but no profile
  useEffect(() => {
    if (isAuthenticated && hasProfile === false) {
      router.push("/onboarding");
    }
  }, [isAuthenticated, hasProfile, router]);

  if (isLoading || (isAuthenticated && hasProfile === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="text-gold animate-spin mx-auto mb-3" />
          <p className="text-court-text-sec text-court-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  // Demo mode — no Convex backend, render app shell directly
  if (!CONVEX_URL) {
    return (
      <SplashScreen>
        <AppShell>{children}</AppShell>
      </SplashScreen>
    );
  }
  return (
    <SplashScreen>
      <AppLayoutWithConvex>{children}</AppLayoutWithConvex>
    </SplashScreen>
  );
}
