import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// ── Create a post ──
export const create = mutation({
  args: {
    body: v.string(),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    caseReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("No profile");

    if (args.body.length > 500) throw new Error("Post must be 500 characters or less");

    const postId = await ctx.db.insert("posts", {
      profileId: profile._id,
      body: args.body,
      category: args.category,
      tags: args.tags,
      caseReference: args.caseReference,
      sustainedCount: 0,
      overruledCount: 0,
      distinguishedCount: 0,
      bookmarkCount: 0,
      citedCount: 0,
      commentCount: 0,
    });

    // Also create an activity entry so it appears in the main feed
    await ctx.db.insert("activities", {
      profileId: profile._id,
      type: "post_created",
      title: args.body.slice(0, 80) + (args.body.length > 80 ? "…" : ""),
      description: args.body,
      metadata: {
        postId,
        category: args.category,
        tags: args.tags,
        caseReference: args.caseReference,
      },
      commendationCount: 0,
    });

    return postId;
  },
});

// ── List posts (feed) ──
export const list = query({
  args: {
    limit: v.optional(v.number()),
    profileId: v.optional(v.id("profiles")), // filter by author
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;

    let postsQuery;
    if (args.profileId) {
      postsQuery = ctx.db
        .query("posts")
        .withIndex("by_profile", (q) => q.eq("profileId", args.profileId!))
        .order("desc")
        .take(limit);
    } else {
      postsQuery = ctx.db.query("posts").order("desc").take(limit);
    }

    const posts = await postsQuery;

    // Enrich with profile data
    const enriched = await Promise.all(
      posts.map(async (post) => {
        const profile = await ctx.db.get(post.profileId);
        return {
          ...post,
          profile: profile
            ? {
                fullName: profile.fullName,
                universityShort: profile.universityShort,
                chamber: profile.chamber,
                rank: profile.rank,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// ── Toggle reaction (sustained / overruled / distinguished) ──
export const toggleReaction = mutation({
  args: {
    postId: v.id("posts"),
    reaction: v.string(), // "sustained" | "overruled" | "distinguished"
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("No profile");

    const validReactions = ["sustained", "overruled", "distinguished"];
    if (!validReactions.includes(args.reaction)) throw new Error("Invalid reaction");

    // Check for existing reaction from this user on this post
    const existing = await ctx.db
      .query("postReactions")
      .withIndex("by_profile_post", (q) =>
        q.eq("profileId", profile._id).eq("postId", args.postId)
      )
      .first();

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");

    const countField = `${args.reaction}Count` as
      | "sustainedCount"
      | "overruledCount"
      | "distinguishedCount";

    if (existing) {
      if (existing.reaction === args.reaction) {
        // Same reaction — remove it (toggle off)
        await ctx.db.delete(existing._id);
        await ctx.db.patch(args.postId, {
          [countField]: Math.max(0, post[countField] - 1),
        });
        return { action: "removed", reaction: args.reaction };
      } else {
        // Different reaction — switch
        const oldField = `${existing.reaction}Count` as
          | "sustainedCount"
          | "overruledCount"
          | "distinguishedCount";
        await ctx.db.patch(existing._id, { reaction: args.reaction });
        await ctx.db.patch(args.postId, {
          [oldField]: Math.max(0, post[oldField] - 1),
          [countField]: post[countField] + 1,
        });
        return { action: "switched", reaction: args.reaction };
      }
    } else {
      // No existing — add new
      await ctx.db.insert("postReactions", {
        profileId: profile._id,
        postId: args.postId,
        reaction: args.reaction,
      });
      await ctx.db.patch(args.postId, {
        [countField]: post[countField] + 1,
      });
      return { action: "added", reaction: args.reaction };
    }
  },
});

// ── Get current user's reaction on a post ──
export const getMyReaction = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return null;

    const reaction = await ctx.db
      .query("postReactions")
      .withIndex("by_profile_post", (q) =>
        q.eq("profileId", profile._id).eq("postId", args.postId)
      )
      .first();

    return reaction?.reaction ?? null;
  },
});

// ── Delete own post ──
export const remove = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("No profile");

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");
    if (post.profileId !== profile._id) throw new Error("Not your post");

    // Delete all reactions
    const reactions = await ctx.db
      .query("postReactions")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const r of reactions) {
      await ctx.db.delete(r._id);
    }

    await ctx.db.delete(args.postId);
  },
});
