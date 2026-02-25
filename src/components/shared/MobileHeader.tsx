"use client";

import Link from "next/link";
import { anyApi } from "convex/server";
import { Scale, Search, Bell } from "lucide-react";
import { Avatar, Skeleton } from "@/components/ui";
import { useSidebarCounts } from "@/lib/hooks/useSidebarCounts";
import { useDemoQuery } from "@/hooks/useDemoSafe";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

/**
 * Shared mobile-only sticky header.
 * Shows brand + university on the left, notification bell + profile avatar on the right.
 * Hidden on md+ where the Sidebar provides navigation chrome.
 */
export function MobileHeader() {
  const convexProfile = useDemoQuery(anyApi.users.myProfile);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = CONVEX_URL ? convexProfile : { fullName: "Demo Advocate", chamber: "Gray's", universityShort: "Demo Uni" };
  const isLoading = CONVEX_URL && profile === undefined;

  const counts = useSidebarCounts();
  const unreadCount = counts?.unreadNotifications ?? 0;

  const initials = profile?.fullName
    ? profile.fullName.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <header className="sticky top-0 z-40 md:hidden bg-navy-mid/95 backdrop-blur-xl border-b border-court-border pt-[env(safe-area-inset-top,0px)]">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left: Brand + university */}
        <div className="flex items-center gap-2 min-w-0">
          <Scale size={18} className="text-gold shrink-0" />
          <div className="min-w-0">
            <span className="font-serif text-court-sm text-gold tracking-[0.14em] uppercase font-bold">
              RATIO<span className="text-gold">.</span>
            </span>
            {isLoading ? (
              <Skeleton className="w-20 h-2.5 mt-0.5" />
            ) : profile?.universityShort ? (
              <p className="text-[10px] text-court-text-ter truncate leading-tight">
                {profile.universityShort}
              </p>
            ) : null}
          </div>
        </div>

        {/* Right: Search + Bell + Avatar */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/research"
            aria-label="Search"
            className="w-11 h-11 flex items-center justify-center active:scale-95 transition-transform"
          >
            <Search size={18} className="text-court-text-sec" />
          </Link>
          <Link
            href="/notifications"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            className="relative w-11 h-11 rounded-full bg-gold-dim flex items-center justify-center active:scale-95 transition-transform"
          >
            <Bell size={18} className="text-gold" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
          <Link href="/profile" aria-label="View profile" className="w-11 h-11 flex items-center justify-center active:scale-95 transition-transform">
            {isLoading ? (
              <Skeleton rounded className="w-8 h-8" />
            ) : (
              <Avatar initials={initials} chamber={profile?.chamber} size="sm" border />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
