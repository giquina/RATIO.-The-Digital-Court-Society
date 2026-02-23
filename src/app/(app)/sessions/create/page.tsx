"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Button, Tag, DynamicIcon } from "@/components/ui";
import { SESSION_TYPES, LAW_MODULES, MOOT_ROLES, MOCK_TRIAL_ROLES } from "@/lib/constants/app";
import { courtToast } from "@/lib/utils/toast";
import { BookOpen, FileText } from "lucide-react";

export default function CreateSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);
  const createSession = useMutation(anyApi.sessions.create);

  // Pre-fill from URL params (e.g., coming from Module Hub "Create Debate" CTA)
  const prefillType = searchParams.get("type") || "moot";
  const prefillModule = searchParams.get("module") || "";
  const prefillMotion = searchParams.get("motion") || "";

  const [sessionType, setSessionType] = useState(prefillType);
  const [module, setModule] = useState(prefillModule);
  const [title, setTitle] = useState(prefillMotion);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");
  const [location, setLocation] = useState("");
  const [crossUni, setCrossUni] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Debate-specific structured fields
  const [debateBackground, setDebateBackground] = useState(searchParams.get("background") || "");
  const [debateLegalIssue, setDebateLegalIssue] = useState("");
  const [debateArgsFor, setDebateArgsFor] = useState("");
  const [debateArgsAgainst, setDebateArgsAgainst] = useState("");
  const [debateClosing, setDebateClosing] = useState("");

  const isDebateMode = sessionType === "debate";

  const roles = sessionType === "mock_trial" ? MOCK_TRIAL_ROLES : MOOT_ROLES;
  const isValid = title.trim().length > 0 && module !== "" && date !== "";

  const inputClass = "w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter";
  const labelClass = "text-court-xs text-court-text-ter uppercase tracking-widest mb-1.5 block";

  const handleCreate = async () => {
    setSubmitted(true);
    if (!isValid || !profile) return;

    // Build rich description for debates
    const debateDescription = isDebateMode
      ? [
          debateBackground && `**Background:** ${debateBackground}`,
          debateLegalIssue && `**Legal Issue:** ${debateLegalIssue}`,
          debateArgsFor && `**Arguments For:** ${debateArgsFor}`,
          debateArgsAgainst && `**Arguments Against:** ${debateArgsAgainst}`,
          debateClosing && `**Closing Position:** ${debateClosing}`,
        ].filter(Boolean).join("\n\n")
      : undefined;

    const finalDescription = isDebateMode ? debateDescription : description;

    setIsCreating(true);
    try {
      await createSession({
        createdBy: profile._id,
        university: profile.university,
        module,
        type: sessionType,
        title,
        description: finalDescription || undefined,
        issueSummary: finalDescription || undefined,
        date,
        startTime,
        endTime,
        location: location || undefined,
        isCrossUniversity: crossUni,
        roles,
      });
      courtToast.success("Session created");
      router.push("/sessions");
    } catch (err) {
      courtToast.error("Failed to create session");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="pb-6">
      <div className="px-4 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
          {isDebateMode ? "Create Structured Debate" : "Create Session"}
        </h1>
        <p className="text-xs text-court-text-sec">
          {isDebateMode
            ? "Build a well-reasoned academic debate with structured arguments"
            : "Organise a moot, mock trial, or debate"}
        </p>
      </div>

      <div className="px-4 flex flex-col gap-3 md:gap-4">
        {/* Type */}
        <div>
          <label className={labelClass}>Session Type</label>
          <div className="grid grid-cols-3 gap-1.5">
            {SESSION_TYPES.filter((t) => t.value !== "workshop").map((t) => (
              <button
                key={t.value}
                onClick={() => setSessionType(t.value)}
                className={`py-2.5 rounded-xl text-center border text-court-sm font-bold transition-all ${
                  sessionType === t.value
                    ? "border-gold/40 bg-gold-dim text-gold"
                    : "border-court-border text-court-text-sec"
                }`}
              >
                <span className="flex justify-center mb-0.5"><DynamicIcon name={t.icon} size={18} className={sessionType === t.value ? "text-gold" : "text-court-text-sec"} /></span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module */}
        <div>
          <label className={labelClass}>Module / Area of Law</label>
          <select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className={`${inputClass} appearance-none`}
          >
            <option value="">Select module...</option>
            {LAW_MODULES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className={labelClass}>{isDebateMode ? "Motion" : "Session Title"}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isDebateMode ? "This House believes that..." : "e.g. Judicial Review of Executive Power"}
            className={`${inputClass} ${isDebateMode ? "font-serif" : ""}`}
          />
        </div>

        {/* Description / Issue Summary */}
        <div>
          <label className={labelClass}>{isDebateMode ? "Background Context" : "Issue Summary (optional)"}</label>
          <textarea
            value={isDebateMode ? debateBackground : description}
            onChange={(e) => isDebateMode ? setDebateBackground(e.target.value) : setDescription(e.target.value)}
            placeholder={isDebateMode ? "Set the context for this debate — relevant legal landscape, recent developments..." : "Brief description of the legal issue..."}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Structured Debate Sections (only for debate type) */}
        {isDebateMode && (
          <Card className="p-4 space-y-4 border-gold/10">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={14} className="text-gold" />
              <span className="text-court-xs font-bold text-court-text-ter uppercase tracking-widest">Structured Debate Framework</span>
            </div>

            <div>
              <label className={labelClass}>Legal Issue</label>
              <textarea
                value={debateLegalIssue}
                onChange={(e) => setDebateLegalIssue(e.target.value)}
                placeholder="What specific legal question does this debate address?"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Arguments For</label>
                <textarea
                  value={debateArgsFor}
                  onChange={(e) => setDebateArgsFor(e.target.value)}
                  placeholder="Key arguments supporting the motion..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className={labelClass}>Arguments Against</label>
                <textarea
                  value={debateArgsAgainst}
                  onChange={(e) => setDebateArgsAgainst(e.target.value)}
                  placeholder="Key arguments opposing the motion..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Closing Position (optional)</label>
              <textarea
                value={debateClosing}
                onChange={(e) => setDebateClosing(e.target.value)}
                placeholder="Your preliminary view on the matter..."
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </div>

            <p className="text-court-xs text-court-text-ter">
              <BookOpen size={11} className="inline mr-1" />
              This framework helps structure academic debate. All sections are optional but encouraged.
            </p>
          </Card>
        )}

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className={labelClass}>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Start</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>End</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Room number or 'Online'"
            className={inputClass}
          />
        </div>

        {/* Cross-university */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-court-base font-semibold text-court-text">Open to all universities</p>
            <p className="text-court-xs text-court-text-ter">Allow students from other universities to join</p>
          </div>
          <button
            onClick={() => setCrossUni(!crossUni)}
            className={`w-11 h-6 rounded-full transition-all ${crossUni ? "bg-gold" : "bg-white/10"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${crossUni ? "translate-x-5.5 ml-[22px]" : "ml-0.5"}`} />
          </button>
        </div>

        {/* Roles Preview */}
        <div>
          <label className={labelClass}>Roles ({roles.length} slots)</label>
          <Card className="p-3">
            {roles.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-court-border-light last:border-0">
                <span className="text-court-base text-court-text-sec">{r}</span>
                <span className="text-court-xs text-court-text-ter">Open</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Validation hints */}
        {submitted && !isValid && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-court-base text-red-400 font-semibold mb-1">Please complete required fields:</p>
            <ul className="text-court-sm text-red-400/80 list-disc pl-4 space-y-0.5">
              {!title.trim() && <li>Session title is required</li>}
              {!module && <li>Select a module / area of law</li>}
              {!date && <li>Set a date for the session</li>}
            </ul>
          </div>
        )}

        {/* Submit */}
        <Button
          fullWidth
          disabled={isCreating || !profile}
          onClick={handleCreate}
        >
          {isCreating ? "Creating..." : "Create Session"}
        </Button>
      </div>
    </div>
  );
}
