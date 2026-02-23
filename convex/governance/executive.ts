import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { auth } from "../auth";

// ═══════════════════════════════════════════
// MODERATION
// ═══════════════════════════════════════════

export const reportContent = mutation({
  args: {
    reportedById: v.id("profiles"),
    targetProfileId: v.id("profiles"),
    targetContentType: v.string(),
    targetContentId: v.optional(v.string()),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the reporter profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.reportedById) {
      throw new Error("Not authorized");
    }

    return ctx.db.insert("moderationActions", {
      ...args,
      status: "reported",
      action: undefined,
      reviewedById: undefined,
      proportionalityAssessment: undefined,
      respondentStatement: undefined,
    });
  },
});

export const listModerationActions = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actions = args.status
      ? await ctx.db.query("moderationActions").withIndex("by_status", (idx) => idx.eq("status", args.status!)).order("desc").take(50)
      : await ctx.db.query("moderationActions").order("desc").take(50);
    return Promise.all(
      actions.map(async (a) => {
        const reporter = await ctx.db.get(a.reportedById);
        const target = await ctx.db.get(a.targetProfileId);
        const reviewer = a.reviewedById ? await ctx.db.get(a.reviewedById) : null;
        return { ...a, reporter, target, reviewer };
      })
    );
  },
});

export const reviewModerationAction = mutation({
  args: {
    actionId: v.id("moderationActions"),
    reviewedById: v.id("profiles"),
    status: v.string(), // "action_taken" or "dismissed"
    action: v.optional(v.string()),
    proportionalityAssessment: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the reviewer profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.reviewedById) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.actionId, {
      status: args.status,
      action: args.action,
      reviewedById: args.reviewedById,
      proportionalityAssessment: args.proportionalityAssessment,
    });

    await ctx.db.insert("auditLog", {
      actorId: args.reviewedById,
      action: "moderation_reviewed",
      targetType: "moderation",
      targetId: args.actionId,
      details: `${args.status}: ${args.action ?? "no action"}`,
    });
  },
});

// ═══════════════════════════════════════════
// GOVERNANCE ROLES
// ═══════════════════════════════════════════

export const listGovernanceRoles = query({
  args: {},
  handler: async (ctx) => {
    const roles = await ctx.db.query("governanceRoles").collect();
    return Promise.all(
      roles.map(async (r) => {
        const profile = await ctx.db.get(r.profileId);
        return { ...r, profile };
      })
    );
  },
});

export const assignRole = mutation({
  args: {
    profileId: v.id("profiles"),
    role: v.string(),
    appointedBy: v.optional(v.id("motions")),
  },
  handler: async (ctx, args) => {
    // Auth: require authentication
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return ctx.db.insert("governanceRoles", {
      ...args,
      appointedAt: new Date().toISOString(),
      status: "active",
    });
  },
});

// ═══════════════════════════════════════════
// CONDUCT CODE
// ═══════════════════════════════════════════

export const listConductCode = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("conductCode").withIndex("by_section").collect();
  },
});

// ═══════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════

export const getAuditLog = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("auditLog")
      .order("desc")
      .take(args.limit ?? 50);
    return Promise.all(
      entries.map(async (e) => {
        const actor = await ctx.db.get(e.actorId);
        return { ...e, actor };
      })
    );
  },
});
