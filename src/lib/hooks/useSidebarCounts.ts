"use client";

import { anyApi } from "convex/server";
import { useDemoQuery } from "@/hooks/useDemoSafe";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export interface SidebarCounts {
  unreadNotifications: number;
  upcomingSessions: number;
  savedAuthorities: number;
  mootDrafts: number;
}

const DEMO_COUNTS: SidebarCounts = {
  unreadNotifications: 3,
  upcomingSessions: 2,
  savedAuthorities: 5,
  mootDrafts: 1,
};

/**
 * Hook to fetch sidebar badge counts.
 * Returns demo data when no Convex backend is configured.
 */
export function useSidebarCounts(): SidebarCounts | null | undefined {
  const convexCounts = useDemoQuery(anyApi.sidebar.getCounts);
  if (!CONVEX_URL) return DEMO_COUNTS;
  return convexCounts as SidebarCounts | null | undefined;
}
