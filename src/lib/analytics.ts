/**
 * Google Analytics 4 — event helpers for Ratio.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("sign_up", { method: "google" });
 */

type GAEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: string | number | undefined;
};

export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | undefined>
) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;

  window.gtag("event", eventName, params);
}

// Pre-defined events for Ratio
export const analytics = {
  signUp: (method: string) =>
    trackEvent("sign_up", { method }),

  login: (method: string) =>
    trackEvent("login", { method }),

  sessionCreated: (role: string) =>
    trackEvent("session_created", { role }),

  sessionJoined: (sessionId: string) =>
    trackEvent("session_joined", { session_id: sessionId }),

  aiPracticeStarted: (mode: string) =>
    trackEvent("ai_practice_started", { mode }),

  aiPracticeCompleted: (mode: string, durationSeconds: number) =>
    trackEvent("ai_practice_completed", { mode, duration_seconds: durationSeconds }),

  caseSubmitted: () =>
    trackEvent("case_submitted"),

  motionCreated: () =>
    trackEvent("motion_created"),

  votecast: (motionId: string) =>
    trackEvent("vote_cast", { motion_id: motionId }),

  lawBookViewed: (module: string, topic?: string) =>
    trackEvent("law_book_viewed", { module, topic }),

  profileViewed: () =>
    trackEvent("profile_viewed"),

  chamberJoined: (chamber: string) =>
    trackEvent("chamber_joined", { chamber }),
};
