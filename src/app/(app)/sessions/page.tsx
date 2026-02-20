"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, Tag, Card, Button, ProgressBar } from "@/components/ui";

const SESSIONS = [
  { id: "1", type: "Moot", module: "Public Law", title: "Judicial Review of Executive Power",
    date: "Tue 25 Feb", time: "14:00–15:30", uni: "UCL",
    roles: [
      { role: "Presiding Judge", filled: true, user: "Dr. Patel", initials: "DP" },
      { role: "Leading Counsel (App.)", filled: true, user: "You", initials: "AG" },
      { role: "Leading Counsel (Res.)", filled: true, user: "Priya S.", initials: "PS" },
      { role: "Junior Counsel (Res.)", filled: false, user: null, initials: null },
    ] },
  { id: "2", type: "Mock Trial", module: "Criminal Law", title: "R v Daniels — Theft & Handling",
    date: "Thu 27 Feb", time: "16:00–17:45", uni: "UCL",
    roles: [
      { role: "Judge", filled: true, user: "Prof. Ahmadi", initials: "PA" },
      { role: "Prosecution", filled: true, user: "James O.", initials: "JO" },
      { role: "Defence", filled: true, user: "Sophie C.", initials: "SC" },
      { role: "Witness 1", filled: true, user: "Alex T.", initials: "AT" },
      { role: "Witness 2", filled: false, user: null, initials: null },
      { role: "Clerk", filled: false, user: null, initials: null },
    ] },
  { id: "3", type: "SQE2 Prep", module: "Dispute Resolution", title: "Summary Judgment Application",
    date: "Sat 1 Mar", time: "10:00–11:00", uni: "Cross-University",
    filled: 7, total: 12, roles: null },
];

export default function SessionsPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-3.5">Sessions</h1>
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-0.5">
          {["Upcoming", "Create", "Past"].map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === i ? "bg-gold text-navy" : "text-court-text-sec"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3">
        {SESSIONS.map((s) => (
          <Card key={s.id} className="overflow-hidden">
            <div className="px-4 py-2.5 flex justify-between items-center border-b border-court-border-light">
              <div className="flex gap-2 items-center">
                <Tag color={s.type === "Moot" ? "gold" : s.type === "Mock Trial" ? "burgundy" : "green"}>
                  {s.type.toUpperCase()}
                </Tag>
                <span className="text-[11px] text-court-text-ter">{s.module}</span>
              </div>
              <span className="text-[11px] text-court-text-sec">{s.uni}</span>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-base font-bold text-court-text mb-2 leading-tight">{s.title}</h3>
              <div className="flex gap-4 text-[11px] text-court-text-sec mb-3.5">
                <span>📅 {s.date}</span>
                <span>🕐 {s.time}</span>
              </div>

              {s.roles ? (
                <div className="mb-3.5">
                  {s.roles.map((r, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-court-border-light last:border-0">
                      <div className="flex gap-2 items-center">
                        {r.filled && r.initials && <Avatar initials={r.initials} chamber="Gray's" size="xs" />}
                        <span className="text-xs text-court-text-sec">{r.role}</span>
                      </div>
                      {r.filled ? (
                        <span className="text-[11px] text-green-500 font-semibold">✓ {r.user}</span>
                      ) : (
                        <button className="text-[10px] text-gold font-bold bg-gold-dim border border-gold/25 rounded-md px-2.5 py-0.5">
                          Claim Role
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-court-text-sec">{s.filled}/{s.total} participants</span>
                    <span className="text-[11px] text-gold font-semibold">{s.total! - s.filled!} spots left</span>
                  </div>
                  <ProgressBar pct={(s.filled! / s.total!) * 100} />
                </div>
              )}

              <Button fullWidth variant={s.roles ? "secondary" : "primary"}>
                {s.roles ? "View Session Details" : "Join Session"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
