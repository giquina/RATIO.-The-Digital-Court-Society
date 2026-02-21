"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Tag,
  Card,
  Button,
  ProgressBar,
  SectionHeader,
  CommendButton,
  FollowButton,
} from "@/components/ui";
import { CHAMBER_COLORS } from "@/lib/constants/app";
import { Bell, Scale, Calendar, Target, Trophy, Flame, Award, MessageCircle, ExternalLink } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Demo data — replaced by Convex queries in production
const ME = {
  name: "Ali Giquina", initials: "AG", university: "UCL", chamber: "Gray's",
  streak: 12, moots: 23, hours: 47, followers: 184, commendations: 312, readiness: 68, topPercent: 24,
};

const FEED = [
  { id: "1", user: "Priya Sharma", initials: "PS", uni: "KCL", chamber: "Lincoln's",
    type: "moot", role: "Leading Counsel", topic: "Contract Law — Anticipatory Breach", time: "2h", comms: 14 },
  { id: "2", user: "James Okafor", initials: "JO", uni: "LSE", chamber: "Inner",
    type: "badge", badge: "Advanced Cross-Examination · Level 2", time: "4h", comms: 28 },
  { id: "3", user: "Sophie Chen", initials: "SC", uni: "UCL", chamber: "Gray's",
    type: "moot", role: "Presiding Judge", topic: "Criminal Law — R v Hughes [2024]", time: "6h", comms: 9 },
  { id: "4", user: "Marcus Williams", initials: "MW", uni: "Manchester", chamber: "Middle",
    type: "milestone", milestone: "30-day practice streak", time: "8h", comms: 42 },
];

