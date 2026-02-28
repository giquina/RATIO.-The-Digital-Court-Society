"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Tag, ProgressBar, SectionHeader, Button, EmptyState } from "@/components/ui";
import {
  BarChart3, Flame, Trophy, Target, Calendar, Download, Filter, ArrowRight, Loader2,
} from "lucide-react";
import {
  generatePortfolioPDF,
  downloadPDF,
  type PDFExportData,
} from "@/lib/utils/pdf-export";
import { courtToast } from "@/lib/utils/toast";

const FILTERS = ["All", "AI Judge", "Moot Sessions"];

function formatDate(ts: number): string {
  const d = new Date(ts);
  const day = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-GB", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${mon} ${year}`;
}

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

export default function PortfolioPage() {
  const [filter, setFilter] = useState(0);
  const [exporting, setExporting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profileQuery: any = useQuery(anyApi.users.myProfile);
  const isProfessional = profileQuery?.userType === "professional";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessions: any[] | undefined = useQuery(
    anyApi.aiSessions.getByProfile,
    profileQuery?._id ? { profileId: profileQuery._id } : "skip"
  );

  // CPD data for professional PDF export
  const currentYear = new Date().getFullYear();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cpdSummary: any = useQuery(
    anyApi.cpd.getMySummary,
    isProfessional ? { year: currentYear } : "skip"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cpdEntries: any[] | undefined = useQuery(
    anyApi.cpd.getMyEntries,
    isProfessional ? { year: currentYear } : "skip"
  );

  const completedSessions = (sessions ?? []).filter(
    (s: any) => s.status === "completed"
  );

  const filteredSessions = completedSessions.filter((s: any) => {
    if (filter === 0) return true;
    if (filter === 1) return s.mode === "AI Judge";
    if (filter === 2) return s.mode === "Moot";
    return true;
  });

  const avgScore =
    completedSessions.length > 0
      ? Math.round(
          completedSessions.reduce(
            (sum: number, s: any) => sum + (s.overallScore ?? 0),
            0
          ) / completedSessions.length
        )
      : 0;

  // Best module = module (areaOfLaw) with highest average score
  const moduleScores: Record<string, number[]> = {};
  completedSessions.forEach((s: any) => {
    const mod = s.areaOfLaw ?? "Unknown";
    if (!moduleScores[mod]) moduleScores[mod] = [];
    moduleScores[mod].push(s.overallScore ?? 0);
  });
  const bestModule =
    Object.keys(moduleScores).length > 0
      ? Object.entries(moduleScores).reduce(
          (best, [mod, scores]) => {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            return avg > best.avg ? { mod, avg } : best;
          },
          { mod: "", avg: 0 }
        ).mod
      : "N/A";

  // ── PDF Export (client-side with pdf-lib) ──
  const handleExport = async () => {
    if (!profileQuery) return;
    setExporting(true);
    try {
      const exportData: PDFExportData = {
        profile: {
          fullName: profileQuery.fullName ?? "Advocate",
          userType: profileQuery.userType ?? "student",
          university: profileQuery.university,
          yearOfStudy: profileQuery.yearOfStudy,
          professionalRole: profileQuery.professionalRole,
          firmOrChambers: profileQuery.firmOrChambers,
          practiceAreas: profileQuery.practiceAreas,
          totalSessions: completedSessions.length,
          averageScore: avgScore,
          bestModule,
          streakDays: profileQuery.streakDays ?? 0,
          rank: profileQuery.rank,
          chamber: profileQuery.chamber,
        },
        sessions: completedSessions.map((s: any) => ({
          date: formatDate(s._creationTime),
          title: s.caseTitle ?? "Untitled Session",
          role: s.mode === "AI Judge" ? "Counsel" : "Moot Participant",
          score: s.overallScore ?? 0,
          module: s.areaOfLaw ?? "Unknown",
          mode: s.mode ?? "Unknown",
        })),
        generatedAt: new Date().toLocaleDateString("en-GB", {
          day: "numeric", month: "long", year: "numeric",
        }),
      };

      // Include CPD data for professionals
      if (isProfessional && cpdSummary && cpdEntries) {
        exportData.cpd = {
          summary: {
            year: cpdSummary.year,
            totalHours: cpdSummary.totalHours,
            entryCount: cpdSummary.entryCount,
            targetHours: 12,
          },
          entries: cpdEntries.map((e: Record<string, unknown>) => ({
            date: e.date as string,
            title: e.title as string,
            activityType: e.activityType as string,
            durationMinutes: e.durationMinutes as number,
          })),
        };
      }

      const pdfBytes = await generatePortfolioPDF(exportData);
      const safeName = (profileQuery.fullName ?? "Portfolio").replace(/[^a-zA-Z0-9]/g, "_");
      downloadPDF(pdfBytes, `${safeName}_RATIO_Portfolio.pdf`);
      courtToast.success("Portfolio exported");
    } catch (err) {
      console.error("[PDF Export]", err);
      courtToast.error("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-court-text">
              {isProfessional ? "Professional Portfolio" : "Your Portfolio"}
            </h1>
            <p className="text-court-sm text-court-text-sec mt-1">
              {isProfessional
                ? `${profileQuery?.professionalRole ?? "Legal Professional"} ${profileQuery?.firmOrChambers ? `· ${profileQuery.firmOrChambers}` : ""}`
                : "Track your advocacy journey"}
            </p>
            {isProfessional && profileQuery?.practiceAreas?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {profileQuery.practiceAreas.map((area: string) => (
                  <Tag key={area} small color="gold">{area}</Tag>
                ))}
              </div>
            )}
          </div>
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={exporting || !profileQuery}>
            {exporting
              ? <><Loader2 size={14} className="inline mr-1.5 animate-spin" />Exporting…</>
              : <><Download size={14} className="inline mr-1.5" />Export PDF</>
            }
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <section className="px-4 md:px-6 lg:px-8 mb-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { icon: <BarChart3 size={16} className="text-court-text-sec" />, value: completedSessions.length.toString(), label: "Total Sessions" },
            { icon: <Target size={16} className="text-court-text-sec" />, value: `${avgScore}%`, label: "Average Score" },
            { icon: <Trophy size={16} className="text-court-text-sec" />, value: bestModule, label: "Best Module" },
            { icon: <Flame size={16} className="text-court-text-sec" />, value: `${profileQuery?.streakDays ?? 0} days`, label: "Current Streak" },
          ].map((stat) => (
            <Card key={stat.label} className="p-3.5">
              <div className="mb-2">{stat.icon}</div>
              <p className="font-serif text-lg font-bold text-court-text leading-tight">{stat.value}</p>
              <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Session History */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-3">
          <SectionHeader title="Session History" />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-4">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              onClick={() => setFilter(i)}
              className={`px-3.5 py-1.5 rounded-full text-court-sm font-bold border transition-all ${
                filter === i
                  ? "border-gold/40 bg-gold-dim text-gold"
                  : "border-court-border text-court-text-ter hover:text-court-text-sec"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Session Cards */}
        {sessions === undefined ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-court-text-ter" />
          </div>
        ) : completedSessions.length === 0 ? (
          <EmptyState
            icon={<BarChart3 size={28} />}
            title="No Sessions Yet"
            description="Complete your first Moot Court session to start building your portfolio."
            action={
              <Link href="/moot-court">
                <Button variant="outline" size="sm">Start Practice</Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredSessions.map((session: any) => (
                <Link key={session._id} href={`/feedback/${session._id}`}>
                  <Card className="p-4 hover:border-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-court-text-ter" />
                        <span className="text-court-sm text-court-text-ter">{formatDate(session._creationTime)}</span>
                      </div>
                      <Tag color={session.mode === "AI Judge" ? "blue" : "gold"} small>
                        {(session.mode ?? "Unknown").toUpperCase()}
                      </Tag>
                    </div>
                    <h3 className="text-court-md font-bold text-court-text mb-1 leading-tight">
                      {session.caseTitle ?? "Untitled Session"}
                    </h3>
                    <p className="text-court-sm text-court-text-sec mb-3">
                      {session.areaOfLaw ?? "Unknown"}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar pct={session.overallScore ?? 0} color={getScoreColor(session.overallScore ?? 0)} height={6} />
                      </div>
                      <span className={`text-court-base font-bold font-serif ${getScoreTextColor(session.overallScore ?? 0)}`}>
                        {session.overallScore ?? 0}%
                      </span>
                      <Tag small>{session.areaOfLaw ?? "Unknown"}</Tag>
                    </div>
                    <div className="flex items-center justify-end mt-2">
                      <span className="text-court-sm text-gold font-semibold flex items-center gap-1">
                        View Feedback <ArrowRight size={12} />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredSessions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-court-base text-court-text-ter">No sessions match this filter.</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
