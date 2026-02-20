"use client";

import { useState } from "react";
import { Avatar, Tag, Card, FollowButton, SectionHeader } from "@/components/ui";

const PEOPLE = [
  { name: "Priya Sharma", initials: "PS", uni: "KCL", year: "Year 3", chamber: "Lincoln's",
    moots: 41, rank: "Senior Counsel", mutual: 8, followers: 312, bio: "Criminal & Public Law. Essex Court moot finalist 2025." },
  { name: "James Okafor", initials: "JO", uni: "LSE", year: "Year 2", chamber: "Inner",
    moots: 19, rank: "Junior Counsel", mutual: 3, followers: 189, bio: "Commercial disputes. ELSA UK representative." },
  { name: "Fatima Al-Rashid", initials: "FA", uni: "Oxford", year: "Year 3", chamber: "Gray's",
    moots: 56, rank: "King's Counsel", mutual: 12, followers: 487, bio: "Human rights & immigration. Inner Temple scholar." },
  { name: "Tom Henderson", initials: "TH", uni: "Bristol", year: "Year 1", chamber: "Middle",
    moots: 4, rank: "Pupil", mutual: 1, followers: 34, bio: "First-year. Keen to get started with mooting." },
];

const RANKINGS = [
  { name: "Fatima Al-Rashid", initials: "FA", uni: "Oxford", chamber: "Gray's", score: 2840, moots: 56, pos: 1 },
  { name: "Daniel Wright", initials: "DW", uni: "Cambridge", chamber: "Lincoln's", score: 2610, moots: 48, pos: 2 },
  { name: "Priya Sharma", initials: "PS", uni: "KCL", chamber: "Lincoln's", score: 2380, moots: 41, pos: 3 },
  { name: "Marcus Williams", initials: "MW", uni: "Manchester", chamber: "Middle", score: 2150, moots: 38, pos: 4 },
  { name: "Sophie Chen", initials: "SC", uni: "UCL", chamber: "Gray's", score: 1920, moots: 31, pos: 5 },
  { name: "Ali Giquina", initials: "AG", uni: "UCL", chamber: "Gray's", score: 1540, moots: 23, pos: 14 },
];

