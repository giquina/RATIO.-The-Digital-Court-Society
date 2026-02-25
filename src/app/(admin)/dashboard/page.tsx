"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  Users,
  PoundSterling,
  TrendingUp,
  UserPlus,
  Brain,
  Crown,
  Scale,
  Briefcase,
  Activity,
  Flame,
} from "lucide-react";
import { PLAN_LABELS } from "@/lib/constants/stripe";
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

// ── Plan badge ──
function PlanBadge({ plan }: { plan: string }) {
  const styles: Record<string, string> = {
    free: "bg-white/5 text-court-text-sec",
    premium: "bg-gold/15 text-gold",
    premium_plus: "bg-gold/25 text-gold",
    professional: "bg-burgundy/15 text-burgundy",
    professional_plus: "bg-burgundy/25 text-burgundy",
  };

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase",
        styles[plan] ?? styles.free
      )}
    >
      {PLAN_LABELS[plan] ?? plan}
    </span>
  );
}

// ── Plan breakdown row ──
function PlanRow({
  plan,
  count,
  total,
}: {
  plan: string;
  count: number;
  total: number;
}) {
  const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <PlanBadge plan={plan} />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-court-text text-court-sm font-bold">{count}</span>
        <span className="text-court-text-ter text-court-xs w-12 text-right">
          {pct}%
        </span>
      </div>
    </div>
  );
}

// ── Recent signup row ──
function SignupRow({
  profile,
}: {
  profile: {
    fullName: string;
    university: string;
    userType: string;
    rank: string;
    joinedAt: string;
  };
}) {
  const timeAgo = getTimeAgo(profile.joinedAt);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-court-border last:border-0">
      <div className="min-w-0">
        <div className="text-court-text text-court-sm font-bold truncate">
          {profile.fullName}
        </div>
        <div className="text-court-text-ter text-court-xs truncate">
          {profile.university} · {profile.userType === "professional" ? "Professional" : "Student"}
        </div>
      </div>
      <div className="text-court-text-ter text-[10px] shrink-0 ml-3">{timeAgo}</div>
    </div>
  );
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

// ── Sparkline Bar ──
function SparkBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max((value / max) * 100, 4) : 0;
  return (
    <div className="h-10 w-full flex items-end">
      <div
        className="bg-gold/30 hover:bg-gold/50 rounded-t w-full min-h-[2px] transition-colors"
        style={{ height: `${pct}%` }}
      />
    </div>
  );
}

