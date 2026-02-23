"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Avatar, Tag, Card, Button, ProgressBar, SectionHeader, Skeleton } from "@/components/ui";
import { courtToast } from "@/lib/utils/toast";
import { Flame, Timer, FileText, Star, Trophy, FolderOpen, Link as LinkIcon, Landmark, Settings, X, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const YEAR_LABELS: Record<number, string> = {
  0: "Foundation Year",
  1: "Year 1 · LLB Law",
  2: "Year 2 · LLB Law",
  3: "Year 3 · LLB Law",
  4: "Year 4 · Masters / LPC / BPC",
};

export default function ProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);
  const isLoading = profile === undefined;
  const updateProfile = useMutation(anyApi.users.updateProfile);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="pb-6 px-4 pt-3 space-y-4">
        <Skeleton className="h-64 w-full rounded-court" />
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-28 rounded-court" />
          <Skeleton className="h-28 rounded-court" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-24 rounded-court" />
          <Skeleton className="h-24 rounded-court" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pb-6 px-4 pt-3">
        <Card className="p-6 text-center">
          <p className="text-court-text-sec">No profile found. Please complete onboarding.</p>
        </Card>
      </div>
    );
  }

  const startEdit = () => {
    setEditName(profile.fullName);
    setEditBio(profile.bio ?? "");
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await updateProfile({
        fullName: editName.trim(),
        bio: editBio.trim(),
      });
      courtToast.success("Profile updated");
      setEditing(false);
    } catch {
      courtToast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const initials = getInitials(profile.fullName);
  const yearLabel = YEAR_LABELS[profile.yearOfStudy] ?? `Year ${profile.yearOfStudy}`;

  // Calculate moots to next rank
  const rankThresholds = [
    { name: "Pupil", min: 0 },
    { name: "Junior Counsel", min: 5 },
    { name: "Senior Counsel", min: 20 },
    { name: "King's Counsel", min: 50 },
    { name: "Bencher", min: 100 },
  ];
  const currentRankIdx = rankThresholds.findIndex((r) => r.name === profile.rank);
  const nextRank = rankThresholds[currentRankIdx + 1];
  const currentMin = rankThresholds[currentRankIdx]?.min ?? 0;
  const nextMin = nextRank?.min ?? 100;
  const rankProgress = nextRank
    ? Math.round(((profile.totalMoots - currentMin) / (nextMin - currentMin)) * 100)
    : 100;
  const mootsToNext = nextRank ? nextMin - profile.totalMoots : 0;

  return (
    <div className="pb-6">
      {/* Edit Profile Overlay */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <Card className="w-full max-w-sm p-5 relative">
            <button onClick={() => setEditing(false)} className="absolute top-3 right-3 text-court-text-ter hover:text-court-text transition-colors">
              <X size={18} />
            </button>
            <h2 className="font-serif text-lg font-bold text-court-text mb-4">Edit Profile</h2>
            <div className="space-y-3">
              <div>
                <label className="text-court-xs text-court-text-ter uppercase tracking-widest block mb-1">Full Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3 py-2.5 text-court-base text-court-text focus:outline-none focus:border-gold/40 transition-colors"
                />
              </div>
              <div>
                <label className="text-court-xs text-court-text-ter uppercase tracking-widest block mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  placeholder="A brief introduction..."
                  className="w-full bg-white/[0.05] border border-court-border rounded-xl px-3 py-2.5 text-court-base text-court-text focus:outline-none focus:border-gold/40 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex gap-2.5 mt-4">
              <Button variant="outline" size="sm" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
              <Button size="sm" onClick={saveEdit} disabled={saving || !editName.trim()} className="flex-1">
                {saving ? <Loader2 size={14} className="animate-spin" /> : "Save"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Profile Card ── */}
      <section className="px-4 pt-3">
        <Card highlight className="p-3 md:p-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-gold/[0.06]" />
          <div className="flex flex-col items-center text-center">
            <Avatar initials={initials} chamber={profile.chamber} size="xl" border />
            <h1 className="font-serif text-xl font-bold text-court-text mt-3">{profile.fullName}</h1>
            <p className="text-xs text-court-text-sec mt-1">{profile.university}</p>
            <p className="text-court-sm text-court-text-ter mt-0.5">{yearLabel}{profile.chamber ? ` · ${profile.chamber} Chamber` : ""}</p>
            {profile.bio && (
              <p className="text-court-sm text-court-text-sec mt-2 max-w-xs leading-relaxed">{profile.bio}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5">
            {[
              { v: profile.followerCount, l: "Followers" },
              { v: profile.followingCount, l: "Following" },
              { v: profile.commendationCount, l: "Comms" },
            ].map((s) => (
              <div key={s.l} className="text-center min-w-0">
                <p className="font-serif text-lg font-bold text-court-text">{s.v}</p>
                <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5 truncate">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5 justify-center mt-4">
            <Button variant="outline" size="sm" onClick={startEdit}>Edit Profile</Button>
            <Button size="sm">Share Profile</Button>
          </div>
        </Card>
      </section>

      {/* ── Rank + Streak ── */}
      <section className="px-4 mt-4 grid grid-cols-2 gap-2.5">
        <div className="bg-gold-dim border border-gold/25 rounded-court p-3.5">
          <p className="text-court-xs text-court-text-ter uppercase tracking-widest">Current Rank</p>
          <p className="font-serif text-lg font-bold text-gold mt-1">{profile.rank}</p>
          <p className="text-court-xs text-court-text-ter mt-1 mb-1.5">
            {nextRank ? `${mootsToNext} moots to ${nextRank.name}` : "Highest rank achieved"}
          </p>
          <ProgressBar pct={rankProgress} height={3} />
        </div>
        <div className="bg-orange-400/[0.08] border border-orange-400/20 rounded-court p-3.5">
          <p className="text-court-xs text-court-text-ter uppercase tracking-widest">Streak</p>
          <p className="font-serif text-lg font-bold text-orange-400 mt-1 flex items-center gap-1">
            {profile.streakDays} days <Flame size={16} className="text-orange-400" />
          </p>
          <p className="text-court-xs text-court-text-ter mt-1 mb-1.5">
            {profile.streakDays === 0 ? "Start your streak today" : "Keep it going"}
          </p>
          <ProgressBar pct={Math.min(100, profile.streakDays * 3)} color="orange" height={3} />
        </div>
      </section>

      {/* ── Stats Grid ── */}
      <section className="px-4 mt-4 grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {([
          { v: `${profile.totalHours}h`, l: "Advocacy Hours", Icon: Timer },
          { v: String(profile.totalMoots), l: "Sessions Done", Icon: FileText },
          { v: profile.readinessScore > 0 ? `${(profile.readinessScore / 10).toFixed(1)}` : "—", l: "Avg. Score", Icon: Star },
          { v: "—", l: "National Rank", Icon: Trophy },
        ] as { v: string; l: string; Icon: LucideIcon }[]).map((s) => (
          <Card key={s.l} className="p-3.5">
            <s.Icon size={20} className="text-gold" />
            <p className="font-serif text-2xl font-bold text-court-text mt-1">{s.v}</p>
            <p className="text-court-xs text-court-text-ter uppercase tracking-wider mt-0.5">{s.l}</p>
          </Card>
        ))}
      </section>

      {/* ── Modules ── */}
      {profile.modules && profile.modules.length > 0 && (
        <section className="px-4 mt-4">
          <SectionHeader title="Modules" />
          <div className="flex flex-wrap gap-2">
            {profile.modules.map((m: string) => (
              <Tag key={m}>{m}</Tag>
            ))}
          </div>
        </section>
      )}

      {/* ── Actions ── */}
      <section className="px-4 mt-4">
        {([
          { Icon: FolderOpen, label: "Export Advocacy Portfolio", tag: "PDF" },
          { Icon: LinkIcon, label: "Copy Profile Link" },
          { Icon: Landmark, label: profile.chamber ? `Your Chamber · ${profile.chamber}` : "Join a Chamber" },
          { Icon: FileText, label: "Digital Membership Card", tag: "WALLET" },
          { Icon: Settings, label: "Settings", href: "/settings" },
        ] as { Icon: LucideIcon; label: string; tag?: string; href?: string }[]).map((a) => (
          <Link key={a.label} href={a.href ?? "#"}>
            <div className="flex justify-between items-center py-3.5 border-b border-court-border-light cursor-pointer">
              <div className="flex gap-3 items-center">
                <a.Icon size={18} className="text-court-text-sec" />
                <span className="text-court-base text-court-text font-medium">{a.label}</span>
              </div>
              <div className="flex gap-2 items-center">
                {a.tag && <Tag small>{a.tag}</Tag>}
                <span className="text-court-text-ter text-sm">&rsaquo;</span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
