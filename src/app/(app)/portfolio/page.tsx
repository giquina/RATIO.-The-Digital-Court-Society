"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Tag, ProgressBar, SectionHeader, Button } from "@/components/ui";
import {
  BarChart3, Flame, Trophy, Target, Calendar, Download, Filter, ArrowRight,
} from "lucide-react";

// ── Demo sessions ──
const SESSIONS = [
  {
    id: "s1",
    date: "18 Feb 2026",
    title: "Judicial Review of Executive Power",
    role: "Leading Counsel (Appellant)",
    score: 78,
    module: "Public Law",
    mode: "Moot",
    modeColor: "gold" as const,
  },
  {
    id: "s2",
    date: "14 Feb 2026",
    title: "AI Judge - Contract Formation",
    role: "Counsel",
    score: 72,
    module: "Contract Law",
    mode: "AI Judge",
    modeColor: "blue" as const,
  },
  {
    id: "s3",
    date: "10 Feb 2026",
    title: "R v Hughes - Self-Defence",
    role: "Defence Counsel",
    score: 65,
    module: "Criminal Law",
    mode: "Moot",
    modeColor: "gold" as const,
  },
  {
    id: "s4",
    date: "6 Feb 2026",
    title: "AI Judge - Duty of Care Analysis",
    role: "Counsel",
    score: 81,
    module: "Tort Law",
    mode: "AI Judge",
    modeColor: "blue" as const,
  },
  {
    id: "s5",
    date: "1 Feb 2026",
    title: "Land Registration Disputes",
    role: "Junior Counsel (Respondent)",
    score: 58,
    module: "Land Law",
    mode: "Moot",
    modeColor: "gold" as const,
  },
  {
    id: "s6",
    date: "28 Jan 2026",
    title: "AI Judge - EU Supremacy Principles",
    role: "Counsel",
    score: 69,
    module: "EU Law",
    mode: "AI Judge",
    modeColor: "blue" as const,
  },
  {
    id: "s7",
    date: "23 Jan 2026",
    title: "Breach of Fiduciary Duty",
    role: "Leading Counsel (Appellant)",
    score: 74,
    module: "Equity & Trusts",
    mode: "Moot",
    modeColor: "gold" as const,
  },
  {
    id: "s8",
    date: "18 Jan 2026",
    title: "AI Judge - Human Rights Act Application",
    role: "Counsel",
    score: 85,
    module: "Human Rights",
    mode: "AI Judge",
    modeColor: "blue" as const,
  },
];

const FILTERS = ["All", "AI Judge", "Moot Sessions"];

function getScoreColor(score: number): string {
  if (score >= 70) return "green";
  if (score >= 50) return "gold";
  return "red";
}

function getScoreTextColor(score: number): string {
  if (score >= 70) return "text-green-400";
  if (score >= 50) return "text-gold";
  return "text-red-400";
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState(0);

  const filteredSessions = SESSIONS.filter((s) => {
    if (filter === 0) return true;
    if (filter === 1) return s.mode === "AI Judge";
    if (filter === 2) return s.mode === "Moot";
    return true;
  });

  const avgScore = Math.round(
    SESSIONS.reduce((sum, s) => sum + s.score, 0) / SESSIONS.length
  );

  // Best module = module with highest average score
  const moduleScores: Record<string, number[]> = {};
  SESSIONS.forEach((s) => {
    if (!moduleScores[s.module]) moduleScores[s.module] = [];
    moduleScores[s.module].push(s.score);
  });
  const bestModule = Object.entries(moduleScores).reduce((best, [mod, scores]) => {
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return avg > best.avg ? { mod, avg } : best;
  }, { mod: "", avg: 0 }).mod;

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-court-text">Your Portfolio</h1>
            <p className="text-court-sm text-court-text-sec mt-1">
              Track your advocacy journey
            </p>
          </div>
          <Button variant="secondary" size="sm" disabled>
            <Download size={14} className="inline mr-1.5" />
            Export PDF
          </Button>
        </div>
        <p className="text-court-xs text-court-text-ter mt-1">PDF export coming soon</p>
      </div>

      {/* Summary Stats */}
      <section className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { icon: <BarChart3 size={16} className="text-court-text-sec" />, value: SESSIONS.length.toString(), label: "Total Sessions" },
            { icon: <Target size={16} className="text-court-text-sec" />, value: `${avgScore}%`, label: "Average Score" },
            { icon: <Trophy size={16} className="text-court-text-sec" />, value: bestModule, label: "Best Module" },
            { icon: <Flame size={16} className="text-court-text-sec" />, value: "12 days", label: "Current Streak" },
          ].map((stat) => (
            <Card key={stat.label} className="p-3.5">
              <div className="mb-2">{stat.icon}</div>
              <p className="font-serif text-lg font-bold text-court-text leading-tight">{stat.value}</p>
              <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Session History */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-3">
          <SectionHeader title="Session History" />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(i)}
              className={`px-3.5 py-1.5 rounded-full text-court-sm font-bold border transition-all ${
                filter === i
                  ? "border-gold/40 bg-gold-dim text-gold"
                  : "border-court-border text-court-text-ter hover:text-court-text-sec"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Session Cards */}
        <div className="space-y-2.5">
          {filteredSessions.map((session) => (
            <Link key={session.id} href={`/feedback/${session.id}`}>
              <Card className="p-4 hover:border-white/10 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-court-text-ter" />
                    <span className="text-court-sm text-court-text-ter">{session.date}</span>
                  </div>
                  <Tag color={session.modeColor} small>
                    {session.mode.toUpperCase()}
                  </Tag>
                </div>
                <h3 className="text-court-md font-bold text-court-text mb-1 leading-tight">
                  {session.title}
                </h3>
                <p className="text-court-sm text-court-text-sec mb-3">
                  Role: {session.role}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar pct={session.score} color={getScoreColor(session.score)} height={6} />
                  </div>
                  <span className={`text-court-base font-bold font-serif ${getScoreTextColor(session.score)}`}>
                    {session.score}%
                  </span>
                  <Tag small>{session.module}</Tag>
                </div>
                <div className="flex items-center justify-end mt-2">
                  <span className="text-court-sm text-gold font-semibold flex items-center gap-1">
                    View Feedback <ArrowRight size={12} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-court-base text-court-text-ter">No sessions match this filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
