import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { auth } from "./auth";
import { validateStringLength, LIMITS } from "./lib/validation";

// ── AI Sessions ──

export const create = mutation({
  args: {
    profileId: v.id("profiles"),
    mode: v.string(),
    areaOfLaw: v.string(),
    caseTitle: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.profileId) {
      throw new Error("Not authorized");
    }

    // Input validation
    validateStringLength(args.mode, "Mode", LIMITS.NAME);
    validateStringLength(args.areaOfLaw, "Area of law", LIMITS.NAME);
    validateStringLength(args.caseTitle, "Case title", LIMITS.TITLE);

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
    // Auth: verify caller owns the session
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.profileId !== callerProfile._id) {
      throw new Error("Not authorized");
    }

    // Input validation
    validateStringLength(args.message, "Message", LIMITS.CONTENT);

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
    // Auth: verify caller owns the session
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    if (session.profileId !== callerProfile._id) {
      throw new Error("Not authorized");
    }

    const { sessionId, ...data } = args;
    await ctx.db.patch(sessionId, { ...data, status: "completed" });

    // Update profile stats
    await ctx.db.patch(session.profileId, {
      totalPoints: callerProfile.totalPoints + 25, // 25 points per AI session
    });

    // Auto-log CPD entry for professional users
    if (callerProfile.userType === "professional") {
      const durationMinutes = Math.max(1, Math.round(args.durationSeconds / 60));
      await ctx.db.insert("cpdEntries", {
        profileId: session.profileId,
        activityType: "ai_practice",
        title: `AI ${session.mode.charAt(0).toUpperCase() + session.mode.slice(1)} — ${session.caseTitle}`,
        description: `${session.areaOfLaw} practice session. Overall score: ${args.overallScore}%.`,
        durationMinutes,
        date: new Date().toISOString().split("T")[0],
        practiceArea: session.areaOfLaw,
        aiSessionId: sessionId,
        competencyArea: "Advocacy",
      });
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
    // Auth: verify caller owns the session
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.profileId !== callerProfile._id) {
      throw new Error("Not authorized");
    }

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
    // Auth: verify caller owns the fromProfile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.fromProfileId) {
      throw new Error("Not authorized");
    }

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

// ═══════════════════════════════════════════
// SPECTATOR MODE
// ═══════════════════════════════════════════

/**
 * Enable spectator mode on a session — generates a unique shareable code.
 * Only the session owner can enable this.
 */
export const enableSpectator = mutation({
  args: { sessionId: v.id("aiSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.profileId !== callerProfile._id) {
      throw new Error("Not authorized");
    }

    // Generate an 8-character alphanumeric code
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    await ctx.db.patch(args.sessionId, {
      spectatorEnabled: true,
      spectatorCode: code,
      spectatorCount: 0,
    });

    return code;
  },
});

/**
 * Disable spectator mode on a session.
 */
export const disableSpectator = mutation({
  args: { sessionId: v.id("aiSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile) throw new Error("Not authorized");

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.profileId !== callerProfile._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.sessionId, {
      spectatorEnabled: false,
      spectatorCode: undefined,
      spectatorCount: 0,
    });
  },
});

/**
 * Lookup a session by spectator code — public query (no auth required).
 * Returns session data for spectators to watch.
 */
export const getBySpectatorCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("aiSessions")
      .withIndex("by_spectator_code", (q) => q.eq("spectatorCode", args.code))
      .first();

    if (!session || !session.spectatorEnabled) {
      return null;
    }

    // Get the advocate's display name (first name + university)
    const profile = await ctx.db.get(session.profileId);
    const advocateName = profile
      ? `${profile.fullName.split(" ")[0]} (${profile.universityShort})`
      : "Anonymous Advocate";

    return {
      _id: session._id,
      mode: session.mode,
      areaOfLaw: session.areaOfLaw,
      caseTitle: session.caseTitle,
      transcript: session.transcript,
      status: session.status,
      spectatorCount: session.spectatorCount ?? 0,
      advocateName,
    };
  },
});

/**
 * Increment spectator count when someone joins.
 */
export const joinAsSpectator = mutation({
  args: { sessionId: v.id("aiSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const session = await ctx.db.get(args.sessionId);
    if (!session || !session.spectatorEnabled) {
      throw new Error("Session not available for spectating");
    }
    await ctx.db.patch(args.sessionId, {
      spectatorCount: (session.spectatorCount ?? 0) + 1,
    });
  },
});

/**
 * Decrement spectator count when someone leaves.
 */
export const leaveAsSpectator = mutation({
  args: { sessionId: v.id("aiSessions") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const session = await ctx.db.get(args.sessionId);
    if (!session) return;
    await ctx.db.patch(args.sessionId, {
      spectatorCount: Math.max(0, (session.spectatorCount ?? 1) - 1),
    });
  },
});
