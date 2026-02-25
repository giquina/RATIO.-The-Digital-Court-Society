import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

// ── Price mapping (pence per month) ──
const PLAN_MRR_PENCE: Record<string, number> = {
  free: 0,
  premium: 599,
  premium_plus: 799,
  professional: 1499,
  professional_plus: 2499,
};

// ── Daily snapshot computation ──
// Called by cron at 08:00 UTC every day
export const computeDailySnapshot = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10); // "2026-02-25"
    const dayStart = new Date(today + "T00:00:00Z").getTime();
    const dayEnd = dayStart + 86_400_000;

    // Check if we already computed today
    const existing = await ctx.db
      .query("analyticsDaily")
      .withIndex("by_date", (q) => q.eq("date", today))
      .first();
    if (existing) return existing._id;

    // Total users (all profiles)
    const allProfiles = await ctx.db.query("profiles").collect();
    const totalUsers = allProfiles.length;

    // New signups today (profiles created in the last 24h)
    const newSignups = allProfiles.filter(
      (p) => p._creationTime >= dayStart && p._creationTime < dayEnd
    ).length;

    // Active users: profiles that created a session or AI session today
    // We approximate by checking sessions + aiSessions created in the window
    const recentSessions = await ctx.db.query("sessions").collect();
    const todaySessions = recentSessions.filter(
      (s) => s._creationTime >= dayStart && s._creationTime < dayEnd
    );

    const recentAiSessions = await ctx.db.query("aiSessions").collect();
    const todayAiSessions = recentAiSessions.filter(
      (s) => s._creationTime >= dayStart && s._creationTime < dayEnd
    );

    // Unique active profile IDs from sessions + AI sessions
    const activeProfileIds = new Set<string>();
    for (const s of todaySessions) {
      if (s.creatorId) activeProfileIds.add(s.creatorId);
    }
    for (const a of todayAiSessions) {
      if (a.profileId) activeProfileIds.add(a.profileId);
    }
    const activeUsers = activeProfileIds.size;

    // Subscription metrics
    const allSubs = await ctx.db.query("subscriptions").collect();
    const activeSubs = allSubs.filter((s) => s.status === "active");
    const paidUsers = activeSubs.filter((s) => s.plan !== "free").length;

    let mrrCents = 0;
    for (const sub of activeSubs) {
      mrrCents += PLAN_MRR_PENCE[sub.plan] ?? 0;
    }

    // Churned today (subscription events with "canceled" in the last 24h)
    const subEvents = await ctx.db
      .query("subscriptionEvents")
      .withIndex("by_timestamp")
      .collect();
    const todayChurned = subEvents.filter(
      (e) =>
        e.event === "canceled" &&
        e.timestamp >= dayStart &&
        e.timestamp < dayEnd
    ).length;

    // Referral signups today
    const allReferrals = await ctx.db.query("referrals").collect();
    const todayReferralSignups = allReferrals.filter((r) => {
      if (!r.signedUpAt) return false;
      const t = new Date(r.signedUpAt).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;

    return ctx.db.insert("analyticsDaily", {
      date: today,
      totalUsers,
      newSignups,
      activeUsers,
      sessionsCreated: todaySessions.length,
      aiSessionsCompleted: todayAiSessions.length,
      aiTokensUsed: 0, // TODO: integrate with AI usage tracker when persistent
      aiCostCents: 0,
      paidUsers,
      mrrCents,
      churnedUsers: todayChurned,
      referralSignups: todayReferralSignups,
    });
  },
});

// ── Get latest daily snapshot ──
export const getLatestSnapshot = internalQuery({
  args: {},
  handler: async (ctx) => {
    const snapshots = await ctx.db
      .query("analyticsDaily")
      .withIndex("by_date")
      .order("desc")
      .take(1);
    return snapshots[0] ?? null;
  },
});

// ══════════════════════════════════════════════
// WEEKLY COHORT RETENTION
// ══════════════════════════════════════════════

function getISOWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum =
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

/** Convert an ISO week string like "2026-W08" to the Monday timestamp of that week. */
function isoWeekToTimestamp(isoWeek: string): number {
  const [yearStr, weekStr] = isoWeek.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(Date.UTC(year, 0, 4));
  // Monday of week 1
  const dayOfWeek = jan4.getUTCDay() || 7; // convert Sunday=0 to 7
  const week1Monday = new Date(jan4.getTime() - (dayOfWeek - 1) * 86_400_000);
  // Target week's Monday
  return week1Monday.getTime() + (week - 1) * 7 * 86_400_000;
}