export default function CommunityPage() {
  const [tab, setTab] = useState(0);
  const [filterTab, setFilterTab] = useState(0);
  const [follows, setFollows] = useState<Record<string, boolean>>({});

  const tabs = ["Discover", "Rankings", "Your Chamber"];

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Community</h1>
        <p className="text-xs text-court-text-sec mb-3.5">184 followers · 96 following · Top 24% nationally</p>
        <div className="bg-white/[0.05] rounded-xl px-3.5 py-2.5 flex items-center gap-2 mb-3.5">
          <span className="opacity-30">🔍</span>
          <span className="text-xs text-court-text-ter">Search advocates, universities...</span>
        </div>
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-0.5">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${tab === i ? "bg-gold text-navy" : "text-court-text-sec"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Discover Tab ── */}
      {tab === 0 && (
        <div className="px-4">
          <div className="flex gap-1.5 mb-3.5 flex-wrap">
            {["Suggested", "Same Modules", "Same Year", "Rising Stars"].map((f, i) => (
              <button key={f} onClick={() => setFilterTab(i)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                  filterTab === i ? "border-gold/40 bg-gold-dim text-gold" : "border-court-border text-court-text-ter"
                }`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            {PEOPLE.map((p, i) => (
              <Card key={i} className="p-3.5">
                <div className="flex gap-3 items-center">
                  <Avatar initials={p.initials} chamber={p.chamber} size="lg" online={i < 2} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-court-text">{p.name}</p>
                        <p className="text-[10px] text-court-text-ter mt-0.5">{p.uni} · {p.year} · {p.chamber} Chamber</p>
                      </div>
                      <FollowButton isFollowing={!!follows[`p${i}`]} onToggle={() => setFollows(s => ({ ...s, [`p${i}`]: !s[`p${i}`] }))} />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-court-text-sec mt-2 leading-relaxed">{p.bio}</p>
                <div className="flex gap-0 mt-3 pt-2.5 border-t border-court-border-light items-center">
                  {[
                    { v: p.followers, l: "followers" },
                    { v: p.moots, l: "moots" },
                    { v: p.mutual, l: "mutual" },
                  ].map((s) => (
                    <div key={s.l} className="flex-1">
                      <span className="text-[13px] font-bold text-court-text">{s.v}</span>
                      <span className="text-[10px] text-court-text-ter ml-1">{s.l}</span>
                    </div>
                  ))}
                  <Tag>{p.rank}</Tag>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── Rankings Tab ── */}
      {tab === 1 && (
        <div className="px-4">
          <div className="flex gap-1.5 mb-4 flex-wrap">
            {["National", "Your University", "Your Chamber", "This Month"].map((f, i) => (
              <button key={f} onClick={() => setFilterTab(i)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                  filterTab === i ? "border-gold/40 bg-gold-dim text-gold" : "border-court-border text-court-text-ter"
                }`}>
                {f}
              </button>
            ))}
          </div>
          {/* Top 3 Podium */}
          <div className="flex justify-center gap-2 mb-5 items-end">
            {[RANKINGS[1], RANKINGS[0], RANKINGS[2]].map((r, i) => {
              const isFirst = i === 1;
              return (
                <div key={r.name} className="flex-1 text-center">
                  <Avatar initials={r.initials} size={isFirst ? "xl" : "lg"} chamber={r.chamber} border={isFirst} />
                  <p className={`${isFirst ? "text-[13px]" : "text-[11px]"} font-bold text-court-text mt-1.5`}>{r.name.split(" ")[0]}</p>
                  <p className="text-[9px] text-court-text-ter">{r.uni}</p>
                  <div className={`mt-1.5 py-1 rounded-lg ${isFirst ? "bg-gold-dim border border-gold/25" : "bg-white/[0.04] border border-court-border-light"}`}>
                    <span className={isFirst ? "text-base" : "text-sm"}>{["🥈", "🥇", "🥉"][i]}</span>
                    <p className="text-[9px] text-court-text-ter">{r.score} pts</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Remaining rankings */}
          <div className="flex flex-col gap-2">
            {RANKINGS.slice(3).map((r) => {
              const isMe = r.name === "Ali Giquina";
              return (
                <Card key={r.name} highlight={isMe} className="px-3.5 py-3 flex items-center gap-3">
                  <span className="text-sm font-bold text-court-text-ter w-6 text-center font-serif">{r.pos}</span>
                  <Avatar initials={r.initials} chamber={r.chamber} size="sm" />
                  <div className="flex-1">
                    <p className={`text-[13px] font-bold ${isMe ? "text-gold" : "text-court-text"}`}>
                      {r.name} {isMe && <span className="text-[10px] font-normal">(You)</span>}
                    </p>
                    <p className="text-[10px] text-court-text-ter">{r.uni} · {r.moots} moots</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-court-text font-serif">{r.score}</p>
                    <p className="text-[8px] text-court-text-ter uppercase">points</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Chamber Tab ── */}
      {tab === 2 && (
        <div className="px-4">
          <Card highlight className="p-5 text-center mb-4">
            <span className="text-4xl">⚖️</span>
            <h2 className="font-serif text-xl font-bold text-court-text mt-2">Gray&apos;s Chamber</h2>
            <p className="text-[11px] text-court-text-sec mt-1">Est. 2026 · 342 members · Ranked #2 nationally</p>
            <div className="flex justify-center gap-7 mt-4">
              {[{ v: "342", l: "Members" }, { v: "1,847", l: "Total Moots" }, { v: "#2", l: "Rank" }].map(s => (
                <div key={s.l} className="text-center">
                  <p className="font-serif text-base font-bold text-court-text">{s.v}</p>
                  <p className="text-[9px] text-court-text-ter uppercase tracking-wider mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </Card>
          <SectionHeader title="Top Advocates" />
          {PEOPLE.filter(p => p.chamber === "Gray's").map((p, i) => (
            <Card key={i} className="px-3.5 py-3 flex items-center gap-3 mb-2">
              <span className="text-[13px] font-bold text-gold w-5 font-serif">{i + 1}</span>
              <Avatar initials={p.initials} chamber={p.chamber} size="sm" />
              <div className="flex-1">
                <p className="text-[13px] font-bold text-court-text">{p.name}</p>
                <p className="text-[10px] text-court-text-ter">{p.uni} · {p.moots} moots</p>
              </div>
              <Tag>{p.rank}</Tag>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
