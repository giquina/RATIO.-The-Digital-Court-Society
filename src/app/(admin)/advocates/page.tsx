"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import {
  Search,
  Users,
  ChevronDown,
  X,
  Scale,
  Star,
  Trophy,
  Crown,
  GraduationCap,
  Loader2,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils/helpers";
import { PLAN_LABELS, PLAN_ORDER } from "@/lib/constants/stripe";

// ── Constants ──

const RANK_OPTIONS = [
  "Pupil",
  "Junior Counsel",
  "Senior Counsel",
  "King's Counsel",
  "Bencher",
] as const;

const PAGE_SIZE = 30;

// ── Plan badge (reused from revenue page pattern) ──

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
        "px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase whitespace-nowrap",
        styles[plan] ?? styles.free
      )}
    >
      {PLAN_LABELS[plan] ?? plan}
    </span>
  );
}

// ── Rank badge ──

function RankBadge({ rank }: { rank: string }) {
  const icons: Record<string, React.ElementType> = {
    Pupil: GraduationCap,
    "Junior Counsel": Scale,
    "Senior Counsel": Star,
    "King's Counsel": Crown,
    Bencher: Trophy,
  };
  const colors: Record<string, string> = {
    Pupil: "text-court-text-sec bg-white/5",
    "Junior Counsel": "text-blue-400 bg-blue-400/10",
    "Senior Counsel": "text-amber-400 bg-amber-400/10",
    "King's Counsel": "text-gold bg-gold/15",
    Bencher: "text-burgundy bg-burgundy/15",
  };
  const Icon = icons[rank] ?? GraduationCap;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide whitespace-nowrap",
        colors[rank] ?? colors.Pupil
      )}
    >
      <Icon size={10} />
      {rank}
    </span>
  );
}

// ── Avatar initials circle ──

function AvatarCircle({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
      <span className="text-gold text-court-xs font-bold">{initials}</span>
    </div>
  );
}

// ── Filter chip ──

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-court-xs font-medium transition-colors whitespace-nowrap",
        active
          ? "bg-gold/15 text-gold border border-gold/30"
          : "bg-white/5 text-court-text-sec border border-court-border hover:bg-white/10 hover:text-court-text"
      )}
    >
      {label}
    </button>
  );
}

// ── Time ago helper ──

