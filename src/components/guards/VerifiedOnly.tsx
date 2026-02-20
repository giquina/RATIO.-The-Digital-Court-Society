"use client";

import { useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { Shield, AlertTriangle, ArrowRight } from "lucide-react";

// TODO: Replace with real verification check from Convex auth/profile
// For now, this uses a simple prop-based approach
// In production, wrap with useQuery(api.profiles.getMyVerification)

interface VerifiedOnlyProps {
  children: React.ReactNode;
  isVerified?: boolean;
  isExpired?: boolean;
  fallbackMessage?: string;
}

export function VerifiedOnly({
  children,
  isVerified = true, // Default to true for development — flip when auth is wired
  isExpired = false,
  fallbackMessage,
}: VerifiedOnlyProps) {
  const router = useRouter();

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-400/10 flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-orange-400" />
        </div>
        <h3 className="font-serif text-lg font-bold text-court-text mb-2">
          Verification Expired
        </h3>
        <p className="text-sm text-court-text-ter mb-6 max-w-xs">
          Your student verification has expired. Please re-verify to continue
          accessing governance features.
        </p>
        <Button onClick={() => router.push("/verify")}>
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
        <p className="text-sm text-court-text-ter mb-2 max-w-xs">
          {fallbackMessage ||
            "This feature is available only to verified UK law students."}
        </p>
        <Card className="p-4 text-left mb-6 max-w-sm w-full">
          <p className="text-court-xs text-court-text-sec leading-relaxed">
            Ratio is a constitutional institution. Governance features — including
            parliamentary motions, voting, and tribunal proceedings — require
            verified student status to maintain institutional integrity.
          </p>
        </Card>
        <Button onClick={() => router.push("/verify")}>
          <span className="flex items-center gap-2">
            Verify Your Status <ArrowRight size={14} />
          </span>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
