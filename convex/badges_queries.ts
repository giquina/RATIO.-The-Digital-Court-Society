import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

// Get all badge definitions
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("badges").collect();
  },
});

// Get badges earned by the current user
export const getMyBadges = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return [];
    const earned = await ctx.db
      .query("userBadges")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    return earned;
  },
});

// Get badges earned by a specific profile
export const getByProfile = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const earned = await ctx.db
      .query("userBadges")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    // Resolve badge details
    const badges = await Promise.all(
      earned.map(async (ub) => {
        const badge = await ctx.db.get(ub.badgeId);
        return { ...ub, badge };
      })
    );
    return badges;
  },
});
