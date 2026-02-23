"use client";

import { motion } from "framer-motion";
import { Users, Flame, TrendingUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { Card } from "@/components/ui";

// Simple deterministic hash from string to number (consistent across renders)
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export default function LivePulse({
  moduleSlug,
  moduleTitle,
}: {
  moduleSlug: string;
  moduleTitle: string;
}) {
  const h = hashSlug(moduleSlug);

  const advocatesOnline = (h % 23) + 3;
  const controversialTopic =
    moduleSlug === "criminal"
      ? "Mandatory life sentences"
      : moduleSlug === "contract"
        ? "Good faith obligations"
        : moduleSlug === "tort"
          ? "Privacy tort recognition"
          : "Parliamentary sovereignty limits";
  const risingTopic =
    moduleSlug === "criminal"
      ? "Joint enterprise reform"
      : moduleSlug === "contract"
        ? "Digital contract formation"
        : moduleSlug === "tort"
          ? "AI liability frameworks"
          : "Devolution disputes";
  const debatesThisMonth = ((h >> 3) % 40) + 12;
  const activeDiscussions = ((h >> 6) % 15) + 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="p-4 space-y-3">
        {/* Advocates online */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="text-court-xs text-court-text-sec">
            <span className="text-court-text font-semibold">{advocatesOnline}</span>{" "}
            advocates studying now
          </span>
        </div>

        {/* Controversial + rising */}
        <div className="space-y-1.5">
          <div className="flex items-start gap-2 text-court-xs text-court-text-ter">
            <Flame size={12} className="text-orange-400 mt-0.5 shrink-0" />
            <span>
              Most controversial this week:{" "}
              <span className="text-court-text-sec">{controversialTopic}</span>
            </span>
          </div>
          <div className="flex items-start gap-2 text-court-xs text-court-text-ter">
            <TrendingUp size={12} className="text-gold mt-0.5 shrink-0" />
            <span>
              Rising topic:{" "}
              <span className="text-court-text-sec">{risingTopic}</span>
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-1 border-t border-court-border-light">
          <div className="flex items-center gap-1.5 text-court-xs text-court-text-ter">
            <MessageCircle size={11} />
            <span>{debatesThisMonth} debates this month</span>
          </div>
          <div className="flex items-center gap-1.5 text-court-xs text-court-text-ter">
            <Users size={11} />
            <span>{activeDiscussions} active discussions</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
