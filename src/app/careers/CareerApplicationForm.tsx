"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { X, Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";

interface Position {
  title: string;
  type: string;
  category: string;
}

export function CareerApplicationForm({
  position,
  onClose,
}: {
  position: Position;
  onClose: () => void;
}) {
  const generateUploadUrl = useMutation(anyApi.careers.generateCvUploadUrl);
  const submitApplication = useMutation(anyApi.careers.submitApplication);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [coverMessage, setCoverMessage] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit = fullName && email && coverMessage && !submitting;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("CV file must be under 10MB.");
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

      // Upload CV if provided
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
        fullName,
        email,
        university: university || undefined,
        yearOfStudy: yearOfStudy || undefined,
        positionTitle: position.title,
        positionType: position.type,
        positionCategory: position.category,
        coverMessage,
        relevantExperience: relevantExperience || undefined,
        portfolioUrl: portfolioUrl || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#0f1729] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1729] border-b border-white/10 px-5 py-4 flex items-start justify-between z-10">
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

        {success ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={40} className="text-[#C9A84C] mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Application Submitted</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Thank you for applying. We will review your application and get back to you within a few days.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            {/* University + Year */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  University
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. UCL"
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  Year of Study
                </label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#C9A84C]/50"
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

            {/* Cover Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Why are you interested in this role? *
              </label>
              <textarea
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                placeholder="Tell us what excites you about this position and what you would bring..."
                rows={4}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50 resize-none"
              />
            </div>

            {/* Relevant Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Relevant Experience
              </label>
              <textarea
                value={relevantExperience}
                onChange={(e) => setRelevantExperience(e.target.value)}
                placeholder="Any relevant experience, projects, or roles..."
                rows={3}
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50 resize-none"
              />
            </div>

            {/* Portfolio URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Portfolio / LinkedIn / GitHub
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50"
              />
            </div>

            {/* CV Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                CV / Resume
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              {cvFile ? (
                <div className="flex items-center gap-3 bg-white/[0.06] border border-white/10 rounded-xl px-3.5 py-2.5">
                  <FileText size={16} className="text-[#C9A84C] shrink-0" />
                  <span className="text-sm text-white truncate flex-1">{cvFile.name}</span>
                  <button
                    onClick={() => { setCvFile(null); if (fileRef.current) fileRef.current.value = ""; }}
                    className="text-gray-500 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 bg-white/[0.04] border border-dashed border-white/15 rounded-xl px-3.5 py-3 text-sm text-gray-400 hover:border-[#C9A84C]/30 hover:text-gray-300 transition-colors"
                >
                  <Upload size={16} />
                  Upload PDF, DOC, or DOCX (max 10MB)
                </button>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#C9A84C] text-[#0B1120] font-bold rounded-xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#C9A84C]/90 transition-colors"
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

            <p className="text-gray-500 text-xs text-center">
              Your application data is stored securely and only accessible to the RATIO team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
