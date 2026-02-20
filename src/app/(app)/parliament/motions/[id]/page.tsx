"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Tag, Button, Avatar } from "@/components/ui";
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
} from "lucide-react";

// Demo data — TODO: Replace with useQuery(api.governance.legislative.getMotion)
const MOTION = {
  id: "1",
  title: "Motion to Establish a Formal Mentorship Programme",
  proposer: { name: "Sarah K.", chamber: "Gray's", university: "UCL" },
  secondedBy: { name: "James M.", chamber: "Lincoln's" },
  category: "policy",
  status: "voting",
  issue:
    "The platform currently lacks a formal mechanism for experienced advocates to mentor newer members. This results in inconsistent skill development and limits knowledge transfer within the community.",
  rule:
    "Under Standing Order 3(2), the Assembly may establish programmes that promote the educational mission of the Society. Article 7 of the Constitution encourages collaborative learning.",
  application:
    "The proposed mentorship programme would pair experienced advocates (10+ moots, Senior Counsel rank or above) with newer members on a voluntary basis. This directly serves the educational mission by creating structured knowledge transfer pathways.",
  conclusion:
    "This House resolves to establish a Formal Mentorship Programme, administered by the Education Committee, with matching commencing within 30 days of this motion passing.",
  votesAye: 24,
  votesNo: 8,
  votesAbstain: 3,
  quorumRequired: 20,
  votingDeadline: "2026-02-22T18:00:00Z",
  createdAt: "2026-02-18",
};

const DEBATE_ENTRIES = [
  {
    id: "d1",
    speaker: "Amara O.",
    chamber: "Inner",
    position: "for",
    content:
      "I rise in support of this motion. The current ad hoc mentorship approach has led to uneven development across chambers. A structured programme would ensure all members have equal access to guidance from experienced advocates.",
  },
  {
    id: "d2",
    speaker: "Daniel R.",
    chamber: "Middle",
    position: "against",
    content:
      "While the intention is commendable, I have concerns about the administrative burden this would place on the Education Committee. The motion does not specify how mentors would be selected or what happens if the programme is undersubscribed.",
  },
  {
    id: "d3",
    speaker: "Emily W.",
    chamber: "Gray's",
    position: "for",
    content:
      "Addressing the honourable member's concern: the motion deliberately leaves implementation details to the Committee, which is the appropriate body to determine such matters. The principle is sound and should be supported.",
  },
];

export default function MotionDetailPage() {
  const [userVote, setUserVote] = useState<string | null>(null);
  const totalVotes = MOTION.votesAye + MOTION.votesNo + MOTION.votesAbstain;
  const quorumMet = totalVotes >= MOTION.quorumRequired;

  const handleVote = (vote: string) => {
    if (userVote) return; // Already voted
    setUserVote(vote);
    // TODO: Call useMutation(api.governance.legislative.castVote)
  };

  return (
    <VerifiedOnly>
      <div className="pb-6 md:max-w-content-narrow mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <Link
            href="/parliament/motions"
            className="flex items-center gap-1.5 text-court-text-sec text-xs mb-3 hover:text-court-text transition-colors"
          >
            <ArrowLeft size={14} />
            Motions
          </Link>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-serif text-xl font-bold text-court-text">
              {MOTION.title}
            </h1>
            <Tag color="gold">Voting Open</Tag>
          </div>
          <div className="flex items-center gap-3 mt-2 text-court-xs text-court-text-ter">
            <span>
              Proposed by{" "}
              <span className="text-court-text font-semibold">{MOTION.proposer.name}</span>
            </span>
            <span>·</span>
            <span className="capitalize">{MOTION.category}</span>
            <span>·</span>
            <span>{MOTION.createdAt}</span>
          </div>
          {MOTION.secondedBy && (
            <p className="text-court-xs text-court-text-ter mt-1">
              Seconded by{" "}
              <span className="text-court-text font-semibold">{MOTION.secondedBy.name}</span>
            </p>
          )}
        </div>

        {/* Voting Section */}
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
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-green-400/20 bg-green-400/5 hover:bg-green-400/10 transition-all"
                >
                  <CheckCircle2 size={22} className="text-green-400" />
                  <span className="text-court-sm font-bold text-green-400">Aye</span>
                </button>
                <button
                  onClick={() => handleVote("no")}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-red-400/20 bg-red-400/5 hover:bg-red-400/10 transition-all"
                >
                  <XCircle size={22} className="text-red-400" />
                  <span className="text-court-sm font-bold text-red-400">No</span>
                </button>
                <button
                  onClick={() => handleVote("abstain")}
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
                      style={{ width: `${(MOTION.votesAye / totalVotes) * 100}%` }}
                    />
                    <div
                      className="bg-red-400 transition-all"
                      style={{ width: `${(MOTION.votesNo / totalVotes) * 100}%` }}
                    />
                    <div
                      className="bg-white/20 rounded-r-full transition-all"
                      style={{ width: `${(MOTION.votesAbstain / totalVotes) * 100}%` }}
                    />
                  </>
                )}
              </div>
              <div className="flex justify-between text-court-xs">
                <span className="text-green-400 font-bold">Aye {MOTION.votesAye}</span>
                <span className="text-red-400 font-bold">No {MOTION.votesNo}</span>
                <span className="text-court-text-ter">Abstain {MOTION.votesAbstain}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-court-xs text-court-text-ter">
                  Quorum: {totalVotes}/{MOTION.quorumRequired}{" "}
                  {quorumMet ? (
                    <span className="text-green-400">(met)</span>
                  ) : (
                    <span className="text-orange-400">(not met)</span>
                  )}
                </span>
                <span className="text-court-xs text-orange-400 flex items-center gap-1">
                  <Clock size={12} />
                  Closes{" "}
                  {new Date(MOTION.votingDeadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </Card>
        </section>

        {/* IRAC Content */}
        <section className="px-4 md:px-6 lg:px-8 mb-5 space-y-3">
          <h2 className="font-serif text-base font-bold text-court-text flex items-center gap-2">
            <FileText size={16} className="text-gold" />
            Motion Text
          </h2>

          {(
            [
              ["Issue", MOTION.issue],
              ["Rule", MOTION.rule],
              ["Application", MOTION.application],
              ["Conclusion", MOTION.conclusion],
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
            Debate ({DEBATE_ENTRIES.length} contributions)
          </h2>

          <div className="space-y-2">
            {DEBATE_ENTRIES.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={entry.speaker} chamber={entry.chamber} size="sm" />
                  <div>
                    <span className="text-court-sm font-bold text-court-text">
                      {entry.speaker}
                    </span>
                    <span className="text-court-xs text-court-text-ter ml-2">
                      {entry.chamber} Chamber
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
        </section>
      </div>
    </VerifiedOnly>
  );
}
