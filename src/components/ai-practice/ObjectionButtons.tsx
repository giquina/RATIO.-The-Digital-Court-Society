"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ObjectionButtonsProps {
  onInsert: (text: string) => void;
  disabled?: boolean;
}

const QUICK_PHRASES = [
  { label: "May it please the court", text: "May it please the court, " },
  { label: "I respectfully submit", text: "I would respectfully submit that " },
  { label: "I refer to authorities", text: "If I may refer the court to the authorities, " },
  { label: "I'm grateful", text: "I am grateful, My Lord. " },
  { label: "I distinguish that case", text: "I would seek to distinguish that authority on the basis that " },
  { label: "In the alternative", text: "In the alternative, I submit that " },
  { label: "With respect", text: "With the greatest respect, " },
  { label: "I adopt the ratio", text: "I adopt the ratio decidendi of that authority, which establishes that " },
];

/**
 * Quick-tap phrase buttons for common court language.
 * Think of these as training wheels — they help students learn
 * proper court etiquette by using it, not just reading about it.
 */
export default function ObjectionButtons({ onInsert, disabled }: ObjectionButtonsProps) {
  const [expanded, setExpanded] = useState(false);
  const visiblePhrases = expanded ? QUICK_PHRASES : QUICK_PHRASES.slice(0, 4);

  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-court-xs text-court-text-ter">Quick phrases</p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-0.5 text-court-xs text-court-text-ter hover:text-court-text transition-colors"
        >
          {expanded ? "Less" : "More"}
          {expanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>
      </div>
      <motion.div className="flex flex-wrap gap-1.5" layout>
        <AnimatePresence>
          {visiblePhrases.map((phrase) => (
            <motion.button
              key={phrase.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={() => onInsert(phrase.text)}
              disabled={disabled}
              className="px-2.5 py-1 rounded-full text-court-xs bg-gold/8 border border-gold/15 text-gold/80 hover:bg-gold/15 hover:text-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {phrase.label}
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
