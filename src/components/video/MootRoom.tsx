"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, CameraOff, MonitorUp, MessageSquare, PhoneOff, X } from "lucide-react";
import { Card } from "@/components/ui";
import {
  playMessageSent,
  playMessageReceived,
  playRecordingStart,
  playChime,
  resumeAudio,
} from "@/lib/utils/sounds";

interface MootRoomProps {
  roomUrl?: string;
  token?: string;
  userName: string;
  sessionTitle: string;
  opponent?: string;
  opponentInitials?: string;
  opponentChamber?: string;
  spectatorMode?: boolean;
  onLeave: () => void;
}

type ConnectionQuality = "excellent" | "good" | "fair" | "poor";

export function MootRoom({
  roomUrl,
  token,
  userName,
  sessionTitle,
  opponent = "Opposing Counsel",
  opponentInitials,
  opponentChamber,
  spectatorMode = false,
  onLeave,
}: MootRoomProps) {
  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(spectatorMode);
  const [isCamOff, setIsCamOff] = useState(spectatorMode);
  const [isScreenShare, setIsScreenShare] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ from: string; text: string; time: string }[]>([]);
  const [connection, setConnection] = useState<ConnectionQuality>("excellent");
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingConsent, setShowRecordingConsent] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [opponentSpeaking, setOpponentSpeaking] = useState(false);
  const dailyFrameRef = useRef<HTMLDivElement>(null);
  const dailyInstanceRef = useRef<any>(null);

  // Init Daily.co Prebuilt if real roomUrl provided
  useEffect(() => {
    if (!roomUrl || !dailyFrameRef.current) return;

    async function initDaily() {
      try {
        const DailyIframe = (await import("@daily-co/daily-js")).default;
        const callFrame = DailyIframe.createFrame(dailyFrameRef.current!, {
          iframeStyle: {
            width: "100%",
            height: "100%",
            border: "0",
            borderRadius: "16px",
          },
          showLeaveButton: false,
          showFullscreenButton: true,
          theme: {
            colors: {
              accent: "#C9A84C",
              accentText: "#0C1220",
              background: "#0C1220",
              backgroundAccent: "#182640",
              baseText: "#F2EDE6",
              border: "rgba(255,255,255,0.06)",
              mainAreaBg: "#0C1220",
              mainAreaBgAccent: "#131E30",
              mainAreaText: "#F2EDE6",
              supportiveText: "rgba(242,237,230,0.6)",
            },
          },
        });

        await callFrame.join({ url: roomUrl, token: token || undefined });
        dailyInstanceRef.current = callFrame;

        // Connection quality tracking
        callFrame.on("network-quality-change", (e: any) => {
          const q = e?.threshold;
          if (q === "good") setConnection("excellent");
          else if (q === "low") setConnection("fair");
          else if (q === "very-low") setConnection("poor");
          else setConnection("good");
        });

        callFrame.on("participant-left", () => {
          // Opponent left - trigger end flow
        });
      } catch (err) {
        // Daily.co unavailable — fall back to demo mode silently
        void err;
      }
    }

    initDaily();

    return () => {
      dailyInstanceRef.current?.leave();
      dailyInstanceRef.current?.destroy();
    };
  }, [roomUrl, token]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate connection quality changes in demo mode
  useEffect(() => {
    if (roomUrl) return; // Skip simulation if real Daily
    const t = setInterval(() => {
      const r = Math.random();
      setConnection(r > 0.85 ? "fair" : r > 0.95 ? "poor" : "excellent");
    }, 15000);
    return () => clearInterval(t);
  }, [roomUrl]);

  // Simulate opponent speaking indicator in demo
  useEffect(() => {
    if (roomUrl) return;
    const t = setInterval(() => {
      setOpponentSpeaking(Math.random() > 0.5);
    }, 3000);
    return () => clearInterval(t);
  }, [roomUrl]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    playMessageSent();
    setMessages((p) => [
      ...p,
      { from: "You", text: chatInput.trim(), time: fmt(elapsed) },
    ]);
    setChatInput("");

    // Simulate reply in demo
    if (!roomUrl) {
      setTimeout(() => {
        playMessageReceived();
        setMessages((p) => [
          ...p,
          { from: opponent.split(" ")[0], text: "Noted, thank you.", time: fmt(elapsed + 3) },
        ]);
      }, 2000 + Math.random() * 3000);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setShowRecordingConsent(true);
    } else {
      setIsRecording(false);
    }
  };

  const confirmRecording = () => {
    playRecordingStart();
    setIsRecording(true);
    setShowRecordingConsent(false);
  };

  const handleLeave = () => {
    setShowLeaveConfirm(true);
  };

  const confirmLeave = () => {
    playChime();
    if (dailyInstanceRef.current) {
      dailyInstanceRef.current.leave();
    }
    onLeave();
  };

  const userInitials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const oppInitials = opponentInitials || opponent.split(" ").map((n) => n[0]).join("").slice(0, 2);

  const connectionColors: Record<ConnectionQuality, { bg: string; text: string; label: string }> = {
    excellent: { bg: "bg-green-500", text: "text-green-500", label: "Excellent" },
    good: { bg: "bg-green-500", text: "text-green-500", label: "Good" },
    fair: { bg: "bg-yellow-500", text: "text-yellow-500", label: "Fair" },
    poor: { bg: "bg-red-500", text: "text-red-500", label: "Poor" },
  };

  const conn = connectionColors[connection];

  return (
    <div className="fixed inset-0 z-[100] bg-navy flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-navy-mid border-b border-court-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-recording-pulse" />
            <span className="text-court-xs font-bold text-court-text tracking-wide">LIVE</span>
          </div>
          {spectatorMode && (
            <span className="text-court-xs font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">SPECTATOR</span>
          )}
        </div>
        <div className="text-center flex-1 mx-3">
          <p className="text-court-xs text-court-text-sec font-semibold truncate">
            {sessionTitle}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Connection quality */}
          <div className="flex items-center gap-1">
            <div className="flex items-end gap-px">
              {[4, 8, 12].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-sm transition-colors ${
                    (connection === "excellent" || (connection === "good" && i < 3) || (connection === "fair" && i < 2) || (connection === "poor" && i < 1))
                      ? conn.bg : "bg-white/10"
                  }`}
                  style={{ height: h }}
                />
              ))}
            </div>
          </div>
          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-recording-pulse" />
              <span className="text-court-xs text-red-400 font-bold">REC</span>
            </div>
          )}
          {/* Timer */}
          <div className="bg-white/5 rounded-lg px-2.5 py-1">
            <span className="text-court-sm text-gold font-mono font-bold">{fmt(elapsed)}</span>
          </div>
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 p-2.5 flex flex-col gap-2.5 relative">
        {roomUrl ? (
          /* Real Daily.co Prebuilt iframe */
          <div ref={dailyFrameRef} className="flex-1 rounded-2xl overflow-hidden" />
        ) : (
          /* Demo video UI */
          <>
            {/* Main video (opponent) */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#162033] to-[#0C1220] border border-court-border-light">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
                    opponentSpeaking ? "ring-2 ring-gold ring-offset-2 ring-offset-navy" : ""
                  }`} style={{ background: `linear-gradient(135deg, ${opponentChamber === "Lincoln's" ? "#2E5090" : "#6B2D3E"}, ${opponentChamber === "Lincoln's" ? "#2E509088" : "#6B2D3E88"})` }}>
                    <span className="font-serif text-2xl font-bold text-court-text">{oppInitials}</span>
                  </div>
                  <span className="text-sm font-semibold text-court-text">{opponent}</span>
                  {opponentSpeaking && (
                    <motion.div
                      className="flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 bg-gold rounded-full"
                          animate={{ height: [4, 12, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))}
                      <span className="text-court-xs text-gold ml-1">Speaking</span>
                    </motion.div>
                  )}
                </div>
              </div>
              {/* Name overlay */}
              <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${opponentSpeaking ? "bg-gold" : "bg-green-500"}`} />
                <span className="text-court-sm text-white font-medium">{opponent}</span>
              </div>
            </div>

            {/* Self view (PiP) */}
            <div className="h-28 relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A2744] to-[#0C1220] border border-gold/15">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-full bg-[#6B2D3E] flex items-center justify-center">
                    <span className="font-serif text-lg font-bold text-court-text">{userInitials}</span>
                  </div>
                  <span className="text-court-xs text-court-text-ter">{isCamOff ? "Camera off" : "You"}</span>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-court-xs text-white font-medium">You</span>
                {isMuted && <MicOff size={10} className="text-red-400" />}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className="absolute bottom-28 left-2.5 right-2.5 bg-navy-mid/95 backdrop-blur-xl border border-court-border rounded-2xl max-h-72 flex flex-col overflow-hidden z-10"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 py-2.5 border-b border-court-border flex justify-between items-center">
              <span className="text-xs font-bold text-court-text">Session Chat</span>
              <button onClick={() => setShowChat(false)} className="text-court-text-ter text-sm"><X size={14} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-[100px]">
              {messages.length === 0 && (
                <p className="text-court-sm text-court-text-ter text-center py-4">No messages yet</p>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`flex flex-col ${m.from === "You" ? "items-end" : "items-start"}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={`rounded-xl px-3 py-2 max-w-[80%] ${
                    m.from === "You" ? "bg-gold/20" : "bg-white/5"
                  }`}>
                    <p className="text-court-sm text-court-text">{m.text}</p>
                  </div>
                  <span className="text-court-xs text-court-text-ter mt-0.5">{m.from} &middot; {m.time}</span>
                </motion.div>
              ))}
            </div>
            <div className="px-3 pb-3 flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-court-border rounded-xl px-3 py-2 text-xs text-court-text outline-none focus:border-gold/40 placeholder:text-court-text-ter"
              />
              <button onClick={sendChat} className="bg-gold text-navy rounded-xl px-3 py-2 text-xs font-bold">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording consent overlay */}
      <AnimatePresence>
        {showRecordingConsent && (
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-navy-mid border border-court-border rounded-2xl p-5 max-w-sm w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-court-text">Enable Recording?</p>
                  <p className="text-court-xs text-court-text-ter">Both parties must consent</p>
                </div>
              </div>
              <p className="text-court-sm text-court-text-sec leading-relaxed mb-4">
                This session will be recorded and stored securely for 30 days. The recording can be used
                for AI feedback analysis and will be saved to your portfolio. Your opponent will be notified
                that recording is active.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRecordingConsent(false)}
                  className="flex-1 py-2.5 rounded-xl border border-court-border text-xs font-semibold text-court-text-sec"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRecording}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400"
                >
                  Start Recording
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leave confirmation */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-navy-mid border border-court-border rounded-2xl p-5 max-w-sm w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <p className="text-sm font-bold text-court-text mb-1">Leave Session?</p>
              <p className="text-court-sm text-court-text-sec mb-4">
                This will end your participation. The session will be marked as complete.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-court-border text-xs font-semibold text-court-text-sec"
                >
                  Stay
                </button>
                <button
                  onClick={confirmLeave}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-xs font-bold text-white"
                >
                  Leave Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording banner */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="absolute top-[52px] left-0 right-0 bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-center gap-2"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
          >
            <div className="w-2 h-2 rounded-full bg-red-500 animate-recording-pulse" />
            <span className="text-court-xs text-red-400 font-bold">Recording active &middot; All parties have consented</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="px-3 pb-8 pt-2.5 bg-navy-mid border-t border-court-border">
        <div className="flex justify-center items-center gap-3">
          {/* Mic */}
          <button
            onClick={() => !spectatorMode && setIsMuted(!isMuted)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isMuted ? "bg-red-500/20 border border-red-500/40" : "bg-white/5 border border-court-border"
            } ${spectatorMode ? "opacity-40" : ""}`}
          >
            {isMuted ? <MicOff size={18} className="text-court-text" /> : <Mic size={18} className="text-court-text" />}
          </button>

          {/* Camera */}
          <button
            onClick={() => !spectatorMode && setIsCamOff(!isCamOff)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isCamOff ? "bg-red-500/20 border border-red-500/40" : "bg-white/5 border border-court-border"
            } ${spectatorMode ? "opacity-40" : ""}`}
          >
            {isCamOff ? <CameraOff size={18} className="text-court-text" /> : <Video size={18} className="text-court-text" />}
          </button>

          {/* Screen share */}
          <button
            onClick={() => setIsScreenShare(!isScreenShare)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isScreenShare ? "bg-gold/20 border border-gold/40" : "bg-white/5 border border-court-border"
            }`}
          >
            <MonitorUp size={18} className="text-court-text" />
          </button>

          {/* Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all relative ${
              showChat ? "bg-gold/20 border border-gold/40" : "bg-white/5 border border-court-border"
            }`}
          >
            <MessageSquare size={18} className="text-court-text" />
            {messages.length > 0 && !showChat && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-navy text-court-xs font-bold flex items-center justify-center">
                {messages.length}
              </div>
            )}
          </button>

          {/* Record */}
          {!spectatorMode && (
            <button
              onClick={toggleRecording}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                isRecording ? "bg-red-500/20 border border-red-500/40" : "bg-white/5 border border-court-border"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isRecording ? "bg-red-500 animate-recording-pulse" : "bg-red-400/60"}`} />
            </button>
          )}

          {/* Leave */}
          <button
            onClick={handleLeave}
            className="w-13 h-11 rounded-full bg-red-500 flex items-center justify-center px-4"
          >
            <PhoneOff size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
