"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";

interface HeroSectionProps {
  email: string;
  setEmail: (email: string) => void;
  submitted: boolean;
  count: number;
  onSubmit: (e: React.FormEvent) => void;
}

export function HeroSection({
  email,
  setEmail,
  submitted,
  count,
  onSubmit,
}: HeroSectionProps) {
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
          {count} Advocates on the waitlist
        </span>
      </div>

      <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-court-text leading-[1.1] mb-5">
        The Digital Constitutional Society for UK Law Students.
      </h1>

      <p className="text-court-lg text-court-text-sec leading-relaxed max-w-lg mx-auto mb-10">
        AI advocacy training. Live video mooting. Legal research.
        Tournaments. Democratic governance. One platform, built for the Bar.
      </p>

      {/* Email Capture */}
      {!submitted ? (
        <form onSubmit={onSubmit} className="max-w-sm mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your university email"
              required
              className="flex-1 bg-navy-card border border-court-border rounded-xl px-4 py-3.5 text-sm text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter"
            />
            <button
              type="submit"
              className="bg-gold text-navy font-bold rounded-xl px-6 py-3.5 text-sm tracking-wide shrink-0 hover:bg-gold/90 transition-colors"
            >
              Join
            </button>
          </div>
          <p className="text-court-xs text-court-text-ter mt-3">
            Free forever. Built for UK law students. Launching March 2026.
          </p>
        </form>
      ) : (
        <div className="max-w-sm mx-auto animate-slide-up">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-5 text-center">
            <Scale size={28} className="text-green-500 mx-auto" />
            <p className="text-sm font-bold text-green-500 mt-2">
              You&apos;re on the list.
            </p>
            <p className="text-xs text-court-text-sec mt-1">
              Advocate #{count}. We&apos;ll notify you at launch.
            </p>
          </div>
        </div>
      )}
    </motion.section>
  );
}
