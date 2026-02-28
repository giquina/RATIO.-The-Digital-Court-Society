"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, Info } from "lucide-react";
import { useClerkStore } from "@/stores/clerkStore";
import { ClerkQuickHelp } from "./ClerkQuickHelp";
import { ClerkGlossary } from "./ClerkGlossary";
import { ClerkGuideMe } from "./ClerkGuideMe";

const TABS = [
  { id: "help" as const, label: "Quick Help" },
  { id: "glossary" as const, label: "Glossary" },
  { id: "guide" as const, label: "Guide Me" },
];

export function TheClerk() {
  const { isOpen, activeTab, open, close, setTab } = useClerkStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Hide on moot court page — the session UI needs the full screen
  const isMootCourt = pathname?.startsWith("/moot-court");

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  if (isMootCourt) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => open()}
            data-tour="clerk-button"
            className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-[70] h-11 px-3.5 rounded-full bg-navy-card border border-court-border hover:border-gold/30 flex items-center gap-1.5 transition-colors duration-200 shadow-lg"
            aria-label="Open The Clerk help panel"
            aria-expanded={false}
          >
            <Scale size={16} className="text-gold" />
            <span className="text-court-xs font-semibold text-court-text-sec">Clerk</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 inset-x-4 mx-auto md:inset-x-auto md:right-6 md:bottom-6 md:w-[340px] md:mx-0 z-[70] max-w-[340px] max-h-[70vh] bg-[#131E30]/[0.98] backdrop-blur-xl border border-court-border rounded-court shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-court-border shrink-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Scale size={18} className="text-gold shrink-0" />
                  <h2 className="font-serif text-base font-bold text-court-text">The Clerk</h2>
                </div>
                <p className="text-court-xs text-court-text-ter mt-0.5 ml-[26px]">Your guide to navigating the Court</p>
              </div>
              <button onClick={close} className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors shrink-0" aria-label="Close help panel">
                <X size={18} className="text-court-text-ter" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-court-border shrink-0" role="tablist" aria-label="Clerk help sections">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  aria-selected={activeTab === tab.id}
                  role="tab"
                  className={`flex-1 min-h-[44px] py-2.5 text-court-sm font-semibold tracking-wide transition-colors relative ${
                    activeTab === tab.id ? "text-gold" : "text-court-text-ter hover:text-court-text-sec"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div layoutId="clerk-tab-indicator" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gold rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide" role="tabpanel" aria-label={`${activeTab} content`}>
              {activeTab === "help" && <ClerkQuickHelp />}
              {activeTab === "glossary" && <ClerkGlossary />}
              {activeTab === "guide" && <ClerkGuideMe />}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-court-border shrink-0 flex items-start gap-1.5">
              <Info size={11} className="text-court-text-ter shrink-0 mt-0.5" />
              <p className="text-court-xs leading-tight text-court-text-ter">Platform guidance powered by UK legal sources. Verify with primary authorities.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
