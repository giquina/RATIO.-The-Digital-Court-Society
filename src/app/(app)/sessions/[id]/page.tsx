"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Tag, Card, Button, ProgressBar } from "@/components/ui";

const SESSION = {
  title: "Judicial Review of Executive Power",
  type: "Moot", module: "Public Law", date: "Tuesday, 25 February 2026",
  time: "14:00 – 15:30", location: "UCL Faculty of Laws · Room G08", uni: "UCL",
  description: "Whether the exercise of prerogative power to trigger Article 50 TEU without Parliamentary authority is unlawful. Based on the facts of R (Miller) v Secretary of State [2017] UKSC 5.",
  createdBy: { name: "Ali Giquina", initials: "AG", chamber: "Gray's" },
};

const ROLES = [
  { role: "Presiding Judge", filled: true, user: "Dr. Sarah Patel", initials: "SP", chamber: "Inner", timeLimit: null },
  { role: "Leading Counsel (Appellant)", filled: true, user: "Ali Giquina (You)", initials: "AG", chamber: "Gray's", timeLimit: 15 },
  { role: "Leading Counsel (Respondent)", filled: true, user: "Priya Sharma", initials: "PS", chamber: "Lincoln's", timeLimit: 15 },
  { role: "Junior Counsel (Appellant)", filled: false, user: null, initials: null, chamber: null, timeLimit: 10 },
  { role: "Junior Counsel (Respondent)", filled: false, user: null, initials: null, chamber: null, timeLimit: 10 },
  { role: "Clerk", filled: false, user: null, initials: null, chamber: null, timeLimit: null },
];

export default function SessionDetailPage() {
  const [claimed, setClaimed] = useState<Record<number, boolean>>({});
  const filled = ROLES.filter((r) => r.filled || claimed[ROLES.indexOf(r)]).length;

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-2">
        <Link href="/sessions" className="text-xs text-court-text-ter">← Sessions</Link>
      </div>

      {/* Header */}
      <section className="px-4 mb-4">
        <Card className="overflow-hidden">
          <div className="bg-burgundy/20 px-4 py-2.5 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Tag color="burgundy">{SESSION.type.toUpperCase()}</Tag>
              <Tag color="gold">{SESSION.module}</Tag>
            </div>
            <Tag color="green" small>UPCOMING</Tag>
          </div>
          <div className="p-4">
            <h1 className="font-serif text-xl font-bold text-court-text leading-tight mb-3">{SESSION.title}</h1>
            <div className="flex flex-col gap-1.5 text-[12px] text-court-text-sec mb-3.5">
              <span>📅 {SESSION.date}</span>
              <span>🕐 {SESSION.time}</span>
              <span>📍 {SESSION.location}</span>
            </div>
            <p className="text-[12px] text-court-text-sec leading-relaxed">{SESSION.description}</p>
            <div className="mt-3.5 pt-3 border-t border-court-border-light flex items-center gap-2">
              <Avatar initials={SESSION.createdBy.initials} chamber={SESSION.createdBy.chamber} size="xs" />
              <span className="text-[11px] text-court-text-ter">Created by {SESSION.createdBy.name}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Roles */}
      <section className="px-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-serif text-lg font-bold text-court-text">Roles</h2>
          <span className="text-[11px] text-court-text-sec">{filled}/{ROLES.length} filled</span>
        </div>
        <ProgressBar pct={(filled / ROLES.length) * 100} height={3} />
        <div className="mt-3 flex flex-col gap-2">
          {ROLES.map((r, i) => {
            const isClaimed = r.filled || claimed[i];
            return (
              <Card key={i} className={`px-3.5 py-3 flex items-center gap-3 ${isClaimed ? "" : "border-dashed"}`}>
                {isClaimed && r.initials ? (
                  <Avatar initials={claimed[i] ? "AG" : r.initials} chamber={claimed[i] ? "Gray's" : r.chamber!} size="sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-court-border flex items-center justify-center shrink-0">
                    <span className="text-court-text-ter text-xs">?</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-court-text">{r.role}</p>
                  {r.timeLimit && (
                    <p className="text-[10px] text-court-text-ter mt-0.5">⏱ {r.timeLimit} min speaking time</p>
                  )}
                </div>
                {isClaimed ? (
                  <span className="text-[11px] text-green-500 font-semibold whitespace-nowrap">
                    ✓ {claimed[i] ? "You" : r.user?.split(" ")[0]}
                  </span>
                ) : (
                  <button
                    onClick={() => setClaimed((p) => ({ ...p, [i]: true }))}
                    className="text-[10px] text-gold font-bold bg-gold-dim border border-gold/25 rounded-lg px-3 py-1.5 whitespace-nowrap"
                  >
                    Claim Role
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Preparation Checklist */}
      <section className="px-4 mb-4">
        <h2 className="font-serif text-lg font-bold text-court-text mb-3">Preparation</h2>
        <Card className="p-4">
          {[
            { task: "Read case bundle", done: true },
            { task: "Identify 3 key authorities", done: true },
            { task: "Draft skeleton argument", done: false },
            { task: "Prepare for judicial questions", done: false },
            { task: "Review opponent's likely arguments", done: false },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-court-border-light last:border-0">
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] ${
                t.done ? "bg-green-500/20 text-green-500" : "border border-court-border text-transparent"
              }`}>
                {t.done ? "✓" : ""}
              </div>
              <span className={`text-[12px] ${t.done ? "text-court-text-sec line-through" : "text-court-text"}`}>
                {t.task}
              </span>
            </div>
          ))}
        </Card>
      </section>

      {/* Actions */}
      <section className="px-4 flex flex-col gap-2.5">
        <Button fullWidth>Upload Case Bundle</Button>
        <Button fullWidth variant="secondary">Invite Participants</Button>
      </section>
    </div>
  );
}
