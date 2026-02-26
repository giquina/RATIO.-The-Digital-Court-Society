import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════════
// CERTIFICATE LEVEL DEFINITIONS
// ═══════════════════════════════════════════════════════════════

export const CERTIFICATE_LEVELS = {
  foundation: {
    key: "foundation",
    name: "Foundation Certificate in Advocacy Practice",
    shortName: "Foundation",
    description: "Demonstrates foundational competence in oral advocacy through structured AI-assessed practice sessions and peer mooting.",
    requirements: {
      aiSessionsRequired: 5,
      minAverageScore: 50,
      groupMootsRequired: 1,
      portfolioSavesRequired: 1,
      areasOfLawRequired: 1,
      minDimensionScore: 0,
      minDimensionsAbove: 0,
      tournamentRequired: false,
      lawBookContributionRequired: false,
      streakRequired: 0,
      timedAssessmentRequired: false,
      peerFeedbackRequired: 0,
      researchRequired: 0,
    },
    price: 2999, // pence — £29.99
    color: "#CD7F32", // bronze
  },
  intermediate: {
    key: "intermediate",
    name: "Intermediate Certificate in Advocacy & Legal Reasoning",
    shortName: "Intermediate",
    description: "Demonstrates intermediate proficiency in advocacy, including strong legal reasoning, effective use of authorities, and developing judicial handling skills.",
    requirements: {
      aiSessionsRequired: 15,
      minAverageScore: 65,
      groupMootsRequired: 5,
      portfolioSavesRequired: 1,
      areasOfLawRequired: 3,
      minDimensionScore: 70,
      minDimensionsAbove: 3,
      tournamentRequired: false,
      lawBookContributionRequired: false,
      streakRequired: 0,
      timedAssessmentRequired: false,
      peerFeedbackRequired: 3,
      researchRequired: 1,
    },
    price: 4999, // £49.99
    color: "#C0C0C0", // silver
  },
  advanced: {
    key: "advanced",
    name: "Advanced Certificate in Advocacy Excellence",
    shortName: "Advanced",
    description: "Demonstrates advanced mastery of oral advocacy, consistently performing at a high level across multiple areas of law, under timed conditions, and in competitive settings.",
    requirements: {
      aiSessionsRequired: 30,
      minAverageScore: 80,
      groupMootsRequired: 10,
      portfolioSavesRequired: 1,
      areasOfLawRequired: 5,
      minDimensionScore: 80,
      minDimensionsAbove: 5,
      tournamentRequired: true,
      lawBookContributionRequired: true,
      streakRequired: 14,
      timedAssessmentRequired: true,
      peerFeedbackRequired: 5,
      researchRequired: 3,
    },
    price: 7999, // £79.99
    color: "#FFD700", // gold
  },
} as const;

export type CertificateLevel = keyof typeof CERTIFICATE_LEVELS;

// ═══════════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════════

