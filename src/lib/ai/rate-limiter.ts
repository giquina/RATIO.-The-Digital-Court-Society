/**
 * rate-limiter.ts — In-memory rate limiting and session abuse protection
 *
 * Provides per-IP request throttling and per-user monthly session caps
 * for the /api/ai/chat and /api/ai/feedback API routes.
 *
 * Design choices:
 *   - Map-based storage (no Redis/KV dependency — suitable for MVP)
 *   - Edge Runtime compatible (no Node.js-only APIs)
 *   - Self-cleaning: expired entries are purged every 60 seconds
 *   - Session counts key on userId + month so they reset automatically
 *
 * Usage:
 *   import { checkRateLimit, CHAT_RATE_LIMIT } from '@/lib/ai/rate-limiter';
 *   const result = checkRateLimit(ip, CHAT_RATE_LIMIT.limit, CHAT_RATE_LIMIT.windowMs);
 *   if (!result.allowed) return new Response('Too many requests', { status: 429 });
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  /** Milliseconds until the current window resets */
  resetIn: number;
};

export type SessionLimitResult = {
  allowed: boolean;
  used: number;
  limit: number;
};

// ---------------------------------------------------------------------------
// Constants — exported so consumers can reference limits directly
// ---------------------------------------------------------------------------

/** 20 requests per 60 seconds per IP */
export const CHAT_RATE_LIMIT = {
  limit: 20,
  windowMs: 60_000,
} as const;

/** 5 requests per 60 seconds per IP */
export const FEEDBACK_RATE_LIMIT = {
  limit: 5,
  windowMs: 60_000,
} as const;

/** 1000 requests per hour — global circuit breaker across all IPs */
export const GLOBAL_RATE_LIMIT = {
  limit: 1000,
  windowMs: 3_600_000,
} as const;

/** Free-tier advocates get 3 AI sessions per calendar month */
export const FREE_SESSION_LIMIT = 3;

/** 30 days in milliseconds (used as the session-count window) */
export const SESSION_WINDOW_MS = 30 * 24 * 60 * 60 * 1000; // 2_592_000_000

// ---------------------------------------------------------------------------
// Internal storage
// ---------------------------------------------------------------------------

type RateBucket = {
  count: number;
  resetTime: number;
};

type SessionBucket = {
  count: number;
  /** Timestamp (ms) at which this bucket expires */
  expiresAt: number;
};

const rateBuckets: Map<string, RateBucket> = new Map();
const sessionBuckets: Map<string, SessionBucket> = new Map();

// ---------------------------------------------------------------------------
// Self-cleaning timer
//
// Runs every 60 s and removes any entries whose window has elapsed.
// Uses a plain setInterval — safe in both Node and Edge runtimes.
// The `unref?.()` call prevents the timer from keeping a Node process
// alive during tests or graceful shutdown (no-op in Edge).
// ---------------------------------------------------------------------------

const CLEANUP_INTERVAL_MS = 60_000;

function cleanup(): void {
  const now = Date.now();

  rateBuckets.forEach((bucket, key) => {
    if (now >= bucket.resetTime) {
      rateBuckets.delete(key);
    }
  });

  sessionBuckets.forEach((bucket, key) => {
    if (now >= bucket.expiresAt) {
      sessionBuckets.delete(key);
    }
  });
}

const cleanupTimer = setInterval(cleanup, CLEANUP_INTERVAL_MS);
// Allow the process to exit naturally in Node; no-op in Edge Runtime.
if (typeof cleanupTimer === 'object' && 'unref' in cleanupTimer) {
  (cleanupTimer as { unref: () => void }).unref();
}

// ---------------------------------------------------------------------------
// Rate limiting — sliding-window counter (fixed window approximation)
// ---------------------------------------------------------------------------

/**
 * Check whether a request from `identifier` is within the allowed rate.
 *
 * @param identifier  Typically a client IP or the literal string "global"
 * @param limit       Maximum requests allowed in the window
 * @param windowMs    Window duration in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const bucket = rateBuckets.get(identifier);

  // First request or expired window — create fresh bucket
  if (!bucket || now >= bucket.resetTime) {
    rateBuckets.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  // Within an active window
  const resetIn = bucket.resetTime - now;

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetIn };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetIn };
}

// ---------------------------------------------------------------------------
// Session counting — monthly cap per user
// ---------------------------------------------------------------------------

/**
 * Build a deterministic key that incorporates the current UTC month so
 * counts naturally reset when the calendar rolls over.
 */
function sessionKey(userId: string): string {
  const d = new Date();
  return `${userId}:${d.getUTCFullYear()}-${d.getUTCMonth()}`;
}

/**
 * Return how many AI sessions `userId` has consumed this month.
 */
export function getSessionCount(userId: string): number {
  const bucket = sessionBuckets.get(sessionKey(userId));
  if (!bucket || Date.now() >= bucket.expiresAt) return 0;
  return bucket.count;
}

/**
 * Check whether `userId` is within their monthly session allowance.
 */
export function checkSessionLimit(
  userId: string,
  maxSessions: number,
): SessionLimitResult {
  const used = getSessionCount(userId);
  return {
    allowed: used < maxSessions,
    used,
    limit: maxSessions,
  };
}

/**
 * Record that `userId` has started a new AI session.
 */
export function incrementSessionCount(userId: string): void {
  const key = sessionKey(userId);
  const now = Date.now();
  const bucket = sessionBuckets.get(key);

  if (!bucket || now >= bucket.expiresAt) {
    sessionBuckets.set(key, { count: 1, expiresAt: now + SESSION_WINDOW_MS });
    return;
  }

  bucket.count += 1;
}
