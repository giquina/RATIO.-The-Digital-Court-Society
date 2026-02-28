"use client";

import { motion } from "framer-motion";
import { Shield, Users, Trophy, Crown } from "lucide-react";

// Animated SVG crest that draws itself on mount
// Uses motion.path with pathLength animation
// Shows:
// 1. Animated heraldic shield outline (SVG pathLength draw-on, gold stroke, 2s duration)
// 2. Chamber name in serif font below
// 3. "Ranked #1 of 4" stat
// 4. Member count with animated counter (using motion.span)
// 5. Chamber motto in italic serif
// 6. 6 floating gold particles drifting upward (staggered)

export default function ChambersPanel() {
  // The shield SVG: a classic heraldic shield shape
  const shieldPath = "M50 5 L95 25 L95 55 Q95 85 50 98 Q5 85 5 55 L5 25 Z";

  // Gold particles
  const particles = Array.from({ length: 6 }, (_, i) => ({
    x: 20 + Math.random() * 60,
    delay: i * 0.8,
    duration: 4 + Math.random() * 3,
  }));

  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-gold/15"
          initial={{ y: "100%", x: `${p.x}%`, opacity: 0 }}
          animate={{ y: "-20%", opacity: [0, 0.6, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Glow ring behind shield */}
      <motion.div
        className="absolute w-32 h-32 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)" }}
        animate={{ scale: [0.8, 1.2, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated shield crest */}
      <svg viewBox="0 0 100 103" className="w-24 h-24 mb-6">
        <motion.path
          d={shieldPath}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          stroke="#C9A84C"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* Inner cross decoration */}
        <motion.path
          d="M50 30 L50 75 M30 50 L70 50"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 1.5, delay: 2, ease: "easeInOut" }}
          stroke="#C9A84C"
          strokeWidth={1}
          fill="none"
        />
      </svg>

      {/* Chamber name */}
      <motion.h3
        className="font-serif text-lg text-court-text/40 mb-1 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        The Chambers
      </motion.h3>

      {/* Rank stat */}
      <motion.div
        className="flex items-center gap-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <Trophy size={12} className="text-gold/30" />
        <span className="text-court-xs text-court-text-ter/50">Four Inns of Court</span>
      </motion.div>

      {/* Member count */}
      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <Users size={12} className="text-gold/25" />
        <span className="text-court-xs text-court-text-ter/40">One standard of excellence</span>
      </motion.div>

      {/* Motto */}
      <motion.p
        className="font-serif italic text-court-xs text-gold/20 text-center max-w-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        "In service of justice and the rule of law"
      </motion.p>

      {/* Bottom accent */}
      <motion.div
        className="absolute bottom-16 w-8 h-[1px] bg-gold/15"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2.5, duration: 0.8 }}
      />
    </div>
  );
}
