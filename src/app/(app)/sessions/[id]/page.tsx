"use client";

import { useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Id } from "../../../../../convex/_generated/dataModel";
import { Avatar, Tag, Card, Button, ProgressBar, Skeleton } from "@/components/ui";
import {
  MootRoom, PreSessionLobby, PostSessionRating,
  CourtroomEntrance, AIFeedback, RescheduleModal,
} from "@/components/video";
import type { RatingData } from "@/components/video";
import { downloadICS, getGoogleCalendarUrl } from "@/lib/utils/calendar";
import { courtToast } from "@/lib/utils/toast";
import { getInitials } from "@/lib/utils/helpers";
import { Calendar, Clock, Video, Timer, Check } from "lucide-react";

type Phase = "details" | "lobby" | "entrance" | "live" | "rating" | "ai_feedback" | "done";

/** Format session type for display: "moot" -> "Moot", "mock_trial" -> "Mock Trial" */
function formatSessionType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Format an ISO date string for display: "2026-02-25" -> "Tuesday, 25 February 2026" */
function formatSessionDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/** Build Date objects from session date + time strings */
function buildDateFromSession(dateStr: string, timeStr: string): Date {
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(dateStr + "T00:00:00");
    date.setHours(hours, minutes, 0, 0);
    return date;
  } catch {
    return new Date();
  }
}

