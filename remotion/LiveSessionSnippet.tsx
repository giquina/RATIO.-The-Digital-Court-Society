/**
 * RATIO. Live AI Session Snippet (55 seconds)
 *
 * "Watch a session unfold." — A simulated screen recording of an AI
 * courtroom session. Chat messages appear one by one with typing
 * indicators. The AI Judge speaks aloud (ElevenLabs — George voice)
 * while the Advocate types — demonstrating that RATIO supports voice
 * interaction, not just text.
 *
 * Scene Timeline (30fps x 55s = 1650 frames):
 *   1. Title Card         0–90      "Watch a live session."
 *   2. Court Opens        90–330    Judge speaks: opening directive
 *   3. Advocate Types     330–500   Advocate types submission
 *   4. Judge Intervenes   500–730   Judge speaks: challenges sharply
 *   5. Advocate Responds  730–910   Advocate types precise response
 *   6. Judge Pushes       910–1230  Judge speaks: pushes further
 *   7. Score Reveal      1240–1430  Animated score circle + dimension bars
 *   8. Feedback          1430–1530  Key feedback summary
 *   9. CTA               1530–1650  "Your turn."
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
} from "remotion";

// ── Brand Tokens ──────────────────────────────────────────────────────────

const GOLD = "#C9A84C";
const GOLD_DIM = "rgba(201, 168, 76, 0.12)";
const NAVY = "#0C1220";
const NAVY_MID = "#131E30";
const NAVY_CARD = "#182640";
const NAVY_LIGHT = "#1E3050";
const TEXT = "#F2EDE6";
const TEXT_SEC = "rgba(242, 237, 230, 0.55)";
const TEXT_TER = "rgba(242, 237, 230, 0.3)";

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// ── Chat Messages ─────────────────────────────────────────────────────────

interface ChatMessage {
  role: "judge" | "advocate";
  text: string;
  /** Frame when typing indicator appears */
  typingStart: number;
  /** Frame when full message appears */
  messageStart: number;
  /** Chars per frame for typewriter — judge messages sync with voice */
  charsPerFrame?: number;
  /** Duration of judge voice clip in frames (for speaking indicator) */
  voiceDurationFrames?: number;
}

const CHAT_MESSAGES: ChatMessage[] = [
  {
    role: "judge",
    text: "This court is now in session. Counsel, you may proceed with your submissions on the matter of parliamentary sovereignty.",
    typingStart: 95,
    messageStart: 115,
    charsPerFrame: 0.58,       // ~120 chars / 209 frames — synced to voice
    voiceDurationFrames: 209,  // 6.97s
  },
  {
    role: "advocate",
    text: "My Lord, the appellant submits that the doctrine of parliamentary sovereignty, as established in Dicey\u2019s constitutional framework, remains the cornerstone of the UK constitution. No Parliament may bind its successors, and no body may override or set aside an Act of Parliament.",
    typingStart: 340,
    messageStart: 375,
    charsPerFrame: 2.5,        // Fast typing speed
  },
  {
    role: "judge",
    text: "Counsel, that is textbook recitation. What is the ratio in Factortame? Apply it to the facts before this court.",
    typingStart: 510,
    messageStart: 535,
    charsPerFrame: 0.52,       // ~104 chars / 202 frames — synced to voice
    voiceDurationFrames: 202,  // 6.73s
  },
  {
    role: "advocate",
    text: "My Lord, in Factortame, the House of Lords held that European Community law must be given primacy over conflicting domestic legislation. The ratio established that courts may grant interim relief against the Crown where EC rights are at stake \u2014 effectively limiting parliamentary sovereignty in practice.",
    typingStart: 750,
    messageStart: 785,
    charsPerFrame: 2.5,        // Fast typing speed
  },
  {
    role: "judge",
    text: "That is helpful, Counsel. Now \u2014 what about the effect of the European Union Withdrawal Act 2018? Does that not undermine your entire position?",
    typingStart: 915,
    messageStart: 940,
    charsPerFrame: 0.49,       // ~148 chars / 301 frames — synced to voice
    voiceDurationFrames: 301,  // 10.03s
  },
];

