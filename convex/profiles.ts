import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { validateStringLength, validateOptionalStringLength, validateArrayLength, LIMITS } from "./lib/validation";

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
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_university", (q) => q.eq("university", args.university))
      .collect();
    return profiles.filter((p) => p.isPublic !== false);
  },
});

export const getByChamber = query({
  args: { chamber: v.string() },
  handler: async (ctx, args) => {
    const profiles = await ctx.db
      .query("profiles")
      .withIndex("by_chamber", (q) => q.eq("chamber", args.chamber))
      .collect();
    return profiles.filter((p) => p.isPublic !== false);
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
    return profiles.filter((p) => p.isPublic !== false);
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
          p.isPublic !== false &&
          (p.fullName.toLowerCase().includes(term) ||
            (p.university ?? "").toLowerCase().includes(term) ||
            (p.universityShort ?? "").toLowerCase().includes(term))
      )
      .slice(0, 20);
  },
});

// Get chamber statistics (member counts, total points)
export const getChamberStats = query({
  args: {},
  handler: async (ctx) => {
    const allProfiles = await ctx.db.query("profiles").collect();
    const chamberMap: Record<string, { members: number; totalPoints: number; topRank: string }> = {};
    const rankOrder = ["Pupil", "Junior Counsel", "Senior Counsel", "King's Counsel", "Bencher"];

    for (const p of allProfiles) {
      const ch = p.chamber || "Unaffiliated";
      if (!chamberMap[ch]) {
        chamberMap[ch] = { members: 0, totalPoints: 0, topRank: "Pupil" };
      }
      chamberMap[ch].members += 1;
      chamberMap[ch].totalPoints += p.totalPoints;
      if (rankOrder.indexOf(p.rank) > rankOrder.indexOf(chamberMap[ch].topRank)) {
        chamberMap[ch].topRank = p.rank;
      }
    }

    return Object.entries(chamberMap)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  },
});

// ── Mutations ──

export const create = mutation({
  args: {
    userId: v.id("users"),
    fullName: v.string(),
    userType: v.optional(v.string()), // "student" | "professional"
    university: v.optional(v.string()),
    universityShort: v.optional(v.string()),
    yearOfStudy: v.optional(v.number()),
    chamber: v.optional(v.string()),
    modules: v.optional(v.array(v.string())),
    professionalRole: v.optional(v.string()),
    firmOrChambers: v.optional(v.string()),
    practiceAreas: v.optional(v.array(v.string())),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Auth: verify caller matches the userId
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (userId !== args.userId) throw new Error("Not authorized");

    // Input validation
    validateStringLength(args.fullName, "Full name", LIMITS.NAME);
    if (args.university) validateStringLength(args.university, "University", LIMITS.NAME);
    if (args.universityShort) validateStringLength(args.universityShort, "University abbreviation", 20);
    if (args.chamber) validateStringLength(args.chamber, "Chamber", LIMITS.NAME);
    validateOptionalStringLength(args.bio, "Bio", LIMITS.BIO);
    if (args.modules) validateArrayLength(args.modules, "Modules", LIMITS.MODULES);

    const profileId = await ctx.db.insert("profiles", {
      userId: args.userId,
      fullName: args.fullName,
      userType: args.userType || "student",
      university: args.university || (args.userType === "professional" ? "Independent" : ""),
      universityShort: args.universityShort || (args.userType === "professional" ? "—" : ""),
      yearOfStudy: args.yearOfStudy,
      chamber: args.chamber || undefined,
      modules: args.modules || [],
      professionalRole: args.professionalRole,
      firmOrChambers: args.firmOrChambers,
      practiceAreas: args.practiceAreas,
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
    validateOptionalStringLength(args.fullName, "Full name", LIMITS.NAME);
    validateOptionalStringLength(args.bio, "Bio", LIMITS.BIO);
    validateOptionalStringLength(args.avatarUrl, "Avatar URL", LIMITS.URL);
    if (args.modules) validateArrayLength(args.modules, "Modules", LIMITS.MODULES);

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
    // Auth: require authentication
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

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

    // Activate referral on first session completion (activation gate)
    if (profile.totalMoots === 0 && profile.referredByProfileId) {
      const referral = await ctx.db
        .query("referrals")
        .withIndex("by_invitee_profile", (q) =>
          q.eq("inviteeProfileId", args.profileId)
        )
        .first();
      if (referral && referral.status === "signed_up") {
        const now = new Date().toISOString();
        await ctx.db.patch(referral._id, {
          status: "activated",
          activatedAt: now,
        });

        // Check monthly reward cap before issuing reward
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        const existingRewards = await ctx.db
          .query("referralRewards")
          .withIndex("by_profile", (q) => q.eq("profileId", referral.referrerId))
          .collect();
        const monthlyRewards = existingRewards.filter(
          (r) => r.earnedAt > monthStart.toISOString() && !r.revoked
        ).length;

        if (monthlyRewards < 5) {
          // Issue AI session reward to referrer
          const academicYearEnd = new Date();
          const yearForExpiry = academicYearEnd.getMonth() >= 7
            ? academicYearEnd.getFullYear() + 1
            : academicYearEnd.getFullYear();
          const expiresAt = `${yearForExpiry}-07-31T23:59:59.000Z`;

          await ctx.db.insert("referralRewards", {
            profileId: referral.referrerId,
            referralId: referral._id,
            rewardType: "ai_session",
            earnedAt: now,
            expiresAt,
            redeemed: false,
            revoked: false,
          });

          // Increment referrer's cached count
          const referrer = await ctx.db.get(referral.referrerId);
          if (referrer) {
            await ctx.db.patch(referral.referrerId, {
              referralCount: (referrer.referralCount ?? 0) + 1,
            });
          }

          // Notify the referrer
          await ctx.db.insert("notifications", {
            profileId: referral.referrerId,
            type: "referral_activated",
            title: "Your referral has joined the Bar",
            body: "An advocate you invited has completed their first session. You have earned a reward.",
            metadata: { referralId: referral._id },
            read: false,
          });
        }
      }
    }
  },
});

// Update marketing consent (GDPR opt-in)
export const updateMarketingConsent = mutation({
  args: { consent: v.boolean() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    await ctx.db.patch(profile._id, { marketingConsent: args.consent });
  },
});
