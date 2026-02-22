"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playGavel, resumeAudio } from "@/lib/utils/sounds";

interface CourtroomEntranceProps {
  onComplete: () => void;
  sessionTitle?: string;
}

export function CourtroomEntrance({ onComplete, sessionTitle }: CourtroomEntranceProps) {
  const [phase, setPhase] = useState<"scales" | "text" | "dissolve">("scales");

  useEffect(() => {
    resumeAudio();
    // Phase 1: Scales appear (0-1s)
    const t1 = setTimeout(() => {
      playGavel();
    }, 400);
    // Phase 2: Text appears (1-2.2s)
    const t2 = setTimeout(() => setPhase("text"), 1000);
    // Phase 3: Dissolve into session (2.2-3s)
    const t3 = setTimeout(() => setPhase("dissolve"), 2200);
    // Complete
    const t4 = setTimeout(() => onComplete(), 3000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-navy flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "dissolve" ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Radial glow background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 40%, transparent 70%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1.2, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Decorative lines */}
      <motion.div
        className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      />
      <motion.div
        className="absolute bottom-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Scales of Justice SVG */}
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-[0_0_30px_rgba(201,168,76,0.4)]"
          >
            {/* Pillar */}
            <rect x="48" y="20" width="4" height="60" rx="2" fill="#C9A84C" opacity="0.9" />
            {/* Base */}
            <rect x="35" y="78" width="30" height="4" rx="2" fill="#C9A84C" opacity="0.7" />
            <rect x="40" y="74" width="20" height="4" rx="2" fill="#C9A84C" opacity="0.5" />
            {/* Beam */}
            <motion.rect
              x="10" y="18" width="80" height="3" rx="1.5" fill="#C9A84C" opacity="0.9"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            {/* Left scale */}
            <motion.g
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <line x1="20" y1="20" x2="10" y2="42" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
              <line x1="20" y1="20" x2="30" y2="42" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
              <path d="M8 42 Q20 50 32 42" stroke="#C9A84C" strokeWidth="2" fill="none" opacity="0.8" />
            </motion.g>
            {/* Right scale */}
            <motion.g
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <line x1="80" y1="20" x2="70" y2="42" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
              <line x1="80" y1="20" x2="90" y2="42" stroke="#C9A84C" strokeWidth="1.5" opacity="0.6" />
              <path d="M68 42 Q80 50 92 42" stroke="#C9A84C" strokeWidth="2" fill="none" opacity="0.8" />
            </motion.g>
            {/* Top ornament */}
            <circle cx="50" cy="16" r="4" fill="#C9A84C" opacity="0.9" />
          </svg>
        </motion.div>

        {/* "All Rise" text */}
        <AnimatePresence>
          {(phase === "text" || phase === "dissolve") && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gold/60 text-court-xs font-bold tracking-[0.4em] uppercase mb-2">
                Ratio &middot; The Digital Court Society
              </p>
              <h1 className="font-serif text-3xl font-bold text-gold tracking-wide">
                All Rise
              </h1>
              {sessionTitle && (
                <motion.p
                  className="text-court-text-sec text-xs mt-3 max-w-[260px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {sessionTitle}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
