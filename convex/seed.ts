import { mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Run this once to seed badge definitions and starter resources.
// Execute via: npx convex run seed:run

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // ── Badges ──
    const badges = [
      { name: "First Moot", description: "Complete your first moot session", icon: "Scale", category: "moots", requirement: { type: "moots_completed", threshold: 1 } },
      { name: "Regular Advocate", description: "Complete 5 moot sessions", icon: "ClipboardList", category: "moots", requirement: { type: "moots_completed", threshold: 5 } },
      { name: "Seasoned Counsel", description: "Complete 20 moot sessions", icon: "Landmark", category: "moots", requirement: { type: "moots_completed", threshold: 20 } },
      { name: "First Judgment", description: "Judge your first moot", icon: "Gavel", category: "moots", requirement: { type: "judge_sessions", threshold: 1 } },
      { name: "7-Day Streak", description: "Practice 7 days in a row", icon: "Flame", category: "streak", requirement: { type: "streak_days", threshold: 7 } },
      { name: "30-Day Streak", description: "Practice 30 days in a row", icon: "Flame", category: "streak", requirement: { type: "streak_days", threshold: 30 } },
      { name: "100-Day Streak", description: "Practice 100 days in a row", icon: "Gem", category: "streak", requirement: { type: "streak_days", threshold: 100 } },
      { name: "First Commendation", description: "Receive your first commendation", icon: "Star", category: "society", requirement: { type: "commendations_received", threshold: 1 } },
      { name: "Respected Advocate", description: "Receive 50 commendations", icon: "Sparkles", category: "society", requirement: { type: "commendations_received", threshold: 50 } },
      { name: "Feedback Giver", description: "Give feedback 10 times", icon: "PenLine", category: "society", requirement: { type: "feedback_given", threshold: 10 } },
      { name: "Leading Counsel", description: "Claim Leading Counsel role 5 times", icon: "Award", category: "moots", requirement: { type: "leading_counsel", threshold: 5 } },
      { name: "Cross-Examiner", description: "Complete 3 mock trials", icon: "Search", category: "moots", requirement: { type: "mock_trials", threshold: 3 } },
      { name: "SQE2 Ready", description: "Complete 5 SQE2 prep sessions", icon: "Target", category: "skill", requirement: { type: "sqe2_sessions", threshold: 5 } },
      { name: "AI Sparring Partner", description: "Complete 5 AI Judge sessions", icon: "Bot", category: "skill", requirement: { type: "ai_sessions", threshold: 5 } },
      { name: "Society Builder", description: "Create 5 sessions", icon: "Hammer", category: "society", requirement: { type: "sessions_created", threshold: 5 } },
      { name: "Scholar", description: "Upload 10 resources to the library", icon: "BookOpen", category: "society", requirement: { type: "resources_uploaded", threshold: 10 } },
      { name: "50 Followers", description: "Gain 50 followers", icon: "Users", category: "society", requirement: { type: "followers", threshold: 50 } },
      { name: "100 Followers", description: "Gain 100 followers", icon: "Globe", category: "society", requirement: { type: "followers", threshold: 100 } },
      { name: "Chamber Champion", description: "Reach top 3 in your chamber rankings", icon: "Trophy", category: "competition", requirement: { type: "chamber_top_3", threshold: 1 } },
      { name: "National Top 10", description: "Reach the national top 10", icon: "Crown", category: "competition", requirement: { type: "national_top_10", threshold: 1 } },
      { name: "RATIO Ambassador", description: "Represent RATIO at your university", icon: "Megaphone", category: "society", requirement: { type: "ambassador", threshold: 1 } },
      { name: "Foundation Certified", description: "Earn the Foundation Certificate in Advocacy", icon: "Award", category: "skill", requirement: { type: "certificate_foundation", threshold: 1 } },
      { name: "Intermediate Certified", description: "Earn the Intermediate Certificate in Advocacy", icon: "Award", category: "skill", requirement: { type: "certificate_intermediate", threshold: 1 } },
      { name: "Advanced Certified", description: "Earn the Advanced Certificate in Advocacy Excellence", icon: "Award", category: "skill", requirement: { type: "certificate_advanced", threshold: 1 } },
    ];

    for (const badge of badges) {
      await ctx.db.insert("badges", badge);
    }

    // ── Starter Resources ──
    const resources = [
      { title: "IRAC Structure Template", description: "Standard IRAC format for legal argument structure", category: "irac_guide", type: "pdf", isPremium: false, downloadCount: 342 },
      { title: "Skeleton Argument — Standard Format", description: "Template for skeleton arguments in court moots", category: "moot_template", type: "docx", isPremium: false, downloadCount: 287 },
      { title: "SQE2 Advocacy Marking Criteria", description: "SRA's official assessment criteria for SQE2 advocacy", category: "sqe2_prep", type: "pdf", isPremium: false, downloadCount: 524 },
      { title: "Cross-Examination Technique Guide", description: "Advanced guide to effective cross-examination", category: "exam_skills", type: "pdf", isPremium: true, downloadCount: 198 },
      { title: "Bundle of Authorities Template", description: "How to prepare and format a bundle of authorities", category: "moot_template", type: "docx", isPremium: false, downloadCount: 156 },
      { title: "CLEO Method Explained", description: "Alternative to IRAC — Claim, Law, Evaluation, Outcome", category: "irac_guide", type: "pdf", isPremium: false, downloadCount: 89 },
      { title: "Court Etiquette & Forms of Address", description: "Comprehensive guide to courtroom protocol", category: "exam_skills", type: "pdf", isPremium: false, downloadCount: 445 },
      { title: "Judgment Writing Guide", description: "How to write a structured judicial judgment", category: "judgment_writing", type: "pdf", isPremium: false, downloadCount: 112 },
    ];

    for (const resource of resources) {
      await ctx.db.insert("resources", resource);
    }

    console.log(`Seeded ${badges.length} badges and ${resources.length} resources.`);
  },
});

