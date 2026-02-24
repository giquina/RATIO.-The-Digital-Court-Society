"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { Eye, Users, Scale, ArrowLeft, Clock, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Spectator Mode — /spectate/[code]
 *
 * A read-only, real-time view of a live AI moot session.
 * Anyone with the 8-character code can watch the transcript
 * update in real time (via Convex subscriptions).
 * No authentication required.
 */

const MODE_LABELS: Record<string, { title: string; icon: string }> = {
  judge: { title: "The Honourable Justice AI", icon: "⚖️" },
  mentor: { title: "Senior Counsel", icon: "📋" },
  examiner: { title: "SQE2 Examiner", icon: "📝" },
  opponent: { title: "Opposing Counsel", icon: "🏛️" },
};

export default function SpectatePage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params.code === "string" ? params.code.toUpperCase() : "";

  // Real-time subscription — Convex will push updates whenever the transcript changes
  const session = useQuery(anyApi.aiSessions.getBySpectatorCode, code ? { code } : "skip");
  const joinSpectator = useMutation(anyApi.aiSessions.joinAsSpectator);
  const leaveSpectator = useMutation(anyApi.aiSessions.leaveAsSpectator);

  const [hasJoined, setHasJoined] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevTranscriptLen = useRef(0);

  // Join on mount, leave on unmount
  useEffect(() => {
    if (session && session._id && !hasJoined) {
      joinSpectator({ sessionId: session._id }).catch(() => {});
      setHasJoined(true);
    }

    return () => {
      if (session && session._id && hasJoined) {
        leaveSpectator({ sessionId: session._id }).catch(() => {});
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?._id, hasJoined]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (session && session.transcript.length > prevTranscriptLen.current) {
      prevTranscriptLen.current = session.transcript.length;
      setTimeout(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [session?.transcript.length]);

  // ── Loading ──
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-court-sm text-court-text-sec">Connecting to session...</p>
          <p className="text-court-xs text-court-text-ter mt-1">Code: {code}</p>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (session === null) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Scale className="w-12 h-12 text-court-text-ter mx-auto mb-4" />
          <h1 className="font-serif text-xl font-bold text-court-text mb-2">Session Not Found</h1>
          <p className="text-court-sm text-court-text-sec mb-6">
            This spectator code is invalid or the session is no longer available. Check the code
            and try again, or ask the advocate to share a new link.
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold text-navy-deep text-court-sm font-bold"
          >
            <ArrowLeft size={14} />
            Go to Ratio
          </button>
        </div>
      </div>
    );
  }

  const modeInfo = MODE_LABELS[session.mode] || MODE_LABELS.judge;
  const isLive = session.status === "in_progress";

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      {/* ── Header ── */}
      <header className="shrink-0 border-b border-court-border-light bg-navy-deep/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-gold" />
              <span className="text-court-xs text-gold uppercase tracking-widest font-bold">
                Spectator Mode
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isLive && (
                <span className="flex items-center gap-1.5 text-court-xs text-red-400">
                  <Radio size={10} className="animate-pulse" />
                  LIVE
                </span>
              )}
              <span className="flex items-center gap-1 text-court-xs text-court-text-ter">
                <Users size={12} />
                {session.spectatorCount ?? 0} watching
              </span>
            </div>
          </div>

          {/* Case info */}
          <h1 className="font-serif text-lg font-bold text-court-text leading-snug">
            {session.caseTitle}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-court-xs text-court-text-ter">{session.areaOfLaw}</span>
            <span className="text-court-xs text-court-text-ter">·</span>
            <span className="text-court-xs text-court-text-sec">{session.advocateName}</span>
            <span className="text-court-xs text-court-text-ter">·</span>
            <span className="text-court-xs text-court-text-ter">{modeInfo.icon} {modeInfo.title}</span>
          </div>
        </div>
      </header>

      {/* ── Transcript ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Court in session banner */}
          <div className="text-center mb-6 py-3 border-y border-court-border-light/30">
            <p className="text-court-xs text-court-text-ter uppercase tracking-widest">
              {isLive ? "Court is in session" : "Session concluded"}
            </p>
          </div>

          {/* Messages */}
          <AnimatePresence initial={false}>
            {session.transcript.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-court-xs text-court-text-ter font-mono w-6 shrink-0 text-right">
                    {i + 1}.
                  </span>
                  <span
                    className={`text-court-xs font-bold uppercase tracking-wider ${
                      msg.role === "user" ? "text-gold" : "text-court-text-sec"
                    }`}
                  >
                    {msg.role === "user" ? "Counsel" : "The Court"}
                  </span>
                  <span className="text-court-xs text-court-text-ter">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <p className="text-court-sm text-court-text leading-relaxed pl-8">
                  {msg.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Waiting indicator when live */}
          {isLive && (
            <div className="flex items-center gap-2 pl-8 mt-4">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gold/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-court-xs text-court-text-ter italic">
                Waiting for submissions...
              </span>
            </div>
          )}

          {/* Session ended */}
          {!isLive && session.transcript.length > 0 && (
            <div className="text-center mt-8 py-4 border-t border-court-border-light/30">
              <p className="text-court-xs text-court-text-ter uppercase tracking-widest">
                End of session · {session.transcript.length} exchanges
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-navy-card border border-court-border text-court-sm text-court-text-sec hover:text-court-text transition-colors"
              >
                <ArrowLeft size={14} />
                Go to Ratio
              </button>
            </div>
          )}

          {/* Empty state */}
          {session.transcript.length === 0 && (
            <div className="text-center py-12">
              <Clock size={32} className="text-court-text-ter mx-auto mb-3" />
              <p className="text-court-sm text-court-text-sec">Session hasn&apos;t started yet</p>
              <p className="text-court-xs text-court-text-ter mt-1">
                The transcript will appear here in real time once the advocate begins.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="shrink-0 border-t border-court-border-light/30 bg-navy-deep/50 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">
          <p className="text-court-xs text-court-text-ter">
            Ratio — The Digital Court Society
          </p>
          <p className="text-court-xs text-court-text-ter">
            Read-only · Spectator view
          </p>
        </div>
      </footer>
    </div>
  );
}
