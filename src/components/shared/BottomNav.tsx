"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Scale, Users, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

const tabs = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/sessions", label: "Sessions", Icon: Scale },
  { href: "/law-book", label: "Law Book", Icon: BookOpen },
  { href: "/community", label: "Social", Icon: Users },
  { href: "/profile", label: "Profile", Icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-navy-mid/95 backdrop-blur-md border-t border-court-border md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-sm md:max-w-screen-md mx-auto flex justify-around items-center px-2 pt-2 pb-7">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-0.5 relative px-3 py-1"
            >
              {isActive && (
                <div className="absolute -top-2 w-5 h-0.5 rounded-full bg-gold" />
              )}
              <tab.Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={cn(
                  "transition-all duration-200",
                  isActive ? "text-gold" : "text-court-text-ter"
                )}
              />
              <span
                className={cn(
                  "text-court-xs font-bold tracking-wider transition-colors duration-200",
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
