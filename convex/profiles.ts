import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ── Queries ──

export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getById = query({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.profileId);
  },
});

export const getByUniversity = query({
  args: { university: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("profiles")
      .withIndex("by_university", (q) => q.eq("university", args.university))
      .collect();
  },
});

export const getByChamber = query({
  args: { chamber: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("profiles")
      .withIndex("by_chamber", (q) => q.eq("chamber", args.chamber))
      .collect();
  },
});

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_points")
      .order("desc")
      .take(args.limit ?? 50);
    return profiles;
  },
});

export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("profiles").collect();
    const term = args.searchTerm.toLowerCase();
    return all
      .filter(
        (p) =>
          p.fullName.toLowerCase().includes(term) ||
          p.university.toLowerCase().includes(term) ||
          p.universityShort.toLowerCase().includes(term)
      )
      .slice(0, 20);
  },
});

// ── Mutations ──

export const create = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    university: v.string(),
    universityShort: v.string(),
    yearOfStudy: v.number(),
    chamber: v.string(),
    modules: v.array(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const profileId = await ctx.db.insert("profiles", {
      userId: args.userId,
      fullName: args.fullName,
      university: args.university,
      universityShort: args.universityShort,
      yearOfStudy: args.yearOfStudy,
      chamber: args.chamber,
      bio: args.bio ?? "",
      avatarUrl: undefined,
      rank: "Pupil",
      streakDays: 0,
      streakLastDate: undefined,
      totalMoots: 0,
      totalHours: 0,
      totalPoints: 0,
      readinessScore: 0,
      followerCount: 0,
      followingCount: 0,
      commendationCount: 0,
      isPublic: true,
      modules: args.modules,
    });

    // Initialize skills
    const skills = [
      "oral_advocacy",
      "legal_research",
      "argument_structure",
      "judicial_handling",
      "court_manner",
      "written_submissions",
    ];
    for (const skill of skills) {
      await ctx.db.insert("userSkills", {
        profileId,
        skillName: skill,
        score: 0,
      });
    }

    return profileId;
  },
});

export const update = mutation({
  args: {
    profileId: v.id("profiles"),
    fullName: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    modules: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { profileId, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(profileId, filtered);
  },
});

export const updateStreak = mutation({
  args: { profileId: v.id("profiles") },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return;

    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (profile.streakLastDate === today) return; // Already counted today

    const newStreak =
      profile.streakLastDate === yesterday
        ? profile.streakDays + 1
        : 1; // Reset if gap

    await ctx.db.patch(args.profileId, {
      streakDays: newStreak,
      streakLastDate: today,
    });
  },
});

export const incrementMoots = mutation({
  args: { profileId: v.id("profiles"), hours: v.number() },
  handler: async (ctx, args) => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return;

    const newMoots = profile.totalMoots + 1;
    const newHours = profile.totalHours + args.hours;
    const newPoints = profile.totalPoints + 50; // 50 points per moot

    // Calculate rank
    let rank = "Pupil";
    if (newMoots >= 100) rank = "Bencher";
    else if (newMoots >= 50) rank = "King's Counsel";
    else if (newMoots >= 20) rank = "Senior Counsel";
    else if (newMoots >= 5) rank = "Junior Counsel";

    await ctx.db.patch(args.profileId, {
      totalMoots: newMoots,
      totalHours: newHours,
      totalPoints: newPoints,
      rank,
    });
  },
});
