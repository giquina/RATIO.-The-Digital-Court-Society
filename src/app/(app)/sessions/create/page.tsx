"use client";

import { useState } from "react";
import { Card, Button, Tag } from "@/components/ui";
import { SESSION_TYPES, LAW_MODULES, MOOT_ROLES, MOCK_TRIAL_ROLES } from "@/lib/constants/app";

export default function CreateSessionPage() {
  const [sessionType, setSessionType] = useState("moot");
  const [module, setModule] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("15:30");
  const [location, setLocation] = useState("");
  const [crossUni, setCrossUni] = useState(false);

  const roles = sessionType === "mock_trial" ? MOCK_TRIAL_ROLES : MOOT_ROLES;

  const inputClass = "w-full bg-navy-card border border-court-border rounded-xl px-3.5 py-2.5 text-[13px] text-court-text outline-none focus:border-gold/40 transition-colors placeholder:text-court-text-ter";
  const labelClass = "text-[10px] text-court-text-ter uppercase tracking-widest mb-1.5 block";

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Create Session</h1>
        <p className="text-xs text-court-text-sec">Organise a moot, mock trial, or workshop</p>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Type */}
        <div>
          <label className={labelClass}>Session Type</label>
          <div className="grid grid-cols-3 gap-1.5">
            {SESSION_TYPES.filter((t) => t.value !== "workshop").map((t) => (
              <button
                key={t.value}
                onClick={() => setSessionType(t.value)}
                className={`py-2.5 rounded-xl text-center border text-[11px] font-bold transition-all ${
                  sessionType === t.value
                    ? "border-gold/40 bg-gold-dim text-gold"
                    : "border-court-border text-court-text-sec"
                }`}
              >
                <span className="block text-lg mb-0.5">{t.icon}</span>
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
          <label className={labelClass}>Session Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Judicial Review of Executive Power"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Issue Summary (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the legal issue..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="col-span-1">
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
            <p className="text-[13px] font-semibold text-court-text">Open to all universities</p>
            <p className="text-[10px] text-court-text-ter">Allow students from other universities to join</p>
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
                <span className="text-[12px] text-court-text-sec">{r}</span>
                <span className="text-[10px] text-court-text-ter">Open</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Submit */}
        <Button fullWidth>Create Session</Button>
      </div>
    </div>
  );
}
