"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Expression = "neutral" | "listening" | "thinking" | "stern" | "approving";

interface JudgeAvatarProps {
  isActive: boolean;
  isListening: boolean;
  responseText?: string;
  size?: number;
  collapsed?: boolean;
}

function detectExpression(text: string): Expression {
  const lower = text.toLowerCase();
  const sternWords = ["troubled", "not satisfied", "stop you there", "bold proposition", "disagree", "reject", "weak", "insufficient", "fail"];
  const approveWords = ["helpful", "well put", "good point", "that is helpful", "well-structured", "compelling", "effective", "persuasive", "commend"];
  if (sternWords.some((w) => lower.includes(w))) return "stern";
  if (approveWords.some((w) => lower.includes(w))) return "approving";
  return "neutral";
}

/* ── Colour palettes per expression ── */
const GLOW: Record<Expression, string> = {
  neutral:   "rgba(201,168,76,0.35)",
  listening: "rgba(201,168,76,0.45)",
  thinking:  "rgba(201,168,76,0.5)",
  stern:     "rgba(220,112,80,0.4)",
  approving: "rgba(120,200,140,0.4)",
};

const ACCENT: Record<Expression, string> = {
  neutral:   "#C9A84C",
  listening: "#C9A84C",
  thinking:  "#C9A84C",
  stern:     "#DC7050",
  approving: "#78C88C",
};

/* ── Scale tilt per expression (degrees) ── */
const PAN_TILT: Record<Expression, number> = {
  neutral:   0,
  listening: 0,
  thinking:  -3,
  stern:     -10,
  approving: 2,
};

/* ── Sparkle positions (% offset from centre) ── */
const SPARKLES = [
  { x: -38, y: -42, delay: 0, size: 2.5 },
  { x: 40, y: -30, delay: 0.8, size: 2 },
  { x: -30, y: 38, delay: 1.6, size: 1.8 },
  { x: 42, y: 35, delay: 2.2, size: 2.2 },
];

/**
 * Animated Scales-of-Justice judge avatar.
 *
 * - Metallic gold shifting gradient on the scales
 * - Scale pans tilt based on judge expression
 * - Soft glow ring that pulses (colour matches expression)
 * - Floating gold sparkle particles
 * - 3D perspective with subtle Y-axis wobble
 * - Collapses to 28px inline indicator during conversation
 */
