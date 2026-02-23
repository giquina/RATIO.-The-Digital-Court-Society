/**
 * AI Usage Tracker — Observability & Cost Monitoring
 *
 * In-memory tracking of AI API usage for cost monitoring and admin visibility.
 * All state is module-scoped and survives between requests within the same
 * serverless invocation, but resets on cold start. Acceptable for MVP.
 *
 * CRITICAL: This module NEVER logs user messages, transcripts, or any PII.
 * Only aggregate metrics, token counts, latency, and error codes are tracked.
 *
 * Edge Runtime compatible — no Node.js-only APIs.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AiRequestParams {
  endpoint: 'chat' | 'feedback';
  mode: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  success: boolean;
  errorCode?: string;
}

interface UsageSnapshot {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  estimatedCostCents: number;
  requestsToday: number;
  errorsToday: number;
  avgLatencyMs: number;
  date: string;
}

interface AlertThresholds {
  budgetWarning50: boolean;
  budgetWarning80: boolean;
  budgetExceeded: boolean;
  highErrorRate: boolean;
  highLatency: boolean;
}

interface CostEstimate {
  cents: number;
  formatted: string;
}

interface RequestRecord {
  timestamp: number;
  success: boolean;
  latencyMs: number;
}

// ---------------------------------------------------------------------------
// Haiku 4.5 pricing (per million tokens)
// ---------------------------------------------------------------------------

const HAIKU_INPUT_COST_PER_M = 0.25; // $0.25 per 1M input tokens
const HAIKU_OUTPUT_COST_PER_M = 1.25; // $1.25 per 1M output tokens

// ---------------------------------------------------------------------------
// Alert constants
// ---------------------------------------------------------------------------

const ERROR_RATE_THRESHOLD = 0.2; // 20%
const HIGH_LATENCY_THRESHOLD_MS = 5000;
const ONE_HOUR_MS = 60 * 60 * 1000;

// ---------------------------------------------------------------------------
// Module-scoped state
// ---------------------------------------------------------------------------

let currentDate = getTodayDateString();

let totalRequests = 0;
let totalInputTokens = 0;
let totalOutputTokens = 0;

let dailyRequests = 0;
let dailyErrors = 0;
let dailyInputTokens = 0;
let dailyOutputTokens = 0;
let dailyLatencySum = 0;

/** Rolling window of recent requests for error-rate and latency calculations. */
let recentRequests: RequestRecord[] = [];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/** Ensure daily counters belong to the current calendar day. */
function ensureDateCurrent(): void {
  const today = getTodayDateString();
  if (today !== currentDate) {
    resetDailyCounters();
    currentDate = today;
  }
}

/** Prune the rolling window to entries within the last hour. */
function pruneRecentRequests(): void {
  const cutoff = Date.now() - ONE_HOUR_MS;
  recentRequests = recentRequests.filter((r) => r.timestamp >= cutoff);
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Log an AI API request with structured JSON output.
 * NEVER logs user messages, transcripts, or any PII — only metrics.
 */
export function logAiRequest(params: AiRequestParams): void {
  ensureDateCurrent();

  const {
    endpoint,
    mode,
    inputTokens,
    outputTokens,
    latencyMs,
    success,
    errorCode,
  } = params;

  // Update lifetime counters
  totalRequests += 1;
  totalInputTokens += inputTokens;
  totalOutputTokens += outputTokens;

  // Update daily counters
  dailyRequests += 1;
  dailyLatencySum += latencyMs;
  if (!success) {
    dailyErrors += 1;
  }
  dailyInputTokens += inputTokens;
  dailyOutputTokens += outputTokens;

  // Record in rolling window
  recentRequests.push({
    timestamp: Date.now(),
    success,
    latencyMs,
  });

  // Structured log line — safe for log aggregation, contains zero PII
  const logEntry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    endpoint,
    mode,
    inputTokens,
    outputTokens,
    latencyMs,
    success,
    costCents: estimateCost(inputTokens, outputTokens).cents,
    dailyRequests,
    dailyErrors,
  };

  if (errorCode !== undefined) {
    logEntry.errorCode = errorCode;
  }

  // Prefix makes it easy to filter in log tooling
  console.log(`[AI_USAGE] ${JSON.stringify(logEntry)}`);
}

/**
 * Return a point-in-time snapshot of usage metrics.
 */
