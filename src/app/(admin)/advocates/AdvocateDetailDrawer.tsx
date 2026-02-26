"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  X,
  Mail,
  Shield,
  Star,
  GraduationCap,
  Scale,
  Crown,
  Trophy,
  Send,
  Loader2,
  ChevronDown,
  Check,
  Clock,
  Users as UsersIcon,
  Flame,
  Target,
} from "lucide-react";

const RANKS = [
  "Pupil",
  "Junior Counsel",
  "Senior Counsel",
  "King's Counsel",
  "Bencher",
] as const;

type Rank = (typeof RANKS)[number];

interface AdvocateDetailDrawerProps {
  profileId: string | null;
  onClose: () => void;
}

function getRankIcon(rank: string) {
  switch (rank) {
    case "Pupil":
      return <GraduationCap className="h-3.5 w-3.5" />;
    case "Junior Counsel":
      return <Scale className="h-3.5 w-3.5" />;
    case "Senior Counsel":
      return <Shield className="h-3.5 w-3.5" />;
    case "King's Counsel":
      return <Crown className="h-3.5 w-3.5" />;
    case "Bencher":
      return <Star className="h-3.5 w-3.5" />;
    default:
      return <Scale className="h-3.5 w-3.5" />;
  }
}

function formatDate(timestamp: number | string | undefined) {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdvocateDetailDrawer({
  profileId,
  onClose,
}: AdvocateDetailDrawerProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [rankDropdownOpen, setRankDropdownOpen] = useState(false);

  const detail = useQuery(
    anyApi.admin.getAdvocateDetail,
    profileId ? { profileId } : "skip"
  );

  const updateProfile = useMutation(anyApi.admin.updateAdvocateProfile);
  const sendEmail = useMutation(anyApi.admin.sendAdminEmail);

  if (!profileId) return null;

  const isLoading = detail === undefined;

  const handleToggleAmbassador = async () => {
    if (!detail) return;
    await updateProfile({
      profileId,
      isAmbassador: !detail.isAmbassador,
    });
  };

  const handleRankChange = async (rank: Rank) => {
    await updateProfile({
      profileId,
      rank,
    });
    setRankDropdownOpen(false);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) return;
    setEmailSending(true);
    try {
      await sendEmail({
        profileId,
        subject: emailSubject,
        message: emailMessage,
      });
      setEmailSent(true);
      setEmailSubject("");
      setEmailMessage("");
      setTimeout(() => setEmailSent(false), 3000);
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-[400px] overflow-y-auto border-l border-court-border bg-navy shadow-2xl transition-transform duration-300 ease-in-out">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : !detail ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-court-text-sec text-court-sm">
              Advocate not found.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* ─── Header ─── */}
            <div className="flex items-start gap-3 border-b border-court-border p-5">
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold font-serif text-lg uppercase">
                {detail.name
                  ? detail.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)
                  : "??"}
              </div>

              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <h2 className="font-serif text-lg font-semibold text-court-text truncate">
                  {detail.name || "Unknown Advocate"}
                </h2>
                <div className="flex flex-wrap items-center gap-2">
                  {/* Rank badge */}
                  <span className="inline-flex items-center gap-1 rounded-court bg-gold/10 px-2 py-0.5 text-court-xs font-medium text-gold">
                    {getRankIcon(detail.rank)}
                    {detail.rank || "Unranked"}
                  </span>
                  {/* Plan badge */}
                  {detail.plan && (
                    <span className="inline-flex items-center gap-1 rounded-court bg-gold/5 px-2 py-0.5 text-court-xs font-medium text-court-text-sec border border-court-border">
                      {detail.plan}
                    </span>
                  )}
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="shrink-0 rounded-court p-1.5 text-court-text-ter hover:bg-gold/10 hover:text-court-text transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ─── Quick Actions Row ─── */}
            <div className="flex items-center gap-2 border-b border-court-border px-5 py-3">
              {/* Email button */}
              <button
                onClick={() => {
                  setShowEmailForm((prev) => !prev);
                  setEmailSent(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-court border border-court-border bg-navy-card px-3 py-1.5 text-court-xs font-medium text-court-text hover:bg-gold/10 hover:text-gold transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Email
              </button>

              {/* Toggle Ambassador */}
              <button
                onClick={handleToggleAmbassador}
                className={`inline-flex items-center gap-1.5 rounded-court border px-3 py-1.5 text-court-xs font-medium transition-colors ${
                  detail.isAmbassador
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-court-border bg-navy-card text-court-text-sec hover:bg-gold/10 hover:text-gold"
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                {detail.isAmbassador ? "Ambassador" : "Make Ambassador"}
              </button>

              {/* Rank dropdown */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setRankDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 rounded-court border border-court-border bg-navy-card px-3 py-1.5 text-court-xs font-medium text-court-text-sec hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  {getRankIcon(detail.rank)}
                  <span className="max-w-[80px] truncate">
                    {detail.rank || "Rank"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {rankDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setRankDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-xl border border-court-border bg-navy-card py-1 shadow-lg">
                      {RANKS.map((rank) => (
                        <button
                          key={rank}
                          onClick={() => handleRankChange(rank)}
                          className={`flex w-full items-center gap-2 px-3 py-2 text-court-xs transition-colors ${
                            detail.rank === rank
                              ? "bg-gold/10 text-gold"
                              : "text-court-text-sec hover:bg-gold/5 hover:text-court-text"
                          }`}
                        >
                          {getRankIcon(rank)}
                          <span>{rank}</span>
                          {detail.rank === rank && (
                            <Check className="ml-auto h-3 w-3 text-gold" />
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ─── Info Section ─── */}
            <div className="border-b border-court-border px-5 py-4">
              <h3 className="mb-3 font-serif text-court-sm font-semibold text-court-text">
                Information
              </h3>
              <dl className="space-y-2.5">
                {/* Email */}
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-court-xs text-court-text-ter">Email</dt>
                  <dd className="text-right text-court-xs text-court-text">
                    {detail.email ? (
                      <a
                        href={`mailto:${detail.email}`}
                        className="text-gold hover:underline"
                      >
                        {detail.email}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>

                {/* University + Year */}
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-court-xs text-court-text-ter">
                    University
                  </dt>
                  <dd className="text-right text-court-xs text-court-text">
                    {detail.university || "N/A"}
                    {detail.year ? ` (${detail.year})` : ""}
                  </dd>
                </div>

                {/* User Type */}
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-court-xs text-court-text-ter">Type</dt>
                  <dd className="text-right text-court-xs text-court-text capitalize">
                    {detail.userType || "N/A"}
                  </dd>
                </div>

                {/* Chamber */}
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-court-xs text-court-text-ter">Chamber</dt>
                  <dd className="text-right text-court-xs text-court-text">
                    {detail.chamber || "N/A"}
                  </dd>
                </div>

                {/* Joined date */}
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-court-xs text-court-text-ter">Joined</dt>
                  <dd className="text-right text-court-xs text-court-text">
                    {formatDate(detail.joinedAt)}
                  </dd>
                </div>

                {/* Last active */}
                <div className="flex items-start justify-between gap-2">
                  <dt className="text-court-xs text-court-text-ter">
                    Last Active
                  </dt>
                  <dd className="text-right text-court-xs text-court-text">
                    {formatDate(detail.lastActiveAt)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* ─── Stats Grid (2x3) ─── */}
            <div className="border-b border-court-border px-5 py-4">
              <h3 className="mb-3 font-serif text-court-sm font-semibold text-court-text">
                Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {/* Total Moots */}
                <div className="rounded-xl border border-court-border bg-navy-card p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-court-text-ter">
                    <Trophy className="h-3.5 w-3.5" />
                    <span className="text-court-xs">Total Moots</span>
                  </div>
                  <p className="font-serif text-lg font-semibold text-court-text">
                    {detail.totalMoots ?? 0}
                  </p>
                </div>

                {/* Total Points */}
                <div className="rounded-xl border border-court-border bg-navy-card p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-court-text-ter">
                    <Star className="h-3.5 w-3.5" />
                    <span className="text-court-xs">Total Points</span>
                  </div>
                  <p className="font-serif text-lg font-semibold text-gold">
                    {detail.totalPoints ?? 0}
                  </p>
                </div>

                {/* Total Hours */}
                <div className="rounded-xl border border-court-border bg-navy-card p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-court-text-ter">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-court-xs">Total Hours</span>
                  </div>
                  <p className="font-serif text-lg font-semibold text-court-text">
                    {detail.totalHours ?? 0}
                  </p>
                </div>

                {/* Streak Days */}
                <div className="rounded-xl border border-court-border bg-navy-card p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-court-text-ter">
                    <Flame className="h-3.5 w-3.5" />
                    <span className="text-court-xs">Streak Days</span>
                  </div>
                  <p className="font-serif text-lg font-semibold text-court-text">
                    {detail.streakDays ?? 0}
                  </p>
                </div>

                {/* Followers */}
                <div className="rounded-xl border border-court-border bg-navy-card p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-court-text-ter">
                    <UsersIcon className="h-3.5 w-3.5" />
                    <span className="text-court-xs">Followers</span>
                  </div>
                  <p className="font-serif text-lg font-semibold text-court-text">
                    {detail.followers ?? 0}
                  </p>
                </div>

                {/* Readiness Score */}
                <div className="rounded-xl border border-court-border bg-navy-card p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-court-text-ter">
                    <Target className="h-3.5 w-3.5" />
                    <span className="text-court-xs">Readiness</span>
                  </div>
                  <p className="font-serif text-lg font-semibold text-court-text">
                    {detail.readinessScore != null
                      ? `${detail.readinessScore}%`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Email Form (collapsible) ─── */}
            {showEmailForm && (
              <div className="border-b border-court-border px-5 py-4">
                <h3 className="mb-3 font-serif text-court-sm font-semibold text-court-text">
                  Send Email
                </h3>

                <div className="space-y-3">
                  {/* Subject */}
                  <div>
                    <label className="mb-1 block text-court-xs text-court-text-ter">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject..."
                      className="w-full rounded-court border border-court-border bg-navy px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-1 block text-court-xs text-court-text-ter">
                      Message
                    </label>
                    <textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={5}
                      className="w-full resize-none rounded-court border border-court-border bg-navy px-3 py-2 text-court-sm text-court-text placeholder:text-court-text-ter focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>

                  {/* Send button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSendEmail}
                      disabled={
                        emailSending ||
                        !emailSubject.trim() ||
                        !emailMessage.trim()
                      }
                      className="inline-flex items-center gap-1.5 rounded-court bg-gold px-4 py-2 text-court-xs font-semibold text-navy transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {emailSending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      {emailSending ? "Sending..." : "Send Email"}
                    </button>

                    {emailSent && (
                      <span className="inline-flex items-center gap-1 text-court-xs text-green-400">
                        <Check className="h-3.5 w-3.5" />
                        Sent successfully
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
