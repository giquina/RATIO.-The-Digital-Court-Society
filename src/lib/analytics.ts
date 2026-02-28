/**
 * Analytics — dual-dispatches events to GA4 + PostHog.
 *
 * Usage:
 *   import { analytics } from "@/lib/analytics";
 *   analytics.signUp("password");
 */

import posthog from "posthog-js";

type EventParams = Record<string, string | number | undefined>;

/** Low-level dispatcher — sends to both GA4 and PostHog */
export function trackEvent(
  eventName: string,
  params?: EventParams
) {
  if (typeof window === "undefined") return;

  // GA4
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }

  // PostHog (only if initialised)
  try {
    if (posthog.__loaded) {
      // Strip undefined values — PostHog doesn't like them
      const clean: Record<string, string | number> = {};
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (v !== undefined) clean[k] = v;
        }
      }
      posthog.capture(eventName, Object.keys(clean).length > 0 ? clean : undefined);
    }
  } catch {
    // PostHog not loaded — safe to ignore
  }
}

// ── Pre-defined events ────────────────────────────────────────────

export const analytics = {
  // ── Auth ──
  signUp: (method: string) =>
    trackEvent("sign_up", { method }),

  login: (method: string) =>
    trackEvent("login", { method }),

  // ── Sessions ──
  sessionCreated: (role: string) =>
    trackEvent("session_created", { role }),

  sessionJoined: (sessionId: string) =>
    trackEvent("session_joined", { session_id: sessionId }),

  // ── Moot Court ──
  mootCourtStarted: (mode: string) =>
    trackEvent("moot_court_started", { mode }),

  mootCourtCompleted: (mode: string, durationSeconds: number) =>
    trackEvent("moot_court_completed", { mode, duration_seconds: durationSeconds }),

  // ── Governance ──
  caseSubmitted: () =>
    trackEvent("case_submitted"),

  motionCreated: () =>
    trackEvent("motion_created"),

  votecast: (motionId: string) =>
    trackEvent("vote_cast", { motion_id: motionId }),

  // ── Law Book ──
  lawBookViewed: (module: string, topic?: string) =>
    trackEvent("law_book_viewed", { module, topic }),

  lawBookSearched: (query: string, resultCount: number) =>
    trackEvent("law_book_searched", { query, result_count: resultCount }),

  // ── Profile ──
  profileViewed: () =>
    trackEvent("profile_viewed"),

  // ── Chambers ──
  chamberJoined: (chamber: string) =>
    trackEvent("chamber_joined", { chamber }),

  // ── Resources / Library ──
  resourceDownloaded: (title: string, category: string) =>
    trackEvent("resource_downloaded", { title, category }),

  // ── Legal Research ──
  searchPerformed: (query: string, source: string, resultCount: number) =>
    trackEvent("search_performed", { query, source, result_count: resultCount }),

  // ── Social ──
  userFollowed: (targetProfileId: string) =>
    trackEvent("user_followed", { target_profile_id: targetProfileId }),

  userUnfollowed: (targetProfileId: string) =>
    trackEvent("user_unfollowed", { target_profile_id: targetProfileId }),

  activityCommended: (activityId: string) =>
    trackEvent("activity_commended", { activity_id: activityId }),

  // ── Referrals ──
  referralLinkCopied: () =>
    trackEvent("referral_link_copied"),

  referralLinkShared: (platform: string) =>
    trackEvent("referral_link_shared", { platform }),

  // ── Video Sessions ──
  videoSessionJoined: (sessionId: string) =>
    trackEvent("video_session_joined", { session_id: sessionId }),

  videoSessionLeft: (sessionId: string, durationSeconds?: number) =>
    trackEvent("video_session_left", { session_id: sessionId, duration_seconds: durationSeconds }),
};
