"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, Tag, Card, Button, ProgressBar, SectionHeader } from "@/components/ui";
import { CHAMBERS, CHAMBER_COLORS } from "@/lib/constants/app";
import { Users, Trophy, TrendingUp, Activity, ArrowLeft, Crown } from "lucide-react";

// ── Demo chamber members ──
const CHAMBER_MEMBERS: Record<string, Array<{
  name: string; initials: string; uni: string; points: number; moots: number; rank: string; online: boolean;
}>> = {
  "Gray's": [
    { name: "Fatima Al-Rashid", initials: "FA", uni: "Oxford", points: 2840, moots: 56, rank: "King's Counsel", online: true },
    { name: "Sophie Chen", initials: "SC", uni: "UCL", points: 1920, moots: 31, rank: "Senior Counsel", online: false },
    { name: "Amira Hassan", initials: "AH", uni: "Edinburgh", points: 1810, moots: 27, rank: "Senior Counsel", online: true },
    { name: "Emma Thompson", initials: "ET", uni: "Nottingham", points: 1580, moots: 22, rank: "Junior Counsel", online: false },
    { name: "Ali Giquina", initials: "AG", uni: "UCL", points: 1450, moots: 23, rank: "Junior Counsel", online: true },
    { name: "Lucy Winters", initials: "LW", uni: "Exeter", points: 1260, moots: 15, rank: "Junior Counsel", online: false },
  ],
  "Lincoln's": [
    { name: "Daniel Wright", initials: "DW", uni: "Cambridge", points: 2610, moots: 48, rank: "King's Counsel", online: true },
    { name: "Priya Sharma", initials: "PS", uni: "KCL", points: 2380, moots: 41, rank: "Senior Counsel", online: true },
    { name: "Charlotte Baker", initials: "CB", uni: "Durham", points: 1690, moots: 25, rank: "Senior Counsel", online: false },
    { name: "Zara Mahmood", initials: "ZM", uni: "QMUL", points: 1380, moots: 17, rank: "Junior Counsel", online: false },
    { name: "Sarah Langton", initials: "SL", uni: "Glasgow", points: 1140, moots: 12, rank: "Junior Counsel", online: true },
  ],
  "Inner": [
    { name: "Oliver Greenwood", initials: "OG", uni: "Bristol", points: 1870, moots: 29, rank: "Senior Counsel", online: false },
    { name: "Ravi Patel", initials: "RP", uni: "Warwick", points: 1640, moots: 24, rank: "Senior Counsel", online: true },
    { name: "James Okafor", initials: "JO", uni: "LSE", points: 1520, moots: 19, rank: "Junior Counsel", online: false },
    { name: "Ben Foster", initials: "BF", uni: "Sheffield", points: 1320, moots: 16, rank: "Junior Counsel", online: true },
  ],
  "Middle": [
    { name: "Marcus Williams", initials: "MW", uni: "Manchester", points: 2150, moots: 38, rank: "King's Counsel", online: true },
    { name: "Liam O'Brien", initials: "LO", uni: "Leeds", points: 1750, moots: 26, rank: "Senior Counsel", online: false },
    { name: "Hannah Davies", initials: "HD", uni: "Cardiff", points: 1480, moots: 18, rank: "Junior Counsel", online: true },
    { name: "Kofi Mensah", initials: "KM", uni: "Birmingham", points: 1200, moots: 14, rank: "Junior Counsel", online: false },
    { name: "Tom Henderson", initials: "TH", uni: "Bristol", points: 1080, moots: 10, rank: "Pupil", online: false },
  ],
};

const CHAMBER_STATS: Record<string, { members: number; totalPoints: number; avgRank: string; activeWeek: number }> = {
  "Gray's": { members: 342, totalPoints: 48200, avgRank: "Senior Counsel", activeWeek: 87 },
  "Lincoln's": { members: 298, totalPoints: 52100, avgRank: "Senior Counsel", activeWeek: 94 },
  "Inner": { members: 256, totalPoints: 38400, avgRank: "Junior Counsel", activeWeek: 62 },
  "Middle": { members: 187, totalPoints: 29800, avgRank: "Junior Counsel", activeWeek: 45 },
};

const MY_CHAMBER = "Gray's";

