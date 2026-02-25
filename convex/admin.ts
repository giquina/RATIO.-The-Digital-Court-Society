import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// ── Price mapping (pence per month) ──
const PLAN_MRR_PENCE: Record<string, number> = {
  free: 0,
  premium: 599,
  premium_plus: 799,
  professional: 1499,
  professional_plus: 2499,
};

// ── Helper: verify admin role ──
async function requireAdmin(
  ctx: { db: any },
  userId: any
): Promise<{ role: string } | null> {
  if (!userId) return null;
  const adminRole = await ctx.db
    .query("adminRoles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
  return adminRole;
}

// ════════════════════════════════════════════
// KPIs
// ════════════════════════════════════════════

export const getKPIs = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return null;

    // Total advocates
    const allProfiles = await ctx.db.query("profiles").collect();
    const totalAdvocates = allProfiles.length;

    // Subscriptions
    const allSubs = await ctx.db.query("subscriptions").collect();
    const activeSubs = allSubs.filter((s) => s.status === "active");
    const paidSubs = activeSubs.filter((s) => s.plan !== "free");

    let mrrCents = 0;
    for (const sub of activeSubs) {
      mrrCents += PLAN_MRR_PENCE[sub.plan] ?? 0;
    }

    // Today's signups
    const today = new Date().toISOString().slice(0, 10);
    const dayStart = new Date(today + "T00:00:00Z").getTime();
    const todaySignups = allProfiles.filter(
      (p) => p._creationTime >= dayStart
    ).length;

    // Recent AI sessions (last 24h)
    const oneDayAgo = Date.now() - 86_400_000;
    const aiSessions = await ctx.db.query("aiSessions").collect();
    const recentAiSessions = aiSessions.filter(
      (s) => s._creationTime >= oneDayAgo
    ).length;

    // Plan breakdown
    const planBreakdown: Record<string, number> = {};
    for (const sub of activeSubs) {
      planBreakdown[sub.plan] = (planBreakdown[sub.plan] ?? 0) + 1;
    }
    // Count free users (profiles without a subscription)
    const usersWithSub = new Set(allSubs.map((s) => s.userId.toString()));
    const freeUsers = allProfiles.filter(
      (p) => !usersWithSub.has(p.userId.toString())
    ).length;
    planBreakdown["free"] = (planBreakdown["free"] ?? 0) + freeUsers;

    return {
      totalAdvocates,
      paidUsers: paidSubs.length,
      mrrPence: mrrCents,
      mrrFormatted: `£${(mrrCents / 100).toFixed(2)}`,
      arrFormatted: `£${((mrrCents * 12) / 100).toFixed(2)}`,
      todaySignups,
      recentAiSessions,
      planBreakdown,
    };
  },
});

// ════════════════════════════════════════════
// RECENT SIGNUPS
// ════════════════════════════════════════════

export const getRecentSignups = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return [];

    const limit = Math.min(args.limit ?? 20, 100);
    const profiles = await ctx.db
      .query("profiles")
      .order("desc")
      .take(limit);

    return profiles.map((p) => ({
      id: p._id,
      fullName: p.fullName,
      university: p.universityShort ?? p.university ?? "—",
      userType: p.userType ?? "student",
      rank: p.rank,
      chamber: p.chamber ?? "—",
      joinedAt: new Date(p._creationTime).toISOString(),
      totalMoots: p.totalMoots,
      totalPoints: p.totalPoints,
    }));
  },
});

// ════════════════════════════════════════════
// REVENUE BREAKDOWN
// ════════════════════════════════════════════

export const getRevenueBreakdown = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return null;

    const allSubs = await ctx.db.query("subscriptions").collect();
    const activeSubs = allSubs.filter((s) => s.status === "active" && s.plan !== "free");

    const byPlan: Record<string, { count: number; mrrPence: number }> = {};
    for (const sub of activeSubs) {
      if (!byPlan[sub.plan]) {
        byPlan[sub.plan] = { count: 0, mrrPence: 0 };
      }
      byPlan[sub.plan].count++;
      byPlan[sub.plan].mrrPence += PLAN_MRR_PENCE[sub.plan] ?? 0;
    }

    let totalMrrPence = 0;
    for (const plan of Object.values(byPlan)) {
      totalMrrPence += plan.mrrPence;
    }

    return {
      totalMrrPence,
      totalMrrFormatted: `£${(totalMrrPence / 100).toFixed(2)}`,
      arrFormatted: `£${((totalMrrPence * 12) / 100).toFixed(2)}`,
      totalPaidUsers: activeSubs.length,
      byPlan,
    };
  },
});