// ── Feedback Dimensions ───────────────────────────────────────────────────

const SCORE_DIMENSIONS = [
  { label: "Argument Structure", score: 78, icon: "IRAC" },
  { label: "Use of Authorities", score: 82, icon: "Auth" },
  { label: "Oral Delivery", score: 65, icon: "Oral" },
  { label: "Response to Interventions", score: 70, icon: "Resp" },
  { label: "Court Manner", score: 85, icon: "Mann" },
  { label: "Persuasiveness", score: 68, icon: "Pers" },
  { label: "Time Management", score: 72, icon: "Time" },
];

// ── Animation Helpers ─────────────────────────────────────────────────────

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function easeOut(value: number, from: number, to: number, startF: number, endF: number): number {
  return interpolate(value, [startF, endF], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function easeInOut(value: number, from: number, to: number, startF: number, endF: number): number {
  return interpolate(value, [startF, endF], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
}

// ── Shared Sub-Components ─────────────────────────────────────────────────

function TextReveal({
  children,
  frame,
  delay = 0,
  distance = 24,
  duration = 25,
  style = {},
}: {
  children: React.ReactNode;
  frame: number;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, duration);
  const y = easeOut(f, distance, 0, 0, duration);
  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
}

function GoldLine({ width, delay, frame, thickness = 1 }: {
  width: number; delay: number; frame: number; thickness?: number;
}) {
  const w = easeOut(frame - delay, 0, width, 0, 30);
  return (
    <div style={{
      width: w, height: thickness,
      background: `linear-gradient(90deg, ${GOLD}, transparent)`,
      margin: "12px auto", opacity: 0.7,
    }} />
  );
}

function Vignette({ intensity = 0.6 }: { intensity?: number }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,${intensity * 0.4}) 60%, rgba(0,0,0,${intensity}) 100%)`,
      pointerEvents: "none", zIndex: 50,
    }} />
  );
}

function FilmGrain({ frame, opacity = 0.04 }: { frame: number; opacity?: number }) {
  const seed = (frame * 17) % 100;
  return (
    <div style={{
      position: "absolute", inset: 0, opacity,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      backgroundSize: "128px 128px", mixBlendMode: "overlay", pointerEvents: "none", zIndex: 51,
    }} />
  );
}

interface CaptionPhrase { text: string; from: number; to: number; }

function CaptionOverlay({ frame, captions }: { frame: number; captions: CaptionPhrase[] }) {
  const active = captions.find((c) => frame >= c.from && frame <= c.to);
  if (!active) return null;

  const progress = (frame - active.from) / (active.to - active.from);
  const words = active.text.split(" ");
  const wordIndex = Math.floor(progress * words.length);
  const fadeIn = clamp01((frame - active.from) / 8);
  const fadeOut = clamp01((active.to - frame) / 8);

  return (
    <div style={{
      position: "absolute", bottom: 55, left: 16, right: 16,
      textAlign: "center", zIndex: 60,
      opacity: fadeIn * fadeOut,
    }}>
      <div style={{
        display: "inline-block",
        background: "rgba(12, 18, 32, 0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: 12, padding: "10px 18px",
        border: `1px solid rgba(201, 168, 76, 0.15)`,
      }}>
        <span style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.5, letterSpacing: 0.2 }}>
          {words.map((word, i) => (
            <span key={i} style={{
              color: i <= wordIndex ? TEXT : TEXT_SEC,
              transition: "color 0.1s",
            }}>
              {word}{i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

// ── Chat UI Components ────────────────────────────────────────────────────

/** Courtroom session header bar */
function CourtroomHeader({ frame }: { frame: number }) {
  const opacity = easeOut(frame, 0, 1, 0, 20);
  // Pulsing "live" dot
  const dotOpacity = 0.5 + 0.5 * Math.sin(frame * 0.08);

  return (
    <div style={{
      opacity,
      position: "absolute", top: 0, left: 0, right: 0,
      background: `linear-gradient(180deg, ${NAVY_MID}, ${NAVY}ee)`,
      padding: "14px 18px 12px",
      borderBottom: `1px solid rgba(201, 168, 76, 0.15)`,
      zIndex: 20,
    }}>
      {/* Status bar row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10,
      }}>
        <div style={{
          fontFamily: SANS, fontSize: 10, color: TEXT_TER,
        }}>
          9:41
        </div>
        <div style={{
          display: "flex", gap: 4, alignItems: "center",
        }}>
          <div style={{ width: 16, height: 10, borderRadius: 2, border: `1px solid ${TEXT_TER}`, position: "relative" }}>
            <div style={{ position: "absolute", inset: 2, borderRadius: 1, background: TEXT_TER }} />
          </div>
        </div>
      </div>

      {/* Session info */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Judge avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: `linear-gradient(135deg, ${GOLD}, #B8973F)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
          boxShadow: `0 0 12px rgba(201, 168, 76, 0.25)`,
        }}>
          \u2696\uFE0F
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: SERIF, fontSize: 14, color: TEXT,
            fontWeight: 600,
          }}>
            The Honourable Justice AI
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {/* Live dot */}
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#4CAF50",
              opacity: dotOpacity,
              boxShadow: "0 0 6px rgba(76, 175, 80, 0.5)",
            }} />
            Session in Progress
          </div>
        </div>
      </div>
    </div>
  );
}

