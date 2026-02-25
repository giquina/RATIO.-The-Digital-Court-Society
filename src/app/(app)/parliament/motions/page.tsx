"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Tag, Button, EmptyState } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import {
  FileText,
  ArrowLeft,
  Plus,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  Vote,
} from "lucide-react";

// Demo data — TODO: Replace with useQuery(api.governance.legislative.listMotions)
const MOTIONS = [
  {
    id: "1",
    title: "Motion to Establish a Formal Mentorship Programme",
    proposer: "Sarah K.",
    category: "policy",
    status: "voting",
    votesAye: 24,
    votesNo: 8,
    votesAbstain: 3,
    createdAt: "2026-02-18",
  },
  {
    id: "2",
    title: "Amendment to Standing Order 7 — Debate Time Limits",
    proposer: "James M.",
    category: "procedural",
    status: "debating",
    votesAye: 0,
    votesNo: 0,
    votesAbstain: 0,
    createdAt: "2026-02-17",
  },
  {
    id: "3",
    title: "Resolution on Cross-University Moot Partnerships",
    proposer: "Amara O.",
    category: "policy",
    status: "passed",
    votesAye: 42,
    votesNo: 11,
    votesAbstain: 5,
    createdAt: "2026-02-15",
  },
  {
    id: "4",
    title: "Motion to Create Digital Review Tribunal Standing Panel",
    proposer: "Daniel R.",
    category: "constitutional",
    status: "tabled",
    votesAye: 0,
    votesNo: 0,
    votesAbstain: 0,
    createdAt: "2026-02-14",
  },
  {
    id: "5",
    title: "Motion to Prohibit Anonymous Debate Contributions",
    proposer: "Emily W.",
    category: "conduct",
    status: "defeated",
    votesAye: 15,
    votesNo: 31,
    votesAbstain: 7,
    createdAt: "2026-02-12",
  },
];

const FILTERS = ["all", "voting", "debating", "tabled", "passed", "defeated"] as const;

const STATUS_CONFIG: Record<string, { label: string; color: "gold" | "blue" | "green" | "red" | "orange" }> = {
  draft: { label: "Draft", color: "blue" },
  tabled: { label: "Tabled", color: "blue" },
  seconded: { label: "Seconded", color: "blue" },
  debating: { label: "In Debate", color: "orange" },
  voting: { label: "Voting Open", color: "gold" },
  passed: { label: "Passed", color: "green" },
  defeated: { label: "Defeated", color: "red" },
  withdrawn: { label: "Withdrawn", color: "red" },
};

export default function MotionsListPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filtered = activeFilter === "all"
    ? MOTIONS
    : MOTIONS.filter((m) => m.status === activeFilter);

  return (
    <VerifiedOnly>
      <div className="pb-6 md:max-w-content-medium mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <Link
            href="/parliament"
            className="flex items-center gap-1.5 text-court-text-sec text-court-sm mb-3 hover:text-court-text transition-colors"
          >
            <ArrowLeft size={14} />
            Parliament
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-court-text">Motions</h1>
              <p className="text-court-sm text-court-text-sec mt-1">
                {MOTIONS.length} motions · {MOTIONS.filter((m) => m.status === "voting").length} open for voting
              </p>
            </div>
            <Link href="/parliament/motions/create">
              <Button size="sm">
                <span className="flex items-center gap-1.5">
                  <Plus size={14} /> Propose
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <section className="px-4 md:px-6 lg:px-8 mb-4">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-court-xs font-bold capitalize whitespace-nowrap transition-all ${
                  activeFilter === f
                    ? "bg-gold-dim text-gold border border-gold/20"
                    : "text-court-text-sec hover:bg-white/[0.04]"
                }`}
              >
                {f === "all" ? "All" : STATUS_CONFIG[f]?.label || f}
              </button>
            ))}
          </div>
        </section>

        {/* Motions List */}
        <section className="px-4 md:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <EmptyState
              icon={<FileText size={28} />}
              title="No Motions Found"
              description="No motions match the selected filter."
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((motion) => {
                const config = STATUS_CONFIG[motion.status] || STATUS_CONFIG.draft;
                const totalVotes = motion.votesAye + motion.votesNo + motion.votesAbstain;
                return (
                  <Link key={motion.id} href={`/parliament/motions/${motion.id}`}>
                    <Card className="p-4 hover:border-white/10 transition-all mb-2">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-court-base font-bold text-court-text flex-1 pr-3">
                          {motion.title}
                        </h3>
                        <Tag color={config.color} small>
                          {config.label}
                        </Tag>
                      </div>
                      <div className="flex items-center gap-3 text-court-xs text-court-text-ter mb-2">
                        <span>By {motion.proposer}</span>
                        <span className="capitalize">{motion.category}</span>
                        <span>{motion.createdAt}</span>
                      </div>
                      {totalVotes > 0 && (
                        <div className="flex gap-3 text-court-xs">
                          <span className="text-green-400 flex items-center gap-1">
                            <CheckCircle2 size={12} /> {motion.votesAye}
                          </span>
                          <span className="text-red-400 flex items-center gap-1">
                            <XCircle size={12} /> {motion.votesNo}
                          </span>
                          <span className="text-court-text-ter">
                            Abstain {motion.votesAbstain}
                          </span>
                        </div>
                      )}
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </VerifiedOnly>
  );
}
