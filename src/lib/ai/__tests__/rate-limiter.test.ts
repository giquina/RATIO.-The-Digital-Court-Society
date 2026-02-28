import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { checkRateLimit, CHAT_RATE_LIMIT, FEEDBACK_RATE_LIMIT } from "../rate-limiter";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the limit", () => {
    const result = checkRateLimit("test-ip-1", 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests exceeding the limit", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("test-ip-2", 5, 60_000);
    }
    const result = checkRateLimit("test-ip-2", 5, 60_000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("test-ip-3", 5, 60_000);
    }
    expect(checkRateLimit("test-ip-3", 5, 60_000).allowed).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(61_000);

    const result = checkRateLimit("test-ip-3", 5, 60_000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("tracks different identifiers independently", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("ip-a", 5, 60_000);
    }
    expect(checkRateLimit("ip-a", 5, 60_000).allowed).toBe(false);
    expect(checkRateLimit("ip-b", 5, 60_000).allowed).toBe(true);
  });

  it("returns correct resetIn time", () => {
    const result = checkRateLimit("test-ip-4", 10, 30_000);
    expect(result.resetIn).toBe(30_000);

    vi.advanceTimersByTime(10_000);
    const result2 = checkRateLimit("test-ip-4", 10, 30_000);
    expect(result2.resetIn).toBe(20_000);
  });

  it("exports sensible default limits", () => {
    expect(CHAT_RATE_LIMIT.limit).toBe(20);
    expect(CHAT_RATE_LIMIT.windowMs).toBe(60_000);
    expect(FEEDBACK_RATE_LIMIT.limit).toBe(5);
    expect(FEEDBACK_RATE_LIMIT.windowMs).toBe(60_000);
  });
});
