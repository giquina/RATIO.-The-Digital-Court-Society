"use client";

import { motion } from "framer-motion";
import { Bot, RotateCcw } from "lucide-react";
import { Card, Tag, Button, DynamicIcon } from "@/components/ui";
import type { TopicSuggestion } from "@/lib/ai/topic-engine";
import { TOPIC_TYPE_META } from "@/lib/ai/topic-engine";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const DIFFICULTY_COLOR: Record<string, "green" | "gold" | "burgundy"> = {
  foundation: "green",
  intermediate: "gold",
  advanced: "burgundy",
};

export default function AISuggestions({
  suggestions,
  onCreateDebate,
  onRefresh,
}: {
  suggestions: TopicSuggestion[];
  onCreateDebate: (suggestion: TopicSuggestion) => void;
  onRefresh?: () => void;
}) {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-gold" />
          <h3 className="font-serif text-base font-bold text-court-text">
            AI-Suggested Topics
          </h3>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg text-court-text-ter hover:text-gold hover:bg-white/5 transition-colors duration-200"
            aria-label="Refresh suggestions"
          >
            <RotateCcw size={14} />
          </button>
        )}
      </div>

      {/* Suggestion cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {suggestions.slice(0, 5).map((suggestion) => {
          const meta = TOPIC_TYPE_META[suggestion.type];
          return (
            <motion.div key={suggestion.id} variants={itemVariants}>
              <Card className="p-4">
                <div className="space-y-2.5">
                  {/* Type tag + difficulty */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag color={meta.color} small>
                      <span className="flex items-center gap-1">
                        <DynamicIcon
                          name={meta.icon}
                          size={10}
                          className="inline-block"
                        />
                        {meta.label}
                      </span>
                    </Tag>
                    <Tag color={DIFFICULTY_COLOR[suggestion.difficulty]} small>
                      {suggestion.difficulty}
                    </Tag>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif font-bold text-court-text text-court-base leading-snug">
                    {suggestion.title}
                  </h4>

                  {/* Description */}
                  <p className="text-court-sm text-court-text-sec line-clamp-2 leading-relaxed">
                    {suggestion.description}
                  </p>

                  {/* References */}
                  {suggestion.references.length > 0 && (
                    <p className="text-court-xs text-court-text-ter italic line-clamp-1">
                      {suggestion.references.join("; ")}
                    </p>
                  )}

                  {/* Action */}
                  <div className="pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCreateDebate(suggestion)}
                    >
                      Create Debate
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
