"use client";

import Link from "next/link";
import { Card, Tag, Button, EmptyState } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import {
  Gavel,
  Plus,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Scale,
  Shield,
  BookOpen,
} from "lucide-react";

// Demo data — TODO: Replace with useQuery(api.governance.judicial.listCases)
const CASES = [
  {
    id: "1",
    title: "Application for Review of Moderation Decision",
    filer: "James M.",
    respondent: "Moderation Team",
    status: "hearing",
    filedAt: "2026-02-16",
    category: "moderation_review",
  },
  {
    id: "2",
    title: "Dispute Regarding Chamber Allocation",
    filer: "Priya S.",
    respondent: "Daniel R.",
    status: "submissions",
    filedAt: "2026-02-14",
    category: "dispute",
  },
  {
    id: "3",
    title: "Challenge to Motion Procedural Validity",
    filer: "Amara O.",
    respondent: "Speaker's Office",
    status: "judgment",
    filedAt: "2026-02-10",
    category: "procedural",
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: "gold" | "blue" | "green" | "red" | "orange" }> = {
  filed: { label: "Filed", color: "blue" },
  acknowledged: { label: "Acknowledged", color: "blue" },
  served: { label: "Notice Served", color: "orange" },
  submissions: { label: "Submissions", color: "gold" },
  hearing: { label: "Hearing", color: "orange" },
  judgment: { label: "Judgment Pending", color: "gold" },
  closed: { label: "Closed", color: "green" },
  appeal: { label: "Under Appeal", color: "red" },
};

export default function TribunalPage() {
  return (
    <VerifiedOnly fallbackMessage="The Digital Review Tribunal requires verified student status.">
      <div className="pb-6 md:max-w-content-medium mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Gavel size={20} className="text-gold" />
            <h1 className="font-serif text-2xl font-bold text-court-text">
              Digital Review Tribunal
            </h1>
          </div>
          <p className="text-court-sm text-court-text-sec mt-1">
            The judicial body of Ratio. File cases, submit arguments, and seek remedies.
          </p>
        </div>

        {/* Actions */}
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Link href="/tribunal/cases/file">
              <Card className="p-4 hover:border-gold/20 transition-all h-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <Plus size={16} className="text-gold" />
                  <span className="text-court-sm font-bold text-court-text">File a Case</span>
                </div>
                <p className="text-court-xs text-court-text-ter">
                  Submit a case for review using IRAC structure.
                </p>
              </Card>
            </Link>
            <Link href="#active-cases">
              <Card className="p-4 hover:border-white/10 transition-all h-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText size={16} className="text-blue-400" />
                  <span className="text-court-sm font-bold text-court-text">All Cases</span>
                </div>
                <p className="text-court-xs text-court-text-ter">
                  Browse published cases and judgments.
                </p>
              </Card>
            </Link>
            <Link href="#active-cases">
              <Card className="p-4 hover:border-white/10 transition-all h-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <BookOpen size={16} className="text-green-400" />
                  <span className="text-court-sm font-bold text-court-text">Judgments</span>
                </div>
                <p className="text-court-xs text-court-text-ter">
                  Published decisions and binding precedent.
                </p>
              </Card>
            </Link>
          </div>
        </section>

        {/* Active Cases */}
        <section id="active-cases" className="px-4 md:px-6 lg:px-8 mb-5">
          <h2 className="font-serif text-lg font-bold text-court-text mb-3">Active Cases</h2>
          <div className="space-y-2">
            {CASES.map((c) => {
              const config = STATUS_CONFIG[c.status] || STATUS_CONFIG.filed;
              return (
                <Link key={c.id} href={`/tribunal/cases/${c.id}`}>
                  <Card className="p-4 hover:border-white/10 transition-all mb-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-court-base font-bold text-court-text flex-1 pr-3">
                        {c.title}
                      </h3>
                      <Tag color={config.color} small>
                        {config.label}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-3 text-court-xs text-court-text-ter">
                      <span>Filed by {c.filer}</span>
                      <span>v. {c.respondent}</span>
                      <span>{c.filedAt}</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tribunal Info */}
        <section className="px-4 md:px-6 lg:px-8">
          <Card className="p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.03] to-transparent" />
            <div className="relative">
              <h3 className="font-serif text-base font-bold text-court-text mb-3">
                Tribunal Procedure
              </h3>
              <div className="space-y-2">
                {[
                  { step: "1", label: "File", desc: "Submit case using IRAC structure" },
                  { step: "2", label: "Acknowledge", desc: "Tribunal reviews and acknowledges" },
                  { step: "3", label: "Serve Notice", desc: "Respondent notified (48hr response window)" },
                  { step: "4", label: "Submissions", desc: "Both parties submit written arguments" },
                  { step: "5", label: "Hearing", desc: "Live text-based hearing (if required)" },
                  { step: "6", label: "Judgment", desc: "Published judgment with reasoning" },
                  { step: "7", label: "Appeal", desc: "Single appeal to 3-member panel" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="text-court-xs font-bold text-gold bg-gold-dim w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div>
                      <span className="text-court-sm font-bold text-court-text">{s.label}</span>
                      <span className="text-court-xs text-court-text-ter ml-2">{s.desc}</span>
                    </div>
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
