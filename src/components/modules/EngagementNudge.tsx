"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp, Award, Star, Flame, Medal, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { Card, Tag, Button } from "@/components/ui";

// ── Types ──

interface EngagementNudgeProps {
  totalMoots: number;
  totalPoints: number;
  streakDays: number;
  moduleSlug: string;
  moduleTitle: string;
  onAction: (action: string) => void;
}

// ── Engagement tier logic ──

interface NudgeTier {
  message: string;
  description: string;
  cta: string;
  action: string;
  icon: React.ReactNode;
}

function resolveNudgeTier(
  totalMoots: number,
  totalPoints: number,
  moduleTitle: string
): NudgeTier {
  if (totalMoots >= 20) {
    return {
      message: "Your expertise is valued",
      description: `As an experienced advocate, your perspective on reform debates in ${moduleTitle} would be highly valued.`,
      cta: "Propose a Reform Motion",
      action: "reform_motion",
      icon: <Star size={20} className="text-gold" />,
    };
  }
  if (totalMoots >= 5) {
    return {
      message: "You are making an impact",
      description: `Your contributions are building the ${moduleTitle} community. Consider analysing a landmark case.`,
      cta: "Write a Case Analysis",
      action: "case_analysis",
      icon: <Award size={20} className="text-gold" />,
    };
  }
  if (totalMoots >= 1) {
    return {
      message: "Building momentum",
      description: `You have completed ${totalMoots} session${totalMoots === 1 ? "" : "s"}. Try a more advanced topic in ${moduleTitle}.`,
      cta: "Explore Advanced Topics",
      action: "explore_advanced",
      icon: <TrendingUp size={20} className="text-green-500" />,
    };
  }
  // Observer
  return {
    message: "Ready to lead your first debate?",
    description: `You have been studying ${moduleTitle}. Start a debate to deepen your understanding.`,
    cta: "Create Your First Debate",
    action: "create_first",
    icon: <Scale size={20} className="text-gold" />,
  };
}

// ── Badge definitions ──

interface BadgeItem {
  label: string;
  earned: boolean;
  iconNode: React.ReactNode;
}

function resolveBadges(totalMoots: number, streakDays: number): BadgeItem[] {
  return [
    {
      label: "Top Debater",
      earned: totalMoots >= 10,
      iconNode: <Medal size={14} className={totalMoots >= 10 ? "text-gold" : "text-court-text-ter"} />,
    },
    {
      label: "Case Analyst",
      earned: false,
      iconNode: <Lock size={14} className="text-court-text-ter" />,
    },
    {
      label: "Weekly Contributor",
      earned: streakDays >= 7,
      iconNode: <Check size={14} className={streakDays >= 7 ? "text-green-500" : "text-court-text-ter"} />,
    },
  ];
}

// ── Component ──

export default function EngagementNudge({
  totalMoots,
  totalPoints,
  streakDays,
  moduleSlug,
  moduleTitle,
  onAction,
}: EngagementNudgeProps) {
  const tier = useMemo(
    () => resolveNudgeTier(totalMoots, totalPoints, moduleTitle),
    [totalMoots, totalPoints, moduleTitle]
  );

  const badges = useMemo(
    () => resolveBadges(totalMoots, streakDays),
    [totalMoots, streakDays]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-3"
    >
      {/* Main nudge card */}
      <Card className="overflow-hidden">
        <div className="flex">
          {/* Gradient left border accent */}
          <div className="w-1 shrink-0 bg-gradient-to-b from-gold/60 to-gold/10" />

          <div className="flex gap-3.5 p-4 flex-1 min-w-0">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-gold-dim flex items-center justify-center shrink-0">
              {tier.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <h4 className="font-serif font-medium text-court-text text-court-base leading-snug">
                {tier.message}
              </h4>
              <p className="text-court-sm text-court-text-sec leading-relaxed">
                {tier.description}
              </p>

              {/* Streak badge (conditional) */}
              {streakDays >= 7 && (
                <div className="pt-0.5">
                  <Tag color="orange" small>
                    <span className="inline-flex items-center gap-1">
                      <Flame size={10} className="inline-block" />
                      {streakDays}-day streak in progress
                    </span>
                  </Tag>
                </div>
              )}

              {/* CTA */}
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAction(tier.action)}
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Module achievement badges */}
      <div className="flex gap-2">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={cn(
              "flex-1 flex items-center gap-2 px-3 py-2.5 rounded-court border transition-colors",
              badge.earned
                ? "bg-navy-card border-gold/20 opacity-100"
                : "bg-navy-card border-court-border-light opacity-40"
            )}
          >
            {badge.iconNode}
            <span className="text-court-xs text-court-text-sec font-medium truncate">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
