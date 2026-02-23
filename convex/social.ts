import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// ═══════════════════════════════════════════
// FOLLOWS
// ═══════════════════════════════════════════

export const isFollowing = query({
  args: { followerId: v.id("profiles"), followingId: v.id("profiles") },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .first();
    return !!result;
  },
});

export const getFollowers = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_following", (q) => q.eq("followingId", args.profileId))
      .collect();
    return Promise.all(
      follows.map(async (f) => {
        const profile = await ctx.db.get(f.followerId);
        return profile;
      })
    );
  },
});

export const getFollowing = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const follows = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", args.profileId))
      .collect();
    return Promise.all(
      follows.map(async (f) => {
        const profile = await ctx.db.get(f.followingId);
        return profile;
      })
    );
  },
});

export const toggleFollow = mutation({
  args: { followerId: v.id("profiles"), followingId: v.id("profiles") },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the follower profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.followerId) {
      throw new Error("Not authorized");
    }

    if (args.followerId === args.followingId) return;

    const existing = await ctx.db
      .query("follows")
      .withIndex("by_pair", (q) =>
        q.eq("followerId", args.followerId).eq("followingId", args.followingId)
      )
      .first();

    if (existing) {
      // Unfollow
      await ctx.db.delete(existing._id);
      const followerProfile = await ctx.db.get(args.followerId);
      const followingProfile = await ctx.db.get(args.followingId);
      if (followerProfile)
        await ctx.db.patch(args.followerId, {
          followingCount: Math.max(0, followerProfile.followingCount - 1),
        });
      if (followingProfile)
        await ctx.db.patch(args.followingId, {
          followerCount: Math.max(0, followingProfile.followerCount - 1),
        });
      return false;
    } else {
      // Follow
      await ctx.db.insert("follows", {
        followerId: args.followerId,
        followingId: args.followingId,
      });
      const followerProfile = await ctx.db.get(args.followerId);
      const followingProfile = await ctx.db.get(args.followingId);
      if (followerProfile)
        await ctx.db.patch(args.followerId, {
          followingCount: followerProfile.followingCount + 1,
        });
      if (followingProfile) {
        await ctx.db.patch(args.followingId, {
          followerCount: followingProfile.followerCount + 1,
        });
        // Notification
        await ctx.db.insert("notifications", {
          profileId: args.followingId,
          type: "new_follower",
          title: `${followerProfile?.fullName ?? "Someone"} started following you`,
          body: undefined,
          metadata: { followerId: args.followerId },
          read: false,
        });
      }
      return true;
    }
  },
});

// ═══════════════════════════════════════════
// ACTIVITIES (FEED)
// ═══════════════════════════════════════════

export const getFeed = query({
  args: {
    profileId: v.optional(v.id("profiles")),
    feedType: v.optional(v.string()), // "following" | "discover" | "chamber"
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .order("desc")
      .take(args.limit ?? 30);

    // Hydrate with profile data
    const hydrated = await Promise.all(
      activities.map(async (a) => {
        const profile = await ctx.db.get(a.profileId);
        return { ...a, profile };
      })
    );

    if (args.feedType === "following" && args.profileId) {
      const following = await ctx.db
        .query("follows")
        .withIndex("by_follower", (q) => q.eq("followerId", args.profileId!))
        .collect();
      const followingIds = new Set(following.map((f) => f.followingId));
      return hydrated.filter(
        (a) => followingIds.has(a.profileId) || a.profileId === args.profileId
      );
    }

    if (args.feedType === "chamber" && args.profileId) {
      const myProfile = await ctx.db.get(args.profileId);
      if (myProfile) {
        return hydrated.filter(
          (a) => a.profile?.chamber === myProfile.chamber
        );
      }
    }

    return hydrated; // discover = all
  },
});

export const createActivity = mutation({
  args: {
    profileId: v.id("profiles"),
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    metadata: v.optional(v.any()),
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

    return ctx.db.insert("activities", {
      ...args,
      commendationCount: 0,
    });
  },
});

// ═══════════════════════════════════════════
// COMMENDATIONS
// ═══════════════════════════════════════════

export const hasCommended = query({
  args: { fromProfileId: v.id("profiles"), activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("commendations")
      .withIndex("by_from_and_activity", (q) =>
        q
          .eq("fromProfileId", args.fromProfileId)
          .eq("activityId", args.activityId)
      )
      .first();
    return !!result;
  },
});

export const toggleCommend = mutation({
  args: { fromProfileId: v.id("profiles"), activityId: v.id("activities") },
  handler: async (ctx, args) => {
    // Auth: verify caller owns the commender profile
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const callerProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!callerProfile || callerProfile._id !== args.fromProfileId) {
      throw new Error("Not authorized");
    }

    const existing = await ctx.db
      .query("commendations")
      .withIndex("by_from_and_activity", (q) =>
        q
          .eq("fromProfileId", args.fromProfileId)
          .eq("activityId", args.activityId)
      )
      .first();

    const activity = await ctx.db.get(args.activityId);
    if (!activity) return;

    if (existing) {
      await ctx.db.delete(existing._id);
      await ctx.db.patch(args.activityId, {
        commendationCount: Math.max(0, activity.commendationCount - 1),
      });
      // Decrement profile commendation count
      const targetProfile = await ctx.db.get(activity.profileId);
      if (targetProfile) {
        await ctx.db.patch(activity.profileId, {
          commendationCount: Math.max(0, targetProfile.commendationCount - 1),
        });
      }
      return false;
    } else {
      await ctx.db.insert("commendations", {
        fromProfileId: args.fromProfileId,
        activityId: args.activityId,
      });
      await ctx.db.patch(args.activityId, {
        commendationCount: activity.commendationCount + 1,
      });
      const targetProfile = await ctx.db.get(activity.profileId);
      if (targetProfile) {
        await ctx.db.patch(activity.profileId, {
          commendationCount: targetProfile.commendationCount + 1,
        });
      }
      return true;
    }
  },
});
