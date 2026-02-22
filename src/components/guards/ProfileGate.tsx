"use client";

import { useRouter } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";
import { useAuthStore, getProfileCompletion } from "@/stores/authStore";

/**
 * Wrap any page/section that requires a completed profile.
 * Shows a locked overlay when the profile is incomplete.
 */
export function ProfileGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const { isComplete } = getProfileCompletion(profile);

  if (isComplete) return <>{children}</>;

  return (
    <div className="relative min-h-[60vh]">
      {/* Blurred / dimmed content behind */}
      <div className="pointer-events-none select-none opacity-20 blur-[2px]">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-navy-card border border-court-border rounded-court p-8 max-w-sm mx-4 text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-gold-dim flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-gold" />
          </div>
          <h2 className="font-serif text-xl font-bold text-court-text mb-2">
            Feature Locked
          </h2>
          <p className="text-sm text-court-text-sec mb-6 leading-relaxed">
            Complete your Advocate profile to unlock this feature. It only takes a moment.
          </p>
          <button
            onClick={() => router.push("/onboarding")}
            className="w-full bg-gold text-navy font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 hover:bg-gold/90 transition-colors"
          >
            Complete Profile
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Small banner shown at top of pages when profile is incomplete.
 * Dismissible per session.
 */
export function ProfileCompletionBanner() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const profileSkipped = useAuthStore((s) => s.profileSkipped);
  const { percentage, isComplete } = getProfileCompletion(profile);

  if (isComplete || !profileSkipped) return null;

  return (
    <div className="bg-gold-dim border border-gold/20 rounded-xl mx-4 mt-3 mb-1 p-3 flex items-center gap-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
          <span className="text-gold text-xs font-bold">{percentage}%</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-court-text">Profile incomplete</p>
        <p className="text-xs text-court-text-sec">Complete your profile to unlock all features.</p>
      </div>
      <button
        onClick={() => router.push("/onboarding")}
        className="flex-shrink-0 text-xs font-bold text-gold px-3 py-1.5 border border-gold/30 rounded-lg hover:bg-gold/10 transition-colors"
      >
        Finish
      </button>
    </div>
  );
}
