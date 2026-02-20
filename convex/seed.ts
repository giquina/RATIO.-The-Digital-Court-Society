import { mutation } from "./_generated/server";

// Run this once to seed badge definitions and starter resources.
// Execute via: npx convex run seed:run

export const run = mutation({
  args: {},
  handler: async (ctx) => {
    // ── Badges ──
    const badges = [
      { name: "First Moot", description: "Complete your first moot session", icon: "⚖️", category: "moots", requirement: { type: "moots_completed", threshold: 1 } },
      { name: "Regular Advocate", description: "Complete 5 moot sessions", icon: "📋", category: "moots", requirement: { type: "moots_completed", threshold: 5 } },
      { name: "Seasoned Counsel", description: "Complete 20 moot sessions", icon: "🏛️", category: "moots", requirement: { type: "moots_completed", threshold: 20 } },
      { name: "First Judgment", description: "Judge your first moot", icon: "👨‍⚖️", category: "moots", requirement: { type: "judge_sessions", threshold: 1 } },
      { name: "7-Day Streak", description: "Practice 7 days in a row", icon: "🔥", category: "streak", requirement: { type: "streak_days", threshold: 7 } },
      { name: "30-Day Streak", description: "Practice 30 days in a row", icon: "🔥", category: "streak", requirement: { type: "streak_days", threshold: 30 } },
      { name: "100-Day Streak", description: "Practice 100 days in a row", icon: "💎", category: "streak", requirement: { type: "streak_days", threshold: 100 } },
      { name: "First Commendation", description: "Receive your first commendation", icon: "⭐", category: "community", requirement: { type: "commendations_received", threshold: 1 } },
      { name: "Respected Advocate", description: "Receive 50 commendations", icon: "🌟", category: "community", requirement: { type: "commendations_received", threshold: 50 } },
      { name: "Feedback Giver", description: "Give feedback 10 times", icon: "📝", category: "community", requirement: { type: "feedback_given", threshold: 10 } },
      { name: "Leading Counsel", description: "Claim Leading Counsel role 5 times", icon: "🎖️", category: "moots", requirement: { type: "leading_counsel", threshold: 5 } },
      { name: "Cross-Examiner", description: "Complete 3 mock trials", icon: "🔍", category: "moots", requirement: { type: "mock_trials", threshold: 3 } },
      { name: "SQE2 Ready", description: "Complete 5 SQE2 prep sessions", icon: "🎯", category: "skill", requirement: { type: "sqe2_sessions", threshold: 5 } },
      { name: "AI Sparring Partner", description: "Complete 5 AI Judge sessions", icon: "🤖", category: "skill", requirement: { type: "ai_sessions", threshold: 5 } },
      { name: "Community Builder", description: "Create 5 sessions", icon: "🏗️", category: "community", requirement: { type: "sessions_created", threshold: 5 } },
      { name: "Scholar", description: "Upload 10 resources to the library", icon: "📚", category: "community", requirement: { type: "resources_uploaded", threshold: 10 } },
      { name: "50 Followers", description: "Gain 50 followers", icon: "👥", category: "community", requirement: { type: "followers", threshold: 50 } },
      { name: "100 Followers", description: "Gain 100 followers", icon: "🌍", category: "community", requirement: { type: "followers", threshold: 100 } },
      { name: "Chamber Champion", description: "Reach top 3 in your chamber rankings", icon: "🏆", category: "competition", requirement: { type: "chamber_top_3", threshold: 1 } },
      { name: "National Top 10", description: "Reach the national top 10", icon: "👑", category: "competition", requirement: { type: "national_top_10", threshold: 1 } },
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
