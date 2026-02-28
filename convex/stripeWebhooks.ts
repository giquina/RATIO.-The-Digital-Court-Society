import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Stripe webhook idempotency helpers.
 * These are public functions because ConvexHttpClient (used in the Next.js
 * webhook route) can only call public functions. The event ID is not sensitive
 * data — it's just a string like "evt_..." used to prevent duplicate processing.
 */

/** Check if a Stripe event has already been processed. */
export const isEventProcessed = query({
  args: { eventId: v.string() },
  handler: async (ctx, args) => {
    if (!args.eventId.startsWith("evt_")) return false;
    const existing = await ctx.db
      .query("stripeWebhookEvents")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .first();
    return !!existing;
  },
});

/** Record a Stripe event as processed. */
export const recordProcessedEvent = mutation({
  args: {
    eventId: v.string(),
    eventType: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.eventId.startsWith("evt_")) {
      throw new Error("Invalid Stripe event ID format");
    }
    // Double-check to prevent race conditions
    const existing = await ctx.db
      .query("stripeWebhookEvents")
      .withIndex("by_event_id", (q) => q.eq("eventId", args.eventId))
      .first();
    if (existing) return;

    await ctx.db.insert("stripeWebhookEvents", {
      eventId: args.eventId,
      eventType: args.eventType,
      processedAt: Date.now(),
    });
  },
});
