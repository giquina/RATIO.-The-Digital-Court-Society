// convex/videoSessions.ts — Video moot session management

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// ── Create a new video session ──
export const create = mutation({
  args: {
    hostId: v.id("profiles"),
    format: v.string(),
    title: v.string(),
    caseDescription: v.optional(v.string()),
    module: v.optional(v.string()),
    scheduledStart: v.number(),
    scheduledEnd: v.number(),
    timezone: v.string(),
    roomName: v.string(),
    roomUrl: v.string(),
    opponentProfileId: v.optional(v.id("profiles")),
    opponentRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the host profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.hostId) {
      throw new Error("Not authorized");
    }

    const participants = [];

    // Host is always a participant
    participants.push({
      profileId: args.hostId,
      role: "appellant",
      inviteStatus: "accepted" as const,
      joinedAt: undefined,
      leftAt: undefined,
    });

    // Add opponent if specified
    if (args.opponentProfileId) {
      participants.push({
        profileId: args.opponentProfileId,
        role: args.opponentRole ?? "respondent",
        inviteStatus: "invited" as const,
        joinedAt: undefined,
        leftAt: undefined,
      });
    }

    const sessionId = await ctx.db.insert("videoSessions", {
      hostId: args.hostId,
      format: args.format,
      title: args.title,
      caseDescription: args.caseDescription,
      module: args.module,
      scheduledStart: args.scheduledStart,
      scheduledEnd: args.scheduledEnd,
      timezone: args.timezone,
      provider: "daily",
      roomName: args.roomName,
      roomUrl: args.roomUrl,
      status: args.opponentProfileId ? "pending" : "confirmed",
      participants,
      recordingEnabled: false,
    });

    // Log event
    await ctx.db.insert("videoSessionEvents", {
      videoSessionId: sessionId,
      profileId: args.hostId,
      event: "created",
      timestamp: Date.now(),
    });

    return sessionId;
  },
});

// ── Accept/decline invitation ──
export const respondToInvite = mutation({
  args: {
    videoSessionId: v.id("videoSessions"),
    profileId: v.id("profiles"),
    response: v.string(), // "accepted" | "declined"
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

    const session = await ctx.db.get(args.videoSessionId);
    if (!session) throw new Error("Session not found");

    const updatedParticipants = session.participants.map((p) =>
      p.profileId === args.profileId
        ? { ...p, inviteStatus: args.response }
        : p
    );

    const allAccepted = updatedParticipants.every(
      (p) => p.inviteStatus === "accepted"
    );

    await ctx.db.patch(args.videoSessionId, {
      participants: updatedParticipants,
      status: args.response === "declined" ? "cancelled" : allAccepted ? "confirmed" : "pending",
      ...(args.response === "declined" ? {
        cancellationReason: "Opponent declined invitation",
        cancelledBy: args.profileId,
      } : {}),
    });

    await ctx.db.insert("videoSessionEvents", {
      videoSessionId: args.videoSessionId,
      profileId: args.profileId,
      event: args.response,
      timestamp: Date.now(),
    });
  },
});

// ── Join session (mark participant as joined) ──
export const joinSession = mutation({
  args: {
    videoSessionId: v.id("videoSessions"),
    profileId: v.id("profiles"),
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

    const session = await ctx.db.get(args.videoSessionId);
    if (!session) throw new Error("Session not found");

    const now = Date.now();
    const updatedParticipants = session.participants.map((p) =>
      p.profileId === args.profileId
        ? { ...p, joinedAt: now }
        : p
    );

    await ctx.db.patch(args.videoSessionId, {
      participants: updatedParticipants,
      status: "in_progress",
      ...(session.actualStart ? {} : { actualStart: now }),
    });

    await ctx.db.insert("videoSessionEvents", {
      videoSessionId: args.videoSessionId,
      profileId: args.profileId,
      event: "joined",
      timestamp: now,
    });
  },
});

// ── Leave session ──
export const leaveSession = mutation({
  args: {
    videoSessionId: v.id("videoSessions"),
    profileId: v.id("profiles"),
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

    const session = await ctx.db.get(args.videoSessionId);
    if (!session) throw new Error("Session not found");

    const now = Date.now();
    const updatedParticipants = session.participants.map((p) =>
      p.profileId === args.profileId
        ? { ...p, leftAt: now }
        : p
    );

    const allLeft = updatedParticipants.every((p) => p.leftAt !== undefined);

    await ctx.db.patch(args.videoSessionId, {
      participants: updatedParticipants,
      ...(allLeft ? { status: "completed", actualEnd: now } : {}),
    });

    await ctx.db.insert("videoSessionEvents", {
      videoSessionId: args.videoSessionId,
      profileId: args.profileId,
      event: "left",
      timestamp: now,
    });
  },
});

// ── Complete session ──
export const completeSession = mutation({
  args: {
    videoSessionId: v.id("videoSessions"),
  },
  handler: async (ctx, args) => {
    // Auth: require authentication
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(args.videoSessionId, {
      status: "completed",
      actualEnd: Date.now(),
    });

    await ctx.db.insert("videoSessionEvents", {
      videoSessionId: args.videoSessionId,
      event: "completed",
      timestamp: Date.now(),
    });
  },
});

// ── Cancel session ──
export const cancelSession = mutation({
  args: {
    videoSessionId: v.id("videoSessions"),
    profileId: v.id("profiles"),
    reason: v.optional(v.string()),
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

    await ctx.db.patch(args.videoSessionId, {
      status: "cancelled",
      cancelledBy: args.profileId,
      cancellationReason: args.reason ?? "Cancelled by user",
    });

    await ctx.db.insert("videoSessionEvents", {
      videoSessionId: args.videoSessionId,
      profileId: args.profileId,
      event: "cancelled",
      metadata: args.reason,
      timestamp: Date.now(),
    });
  },
});

// ── Rate session ──
export const rateSession = mutation({
  args: {
    videoSessionId: v.id("videoSessions"),
    raterId: v.id("profiles"),
    rateeId: v.id("profiles"),
    advocacySkill: v.number(),
    preparation: v.number(),
    professionalism: v.number(),
    overallRating: v.number(),
    comments: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the rater profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.raterId) {
      throw new Error("Not authorized");
    }

    await ctx.db.insert("videoSessionRatings", {
      videoSessionId: args.videoSessionId,
      raterId: args.raterId,
      rateeId: args.rateeId,
      advocacySkill: args.advocacySkill,
      preparation: args.preparation,
      professionalism: args.professionalism,
      overallRating: args.overallRating,
      comments: args.comments,
    });
  },
});

// ── Get upcoming sessions for a user ──
export const getUpcoming = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("videoSessions")
      .withIndex("by_status")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "confirmed")
        )
      )
      .collect();

    return sessions.filter((s) =>
      s.hostId === args.profileId ||
      s.participants.some((p) => p.profileId === args.profileId)
    );
  },
});

// ── Get session by ID ──
export const getById = query({
  args: { id: v.id("videoSessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ── Get session history ──
export const getHistory = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const sessions = await ctx.db
      .query("videoSessions")
      .withIndex("by_status")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    return sessions.filter((s) =>
      s.hostId === args.profileId ||
      s.participants.some((p) => p.profileId === args.profileId)
    );
  },
});
