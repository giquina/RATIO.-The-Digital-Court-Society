import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════

const VELOCITY_CAP_WEEKLY = 10; // max invites per week
const REWARD_CAP_MONTHLY = 5; // max credited referrals per month
const REWARD_CAP_TERM = 15; // max credited referrals per academic term
const DORMANT_EXPIRY_DAYS = 30; // pending referral expires after 30 days

/** Academic year end: 31 July of current or next year */
function getAcademicYearEnd(): string {
  const now = new Date();
  const year = now.getMonth() >= 7 ? now.getFullYear() + 1 : now.getFullYear();
  return `${year}-07-31T23:59:59.000Z`;
}

/** Generate a URL-safe handle from a name */
function generateHandle(fullName: string, suffix?: string): string {
  const base = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 30);
  return suffix ? `${base}-${suffix}` : base;
}

// ═══════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════

/** Get the current advocate's referral handle and stats */
export const myReferralInfo = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return null;

    // Get all referrals by this advocate
    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", profile._id))
      .collect();

    const pending = referrals.filter((r) => r.status === "pending").length;
    const signedUp = referrals.filter((r) => r.status === "signed_up").length;
    const activated = referrals.filter((r) => r.status === "activated").length;
    const flagged = referrals.filter((r) => r.status === "flagged").length;

    // Get unredeemed rewards
    const rewards = await ctx.db
      .query("referralRewards")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const unredeemedRewards = rewards.filter((r) => !r.redeemed && !r.revoked);

    // Check velocity: invites sent this week
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const recentInvites = referrals.filter((r) => r.createdAt > weekAgo).length;
    const canInvite = recentInvites < VELOCITY_CAP_WEEKLY;

    return {
      handle: profile.handle,
      totalReferrals: referrals.length,
      pending,
      signedUp,
      activated,
      flagged,
      unredeemedRewards: unredeemedRewards.length,
      rewards: unredeemedRewards.map((r) => ({
        id: r._id,
        type: r.rewardType,
        earnedAt: r.earnedAt,
        expiresAt: r.expiresAt,
      })),
      canInvite,
      invitesThisWeek: recentInvites,
      inviteCapWeekly: VELOCITY_CAP_WEEKLY,
      rewardCapTerm: REWARD_CAP_TERM,
    };
  },
});

/** Get referral activity list for dashboard */
export const myReferralActivity = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return [];

    const referrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", profile._id))
      .collect();

    // Enrich with invitee first name + last initial only (GDPR minimal)
    const enriched = await Promise.all(
      referrals
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 20)
        .map(async (ref) => {
          let displayName = "Pending";
          if (ref.inviteeProfileId) {
            const inviteeProfile = await ctx.db.get(ref.inviteeProfileId);
            if (inviteeProfile) {
              const parts = inviteeProfile.fullName.split(" ");
              displayName =
                parts.length > 1
                  ? `${parts[0]} ${parts[parts.length - 1][0]}.`
                  : parts[0];
            }
          }
          return {
            id: ref._id,
            status: ref.status,
            displayName,
            createdAt: ref.createdAt,
            activatedAt: ref.activatedAt,
            universityMatch: ref.universityDomainMatch,
          };
        })
    );

    return enriched;
  },
});

/** Public query: get referrer profile for /join/[handle] landing page */
export const getReferrerByHandle = query({
  args: { handle: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) => q.eq("handle", args.handle))
      .first();
    if (!profile || !profile.isPublic) return null;

    return {
      fullName: profile.fullName,
      university: profile.university,
      universityShort: profile.universityShort,
      chamber: profile.chamber,
      rank: profile.rank,
      totalMoots: profile.totalMoots,
      avatarUrl: profile.avatarUrl,
      referralCount: profile.referralCount ?? 0,
    };
  },
});

// ═══════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════

/** Generate or retrieve the advocate's referral handle */
export const ensureHandle = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    // Already has a handle
    if (profile.handle) return profile.handle;

    // Generate handle from name
    let handle = generateHandle(profile.fullName);
    let attempt = 0;

    // Ensure uniqueness
    while (true) {
      const existing = await ctx.db
        .query("profiles")
        .withIndex("by_handle", (q) => q.eq("handle", handle))
        .first();
      if (!existing) break;
      attempt++;
      handle = generateHandle(profile.fullName, String(attempt));
      if (attempt > 50) throw new Error("Could not generate unique handle");
    }

    await ctx.db.patch(profile._id, { handle, referralCount: profile.referralCount ?? 0 });
    return handle;
  },
});

/** Create a new referral (invite sent) */
export const createReferral = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    // Velocity check
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const recentReferrals = await ctx.db
      .query("referrals")
      .withIndex("by_referrer", (q) => q.eq("referrerId", profile._id))
      .collect();
    const recentCount = recentReferrals.filter((r) => r.createdAt > weekAgo).length;
    if (recentCount >= VELOCITY_CAP_WEEKLY) {
      throw new Error("Weekly invite limit reached. Try again next week.");
    }

    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + DORMANT_EXPIRY_DAYS * 86400000).toISOString();

    const referralId = await ctx.db.insert("referrals", {
      referrerId: profile._id,
      status: "pending",
      createdAt: now,
      expiresAt,
      fraudFlags: [],
    });

    return referralId;
  },
});

