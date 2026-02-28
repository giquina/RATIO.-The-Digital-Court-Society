import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Visitor Chat ("The Usher") — Convex functions
 *
 * No authentication required — visitors are unauthenticated.
 * Session identity comes from a UUID stored in localStorage.
 */

// ── Create or update a visitor chat session ─────────────────────────────────

export const saveMessage = mutation({
  args: {
    sessionId: v.string(),
    role: v.string(),
    content: v.string(),
    type: v.string(),
    source: v.optional(v.string()),
    pageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const { sessionId, role, content, type, source, pageUrl } = args;

    // Validate sessionId format (UUID v4)
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      throw new Error("Invalid session ID");
    }

    const now = Date.now();
    const message = { role, content, timestamp: now, type, source };

    // Check if session already exists
    const existing = await ctx.db
      .query("visitorChats")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        messages: [...existing.messages, message],
        lastPageUrl: pageUrl,
      });
      return existing._id;
    }

    // Create new session
    return await ctx.db.insert("visitorChats", {
      sessionId,
      messages: [message],
      startPageUrl: pageUrl,
      lastPageUrl: pageUrl,
      resolved: false,
      createdAt: now,
    });
  },
});

// ── Capture visitor email ───────────────────────────────────────────────────

export const captureEmail = mutation({
  args: {
    sessionId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { sessionId, email }) => {
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }

    const session = await ctx.db
      .query("visitorChats")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    await ctx.db.patch(session._id, { visitorEmail: email });
  },
});

// ── Get session by ID (for restoring from localStorage) ─────────────────────

export const getSession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db
      .query("visitorChats")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .first();
  },
});

// ── Admin: list recent visitor chats ────────────────────────────────────────

export const listChats = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    // Auth check: only admins should call this
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("visitorChats")
      .withIndex("by_created")
      .order("desc")
      .take(limit ?? 50);
  },
});
