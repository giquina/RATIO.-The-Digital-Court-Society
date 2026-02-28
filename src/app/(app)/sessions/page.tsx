"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Avatar, Tag, Card, Button, ProgressBar, EmptyState, SessionCardSkeleton } from "@/components/ui";
import { useIsDemoAccount } from "@/hooks/useIsDemoAccount";
import { DEMO_UPCOMING_SESSIONS, DEMO_PAST_SESSIONS } from "@/lib/constants/demo-data";
import { Calendar, Clock, Check, BookOpen } from "lucide-react";
import { courtToast } from "@/lib/utils/toast";
import PageWithPanel from "@/components/shared/PageWithPanel";

function formatSessionDate(isoDate: string) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function formatSessionTime(startTime: string, endTime: string) {
  return `${startTime}\u2013${endTime}`;
}

function formatSessionType(type: string) {
  const map: Record<string, string> = {
    moot: "Moot",
    mock_trial: "Mock Trial",
    sqe2_prep: "SQE2 Prep",
    debate: "Debate",
    workshop: "Workshop",
  };
  return map[type] ?? type;
}

function getTypeTagColor(type: string): "gold" | "burgundy" | "green" | "blue" | "orange" {
  const map: Record<string, "gold" | "burgundy" | "green" | "blue" | "orange"> = {
    moot: "gold",
    mock_trial: "burgundy",
    sqe2_prep: "green",
    debate: "blue",
    workshop: "orange",
  };
  return map[type] ?? "gold";
}