export function getUsageSnapshot(): UsageSnapshot {
  ensureDateCurrent();

  const avgLatencyMs =
    dailyRequests > 0 ? Math.round(dailyLatencySum / dailyRequests) : 0;

  return {
    totalRequests,
    totalInputTokens,
    totalOutputTokens,
    estimatedCostCents: estimateCost(dailyInputTokens, dailyOutputTokens).cents,
    requestsToday: dailyRequests,
    errorsToday: dailyErrors,
    avgLatencyMs,
    date: currentDate,
  };
}

/**
 * Check whether any alert thresholds have been breached.
 *
 * - Budget warnings at 50%, 80%, and 100% of the provided daily budget.
 * - High error rate: >20% of requests in the last hour.
 * - High latency: average latency >5 000 ms in the last hour.
 */
export function checkAlertThresholds(dailyBudgetCents: number): AlertThresholds {
  ensureDateCurrent();
  pruneRecentRequests();

  const dailyCostCents = estimateCost(dailyInputTokens, dailyOutputTokens).cents;

  // Budget thresholds
  const budgetWarning50 = dailyCostCents >= dailyBudgetCents * 0.5;
  const budgetWarning80 = dailyCostCents >= dailyBudgetCents * 0.8;
  const budgetExceeded = dailyCostCents >= dailyBudgetCents;

  // Error rate over the last hour
  const recentTotal = recentRequests.length;
  const recentErrors = recentRequests.filter((r) => !r.success).length;
  const highErrorRate =
    recentTotal > 0 && recentErrors / recentTotal > ERROR_RATE_THRESHOLD;

  // Latency over the last hour
  const recentLatencySum = recentRequests.reduce(
    (sum, r) => sum + r.latencyMs,
    0,
  );
  const recentAvgLatency =
    recentTotal > 0 ? recentLatencySum / recentTotal : 0;
  const highLatency = recentAvgLatency > HIGH_LATENCY_THRESHOLD_MS;

  // Emit console warnings/errors so they surface in log aggregation
  if (budgetExceeded) {
    console.error(
      `[AI_USAGE] ALERT: Daily budget EXCEEDED — ${dailyCostCents.toFixed(2)}c / ${dailyBudgetCents}c`,
    );
  } else if (budgetWarning80) {
    console.warn(
      `[AI_USAGE] WARNING: 80% of daily budget consumed — ${dailyCostCents.toFixed(2)}c / ${dailyBudgetCents}c`,
    );
  } else if (budgetWarning50) {
    console.warn(
      `[AI_USAGE] WARNING: 50% of daily budget consumed — ${dailyCostCents.toFixed(2)}c / ${dailyBudgetCents}c`,
    );
  }

  if (highErrorRate) {
    console.warn(
      `[AI_USAGE] WARNING: High error rate — ${recentErrors}/${recentTotal} (${((recentErrors / recentTotal) * 100).toFixed(1)}%) in the last hour`,
    );
  }

  if (highLatency) {
    console.warn(
      `[AI_USAGE] WARNING: High average latency — ${Math.round(recentAvgLatency)}ms in the last hour`,
    );
  }

  return {
    budgetWarning50,
    budgetWarning80,
    budgetExceeded,
    highErrorRate,
    highLatency,
  };
}

/**
 * Reset daily counters. Called automatically when the date changes,
 * or can be called manually.
 */
export function resetDailyCounters(): void {
  dailyRequests = 0;
  dailyErrors = 0;
  dailyInputTokens = 0;
  dailyOutputTokens = 0;
  dailyLatencySum = 0;
  recentRequests = [];
  currentDate = getTodayDateString();
}

/**
 * Estimate cost in cents from token counts using Haiku 4.5 pricing.
 *
 * Input:  $0.25 per 1M tokens
 * Output: $1.25 per 1M tokens
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
): CostEstimate {
  const inputCostDollars = (inputTokens / 1_000_000) * HAIKU_INPUT_COST_PER_M;
  const outputCostDollars =
    (outputTokens / 1_000_000) * HAIKU_OUTPUT_COST_PER_M;
  const totalCostDollars = inputCostDollars + outputCostDollars;
  const cents = Math.round(totalCostDollars * 100 * 100) / 100; // two decimal places

  const formatted =
    totalCostDollars < 0.01
      ? `$${totalCostDollars.toFixed(4)}`
      : `$${totalCostDollars.toFixed(2)}`;

  return { cents, formatted };
}
