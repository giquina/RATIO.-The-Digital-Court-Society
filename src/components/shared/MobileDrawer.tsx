"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Search, Bookmark, Wrench, Trophy, Landmark,
  FolderOpen, Award, Settings, ClipboardList, User,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";

/**
 * Mobile slide-out drawer — houses every route that doesn't
 * fit in the 5-tab bottom nav.
 *
 * Think of it as the "overflow menu" for mobile users so they
 * can reach Chambers, Tools, Rankings, etc.
 */

// Items grouped the same way as the desktop Sidebar,
// but only the ones NOT already in the bottom nav
// (Home, The Bench, Advocacy, Law Book, Society are in the bottom tabs).
const DRAWER_SECTIONS = [
  {
    label: "Research & Tools",
    items: [
      { href: "/research", label: "Research", icon: Search },
      { href: "/research/saved", label: "Saved Authorities", icon: Bookmark },
      { href: "/tools", label: "Tools", icon: Wrench },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/rankings", label: "Rankings", icon: Trophy },
      { href: "/chambers", label: "Chambers", icon: Landmark },
    ],
  },
  {
    label: "Your Account",
    items: [
      { href: "/profile", label: "Profile", icon: User },
      { href: "/portfolio", label: "Portfolio", icon: FolderOpen },
      { href: "/certificates", label: "Certificates", icon: Award },
      { href: "/cpd", label: "CPD Tracker", icon: ClipboardList },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const pathname = usePathname();

  // Close drawer when the user navigates to a new page
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — tapping it closes the drawer */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={onClose}
          />

          {/* Drawer panel — slides in from the left */}
          <motion.nav
            key="drawer-panel"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="fixed top-0 left-0 bottom-0 z-[81] w-[280px] max-w-[85vw] bg-navy-deep border-r border-court-border flex flex-col"
            role="navigation"
            aria-label="Full navigation menu"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-court-border shrink-0 pt-[env(safe-area-inset-top,0px)]">
              <span className="font-serif text-court-sm text-gold tracking-[0.14em] uppercase font-bold">
                Menu
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full text-court-text-sec hover:text-court-text hover:bg-white/[0.06] transition-colors"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── Nav links ── */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
              {DRAWER_SECTIONS.map((section) => (
                <div key={section.label}>
                  {/* Section heading */}
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-court-text-ter px-3 mb-2">
                    {section.label}
                  </p>

                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = pathname?.startsWith(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                            isActive
                              ? "bg-gold/10 text-gold"
                              : "text-court-text-sec hover:bg-white/[0.04] hover:text-court-text active:bg-white/[0.06]",
                          )}
                        >
                          <Icon
                            size={18}
                            strokeWidth={isActive ? 2.2 : 1.5}
                            className="shrink-0"
                          />
                          <span className="text-court-sm font-semibold">
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 border-t border-court-border px-5 py-3">
              <p className="text-[10px] text-court-text-ter tracking-wide">
                RATIO. — The Digital Court Society
              </p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
