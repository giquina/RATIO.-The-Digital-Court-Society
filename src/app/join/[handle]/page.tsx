"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Scale, GraduationCap, Shield, Trophy, Users, ArrowRight } from "lucide-react";
import { CHAMBER_COLORS } from "@/lib/constants/app";
import { QuerySafeBoundary } from "@/components/shared/QuerySafeBoundary";

function JoinPageContent() {
  const params = useParams();
  const handle = params.handle as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const referrer: any = useQuery(anyApi.referrals.getReferrerByHandle, { handle });

  // Loading state
  if (referrer === undefined) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  // Invalid handle
  if (referrer === null) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">
        <Scale size={48} className="text-gold/40 mb-4" />
        <h1 className="font-serif text-xl font-bold text-court-text mb-2">
          Invitation Not Found
        </h1>
        <p className="text-court-text-sec text-court-sm text-center max-w-sm mb-6">
          This referral link may have expired or is no longer valid. You can still join Ratio directly.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-gold text-navy-mid font-semibold text-court-sm px-6 py-3 rounded-xl hover:bg-gold/90 transition-colors"
        >
          Join as an Advocate
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const chamberColor = referrer.chamber
    ? CHAMBER_COLORS[referrer.chamber] || "#C9A84C"
    : "#C9A84C";

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-center py-6">
        <Link href="/" className="flex items-center gap-2">
          <Scale size={20} className="text-gold" />
          <span className="font-serif text-lg font-bold tracking-wider text-court-text">
            RATIO.
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-sm">
          {/* Referrer card */}
          <div className="bg-navy-card border border-court-border rounded-court p-6 mb-6">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-serif font-bold text-white border-2"
                style={{
                  backgroundColor: `${chamberColor}30`,
                  borderColor: chamberColor,
                }}
              >
                {referrer.fullName.charAt(0)}
              </div>
            </div>

            {/* Name & rank */}
            <h2 className="font-serif text-lg font-bold text-court-text text-center">
              {referrer.fullName}
            </h2>
            <p className="text-court-text-sec text-court-xs text-center mt-0.5">
              {referrer.rank}
            </p>

            {/* University & Chamber */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-court-xs text-court-text-ter">
                <GraduationCap size={12} />
                {referrer.universityShort}
              </span>
              {referrer.chamber && (
                <span className="flex items-center gap-1 text-court-xs text-court-text-ter">
                  <Shield size={12} style={{ color: chamberColor }} />
                  {referrer.chamber}
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-court-border">
              <div className="text-center">
                <p className="text-court-sm font-bold text-court-text">
                  {referrer.totalMoots}
                </p>
                <p className="text-[10px] text-court-text-ter">Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-court-sm font-bold text-court-text">
                  {referrer.referralCount}
                </p>
                <p className="text-[10px] text-court-text-ter">Referrals</p>
              </div>
            </div>

            {/* Invitation message */}
            <div className="mt-5 p-3 bg-gold/[0.06] border border-gold/10 rounded-lg">
              <p className="text-court-xs text-court-text-sec text-center leading-relaxed">
                <span className="font-semibold text-court-text">
                  {referrer.fullName.split(" ")[0]}
                </span>{" "}
                invites you to join Ratio — the digital court society for the
                UK legal community.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={`/register?ref=${handle}`}
            className="w-full flex items-center justify-center gap-2 bg-gold text-navy-mid font-semibold text-court-md py-3.5 rounded-xl hover:bg-gold/90 transition-colors"
          >
            Join as an Advocate
            <ArrowRight size={18} />
          </Link>

          {/* Benefits */}
          <div className="mt-6 space-y-3">
            {[
              { icon: Scale, text: "Practice mooting with peers from any UK university" },
              { icon: Trophy, text: "Track your advocacy skills and climb the rankings" },
              { icon: Users, text: "Join a Chamber and build your professional network" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <item.icon size={14} className="text-gold shrink-0 mt-0.5" />
                <p className="text-court-xs text-court-text-sec leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Reward notice */}
          <p className="text-[10px] text-court-text-ter text-center mt-6 leading-relaxed">
            Both you and {referrer.fullName.split(" ")[0]} will receive a reward
            after you complete your first session.{" "}
            <Link
              href="/referral-terms"
              className="text-gold/60 hover:text-gold/80 underline"
            >
              Terms apply
            </Link>
          </p>

          {/* Already have an account */}
          <p className="text-court-xs text-court-text-ter text-center mt-4">
            Already an Advocate?{" "}
            <Link href="/login" className="text-gold hover:text-gold/80">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function JoinPage() {
  return (
    <QuerySafeBoundary
      fallback={
        <div className="min-h-screen bg-navy flex flex-col items-center justify-center px-6">
          <Scale size={48} className="text-gold/40 mb-4" />
          <h1 className="font-serif text-xl font-bold text-court-text mb-2">Invitation</h1>
          <p className="text-court-text-sec text-court-sm text-center max-w-sm mb-6">
            Something went wrong loading this invitation. You can still join Ratio directly.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-gold text-navy-mid font-semibold text-court-sm px-6 py-3 rounded-xl">
            Join as an Advocate <ArrowRight size={16} />
          </Link>
        </div>
      }
    >
      <JoinPageContent />
    </QuerySafeBoundary>
  );
}
