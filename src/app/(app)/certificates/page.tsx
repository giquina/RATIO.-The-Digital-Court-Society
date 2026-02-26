"use client";

import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useState } from "react";
import { Card, Tag, Skeleton } from "@/components/ui";
import { Award, CheckCircle2, Circle, Lock, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { courtToast } from "@/lib/utils/toast";

function ProgressRing({ percent, color, size = 48 }: { percent: number; color: string; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        className="transition-all duration-700"
      />
    </svg>
  );
}

function CertificateCard({ level, onClaim, claiming }: { level: {
  level: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  price: number;
  checks: { label: string; done: boolean; current: number; target: number }[];
  completedChecks: number;
  totalChecks: number;
  percentComplete: number;
  allRequirementsMet: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  certificate: any;
}; onClaim: (levelKey: string) => void; claiming: string | null }) {
  const isIssued = level.certificate?.status === "issued";
  const canClaim = level.allRequirementsMet && !isIssued;

  return (
    <Card
      className={`p-5 relative overflow-hidden ${isIssued ? "border-gold/30" : ""}`}
      highlight={canClaim}
    >
      {/* Color accent */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l" style={{ backgroundColor: level.color }} />

      <div className="flex items-start gap-4">
        {/* Progress ring */}
        <div className="relative">
          <ProgressRing percent={isIssued ? 100 : level.percentComplete} color={level.color} size={56} />
          <div className="absolute inset-0 flex items-center justify-center">
            {isIssued ? (
              <ShieldCheck size={20} className="text-gold" />
            ) : (
              <span className="text-court-xs font-bold text-court-text">{level.percentComplete}%</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif text-base font-bold text-court-text truncate">{level.shortName}</h3>
            {isIssued && <Tag color="gold" small>ISSUED</Tag>}
            {canClaim && <Tag color="gold" small>READY</Tag>}
          </div>
          <p className="text-court-xs text-court-text-ter mb-3 line-clamp-2">{level.description}</p>

          {/* Requirements preview */}
          <div className="space-y-1.5 mb-3">
            {level.checks.slice(0, 4).map((check, i) => (
              <div key={i} className="flex items-center gap-2 text-court-xs">
                {check.done ? (
                  <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                ) : (
                  <Circle size={14} className="text-court-text-ter shrink-0" />
                )}
                <span className={check.done ? "text-court-text-sec" : "text-court-text-ter"}>
                  {check.label}
                  {!check.done && check.target > 1 && (
                    <span className="text-court-text-ter"> ({check.current}/{check.target})</span>
                  )}
                </span>
              </div>
            ))}
            {level.checks.length > 4 && (
              <p className="text-court-xs text-court-text-ter pl-[22px]">
                +{level.checks.length - 4} more requirement{level.checks.length - 4 > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Actions */}
          {isIssued ? (
            <div className="flex gap-2">
              <Link
                href={`/certificates/verify/${level.certificate.verificationCode}`}
                className="flex items-center gap-1.5 text-court-xs font-semibold text-gold hover:text-gold/80 transition-colors"
              >
                <ExternalLink size={12} /> View Certificate
              </Link>
            </div>
          ) : canClaim ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClaim(level.level);
              }}
              disabled={claiming === level.level}
              className="flex items-center gap-1.5 px-4 py-2 bg-gold text-navy text-court-sm font-bold rounded-xl hover:bg-gold/90 transition-colors disabled:opacity-60"
            >
              <Award size={14} /> {claiming === level.level ? "Claiming…" : "Claim Certificate"}
            </button>
          ) : (
            <div className="flex items-center gap-2 text-court-xs text-court-text-ter">
              <Lock size={12} />
              <span>Complete all requirements to unlock</span>
              {level.price > 0 && <span>• £{(level.price / 100).toFixed(2)} (or included with subscription)</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function CertificatesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = useQuery(anyApi.certificates.getMyProgress);
  const isLoading = data === undefined;
  const issueCertificate = useMutation(anyApi.certificates.issueCertificate);
  const [claiming, setClaiming] = useState<string | null>(null);

  const handleClaim = async (levelKey: string) => {
    if (claiming) return;
    setClaiming(levelKey);
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
      setClaiming(null);
    }
  };

  return (
    <div className="pb-6 md:max-w-content-medium mx-auto">
      {/* Header */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-2">
        <h1 className="font-serif text-2xl font-bold text-court-text">Certificates</h1>
        <p className="text-court-sm text-court-text-sec mt-1">
          Earn verified advocacy credentials signed by the Founder of RATIO
        </p>
      </div>

      {/* Info banner */}
      <div className="px-4 md:px-6 lg:px-8 mt-3">
        <Card className="p-4 bg-gold-dim border-gold/20">
          <div className="flex items-start gap-3">
            <Award size={20} className="text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-court-sm font-semibold text-court-text mb-1">
                Professional Advocacy Certificates
              </p>
              <p className="text-court-xs text-court-text-sec leading-relaxed">
                Complete structured requirements, get assessed across 7 dimensions of advocacy, and earn a verified certificate
                with a unique QR code that anyone can scan to confirm. Certificates are included free for all subscribers,
                or available as one-time purchases.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Certificate levels */}
      <div className="px-4 md:px-6 lg:px-8 mt-5 space-y-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-5">
                <div className="flex gap-4">
                  <Skeleton rounded className="w-14 h-14 shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-full mb-3" />
                    <Skeleton className="h-3 w-48 mb-1.5" />
                    <Skeleton className="h-3 w-40 mb-1.5" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
              </Card>
            ))}
          </>
        ) : data?.progress ? (
          data.progress.map((level: Parameters<typeof CertificateCard>[0]["level"]) => (
            <Link key={level.level} href={`/certificates/${level.level}`}>
              <CertificateCard level={level} onClaim={handleClaim} claiming={claiming} />
            </Link>
          ))
        ) : (
          <Card className="p-6 text-center">
            <Award size={32} className="text-court-text-ter mx-auto mb-3" />
            <p className="text-court-text-sec text-court-sm">
              Sign in to track your certificate progress
            </p>
          </Card>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-4 md:px-6 lg:px-8 mt-6">
        <p className="text-court-xs text-court-text-ter leading-relaxed">
          RATIO certificates are professional development credentials recognising structured advocacy practice
          assessed through AI and peer evaluation. They are not academic qualifications and do not constitute
          professional accreditation by the Solicitors Regulation Authority, Bar Standards Board, or any regulatory body.
        </p>
      </div>
    </div>
  );
}
