"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";

/**
 * Returns true if the currently logged-in user is the demo account.
 *
 * Checks the `handle` field first (URL slug "demo-advocate") because it's
 * a stable identifier unlikely to be casually renamed. Falls back to
 * checking `fullName` in case handle is missing.
 */
export function useIsDemoAccount(): boolean {
  const profile: any = useQuery(anyApi.users.myProfile);
  if (!profile) return false;
  return profile.handle === "demo-advocate" || profile.fullName === "Demo Advocate";
}
