import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Get the currently authenticated user
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return ctx.db.get(userId);
  },
});

// Get the profile for the currently authenticated user
export const myProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Check if the current user has completed onboarding (has a profile)
export const hasProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return !!profile;
  },
});

// Update user name (called after registration with name field)
export const updateName = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.patch(userId, { name: args.name });
  },
});

// Create profile during onboarding (authenticated)
export const createProfile = mutation({
  args: {
    university: v.string(),
    universityShort: v.string(),
    yearOfStudy: v.number(),
    chamber: v.string(),
    modules: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if profile already exists
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return existing._id;

    // Get user name from users table
    const user = await ctx.db.get(userId);
    const fullName = user?.name ?? "Advocate";

    const profileId = await ctx.db.insert("profiles", {
      userId,
      fullName,
      university: args.university,
      universityShort: args.universityShort,
      yearOfStudy: args.yearOfStudy,
      chamber: args.chamber,
      bio: "",
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