/** Get all certificate progress for the current user */
export const getMyProgress = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!user) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!profile) return null;

    // Fetch all data needed for progress calculation
    const aiSessions = await ctx.db
      .query("aiSessions")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();

    const completedAiSessions = aiSessions.filter((s) => s.status === "completed" && s.overallScore !== undefined);

    // Calculate stats
    const totalAiSessions = completedAiSessions.length;
    const averageScore = totalAiSessions > 0
      ? Math.round(completedAiSessions.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / totalAiSessions)
      : 0;

    // Areas of law
    const areasOfLaw = [...new Set(completedAiSessions.map((s) => s.areaOfLaw))];

    // Aggregate dimension scores
    const dimensionScores = {
      argumentStructure: 0,
      useOfAuthorities: 0,
      oralDelivery: 0,
      judicialHandling: 0,
      courtManner: 0,
      persuasiveness: 0,
      timeManagement: 0,
    };
    let scoredCount = 0;
    for (const s of completedAiSessions) {
      if (s.scores) {
        dimensionScores.argumentStructure += s.scores.argumentStructure;
        dimensionScores.useOfAuthorities += s.scores.useOfAuthorities;
        dimensionScores.oralDelivery += s.scores.oralDelivery;
        dimensionScores.judicialHandling += s.scores.judicialHandling;
        dimensionScores.courtManner += s.scores.courtManner;
        dimensionScores.persuasiveness += s.scores.persuasiveness;
        dimensionScores.timeManagement += s.scores.timeManagement;
        scoredCount++;
      }
    }
    if (scoredCount > 0) {
      for (const key of Object.keys(dimensionScores) as (keyof typeof dimensionScores)[]) {
        dimensionScores[key] = Math.round(dimensionScores[key] / scoredCount);
      }
    }

    // Count dimensions above thresholds
    const dimensionValues = Object.values(dimensionScores);
    const dimensionsAbove70 = dimensionValues.filter((v) => v >= 70).length;
    const dimensionsAbove80 = dimensionValues.filter((v) => v >= 80).length;

    // Group moots participated in
    const sessionParticipants = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const groupMoots = sessionParticipants.filter((sp) => sp.attended).length;

    // Portfolio saves
    const portfolioSaves = completedAiSessions.filter((s) => s.savedToPortfolio).length;

    // Tournaments
    const tournamentEntries = await ctx.db
      .query("tournamentEntries")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const hasParticipatedInTournament = tournamentEntries.length > 0;

    // Law Book contributions
    const lawBookContributions = await ctx.db
      .query("lawBookContributions")
      .withIndex("by_user", (q) => q.eq("userId", profile._id))
      .collect();
    const hasLawBookContribution = lawBookContributions.length > 0;

    // Peer feedback received
    const feedback = await ctx.db
      .query("feedback")
      .withIndex("by_recipient", (q) => q.eq("toProfileId", profile._id))
      .collect();
    const peerFeedbackCount = feedback.filter((f) => !f.isAiFeedback).length;

    // Saved authorities (legal research)
    const savedAuthorities = await ctx.db
      .query("savedAuthorities")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const researchCount = savedAuthorities.length;

    // Streak (max ever — use current streakDays from profile)
    const maxStreak = profile.streakDays;

    // Timed assessments (SQE2 mode sessions)
    const timedAssessments = completedAiSessions.filter((s) => s.mode === "examiner").length;

    // Existing certificates
    const existingCerts = await ctx.db
      .query("certificates")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();

    // Build progress for each level
    const progress = Object.entries(CERTIFICATE_LEVELS).map(([key, level]) => {
      const req = level.requirements;
      const existing = existingCerts.find((c) => c.level === key);

      const checks = [
        { label: `Complete ${req.aiSessionsRequired} AI Judge sessions`, done: totalAiSessions >= req.aiSessionsRequired, current: totalAiSessions, target: req.aiSessionsRequired },
        { label: `Average score of ${req.minAverageScore}+`, done: averageScore >= req.minAverageScore && totalAiSessions > 0, current: averageScore, target: req.minAverageScore },
        { label: `${req.groupMootsRequired} group moot session${req.groupMootsRequired > 1 ? "s" : ""}`, done: groupMoots >= req.groupMootsRequired, current: groupMoots, target: req.groupMootsRequired },
        { label: `Practice across ${req.areasOfLawRequired}+ areas of law`, done: areasOfLaw.length >= req.areasOfLawRequired, current: areasOfLaw.length, target: req.areasOfLawRequired },
      ];

      if (req.minDimensionsAbove > 0) {
        const threshold = req.minDimensionScore;
        const aboveCount = threshold >= 80 ? dimensionsAbove80 : dimensionsAbove70;
        checks.push({
          label: `Score ${threshold}+ in ${req.minDimensionsAbove} of 7 dimensions`,
          done: aboveCount >= req.minDimensionsAbove,
          current: aboveCount,
          target: req.minDimensionsAbove,
        });
      }

      if (req.peerFeedbackRequired > 0) {
        checks.push({ label: `Receive ${req.peerFeedbackRequired}+ peer feedback`, done: peerFeedbackCount >= req.peerFeedbackRequired, current: peerFeedbackCount, target: req.peerFeedbackRequired });
      }

      if (req.researchRequired > 0) {
        checks.push({ label: `Save ${req.researchRequired}+ legal authorities`, done: researchCount >= req.researchRequired, current: researchCount, target: req.researchRequired });
      }

      if (req.tournamentRequired) {
        checks.push({ label: "Participate in a tournament", done: hasParticipatedInTournament, current: hasParticipatedInTournament ? 1 : 0, target: 1 });
      }

      if (req.lawBookContributionRequired) {
        checks.push({ label: "Contribute to the Law Book", done: hasLawBookContribution, current: hasLawBookContribution ? 1 : 0, target: 1 });
      }

      if (req.streakRequired > 0) {
        checks.push({ label: `Achieve a ${req.streakRequired}-day streak`, done: maxStreak >= req.streakRequired, current: maxStreak, target: req.streakRequired });
      }

      if (req.timedAssessmentRequired) {
        checks.push({ label: "Complete a timed advocacy assessment", done: timedAssessments > 0, current: timedAssessments, target: 1 });
      }

      const completedChecks = checks.filter((c) => c.done).length;
      const allMet = completedChecks === checks.length;

      return {
        level: key,
        name: level.name,
        shortName: level.shortName,
        description: level.description,
        color: level.color,
        price: level.price,
        checks,
        completedChecks,
        totalChecks: checks.length,
        percentComplete: Math.round((completedChecks / checks.length) * 100),
        allRequirementsMet: allMet,
        certificate: existing ?? null,
        dimensionScores: scoredCount > 0 ? dimensionScores : null,
        areasOfLaw,
      };
    });

    return { profileId: profile._id, profileName: profile.fullName, progress };
  },
});