const ONE_WEEK_MS = 7 * 86_400_000;

/**
 * Compute weekly cohort retention data.
 * Groups profiles by ISO week of creation, then for each cohort checks
 * retention at week+1, +4, +8, +12 and conversion to paid subscription.
 * Called by cron every Monday at 09:00 UTC.
 */
export const computeWeeklyCohorts = internalMutation({
  args: {},
  handler: async (ctx) => {
    // ── Collect all required data ──
    const allProfiles = await ctx.db.query("profiles").collect();
    const allSessions = await ctx.db.query("sessions").collect();
    const allAiSessions = await ctx.db.query("aiSessions").collect();
    const allSubscriptions = await ctx.db.query("subscriptions").collect();

    // Build a set of userIds with active paid subscriptions for conversion check
    const paidUserIds = new Set<string>();
    for (const sub of allSubscriptions) {
      if (sub.status === "active" && sub.plan !== "free") {
        paidUserIds.add(sub.userId as string);
      }
    }

    // ── Group profiles by cohort week ──
    const cohorts = new Map<
      string,
      Array<{ profileId: string; userId: string; createdAt: number }>
    >();

    for (const profile of allProfiles) {
      const week = getISOWeek(new Date(profile._creationTime));
      if (!cohorts.has(week)) {
        cohorts.set(week, []);
      }
      cohorts.get(week)!.push({
        profileId: profile._id as string,
        userId: profile.userId as string,
        createdAt: profile._creationTime,
      });
    }

    // ── Build a lookup: profileId → list of activity timestamps ──
    // Activity = session created OR aiSession completed
    const activityTimestamps = new Map<string, number[]>();

    for (const session of allSessions) {
      const pid = session.createdBy as string;
      if (!activityTimestamps.has(pid)) {
        activityTimestamps.set(pid, []);
      }
      activityTimestamps.get(pid)!.push(session._creationTime);
    }

    for (const aiSession of allAiSessions) {
      if (aiSession.status !== "completed") continue;
      const pid = aiSession.profileId as string;
      if (!activityTimestamps.has(pid)) {
        activityTimestamps.set(pid, []);
      }
      activityTimestamps.get(pid)!.push(aiSession._creationTime);
    }

    // ── For each cohort, compute retention at week+1, +4, +8, +12 ──
    const now = Date.now();

    for (const [cohortWeek, members] of cohorts) {
      const cohortStart = isoWeekToTimestamp(cohortWeek);
      const signupCount = members.length;

      // Helper: count members who had activity in the target week window
      const countRetention = (weekOffset: number): number => {
        const windowStart = cohortStart + weekOffset * ONE_WEEK_MS;
        const windowEnd = windowStart + ONE_WEEK_MS;
        // Only count if the target window is in the past (data exists)
        if (windowStart > now) return 0;

        let count = 0;
        for (const member of members) {
          const timestamps = activityTimestamps.get(member.profileId);
          if (!timestamps) continue;
          const hadActivity = timestamps.some(
            (t) => t >= windowStart && t < windowEnd
          );
          if (hadActivity) count++;
        }
        return count;
      };

      const retentionWeek1 = countRetention(1);
      const retentionWeek4 = countRetention(4);
      const retentionWeek8 = countRetention(8);
      const retentionWeek12 = countRetention(12);

      // Conversion to paid: members from this cohort whose userId has an active paid subscription
      let conversionToPaid = 0;
      for (const member of members) {
        if (paidUserIds.has(member.userId)) {
          conversionToPaid++;
        }
      }

      // ── Upsert into analyticsCohorts ──
      const existing = await ctx.db
        .query("analyticsCohorts")
        .withIndex("by_week", (q) => q.eq("cohortWeek", cohortWeek))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          signupCount,
          retentionWeek1,
          retentionWeek4,
          retentionWeek8,
          retentionWeek12,
          conversionToPaid,
        });
      } else {
        await ctx.db.insert("analyticsCohorts", {
          cohortWeek,
          signupCount,
          retentionWeek1,
          retentionWeek4,
          retentionWeek8,
          retentionWeek12,
          conversionToPaid,
        });
      }
    }
  },
});

// ── Get snapshots for date range ──
export const getSnapshotRange = internalQuery({
  args: { startDate: v.string(), endDate: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("analyticsDaily")
      .withIndex("by_date")
      .collect();
    return all.filter((s) => s.date >= args.startDate && s.date <= args.endDate);
  },
});
