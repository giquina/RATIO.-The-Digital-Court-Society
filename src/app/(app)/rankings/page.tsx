"use client";

import { useState } from "react";
import { Avatar, Tag, Card } from "@/components/ui";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";

// ── Demo Data: 20 advocates ──
const ADVOCATES = [
  { name: "Fatima Al-Rashid", initials: "FA", uni: "Oxford", chamber: "Gray's", points: 2840, moots: 56 },
  { name: "Daniel Wright", initials: "DW", uni: "Cambridge", chamber: "Lincoln's", points: 2610, moots: 48 },
  { name: "Priya Sharma", initials: "PS", uni: "KCL", chamber: "Lincoln's", points: 2380, moots: 41 },
  { name: "Marcus Williams", initials: "MW", uni: "Manchester", chamber: "Middle", points: 2150, moots: 38 },
  { name: "Sophie Chen", initials: "SC", uni: "UCL", chamber: "Gray's", points: 1920, moots: 31 },
  { name: "Oliver Greenwood", initials: "OG", uni: "Bristol", chamber: "Inner", points: 1870, moots: 29 },
  { name: "Amira Hassan", initials: "AH", uni: "Edinburgh", chamber: "Gray's", points: 1810, moots: 27 },
  { name: "Liam O'Brien", initials: "LO", uni: "Leeds", chamber: "Middle", points: 1750, moots: 26 },
  { name: "Charlotte Baker", initials: "CB", uni: "Durham", chamber: "Lincoln's", points: 1690, moots: 25 },
  { name: "Ravi Patel", initials: "RP", uni: "Warwick", chamber: "Inner", points: 1640, moots: 24 },
  { name: "Emma Thompson", initials: "ET", uni: "Nottingham", chamber: "Gray's", points: 1580, moots: 22 },
  { name: "James Okafor", initials: "JO", uni: "LSE", chamber: "Inner", points: 1520, moots: 19 },
  { name: "Hannah Davies", initials: "HD", uni: "Cardiff", chamber: "Middle", points: 1480, moots: 18 },
  { name: "Ali Giquina", initials: "AG", uni: "UCL", chamber: "Gray's", points: 1450, moots: 23 },
  { name: "Zara Mahmood", initials: "ZM", uni: "QMUL", chamber: "Lincoln's", points: 1380, moots: 17 },
  { name: "Ben Foster", initials: "BF", uni: "Sheffield", chamber: "Inner", points: 1320, moots: 16 },
  { name: "Lucy Winters", initials: "LW", uni: "Exeter", chamber: "Gray's", points: 1260, moots: 15 },
  { name: "Kofi Mensah", initials: "KM", uni: "Birmingham", chamber: "Middle", points: 1200, moots: 14 },
  { name: "Sarah Langton", initials: "SL", uni: "Glasgow", chamber: "Lincoln's", points: 1140, moots: 12 },
  { name: "Tom Henderson", initials: "TH", uni: "Bristol", chamber: "Middle", points: 1080, moots: 10 },
];

const MY_INDEX = 13; // Ali Giquina's position in the array

const TABS = ["National", "University", "Chamber", "Monthly"];

