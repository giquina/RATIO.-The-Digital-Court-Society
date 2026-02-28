/**
 * Token & Budget Guardrails
 *
 * Centralised constants and utilities for managing AI token budgets,
 * transcript windowing, and daily spend tracking across Ratio's
 * Moot Court sessions.
 *
 * All functions are Edge Runtime compatible with no external dependencies.
 * The daily budget tracker is the sole stateful piece (in-memory);
 * everything else is pure.
 */

// ---------------------------------------------------------------------------
// Budget limit constants
// ---------------------------------------------------------------------------

/** Maximum output tokens for a standard chat completion. */
export const MAX_TOKENS_CHAT = 1024;

/** Maximum output tokens for detailed feedback completions. */
export const MAX_TOKENS_FEEDBACK = 2048;

/** Maximum character length for a single user message. */
export const MAX_USER_MESSAGE_CHARS = 2000;

/** Hard cap on the number of user/assistant exchanges in one session. */
export const MAX_EXCHANGES_PER_SESSION = 30;

/** Only the last N exchanges are sent to the API (sliding window). */
export const SLIDING_WINDOW_SIZE = 10;

/** Maximum request body size in bytes (50 KB). */
export const MAX_REQUEST_BODY_BYTES = 51_200;

/** Daily budget ceiling in cents ($10/day). */
export const DAILY_BUDGET_CENTS = 1000;

/** Estimated cost per 1 000 input tokens in cents (Haiku input pricing). */
export const ESTIMATED_COST_PER_1K_INPUT = 0.025;

/** Estimated cost per 1 000 output tokens in cents (Haiku output pricing). */
export const ESTIMATED_COST_PER_1K_OUTPUT = 0.125;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: string;
  content: string;
}

export interface MessageValidation {
  valid: boolean;
  length: number;
  maxLength: number;
}

export interface ExchangeLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

export interface BudgetStatus {
  allowed: boolean;
  spentCents: number;
  limitCents: number;
  percentUsed: number;
}

// ---------------------------------------------------------------------------
// Transcript management
// ---------------------------------------------------------------------------

/**
 * Truncate a message array to a sliding window while preserving the first
 * message (typically the system prompt).
 *
 * If the array has fewer messages than `windowSize * 2 + 1` (system + N
 * exchange pairs) it is returned unchanged.
 *
 * An "exchange" is one user message + one assistant reply, so the window
 * keeps up to `windowSize * 2` non-system messages plus the leading system
 * message.
 */
export function truncateTranscript(
  messages: ChatMessage[],
  windowSize: number = SLIDING_WINDOW_SIZE,
): ChatMessage[] {
  if (messages.length === 0) {
    return [];
  }

  // Number of trailing messages to keep (each exchange = 2 messages)
  const tailCount = windowSize * 2;

  // If the transcript already fits within the window, return as-is
  if (messages.length <= tailCount + 1) {
    return messages;
  }

  // Preserve the first message (system context) + the last `tailCount` messages
  const systemMessage = messages[0];
  const recentMessages = messages.slice(-tailCount);

  return [systemMessage, ...recentMessages];
}

// ---------------------------------------------------------------------------
// Message validation
// ---------------------------------------------------------------------------

/**
 * Validate that a user message does not exceed the character limit.
 */
export function validateMessageLength(message: string): MessageValidation {
  const length = message.length;
  return {
    valid: length <= MAX_USER_MESSAGE_CHARS,
    length,
    maxLength: MAX_USER_MESSAGE_CHARS,
  };
}

// ---------------------------------------------------------------------------
// Exchange limit
// ---------------------------------------------------------------------------

/**
 * Check whether a session has room for another exchange.
 *
 * @param exchangeCount - the current number of completed exchanges
 */
export function checkExchangeLimit(exchangeCount: number): ExchangeLimitResult {
  const remaining = Math.max(0, MAX_EXCHANGES_PER_SESSION - exchangeCount);
  return {
    allowed: exchangeCount < MAX_EXCHANGES_PER_SESSION,
    remaining,
    limit: MAX_EXCHANGES_PER_SESSION,
  };
}

// ---------------------------------------------------------------------------
// Cost estimation (pure)
// ---------------------------------------------------------------------------

/**
 * Estimate the cost in cents for a given number of input and output tokens.
 */
export function estimateCostCents(
  inputTokens: number,
  outputTokens: number,
): number {
  const inputCost = (inputTokens / 1000) * ESTIMATED_COST_PER_1K_INPUT;
  const outputCost = (outputTokens / 1000) * ESTIMATED_COST_PER_1K_OUTPUT;
  return inputCost + outputCost;
}

// ---------------------------------------------------------------------------
// Daily budget tracker (in-memory, stateful)
// ---------------------------------------------------------------------------

interface DailyUsage {
  date: string;
  spentCents: number;
}

/**
 * Return today's date as an ISO date string (YYYY-MM-DD) using UTC to
 * avoid timezone drift between Edge locations.
 */
function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** In-memory spend accumulator. Resets automatically when the date rolls. */
const dailyUsage: DailyUsage = {
  date: todayISO(),
  spentCents: 0,
};

/**
 * Ensure the tracker is pointing at the current date.
 * If the stored date is stale, the counter resets to zero.
 */
function ensureCurrentDate(): void {
  const today = todayISO();
  if (dailyUsage.date !== today) {
    dailyUsage.date = today;
    dailyUsage.spentCents = 0;
  }
}

/**
 * Record token usage against the daily budget.
 */
export function trackUsage(
  inputTokens: number,
  outputTokens: number,
): void {
  ensureCurrentDate();
  dailyUsage.spentCents += estimateCostCents(inputTokens, outputTokens);
}

/**
 * Check whether the daily budget still has headroom.
 */
export function checkDailyBudget(): BudgetStatus {
  ensureCurrentDate();
  const percentUsed =
    DAILY_BUDGET_CENTS > 0
      ? (dailyUsage.spentCents / DAILY_BUDGET_CENTS) * 100
      : 100;
  return {
    allowed: dailyUsage.spentCents < DAILY_BUDGET_CENTS,
    spentCents: dailyUsage.spentCents,
    limitCents: DAILY_BUDGET_CENTS,
    percentUsed: Math.min(percentUsed, 100),
  };
}

/**
 * Manually reset the daily budget tracker. Called by cleanup routines or
 * for testing purposes.
 */
export function resetDailyBudget(): void {
  dailyUsage.date = todayISO();
  dailyUsage.spentCents = 0;
}
