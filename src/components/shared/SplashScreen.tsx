"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale } from "lucide-react";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  // Start null — we haven't checked sessionStorage yet
  const [showSplash, setShowSplash] = useState<boolean | null>(null);
  const [animationDone, setAnimationDone] = useState(false);

  // Check on mount whether to show splash (avoids hydration mismatch)
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem("ratio_splash_seen");
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!alreadySeen && !prefersReduced) {
      setShowSplash(true);
    } else {
      setShowSplash(false);
    }
  }, []);

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setAnimationDone(true);
      sessionStorage.setItem("ratio_splash_seen", "1");
    }, 3200);
    return () => clearTimeout(timer);
  }, [showSplash]);

  // After exit animation completes, unmount splash
  const handleExitComplete = () => {
    setShowSplash(false);
  };

  // Still checking storage — render nothing to prevent flash
  if (showSplash === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-navy" />
    );
  }

  // Already seen — render children directly
  if (!showSplash && !animationDone) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence onExitComplete={handleExitComplete}>
        {showSplash && !animationDone && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999] bg-navy flex flex-col items-center justify-center overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Particle dust */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-gold/15"
                style={{ left: `${15 + i * 10}%` }}
                initial={{ y: "100vh", opacity: 0 }}
                animate={{ y: "-20vh", opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 2.5 + Math.random(),
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Glow behind icon */}
            <motion.div
              className="absolute w-32 h-32 rounded-full bg-gold/8 blur-3xl"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 1.2, 0.9], opacity: [0, 0.4, 0.2] }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />

            {/* Scale icon */}
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Scale size={48} className="text-gold" strokeWidth={1.5} />
            </motion.div>

            {/* RATIO. text */}
            <motion.div
              className="mt-5 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h1 className="font-serif text-3xl font-bold tracking-[0.2em] text-court-text">
                {"RATIO".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + i * 0.08, duration: 0.3 }}
                  >
                    {char}
                  </motion.span>
                ))}
                <motion.span
                  className="text-gold"
                  initial={{ opacity: 0, scale: 1.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.3, ease: "easeOut" }}
                >
                  .
                </motion.span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-2 text-court-sm text-court-text-sec tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              The Digital Court Society
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App content — visible immediately behind splash, fades in when splash exits */}
      <motion.div
        initial={showSplash ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: animationDone || !showSplash ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  );
}
