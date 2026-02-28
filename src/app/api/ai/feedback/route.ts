/**
 * POST /api/ai/feedback — Moot Court Feedback Endpoint
 *
 * Analyses the full session transcript and returns scored feedback across
 * 7 advocacy dimensions (1.0-5.0) plus qualitative commentary.
 *
 * Same 5-layer guardrail chain as /api/ai/chat, plus:
 *   - Score validation and clamping (parseFeedbackScores)
 *   - Fallback scores when the LLM output cannot be parsed
 *
 * Edge Runtime compatible — no Node.js-only APIs.
 */

import {
  feedbackRequestSchema,
  validateBodySize,
  safeErrorResponse,
  sanitizeInput,
  validateApiKey,
  parseFeedbackScores,
} from "@/lib/ai/validation";
import {
  checkRateLimit,
  FEEDBACK_RATE_LIMIT,
  GLOBAL_RATE_LIMIT,
} from "@/lib/ai/rate-limiter";
import {
  checkDailyBudget,
  trackUsage,
  MAX_TOKENS_FEEDBACK,
} from "@/lib/ai/token-budget";
import { logAiRequest } from "@/lib/ai/usage-tracker";

export const runtime = "edge";

// ── Feedback prompt template ────────────────────────────────────────────────

interface FeedbackUserContext {
  userType?: "student" | "professional";
  professionalRole?: string;
  practiceAreas?: string[];
}

function buildFeedbackPrompt(
  mode: string,
  caseContext: string,
  sessionDuration: number,
  userContext?: FeedbackUserContext,
): string {
  const modeLabel =
    mode === "judge"
      ? "presiding judge"
      : mode === "mentor"
        ? "senior counsel mentor"
        : mode === "examiner"
          ? "SQE2 advocacy examiner"
          : "opposing counsel";

  const isProfessional = userContext?.userType === "professional";
  const role = userContext?.professionalRole || "legal professional";
  const advocateDesc = isProfessional
    ? `a practising ${role}`
    : "a law student";
  const standardRef = isProfessional
    ? "Reference professional standards (BSB Handbook, SRA Competence Statement) where relevant. Frame feedback in terms of CPD and professional development."
    : "Frame feedback in educational and developmental terms appropriate for a law student.";

  return `You are an expert legal advocacy assessor. You have just observed a moot court session where you played the role of ${modeLabel}. The advocate is ${advocateDesc}.

Analyse the transcript below and provide structured feedback.

## SESSION CONTEXT
- Mode: ${mode}
- Duration: ${Math.round(sessionDuration / 60)} minutes
- Advocate: ${advocateDesc}
${caseContext ? `- Case context: ${caseContext}` : ""}

## ASSESSMENT STANDARD
${standardRef}
${isProfessional ? "Hold the advocate to a higher standard expected of practising professionals." : ""}

## SCORING GUIDE
Rate each dimension from 1.0 to 5.0:
- 1.0 = Significantly below expected standard
- 2.0 = Below expected standard
- 3.0 = Meets expected standard
- 4.0 = Above expected standard
- 5.0 = Exceptional performance

## REQUIRED OUTPUT FORMAT
Respond with ONLY a JSON object — no markdown, no backticks, no explanation. The object must have exactly these keys:

{
  "argumentStructure": <number 1.0-5.0>,
  "useOfAuthorities": <number 1.0-5.0>,
  "oralDelivery": <number 1.0-5.0>,
  "judicialHandling": <number 1.0-5.0>,
  "courtManner": <number 1.0-5.0>,
  "persuasiveness": <number 1.0-5.0>,
  "timeManagement": <number 1.0-5.0>,
  "judgment": "<3-4 sentence judicial summary of performance>",
  "keyStrength": "<1-2 sentence specific strength with example from transcript>",
  "keyImprovement": "<1-2 sentence specific improvement area with concrete advice>"
}`;
}

// ── Fallback scores ─────────────────────────────────────────────────────────

