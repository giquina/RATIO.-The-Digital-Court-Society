"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export interface SidebarCounts {
  unreadNotifications: number;
  upcomingSessions: number;
  savedAuthorities: number;
  aiDrafts: number;
}

/**
 * Hook to fetch sidebar badge counts.
 * Uses ts-expect-error because Convex's generated API types with 40+ tables
 * exceed TypeScript's type instantiation depth limit.
 * The query itself works perfectly at runtime.
 */
export function useSidebarCounts(): SidebarCounts | null | undefined {
  // @ts-expect-error — excessive type depth with large Convex schema (40+ tables)
  return useQuery(api.sidebar.getCounts);
}
