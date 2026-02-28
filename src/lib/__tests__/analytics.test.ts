import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackEvent, analytics } from "../analytics";

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

  it("aiPracticeCompleted includes duration", () => {
    analytics.aiPracticeCompleted("mentor", 300);
    expect(window.gtag).toHaveBeenCalledWith("event", "ai_practice_completed", {
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
});
