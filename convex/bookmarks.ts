import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// ── Toggle bookmark (add/remove) ──
export const toggle = mutation({
  args: {
    targetType: v.string(), // "post" | "activity"
    targetId: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("No profile");

    // Check if already bookmarked
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_profile_target", (q) =>
        q.eq("profileId", profile._id).eq("targetId", args.targetId)
      )
      .first();

    if (existing) {
      // Remove bookmark
      await ctx.db.delete(existing._id);

      // Decrement bookmark count on post if it's a post
      if (args.targetType === "post") {
        try {
          const post = await ctx.db.get(args.targetId as any);
          if (post) {
            await ctx.db.patch(args.targetId as any, {
              bookmarkCount: Math.max(0, (post as any).bookmarkCount - 1),
            });
          }
        } catch {
          // Target may not exist or may not have bookmarkCount
        }
      }

      return { action: "removed" };
    } else {
      // Add bookmark
      await ctx.db.insert("bookmarks", {
        profileId: profile._id,
        targetType: args.targetType,
        targetId: args.targetId,
        note: args.note,
      });

      // Increment bookmark count on post if it's a post
      if (args.targetType === "post") {
        try {
          const post = await ctx.db.get(args.targetId as any);
          if (post) {
            await ctx.db.patch(args.targetId as any, {
              bookmarkCount: (post as any).bookmarkCount + 1,
            });
          }
        } catch {
          // Target may not exist or may not have bookmarkCount
        }
      }

      return { action: "added" };
    }
  },
});

// ── List my bookmarks ──
export const list = query({
  args: {
    targetType: v.optional(v.string()), // filter by "post" | "activity"
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return [];

    const limit = args.limit ?? 50;

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .order("desc")
      .take(limit);

    // Filter by type if specified
    const filtered = args.targetType
      ? bookmarks.filter((b) => b.targetType === args.targetType)
      : bookmarks;

    // Enrich with target content
    const enriched = await Promise.all(
      filtered.map(async (bookmark) => {
        let target: any = null;
        let authorProfile: any = null;

        try {
          target = await ctx.db.get(bookmark.targetId as any);
          if (target?.profileId) {
            authorProfile = await ctx.db.get(target.profileId);
          }
        } catch {
          // Target may have been deleted
        }

        return {
          ...bookmark,
          target,
          authorProfile: authorProfile
            ? {
                fullName: authorProfile.fullName,
                universityShort: authorProfile.universityShort,
                chamber: authorProfile.chamber,
                rank: authorProfile.rank,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// ── Check if current user has bookmarked a target ──
export const isBookmarked = query({
  args: { targetId: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return false;

    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_profile_target", (q) =>
        q.eq("profileId", profile._id).eq("targetId", args.targetId)
      )
      .first();

    return !!existing;
  },
});
