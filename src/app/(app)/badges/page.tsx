"use client";

import { useState } from "react";
import { Card, Tag, ProgressBar, DynamicIcon, Skeleton } from "@/components/ui";
import { BADGE_DEFINITIONS } from "@/lib/constants/app";
import { Award, Lock, Trophy } from "lucide-react";
import { anyApi } from "convex/server";
import { useDemoQuery } from "@/hooks/useDemoSafe";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// ── Demo badge data (used when no backend) ──
const DEMO_BADGES = [
  { ...BADGE_DEFINITIONS[0], description: "Complete your first moot session", earned: true },
  { ...BADGE_DEFINITIONS[1], description: "Complete 5 moot sessions", earned: true },
  { ...BADGE_DEFINITIONS[2], description: "Complete 20 moot sessions", earned: false },
  { ...BADGE_DEFINITIONS[3], description: "Maintain a 7-day practice streak", earned: true },
  { ...BADGE_DEFINITIONS[4], description: "Maintain a 30-day practice streak", earned: false },
  { ...BADGE_DEFINITIONS[5], description: "Maintain a 100-day practice streak", earned: false },
  { ...BADGE_DEFINITIONS[6], description: "Receive your first commendation", earned: true },
  { ...BADGE_DEFINITIONS[7], description: "Receive 50 commendations from peers", earned: false },
  { ...BADGE_DEFINITIONS[8], description: "Complete 5 AI Judge practice sessions", earned: true },
  { ...BADGE_DEFINITIONS[9], description: "Reach 50 followers on Ratio", earned: true },
  { name: "First Decade", icon: "Landmark", category: "moots", description: "Complete 10 moot sessions", earned: false, requirement: { type: "moots_completed", threshold: 10 } },
  { name: "Night Owl", icon: "BookOpen", category: "streak", description: "Log practice after midnight 3 times", earned: false, requirement: { type: "special", threshold: 3 } },
];

type BadgeItem = {
  name: string;
  icon: string;
  category: string;
  description: string;
  earned: boolean;
  requirement: { type: string; threshold: number };
};

const CATEGORIES = ["All", "Moots", "Streaks", "Society", "Skill"];
const CATEGORY_MAP: Record<string, string> = {
  All: "all",
  Moots: "moots",
  Streaks: "streak",
  Society: "society",
  Skill: "skill",
};

export default function BadgesPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  // Convex queries (skip in demo mode via useDemoQuery)
  const allBadges = useDemoQuery(anyApi.badges_queries.getAll);
  const myBadges = useDemoQuery(anyApi.badges_queries.getMyBadges);

  const isLoading = CONVEX_URL && (allBadges === undefined || myBadges === undefined);

  // Build unified badge list with earned status
  const badges: BadgeItem[] = (() => {
    if (!CONVEX_URL || !allBadges) return DEMO_BADGES;
    const earnedSet = new Set((myBadges ?? []).map((b: { badgeId: string }) => b.badgeId));
    return allBadges.map((b: { _id: string; name: string; icon: string; category: string; description?: string; requirement?: { type: string; threshold: number } }) => ({
      name: b.name,
      icon: b.icon,
      category: b.category,
      description: b.description ?? "",
      earned: earnedSet.has(b._id),
      requirement: b.requirement ?? { type: "unknown", threshold: 0 },
    }));
  })();

  const earnedCount = badges.filter((b) => b.earned).length;
  const totalCount = badges.length;

  const filtered =
    activeCategory === "All"
      ? badges
      : badges.filter((b) => b.category === CATEGORY_MAP[activeCategory]);

  const nextBadge = badges.find(
    (b) => !b.earned && b.category === "moots"
  );

  if (isLoading) {
    return (
      <div className="pb-6 md:max-w-content-medium mx-auto">
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Award size={20} className="text-gold" />
            <h1 className="font-serif text-2xl font-bold text-court-text">Badges & Achievements</h1>
          </div>
        </div>
        <div className="px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-court" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Award size={20} className="text-gold" />
          <h1 className="font-serif text-2xl font-bold text-court-text">
            Badges & Achievements
          </h1>
        </div>
        <p className="text-xs text-court-text-sec mt-1">
          Track your milestones and unlock achievements
        </p>
      </div>

      {/* Stats Header */}
      <section className="px-4 md:px-6 lg:px-8 mb-4">
        <Card highlight className="p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-dim flex items-center justify-center">
            <Trophy size={24} className="text-gold" />
          </div>
          <div className="flex-1">
            <p className="font-serif text-2xl font-bold text-gold">{earnedCount}</p>
            <p className="text-court-sm text-court-text-sec">
              earned out of <span className="text-court-text font-semibold">{totalCount}</span> total
            </p>
          </div>
          <div className="text-right">
            <p className="font-serif text-xl font-bold text-court-text">
              {totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0}%
            </p>
            <p className="text-court-xs text-court-text-ter uppercase tracking-wider">
              Complete
            </p>
          </div>
        </Card>
      </section>

      {/* Category Filter */}
      <div className="px-4 md:px-6 lg:px-8 mb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 min-h-[44px] rounded-full text-court-sm font-bold whitespace-nowrap border transition-all ${
                activeCategory === cat
                  ? "border-gold/40 bg-gold-dim text-gold"
                  : "border-court-border text-court-text-ter hover:text-court-text-sec"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Badge Grid */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {filtered.map((badge) => (
            <Card
              key={badge.name}
              className={`p-3 sm:p-3.5 text-center relative overflow-hidden transition-all ${
                badge.earned
                  ? "hover:border-white/10"
                  : "opacity-50 grayscale"
              }`}
              highlight={badge.earned}
            >
              {!badge.earned && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-7 h-7 rounded-full bg-navy/80 flex items-center justify-center">
                    <Lock size={14} className="text-court-text-ter" />
                  </div>
                </div>
              )}

              <div
                className={`w-12 h-12 rounded-court mx-auto flex items-center justify-center mb-2 ${
                  badge.earned ? "bg-gold-dim" : "bg-white/[0.04]"
                }`}
              >
                <DynamicIcon
                  name={badge.icon}
                  size={22}
                  className={badge.earned ? "text-gold" : "text-court-text-ter"}
                />
              </div>
              <p
                className={`text-court-sm font-bold leading-tight mb-1 ${
                  badge.earned ? "text-court-text" : "text-court-text-ter"
                }`}
              >
                {badge.name}
              </p>
              <p className="text-court-xs text-court-text-ter leading-snug">
                {badge.description}
              </p>
              {badge.earned && (
                <div className="mt-2">
                  <Tag color="green" small>
                    EARNED
                  </Tag>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Progress Toward Next Badge */}
      {nextBadge && (
        <section className="px-4 md:px-6 lg:px-8 mt-6">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-court bg-gold-dim flex items-center justify-center">
                <DynamicIcon name={nextBadge.icon} size={20} className="text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-court-base font-bold text-court-text">
                  Next: {nextBadge.name}
                </p>
                <p className="text-court-sm text-court-text-sec">
                  {nextBadge.description}
                </p>
              </div>
            </div>
            <ProgressBar pct={40} height={6} />
            <p className="text-court-sm text-court-text-ter mt-2">
              <span className="text-gold font-semibold">8 of {nextBadge.requirement.threshold}</span>{" "}
              moots completed &mdash; {nextBadge.requirement.threshold - 8} more to earn &ldquo;{nextBadge.name}&rdquo;
            </p>
          </Card>
        </section>
      )}
    </div>
  );
}
