"use client";

import { useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, XCircle, Scale, Award, Loader2 } from "lucide-react";
import { QuerySafeBoundary } from "@/components/shared/QuerySafeBoundary";

const DIMENSION_LABELS: Record<string, string> = {
  argumentStructure: "Argument Structure",
  useOfAuthorities: "Use of Authorities",
  oralDelivery: "Oral Delivery",
  judicialHandling: "Judicial Handling",
  courtManner: "Court Manner",
  persuasiveness: "Persuasiveness",
  timeManagement: "Time Management",
};

function SkillBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-36 text-right shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C9A84C] rounded-full transition-all duration-700"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-white w-8">{score}</span>
    </div>
  );
}

function VerifyCertificateContent() {
  const params = useParams();
  const code = params?.code as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = useQuery(anyApi.certificates.verifyCertificate, code ? { code } : "skip");

  const isLoading = result === undefined;

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Scale size={24} className="text-[#C9A84C]" />
            <span className="font-serif text-lg font-bold tracking-[0.12em] text-white">
              RATIO<span className="text-[#C9A84C]">.</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 tracking-[0.15em] uppercase">Certificate Verification</p>
        </div>

        {isLoading ? (
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 text-center">
            <Loader2 size={32} className="text-[#C9A84C] animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Verifying certificate…</p>
          </div>
        ) : result?.valid ? (
          <div className="bg-white/[0.04] border border-[#C9A84C]/30 rounded-2xl overflow-hidden">
            {/* Verified banner */}
            <div className="bg-green-900/30 border-b border-green-500/20 px-6 py-4 flex items-center gap-3">
              <ShieldCheck size={24} className="text-green-400 shrink-0" />
              <div>
                <p className="text-green-300 font-bold text-sm">Verified Certificate</p>
                <p className="text-green-400/70 text-xs">This certificate is authentic and was issued by RATIO</p>
              </div>
            </div>

            {/* Certificate details */}
            <div className="p-6">
              <div className="text-center mb-6">
                <Award size={32} className="text-[#C9A84C] mx-auto mb-2" />
                <h1 className="font-serif text-xl font-bold text-white mb-1">{result.levelName}</h1>
                <p className="text-gray-400 text-sm">Certificate № {result.certificateNumber}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-gray-400">Awarded to</span>
                  <span className="text-sm font-semibold text-white">{result.recipientName}</span>
                </div>
                {result.university && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-400">University</span>
                    <span className="text-sm text-gray-300">{result.university}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-gray-400">Issued</span>
                  <span className="text-sm text-gray-300">
                    {result.issuedAt ? new Date(result.issuedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                  </span>
                </div>
                {result.totalSessions && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-400">Sessions completed</span>
                    <span className="text-sm text-gray-300">{result.totalSessions}</span>
                  </div>
                )}
                {result.overallAverage && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-xs text-gray-400">Overall average</span>
                    <span className="text-sm font-semibold text-[#C9A84C]">{result.overallAverage}/100</span>
                  </div>
                )}
              </div>

              {/* Skills breakdown */}
              {result.skillsSnapshot && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 tracking-[0.1em] uppercase mb-3">Skills Assessment</p>
                  <div className="space-y-2.5">
                    {Object.entries(result.skillsSnapshot).map(([key, val]) => (
                      <SkillBar key={key} label={DIMENSION_LABELS[key] ?? key} score={val as number} />
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              {result.strengths && result.strengths.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold text-green-400 mb-2">Strengths</p>
                    {result.strengths.map((s: string) => (
                      <p key={s} className="text-xs text-gray-300 mb-1">✓ {s}</p>
                    ))}
                  </div>
                  {result.improvements && result.improvements.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-amber-400 mb-2">Areas for Development</p>
                      {result.improvements.map((s: string) => (
                        <p key={s} className="text-xs text-gray-300 mb-1">→ {s}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Areas of law */}
              {result.areasOfLaw && result.areasOfLaw.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 tracking-[0.1em] uppercase mb-2">Areas Practised</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.areasOfLaw.map((area: string) => (
                      <span key={area} className="text-xs bg-white/[0.06] text-gray-300 px-2.5 py-1 rounded-lg">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 px-6 py-4 text-center">
              <p className="text-xs text-gray-500 leading-relaxed">
                This certificate was issued by RATIO — The Digital Court Society. It recognises structured advocacy
                practice assessed through AI and peer evaluation. It is not an academic qualification.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.04] border border-red-500/20 rounded-2xl p-8 text-center">
            <XCircle size={32} className="text-red-400 mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg mb-2">Certificate Not Found</h2>
            <p className="text-gray-400 text-sm mb-4">
              This verification code is invalid or the certificate has been revoked.
            </p>
            <Link
              href="/"
              className="text-[#C9A84C] text-sm font-semibold hover:text-[#C9A84C]/80 transition-colors"
            >
              Visit RATIO →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <QuerySafeBoundary
      fallback={
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4">
          <div className="w-full max-w-lg text-center">
            <Scale size={24} className="text-[#C9A84C] mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Certificate verification is temporarily unavailable. Please try again later.</p>
            <Link href="/" className="text-[#C9A84C] text-sm font-semibold mt-4 inline-block">Visit RATIO →</Link>
          </div>
        </div>
      }
    >
      <VerifyCertificateContent />
    </QuerySafeBoundary>
  );
}
