import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { validateStringLength, LIMITS } from "./lib/validation";

/**
 * Submit an email-based verification request (.ac.uk email).
 * Stores the request as "pending" for admin review.
 */
export const submitEmailVerification = mutation({
  args: {
    verificationEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the caller's profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found. Complete onboarding first.");

    // Validate email
    const email = args.verificationEmail.toLowerCase().trim();
    validateStringLength(email, "Verification email", LIMITS.EMAIL);
    if (!email.endsWith(".ac.uk")) {
      throw new Error("Email must be a .ac.uk university address");
    }

    // Check for existing pending request
    const existing = await ctx.db
      .query("verificationRequests")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const hasPending = existing.some((r) => r.status === "pending");
    if (hasPending) {
      throw new Error("You already have a pending verification request");
    }

    const requestId = await ctx.db.insert("verificationRequests", {
      profileId: profile._id,
      method: "email",
      status: "pending",
      verificationEmail: email,
      submittedAt: new Date().toISOString(),
    });

    return requestId;
  },
});

/**
 * Submit a manual verification request (university name + student ID).
 * Stores the request as "pending" for admin review.
 */
export const submitManualVerification = mutation({
  args: {
    universityName: v.string(),
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find the caller's profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) throw new Error("Profile not found. Complete onboarding first.");

    // Validate inputs
    validateStringLength(args.universityName, "University name", LIMITS.NAME);
    validateStringLength(args.studentId, "Student ID", LIMITS.NAME);

    if (!args.universityName.trim()) throw new Error("University name is required");
    if (!args.studentId.trim()) throw new Error("Student ID is required");

    // Check for existing pending request
    const existing = await ctx.db
      .query("verificationRequests")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const hasPending = existing.some((r) => r.status === "pending");
    if (hasPending) {
      throw new Error("You already have a pending verification request");
    }

    const requestId = await ctx.db.insert("verificationRequests", {
      profileId: profile._id,
      method: "manual",
      status: "pending",
      universityName: args.universityName.trim(),
      studentId: args.studentId.trim(),
      submittedAt: new Date().toISOString(),
    });

    return requestId;
  },
});

/**
 * Get the current user's verification request (if any).
 */
export const myVerificationStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return null;

    // Return the most recent verification request
    const requests = await ctx.db
      .query("verificationRequests")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();

    if (requests.length === 0) return null;

    // Sort by submittedAt descending and return the latest
    requests.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    return requests[0];
  },
});
