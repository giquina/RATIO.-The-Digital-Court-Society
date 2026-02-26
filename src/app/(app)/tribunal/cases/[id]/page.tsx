"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Tag, Avatar, EmptyState } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import {
  ArrowLeft,
  Gavel,
  FileText,
  Clock,
  CheckCircle2,
  User,
  MessageCircle,
  Loader2,
} from "lucide-react";

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

export default function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const caseData: any = useQuery(anyApi.governance.judicial.getCaseById, { caseId: id as any });

  if (caseData === undefined) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-court-text-ter" />
      </div>
    );
  }

  if (caseData === null) {
    return (
      <div className="px-4 py-20">
        <EmptyState icon={<Gavel size={28} />} title="Not Found" description="Case not found." />
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[caseData.status] || STATUS_CONFIG.filed;
  const submissions = caseData.submissions ?? [];

  return (
    <VerifiedOnly>
      <div className="pb-6 md:max-w-content-narrow mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <Link
            href="/tribunal"
            className="flex items-center gap-1.5 text-court-text-sec text-court-sm mb-3 hover:text-court-text transition-colors"
          >
            <ArrowLeft size={14} />
            Tribunal
          </Link>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-serif text-xl font-bold text-court-text">
              {caseData.title}
            </h1>
            <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
          </div>
        </div>

        {/* Parties */}
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-court-xs font-bold text-court-text-ter tracking-wider mb-2">
                  APPLICANT
                </p>
                <div className="flex items-center gap-2">
                  <Avatar name={caseData.filer?.fullName ?? "Unknown"} chamber={caseData.filer?.chamber ?? ""} size="sm" />
                  <div>
                    <p className="text-court-sm font-bold text-court-text">{caseData.filer?.fullName ?? "Unknown"}</p>
                    <p className="text-court-xs text-court-text-ter">{caseData.filer?.chamber ?? ""} Chamber</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-court-xs font-bold text-court-text-ter tracking-wider mb-2">
                  RESPONDENT
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <User size={14} className="text-court-text-ter" />
                  </div>
                  <div>
                    <p className="text-court-sm font-bold text-court-text">{caseData.respondent?.fullName ?? "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>
            {caseData.judge && (
              <div className="mt-3 pt-3 border-t border-court-border">
                <p className="text-court-xs font-bold text-court-text-ter tracking-wider mb-1">
                  PRESIDING
                </p>
                <div className="flex items-center gap-2">
                  <Gavel size={14} className="text-gold" />
                  <span className="text-court-sm font-bold text-court-text">
                    {caseData.judge?.fullName ?? "TBD"}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* IRAC Content */}
        <section className="px-4 md:px-6 lg:px-8 mb-5 space-y-3">
          <h2 className="font-serif text-base font-bold text-court-text flex items-center gap-2">
            <FileText size={16} className="text-gold" />
            Case Filing
          </h2>
          {(
            [
              ["Issue", caseData.issue],
              ["Rule", caseData.rule],
              ["Application", caseData.application],
              ["Conclusion", caseData.conclusion],
            ] as const
          ).map(([label, content]) => (
            <Card key={label} className="p-4">
              <h3 className="text-court-sm font-bold text-gold mb-1.5">{label}</h3>
              <p className="text-court-sm text-court-text-sec leading-relaxed">{content}</p>
            </Card>
          ))}
          {caseData.remedySought && (
          <Card className="p-4">
            <h3 className="text-court-sm font-bold text-gold mb-1.5">Remedy Sought</h3>
            <p className="text-court-sm text-court-text-sec">{caseData.remedySought}</p>
          </Card>
          )}
        </section>

        {/* Submissions */}
        <section className="px-4 md:px-6 lg:px-8">
          <h2 className="font-serif text-base font-bold text-court-text flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-gold" />
            Submissions ({submissions.length})
          </h2>
          {submissions.length === 0 ? (
            <EmptyState icon={<MessageCircle size={28} />} title="No Submissions" description="No submissions yet." />
          ) : (
          <div className="space-y-2">
            {submissions.map((sub: any) => (
              <Card key={sub._id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-court-sm font-bold text-court-text">{sub.submittedBy?.fullName ?? "Unknown"}</span>
                    <Tag color="blue" small>{sub.type}</Tag>
                  </div>
                  <span className="text-court-xs text-court-text-ter">
                    {sub._creationTime ? new Date(sub._creationTime).toLocaleDateString("en-GB") : ""}
                  </span>
                </div>
                <p className="text-court-sm text-court-text-sec leading-relaxed">
                  {sub.content}
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
