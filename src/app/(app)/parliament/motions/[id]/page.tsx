"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Tag, Button, Avatar, EmptyState } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  MessageCircle,
  FileText,
  Users,
  Vote,
  Loader2,
} from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: "gold" | "blue" | "green" | "red" | "orange" }> = {
  draft: { label: "Draft", color: "blue" },
  tabled: { label: "Tabled", color: "blue" },
  seconded: { label: "Seconded", color: "blue" },
  debating: { label: "In Debate", color: "orange" },
  voting: { label: "Voting Open", color: "gold" },
  passed: { label: "Passed", color: "green" },
  defeated: { label: "Defeated", color: "red" },
  withdrawn: { label: "Withdrawn", color: "red" },
};

export default function MotionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const motion: any = useQuery(anyApi.governance.legislative.getMotionById, { motionId: id as any });
  const profile: any = useQuery(anyApi.users.myProfile);
  const castVote = useMutation(anyApi.governance.legislative.castVote);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [voting, setVoting] = useState(false);

  if (motion === undefined) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-court-text-ter" />
      </div>
    );
  }

  if (motion === null) {
    return (
      <div className="px-4 py-20">
        <EmptyState message="Motion not found." />
      </div>
    );
  }

  const totalVotes = (motion.votesAye ?? 0) + (motion.votesNo ?? 0) + (motion.votesAbstain ?? 0);
  const quorumRequired = motion.quorumRequired ?? 20;
  const quorumMet = totalVotes >= quorumRequired;
  const statusInfo = STATUS_MAP[motion.status] || STATUS_MAP.draft;
  const debates = motion.debates ?? [];

  const handleVote = async (vote: string) => {
    if (userVote || voting || !profile?._id) return;
    setVoting(true);
    try {
      await castVote({ motionId: id as any, profileId: profile._id, vote });
      setUserVote(vote);
    } catch {
      // Already voted or other error
    } finally {
      setVoting(false);
    }
  };

  return (
    <VerifiedOnly>
      <div className="pb-6 md:max-w-content-narrow mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <Link
            href="/parliament/motions"
            className="flex items-center gap-1.5 text-court-text-sec text-court-sm mb-3 hover:text-court-text transition-colors"
          >
            <ArrowLeft size={14} />
            Motions
          </Link>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-serif text-xl font-bold text-court-text">
              {motion.title}
            </h1>
            <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
          </div>
          <div className="flex items-center gap-3 mt-2 text-court-xs text-court-text-ter">
            <span>
              Proposed by{" "}
              <span className="text-court-text font-semibold">{motion.proposer?.fullName ?? "Unknown"}</span>
            </span>
            <span>·</span>
            <span className="capitalize">{motion.category}</span>
            <span>·</span>
            <span>{motion._creationTime ? new Date(motion._creationTime).toLocaleDateString("en-GB") : ""}</span>
          </div>
          {motion.seconder && (
            <p className="text-court-xs text-court-text-ter mt-1">
              Seconded by{" "}
              <span className="text-court-text font-semibold">{motion.seconder?.fullName ?? "Unknown"}</span>
            </p>
          )}
        </div>

        {/* Voting Section */}
        {motion.status === "voting" && (
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <Card className="p-5" highlight>
            <h2 className="font-serif text-base font-bold text-court-text mb-3">
              Cast Your Vote
            </h2>

            {userVote ? (
              <div className="text-center py-4">
                <CheckCircle2 size={24} className="text-green-400 mx-auto mb-2" />
                <p className="text-court-sm font-bold text-court-text">
                  Vote recorded: <span className="capitalize text-gold">{userVote}</span>
                </p>
                <p className="text-court-xs text-court-text-ter mt-1">
                  Your vote is final and cannot be changed.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleVote("aye")}
                  disabled={voting}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-green-400/20 bg-green-400/5 hover:bg-green-400/10 transition-all"
                >
                  <CheckCircle2 size={22} className="text-green-400" />
                  <span className="text-court-sm font-bold text-green-400">Aye</span>
                </button>
                <button
                  onClick={() => handleVote("no")}
                  disabled={voting}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-all"
                >
                  <XCircle size={22} className="text-red-400" />
                  <span className="text-court-sm font-bold text-red-400">No</span>
                </button>
                <button
                  onClick={() => handleVote("abstain")}
                  disabled={voting}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                >
                  <MinusCircle size={22} className="text-court-text-ter" />
                  <span className="text-court-sm font-bold text-court-text-ter">Abstain</span>
                </button>
              </div>
            )}

            {/* Vote Tally */}
            <div className="mt-4 pt-4 border-t border-court-border">
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-white/[0.04] mb-2">
                {totalVotes > 0 && (
                  <>
                    <div
                      className="bg-green-400 rounded-l-full transition-all"
                      style={{ width: `${((motion.votesAye ?? 0) / totalVotes) * 100}%` }}
                    />
                    <div
                      className="bg-red-400 transition-all"
                      style={{ width: `${((motion.votesNo ?? 0) / totalVotes) * 100}%` }}
                    />
                    <div
                      className="bg-white/20 rounded-r-full transition-all"
                      style={{ width: `${((motion.votesAbstain ?? 0) / totalVotes) * 100}%` }}
                    />
                  </>
                )}
              </div>
              <div className="flex justify-between text-court-xs">
                <span className="text-green-400 font-bold">Aye {motion.votesAye ?? 0}</span>
                <span className="text-red-400 font-bold">No {motion.votesNo ?? 0}</span>
                <span className="text-court-text-ter">Abstain {motion.votesAbstain ?? 0}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-court-xs text-court-text-ter">
                  Quorum: {totalVotes}/{quorumRequired}{" "}
                  {quorumMet ? (
                    <span className="text-green-400">(met)</span>
                  ) : (
                    <span className="text-orange-400">(not met)</span>
                  )}
                </span>
                {motion.votingDeadline && (
                <span className="text-court-xs text-orange-400 flex items-center gap-1">
                  <Clock size={12} />
                  Closes{" "}
                  {new Date(motion.votingDeadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                )}
              </div>
            </div>
          </Card>
        </section>
        )}

        {/* IRAC Content */}
        <section className="px-4 md:px-6 lg:px-8 mb-5 space-y-3">
          <h2 className="font-serif text-base font-bold text-court-text flex items-center gap-2">
            <FileText size={16} className="text-gold" />
            Motion Text
          </h2>

          {(
            [
              ["Issue", motion.issue],
              ["Rule", motion.rule],
              ["Application", motion.application],
              ["Conclusion", motion.conclusion],
            ] as const
          ).map(([label, content]) => (
            <Card key={label} className="p-4">
              <h3 className="text-court-sm font-bold text-gold mb-1.5">{label}</h3>
              <p className="text-court-sm text-court-text-sec leading-relaxed">{content}</p>
            </Card>
          ))}
        </section>

        {/* Debate */}
        <section className="px-4 md:px-6 lg:px-8">
          <h2 className="font-serif text-base font-bold text-court-text flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-gold" />
            Debate ({debates.length} contributions)
          </h2>

          {debates.length === 0 ? (
            <EmptyState message="No debate contributions yet." />
          ) : (
          <div className="space-y-2">
            {debates.map((entry: any) => (
              <Card key={entry._id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={entry.speaker?.fullName ?? "Unknown"} chamber={entry.speaker?.chamber ?? ""} size="sm" />
                  <div>
                    <span className="text-court-sm font-bold text-court-text">
                      {entry.speaker?.fullName ?? "Unknown"}
                    </span>
                    <span className="text-court-xs text-court-text-ter ml-2">
                      {entry.speaker?.chamber ?? ""} Chamber
                    </span>
                  </div>
                  <Tag
                    color={entry.position === "for" ? "green" : "red"}
                    small
                  >
                    {entry.position === "for" ? "For" : "Against"}
                  </Tag>
                </div>
                <p className="text-court-sm text-court-text-sec leading-relaxed">
                  {entry.content}
                </p>
              </Card>
            ))}
          </div>
          )}
        </section>
      </div>
    </VerifiedOnly>
  );
}
