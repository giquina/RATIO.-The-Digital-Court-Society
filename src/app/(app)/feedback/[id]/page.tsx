"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Tag, ProgressBar, DynamicIcon } from "@/components/ui";
import { FEEDBACK_DIMENSIONS } from "@/lib/constants/app";
import {
  ArrowLeft, Calendar, User, Mic, CheckCircle, Target, Loader2,
} from "lucide-react";
import { AIDisclaimer } from "@/components/shared/AIDisclaimer";

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

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const session: any = useQuery(anyApi.aiSessions.getById, { sessionId: id as any });

  // Loading state
  if (session === undefined) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 size={24} className="animate-spin text-court-text-ter" />
      </div>
    );
  }

  // Not found state
  if (session === null) {
    return (
      <div className="text-center py-16">
        <h3 className="font-serif text-lg font-bold text-court-text mb-2">Session Not Found</h3>
        <Link href="/portfolio" className="text-gold hover:underline">Back to Portfolio</Link>
      </div>
    );
  }

  // Map session data to feedback display values
  const modeLabel = session.mode === "judge" ? "AI Judge" : "Moot";
  const modeColor: "blue" | "gold" = session.mode === "judge" ? "blue" : "gold";
  const date = formatDate(session._creationTime);
  const overallScore = session.overallScore ?? 0;
  const dimensions = session.scores ?? {};

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Back Link */}
      <div className="px-4 md:px-6 lg:px-8 pt-3">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-court-sm text-court-text-sec hover:text-court-text transition-colors"
        >
          <ArrowLeft size={14} /> Back to Portfolio
        </Link>
      </div>

      {/* Header Card */}
      <section className="px-4 md:px-6 lg:px-8 mt-3">
        <Card className="p-5">
          <div className="flex items-start justify-between mb-3">
            <Tag color={modeColor}>
              {modeLabel.toUpperCase()}
            </Tag>
            <div className="flex items-center gap-1.5 text-court-text-ter">
              <Calendar size={12} />
              <span className="text-court-sm">{date}</span>
            </div>
          </div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-2 leading-tight">
            {session.caseTitle}
          </h1>
          <div className="flex flex-wrap gap-3 text-court-sm text-court-text-sec">
            <span className="flex items-center gap-1">
              <User size={12} className="text-court-text-ter" />
              Counsel
            </span>
            <span className="flex items-center gap-1">
              <Mic size={12} className="text-court-text-ter" />
              {modeLabel}
            </span>
            <Tag small>{session.areaOfLaw}</Tag>
          </div>
        </Card>
      </section>

      {/* Overall Score */}
      <section className="px-4 md:px-6 lg:px-8 mt-4">
        <Card
          highlight
          className={`p-6 text-center border ${getScoreBgColor(overallScore)}`}
        >
          <p className="text-court-xs text-court-text-ter uppercase tracking-widest mb-2">
            Overall Score
          </p>
          <div className="flex items-center justify-center gap-3">
            <span
              className={`font-serif text-5xl font-bold ${getScoreTextColor(overallScore)}`}
            >
              {overallScore}
            </span>
            <div className="text-left">
              <p className="text-court-base text-court-text-sec">/ 100</p>
              <p className={`text-court-base font-bold ${getScoreTextColor(overallScore)}`}>
                {getScoreLabel(overallScore)}
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
            const score = dimensions?.[dim.key] ?? 0;
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
      {session.aiJudgment && (
        <section className="px-4 md:px-6 lg:px-8 mt-4">
          <h2 className="font-serif text-lg font-bold text-court-text mb-3 px-1">
            Written Feedback
          </h2>
          <Card className="p-5">
            <p className="text-court-base text-court-text-sec leading-relaxed whitespace-pre-line">
              {session.aiJudgment}
            </p>
          </Card>
        </section>
      )}

      {/* Key Improvement */}
      {session.keyImprovement && (
        <section className="px-4 md:px-6 lg:px-8 mt-4">
          <h2 className="font-serif text-lg font-bold text-court-text mb-3 px-1">
            Key Area for Improvement
          </h2>
          <Card className="p-4">
            <div className="flex gap-2.5 items-start">
              <Target
                size={15}
                className="text-gold shrink-0 mt-0.5"
              />
              <span className="text-court-base text-court-text-sec leading-relaxed">
                {session.keyImprovement}
              </span>
            </div>
          </Card>
        </section>
      )}

      {/* AI Disclaimer */}
      <section className="px-4 md:px-6 lg:px-8 mt-6">
        <AIDisclaimer variant="full" />
      </section>

      {/* Back Link (bottom) */}
      <div className="px-4 md:px-6 lg:px-8 mt-6 text-center">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-court-base text-gold font-semibold hover:text-gold/80 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
      </div>
    </div>
  );
}
