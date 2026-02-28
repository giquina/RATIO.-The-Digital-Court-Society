"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale } from "lucide-react";
import { playCourtTone } from "@/lib/visitor-chat/usher-sound";

interface AuthTransitionProps {
  variant: "sign-in" | "sign-up";
  isActive: boolean;
  userName?: string;
  onComplete: () => void;
}

/** Format date as court session reference: "28.02.2026 — 14:32" */
function formatSessionRef(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} \u2014 ${hh}:${min}`;
}

/** Split message into 2-3 word groups for staggered reveal */
function splitIntoGroups(text: string): string[] {
  const words = text.split(" ");
  const groups: string[] = [];
  for (let i = 0; i < words.length; i += 2) {
    groups.push(words.slice(i, i + 2).join(" "));
  }
  return groups;
}

export function AuthTransition({
  variant,
  isActive,
  userName,
  onComplete,
}: AuthTransitionProps) {
  const [phase, setPhase] = useState<"animating" | "exiting" | "done">("animating");
  const hasTriggered = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const minDuration = variant === "sign-up" ? 2200 : 1500;
  const maxDuration = 4000;

  // Reduced motion: skip animation entirely
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const triggerComplete = useCallback(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    setPhase("exiting");
    // Give exit animation time to play, then call onComplete
    setTimeout(() => {
      setPhase("done");
      onCompleteRef.current();
    }, 350);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Reduced motion — skip everything
    if (prefersReduced) {
      onCompleteRef.current();
      return;
    }

    // Play court tone + haptic
    playCourtTone();
    if ("vibrate" in navigator) {
      try { navigator.vibrate(50); } catch { /* ignore */ }
    }

    // Minimum duration timer
    const minTimer = setTimeout(() => {
      triggerComplete();
    }, minDuration);

    // Safety timeout
    const maxTimer = setTimeout(() => {
      triggerComplete();
    }, maxDuration);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [isActive, minDuration, maxDuration, prefersReduced, triggerComplete]);

  // Don't render if not active, done, or prefers reduced motion
  if (!isActive || phase === "done" || prefersReduced) return null;

  // Build copy based on variant
  const isSignUp = variant === "sign-up";
  const displayName = userName && userName.length > 1
    ? userName.charAt(0).toUpperCase() + userName.slice(1)
    : null;

  const primaryMessage = isSignUp
    ? "Your call to the Bar has been accepted."
    : displayName
      ? `The Court recognises you, ${displayName}.`
      : "The Court recognises you.";

  const subMessage = isSignUp
    ? "Preparing your Chambers..."
    : "Returning to the Bench...";

  const extraLine = isSignUp
    ? "You are now an Advocate of the Digital Court."
    : null;

  const primaryGroups = splitIntoGroups(primaryMessage);
  const sessionRef = formatSessionRef();

  return (
    <AnimatePresence>
        <motion.div
          key="auth-transition"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: "radial-gradient(ellipse at 50% 50%, #131E30 0%, #0C1220 70%)",
            backgroundSize: "200% 200%",
          }}
          initial={{ opacity: 1, y: 0 }}
          animate={phase === "exiting" ? { y: "-100vh", opacity: 0 } : { opacity: 1, y: 0 }}
          exit={{ y: "-100vh", opacity: 0 }}
          transition={
            phase === "exiting"
              ? { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
              : { duration: 0.1 }
          }
        >
          {/* Subtle animated gradient background */}
          <div
            className="absolute inset-0 animate-gradient-shift"
            style={{
              background: "radial-gradient(ellipse at 50% 50%, rgba(19,30,48,0.6) 0%, transparent 70%)",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Glow behind icon */}
          <motion.div
            className="absolute w-32 h-32 rounded-full bg-gold/[0.08] blur-3xl"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 0.9], opacity: [0, 0.4, 0.2] }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Scale icon */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Scale size={44} className="text-gold" strokeWidth={1.5} />
          </motion.div>

          {/* Gold line — draws from center outward */}
          <motion.div
            className="mt-4 h-[2px] bg-gold/60 rounded-full"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
          />

          {/* Primary message — staggered word groups */}
          <div className="mt-5 text-center">
            {primaryGroups.map((group, i) => (
              <motion.span
                key={i}
                className="font-serif text-lg text-court-text inline-block mx-[3px]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.25, ease: "easeOut" }}
              >
                {group}
              </motion.span>
            ))}
          </div>

          {/* Sub message */}
          <motion.p
            className="mt-1.5 text-court-sm text-court-text-sec"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: isSignUp ? 1.0 : 0.9, duration: 0.3 }}
          >
            {subMessage}
          </motion.p>

          {/* Extra line (sign-up only) */}
          {extraLine && (
            <motion.p
              className="mt-3 font-serif text-court-base text-gold/80 italic"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.3, ease: "easeOut" }}
            >
              {extraLine}
            </motion.p>
          )}

          {/* Session reference */}
          <motion.p
            className="mt-6 text-[10px] text-court-text-ter tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: isSignUp ? 1.5 : 1.1, duration: 0.3 }}
          >
            Session ref: {sessionRef}
          </motion.p>
        </motion.div>
    </AnimatePresence>
  );
}