// ── Main Dashboard ──
export default function AdminDashboard() {
  const kpis = useQuery(anyApi.admin.getKPIs);
  const recentSignups = useQuery(anyApi.admin.getRecentSignups, { limit: 10 });
  const subEvents = useQuery(anyApi.admin.getSubscriptionEvents, { limit: 10 });
  const snapshots = useQuery(anyApi.admin.getDailySnapshots, { days: 14 });

  if (kpis === undefined) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-court-xl text-court-text font-bold">Dashboard</h1>
            <p className="text-court-text-sec text-court-sm mt-1">Loading metrics...</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-navy-card border border-court-border rounded-court p-5 h-28 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kpis === null) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-court-text-sec text-court-sm">Access denied.</p>
      </div>
    );
  }

  const planOrder = ["free", "premium", "premium_plus", "professional", "professional_plus"];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-court-xl text-court-text font-bold">Dashboard</h1>
          <p className="text-court-text-sec text-court-sm mt-1">
            Real-time overview of Ratio operations
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Total Advocates"
            value={kpis.totalAdvocates}
            icon={Users}
          />
          <KPICard
            label="Monthly Recurring Revenue"
            value={kpis.mrrFormatted}
            sublabel={`ARR: ${kpis.arrFormatted}`}
            icon={PoundSterling}
            accent
          />
          <KPICard
            label="Paid Advocates"
            value={kpis.paidUsers}
            sublabel={`${kpis.totalAdvocates > 0 ? ((kpis.paidUsers / kpis.totalAdvocates) * 100).toFixed(1) : 0}% conversion`}
            icon={TrendingUp}
          />
          <KPICard
            label="Today's Signups"
            value={kpis.todaySignups}
            sublabel={`${kpis.recentAiSessions} AI sessions (24h)`}
            icon={UserPlus}
          />
        </div>

        {/* Daily Activity Sparkline */}
        {snapshots && snapshots.length > 0 && (
          <div className="bg-navy-card border border-court-border rounded-court p-5 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-court-base text-court-text font-bold">
                Daily Activity (14 days)
              </h2>
              <div className="flex items-center gap-4 text-court-xs text-court-text-ter">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-gold/40" />
                  Signups
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity size={10} />
                  Active users
                </span>
              </div>
            </div>
            <div className="flex items-end gap-[3px] h-16">
              {snapshots.map((s: any, i: number) => (
                <SparkBar
                  key={i}
                  value={s.newSignups ?? 0}
                  max={Math.max(...snapshots.map((d: any) => d.newSignups ?? 0), 1)}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-court-text-ter text-[10px]">14 days ago</span>
              <span className="text-court-text-ter text-[10px]">Today</span>
            </div>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Plan Breakdown */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Plan Distribution
            </h2>
            <div className="divide-y divide-court-border">
              {planOrder.map((plan) => (
                <PlanRow
                  key={plan}
                  plan={plan}
                  count={kpis.planBreakdown[plan] ?? 0}
                  total={kpis.totalAdvocates}
                />
              ))}
            </div>
          </div>

          {/* Recent Signups */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Recent Signups
            </h2>
            {recentSignups === undefined ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
                ))}
              </div>
            ) : recentSignups.length === 0 ? (
              <p className="text-court-text-ter text-court-xs">No signups yet.</p>
            ) : (
              <div>
                {recentSignups.map((profile: any) => (
                  <SignupRow key={profile.id} profile={profile} />
                ))}
              </div>
            )}
          </div>

          {/* Subscription Events */}
          <div className="bg-navy-card border border-court-border rounded-court p-5 lg:col-span-2">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Subscription Activity
            </h2>
            {subEvents === undefined ? (
              <div className="h-20 bg-white/5 rounded animate-pulse" />
            ) : subEvents.length === 0 ? (
              <p className="text-court-text-ter text-court-xs">
                No subscription events recorded yet. Events will appear here when advocates
                create, upgrade, downgrade, or cancel subscriptions.
              </p>
            ) : (
              <div className="divide-y divide-court-border">
                {subEvents.map((evt: any) => {
                  const icons: Record<string, React.ElementType> = {
                    created: UserPlus,
                    upgraded: TrendingUp,
                    downgraded: Scale,
                    canceled: Briefcase,
                    reactivated: Crown,
                  };
                  const Icon = icons[evt.event] ?? Brain;
                  const labels: Record<string, string> = {
                    created: "New subscription",
                    upgraded: "Upgraded",
                    downgraded: "Downgraded",
                    canceled: "Canceled",
                    reactivated: "Reactivated",
                    updated: "Updated",
                  };

                  return (
                    <div key={evt._id} className="flex items-center gap-3 py-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <Icon size={14} className="text-court-text-sec" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-court-text text-court-sm">
                          {labels[evt.event] ?? evt.event}
                        </span>
                        {evt.fromPlan && evt.toPlan && evt.fromPlan !== evt.toPlan && (
                          <span className="text-court-text-ter text-court-xs ml-2">
                            {PLAN_LABELS[evt.fromPlan] ?? evt.fromPlan} → {PLAN_LABELS[evt.toPlan] ?? evt.toPlan}
                          </span>
                        )}
                        {!evt.fromPlan && evt.toPlan && (
                          <span className="text-court-text-ter text-court-xs ml-2">
                            → {PLAN_LABELS[evt.toPlan] ?? evt.toPlan}
                          </span>
                        )}
                      </div>
                      <div className="text-court-text-ter text-[10px] shrink-0">
                        {getTimeAgo(new Date(evt.timestamp).toISOString())}
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
