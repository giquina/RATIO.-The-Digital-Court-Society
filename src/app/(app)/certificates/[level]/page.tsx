"use client";

import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Card, Tag, Skeleton, Button } from "@/components/ui";
import { CheckCircle2, Circle, ArrowLeft, Award, Lock, ShieldCheck, ExternalLink, TrendingUp, Download } from "lucide-react";
import { courtToast } from "@/lib/utils/toast";
import { generateCertificatePDF, downloadCertificatePDF } from "@/lib/utils/certificate-pdf";
import type { CertificateData } from "@/lib/utils/certificate-pdf";

const DIMENSION_LABELS: Record<string, string> = {
  argumentStructure: "Argument Structure",
  useOfAuthorities: "Use of Authorities",
  oralDelivery: "Oral Delivery",
  judicialHandling: "Judicial Handling",
  courtManner: "Court Manner",
  persuasiveness: "Persuasiveness",
  timeManagement: "Time Management",
};

function SkillBar({ label, score, threshold }: { label: string; score: number; threshold: number }) {
  const met = score >= threshold;
  return (
    <div className="flex items-center gap-3">
      <span className="text-court-xs text-court-text-sec w-32 text-right shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden relative">
        {threshold > 0 && (
          <div className="absolute top-0 h-full w-px bg-gold/40" style={{ left: `${threshold}%` }} />
        )}
        <div
          className={`h-full rounded-full transition-all duration-700 ${met ? "bg-green-500" : "bg-gold"}`}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
      <span className={`text-court-xs font-bold w-8 ${met ? "text-green-500" : "text-court-text"}`}>{score}</span>
    </div>
  );
}

