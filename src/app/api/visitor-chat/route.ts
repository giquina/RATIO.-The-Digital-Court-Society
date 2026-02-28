/**
 * POST /api/visitor-chat — The Usher AI Fallback
 *
 * Lightweight AI route for visitor chat when FAQ matching fails.
 * No authentication required — visitors are unauthenticated.
 *
 * Guardrails:
 *   1. Global rate limit  (500 req/hr)
 *   2. Per-IP rate limit   (6 req/60 s — stricter than authenticated routes)
 *   3. Body-size guard     (16 KB max — visitor messages are short)
 *   4. Input validation + sanitisation
 *
 * Uses Claude Haiku for cost efficiency.
 * Edge Runtime compatible.
 */

import { checkRateLimit, GLOBAL_RATE_LIMIT } from "@/lib/ai/rate-limiter";
import { safeErrorResponse, sanitizeInput, validateApiKey } from "@/lib/ai/validation";

export const runtime = "edge";

// ── Visitor chat rate limits (stricter — unauthenticated) ───────────────────

const VISITOR_RATE_LIMIT = {
  limit: 6,
  windowMs: 60_000,
} as const;

const MAX_BODY_BYTES = 16 * 1024; // 16 KB

// ── The Usher system prompt ─────────────────────────────────────────────────

const USHER_SYSTEM_PROMPT = `You are The Usher — the digital court attendant for RATIO, a legal education platform styled as "The Digital Court Society".

Your role:
- Welcome visitors and answer questions about RATIO's features, pricing, and purpose
- Speak with quiet authority — polite, measured, slightly formal, but never stuffy
- Use court/legal metaphors naturally (e.g. "the Bench", "Chambers", "the Bar")
- Keep responses concise (2-3 sentences max) and helpful
- If you don't know something specific, say so honestly and offer to connect them with the team
- Never make up features or pricing that aren't listed below

About RATIO:
- A legal education platform for law students and aspiring advocates
- Features AI-powered moot court practice (argue cases before an AI Judge)
- Four AI practice modes: Judge, Mentor, Examiner, and Opponent
- Includes case brief tools, study materials, and performance feedback
- Free tier available with limited AI sessions; paid plans for more access
- Ambassador Programme for student representatives at universities
- Built with court-themed UI — navy, gold, serif typography

Pricing:
- Free tier: 3 AI practice sessions per month, basic features
- Student plan: enhanced access with .ac.uk email verification
- Full details on the pricing page

Tone guidelines:
- First person: "I" not "we"
- British English spelling
- Address visitors respectfully
- Keep the court atmosphere without being pretentious
- If asked about unrelated topics, gently redirect to RATIO

You are NOT a legal advisor. Do not provide legal advice. If asked legal questions, clarify that you help with the platform, not legal counsel.`;

// ── Helpers ─────────────────────────────────────────────────────────────────

function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ── POST handler ────────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const ip = getClientIP(request);

  // ── Layer 1: Global rate limit ────────────────────────────────────────────
  const globalCheck = checkRateLimit(
    "global-visitor",
    Math.floor(GLOBAL_RATE_LIMIT.limit / 2),
    GLOBAL_RATE_LIMIT.windowMs,
  );
  if (!globalCheck.allowed) {
    return safeErrorResponse(
      503,
      "The Usher is attending to many visitors. Please try again shortly.",
      "GLOBAL_RATE_LIMIT",
    );
  }

  // ── Layer 2: Per-IP rate limit ────────────────────────────────────────────
  const ipCheck = checkRateLimit(
    `visitor:${ip}`,
    VISITOR_RATE_LIMIT.limit,
    VISITOR_RATE_LIMIT.windowMs,
  );
  if (!ipCheck.allowed) {
    return safeErrorResponse(
      429,
      "Please wait a moment before sending another message.",
      "IP_RATE_LIMIT",
    );
  }

  // ── Layer 3: Body-size guard ──────────────────────────────────────────────
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return safeErrorResponse(400, "Unable to read request body.", "BODY_READ_ERROR");
  }

  const byteLength = new TextEncoder().encode(rawBody).byteLength;
  if (byteLength > MAX_BODY_BYTES) {
    return safeErrorResponse(413, "Message too long.", "BODY_TOO_LARGE");
  }

  // ── Layer 4: Parse + validate ─────────────────────────────────────────────
  let parsed: { message?: string; pageUrl?: string; sessionId?: string };
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return safeErrorResponse(400, "Invalid JSON.", "JSON_PARSE_ERROR");
  }

  const { message, pageUrl } = parsed;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return safeErrorResponse(400, "Message is required.", "MISSING_MESSAGE");
  }

  if (message.length > 500) {
    return safeErrorResponse(400, "Message too long (max 500 characters).", "MESSAGE_TOO_LONG");
  }

  // ── API key check ─────────────────────────────────────────────────────────
  if (!validateApiKey()) {
    return safeErrorResponse(
      503,
      "The Usher's AI capabilities are temporarily unavailable.",
      "NO_API_KEY",
    );
  }

  const sanitisedMessage = sanitizeInput(message.trim(), 500);
  const pageContext = pageUrl ? sanitizeInput(String(pageUrl), 200) : "";

  // ── Build messages for Claude ─────────────────────────────────────────────
  const systemPrompt = pageContext
    ? `${USHER_SYSTEM_PROMPT}\n\nThe visitor is currently viewing: ${pageContext}`
    : USHER_SYSTEM_PROMPT;

  const apiKey = process.env.ANTHROPIC_API_KEY ?? "";

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        system: systemPrompt,
        messages: [{ role: "user", content: sanitisedMessage }],
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!anthropicRes.ok) {
      if (anthropicRes.status === 429) {
        return safeErrorResponse(
          429,
          "The Usher is momentarily occupied. Please try again shortly.",
          "PROVIDER_RATE_LIMIT",
        );
      }

      console.error(`[VISITOR_CHAT] Anthropic error ${anthropicRes.status}`);
      return safeErrorResponse(
        502,
        "I'm having trouble connecting right now. Please try again.",
        "PROVIDER_ERROR",
      );
    }

    const data = await anthropicRes.json();
    const content =
      data?.content?.[0]?.type === "text" ? data.content[0].text : "";

    return new Response(
      JSON.stringify({ content }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(ipCheck.remaining),
        },
      },
    );
  } catch (err) {
    console.error(
      "[VISITOR_CHAT] Fetch error:",
      err instanceof Error ? err.message : "unknown",
    );
    return safeErrorResponse(
      502,
      "I'm having trouble connecting right now. Please try again.",
      "FETCH_ERROR",
    );
  }
}
