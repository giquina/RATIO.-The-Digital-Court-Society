"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, Tag, Card, Button, ProgressBar } from "@/components/ui";
import {
  MootRoom, PreSessionLobby, PostSessionRating,
  CourtroomEntrance, AIFeedback, RescheduleModal,
} from "@/components/video";
import type { RatingData } from "@/components/video";
import { downloadICS, getGoogleCalendarUrl } from "@/lib/utils/calendar";
import { Calendar, Clock, Video, Timer, Check } from "lucide-react";

const SESSION = {
  title: "Judicial Review of Executive Power",
  type: "Moot", module: "Public Law", date: "Tuesday, 25 February 2026",
  time: "14:00 \u2013 15:30", location: "Virtual \u2014 Video Session", uni: "UCL",
  isVirtual: true,
  description: "Whether the exercise of prerogative power to trigger Article 50 TEU without Parliamentary authority is unlawful. Based on the facts of R (Miller) v Secretary of State [2017] UKSC 5.",
  createdBy: { name: "Ali Giquina", initials: "AG", chamber: "Gray's" },
  opponent: { name: "Priya Sharma", initials: "PS", chamber: "Lincoln's", university: "KCL" },
};

const ROLES = [
  { role: "Presiding Judge", filled: true, user: "Dr. Sarah Patel", initials: "SP", chamber: "Inner", timeLimit: null },
  { role: "Leading Counsel (Appellant)", filled: true, user: "Ali Giquina (You)", initials: "AG", chamber: "Gray's", timeLimit: 15 },
  { role: "Leading Counsel (Respondent)", filled: true, user: "Priya Sharma", initials: "PS", chamber: "Lincoln's", timeLimit: 15 },
  { role: "Junior Counsel (Appellant)", filled: false, user: null, initials: null, chamber: null, timeLimit: 10 },
  { role: "Junior Counsel (Respondent)", filled: false, user: null, initials: null, chamber: null, timeLimit: 10 },
  { role: "Clerk", filled: false, user: null, initials: null, chamber: null, timeLimit: null },
];

type Phase = "details" | "lobby" | "entrance" | "live" | "rating" | "ai_feedback" | "done";

