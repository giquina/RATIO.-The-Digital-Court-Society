"use client";

import { anyApi } from "convex/server";
import { useDemoQuery } from "@/hooks/useDemoSafe";

export type Plan = "free" | "premium" | "premium_plus" | "professional" | "professional_plus";

export interface SubscriptionInfo {
  plan: Plan;
  isActive: boolean;
  isPremium: boolean;
  isPremiumPlus: boolean;
  isProfessional: boolean;
  isProfessionalPlus: boolean;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: number;
  isLoading: boolean;
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

// Plan hierarchy — used for feature gating. Higher index = more access.
// Professional plans unlock the same features as their student equivalents.
const PLAN_ORDER: Plan[] = [
  "free",
  "premium",        // student paid tier
  "professional",   // professional paid tier (same features as premium)
  "premium_plus",   // student top tier
  "professional_plus", // professional top tier (same features as premium_plus)
];

// Maps each plan to its effective "feature level" for access checks.
// This lets professional plans unlock the same features as student equivalents.
function effectiveLevel(plan: Plan): number {
  const levelMap: Record<Plan, number> = {
    free: 0,
    premium: 1,
    professional: 1,       // same feature access as premium
    premium_plus: 2,
    professional_plus: 2,  // same feature access as premium_plus
  };
  return levelMap[plan] ?? 0;
}

export function useSubscription(): SubscriptionInfo {
  const sub = useDemoQuery(anyApi.subscriptions.getMySubscription);

  if (!CONVEX_URL) {
    // Demo mode — treat as premium for full feature access
    return {
      plan: "premium",
      isActive: true,
      isPremium: true,
      isPremiumPlus: false,
      isProfessional: false,
      isProfessionalPlus: false,
      isLoading: false,
    };
  }

  if (sub === undefined) {
    return {
      plan: "free",
      isActive: false,
      isPremium: false,
      isPremiumPlus: false,
      isProfessional: false,
      isProfessionalPlus: false,
      isLoading: true,
    };
  }

  const plan = (sub?.plan as Plan) || "free";
  const isActive = sub?.status === "active" || sub?.status === "trialing";
  const level = effectiveLevel(plan);

  return {
    plan,
    isActive,
    isPremium: level >= 1,          // premium, professional, premium_plus, professional_plus
    isPremiumPlus: level >= 2,      // premium_plus, professional_plus
    isProfessional: plan === "professional" || plan === "professional_plus",
    isProfessionalPlus: plan === "professional_plus",
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd,
    currentPeriodEnd: sub?.currentPeriodEnd,
    isLoading: false,
  };
}

// Feature access rules — keyed by the minimum student plan needed.
// Professional plans are mapped to the same level via effectiveLevel().
const FEATURE_ACCESS: Record<string, Plan> = {
  ai_judge: "free",              // Limited to 3/month on free
  ai_judge_unlimited: "premium",
  ai_case_brief: "premium",
  ai_argument_builder: "premium",
  advanced_analytics: "premium",
  pdf_portfolio: "premium",
  sqe2_prep: "premium_plus",
  priority_support: "premium_plus",
};

export function canAccess(plan: Plan, feature: string): boolean {
  const required = FEATURE_ACCESS[feature];
  if (!required) return true; // Unknown feature = allow
  return effectiveLevel(plan) >= effectiveLevel(required);
}