const FALLBACK_SCORES = {
  argumentStructure: 3.0,
  useOfAuthorities: 3.0,
  oralDelivery: 3.0,
  judicialHandling: 3.0,
  courtManner: 3.0,
  persuasiveness: 3.0,
  timeManagement: 3.0,
  judgment:
    "The court was unable to complete a detailed assessment of this session. " +
    "Counsel is encouraged to reflect on the exchange and identify areas of strength " +
    "and improvement independently.",
  keyStrength: "Counsel engaged with the session and made substantive submissions.",
  keyImprovement:
    "Consider structuring submissions more clearly using the IRAC framework " +
    "and citing specific authorities to support each proposition.",
};

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
  const startTime = Date.now();
  const ip = getClientIP(request);

  // ── Layer 1: Global rate limit ──────────────────────────────────────────
  const globalCheck = checkRateLimit(
    "global",
    GLOBAL_RATE_LIMIT.limit,
    GLOBAL_RATE_LIMIT.windowMs,
  );
  if (!globalCheck.allowed) {
    return safeErrorResponse(
      503,
      "The court is experiencing high demand. Please try again shortly.",
      "GLOBAL_RATE_LIMIT",
    );
  }

  // ── Layer 2: Per-IP rate limit ──────────────────────────────────────────
  const ipCheck = checkRateLimit(
    ip,
    FEEDBACK_RATE_LIMIT.limit,
    FEEDBACK_RATE_LIMIT.windowMs,
  );
  if (!ipCheck.allowed) {
    return safeErrorResponse(
      429,
      "Too many requests. Please wait before requesting feedback again.",
      "IP_RATE_LIMIT",
    );
  }

  // ── Layer 3: Body-size guard ────────────────────────────────────────────
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return safeErrorResponse(400, "Unable to read request body.", "BODY_READ_ERROR");
  }

  if (!validateBodySize(rawBody)) {
    return safeErrorResponse(413, "Request body too large.", "BODY_TOO_LARGE");
  }

  // ── Layer 4: Parse + validate ───────────────────────────────────────────
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return safeErrorResponse(400, "Invalid JSON.", "JSON_PARSE_ERROR");
  }

  const validation = feedbackRequestSchema.safeParse(parsed);
  if (!validation.success) {
    return safeErrorResponse(
      400,
      "Invalid request format.",
      "VALIDATION_ERROR",
    );
  }

  const { mode, messages, caseContext, sessionDuration, userContext } = validation.data;

  // ── Layer 5: Daily budget check ─────────────────────────────────────────
  const budget = checkDailyBudget();
  if (!budget.allowed) {
    return safeErrorResponse(
      503,
      "Daily AI capacity has been reached. Please try again tomorrow.",
      "BUDGET_EXCEEDED",
    );
  }

  // ── API key check ──────────────────────────────────────────────────────
  if (!validateApiKey()) {
    // Return fallback scores instead of failing completely
    return buildFallbackResponse();
  }

  // ── Build the transcript for the LLM ───────────────────────────────────
  const sanitisedCaseContext = sanitizeInput(caseContext, 5000);
  const systemPrompt = buildFeedbackPrompt(mode, sanitisedCaseContext, sessionDuration, userContext);

  const transcript = messages
    .map(
      (m) =>
        `${m.role === "user" ? "COUNSEL" : "COURT"}: ${sanitizeInput(m.content, 2000)}`,
    )
    .join("\n\n");

  // ── Call Anthropic API ─────────────────────────────────────────────────
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
        max_tokens: MAX_TOKENS_FEEDBACK,
        // Prompt caching: wrap system prompt in content-block with cache_control
        system: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: `Here is the full transcript of the session:\n\n${transcript}\n\nPlease provide your assessment as a JSON object.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(55_000), // 55s — feedback generation takes longer
    });

    const latencyMs = Date.now() - startTime;

    if (!anthropicRes.ok) {
      const errorBody = await anthropicRes.text().catch(() => "");
      logAiRequest({
        endpoint: "feedback",
        mode,
        inputTokens: 0,
        outputTokens: 0,
        latencyMs,
        success: false,
        errorCode: `ANTHROPIC_${anthropicRes.status}`,
      });

      console.error(
        `[AI_FEEDBACK] Anthropic error ${anthropicRes.status}: ${errorBody.slice(0, 200)}`,
      );

      // Return fallback scores on provider error
      return buildFallbackResponse();
    }

    const data = await anthropicRes.json();
    const rawContent =
      data?.content?.[0]?.type === "text" ? data.content[0].text : "";
    const inputTokens = data?.usage?.input_tokens ?? 0;
    const outputTokens = data?.usage?.output_tokens ?? 0;

    // Track usage
    trackUsage(inputTokens, outputTokens);
    logAiRequest({
      endpoint: "feedback",
      mode,
      inputTokens,
      outputTokens,
      latencyMs,
      success: true,
    });

    // ── Parse and validate scores ─────────────────────────────────────────
    let scoreData: ReturnType<typeof parseFeedbackScores> = null;
    try {
      // Strip markdown code fences if present
      const cleaned = rawContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      const jsonParsed = JSON.parse(cleaned);
      scoreData = parseFeedbackScores(jsonParsed);
    } catch {
      console.warn("[AI_FEEDBACK] Failed to parse LLM scores — using fallback");
    }

    if (!scoreData) {
      return buildFallbackResponse();
    }

    // Compute overall average
    const scoreKeys = [
      "argumentStructure",
      "useOfAuthorities",
      "oralDelivery",
      "judicialHandling",
      "courtManner",
      "persuasiveness",
      "timeManagement",
    ] as const;

    const sum = scoreKeys.reduce(
      (acc, key) => acc + (scoreData![key] as number),
      0,
    );
    const overall = parseFloat((sum / scoreKeys.length).toFixed(1));

    return new Response(
      JSON.stringify({
        scores: {
          argumentStructure: scoreData.argumentStructure,
          useOfAuthorities: scoreData.useOfAuthorities,
          oralDelivery: scoreData.oralDelivery,
          judicialHandling: scoreData.judicialHandling,
          courtManner: scoreData.courtManner,
          persuasiveness: scoreData.persuasiveness,
          timeManagement: scoreData.timeManagement,
        },
        overall,
        judgment: scoreData.judgment,
        keyStrength: scoreData.keyStrength,
        keyImprovement: scoreData.keyImprovement,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    logAiRequest({
      endpoint: "feedback",
      mode,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs,
      success: false,
      errorCode: "FETCH_ERROR",
    });

    console.error(
      "[AI_FEEDBACK] Fetch error:",
      err instanceof Error ? err.message : "unknown",
    );
    return buildFallbackResponse();
  }
}

// ── Fallback response builder ───────────────────────────────────────────────

function buildFallbackResponse(): Response {
  const scoreKeys = [
    "argumentStructure",
    "useOfAuthorities",
    "oralDelivery",
    "judicialHandling",
    "courtManner",
    "persuasiveness",
    "timeManagement",
  ] as const;

  const sum = scoreKeys.reduce(
    (acc, key) => acc + FALLBACK_SCORES[key],
    0,
  );
  const overall = parseFloat((sum / scoreKeys.length).toFixed(1));

  return new Response(
    JSON.stringify({
      scores: {
        argumentStructure: FALLBACK_SCORES.argumentStructure,
        useOfAuthorities: FALLBACK_SCORES.useOfAuthorities,
        oralDelivery: FALLBACK_SCORES.oralDelivery,
        judicialHandling: FALLBACK_SCORES.judicialHandling,
        courtManner: FALLBACK_SCORES.courtManner,
        persuasiveness: FALLBACK_SCORES.persuasiveness,
        timeManagement: FALLBACK_SCORES.timeManagement,
      },
      overall,
      judgment: FALLBACK_SCORES.judgment,
      keyStrength: FALLBACK_SCORES.keyStrength,
      keyImprovement: FALLBACK_SCORES.keyImprovement,
      fallback: true,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}
