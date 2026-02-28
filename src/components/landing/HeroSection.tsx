"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Scale, ArrowRight } from "lucide-react";

/*
 * HeroSection — the first thing visitors see.
 *
 * If the user is already signed in, we swap the CTAs:
 *   "Join as an Advocate" → "Open Dashboard"
 *   "Sign In" → "Ambassador Programme" (useful for sharing)
 */

export function HeroSection({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 text-center px-4 md:px-6 lg:px-8 pt-16 pb-12 max-w-2xl mx-auto"
    >
      {/* Social proof pill */}
      <div className="inline-flex items-center gap-2 bg-gold-dim border border-gold/20 rounded-full px-4 py-1.5 mb-8">
        <div className="flex -space-x-1.5">
          {["#6B2D3E", "#2E5090", "#3D6B45", "#8B6914"].map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-navy text-court-xs font-bold flex items-center justify-center font-serif text-white/80"
              style={{ background: c, zIndex: 4 - i }}
            >
              {["PS", "JO", "FA", "MW"][i]}
            </div>
          ))}
        </div>
        <span className="text-court-sm text-gold font-semibold">
          142 universities · students and professionals
        </span>
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-court-text leading-[1.1] mb-5">
        The Digital Court Society for the UK Legal Community.
      </h1>

      <p className="text-court-lg text-court-text-sec leading-relaxed max-w-lg mx-auto mb-10">
        AI advocacy training. Live video mooting. Legal research.
        Tournaments. Democratic governance. One platform, from student to silk.
      </p>

      {/* Registration CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
        {isAuthenticated ? (
          <>
            <Link
              href="/home"
              className="w-full sm:w-auto bg-gold text-navy font-bold rounded-xl px-8 py-3.5 text-court-base tracking-wide hover:bg-gold/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Open Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/ambassadors"
              className="w-full sm:w-auto border border-court-border text-court-text-sec font-semibold rounded-xl px-8 py-3.5 text-court-base hover:border-white/10 transition-colors inline-flex items-center justify-center"
            >
              Ambassador Programme
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/register"
              className="w-full sm:w-auto bg-gold text-navy font-bold rounded-xl px-8 py-3.5 text-court-base tracking-wide hover:bg-gold/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Join as an Advocate
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-court-border text-court-text-sec font-semibold rounded-xl px-8 py-3.5 text-court-base hover:border-white/10 transition-colors inline-flex items-center justify-center"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
      <p className="text-court-xs text-court-text-ter mt-4">
        Free for students. Professional plans from £14.99/mo.
      </p>
      <p className="text-court-xs text-court-text-ter mt-1.5 opacity-60">
        No real cases. No legal advice. Just practice.
      </p>
    </motion.section>
  );
}
