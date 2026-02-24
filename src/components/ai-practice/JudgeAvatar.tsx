"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Expression = "neutral" | "listening" | "thinking" | "stern" | "approving";

interface JudgeAvatarProps {
  isActive: boolean;
  isListening: boolean;
  responseText?: string;
  size?: number;
}

function detectExpression(text: string): Expression {
  const lower = text.toLowerCase();
  const sternWords = ["troubled", "not satisfied", "stop you there", "bold proposition", "disagree", "reject", "weak", "insufficient", "fail"];
  const approveWords = ["helpful", "well put", "good point", "that is helpful", "well-structured", "compelling", "effective", "persuasive", "commend"];
  if (sternWords.some((w) => lower.includes(w))) return "stern";
  if (approveWords.some((w) => lower.includes(w))) return "approving";
  return "neutral";
}

const RING_COLOURS: Record<Expression, string> = {
  neutral: "rgba(201,168,76,0.25)",
  listening: "rgba(201,168,76,0.35)",
  thinking: "rgba(201,168,76,0.4)",
  stern: "rgba(220,120,80,0.3)",
  approving: "rgba(120,200,140,0.3)",
};

export default function JudgeAvatar({
  isActive,
  isListening: userSpeaking,
  responseText = "",
  size = 64,
}: JudgeAvatarProps) {
  const [expression, setExpression] = useState<Expression>("neutral");

  useEffect(() => {
    if (isActive && !responseText) setExpression("thinking");
    else if (responseText) setExpression(detectExpression(responseText));
    else if (userSpeaking) setExpression("listening");
    else setExpression("neutral");
  }, [isActive, userSpeaking, responseText]);

  const ringColour = RING_COLOURS[expression];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pulsing rings when active */}
      <AnimatePresence>
        {isActive && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.4, 0.1, 0.4], scale: [1, 1.25, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ border: `2px solid ${ringColour}` }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.2, 0.05, 0.2], scale: [1, 1.45, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
              style={{ border: `1.5px solid ${ringColour}` }}
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        className="relative z-10 w-full h-full rounded-full overflow-hidden"
        animate={{
          boxShadow: isActive
            ? "0 0 24px rgba(201,168,76,0.35)"
            : "0 0 8px rgba(201,168,76,0.1)",
        }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1E2A3A" />
              <stop offset="100%" stopColor="#0D1520" />
            </radialGradient>
            <linearGradient id="wigGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8E2D4" />
              <stop offset="50%" stopColor="#D6CEBC" />
              <stop offset="100%" stopColor="#B8AE98" />
            </linearGradient>
            <radialGradient id="faceGrad" cx="50%" cy="38%" r="50%">
              <stop offset="0%" stopColor="#C4956A" />
              <stop offset="70%" stopColor="#A07850" />
              <stop offset="100%" stopColor="#8A6840" />
            </radialGradient>
            <linearGradient id="robeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A1A2E" />
              <stop offset="100%" stopColor="#0F0F1A" />
            </linearGradient>
            <linearGradient id="rimGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#C9A84C" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Background */}
          <circle cx="50" cy="50" r="50" fill="url(#bgGrad)" />
          <circle cx="50" cy="50" r="48.5" fill="none" stroke="url(#rimGold)" strokeWidth="1" />

          {/* Robe */}
          <path d="M 22 72 Q 30 62 50 60 Q 70 62 78 72 L 82 100 L 18 100 Z" fill="url(#robeGrad)" />
          <path d="M 36 64 Q 42 60 50 60 Q 58 60 64 64" fill="none" stroke="#2A2A40" strokeWidth="0.8" />

          {/* Geneva bands */}
          <rect x="46" y="62" width="3.2" height="10" rx="1" fill="#E0D8C8" opacity="0.85" />
          <rect x="50.5" y="62" width="3.2" height="10" rx="1" fill="#E0D8C8" opacity="0.85" />

          {/* Neck */}
          <path d="M 43 56 Q 44 62 50 63 Q 56 62 57 56" fill="#A07850" opacity="0.9" />

          {/* Face */}
          <ellipse cx="50" cy="44" rx="15" ry="17" fill="url(#faceGrad)" />
          <path d="M 36 48 Q 40 58 50 60 Q 60 58 64 48" fill="#9A7248" opacity="0.5" />

          {/* Wig — main body */}
          <ellipse cx="50" cy="28" rx="22" ry="14" fill="url(#wigGrad)" />
          {/* Wig curls left */}
          <circle cx="30" cy="32" r="5" fill="#D2C8B4" />
          <circle cx="28" cy="40" r="4.5" fill="#C8BCA6" />
          <circle cx="27" cy="48" r="4" fill="#BEB29A" />
          <circle cx="29" cy="55" r="3" fill="#B0A490" opacity="0.7" />
          {/* Wig curls right */}
          <circle cx="70" cy="32" r="5" fill="#D2C8B4" />
          <circle cx="72" cy="40" r="4.5" fill="#C8BCA6" />
          <circle cx="73" cy="48" r="4" fill="#BEB29A" />
          <circle cx="71" cy="55" r="3" fill="#B0A490" opacity="0.7" />
          {/* Top volume */}
          <ellipse cx="50" cy="20" rx="16" ry="8" fill="#DED6C4" opacity="0.7" />
          {/* Texture lines */}
          <path d="M 34 24 Q 40 20 50 19 Q 60 20 66 24" fill="none" stroke="#C0B8A4" strokeWidth="0.5" opacity="0.6" />
          <path d="M 32 30 Q 38 26 50 25 Q 62 26 68 30" fill="none" stroke="#C0B8A4" strokeWidth="0.5" opacity="0.5" />

          {/* Eyes — whites */}
          <ellipse cx="42" cy="42" rx="4" ry="2.8" fill="#F0EDE6" opacity="0.9" />
          <ellipse cx="58" cy="42" rx="4" ry="2.8" fill="#F0EDE6" opacity="0.9" />
          {/* Irises */}
          <motion.circle cx="42" cy="42" r="1.8" fill="#2C1810"
            animate={{ cy: expression === "stern" ? 42.5 : expression === "thinking" ? 41 : 42 }}
            transition={{ duration: 0.4 }}
          />
          <motion.circle cx="58" cy="42" r="1.8" fill="#2C1810"
            animate={{ cy: expression === "stern" ? 42.5 : expression === "thinking" ? 41 : 42 }}
            transition={{ duration: 0.4 }}
          />
          {/* Eye highlights */}
          <circle cx="43" cy="41.2" r="0.6" fill="white" opacity="0.7" />
          <circle cx="59" cy="41.2" r="0.6" fill="white" opacity="0.7" />

          {/* Eyelids */}
          <motion.path fill="url(#faceGrad)"
            animate={{
              d: expression === "stern"
                ? "M 38 40 Q 42 41.5 46 40 L 46 38 Q 42 39 38 38 Z"
                : expression === "thinking"
                  ? "M 38 40 Q 42 40.5 46 40 L 46 38 Q 42 39 38 38 Z"
                  : "M 38 40 Q 42 39.5 46 40 L 46 38 Q 42 38.5 38 38 Z",
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.path fill="url(#faceGrad)"
            animate={{
              d: expression === "stern"
                ? "M 54 40 Q 58 41.5 62 40 L 62 38 Q 58 39 54 38 Z"
                : expression === "thinking"
                  ? "M 54 40 Q 58 40.5 62 40 L 62 38 Q 58 39 54 38 Z"
                  : "M 54 40 Q 58 39.5 62 40 L 62 38 Q 58 38.5 54 38 Z",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Eyebrows */}
          <motion.path fill="none" stroke="#5A4030" strokeWidth="1.2" strokeLinecap="round"
            animate={{
              d: expression === "stern" ? "M 38 37.5 Q 42 36 46 37.5"
                : expression === "approving" ? "M 38 37 Q 42 35.5 46 37"
                : "M 38 37 Q 42 36 46 37",
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.path fill="none" stroke="#5A4030" strokeWidth="1.2" strokeLinecap="round"
            animate={{
              d: expression === "stern" ? "M 54 37.5 Q 58 36 62 37.5"
                : expression === "approving" ? "M 54 37 Q 58 35.5 62 37"
                : "M 54 37 Q 58 36 62 37",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Nose */}
          <path d="M 49 44 Q 50 49 48 50 Q 50 51 52 50 Q 51 49 51 44"
            fill="none" stroke="#8A6840" strokeWidth="0.8" opacity="0.6" />

          {/* Mouth */}
          <motion.path fill="none" stroke="#6B4830" strokeWidth="1.2" strokeLinecap="round"
            animate={{
              d: expression === "stern" ? "M 43 54 Q 50 56 57 54"
                : expression === "approving" ? "M 43 53 Q 50 56 57 53"
                : expression === "thinking" ? "M 44 54 Q 50 54.5 56 54"
                : "M 43 54 Q 50 55 57 54",
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Status indicator dot */}
          {expression === "stern" && (
            <motion.circle cx="84" cy="84" r="5" fill="#DC7050"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          )}
          {expression === "approving" && (
            <motion.circle cx="84" cy="84" r="5" fill="#78C88C"
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          )}
          {expression === "thinking" && (
            <motion.circle cx="84" cy="84" r="5" fill="#C9A84C"
              initial={{ scale: 0 }} animate={{ scale: [1, 0.8, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </svg>
      </motion.div>
    </div>
  );
}
