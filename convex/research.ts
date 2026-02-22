import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ═══════════════════════════════════════════
// SAVED AUTHORITIES
// ═══════════════════════════════════════════

export const getSavedAuthorities = query({
  args: {
    profileId: v.id("profiles"),
    type: v.optional(v.string()),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.folder) {
      return ctx.db
        .query("savedAuthorities")
        .withIndex("by_profile_folder", (q) =>
          q.eq("profileId", args.profileId).eq("folder", args.folder!)
        )
        .collect();
    }
    if (args.type) {
      return ctx.db
        .query("savedAuthorities")
        .withIndex("by_profile_type", (q) =>
          q.eq("profileId", args.profileId).eq("type", args.type!)
        )
        .collect();
    }
    return ctx.db
      .query("savedAuthorities")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
  },
});

export const isAuthoritySaved = query({
  args: {
    profileId: v.id("profiles"),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("savedAuthorities")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    return all.some((a) => a.url === args.url);
  },
});

export const saveAuthority = mutation({
  args: {
    profileId: v.id("profiles"),
    type: v.string(),
    title: v.string(),
    citation: v.optional(v.string()),
    url: v.string(),
    subtitle: v.optional(v.string()),
    date: v.optional(v.string()),
    snippet: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Prevent duplicates
    const existing = await ctx.db
      .query("savedAuthorities")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    if (existing.some((a) => a.url === args.url)) {
      return { alreadySaved: true };
    }

    const id = await ctx.db.insert("savedAuthorities", {
      ...args,
      savedAt: new Date().toISOString(),
    });
    return { id, alreadySaved: false };
  },
});

export const removeAuthority = mutation({
  args: {
    authorityId: v.id("savedAuthorities"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.authorityId);
  },
});

export const updateAuthorityNotes = mutation({
  args: {
    authorityId: v.id("savedAuthorities"),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    folder: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { authorityId, ...updates } = args;
    await ctx.db.patch(authorityId, updates);
  },
});

// ═══════════════════════════════════════════
// SEARCH HISTORY
// ═══════════════════════════════════════════

export const getSearchHistory = query({
  args: {
    profileId: v.id("profiles"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("searchHistory")
      .withIndex("by_profile_recent", (q) =>
        q.eq("profileId", args.profileId)
      )
      .order("desc")
      .take(args.limit || 20);
    return results;
  },
});

export const recordSearch = mutation({
  args: {
    profileId: v.id("profiles"),
    query: v.string(),
    source: v.string(),
    resultCount: v.number(),
    queryTime: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("searchHistory", {
      ...args,
      searchedAt: new Date().toISOString(),
    });
  },
});

export const clearSearchHistory = mutation({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("searchHistory")
      .withIndex("by_profile", (q) => q.eq("profileId", args.profileId))
      .collect();
    for (const item of all) {
      await ctx.db.delete(item._id);
    }
  },
});