// ════════════════════════════════════════════
// ADVOCATES LIST (CRM-lite)
// ════════════════════════════════════════════

export const getAdvocatesList = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    search: v.optional(v.string()),
    plan: v.optional(v.string()),
    rank: v.optional(v.string()),
    university: v.optional(v.string()),
    userType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return null;

    const limit = Math.min(args.limit ?? 50, 200);
    const offset = args.offset ?? 0;
    let profiles = await ctx.db.query("profiles").order("desc").collect();

    // Filter by university
    if (args.university) {
      profiles = profiles.filter(
        (p) =>
          p.universityShort === args.university ||
          p.university === args.university
      );
    }
    // Filter by userType
    if (args.userType) {
      profiles = profiles.filter(
        (p) => (p.userType ?? "student") === args.userType
      );
    }
    // Filter by rank
    if (args.rank) {
      profiles = profiles.filter((p) => p.rank === args.rank);
    }
    // Filter by search (name or university)
    if (args.search) {
      const q = args.search.toLowerCase();
      profiles = profiles.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          (p.university ?? "").toLowerCase().includes(q) ||
          (p.universityShort ?? "").toLowerCase().includes(q)
      );
    }

    const totalFiltered = profiles.length;

    // Paginate
    const sliced = profiles.slice(offset, offset + limit);

    // Enrich with subscription data + apply plan filter
    const result = [];
    for (const p of sliced) {
      const sub = await ctx.db
        .query("subscriptions")
        .withIndex("by_user", (q: any) => q.eq("userId", p.userId))
        .first();

      const plan = sub?.plan ?? "free";

      // Plan filter (post-enrich since plan comes from subscriptions table)
      if (args.plan && plan !== args.plan) continue;

      result.push({
        id: p._id,
        userId: p.userId,
        fullName: p.fullName,
        university: p.universityShort ?? p.university ?? "—",
        userType: p.userType ?? "student",
        rank: p.rank,
        chamber: p.chamber ?? "—",
        plan,
        subscriptionStatus: sub?.status ?? "none",
        totalMoots: p.totalMoots,
        totalPoints: p.totalPoints,
        totalHours: p.totalHours,
        streakDays: p.streakDays,
        streakLastDate: p.streakLastDate ?? null,
        followerCount: p.followerCount,
        joinedAt: new Date(p._creationTime).toISOString(),
      });
    }

    return { advocates: result, total: totalFiltered };
  },
});

// ════════════════════════════════════════════
// SUBSCRIPTION EVENTS
// ════════════════════════════════════════════

export const getSubscriptionEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return [];

    const limit = Math.min(args.limit ?? 50, 200);
    return ctx.db
      .query("subscriptionEvents")
      .withIndex("by_timestamp")
      .order("desc")
      .take(limit);
  },
});

// ════════════════════════════════════════════
// DAILY SNAPSHOTS (for charts)
// ════════════════════════════════════════════

export const getDailySnapshots = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return [];

    const days = Math.min(args.days ?? 30, 90);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDate = cutoff.toISOString().slice(0, 10);

    const all = await ctx.db
      .query("analyticsDaily")
      .withIndex("by_date")
      .collect();

    return all.filter((s) => s.date >= cutoffDate).sort((a, b) => a.date.localeCompare(b.date));
  },
});

// ════════════════════════════════════════════
// COHORT RETENTION
// ════════════════════════════════════════════

export const getCohortRetention = query({
  args: { weeks: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return [];

    const weeks = Math.min(args.weeks ?? 12, 52);

    // Fetch cohort records ordered by week descending, take the most recent N
    const cohorts = await ctx.db
      .query("analyticsCohorts")
      .withIndex("by_week")
      .order("desc")
      .take(weeks);

    return cohorts;
  },
});

