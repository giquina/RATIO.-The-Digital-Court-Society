"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Button, Tag } from "@/components/ui";
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle,
  FileText,
  Scale,
  Shield,
  Info,
} from "lucide-react";

// ── Module options ──
const MODULES = [
  { value: "", label: "Select a module..." },
  { value: "contract", label: "Contract Law" },
  { value: "criminal", label: "Criminal Law" },
  { value: "tort", label: "Tort Law" },
  { value: "public", label: "Public Law" },
  { value: "equity-trusts", label: "Equity & Trusts" },
  { value: "eu-international", label: "EU / International" },
  { value: "property", label: "Property Law" },
  { value: "constitutional", label: "Constitutional Law" },
];

// ── Citation types ──
const CITATION_TYPES = ["Case", "Statute", "Article", "Textbook"];

interface Citation {
  type: string;
  text: string;
}

export default function ContributePage() {
  const [module, setModule] = useState("");
  const [title, setTitle] = useState("");
  const [issue, setIssue] = useState("");
  const [rule, setRule] = useState("");
  const [application, setApplication] = useState("");
  const [conclusion, setConclusion] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [newCitationType, setNewCitationType] = useState("Case");
  const [newCitationText, setNewCitationText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const iracFilled =
    issue.trim().length > 0 &&
    rule.trim().length > 0 &&
    application.trim().length > 0 &&
    conclusion.trim().length > 0;
  const hasEnoughCitations = citations.length >= 2;
  const canSubmit =
    module !== "" && title.trim().length > 0 && iracFilled && hasEnoughCitations;

  const addCitation = () => {
    if (!newCitationText.trim()) return;
    setCitations((prev) => [
      ...prev,
      { type: newCitationType, text: newCitationText.trim() },
    ]);
    setNewCitationText("");
  };

  const removeCitation = (index: number) => {
    setCitations((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pb-6 px-4 md:px-6 lg:px-8 pt-6">
        <div className="max-w-content-narrow mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-2">
            Submission Received
          </h1>
          <p className="text-sm text-court-text-sec mb-2 max-w-sm mx-auto">
            Your contribution &quot;{title}&quot; has been submitted for peer
            review. You will be notified when reviewers provide feedback.
          </p>
          <p className="text-court-xs text-court-text-ter mb-6">
            Typical review time: 3-5 working days
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/law-book">
              <Button variant="secondary" size="sm">
                Back to Law Book
              </Button>
            </Link>
            <Link href="/law-book/review-queue">
              <Button size="sm">View Review Queue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-140px)] md:h-[calc(100dvh-80px)]">
      <div className="flex-1 overflow-y-auto">
      {/* ── Back link ── */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <div className="max-w-content-medium mx-auto">
          <Link
            href="/law-book"
            className="inline-flex items-center gap-1.5 text-xs text-court-text-ter hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Back to Law Book
          </Link>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="px-4 md:px-6 lg:px-8 mb-6">
        <div className="max-w-content-medium mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={24} className="text-gold" />
            <h1 className="font-serif text-xl md:text-2xl font-bold text-court-text">
              Contribute to the Law Book
            </h1>
          </div>
          <p className="text-sm text-court-text-sec">
            Submit a topic for peer review. All contributions must follow the
            IRAC structure and include a minimum of 2 citations.
          </p>
        </div>
      </header>

      <div className="px-4 md:px-6 lg:px-8">
        <div className="max-w-content-medium mx-auto lg:grid lg:grid-cols-3 lg:gap-6">
          {/* ── Main form ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Module + Title */}
            <Card className="p-5">
              <h2 className="font-serif text-base font-bold text-court-text mb-4">
                Topic Details
              </h2>

              <label className="block mb-4">
                <span className="text-court-sm text-court-text-sec mb-1.5 block">
                  Module
                </span>
                <select
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 text-sm text-court-text outline-none focus:border-gold/40"
                >
                  {MODULES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-court-sm text-court-text-sec mb-1.5 block">
                  Topic Title
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Offer and Acceptance"
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                />
              </label>
            </Card>

            {/* IRAC sections */}
            <Card className="p-5">
              <h2 className="font-serif text-base font-bold text-court-text mb-1">
                IRAC Analysis
              </h2>
              <p className="text-court-xs text-court-text-ter mb-4">
                All four sections are required for submission.
              </p>

              {/* Issue */}
              <label className="block mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-court-sm font-bold text-court-text">
                    Issue
                  </span>
                  {issue.trim() && (
                    <CheckCircle size={12} className="text-green-500" />
                  )}
                </div>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="What legal question does this address?"
                  rows={4}
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-y"
                />
              </label>

              {/* Rule */}
              <label className="block mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-court-sm font-bold text-court-text">
                    Rule
                  </span>
                  {rule.trim() && (
                    <CheckCircle size={12} className="text-green-500" />
                  )}
                </div>
                <textarea
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  placeholder="What is the governing law?"
                  rows={4}
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-y"
                />
              </label>

              {/* Application */}
              <label className="block mb-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-court-sm font-bold text-court-text">
                    Application
                  </span>
                  {application.trim() && (
                    <CheckCircle size={12} className="text-green-500" />
                  )}
                </div>
                <textarea
                  value={application}
                  onChange={(e) => setApplication(e.target.value)}
                  placeholder="How has this been applied in key cases?"
                  rows={4}
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-y"
                />
              </label>

              {/* Conclusion */}
              <label className="block">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-court-sm font-bold text-court-text">
                    Conclusion
                  </span>
                  {conclusion.trim() && (
                    <CheckCircle size={12} className="text-green-500" />
                  )}
                </div>
                <textarea
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  placeholder="What is the current state of the law?"
                  rows={4}
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-y"
                />
              </label>
            </Card>

            {/* Citations */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-serif text-base font-bold text-court-text">
                  Citations
                </h2>
                <span className="text-court-xs text-court-text-ter">
                  {citations.length} of 2 minimum
                </span>
              </div>
              <p className="text-court-xs text-court-text-ter mb-4">
                OSCOLA format preferred. Minimum 2 citations required.
              </p>

              {/* Existing citations */}
              {citations.length > 0 && (
                <div className="space-y-2 mb-4">
                  {citations.map((c, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.03] rounded-lg px-3.5 py-2.5 flex items-start gap-3"
                    >
                      <Tag color="gold" small>
                        {c.type.toUpperCase()}
                      </Tag>
                      <p className="text-court-sm text-court-text-sec flex-1 leading-relaxed">
                        {c.text}
                      </p>
                      <button
                        onClick={() => removeCitation(i)}
                        className="text-court-text-ter hover:text-red-400 transition-colors shrink-0 mt-0.5"
                        aria-label="Remove citation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add citation */}
              <div className="flex gap-2 items-start">
                <select
                  value={newCitationType}
                  onChange={(e) => setNewCitationType(e.target.value)}
                  className="bg-white/[0.05] border border-court-border rounded-xl px-3 py-2.5 text-sm text-court-text outline-none focus:border-gold/40 shrink-0"
                >
                  {CITATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newCitationText}
                  onChange={(e) => setNewCitationText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCitation();
                    }
                  }}
                  placeholder="Enter citation in OSCOLA format..."
                  className="flex-1 bg-white/[0.05] border border-court-border rounded-xl px-3.5 py-2.5 text-sm text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={addCitation}
                  disabled={!newCitationText.trim()}
                  className="shrink-0"
                >
                  <span className="flex items-center gap-1">
                    <Plus size={14} /> Add
                  </span>
                </Button>
              </div>

              {/* Validation message */}
              {!hasEnoughCitations && citations.length > 0 && (
                <div className="flex items-center gap-2 mt-3 text-court-xs text-orange-400">
                  <AlertCircle size={12} />
                  <span>
                    {2 - citations.length} more citation
                    {2 - citations.length > 1 ? "s" : ""} required
                  </span>
                </div>
              )}
            </Card>
          </div>

          {/* ── Guidelines sidebar ── */}
          <div className="mt-6 lg:mt-0">
            <Card className="p-5 sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={18} className="text-gold" />
                <h2 className="font-serif text-base font-bold text-court-text">
                  Editorial Guidelines
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-court-sm font-bold text-court-text mb-1">
                    IRAC Structure
                  </h3>
                  <p className="text-court-xs text-court-text-sec leading-relaxed">
                    All topics must follow the Issue, Rule, Application,
                    Conclusion framework. Each section should be substantive
                    and well-referenced.
                  </p>
                </div>

                <div>
                  <h3 className="text-court-sm font-bold text-court-text mb-1">
                    Citation Standards
                  </h3>
                  <p className="text-court-xs text-court-text-sec leading-relaxed">
                    Use OSCOLA citation format. Minimum 2 primary sources
                    (cases or statutes) required. Secondary sources
                    (textbooks, articles) encouraged.
                  </p>
                </div>

                <div>
                  <h3 className="text-court-sm font-bold text-court-text mb-1">
                    Review Process
                  </h3>
                  <p className="text-court-xs text-court-text-sec leading-relaxed">
                    Submissions undergo 2 peer reviews before editor approval.
                    Typical turnaround: 3-5 working days. You may be asked to
                    revise your submission.
                  </p>
                </div>

                <div>
                  <h3 className="text-court-sm font-bold text-court-text mb-1">
                    Quality Standards
                  </h3>
                  <p className="text-court-xs text-court-text-sec leading-relaxed">
                    Content should be accurate, balanced, and written in
                    formal legal English. Avoid personal opinion; focus on
                    established legal principles.
                  </p>
                </div>

                <div className="pt-3 border-t border-court-border-light">
                  <Link
                    href="/law-book/editorial-policy"
                    className="text-court-xs text-gold font-semibold hover:underline flex items-center gap-1"
                  >
                    <FileText size={12} /> Read full Editorial Policy
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      </div>{/* end scrollable */}

      {/* Sticky CTA */}
      <div className="shrink-0 px-4 md:px-6 lg:px-8 py-3 border-t border-court-border-light/20 bg-navy">
        <div className="max-w-content-medium mx-auto flex flex-col gap-2">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Submit for Review
          </Button>
          {!canSubmit && (
            <div className="flex items-center gap-2 justify-center text-court-xs text-court-text-ter">
              <Info size={12} />
              <span>
                {!module
                  ? "Select a module"
                  : !title.trim()
                    ? "Enter a topic title"
                    : !iracFilled
                      ? "Complete all IRAC sections"
                      : "Add at least 2 citations"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