export default function JudgeAvatar({
  isActive,
  isListening: userSpeaking,
  responseText = "",
  size = 56,
  collapsed = false,
}: JudgeAvatarProps) {
  const [expression, setExpression] = useState<Expression>("neutral");

  useEffect(() => {
    if (isActive && !responseText) setExpression("thinking");
    else if (responseText) setExpression(detectExpression(responseText));
    else if (userSpeaking) setExpression("listening");
    else setExpression("neutral");
  }, [isActive, userSpeaking, responseText]);

  const displaySize = collapsed ? 28 : size;
  const glowColour = GLOW[expression];
  const accentColour = ACCENT[expression];
  const tilt = PAN_TILT[expression];

  return (
    <motion.div
      className="relative"
      animate={{ width: displaySize, height: displaySize }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{ perspective: 200 }}
    >
      {/* ── Pulse rings (active, not collapsed) ── */}
      <AnimatePresence>
        {isActive && !collapsed && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 1.35, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.8, repeat: Infinity }}
              style={{ border: `2px solid ${glowColour}` }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.25, 0.05, 0.25], scale: [1, 1.55, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.8, repeat: Infinity, delay: 0.7 }}
              style={{ border: `1.5px solid ${glowColour}` }}
            />
          </>
        )}
      </AnimatePresence>

      {/* ── Main circle (dark bg + glow + 3D wobble) ── */}
      <motion.div
        className="relative z-10 w-full h-full rounded-full flex items-center justify-center"
        animate={{
          rotateY: isActive && !collapsed ? [0, 6, 0, -6, 0] : 0,
          boxShadow: isActive
            ? `0 0 24px ${glowColour}, inset 0 0 0 2px ${glowColour}`
            : "0 0 10px rgba(201,168,76,0.12), inset 0 0 0 1.5px rgba(201,168,76,0.2)",
        }}
        transition={{
          rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 0.6 },
        }}
        style={{
          background: "radial-gradient(circle at 40% 35%, rgba(201,168,76,0.08) 0%, rgba(15,23,42,0.95) 60%, #0B1120 100%)",
        }}
      >
        {/* ── Scales SVG ── */}
        <motion.svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[60%] h-[60%]"
          animate={{
            filter: isActive
              ? [
                  "drop-shadow(0 0 4px rgba(201,168,76,0.4))",
                  "drop-shadow(0 0 8px rgba(201,168,76,0.6))",
                  "drop-shadow(0 0 4px rgba(201,168,76,0.4))",
                ]
              : "drop-shadow(0 0 3px rgba(201,168,76,0.2))",
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <defs>
            {/* Metallic gold gradient — colours shift over time */}
            <linearGradient id="goldMetal" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E8D48B">
                <animate attributeName="stop-color" values="#E8D48B;#C9A84C;#F0E0A0;#E8D48B" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#C9A84C">
                <animate attributeName="stop-color" values="#C9A84C;#F0E0A0;#B8942F;#C9A84C" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#A07830">
                <animate attributeName="stop-color" values="#A07830;#C9A84C;#8B6914;#A07830" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            {/* Accent gradient (expression-aware) */}
            <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColour} />
              <stop offset="100%" stopColor={accentColour} stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Centre pillar */}
          <rect x="30.5" y="16" width="3" height="30" rx="1.5" fill="url(#goldMetal)" />

          {/* Base pedestal */}
          <path d="M22 46 C22 44.5 25 43 32 43 C39 43 42 44.5 42 46 L42 48 C42 49 39 50 32 50 C25 50 22 49 22 48 Z" fill="url(#goldMetal)" />
          <ellipse cx="32" cy="44" rx="8" ry="1.5" fill="rgba(240,224,160,0.15)" />

          {/* Crown ornament */}
          <circle cx="32" cy="15" r="2.5" fill="url(#accentGrad)" />

          {/* Cross beam */}
          <rect x="12" y="18" width="40" height="2.5" rx="1.25" fill="url(#goldMetal)" />

          {/* ── Arms + pans (tilt based on expression) ── */}
          <motion.g
            animate={{ rotate: tilt }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            style={{ transformOrigin: "32px 19px" }}
          >
            {/* Left chain */}
            <line x1="14" y1="20.5" x2="14" y2="32" stroke="url(#goldMetal)" strokeWidth="1.2" strokeLinecap="round" />
            {/* Left pan */}
            <path d="M6 32 Q6 30.5 14 30.5 Q22 30.5 22 32 L21 35 Q21 36.5 14 36.5 Q7 36.5 7 35 Z" fill="url(#goldMetal)" />
            <ellipse cx="14" cy="33" rx="6" ry="1.8" fill="rgba(160,120,48,0.25)" />

            {/* Right chain */}
            <line x1="50" y1="20.5" x2="50" y2="32" stroke="url(#goldMetal)" strokeWidth="1.2" strokeLinecap="round" />
            {/* Right pan */}
            <path d="M42 32 Q42 30.5 50 30.5 Q58 30.5 58 32 L57 35 Q57 36.5 50 36.5 Q43 36.5 43 35 Z" fill="url(#goldMetal)" />
            <ellipse cx="50" cy="33" rx="6" ry="1.8" fill="rgba(160,120,48,0.25)" />
          </motion.g>
        </motion.svg>
      </motion.div>

      {/* ── Sparkle particles (active, not collapsed) ── */}
      <AnimatePresence>
        {isActive && !collapsed &&
          SPARKLES.map((s, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full z-20"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1, 0],
                x: [s.x * 0.8, s.x, s.x * 1.1],
                y: [s.y * 0.8, s.y, s.y * 1.1],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: s.delay,
                ease: "easeInOut",
              }}
              style={{
                width: s.size,
                height: s.size,
                backgroundColor: accentColour,
                boxShadow: `0 0 4px ${accentColour}`,
                left: "50%",
                top: "50%",
              }}
            />
          ))}
      </AnimatePresence>

      {/* ── Status indicator dot ── */}
      <AnimatePresence>
        {(isActive || expression === "stern" || expression === "approving") && (
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 z-20 rounded-full border-2 border-navy"
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              ...(expression === "thinking" ? { opacity: [1, 0.5, 1] } : {}),
            }}
            exit={{ scale: 0 }}
            transition={{
              scale: { type: "spring", stiffness: 500 },
              opacity: { duration: 1.5, repeat: Infinity },
            }}
            style={{
              width: collapsed ? 8 : 12,
              height: collapsed ? 8 : 12,
              backgroundColor: accentColour,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
