"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  PoundSterling,
  TrendingUp,
  Users,
  UserPlus,
  Scale,
  Briefcase,
  Crown,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import {
  PLAN_ORDER,
  PLAN_LABELS,
  PLAN_PRICE_PENCE,
  PLAN_PRICE_FORMATTED,
} from "@/lib/constants/stripe";

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

// ── MRR Bar (simple CSS sparkline) ──
function MrrBar({ value, max }: { value: number; max: number }) {
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

function getTimeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Main Revenue Page ──
export default function RevenuePage() {
  const revenue = useQuery(anyApi.admin.getRevenueBreakdown);
  const snapshots = useQuery(anyApi.admin.getDailySnapshots, { days: 30 });
  const subEvents = useQuery(anyApi.admin.getSubscriptionEvents, { limit: 20 });

  if (revenue === undefined) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-court-xl text-court-text font-bold">Revenue</h1>
            <p className="text-court-text-sec text-court-sm mt-1">Loading revenue data...</p>
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

  if (revenue === null) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-court-text-sec text-court-sm">Access denied.</p>
      </div>
    );
  }

  // Compute derived metrics
  const mrrPounds = (revenue.totalMrrPence / 100).toFixed(2);
  const arrPounds = ((revenue.totalMrrPence * 12) / 100).toFixed(2);
  const avgRevenuePerUser =
    revenue.totalPaidUsers > 0
      ? ((revenue.totalMrrPence / revenue.totalPaidUsers) / 100).toFixed(2)
      : "0.00";

  // MRR trend from snapshots
  const mrrTrend = snapshots?.map((s: any) => s.mrrCents ?? 0) ?? [];
  const maxMrr = Math.max(...mrrTrend, 1);

  // Plan breakdown sorted by revenue contribution
  const planRows = PLAN_ORDER.filter((p) => p !== "free")
    .map((plan) => {
      const data = revenue.byPlan[plan];
      return {
        plan,
        count: data?.count ?? 0,
        mrrPence: data?.mrrPence ?? 0,
        pricePerUser: PLAN_PRICE_PENCE[plan] ?? 0,
      };
    })
    .sort((a, b) => b.mrrPence - a.mrrPence);

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-court-xl text-court-text font-bold">Revenue</h1>
          <p className="text-court-text-sec text-court-sm mt-1">
            Subscription revenue and plan analytics
          </p>
        </div>

        {/* Revenue KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            label="Monthly Recurring Revenue"
            value={`£${mrrPounds}`}
            icon={PoundSterling}
            accent
          />
          <KPICard
            label="Annual Run Rate"
            value={`£${arrPounds}`}
            icon={TrendingUp}
          />
          <KPICard
            label="Paid Advocates"
            value={revenue.totalPaidUsers}
            icon={Users}
          />
          <KPICard
            label="Avg Revenue / User"
            value={`£${avgRevenuePerUser}`}
            sublabel="per month"
            icon={PoundSterling}
          />
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* MRR Trend (last 30 days) */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              MRR Trend (30 days)
            </h2>
            {mrrTrend.length === 0 ? (
              <p className="text-court-text-ter text-court-xs">
                No daily snapshots yet. The cron job runs at 08:00 UTC daily.
              </p>
            ) : (
              <div className="flex items-end gap-[2px] h-32">
                {mrrTrend.map((val: number, i: number) => (
                  <MrrBar key={i} value={val} max={maxMrr} />
                ))}
              </div>
            )}
            {mrrTrend.length > 0 && (
              <div className="flex justify-between mt-2">
                <span className="text-court-text-ter text-[10px]">30 days ago</span>
                <span className="text-court-text-ter text-[10px]">Today</span>
              </div>
            )}
          </div>

          {/* Plan Breakdown */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Revenue by Plan
            </h2>
            <div className="space-y-3">
              {planRows.map((row) => {
                const pctOfTotal =
                  revenue.totalMrrPence > 0
                    ? ((row.mrrPence / revenue.totalMrrPence) * 100).toFixed(1)
                    : "0";
                return (
                  <div key={row.plan}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <PlanBadge plan={row.plan} />
                        <span className="text-court-text-ter text-court-xs">
                          {PLAN_PRICE_FORMATTED[row.plan]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-court-text text-court-sm font-bold">
                          £{(row.mrrPence / 100).toFixed(2)}
                        </span>
                        <span className="text-court-text-ter text-court-xs w-12 text-right">
                          {pctOfTotal}%
                        </span>
                      </div>
                    </div>
                    {/* Revenue bar */}
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          row.plan.startsWith("professional")
                            ? "bg-burgundy"
                            : "bg-gold"
                        )}
                        style={{
                          width: `${revenue.totalMrrPence > 0 ? (row.mrrPence / revenue.totalMrrPence) * 100 : 0}%`,
                        }}
                      />
                    </div>
                    <div className="text-court-text-ter text-[10px] mt-0.5">
                      {row.count} advocate{row.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                );
              })}
              {planRows.every((r) => r.count === 0) && (
                <p className="text-court-text-ter text-court-xs">
                  No paid subscriptions yet.
                </p>
              )}
            </div>
          </div>

          {/* Subscription Events Timeline */}
          <div className="bg-navy-card border border-court-border rounded-court p-5 lg:col-span-2">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Subscription Activity
            </h2>
            {subEvents === undefined ? (
              <div className="h-20 bg-white/5 rounded animate-pulse" />
            ) : subEvents.length === 0 ? (
              <p className="text-court-text-ter text-court-xs">
                No subscription events recorded yet.
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
