import { query } from "./_generated/server";
import { auth } from "./auth";

/**
 * Single aggregated query for all sidebar badge counts.
 * One WebSocket subscription instead of 5 separate ones.
 */
export const getCounts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    if (!profile) return null;

    // Unread notifications (uses by_unread compound index)
    const unreadNotifications = (
      await ctx.db
        .query("notifications")
        .withIndex("by_unread", (q) =>
          q.eq("profileId", profile._id).eq("read", false)
        )
        .collect()
    ).length;

    // Upcoming sessions the advocate is enrolled in
    const participations = await ctx.db
      .query("sessionParticipants")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    let upcomingSessions = 0;
    for (const p of participations) {
      const session = await ctx.db.get(p.sessionId);
      if (session && session.status === "upcoming") upcomingSessions++;
    }

    // Saved research authorities
    const savedAuthorities = (
      await ctx.db
        .query("savedAuthorities")
        .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
        .collect()
    ).length;

    // Moot court sessions in progress
    const allAiSessions = await ctx.db
      .query("aiSessions")
      .withIndex("by_profile", (q) => q.eq("profileId", profile._id))
      .collect();
    const mootDrafts = allAiSessions.filter(
      (s) => s.status === "in_progress"
    ).length;

    return {
      unreadNotifications,
      upcomingSessions,
      savedAuthorities,
      mootDrafts,
    };
  },
});