// ═══════════════════════════════════════════════════════════════
// DEMO ACCOUNT HELPERS
// ═══════════════════════════════════════════════════════════════
// Used by convex/seedDemo.ts to manage the demo@ratio.law account.

/** Check if demo auth account exists. */
export const checkDemoExists = internalQuery({
  args: {},
  handler: async (ctx) => {
    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "password").eq("providerAccountId", "demo@ratio.law")
      )
      .first();
    return authAccount ? { secret: authAccount.secret } : null;
  },
});

/** Delete all records for the demo account (user, authAccount, profile). */
export const deleteDemoAccount = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    // Delete authAccount
    const authAccount = await ctx.db
      .query("authAccounts")
      .withIndex("providerAndAccountId", (q) =>
        q.eq("provider", "password").eq("providerAccountId", email)
      )
      .first();
    if (authAccount) {
      await ctx.db.delete(authAccount._id);
    }

    // Delete profile (by handle)
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) => q.eq("handle", "demo-advocate"))
      .first();
    if (profile) {
      await ctx.db.delete(profile._id);
    }

    // Delete user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

/** Update the demo user's name after account creation. */
export const updateDemoUser = internalMutation({
  args: { userId: v.id("users"), name: v.string() },
  handler: async (ctx, { userId, name }) => {
    await ctx.db.patch(userId, { name });
  },
});

/** Create a full profile for the demo account. */
export const createDemoProfile = internalMutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, { email, name }) => {
    // Look up user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    if (!user) {
      console.error("Cannot create profile: user not found for", email);
      return;
    }

    // Check if profile already exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (existingProfile) {
      return; // Already has a profile
    }

    await ctx.db.insert("profiles", {
      userId: user._id,
      fullName: name,
      university: "Birkbeck, University of London",
      universityShort: "BBK",
      yearOfStudy: 2,
      chamber: "Gray's",
      bio: "Demo account for exploring Ratio. This account is shared and may be reset periodically.",
      rank: "Junior Counsel",
      streakDays: 5,
      streakLastDate: new Date().toISOString().split("T")[0],
      totalMoots: 12,
      totalHours: 8,
      totalPoints: 340,
      readinessScore: 42,
      followerCount: 7,
      followingCount: 3,
      commendationCount: 4,
      isPublic: true,
      modules: ["Contract Law", "Public Law", "Criminal Law", "Tort Law"],
      handle: "demo-advocate",
    });
  },
});
