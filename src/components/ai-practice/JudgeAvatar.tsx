"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

const STATUS_COLOURS: Record<Expression, string> = {
  neutral: "#C9A84C",
  listening: "#C9A84C",
  thinking: "#C9A84C",
  stern: "#DC7050",
  approving: "#78C88C",
};

const RING_COLOURS: Record<Expression, string> = {
  neutral: "rgba(201,168,76,0.3)",
  listening: "rgba(201,168,76,0.4)",
  thinking: "rgba(201,168,76,0.5)",
  stern: "rgba(220,120,80,0.35)",
  approving: "rgba(120,200,140,0.35)",
};

/**
 * Judge avatar using a real photograph.
 * To swap the photo: replace /public/images/judge-avatar.jpg
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

  const ringColour = RING_COLOURS[expression];
  const statusColour = STATUS_COLOURS[expression];
  const displaySize = collapsed ? 28 : size;

  return (
    <motion.div
      className="relative"
      animate={{ width: displaySize, height: displaySize }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Pulsing rings when active (only when not collapsed) */}
      <AnimatePresence>
        {isActive && !collapsed && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.3, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ border: `2px solid ${ringColour}` }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.2, 0.05, 0.2], scale: [1, 1.5, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
              style={{ border: `1.5px solid ${ringColour}` }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Photo container */}
      <motion.div
        className="relative z-10 w-full h-full rounded-full overflow-hidden"
        animate={{
          boxShadow: isActive
            ? `0 0 20px rgba(201,168,76,0.35), inset 0 0 0 2px ${ringColour}`
            : "0 0 8px rgba(201,168,76,0.1), inset 0 0 0 1.5px rgba(201,168,76,0.2)",
        }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/judge-avatar.jpg"
          alt="Judge"
          fill
          className="object-cover"
          sizes={`${displaySize}px`}
          priority
        />
        {/* Dark overlay to blend with app theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </motion.div>

      {/* Status indicator dot */}
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
              backgroundColor: statusColour,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
