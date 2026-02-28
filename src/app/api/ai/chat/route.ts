/**
 * POST /api/ai/chat — AI Practice Chat Endpoint (Streaming SSE)
 *
 * Sends the advocate's message history to Claude Haiku 4.5 and streams
 * the AI persona's response token-by-token via Server-Sent Events.
 * Uses prompt caching (cache_control: ephemeral) on the system prompt
 * to reduce input token costs by ~90% after the first call per session.
 *
 * Every request passes through 5 guardrail layers before touching the LLM:
 *
 *   1. Global rate limit  (1 000 req/hr across all IPs)
 *   2. Per-IP rate limit   (20 req/60 s)
 *   3. Body-size guard     (256 KB max)
 *   4. Zod schema validation + input sanitisation
 *   5. Token budget check  (daily spend ceiling)
 *
 * Response format: text/event-stream
 *   data: {"text":"token"}\n\n   — for each text delta
 *   data: [DONE]\n\n             — stream complete
 *
 * Edge Runtime compatible — no Node.js-only APIs.
 */

import {
  chatRequestSchema,
  validateBodySize,
  safeErrorResponse,
  sanitizeInput,
  validateApiKey,
} from "@/lib/ai/validation";
import {
  checkRateLimit,
  CHAT_RATE_LIMIT,
  GLOBAL_RATE_LIMIT,
} from "@/lib/ai/rate-limiter";
import {
  truncateTranscript,
  checkDailyBudget,
  trackUsage,
  MAX_TOKENS_CHAT,
  type ChatMessage,
} from "@/lib/ai/token-budget";
import { logAiRequest } from "@/lib/ai/usage-tracker";
import {
  JUDGE_PROMPTS,
  MENTOR_SYSTEM_PROMPT,
  EXAMINER_SYSTEM_PROMPT,
  OPPONENT_SYSTEM_PROMPT,
  buildFullSystemPrompt,
  type JudgeTemperament,
  type UserContext,
} from "@/lib/ai/system-prompts";

export const runtime = "edge";

// ── System prompt lookup ────────────────────────────────────────────────────

const SYSTEM_PROMPTS: Record<string, string> = {
  judge: JUDGE_PROMPTS.standard,
  mentor: MENTOR_SYSTEM_PROMPT,
  examiner: EXAMINER_SYSTEM_PROMPT,
  opponent: OPPONENT_SYSTEM_PROMPT,
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
  const ipCheck = checkRateLimit(ip, CHAT_RATE_LIMIT.limit, CHAT_RATE_LIMIT.windowMs);
  if (!ipCheck.allowed) {
    return safeErrorResponse(
      429,
      "Too many requests. Please wait before submitting again.",
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

  const validation = chatRequestSchema.safeParse(parsed);
  if (!validation.success) {
    return safeErrorResponse(
      400,
      "Invalid request format.",
      "VALIDATION_ERROR",
    );
  }

  const { mode, messages, caseContext, temperament, userContext } = validation.data;

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
    return safeErrorResponse(
      503,
      "AI service is temporarily unavailable.",
      "NO_API_KEY",
    );
  }

  // ── Build system prompt with case context + professional modifier ──────
  const basePrompt = mode === "judge" && temperament
    ? (JUDGE_PROMPTS[temperament as JudgeTemperament] || JUDGE_PROMPTS.standard)
    : (SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.judge);

  const systemPrompt = buildFullSystemPrompt(
    basePrompt,
    caseContext ? sanitizeInput(caseContext, 5000) : undefined,
    userContext as UserContext | undefined,
  );

  // ── Truncate transcript (sliding window) ───────────────────────────────
  const sanitisedMessages: ChatMessage[] = messages.map((m) => ({
    role: m.role,
    content: sanitizeInput(m.content, 2000),
  }));
  const windowedMessages = truncateTranscript(sanitisedMessages);

  // ── Call Anthropic API (streaming) ────────────────────────────────────
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
        max_tokens: MAX_TOKENS_CHAT,
        stream: true,
        // Prompt caching: wrap system prompt in content-block with cache_control
        system: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: windowedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal: AbortSignal.timeout(60_000), // 60s — streaming needs longer
    });

    if (!anthropicRes.ok) {
      const latencyMs = Date.now() - startTime;
      const errorBody = await anthropicRes.text().catch(() => "");
      logAiRequest({
        endpoint: "chat",
        mode,
        inputTokens: 0,
        outputTokens: 0,
        latencyMs,
        success: false,
        errorCode: `ANTHROPIC_${anthropicRes.status}`,
      });

      // Rate limited by Anthropic
      if (anthropicRes.status === 429) {
        return safeErrorResponse(
          429,
          "The court requires a moment. Please try again shortly.",
          "PROVIDER_RATE_LIMIT",
        );
      }

      console.error(`[AI_CHAT] Anthropic error ${anthropicRes.status}: ${errorBody.slice(0, 200)}`);
      return safeErrorResponse(
        502,
        "The court is experiencing difficulties. Please try again.",
        "PROVIDER_ERROR",
      );
    }

    // ── Stream SSE from Anthropic to the client ───────────────────────
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let inputTokens = 0;
    let outputTokens = 0;

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = anthropicRes.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            // Keep the last (potentially incomplete) line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr || jsonStr === "[DONE]") continue;

              try {
                const event = JSON.parse(jsonStr);

                // Extract usage from message_start
                if (event.type === "message_start" && event.message?.usage) {
                  inputTokens = event.message.usage.input_tokens ?? 0;
                }

                // Stream text deltas to the client
                if (
                  event.type === "content_block_delta" &&
                  event.delta?.type === "text_delta" &&
                  event.delta.text
                ) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`),
                  );
                }

                // Extract final usage from message_delta
                if (event.type === "message_delta" && event.usage) {
                  outputTokens = event.usage.output_tokens ?? 0;
                }
              } catch {
                // Skip malformed JSON lines in the stream
              }
            }
          }
        } catch (streamErr) {
          console.error(
            "[AI_CHAT] Stream read error:",
            streamErr instanceof Error ? streamErr.message : "unknown",
          );
        } finally {
          // Track usage after stream completes
          const latencyMs = Date.now() - startTime;
          trackUsage(inputTokens, outputTokens);
          logAiRequest({
            endpoint: "chat",
            mode,
            inputTokens,
            outputTokens,
            latencyMs,
            success: true,
          });

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-RateLimit-Remaining": String(ipCheck.remaining),
      },
    });
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    logAiRequest({
      endpoint: "chat",
      mode,
      inputTokens: 0,
      outputTokens: 0,
      latencyMs,
      success: false,
      errorCode: "FETCH_ERROR",
    });

    console.error("[AI_CHAT] Fetch error:", err instanceof Error ? err.message : "unknown");
    return safeErrorResponse(
      502,
      "The court is experiencing difficulties. Please try again.",
      "FETCH_ERROR",
    );
  }
}
