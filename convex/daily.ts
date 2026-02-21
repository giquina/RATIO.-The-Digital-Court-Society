// convex/daily.ts — Daily.co video room management
// In production, these are Node actions calling Daily's REST API.
// For demo, they return mock data.

import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ── Create a Daily.co room ──
// In production: POST https://api.daily.co/v1/rooms
export const createRoom = action({
  args: {
    sessionId: v.string(),
    expiresAt: v.number(),
    maxParticipants: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (DAILY_API_KEY) {
      // Production: call Daily API
      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          name: `ratio-${args.sessionId}`,
          privacy: "private",
          properties: {
            max_participants: args.maxParticipants ?? 4,
            enable_chat: true,
            enable_screenshare: true,
            enable_recording: "cloud",
            exp: Math.floor(args.expiresAt / 1000),
            eject_at_room_exp: true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Daily API error: ${response.status}`);
      }

      const room = await response.json();
      return { url: room.url, name: room.name };
    }

    // Demo mode: return mock room data
    const roomName = `ratio-${args.sessionId}`;
    return {
      url: `https://ratio.daily.co/${roomName}`,
      name: roomName,
    };
  },
});

// ── Generate a meeting token for a specific participant ──
// In production: POST https://api.daily.co/v1/meeting-tokens
export const createMeetingToken = action({
  args: {
    roomName: v.string(),
    userName: v.string(),
    userId: v.string(),
    expiresAt: v.number(),
    isOwner: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (DAILY_API_KEY) {
      const response = await fetch("https://api.daily.co/v1/meeting-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY}`,
        },
        body: JSON.stringify({
          properties: {
            room_name: args.roomName,
            user_name: args.userName,
            user_id: args.userId,
            is_owner: args.isOwner ?? false,
            exp: Math.floor(args.expiresAt / 1000),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Daily API error: ${response.status}`);
      }

      const data = await response.json();
      return data.token as string;
    }

    // Demo mode: return mock token
    return `demo-token-${args.roomName}-${Date.now()}`;
  },
});

// ── Delete a Daily.co room ──
export const deleteRoom = action({
  args: { roomName: v.string() },
  handler: async (ctx, args) => {
    const DAILY_API_KEY = process.env.DAILY_API_KEY;

    if (DAILY_API_KEY) {
      await fetch(`https://api.daily.co/v1/rooms/${args.roomName}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${DAILY_API_KEY}` },
      });
    }

    return { deleted: true };
  },
});
