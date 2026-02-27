/**
 * POST /api/ai/case-note — Case Note Generator
 *
 * Takes a completed session transcript and generates a structured case note
 * formatted like a real law student's revision notes:
 *   - Case name & citation
 *   - Parties & roles
 *   - Legal issues identified
 *   - Arguments advanced (for and against)
 *   - Authorities cited
 *   - Outcome / judgment
 *
 * Same guardrail chain as other AI endpoints.
 * Edge Runtime compatible.
 */

import {
  validateBodySize,
  safeErrorResponse,
  sanitizeInput,
  validateApiKey,
} from "@/lib/ai/validation";
import {
  checkRateLimit,
  FEEDBACK_RATE_LIMIT,
  GLOBAL_RATE_LIMIT,
} from "@/lib/ai/rate-limiter";
import {
  checkDailyBudget,
  trackUsage,
} from "@/lib/ai/token-budget";
import { logAiRequest } from "@/lib/ai/usage-tracker";
import { z } from "zod";

export const runtime = "edge";

// ── Request schema ─────────────────────────────────────────────────────────

const caseNoteRequestSchema = z.object({
  mode: z.enum(["judge", "mentor", "examiner", "opponent"]),
  areaOfLaw: z.string().min(1).max(200),
  caseTitle: z.string().min(1).max(500),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1).max(5000),
    })
  ).min(1).max(100),
  scores: z.object({
    argumentStructure: z.number(),
    useOfAuthorities: z.number(),
    oralDelivery: z.number(),
    judicialHandling: z.number(),
    courtManner: z.number(),
    persuasiveness: z.number(),
    timeManagement: z.number(),
  }).optional(),
  overallScore: z.number().optional(),
  judgment: z.string().optional(),
});

// ── Case note prompt ───────────────────────────────────────────────────────