export default function ChamberDetailPage() {
  const params = useParams();
  const chamberName = decodeURIComponent(params.name as string);
  const [joined, setJoined] = useState(chamberName === MY_CHAMBER);

  const chamber = CHAMBERS.find((c) => c.name === chamberName);
  if (!chamber) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <h3 className="font-serif text-lg font-bold text-court-text mb-2">Chamber Not Found</h3>
        <p className="text-sm text-court-text-ter mb-6">The chamber you are looking for does not exist.</p>
        <Link href="/chambers">
          <Button variant="outline" size="sm">Back to Chambers</Button>
        </Link>
      </div>
    );
  }

  const members = CHAMBER_MEMBERS[chamberName] ?? [];
  const stats = CHAMBER_STATS[chamberName] ?? { members: 0, totalPoints: 0, avgRank: "Pupil", activeWeek: 0 };
  const isMine = chamberName === MY_CHAMBER;

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Back link */}
      <div className="px-4 md:px-6 lg:px-8 pt-3">
        <Link
          href="/chambers"
          className="inline-flex items-center gap-1.5 text-xs text-court-text-sec hover:text-court-text transition-colors"
        >
          <ArrowLeft size={14} /> All Chambers
        </Link>
      </div>

      {/* Chamber Header */}
      <section className="px-4 md:px-6 lg:px-8 mt-3">
        <Card highlight={isMine} className="p-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${chamber.color}, transparent 70%)`,
            }}
          />
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto"
              style={{ background: `${chamber.color}25`, border: `2px solid ${chamber.color}40` }}
            >
              {chamber.icon}
            </div>
            <h1 className="font-serif text-2xl font-bold text-court-text mt-4">
              {chamber.name} Chamber
            </h1>
            <p className="text-court-base text-court-text-sec italic mt-1">
              &ldquo;{chamber.motto}&rdquo;
            </p>
            {isMine && (
              <Tag color="gold" small>YOUR CHAMBER</Tag>
            )}
          </div>
        </Card>
      </section>

      {/* Stats Grid */}
      <section className="px-4 md:px-6 lg:px-8 mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { icon: <Users size={16} className="text-court-text-sec" />, value: stats.members.toString(), label: "Members" },
          { icon: <Trophy size={16} className="text-court-text-sec" />, value: stats.totalPoints.toLocaleString(), label: "Total Points" },
          { icon: <TrendingUp size={16} className="text-court-text-sec" />, value: stats.avgRank, label: "Average Rank" },
          { icon: <Activity size={16} className="text-court-text-sec" />, value: stats.activeWeek.toString(), label: "Active This Week" },
        ].map((stat) => (
          <Card key={stat.label} className="p-3.5">
            <div className="mb-2">{stat.icon}</div>
            <p className="font-serif text-lg font-bold text-court-text">{stat.value}</p>
            <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </section>

      {/* Join / Your Chamber Button */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        {isMine ? (
          <div
            className="w-full py-3 rounded-xl text-center text-sm font-bold border"
            style={{
              background: `${chamber.color}15`,
              borderColor: `${chamber.color}30`,
              color: chamber.color,
            }}
          >
            <Crown size={16} className="inline mr-2" style={{ color: chamber.color }} />
            Your Chamber
          </div>
        ) : (
          <Button
            fullWidth
            variant={joined ? "secondary" : "primary"}
            onClick={() => setJoined(!joined)}
          >
            {joined ? "Leave Chamber" : "Join Chamber"}
          </Button>
        )}
      </section>

      {/* Member List */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <SectionHeader title={`Top Members (${members.length})`} />
        <div className="space-y-2">
          {members.map((member, i) => {
            const isMe = member.name === "Ali Giquina";
            return (
              <Card key={member.name} highlight={isMe} className="px-3.5 py-3 flex items-center gap-3">
                <span className="font-serif text-sm font-bold text-court-text-ter w-6 text-center">
                  {i + 1}
                </span>
                <Avatar
                  initials={member.initials}
                  chamber={chamberName}
                  size="sm"
                  online={member.online}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-court-base font-bold ${isMe ? "text-gold" : "text-court-text"}`}>
                    {member.name}
                    {isMe && <span className="text-court-xs font-normal ml-1">(You)</span>}
                  </p>
                  <p className="text-court-xs text-court-text-ter">
                    {member.uni} · {member.moots} moots
                  </p>
                </div>
                <Tag small>{member.rank}</Tag>
                <div className="text-right ml-1">
                  <p className="text-court-base font-bold text-court-text font-serif">
                    {member.points.toLocaleString()}
                  </p>
                  <p className="text-court-xs text-court-text-ter uppercase">pts</p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
