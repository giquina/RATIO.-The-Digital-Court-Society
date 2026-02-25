import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { auth } from "./auth";

/** Record signup attribution (UTM params captured on landing page). */
export const recordAttribution = mutation({
  args: {
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    referrerUrl: v.optional(v.string()),
    landingPage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return;

    // Avoid duplicates — one attribution per user
    const existing = await ctx.db
      .query("signupAttribution")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (existing) return;

    await ctx.db.insert("signupAttribution", {
      userId,
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
      utmContent: args.utmContent,
      utmTerm: args.utmTerm,
      referrerUrl: args.referrerUrl,
      landingPage: args.landingPage,
      signupTimestamp: new Date().toISOString(),
    });
  },
});