export default function HomePage() {
  const router = useRouter();
  const [commended, setCommended] = useState<Record<string, boolean>>({});
  const [follows, setFollows] = useState<Record<string, boolean>>({});
  const [feedTab, setFeedTab] = useState<"following" | "discover" | "chamber">("following");

  return (
    <div className="pb-6">
      {/* ── Header ── */}
      <header className="flex justify-between items-center px-4 pt-3 pb-4">
        <div>
          <h1 className="font-serif text-sm text-gold tracking-[0.14em] uppercase font-bold">
            RATIO<span className="text-gold">.</span>
          </h1>
          <p className="text-court-sm text-court-text-ter mt-0.5">UCL · Gray&apos;s Chamber</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/notifications" className="relative w-9 h-9 rounded-full bg-gold-dim flex items-center justify-center">
            <Bell size={18} className="text-gold" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border-2 border-navy" />
          </Link>
          <Link href="/profile">
            <Avatar initials="AG" chamber="Gray's" size="sm" border />
          </Link>
        </div>
      </header>

      {/* ── Streak + Stats Card ── */}
      <section className="px-4 mb-5">
        <Card highlight className="p-3 md:p-4 relative overflow-hidden">
          <div className="absolute -top-8 -right-5 w-32 h-32 rounded-full bg-gold/[0.04]" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-1">Practice Streak</p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-4xl font-bold text-gold">{ME.streak}</span>
                <span className="text-sm text-court-text-sec">days</span>
              </div>
              <p className="text-court-xs text-court-text-ter mt-1 flex items-center gap-1"><Flame size={12} className="text-orange-400" /> Personal best · Top {ME.topPercent}%</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: `conic-gradient(#C9A84C 0% ${ME.readiness}%, rgba(255,255,255,0.05) ${ME.readiness}% 100%)` }}>
                <div className="w-11 h-11 rounded-full bg-navy-card flex items-center justify-center">
                  <span className="text-sm font-bold text-court-text">{ME.readiness}%</span>
                </div>
              </div>
              <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-1">SQE2 Ready</p>
            </div>
          </div>
          {/* Social stats row */}
          <div className="grid grid-cols-4 gap-1 mt-4 pt-3.5 border-t border-court-border">
            {[
              { v: ME.followers, l: "Followers" },
              { v: ME.commendations, l: "Comms" },
              { v: ME.moots, l: "Sessions" },
              { v: `${ME.hours}h`, l: "Advocacy" },
            ].map((s) => (
              <div key={s.l} className="text-center min-w-0">
                <div className="font-serif text-base font-bold text-court-text">{s.v}</div>
                <div className="text-[9px] text-court-text-ter uppercase tracking-wider mt-0.5 truncate">{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* ── Quick Actions ── */}
      <section className="px-4 mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {([
            { Icon: Scale, label: "Create Session", sub: "Host a moot or trial", href: "/sessions/create" },
            { Icon: Calendar, label: "View Timetable", sub: "This week's sessions", href: "/sessions" },
            { Icon: Target, label: "AI Practice", sub: "Train with AI Judge", href: "/ai-practice" },
            { Icon: Trophy, label: "League Table", sub: "National rankings", href: "/community" },
          ] as { Icon: LucideIcon; label: string; sub: string; href: string }[]).map((a) => (
            <Link key={a.label} href={a.href}>
              <Card className="p-3.5 hover:border-white/10">
                <a.Icon size={20} className="text-gold" />
                <p className="text-court-base font-bold text-court-text mt-1.5 mb-0.5">{a.label}</p>
                <p className="text-court-xs text-court-text-ter">{a.sub}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Desktop: two-column layout for session + feed ── */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:px-4">

      {/* ── Upcoming Session ── */}
      <section className="px-4 lg:px-0 mb-6">
        <SectionHeader title="Your Next Session" action="View all" onAction={() => router.push("/sessions")} />
        <Card className="overflow-hidden">
          <div className="bg-burgundy/20 px-4 py-2.5 flex justify-between items-center">
            <Tag color="burgundy">MOOT · PUBLIC LAW</Tag>
            <span className="text-court-sm text-court-text-sec">Tue 25 Feb · 14:00</span>
          </div>
          <div className="p-4">
            <h3 className="font-serif text-base font-bold text-court-text mb-2.5 leading-tight">
              Judicial Review of Executive Power
            </h3>
            <div className="bg-gold-dim text-gold text-court-sm font-bold px-2.5 py-1 rounded-md w-fit mb-3">
              Your role: Leading Counsel (App.)
            </div>
            <div className="flex items-center gap-0 mb-4">
              {["AG", "PS", "DP"].map((i, idx) => (
                <div key={i} className={idx ? "-ml-2" : ""} style={{ zIndex: 3 - idx }}>
                  <Avatar initials={i} chamber={["Gray's", "Lincoln's", "Inner"][idx]} size="xs" />
                </div>
              ))}
              <span className="text-court-sm text-court-text-sec ml-2.5">3 of 4 filled</span>
              <span className="text-court-sm text-gold font-bold ml-auto">1 open →</span>
            </div>
            <Button fullWidth>View Preparation Checklist</Button>
          </div>
        </Card>
      </section>

      {/* ── Activity Feed ── */}
      <section className="px-4 lg:px-0">
        <div className="flex justify-between items-center mb-3.5">
          <h2 className="font-serif text-lg font-bold text-court-text">Activity</h2>
          <div className="flex gap-3">
            {(["following", "discover", "chamber"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFeedTab(t)}
                className={`text-court-sm font-semibold pb-0.5 capitalize ${
                  feedTab === t ? "text-gold border-b-[1.5px] border-gold" : "text-court-text-ter"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {FEED.map((item) => (
            <Card key={item.id} className="p-3.5">
              {/* User header */}
              <div className="flex gap-2.5 items-center mb-2.5">
                <Avatar initials={item.initials} chamber={item.chamber} size="sm" online={item.id < "3"} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-court-base font-bold text-court-text">{item.user}</span>
                      <span className="text-court-xs text-court-text-ter ml-1.5">{item.time}</span>
                    </div>
                    <FollowButton
                      isFollowing={!!follows[item.id]}
                      onToggle={() => setFollows((p) => ({ ...p, [item.id]: !p[item.id] }))}
                      small
                    />
                  </div>
                  <p className="text-court-xs text-court-text-ter mt-0.5">{item.uni} · {item.chamber} Chamber</p>
                </div>
              </div>

              {/* Content */}
              {item.type === "moot" && (
                <>
                  <p className="text-court-base text-court-text-sec mb-1">
                    Completed a moot as <span className="text-court-text font-semibold">{item.role}</span>
                  </p>
                  <div className="bg-white/[0.03] rounded-lg p-2.5 border-l-[3px] mb-2.5"
                    style={{ borderColor: CHAMBER_COLORS[item.chamber] }}>
                    <p className="text-court-base font-bold text-court-text mb-1">{item.topic}</p>
                    <Tag>{item.role!}</Tag>
                  </div>
                </>
              )}
              {item.type === "badge" && (
                <div className="bg-green-500/[0.08] rounded-lg p-3 border border-green-500/20 flex gap-2.5 items-center mb-2.5">
                  <Award size={24} className="text-green-500 shrink-0" />
                  <div>
                    <p className="text-court-sm text-green-500 font-semibold mb-0.5">Distinction Earned</p>
                    <p className="text-court-base font-bold text-court-text">{item.badge}</p>
                  </div>
                </div>
              )}
              {item.type === "milestone" && (
                <div className="bg-orange-400/[0.08] rounded-lg p-3 border border-orange-400/20 flex gap-2.5 items-center mb-2.5">
                  <Flame size={24} className="text-orange-400 shrink-0" />
                  <div>
                    <p className="text-court-sm text-orange-400 font-semibold mb-0.5">Milestone Reached</p>
                    <p className="text-court-base font-bold text-court-text">{item.milestone}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-2.5 border-t border-court-border-light">
                <CommendButton
                  isCommended={!!commended[item.id]}
                  count={item.comms + (commended[item.id] ? 1 : 0)}
                  onToggle={() => setCommended((p) => ({ ...p, [item.id]: !p[item.id] }))}
                />
                <div className="flex gap-3">
                  <button type="button" className="text-court-text-ter cursor-pointer" aria-label="Comment"><MessageCircle size={14} /></button>
                  <button type="button" className="text-court-text-ter cursor-pointer" aria-label="Share"><ExternalLink size={14} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      </div>{/* end desktop two-column */}
    </div>
  );
}
