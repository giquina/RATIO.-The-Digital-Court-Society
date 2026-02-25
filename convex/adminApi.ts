import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ── Price mapping (pence per month) ──
const PLAN_MRR_PENCE: Record<string, number> = {
  free: 0,
  premium: 599,
  premium_plus: 799,
  professional: 1499,
  professional_plus: 2499,
};

// ════════════════════════════════════════════
// 1. KPIs
// ════════════════════════════════════════════

export const getKPIsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allProfiles = await ctx.db.query("profiles").collect();
    const totalAdvocates = allProfiles.length;

    const allSubs = await ctx.db.query("subscriptions").collect();
    const activeSubs = allSubs.filter((s) => s.status === "active");
    const paidSubs = activeSubs.filter((s) => s.plan !== "free");

    let mrrPence = 0;
    for (const sub of activeSubs) {
      mrrPence += PLAN_MRR_PENCE[sub.plan] ?? 0;
    }

    const today = new Date().toISOString().slice(0, 10);
    const dayStart = new Date(today + "T00:00:00Z").getTime();
    const todaySignups = allProfiles.filter(
      (p) => p._creationTime >= dayStart
    ).length;

    const oneDayAgo = Date.now() - 86_400_000;
    const aiSessions = await ctx.db.query("aiSessions").collect();
    const recentAiSessions = aiSessions.filter(
      (s) => s._creationTime >= oneDayAgo
    ).length;

    const planBreakdown: Record<string, number> = {};
    for (const sub of activeSubs) {
      planBreakdown[sub.plan] = (planBreakdown[sub.plan] ?? 0) + 1;
    }
    const usersWithSub = new Set(allSubs.map((s) => s.userId.toString()));
    const freeUsers = allProfiles.filter(
      (p) => !usersWithSub.has(p.userId.toString())
    ).length;
    planBreakdown["free"] = (planBreakdown["free"] ?? 0) + freeUsers;

    return {
      totalAdvocates,
      paidUsers: paidSubs.length,
      mrrPence,
      mrrFormatted: `\u00a3${(mrrPence / 100).toFixed(2)}`,
      arrFormatted: `\u00a3${((mrrPence * 12) / 100).toFixed(2)}`,
      todaySignups,
      recentAiSessions,
      planBreakdown,
    };
  },
});

// ════════════════════════════════════════════
// 2. Revenue Breakdown
// ════════════════════════════════════════════

export const getRevenueInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allSubs = await ctx.db.query("subscriptions").collect();
    const activeSubs = allSubs.filter(
      (s) => s.status === "active" && s.plan !== "free"
    );

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
      totalMrrFormatted: `\u00a3${(totalMrrPence / 100).toFixed(2)}`,
      arrFormatted: `\u00a3${((totalMrrPence * 12) / 100).toFixed(2)}`,
      totalPaidUsers: activeSubs.length,
      byPlan,
    };
  },
});

// ════════════════════════════════════════════
// 3. Cohort Retention
// ════════════════════════════════════════════

export const getCohortsInternal = internalQuery({
  args: { weeks: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const weeks = Math.min(args.weeks ?? 12, 52);
    const cohorts = await ctx.db
      .query("analyticsCohorts")
      .withIndex("by_week")
      .order("desc")
      .take(weeks);
    return cohorts;
  },
});

// ════════════════════════════════════════════
// 4. Advocates List (paginated, filterable)
// ════════════════════════════════════════════

