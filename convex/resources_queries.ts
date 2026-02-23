import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// List all resources, optionally filtered by category
export const list = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return ctx.db
        .query("resources")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return ctx.db.query("resources").collect();
  },
});

// Get category counts for the library overview
export const getCategoryCounts = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("resources").collect();
    const counts: Record<string, number> = {};
    for (const r of all) {
      counts[r.category] = (counts[r.category] || 0) + 1;
    }
    return counts;
  },
});

// Increment download count
export const trackDownload = mutation({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    // Auth: require authentication
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const resource = await ctx.db.get(args.resourceId);
    if (!resource) throw new Error("Resource not found");
    await ctx.db.patch(args.resourceId, {
      downloadCount: resource.downloadCount + 1,
    });
  },
});
