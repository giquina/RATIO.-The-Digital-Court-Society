import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// ── Helper: verify admin role ──
async function requireAdmin(
  ctx: { db: any },
  userId: any
): Promise<{ role: string } | null> {
  if (!userId) return null;
  return await ctx.db
    .query("adminRoles")
    .withIndex("by_user", (q: any) => q.eq("userId", userId))
    .first();
}

// ════════════════════════════════════════════
// PUBLIC
// ════════════════════════════════════════════

/** Generate a short-lived upload URL for CV files */
export const generateCvUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/** Submit a career application (public — no auth required) */
export const submitApplication = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    university: v.optional(v.string()),
    yearOfStudy: v.optional(v.string()),
    positionTitle: v.string(),
    positionType: v.string(),
    positionCategory: v.string(),
    coverMessage: v.string(),
    relevantExperience: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),
    cvStorageId: v.optional(v.id("_storage")),
    cvFileName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for existing pending application for same email + position
    const existing = await ctx.db
      .query("careerApplications")
      .withIndex("by_email", (q: any) => q.eq("email", args.email))
      .collect();
    const duplicate = existing.find(
      (a: any) => a.positionTitle === args.positionTitle && (a.status === "pending" || a.status === "reviewing")
    );
    if (duplicate) {
      throw new Error("You already have an active application for this role.");
    }

    // Try to link to existing profile
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q: any) => q.eq("email", args.email))
      .first();
    let profileId = undefined;
    if (user) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q: any) => q.eq("userId", user._id))
        .first();
      if (profile) profileId = profile._id;
    }

    await ctx.db.insert("careerApplications", {
      ...args,
      profileId,
      status: "pending",
      appliedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

// ════════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════════

/** List career applications with optional filters (admin only) */
export const listApplications = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return [];

    let applications;
    if (args.status) {
      applications = await ctx.db
        .query("careerApplications")
        .withIndex("by_status", (q: any) => q.eq("status", args.status))
        .collect();
    } else {
      applications = await ctx.db.query("careerApplications").collect();
    }

    return applications.sort(
      (a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
  },
});

/** Get a CV download URL (admin only) */
export const getCvDownloadUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return null;

    return await ctx.storage.getUrl(args.storageId);
  },
});

/** Update application status (admin only) */
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("careerApplications"),
    status: v.string(),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) throw new Error("Not authorized");

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      reviewNotes: args.reviewNotes,
      reviewedAt: new Date().toISOString(),
      reviewedBy: userId,
    });

    return { success: true };
  },
});

/** Get application counts by status (admin only) */
export const getApplicationCounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    const admin = await requireAdmin(ctx, userId);
    if (!admin) return null;

    const all = await ctx.db.query("careerApplications").collect();
    const counts: Record<string, number> = { pending: 0, reviewing: 0, shortlisted: 0, accepted: 0, rejected: 0 };
    for (const a of all) {
      counts[a.status] = (counts[a.status] ?? 0) + 1;
    }
    return { total: all.length, ...counts };
  },
});
