import { v } from "convex/values";
import { query, mutation } from "../_generated/server";

export const getProfileTier = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("governanceTiers")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .first();
  },
});

export const calculateAndUpdateTier = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return;

    // Calculate contribution points from activities
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();

    const contributions = activities.length * 5; // Simplified calculation
    const mootCount = profile.totalMoots;
    const averageScore = profile.readinessScore;

    // Determine tier
    let tier = "member";
    if (mootCount >= 50 && averageScore >= 80) tier = "judicial";
    else if (mootCount >= 30 && averageScore >= 70) tier = "constitutional";
    else if (mootCount >= 10 && averageScore >= 60) tier = "voting";
    else if (mootCount >= 3 && averageScore >= 50) tier = "accredited";

    // Upsert tier record
    const existing = await ctx.db
      .query("governanceTiers")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        tier,
        calculatedAt: new Date().toISOString(),
        contributionPoints: contributions,
        mootCount,
        averageScore,
      });
    } else {
      await ctx.db.insert("governanceTiers", {
        profileId: args.profileId,
        tier,
        calculatedAt: new Date().toISOString(),
        contributionPoints: contributions,
        mootCount,
        averageScore,
      });
    }

    return tier;
  },
});

export const getLeaderboardByTier = query({
  args: { tier: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const tiers = args.tier
      ? await ctx.db.query("governanceTiers").withIndex("by_tier", (idx) => idx.eq("tier", args.tier!)).collect()
      : await ctx.db.query("governanceTiers").collect();
    return Promise.all(
      tiers.map(async (t) => {
        const profile = await ctx.db.get(t.profileId);
        return { ...t, profile };
      })
    );
  },
});
