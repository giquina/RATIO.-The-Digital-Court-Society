"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/helpers";

const tabs = [
  { href: "/home", label: "Home", icon: "🏛" },
  { href: "/sessions", label: "Sessions", icon: "⚖️" },
  { href: "/community", label: "Social", icon: "👥" },
  { href: "/library", label: "Library", icon: "📚" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-navy-mid border-t border-court-border">
      <div className="max-w-lg mx-auto flex justify-around items-center px-2 pt-2 pb-7">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-0.5 relative px-3 py-1"
            >
              {isActive && (
                <div className="absolute -top-2 w-5 h-0.5 rounded-full bg-gold" />
              )}
              <span
                className={cn(
                  "text-lg transition-all duration-200",
                  isActive ? "" : "grayscale opacity-35"
                )}
              >
                {tab.icon}
              </span>
              <span
                className={cn(
                  "text-[9px] font-bold tracking-wider",
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
