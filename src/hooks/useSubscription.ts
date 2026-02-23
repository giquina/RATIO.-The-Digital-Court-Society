"use client";

import { anyApi } from "convex/server";
import { useDemoQuery } from "@/hooks/useDemoSafe";

export type Plan = "free" | "premium" | "premium_plus";

export interface SubscriptionInfo {
  plan: Plan;
  isActive: boolean;
  isPremium: boolean;
  isPremiumPlus: boolean;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: number;
  isLoading: boolean;
}

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

export function useSubscription(): SubscriptionInfo {
  const sub = useDemoQuery(anyApi.subscriptions.getMySubscription);

  if (!CONVEX_URL) {
    // Demo mode — treat as premium for full feature access
    return {
      plan: "premium",
      isActive: true,
      isPremium: true,
      isPremiumPlus: false,
      isLoading: false,
    };
  }

  if (sub === undefined) {
    return {
      plan: "free",
      isActive: false,
      isPremium: false,
      isPremiumPlus: false,
      isLoading: true,
    };
  }

  const plan = (sub?.plan as Plan) || "free";
  const isActive = sub?.status === "active" || sub?.status === "trialing";

  return {
    plan,
    isActive,
    isPremium: plan === "premium" || plan === "premium_plus",
    isPremiumPlus: plan === "premium_plus",
    cancelAtPeriodEnd: sub?.cancelAtPeriodEnd,
    currentPeriodEnd: sub?.currentPeriodEnd,
    isLoading: false,
  };
}

// Feature access rules
const FEATURE_ACCESS: Record<string, Plan> = {
  ai_judge: "free", // Limited to 3/month on free
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
  const planOrder: Plan[] = ["free", "premium", "premium_plus"];
  return planOrder.indexOf(plan) >= planOrder.indexOf(required);
}