export const getAdvocatesInternal = internalQuery({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
    search: v.optional(v.string()),
    plan: v.optional(v.string()),
    rank: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(args.limit ?? 20, 200);
    const offset = args.offset ?? 0;
    let profiles = await ctx.db.query("profiles").order("desc").collect();

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
    const sliced = profiles.slice(offset, offset + limit);

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
        university: p.universityShort ?? p.university ?? "\u2014",
        userType: p.userType ?? "student",
        rank: p.rank,
        chamber: p.chamber ?? "\u2014",
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
// 5. Single Advocate Detail
// ════════════════════════════════════════════

export const getAdvocateDetailInternal = internalQuery({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return null;

    // Subscription
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q: any) => q.eq("userId", profile.userId))
      .first();

    // Recent sessions (last 10 where they participated)
    const participations = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_profile", (q: any) => q.eq("profileId", args.profileId))
      .order("desc")
      .take(10);

    const recentSessions = [];
    for (const part of participations) {
      const session = await ctx.db.get(part.sessionId);
      if (session) {
        recentSessions.push({
          id: session._id,
          title: session.title,
          module: session.module,
          type: session.type,
          date: session.date,
          status: session.status,
          attended: part.attended,
        });
      }
    }

    // Recent AI sessions (last 10)
    const aiSessions = await ctx.db
      .query("aiSessions")
      .withIndex("by_profile", (q: any) => q.eq("profileId", args.profileId))
      .order("desc")
      .take(10);

    const recentAiSessions = aiSessions.map((s) => ({
      id: s._id,
      mode: s.mode,
      areaOfLaw: s.areaOfLaw,
      caseTitle: s.caseTitle,
      status: s.status,
      overallScore: s.overallScore,
      durationSeconds: s.durationSeconds,
      messageCount: s.transcript.length,
      createdAt: new Date(s._creationTime).toISOString(),
    }));

    return {
      id: profile._id,
      userId: profile.userId,
      fullName: profile.fullName,
      university: profile.universityShort ?? profile.university ?? "\u2014",
      userType: profile.userType ?? "student",
      rank: profile.rank,
      chamber: profile.chamber ?? "\u2014",
      bio: profile.bio ?? null,
      plan: sub?.plan ?? "free",
      subscriptionStatus: sub?.status ?? "none",
      totalMoots: profile.totalMoots,
      totalPoints: profile.totalPoints,
      totalHours: profile.totalHours,
      streakDays: profile.streakDays,
      streakLastDate: profile.streakLastDate ?? null,
      readinessScore: profile.readinessScore,
      followerCount: profile.followerCount,
      followingCount: profile.followingCount,
      commendationCount: profile.commendationCount,
      isAmbassador: profile.isAmbassador ?? false,
      ambassadorTier: profile.ambassadorTier ?? null,
      referralCount: profile.referralCount ?? 0,
      joinedAt: new Date(profile._creationTime).toISOString(),
      recentSessions,
      recentAiSessions,
    };
  },
});

// ════════════════════════════════════════════
// 6. Churn Risk
// ════════════════════════════════════════════

export const getChurnRiskInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allSubs = await ctx.db.query("subscriptions").collect();
    const activeSubs = allSubs.filter(
      (s) => s.status === "active" && s.plan !== "free"
    );

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    const cutoffDate = fourteenDaysAgo.toISOString().slice(0, 10);

    const atRisk = [];
    for (const sub of activeSubs) {
      // Find the profile for this user
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q: any) => q.eq("userId", sub.userId))
        .first();

      if (!profile) continue;

      // Check if streakLastDate is older than 14 days or missing
      const lastActive = profile.streakLastDate;
      if (!lastActive || lastActive < cutoffDate) {
        atRisk.push({
          id: profile._id,
          userId: profile.userId,
          fullName: profile.fullName,
          university: profile.universityShort ?? profile.university ?? "\u2014",
          plan: sub.plan,
          streakDays: profile.streakDays,
          lastActiveDate: lastActive ?? "never",
          daysSinceActive: lastActive
            ? Math.floor(
                (Date.now() - new Date(lastActive).getTime()) / 86_400_000
              )
            : null,
          totalMoots: profile.totalMoots,
          totalPoints: profile.totalPoints,
        });
      }
    }

    // Sort by days since active (most inactive first)
    atRisk.sort((a, b) => {
      if (a.daysSinceActive === null) return -1;
      if (b.daysSinceActive === null) return 1;
      return b.daysSinceActive - a.daysSinceActive;
    });

    return { atRisk, total: atRisk.length };
  },
});

// ════════════════════════════════════════════
// 7. AI Usage Stats
// ════════════════════════════════════════════

