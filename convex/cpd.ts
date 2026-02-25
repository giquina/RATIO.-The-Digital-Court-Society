import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// ── Queries ──

/**
 * Get all CPD entries for the current user, ordered by date (newest first).
 */
export const getMyEntries = query({
  args: {
    year: v.optional(v.number()), // filter by year, e.g. 2026
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return [];

    let entries = await ctx.db
      .query("cpdEntries")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();

    // Filter by year if specified
    if (args.year) {
      const yearStr = String(args.year);
      entries = entries.filter((e) => e.date.startsWith(yearStr));
    }

    // Sort newest first
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  },
});

/**
 * Get CPD summary stats for the current user.
 * Returns total hours, breakdown by activity type, and monthly totals.
 */
export const getMySummary = query({
  args: {
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return null;

    let entries = await ctx.db
      .query("cpdEntries")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();

    const year = args.year ?? new Date().getFullYear();
    const yearStr = String(year);
    entries = entries.filter((e) => e.date.startsWith(yearStr));

    const totalMinutes = entries.reduce((sum, e) => sum + e.durationMinutes, 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

    // Breakdown by activity type
    const byActivity: Record<string, number> = {};
    for (const e of entries) {
      byActivity[e.activityType] = (byActivity[e.activityType] || 0) + e.durationMinutes;
    }

    // Monthly totals (1-12)
    const byMonth: Record<number, number> = {};
    for (const e of entries) {
      const month = parseInt(e.date.substring(5, 7), 10);
      byMonth[month] = (byMonth[month] || 0) + e.durationMinutes;
    }

    return {
      year,
      totalMinutes,
      totalHours,
      entryCount: entries.length,
      byActivity,
      byMonth,
    };
  },
});

// ── Mutations ──

/**
 * Log a new CPD entry. Called manually or auto-triggered after AI sessions.
 */
export const logEntry = mutation({
  args: {
    activityType: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    durationMinutes: v.number(),
    date: v.string(),
    practiceArea: v.optional(v.string()),
    aiSessionId: v.optional(v.id("aiSessions")),
    mootSessionId: v.optional(v.id("sessions")),
    regulatoryBody: v.optional(v.string()),
    competencyArea: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    // Only professionals can log CPD
    if (profile.userType !== "professional") {
      throw new Error("CPD tracking is available for professional accounts only");
    }

    return await ctx.db.insert("cpdEntries", {
      profileId: profile._id,
      ...args,
    });
  },
});

/**
 * Delete a CPD entry (only the owner can delete).
 */
export const deleteEntry = mutation({
  args: {
    entryId: v.id("cpdEntries"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    const entry = await ctx.db.get(args.entryId);
    if (!entry || entry.profileId !== profile._id) {
      throw new Error("Entry not found or not authorized");
    }

    await ctx.db.delete(args.entryId);
  },
});
