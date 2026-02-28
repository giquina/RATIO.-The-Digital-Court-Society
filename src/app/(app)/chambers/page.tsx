"use client";

import Link from "next/link";
import { Card, Tag, SectionHeader, Skeleton } from "@/components/ui";
import { CHAMBERS } from "@/lib/constants/app";
import { Users, Trophy, ChevronRight, Star, Crown } from "lucide-react";
import { anyApi } from "convex/server";
import { useDemoQuery } from "@/hooks/useDemoSafe";
import PageWithPanel from "@/components/shared/PageWithPanel";
import ChambersPanel from "@/components/panels/ChambersPanel";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// ── Demo data (used when no backend) ──
const DEMO_CHAMBER_DATA = [
  { ...CHAMBERS[0], members: 342, rank: 2, activeSessions: 12, tagColor: "burgundy" as const },
  { ...CHAMBERS[1], members: 298, rank: 1, activeSessions: 15, tagColor: "blue" as const },
  { ...CHAMBERS[2], members: 256, rank: 3, activeSessions: 8, tagColor: "green" as const },
  { ...CHAMBERS[3], members: 187, rank: 4, activeSessions: 6, tagColor: "gold" as const },
];

// Static chamber metadata (icon, color, motto)
const CHAMBER_META: Record<string, { color: string; motto: string; icon: string }> = {
  "Gray's": { color: "#6B2D3E", motto: "Wisdom through advocacy", icon: "\u2696\uFE0F" },
  "Lincoln's": { color: "#2E5090", motto: "Justice through scholarship", icon: "\uD83D\uDCD8" },
  Inner: { color: "#3D6B45", motto: "Service through practice", icon: "\uD83C\uDF3F" },
  Middle: { color: "#8B6914", motto: "Excellence through tradition", icon: "\uD83C\uDFDB\uFE0F" },
};

