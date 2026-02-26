"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Tag, Button, EmptyState } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import {
  Landmark,
  Vote,
  FileText,
  Gavel,
  Shield,
  Clock,
  ArrowRight,
  Users,
  BookOpen,
  Scale,
  Plus,
  Loader2,
} from "lucide-react";

const QUICK_LINKS = [
  { href: "/parliament/motions", label: "All Motions", icon: FileText, count: 12 },
  { href: "/parliament/motions/create", label: "Propose Motion", icon: Plus, count: null },
  { href: "/parliament/standing-orders", label: "Standing Orders", icon: BookOpen, count: 15 },
  { href: "/tribunal", label: "Tribunal", icon: Gavel, count: 3 },
];

const STATUS_MAP: Record<string, { color: string; label: string }> = {
  draft: { color: "text-court-text-ter", label: "Draft" },
  tabled: { color: "text-blue-400", label: "Tabled" },
  seconded: { color: "text-blue-400", label: "Seconded" },
  debating: { color: "text-orange-400", label: "In Debate" },
  voting: { color: "text-gold", label: "Voting Open" },
  passed: { color: "text-green-400", label: "Passed" },
  defeated: { color: "text-red-400", label: "Defeated" },
  withdrawn: { color: "text-court-text-ter", label: "Withdrawn" },
};

export default function ParliamentPage() {
  const motions: any[] | undefined = useQuery(anyApi.governance.legislative.listMotions, { limit: 5 });

  return (
    <VerifiedOnly fallbackMessage="Parliamentary features require verified student status to maintain institutional integrity.">
      <div className="pb-6 md:max-w-content-medium mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Landmark size={20} className="text-gold" />
            <h1 className="font-serif text-2xl font-bold text-court-text">Parliament</h1>
          </div>
          <p className="text-court-sm text-court-text-sec mt-1">
            The legislative body of Ratio. Propose motions, debate, and vote on institutional matters.
          </p>
        </div>

        {/* Quick Links */}
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Card className="p-3 hover:border-gold/20 transition-all h-full">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={16} className="text-gold" />
                      <span className="text-court-sm font-bold text-court-text">
                        {link.label}
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Active Voting */}
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-serif text-lg font-bold text-court-text">Active Motions</h2>
            <Link href="/parliament/motions" className="text-court-sm text-gold font-semibold">
              View all →
            </Link>
          </div>

          {motions === undefined ? (
            <div className="flex justify-center py-8">
              <Loader2 size={20} className="animate-spin text-court-text-ter" />
            </div>
          ) : motions.length === 0 ? (
            <EmptyState message="No motions have been proposed yet." />
          ) : (
          <div className="space-y-2">
            {motions.map((motion: any) => {
              const statusInfo = STATUS_MAP[motion.status] || STATUS_MAP.draft;
              const totalVotes = (motion.votesAye ?? 0) + (motion.votesNo ?? 0) + (motion.votesAbstain ?? 0);
              return (
                <Link key={motion._id} href={`/parliament/motions/${motion._id}`}>
                  <Card className="p-4 hover:border-white/10 transition-all mb-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-court-base font-bold text-court-text flex-1 pr-3">
                        {motion.title}
                      </h3>
                      <Tag
                        color={
                          motion.status === "passed"
                            ? "green"
                            : motion.status === "voting"
                              ? "gold"
                              : motion.status === "defeated"
                                ? "red"
                                : "blue"
                        }
                        small
                      >
                        {statusInfo.label}
                      </Tag>
                    </div>

                    <div className="flex items-center gap-3 text-court-xs text-court-text-ter">
                      <span>Proposed by {motion.proposer?.fullName ?? "Unknown"}</span>
                      <span className="capitalize">{motion.category}</span>
                    </div>

                    {totalVotes > 0 && (
                      <div className="mt-3">
                        <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-white/[0.04]">
                          <div
                            className="bg-green-400 rounded-l-full"
                            style={{ width: `${(motion.votesAye / totalVotes) * 100}%` }}
                          />
                          <div
                            className="bg-red-400"
                            style={{ width: `${(motion.votesNo / totalVotes) * 100}%` }}
                          />
                          <div
                            className="bg-white/20 rounded-r-full"
                            style={{ width: `${(motion.votesAbstain / totalVotes) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-court-xs">
                          <span className="text-green-400">Aye {motion.votesAye}</span>
                          <span className="text-red-400">No {motion.votesNo}</span>
                          <span className="text-court-text-ter">Abstain {motion.votesAbstain}</span>
                        </div>
                      </div>
                    )}

                    {motion.votingDeadline && (
                      <div className="flex items-center gap-1 mt-2 text-court-xs text-orange-400">
                        <Clock size={12} />
                        Voting closes {new Date(motion.votingDeadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
          )}
        </section>

        {/* Governance Overview */}
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <h2 className="font-serif text-lg font-bold text-court-text mb-3">
            Governance Structure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Landmark size={16} className="text-gold" />
                <h3 className="text-court-sm font-bold text-court-text">Legislative</h3>
              </div>
              <p className="text-court-xs text-court-text-sec">
                Propose, debate, and vote on motions. Amend standing orders. Shape policy.
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-blue-400" />
                <h3 className="text-court-sm font-bold text-court-text">Executive</h3>
              </div>
              <p className="text-court-xs text-court-text-sec">
                Content moderation, governance roles, standing orders enforcement.
              </p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Gavel size={16} className="text-red-400" />
                <h3 className="text-court-sm font-bold text-court-text">Judicial</h3>
              </div>
              <p className="text-court-xs text-court-text-sec">
                Digital Review Tribunal. File cases, submit arguments, receive judgments.
              </p>
            </Card>
          </div>
        </section>

        {/* Governance Tiers Info */}
        <section className="px-4 md:px-6 lg:px-8">
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] to-transparent" />
            <div className="relative">
              <h3 className="font-serif text-base font-bold text-court-text mb-3">
                Governance Tiers
              </h3>
              <div className="space-y-2">
                {[
                  { tier: "Member", req: "Any registered user", color: "text-court-text-ter" },
                  { tier: "Accredited", req: "3+ moots, avg score 50+", color: "text-blue-400" },
                  { tier: "Voting", req: "10+ moots, avg score 60+", color: "text-green-400" },
                  { tier: "Constitutional", req: "30+ moots, avg score 70+", color: "text-gold" },
                  { tier: "Judicial", req: "50+ moots, avg score 80+", color: "text-red-400" },
                ].map((t) => (
                  <div key={t.tier} className="flex items-center justify-between">
                    <span className={`text-court-sm font-bold ${t.color}`}>{t.tier}</span>
                    <span className="text-court-xs text-court-text-ter">{t.req}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>
      </div>
    </VerifiedOnly>
  );
}
