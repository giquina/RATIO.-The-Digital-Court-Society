import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { auth } from "./auth";

// ── Log an admin/system action (called internally by other mutations) ──
export const logAction = internalMutation({
  args: {
    actorId: v.id("profiles"),
    action: v.string(),
    targetType: v.string(),
    targetId: v.optional(v.string()),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("auditLog", args);
  },
});

// ── Get audit log entries (admin only — auth checked at API layer) ──
export const getRecentLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    // Check admin role
    const adminRole = await ctx.db
      .query("adminRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!adminRole) return [];

    const limit = Math.min(args.limit ?? 50, 200);
    const logs = await ctx.db
      .query("auditLog")
      .order("desc")
      .take(limit);

    return logs;
  },
});