export default function CertificateLevelPage() {
  const params = useParams();
  const router = useRouter();
  const levelKey = params?.level as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = useQuery(anyApi.certificates.getMyProgress);
  const issueCertificate = useMutation(anyApi.certificates.issueCertificate);
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    if (claiming) return;
    setClaiming(true);
    try {
      await issueCertificate({
        level: levelKey,
        paymentStatus: "included_in_subscription",
      });
      courtToast.success("Certificate claimed!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      courtToast.error("Could not claim certificate", message);
    } finally {
      setClaiming(false);
    }
  };

  if (data === undefined) {
    return (
      <div className="pb-6 md:max-w-content-medium mx-auto">
        <div className="px-4 md:px-6 lg:px-8 pt-3">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-6" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full mb-2" />
          ))}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const level = data?.progress?.find((p: any) => p.level === levelKey);
  if (!level) {
    return (
      <div className="pb-6 md:max-w-content-medium mx-auto px-4 pt-6 text-center">
        <Award size={32} className="text-court-text-ter mx-auto mb-3" />
        <p className="text-court-text-sec">Certificate level not found.</p>
        <Link href="/certificates" className="text-gold text-court-sm mt-2 inline-block">← Back to Certificates</Link>
      </div>
    );
  }

  const isIssued = level.certificate?.status === "issued";
  const canClaim = level.allRequirementsMet && !isIssued;

  // Get dimension score threshold for this level
  const thresholdMap: Record<string, number> = {
    foundation: 0,
    intermediate: 70,
    advanced: 80,
  };
  const dimensionThreshold = thresholdMap[levelKey] ?? 0;

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Back nav */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <button
          onClick={() => router.push("/certificates")}
          className="flex items-center gap-1.5 text-court-sm text-court-text-sec hover:text-court-text transition-colors mb-3"
        >
          <ArrowLeft size={16} /> All Certificates
        </button>
      </div>

      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8">
        <div className="flex items-start gap-3 mb-1">
          <div className="w-3 h-3 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: level.color }} />
          <div>
            <h1 className="font-serif text-xl font-bold text-court-text">{level.name}</h1>
            <p className="text-court-sm text-court-text-sec mt-1">{level.description}</p>
          </div>
        </div>

        {/* Status banner */}
        {isIssued ? (
          <Card className="mt-4 p-4 border-green-500/20 bg-green-900/10">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-green-400 shrink-0" />
              <div className="flex-1">
                <p className="text-court-sm font-bold text-green-300">Certificate Issued</p>
                <p className="text-court-xs text-green-400/70">
                  № {level.certificate.certificateNumber} · Issued {new Date(level.certificate.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <Link
                href={`/certificates/verify/${level.certificate.verificationCode}`}
                className="flex items-center gap-1 text-court-xs font-semibold text-gold"
              >
                <ExternalLink size={12} /> View
              </Link>
              <button
                onClick={async () => {
                  const certInfo: CertificateData = {
                    recipientName: data.profileName,
                    levelName: level.name,
                    levelShortName: level.shortName,
                    certificateNumber: level.certificate.certificateNumber,
                    verificationCode: level.certificate.verificationCode,
                    issuedAt: level.certificate.issuedAt,
                    overallAverage: level.certificate.overallAverage ?? 0,
                    totalSessions: level.certificate.totalSessions ?? 0,
                    skillsSnapshot: level.certificate.skillsSnapshot ?? {},
                    areasOfLaw: level.certificate.areasOfLaw ?? [],
                    strengths: level.certificate.strengths ?? [],
                    improvements: level.certificate.improvements ?? [],
                  };
                  const pdfBytes = await generateCertificatePDF(certInfo);
                  downloadCertificatePDF(pdfBytes, `RATIO-${level.shortName}-Certificate.pdf`);
                }}
                className="flex items-center gap-1 text-court-xs font-semibold text-court-text-sec hover:text-court-text transition-colors"
              >
                <Download size={12} /> PDF
              </button>
            </div>
          </Card>
        ) : canClaim ? (
          <Card className="mt-4 p-4 border-gold/30 bg-gold-dim" highlight>
            <div className="flex items-center gap-3">
              <Award size={24} className="text-gold shrink-0" />
              <div className="flex-1">
                <p className="text-court-sm font-bold text-gold">All Requirements Met!</p>
                <p className="text-court-xs text-court-text-sec">
                  £{(level.price / 100).toFixed(2)} one-time purchase · or included free with any subscription
                </p>
              </div>
              <Button size="sm" onClick={handleClaim} disabled={claiming}>
                {claiming ? "Claiming…" : "Claim Now"}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-court-xs text-court-text-ter">
            <Lock size={14} />
            <span>
              {level.completedChecks}/{level.totalChecks} requirements complete · {level.percentComplete}% progress
            </span>
          </div>
        )}
      </div>

      {/* Requirements checklist */}
      <div className="px-4 md:px-6 lg:px-8 mt-5">
        <h2 className="text-court-xs font-bold text-court-text-ter tracking-[0.15em] uppercase mb-3">Requirements</h2>
        <Card className="p-4">
          <div className="space-y-3">
            {level.checks.map((check: { label: string; done: boolean; current: number; target: number }, i: number) => (
              <div key={i} className="flex items-start gap-3">
                {check.done ? (
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle size={18} className="text-court-text-ter shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-court-sm ${check.done ? "text-court-text" : "text-court-text-sec"}`}>
                    {check.label}
                  </p>
                  {!check.done && check.target > 1 && (
                    <div className="mt-1.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((check.current / check.target) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-court-xs text-court-text-ter shrink-0">{check.current}/{check.target}</span>
                    </div>
                  )}
                </div>
                {check.done && (
                  <Tag color="green" small>Done</Tag>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills breakdown */}
      {level.dimensionScores && (
        <div className="px-4 md:px-6 lg:px-8 mt-5">
          <h2 className="text-court-xs font-bold text-court-text-ter tracking-[0.15em] uppercase mb-3">
            Skills Assessment
            {dimensionThreshold > 0 && (
              <span className="font-normal ml-2">(target: {dimensionThreshold}+)</span>
            )}
          </h2>
          <Card className="p-4">
            <div className="space-y-2.5">
              {Object.entries(level.dimensionScores).map(([key, val]) => (
                <SkillBar
                  key={key}
                  label={DIMENSION_LABELS[key] ?? key}
                  score={val as number}
                  threshold={dimensionThreshold}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Areas of law */}
      {level.areasOfLaw && level.areasOfLaw.length > 0 && (
        <div className="px-4 md:px-6 lg:px-8 mt-5">
          <h2 className="text-court-xs font-bold text-court-text-ter tracking-[0.15em] uppercase mb-3">Areas Practised</h2>
          <div className="flex flex-wrap gap-1.5">
            {level.areasOfLaw.map((area: string) => (
              <span key={area} className="text-court-xs bg-white/[0.06] text-court-text-sec px-3 py-1.5 rounded-lg border border-white/5">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      {!isIssued && (
        <div className="px-4 md:px-6 lg:px-8 mt-6">
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={18} className="text-gold" />
              <p className="text-court-sm font-bold text-court-text">Keep Progressing</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/moot-court">
                <Button variant="outline" size="sm" className="w-full text-court-xs">Advocacy →</Button>
              </Link>
              <Link href="/sessions">
                <Button variant="outline" size="sm" className="w-full text-court-xs">Group Moots →</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}

      {/* Disclaimer */}
      <div className="px-4 md:px-6 lg:px-8 mt-6">
        <p className="text-court-xs text-court-text-ter leading-relaxed">
          This certificate recognises structured advocacy practice assessed through AI and peer evaluation.
          It is not an academic qualification and does not constitute professional accreditation by the SRA, BSB, or any regulatory body.
        </p>
      </div>
    </div>
  );
}