function getTimeAgo(isoDate: string | null): string {
  if (!isoDate) return "Never";
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ── Main Page ──

export default function AdvocatesPage() {
  // Filter state
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string | null>(null);
  const [rankFilter, setRankFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [offset, setOffset] = useState(0);

  // Build query args — only include defined filters
  const queryArgs = useMemo(() => {
    const args: Record<string, any> = {
      limit: PAGE_SIZE,
      offset,
    };
    if (search.trim()) args.search = search.trim();
    if (planFilter) args.plan = planFilter;
    if (rankFilter) args.rank = rankFilter;
    return args;
  }, [search, planFilter, rankFilter, offset]);

  const data = useQuery(anyApi.admin.getAdvocatesList, queryArgs);

  // Reset offset when filters change
  const resetAndSetPlan = useCallback(
    (plan: string | null) => {
      setOffset(0);
      setPlanFilter((prev) => (prev === plan ? null : plan));
    },
    []
  );
  const resetAndSetRank = useCallback(
    (rank: string | null) => {
      setOffset(0);
      setRankFilter((prev) => (prev === rank ? null : rank));
    },
    []
  );

  const hasActiveFilters = !!planFilter || !!rankFilter || !!search.trim();

  const clearAllFilters = () => {
    setSearch("");
    setPlanFilter(null);
    setRankFilter(null);
    setOffset(0);
  };

  // ── Loading state ──
  if (data === undefined) {
    return (
      <div className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-court-xl text-court-text font-bold">
              Advocates
            </h1>
            <p className="text-court-text-sec text-court-sm mt-1">
              Loading advocate data...
            </p>
          </div>
          {/* Skeleton rows */}
          <div className="bg-navy-card border border-court-border rounded-court overflow-hidden">
            <div className="p-4 border-b border-court-border">
              <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
            </div>
            <div className="divide-y divide-court-border">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded animate-pulse w-40" />
                    <div className="h-2.5 bg-white/5 rounded animate-pulse w-24" />
                  </div>
                  <div className="h-5 bg-white/5 rounded-full animate-pulse w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Access denied ──
  if (data === null) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-court-text-sec text-court-sm">Access denied.</p>
      </div>
    );
  }

  const { advocates, total } = data;
  const showingFrom = offset + 1;
  const showingTo = offset + advocates.length;
  const hasMore = offset + PAGE_SIZE < total;
  const hasPrev = offset > 0;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-court-xl text-court-text font-bold">
            Advocates
          </h1>
          <p className="text-court-text-sec text-court-sm mt-1">
            {total} advocate{total !== 1 ? "s" : ""} registered
          </p>
        </div>

        {/* Search + Filter Controls */}
        <div className="bg-navy-card border border-court-border rounded-court overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-court-border">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-court-text-ter"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setOffset(0);
                  }}
                  placeholder="Search by name or university..."
                  className="w-full bg-white/5 border border-court-border rounded-xl pl-9 pr-3 py-2.5 text-court-sm text-court-text placeholder:text-court-text-ter focus:outline-none focus:border-gold/30 transition-colors"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setOffset(0);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-court-text-ter hover:text-court-text"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-court-xs font-medium transition-colors border whitespace-nowrap",
                  showFilters || hasActiveFilters
                    ? "bg-gold/10 text-gold border-gold/30"
                    : "bg-white/5 text-court-text-sec border-court-border hover:bg-white/10"
                )}
              >
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform",
                    showFilters && "rotate-180"
                  )}
                />
                Filters
                {hasActiveFilters && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </button>
            </div>

            {/* Filter chips */}
            {showFilters && (
              <div className="mt-4 space-y-3">
                {/* Plan filters */}
                <div>
                  <div className="text-court-text-ter text-[10px] font-bold uppercase tracking-wider mb-2">
                    Plan
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PLAN_ORDER.map((plan) => (
                      <FilterChip
                        key={plan}
                        label={PLAN_LABELS[plan] ?? plan}
                        active={planFilter === plan}
                        onClick={() => resetAndSetPlan(plan)}
                      />
                    ))}
                  </div>
                </div>

                {/* Rank filters */}
                <div>
                  <div className="text-court-text-ter text-[10px] font-bold uppercase tracking-wider mb-2">
                    Rank
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RANK_OPTIONS.map((rank) => (
                      <FilterChip
                        key={rank}
                        label={rank}
                        active={rankFilter === rank}
                        onClick={() => resetAndSetRank(rank)}
                      />
                    ))}
                  </div>
                </div>

                {/* Clear all */}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-court-text-ter text-court-xs hover:text-court-text transition-colors flex items-center gap-1"
                  >
                    <X size={12} />
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Table / List */}
          {advocates.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                <UserX size={24} className="text-court-text-ter" />
              </div>
              <p className="text-court-text-sec text-court-sm font-medium mb-1">
                No advocates found
              </p>
              <p className="text-court-text-ter text-court-xs text-center max-w-xs">
                {hasActiveFilters
                  ? "Try adjusting your search or filters to find advocates."
                  : "No advocates have registered yet."}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-gold text-court-xs font-medium hover:text-gold/80 transition-colors"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop table header */}
              <div className="hidden lg:grid grid-cols-[1fr_160px_100px_100px_80px_80px_80px] gap-3 px-4 py-2.5 text-court-text-ter text-[10px] font-bold uppercase tracking-wider border-b border-court-border bg-white/[0.02]">
                <div>Advocate</div>
                <div>University / Firm</div>
                <div>Rank</div>
                <div>Plan</div>
                <div className="text-right">Moots</div>
                <div className="text-right">Points</div>
                <div className="text-right">Last Active</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-court-border">
                {advocates.map((adv: any) => (
                  <div
                    key={adv.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Desktop row */}
                    <div className="hidden lg:grid grid-cols-[1fr_160px_100px_100px_80px_80px_80px] gap-3 items-center px-4 py-3">
                      {/* Name + avatar */}
                      <div className="flex items-center gap-3 min-w-0">
                        <AvatarCircle name={adv.fullName} />
                        <div className="min-w-0">
                          <div className="text-court-text text-court-sm font-medium truncate">
                            {adv.fullName}
                          </div>
                          <div className="text-court-text-ter text-[10px] capitalize">
                            {adv.userType}
                          </div>
                        </div>
                      </div>

                      {/* University */}
                      <div className="text-court-text-sec text-court-xs truncate">
                        {adv.university}
                      </div>

                      {/* Rank */}
                      <div>
                        <RankBadge rank={adv.rank} />
                      </div>

                      {/* Plan */}
                      <div>
                        <PlanBadge plan={adv.plan} />
                      </div>

                      {/* Moots */}
                      <div className="text-court-text text-court-xs text-right tabular-nums">
                        {adv.totalMoots}
                      </div>

                      {/* Points */}
                      <div className="text-court-text text-court-xs text-right tabular-nums">
                        {adv.totalPoints.toLocaleString()}
                      </div>

                      {/* Last active */}
                      <div className="text-court-text-ter text-[10px] text-right whitespace-nowrap">
                        {getTimeAgo(adv.streakLastDate)}
                      </div>
                    </div>

                    {/* Mobile row */}
                    <div className="lg:hidden flex items-start gap-3 px-4 py-3">
                      <AvatarCircle name={adv.fullName} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-court-text text-court-sm font-medium truncate">
                            {adv.fullName}
                          </span>
                        </div>
                        <div className="text-court-text-sec text-court-xs truncate mb-1.5">
                          {adv.university}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <RankBadge rank={adv.rank} />
                          <PlanBadge plan={adv.plan} />
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-court-text-ter text-[10px]">
                          <span>{adv.totalMoots} moots</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-court-text-ter" />
                          <span>
                            {adv.totalPoints.toLocaleString()} pts
                          </span>
                          <span className="w-0.5 h-0.5 rounded-full bg-court-text-ter" />
                          <span>{getTimeAgo(adv.streakLastDate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-court-border">
                <div className="text-court-text-ter text-court-xs">
                  Showing {showingFrom}–{showingTo} of {total}
                </div>
                <div className="flex items-center gap-2">
                  {hasPrev && (
                    <button
                      onClick={() =>
                        setOffset(Math.max(0, offset - PAGE_SIZE))
                      }
                      className="px-3 py-1.5 rounded-lg bg-white/5 text-court-text-sec text-court-xs hover:bg-white/10 transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  {hasMore && (
                    <button
                      onClick={() => setOffset(offset + PAGE_SIZE)}
                      className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-court-xs font-medium hover:bg-gold/15 transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
