"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Expression = "neutral" | "listening" | "thinking" | "stern" | "approving";

interface JudgeAvatarProps {
  isActive: boolean; // Judge is speaking or thinking
  isListening: boolean; // User is speaking
  responseText?: string; // Used to detect expression keywords
  size?: number;
}

/**
 * Animated Judge Avatar — an SVG-based judge face that changes expression
 * based on session state and response content.
 *
 * Expressions are driven by keywords in the AI response:
 * - "troubled" / "not satisfied" / "stop you there" → stern
 * - "helpful" / "well" / "good" → approving
 * - Default during response → neutral
 * - While waiting for user → listening
 * - While generating → thinking
 */
function detectExpression(text: string): Expression {
  const lower = text.toLowerCase();
  const sternWords = ["troubled", "not satisfied", "stop you there", "bold proposition", "disagree", "reject", "weak", "insufficient", "fail"];
  const approveWords = ["helpful", "well put", "good point", "that is helpful", "well-structured", "compelling", "effective", "persuasive", "commend"];

  if (sternWords.some((w) => lower.includes(w))) return "stern";
  if (approveWords.some((w) => lower.includes(w))) return "approving";
  return "neutral";
}

// Expression-based eye and mouth configs
const EXPRESSIONS: Record<Expression, { eyeHeight: number; mouthPath: string; browOffset: number }> = {
  neutral: {
    eyeHeight: 5,
    mouthPath: "M 32 62 Q 40 64 48 62", // Slight neutral line
    browOffset: 0,
  },
  listening: {
    eyeHeight: 5,
    mouthPath: "M 32 62 Q 40 60 48 62", // Slightly open / attentive
    browOffset: -1,
  },
  thinking: {
    eyeHeight: 3, // Slightly squinted
    mouthPath: "M 34 63 Q 40 63 46 63", // Thin line — concentrating
    browOffset: -2,
  },
  stern: {
    eyeHeight: 4,
    mouthPath: "M 32 64 Q 40 66 48 64", // Slight frown
    browOffset: -3, // Brows drawn down
  },
  approving: {
    eyeHeight: 4,
    mouthPath: "M 32 62 Q 40 58 48 62", // Slight smile
    browOffset: 1,
  },
};

export default function JudgeAvatar({
  isActive,
  isListening: userSpeaking,
  responseText = "",
  size = 80,
}: JudgeAvatarProps) {
  const [expression, setExpression] = useState<Expression>("neutral");
  const [blinkOpen, setBlinkOpen] = useState(true);

  // Update expression based on state
  useEffect(() => {
    if (isActive && !responseText) {
      setExpression("thinking");
    } else if (responseText) {
      setExpression(detectExpression(responseText));
    } else if (userSpeaking) {
      setExpression("listening");
    } else {
      setExpression("neutral");
    }
  }, [isActive, userSpeaking, responseText]);

  // Natural blink cycle
  useEffect(() => {
    const blink = () => {
      setBlinkOpen(false);
      setTimeout(() => setBlinkOpen(true), 150);
    };
    // Blink every 3-6 seconds
    const interval = setInterval(blink, 3000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const expr = EXPRESSIONS[expression];
  const eyeH = blinkOpen ? expr.eyeHeight : 1;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow rings when active */}
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.1, 0.3], scale: [1, 1.3, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ border: "2px solid #C9A84C33" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.05, 0.2], scale: [1, 1.5, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              style={{ border: "2px solid #C9A84C22" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Main avatar */}
      <motion.div
        className="relative z-10 w-full h-full rounded-full overflow-hidden"
        animate={{
          boxShadow: isActive
            ? "0 0 30px rgba(201, 168, 76, 0.4)"
            : "0 0 15px rgba(201, 168, 76, 0.15)",
        }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 80 80" className="w-full h-full">
          {/* Background gradient */}
          <defs>
            <linearGradient id="judgeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2C1810" />
              <stop offset="100%" stopColor="#4A2C20" />
            </linearGradient>
            <linearGradient id="wigGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8E0D0" />
              <stop offset="100%" stopColor="#C8BCA8" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle cx="40" cy="40" r="40" fill="url(#judgeGrad)" />

          {/* Judicial wig */}
          <ellipse cx="40" cy="22" rx="22" ry="14" fill="url(#wigGrad)" opacity="0.9" />
          {/* Wig curls */}
          <circle cx="22" cy="28" r="5" fill="#D8D0C0" opacity="0.8" />
          <circle cx="58" cy="28" r="5" fill="#D8D0C0" opacity="0.8" />
          <circle cx="18" cy="36" r="4" fill="#C8BCA8" opacity="0.7" />
          <circle cx="62" cy="36" r="4" fill="#C8BCA8" opacity="0.7" />

          {/* Face base */}
          <ellipse cx="40" cy="42" rx="16" ry="18" fill="#8B6914" opacity="0.85" />

          {/* Eyes */}
          <motion.ellipse
            cx="34" cy="38"
            rx="2.5"
            animate={{ ry: eyeH / 2 }}
            transition={{ duration: 0.1 }}
            fill="#1A1A1A"
          />
          <motion.ellipse
            cx="46" cy="38"
            rx="2.5"
            animate={{ ry: eyeH / 2 }}
            transition={{ duration: 0.1 }}
            fill="#1A1A1A"
          />

          {/* Eyebrows */}
          <motion.line
            x1="30" x2="38"
            animate={{ y1: 33 + expr.browOffset, y2: 32 + expr.browOffset }}
            stroke="#3D2B1F" strokeWidth="1.5" strokeLinecap="round"
            transition={{ duration: 0.3 }}
          />
          <motion.line
            x1="42" x2="50"
            animate={{ y1: 32 + expr.browOffset, y2: 33 + expr.browOffset }}
            stroke="#3D2B1F" strokeWidth="1.5" strokeLinecap="round"
            transition={{ duration: 0.3 }}
          />

          {/* Mouth */}
          <motion.path
            animate={{ d: expr.mouthPath }}
            fill="none" stroke="#3D2B1F" strokeWidth="1.5" strokeLinecap="round"
            transition={{ duration: 0.3 }}
          />

          {/* Collar / robe hint */}
          <path d="M 24 65 Q 40 58 56 65 L 56 80 L 24 80 Z" fill="#1A1A1A" opacity="0.9" />
          {/* White bands (barrister's collar tabs) */}
          <rect x="36" y="62" width="3.5" height="8" rx="1" fill="#E8E0D0" opacity="0.8" />
          <rect x="40.5" y="62" width="3.5" height="8" rx="1" fill="#E8E0D0" opacity="0.8" />
        </svg>
      </motion.div>
    </div>
  );
}
