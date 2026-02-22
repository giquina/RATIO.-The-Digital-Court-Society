import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Notifications ──

export const getUnread = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("notifications")
      .withIndex("by_unread", (q) =>
        q.eq("profileId", args.profileId).eq("read", false)
      )
      .order("desc")
      .take(20);
  },
});

export const getAll = query({
  args: { profileId: v.id("profiles"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return ctx.db
      .query("notifications")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .take(args.limit ?? 50);
  },
});

// Lightweight count-only query for mobile BottomNav badge
export const getUnreadCount = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_unread", (q) =>
        q.eq("profileId", args.profileId).eq("read", false)
      )
      .collect();
    return unread.length;
  },
});

export const markRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
  },
});

export const markAllRead = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_unread", (q) =>
        q.eq("profileId", args.profileId).eq("read", false)
      )
      .collect();
    for (const n of unread) {
      await ctx.db.patch(n._id, { read: true });
    }
  },
});

// ── Resources ──

export const listResources = query({
  args: { category: v.optional(v.string()), module: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return ctx.db
        .query("resources")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    if (args.module) {
      return ctx.db
        .query("resources")
        .withIndex("by_module", (q) => q.eq("module", args.module!))
        .collect();
    }
    return ctx.db.query("resources").collect();
  },
});

export const createResource = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    type: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    module: v.optional(v.string()),
    uploadedBy: v.optional(v.id("profiles")),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("resources", {
      ...args,
      isPremium: false,
      downloadCount: 0,
    });
  },
});
