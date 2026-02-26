import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// ── Mutations ──

/** Submit feedback from the app */
export const submit = mutation({
  args: {
    category: v.string(), // "bug" | "feature" | "general"
    description: v.string(),
    screenshotStorageId: v.optional(v.id("_storage")),
    pageUrl: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try to get current user's profile (optional — allows anonymous feedback in demo)
    let profileId: undefined | ReturnType<typeof v.id<"profiles">>["_type"] = undefined;
    try {
      const userId = await auth.getUserId(ctx);
      if (userId) {
        const profile = await ctx.db
          .query("profiles")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .first();
        if (profile) profileId = profile._id;
      }
    } catch {
      // Not authenticated — that's fine, feedback still accepted
    }

    return await ctx.db.insert("appFeedback", {
      profileId,
      category: args.category,
      description: args.description,
      screenshotStorageId: args.screenshotStorageId,
      pageUrl: args.pageUrl,
      userAgent: args.userAgent,
      status: "new",
    });
  },
});

/** Generate a storage upload URL for screenshot attachments */
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// ── Queries (admin) ──

/** List all feedback entries (admin use) */
export const listForAdmin = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Auth check — only allow authenticated users
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const limit = args.limit ?? 50;

    let feedbackQuery;
    if (args.status) {
      feedbackQuery = ctx.db
        .query("appFeedback")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    } else {
      feedbackQuery = ctx.db
        .query("appFeedback")
        .order("desc")
        .take(limit);
    }

    return feedbackQuery;
  },
});

/** Update feedback status (admin) */
export const updateStatus = mutation({
  args: {
    feedbackId: v.id("appFeedback"),
    status: v.string(),
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.feedbackId, {
      status: args.status,
      ...(args.adminNotes !== undefined ? { adminNotes: args.adminNotes } : {}),
    });
  },
});