/** Typing indicator — three pulsing dots */
function TypingIndicator({ frame, role }: { frame: number; role: "judge" | "advocate" }) {
  const isJudge = role === "judge";
  return (
    <div style={{
      display: "flex", justifyContent: isJudge ? "flex-start" : "flex-end",
      padding: "0 18px", marginBottom: 8,
    }}>
      <div style={{
        background: isJudge
          ? `linear-gradient(135deg, rgba(201, 168, 76, 0.08), ${NAVY_CARD})`
          : NAVY_CARD,
        borderRadius: 14,
        padding: "10px 16px",
        borderLeft: isJudge ? `3px solid ${GOLD}` : "none",
        borderRight: !isJudge ? `3px solid ${NAVY_LIGHT}` : "none",
        display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => {
          const delay = i * 6;
          const opacity = 0.3 + 0.7 * Math.abs(Math.sin((frame + delay) * 0.12));
          const y = Math.sin((frame + delay) * 0.12) * 3;
          return (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: "50%",
              background: isJudge ? GOLD : TEXT_SEC,
              opacity,
              transform: `translateY(${y}px)`,
            }} />
          );
        })}
      </div>
    </div>
  );
}

/** Speaking indicator — animated sound bars for judge voice */
function SpeakingIndicator({ frame }: { frame: number }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 3,
      marginLeft: 8, height: 14,
    }}>
      {/* Small speaker icon */}
      <div style={{ fontSize: 9, color: GOLD, opacity: 0.8 }}>
        {"\uD83D\uDD0A"}
      </div>
      {/* Animated sound bars */}
      {[0, 1, 2, 3].map((i) => {
        const barHeight = 4 + 8 * Math.abs(Math.sin((frame + i * 7) * 0.14));
        return (
          <div key={i} style={{
            width: 2, height: barHeight, borderRadius: 1,
            background: `linear-gradient(180deg, ${GOLD}, rgba(201, 168, 76, 0.4))`,
            transition: "height 0.05s",
          }} />
        );
      })}
    </div>
  );
}

