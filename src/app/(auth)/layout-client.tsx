"use client";

import { useConvexAuth } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

/** Routes that authenticated users may still visit during registration flow */
const AUTH_FLOW_ROUTES = ["/onboarding", "/register"];

function AuthLayoutWithConvex({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow onboarding and register for authenticated users (registration flow)
    if (AUTH_FLOW_ROUTES.includes(pathname)) return;
    // If user is already authenticated, redirect to home
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // While auth is hydrating, show a loading state to prevent
  // the login form from flashing before a redirect fires.
  // Exception: onboarding/register always render immediately.
  if (isLoading && !AUTH_FLOW_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="text-gold animate-spin" />
      </div>
    );
  }

  // Auth resolved and user is authenticated — redirect is happening,
  // don't render the login form underneath.
  if (isAuthenticated && !AUTH_FLOW_ROUTES.includes(pathname)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="text-gold animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

export default function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  // Demo mode — no Convex backend, skip auth checks
  if (!CONVEX_URL) {
    return <>{children}</>;
  }
  return <AuthLayoutWithConvex>{children}</AuthLayoutWithConvex>;
}
