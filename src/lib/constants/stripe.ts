// ═══════════════════════════════════════════
// STRIPE PLAN CONSTANTS
// ═══════════════════════════════════════════
// Single source of truth for plan metadata.
// Used by: admin dashboard, settings page, checkout.

export const PLAN_ORDER = [
  "free",
  "premium",
  "premium_plus",
  "professional",
  "professional_plus",
] as const;

export type PlanId = (typeof PLAN_ORDER)[number];

/** Monthly price in pence (GBP). */
export const PLAN_PRICE_PENCE: Record<string, number> = {
  free: 0,
  premium: 599,
  premium_plus: 799,
  professional: 1499,
  professional_plus: 2499,
};

/** Human-readable plan labels. */
export const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  premium: "Premium",
  premium_plus: "Premium+",
  professional: "Professional",
  professional_plus: "Professional+",
};

/** Formatted monthly price strings (GBP). */
export const PLAN_PRICE_FORMATTED: Record<string, string> = {
  free: "Free",
  premium: "£5.99/mo",
  premium_plus: "£7.99/mo",
  professional: "£14.99/mo",
  professional_plus: "£24.99/mo",
};
