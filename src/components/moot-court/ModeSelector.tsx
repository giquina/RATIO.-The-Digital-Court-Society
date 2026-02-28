"use client";

import { useState, useEffect } from "react";
import { Tag, Card, Button, DynamicIcon } from "@/components/ui";
import { AI_PERSONAS } from "@/lib/constants/app";
import { Lightbulb, Scale, Lock, Clock, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils/helpers";

// ── Types ──

type Mode = "judge" | "mentor" | "examiner" | "opponent";

interface ModeSelectorProps {
  onSelectMode: (mode: Mode) => void;
  sessionLimitReached: boolean;
  onDismissLimit: () => void;
  lastPracticed?: Record<string, string | null>;
}

// ── Persona metadata (descriptions + style tags) ──

const MODE_DESCRIPTIONS: Record<Mode, string> = {
  judge:
    "Face a virtual High Court judge who will challenge your submissions and score your advocacy.",
  mentor:
    "Get constructive coaching on your technique from a supportive senior counsel.",
  examiner:
    "Timed SQE2-format assessment with marking against SRA competency standards.",
  opponent:
    "AI argues against you in real time. Train rebuttal and thinking on your feet.",
};

const MODE_TAGS: Record<Mode, { label: string; color: string }> = {
  judge: { label: "Adversarial", color: "gold" },
  mentor: { label: "Supportive", color: "blue" },
  examiner: { label: "Assessment", color: "burgundy" },
  opponent: { label: "COMING SOON", color: "orange" },
};

// ── Stagger animation variants ──

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// ── Component ──

export default function ModeSelector({
  onSelectMode,
  sessionLimitReached,
  onDismissLimit,
  lastPracticed,
}: ModeSelectorProps) {
  const modes = Object.entries(AI_PERSONAS) as [
    Mode,
    (typeof AI_PERSONAS)[Mode],
  ][];

  // Show AI data disclosure once per device
  const [showDisclosure, setShowDisclosure] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = localStorage.getItem("ratio_ai_disclosure_seen");
    if (!dismissed) setShowDisclosure(true);
  }, []);
  const dismissDisclosure = () => {
    setShowDisclosure(false);
    localStorage.setItem("ratio_ai_disclosure_seen", "1");
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <motion.div
        className="px-4 pt-3 pb-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
          Advocacy
        </h1>
        <p className="text-court-sm text-court-text-sec">
          Train with expert legal personas. Select a mode to begin.
        </p>
      </motion.div>

      {/* AI data processing disclosure — shown once */}
      <AnimatePresence>
        {showDisclosure && (
          <motion.div
            className="px-4 mb-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Card className="p-3.5 border-court-border-light bg-white/[0.02]">
              <div className="flex gap-2.5 items-start">
                <ShieldCheck size={16} className="text-gold shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-court-xs text-court-text-sec leading-relaxed">
                    Sessions are powered by AI. Your arguments are processed for
                    real-time feedback only and are not used to train AI models.
                    Transcripts are stored privately in your portfolio.{" "}
                    <Link href="/privacy" className="text-gold hover:underline">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
                <button
                  onClick={dismissDisclosure}
                  className="text-court-text-ter hover:text-court-text-sec transition-colors shrink-0"
                  aria-label="Dismiss"
                >
                  <X size={14} />
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session limit reached banner */}
      {sessionLimitReached && (
        <motion.div
          className="px-4 mb-4"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-5 border-gold/30">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Scale size={24} className="text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-court-text mb-1">
                  Monthly Practice Allocation Exhausted
                </h3>
                <p className="text-court-sm text-court-text-sec leading-relaxed">
                  You have used your 3 complimentary hearings this month.
                  Upgrade to Premium for unlimited practice.
                </p>
              </div>
              <Button variant="outline" onClick={onDismissLimit}>
                View Premium
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Persona cards */}
      <motion.div
        className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {modes.map(([key, persona]) => {
          const isOpponent = key === "opponent";
          const isDisabled = isOpponent || sessionLimitReached;
          const tag = MODE_TAGS[key];
          const practiced = lastPracticed?.[key] ?? null;

          return (
            <motion.div key={key} variants={itemVariants}>
              <Card
                onClick={
                  !isDisabled ? () => onSelectMode(key) : undefined
                }
                className={cn(
                  "overflow-hidden transition-all",
                  isDisabled
                    ? "opacity-50"
                    : "cursor-pointer hover:border-white/10"
                )}
              >
                {/* Gradient header strip */}
                <div
                  className="relative h-12 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${persona.gradient[0]}, ${persona.gradient[1]})`,
                  }}
                >
                  <DynamicIcon
                    name={persona.icon}
                    size={20}
                    className="text-court-text/80"
                  />

                  {/* Lock overlay for opponent */}
                  {isOpponent && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <Lock size={18} className="text-court-text-ter" />
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-4">
                  {/* Name + subtitle row */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-bold text-court-text leading-snug">
                        {persona.name}
                      </h3>
                      <p className="text-court-xs text-court-text-ter mt-0.5">
                        {persona.subtitle}
                      </p>
                    </div>
                    <Tag color={tag.color} small>
                      {tag.label}
                    </Tag>
                  </div>

                  {/* Description */}
                  <p className="text-court-sm text-court-text-sec leading-relaxed mt-2">
                    {MODE_DESCRIPTIONS[key]}
                  </p>

                  {/* Last practiced indicator */}
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <Clock size={11} className="text-court-text-ter shrink-0" />
                    <span className="text-court-xs text-court-text-ter">
                      {isOpponent
                        ? "Available soon"
                        : practiced
                          ? `Last practiced: ${practiced}`
                          : "Not yet tried"}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Free tier info */}
      <motion.div
        className="px-4 mt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.35 }}
      >
        <Card className="p-4 bg-green-500/[0.06] border-green-500/15">
          <div className="flex gap-2.5 items-center">
            <Lightbulb size={24} className="text-green-500 shrink-0" />
            <div>
              <p className="text-court-sm font-semibold text-court-text">
                Free tier: 3 sessions per month
              </p>
              <p className="text-court-xs text-court-text-ter">
                Upgrade to Premium for unlimited Moot Court practice
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
