import { v } from "convex/values";
import { query, mutation, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

// Get the current user's subscription
export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return sub ?? { plan: "free", status: "active" };
  },
});

// Get subscription by Stripe customer ID (used by webhooks only)
// Kept as public query because ConvexHttpClient can't call internal functions.
// Returns only the minimal fields needed by the webhook handler.
export const getByStripeCustomer = query({
  args: { stripeCustomerId: v.string() },
  handler: async (ctx, args) => {
    // Validate input format (Stripe customer IDs start with "cus_")
    if (!args.stripeCustomerId.startsWith("cus_")) {
      return null;
    }
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_customer", (q) =>
        q.eq("stripeCustomerId", args.stripeCustomerId)
      )
      .first();
    if (!sub) return null;
    // Return only what the webhook needs — not the full subscription record
    return { userId: sub.userId, plan: sub.plan, status: sub.status };
  },
});

// Create or update subscription from Stripe webhook
// Kept as public mutation because ConvexHttpClient can't call internal functions.
// Input validation ensures only legitimate Stripe data is accepted.
export const upsertFromStripe = mutation({
  args: {
    userId: v.id("users"),
    plan: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Validate Stripe ID formats
    if (!args.stripeCustomerId.startsWith("cus_")) {
      throw new Error("Invalid Stripe customer ID format");
    }
    if (!args.stripeSubscriptionId.startsWith("sub_")) {
      throw new Error("Invalid Stripe subscription ID format");
    }
    if (!args.stripePriceId.startsWith("price_")) {
      throw new Error("Invalid Stripe price ID format");
    }

    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      // Log subscription lifecycle event
      const fromPlan = existing.plan;
      const toPlan = args.plan;
      let event = "updated";
      if (fromPlan !== toPlan) {
        const planOrder = ["free", "premium", "professional", "premium_plus", "professional_plus"];
        const fromIdx = planOrder.indexOf(fromPlan);
        const toIdx = planOrder.indexOf(toPlan);
        event = toIdx > fromIdx ? "upgraded" : "downgraded";
      } else if (existing.status === "canceled" && args.status === "active") {
        event = "reactivated";
      }

      await ctx.db.insert("subscriptionEvents", {
        userId: args.userId,
        event,
        fromPlan,
        toPlan,
        timestamp: Date.now(),
        stripeSubscriptionId: args.stripeSubscriptionId,
      });

      await ctx.db.patch(existing._id, {
        plan: args.plan,
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        stripePriceId: args.stripePriceId,
        status: args.status,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        cancelAtPeriodEnd: args.cancelAtPeriodEnd,
      });

      // Notify Discord
      await ctx.scheduler.runAfter(0, internal.discord.notifySubscription, {
        event,
        plan: args.plan,
        previousPlan: fromPlan,
      });

      return existing._id;
    }

    // Log creation event
    await ctx.db.insert("subscriptionEvents", {
      userId: args.userId,
      event: "created",
      toPlan: args.plan,
      timestamp: Date.now(),
      stripeSubscriptionId: args.stripeSubscriptionId,
    });

    const subId = await ctx.db.insert("subscriptions", args);

    // Notify Discord
    await ctx.scheduler.runAfter(0, internal.discord.notifySubscription, {
      event: "created",
      plan: args.plan,
    });

    return subId;
  },
});

// Cancel subscription (mark as canceled at period end)
// Kept as public mutation because ConvexHttpClient can't call internal functions.
export const markCanceled = mutation({
  args: { stripeSubscriptionId: v.string() },
  handler: async (ctx, args) => {
    // Validate Stripe subscription ID format
    if (!args.stripeSubscriptionId.startsWith("sub_")) {
      throw new Error("Invalid Stripe subscription ID format");
    }
    const sub = await ctx.db
      .query("subscriptions")
      .withIndex("by_stripe_subscription", (q) =>
        q.eq("stripeSubscriptionId", args.stripeSubscriptionId)
      )
      .first();
    if (sub) {
      // Log cancellation event
      await ctx.db.insert("subscriptionEvents", {
        userId: sub.userId,
        event: "canceled",
        fromPlan: sub.plan,
        timestamp: Date.now(),
        stripeSubscriptionId: args.stripeSubscriptionId,
      });

      await ctx.db.patch(sub._id, {
        status: "canceled",
        cancelAtPeriodEnd: true,
      });

      // Notify Discord
      await ctx.scheduler.runAfter(0, internal.discord.notifySubscription, {
        event: "canceled",
        plan: sub.plan,
      });
    }
  },
});

// Get subscription by user ID (for Stripe checkout to find customer)
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});
