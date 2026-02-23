import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // ═══════════════════════════════════════════
  // USERS & PROFILES
  // ═══════════════════════════════════════════
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()), // legacy — Convex Auth uses authAccounts
    emailVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),

  profiles: defineTable({
    userId: v.id("users"),
    fullName: v.string(),
    university: v.string(),
    universityShort: v.string(), // "UCL", "KCL"
    yearOfStudy: v.number(), // 0=foundation, 1-4
    chamber: v.optional(v.string()), // "Gray's", "Lincoln's", "Inner", "Middle" — optional, can choose later
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
    handle: v.optional(v.string()), // URL-safe slug for referral links: /join/[handle]
    referredByProfileId: v.optional(v.id("profiles")), // who referred this advocate
    referralCount: v.optional(v.number()), // cached count of successful referrals
  })
    .index("by_user", ["userId"])
    .index("by_university", ["university"])
    .index("by_chamber", ["chamber"])
    .index("by_points", ["totalPoints"])
    .index("by_rank", ["rank"])
    .index("by_handle", ["handle"]),

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

  // ═══════════════════════════════════════════
  // LAW BOOK
  // ═══════════════════════════════════════════
  lawBookModules: defineTable({
    title: v.string(), // "Contract Law", "Criminal Law", etc.
    slug: v.string(),
    description: v.string(),
    iconName: v.string(), // Lucide icon name
    sortOrder: v.number(),
    topicCount: v.number(),
    status: v.string(), // "active", "draft", "archived"
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  lawBookTopics: defineTable({
    moduleId: v.id("lawBookModules"),
    title: v.string(),
    slug: v.string(),
    summary: v.string(), // Short description for listing
    status: v.string(), // "draft", "review", "published", "archived"
    currentVersionId: v.optional(v.id("lawBookVersions")),
    contributorCount: v.number(),
    citationCount: v.number(),
    viewCount: v.number(),
  })
    .index("by_module", ["moduleId"])
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),

  lawBookVersions: defineTable({
    topicId: v.id("lawBookTopics"),
    authorId: v.id("profiles"),
    content: v.string(), // Markdown content
    versionNumber: v.number(),
    changeNote: v.string(),
    status: v.string(), // "draft", "pending_review", "approved", "rejected"
    approvedAt: v.optional(v.string()),
    approvedBy: v.optional(v.id("profiles")),
  })
    .index("by_topic", ["topicId"])
    .index("by_author", ["authorId"])
    .index("by_status", ["status"]),

  lawBookContributions: defineTable({
    userId: v.id("profiles"),
    topicId: v.id("lawBookTopics"),
    versionId: v.optional(v.id("lawBookVersions")),
    type: v.string(), // "create", "edit", "review", "cite"
    pointsAwarded: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_topic", ["topicId"]),

  lawBookReviews: defineTable({
    versionId: v.id("lawBookVersions"),
    reviewerId: v.id("profiles"),
    status: v.string(), // "pending", "approved", "changes_requested", "rejected"
    feedback: v.optional(v.string()),
    reviewedAt: v.optional(v.string()),
  })
    .index("by_version", ["versionId"])
    .index("by_reviewer", ["reviewerId"]),

  lawBookCitations: defineTable({
    topicId: v.id("lawBookTopics"),
    versionId: v.optional(v.id("lawBookVersions")),
    citationType: v.string(), // "case", "statute", "article", "textbook"
    citationText: v.string(), // Human-readable
    oscolaFormatted: v.string(), // OSCOLA-compliant format
    url: v.optional(v.string()),
  })
    .index("by_topic", ["topicId"])
    .index("by_type", ["citationType"]),

  editorialBoard: defineTable({
    userId: v.id("profiles"),
    role: v.string(), // "editor", "senior_editor", "chief_editor"
    moduleId: v.optional(v.id("lawBookModules")), // null = all modules
    appointedAt: v.string(),
    status: v.string(), // "active", "inactive"
  })
    .index("by_module", ["moduleId"])
    .index("by_user", ["userId"]),

  // ═══════════════════════════════════════════
  // GOVERNANCE — LEGISLATIVE
  // ═══════════════════════════════════════════
  parliamentarySessions: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    scheduledDate: v.string(),
    status: v.string(), // "scheduled", "in_progress", "completed", "cancelled"
    speakerId: v.optional(v.id("profiles")),
    clerkId: v.optional(v.id("profiles")),
    attendeeCount: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["scheduledDate"]),

  motions: defineTable({
    proposerId: v.id("profiles"),
    secondedById: v.optional(v.id("profiles")),
    sessionId: v.optional(v.id("parliamentarySessions")),
    title: v.string(),
    issue: v.string(), // IRAC: Issue
    rule: v.string(), // IRAC: Rule
    application: v.string(), // IRAC: Application
    conclusion: v.string(), // IRAC: Conclusion
    status: v.string(), // "draft", "tabled", "seconded", "debating", "voting", "passed", "defeated", "withdrawn"
    category: v.string(), // "policy", "constitutional", "procedural", "conduct"
    votesAye: v.number(),
    votesNo: v.number(),
    votesAbstain: v.number(),
    quorumRequired: v.number(),
    votingDeadline: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_proposer", ["proposerId"])
    .index("by_session", ["sessionId"]),

  amendments: defineTable({
    motionId: v.id("motions"),
    proposerId: v.id("profiles"),
    text: v.string(),
    status: v.string(), // "proposed", "accepted", "rejected"
  })
    .index("by_motion", ["motionId"]),

  votes: defineTable({
    motionId: v.id("motions"),
    profileId: v.id("profiles"),
    vote: v.string(), // "aye", "no", "abstain"
    votedAt: v.string(),
  })
    .index("by_motion", ["motionId"])
    .index("by_voter", ["profileId"])
    .index("by_motion_and_voter", ["motionId", "profileId"]),

  debates: defineTable({
    motionId: v.id("motions"),
    sessionId: v.optional(v.id("parliamentarySessions")),
    speakerId: v.id("profiles"),
    content: v.string(),
    position: v.string(), // "for", "against", "point_of_order", "question"
    speakingOrder: v.number(),
  })
    .index("by_motion", ["motionId"])
    .index("by_session", ["sessionId"]),

  // ═══════════════════════════════════════════
  // GOVERNANCE — EXECUTIVE
  // ═══════════════════════════════════════════
  standingOrders: defineTable({
    orderNumber: v.number(),
    title: v.string(),
    content: v.string(), // Markdown
    category: v.string(), // "procedure", "conduct", "membership", "governance"
    lastAmendedBy: v.optional(v.id("motions")),
    status: v.string(), // "active", "amended", "repealed"
  })
    .index("by_category", ["category"])
    .index("by_number", ["orderNumber"]),

  governanceRoles: defineTable({
    profileId: v.id("profiles"),
    role: v.string(), // "speaker", "deputy_speaker", "whip", "clerk", "moderator"
    appointedBy: v.optional(v.id("motions")),
    appointedAt: v.string(),
    status: v.string(), // "active", "resigned", "removed"
  })
    .index("by_role", ["role"])
    .index("by_profile", ["profileId"]),

  moderationActions: defineTable({
    reportedById: v.id("profiles"),
    targetProfileId: v.id("profiles"),
    targetContentType: v.string(), // "debate", "motion", "comment", "profile"
    targetContentId: v.optional(v.string()),
    reason: v.string(),
    status: v.string(), // "reported", "under_review", "action_taken", "dismissed"
    action: v.optional(v.string()), // "warning", "content_removed", "restricted", "referred_to_tribunal"
    reviewedById: v.optional(v.id("profiles")),
    proportionalityAssessment: v.optional(v.string()),
    respondentStatement: v.optional(v.string()),
  })
    .index("by_target", ["targetProfileId"])
    .index("by_status", ["status"]),

  auditLog: defineTable({
    actorId: v.id("profiles"),
    action: v.string(), // "motion_proposed", "vote_cast", "role_assigned", "sanction_applied", etc.
    targetType: v.string(), // "motion", "profile", "session", "standing_order"
    targetId: v.optional(v.string()),
    details: v.optional(v.string()),
  })
    .index("by_actor", ["actorId"])
    .index("by_action", ["action"]),

  // ═══════════════════════════════════════════
  // GOVERNANCE — JUDICIAL
  // ═══════════════════════════════════════════
  cases: defineTable({
    filedById: v.id("profiles"),
    respondentId: v.id("profiles"),
    title: v.string(),
    issue: v.string(), // IRAC
    rule: v.string(),
    application: v.string(),
    conclusion: v.string(),
    status: v.string(), // "filed", "acknowledged", "served", "submissions", "hearing", "judgment", "appeal", "closed"
    assignedJudgeId: v.optional(v.id("profiles")),
    relatedMotionId: v.optional(v.id("motions")),
    remedySought: v.string(),
  })
    .index("by_filer", ["filedById"])
    .index("by_respondent", ["respondentId"])
    .index("by_status", ["status"])
    .index("by_judge", ["assignedJudgeId"]),

  caseSubmissions: defineTable({
    caseId: v.id("cases"),
    submittedById: v.id("profiles"),
    type: v.string(), // "initial_filing", "response", "reply", "evidence", "skeleton_argument"
    content: v.string(), // Markdown
    submittedAt: v.string(),
  })
    .index("by_case", ["caseId"]),

  hearings: defineTable({
    caseId: v.id("cases"),
    scheduledDate: v.string(),
    status: v.string(), // "scheduled", "in_progress", "completed", "adjourned"
    presidingJudgeId: v.id("profiles"),
    transcript: v.optional(v.string()),
  })
    .index("by_case", ["caseId"])
    .index("by_date", ["scheduledDate"]),

  judgments: defineTable({
    caseId: v.id("cases"),
    hearingId: v.optional(v.id("hearings")),
    judgeId: v.id("profiles"),
    outcome: v.string(), // "granted", "dismissed", "partially_granted"
    reasoning: v.string(), // Full judgment text
    remedy: v.optional(v.string()),
    isAppealable: v.boolean(),
    publishedAt: v.string(),
  })
    .index("by_case", ["caseId"])
    .index("by_judge", ["judgeId"]),

  // ═══════════════════════════════════════════
  // GOVERNANCE — META
  // ═══════════════════════════════════════════
  governanceTiers: defineTable({
    profileId: v.id("profiles"),
    tier: v.string(), // "member", "accredited", "voting", "constitutional", "judicial"
    calculatedAt: v.string(),
    contributionPoints: v.number(),
    mootCount: v.number(),
    averageScore: v.number(),
  })
    .index("by_profile", ["profileId"])
    .index("by_tier", ["tier"]),

  conductCode: defineTable({
    sectionNumber: v.number(),
    title: v.string(),
    content: v.string(), // Markdown
    lastAmendedBy: v.optional(v.id("motions")),
    status: v.string(), // "active", "amended"
  })
    .index("by_section", ["sectionNumber"]),

  // ═══════════════════════════════════════════
  // TOURNAMENTS
  // ═══════════════════════════════════════════
  tournaments: defineTable({
    name: v.string(),
    module: v.string(),
    format: v.string(), // "single_elimination", "round_robin", "swiss"
    maxParticipants: v.number(),
    currentRound: v.string(),
    status: v.string(), // "registration", "active", "completed"
    startDate: v.string(),
    endDate: v.optional(v.string()),
    organizer: v.id("profiles"),
    university: v.optional(v.string()),
    isCrossUniversity: v.boolean(),
    rules: v.optional(v.string()),
  })
    .index("by_status", ["status"]),

  tournamentEntries: defineTable({
    tournamentId: v.id("tournaments"),
    profileId: v.id("profiles"),
    seed: v.optional(v.number()),
    eliminated: v.boolean(),
    wins: v.number(),
    losses: v.number(),
  })
    .index("by_tournament", ["tournamentId"])
    .index("by_profile", ["profileId"]),

  tournamentMatches: defineTable({
    tournamentId: v.id("tournaments"),
    round: v.string(),
    matchNumber: v.number(),
    participant1: v.optional(v.id("profiles")),
    participant2: v.optional(v.id("profiles")),
    winner: v.optional(v.id("profiles")),
    videoSessionId: v.optional(v.id("videoSessions")),
    scheduledDate: v.optional(v.string()),
    status: v.string(), // "pending", "scheduled", "completed"
  })
    .index("by_tournament", ["tournamentId"])
    .index("by_round", ["tournamentId", "round"]),

  // ═══════════════════════════════════════════
  // VIDEO SESSIONS (DAILY.CO)
  // ═══════════════════════════════════════════
  videoSessions: defineTable({
    sessionId: v.optional(v.id("sessions")), // links to existing session
    hostId: v.id("profiles"),
    format: v.string(), // "1v1_moot", "2v2_moot", "practice", "ai_judge"
    title: v.string(),
    caseDescription: v.optional(v.string()),
    module: v.optional(v.string()),
    // Scheduling
    scheduledStart: v.number(), // UTC timestamp
    scheduledEnd: v.number(),
    timezone: v.string(), // "Europe/London"
    actualStart: v.optional(v.number()),
    actualEnd: v.optional(v.number()),
    // Video provider
    provider: v.string(), // "daily"
    roomName: v.string(),
    roomUrl: v.string(),
    // Status
    status: v.string(), // "pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"
    // Participants
    participants: v.array(v.object({
      profileId: v.id("profiles"),
      role: v.string(), // "appellant", "respondent", "judge", "observer"
      inviteStatus: v.string(), // "invited", "accepted", "declined"
      joinedAt: v.optional(v.number()),
      leftAt: v.optional(v.number()),
    })),
    // Recording & AI
    recordingEnabled: v.boolean(),
    recordingUrl: v.optional(v.string()),
    transcriptUrl: v.optional(v.string()),
    aiSummary: v.optional(v.string()),
    // Cancellation
    cancellationReason: v.optional(v.string()),
    cancelledBy: v.optional(v.id("profiles")),
  })
    .index("by_host", ["hostId"])
    .index("by_status", ["status"])
    .index("by_scheduled_start", ["scheduledStart"]),

  videoSessionRatings: defineTable({
    videoSessionId: v.id("videoSessions"),
    raterId: v.id("profiles"),
    rateeId: v.id("profiles"),
    advocacySkill: v.number(), // 1-5
    preparation: v.number(),
    professionalism: v.number(),
    overallRating: v.number(),
    comments: v.optional(v.string()),
  })
    .index("by_session", ["videoSessionId"])
    .index("by_ratee", ["rateeId"]),

  videoSessionEvents: defineTable({
    videoSessionId: v.id("videoSessions"),
    profileId: v.optional(v.id("profiles")),
    event: v.string(), // "created", "invited", "accepted", "declined", "joined", "left", "completed", etc.
    metadata: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_session", ["videoSessionId"]),

  // ═══════════════════════════════════════════
  // SUBSCRIPTIONS & BILLING
  // ═══════════════════════════════════════════
  subscriptions: defineTable({
    userId: v.id("users"),
    plan: v.string(), // "free", "premium", "premium_plus"
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripePriceId: v.optional(v.string()),
    status: v.string(), // "active", "canceled", "past_due", "trialing", "incomplete"
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_customer", ["stripeCustomerId"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"]),

  // ═══════════════════════════════════════════
  // LEGAL RESEARCH
  // ═══════════════════════════════════════════
  savedAuthorities: defineTable({
    profileId: v.id("profiles"),
    type: v.string(), // "case-law", "legislation", "parliament-debate", "parliament-bill"
    title: v.string(),
    citation: v.optional(v.string()), // OSCOLA formatted
    url: v.string(),
    subtitle: v.optional(v.string()), // court name, legislation type, etc.
    date: v.optional(v.string()),
    snippet: v.optional(v.string()),
    notes: v.optional(v.string()), // advocate's personal notes
    tags: v.optional(v.array(v.string())), // e.g. ["contract", "moot-prep"]
    folder: v.optional(v.string()), // e.g. "Contract Law Moot 2026"
    savedAt: v.string(), // ISO timestamp
  })
    .index("by_profile", ["profileId"])
    .index("by_profile_type", ["profileId", "type"])
    .index("by_profile_folder", ["profileId", "folder"]),

  searchHistory: defineTable({
    profileId: v.id("profiles"),
    query: v.string(),
    source: v.string(), // "all", "case-law", "legislation", "parliament"
    resultCount: v.number(),
    queryTime: v.number(), // ms
    searchedAt: v.string(), // ISO timestamp
  })
    .index("by_profile", ["profileId"])
    .index("by_profile_recent", ["profileId", "searchedAt"]),

  // ═══════════════════════════════════════════
  // REFERRALS — SHARE & REWARD
  // ═══════════════════════════════════════════
  referrals: defineTable({
    referrerId: v.id("profiles"), // advocate who sent the invite
    inviteeUserId: v.optional(v.id("users")), // set after signup
    inviteeProfileId: v.optional(v.id("profiles")), // set after onboarding
    status: v.string(), // "pending" | "signed_up" | "activated" | "expired" | "flagged"
    createdAt: v.string(), // ISO timestamp
    signedUpAt: v.optional(v.string()),
    activatedAt: v.optional(v.string()), // set after first session completion
    expiresAt: v.string(), // end of academic year or 30-day dormancy
    universityDomainMatch: v.optional(v.boolean()), // true if same .ac.uk domain
    fraudFlags: v.optional(v.array(v.string())), // ["same_ip", "velocity_cap", "self_referral"]
  })
    .index("by_referrer", ["referrerId"])
    .index("by_status", ["status"])
    .index("by_invitee_user", ["inviteeUserId"])
    .index("by_invitee_profile", ["inviteeProfileId"]),

  referralRewards: defineTable({
    profileId: v.id("profiles"), // advocate who earned the reward
    referralId: v.id("referrals"), // which referral triggered it
    rewardType: v.string(), // "ai_session" | "advanced_feedback" | "archive_unlock"
    earnedAt: v.string(), // ISO timestamp
    expiresAt: v.string(), // end of academic term
    redeemed: v.boolean(),
    redeemedAt: v.optional(v.string()),
    revoked: v.boolean(),
    revokedReason: v.optional(v.string()),
  })
    .index("by_profile", ["profileId"])
    .index("by_referral", ["referralId"])
    .index("by_type", ["profileId", "rewardType"]),

  referralAnalytics: defineTable({
    period: v.string(), // "2026-02" (monthly) or "2026-W08" (weekly)
    invitesSent: v.number(),
    clicks: v.number(), // landing page visits
    signups: v.number(),
    activations: v.number(), // completed first session
    rewardsIssued: v.number(),
    fraudFlagsTriggered: v.number(),
    topUniversities: v.optional(v.array(v.string())), // top 5 universities by referral
  })
    .index("by_period", ["period"]),
});
