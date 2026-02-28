"use client";

import { useState, useMemo } from "react";
import { Avatar, Tag, Card, Skeleton } from "@/components/ui";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { anyApi } from "convex/server";
import { useDemoQuery } from "@/hooks/useDemoSafe";
import PageWithPanel from "@/components/shared/PageWithPanel";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// ── Demo Data (used when no backend) ──
const DEMO_ADVOCATES = [
  { fullName: "Fatima Al-Rashid", universityShort: "Oxford", chamber: "Gray's", totalPoints: 2840, totalMoots: 56 },
  { fullName: "Daniel Wright", universityShort: "Cambridge", chamber: "Lincoln's", totalPoints: 2610, totalMoots: 48 },
  { fullName: "Priya Sharma", universityShort: "KCL", chamber: "Lincoln's", totalPoints: 2380, totalMoots: 41 },
  { fullName: "Marcus Williams", universityShort: "Manchester", chamber: "Middle", totalPoints: 2150, totalMoots: 38 },
  { fullName: "Sophie Chen", universityShort: "UCL", chamber: "Gray's", totalPoints: 1920, totalMoots: 31 },
  { fullName: "Oliver Greenwood", universityShort: "Bristol", chamber: "Inner", totalPoints: 1870, totalMoots: 29 },
  { fullName: "Amira Hassan", universityShort: "Edinburgh", chamber: "Gray's", totalPoints: 1810, totalMoots: 27 },
  { fullName: "Liam O'Brien", universityShort: "Leeds", chamber: "Middle", totalPoints: 1750, totalMoots: 26 },
  { fullName: "Charlotte Baker", universityShort: "Durham", chamber: "Lincoln's", totalPoints: 1690, totalMoots: 25 },
  { fullName: "Ravi Patel", universityShort: "Warwick", chamber: "Inner", totalPoints: 1640, totalMoots: 24 },
  { fullName: "Emma Thompson", universityShort: "Nottingham", chamber: "Gray's", totalPoints: 1580, totalMoots: 22 },
  { fullName: "James Okafor", universityShort: "LSE", chamber: "Inner", totalPoints: 1520, totalMoots: 19 },
  { fullName: "Hannah Davies", universityShort: "Cardiff", chamber: "Middle", totalPoints: 1480, totalMoots: 18 },
  { fullName: "Ali Giquina", universityShort: "UCL", chamber: "Gray's", totalPoints: 1450, totalMoots: 23 },
  { fullName: "Zara Mahmood", universityShort: "QMUL", chamber: "Lincoln's", totalPoints: 1380, totalMoots: 17 },
  { fullName: "Ben Foster", universityShort: "Sheffield", chamber: "Inner", totalPoints: 1320, totalMoots: 16 },
  { fullName: "Lucy Winters", universityShort: "Exeter", chamber: "Gray's", totalPoints: 1260, totalMoots: 15 },
  { fullName: "Kofi Mensah", universityShort: "Birmingham", chamber: "Middle", totalPoints: 1200, totalMoots: 14 },
  { fullName: "Sarah Langton", universityShort: "Glasgow", chamber: "Lincoln's", totalPoints: 1140, totalMoots: 12 },
  { fullName: "Tom Henderson", universityShort: "Bristol", chamber: "Middle", totalPoints: 1080, totalMoots: 10 },
];

const TABS = ["National", "University", "Chamber", "Monthly"];

const MEDAL_BG = [
  "bg-gold-dim border-gold/25",
  "bg-gray-400/10 border-gray-400/20",
  "bg-orange-400/10 border-orange-400/20",
];

