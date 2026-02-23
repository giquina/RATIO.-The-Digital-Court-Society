"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Scale, Users, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

const tabs = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/sessions", label: "Sessions", Icon: Scale },
  { href: "/law-book", label: "Law Book", Icon: BookOpen },
  { href: "/community", label: "Community", Icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-navy-mid/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.3)] md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex justify-around items-center px-2 pt-2.5 pb-[env(safe-area-inset-bottom,8px)]">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-1 relative min-w-[64px] min-h-[48px] px-2 py-1.5 justify-center active:scale-[0.97] transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2.5 w-6 h-0.5 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <tab.Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.5}
                className={cn(
                  "transition-all duration-200 shrink-0",
                  isActive ? "text-gold" : "text-court-text-sec"
                )}
              />
              <span
                className={cn(
                  "text-court-xs leading-tight font-semibold tracking-wide transition-colors duration-200 text-center",
                  isActive ? "text-gold" : "text-court-text-sec"
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
