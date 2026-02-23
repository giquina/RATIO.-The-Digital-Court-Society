import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { auth } from "../auth";

// ═══════════════════════════════════════════
// MOTIONS
// ═══════════════════════════════════════════

export const listMotions = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const motions = args.status
      ? await ctx.db.query("motions").withIndex("by_status", (idx) => idx.eq("status", args.status!)).order("desc").take(args.limit ?? 20)
      : await ctx.db.query("motions").order("desc").take(args.limit ?? 20);
    // Hydrate with proposer profiles
    return Promise.all(
      motions.map(async (m) => {
        const proposer = await ctx.db.get(m.proposerId);
        const seconder = m.secondedById ? await ctx.db.get(m.secondedById) : null;
        return { ...m, proposer, seconder };
      })
    );
  },
});

export const getMotionById = query({
  args: { motionId: v.id("motions") },
  handler: async (ctx, args) => {
    const motion = await ctx.db.get(args.motionId);
    if (!motion) return null;
    const proposer = await ctx.db.get(motion.proposerId);
    const seconder = motion.secondedById ? await ctx.db.get(motion.secondedById) : null;
    const debates = await ctx.db
      .query("debates")
      .withIndex("by_motion", (q) => q.eq("motionId", args.motionId))
      .collect();
    const hydratedDebates = await Promise.all(
      debates.map(async (d) => {
        const speaker = await ctx.db.get(d.speakerId);
        return { ...d, speaker };
      })
    );
    return { ...motion, proposer, seconder, debates: hydratedDebates };
  },
});

export const proposeMotion = mutation({
  args: {
    proposerId: v.id("profiles"),
    title: v.string(),
    issue: v.string(),
    rule: v.string(),
    application: v.string(),
    conclusion: v.string(),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the proposer profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.proposerId) {
      throw new Error("Not authorized");
    }

    const motionId = await ctx.db.insert("motions", {
      ...args,
      secondedById: undefined,
      sessionId: undefined,
      status: "tabled",
      votesAye: 0,
      votesNo: 0,
      votesAbstain: 0,
      quorumRequired: 10,
      votingDeadline: undefined,
    });

    // Audit log
    await ctx.db.insert("auditLog", {
      actorId: args.proposerId,
      action: "motion_proposed",
      targetType: "motion",
      targetId: motionId,
      details: args.title,
    });

    return motionId;
  },
});

export const secondMotion = mutation({
  args: {
    motionId: v.id("motions"),
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

    const motion = await ctx.db.get(args.motionId);
    if (!motion || motion.status !== "tabled") {
      throw new Error("Motion cannot be seconded");
    }
    if (motion.proposerId === args.profileId) {
      throw new Error("Cannot second your own motion");
    }
    await ctx.db.patch(args.motionId, {
      secondedById: args.profileId,
      status: "seconded",
    });
  },
});

// ═══════════════════════════════════════════
// VOTING
// ═══════════════════════════════════════════

export const castVote = mutation({
  args: {
    motionId: v.id("motions"),
    profileId: v.id("profiles"),
    vote: v.string(), // "aye", "no", "abstain"
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

    // Check if already voted
    const existing = await ctx.db
      .query("votes")
      .withIndex("by_motion_and_voter", (q) =>
        q.eq("motionId", args.motionId).eq("profileId", args.profileId)
      )
      .first();
    if (existing) {
      throw new Error("Already voted on this motion");
    }

    const motion = await ctx.db.get(args.motionId);
    if (!motion || motion.status !== "voting") {
      throw new Error("Motion is not in voting phase");
    }

    await ctx.db.insert("votes", {
      motionId: args.motionId,
      profileId: args.profileId,
      vote: args.vote,
      votedAt: new Date().toISOString(),
    });

    // Update vote counts
    const updates: Record<string, number> = {};
    if (args.vote === "aye") updates.votesAye = motion.votesAye + 1;
    else if (args.vote === "no") updates.votesNo = motion.votesNo + 1;
    else updates.votesAbstain = motion.votesAbstain + 1;

    await ctx.db.patch(args.motionId, updates);

    // Audit
    await ctx.db.insert("auditLog", {
      actorId: args.profileId,
      action: "vote_cast",
      targetType: "motion",
      targetId: args.motionId,
      details: args.vote,
    });
  },
});

export const getVotesForMotion = query({
  args: { motionId: v.id("motions") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("votes")
      .withIndex("by_motion", (q) => q.eq("motionId", args.motionId))
      .collect();
  },
});

export const openVoting = mutation({
  args: {
    motionId: v.id("motions"),
    durationHours: v.number(),
  },
  handler: async (ctx, args) => {
    // Auth: require authentication
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const motion = await ctx.db.get(args.motionId);
    if (!motion || motion.status !== "seconded") {
      throw new Error("Motion must be seconded before voting");
    }
    const deadline = new Date(Date.now() + args.durationHours * 3600000).toISOString();
    await ctx.db.patch(args.motionId, {
      status: "voting",
      votingDeadline: deadline,
    });
  },
});

export const closeVoting = mutation({
  args: { motionId: v.id("motions") },
  handler: async (ctx, args) => {
    // Auth: require authentication
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const motion = await ctx.db.get(args.motionId);
    if (!motion || motion.status !== "voting") return;

    const totalVotes = motion.votesAye + motion.votesNo;
    const passed = totalVotes >= motion.quorumRequired && motion.votesAye > motion.votesNo;

    await ctx.db.patch(args.motionId, {
      status: passed ? "passed" : "defeated",
    });
  },
});

// ═══════════════════════════════════════════
// DEBATES
// ═══════════════════════════════════════════

export const addDebateEntry = mutation({
  args: {
    motionId: v.id("motions"),
    sessionId: v.optional(v.id("parliamentarySessions")),
    speakerId: v.id("profiles"),
    content: v.string(),
    position: v.string(),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the speaker profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.speakerId) {
      throw new Error("Not authorized");
    }

    const existing = await ctx.db
      .query("debates")
      .withIndex("by_motion", (q) => q.eq("motionId", args.motionId))
      .collect();

    return ctx.db.insert("debates", {
      ...args,
      speakingOrder: existing.length + 1,
    });
  },
});

// ═══════════════════════════════════════════
// STANDING ORDERS
// ═══════════════════════════════════════════

export const listStandingOrders = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) {
      return ctx.db
        .query("standingOrders")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return ctx.db.query("standingOrders").withIndex("by_number").collect();
  },
});
