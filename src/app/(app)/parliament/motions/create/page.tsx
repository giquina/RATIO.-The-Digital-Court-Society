"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Button, Tag } from "@/components/ui";
import { VerifiedOnly } from "@/components/guards/VerifiedOnly";
import { ArrowLeft, FileText, AlertTriangle, Info } from "lucide-react";

const CATEGORIES = [
  { value: "policy", label: "Policy", description: "Changes to platform policies and procedures" },
  { value: "procedural", label: "Procedural", description: "Amendments to standing orders and debate rules" },
  { value: "constitutional", label: "Constitutional", description: "Fundamental changes to governance structure" },
  { value: "conduct", label: "Conduct", description: "Changes to the code of conduct" },
];

export default function CreateMotionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [issue, setIssue] = useState("");
  const [rule, setRule] = useState("");
  const [application, setApplication] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = title && category && issue && rule && application && conclusion;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);

    // TODO: Replace with useMutation(api.governance.legislative.proposeMotion)
    await new Promise((r) => setTimeout(r, 1000));

    router.push("/parliament/motions");
  };

  return (
    <VerifiedOnly fallbackMessage="Only verified advocates can propose motions.">
      <div className="flex flex-col h-[calc(100dvh-140px)] md:h-[calc(100dvh-80px)] md:max-w-content-narrow mx-auto">
        <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <Link
            href="/parliament/motions"
            className="flex items-center gap-1.5 text-court-text-sec text-xs mb-3 hover:text-court-text transition-colors"
          >
            <ArrowLeft size={14} />
            Motions
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={20} className="text-gold" />
            <h1 className="font-serif text-2xl font-bold text-court-text">
              Propose a Motion
            </h1>
          </div>
          <p className="text-xs text-court-text-sec mt-1">
            Draft your motion using IRAC structure. It must be seconded before debate.
          </p>
        </div>

        {/* IRAC Info */}
        <section className="px-4 md:px-6 lg:px-8 mb-4">
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-blue-400/5 border border-blue-400/10">
            <Info size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-court-xs text-blue-400/80">
              All motions must follow IRAC structure: identify the Issue, state the
              governing Rule, explain the Application, and present your Conclusion.
              This ensures rigorous and structured parliamentary discourse.
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="px-4 md:px-6 lg:px-8">
          <Card className="p-5">
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-court-text-sec tracking-wider mb-1.5">
                  MOTION TITLE *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Motion to Establish a Peer Review Committee"
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-court-text-sec tracking-wider mb-1.5">
                  CATEGORY *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        category === c.value
                          ? "border-gold/40 bg-gold-dim"
                          : "border-court-border hover:border-white/10"
                      }`}
                    >
                      <p className={`text-court-sm font-bold ${category === c.value ? "text-gold" : "text-court-text"}`}>
                        {c.label}
                      </p>
                      <p className="text-court-xs text-court-text-ter mt-0.5">
                        {c.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-court-border pt-4">
                <p className="text-court-sm font-bold text-gold mb-3">IRAC Structure</p>
              </div>

              {/* Issue */}
              <div>
                <label className="block text-xs font-bold text-court-text-sec tracking-wider mb-1.5">
                  ISSUE *
                </label>
                <p className="text-court-xs text-court-text-ter mb-1.5">
                  What problem or question does this motion address?
                </p>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="The current platform lacks a formal mechanism for..."
                  rows={3}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

              {/* Rule */}
              <div>
                <label className="block text-xs font-bold text-court-text-sec tracking-wider mb-1.5">
                  RULE *
                </label>
                <p className="text-court-xs text-court-text-ter mb-1.5">
                  What standing orders, principles, or precedents govern this?
                </p>
                <textarea
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder="Under Standing Order 3(2), the Assembly may..."
                  rows={3}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

              {/* Application */}
              <div>
                <label className="block text-xs font-bold text-court-text-sec tracking-wider mb-1.5">
                  APPLICATION *
                </label>
                <p className="text-court-xs text-court-text-ter mb-1.5">
                  How do the rules apply to this specific proposal?
                </p>
                <textarea
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  placeholder="Applying this principle to the current situation..."
                  rows={4}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

              {/* Conclusion */}
              <div>
                <label className="block text-xs font-bold text-court-text-sec tracking-wider mb-1.5">
                  CONCLUSION *
                </label>
                <p className="text-court-xs text-court-text-ter mb-1.5">
                  What specific action do you propose?
                </p>
                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="This House resolves to..."
                  rows={3}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none"
                />
              </div>

            </div>
          </Card>
        </section>
      </div>{/* end scrollable */}

      {/* Sticky CTA */}
      <div className="shrink-0 px-4 md:px-6 lg:px-8 py-3 border-t border-court-border-light/20 bg-navy">
        <Button onClick={handleSubmit} disabled={!canSubmit || submitting} fullWidth>
          {submitting ? "Submitting Motion..." : "Table Motion"}
        </Button>
        <p className="text-court-xs text-court-text-ter text-center mt-2">
          Your motion will be tabled and require a second before it can proceed to debate.
        </p>
      </div>
      </div>
    </VerifiedOnly>
  );
}
