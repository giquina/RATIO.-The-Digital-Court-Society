"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Avatar, Tag } from "@/components/ui";
import { Scale, Clock, Calendar, Bell, Video, Mic, Globe, Check } from "lucide-react";
import { playTick, playCountdownFinal, resumeAudio } from "@/lib/utils/sounds";
import { downloadICS, getGoogleCalendarUrl } from "@/lib/utils/calendar";

interface PreSessionLobbyProps {
  session: {
    title: string;
    module: string;
    type: string;
    scheduledTime: string;
    scheduledDate?: Date;
    opponent: { name: string; initials: string; chamber: string; university: string };
    caseDescription?: string;
  };
  userName: string;
  userInitials: string;
  userChamber: string;
  onJoin: () => void;
  onCancel: () => void;
}

export function PreSessionLobby({
  session,
  userName,
  userInitials,
  userChamber,
  onJoin,
  onCancel,
}: PreSessionLobbyProps) {
  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [opponentOnline, setOpponentOnline] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    resumeAudio();
  }, []);

  // Simulate device check with staggered reveals
  useEffect(() => {
    const t1 = setTimeout(() => setCameraReady(true), 800);
    const t2 = setTimeout(() => { setMicReady(true); setChecking(false); }, 1400);
    const t3 = setTimeout(() => setOpponentOnline(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Countdown with sound
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) { playCountdownFinal(); onJoin(); return; }
    playTick();
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onJoin]);

  const handleEnterChambers = () => {
    if (!consentGiven) return;
    setCountdown(3);
  };

  const handleEnableNotifications = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotificationsEnabled(perm === "granted");
    }
  };

  const handleCalendarExport = () => {
    const now = new Date();
    const start = session.scheduledDate || new Date(now.getTime() + 3600000);
    const end = new Date(start.getTime() + 5400000);
    downloadICS({
      title: `Ratio Moot: ${session.title}`,
      description: `${session.type} — ${session.module}\nOpponent: ${session.opponent.name}\n\n${session.caseDescription || ""}`,
      location: "Ratio App — Virtual Session",
      startDate: start,
      endDate: end,
    });
  };

  const allReady = cameraReady && micReady && opponentOnline && consentGiven;

  const stagger = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <div className="fixed inset-0 z-[100] bg-navy overflow-y-auto">
      <div className="max-w-lg mx-auto px-4 pt-[max(env(safe-area-inset-top,0px),24px)] pb-12">
        {/* Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-14 h-14 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center mx-auto mb-3"
            animate={{ boxShadow: ["0 0 0 0 rgba(201,168,76,0)", "0 0 0 12px rgba(201,168,76,0.08)", "0 0 0 0 rgba(201,168,76,0)"] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Scale size={28} className="text-gold" />
          </motion.div>
          <h1 className="font-serif text-xl font-bold text-court-text mb-1">Pre-Session Lobby</h1>
          <p className="text-xs text-court-text-sec">Prepare to enter chambers</p>
        </motion.div>

        {/* Session info */}
        <motion.div custom={0} variants={stagger} initial="hidden" animate="visible">
          <Card className="p-4 mb-3" highlight>
            <div className="flex gap-2 items-center mb-2">
              <Tag color="gold">{session.type.toUpperCase()}</Tag>
              <Tag color="blue">{session.module}</Tag>
            </div>
            <h2 className="font-serif text-base font-bold text-court-text leading-tight mb-1.5">
              {session.title}
            </h2>
            <p className="text-court-sm text-court-text-sec flex items-center gap-1">
              <Clock size={12} className="shrink-0" />
              {session.scheduledTime}
            </p>
            {session.caseDescription && (
              <p className="text-court-sm text-court-text-ter mt-2 leading-relaxed border-t border-court-border-light pt-2">
                {session.caseDescription}
              </p>
            )}
          </Card>
        </motion.div>

        {/* Quick actions: calendar + notifications */}
        <motion.div custom={1} variants={stagger} initial="hidden" animate="visible">
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleCalendarExport}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] border border-court-border text-xs text-court-text-sec"
            >
              <Calendar size={14} className="shrink-0" /> Add to Calendar
            </button>
            <button
              onClick={handleEnableNotifications}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs ${
                notificationsEnabled
                  ? "bg-green-500/10 border-green-500/20 text-green-500"
                  : "bg-white/[0.03] border-court-border text-court-text-sec"
              }`}
            >
              <Bell size={14} className="shrink-0" /> {notificationsEnabled ? "Reminders On" : "Enable Reminders"}
            </button>
          </div>
        </motion.div>

        {/* Device checks */}
        <motion.div custom={2} variants={stagger} initial="hidden" animate="visible">
          <Card className="p-4 mb-3">
            <h3 className="text-xs font-bold text-court-text tracking-wider uppercase mb-3">Device Check</h3>
            <div className="flex flex-col gap-3">
              {([
                { icon: Video, label: "Camera", ready: cameraReady, checking: checking && !cameraReady },
                { icon: Mic, label: "Microphone", ready: micReady, checking: checking && !micReady },
                { icon: Globe, label: "Connection", ready: true, checking: false },
              ] as { icon: React.ElementType; label: string; ready: boolean; checking: boolean }[]).map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <item.icon size={18} className="text-court-text" />
                    <span className="text-xs text-court-text">{item.label}</span>
                  </div>
                  <AnimatePresence mode="wait">
                    {item.checking ? (
                      <motion.span
                        key="checking"
                        className="text-court-xs text-court-text-ter"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        Checking...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="ready"
                        className="text-court-xs text-green-500 font-bold"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <Check size={12} className="inline-block mr-0.5" /> Ready
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Camera preview */}
        <motion.div custom={3} variants={stagger} initial="hidden" animate="visible">
          <Card className="mb-3 overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-[#162033] to-[#0C1220] flex items-center justify-center relative">
              <div className="flex flex-col items-center gap-2">
                <Avatar initials={userInitials} chamber={userChamber} size="lg" border />
                <span className="text-sm font-semibold text-court-text">{userName}</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-court-xs text-white font-medium">Live</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Opponent status */}
        <motion.div custom={4} variants={stagger} initial="hidden" animate="visible">
          <Card className="p-4 mb-3">
            <h3 className="text-xs font-bold text-court-text tracking-wider uppercase mb-3">Opponent</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  initials={session.opponent.initials}
                  chamber={session.opponent.chamber}
                  size="sm"
                  online={opponentOnline}
                />
                <div>
                  <p className="text-xs font-semibold text-court-text">{session.opponent.name}</p>
                  <p className="text-court-xs text-court-text-ter">{session.opponent.university}</p>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {opponentOnline ? (
                  <motion.span
                    key="online"
                    className="text-court-xs text-green-500 font-bold bg-green-500/10 px-2.5 py-1 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Check size={12} className="inline-block mr-0.5" /> In lobby
                  </motion.span>
                ) : (
                  <motion.span
                    key="waiting"
                    className="text-court-xs text-court-text-ter"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Waiting...
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>

        {/* Consent */}
        <motion.div custom={5} variants={stagger} initial="hidden" animate="visible">
          <Card className="p-4 mb-5">
            <button
              onClick={() => setConsentGiven(!consentGiven)}
              className="flex items-start gap-3 w-full text-left"
            >
              <motion.div
                className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                  consentGiven ? "bg-gold text-navy" : "border border-court-border"
                }`}
                animate={consentGiven ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                {consentGiven && <Check size={12} className="text-navy" />}
              </motion.div>
              <div>
                <p className="text-xs font-semibold text-court-text mb-0.5">
                  I consent to camera &amp; microphone access
                </p>
                <p className="text-court-xs text-court-text-ter leading-relaxed">
                  Video and audio shared with participants during this session.
                  No recording unless explicitly enabled and consented to by all parties.
                </p>
              </div>
            </button>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div custom={6} variants={stagger} initial="hidden" animate="visible">
          <AnimatePresence mode="wait">
            {countdown !== null ? (
              <motion.div
                key="countdown"
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(201,168,76,0)",
                      "0 0 0 20px rgba(201,168,76,0.15)",
                      "0 0 0 0 rgba(201,168,76,0)",
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="font-serif text-4xl font-bold text-gold">{countdown}</span>
                </motion.div>
                <p className="text-sm font-semibold text-court-text">Entering Chambers...</p>
                <p className="text-court-xs text-court-text-ter mt-1">Prepare your submissions</p>
              </motion.div>
            ) : (
              <motion.div key="buttons" className="flex flex-col gap-2.5">
                <Button
                  fullWidth
                  disabled={!allReady}
                  onClick={handleEnterChambers}
                >
                  {!consentGiven
                    ? "Grant consent to continue"
                    : !opponentOnline
                    ? "Waiting for opponent..."
                    : "Enter Chambers"}
                </Button>
                <Button fullWidth variant="ghost" onClick={onCancel}>
                  Leave Lobby
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
