"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Scale, Users, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { useSessionStore } from "@/stores/sessionStore";

const tabs = [
  { href: "/home", label: "Home", Icon: Home },
  { href: "/sessions", label: "Sessions", Icon: Scale },
  { href: "/ai-practice", label: "AI Practice", Icon: Target },
  { href: "/law-book", label: "Law Book", Icon: BookOpen },
  { href: "/society", label: "Society", Icon: Users },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isSessionActive } = useSessionStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-navy-mid/95 backdrop-blur-xl border-t border-court-border md:hidden"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex px-1 pt-2 pb-[max(env(safe-area-inset-bottom,0px),6px)]">
        {tabs.map((tab) => {
          const isActive = pathname?.startsWith(tab.href);
          const isAIPractice = tab.href === "/ai-practice";
          const showLiveDot = isAIPractice && isSessionActive;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className="flex-1 flex flex-col items-center gap-0.5 relative min-h-[48px] py-1.5 justify-center active:scale-[0.97] transition-transform"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-2 w-6 h-0.5 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              {/* Icon wrapper — relative so the live dot can sit on top */}
              <div className="relative">
                <tab.Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className={cn(
                    "transition-all duration-200 shrink-0",
                    isActive
                      ? showLiveDot ? "text-red-400" : "text-gold"
                      : showLiveDot ? "text-red-400/70" : "text-court-text-sec"
                  )}
                />

                {/* Pulsing red "live" dot — like a recording indicator */}
                {showLiveDot && (
                  <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                )}
              </div>

              <span
                className={cn(
                  "text-[10px] leading-tight font-semibold tracking-wide transition-colors duration-200 text-center",
                  isActive
                    ? showLiveDot ? "text-red-400" : "text-gold"
                    : showLiveDot ? "text-red-400/70" : "text-court-text-sec"
                )}
              >
                {showLiveDot ? "LIVE" : tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
