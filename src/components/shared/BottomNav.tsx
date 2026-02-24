"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Scale, Users, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils/helpers";

const tabs = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/sessions", label: "Sessions", Icon: Scale },
  { href: "/ai-practice", label: "AI Practice", Icon: Target, center: true },
  { href: "/law-book", label: "Law Book", Icon: BookOpen },
  { href: "/community", label: "Society", Icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-navy-mid/95 backdrop-blur-xl border-t border-court-border md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex items-end px-1 pt-2 pb-[max(env(safe-area-inset-bottom,0px),6px)]">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          const isCenter = "center" in tab && tab.center;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 relative min-h-[48px] py-1.5 justify-end active:scale-[0.97] transition-transform"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2 w-6 h-0.5 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              {isCenter ? (
                <div className={cn(
                  "w-10 h-10 -mt-4 rounded-full flex items-center justify-center transition-all duration-200",
                  isActive
                    ? "bg-gold text-navy-deep shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                    : "bg-gold/15 text-gold border border-gold/30"
                )}>
                  <tab.Icon size={20} strokeWidth={2} />
                </div>
              ) : (
                <tab.Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    "transition-all duration-200 shrink-0",
                    isActive ? "text-gold" : "text-court-text-sec"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-[10px] leading-tight font-semibold tracking-wide transition-colors duration-200 text-center",
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
