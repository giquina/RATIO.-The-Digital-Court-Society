"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, BarChart3 } from "lucide-react";

// Animated bar chart with gold bars growing upward on mount
// Shows:
// 1. 5 bars at different heights with spring physics
// 2. Highlighted "your" bar
// 3. "National Rankings" heading
// 4. Stats below

export default function RankingsPanel() {
  const bars = [
    { height: 45, delay: 0.3, highlighted: false },
    { height: 65, delay: 0.5, highlighted: false },
    { height: 90, delay: 0.7, highlighted: true },  // "Your" bar
    { height: 55, delay: 0.9, highlighted: false },
    { height: 35, delay: 1.1, highlighted: false },
  ];

  const particles = Array.from({ length: 4 }, (_, i) => ({
    x: 20 + Math.random() * 60,
    delay: i * 1.2,
    duration: 5 + Math.random() * 2,
  }));

  return (
    <div className="flex flex-col items-center justify-center h-full relative overflow-hidden">
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-gold/15"
          initial={{ y: "100%", x: `${p.x}%`, opacity: 0 }}
          animate={{ y: "-20%", opacity: [0, 0.5, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Bar chart */}
      <div className="flex items-end gap-3 mb-8 h-24">
        {bars.map((bar, i) => (
          <motion.div
            key={i}
            className={`w-4 rounded-t-sm ${bar.highlighted ? "bg-gold/40" : "bg-gold/15"}`}
            initial={{ height: 0 }}
            animate={{ height: bar.height }}
            transition={{
              delay: bar.delay,
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 12,
            }}
          />
        ))}
      </div>

      {/* Heading */}
      <motion.h3
        className="font-serif text-lg text-court-text/40 mb-1 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        National Rankings
      </motion.h3>

      {/* Rank info */}
      <motion.div
        className="flex items-center gap-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <TrendingUp size={12} className="text-gold/30" />
        <span className="text-court-xs text-court-text-ter/50">The finest advocates</span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.6 }}
      >
        <Award size={12} className="text-gold/25" />
        <span className="text-court-xs text-court-text-ter/40">Across all UK law schools</span>
      </motion.div>

      {/* Motto */}
      <motion.p
        className="font-serif italic text-court-xs text-gold/20 text-center max-w-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        "Excellence measured, merit recognised"
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