/** Chat bubble for judge or advocate */
function ChatBubble({
  message,
  frame,
}: {
  message: ChatMessage;
  frame: number;
}) {
  const isJudge = message.role === "judge";
  const isTyping = frame >= message.typingStart && frame < message.messageStart;

  if (frame < message.typingStart) return null;

  if (isTyping) {
    return <TypingIndicator frame={frame} role={message.role} />;
  }

  // Message reveal animation
  const revealFrame = frame - message.messageStart;
  const opacity = easeOut(revealFrame, 0, 1, 0, 12);
  const slideY = easeOut(revealFrame, 12, 0, 0, 15);

  // Typewriter effect — speed varies per message
  const totalChars = message.text.length;
  const speed = message.charsPerFrame ?? 2.5;
  const visibleChars = Math.min(
    totalChars,
    Math.floor(revealFrame * speed),
  );
  const displayText = message.text.slice(0, visibleChars);
  const isStillTyping = visibleChars < totalChars;

  // Judge speaking indicator — shows while voice clip is playing
  const isSpeaking = isJudge
    && message.voiceDurationFrames
    && revealFrame >= 0
    && revealFrame < message.voiceDurationFrames;

  return (
    <div style={{
      opacity,
      transform: `translateY(${slideY}px)`,
      display: "flex", justifyContent: isJudge ? "flex-start" : "flex-end",
      padding: "0 18px", marginBottom: 10,
    }}>
      <div style={{
        maxWidth: "85%",
        background: isJudge
          ? `linear-gradient(135deg, rgba(201, 168, 76, 0.06), ${NAVY_CARD})`
          : NAVY_CARD,
        borderRadius: 14,
        padding: "12px 16px",
        borderLeft: isJudge ? `3px solid ${GOLD}` : "none",
        borderRight: !isJudge ? `3px solid ${NAVY_LIGHT}` : "none",
        // Subtle glow when judge is speaking
        boxShadow: isSpeaking
          ? `0 0 16px rgba(201, 168, 76, 0.12), inset 0 0 20px rgba(201, 168, 76, 0.03)`
          : "none",
      }}>
        {/* Sender label with speaking indicator */}
        <div style={{
          display: "flex", alignItems: "center",
          marginBottom: 4,
        }}>
          <div style={{
            fontFamily: isJudge ? SERIF : SANS,
            fontSize: 10, color: isJudge ? GOLD : TEXT_SEC,
            fontWeight: 600,
            letterSpacing: isJudge ? 0.5 : 0,
          }}>
            {isJudge ? "Justice AI" : "You (Counsel)"}
          </div>
          {isSpeaking && <SpeakingIndicator frame={frame} />}
          {!isJudge && isStillTyping && (
            <div style={{
              marginLeft: 8, fontFamily: SANS,
              fontSize: 9, color: TEXT_TER,
            }}>
              typing...
            </div>
          )}
        </div>
        {/* Message text */}
        <div style={{
          fontFamily: SANS, fontSize: 12.5, color: TEXT,
          lineHeight: 1.55, letterSpacing: 0.1,
        }}>
          {displayText}
          {isStillTyping && (
            <span style={{
              display: "inline-block", width: 2, height: 14,
              background: isJudge ? GOLD : TEXT_SEC,
              marginLeft: 2, verticalAlign: "middle",
              opacity: Math.sin(frame * 0.15) > 0 ? 1 : 0,
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

/** Animated score circle */
function ScoreCircle({ frame, score }: { frame: number; score: number }) {
  const displayScore = Math.round(easeOut(frame, 0, score, 10, 50));
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (easeOut(frame, 0, score / 100, 10, 50) * circumference);
  const glowOpacity = 0.3 + 0.2 * Math.sin(frame * 0.06);

  return (
    <div style={{
      position: "relative", width: 130, height: 130,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Glow */}
      <div style={{
        position: "absolute", inset: -10,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201, 168, 76, 0.12), transparent)`,
        opacity: glowOpacity,
      }} />

      <svg width={130} height={130} style={{ position: "absolute" }}>
        {/* Background circle */}
        <circle
          cx={65} cy={65} r={52}
          fill="none" stroke="rgba(242, 237, 230, 0.06)"
          strokeWidth={6}
        />
        {/* Score arc */}
        <circle
          cx={65} cy={65} r={52}
          fill="none" stroke={GOLD}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 65 65)"
          style={{ filter: `drop-shadow(0 0 8px rgba(201, 168, 76, 0.4))` }}
        />
      </svg>

      {/* Score number */}
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{
          fontFamily: SERIF, fontSize: 38, fontWeight: 700,
          color: GOLD, lineHeight: 1,
        }}>
          {displayScore}
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
          marginTop: 2,
        }}>
          / 100
        </div>
      </div>
    </div>
  );
}

/** Animated dimension score bars */
function DimensionBars({ frame }: { frame: number }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: 7, padding: "0 28px",
    }}>
      {SCORE_DIMENSIONS.map((dim, i) => {
        const barDelay = 20 + i * 8;
        const opacity = easeOut(frame, 0, 1, barDelay, barDelay + 12);
        const barWidth = easeOut(frame, 0, dim.score, barDelay + 5, barDelay + 25);
        const scoreColor = dim.score >= 80 ? "#4CAF50"
          : dim.score >= 70 ? GOLD
          : "#E67E22";

        return (
          <div key={dim.label} style={{ opacity }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginBottom: 3,
            }}>
              <span style={{
                fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
              }}>
                {dim.label}
              </span>
              <span style={{
                fontFamily: SANS, fontSize: 10, color: scoreColor,
                fontWeight: 600,
              }}>
                {Math.round(barWidth)}
              </span>
            </div>
            <div style={{
              height: 5, borderRadius: 3,
              background: "rgba(242, 237, 230, 0.06)",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${barWidth}%`, height: "100%",
                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`,
                borderRadius: 3,
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Caption Data ──────────────────────────────────────────────────────────

const CAPTIONS: CaptionPhrase[] = [
  // Title VO — Charlie (70 frames from frame 5)
  { text: "Here's what a session actually looks like.", from: 8, to: 75 },
  // Silence during chat — the judge speaks, the advocate types
  // Score VO — Charlie (101 frames from frame 1250)
  { text: "And when it's done, you get a proper scored judgment.", from: 1252, to: 1351 },
  // CTA VO — Charlie (175 frames from frame 1475)
  { text: "That could be you.", from: 1480, to: 1525 },
  { text: "RATIO — free for law students.", from: 1528, to: 1590 },
  { text: "Start whenever you're ready.", from: 1593, to: 1645 },
];

// ── Main Composition ──────────────────────────────────────────────────────

export const LiveSessionSnippet: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background music — quieter during chat so judge voice is clear
  const musicVolume = interpolate(frame,
    [0, 20, 90, 200, 1220, 1240, 1400, 1465, 1620, 1645],
    [0, 0.08, 0.06, 0.03, 0.03, 0.08, 0.10, 0.08, 0.06, 0.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Chat scroll offset — messages push up as new ones appear
  const scrollOffset = interpolate(frame,
    [90, 340, 510, 750, 915],
    [0, 0, -60, -150, -250],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Scene fading
  const titleOpacity = interpolate(frame, [0, 10, 70, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const chatOpacity = interpolate(frame, [90, 105, 1210, 1240], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scoreOpacity = interpolate(frame, [1240, 1260, 1445, 1465], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(frame, [1465, 1485, 1640, 1650], [0, 1, 1, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {/* Background ambient glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(30, 48, 80, 0.2), transparent)`,
      }} />

      {/* ── Background Music ── */}
      <Audio src={staticFile("audio/music/ambient-pad-55s.mp3")} volume={musicVolume} />

      {/* ── Courtroom Ambiance ── */}
      <Audio src={staticFile("audio/sfx/courtroom-tone.mp3")} volume={0.12} />
      <Sequence from={0} durationInFrames={300}>
        <Audio src={staticFile("audio/sfx/courtroom-murmur.mp3")} volume={0.08} />
      </Sequence>

      {/* ── Narrator Voiceover (ElevenLabs — Charlie) ── */}
      <Sequence from={5} durationInFrames={70} name="VO: Title (Charlie, 2.322s)">
        <Audio src={staticFile("audio/voiceover/session-01-title.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1250} durationInFrames={101} name="VO: Score (Charlie, 3.344s)">
        <Audio src={staticFile("audio/voiceover/session-02-score.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1475} durationInFrames={175} name="VO: CTA (Charlie, 5.805s)">
        <Audio src={staticFile("audio/voiceover/session-03-cta.mp3")} volume={0.92} />
      </Sequence>

      {/* ── Judge Dialogue Voice (ElevenLabs — George, authoritative) ── */}
      {/* Judge line 1: "This court is now in session…" */}
      <Sequence from={115} durationInFrames={215}>
        <Audio src={staticFile("audio/voiceover/session-judge-01.mp3")} volume={0.88} />
      </Sequence>
      {/* Judge line 2: "Counsel, that is textbook recitation…" */}
      <Sequence from={535} durationInFrames={210}>
        <Audio src={staticFile("audio/voiceover/session-judge-02.mp3")} volume={0.88} />
      </Sequence>
      {/* Judge line 3: "That is helpful, Counsel…" */}
      <Sequence from={940} durationInFrames={310}>
        <Audio src={staticFile("audio/voiceover/session-judge-03.mp3")} volume={0.88} />
      </Sequence>

      {/* ── SFX ── */}
      {/* Gavel wood knock when court opens */}
      <Sequence from={112} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/gavel-wood.mp3")} volume={0.40} />
      </Sequence>
      {/* Door close at start — setting the court */}
      <Sequence from={80} durationInFrames={45}>
        <Audio src={staticFile("audio/sfx/door-close.mp3")} volume={0.10} />
      </Sequence>
      {/* Paper shuffle when advocate reads brief */}
      <Sequence from={345} durationInFrames={25}>
        <Audio src={staticFile("audio/sfx/paper-shuffle.mp3")} volume={0.10} />
      </Sequence>
      {/* UI clicks for advocate typing — keyboard sounds */}
      {[380, 400, 420, 440, 460, 790, 810, 830, 850].map((f) => (
        <Sequence key={`click-${f}`} from={f} durationInFrames={8}>
          <Audio src={staticFile("audio/sfx/ui-click.mp3")} volume={0.06} />
        </Sequence>
      ))}
      {/* Chime on score reveal */}
      <Sequence from={1260} durationInFrames={50}>
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.15} />
      </Sequence>
      {/* Whoosh on transitions — barely perceptible */}
      <Sequence from={88} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={1238} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={1463} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 1 — Title Card
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: titleOpacity,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        <TextReveal frame={frame} delay={5}>
          <div style={{
            fontFamily: SERIF, fontSize: 32, fontWeight: 600,
            color: TEXT, textAlign: "center", lineHeight: 1.3,
          }}>
            Watch a live<br />session unfold
          </div>
        </TextReveal>
        <GoldLine width={100} delay={15} frame={frame} />
        <TextReveal frame={frame} delay={22}>
          <div style={{
            fontFamily: SANS, fontSize: 13, color: TEXT_SEC,
            textAlign: "center",
          }}>
            AI Practice — Constitutional Law
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENES 2–6 — Chat Exchange
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: chatOpacity,
        zIndex: 10,
      }}>
        <CourtroomHeader frame={frame - 90} />

        {/* Chat area */}
        <div style={{
          position: "absolute", top: 100, left: 0, right: 0, bottom: 0,
          overflow: "hidden",
        }}>
          <div style={{
            transform: `translateY(${scrollOffset}px)`,
            paddingTop: 10, paddingBottom: 80,
          }}>
            {CHAT_MESSAGES.map((msg, i) => (
              <ChatBubble key={i} message={msg} frame={frame} />
            ))}
          </div>
        </div>

        {/* Bottom gradient for depth */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(transparent, ${NAVY})`,
          zIndex: 15,
        }} />
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 7 — Score Reveal
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: scoreOpacity,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10, gap: 24,
      }}>
        <TextReveal frame={frame - 1240} delay={5} style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
            textTransform: "uppercase", letterSpacing: 2,
          }}>
            Session Complete — Judgment Delivered
          </div>
        </TextReveal>

        <ScoreCircle frame={frame - 1240} score={72} />

        <TextReveal frame={frame - 1240} delay={15} style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: SERIF, fontSize: 16, color: GOLD,
            fontWeight: 600,
          }}>
            Overall Score
          </div>
        </TextReveal>

        <DimensionBars frame={frame - 1240} />
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 8 — Feedback (overlaps with score reveal tail)
          ═══════════════════════════════════════════════════════════════════ */}
      {frame >= 1380 && frame <= 1465 && (
        <AbsoluteFill style={{
          opacity: interpolate(frame, [1380, 1400, 1445, 1465], [0, 1, 1, 0], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 12, padding: "0 28px",
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
            borderRadius: 16, padding: "20px 24px",
            border: `1px solid rgba(201, 168, 76, 0.15)`,
          }}>
            <div style={{
              fontFamily: SANS, fontSize: 10, color: GOLD,
              textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10,
            }}>
              Key Feedback
            </div>

            {/* Strength */}
            <div style={{ marginBottom: 14 }}>
              <div style={{
                fontFamily: SANS, fontSize: 11, color: "#4CAF50",
                fontWeight: 600, marginBottom: 4,
              }}>
                Strength
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 12, color: TEXT, lineHeight: 1.5,
              }}>
                Strong understanding of authorities. Effective use of Factortame ratio with direct application to facts.
              </div>
            </div>

            {/* Improvement */}
            <div>
              <div style={{
                fontFamily: SANS, fontSize: 11, color: "#E67E22",
                fontWeight: 600, marginBottom: 4,
              }}>
                Area for Improvement
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 12, color: TEXT, lineHeight: 1.5,
              }}>
                Work on applying ratio to specific facts rather than broad propositions. Avoid textbook recitation.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 9 — CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: ctaOpacity,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        <TextReveal frame={frame - 1465} delay={5}>
          <div style={{
            fontFamily: SERIF, fontSize: 28, fontWeight: 600,
            color: TEXT, textAlign: "center", lineHeight: 1.3,
          }}>
            Your turn.
          </div>
        </TextReveal>

        <div style={{ height: 20 }} />

        <TextReveal frame={frame - 1465} delay={18}>
          <div style={{
            fontFamily: SERIF, fontSize: 44, fontWeight: 700,
            color: GOLD, letterSpacing: 3,
          }}>
            RATIO.
          </div>
        </TextReveal>

        <GoldLine width={140} delay={25} frame={frame - 1465} thickness={2} />

        <TextReveal frame={frame - 1465} delay={30}>
          <div style={{
            fontFamily: SERIF, fontSize: 16, color: TEXT_SEC,
            fontStyle: "italic",
          }}>
            The Digital Court Society
          </div>
        </TextReveal>

        {/* CTA Button */}
        <TextReveal frame={frame - 1465} delay={42}>
          <div style={{
            marginTop: 24,
            background: `linear-gradient(135deg, ${GOLD}, #B8973F)`,
            borderRadius: 14, padding: "14px 36px",
            boxShadow: `0 4px 20px rgba(201, 168, 76, 0.3)`,
          }}>
            <div style={{
              fontFamily: SANS, fontSize: 15, fontWeight: 700,
              color: NAVY, letterSpacing: 0.5,
            }}>
              Start Practice Today
            </div>
          </div>
        </TextReveal>

        <TextReveal frame={frame - 1465} delay={55}>
          <div style={{
            fontFamily: SANS, fontSize: 12, color: TEXT_SEC,
            marginTop: 14,
          }}>
            Free for UK law students
          </div>
        </TextReveal>

        <TextReveal frame={frame - 1465} delay={65}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: TEXT_TER,
            marginTop: 16, letterSpacing: 0.8,
          }}>
            ratiothedigitalcourtsociety.com
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ── Overlays ── */}
      <Vignette intensity={0.45} />
      <FilmGrain frame={frame} opacity={0.025} />
      <CaptionOverlay frame={frame} captions={CAPTIONS} />
    </AbsoluteFill>
  );
};
