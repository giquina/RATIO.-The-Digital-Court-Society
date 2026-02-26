"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Linkedin,
  Globe,
  AlertCircle,
} from "lucide-react";

interface Position {
  title: string;
  type: string;
  category: string;
}

const INPUT =
  "w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50 transition-colors";
const LABEL = "block text-sm font-semibold text-gray-300 mb-1.5";

export function CareerApplicationForm({
  position,
  onClose,
}: {
  position: Position;
  onClose: () => void;
}) {
  const generateUploadUrl = useMutation(anyApi.careers.generateCvUploadUrl);
  const submitApplication = useMutation(anyApi.careers.submitApplication);

  // Step 1: About you
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

  // Step 2: Your application
  const [coverMessage, setCoverMessage] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  // UI state
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canProceed = fullName.trim() && email.trim() && isValidEmail;
  const canSubmit = canProceed && coverMessage.trim().length >= 20 && !submitting;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("CV file must be under 10MB.");
      return;
    }
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setError("Only PDF, DOC, and DOCX files are accepted.");
      return;
    }
    setCvFile(file);
    setError("");
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      let cvStorageId: any = undefined;
      let cvFileName: string | undefined = undefined;

      if (cvFile) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": cvFile.type },
          body: cvFile,
        });
        if (!res.ok) throw new Error("Failed to upload CV");
        const { storageId } = await res.json();
        cvStorageId = storageId;
        cvFileName = cvFile.name;
      }

      await submitApplication({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        university: university.trim() || undefined,
        yearOfStudy: yearOfStudy || undefined,
        positionTitle: position.title,
        positionType: position.type,
        positionCategory: position.category,
        coverMessage: coverMessage.trim(),
        relevantExperience: relevantExperience.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        portfolioUrl: portfolioUrl.trim() || undefined,
        cvStorageId,
        cvFileName,
      });

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-[#0f1729] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="shrink-0 border-b border-white/10 px-5 py-4 flex items-start justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-white">Apply</h2>
            <p className="text-gray-400 text-sm mt-0.5">{position.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress */}
        {!success && (
          <div className="shrink-0 px-5 pt-4 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-[#C9A84C]" : "bg-white/10"}`} />
              <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-[#C9A84C]" : "bg-white/10"}`} />
            </div>
            <p className="text-xs text-gray-500">
              Step {step} of 2 — {step === 1 ? "About You" : "Your Application"}
            </p>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {success ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-[#C9A84C]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Application Submitted</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-2">
                Thank you for applying for <span className="text-white font-semibold">{position.title}</span>.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                We will review your application and get back to you within a few days. Keep an eye on your inbox.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl text-sm"
              >
                Done
              </button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4 pt-2">
              {/* LinkedIn Quick Fill */}
              <div className="bg-[#0A66C2]/8 border border-[#0A66C2]/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Linkedin size={18} className="text-[#0A66C2]" />
                  <span className="text-sm font-bold text-white">LinkedIn Profile</span>
                  <span className="text-xs text-gray-500 ml-auto">Recommended</span>
                </div>
                <p className="text-xs text-gray-400 mb-2.5">
                  Paste your LinkedIn URL so we can learn more about you.
                </p>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full bg-white/[0.06] border border-[#0A66C2]/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0A66C2]/50"
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-gray-500">Your details</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Full Name */}
              <div>
                <label className={LABEL}>Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className={INPUT}
                  autoFocus
                />
              </div>

              {/* Email */}
              <div>
                <label className={LABEL}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`${INPUT} ${email && !isValidEmail ? "border-red-400/50" : ""}`}
                />
                {email && !isValidEmail && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> Please enter a valid email
                  </p>
                )}
              </div>

              {/* University + Year */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>University</label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. UCL"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label className={LABEL}>Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    className={INPUT}
                  >
                    <option value="">Select...</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Postgrad">Postgraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              </div>

              {/* Next */}
              <button
                onClick={() => { if (canProceed) setStep(2); }}
                disabled={!canProceed}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#C9A84C]/90 transition-colors mt-2"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Cover Message */}
              <div>
                <label className={LABEL}>
                  Why are you interested in this role? *
                </label>
                <textarea
                  value={coverMessage}
                  onChange={(e) => setCoverMessage(e.target.value)}
                  placeholder="Tell us what excites you about this position and what you would bring..."
                  rows={5}
                  maxLength={2000}
                  className={`${INPUT} resize-none`}
                  autoFocus
                />
                <div className="flex justify-between mt-1">
                  {coverMessage.length < 20 && coverMessage.length > 0 ? (
                    <p className="text-orange-400 text-xs">At least 20 characters required</p>
                  ) : (
                    <span />
                  )}
                  <span className={`text-xs ${coverMessage.length > 1800 ? "text-orange-400" : "text-gray-600"}`}>
                    {coverMessage.length}/2000
                  </span>
                </div>
              </div>

              {/* Relevant Experience */}
              <div>
                <label className={LABEL}>Relevant Experience</label>
                <textarea
                  value={relevantExperience}
                  onChange={(e) => setRelevantExperience(e.target.value)}
                  placeholder="Any relevant experience, projects, or roles..."
                  rows={3}
                  maxLength={1500}
                  className={`${INPUT} resize-none`}
                />
              </div>

              {/* Portfolio URL */}
              <div>
                <label className={LABEL}>
                  <span className="flex items-center gap-1.5">
                    <Globe size={13} className="text-gray-400" />
                    Portfolio / GitHub
                  </span>
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://..."
                  className={INPUT}
                />
              </div>

              {/* CV Upload */}
              <div>
                <label className={LABEL}>CV / Resume</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {cvFile ? (
                  <div className="flex items-center gap-3 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl px-3.5 py-2.5">
                    <FileText size={16} className="text-[#C9A84C] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white truncate block">{cvFile.name}</span>
                      <span className="text-xs text-gray-500">{(cvFile.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                    <button
                      onClick={() => { setCvFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="text-gray-500 hover:text-white shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 bg-white/[0.03] border border-dashed border-white/15 rounded-xl px-3.5 py-4 text-sm text-gray-400 hover:border-[#C9A84C]/30 hover:text-gray-300 hover:bg-white/[0.04] transition-all"
                  >
                    <Upload size={16} />
                    <span>Upload PDF, DOC, or DOCX <span className="text-gray-600">(max 10MB)</span></span>
                  </button>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/5 border border-red-400/10 rounded-lg px-3 py-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-1.5 px-4 py-3 border border-white/10 rounded-xl text-sm text-gray-400 font-semibold hover:border-white/20 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#C9A84C]/90 transition-colors"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>

              <p className="text-gray-600 text-xs text-center">
                Your data is stored securely and only accessible to the RATIO team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
