"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Card, Tag, Button } from "@/components/ui";
import type { CaseSpotlightData } from "@/lib/ai/topic-engine";

export default function CaseSpotlight({
  spotlight,
  onViewBreakdown,
}: {
  spotlight: CaseSpotlightData;
  onViewBreakdown: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
    >
      <Card className="border-t-2 border-t-gold/30 overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gold" />
            <h3 className="font-serif text-base font-bold text-court-text">
              Case Spotlight
            </h3>
          </div>

          {/* Case name */}
          <h4 className="font-serif font-bold text-court-text text-court-base leading-snug">
            {spotlight.caseName}
          </h4>

          {/* Citation metadata */}
          <p className="text-court-xs text-court-text-ter">
            {spotlight.citation} &middot; {spotlight.year} &middot;{" "}
            {spotlight.court}
          </p>

          {/* Summary */}
          <p className="text-court-sm text-court-text-sec leading-relaxed">
            {spotlight.summary}
          </p>

          {/* Significance */}
          <p className="text-court-sm text-court-text-sec italic leading-relaxed">
            {spotlight.significance}
          </p>

          {/* Tags */}
          {spotlight.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {spotlight.tags.map((tag) => (
                <Tag key={tag} color="blue" small>
                  {tag}
                </Tag>
              ))}
            </div>
          )}

          {/* Action */}
          <div className="pt-1">
            <Button variant="outline" size="sm" onClick={onViewBreakdown}>
              Post Your Breakdown
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