function buildCaseNotePrompt(
  mode: string,
  areaOfLaw: string,
  caseTitle: string,
): string {
  return `You are a legal education assistant. A law student has just completed a moot court practice session. Based on the transcript below, generate a structured case note that the student can use for revision.

## SESSION INFO
- Mode: ${mode}
- Area of Law: ${areaOfLaw}
- Case: ${caseTitle}

## REQUIRED OUTPUT FORMAT
Respond with ONLY a JSON object — no markdown, no backticks, no explanation. The object must have exactly these keys:

{
  "caseName": "<formal case name as cited in the session, e.g. R (Miller) v Secretary of State>",
  "citation": "<case citation if mentioned, or 'Practice Session' if none>",
  "court": "<court level if identifiable from discussion, e.g. 'Supreme Court' or 'High Court'>",
  "areaOfLaw": "<area of law>",
  "parties": {
    "appellant": "<name/description of appellant/claimant>",
    "respondent": "<name/description of respondent/defendant>"
  },
  "legalIssues": ["<issue 1>", "<issue 2>", ...],
  "argumentsFor": ["<argument 1 advanced by counsel>", "<argument 2>", ...],
  "argumentsAgainst": ["<counter-argument 1 raised>", "<counter-argument 2>", ...],
  "authoritiesCited": [
    { "name": "<case name or statute>", "point": "<what it was cited for>" }
  ],
  "keyPrinciples": ["<legal principle 1 discussed>", "<principle 2>", ...],
  "outcome": "<how the moot concluded — what the judge indicated or decided>",
  "studentNotes": "<2-3 sentence summary of key takeaways for revision>"
}

Be thorough but concise. Extract only what was actually discussed — do not invent arguments or authorities not present in the transcript.`;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ── POST handler ──────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();
  const ip = getClientIP(request);

  // ── Layer 1: Global rate limit ──
  const globalCheck = checkRateLimit("global", GLOBAL_RATE_LIMIT.limit, GLOBAL_RATE_LIMIT.windowMs);
  if (!globalCheck.allowed) {
    return safeErrorResponse(503, "The court is experiencing high demand. Please try again shortly.", "GLOBAL_RATE_LIMIT");
  }

  // ── Layer 2: Per-IP rate limit ──
  const ipCheck = checkRateLimit(ip, FEEDBACK_RATE_LIMIT.limit, FEEDBACK_RATE_LIMIT.windowMs);
  if (!ipCheck.allowed) {
    return safeErrorResponse(429, "Too many requests. Please wait before generating another case note.", "IP_RATE_LIMIT");
  }

  // ── Layer 3: Body-size guard ──
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return safeErrorResponse(400, "Unable to read request body.", "BODY_READ_ERROR");
  }
  if (!validateBodySize(rawBody)) {
    return safeErrorResponse(413, "Request body too large.", "BODY_TOO_LARGE");
  }

  // ── Layer 4: Parse + validate ──
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return safeErrorResponse(400, "Invalid JSON.", "JSON_PARSE_ERROR");
  }

  const validation = caseNoteRequestSchema.safeParse(parsed);
  if (!validation.success) {
    return safeErrorResponse(400, "Invalid request format.", "VALIDATION_ERROR");
  }

  const { mode, areaOfLaw, caseTitle, messages } = validation.data;

  // ── Layer 5: Daily budget check ──
  const budget = checkDailyBudget();
  if (!budget.allowed) {
    return safeErrorResponse(503, "Daily AI capacity has been reached. Please try again tomorrow.", "BUDGET_EXCEEDED");
  }

  // ── API key check ──
  if (!validateApiKey()) {
    return safeErrorResponse(500, "AI service is not configured.", "NO_API_KEY");
  }

  // ── Build transcript ──
  const systemPrompt = buildCaseNotePrompt(mode, sanitizeInput(areaOfLaw, 200), sanitizeInput(caseTitle, 500));

  const transcript = messages
    .map((m) => `${m.role === "user" ? "COUNSEL" : "COURT"}: ${sanitizeInput(m.content, 2000)}`)
    .join("\n\n");

  // ── Call Anthropic API ──
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
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Here is the full transcript of the moot court session:\n\n${transcript}\n\nPlease generate the structured case note as a JSON object.`,
          },
        ],
      }),
      signal: AbortSignal.timeout(55_000), // 55s server-side timeout
    });

    const latencyMs = Date.now() - startTime;

    if (!anthropicRes.ok) {
      const errorBody = await anthropicRes.text().catch(() => "");
      logAiRequest({
        endpoint: "case-note",
        mode,
        inputTokens: 0,
        outputTokens: 0,
        latencyMs,
        success: false,
        errorCode: `ANTHROPIC_${anthropicRes.status}`,
      });
      console.error(`[AI_CASE_NOTE] Anthropic error ${anthropicRes.status}: ${errorBody.slice(0, 200)}`);
      return safeErrorResponse(502, "Unable to generate case note. Please try again.", "ANTHROPIC_ERROR");
    }

    const data = await anthropicRes.json();
    const rawContent = data?.content?.[0]?.type === "text" ? data.content[0].text : "";
    const inputTokens = data?.usage?.input_tokens ?? 0;
    const outputTokens = data?.usage?.output_tokens ?? 0;

    trackUsage(inputTokens, outputTokens);
    logAiRequest({
      endpoint: "case-note",
      mode,
      inputTokens,
      outputTokens,
      latencyMs,
      success: true,
    });

    // ── Parse JSON response ──
    let caseNote: Record<string, unknown>;
    try {
      const cleaned = rawContent
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      caseNote = JSON.parse(cleaned);
    } catch {
      console.warn("[AI_CASE_NOTE] Failed to parse LLM output as JSON");
      return safeErrorResponse(502, "Unable to parse case note. Please try again.", "PARSE_ERROR");
    }

    return new Response(JSON.stringify({ caseNote }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    logAiRequest({
      endpoint: "case-note",
      mode,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs,
      success: false,
      errorCode: "FETCH_ERROR",
    });
    console.error("[AI_CASE_NOTE] Fetch error:", err instanceof Error ? err.message : "unknown");
    return safeErrorResponse(502, "Unable to generate case note. Please try again.", "FETCH_ERROR");
  }
}