// ════════════════════════════════════════════
// CHECK ADMIN ROLE (for layout auth gate)
// ════════════════════════════════════════════

export const getMyAdminRole = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const adminRole = await ctx.db
      .query("adminRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return adminRole ? { role: adminRole.role } : null;
  },
});

// ════════════════════════════════════════════
// SEED ADMIN ROLE (one-time setup)
// ════════════════════════════════════════════

// ════════════════════════════════════════════
// AI USAGE STATS
// ════════════════════════════════════════════

export const getAiUsageStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return null;

    // All AI sessions
    const allAiSessions = await ctx.db.query("aiSessions").collect();
    const totalSessions = allAiSessions.length;

    // Sessions today
    const today = new Date().toISOString().slice(0, 10);
    const dayStart = new Date(today + "T00:00:00Z").getTime();
    const sessionsToday = allAiSessions.filter(
      (s: any) => s._creationTime >= dayStart
    ).length;

    // Completed sessions
    const completedSessions = allAiSessions.filter(
      (s: any) => s.status === "completed"
    );

    // Mode breakdown
    const modeBreakdown: Record<string, number> = {};
    for (const s of allAiSessions) {
      modeBreakdown[s.mode] = (modeBreakdown[s.mode] ?? 0) + 1;
    }

    // Recent sessions (last 20) with profile info
    const recentSessions = allAiSessions
      .sort((a: any, b: any) => b._creationTime - a._creationTime)
      .slice(0, 20);

    const enrichedRecent = [];
    for (const s of recentSessions) {
      const profile = await ctx.db.get(s.profileId);
      enrichedRecent.push({
        _id: s._id,
        mode: s.mode,
        areaOfLaw: s.areaOfLaw,
        caseTitle: s.caseTitle,
        status: s.status,
        durationSeconds: s.durationSeconds,
        overallScore: s.overallScore,
        messageCount: s.transcript.length,
        createdAt: new Date(s._creationTime).toISOString(),
        advocateName: profile?.fullName ?? "Unknown",
        university: profile?.universityShort ?? profile?.university ?? "—",
      });
    }

    // Token data from analyticsDaily snapshots (last 30 days)
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const cutoffDate = cutoff.toISOString().slice(0, 10);

    const allSnapshots = await ctx.db
      .query("analyticsDaily")
      .withIndex("by_date")
      .collect();

    const recentSnapshots = allSnapshots
      .filter((s: any) => s.date >= cutoffDate)
      .sort((a: any, b: any) => a.date.localeCompare(b.date));

    // Aggregate totals from snapshots
    let totalTokensFromSnapshots = 0;
    let totalCostCentsFromSnapshots = 0;
    for (const snap of allSnapshots) {
      totalTokensFromSnapshots += snap.aiTokensUsed ?? 0;
      totalCostCentsFromSnapshots += snap.aiCostCents ?? 0;
    }

    // Daily cost trend for chart
    const dailyCostTrend = recentSnapshots.map((s: any) => ({
      date: s.date,
      tokens: s.aiTokensUsed ?? 0,
      costCents: s.aiCostCents ?? 0,
      aiSessions: s.aiSessionsCompleted ?? 0,
    }));

    return {
      totalSessions,
      sessionsToday,
      completedSessions: completedSessions.length,
      modeBreakdown,
      totalTokens: totalTokensFromSnapshots,
      totalCostCents: totalCostCentsFromSnapshots,
      dailyCostTrend,
      recentSessions: enrichedRecent,
    };
  },
});

// ════════════════════════════════════════════
// SEED ADMIN ROLE (one-time setup)
// ════════════════════════════════════════════

export const seedOwnerRole = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Only works if no owner exists yet
    const existingOwner = await ctx.db
      .query("adminRoles")
      .collect();
    const hasOwner = existingOwner.some((r) => r.role === "owner");
    if (hasOwner) {
      throw new Error("An owner already exists. Use the admin panel to add new roles.");
    }

    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (!user) {
      throw new Error(`No user found with email: ${args.email}`);
    }

    return ctx.db.insert("adminRoles", {
      userId: user._id,
      role: "owner",
      grantedAt: new Date().toISOString(),
    });
  },
});
