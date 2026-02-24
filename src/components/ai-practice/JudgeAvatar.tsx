"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale } from "lucide-react";

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

const GLOW: Record<Expression, string> = {
  neutral:   "rgba(201,168,76,0.3)",
  listening: "rgba(201,168,76,0.4)",
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

/**
 * Judge avatar using the RATIO brand Scale icon.
 * Expression-aware glow ring + status dot.
 */
export default function JudgeAvatar({
  isActive,
  isListening: userSpeaking,
  responseText = "",
  size = 44,
  collapsed = false,
}: JudgeAvatarProps) {
  const [expression, setExpression] = useState<Expression>("neutral");

  useEffect(() => {
    if (isActive && !responseText) setExpression("thinking");
    else if (responseText) setExpression(detectExpression(responseText));
    else if (userSpeaking) setExpression("listening");
    else setExpression("neutral");
  }, [isActive, userSpeaking, responseText]);

  const displaySize = collapsed ? 24 : size;
  const glowColour = GLOW[expression];
  const accentColour = ACCENT[expression];
  const iconSize = collapsed ? 12 : Math.round(size * 0.45);

  return (
    <motion.div
      className="relative shrink-0"
      animate={{ width: displaySize, height: displaySize }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Pulse ring when active */}
      <AnimatePresence>
        {isActive && !collapsed && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.3, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ border: `2px solid ${glowColour}` }}
          />
        )}
      </AnimatePresence>

      {/* Main circle */}
      <motion.div
        className="relative z-10 w-full h-full rounded-full flex items-center justify-center"
        animate={{
          boxShadow: isActive
            ? `0 0 16px ${glowColour}, inset 0 0 0 1.5px ${glowColour}`
            : "0 0 8px rgba(201,168,76,0.1), inset 0 0 0 1.5px rgba(201,168,76,0.15)",
        }}
        transition={{ duration: 0.5 }}
        style={{ background: "linear-gradient(145deg, rgba(201,168,76,0.08) 0%, #0F172A 50%, #0B1120 100%)" }}
      >
        <motion.div
          animate={expression === "thinking" ? { rotate: [0, -8, 0, 8, 0] } : { rotate: 0 }}
          transition={{ duration: 2.5, repeat: expression === "thinking" ? Infinity : 0 }}
        >
          <Scale size={iconSize} style={{ color: accentColour }} />
        </motion.div>
      </motion.div>

      {/* Status dot */}
      <AnimatePresence>
        {(isActive || expression === "stern" || expression === "approving") && (
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 z-20 rounded-full border-[1.5px] border-[#0B1120]"
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
              width: collapsed ? 7 : 10,
              height: collapsed ? 7 : 10,
              backgroundColor: accentColour,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
