"use client";

import { motion } from "framer-motion";
import { Gavel, Clock, BookOpen } from "lucide-react";

// Minimalist courtroom line-art drawn with SVG pathLength
// Shows:
// 1. Courtroom bench SVG (draw-on animation)
// 2. Glow pulse behind the bench
// 3. "The Bench" heading in serif
// 4. Session stat line
// 5. Floating particles

export default function SessionsPanel() {
  const particles = Array.from({ length: 5 }, (_, i) => ({
    x: 15 + Math.random() * 70,
    delay: i * 1.0,
    duration: 5 + Math.random() * 3,
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

      {/* Glow behind courtroom */}
      <motion.div
        className="absolute w-40 h-24 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)" }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Courtroom scene SVG */}
      <svg viewBox="0 0 120 80" className="w-32 h-20 mb-6">
        {/* Bench / podium */}
        <motion.path
          d="M20 55 L20 35 L100 35 L100 55"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          stroke="#C9A84C"
          strokeWidth={1.2}
          fill="none"
          strokeLinecap="round"
        />
        {/* Bench top */}
        <motion.path
          d="M15 35 L105 35"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
          stroke="#C9A84C"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* Gavel shape */}
        <motion.path
          d="M55 25 L65 25 M60 20 L60 30"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
          stroke="#C9A84C"
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
        />
        {/* Floor line */}
        <motion.path
          d="M5 65 L115 65"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
          stroke="#C9A84C"
          strokeWidth={0.5}
          fill="none"
          opacity={0.3}
        />
        {/* Two counsel positions */}
        <motion.path
          d="M30 55 L30 65 M90 55 L90 65"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 1, delay: 2, ease: "easeInOut" }}
          stroke="#C9A84C"
          strokeWidth={0.8}
          fill="none"
        />
      </svg>

      {/* Heading */}
      <motion.h3
        className="font-serif text-lg text-court-text/40 mb-1 text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        The Bench
      </motion.h3>

      {/* Subtext */}
      <motion.div
        className="flex items-center gap-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <Gavel size={12} className="text-gold/30" />
        <span className="text-court-xs text-court-text-ter/50">Moot Court Sessions</span>
      </motion.div>

      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <Clock size={12} className="text-gold/25" />
        <span className="text-court-xs text-court-text-ter/40">Schedule, join, and review</span>
      </motion.div>

      {/* Motto */}
      <motion.p
        className="font-serif italic text-court-xs text-gold/20 text-center max-w-[180px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        "The art of advocacy begins at the bench"
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
