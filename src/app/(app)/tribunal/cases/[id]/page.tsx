"use client";

import Link from "next/link";
import { Card, Tag, Avatar } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import {
  ArrowLeft,
  Gavel,
  FileText,
  Clock,
  CheckCircle2,
  User,
  MessageCircle,
} from "lucide-react";

// Demo data — TODO: Replace with useQuery(api.governance.judicial.getCase)
const CASE_DATA = {
  id: "1",
  title: "Application for Review of Moderation Decision",
  filer: { name: "James M.", chamber: "Lincoln's" },
  respondent: { name: "Moderation Team", chamber: "N/A" },
  status: "hearing",
  filedAt: "2026-02-16",
  assignedJudge: { name: "Prof. Williams (AI)", chamber: "Judicial" },
  issue:
    "Whether the moderation decision to remove the applicant's debate contribution on Motion #47 was proportionate and in accordance with Standing Order 9 and the Code of Conduct.",
  rule:
    "Standing Order 9 provides that moderation actions must follow the principle of proportionality. The Code of Conduct (Section 3.2) states that controversial legal arguments are always permissible provided they are presented with professional decorum.",
  application:
    "The applicant's contribution argued in favour of a contentious legal position regarding parliamentary sovereignty. The moderation team removed it under the 'inappropriate content' category. However, the content constituted a legitimate legal argument, not harassment or defamation. No proportionality assessment was provided as required by SO 9.",
  conclusion:
    "The removal was disproportionate and procedurally improper. The Tribunal should order reinstatement of the contribution and a reminder to the moderation team regarding SO 9 compliance.",
  remedySought: "Decision Voided + Content Reinstated",
  submissions: [
    {
      id: "s1",
      by: "James M.",
      type: "Initial Filing",
      date: "2026-02-16",
      excerpt: "I submit this application for review of the moderation decision dated 15 February 2026...",
    },
    {
      id: "s2",
      by: "Moderation Team",
      type: "Response",
      date: "2026-02-18",
      excerpt: "The moderation team maintains that the content was flagged by multiple members and fell below the standard expected...",
    },
    {
      id: "s3",
      by: "James M.",
      type: "Reply",
      date: "2026-02-19",
      excerpt: "In reply, the applicant notes that no specific provision of the Code of Conduct has been cited by the respondent...",
    },
  ],
  timeline: [
    { date: "2026-02-16", event: "Case filed", status: "complete" },
    { date: "2026-02-16", event: "Acknowledged by Tribunal", status: "complete" },
    { date: "2026-02-17", event: "Notice served to respondent", status: "complete" },
    { date: "2026-02-18", event: "Response received", status: "complete" },
    { date: "2026-02-19", event: "Reply submitted", status: "complete" },
    { date: "2026-02-21", event: "Hearing scheduled", status: "current" },
    { date: "TBD", event: "Judgment", status: "pending" },
  ],
};

export default function CaseDetailPage() {
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
              {CASE_DATA.title}
            </h1>
            <Tag color="orange">Hearing</Tag>
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
                  <Avatar name={CASE_DATA.filer.name} chamber={CASE_DATA.filer.chamber} size="sm" />
                  <div>
                    <p className="text-court-sm font-bold text-court-text">{CASE_DATA.filer.name}</p>
                    <p className="text-court-xs text-court-text-ter">{CASE_DATA.filer.chamber} Chamber</p>
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
                    <p className="text-court-sm font-bold text-court-text">{CASE_DATA.respondent.name}</p>
                  </div>
                </div>
              </div>
            </div>
            {CASE_DATA.assignedJudge && (
              <div className="mt-3 pt-3 border-t border-court-border">
                <p className="text-court-xs font-bold text-court-text-ter tracking-wider mb-1">
                  PRESIDING
                </p>
                <div className="flex items-center gap-2">
                  <Gavel size={14} className="text-gold" />
                  <span className="text-court-sm font-bold text-court-text">
                    {CASE_DATA.assignedJudge.name}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Timeline */}
        <section className="px-4 md:px-6 lg:px-8 mb-5">
          <h2 className="font-serif text-base font-bold text-court-text mb-3">Case Timeline</h2>
          <Card className="p-4">
            <div className="space-y-3">
              {CASE_DATA.timeline.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    {t.status === "complete" ? (
                      <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    ) : t.status === "current" ? (
                      <Clock size={16} className="text-gold shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-court-border shrink-0" />
                    )}
                    {i < CASE_DATA.timeline.length - 1 && (
                      <div className="w-px h-4 bg-court-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <p className={`text-court-sm font-semibold ${t.status === "pending" ? "text-court-text-ter" : "text-court-text"}`}>
                      {t.event}
                    </p>
                    <p className="text-court-xs text-court-text-ter">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
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
              ["Issue", CASE_DATA.issue],
              ["Rule", CASE_DATA.rule],
              ["Application", CASE_DATA.application],
              ["Conclusion", CASE_DATA.conclusion],
            ] as const
          ).map(([label, content]) => (
            <Card key={label} className="p-4">
              <h3 className="text-court-sm font-bold text-gold mb-1.5">{label}</h3>
              <p className="text-court-sm text-court-text-sec leading-relaxed">{content}</p>
            </Card>
          ))}
          <Card className="p-4">
            <h3 className="text-court-sm font-bold text-gold mb-1.5">Remedy Sought</h3>
            <p className="text-court-sm text-court-text-sec">{CASE_DATA.remedySought}</p>
          </Card>
        </section>

        {/* Submissions */}
        <section className="px-4 md:px-6 lg:px-8">
          <h2 className="font-serif text-base font-bold text-court-text flex items-center gap-2 mb-3">
            <MessageCircle size={16} className="text-gold" />
            Submissions ({CASE_DATA.submissions.length})
          </h2>
          <div className="space-y-2">
            {CASE_DATA.submissions.map((sub) => (
              <Card key={sub.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-court-sm font-bold text-court-text">{sub.by}</span>
                    <Tag color="blue" small>{sub.type}</Tag>
                  </div>
                  <span className="text-court-xs text-court-text-ter">{sub.date}</span>
                </div>
                <p className="text-court-sm text-court-text-sec leading-relaxed">
                  {sub.excerpt}
                </p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </VerifiedOnly>
  );
}
