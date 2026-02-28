import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackEvent, analytics } from "../analytics";

// Mock posthog-js to prevent real initialization
vi.mock("posthog-js", () => ({
  default: { __loaded: false, capture: vi.fn() },
}));

describe("trackEvent", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { gtag: vi.fn() });
  });

  it("calls gtag with event name and params", () => {
    trackEvent("test_event", { key: "value" });
    expect(window.gtag).toHaveBeenCalledWith("event", "test_event", {
      key: "value",
    });
  });

  it("does nothing when gtag is not available", () => {
    vi.stubGlobal("window", {});
    trackEvent("test_event");
    // No error thrown
  });
});

describe("analytics helpers", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { gtag: vi.fn() });
  });

  it("signUp fires sign_up event with method", () => {
    analytics.signUp("google");
    expect(window.gtag).toHaveBeenCalledWith("event", "sign_up", {
      method: "google",
    });
  });

  it("login fires login event with method", () => {
    analytics.login("password");
    expect(window.gtag).toHaveBeenCalledWith("event", "login", {
      method: "password",
    });
  });

  it("sessionCreated fires session_created event", () => {
    analytics.sessionCreated("judge");
    expect(window.gtag).toHaveBeenCalledWith("event", "session_created", {
      role: "judge",
    });
  });

  it("mootCourtCompleted includes duration", () => {
    analytics.mootCourtCompleted("mentor", 300);
    expect(window.gtag).toHaveBeenCalledWith("event", "moot_court_completed", {
      mode: "mentor",
      duration_seconds: 300,
    });
  });

  it("lawBookViewed includes module and optional topic", () => {
    analytics.lawBookViewed("Contract Law", "Offer and Acceptance");
    expect(window.gtag).toHaveBeenCalledWith("event", "law_book_viewed", {
      module: "Contract Law",
      topic: "Offer and Acceptance",
    });
  });

  it("votecast includes motion_id", () => {
    analytics.votecast("motion123");
    expect(window.gtag).toHaveBeenCalledWith("event", "vote_cast", {
      motion_id: "motion123",
    });
  });

  // ── New events ──

  it("resourceDownloaded fires with title and category", () => {
    analytics.resourceDownloaded("IRAC Template", "irac_guide");
    expect(window.gtag).toHaveBeenCalledWith("event", "resource_downloaded", {
      title: "IRAC Template",
      category: "irac_guide",
    });
  });

  it("searchPerformed fires with query, source, and count", () => {
    analytics.searchPerformed("donoghue", "case-law", 42);
    expect(window.gtag).toHaveBeenCalledWith("event", "search_performed", {
      query: "donoghue",
      source: "case-law",
      result_count: 42,
    });
  });

  it("userFollowed fires with target_profile_id", () => {
    analytics.userFollowed("profile_abc123");
    expect(window.gtag).toHaveBeenCalledWith("event", "user_followed", {
      target_profile_id: "profile_abc123",
    });
  });

  it("referralLinkCopied fires without params", () => {
    analytics.referralLinkCopied();
    expect(window.gtag).toHaveBeenCalledWith("event", "referral_link_copied", undefined);
  });

  it("referralLinkShared fires with platform", () => {
    analytics.referralLinkShared("whatsapp");
    expect(window.gtag).toHaveBeenCalledWith("event", "referral_link_shared", {
      platform: "whatsapp",
    });
  });

  it("lawBookSearched fires with query and result_count", () => {
    analytics.lawBookSearched("contract", 12);
    expect(window.gtag).toHaveBeenCalledWith("event", "law_book_searched", {
      query: "contract",
      result_count: 12,
    });
  });

  it("activityCommended fires with activity_id", () => {
    analytics.activityCommended("activity_xyz");
    expect(window.gtag).toHaveBeenCalledWith("event", "activity_commended", {
      activity_id: "activity_xyz",
    });
  });
});
