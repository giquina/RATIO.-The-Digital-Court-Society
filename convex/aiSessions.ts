import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";

// ── AI Sessions ──

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    mode: v.string(),
    areaOfLaw: v.string(),
    caseTitle: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("aiSessions", {
      profileId: args.profileId,
      mode: args.mode,
      areaOfLaw: args.areaOfLaw,
      caseTitle: args.caseTitle,
      transcript: [],
      durationSeconds: undefined,
      scores: undefined,
      overallScore: undefined,
      aiJudgment: undefined,
      keyImprovement: undefined,
      sqe2Competencies: undefined,
      savedToPortfolio: false,
      status: "in_progress",
    });
  },
});

export const addMessage = mutation({
  args: {
    sessionId: v.id("aiSessions"),
    role: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    await ctx.db.patch(args.sessionId, {
      transcript: [
        ...session.transcript,
        {
          role: args.role,
          message: args.message,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  },
});

export const complete = mutation({
  args: {
    sessionId: v.id("aiSessions"),
    durationSeconds: v.number(),
    scores: v.object({
      argumentStructure: v.number(),
      useOfAuthorities: v.number(),
      oralDelivery: v.number(),
      judicialHandling: v.number(),
      courtManner: v.number(),
      persuasiveness: v.number(),
      timeManagement: v.number(),
    }),
    overallScore: v.number(),
    aiJudgment: v.string(),
    keyImprovement: v.string(),
    sqe2Competencies: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { sessionId, ...data } = args;
    await ctx.db.patch(sessionId, { ...data, status: "completed" });

    // Update profile stats
    const session = await ctx.db.get(sessionId);
    if (session) {
      const profile = await ctx.db.get(session.profileId);
      if (profile) {
        await ctx.db.patch(session.profileId, {
          totalPoints: profile.totalPoints + 25, // 25 points per AI session
        });
      }
    }
  },
});

export const getByProfile = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("aiSessions")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .order("desc")
      .collect();
  },
});

export const getById = query({
  args: { sessionId: v.id("aiSessions") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.sessionId);
  },
});

export const saveToPortfolio = mutation({
  args: { sessionId: v.id("aiSessions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { savedToPortfolio: true });
  },
});

// ── Peer Feedback ──

export const submitFeedback = mutation({
  args: {
    sessionId: v.id("sessions"),
    fromProfileId: v.id("profiles"),
    toProfileId: v.id("profiles"),
    scores: v.object({
      argumentStructure: v.number(),
      useOfAuthorities: v.number(),
      oralDelivery: v.number(),
      judicialHandling: v.number(),
      courtManner: v.number(),
      persuasiveness: v.number(),
      timeManagement: v.number(),
    }),
    overallScore: v.number(),
    writtenFeedback: v.optional(v.string()),
    keyImprovement: v.optional(v.string()),
    strengths: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const feedbackId = await ctx.db.insert("feedback", {
      sessionId: args.sessionId,
      fromProfileId: args.fromProfileId,
      toProfileId: args.toProfileId,
      isAiFeedback: false,
      scores: args.scores,
      overallScore: args.overallScore,
      writtenFeedback: args.writtenFeedback,
      keyImprovement: args.keyImprovement,
      strengths: args.strengths,
    });

    // Notify recipient
    await ctx.db.insert("notifications", {
      profileId: args.toProfileId,
      type: "feedback_received",
      title: "New feedback received",
      body: `You received feedback for a session`,
      metadata: { feedbackId, sessionId: args.sessionId },
      read: false,
    });

    return feedbackId;
  },
});

export const getFeedbackForProfile = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("feedback")
      .withIndex("by_recipient", (q) => q.eq("toProfileId", args.profileId))
      .order("desc")
      .collect();
  },
});
