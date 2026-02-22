"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scale, Users, BookOpen, User, Search } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { useSidebarCounts } from "@/lib/hooks/useSidebarCounts";

const tabs = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/sessions", label: "Sessions", Icon: Scale },
  { href: "/law-book", label: "Law Book", Icon: BookOpen },
  { href: "/research", label: "Research", Icon: Search },
  { href: "/community", label: "Social", Icon: Users },
  { href: "/profile", label: "Profile", Icon: User, showNotifDot: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const counts = useSidebarCounts();
  const hasUnread = (counts?.unreadNotifications ?? 0) > 0;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-navy-mid/95 backdrop-blur-md border-t border-court-border md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex justify-around items-center px-1 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-0.5 relative min-w-[48px] min-h-[44px] px-1.5 py-1.5 justify-center active:scale-95 transition-transform"
            >
              {isActive && (
                <div className="absolute -top-2 w-5 h-0.5 rounded-full bg-gold" />
              )}
              <div className="relative">
                <tab.Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    "transition-all duration-200 shrink-0",
                    isActive ? "text-gold" : "text-court-text-ter"
                  )}
                />
                {tab.showNotifDot && hasUnread && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-gold" aria-label="Unread notifications" />
                )}
              </div>
              <span
                className={cn(
                  "text-[9px] leading-tight font-semibold tracking-wide transition-colors duration-200 text-center",
                  isActive ? "text-gold" : "text-court-text-ter"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
