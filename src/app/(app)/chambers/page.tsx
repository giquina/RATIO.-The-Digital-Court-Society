"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Tag, SectionHeader } from "@/components/ui";
import { CHAMBERS } from "@/lib/constants/app";
import { Users, Trophy, ChevronRight, Star, Crown } from "lucide-react";

// Extended chamber data
const CHAMBER_DATA = [
  { ...CHAMBERS[0], members: 342, rank: 2, activeSessions: 12, tagColor: "burgundy" as const },
  { ...CHAMBERS[1], members: 298, rank: 1, activeSessions: 15, tagColor: "blue" as const },
  { ...CHAMBERS[2], members: 256, rank: 3, activeSessions: 8, tagColor: "green" as const },
  { ...CHAMBERS[3], members: 187, rank: 4, activeSessions: 6, tagColor: "gold" as const },
];

const MY_CHAMBER = "Gray's";

export default function ChambersPage() {
  const myChamber = CHAMBER_DATA.find((c) => c.name === MY_CHAMBER);
  const otherChambers = CHAMBER_DATA.filter((c) => c.name !== MY_CHAMBER);

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text">Chambers</h1>
        <p className="text-xs text-court-text-sec mt-1">
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
                  <div className="flex gap-5 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Users size={13} className="text-court-text-ter" />
                      <span className="text-court-sm text-court-text-sec">{myChamber.members} members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy size={13} className="text-court-text-ter" />
                      <span className="text-court-sm text-court-text-sec">Ranked #{myChamber.rank}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star size={13} className="text-court-text-ter" />
                      <span className="text-court-sm text-court-text-sec">{myChamber.activeSessions} active</span>
                    </div>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CHAMBER_DATA.map((chamber) => {
            const isMine = chamber.name === MY_CHAMBER;
            return (
              <Link
                key={chamber.name}
                href={`/chambers/${encodeURIComponent(chamber.name)}`}
              >
                <Card
                  className="p-4 h-full hover:border-white/10 transition-all relative overflow-hidden"
                  highlight={isMine}
                >
                  {/* Background glow */}
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

      {/* Chamber Stats */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <SectionHeader title="Chamber League" />
        <Card className="divide-y divide-court-border-light">
          {CHAMBER_DATA.sort((a, b) => a.rank - b.rank).map((chamber, i) => (
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
                  {chamber.name === MY_CHAMBER && (
                    <span className="text-court-xs text-gold font-normal ml-1.5">(Yours)</span>
                  )}
                </p>
                <p className="text-court-xs text-court-text-ter">
                  {chamber.members} members · {chamber.activeSessions} active sessions
                </p>
              </div>
              {i === 0 && <Crown size={18} className="text-gold" />}
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
