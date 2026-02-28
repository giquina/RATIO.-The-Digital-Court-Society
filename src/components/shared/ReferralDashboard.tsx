"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  UserPlus, Copy, Check, Share2, ExternalLink,
  Gift, Clock, AlertTriangle, ChevronDown, ChevronUp,
} from "lucide-react";
import { REFERRAL } from "@/lib/constants/app";
import { courtToast } from "@/lib/utils/toast";
import { analytics } from "@/lib/analytics";

export function ReferralDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const info: any = useQuery(anyApi.referrals.myReferralInfo);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activity: any[] | undefined = useQuery(anyApi.referrals.myReferralActivity);
  const ensureHandle = useMutation(anyApi.referrals.ensureHandle);
  const createReferral = useMutation(anyApi.referrals.createReferral);

  const [copied, setCopied] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [generating, setGenerating] = useState(false);

  if (info === undefined) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-white/[0.04] rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }
  if (!info) return null;

  const referralUrl = info.handle
    ? `${REFERRAL.SITE_URL}/join/${info.handle}`
    : null;

  const handleGenerateLink = async () => {
    setGenerating(true);
    try {
      await ensureHandle();
      courtToast.success("Referral link generated");
    } catch {
      courtToast.error("Could not generate referral link");
    }
    setGenerating(false);
  };

  const handleCopyLink = async () => {
    if (!referralUrl) return;
    try {
      await createReferral();
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      courtToast.success("Link copied to clipboard");
      analytics.referralLinkCopied();
      setTimeout(() => setCopied(false), 3000);
    } catch {
      courtToast.error("Could not copy link");
    }
  };

  const handleWhatsApp = async () => {
    if (!info.handle) return;
    try {
      await createReferral();
      analytics.referralLinkShared("whatsapp");
      const message = REFERRAL.WHATSAPP_MESSAGE(info.handle);
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } catch {
      courtToast.error("Could not create invite");
    }
  };

  const progressPercent = Math.min(
    (info.activated / REFERRAL.REWARD_CAP_TERM) * 100,
    100
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-court-md font-bold text-court-text">
          Invite to the Bar
        </h3>
        <span className="text-court-xs text-court-text-ter">
          {info.activated}/{REFERRAL.REWARD_CAP_TERM} this term
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Invited", value: info.totalReferrals, color: "text-court-text" },
          { label: "Joined", value: info.signedUp + info.activated, color: "text-gold" },
          { label: "Rewards", value: info.unredeemedRewards, color: "text-emerald-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-3 text-center"
          >
            <p className={`text-court-md font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-court-text-ter mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Share actions */}
      {!referralUrl ? (
        <button
          onClick={handleGenerateLink}
          disabled={generating}
          className="w-full flex items-center justify-center gap-2 bg-gold text-navy-mid font-semibold text-court-sm py-3 rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          <UserPlus size={16} />
          {generating ? "Generating..." : "Generate Referral Link"}
        </button>
      ) : (
        <div className="space-y-2">
          {/* Link display */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5">
            <span className="flex-1 text-court-xs text-court-text-sec truncate font-mono">
              {referralUrl.replace("https://", "")}
            </span>
            <button
              onClick={handleCopyLink}
              disabled={!info.canInvite}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-gold/10 text-gold hover:bg-gold/20 transition-colors disabled:opacity-40"
              aria-label="Copy referral link"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCopyLink}
              disabled={!info.canInvite}
              className="flex-1 flex items-center justify-center gap-1.5 bg-navy-light border border-court-border text-court-text-sec font-semibold text-court-xs py-2.5 rounded-xl hover:text-court-text transition-colors disabled:opacity-40"
            >
              <Copy size={13} />
              Copy Link
            </button>
            <button
              onClick={handleWhatsApp}
              disabled={!info.canInvite}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gold/10 border border-gold/20 text-gold font-semibold text-court-xs py-2.5 rounded-xl hover:bg-gold/15 transition-colors disabled:opacity-40"
            >
              <Share2 size={13} />
              Share
            </button>
          </div>

          {/* Velocity warning */}
          {!info.canInvite && (
            <div className="flex items-start gap-2 p-2.5 bg-gold/[0.06] border border-gold/10 rounded-lg">
              <AlertTriangle size={13} className="text-gold shrink-0 mt-0.5" />
              <p className="text-[10px] text-court-text-sec leading-relaxed">
                Weekly invite limit reached ({info.invitesThisWeek}/{info.inviteCapWeekly}).
                Limits reset on a rolling 7-day basis.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Unredeemed rewards */}
      {info.rewards.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-court-xs font-semibold text-court-text flex items-center gap-1.5">
            <Gift size={13} className="text-gold" />
            Available Rewards
          </h4>
          {info.rewards.map((reward: any) => {
            const meta =
              REFERRAL.REWARD_TYPES[
                reward.type as keyof typeof REFERRAL.REWARD_TYPES
              ];
            return (
              <div
                key={reward.id}
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Gift size={14} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-court-xs font-semibold text-court-text">
                    {meta?.label ?? reward.type}
                  </p>
                  <p className="text-[10px] text-court-text-ter flex items-center gap-1">
                    <Clock size={9} />
                    Expires {new Date(reward.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Activity toggle */}
      {activity && activity.length > 0 && (
        <div>
          <button
            onClick={() => setShowActivity(!showActivity)}
            aria-expanded={showActivity}
            className="w-full flex items-center justify-between min-h-[44px] py-2 text-court-xs text-court-text-sec hover:text-court-text transition-colors"
          >
            <span className="font-semibold">Recent Activity</span>
            {showActivity ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
          {showActivity && (
            <div className="space-y-1.5 mt-1">
              {activity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02]"
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      item.status === "activated"
                        ? "bg-emerald-400"
                        : item.status === "signed_up"
                          ? "bg-gold"
                          : item.status === "flagged"
                            ? "bg-red-400"
                            : "bg-court-text-ter"
                    }`}
                  />
                  <span className="flex-1 text-court-xs text-court-text-sec truncate">
                    {item.displayName}
                  </span>
                  <span className="text-[10px] text-court-text-ter capitalize">
                    {item.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Terms link */}
      <p className="text-[10px] text-court-text-ter text-center pt-2 border-t border-white/[0.04]">
        <a
          href="/referral-terms"
          className="text-gold/50 hover:text-gold/70 inline-flex items-center gap-0.5"
        >
          Referral Terms
          <ExternalLink size={8} />
        </a>
      </p>
    </div>
  );
}