export const getAiUsageInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allAiSessions = await ctx.db.query("aiSessions").collect();
    const totalSessions = allAiSessions.length;

    const today = new Date().toISOString().slice(0, 10);
    const dayStart = new Date(today + "T00:00:00Z").getTime();
    const sessionsToday = allAiSessions.filter(
      (s) => s._creationTime >= dayStart
    ).length;

    const completedSessions = allAiSessions.filter(
      (s) => s.status === "completed"
    );

    // Mode breakdown
    const modeBreakdown: Record<string, number> = {};
    for (const s of allAiSessions) {
      modeBreakdown[s.mode] = (modeBreakdown[s.mode] ?? 0) + 1;
    }

    // Recent sessions (last 20) with profile info
    const recentSessions = allAiSessions
      .sort((a, b) => b._creationTime - a._creationTime)
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
        university:
          profile?.universityShort ?? profile?.university ?? "\u2014",
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
      .filter((s) => s.date >= cutoffDate)
      .sort((a, b) => a.date.localeCompare(b.date));

    let totalTokensFromSnapshots = 0;
    let totalCostCentsFromSnapshots = 0;
    for (const snap of allSnapshots) {
      totalTokensFromSnapshots += snap.aiTokensUsed ?? 0;
      totalCostCentsFromSnapshots += snap.aiCostCents ?? 0;
    }

    const dailyCostTrend = recentSnapshots.map((s) => ({
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
// 8. Referral Stats
// ════════════════════════════════════════════

export const getReferralStatsInternal = internalQuery({
  args: {},
  handler: async (ctx) => {
    const allReferrals = await ctx.db.query("referrals").collect();

    // Count by status
    const byStatus: Record<string, number> = {};
    for (const r of allReferrals) {
      byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
    }

    // Top referrers: count referrals per referrerId
    const referrerCounts: Record<string, number> = {};
    for (const r of allReferrals) {
      const rid = r.referrerId.toString();
      referrerCounts[rid] = (referrerCounts[rid] ?? 0) + 1;
    }

    // Sort by count, take top 20
    const sorted = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    const topReferrers = [];
    for (const [profileId, count] of sorted) {
      const profileDoc = await ctx.db.get(
        profileId as Id<"profiles">
      );
      topReferrers.push({
        profileId,
        fullName: profileDoc?.fullName ?? "Unknown",
        university:
          profileDoc?.universityShort ?? profileDoc?.university ?? "\u2014",
        referralCount: count,
      });
    }

    return {
      totalReferrals: allReferrals.length,
      byStatus,
      topReferrers,
    };
  },
});

// ════════════════════════════════════════════
// 9. Daily Snapshots
// ════════════════════════════════════════════

export const getSnapshotsInternal = internalQuery({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = Math.min(args.days ?? 30, 90);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffDate = cutoff.toISOString().slice(0, 10);

    const all = await ctx.db
      .query("analyticsDaily")
      .withIndex("by_date")
      .collect();

    return all
      .filter((s) => s.date >= cutoffDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

// ════════════════════════════════════════════
// 10. Search Advocates
// ════════════════════════════════════════════

export const searchAdvocatesInternal = internalQuery({
  args: { q: v.string() },
  handler: async (ctx, args) => {
    const term = args.q.toLowerCase();
    if (term.length < 2) return [];

    const profiles = await ctx.db.query("profiles").collect();
    const matches = profiles.filter(
      (p) =>
        p.fullName.toLowerCase().includes(term) ||
        (p.university ?? "").toLowerCase().includes(term) ||
        (p.universityShort ?? "").toLowerCase().includes(term)
    );

    return matches.slice(0, 50).map((p) => ({
      id: p._id,
      fullName: p.fullName,
      university: p.universityShort ?? p.university ?? "\u2014",
      userType: p.userType ?? "student",
      rank: p.rank,
      chamber: p.chamber ?? "\u2014",
      totalPoints: p.totalPoints,
      joinedAt: new Date(p._creationTime).toISOString(),
    }));
  },
});
