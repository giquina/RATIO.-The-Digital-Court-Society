"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Button, Tag } from "@/components/ui";
import {
  Shield,
  Mail,
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  GraduationCap,
  Trophy,
  Landmark,
  Gavel,
} from "lucide-react";

type VerifyStep = "method" | "email" | "manual" | "pending" | "verified";

export default function VerifyPage() {
  const [step, setStep] = useState<VerifyStep>("method");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [university, setUniversity] = useState("");
  const [studentId, setStudentId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submitEmailVerification = useMutation(anyApi.verification.submitEmailVerification);
  const submitManualVerification = useMutation(anyApi.verification.submitManualVerification);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verificationStatus: any = useQuery(anyApi.verification.myVerificationStatus);

  // If user already has a pending or approved verification, reflect that
  const effectiveStep =
    verificationStatus?.status === "approved"
      ? "verified"
      : verificationStatus?.status === "pending"
        ? "pending"
        : step;

  const isAcUk = email.endsWith(".ac.uk");

  const handleEmailVerify = async () => {
    if (!email || !isAcUk) return;
    setSubmitting(true);
    setError("");
    try {
      await submitEmailVerification({ verificationEmail: email });
      setEmailSent(true);
      setTimeout(() => setStep("pending"), 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to submit verification request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSubmit = async () => {
    if (!university || !studentId) return;
    setSubmitting(true);
    setError("");
    try {
      await submitManualVerification({
        universityName: university,
        studentId,
      });
      setStep("pending");
    } catch (err: any) {
      setError(err?.message || "Failed to submit verification request");
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    { icon: Shield, label: "Chamber membership and university representation" },
    { icon: Trophy, label: "Inter-university rankings and tournaments" },
    { icon: Landmark, label: "Parliament voting rights and governance" },
    { icon: Gavel, label: "Tribunal participation" },
  ];

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-6 lg:px-8 pt-8 pb-12 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gold-dim flex items-center justify-center mx-auto mb-4">
          <Shield size={28} className="text-gold" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
          Student Verification
        </h1>
        <p className="text-court-sm text-court-text-sec">
          Verify your university status to unlock exclusive features.
        </p>
      </div>

      {/* Step: Choose Method */}
      {effectiveStep === "method" && (
        <div className="space-y-3">
          {/* Benefits section */}
          <Card className="p-5 mb-4">
            <h3 className="text-court-sm font-bold text-court-text mb-3 text-center">
              Verification unlocks
            </h3>
            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <b.icon size={18} className="text-gold shrink-0" />
                  <span className="text-court-xs text-court-text-sec">{b.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <p className="text-court-sm text-court-text-sec mb-4 text-center">
            Choose your verification method
          </p>

          {/* University Email */}
          <Card
            className="p-5 cursor-pointer hover:border-gold/20 transition-all"
            onClick={() => setStep("email")}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-court bg-gold-dim flex items-center justify-center shrink-0">
                <Mail size={22} className="text-gold" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-court-base font-bold text-court-text">
                    University Email
                  </h3>
                  <Tag color="green" small>Recommended</Tag>
                </div>
                <p className="text-court-xs text-court-text-sec">
                  Verify instantly with your .ac.uk university email address.
                  This is the fastest method.
                </p>
              </div>
              <ArrowRight size={16} className="text-court-text-ter mt-3" />
            </div>
          </Card>

          {/* Manual Verification */}
          <Card
            className="p-5 cursor-pointer hover:border-white/10 transition-all"
            onClick={() => setStep("manual")}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-court bg-white/[0.04] flex items-center justify-center shrink-0">
                <Upload size={22} className="text-court-text-sec" />
              </div>
              <div className="flex-1">
                <h3 className="text-court-base font-bold text-court-text mb-1">
                  Manual Verification
                </h3>
                <p className="text-court-xs text-court-text-sec">
                  Submit your student ID for manual review. Takes 1-2 working days.
                </p>
              </div>
              <ArrowRight size={16} className="text-court-text-ter mt-3" />
            </div>
          </Card>

          {/* Info */}
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-blue-400/5 border border-blue-400/10 mt-4">
            <GraduationCap size={14} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-court-xs text-blue-400/80">
              Verification confirms your university status and unlocks institutional features.
            </p>
          </div>

          {/* Skip for now */}
          <button
            onClick={() => window.location.href = "/home"}
            className="w-full text-center text-court-sm text-court-text-ter hover:text-gold transition-colors mt-6"
          >
            Skip for now — you can verify later in Settings
          </button>
        </div>
      )}

      {/* Step: Email Verification */}
      {effectiveStep === "email" && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-court-base font-bold text-court-text mb-3">
              University Email Verification
            </h3>
            <div>
              <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                YOUR UNIVERSITY EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.ac.uk"
                className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
              />
              {email && !isAcUk && (
                <p className="text-court-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertTriangle size={12} />
                  Must be a .ac.uk email address
                </p>
              )}
              {email && isAcUk && (
                <p className="text-court-xs text-green-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Valid university email domain
                </p>
              )}
            </div>

            {error && (
              <p className="text-court-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                {error}
              </p>
            )}

            <Button
              onClick={handleEmailVerify}
              disabled={!isAcUk || emailSent || submitting}
              fullWidth
              className="mt-4"
            >
              {submitting ? "Submitting..." : emailSent ? "Verification Request Sent" : "Submit Verification Request"}
            </Button>
          </Card>

          <button
            onClick={() => { setStep("method"); setError(""); }}
            className="w-full text-center text-court-xs text-court-text-ter hover:text-court-text"
          >
            Choose a different method
          </button>
        </div>
      )}

      {/* Step: Manual Verification */}
      {effectiveStep === "manual" && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-court-base font-bold text-court-text mb-3">
              Manual Verification
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  UNIVERSITY NAME
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. University College London"
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                />
              </div>

              <div>
                <label className="block text-court-sm font-bold text-court-text-sec tracking-wider mb-1.5">
                  STUDENT ID NUMBER
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Your student ID"
                  className="w-full bg-navy-mid border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                />
              </div>

              <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-white/[0.02] border border-court-border">
                <Shield size={14} className="text-court-text-ter shrink-0 mt-0.5" />
                <p className="text-court-xs text-court-text-ter">
                  Your student ID is encrypted and used only for verification purposes.
                  It is not shared with other users. Compliant with UK GDPR.
                </p>
              </div>
            </div>

            {error && (
              <p className="text-court-xs text-red-400 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} />
                {error}
              </p>
            )}

            <Button
              onClick={handleManualSubmit}
              disabled={!university || !studentId || submitting}
              fullWidth
              className="mt-4"
            >
              {submitting ? "Submitting..." : "Submit for Review"}
            </Button>
          </Card>

          <button
            onClick={() => { setStep("method"); setError(""); }}
            className="w-full text-center text-court-xs text-court-text-ter hover:text-court-text"
          >
            Choose a different method
          </button>
        </div>
      )}

      {/* Step: Pending */}
      {effectiveStep === "pending" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-400/10 flex items-center justify-center mx-auto">
            <Clock size={28} className="text-orange-400" />
          </div>
          <h2 className="font-serif text-xl font-bold text-court-text">
            Verification Pending
          </h2>
          <p className="text-court-sm text-court-text-sec max-w-sm mx-auto">
            Your verification is being processed. You will receive a notification
            once your status has been confirmed.
          </p>
          <Card className="p-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-green-400" />
                <span className="text-court-sm text-court-text-sec">
                  Submission received
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-orange-400" />
                <span className="text-court-sm text-court-text-sec">
                  Under review (1-2 working days)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded-full border border-court-border" />
                <span className="text-court-sm text-court-text-ter">
                  Verification confirmed
                </span>
              </div>
            </div>
          </Card>
          <Button onClick={() => window.location.href = "/home"} variant="secondary" fullWidth>
            Continue to Ratio
          </Button>
        </div>
      )}

      {/* Step: Verified */}
      {effectiveStep === "verified" && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} className="text-green-400" />
          </div>
          <h2 className="font-serif text-xl font-bold text-court-text">
            Verified Advocate
          </h2>
          <p className="text-court-sm text-court-text-sec max-w-sm mx-auto">
            Your student status has been verified. You now have full access to
            all governance and institutional features.
          </p>
          <Button onClick={() => window.location.href = "/home"} fullWidth>
            Enter Ratio
          </Button>
        </div>
      )}
    </div>
  );
}
