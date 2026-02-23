"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { Card, Button } from "@/components/ui";
import type { DiscussionPrompt } from "@/lib/ai/topic-engine";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const DIFFICULTY_DOT: Record<string, string> = {
  foundation: "bg-green-500",
  intermediate: "bg-gold",
  advanced: "bg-burgundy",
};

export default function DiscussionPrompts({
  prompts,
  onEngage,
}: {
  prompts: DiscussionPrompt[];
  onEngage: (prompt: DiscussionPrompt) => void;
}) {
  return (
    <div>
      {/* Section header */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <Lightbulb size={16} className="text-gold" />
          <h3 className="font-serif text-base font-bold text-court-text">
            Discussion Prompts
          </h3>
        </div>
        <p className="text-court-xs text-court-text-ter ml-6">
          Quick questions to sharpen your thinking
        </p>
      </div>

      {/* Prompt list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        {prompts.map((prompt) => (
          <motion.div key={prompt.id} variants={itemVariants}>
            <Card
              className="p-3.5 group"
              onClick={() => onEngage(prompt)}
            >
              <div className="space-y-2">
                {/* Question */}
                <p className="font-serif text-court-base font-medium text-court-text leading-snug">
                  {prompt.question}
                </p>

                {/* Context */}
                <p className="text-court-xs text-court-text-ter leading-relaxed">
                  {prompt.context}
                </p>

                {/* Difficulty + action */}
                <div className="flex items-center justify-between pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        DIFFICULTY_DOT[prompt.difficulty] ?? "bg-gold"
                      )}
                    />
                    <span className="text-court-xs text-court-text-ter capitalize">
                      {prompt.difficulty}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Join Discussion
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
