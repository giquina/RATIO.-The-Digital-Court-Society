"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Card, Button, SectionHeader, Tag } from "@/components/ui";
import {
  BarChart3, Clock, Target, Plus, Trash2, Calendar, Briefcase,
  BookOpen, Bot, Scale, ChevronDown, AlertCircle,
} from "lucide-react";
import { courtToast } from "@/lib/utils/toast";
import { FeatureGate } from "@/components/shared/FeatureGate";

const ACTIVITY_LABELS: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  ai_practice: { label: "AI Practice", icon: <Bot size={14} />, color: "text-blue-400" },
  live_moot: { label: "Live Moot", icon: <Scale size={14} />, color: "text-gold" },
  research: { label: "Legal Research", icon: <BookOpen size={14} />, color: "text-green-400" },
  manual: { label: "Other CPD", icon: <Briefcase size={14} />, color: "text-purple-400" },
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// BSB requires 12 hours per year; SRA varies — we default to 12
const ANNUAL_TARGET_HOURS = 12;

export default function CPDPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);
  const isProfessional = profile?.userType === "professional";

  const currentYear = new Date().getFullYear();
  const [year] = useState(currentYear);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summary: any = useQuery(anyApi.cpd.getMySummary, { year });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: any[] = useQuery(anyApi.cpd.getMyEntries, { year }) ?? [];
  const deleteEntry = useMutation(anyApi.cpd.deleteEntry);
  const logEntry = useMutation(anyApi.cpd.logEntry);

  // ── Manual entry form state ──
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formMinutes, setFormMinutes] = useState(60);
  const [formType, setFormType] = useState("manual");
  const [saving, setSaving] = useState(false);

  const handleAddEntry = async () => {
    if (!formTitle.trim()) return;
    setSaving(true);
    try {
      await logEntry({
        activityType: formType,
        title: formTitle.trim(),
        durationMinutes: formMinutes,
        date: new Date().toISOString().split("T")[0],
      });
      courtToast.success("CPD entry logged");
      setFormTitle("");
      setFormMinutes(60);
      setShowForm(false);
    } catch {
      courtToast.error("Failed to log entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry({ entryId: id as never });
      courtToast.success("Entry removed");
    } catch {
      courtToast.error("Failed to remove entry");
    }
  };

  // ── Non-professional gate ──
  if (profile && !isProfessional) {
    return (
      <div className="pb-6 md:max-w-content-medium mx-auto">
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <h1 className="font-serif text-2xl font-bold text-court-text">CPD Tracking</h1>
        </div>
        <div className="px-4 md:px-6 lg:px-8">
          <Card className="p-6 text-center">
            <AlertCircle size={24} className="text-gold mx-auto mb-3" />
            <p className="text-court-base font-bold text-court-text mb-2">Professional Feature</p>
            <p className="text-court-sm text-court-text-sec">
              CPD tracking is available for professional accounts. Switch to a professional plan to access this feature.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercent = summary
    ? Math.min(100, Math.round((summary.totalHours / ANNUAL_TARGET_HOURS) * 100))
    : 0;

  return (
    <FeatureGate feature="sqe2_prep">
      <div className="pb-6 md:max-w-content-medium mx-auto">
        {/* Header */}
        <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-court-text">CPD Tracking</h1>
              <p className="text-court-sm text-court-text-sec mt-1">{year} Continuing Professional Development</p>
            </div>
            <Button size="sm" onClick={() => setShowForm(!showForm)}>
              <Plus size={14} className="mr-1" />
              Log Activity
            </Button>
          </div>
        </div>

        <div className="px-4 md:px-6 lg:px-8 space-y-5">

          {/* ── Annual Progress ── */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-gold" />
                <span className="text-court-sm font-bold text-court-text">Annual Target</span>
              </div>
              <span className="text-court-sm text-court-text-sec">
                {summary?.totalHours ?? 0} / {ANNUAL_TARGET_HOURS} hours
              </span>
            </div>
            <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-court-xs text-court-text-ter mt-2">
              {progressPercent >= 100
                ? "Annual CPD target met ✓"
                : `${ANNUAL_TARGET_HOURS - (summary?.totalHours ?? 0)} hours remaining`}
            </p>
          </Card>

          {/* ── Summary Stats ── */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <Clock size={16} className="text-court-text-sec mx-auto mb-1" />
              <p className="font-serif text-lg font-bold text-court-text">{summary?.totalHours ?? 0}</p>
              <p className="text-court-xs text-court-text-ter uppercase">Hours</p>
            </Card>
            <Card className="p-3 text-center">
              <BarChart3 size={16} className="text-court-text-sec mx-auto mb-1" />
              <p className="font-serif text-lg font-bold text-court-text">{summary?.entryCount ?? 0}</p>
              <p className="text-court-xs text-court-text-ter uppercase">Activities</p>
            </Card>
            <Card className="p-3 text-center">
              <Calendar size={16} className="text-court-text-sec mx-auto mb-1" />
              <p className="font-serif text-lg font-bold text-court-text">
                {Object.keys(summary?.byMonth ?? {}).length}
              </p>
              <p className="text-court-xs text-court-text-ter uppercase">Active Months</p>
            </Card>
          </div>

          {/* ── Monthly Breakdown (simple bar chart) ── */}
          {summary && Object.keys(summary.byMonth).length > 0 && (
            <Card className="p-4">
              <h3 className="text-court-xs font-bold text-court-text-ter uppercase tracking-widest mb-3">
                Monthly Hours
              </h3>
              <div className="flex items-end gap-1.5 h-24">
                {MONTH_LABELS.map((label, i) => {
                  const minutes = summary.byMonth[i + 1] || 0;
                  const hours = minutes / 60;
                  const maxHours = Math.max(...Object.values(summary.byMonth as Record<number, number>).map((m: number) => m / 60), 1);
                  const heightPct = Math.max(4, (hours / maxHours) * 100);
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gold/30 rounded-sm transition-all duration-300"
                        style={{ height: `${heightPct}%` }}
                        title={`${label}: ${Math.round(hours * 10) / 10}h`}
                      />
                      <span className="text-[9px] text-court-text-ter">{label}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ── Manual Entry Form ── */}
          {showForm && (
            <Card className="p-4 border-gold/20">
              <h3 className="text-court-sm font-bold text-court-text mb-3">Log CPD Activity</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Activity title..."
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3 py-2.5 text-court-base text-court-text focus:outline-none focus:border-gold/40 placeholder:text-court-text-ter"
                />
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-court-xs text-court-text-ter block mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formMinutes}
                      onChange={(e) => setFormMinutes(parseInt(e.target.value) || 0)}
                      min={1}
                      max={480}
                      className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3 py-2.5 text-court-base text-court-text focus:outline-none focus:border-gold/40"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-court-xs text-court-text-ter block mb-1">Type</label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3 py-2.5 text-court-base text-court-text focus:outline-none focus:border-gold/40"
                    >
                      <option value="manual">Other CPD</option>
                      <option value="ai_practice">AI Practice</option>
                      <option value="live_moot">Live Moot</option>
                      <option value="research">Legal Research</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddEntry} disabled={!formTitle.trim() || saving} className="flex-1">
                    {saving ? "Saving..." : "Log Entry"}
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ── Entry Log ── */}
          <div>
            <h3 className="text-court-xs font-bold text-court-text-ter uppercase tracking-widest mb-2 px-1">
              Activity Log ({entries.length} entries)
            </h3>
            {entries.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-court-sm text-court-text-ter">
                  No CPD entries for {year}. Complete an AI practice session or log an activity to get started.
                </p>
              </Card>
            ) : (
              <Card className="divide-y divide-court-border-light">
                {entries.map((entry: Record<string, unknown>) => {
                  const activity = ACTIVITY_LABELS[entry.activityType as string] || ACTIVITY_LABELS.manual;
                  const hours = Math.round(((entry.durationMinutes as number) / 60) * 10) / 10;
                  return (
                    <div key={entry._id as string} className="flex items-center gap-3 px-4 py-3">
                      <div className={`shrink-0 ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-court-sm font-medium text-court-text truncate">
                          {entry.title as string}
                        </p>
                        <p className="text-court-xs text-court-text-ter">
                          {entry.date as string} · {hours}h · {activity.label}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(entry._id as string)}
                        className="shrink-0 text-court-text-ter hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </Card>
            )}
          </div>

        </div>
      </div>
    </FeatureGate>
  );
}
