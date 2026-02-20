"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Tag, Card, Button, ProgressBar, EmptyState } from "@/components/ui";
import { Calendar, Clock, Check, BookOpen } from "lucide-react";

const SESSIONS = [
  { id: "1", type: "Moot", module: "Public Law", title: "Judicial Review of Executive Power",
    date: "Tue 25 Feb", time: "14:00\u201315:30", uni: "UCL", status: "upcoming",
    roles: [
      { role: "Presiding Judge", filled: true, user: "Dr. Patel", initials: "DP" },
      { role: "Leading Counsel (App.)", filled: true, user: "You", initials: "AG" },
      { role: "Leading Counsel (Res.)", filled: true, user: "Priya S.", initials: "PS" },
      { role: "Junior Counsel (Res.)", filled: false, user: null, initials: null },
    ] },
  { id: "2", type: "Mock Trial", module: "Criminal Law", title: "R v Daniels \u2014 Theft & Handling",
    date: "Thu 27 Feb", time: "16:00\u201317:45", uni: "UCL", status: "upcoming",
    roles: [
      { role: "Judge", filled: true, user: "Prof. Ahmadi", initials: "PA" },
      { role: "Prosecution", filled: true, user: "James O.", initials: "JO" },
      { role: "Defence", filled: true, user: "Sophie C.", initials: "SC" },
      { role: "Witness 1", filled: true, user: "Alex T.", initials: "AT" },
      { role: "Witness 2", filled: false, user: null, initials: null },
      { role: "Clerk", filled: false, user: null, initials: null },
    ] },
  { id: "3", type: "SQE2 Prep", module: "Dispute Resolution", title: "Summary Judgment Application",
    date: "Sat 1 Mar", time: "10:00\u201311:00", uni: "Cross-University", status: "upcoming",
    filled: 7, total: 12, roles: null },
];

const PAST_SESSIONS = [
  { id: "p1", type: "Moot", module: "Contract Law", title: "Anticipatory Breach \u2014 Hochster v De La Tour",
    date: "Mon 17 Feb", time: "14:00\u201315:30", uni: "UCL", status: "past",
    roles: null, filled: 6, total: 6 },
  { id: "p2", type: "Mock Trial", module: "Tort Law", title: "Negligence \u2014 Caparo Industries v Dickman",
    date: "Thu 13 Feb", time: "10:00\u201311:30", uni: "UCL", status: "past",
    roles: null, filled: 8, total: 8 },
];

export default function SessionsPage() {
  const [tab, setTab] = useState(0);
  const router = useRouter();
  const [claimedRoles, setClaimedRoles] = useState<Record<string, string[]>>({});

  const handleTabClick = (index: number) => {
    if (index === 1) {
      // "Create" tab navigates to the create page
      router.push("/sessions/create");
      return;
    }
    setTab(index);
  };

  const handleClaimRole = (sessionId: string, role: string) => {
    setClaimedRoles((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] || []), role],
    }));
  };

  const isRoleClaimed = (sessionId: string, role: string) => {
    return claimedRoles[sessionId]?.includes(role) ?? false;
  };

  const handleViewDetails = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`);
  };

  const handleJoinSession = (sessionId: string) => {
    alert(`Joining session! You will be added to the participant list.`);
  };

  const renderSessionCard = (s: typeof SESSIONS[number] | typeof PAST_SESSIONS[number], isPast = false) => (
    <Card key={s.id} className="overflow-hidden">
      <div className="px-4 py-2.5 flex justify-between items-center border-b border-court-border-light">
        <div className="flex gap-2 items-center">
          <Tag color={s.type === "Moot" ? "gold" : s.type === "Mock Trial" ? "burgundy" : "green"}>
            {s.type.toUpperCase()}
          </Tag>
          <span className="text-court-sm text-court-text-ter">{s.module}</span>
        </div>
        <div className="flex items-center gap-2">
          {isPast && <Tag color="blue" small>COMPLETED</Tag>}
          <span className="text-court-sm text-court-text-sec">{s.uni}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-bold text-court-text mb-2 leading-tight">{s.title}</h3>
        <div className="flex gap-4 text-court-sm text-court-text-sec mb-3.5">
          <span className="flex items-center gap-1"><Calendar size={12} className="text-court-text-ter" /> {s.date}</span>
          <span className="flex items-center gap-1"><Clock size={12} className="text-court-text-ter" /> {s.time}</span>
        </div>

        {s.roles ? (
          <div className="mb-3.5">
            {s.roles.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-1.5 border-b border-court-border-light last:border-0">
                <div className="flex gap-2 items-center">
                  {(r.filled || isRoleClaimed(s.id, r.role)) && r.initials && <Avatar initials={isRoleClaimed(s.id, r.role) ? "AG" : r.initials} chamber="Gray's" size="xs" />}
                  <span className="text-xs text-court-text-sec">{r.role}</span>
                </div>
                {r.filled || isRoleClaimed(s.id, r.role) ? (
                  <span className="text-court-sm text-green-500 font-semibold flex items-center gap-0.5">
                    <Check size={12} /> {isRoleClaimed(s.id, r.role) ? "You" : r.user}
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaimRole(s.id, r.role)}
                    className="text-court-xs text-gold font-bold bg-gold-dim border border-gold/25 rounded-md px-2.5 py-0.5 hover:bg-gold/20 transition-colors"
                  >
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
              {!isPast && s.total! - s.filled! > 0 && (
                <span className="text-court-sm text-gold font-semibold">{s.total! - s.filled!} spots left</span>
              )}
            </div>
            <ProgressBar pct={(s.filled! / s.total!) * 100} />
          </div>
        )}

        {isPast ? (
          <Button fullWidth variant="secondary" onClick={() => handleViewDetails(s.id)}>
            View Session Summary
          </Button>
        ) : (
          <Button
            fullWidth
            variant={s.roles ? "secondary" : "primary"}
            onClick={() => s.roles ? handleViewDetails(s.id) : handleJoinSession(s.id)}
          >
            {s.roles ? "View Session Details" : "Join Session"}
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="pb-6">
      <div className="px-4 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-3.5">Sessions</h1>
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-0.5">
          {["Upcoming", "Create", "Past"].map((t, i) => (
            <button
              key={t}
              onClick={() => handleTabClick(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                tab === i && i !== 1 ? "bg-gold text-navy" : "text-court-text-sec"
              } ${i === 1 ? "hover:text-gold" : ""}`}
            >
              {i === 1 ? "+ Create" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-3 md:gap-4">
        {tab === 0 && (
          <>
            {SESSIONS.length === 0 ? (
              <EmptyState
                icon={<Calendar size={32} className="text-court-text-ter" />}
                title="No Upcoming Sessions"
                description="You don't have any upcoming sessions. Create one or join an existing session."
                action={
                  <Button onClick={() => router.push("/sessions/create")}>
                    Create Session
                  </Button>
                }
              />
            ) : (
              SESSIONS.map((s) => renderSessionCard(s))
            )}
          </>
        )}

        {tab === 2 && (
          <>
            {PAST_SESSIONS.length === 0 ? (
              <EmptyState
                icon={<BookOpen size={32} className="text-court-text-ter" />}
                title="No Past Sessions"
                description="Your completed sessions will appear here. Join or create a session to get started."
                action={
                  <Button onClick={() => router.push("/sessions/create")}>
                    Create Session
                  </Button>
                }
              />
            ) : (
              PAST_SESSIONS.map((s) => renderSessionCard(s, true))
            )}
          </>
        )}
      </div>
    </div>
  );
}