const MEDAL_COLORS = [
  "from-yellow-400 to-yellow-600", // gold
  "from-gray-300 to-gray-500",     // silver
  "from-orange-400 to-orange-700", // bronze
];

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

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const top3 = ADVOCATES.slice(0, 3);
  const rest = ADVOCATES.slice(3);

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-gold" />
          <h1 className="font-serif text-2xl font-bold text-court-text">National Rankings</h1>
        </div>
        <p className="text-xs text-court-text-sec">
          Top advocates across all UK law schools
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-1.5 rounded-full text-court-sm font-bold whitespace-nowrap border transition-all ${
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
      <section className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="flex justify-center items-end gap-2.5">
          {/* Silver — 2nd */}
          <div className="flex-1 max-w-[130px] text-center">
            <Avatar initials={top3[1].initials} chamber={top3[1].chamber} size="lg" />
            <p className="text-court-sm font-bold text-court-text mt-1.5">
              {top3[1].name.split(" ")[0]}
            </p>
            <p className="text-court-xs text-court-text-ter">{top3[1].uni}</p>
            <div className={`mt-2 py-2.5 rounded-lg border ${MEDAL_BG[1]} flex flex-col items-center`}>
              <div className="flex justify-center">{MEDAL_ICONS[1]}</div>
              <p className="text-court-xs font-bold text-court-text mt-0.5">{top3[1].points.toLocaleString()}</p>
              <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
            </div>
            <div className="h-16 bg-gray-400/10 rounded-b-lg mt-1 flex items-center justify-center">
              <span className="font-serif text-2xl font-bold text-gray-400/60">2</span>
            </div>
          </div>

          {/* Gold — 1st */}
          <div className="flex-1 max-w-[130px] text-center -mt-4">
            <div className="flex justify-center mb-1">
              <Crown size={18} className="text-gold" />
            </div>
            <Avatar initials={top3[0].initials} chamber={top3[0].chamber} size="xl" border />
            <p className="text-court-base font-bold text-court-text mt-1.5">
              {top3[0].name.split(" ")[0]}
            </p>
            <p className="text-court-xs text-court-text-ter">{top3[0].uni}</p>
            <div className={`mt-2 py-3 rounded-lg border ${MEDAL_BG[0]} flex flex-col items-center`}>
              <div className="flex justify-center">{MEDAL_ICONS[0]}</div>
              <p className="text-court-sm font-bold text-gold mt-0.5">{top3[0].points.toLocaleString()}</p>
              <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
            </div>
            <div className="h-24 bg-gold/10 rounded-b-lg mt-1 flex items-center justify-center">
              <span className="font-serif text-3xl font-bold text-gold/60">1</span>
            </div>
          </div>

          {/* Bronze — 3rd */}
          <div className="flex-1 max-w-[130px] text-center">
            <Avatar initials={top3[2].initials} chamber={top3[2].chamber} size="lg" />
            <p className="text-court-sm font-bold text-court-text mt-1.5">
              {top3[2].name.split(" ")[0]}
            </p>
            <p className="text-court-xs text-court-text-ter">{top3[2].uni}</p>
            <div className={`mt-2 py-2.5 rounded-lg border ${MEDAL_BG[2]} flex flex-col items-center`}>
              <div className="flex justify-center">{MEDAL_ICONS[2]}</div>
              <p className="text-court-xs font-bold text-court-text mt-0.5">{top3[2].points.toLocaleString()}</p>
              <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
            </div>
            <div className="h-10 bg-orange-400/10 rounded-b-lg mt-1 flex items-center justify-center">
              <span className="font-serif text-2xl font-bold text-orange-400/60">3</span>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining Rankings */}
      <section className="px-4 md:px-6 lg:px-8 space-y-2">
        {rest.map((person, idx) => {
          const rank = idx + 4;
          const isMe = idx + 3 === MY_INDEX;
          return (
            <Card key={person.name} highlight={isMe} className="px-3.5 py-3 flex items-center gap-3">
              <span className="text-sm font-bold text-court-text-ter w-7 text-center font-serif">
                {rank}
              </span>
              <Avatar initials={person.initials} chamber={person.chamber} size="sm" />
              <div className="flex-1 min-w-0">
                <p className={`text-court-base font-bold ${isMe ? "text-gold" : "text-court-text"}`}>
                  {person.name} {isMe && <span className="text-court-xs font-normal">(You)</span>}
                </p>
                <p className="text-court-xs text-court-text-ter">
                  {person.uni} · {person.moots} moots
                </p>
              </div>
              <Tag color={isMe ? "gold" : "blue"}>{person.chamber}</Tag>
              <div className="text-right ml-1">
                <p className="text-sm font-bold text-court-text font-serif">
                  {person.points.toLocaleString()}
                </p>
                <p className="text-court-xs text-court-text-ter uppercase">points</p>
              </div>
            </Card>
          );
        })}
      </section>

      {/* Your Position — pinned at bottom */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <Card highlight className="p-4 border-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-dim flex items-center justify-center">
              <TrendingUp size={18} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-court-xs text-court-text-ter uppercase tracking-widest">Your Position</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-serif text-2xl font-bold text-gold">#14</span>
                <span className="text-xs text-court-text-sec">of {ADVOCATES.length} advocates</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-lg font-bold text-court-text">
                {ADVOCATES[MY_INDEX].points.toLocaleString()}
              </p>
              <p className="text-court-xs text-court-text-ter uppercase tracking-wider">points</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-court-border-light">
            <p className="text-court-sm text-court-text-sec">
              <span className="text-green-400 font-semibold">+30 pts</span> to overtake{" "}
              <span className="text-court-text font-medium">
                {ADVOCATES[MY_INDEX - 1].name}
              </span>{" "}
              at #{MY_INDEX}
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
