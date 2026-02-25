"use client";

import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import { DynamicIcon } from "@/components/ui";
import { BADGE_DEFINITIONS } from "@/lib/constants/app";

/*
 * BadgesShowcase — landing page section showing RATIO's badge/achievement system.
 *
 * Think of it like a trophy case at a school — some trophies are shiny
 * (earned), others are dark silhouettes waiting to be won. The "locked"
 * badges create a "collect them all" urge.
 *
 * We import the real BADGE_DEFINITIONS from the app constants so the
 * badge names, icons, and categories stay perfectly in sync with
 * what users see inside the app.
 */

// Which badges appear "earned" in our demo display.
// We pick a realistic mix — a new student who's done a few things.
const DEMO_EARNED = new Set([
  "First Moot",
  "Regular Advocate",
  "7-Day Streak",
  "First Commendation",
  "AI Sparring Partner",
]);

// Additional badges to fill the grid (not in BADGE_DEFINITIONS)
const EXTRA_BADGES = [
  { name: "Tournament Victor", icon: "Trophy", earned: false },
  { name: "Night Owl", icon: "BookOpen", earned: false },
];

export function BadgesShowcase({ id }: { id?: string }) {
  // Combine real definitions with extras for a fuller grid
  const allBadges = [
    ...BADGE_DEFINITIONS.map((b) => ({
      name: b.name,
      icon: b.icon,
      earned: DEMO_EARNED.has(b.name),
    })),
    ...EXTRA_BADGES,
  ];

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative z-10 px-4 md:px-6 lg:px-8 pb-16 max-w-3xl mx-auto"
    >
      {/* Section heading */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-gold" />
          <span className="text-court-xs font-bold tracking-[0.15em] text-gold bg-gold-dim border border-gold/20 rounded px-1.5 py-0.5">
            GAMIFICATION
          </span>
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-court-text mb-3">
          Unlock Distinctions as You Progress
        </h2>
        <p className="text-court-base text-court-text-sec max-w-lg mx-auto">
          Earn badges for milestones like your first moot, 7-day streaks,
          tournament wins, and more. Track your growth and show off your
          achievements.
        </p>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {allBadges.map((badge, i) => (
          <motion.div
            key={badge.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className={`relative bg-navy-card border rounded-court p-3 text-center transition-all group ${
              badge.earned
                ? "border-gold/20 hover:border-gold/40"
                : "border-court-border-light hover:border-white/10"
            }`}
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all ${
                badge.earned
                  ? "bg-gold-dim"
                  : "bg-white/[0.03]"
              }`}
            >
              {badge.earned ? (
                <DynamicIcon name={badge.icon} size={20} className="text-gold" />
              ) : (
                <div className="relative">
                  <DynamicIcon
                    name={badge.icon}
                    size={20}
                    className="text-court-text-ter opacity-30"
                  />
                  <Lock
                    size={10}
                    className="absolute -bottom-0.5 -right-0.5 text-court-text-ter"
                  />
                </div>
              )}
            </div>

            {/* Badge name */}
            <p
              className={`text-court-xs font-bold leading-tight ${
                badge.earned ? "text-court-text" : "text-court-text-ter"
              }`}
            >
              {badge.name}
            </p>

            {/* Earned glow effect */}
            {badge.earned && (
              <div className="absolute inset-0 rounded-court bg-gold/[0.03] pointer-events-none" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary stat */}
      <div className="text-center mt-6">
        <p className="text-court-sm text-court-text-ter">
          <span className="text-gold font-bold">{DEMO_EARNED.size}</span> of{" "}
          {allBadges.length} badges unlocked — keep practising to collect them all
        </p>
      </div>
    </motion.section>
  );
}
