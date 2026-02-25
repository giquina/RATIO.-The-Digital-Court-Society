"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  Brain,
  Coins,
  Activity,
  Clock,
  Cpu,
  MessageSquare,
  Gavel,
  GraduationCap,
  Swords,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";

// ── KPI Card ──
function KPICard({
  label,
  value,
  sublabel,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="bg-navy-card border border-court-border rounded-court p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            accent ? "bg-gold/15 text-gold" : "bg-white/5 text-court-text-sec"
          )}
        >
          <Icon size={20} />
        </div>
      </div>
      <div className="text-court-text font-serif text-2xl font-bold tracking-tight">
        {value}
      </div>
      <div className="text-court-text-sec text-court-xs mt-1">{label}</div>
      {sublabel && (
        <div className="text-court-text-ter text-[10px] mt-0.5">{sublabel}</div>
      )}
    </div>
  );
}

// ── Cost Bar (simple CSS sparkline) ──
function CostBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max((value / max) * 100, 2) : 0;
  return (
    <div className="h-8 w-full flex items-end">
      <div
        className="bg-gold/40 rounded-t w-full min-h-[2px]"
        style={{ height: `${pct}%` }}
      />
    </div>
  );
}

// ── Mode badge ──
function ModeBadge({ mode }: { mode: string }) {
  const styles: Record<string, { bg: string; icon: React.ElementType }> = {
    judge: { bg: "bg-burgundy/15 text-burgundy", icon: Gavel },
    mentor: { bg: "bg-gold/15 text-gold", icon: GraduationCap },
    examiner: { bg: "bg-white/10 text-court-text-sec", icon: ShieldCheck },
    opponent: { bg: "bg-white/10 text-court-text-sec", icon: Swords },
  };

  const s = styles[mode] ?? styles.judge;
  const ModeIcon = s.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase",
        s.bg
      )}
    >
      <ModeIcon size={10} />
      {mode}
    </span>
  );
}

