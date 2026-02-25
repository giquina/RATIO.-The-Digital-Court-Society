"use client";

import { useState } from "react";
import { Card, Button, Tag, ProgressBar } from "@/components/ui";
import {
  Scale,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Swords,
  Target,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { LAW_MODULES } from "@/lib/constants/app";

interface IracScore {
  score: number;
  feedback: string;
}

interface AnalysisResult {
  overallAssessment: string;
  strengths: { point: string; detail: string }[];
  weaknesses: { point: string; detail: string }[];
  missingAuthorities: { case: string; relevance: string }[];
  counterArguments: { point: string; response: string }[];
  logicalGaps: { gap: string; suggestion: string }[];
  iracCompliance: {
    issue: IracScore;
    rule: IracScore;
    application: IracScore;
    conclusion: IracScore;
  };
  revisedOutline: string;
  overallScore: number;
}

const SIDES = [
  { value: "appellant", label: "Appellant" },
  { value: "respondent", label: "Respondent" },
  { value: "claimant", label: "Claimant" },
  { value: "defendant", label: "Defendant" },
];

export default function ArgumentBuilderPage() {
  const [argument, setArgument] = useState("");
  const [side, setSide] = useState("appellant");
  const [areaOfLaw, setAreaOfLaw] = useState("");
  const [authorities, setAuthorities] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    strengths: true,
    weaknesses: true,
    counter: true,
    gaps: false,
    authorities: false,
    irac: true,
  });

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  // TODO: Replace with useAction(api.ai.argumentBuilder.analyse)
  const handleAnalyse = async () => {
    if (!argument.trim() || !areaOfLaw) return;
    setLoading(true);
    setAnalysis(null);

    // Simulated delay — replace with actual Convex action call
    await new Promise((r) => setTimeout(r, 2500));

    setAnalysis({
      overallAssessment:
        "The skeleton argument demonstrates a solid understanding of the legal principles at play. The IRAC structure is present but could be strengthened, particularly in the application section which requires more detailed factual analysis. The argument would benefit from addressing the opposing position more directly.",
      strengths: [
        {
          point: "Clear issue identification",
          detail:
            "The legal question is framed precisely and demonstrates understanding of the jurisdictional scope.",
        },
        {
          point: "Appropriate authority selection",
          detail:
            "The cases cited are relevant and from the correct level of court hierarchy for binding precedent.",
        },
      ],
      weaknesses: [
        {
          point: "Insufficient factual application",
          detail:
            "The argument moves from rule statement to conclusion too quickly. Apply each element of the test to the specific facts, showing how each is satisfied (or not).",
        },
        {
          point: "Missing policy considerations",
          detail:
            "Modern UK courts often consider policy implications. Consider whether your argument creates a principled limit or risks opening the floodgates.",
        },
      ],
      missingAuthorities: [
        {
          case: "Caparo Industries plc v Dickman [1990] 2 AC 605",
          relevance:
            "Establishes the three-stage test for duty of care — your argument should engage with all three stages.",
        },
        {
          case: "Robinson v Chief Constable [2018] UKSC 4",
          relevance:
            "The Supreme Court clarified the incremental approach — relevant to novel duty situations.",
        },
      ],
      counterArguments: [
        {
          point:
            "The opposing side will argue that the factual matrix is distinguishable from the authorities you cite.",
          response:
            "Prepare to demonstrate the ratio decidendi of your authorities covers the present facts, emphasising the common underlying principle rather than surface-level facts.",
        },
        {
          point:
            "Policy argument: extending liability in this way may create indeterminate liability.",
          response:
            'Address the "floodgates" concern directly by articulating a clear limiting principle.',
        },
      ],
      logicalGaps: [
        {
          gap: "The link between the rule statement and its application to facts is underdeveloped.",
          suggestion:
            "Break the rule into its constituent elements and address each one separately with specific factual references.",
        },
      ],
      iracCompliance: {
        issue: {
          score: 4,
          feedback:
            "Well-framed legal question that identifies the specific point of law in dispute.",
        },
        rule: {
          score: 3.5,
          feedback:
            "Relevant authorities cited but the rule could be stated more precisely. Consider articulating the legal test as a numbered series of elements.",
        },
        application: {
          score: 2.5,
          feedback:
            "This is the weakest section. Each element of the rule must be methodically applied to the facts. Currently too conclusory.",
        },
        conclusion: {
          score: 3.5,
          feedback:
            "Logically follows from the argument but would be stronger with a statement of the remedy sought.",
        },
      },
      revisedOutline:
        "1. Open with the precise legal question\n2. State the governing test (cite authority)\n3. Break the test into elements\n4. Apply element 1 to facts (with evidence)\n5. Apply element 2 to facts (with evidence)\n6. Apply element 3 to facts (with evidence)\n7. Address the strongest counter-argument\n8. Conclude with remedy sought",
      overallScore: 6.5,
    });

    setLoading(false);
  };

  return (
    <div className="pb-6 md:max-w-content-narrow mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <Link
          href="/tools"
          className="flex items-center gap-1.5 text-court-text-sec text-court-sm mb-3 hover:text-court-text transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Tools
        </Link>
        <div className="flex items-center gap-2 mb-1">
          <Scale size={20} className="text-green-400" />
          <h1 className="font-serif text-2xl font-bold text-court-text">
            Argument Builder
          </h1>
        </div>
        <p className="text-court-sm text-court-text-sec mt-1">
          Submit your skeleton argument and receive detailed analysis with counter-arguments
        </p>
      </div>

      {/* Input Section */}
      <section className="px-4 md:px-6 lg:px-8 mb-4">
        <Card className="p-5">
          <div className="space-y-4">
            {/* Area of Law + Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  AREA OF LAW *
                </label>
                <select
                  value={areaOfLaw}
                  onChange={(e) => setAreaOfLaw(e.target.value)}
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40"
                >
                  <option value="">Select area...</option>
                  {LAW_MODULES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  YOUR SIDE *
                </label>
                <div className="flex gap-2">
                  {SIDES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSide(s.value)}
                      className={`flex-1 py-2 text-court-xs font-bold rounded-lg border transition-all ${
                        side === s.value
                          ? "border-gold/40 bg-gold-dim text-gold"
                          : "border-court-border text-court-text-sec hover:border-white/10"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skeleton Argument */}
            <div>
              <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                YOUR SKELETON ARGUMENT *
              </label>
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                placeholder="Paste or write your skeleton argument here. Structure it using IRAC (Issue, Rule, Application, Conclusion) for best results..."
                rows={10}
                className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter resize-none font-mono"
              />
              <p className="text-court-xs text-court-text-ter mt-1">
                {argument.length} characters
              </p>
            </div>

            {/* Authorities */}
            <div>
              <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                CITED AUTHORITIES (OPTIONAL)
              </label>
              <input
                type="text"
                value={authorities}
                onChange={(e) => setAuthorities(e.target.value)}
                placeholder="e.g. Donoghue v Stevenson, Caparo v Dickman (comma-separated)"
                className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
              />
            </div>

            <Button
              onClick={handleAnalyse}
              disabled={!argument.trim() || !areaOfLaw || loading}
              fullWidth
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Analysing Argument...
                </span>
              ) : (
                "Analyse My Argument"
              )}
            </Button>
          </div>
        </Card>
      </section>

      {/* Disclaimer */}
      <section className="px-4 md:px-6 lg:px-8 mb-4">
        <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-orange-400/5 border border-orange-400/10">
          <AlertTriangle size={14} className="text-orange-400 shrink-0 mt-0.5" />
          <p className="text-court-xs text-orange-400/80">
            AI-assisted analysis for study purposes only. Always verify against
            primary sources and consult your tutor for assessment preparation.
          </p>
        </div>
      </section>

      {/* Results */}
      {analysis && (
        <section className="px-4 md:px-6 lg:px-8 space-y-3">
          {/* Score Card */}
          <Card className="p-5" highlight>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg font-bold text-court-text">
                Analysis Complete
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gold">
                  {analysis.overallScore}
                </span>
                <span className="text-court-xs text-court-text-ter">/10</span>
              </div>
            </div>
            <p className="text-court-sm text-court-text-sec leading-relaxed">
              {analysis.overallAssessment}
            </p>
          </Card>

          {/* IRAC Compliance */}
          <CollapsibleSection
            title="IRAC Compliance"
            icon={<FileText size={16} />}
            expanded={expandedSections.irac}
            onToggle={() => toggleSection("irac")}
            badge={`${((analysis.iracCompliance.issue.score + analysis.iracCompliance.rule.score + analysis.iracCompliance.application.score + analysis.iracCompliance.conclusion.score) / 4).toFixed(1)}/5`}
          >
            <div className="space-y-3">
              {(
                [
                  ["Issue", analysis.iracCompliance.issue],
                  ["Rule", analysis.iracCompliance.rule],
                  ["Application", analysis.iracCompliance.application],
                  ["Conclusion", analysis.iracCompliance.conclusion],
                ] as [string, IracScore][]
              ).map(([name, score]) => (
                <div key={name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-court-sm font-semibold text-court-text">
                      {name}
                    </span>
                    <span className="text-court-xs text-gold font-bold">
                      {score.score}/5
                    </span>
                  </div>
                  <ProgressBar pct={(score.score / 5) * 100} color="gold" />
                  <p className="text-court-xs text-court-text-ter mt-1">
                    {score.feedback}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Strengths */}
          <CollapsibleSection
            title="Strengths"
            icon={<CheckCircle2 size={16} className="text-green-400" />}
            expanded={expandedSections.strengths}
            onToggle={() => toggleSection("strengths")}
            badge={`${analysis.strengths.length}`}
          >
            <div className="space-y-2.5">
              {analysis.strengths.map((s, i) => (
                <div key={i} className="pl-3 border-l-2 border-green-400/30">
                  <p className="text-court-sm font-semibold text-court-text">
                    {s.point}
                  </p>
                  <p className="text-court-xs text-court-text-sec mt-0.5">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Weaknesses */}
          <CollapsibleSection
            title="Weaknesses"
            icon={<XCircle size={16} className="text-red-400" />}
            expanded={expandedSections.weaknesses}
            onToggle={() => toggleSection("weaknesses")}
            badge={`${analysis.weaknesses.length}`}
          >
            <div className="space-y-2.5">
              {analysis.weaknesses.map((w, i) => (
                <div key={i} className="pl-3 border-l-2 border-red-400/30">
                  <p className="text-court-sm font-semibold text-court-text">
                    {w.point}
                  </p>
                  <p className="text-court-xs text-court-text-sec mt-0.5">
                    {w.detail}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Counter-Arguments */}
          <CollapsibleSection
            title="Counter-Arguments to Prepare For"
            icon={<Swords size={16} className="text-orange-400" />}
            expanded={expandedSections.counter}
            onToggle={() => toggleSection("counter")}
            badge={`${analysis.counterArguments.length}`}
          >
            <div className="space-y-3">
              {analysis.counterArguments.map((ca, i) => (
                <div key={i}>
                  <div className="pl-3 border-l-2 border-orange-400/30 mb-1.5">
                    <p className="text-court-sm font-semibold text-court-text">
                      {ca.point}
                    </p>
                  </div>
                  <div className="pl-3 border-l-2 border-green-400/30 ml-3">
                    <p className="text-court-xs text-court-text-sec">
                      <span className="text-green-400 font-bold">Suggested rebuttal: </span>
                      {ca.response}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Missing Authorities */}
          <CollapsibleSection
            title="Missing Authorities"
            icon={<BookOpen size={16} className="text-blue-400" />}
            expanded={expandedSections.authorities}
            onToggle={() => toggleSection("authorities")}
            badge={`${analysis.missingAuthorities.length}`}
          >
            <div className="space-y-2">
              {analysis.missingAuthorities.map((a, i) => (
                <div key={i} className="pl-3 border-l-2 border-blue-400/30">
                  <p className="text-court-sm font-semibold text-court-text">
                    {a.case}
                  </p>
                  <p className="text-court-xs text-court-text-sec mt-0.5">
                    {a.relevance}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Logical Gaps */}
          <CollapsibleSection
            title="Logical Gaps"
            icon={<Target size={16} className="text-yellow-400" />}
            expanded={expandedSections.gaps}
            onToggle={() => toggleSection("gaps")}
            badge={`${analysis.logicalGaps.length}`}
          >
            <div className="space-y-2">
              {analysis.logicalGaps.map((g, i) => (
                <div key={i} className="pl-3 border-l-2 border-yellow-400/30">
                  <p className="text-court-sm font-semibold text-court-text">
                    {g.gap}
                  </p>
                  <p className="text-court-xs text-court-text-sec mt-0.5">
                    {g.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          {/* Revised Outline */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={16} className="text-gold" />
              <h3 className="text-court-base font-bold text-court-text">
                Suggested Revised Structure
              </h3>
            </div>
            <div className="bg-navy-mid rounded-xl p-3 font-mono text-court-xs text-court-text-sec leading-relaxed whitespace-pre-line">
              {analysis.revisedOutline}
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  expanded,
  onToggle,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-court-base font-bold text-court-text">{title}</h3>
          {badge && (
            <span className="text-court-xs font-bold text-court-text-ter bg-white/[0.04] px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-court-text-ter" />
        ) : (
          <ChevronDown size={16} className="text-court-text-ter" />
        )}
      </button>
      {expanded && <div className="px-4 pb-4">{children}</div>}
    </Card>
  );
}
