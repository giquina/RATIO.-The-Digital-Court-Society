"use client";

import { useConvexAuth } from "convex/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Allow onboarding for authenticated users (they just registered)
    if (pathname === "/onboarding") return;
    // If user is already authenticated, redirect to home
    if (!isLoading && isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  return <>{children}</>;
}
