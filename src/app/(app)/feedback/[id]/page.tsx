"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, Tag, ProgressBar, DynamicIcon } from "@/components/ui";
import { FEEDBACK_DIMENSIONS } from "@/lib/constants/app";
import {
  ArrowLeft, Calendar, User, Mic, CheckCircle, AlertTriangle, Target,
} from "lucide-react";

// ── Demo feedback data keyed by session ID ──
const FEEDBACK_DATA: Record<
  string,
  {
    caseTitle: string;
    date: string;
    mode: string;
    modeColor: "gold" | "blue";
    role: string;
    module: string;
    overallScore: number;
    dimensions: Record<string, number>;
    writtenFeedback: string;
    strengths: string[];
    improvements: string[];
  }
> = {
  s1: {
    caseTitle: "Judicial Review of Executive Power",
    date: "18 February 2026",
    mode: "Moot",
    modeColor: "gold",
    role: "Leading Counsel (Appellant)",
    module: "Public Law",
    overallScore: 78,
    dimensions: {
      argumentStructure: 82,
      useOfAuthorities: 75,
      oralDelivery: 80,
      judicialHandling: 68,
      courtManner: 85,
      persuasiveness: 76,
      timeManagement: 80,
    },
    writtenFeedback:
      "A strong submission that demonstrated a good understanding of the principles of judicial review. Your opening was well-structured using the IRAC method, and your citation of Council of Civil Service Unions v Minister for the Civil Service [1985] was effective. However, when the bench intervened on the proportionality point, there was a noticeable hesitation. Consider preparing more thoroughly for interventions on balancing tests. Your court manner was excellent throughout - appropriate forms of address and confident posture. Time management was also commendable, concluding with 30 seconds to spare.",
    strengths: [
      "Excellent IRAC structure in opening submissions",
      "Strong citation of relevant authorities including CCSU and R (Miller) v Secretary of State",
      "Confident court manner with appropriate forms of address",
      "Good time management - concluded within allotted time",
      "Clear and measured oral delivery with effective pauses",
    ],
    improvements: [
      "Prepare more thoroughly for interventions on proportionality and Wednesbury unreasonableness",
      "Strengthen the link between authorities and your specific argument on executive overreach",
      "When challenged on the merits, avoid retreating to procedural arguments too quickly",
      "Consider addressing the strongest counter-argument proactively before the bench raises it",
    ],
  },
  s2: {
    caseTitle: "AI Judge - Contract Formation",
    date: "14 February 2026",
    mode: "AI Judge",
    modeColor: "blue",
    role: "Counsel",
    module: "Contract Law",
    overallScore: 72,
    dimensions: {
      argumentStructure: 70,
      useOfAuthorities: 78,
      oralDelivery: 68,
      judicialHandling: 65,
      courtManner: 82,
      persuasiveness: 70,
      timeManagement: 71,
    },
    writtenFeedback:
      "A competent submission on the principles of offer and acceptance. Your analysis of Carlill v Carbolic Smoke Ball Co was sound, though the application to the modern scenario could have been more precise. The AI Judge noted that your oral delivery was slightly rushed in the middle section, particularly when dealing with the postal rule versus instantaneous communication. Consider slowing down for emphasis on key points.",
    strengths: [
      "Good use of leading authorities on contract formation",
      "Clear identification of the legal issues at stake",
      "Appropriate court etiquette maintained throughout",
    ],
    improvements: [
      "Slow down oral delivery during complex legal analysis",
      "Strengthen application of authorities to the specific facts",
      "Improve response to judicial interventions - answers were sometimes tangential",
      "Work on signposting transitions between different heads of argument",
    ],
  },
};

// Default fallback data for unknown IDs
const DEFAULT_FEEDBACK = {
  caseTitle: "Practice Session",
  date: "15 February 2026",
  mode: "AI Judge",
  modeColor: "blue" as const,
  role: "Counsel",
  module: "General Advocacy",
  overallScore: 65,
  dimensions: {
    argumentStructure: 68,
    useOfAuthorities: 60,
    oralDelivery: 70,
    judicialHandling: 55,
    courtManner: 72,
    persuasiveness: 62,
    timeManagement: 68,
  },
  writtenFeedback:
    "A solid effort that demonstrates developing advocacy skills. Continue to practise regularly and focus on the areas identified for improvement below.",
  strengths: [
    "Clear oral delivery with good projection",
    "Showed awareness of relevant legal principles",
    "Appropriate court manner throughout",
  ],
  improvements: [
    "Develop more structured arguments using IRAC framework",
    "Cite more specific authorities to support submissions",
    "Practise handling judicial interventions with composure",
    "Improve time management to allow for a strong conclusion",
  ],
};

