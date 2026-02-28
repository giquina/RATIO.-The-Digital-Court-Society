"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Button } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import { ArrowLeft, Gavel, Info, AlertTriangle } from "lucide-react";
import { analytics } from "@/lib/analytics";

const CASE_TYPES = [
  { value: "moderation_review", label: "Review of Moderation Decision" },
  { value: "procedural", label: "Procedural Challenge" },
  { value: "dispute", label: "Member Dispute" },
  { value: "conduct", label: "Code of Conduct Breach" },
];

const REMEDIES = [
  { value: "decision_voided", label: "Decision Voided" },
  { value: "corrective_action", label: "Corrective Action Required" },
  { value: "declaration", label: "Declaration of Rights" },
  { value: "restriction_lifted", label: "Restriction Lifted" },
];

export default function FileCasePage() {
  const router = useRouter();
  const profile: any = useQuery(anyApi.users.myProfile);
  const fileCase = useMutation(anyApi.governance.judicial.fileCase);
  const [title, setTitle] = useState("");
  const [caseType, setCaseType] = useState("");
  const [respondent, setRespondent] = useState("");
  const [issue, setIssue] = useState("");
  const [rule, setRule] = useState("");
  const [application, setApplication] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [remedy, setRemedy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title && caseType && respondent && issue && rule && application && conclusion && remedy && profile?._id;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await fileCase({
        filedById: profile._id,
        respondentId: respondent as any,
        title,
        issue,
        rule,
        application,
        conclusion,
        remedySought: remedy,
      });
      analytics.caseSubmitted();
      router.push("/tribunal");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <VerifiedOnly fallbackMessage="Only verified advocates with Accredited tier or above may file cases.">
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
          <div className="flex items-center gap-2 mb-1">
            <Gavel size={20} className="text-gold" />
            <h1 className="font-serif text-2xl font-bold text-court-text">File a Case</h1>
          </div>
          <p className="text-court-sm text-court-text-sec mt-1">
            Submit your case using IRAC structure for Tribunal review
          </p>
        </div>

        {/* Warning */}
        <section className="px-4 md:px-6 lg:px-8 mb-4">
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-orange-400/5 border border-orange-400/10">
            <AlertTriangle size={14} className="text-orange-400 shrink-0 mt-0.5" />
            <p className="text-court-xs text-orange-400/80">
              Filing vexatious cases carries consequences. Three or more dismissed
              cases may result in a filing cooldown period. Ensure your case has
              genuine merit before proceeding.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="px-4 md:px-6 lg:px-8">
          <Card className="p-5">
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  CASE TITLE *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Application for Review of Moderation Decision"
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                />
              </div>

              {/* Type + Respondent */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                    CASE TYPE *
                  </label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40"
                  >
                    <option value="">Select type...</option>
                    {CASE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                    RESPONDENT *
                  </label>
                  <input
                    type="text"
                    value={respondent}
                    onChange={(e) => setRespondent(e.target.value)}
                    placeholder="Name or role of respondent"
                    className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                  />
                </div>
              </div>

              {/* IRAC Divider */}
              <div className="border-t border-court-border pt-4">
                <p className="text-court-sm font-bold text-gold mb-1">IRAC Structure</p>
                <p className="text-court-xs text-court-text-ter">
                  All filings must follow IRAC format to be accepted by the Tribunal.
                </p>
              </div>

              {/* Issue */}
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  ISSUE *
                </label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="What is the specific dispute or question to be resolved?"
                  rows={3}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

              {/* Rule */}
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  RULE *
                </label>
                <textarea
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder="Which standing orders, conduct code provisions, or constitutional principles apply?"
                  rows={3}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

              {/* Application */}
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  APPLICATION *
                </label>
                <textarea
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  placeholder="How do the rules apply to the specific facts of your case?"
                  rows={4}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

              {/* Conclusion */}
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  CONCLUSION *
                </label>
                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="What outcome do you submit the Tribunal should reach?"
                  rows={3}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

              {/* Remedy */}
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  REMEDY SOUGHT *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REMEDIES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRemedy(r.value)}
                      className={`text-left p-3 rounded-xl border transition-all text-court-sm font-semibold ${
                        remedy === r.value
                          ? "border-gold/40 bg-gold-dim text-gold"
                          : "border-court-border text-court-text-sec hover:border-white/10"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button onClick={handleSubmit} disabled={!canSubmit || submitting} fullWidth>
                  {submitting ? "Filing Case..." : "File Case"}
                </Button>
                <p className="text-court-xs text-court-text-ter text-center mt-2">
                  The Tribunal will acknowledge your filing within 48 hours.
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </VerifiedOnly>
  );
}
