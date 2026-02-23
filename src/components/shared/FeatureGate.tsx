"use client";

import { useSubscription, canAccess, type Plan } from "@/hooks/useSubscription";
import { Lock } from "lucide-react";
import Link from "next/link";

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Wraps content that requires a specific subscription tier.
 * Shows a locked overlay if the user's plan doesn't have access.
 */
export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { plan, isLoading } = useSubscription();

  if (isLoading) return <>{children}</>;

  if (canAccess(plan, feature)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div className="relative">
      <div className="opacity-40 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-navy/90 backdrop-blur-sm rounded-xl px-5 py-4 text-center border border-gold/20 max-w-xs">
          <Lock size={20} className="text-gold mx-auto mb-2" />
          <p className="text-court-sm font-bold text-court-text mb-1">
            Premium Feature
          </p>
          <p className="text-court-xs text-court-text-sec mb-3">
            Upgrade your plan to unlock this feature.
          </p>
          <Link
            href="/settings?tab=billing"
            className="inline-block bg-gold text-navy text-court-xs font-bold px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple hook-based check for inline usage.
 * Returns true if the user can access the feature.
 */
export function usePremiumCheck(feature: string): { allowed: boolean; plan: Plan } {
  const { plan } = useSubscription();
  return { allowed: canAccess(plan, feature), plan };
}