/** Client-callable: claim a referral using the current user's auth context */
export const claimMyReferral = mutation({
  args: { referrerHandle: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the referrer by handle
    const referrer = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) => q.eq("handle", args.referrerHandle))
      .first();
    if (!referrer) return null;

    // Prevent duplicate claims
    const existing = await ctx.db
      .query("referrals")
      .withIndex("by_invitee_user", (q) => q.eq("inviteeUserId", userId))
      .first();
    if (existing) return existing._id;

    // Self-referral check
    const newUser = await ctx.db.get(userId);
    const referrerUser = await ctx.db.get(referrer.userId);
    const fraudFlags: string[] = [];

    if (newUser?.email && referrerUser?.email) {
      if (newUser.email === referrerUser.email) {
        fraudFlags.push("self_referral");
      }
    }

    const now = new Date().toISOString();

    const referralId = await ctx.db.insert("referrals", {
      referrerId: referrer._id,
      inviteeUserId: userId,
      status: fraudFlags.length > 0 ? "flagged" : "signed_up",
      createdAt: now,
      signedUpAt: now,
      expiresAt: getAcademicYearEnd(),
      fraudFlags: fraudFlags.length > 0 ? fraudFlags : undefined,
    });

    return referralId;
  },
});

/** Called when an invitee signs up via a referral handle (server-side) */
export const claimReferral = mutation({
  args: {
    referrerHandle: v.string(),
    newUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Find the referrer by handle
    const referrer = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) => q.eq("handle", args.referrerHandle))
      .first();
    if (!referrer) return null; // Silently fail if invalid handle

    // Check for self-referral: new user's email domain vs referrer's email
    const newUser = await ctx.db.get(args.newUserId);
    const referrerUser = await ctx.db.get(referrer.userId);
    const fraudFlags: string[] = [];

    if (newUser?.email && referrerUser?.email) {
      if (newUser.email === referrerUser.email) {
        fraudFlags.push("self_referral");
      }
    }

    const now = new Date().toISOString();

    // Find or create a pending referral for this referrer
    const referralId = await ctx.db.insert("referrals", {
      referrerId: referrer._id,
      inviteeUserId: args.newUserId,
      status: fraudFlags.length > 0 ? "flagged" : "signed_up",
      createdAt: now,
      signedUpAt: now,
      expiresAt: getAcademicYearEnd(),
      fraudFlags: fraudFlags.length > 0 ? fraudFlags : undefined,
    });

    return referralId;
  },
});

/** Called after invitee completes first session — activates referral and issues reward */
export const activateReferral = mutation({
  args: { inviteeProfileId: v.id("profiles") },
  handler: async (ctx, args) => {
    // Find the referral for this invitee
    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_invitee_profile", (q) =>
        q.eq("inviteeProfileId", args.inviteeProfileId)
      )
      .first();
    if (!referral || referral.status !== "signed_up") return null;

    // Check for fraud flags
    if (referral.fraudFlags && referral.fraudFlags.length > 0) {
      await ctx.db.patch(referral._id, { status: "flagged" });
      return null;
    }

    const now = new Date().toISOString();

    // Activate the referral
    await ctx.db.patch(referral._id, {
      status: "activated",
      activatedAt: now,
    });

    // Check monthly reward cap
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

    if (monthlyRewards >= REWARD_CAP_MONTHLY) return referral._id;

    // Issue reward: AI Judge session unlock
    await ctx.db.insert("referralRewards", {
      profileId: referral.referrerId,
      referralId: referral._id,
      rewardType: "ai_session",
      earnedAt: now,
      expiresAt: getAcademicYearEnd(),
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

    return referral._id;
  },
});

/** Link an invitee's profile to their referral after onboarding */
export const linkProfileToReferral = mutation({
  args: {
    profileId: v.id("profiles"),
    referrerHandle: v.string(),
  },
  handler: async (ctx, args) => {
    // Find referrer
    const referrer = await ctx.db
      .query("profiles")
      .withIndex("by_handle", (q) => q.eq("handle", args.referrerHandle))
      .first();
    if (!referrer) return;

    // Find the referral record for this profile's user
    const profile = await ctx.db.get(args.profileId);
    if (!profile) return;

    const referral = await ctx.db
      .query("referrals")
      .withIndex("by_invitee_user", (q) => q.eq("inviteeUserId", profile.userId))
      .first();
    if (!referral) return;

    // Check university domain match
    const universityMatch = referrer.university === profile.university;

    await ctx.db.patch(referral._id, {
      inviteeProfileId: args.profileId,
      universityDomainMatch: universityMatch,
    });

    // Tag the invitee's profile as referred
    await ctx.db.patch(args.profileId, {
      referredByProfileId: referrer._id,
    });
  },
});

/** Redeem a referral reward */
export const redeemReward = mutation({
  args: { rewardId: v.id("referralRewards") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found");

    const reward = await ctx.db.get(args.rewardId);
    if (!reward) throw new Error("Reward not found");
    if (reward.profileId !== profile._id) throw new Error("Not authorized");
    if (reward.redeemed) throw new Error("Already redeemed");
    if (reward.revoked) throw new Error("Reward has been revoked");

    // Check expiry
    if (new Date(reward.expiresAt) < new Date()) {
      throw new Error("Reward has expired");
    }

    await ctx.db.patch(args.rewardId, {
      redeemed: true,
      redeemedAt: new Date().toISOString(),
    });

    return reward.rewardType;
  },
});

/** Check if advocate has available AI session rewards */
export const hasAiSessionReward = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return false;

    const rewards = await ctx.db
      .query("referralRewards")
      .withIndex("by_type", (q) =>
        q.eq("profileId", profile._id).eq("rewardType", "ai_session")
      )
      .collect();

    return rewards.some(
      (r) => !r.redeemed && !r.revoked && new Date(r.expiresAt) > new Date()
    );
  },
});