// ── Role list sub-component (fetches roles per session) ──
function SessionRolesList({
  sessionId,
  profileId,
}: {
  sessionId: Id<"sessions">;
  profileId: Id<"profiles"> | undefined;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roles: any[] | undefined = useQuery(anyApi.sessions.getRoles, { sessionId });
  const claimRole = useMutation(anyApi.sessions.claimRole);
  const unclaimRole = useMutation(anyApi.sessions.unclaimRole);
  const [claiming, setClaiming] = useState<string | null>(null);

  if (roles === undefined) {
    return (
      <div className="mb-3.5 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center py-1.5">
            <div className="h-3 w-1/3 bg-white/[0.08] rounded animate-pulse" />
            <div className="h-3 w-16 bg-white/[0.08] rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (roles.length === 0) return null;

  const handleClaim = async (roleId: Id<"sessionRoles">) => {
    if (!profileId) {
      courtToast.error("Profile not loaded", "Please wait and try again.");
      return;
    }
    setClaiming(roleId);
    try {
      await claimRole({ roleId, profileId, sessionId });
      courtToast.success("Role claimed", "You have been assigned to this role.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not claim role.";
      courtToast.error("Failed to claim role", message);
    } finally {
      setClaiming(null);
    }
  };

  const handleUnclaim = async (roleId: Id<"sessionRoles">) => {
    if (!profileId) return;
    setClaiming(roleId);
    try {
      await unclaimRole({ roleId, profileId, sessionId });
      courtToast.success("Role released", "You have been removed from this role.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not release role.";
      courtToast.error("Failed to release role", message);
    } finally {
      setClaiming(null);
    }
  };

  const sortedRoles = [...roles].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="mb-3.5">
      {sortedRoles.map((r) => {
        const isClaimedByMe = r.claimedBy === profileId;
        return (
          <div key={r._id} className="flex justify-between items-center py-1.5 border-b border-court-border-light last:border-0">
            <div className="flex gap-2 items-center">
              {r.isClaimed && (
                <Avatar
                  initials={isClaimedByMe ? "You" : "??"}
                  chamber="Gray's"
                  size="xs"
                />
              )}
              <span className="text-court-sm text-court-text-sec">{r.roleName}</span>
            </div>
            {r.isClaimed ? (
              isClaimedByMe ? (
                <button
                  onClick={() => handleUnclaim(r._id)}
                  disabled={claiming === r._id}
                  className="text-court-xs text-green-500 font-semibold flex items-center gap-0.5 hover:text-red-400 transition-colors"
                >
                  <Check size={12} /> You
                </button>
              ) : (
                <span className="text-court-sm text-green-500 font-semibold flex items-center gap-0.5">
                  <Check size={12} /> Claimed
                </span>
              )
            ) : (
              <button
                onClick={() => handleClaim(r._id)}
                disabled={claiming === r._id}
                className="text-court-xs text-gold font-bold bg-gold-dim border border-gold/25 rounded-md px-2.5 py-0.5 hover:bg-gold/20 transition-colors disabled:opacity-50"
              >
                {claiming === r._id ? "Claiming..." : "Claim Role"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SessionsPage() {
  const [tab, setTab] = useState(0);
  const router = useRouter();

  // ── Real Convex data ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const profile: any = useQuery(anyApi.users.myProfile);
  const isDemo = useIsDemoAccount();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upcomingSessions: any[] | undefined = useQuery(anyApi.sessions.list, { status: "upcoming" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pastSessions: any[] | undefined = useQuery(anyApi.sessions.list, { status: "completed" });

  const handleTabClick = (index: number) => {
    if (index === 1) {
      // "Create" tab navigates to the create page
      router.push("/sessions/create");
      return;
    }
    setTab(index);
  };

  const handleViewDetails = (sessionId: string) => {
    router.push(`/sessions/${sessionId}`);
  };

  const renderSessionCard = (s: NonNullable<typeof upcomingSessions>[number], isPast = false) => {
    const displayType = formatSessionType(s.type);
    const displayDate = formatSessionDate(s.date);
    const displayTime = formatSessionTime(s.startTime, s.endTime);
    const uni = s.isCrossUniversity ? "Cross-University" : s.university;
    const hasMax = s.maxParticipants !== undefined && s.maxParticipants > 0;
    const spotsLeft = hasMax ? s.maxParticipants! - s.participantCount : 0;

    return (
      <Card key={s._id} className="overflow-hidden">
        <div className="px-4 py-2.5 flex justify-between items-center border-b border-court-border-light">
          <div className="flex gap-2 items-center">
            <Tag color={getTypeTagColor(s.type)}>
              {displayType.toUpperCase()}
            </Tag>
            <span className="text-court-sm text-court-text-ter">{s.module}</span>
          </div>
          <div className="flex items-center gap-2">
            {isPast && <Tag color="blue" small>COMPLETED</Tag>}
            <span className="text-court-sm text-court-text-sec">{uni}</span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-serif text-base font-bold text-court-text mb-2 leading-tight">{s.title}</h3>
          <div className="flex gap-4 text-court-sm text-court-text-sec mb-3.5">
            <span className="flex items-center gap-1"><Calendar size={12} className="text-court-text-ter" /> {displayDate}</span>
            <span className="flex items-center gap-1"><Clock size={12} className="text-court-text-ter" /> {displayTime}</span>
          </div>

          {/* Roles list — fetched per session */}
          {!isPast && (
            <SessionRolesList sessionId={s._id} profileId={profile?._id} />
          )}

          {/* Participant progress bar (always shown) */}
          {hasMax && (
            <div className="mb-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-court-sm text-court-text-sec">{s.participantCount}/{s.maxParticipants} participants</span>
                {!isPast && spotsLeft > 0 && (
                  <span className="text-court-sm text-gold font-semibold">{spotsLeft} spots left</span>
                )}
              </div>
              <ProgressBar pct={(s.participantCount / s.maxParticipants!) * 100} />
            </div>
          )}

          {isPast ? (
            <Button fullWidth variant="secondary" onClick={() => handleViewDetails(s._id)}>
              View Session Summary
            </Button>
          ) : (
            <Button
              fullWidth
              variant="secondary"
              onClick={() => handleViewDetails(s._id)}
            >
              View Session Details
            </Button>
          )}
        </div>
      </Card>
    );
  };

  // ── Loading skeletons ──
  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((i) => (
        <SessionCardSkeleton key={i} />
      ))}
    </>
  );

  return (
    <PageWithPanel panelPosition="left" heading="The Bench" subheading="Schedule, join, and review your moot court sessions">
    <div className="pb-6">
      <div className="px-4 pt-3 pb-4">
        <h1 className="font-serif text-2xl font-bold text-court-text mb-1">Sessions</h1>
        <p className="text-court-sm text-court-text-sec mb-3.5">
          Schedule, join, and review your moot court sessions
        </p>
        <div className="flex gap-1 bg-white/[0.04] rounded-xl p-0.5">
          {["Upcoming", "Create", "Past"].map((t, i) => (
            <button
              key={t}
              onClick={() => handleTabClick(i)}
              className={`flex-1 py-2 rounded-lg text-court-sm font-bold transition-all ${
                tab === i && i !== 1 ? "bg-gold text-navy" : "text-court-text-sec"
              } ${i === 1 ? "hover:text-gold" : ""}`}
            >
              {i === 1 ? "+ Create" : t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {tab === 0 && (
          <>
            {upcomingSessions === undefined ? (
              renderSkeletons()
            ) : upcomingSessions.length === 0 ? (
              isDemo ? (
                DEMO_UPCOMING_SESSIONS.map((s) => (
                  <Card key={s._id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-court-sm font-bold text-court-text">{s.title}</p>
                        <p className="text-court-xs text-court-text-ter">{s.module} · {formatSessionType(s.type)}</p>
                      </div>
                      <Tag color="green">Upcoming</Tag>
                    </div>
                    <p className="text-court-xs text-court-text-sec">
                      {new Date(s.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      {" · "}{s.participantCount} advocates · Hosted by {s.hostName}
                    </p>
                  </Card>
                ))
              ) : (
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
              )
            ) : (
              upcomingSessions.map((s) => renderSessionCard(s))
            )}
          </>
        )}

        {tab === 2 && (
          <>
            {pastSessions === undefined ? (
              renderSkeletons()
            ) : pastSessions.length === 0 ? (
              isDemo ? (
                DEMO_PAST_SESSIONS.map((s) => (
                  <Card key={s._id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-court-sm font-bold text-court-text">{s.title}</p>
                        <p className="text-court-xs text-court-text-ter">{s.module} · {s.personaName}</p>
                      </div>
                      <Tag color="gold">{s.overallScore}/5.0</Tag>
                    </div>
                    <div className="flex items-center gap-3 text-court-xs text-court-text-sec">
                      <span>{s.exchanges}/{s.maxExchanges} exchanges</span>
                      <span>{new Date(s.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                    </div>
                  </Card>
                ))
              ) : (
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
              )
            ) : (
              pastSessions.map((s) => renderSessionCard(s, true))
            )}
          </>
        )}
      </div>
    </div>
    </PageWithPanel>
  );
}
