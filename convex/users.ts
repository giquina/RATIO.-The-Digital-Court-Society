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
    // ── User type ──
    userType: v.optional(v.string()), // "student" | "professional"
    // ── Student fields ──
    university: v.optional(v.string()),
    universityShort: v.optional(v.string()),
    yearOfStudy: v.optional(v.number()),
    modules: v.optional(v.array(v.string())),
    // ── Professional fields ──
    professionalRole: v.optional(v.string()),
    firmOrChambers: v.optional(v.string()),
    practiceAreas: v.optional(v.array(v.string())),
    // ── Shared ──
    chamber: v.optional(v.string()),
    fullName: v.optional(v.string()),
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

    // Get user name from users table, fall back to provided name or "Advocate"
    const user = await ctx.db.get(userId);
    const fullName = user?.name || args.fullName || "Advocate";
    // If name wasn't set during registration, patch the user record now
    if (!user?.name && args.fullName) {
      await ctx.db.patch(userId, { name: args.fullName });
    }

    const profileId = await ctx.db.insert("profiles", {
      userId,
      fullName,
      userType: args.userType || "student",
      // Student fields (defaults for professionals)
      university: args.university || (args.userType === "professional" ? "Independent" : ""),
      universityShort: args.universityShort || (args.userType === "professional" ? "—" : ""),
      yearOfStudy: args.yearOfStudy,
      modules: args.modules || [],
      // Professional fields
      professionalRole: args.professionalRole,
      firmOrChambers: args.firmOrChambers,
      practiceAreas: args.practiceAreas,
      // Shared
      chamber: args.chamber || undefined,
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

// Update profile fields (post-onboarding editing)
export const updateProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    university: v.optional(v.string()),
    universityShort: v.optional(v.string()),
    yearOfStudy: v.optional(v.number()),
    chamber: v.optional(v.string()),
    bio: v.optional(v.string()),
    modules: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
    // Professional fields
    userType: v.optional(v.string()),
    professionalRole: v.optional(v.string()),
    firmOrChambers: v.optional(v.string()),
    practiceAreas: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    // Build patch object with only provided fields
    const patch: Record<string, unknown> = {};
    if (args.fullName !== undefined) patch.fullName = args.fullName;
    if (args.university !== undefined) patch.university = args.university;
    if (args.universityShort !== undefined) patch.universityShort = args.universityShort;
    if (args.yearOfStudy !== undefined) patch.yearOfStudy = args.yearOfStudy;
    if (args.chamber !== undefined) patch.chamber = args.chamber;
    if (args.bio !== undefined) patch.bio = args.bio;
    if (args.modules !== undefined) patch.modules = args.modules;
    if (args.isPublic !== undefined) patch.isPublic = args.isPublic;
    if (args.userType !== undefined) patch.userType = args.userType;
    if (args.professionalRole !== undefined) patch.professionalRole = args.professionalRole;
    if (args.firmOrChambers !== undefined) patch.firmOrChambers = args.firmOrChambers;
    if (args.practiceAreas !== undefined) patch.practiceAreas = args.practiceAreas;

    if (Object.keys(patch).length === 0) return profile._id;

    // Also update user name if fullName changed
    if (args.fullName !== undefined) {
      await ctx.db.patch(userId, { name: args.fullName });
    }

    await ctx.db.patch(profile._id, patch);
    return profile._id;
  },
});

// Update user notification and privacy settings
export const updateSettings = mutation({
  args: {
    settings: v.object({
      profileVisible: v.optional(v.boolean()),
      showFollowerCount: v.optional(v.boolean()),
      emailNotifications: v.optional(v.boolean()),
      pushNotifications: v.optional(v.boolean()),
      sessionReminders: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    // Map settings to profile fields
    const patch: Record<string, unknown> = {};
    if (args.settings.profileVisible !== undefined) {
      patch.isPublic = args.settings.profileVisible;
    }

    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(profile._id, patch);
    }

    return profile._id;
  },
});
