"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

/*
 * FloatingActions — two floating buttons for the landing page:
 *
 * 1. "Join Free" pill — appears after the user scrolls past the hero.
 *    Think of it as a gentle sticky note that follows you down the page.
 *    If the user is already signed in, it shows "Dashboard" instead.
 *
 * 2. "Back to Top" circle — appears after significant scrolling.
 *    Smoothly scrolls back to the top when clicked.
 *
 * Both fade in/out so they don't feel jarring.
 */

interface FloatingActionsProps {
  isAuthenticated?: boolean;
}

export function FloatingActions({ isAuthenticated = false }: FloatingActionsProps) {
  const [showJoin, setShowJoin] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show "Join" after scrolling past ~600px (roughly past the hero)
      setShowJoin(window.scrollY > 600);
      // Show "Back to Top" after scrolling past ~2000px (deep in the page)
      setShowTop(window.scrollY > 2000);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating "Join Free" / "Dashboard" pill */}
      <div
        className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          showJoin ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <Link
          href={isAuthenticated ? "/home" : "/register"}
          className="bg-gold text-navy font-bold rounded-full px-6 py-2.5 text-court-sm tracking-wide shadow-lg shadow-gold/20 hover:bg-gold/90 transition-colors inline-flex items-center gap-2"
        >
          {isAuthenticated ? "Go to Dashboard" : "Join Free"}
        </Link>
      </div>

      {/* Back to Top button — offset right to avoid overlap with Usher bubble */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-[4.5rem] z-50 w-10 h-10 rounded-full bg-navy-card border border-court-border-light flex items-center justify-center text-court-text-sec hover:text-gold hover:border-gold/30 transition-all duration-300 ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp size={16} />
      </button>
    </>
  );
}