const MEDAL_ICONS = [
  <Trophy key="gold" size={20} className="text-gold" />,
  <Medal key="silver" size={18} className="text-gray-300" />,
  <Medal key="bronze" size={18} className="text-orange-400" />,
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Convex queries (skip in demo mode via useDemoQuery)
  const leaderboard = useDemoQuery(anyApi.profiles.getLeaderboard, { limit: 50 });
  const myProfile = useDemoQuery(anyApi.users.myProfile);

  // Resolve data source
  const isLoading = CONVEX_URL && leaderboard === undefined;
  const allAdvocates = leaderboard ?? DEMO_ADVOCATES;

  // Derive the current user's university and chamber for filtering
  const myUniversity = myProfile
    ? (myProfile as { universityShort?: string }).universityShort
    : CONVEX_URL
      ? undefined
      : DEMO_ADVOCATES[13].universityShort; // Demo: Ali Giquina's university
  const myChamber = myProfile
    ? (myProfile as { chamber?: string }).chamber
    : CONVEX_URL
      ? undefined
      : DEMO_ADVOCATES[13].chamber; // Demo: Ali Giquina's chamber

  // Filter advocates based on the active tab
  const advocates = useMemo(() => {
    switch (activeTab) {
      case 1: // University — show only advocates from the user's university
        if (!myUniversity) return allAdvocates;
        return allAdvocates.filter(
          (a: Record<string, unknown>) => a.universityShort === myUniversity
        );
      case 2: // Chamber — show only advocates from the user's chamber
        if (!myChamber) return allAdvocates;
        return allAdvocates.filter(
          (a: Record<string, unknown>) => a.chamber === myChamber
        );
      case 3: // Monthly — show all (no date data available; same dataset, different label)
      case 0: // National — show all
      default:
        return allAdvocates;
    }
  }, [activeTab, allAdvocates, myUniversity, myChamber]);

  // Find current user's position in the filtered leaderboard
  const myIndex = myProfile
    ? advocates.findIndex(
        (a: Record<string, unknown>) => "userId" in a && a.userId === (myProfile as { userId: string }).userId
      )
    : CONVEX_URL
      ? -1
      : advocates.findIndex(
          (a: typeof DEMO_ADVOCATES[number]) =>
            a.fullName === DEMO_ADVOCATES[13].fullName
        ); // Demo mode: find Ali Giquina in filtered list

  const top3 = advocates.slice(0, 3);
  const rest = advocates.slice(3);

  if (isLoading) {
    return (
      <PageWithPanel panelPosition="right" heading="National Rankings" subheading="The finest advocates across all UK law schools">
      <div className="pb-6 lg:max-w-none md:max-w-content-medium mx-auto">
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={20} className="text-gold" />
            <h1 className="font-serif text-2xl font-bold text-court-text">National Rankings</h1>
          </div>
          <p className="text-court-sm text-court-text-sec">Top advocates across all UK law schools</p>
        </div>
        <div className="px-4 md:px-6 lg:px-8 space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-court" />
          ))}
        </div>
      </div>
      </PageWithPanel>
    );
  }

  return (
    <PageWithPanel panelPosition="right" heading="National Rankings" subheading="The finest advocates across all UK law schools">
    <div className="pb-6 lg:max-w-none md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-gold" />
          <h1 className="font-serif text-2xl font-bold text-court-text">
            {activeTab === 0 && "National Rankings"}
            {activeTab === 1 && "University Rankings"}
            {activeTab === 2 && "Chamber Rankings"}
            {activeTab === 3 && "Monthly Rankings"}
          </h1>
        </div>
        <p className="text-court-sm text-court-text-sec">
          {activeTab === 0 && "Top advocates across all UK law schools"}
          {activeTab === 1 && (myUniversity ? `Top advocates at ${myUniversity}` : "Top advocates at your university")}
          {activeTab === 2 && (myChamber ? `Top advocates in ${myChamber}` : "Top advocates in your chamber")}
          {activeTab === 3 && "Top advocates this month"}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 min-h-[44px] rounded-full text-court-sm font-bold whitespace-nowrap border transition-all ${
                activeTab === i
                  ? "border-gold/40 bg-gold-dim text-gold"
                  : "border-court-border text-court-text-ter hover:text-court-text-sec"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Podium — Top 3 */}
      {top3.length >= 3 && (
        <section className="px-4 md:px-6 lg:px-8 mb-6">
          <div className="flex justify-center items-end gap-1 sm:gap-2.5">
            {/* Silver — 2nd */}
            <div className="flex-1 min-w-0 max-w-[95px] sm:max-w-[130px] text-center">
              <Avatar initials={getInitials(top3[1].fullName)} chamber={top3[1].chamber} size="lg" />
              <p className="text-court-sm font-bold text-court-text mt-1.5 truncate">
                {top3[1].fullName.split(" ")[0]}
              </p>
              <p className="text-court-xs text-court-text-ter truncate">{top3[1].universityShort}</p>
              <div className={`mt-2 py-2.5 rounded-lg border ${MEDAL_BG[1]} flex flex-col items-center`}>
                <div className="flex justify-center">{MEDAL_ICONS[1]}</div>
                <p className="text-court-xs font-bold text-court-text mt-0.5">{top3[1].totalPoints.toLocaleString()}</p>
                <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
              </div>
              <div className="h-16 bg-gray-400/10 rounded-b-lg mt-1 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-gray-400/60">2</span>
              </div>
            </div>

            {/* Gold — 1st */}
            <div className="flex-1 min-w-0 max-w-[105px] sm:max-w-[130px] text-center -mt-4">
              <div className="flex justify-center mb-1">
                <Crown size={18} className="text-gold" />
              </div>
              <Avatar initials={getInitials(top3[0].fullName)} chamber={top3[0].chamber} size="xl" border />
              <p className="text-court-base font-bold text-court-text mt-1.5 truncate">
                {top3[0].fullName.split(" ")[0]}
              </p>
              <p className="text-court-xs text-court-text-ter truncate">{top3[0].universityShort}</p>
              <div className={`mt-2 py-3 rounded-lg border ${MEDAL_BG[0]} flex flex-col items-center`}>
                <div className="flex justify-center">{MEDAL_ICONS[0]}</div>
                <p className="text-court-sm font-bold text-gold mt-0.5">{top3[0].totalPoints.toLocaleString()}</p>
                <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
              </div>
              <div className="h-24 bg-gold/10 rounded-b-lg mt-1 flex items-center justify-center">
                <span className="font-serif text-3xl font-bold text-gold/60">1</span>
              </div>
            </div>

            {/* Bronze — 3rd */}
            <div className="flex-1 min-w-0 max-w-[95px] sm:max-w-[130px] text-center">
              <Avatar initials={getInitials(top3[2].fullName)} chamber={top3[2].chamber} size="lg" />
              <p className="text-court-sm font-bold text-court-text mt-1.5 truncate">
                {top3[2].fullName.split(" ")[0]}
              </p>
              <p className="text-court-xs text-court-text-ter truncate">{top3[2].universityShort}</p>
              <div className={`mt-2 py-2.5 rounded-lg border ${MEDAL_BG[2]} flex flex-col items-center`}>
                <div className="flex justify-center">{MEDAL_ICONS[2]}</div>
                <p className="text-court-xs font-bold text-court-text mt-0.5">{top3[2].totalPoints.toLocaleString()}</p>
                <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
              </div>
              <div className="h-10 bg-orange-400/10 rounded-b-lg mt-1 flex items-center justify-center">
                <span className="font-serif text-2xl font-bold text-orange-400/60">3</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Remaining Rankings */}
      <section className="px-4 md:px-6 lg:px-8 space-y-2">
        {rest.map((person: typeof DEMO_ADVOCATES[number], idx: number) => {
          const rank = idx + 4;
          const isMe = idx + 3 === myIndex;
          return (
            <Card key={person.fullName + rank} highlight={isMe} className="px-3.5 py-3 flex items-center gap-3">
              <span className="text-court-base font-bold text-court-text-ter w-7 text-center font-serif">
                {rank}
              </span>
              <Avatar initials={getInitials(person.fullName)} chamber={person.chamber} size="sm" />
              <div className="flex-1 min-w-0">
                <p className={`text-court-base font-bold truncate ${isMe ? "text-gold" : "text-court-text"}`}>
                  {person.fullName} {isMe && <span className="text-court-xs font-normal">(You)</span>}
                </p>
                <p className="text-court-xs text-court-text-ter truncate">
                  {person.universityShort} · {person.totalMoots} moots
                </p>
              </div>
              <Tag color={isMe ? "gold" : "blue"}>{person.chamber}</Tag>
              <div className="text-right ml-1">
                <p className="text-court-base font-bold text-court-text font-serif">
                  {person.totalPoints.toLocaleString()}
                </p>
                <p className="text-court-xs text-court-text-ter uppercase">points</p>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Your Position — pinned at bottom */}
      {myIndex >= 0 && myIndex < advocates.length && (
        <section className="px-4 md:px-6 lg:px-8 mt-6">
          <Card highlight className="p-4 border-gold/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-dim flex items-center justify-center">
                <TrendingUp size={18} className="text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-court-xs text-court-text-ter uppercase tracking-widest">Your Position</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-serif text-2xl font-bold text-gold">#{myIndex + 1}</span>
                  <span className="text-court-sm text-court-text-sec">of {advocates.length} advocates</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-serif text-lg font-bold text-court-text">
                  {advocates[myIndex].totalPoints.toLocaleString()}
                </p>
                <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
              </div>
            </div>
            {myIndex > 0 && myIndex - 1 < advocates.length && (
              <div className="mt-3 pt-3 border-t border-court-border-light">
                <p className="text-court-sm text-court-text-sec">
                  <span className="text-green-400 font-semibold">
                    +{advocates[myIndex - 1].totalPoints - advocates[myIndex].totalPoints + 1} pts
                  </span>{" "}
                  to overtake{" "}
                  <span className="text-court-text font-medium">
                    {advocates[myIndex - 1].fullName}
                  </span>{" "}
                  at #{myIndex}
                </p>
              </div>
            )}
          </Card>
        </section>
      )}
    </div>
    </PageWithPanel>
  );
}