/** Public verification — no auth required */
export const verifyCertificate = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const cert = await ctx.db
      .query("certificates")
      .withIndex("by_verification", (q) => q.eq("verificationCode", code))
      .first();

    if (!cert || cert.status !== "issued") {
      return null;
    }

    const profile = await ctx.db.get(cert.profileId);

    return {
      valid: true,
      certificateNumber: cert.certificateNumber,
      level: cert.level,
      levelName: CERTIFICATE_LEVELS[cert.level as CertificateLevel]?.name ?? cert.level,
      issuedAt: cert.issuedAt,
      recipientName: profile?.fullName ?? "Unknown",
      university: profile?.university ?? undefined,
      skillsSnapshot: cert.skillsSnapshot,
      overallAverage: cert.overallAverage,
      totalSessions: cert.totalSessions,
      areasOfLaw: cert.areasOfLaw,
      strengths: cert.strengths,
      improvements: cert.improvements,
    };
  },
});

/** Get certificate definitions (for public/landing pages) */
export const getLevels = query({
  args: {},
  handler: async () => {
    return Object.entries(CERTIFICATE_LEVELS).map(([key, level]) => ({
      key,
      name: level.name,
      shortName: level.shortName,
      description: level.description,
      price: level.price,
      color: level.color,
      requirementsSummary: [
        `${level.requirements.aiSessionsRequired} AI sessions`,
        `${level.requirements.minAverageScore}+ average score`,
        `${level.requirements.groupMootsRequired}+ group moots`,
        `${level.requirements.areasOfLawRequired}+ areas of law`,
      ],
    }));
  },
});

// ═══════════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════════

/** Generate a unique verification code */
function generateVerificationCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
    if (i === 3 || i === 7) code += "-"; // format: XXXX-XXXX-XXXX
  }
  return code;
}