export default function SessionDetailPage() {
  const params = useParams();
  const sessionId = params.id as Id<"sessions">;

  // ── Convex queries ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session: any = useQuery(anyApi.sessions.getById, { sessionId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roles: any[] | undefined = useQuery(anyApi.sessions.getRoles, { sessionId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const participants: any[] | undefined = useQuery(anyApi.sessions.getParticipants, { sessionId });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);

  // ── Convex mutations ──
  const claimRoleMutation = useMutation(anyApi.sessions.claimRole);
  const unclaimRoleMutation = useMutation(anyApi.sessions.unclaimRole);

  // ── Local UI state ──
  const [phase, setPhase] = useState<Phase>("details");
  const [sessionDuration, setSessionDuration] = useState("00:00");
  const [showReschedule, setShowReschedule] = useState(false);
  const [spectatorMode, setSpectatorMode] = useState(false);
  const [rescheduled, setRescheduled] = useState(false);

  // ── Derived data ──
  const participantProfileMap = useMemo(() => {
    const map: Record<string, { fullName: string; chamber?: string }> = {};
    if (participants) {
      for (const p of participants) {
        if (p.profile) {
          map[p.profileId] = {
            fullName: p.profile.fullName,
            chamber: p.profile.chamber,
          };
        }
      }
    }
    return map;
  }, [participants]);

  const mappedRoles = useMemo(() => {
    return (roles ?? []).map((r) => {
      const claimerProfile = r.claimedBy ? participantProfileMap[r.claimedBy] : undefined;
      const isCurrentUser = profile && r.claimedBy === profile._id;
      return {
        id: r._id,
        role: r.roleName,
        filled: r.isClaimed,
        user: claimerProfile?.fullName ?? (r.isClaimed ? "Claimed" : undefined),
        initials: claimerProfile ? getInitials(claimerProfile.fullName) : undefined,
        chamber: claimerProfile?.chamber,
        timeLimit: r.speakingTimeLimit,
        isCurrentUser,
        claimedBy: r.claimedBy,
      };
    });
  }, [roles, participantProfileMap, profile]);

  const filledCount = mappedRoles.filter((r) => r.filled).length;
  const totalRoles = mappedRoles.length;

  // Formatted session display values
  const displayType = session ? formatSessionType(session.type) : "";
  const displayDate = session ? formatSessionDate(session.date) : "";
  const displayTime = session ? `${session.startTime} \u2013 ${session.endTime}` : "";
  const displayLocation = session?.location || "Virtual \u2014 Video Session";
  const isVirtual = !session?.location || session.location.toLowerCase().includes("virtual");
  const displayDescription = session?.description || session?.issueSummary || "";

  // Creator profile from participants
  const creatorProfile = session?.createdBy ? participantProfileMap[session.createdBy] : undefined;
  const creatorName = creatorProfile?.fullName ?? "Unknown";
  const creatorInitials = creatorProfile ? getInitials(creatorProfile.fullName) : "?";
  const creatorChamber = creatorProfile?.chamber;

  // Current user info
  const userName = profile?.fullName ?? "Advocate";
  const userInitials = profile ? getInitials(profile.fullName) : "?";
  const userChamber = profile?.chamber ?? "";

  // Calendar dates
  const calendarStartDate = session ? buildDateFromSession(session.date, session.startTime) : new Date();
  const calendarEndDate = session ? buildDateFromSession(session.date, session.endTime) : new Date();

  // ── Role claim/unclaim handlers ──
  const handleClaim = async (roleId: string) => {
    if (!profile) return;
    try {
      await claimRoleMutation({
        roleId: roleId as Id<"sessionRoles">,
        profileId: profile._id,
        sessionId,
      });
      courtToast.success("Role claimed");
    } catch {
      courtToast.error("Failed to claim role");
    }
  };

  const handleUnclaim = async (roleId: string) => {
    if (!profile) return;
    try {
      await unclaimRoleMutation({
        roleId: roleId as Id<"sessionRoles">,
        profileId: profile._id,
        sessionId,
      });
      courtToast.success("Role released");
    } catch {
      courtToast.error("Failed to release role");
    }
  };

  const handleCalendarExport = () => {
    if (!session) return;
    downloadICS({
      title: `Ratio ${displayType}: ${session.title}`,
      description: `${displayType} \u2014 ${session.module}\n\n${displayDescription}`,
      location: displayLocation,
      startDate: calendarStartDate,
      endDate: calendarEndDate,
    });
  };

  const handleEntranceComplete = useCallback(() => {
    setPhase("live");
  }, []);

  // ── Loading state ──
  if (session === undefined) {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-2">
          <Link href="/sessions" className="text-court-sm text-court-text-ter">&larr; Sessions</Link>
        </div>
        <section className="px-4 space-y-3">
          <Card className="overflow-hidden">
            <div className="bg-burgundy/20 px-4 py-2.5 flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-16 w-full" />
            </div>
          </Card>
          <Card className="p-4 space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </Card>
        </section>
      </div>
    );
  }

  // ── Not found state ──
  if (session === null) {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-2">
          <Link href="/sessions" className="text-court-sm text-court-text-ter">&larr; Sessions</Link>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <h2 className="font-serif text-xl font-bold text-court-text mb-2">Session not found</h2>
          <p className="text-court-base text-court-text-sec mb-6">This session may have been removed or the link is invalid.</p>
          <Link href="/sessions"><Button>Back to Sessions</Button></Link>
        </div>
      </div>
    );
  }

  // ── Phase: Lobby ──
  if (phase === "lobby") {
    return (
      <PreSessionLobby
        session={{
          title: session.title,
          module: session.module,
          type: displayType,
          scheduledTime: displayDate + " \u00B7 " + displayTime,
          scheduledDate: calendarStartDate,
          opponent: undefined as any,
          caseDescription: displayDescription,
        }}
        userName={userName}
        userInitials={userInitials}
        userChamber={userChamber}
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
        sessionTitle={session.title}
      />
    );
  }

  // ── Phase: Live Video ──
  if (phase === "live") {
    return (
      <MootRoom
        userName={userName}
        sessionTitle={session.title}
        opponent="Opponent"
        opponentInitials="?"
        opponentChamber=""
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
        sessionTitle={session.title}
        duration={sessionDuration}
        opponent={{ name: "Opponent", initials: "?", chamber: "" }}
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
        sessionTitle={session.title}
        module={session.module}
        duration={sessionDuration}
        onClose={() => setPhase("done")}
      />
    );
  }

  // ── Phase: Done ──
  if (phase === "done") {
    return (
      <div className="pb-6">
        <div className="px-4 pt-3 pb-2">
          <Link href="/sessions" className="text-court-sm text-court-text-ter">&larr; Sessions</Link>
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
          <p className="text-court-base text-court-text-sec mb-1">Saved to your portfolio</p>
          <p className="text-court-sm text-court-text-ter mb-6">Duration: {sessionDuration}</p>

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
      <div className="px-4 pt-3 pb-2 flex justify-between items-center">
        <Link href="/sessions" className="text-court-sm text-court-text-ter">&larr; Sessions</Link>
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
          <div className="bg-burgundy/20 px-4 py-2.5 flex justify-between items-start flex-wrap gap-1.5">
            <div className="flex gap-1.5 items-center flex-wrap">
              <Tag color="burgundy">{displayType.toUpperCase()}</Tag>
              <Tag color="gold">{session.module}</Tag>
            </div>
            <div className="flex gap-1.5 items-center flex-wrap">
              {isVirtual && <Tag color="blue">VIRTUAL</Tag>}
              {rescheduled ? (
                <Tag color="orange" small>RESCHEDULED</Tag>
              ) : (
                <Tag color="green" small>{session.status?.toUpperCase() ?? "UPCOMING"}</Tag>
              )}
            </div>
          </div>
          <div className="p-4">
            <h1 className="font-serif text-xl font-bold text-court-text leading-tight mb-3">{session.title}</h1>
            <div className="flex flex-col gap-1.5 text-court-base text-court-text-sec mb-3.5">
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-court-text-ter" /> {displayDate}</span>
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-court-text-ter" /> {displayTime}</span>
              <span className="flex items-center gap-1.5"><Video size={12} className="text-court-text-ter" /> {displayLocation}</span>
            </div>
            <p className="text-court-base text-court-text-sec leading-relaxed">{displayDescription}</p>
            <div className="mt-3.5 pt-3 border-t border-court-border-light flex items-center gap-2">
              <Avatar initials={creatorInitials} chamber={creatorChamber} size="xs" />
              <span className="text-court-sm text-court-text-ter">Created by {creatorName}</span>
            </div>
          </div>
        </Card>
      </section>

      {/* Calendar export */}
      <section className="px-4 mb-3">
        <div className="flex gap-2">
          <button
            onClick={handleCalendarExport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-court-border text-court-sm text-court-text-sec"
          >
            <Calendar size={12} /> Download .ics
          </button>
          <a
            href={getGoogleCalendarUrl({
              title: `Ratio: ${session.title}`,
              description: displayDescription,
              location: displayLocation,
              startDate: calendarStartDate,
              endDate: calendarEndDate,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-court-border text-court-sm text-court-text-sec"
          >
            Google Calendar
          </a>
        </div>
      </section>

      {/* Join Video / Spectator */}
      {isVirtual && (
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
                <p className="text-base font-bold text-gold font-serif">Join Video {displayType}</p>
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
            className="w-full py-2.5 rounded-xl border border-court-border bg-white/[0.02] text-court-sm text-court-text-sec font-semibold flex items-center justify-center gap-2"
          >
            Join as Spectator
          </button>
        </section>
      )}

      {/* Roles */}
      <section className="px-4 mb-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-serif text-lg font-bold text-court-text">Roles</h2>
          <span className="text-court-sm text-court-text-sec">{filledCount}/{totalRoles} filled</span>
        </div>
        {totalRoles > 0 && <ProgressBar pct={(filledCount / totalRoles) * 100} height={3} />}
        <div className="mt-3 flex flex-col gap-2">
          {mappedRoles.map((r) => {
            return (
              <Card key={r.id} className={`px-3.5 py-3 flex items-center gap-3 ${r.filled ? "" : "border-dashed"}`}>
                {r.filled && r.initials ? (
                  <Avatar initials={r.initials} chamber={r.chamber} size="sm" />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-court-border flex items-center justify-center shrink-0">
                    <span className="text-court-text-ter text-court-sm">?</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-court-base font-bold text-court-text">{r.role}</p>
                  {r.timeLimit && <p className="text-court-xs text-court-text-ter mt-0.5 flex items-center gap-1"><Timer size={10} /> {r.timeLimit} min</p>}
                </div>
                {r.filled ? (
                  <span className="text-court-sm text-green-500 font-semibold whitespace-nowrap flex items-center gap-1">
                    <Check size={12} /> {r.isCurrentUser ? "You" : r.user?.split(" ")[0]}
                  </span>
                ) : (
                  <button
                    onClick={() => handleClaim(r.id)}
                    className="text-court-xs text-gold font-bold bg-gold-dim border border-gold/25 rounded-lg px-3 py-1.5 whitespace-nowrap"
                  >
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
            sessionTitle={session.title}
            currentDate={displayDate}
            currentTime={displayTime}
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
