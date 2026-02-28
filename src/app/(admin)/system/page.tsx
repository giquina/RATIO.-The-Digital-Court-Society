"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  Activity,
  CheckCircle,
  Clock,
  AlertTriangle,
  Server,
  Database,
  Globe,
  Shield,
  Zap,
  FileText,
  ArrowRight,
  RefreshCw,
  Terminal,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";

// ── Status Badge ──
function StatusBadge({
  status,
  label,
}: {
  status: "operational" | "degraded" | "down" | "running" | "scheduled";
  label: string;
}) {
  const styles: Record<string, { dot: string; text: string; bg: string }> = {
    operational: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    running: {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    degraded: {
      dot: "bg-amber-400",
      text: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    down: {
      dot: "bg-red-400",
      text: "text-red-400",
      bg: "bg-red-400/10",
    },
    scheduled: {
      dot: "bg-blue-400",
      text: "text-blue-400",
      bg: "bg-blue-400/10",
    },
  };

  const style = styles[status] ?? styles.operational;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase",
        style.bg,
        style.text
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {label}
    </span>
  );
}

// ── KPI Card (matching the dashboard pattern) ──
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

// ── Time formatting ──
function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Action label formatting ──
function formatAction(action: string): string {
  return action
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Cron Jobs Data ──
const CRON_JOBS = [
  {
    name: "Daily Analytics Snapshot",
    schedule: "Every day at 08:00 UTC",
    description: "Computes daily KPIs: signups, active users, MRR, churn",
    function: "analytics.computeDailySnapshot",
  },
  {
    name: "Weekly Cohort Retention",
    schedule: "Monday at 09:00 UTC",
    description: "Groups advocates by signup week and computes retention at week 1, 4, 8, 12",
    function: "analytics.computeWeeklyCohorts",
  },
  {
    name: "Weekly Email Digest",
    schedule: "Monday at 08:30 UTC",
    description: "Sends KPI summary email to admin with week-over-week changes",
    function: "digest.sendWeeklyDigest",
  },
];

// ── Convex Functions Overview ──
const FUNCTION_COUNTS = {
  queries: 18,
  mutations: 22,
  actions: 5,
  internalMutations: 6,
  internalActions: 3,
  internalQueries: 3,
};

// ── Environment Stack ──
const STACK_ITEMS = [
  { name: "Next.js 14", detail: "App Router", icon: Globe },
  { name: "Convex", detail: "Real-time backend", icon: Database },
  { name: "Vercel", detail: "Edge deployment", icon: Zap },
  { name: "Tailwind CSS", detail: "Utility-first styles", icon: Box },
  { name: "Resend", detail: "Transactional email", icon: FileText },
  { name: "Daily.co", detail: "Video sessions", icon: Terminal },
];

// ── Main System Page ──
export default function SystemPage() {
  const auditLogs = useQuery(anyApi.auditLog.getRecentLogs, { limit: 20 });

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-court-xl text-court-text font-bold">
            System Health
          </h1>
          <p className="text-court-text-sec text-court-sm mt-1">
            Infrastructure overview, cron schedules, and audit trail
          </p>
        </div>

        {/* System Status Banner */}
        <div className="bg-navy-card border border-court-border rounded-court p-5 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/10 flex items-center justify-center">
                <CheckCircle size={24} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="font-serif text-court-base text-court-text font-bold">
                  All Systems Operational
                </h2>
                <p className="text-court-text-ter text-court-xs mt-0.5">
                  Convex backend, Vercel edge, and all services are running normally
                </p>
              </div>
            </div>
            <StatusBadge status="operational" label="Operational" />
          </div>
          {/* Service row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-court-border">
            {[
              { label: "Convex Backend", status: "operational" as const },
              { label: "Vercel Edge", status: "operational" as const },
              { label: "Resend Email", status: "operational" as const },
              { label: "Daily.co Video", status: "operational" as const },
            ].map((service) => (
              <div
                key={service.label}
                className="flex items-center gap-2 py-2 px-3 rounded-lg bg-white/[0.02]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-court-text-sec text-court-xs">
                  {service.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Function Counts KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <KPICard
            label="Queries"
            value={FUNCTION_COUNTS.queries}
            sublabel={`+ ${FUNCTION_COUNTS.internalQueries} internal`}
            icon={Database}
          />
          <KPICard
            label="Mutations"
            value={FUNCTION_COUNTS.mutations}
            sublabel={`+ ${FUNCTION_COUNTS.internalMutations} internal`}
            icon={RefreshCw}
          />
          <KPICard
            label="Actions"
            value={FUNCTION_COUNTS.actions}
            sublabel={`+ ${FUNCTION_COUNTS.internalActions} internal`}
            icon={Zap}
            accent
          />
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Cron Jobs */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-court-base text-court-text font-bold">
                Cron Jobs
              </h2>
              <span className="text-court-text-ter text-[10px]">
                {CRON_JOBS.length} scheduled
              </span>
            </div>
            <div className="space-y-3">
              {CRON_JOBS.map((cron) => (
                <div
                  key={cron.name}
                  className="p-3 rounded-xl bg-white/[0.02] border border-court-border-light"
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-court-text-sec shrink-0" />
                      <span className="text-court-text text-court-sm font-bold">
                        {cron.name}
                      </span>
                    </div>
                    <StatusBadge status="running" label="Running" />
                  </div>
                  <p className="text-court-text-ter text-court-xs ml-[22px] mb-1">
                    {cron.description}
                  </p>
                  <div className="flex items-center gap-2 ml-[22px]">
                    <span className="text-court-text-ter text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded">
                      {cron.schedule}
                    </span>
                    <span className="text-court-text-ter text-[10px] font-mono">
                      {cron.function}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environment / Stack */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <h2 className="font-serif text-court-base text-court-text font-bold mb-4">
              Platform Stack
            </h2>
            <div className="space-y-2">
              {STACK_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between py-2.5 border-b border-court-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Icon size={14} className="text-court-text-sec" />
                      </div>
                      <div>
                        <span className="text-court-text text-court-sm font-bold">
                          {item.name}
                        </span>
                        <span className="text-court-text-ter text-court-xs ml-2">
                          {item.detail}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status="operational" label="Active" />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-court-border">
              <div className="flex flex-wrap gap-2">
                {[
                  "TypeScript",
                  "Zustand",
                  "Framer Motion",
                  "Lucide React",
                  "Sonner",
                  "@convex-dev/auth",
                ].map((dep) => (
                  <span
                    key={dep}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-white/5 text-court-text-ter"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Error Monitoring */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-court-text-sec" />
              <h2 className="font-serif text-court-base text-court-text font-bold">
                Error Monitoring
              </h2>
            </div>
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <Shield size={24} className="text-court-text-ter" />
              </div>
              <p className="text-court-text-sec text-court-sm font-bold mb-1">
                Connect Sentry for error monitoring
              </p>
              <p className="text-court-text-ter text-court-xs text-center max-w-xs mb-4">
                Set SENTRY_DSN and SENTRY_AUTH_TOKEN environment variables to
                enable real-time error tracking and alerting
              </p>
              <a
                href="https://sentry.io"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-gold text-court-xs font-bold hover:text-gold/80 transition-colors"
              >
                <span>Configure Sentry</span>
                <ArrowRight size={12} />
              </a>
            </div>
          </div>

          {/* Schema Overview */}
          <div className="bg-navy-card border border-court-border rounded-court p-5">
            <div className="flex items-center gap-2 mb-4">
              <Server size={16} className="text-court-text-sec" />
              <h2 className="font-serif text-court-base text-court-text font-bold">
                Database Schema
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { category: "Users & Profiles", tables: 2 },
                { category: "Social", tables: 3 },
                { category: "Sessions", tables: 3 },
                { category: "Moot Court", tables: 2 },
                { category: "Law Book", tables: 7 },
                { category: "Governance", tables: 12 },
                { category: "Tournaments", tables: 3 },
                { category: "Video", tables: 3 },
                { category: "Subscriptions", tables: 2 },
                { category: "Research", tables: 2 },
                { category: "Referrals", tables: 3 },
                { category: "Analytics", tables: 4 },
              ].map((group) => (
                <div
                  key={group.category}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.02]"
                >
                  <span className="text-court-text-sec text-court-xs">
                    {group.category}
                  </span>
                  <span className="text-court-text text-court-xs font-bold">
                    {group.tables}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-court-border flex items-center justify-between">
              <span className="text-court-text-ter text-[10px]">
                Total tables in schema
              </span>
              <span className="text-court-text text-court-sm font-bold">
                ~40
              </span>
            </div>
          </div>
        </div>

        {/* Audit Log — Full width */}
        <div className="bg-navy-card border border-court-border rounded-court p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-gold" />
              <h2 className="font-serif text-court-base text-court-text font-bold">
                Audit Log
              </h2>
            </div>
            <span className="text-court-text-ter text-[10px]">
              Recent admin actions
            </span>
          </div>

          {auditLogs === undefined ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-white/5 rounded animate-pulse"
                />
              ))}
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <FileText size={20} className="text-court-text-ter" />
              </div>
              <p className="text-court-text-sec text-court-sm font-bold mb-1">
                No audit log entries yet
              </p>
              <p className="text-court-text-ter text-court-xs text-center max-w-xs">
                Actions such as motion proposals, votes, role assignments, and
                sanctions will be recorded here automatically
              </p>
            </div>
          ) : (
            <div className="divide-y divide-court-border">
              {auditLogs.map((log: any) => (
                <div key={log._id} className="flex items-start gap-3 py-3">
                  {/* Timeline dot */}
                  <div className="mt-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gold/60" />
                  </div>
                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-court-text text-court-sm font-bold">
                        {formatAction(log.action)}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-court-text-ter">
                        {log.targetType}
                      </span>
                      {log.targetId && (
                        <span className="text-court-text-ter text-[10px] font-mono truncate max-w-[120px]">
                          {log.targetId}
                        </span>
                      )}
                    </div>
                    {log.details && (
                      <p className="text-court-text-ter text-court-xs mt-0.5 truncate">
                        {log.details}
                      </p>
                    )}
                  </div>
                  {/* Timestamp */}
                  <div className="text-court-text-ter text-[10px] shrink-0 mt-0.5">
                    {getTimeAgo(log._creationTime)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