function getScoreColor(score: number): string {
  if (score >= 70) return "green";
  if (score >= 50) return "gold";
  return "red";
}

function getScoreTextColor(score: number): string {
  if (score >= 70) return "text-green-400";
  if (score >= 50) return "text-gold";
  return "text-red-400";
}

function getScoreBgColor(score: number): string {
  if (score >= 70) return "bg-green-500/10 border-green-500/20";
  if (score >= 50) return "bg-gold-dim border-gold/20";
  return "bg-red-500/10 border-red-500/20";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 60) return "Competent";
  if (score >= 50) return "Developing";
  return "Needs Work";
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const feedback = FEEDBACK_DATA[id] ?? DEFAULT_FEEDBACK;

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Back Link */}
      <div className="px-4 md:px-6 lg:px-8 pt-3">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs text-court-text-sec hover:text-court-text transition-colors"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </Link>
      </div>

      {/* Header Card */}
      <section className="px-4 md:px-6 lg:px-8 mt-3">
        <Card className="p-5">
          <div className="flex items-start justify-between mb-3">
            <Tag color={feedback.modeColor}>
              {feedback.mode.toUpperCase()}
            </Tag>
            <div className="flex items-center gap-1.5 text-court-text-ter">
              <Calendar size={12} />
              <span className="text-court-sm">{feedback.date}</span>
            </div>
          </div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-2 leading-tight">
            {feedback.caseTitle}
          </h1>
          <div className="flex flex-wrap gap-3 text-court-sm text-court-text-sec">
            <span className="flex items-center gap-1">
              <User size={12} className="text-court-text-ter" />
              {feedback.role}
            </span>
            <span className="flex items-center gap-1">
              <Mic size={12} className="text-court-text-ter" />
              {feedback.mode}
            </span>
            <Tag small>{feedback.module}</Tag>
          </div>
        </Card>
      </section>

      {/* Overall Score */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        <Card
          highlight
          className={`p-6 text-center border ${getScoreBgColor(feedback.overallScore)}`}
        >
          <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">
            Overall Score
          </p>
          <div className="flex items-center justify-center gap-3">
            <span
              className={`font-serif text-5xl font-bold ${getScoreTextColor(feedback.overallScore)}`}
            >
              {feedback.overallScore}
            </span>
            <div className="text-left">
              <p className="text-court-base text-court-text-sec">/ 100</p>
              <p className={`text-court-base font-bold ${getScoreTextColor(feedback.overallScore)}`}>
                {getScoreLabel(feedback.overallScore)}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Dimension Scores */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        <h2 className="font-serif text-lg font-bold text-court-text mb-3 px-1">
          Dimension Scores
        </h2>
        <Card className="p-4 space-y-4">
          {FEEDBACK_DIMENSIONS.map((dim) => {
            const score = feedback?.dimensions?.[dim.key] ?? 0;
            return (
              <div key={dim.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <DynamicIcon
                      name={dim.icon}
                      size={14}
                      className="text-court-text-ter"
                    />
                    <span className="text-court-base text-court-text-sec">{dim.label}</span>
                  </div>
                  <span
                    className={`text-court-base font-bold font-serif ${getScoreTextColor(score)}`}
                  >
                    {score}
                  </span>
                </div>
                <ProgressBar pct={score} color={getScoreColor(score)} height={6} />
              </div>
            );
          })}
        </Card>
      </section>

      {/* Written Feedback */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        <h2 className="font-serif text-lg font-bold text-court-text mb-3 px-1">
          Written Feedback
        </h2>
        <Card className="p-5">
          <p className="text-court-base text-court-text-sec leading-relaxed">
            {feedback.writtenFeedback}
          </p>
        </Card>
      </section>

      {/* Strengths */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        <h2 className="font-serif text-lg font-bold text-court-text mb-3 px-1">
          Strengths
        </h2>
        <Card className="p-4">
          <ul className="space-y-2.5">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <CheckCircle
                  size={15}
                  className="text-green-400 shrink-0 mt-0.5"
                />
                <span className="text-court-base text-court-text-sec leading-relaxed">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Areas for Improvement */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        <h2 className="font-serif text-lg font-bold text-court-text mb-3 px-1">
          Areas for Improvement
        </h2>
        <Card className="p-4">
          <ul className="space-y-2.5">
            {feedback.improvements.map((imp, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <Target
                  size={15}
                  className="text-gold shrink-0 mt-0.5"
                />
                <span className="text-court-base text-court-text-sec leading-relaxed">
                  {imp}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Back Link (bottom) */}
      <div className="px-4 md:px-6 lg:px-8 mt-6 text-center">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm text-gold font-semibold hover:text-gold/80 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
