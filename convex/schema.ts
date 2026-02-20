import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════
  // USERS & PROFILES
  // ═══════════════════════════════════════════
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.string(), // from auth provider
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  profiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    university: v.string(),
    universityShort: v.string(), // "UCL", "KCL"
    yearOfStudy: v.number(), // 0=foundation, 1-4
    chamber: v.string(), // "Gray's", "Lincoln's", "Inner", "Middle"
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    rank: v.string(), // Pupil → Junior Counsel → Senior Counsel → King's Counsel → Bencher
    streakDays: v.number(),
    streakLastDate: v.optional(v.string()), // ISO date
    totalMoots: v.number(),
    totalHours: v.number(),
    totalPoints: v.number(),
    readinessScore: v.number(), // SQE2 readiness 0-100
    followerCount: v.number(),
    followingCount: v.number(),
    commendationCount: v.number(),
    isPublic: v.boolean(),
    modules: v.array(v.string()), // ["Contract Law", "Public Law", ...]
  })
    .index("by_user", ["userId"])
    .index("by_university", ["university"])
    .index("by_chamber", ["chamber"])
    .index("by_points", ["totalPoints"])
    .index("by_rank", ["rank"]),

  // ═══════════════════════════════════════════
  // SOCIAL LAYER
  // ═══════════════════════════════════════════
  follows: defineTable({
    followerId: v.id("profiles"),
    followingId: v.id("profiles"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_pair", ["followerId", "followingId"]),

  activities: defineTable({
    profileId: v.id("profiles"),
    type: v.string(), // "moot_completed", "badge_earned", "milestone", "streak", "resource_shared", "session_created"
    title: v.string(),
    description: v.optional(v.string()),
    metadata: v.optional(v.any()), // { role, module, topic, badgeName, streakCount, ... }
    commendationCount: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_type", ["type"]),

  commendations: defineTable({
    fromProfileId: v.id("profiles"),
    activityId: v.id("activities"),
  })
    .index("by_activity", ["activityId"])
    .index("by_from_and_activity", ["fromProfileId", "activityId"]),

  // ═══════════════════════════════════════════
  // SESSIONS (THE HEART)
  // ═══════════════════════════════════════════
  sessions: defineTable({
    createdBy: v.id("profiles"),
    university: v.string(),
    module: v.string(),
    type: v.string(), // "moot", "mock_trial", "sqe2_prep", "debate", "workshop"
    title: v.string(),
    description: v.optional(v.string()),
    issueSummary: v.optional(v.string()),
    date: v.string(), // ISO date
    startTime: v.string(), // "14:00"
    endTime: v.string(), // "15:30"
    location: v.optional(v.string()),
    maxParticipants: v.optional(v.number()),
    isCrossUniversity: v.boolean(),
    status: v.string(), // "upcoming", "in_progress", "completed", "cancelled"
    bundleUrl: v.optional(v.string()),
    recordingUrl: v.optional(v.string()),
    participantCount: v.number(),
  })
    .index("by_university", ["university"])
    .index("by_status", ["status"])
    .index("by_date", ["date"])
    .index("by_creator", ["createdBy"])
    .index("by_module", ["module"]),

  sessionRoles: defineTable({
    sessionId: v.id("sessions"),
    roleName: v.string(), // "Presiding Judge", "Leading Counsel (Appellant)", etc.
    claimedBy: v.optional(v.id("profiles")),
    isClaimed: v.boolean(),
    claimedAt: v.optional(v.string()),
    speakingTimeLimit: v.optional(v.number()), // minutes
    sortOrder: v.number(),
  })
    .index("by_session", ["sessionId"]),

  sessionParticipants: defineTable({
    sessionId: v.id("sessions"),
    profileId: v.id("profiles"),
    roleId: v.optional(v.id("sessionRoles")),
    attended: v.boolean(),
  })
    .index("by_session", ["sessionId"])
    .index("by_profile", ["profileId"]),

  // ═══════════════════════════════════════════
  // FEEDBACK
  // ═══════════════════════════════════════════
  feedback: defineTable({
    sessionId: v.id("sessions"),
    fromProfileId: v.optional(v.id("profiles")), // null if AI
    toProfileId: v.id("profiles"),
    isAiFeedback: v.boolean(),
    scores: v.object({
      argumentStructure: v.number(),
      useOfAuthorities: v.number(),
      oralDelivery: v.number(),
      judicialHandling: v.number(),
      courtManner: v.number(),
      persuasiveness: v.number(),
      timeManagement: v.number(),
    }),
    overallScore: v.number(),
    writtenFeedback: v.optional(v.string()),
    keyImprovement: v.optional(v.string()),
    strengths: v.optional(v.string()),
  })
    .index("by_session", ["sessionId"])
    .index("by_recipient", ["toProfileId"]),

  // ═══════════════════════════════════════════
  // AI SESSIONS
  // ═══════════════════════════════════════════
  aiSessions: defineTable({
    profileId: v.id("profiles"),
    mode: v.string(), // "judge", "mentor", "examiner", "opponent"
    areaOfLaw: v.string(),
    caseTitle: v.string(),
    transcript: v.array(
      v.object({
        role: v.string(), // "ai" | "user"
        message: v.string(),
        timestamp: v.string(),
      })
    ),
    durationSeconds: v.optional(v.number()),
    scores: v.optional(
      v.object({
        argumentStructure: v.number(),
        useOfAuthorities: v.number(),
        oralDelivery: v.number(),
        judicialHandling: v.number(),
        courtManner: v.number(),
        persuasiveness: v.number(),
        timeManagement: v.number(),
      })
    ),
    overallScore: v.optional(v.number()),
    aiJudgment: v.optional(v.string()),
    keyImprovement: v.optional(v.string()),
    sqe2Competencies: v.optional(v.any()),
    savedToPortfolio: v.boolean(),
    status: v.string(), // "in_progress", "completed"
  })
    .index("by_profile", ["profileId"])
    .index("by_mode", ["mode"]),

  // ═══════════════════════════════════════════
  // SKILLS & BADGES
  // ═══════════════════════════════════════════
  userSkills: defineTable({
    profileId: v.id("profiles"),
    skillName: v.string(),
    score: v.number(), // 0-100
  })
    .index("by_profile", ["profileId"]),

  badges: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    category: v.string(), // "streak", "moots", "skill", "competition", "community"
    requirement: v.any(), // { type: "moots_completed", threshold: 10 }
  }),

  userBadges: defineTable({
    profileId: v.id("profiles"),
    badgeId: v.id("badges"),
    earnedAt: v.string(),
  })
    .index("by_profile", ["profileId"]),

  // ═══════════════════════════════════════════
  // RESOURCES / LIBRARY
  // ═══════════════════════════════════════════
  resources: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(), // "moot_template", "irac_guide", "sqe2_prep", "case_bank", etc.
    type: v.optional(v.string()), // "pdf", "doc", "video", "link"
    fileUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    module: v.optional(v.string()),
    uploadedBy: v.optional(v.id("profiles")),
    isPremium: v.boolean(),
    downloadCount: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_module", ["module"]),

  // ═══════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════
  notifications: defineTable({
    profileId: v.id("profiles"),
    type: v.string(), // "session_reminder", "role_claimed", "feedback_received", "new_follower", etc.
    title: v.string(),
    body: v.optional(v.string()),
    metadata: v.optional(v.any()),
    read: v.boolean(),
  })
    .index("by_profile", ["profileId"])
    .index("by_unread", ["profileId", "read"]),
});
