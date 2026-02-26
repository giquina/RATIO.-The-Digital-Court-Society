"use client";

import { useAuthStore } from "@/stores/authStore";
import { Card, Button } from "@/components/ui";
import { Shield, AlertTriangle, ArrowRight } from "lucide-react";

interface VerifiedOnlyProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

export function VerifiedOnly({ children, fallbackMessage }: VerifiedOnlyProps) {
  const profile = useAuthStore((s) => s.profile);

  const isVerified = profile?.isVerified ?? false;
  const isExpired = profile?.verificationStatus === "expired";

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-400/10 flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-orange-400" />
        </div>
        <h3 className="font-serif text-lg font-bold text-court-text mb-2">
          Verification Expired
        </h3>
        <p className="text-court-base text-court-text-ter mb-6 max-w-xs">
          Your student verification has expired. Please re-verify to continue
          accessing institutional features.
        </p>
        <Button onClick={() => { window.location.href = "/verify"; }}>
          <span className="flex items-center gap-2">
            Re-verify Now <ArrowRight size={14} />
          </span>
        </Button>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gold-dim flex items-center justify-center mb-4">
          <Shield size={28} className="text-gold" />
        </div>
        <h3 className="font-serif text-lg font-bold text-court-text mb-2">
          Verification Required
        </h3>
        <p className="text-court-base text-court-text-ter mb-2 max-w-xs">
          {fallbackMessage ||
            "This feature is available to verified Advocates. Verify your university email to unlock it."}
        </p>
        <Card className="p-4 text-left mb-6 max-w-sm w-full">
          <p className="text-court-xs text-court-text-sec leading-relaxed">
            Verified Advocates gain access to Chambers, Rankings, Tournaments,
            Parliament voting, and Tribunal proceedings. Verify your .ac.uk
            email to confirm your university status.
          </p>
        </Card>
        <Button onClick={() => { window.location.href = "/verify"; }}>
          <span className="flex items-center gap-2">
            Verify Your Status <ArrowRight size={14} />
          </span>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
