"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BottomNav } from "@/components/shared/BottomNav";
import { MobileHeader } from "@/components/shared/MobileHeader";
import { Sidebar } from "@/components/shared/Sidebar";
import { Loader2, AlertTriangle } from "lucide-react";
import { anyApi } from "convex/server";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useSessionStore } from "@/stores/sessionStore";
import { cn } from "@/lib/utils/helpers";
import { RouteErrorBoundary } from "@/components/shared/RouteErrorBoundary";
import { QuerySafeBoundary } from "@/components/shared/QuerySafeBoundary";
import { TheClerk } from "@/components/shared/TheClerk";
import { FeedbackButton } from "@/components/shared/FeedbackButton";
import { OnboardingTour } from "@/components/shared/OnboardingTour";
import { SplashScreen } from "@/components/shared/SplashScreen";

import InstallBanner from "@/components/shared/InstallBanner";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarStore();
  const { isSessionActive } = useSessionStore();
  const pathname = usePathname();

  // Scroll to top on every page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex">
      <QuerySafeBoundary fallback={null}>
        <Sidebar />
      </QuerySafeBoundary>
      <div className={cn(
        "flex-1 min-w-0 flex flex-col md:ml-[72px]",
        !collapsed && "lg:ml-[240px]"
      )}>
        {!isSessionActive && (
          <QuerySafeBoundary fallback={null}>
            <MobileHeader />
          </QuerySafeBoundary>
        )}
        <main className={cn("flex-1 min-w-0", !isSessionActive && "pb-24 md:pb-0")}>
          <RouteErrorBoundary pathname={pathname}>
            {children}
          </RouteErrorBoundary>
        </main>
      </div>
      <BottomNav />
      <TheClerk />
      <FeedbackButton />
      <OnboardingTour />
      {!isSessionActive && <InstallBanner />}
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
  const [loadingTooLong, setLoadingTooLong] = useState(false);

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

  // Detect stuck loading — if profile query stays undefined for >12s, show error
  useEffect(() => {
    if (isAuthenticated && hasProfile === undefined) {
      const timer = setTimeout(() => setLoadingTooLong(true), 12000);
      return () => clearTimeout(timer);
    }
    setLoadingTooLong(false);
  }, [isAuthenticated, hasProfile]);

  if (isLoading || (isAuthenticated && hasProfile === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {loadingTooLong ? (
            <>
              <AlertTriangle size={32} className="text-gold mx-auto mb-3" />
              <p className="text-court-text text-court-base font-bold mb-1">Connection issue</p>
              <p className="text-court-text-sec text-court-sm mb-4">
                Unable to reach the server. Please check your connection.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gold text-navy text-court-base font-bold rounded-xl hover:bg-gold/90 transition-colors"
              >
                Retry
              </button>
            </>
          ) : (
            <>
              <Loader2 size={32} className="text-gold animate-spin mx-auto mb-3" />
              <p className="text-court-text-sec text-court-sm">Loading...</p>
            </>
          )}
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