// ── Helpers ──
function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatCost(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

function getTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDuration(seconds: number | undefined): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

// ── Main AI Usage Page ──
export default function AiUsagePage() {
  const stats = useQuery(anyApi.admin.getAiUsageStats);

  if (stats === undefined) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-court-xl text-court-text font-bold">AI Usage</h1>
            <p className="text-court-text-sec text-court-sm mt-1">Loading AI usage data...</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i: number) => (
              <div key={i} className="bg-navy-card border border-court-border rounded-court p-5 h-28 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (stats === null) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-court-text-sec text-court-sm">Access denied.</p>
      </div>
    );
  }

  // Cost trend data
  const costTrend = stats.dailyCostTrend?.map((d: any) => d.costCents ?? 0) ?? [];
  const maxCost = Math.max(...costTrend, 1);

  // Token trend data
  const tokenTrend = stats.dailyCostTrend?.map((d: any) => d.tokens ?? 0) ?? [];
  const maxTokens = Math.max(...tokenTrend, 1);

  // Mode breakdown sorted by count
  const modeRows = Object.entries(stats.modeBreakdown ?? {})
    .map(([mode, count]: [string, any]) => ({ mode, count: count as number }))
    .sort((a: any, b: any) => b.count - a.count);

  const totalFromModes = modeRows.reduce((sum: number, r: any) => sum + r.count, 0);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-court-xl text-court-text font-bold">AI Usage</h1>
          <p className="text-court-text-sec text-court-sm mt-1">
            AI session analytics, token spend, and cost tracking
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Total AI Sessions"
            value={stats.totalSessions.toLocaleString()}
            sublabel={`${stats.completedSessions} completed`}
            icon={Brain}
            accent
          />
          <KPICard
            label="Total Tokens Used"
            value={formatTokens(stats.totalTokens)}
            sublabel="across all snapshots"
            icon={Cpu}
          />
          <KPICard
            label="Estimated Cost"
            value={formatCost(stats.totalCostCents)}
            sublabel="cumulative AI spend"
            icon={Coins}
          />
          <KPICard
            label="Sessions Today"
            value={stats.sessionsToday}
            icon={Activity}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Daily Cost Trend (last 30 days) */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Daily AI Cost (30 days)
            </h2>
            {costTrend.length === 0 ? (
              <p className="text-court-text-ter text-court-xs">
                No daily snapshots yet. The cron job runs at 08:00 UTC daily.
              </p>
            ) : (
              <div className="flex items-end gap-[2px] h-32">
                {costTrend.map((val: number, i: number) => (
                  <CostBar key={i} value={val} max={maxCost} />
                ))}
              </div>
            )}
            {costTrend.length > 0 && (
              <div className="flex justify-between mt-2">
                <span className="text-court-text-ter text-[10px]">30 days ago</span>
                <span className="text-court-text-ter text-[10px]">Today</span>
              </div>
            )}
          </div>

          {/* Daily Token Trend (last 30 days) */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Daily Tokens Used (30 days)
            </h2>
            {tokenTrend.length === 0 ? (
              <p className="text-court-text-ter text-court-xs">
                No daily snapshots yet. The cron job runs at 08:00 UTC daily.
              </p>
            ) : (
              <div className="flex items-end gap-[2px] h-32">
                {tokenTrend.map((val: number, i: number) => (
                  <CostBar key={i} value={val} max={maxTokens} />
                ))}
              </div>
            )}
            {tokenTrend.length > 0 && (
              <div className="flex justify-between mt-2">
                <span className="text-court-text-ter text-[10px]">30 days ago</span>
                <span className="text-court-text-ter text-[10px]">Today</span>
              </div>
            )}
          </div>

          {/* Mode Breakdown */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Sessions by Mode
            </h2>
            <div className="space-y-3">
              {modeRows.map((row: any) => {
                const pctOfTotal =
                  totalFromModes > 0
                    ? ((row.count / totalFromModes) * 100).toFixed(1)
                    : "0";
                return (
                  <div key={row.mode}>
                    <div className="flex items-center justify-between mb-1">
                      <ModeBadge mode={row.mode} />
                      <div className="flex items-center gap-3">
                        <span className="text-court-text text-court-sm font-bold">
                          {row.count}
                        </span>
                        <span className="text-court-text-ter text-court-xs w-12 text-right">
                          {pctOfTotal}%
                        </span>
                      </div>
                    </div>
                    {/* Usage bar */}
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          row.mode === "judge"
                            ? "bg-burgundy"
                            : row.mode === "mentor"
                              ? "bg-gold"
                              : "bg-court-text-sec"
                        )}
                        style={{
                          width: `${totalFromModes > 0 ? (row.count / totalFromModes) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {modeRows.length === 0 && (
                <p className="text-court-text-ter text-court-xs">
                  No AI sessions recorded yet.
                </p>
              )}
            </div>
          </div>

          {/* Cost Summary Card */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Cost Summary
            </h2>
            <div className="space-y-4">
              {/* Total cost */}
              <div className="flex items-center justify-between">
                <span className="text-court-text-sec text-court-sm">Total AI Spend</span>
                <span className="text-court-text font-serif text-lg font-bold">
                  {formatCost(stats.totalCostCents)}
                </span>
              </div>
              {/* Avg cost per session */}
              <div className="flex items-center justify-between">
                <span className="text-court-text-sec text-court-sm">Avg Cost / Session</span>
                <span className="text-court-text font-serif text-lg font-bold">
                  {stats.totalSessions > 0
                    ? formatCost(Math.round(stats.totalCostCents / stats.totalSessions))
                    : "£0.00"}
                </span>
              </div>
              {/* Avg tokens per session */}
              <div className="flex items-center justify-between">
                <span className="text-court-text-sec text-court-sm">Avg Tokens / Session</span>
                <span className="text-court-text font-serif text-lg font-bold">
                  {stats.totalSessions > 0
                    ? formatTokens(Math.round(stats.totalTokens / stats.totalSessions))
                    : "0"}
                </span>
              </div>
              {/* 30-day spend */}
              {stats.dailyCostTrend && stats.dailyCostTrend.length > 0 && (
                <>
                  <div className="border-t border-court-border pt-3 mt-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-court-text-sec text-court-sm">Last 30 Days</span>
                    <span className="text-gold font-serif text-lg font-bold">
                      {formatCost(
                        stats.dailyCostTrend.reduce(
                          (sum: number, d: any) => sum + (d.costCents ?? 0),
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-court-text-sec text-court-sm">30-Day Sessions</span>
                    <span className="text-court-text font-serif text-lg font-bold">
                      {stats.dailyCostTrend.reduce(
                        (sum: number, d: any) => sum + (d.aiSessions ?? 0),
                        0
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recent AI Sessions Timeline */}
          <div className="bg-navy-card border border-court-border rounded-court p-5 lg:col-span-2">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Recent AI Sessions
            </h2>
            {stats.recentSessions.length === 0 ? (
              <p className="text-court-text-ter text-court-xs">
                No AI sessions recorded yet.
              </p>
            ) : (
              <div className="divide-y divide-court-border">
                {stats.recentSessions.map((session: any) => {
                  const modeIcons: Record<string, React.ElementType> = {
                    judge: Gavel,
                    mentor: GraduationCap,
                    examiner: ShieldCheck,
                    opponent: Swords,
                  };
                  const Icon = modeIcons[session.mode] ?? Brain;

                  return (
                    <div key={session._id} className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-court-text-sec" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-court-text text-court-sm font-medium truncate">
                            {session.caseTitle}
                          </span>
                          <ModeBadge mode={session.mode} />
                          {session.status === "completed" && session.overallScore != null && (
                            <span className="text-gold text-[10px] font-bold">
                              {session.overallScore}%
                            </span>
                          )}
                          {session.status === "in_progress" && (
                            <span className="text-court-text-ter text-[10px] italic">
                              in progress
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-court-text-ter text-court-xs">
                            {session.advocateName}
                          </span>
                          <span className="text-court-text-ter text-[10px]">
                            {session.university}
                          </span>
                          <span className="text-court-text-ter text-[10px]">
                            {session.areaOfLaw}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 gap-0.5">
                        <div className="flex items-center gap-1 text-court-text-ter text-[10px]">
                          <MessageSquare size={10} />
                          {session.messageCount}
                        </div>
                        <div className="flex items-center gap-1 text-court-text-ter text-[10px]">
                          <Clock size={10} />
                          {formatDuration(session.durationSeconds)}
                        </div>
                        <div className="text-court-text-ter text-[10px]">
                          {getTimeAgo(session.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
