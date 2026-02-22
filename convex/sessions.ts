import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Queries ──

export const list = query({
  args: {
    university: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const sessions = args.status
      ? await ctx.db.query("sessions").withIndex("by_status", (idx) => idx.eq("status", args.status!)).order("desc").take(args.limit ?? 20)
      : await ctx.db.query("sessions").order("desc").take(args.limit ?? 20);

    if (args.university) {
      return sessions.filter((s) => s.university === args.university);
    }
    return sessions;
  },
});

export const getById = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.sessionId);
  },
});

export const getRoles = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("sessionRoles")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
  },
});

export const getParticipants = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const participants = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();

    // Hydrate with profile data
    const hydrated = await Promise.all(
      participants.map(async (p) => {
        const profile = await ctx.db.get(p.profileId);
        return { ...p, profile };
      })
    );
    return hydrated;
  },
});

export const getByProfile = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const participations = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();

    const sessions = await Promise.all(
      participations.map(async (p) => {
        const session = await ctx.db.get(p.sessionId);
        return session;
      })
    );
    return sessions.filter(Boolean);
  },
});

// ── Mutations ──

export const create = mutation({
  args: {
    createdBy: v.id("profiles"),
    university: v.string(),
    module: v.string(),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    issueSummary: v.optional(v.string()),
    date: v.string(),
    startTime: v.string(),
    endTime: v.string(),
    location: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
    isCrossUniversity: v.boolean(),
    roles: v.array(v.string()), // role names to create
  },
  handler: async (ctx, args) => {
    const { roles, ...sessionData } = args;

    const sessionId = await ctx.db.insert("sessions", {
      ...sessionData,
      status: "upcoming",
      bundleUrl: undefined,
      recordingUrl: undefined,
      participantCount: 0,
    });

    // Create role slots
    for (let i = 0; i < roles.length; i++) {
      await ctx.db.insert("sessionRoles", {
        sessionId,
        roleName: roles[i],
        claimedBy: undefined,
        isClaimed: false,
        claimedAt: undefined,
        speakingTimeLimit: undefined,
        sortOrder: i,
      });
    }

    // Create activity
    const profile = await ctx.db.get(args.createdBy);
    if (profile) {
      await ctx.db.insert("activities", {
        profileId: args.createdBy,
        type: "session_created",
        title: `Created: ${args.title}`,
        description: `${args.type} · ${args.module}`,
        metadata: { sessionId, type: args.type, module: args.module },
        commendationCount: 0,
      });
    }

    return sessionId;
  },
});

export const claimRole = mutation({
  args: {
    roleId: v.id("sessionRoles"),
    profileId: v.id("profiles"),
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const role = await ctx.db.get(args.roleId);
    if (!role || role.isClaimed) {
      throw new Error("Role is already claimed");
    }

    await ctx.db.patch(args.roleId, {
      claimedBy: args.profileId,
      isClaimed: true,
      claimedAt: new Date().toISOString(),
    });

    // Add as participant
    await ctx.db.insert("sessionParticipants", {
      sessionId: args.sessionId,
      profileId: args.profileId,
      roleId: args.roleId,
      attended: false,
    });

    // Update participant count
    const session = await ctx.db.get(args.sessionId);
    if (session) {
      await ctx.db.patch(args.sessionId, {
        participantCount: session.participantCount + 1,
      });
    }
  },
});

export const unclaimRole = mutation({
  args: {
    roleId: v.id("sessionRoles"),
    profileId: v.id("profiles"),
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.roleId, {
      claimedBy: undefined,
      isClaimed: false,
      claimedAt: undefined,
    });

    // Remove participant
    const participants = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    const toRemove = participants.find((p) => p.profileId === args.profileId);
    if (toRemove) await ctx.db.delete(toRemove._id);

    const session = await ctx.db.get(args.sessionId);
    if (session && session.participantCount > 0) {
      await ctx.db.patch(args.sessionId, {
        participantCount: session.participantCount - 1,
      });
    }
  },
});

export const updateStatus = mutation({
  args: { sessionId: v.id("sessions"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, { status: args.status });
  },
});
