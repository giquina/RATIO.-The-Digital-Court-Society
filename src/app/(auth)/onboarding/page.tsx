"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { UK_UNIVERSITIES, UK_UNIVERSITIES_BY_REGION, UK_REGIONS } from "@/lib/constants/uk-universities";
import { LAW_MODULES, CHAMBERS, PROFESSIONAL_ROLES, PRACTICE_AREAS } from "@/lib/constants/app";
import { useAuthStore } from "@/stores/authStore";
import { Loader2, SkipForward, GraduationCap, Scale } from "lucide-react";
import { courtToast } from "@/lib/utils/toast";

// ── Types ──
type UserType = "student" | "professional" | null;
type Step = 0 | 1 | 2 | 3 | 4;

const STORAGE_KEY = "ratio_onboarding";

function loadSaved() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Step labels change based on the user type path
const STUDENT_STEPS = ["University", "Year", "Modules", "Chamber"];
const PROFESSIONAL_STEPS = ["Role", "Firm", "Practice Areas", "Chamber"];

export default function OnboardingPage() {
  const createProfile = useMutation(anyApi.users.createProfile);
  const claimMyReferral = useMutation(anyApi.referrals.claimMyReferral);
  const linkProfileToReferral = useMutation(anyApi.referrals.linkProfileToReferral);
  const skipOnboarding = useAuthStore((s) => s.skipOnboarding);

  // ── Shared state (initialise with safe defaults — restored from localStorage below) ──
  const [step, setStep] = useState<Step>(0);
  const [userType, setUserType] = useState<UserType>(null);
  const [chamber, setChamber] = useState("");
  const [saving, setSaving] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // ── Student state ──
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [modules, setModules] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [showRegions, setShowRegions] = useState(false);

  // ── Professional state ──
  const [professionalRole, setProfessionalRole] = useState("");
  const [firmOrChambers, setFirmOrChambers] = useState("");
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);

  // ── Restore saved progress AFTER mount (avoids server/client hydration mismatch) ──
  useEffect(() => {
    const saved = loadSaved();
    if (saved) {
      if (saved.step != null) setStep(saved.step);
      if (saved.userType) setUserType(saved.userType);
      if (saved.chamber) setChamber(saved.chamber);
      if (saved.university) setUniversity(saved.university);
      if (saved.year != null) setYear(saved.year);
      if (saved.modules) setModules(saved.modules);
      if (saved.professionalRole) setProfessionalRole(saved.professionalRole);
      if (saved.firmOrChambers) setFirmOrChambers(saved.firmOrChambers);
      if (saved.practiceAreas) setPracticeAreas(saved.practiceAreas);
    }
    setHydrated(true);
  }, []);

  // ── Persist progress ──
  const persist = useCallback(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step, userType, university, year, modules, chamber,
          professionalRole, firmOrChambers, practiceAreas,
        })
      );
    } catch {}
  }, [step, userType, university, year, modules, chamber, professionalRole, firmOrChambers, practiceAreas]);

  useEffect(() => { persist(); }, [persist]);

  // ── University search ──
  const filteredUnis = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q && !showRegions) return UK_UNIVERSITIES;
    if (!q && showRegions) return UK_UNIVERSITIES;
    return UK_UNIVERSITIES.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.short.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q)
    );
  }, [search, showRegions]);

  const groupedUnis = useMemo(() => {
    if (!showRegions) return null;
    const groups: Record<string, typeof filteredUnis> = {};
    for (const uni of filteredUnis) {
      for (const region of UK_REGIONS) {
        if (UK_UNIVERSITIES_BY_REGION[region].some((u) => u.name === uni.name)) {
          if (!groups[region]) groups[region] = [];
          groups[region].push(uni);
          break;
        }
      }
    }
    return groups;
  }, [filteredUnis, showRegions]);

  // ── Helpers ──
  const stepLabels = userType === "professional" ? PROFESSIONAL_STEPS : STUDENT_STEPS;

  const toggleModule = (m: string) => {
    setModules((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const togglePracticeArea = (area: string) => {
    setPracticeAreas((prev) =>
      prev.includes(area) ? prev.filter((x) => x !== area) : [...prev, area]
    );
  };

  const next = () => setStep((s) => Math.min(4, s + 1) as Step);
  const back = () => setStep((s) => Math.max(0, s - 1) as Step);

  const selectUserType = (type: UserType) => {
    setUserType(type);
    setStep(1);
  };

  // ── Can continue? ──
  const canContinue = (): boolean => {
    if (step === 0) return false;
    if (step === 4) return true; // chamber is optional

    if (userType === "student") {
      if (step === 1) return !!university;
      if (step === 2) return year !== null;
      if (step === 3) return modules.length > 0;
    }

    if (userType === "professional") {
      if (step === 1) return !!professionalRole;
      if (step === 2) return true; // firm is optional
      if (step === 3) return practiceAreas.length > 0;
    }

    return false;
  };

  // ── Complete onboarding ──
  const handleComplete = async () => {
    setSaving(true);
    try {
      const uni = UK_UNIVERSITIES.find((u) => u.name === university);
      const pendingName = typeof window !== "undefined"
        ? localStorage.getItem("ratio_pending_name") ?? undefined
        : undefined;

      const profileId = await createProfile({
        userType: userType || "student",
        // Student fields
        ...(userType === "student" && {
          university,
          universityShort: uni?.short ?? university.substring(0, 5),
          yearOfStudy: year ?? 1,
          modules,
        }),
        // Professional fields
        ...(userType === "professional" && {
          professionalRole,
          firmOrChambers: firmOrChambers || undefined,
          practiceAreas,
        }),
        // Shared
        chamber: chamber || undefined,
        fullName: pendingName,
      });

      // Claim referral if user arrived via a referral link
      const referrerHandle = typeof window !== "undefined"
        ? localStorage.getItem("ratio_referral_handle")
        : null;
      if (referrerHandle && profileId) {
        try {
          await claimMyReferral({ referrerHandle });
          await linkProfileToReferral({ profileId, referrerHandle });
        } catch {
          // Referral claim is best-effort
        }
        localStorage.removeItem("ratio_referral_handle");
      }

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("ratio_pending_name");
      // Full reload to avoid Next.js parallelRoutes crash when crossing (auth)→(app) layout boundary
      window.location.href = "/home";
    } catch (err) {
      courtToast.error("Failed to create profile. Please try again.");
      setSaving(false);
    }
  };

  const handleSkip = () => {
    localStorage.removeItem(STORAGE_KEY);
    skipOnboarding();
    // Full reload to avoid Next.js parallelRoutes crash when crossing (auth)→(app) layout boundary
    window.location.href = "/home";
  };

  // ── Render helpers ──
  const renderUniButton = (u: (typeof UK_UNIVERSITIES)[number]) => (
    <button
      key={u.name}
      onClick={() => setUniversity(u.name)}
      className={`w-full text-left px-3.5 py-3 rounded-xl mb-1.5 flex justify-between items-center transition-all focus:outline-none focus:ring-1 focus:ring-gold/30 ${
        university === u.name
          ? "bg-gold-dim border border-gold/25 text-gold"
          : "hover:bg-white/[0.03] text-court-text-sec"
      }`}
    >
      <div>
        <p className="text-court-base font-semibold">{u.name}</p>
        <p className="text-court-xs text-court-text-ter mt-0.5">
          {u.city}
          {u.russellGroup && (
            <span className="ml-2 text-gold/60">Russell Group</span>
          )}
        </p>
      </div>
      <span className="text-court-sm font-bold text-court-text-ter">{u.short}</span>
    </button>
  );

  return (
    <div className="h-dvh flex flex-col px-4 md:px-6 lg:px-8 pt-8">
      {/* Brief loader while restoring saved progress */}
      {!hydrated && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={28} className="text-gold animate-spin" />
        </div>
      )}

      {hydrated && <>
      {/* ── Progress + Skip (hidden on Step 0) ── */}
      {step > 0 && (
        <div className="mb-8 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <p className="text-court-xs text-court-text-ter">
              Step {step} of 4
            </p>
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 text-court-xs text-court-text-ter hover:text-court-text-sec transition-colors"
            >
              <SkipForward size={12} />
              Skip for now
            </button>
          </div>
          <div className="flex gap-1.5 mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                  s <= step ? "bg-gold" : "bg-white/[0.06]"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className={`text-court-xs tracking-wider ${
                  i + 1 <= step ? "text-gold" : "text-court-text-ter"
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Scrollable step content ── */}
      <div className="flex-1 overflow-y-auto min-h-0 pb-2">

        {/* ═══════════════════════════════════════════ */}
        {/* STEP 0 — User Type Selection               */}
        {/* ═══════════════════════════════════════════ */}
        {step === 0 && (
          <div className="flex flex-col items-center pt-8">
            <h1 className="font-serif text-2xl font-bold text-court-text mb-2 text-center">
              Welcome to Ratio
            </h1>
            <p className="text-court-sm text-court-text-sec mb-8 text-center max-w-sm">
              Tell us a bit about yourself so we can tailor your experience.
            </p>

            <div className="w-full max-w-sm space-y-3">
              {/* Student card */}
              <button
                onClick={() => selectUserType("student")}
                className="w-full text-left p-5 rounded-court border border-court-border-light hover:border-white/10 hover:bg-white/[0.02] transition-all focus:outline-none focus:ring-1 focus:ring-gold/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-court bg-white/[0.05] flex items-center justify-center shrink-0">
                    <GraduationCap size={24} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-court-md font-serif font-bold text-court-text">
                      Law Student
                    </p>
                    <p className="text-court-sm text-court-text-ter mt-0.5">
                      Currently studying law at a UK university
                    </p>
                  </div>
                </div>
              </button>

              {/* Professional card */}
              <button
                onClick={() => selectUserType("professional")}
                className="w-full text-left p-5 rounded-court border border-court-border-light hover:border-white/10 hover:bg-white/[0.02] transition-all focus:outline-none focus:ring-1 focus:ring-gold/30"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-court bg-white/[0.05] flex items-center justify-center shrink-0">
                    <Scale size={24} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-court-md font-serif font-bold text-court-text">
                      Legal Professional
                    </p>
                    <p className="text-court-sm text-court-text-ter mt-0.5">
                      Practising or training in the legal profession
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Skip */}
            <button
              onClick={handleSkip}
              className="mt-8 flex items-center gap-1.5 text-court-xs text-court-text-ter hover:text-court-text-sec transition-colors"
            >
              <SkipForward size={12} />
              Skip for now
            </button>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* STUDENT STEP 1 — University                */}
        {/* ═══════════════════════════════════════════ */}
        {step === 1 && userType === "student" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
              Your University
            </h1>
            <p className="text-court-sm text-court-text-sec mb-3">
              Select your law school ({UK_UNIVERSITIES.length} UK universities)
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, abbreviation, or city..."
                className="flex-1 bg-navy-card border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
              />
              <button
                onClick={() => setShowRegions(!showRegions)}
                className={`px-3 py-2.5 rounded-xl text-court-xs font-semibold border transition-all ${
                  showRegions
                    ? "border-gold/40 bg-gold-dim text-gold"
                    : "border-court-border text-court-text-ter"
                }`}
              >
                By Region
              </button>
            </div>

            {search && (
              <p className="text-court-xs text-court-text-ter mb-2">
                {filteredUnis.length} result{filteredUnis.length !== 1 ? "s" : ""}
              </p>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar max-h-[50vh]">
              {showRegions && groupedUnis ? (
                Object.entries(groupedUnis).map(([region, unis]) => (
                  <div key={region} className="mb-4">
                    <p className="text-court-xs text-gold/70 font-semibold uppercase tracking-wider mb-2 px-1">
                      {region} ({unis.length})
                    </p>
                    {unis.map(renderUniButton)}
                  </div>
                ))
              ) : (
                filteredUnis.map(renderUniButton)
              )}
              {filteredUnis.length === 0 && (
                <p className="text-center text-court-text-ter text-court-base py-8">
                  No universities found. Try a different search term.
                </p>
              )}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* STUDENT STEP 2 — Year                      */}
        {/* ═══════════════════════════════════════════ */}
        {step === 2 && userType === "student" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
              Year of Study
            </h1>
            <p className="text-court-sm text-court-text-sec mb-5">
              What year are you in?
            </p>
            <div className="flex flex-col gap-2">
              {[
                { v: 0, label: "Foundation Year" },
                { v: 1, label: "Year 1" },
                { v: 2, label: "Year 2" },
                { v: 3, label: "Year 3" },
                { v: 4, label: "Year 4 (Masters / LPC / BPC)" },
              ].map((y) => (
                <button
                  key={y.v}
                  onClick={() => setYear(y.v)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-gold/30 ${
                    year === y.v
                      ? "bg-gold-dim border border-gold/25 text-gold font-bold"
                      : "bg-navy-card border border-court-border text-court-text-sec"
                  }`}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* STUDENT STEP 3 — Modules                   */}
        {/* ═══════════════════════════════════════════ */}
        {step === 3 && userType === "student" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
              Your Modules
            </h1>
            <p className="text-court-sm text-court-text-sec mb-5">
              Select modules you&apos;re studying ({modules.length} selected)
            </p>
            <div className="flex flex-wrap gap-2">
              {LAW_MODULES.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleModule(m)}
                  className={`px-3.5 py-2 rounded-xl text-court-sm font-semibold border transition-all focus:outline-none focus:ring-1 focus:ring-gold/30 ${
                    modules.includes(m)
                      ? "border-gold/40 bg-gold-dim text-gold"
                      : "border-court-border text-court-text-sec hover:border-white/10"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PROFESSIONAL STEP 1 — Role                 */}
        {/* ═══════════════════════════════════════════ */}
        {step === 1 && userType === "professional" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
              Your Role
            </h1>
            <p className="text-court-sm text-court-text-sec mb-5">
              What best describes your current position?
            </p>
            <div className="flex flex-col gap-2">
              {PROFESSIONAL_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setProfessionalRole(role)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-gold/30 ${
                    professionalRole === role
                      ? "bg-gold-dim border border-gold/25 text-gold font-bold"
                      : "bg-navy-card border border-court-border text-court-text-sec"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PROFESSIONAL STEP 2 — Firm / Chambers      */}
        {/* ═══════════════════════════════════════════ */}
        {step === 2 && userType === "professional" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
              Your Firm or Chambers
            </h1>
            <p className="text-court-sm text-court-text-sec mb-5">
              Optional — where do you work or train?
            </p>
            <input
              type="text"
              value={firmOrChambers}
              onChange={(e) => setFirmOrChambers(e.target.value)}
              placeholder="e.g. 1 Crown Office Row, Clifford Chance..."
              className="w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-3 text-court-base text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
            />
            <p className="text-court-xs text-court-text-ter mt-3">
              This is optional and can be added later. It helps personalise your experience.
            </p>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* PROFESSIONAL STEP 3 — Practice Areas       */}
        {/* ═══════════════════════════════════════════ */}
        {step === 3 && userType === "professional" && (
          <>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
              Practice Areas
            </h1>
            <p className="text-court-sm text-court-text-sec mb-5">
              Select your areas of practice ({practiceAreas.length} selected)
            </p>
            <div className="flex flex-wrap gap-2">
              {PRACTICE_AREAS.map((area) => (
                <button
                  key={area}
                  onClick={() => togglePracticeArea(area)}
                  className={`px-3.5 py-2 rounded-xl text-court-sm font-semibold border transition-all focus:outline-none focus:ring-1 focus:ring-gold/30 ${
                    practiceAreas.includes(area)
                      ? "border-gold/40 bg-gold-dim text-gold"
                      : "border-court-border text-court-text-sec hover:border-white/10"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* SHARED STEP 4 — Chamber                    */}
        {/* ═══════════════════════════════════════════ */}
        {step === 4 && (
          <>
            <h1 className="font-serif text-2xl font-bold text-court-text mb-1">
              Choose Your Chamber
            </h1>
            <p className="text-court-sm text-court-text-sec mb-5">
              Your Chamber is your team. Compete, collaborate, rise together.
            </p>
            <div className="flex flex-col gap-3">
              {CHAMBERS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setChamber(c.name)}
                  className={`w-full text-left px-4 py-4 rounded-court border transition-all focus:outline-none focus:ring-1 focus:ring-gold/30 ${
                    chamber === c.name ? "border-2" : "border border-court-border-light"
                  }`}
                  style={{
                    borderColor: chamber === c.name ? c.color : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-court flex items-center justify-center text-xl"
                      style={{ background: `${c.color}22` }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p className="text-court-md font-serif font-bold text-court-text">
                        {c.name} Chamber
                      </p>
                      <p className="text-court-sm text-court-text-ter italic mt-0.5">
                        &ldquo;{c.motto}&rdquo;
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setChamber("")}
              className={`mt-2 text-center text-court-sm py-2 transition-colors ${
                chamber === "" ? "text-gold font-semibold" : "text-court-text-ter hover:text-court-text-sec"
              }`}
            >
              Choose later — I haven&apos;t joined a Chamber yet
            </button>
          </>
        )}

      </div>{/* end scrollable */}

      {/* ── Navigation — sticky at bottom (hidden on Step 0) ── */}
      {step > 0 && (
        <div className="shrink-0 flex gap-3 py-4 border-t border-court-border-light bg-navy">
          <button
            onClick={back}
            disabled={saving}
            className="flex-1 py-3 text-court-base font-semibold text-court-text-sec border border-court-border rounded-xl disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={step === 4 ? handleComplete : next}
            disabled={!canContinue() || saving}
            className="flex-1 py-3 text-court-base font-bold bg-gold text-navy rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {step === 4 ? (saving ? "Creating profile..." : "Enter Ratio") : "Continue"}
          </button>
        </div>
      )}
      </>}
    </div>
  );
}
