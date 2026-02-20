"use client";

import { Avatar, Tag, Card, Button, ProgressBar, SectionHeader } from "@/components/ui";

const ME = {
  name: "Ali Giquina", initials: "AG", university: "University College London",
  year: "Year 2 · LLB Law", chamber: "Gray's", followers: 184, following: 96,
  commendations: 312, streak: 12, moots: 23, hours: 47, rank: "Junior Counsel",
};

const SKILLS = [
  { skill: "Oral Advocacy", pct: 75 },
  { skill: "Legal Research", pct: 82 },
  { skill: "Argument Structure", pct: 60 },
  { skill: "Judicial Handling", pct: 45 },
  { skill: "Court Manner", pct: 70 },
  { skill: "Written Submissions", pct: 55 },
];

export default function ProfilePage() {
  return (
    <div className="pb-6">
      {/* ── Profile Card ── */}
      <section className="px-4 pt-3">
        <Card highlight className="p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gold/[0.06]" />
          <Avatar initials={ME.initials} chamber={ME.chamber} size="xl" border />
          <h1 className="font-serif text-xl font-bold text-court-text mt-3">{ME.name}</h1>
          <p className="text-xs text-court-text-sec mt-1">{ME.university}</p>
          <p className="text-[11px] text-court-text-ter mt-0.5">{ME.year} · {ME.chamber} Chamber</p>

          <div className="flex justify-center gap-7 mt-5">
            {[
              { v: ME.followers, l: "Followers" },
              { v: ME.following, l: "Following" },
              { v: ME.commendations, l: "Commendations" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="font-serif text-lg font-bold text-court-text">{s.v}</p>
                <p className="text-[9px] text-court-text-ter uppercase tracking-wider mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5 justify-center mt-4">
            <Button variant="outline" size="sm">Edit Profile</Button>
            <Button size="sm">Share Profile</Button>
          </div>
        </Card>
      </section>

      {/* ── Rank + Streak ── */}
      <section className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        <div className="bg-gold-dim border border-gold/25 rounded-court p-3.5">
          <p className="text-[9px] text-court-text-ter uppercase tracking-widest">Current Rank</p>
          <p className="font-serif text-lg font-bold text-gold mt-1">{ME.rank}</p>
          <p className="text-[10px] text-court-text-ter mt-1 mb-1.5">12 moots to Senior</p>
          <ProgressBar pct={65} height={3} />
        </div>
        <div className="bg-orange-400/[0.08] border border-orange-400/20 rounded-court p-3.5">
          <p className="text-[9px] text-court-text-ter uppercase tracking-widest">Streak</p>
          <p className="font-serif text-lg font-bold text-orange-400 mt-1">{ME.streak} days 🔥</p>
          <p className="text-[10px] text-court-text-ter mt-1 mb-1.5">Personal best!</p>
          <ProgressBar pct={86} color="orange" height={3} />
        </div>
      </section>

      {/* ── Stats Grid ── */}
      <section className="px-4 mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { v: `${ME.hours}h`, l: "Advocacy Hours", icon: "🕐" },
          { v: String(ME.moots), l: "Sessions Done", icon: "📋" },
          { v: "4.2", l: "Avg. Score", icon: "⭐" },
          { v: "#14", l: "National Rank", icon: "🏆" },
        ].map((s) => (
          <Card key={s.l} className="p-3.5">
            <span className="text-xl">{s.icon}</span>
            <p className="font-serif text-2xl font-bold text-court-text mt-1">{s.v}</p>
            <p className="text-[9px] text-court-text-ter uppercase tracking-wider mt-0.5">{s.l}</p>
          </Card>
        ))}
      </section>

      {/* ── Skills ── */}
      <section className="px-4 mt-4">
        <SectionHeader title="Skills Development" />
        <Card className="p-4">
          {SKILLS.map((s) => (
            <div key={s.skill} className="mb-2.5 last:mb-0">
              <div className="flex justify-between text-[11px] text-court-text-sec mb-1">
                <span>{s.skill}</span>
                <span className="text-gold font-semibold">{s.pct}%</span>
              </div>
              <ProgressBar pct={s.pct} />
            </div>
          ))}
        </Card>
      </section>

      {/* ── Actions ── */}
      <section className="px-4 mt-4">
        {[
          { icon: "📄", label: "Export Advocacy Portfolio", tag: "PDF" },
          { icon: "🔗", label: "Copy Profile Link" },
          { icon: "🏛️", label: "Your Chamber · Gray's" },
          { icon: "💳", label: "Digital Membership Card", tag: "WALLET" },
          { icon: "⚙️", label: "Settings" },
        ].map((a) => (
          <div key={a.label} className="flex justify-between items-center py-3.5 border-b border-court-border-light cursor-pointer">
            <div className="flex gap-3 items-center">
              <span className="text-lg">{a.icon}</span>
              <span className="text-[13px] text-court-text font-medium">{a.label}</span>
            </div>
            <div className="flex gap-2 items-center">
              {a.tag && <Tag small>{a.tag}</Tag>}
              <span className="text-court-text-ter text-sm">›</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
