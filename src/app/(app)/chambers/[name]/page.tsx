"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Avatar, Tag, Card, Button, ProgressBar, SectionHeader } from "@/components/ui";
import { CHAMBERS, CHAMBER_COLORS } from "@/lib/constants/app";
import { Users, Trophy, TrendingUp, Activity, ArrowLeft, Crown, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";

export default function ChamberDetailPage() {
  const params = useParams();
  const chamberName = decodeURIComponent(params.name as string);

  const profileQuery: any = useQuery(anyApi.users.myProfile);
  const chamberMembers: any[] | undefined = useQuery(
    anyApi.profiles.getByChamber,
    { chamber: chamberName }
  );
  const allChamberStats: any[] | undefined = useQuery(anyApi.profiles.getChamberStats, {});

  const stats = allChamberStats?.find((s: any) => s.name === chamberName);
  const memberCount = stats?.members ?? chamberMembers?.length ?? 0;
  const totalPoints = stats?.totalPoints ?? 0;
  const topRank = stats?.topRank ?? "Pupil";

  const isMine = profileQuery?.chamber === chamberName;
  const [joined, setJoined] = useState(false);

  const chamber = CHAMBERS.find((c) => c.name === chamberName);
  if (!chamber) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <h3 className="font-serif text-lg font-bold text-court-text mb-2">Chamber Not Found</h3>
        <p className="text-court-base text-court-text-ter mb-6">The chamber you are looking for does not exist.</p>
        <Link href="/chambers">
          <Button variant="outline" size="sm">Back to Chambers</Button>
        </Link>
      </div>
    );
  }

  // Loading state
  if (chamberMembers === undefined || allChamberStats === undefined || profileQuery === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <Loader2 size={32} className="animate-spin text-court-text-sec mb-4" />
        <p className="text-court-base text-court-text-ter">Loading chamber data...</p>
      </div>
    );
  }

  // Sort members by totalPoints descending
  const members = [...chamberMembers].sort(
    (a: any, b: any) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0)
  );

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Back link */}
      <div className="px-4 md:px-6 lg:px-8 pt-3">
        <Link
          href="/chambers"
          className="inline-flex items-center gap-1.5 text-court-sm text-court-text-sec hover:text-court-text transition-colors"
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
          { icon: <Users size={16} className="text-court-text-sec" />, value: memberCount.toString(), label: "Members" },
          { icon: <Trophy size={16} className="text-court-text-sec" />, value: totalPoints.toLocaleString(), label: "Total Points" },
          { icon: <TrendingUp size={16} className="text-court-text-sec" />, value: topRank, label: "Top Rank" },
          { icon: <Activity size={16} className="text-court-text-sec" />, value: "\u2014", label: "Active This Week" },
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
            className="w-full py-3 rounded-xl text-center text-court-base font-bold border"
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
          {members.map((member: any, i: number) => {
            const isMe = profileQuery?._id === member._id;
            const nameParts = (member.fullName ?? "").split(" ");
            const initials =
              nameParts.length >= 2
                ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
                : (nameParts[0]?.[0] ?? "?").toUpperCase();
            return (
              <Card key={member._id} highlight={isMe} className="px-3.5 py-3 flex items-center gap-3">
                <span className="font-serif text-court-base font-bold text-court-text-ter w-6 text-center">
                  {i + 1}
                </span>
                <Avatar
                  initials={initials}
                  chamber={chamberName}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-court-base font-bold ${isMe ? "text-gold" : "text-court-text"}`}>
                    {member.fullName}
                    {isMe && <span className="text-court-xs font-normal ml-1">(You)</span>}
                  </p>
                  <p className="text-court-xs text-court-text-ter">
                    {member.universityShort ?? member.university}
                  </p>
                </div>
                <Tag small>{member.rank ?? "Pupil"}</Tag>
                <div className="text-right ml-1">
                  <p className="text-court-base font-bold text-court-text font-serif">
                    {(member.totalPoints ?? 0).toLocaleString()}
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
