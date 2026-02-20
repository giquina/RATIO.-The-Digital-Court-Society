"use client";

import { useState } from "react";
import { UNIVERSITIES, LAW_MODULES, CHAMBERS } from "@/lib/constants/app";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [university, setUniversity] = useState("");
  const [year, setYear] = useState<number | null>(null);
  const [modules, setModules] = useState<string[]>([]);
  const [chamber, setChamber] = useState("");
  const [search, setSearch] = useState("");

  const filteredUnis = UNIVERSITIES.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.short.toLowerCase().includes(search.toLowerCase())
  );

  const toggleModule = (m: string) => {
    setModules((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  };

  const next = () => setStep((s) => Math.min(4, s + 1) as Step);
  const back = () => setStep((s) => Math.max(1, s - 1) as Step);

  return (
    <div className="min-h-screen flex flex-col px-6 pt-8 pb-12">
      {/* Progress */}
      <div className="flex gap-1.5 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? "bg-gold" : "bg-white/[0.06]"}`} />
        ))}
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
            className="w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-2.5 text-[13px] text-court-text outline-none focus:border-gold/40 mb-3 placeholder:text-court-text-ter"
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
                  <p className="text-[13px] font-semibold">{u.name}</p>
                  <p className="text-[10px] text-court-text-ter mt-0.5">{u.city}</p>
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
                    <p className="text-[15px] font-serif font-bold text-court-text">{c.name} Chamber</p>
                    <p className="text-[11px] text-court-text-ter italic mt-0.5">&ldquo;{c.motto}&rdquo;</p>
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
          <button onClick={back} className="flex-1 py-3 text-sm font-semibold text-court-text-sec border border-court-border rounded-xl">
            Back
          </button>
        )}
        <button
          onClick={step === 4 ? () => (window.location.href = "/home") : next}
          disabled={(step === 1 && !university) || (step === 2 && year === null) || (step === 3 && modules.length === 0) || (step === 4 && !chamber)}
          className="flex-1 py-3 text-sm font-bold bg-gold text-navy rounded-xl disabled:opacity-40"
        >
          {step === 4 ? "Enter Ratio" : "Continue"}
        </button>
      </div>
    </div>
  );
}
