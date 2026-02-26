"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
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
  Loader2,
} from "lucide-react";

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
  const motions: any[] | undefined = useQuery(anyApi.governance.legislative.listMotions, {});

  const filtered = motions
    ? activeFilter === "all"
      ? motions
      : motions.filter((m: any) => m.status === activeFilter)
    : undefined;

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
                {motions ? `${motions.length} motions · ${motions.filter((m: any) => m.status === "voting").length} open for voting` : "Loading..."}
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
          {filtered === undefined ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-court-text-ter" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FileText size={28} />}
              title="No Motions Found"
              description="No motions match the selected filter."
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((motion: any) => {
                const config = STATUS_CONFIG[motion.status] || STATUS_CONFIG.draft;
                const totalVotes = (motion.votesAye ?? 0) + (motion.votesNo ?? 0) + (motion.votesAbstain ?? 0);
                return (
                  <Link key={motion._id} href={`/parliament/motions/${motion._id}`}>
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
                        <span>By {motion.proposer?.fullName ?? "Unknown"}</span>
                        <span className="capitalize">{motion.category}</span>
                        <span>{motion._creationTime ? new Date(motion._creationTime).toLocaleDateString("en-GB") : ""}</span>
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
