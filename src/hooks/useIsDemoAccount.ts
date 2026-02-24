"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";

/**
 * Returns true if the currently logged-in user is the demo account.
 * We detect this by checking if the profile displayName is "Demo Advocate".
 * This is used to show realistic mock data on pages that would otherwise be empty.
 */
export function useIsDemoAccount(): boolean {
  const profile: any = useQuery(anyApi.users.myProfile);
  if (!profile) return false;
  return (
    profile.displayName === "Demo Advocate" ||
    profile.email === "demo@ratio.law"
  );
}