export default function ChambersPage() {
  // Convex queries (skip in demo mode via useDemoQuery)
  const chamberStats = useDemoQuery(anyApi.profiles.getChamberStats);
  const myProfile = useDemoQuery(anyApi.users.myProfile);

  const isLoading = CONVEX_URL && chamberStats === undefined;

  // Resolve chamber data
  const chamberData = (() => {
    if (!CONVEX_URL || !chamberStats) return DEMO_CHAMBER_DATA;
    return chamberStats
      .filter((c: { name: string }) => CHAMBER_META[c.name])
      .map((c: { name: string; members: number }, idx: number) => ({
        name: c.name,
        color: CHAMBER_META[c.name].color,
        motto: CHAMBER_META[c.name].motto,
        icon: CHAMBER_META[c.name].icon,
        members: c.members,
        rank: idx + 1,
        activeSessions: 0,
        tagColor: (["burgundy", "blue", "green", "gold"] as const)[idx % 4],
      }));
  })();

  const myChamberName = myProfile?.chamber ?? (CONVEX_URL ? null : "Gray's");
  const myChamber = chamberData.find((c: { name: string }) => c.name === myChamberName);
  const sortedByRank = [...chamberData].sort((a, b) => a.rank - b.rank);

  if (isLoading) {
    return (
      <PageWithPanel panelPosition="left" heading="The Chambers" subheading="Four Inns of Court, one standard of excellence" panelContent={<ChambersPanel />}>
      <div className="pb-6 lg:max-w-none md:max-w-content-medium mx-auto">
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <h1 className="font-serif text-2xl font-bold text-court-text">Chambers</h1>
          <p className="text-court-sm text-court-text-sec mt-1">Four chambers. One standard of excellence.</p>
        </div>
        <div className="px-4 md:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-court" />
          ))}
        </div>
      </div>
      </PageWithPanel>
    );
  }

  return (
    <PageWithPanel panelPosition="left" heading="The Chambers" subheading="Four Inns of Court, one standard of excellence" panelContent={<ChambersPanel />}>
    <div className="pb-6 lg:max-w-none md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text">Chambers</h1>
        <p className="text-court-sm text-court-text-sec mt-1">
          Four chambers. One standard of excellence.
        </p>
      </div>

      {/* Your Chamber — highlighted */}
      {myChamber && (
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <h3 className="text-court-xs font-bold text-court-text-ter uppercase tracking-widest mb-2 px-1">
            Your Chamber
          </h3>
          <Link href={`/chambers/${encodeURIComponent(myChamber.name)}`}>
            <Card highlight className="p-5 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                style={{ background: myChamber.color, filter: "blur(40px)" }}
              />
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-court flex items-center justify-center text-2xl shrink-0"
                  style={{ background: `${myChamber.color}25` }}
                >
                  {myChamber.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg font-bold text-court-text">
                      {myChamber.name} Chamber
                    </h2>
                    <Tag color="gold" small>YOUR CHAMBER</Tag>
                  </div>
                  <p className="text-court-base text-court-text-sec italic mt-1">
                    &ldquo;{myChamber.motto}&rdquo;
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-court-text-ter" />
                      <span className="text-court-sm text-court-text-sec">{myChamber.members} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy size={13} className="text-court-text-ter" />
                      <span className="text-court-sm text-court-text-sec">Ranked #{myChamber.rank}</span>
                    </div>
                    {myChamber.activeSessions > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Star size={13} className="text-court-text-ter" />
                        <span className="text-court-sm text-court-text-sec">{myChamber.activeSessions} active</span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight size={18} className="text-court-text-ter mt-1" />
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* All Chambers Grid */}
      <section className="px-4 md:px-6 lg:px-8">
        <h3 className="text-court-xs font-bold text-court-text-ter uppercase tracking-widest mb-3 px-1">
          All Chambers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-2 gap-3">
          {chamberData.map((chamber: typeof DEMO_CHAMBER_DATA[number]) => {
            const isMine = chamber.name === myChamberName;
            return (
              <Link
                key={chamber.name}
                href={`/chambers/${encodeURIComponent(chamber.name)}`}
              >
                <Card
                  className="p-4 h-full hover:border-white/10 transition-all relative overflow-hidden"
                  highlight={isMine}
                >
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15"
                    style={{ background: chamber.color, filter: "blur(24px)" }}
                  />
                  <div
                    className="w-12 h-12 rounded-court flex items-center justify-center text-xl mb-3"
                    style={{ background: `${chamber.color}20` }}
                  >
                    {chamber.icon}
                  </div>
                  <h3 className="font-serif text-base font-bold text-court-text">
                    {chamber.name}
                  </h3>
                  <p className="text-court-xs text-court-text-sec italic mt-1 leading-relaxed">
                    &ldquo;{chamber.motto}&rdquo;
                  </p>
                  <div className="flex items-center gap-1 mt-3 mb-3">
                    <Users size={12} className="text-court-text-ter" />
                    <span className="text-court-xs text-court-text-ter">
                      {chamber.members} members
                    </span>
                  </div>
                  <div
                    className="text-court-sm font-bold py-1.5 rounded-lg text-center transition-colors"
                    style={{
                      background: `${chamber.color}20`,
                      color: chamber.color,
                      border: `1px solid ${chamber.color}30`,
                    }}
                  >
                    View
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Chamber League */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <SectionHeader title="Chamber League" />
        <Card className="divide-y divide-court-border-light">
          {sortedByRank.map((chamber, i) => (
            <div key={chamber.name} className="flex items-center gap-3 px-4 py-3">
              <span className="font-serif text-base font-bold text-court-text-ter w-6 text-center">
                {chamber.rank}
              </span>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                style={{ background: `${chamber.color}20` }}
              >
                {chamber.icon}
              </div>
              <div className="flex-1">
                <p className="text-court-base font-bold text-court-text">
                  {chamber.name} Chamber
                  {chamber.name === myChamberName && (
                    <span className="text-court-xs text-gold font-normal ml-1.5">(Yours)</span>
                  )}
                </p>
                <p className="text-court-xs text-court-text-ter">
                  {chamber.members} members{chamber.activeSessions > 0 ? ` · ${chamber.activeSessions} active sessions` : ""}
                </p>
              </div>
              {i === 0 && <Crown size={18} className="text-gold" />}
            </div>
          ))}
        </Card>
      </section>
    </div>
    </PageWithPanel>
  );
}