/** Issue a certificate (called after payment or for subscribers) */
export const issueCertificate = mutation({
  args: {
    level: v.string(),
    paymentStatus: v.string(), // "paid" | "included_in_subscription"
    stripePaymentId: v.optional(v.string()),
  },
  handler: async (ctx, { level, paymentStatus, stripePaymentId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email ?? ""))
      .first();
    if (!user) throw new Error("User not found");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();
    if (!profile) throw new Error("Profile not found");

    // Check if already issued
    const existing = await ctx.db
      .query("certificates")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const alreadyIssued = existing.find((c) => c.level === level && c.status === "issued");
    if (alreadyIssued) throw new Error("Certificate already issued for this level");

    // Calculate skills snapshot from completed AI sessions
    const aiSessions = await ctx.db
      .query("aiSessions")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const completed = aiSessions.filter((s) => s.status === "completed" && s.overallScore !== undefined);

    const dimensionScores = {
      argumentStructure: 0,
      useOfAuthorities: 0,
      oralDelivery: 0,
      judicialHandling: 0,
      courtManner: 0,
      persuasiveness: 0,
      timeManagement: 0,
    };
    let scoredCount = 0;
    for (const s of completed) {
      if (s.scores) {
        for (const key of Object.keys(dimensionScores) as (keyof typeof dimensionScores)[]) {
          dimensionScores[key] += s.scores[key];
        }
        scoredCount++;
      }
    }
    if (scoredCount > 0) {
      for (const key of Object.keys(dimensionScores) as (keyof typeof dimensionScores)[]) {
        dimensionScores[key] = Math.round(dimensionScores[key] / scoredCount);
      }
    }

    const overallAvg = scoredCount > 0
      ? Math.round(completed.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / completed.length)
      : 0;

    const areasOfLaw = [...new Set(completed.map((s) => s.areaOfLaw))];

    // Determine strengths and improvements from dimension scores
    const dimensionEntries = Object.entries(dimensionScores)
      .map(([key, val]) => ({ key, val }))
      .sort((a, b) => b.val - a.val);

    const dimensionLabels: Record<string, string> = {
      argumentStructure: "Argument Structure",
      useOfAuthorities: "Use of Authorities",
      oralDelivery: "Oral Delivery",
      judicialHandling: "Judicial Handling",
      courtManner: "Court Manner",
      persuasiveness: "Persuasiveness",
      timeManagement: "Time Management",
    };

    const strengths = dimensionEntries.slice(0, 3).map((d) => dimensionLabels[d.key] ?? d.key);
    const improvements = dimensionEntries.slice(-2).map((d) => dimensionLabels[d.key] ?? d.key);

    // Generate certificate number: RATIO-YYYY-NNNNN
    const year = new Date().getFullYear();
    const count = existing.length + 1;
    const certNumber = `RATIO-${year}-${String(count).padStart(5, "0")}`;

    const verificationCode = generateVerificationCode();

    const certId = await ctx.db.insert("certificates", {
      profileId: profile._id,
      level,
      status: "issued",
      issuedAt: new Date().toISOString(),
      certificateNumber: certNumber,
      verificationCode,
      skillsSnapshot: scoredCount > 0 ? dimensionScores : undefined,
      overallAverage: overallAvg,
      totalSessions: completed.length,
      areasOfLaw,
      strengths,
      improvements,
      paymentStatus,
      stripePaymentId,
    });

    return { certId, certificateNumber: certNumber, verificationCode };
  },
});

// ═══════════════════════════════════════════════════════════════
// AMBASSADOR APPLICATIONS
// ═══════════════════════════════════════════════════════════════

/** Submit an ambassador application */
export const submitAmbassadorApplication = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    university: v.string(),
    societyRole: v.optional(v.string()),
    country: v.optional(v.string()),
    motivation: v.string(),
    socialLinks: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for existing application
    const existing = await ctx.db
      .query("ambassadorApplications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existing && existing.status === "pending") {
      throw new Error("You already have a pending application");
    }

    // Try to link to existing profile
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    let profileId = undefined;
    if (user) {
      const profile = await ctx.db
        .query("profiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();
      if (profile) profileId = profile._id;
    }

    await ctx.db.insert("ambassadorApplications", {
      ...args,
      profileId,
      status: "pending",
      appliedAt: new Date().toISOString(),
    });

    return { success: true };
  },
});

/** Get pending ambassador applications (admin) */
export const getPendingApplications = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("ambassadorApplications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
  },
});

/** Get all accepted ambassadors (public) */
export const getAmbassadors = query({
  args: {},
  handler: async (ctx) => {
    const ambassadors = await ctx.db
      .query("profiles")
      .withIndex("by_ambassador", (q) => q.eq("isAmbassador", true))
      .collect();

    return ambassadors.map((p) => ({
      fullName: p.fullName,
      university: p.university ?? "Independent",
      universityShort: p.universityShort ?? "",
      chamber: p.chamber ?? "",
      ambassadorTier: p.ambassadorTier ?? "ambassador",
      ambassadorSince: p.ambassadorSince,
      rank: p.rank,
      totalMoots: p.totalMoots,
    }));
  },
});
