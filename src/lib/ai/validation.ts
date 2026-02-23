/**
 * AI API Validation & Security Utilities
 *
 * Zod schemas and helper functions for validating, sanitising, and securing
 * requests/responses flowing through the AI practice API routes.
 *
 * Exports:
 *  - Zod schemas for chat, feedback, and score payloads
 *  - Body-size guard, safe error responses, input sanitisation
 *  - API-key presence check and score-parsing with clamping
 *
 * Edge Runtime compatible. Only dependency: zod.
 */

import { z } from "zod";

// ── Constants ────────────────────────────────────────────────────────────────

/** Maximum allowed raw body size in bytes (256 KB). */
const MAX_BODY_SIZE = 256 * 1024;

/** The four AI practice modes available in Ratio. */
const AI_MODES = ["judge", "mentor", "examiner", "opponent"] as const;

/** Valid message roles for the chat history array. */
const MESSAGE_ROLES = ["user", "assistant"] as const;

// ── Shared sub-schemas ───────────────────────────────────────────────────────

const messageSchema = z
  .object({
    role: z.enum(MESSAGE_ROLES),
    content: z.string().min(1).max(2000),
  })
  .strict();

const modeSchema = z.enum(AI_MODES);

// ── Request Schemas ──────────────────────────────────────────────────────────

/**
 * Schema for POST /api/ai/chat request body.
 *
 * `mode`        – which AI persona to invoke
 * `messages`    – conversation history (1-60 messages)
 * `caseContext`  – optional scenario / case description (max 5 000 chars)
 */
export const chatRequestSchema = z
  .object({
    mode: modeSchema,
    messages: z.array(messageSchema).min(1).max(60),
    caseContext: z.string().max(5000).default(""),
  })
  .strict();

/**
 * Schema for POST /api/ai/feedback request body.
 *
 * Extends the chat payload with `sessionDuration` (seconds, 0-3 600)
 * and requires at least 2 messages so feedback is meaningful.
 */
export const feedbackRequestSchema = z
  .object({
    mode: modeSchema,
    messages: z.array(messageSchema).min(2).max(60),
    caseContext: z.string().max(5000).default(""),
    sessionDuration: z.number().min(0).max(3600),
  })
  .strict();

// ── Feedback Score Schema ────────────────────────────────────────────────────

/** A single dimension score — clamped to the 1.0-5.0 range. */
const scoreField = z.number().min(1.0).max(5.0);

/**
 * Schema for AI-generated feedback scores.
 *
 * Seven numeric dimensions (1.0-5.0) plus textual summaries.
 */
export const feedbackScoresSchema = z
  .object({
    argumentStructure: scoreField,
    useOfAuthorities: scoreField,
    oralDelivery: scoreField,
    judicialHandling: scoreField,
    courtManner: scoreField,
    persuasiveness: scoreField,
    timeManagement: scoreField,
    judgment: z.string(),
    keyStrength: z.string(),
    keyImprovement: z.string(),
  })
  .strict();

// ── Utility Functions ────────────────────────────────────────────────────────

/**
 * Returns `false` if the serialised body exceeds the allowed size.
 *
 * Call this *before* JSON-parsing to reject oversized payloads early and
 * prevent denial-of-service via large request bodies.
 */
export function validateBodySize(body: string): boolean {
  // Use TextEncoder for an accurate byte count (handles multi-byte chars).
  const byteLength = new TextEncoder().encode(body).byteLength;
  return byteLength <= MAX_BODY_SIZE;
}

/**
 * Build a JSON error `Response` that never leaks stack traces or internals.
 *
 * @param status  HTTP status code (4xx / 5xx)
 * @param message Human-readable error description
 * @param code    Optional machine-readable error code (e.g. "INVALID_MODE")
 */
export function safeErrorResponse(
  status: number,
  message: string,
  code?: string,
): Response {
  const payload: { error: string; code?: string } = { error: message };
  if (code) {
    payload.code = code;
  }
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Strip control characters (except `\n` and `\t`) and enforce a maximum
 * length on untrusted user input.
 *
 * Keeps:
 *  - Horizontal tab  (U+0009)
 *  - Line feed       (U+000A)
 *  - Printable ASCII (U+0020 – U+007E)
 *  - Common Unicode  (U+00A0 – U+FFFF) — covers Latin, Greek, Cyrillic,
 *    CJK, emoji, and most scripts students are likely to use.
 *
 * Removes:
 *  - NULL and C0 controls (U+0000 – U+0008, U+000B – U+001F)
 *  - DEL (U+007F)
 *  - C1 controls (U+0080 – U+009F)
 */
export function sanitizeInput(input: string, maxLength: number): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = input.replace(/[^\t\n\x20-\x7E\u00A0-\uFFFF]/g, "");
  return cleaned.slice(0, maxLength);
}

/**
 * Check that an AI provider API key is present in the environment.
 *
 * Returns `true` when at least one of the recognised key env vars is set
 * to a non-empty value.  Does **not** verify the key is valid — that
 * happens when the provider rejects the request at call time.
 */
export function validateApiKey(): boolean {
  const anthropicKey =
    typeof process !== "undefined"
      ? process.env?.ANTHROPIC_API_KEY ?? ""
      : "";
  const openaiKey =
    typeof process !== "undefined"
      ? process.env?.OPENAI_API_KEY ?? ""
      : "";
  return anthropicKey.length > 0 || openaiKey.length > 0;
}

/**
 * Parse an unknown value (typically the JSON-decoded AI model response) into
 * a validated `feedbackScoresSchema` object.
 *
 * Numeric scores are clamped to the 1.0-5.0 range so that even if the LLM
 * returns an out-of-bounds number the downstream code always receives a
 * value within the expected scale.
 *
 * Returns `null` when the structure is fundamentally wrong (missing keys,
 * wrong types) and cannot be salvaged.
 */
export function parseFeedbackScores(
  raw: unknown,
): z.infer<typeof feedbackScoresSchema> | null {
  if (raw === null || raw === undefined || typeof raw !== "object") {
    return null;
  }

  const obj = raw as Record<string, unknown>;

  // Attempt to coerce and clamp each numeric dimension.
  const scoreKeys = [
    "argumentStructure",
    "useOfAuthorities",
    "oralDelivery",
    "judicialHandling",
    "courtManner",
    "persuasiveness",
    "timeManagement",
  ] as const;

  const clamped: Record<string, unknown> = { ...obj };

  for (const key of scoreKeys) {
    const value = obj[key];
    if (typeof value === "number" && !Number.isNaN(value)) {
      clamped[key] = Math.min(5.0, Math.max(1.0, value));
    } else if (typeof value === "string") {
      const parsed = parseFloat(value);
      if (!Number.isNaN(parsed)) {
        clamped[key] = Math.min(5.0, Math.max(1.0, parsed));
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // Coerce textual fields to strings if they exist but are the wrong type.
  const textKeys = ["judgment", "keyStrength", "keyImprovement"] as const;
  for (const key of textKeys) {
    if (typeof clamped[key] !== "string") {
      if (clamped[key] === undefined || clamped[key] === null) {
        return null;
      }
      clamped[key] = String(clamped[key]);
    }
  }

  // Run through the strict Zod schema as a final gate.
  const result = feedbackScoresSchema.safeParse(clamped);
  return result.success ? result.data : null;
}