export default function SessionDetailPage() {
  const [claimed, setClaimed] = useState<Record<number, boolean>>({});
  const [phase, setPhase] = useState<Phase>("details");
  const [sessionDuration, setSessionDuration] = useState("00:00");
  const [showReschedule, setShowReschedule] = useState(false);
  const [spectatorMode, setSpectatorMode] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);

  const filled = ROLES.filter((r) => r.filled || claimed[ROLES.indexOf(r)]).length;

  const handleCalendarExport = () => {
    const start = new Date(2026, 1, 25, 14, 0);
    const end = new Date(2026, 1, 25, 15, 30);
    downloadICS({
      title: "Ratio Moot: " + SESSION.title,
      description: SESSION.type + " \u2014 " + SESSION.module + "\nOpponent: " + SESSION.opponent.name + "\n\n" + SESSION.description,
      location: "Ratio App \u2014 Virtual Session",
      startDate: start,
      endDate: end,
    });
  };

  const handleEntranceComplete = useCallback(() => {
    setPhase("live");
  }, []);

  // ── Phase: Lobby ──
  if (phase === "lobby") {
    return (
      <PreSessionLobby
        session={{
          title: SESSION.title,
          module: SESSION.module,
          type: SESSION.type,
          scheduledTime: SESSION.date + " \u00B7 " + SESSION.time,
          scheduledDate: new Date(2026, 1, 25, 14, 0),
          opponent: SESSION.opponent,
          caseDescription: SESSION.description,
        }}
        userName="Ali Giquina"
        userInitials="AG"
        userChamber="Gray's"
        onJoin={() => setPhase("entrance")}
        onCancel={() => setPhase("details")}
      />
    );
  }

  // ── Phase: Courtroom Entrance Animation ──
  if (phase === "entrance") {
    return (
      <CourtroomEntrance
        onComplete={handleEntranceComplete}
        sessionTitle={SESSION.title}
      />
    );
  }

  // ── Phase: Live Video ──
  if (phase === "live") {
    return (
      <MootRoom
        userName="Ali Giquina"
        sessionTitle={SESSION.title}
        opponent={SESSION.opponent.name}
        opponentInitials={SESSION.opponent.initials}
        opponentChamber={SESSION.opponent.chamber}
        spectatorMode={spectatorMode}
        onLeave={() => {
          setSessionDuration("28:47");
          setPhase("rating");
        }}
      />
    );
  }

  // ── Phase: Post-Session Rating ──
  if (phase === "rating") {
    return (
      <PostSessionRating
        sessionTitle={SESSION.title}
        duration={sessionDuration}
        opponent={SESSION.opponent}
        onSubmit={(data: RatingData) => setPhase("ai_feedback")}
        onSkip={() => setPhase("ai_feedback")}
        onViewAIFeedback={() => setPhase("ai_feedback")}
      />
    );
  }

  // ── Phase: AI Judge Feedback ──
  if (phase === "ai_feedback") {
    return (
      <AIFeedback
        sessionTitle={SESSION.title}
        module={SESSION.module}
        duration={sessionDuration}
        onClose={() => setPhase("done")}
      />
    );
  }

  // ── Phase: Done ──
  if (phase === "done") {
    return (
      <div className="pb-6">
        <div className="px-5 pt-3 pb-2">
          <Link href="/sessions" className="text-xs text-court-text-ter">&larr; Sessions</Link>
        </div>
        <motion.div
          className="flex flex-col items-center justify-center px-6 py-12 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Check size={28} className="text-green-500" />
          </motion.div>
          <h2 className="font-serif text-xl font-bold text-court-text mb-2">Session Complete</h2>
          <p className="text-sm text-court-text-sec mb-1">Saved to your portfolio</p>
          <p className="text-xs text-court-text-ter mb-6">Duration: {sessionDuration}</p>

          <div className="w-full max-w-xs mb-6">
            <Card className="p-3.5 text-center" highlight>
              <p className="text-court-xs text-gold font-bold uppercase tracking-wider mb-1">Session Score</p>
              <p className="font-serif text-3xl font-bold text-gold">76</p>
              <p className="text-court-xs text-court-text-ter mt-1">+12 points this week</p>
            </Card>
          </div>

          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            <Link href="/sessions"><Button fullWidth>Back to Sessions</Button></Link>
            <Link href="/profile"><Button fullWidth variant="secondary">View Portfolio</Button></Link>
            <Button fullWidth variant="ghost" onClick={() => setPhase("ai_feedback")}>
              Review AI Feedback
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Phase: Details (default) ──
  return (
    <div className="pb-6">
      <div className="px-5 pt-3 pb-2 flex justify-between items-center">
        <Link href="/sessions" className="text-xs text-court-text-ter">&larr; Sessions</Link>
        <div className="flex gap-2">
          <button
            onClick={() => setShowReschedule(true)}
            className="text-court-xs text-court-text-sec bg-white/[0.03] border border-court-border rounded-lg px-2.5 py-1"
          >
            Reschedule
          </button>
        </div>
      </div>

      {/* Header card */}
      <section className="px-4 mb-3">
        <Card className="overflow-hidden">
          <div className="bg-burgundy/20 px-4 py-2.5 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Tag color="burgundy">{SESSION.type.toUpperCase()}</Tag>
              <Tag color="gold">{SESSION.module}</Tag>
            </div>
            <div className="flex gap-1.5 items-center">
              {SESSION.isVirtual && <Tag color="blue">VIRTUAL</Tag>}
              {rescheduled ? (
                <Tag color="orange" small>RESCHEDULED</Tag>
              ) : (
                <Tag color="green" small>UPCOMING</Tag>
              )}
            </div>
          </div>
          <div className="p-4">
            <h1 className="font-serif text-xl font-bold text-court-text leading-tight mb-3">{SESSION.title}</h1>
            <div className="flex flex-col gap-1.5 text-court-base text-court-text-sec mb-3.5">
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-court-text-ter" /> {SESSION.date}</span>
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-court-text-ter" /> {SESSION.time}</span>
              <span className="flex items-center gap-1.5"><Video size={12} className="text-court-text-ter" /> {SESSION.location}</span>
            </div>
            <p className="text-court-base text-court-text-sec leading-relaxed">{SESSION.description}</p>
            <div className="mt-3.5 pt-3 border-t border-court-border-light flex items-center gap-2">
              <Avatar initials={SESSION.createdBy.initials} chamber={SESSION.createdBy.chamber} size="xs" />
              <span className="text-court-sm text-court-text-ter">Created by {SESSION.createdBy.name}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Calendar export */}
      <section className="px-4 mb-3">
        <div className="flex gap-2">
          <button
            onClick={handleCalendarExport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-court-border text-xs text-court-text-sec"
          >
            <Calendar size={12} /> Download .ics
          </button>
          <a
            href={getGoogleCalendarUrl({
              title: "Ratio: " + SESSION.title,
              description: SESSION.description,
              location: "Ratio App",
              startDate: new Date(2026, 1, 25, 14, 0),
              endDate: new Date(2026, 1, 25, 15, 30),
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-court-border text-xs text-court-text-sec"
          >
            Google Calendar
          </a>
        </div>
      </section>

      {/* Join Video / Spectator */}
      {SESSION.isVirtual && (
        <section className="px-4 mb-3">
          <button
            onClick={() => { setSpectatorMode(false); setPhase("lobby"); }}
            className="w-full relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-4 mb-2"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                <Video size={24} className="text-gold" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-base font-bold text-gold font-serif">Join Video Moot</p>
                <p className="text-court-sm text-court-text-sec mt-0.5">
                  Lobby &rarr; All Rise &rarr; Live Session
                </p>
              </div>
              <span className="text-gold text-lg">&rarr;</span>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </button>
          <button
            onClick={() => { setSpectatorMode(true); setPhase("lobby"); }}
            className="w-full py-2.5 rounded-xl border border-court-border bg-white/[0.02] text-xs text-court-text-sec font-semibold flex items-center justify-center gap-2"
          >
            Join as Spectator
          </button>
        </section>
      )}

      {/* Opponent */}
      {SESSION.isVirtual && SESSION.opponent && (
        <section className="px-4 mb-3">
          <Card className="p-4">
            <h3 className="text-xs font-bold text-court-text tracking-wider uppercase mb-3">Your Opponent</h3>
            <div className="flex items-center gap-3">
              <Avatar initials={SESSION.opponent.initials} chamber={SESSION.opponent.chamber} size="md" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-court-text">{SESSION.opponent.name}</p>
                <p className="text-court-sm text-court-text-ter">{SESSION.opponent.university}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-court-xs text-green-500 font-semibold">Online</span>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Roles */}
      <section className="px-4 mb-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-serif text-lg font-bold text-court-text">Roles</h2>
          <span className="text-court-sm text-court-text-sec">{filled}/{ROLES.length} filled</span>
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
                  <p className="text-court-base font-bold text-court-text">{r.role}</p>
                  {r.timeLimit && <p className="text-court-xs text-court-text-ter mt-0.5 flex items-center gap-1"><Timer size={10} /> {r.timeLimit} min</p>}
                </div>
                {isClaimed ? (
                  <span className="text-court-sm text-green-500 font-semibold whitespace-nowrap flex items-center gap-1">
                    <Check size={12} /> {claimed[i] ? "You" : r.user?.split(" ")[0]}
                  </span>
                ) : (
                  <button onClick={() => setClaimed((p) => ({ ...p, [i]: true }))} className="text-court-xs text-gold font-bold bg-gold-dim border border-gold/25 rounded-lg px-3 py-1.5 whitespace-nowrap">
                    Claim
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Preparation */}
      <section className="px-4 mb-3">
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
              <div className={`w-5 h-5 rounded-md flex items-center justify-center text-court-xs ${
                t.done ? "bg-green-500/20 text-green-500" : "border border-court-border text-transparent"
              }`}>
                {t.done ? <Check size={12} /> : ""}
              </div>
              <span className={`text-court-base ${t.done ? "text-court-text-sec line-through" : "text-court-text"}`}>
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

      {/* Reschedule Modal */}
      <AnimatePresence>
        {showReschedule && (
          <RescheduleModal
            sessionTitle={SESSION.title}
            currentDate={SESSION.date}
            currentTime={SESSION.time}
            onReschedule={(d, s, e) => {
              setRescheduled(true);
              setShowReschedule(false);
            }}
            onCancel={() => setShowReschedule(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
