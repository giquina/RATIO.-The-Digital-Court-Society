"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UNIVERSITIES, LAW_MODULES, CHAMBERS } from "@/lib/constants/app";
import { Loader2 } from "lucide-react";

type Step = 1 | 2 | 3 | 4;

const STORAGE_KEY = "ratio_onboarding";

function loadSaved() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export default function OnboardingPage() {
  const router = useRouter();
  const createProfile = useMutation(api.users.createProfile);
  const saved = loadSaved();
  const [step, setStep] = useState<Step>(saved?.step ?? 1);
  const [university, setUniversity] = useState(saved?.university ?? "");
  const [year, setYear] = useState<number | null>(saved?.year ?? null);
  const [modules, setModules] = useState<string[]>(saved?.modules ?? []);
  const [chamber, setChamber] = useState(saved?.chamber ?? "");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // Persist progress to localStorage
  const persist = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, university, year, modules, chamber }));
    } catch {}
  }, [step, university, year, modules, chamber]);

  useEffect(() => { persist(); }, [persist]);

  const filteredUnis = UNIVERSITIES.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.short.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModule = (m: string) => {
    setModules((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  };

  const next = () => setStep((s) => Math.min(4, s + 1) as Step);
  const back = () => setStep((s) => Math.max(1, s - 1) as Step);

  return (
    <div className="min-h-screen flex flex-col px-4 md:px-6 lg:px-8 pt-8 pb-12">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex gap-1.5 mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? "bg-gold" : "bg-white/[0.06]"}`} />
          ))}
        </div>
        <div className="flex justify-between">
          {["University", "Year", "Modules", "Chamber"].map((label, i) => (
            <span key={label} className={`text-court-xs tracking-wider ${i + 1 <= step ? "text-gold" : "text-court-text-ter"}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Step 1: University ── */}
      {step === 1 && (
        <>
          <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Your University</h1>
          <p className="text-xs text-court-text-sec mb-5">Select your law school</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities..."
            className="w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-2.5 text-court-base text-court-text outline-none focus:border-gold/40 mb-3 placeholder:text-court-text-ter"
          />
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {filteredUnis.map((u) => (
              <button
                key={u.short}
                onClick={() => setUniversity(u.name)}
                className={`w-full text-left px-3.5 py-3 rounded-xl mb-1.5 flex justify-between items-center transition-all ${
                  university === u.name
                    ? "bg-gold-dim border border-gold/25 text-gold"
                    : "hover:bg-white/[0.03] text-court-text-sec"
                }`}
              >
                <div>
                  <p className="text-court-base font-semibold">{u.name}</p>
                  <p className="text-court-xs text-court-text-ter mt-0.5">{u.city}</p>
                </div>
                <span className="text-xs font-bold text-court-text-ter">{u.short}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Step 2: Year ── */}
      {step === 2 && (
        <>
          <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Year of Study</h1>
          <p className="text-xs text-court-text-sec mb-5">What year are you in?</p>
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
                className={`w-full text-left px-4 py-3.5 rounded-xl transition-all ${
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

      {/* ── Step 3: Modules ── */}
      {step === 3 && (
        <>
          <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Your Modules</h1>
          <p className="text-xs text-court-text-sec mb-5">Select modules you&apos;re studying ({modules.length} selected)</p>
          <div className="flex flex-wrap gap-2">
            {LAW_MODULES.map((m) => (
              <button
                key={m}
                onClick={() => toggleModule(m)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
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

      {/* ── Step 4: Chamber ── */}
      {step === 4 && (
        <>
          <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Choose Your Chamber</h1>
          <p className="text-xs text-court-text-sec mb-5">Your Chamber is your team. Compete, collaborate, rise together.</p>
          <div className="flex flex-col gap-3">
            {CHAMBERS.map((c) => (
              <button
                key={c.name}
                onClick={() => setChamber(c.name)}
                className={`w-full text-left px-4 py-4 rounded-court border transition-all ${
                  chamber === c.name ? "border-2" : "border border-court-border-light"
                }`}
                style={{ borderColor: chamber === c.name ? c.color : undefined }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-court flex items-center justify-center text-xl"
                    style={{ background: `${c.color}22` }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-court-md font-serif font-bold text-court-text">{c.name} Chamber</p>
                    <p className="text-court-sm text-court-text-ter italic mt-0.5">&ldquo;{c.motto}&rdquo;</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-court-border-light">
        {step > 1 && (
          <button onClick={back} disabled={saving} className="flex-1 py-3 text-sm font-semibold text-court-text-sec border border-court-border rounded-xl disabled:opacity-40">
            Back
          </button>
        )}
        <button
          onClick={step === 4 ? async () => {
            setSaving(true);
            try {
              const uni = UNIVERSITIES.find((u) => u.name === university);
              await createProfile({
                university,
                universityShort: uni?.short ?? university.substring(0, 5),
                yearOfStudy: year ?? 1,
                chamber,
                modules,
              });
              localStorage.removeItem(STORAGE_KEY);
              router.push("/home");
            } catch (err) {
              console.error("Failed to create profile:", err);
              setSaving(false);
            }
          } : next}
          disabled={(step === 1 && !university) || (step === 2 && year === null) || (step === 3 && modules.length === 0) || (step === 4 && !chamber) || saving}
          className="flex-1 py-3 text-sm font-bold bg-gold text-navy rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {step === 4 ? (saving ? "Creating profile..." : "Enter Ratio") : "Continue"}
        </button>
      </div>
    </div>
  );
}
