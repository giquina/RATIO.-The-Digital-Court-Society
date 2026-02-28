/**
 * RATIO. Constitutional Law Showcase (55 seconds)
 *
 * "Everything you need for constitutional law." — A study-focused
 * presentation showing RATIO's constitutional law content, key cases,
 * AI practice workflow, and how it maps to what students are studying.
 * Designed for WhatsApp group chats.
 *
 * Scene Timeline (30fps x ~54.3s = 1630 frames, retimed for Charlie narrator):
 *   1. Title Card         0–126     "Constitutional Law" + RATIO branding
 *   2. Topics             126–510   Key topics cascading in
 *   3. Key Cases          510–812   Famous cases with year badges
 *   4. Practice Demo      812–1138  Simulated AI session exchange
 *   5. Score & Feedback   1138–1326 Quick score reveal
 *   6. CTA                1326–1630 "Start studying constitutional law today"
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

// ── Constitutional Law Topics ────────────────────────────────────────────

const TOPICS = [
  { name: "Parliamentary Sovereignty", icon: "\uD83C\uDFDB\uFE0F" },
  { name: "Rule of Law", icon: "\u2696\uFE0F" },
  { name: "Separation of Powers", icon: "\uD83D\uDCDC" },
  { name: "Judicial Review", icon: "\uD83D\uDD0D" },
  { name: "Royal Prerogative", icon: "\uD83D\uDC51" },
  { name: "Human Rights Act 1998", icon: "\uD83D\uDEE1\uFE0F" },
  { name: "Devolution", icon: "\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F" },
  { name: "Constitutional Reform", icon: "\uD83D\uDCC4" },
  { name: "EU Withdrawal & Brexit", icon: "\uD83C\uDDEA\uD83C\uDDFA" },
];

// ── Key Cases ────────────────────────────────────────────────────────────

const KEY_CASES = [
  { name: "Entick v Carrington", year: "1765", topic: "Rule of Law", color: "#4A90D9" },
  { name: "A.V. Dicey — Introduction to the Study of the Law of the Constitution", year: "1885", topic: "Parliamentary Sovereignty", color: GOLD },
  { name: "R (Factortame) v SS for Transport", year: "1990", topic: "EU Supremacy", color: "#4CAF50" },
  { name: "R (Miller) v Secretary of State", year: "2017", topic: "Prerogative & Parliament", color: "#E67E22" },
  { name: "R (UNISON) v Lord Chancellor", year: "2017", topic: "Access to Justice", color: "#9C27B0" },
  { name: "R (Miller) v The Prime Minister", year: "2019", topic: "Prorogation", color: "#F44336" },
];

// ── Simulated Practice Exchange ──────────────────────────────────────────

const PRACTICE_MESSAGES = [
  {
    role: "brief" as const,
    text: "Topic: Parliamentary Sovereignty post-Brexit\nRole: Junior Counsel for the Appellant",
  },
  {
    role: "judge" as const,
    text: "Counsel, explain the constitutional significance of the European Union (Withdrawal) Act 2018 in relation to parliamentary sovereignty.",
  },
  {
    role: "advocate" as const,
    text: "My Lord, the Withdrawal Act 2018 represents Parliament's reassertion of legislative supremacy by repealing the European Communities Act 1972\u2026",
  },
];

// ── Score Dimensions ────────────────────────────────────────────────────

const MINI_SCORES = [
  { label: "Argument Structure", score: 78 },
  { label: "Use of Authorities", score: 82 },
  { label: "Constitutional Reasoning", score: 74 },
  { label: "Persuasiveness", score: 71 },
];

// ── Animation Helpers ───────────────────────────────────────────────────

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

// ── Sub-Components ──────────────────────────────────────────────────────

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
      margin: "10px auto", opacity: 0.7,
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

// ── Topic Pill ──────────────────────────────────────────────────────────

function TopicPill({ name, icon, frame, delay }: {
  name: string; icon: string; frame: number; delay: number;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, 15);
  const x = easeOut(f, 30, 0, 0, 20);
  const scale = easeOut(f, 0.9, 1, 0, 15);

  return (
    <div style={{
      opacity,
      transform: `translateX(${x}px) scale(${scale})`,
      display: "flex", alignItems: "center", gap: 10,
      background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
      borderRadius: 12, padding: "10px 16px",
      border: `1px solid rgba(201, 168, 76, 0.1)`,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{
        fontFamily: SANS, fontSize: 13, color: TEXT,
        fontWeight: 500,
      }}>
        {name}
      </span>
    </div>
  );
}

// ── Case Card ───────────────────────────────────────────────────────────

function CaseCard({ name, year, topic, color, frame, delay }: {
  name: string; year: string; topic: string; color: string;
  frame: number; delay: number;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, 15);
  const y = easeOut(f, 20, 0, 0, 18);

  return (
    <div style={{
      opacity,
      transform: `translateY(${y}px)`,
      background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
      borderRadius: 12, padding: "12px 16px",
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 4,
      }}>
        <div style={{
          fontFamily: SERIF, fontSize: 13, color: TEXT,
          fontWeight: 600, flex: 1,
        }}>
          {name}
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 10,
          color: NAVY, fontWeight: 700,
          background: color, borderRadius: 6,
          padding: "2px 8px", marginLeft: 8,
        }}>
          {year}
        </div>
      </div>
      <div style={{
        fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
      }}>
        {topic}
      </div>
    </div>
  );
}

// ── Caption Data ────────────────────────────────────────────────────────

const CAPTIONS: CaptionPhrase[] = [
  // Title VO — Charlie (111 frames from frame 5)
  { text: "Everything you need for constitutional law.", from: 8, to: 116 },
  // Topics VO — Charlie (368 frames from frame 132)
  { text: "Nine core topics. All on RATIO.", from: 135, to: 410 },
  // Cases VO — Charlie (287 frames from frame 518)
  { text: "The cases that shaped the constitution.", from: 520, to: 740 },
  // Practice VO — Charlie (311 frames from frame 820)
  { text: "Practice with an AI Judge who knows the authorities.", from: 823, to: 1060 },
  // Score VO — Charlie (173 frames from frame 1146)
  { text: "Get scored on your constitutional reasoning.", from: 1148, to: 1300 },
  // CTA VO — Charlie (292 frames from frame 1334)
  { text: "Study constitutional law the way it was meant to be studied.", from: 1337, to: 1510 },
  { text: "Free for UK law students.", from: 1520, to: 1620 },
];

// ── Main Composition ────────────────────────────────────────────────────

export const ConstitutionalLaw: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background music (retimed for Charlie narrator, ~1630 frames)
  const musicVolume = interpolate(frame,
    [0, 20, 126, 300, 1326, 1376, 1600, 1625],
    [0, 0.07, 0.05, 0.04, 0.04, 0.08, 0.06, 0.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Scene opacities (retimed for Charlie narrator clips)
  const titleOpacity = interpolate(frame, [0, 10, 106, 126], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const topicsOpacity = interpolate(frame, [126, 140, 490, 510], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const casesOpacity = interpolate(frame, [510, 525, 792, 812], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const practiceOpacity = interpolate(frame, [812, 827, 1118, 1138], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scoreOpacity = interpolate(frame, [1138, 1153, 1306, 1326], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(frame, [1326, 1346, 1620, 1630], [0, 1, 1, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(42, 32, 16, 0.15), transparent)`,
      }} />

      {/* ── Background Music ── */}
      <Audio src={staticFile("audio/music/ambient-pad-45s.mp3")} volume={musicVolume} />

      {/* ── Courtroom Ambiance ── */}
      <Audio src={staticFile("audio/sfx/courtroom-tone.mp3")} volume={0.08} />

      {/* ── Voiceover (ElevenLabs — Charlie) ── */}
      <Sequence from={5} durationInFrames={111} name="VO: Title (Charlie, 3.669s)">
        <Audio src={staticFile("audio/voiceover/conlaw-01-title.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={132} durationInFrames={368} name="VO: Topics (Charlie, 12.260s)">
        <Audio src={staticFile("audio/voiceover/conlaw-02-topics.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={518} durationInFrames={287} name="VO: Cases (Charlie, 9.567s)">
        <Audio src={staticFile("audio/voiceover/conlaw-03-cases.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={820} durationInFrames={311} name="VO: Practice (Charlie, 10.356s)">
        <Audio src={staticFile("audio/voiceover/conlaw-04-practice.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1146} durationInFrames={173} name="VO: Score (Charlie, 5.759s)">
        <Audio src={staticFile("audio/voiceover/conlaw-05-score.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1334} durationInFrames={292} name="VO: CTA (Charlie, 9.706s)">
        <Audio src={staticFile("audio/voiceover/conlaw-06-cta.mp3")} volume={0.92} />
      </Sequence>

      {/* ── SFX (retimed for Charlie narrator scene transitions) ── */}
      <Sequence from={124} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={508} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={810} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={817} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/gavel-wood.mp3")} volume={0.30} />
      </Sequence>
      <Sequence from={1153} durationInFrames={50}>
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.12} />
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
        {/* Module badge */}
        <TextReveal frame={frame} delay={5}>
          <div style={{
            background: `linear-gradient(135deg, rgba(201, 168, 76, 0.15), ${NAVY_CARD})`,
            borderRadius: 14, padding: "8px 20px",
            border: `1px solid rgba(201, 168, 76, 0.2)`,
            marginBottom: 16,
          }}>
            <span style={{
              fontFamily: SANS, fontSize: 11, color: GOLD,
              textTransform: "uppercase", letterSpacing: 2, fontWeight: 600,
            }}>
              RATIO Law Book
            </span>
          </div>
        </TextReveal>

        <TextReveal frame={frame} delay={12}>
          <div style={{
            fontFamily: SERIF, fontSize: 36, fontWeight: 700,
            color: TEXT, textAlign: "center", lineHeight: 1.2,
          }}>
            Constitutional<br />Law
          </div>
        </TextReveal>

        <GoldLine width={120} delay={20} frame={frame} thickness={2} />

        <TextReveal frame={frame} delay={25}>
          <div style={{
            fontFamily: SANS, fontSize: 13, color: TEXT_SEC,
            textAlign: "center", lineHeight: 1.5, padding: "0 40px",
          }}>
            Parliamentary sovereignty, rule of law,{"\n"}
            royal prerogative, and devolution
          </div>
        </TextReveal>

        <TextReveal frame={frame} delay={35}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: GOLD,
            marginTop: 16, fontWeight: 600,
          }}>
            9 Topics \u00B7 Specialist Module
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 2 — Topics
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: topicsOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        padding: "0 24px",
        justifyContent: "center",
      }}>
        <TextReveal frame={frame - 90} delay={0}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: GOLD,
            textTransform: "uppercase", letterSpacing: 2,
            marginBottom: 14, fontWeight: 600,
          }}>
            What You Will Study
          </div>
        </TextReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TOPICS.map((topic, i) => (
            <TopicPill
              key={topic.name}
              name={topic.name}
              icon={topic.icon}
              frame={frame - 90}
              delay={8 + i * 12}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 3 — Key Cases
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: casesOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        padding: "0 24px",
        justifyContent: "center",
      }}>
        <TextReveal frame={frame - 320} delay={0}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: GOLD,
            textTransform: "uppercase", letterSpacing: 2,
            marginBottom: 6, fontWeight: 600,
          }}>
            Key Authorities
          </div>
        </TextReveal>

        <TextReveal frame={frame - 320} delay={5}>
          <div style={{
            fontFamily: SERIF, fontSize: 22, color: TEXT,
            fontWeight: 600, marginBottom: 16,
          }}>
            Cases that shaped{"\n"}the constitution
          </div>
        </TextReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {KEY_CASES.map((c, i) => (
            <CaseCard
              key={c.name}
              {...c}
              frame={frame - 320}
              delay={15 + i * 15}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 4 — Practice Demo
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: practiceOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        padding: "0 20px",
        justifyContent: "center",
      }}>
        <TextReveal frame={frame - 552} delay={0}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: GOLD,
            textTransform: "uppercase", letterSpacing: 2,
            marginBottom: 14, fontWeight: 600,
          }}>
            Moot Court Session
          </div>
        </TextReveal>

        {/* Brief card */}
        <TextReveal frame={frame - 552} delay={10}>
          <div style={{
            background: `linear-gradient(135deg, rgba(201, 168, 76, 0.08), ${NAVY_CARD})`,
            borderRadius: 14, padding: "14px 18px",
            border: `1px solid rgba(201, 168, 76, 0.15)`,
            marginBottom: 14,
          }}>
            <div style={{
              fontFamily: SANS, fontSize: 9, color: GOLD,
              textTransform: "uppercase", letterSpacing: 1.5,
              marginBottom: 6, fontWeight: 600,
            }}>
              Case Brief
            </div>
            <div style={{
              fontFamily: SANS, fontSize: 12, color: TEXT, lineHeight: 1.5,
            }}>
              <strong>Topic:</strong> Parliamentary Sovereignty post-Brexit{"\n"}
              <span style={{ color: TEXT_SEC }}>Role: Junior Counsel for the Appellant</span>
            </div>
          </div>
        </TextReveal>

        {/* Judge message */}
        <TextReveal frame={frame - 552} delay={30}>
          <div style={{
            background: `linear-gradient(135deg, rgba(201, 168, 76, 0.06), ${NAVY_CARD})`,
            borderRadius: 14, padding: "12px 16px",
            borderLeft: `3px solid ${GOLD}`,
            marginBottom: 10,
          }}>
            <div style={{
              fontFamily: SERIF, fontSize: 10, color: GOLD,
              fontWeight: 600, marginBottom: 4, letterSpacing: 0.5,
            }}>
              Justice AI
            </div>
            <div style={{
              fontFamily: SANS, fontSize: 12, color: TEXT, lineHeight: 1.55,
            }}>
              {PRACTICE_MESSAGES[1].text}
            </div>
          </div>
        </TextReveal>

        {/* Advocate response */}
        <TextReveal frame={frame - 552} delay={55}>
          <div style={{
            background: NAVY_CARD,
            borderRadius: 14, padding: "12px 16px",
            borderRight: `3px solid ${NAVY_LIGHT}`,
            marginLeft: 30,
          }}>
            <div style={{
              fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
              fontWeight: 600, marginBottom: 4,
            }}>
              You (Counsel)
            </div>
            <div style={{
              fontFamily: SANS, fontSize: 12, color: TEXT, lineHeight: 1.55,
            }}>
              {PRACTICE_MESSAGES[2].text}
            </div>
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 5 — Score & Feedback
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: scoreOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 20,
      }}>
        <TextReveal frame={frame - 788} delay={5}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
            textTransform: "uppercase", letterSpacing: 2,
          }}>
            Your Constitutional Law Score
          </div>
        </TextReveal>

        {/* Score circle */}
        {(() => {
          const sf = frame - 788;
          const score = 76;
          const displayScore = Math.round(easeOut(sf, 0, score, 10, 45));
          const circumference = 2 * Math.PI * 48;
          const dashOffset = circumference - (easeOut(sf, 0, score / 100, 10, 45) * circumference);

          return (
            <div style={{
              position: "relative", width: 120, height: 120,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width={120} height={120} style={{ position: "absolute" }}>
                <circle cx={60} cy={60} r={48} fill="none"
                  stroke="rgba(242, 237, 230, 0.06)" strokeWidth={6} />
                <circle cx={60} cy={60} r={48} fill="none"
                  stroke={GOLD} strokeWidth={6} strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset}
                  transform="rotate(-90 60 60)"
                  style={{ filter: `drop-shadow(0 0 8px rgba(201, 168, 76, 0.4))` }} />
              </svg>
              <div style={{ textAlign: "center", zIndex: 1 }}>
                <div style={{
                  fontFamily: SERIF, fontSize: 36, fontWeight: 700,
                  color: GOLD, lineHeight: 1,
                }}>
                  {displayScore}
                </div>
                <div style={{
                  fontFamily: SANS, fontSize: 10, color: TEXT_SEC, marginTop: 2,
                }}>
                  / 100
                </div>
              </div>
            </div>
          );
        })()}

        {/* Mini score bars */}
        <div style={{ width: "100%", padding: "0 36px" }}>
          {MINI_SCORES.map((dim, i) => {
            const sf = frame - 788;
            const barDelay = 20 + i * 8;
            const opacity = easeOut(sf, 0, 1, barDelay, barDelay + 12);
            const barWidth = easeOut(sf, 0, dim.score, barDelay + 5, barDelay + 25);
            const scoreColor = dim.score >= 80 ? "#4CAF50" : dim.score >= 70 ? GOLD : "#E67E22";

            return (
              <div key={dim.label} style={{ opacity, marginBottom: 8 }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 3,
                }}>
                  <span style={{ fontFamily: SANS, fontSize: 10, color: TEXT_SEC }}>
                    {dim.label}
                  </span>
                  <span style={{
                    fontFamily: SANS, fontSize: 10, color: scoreColor, fontWeight: 600,
                  }}>
                    {Math.round(barWidth)}
                  </span>
                </div>
                <div style={{
                  height: 5, borderRadius: 3,
                  background: "rgba(242, 237, 230, 0.06)", overflow: "hidden",
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
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 6 — CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: ctaOpacity,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        <TextReveal frame={frame - 936} delay={5}>
          <div style={{
            fontFamily: SERIF, fontSize: 24, fontWeight: 600,
            color: TEXT, textAlign: "center", lineHeight: 1.3,
          }}>
            Study constitutional law{"\n"}the way it was meant to be studied.
          </div>
        </TextReveal>

        <div style={{ height: 16 }} />

        <TextReveal frame={frame - 936} delay={18}>
          <div style={{
            fontFamily: SERIF, fontSize: 44, fontWeight: 700,
            color: GOLD, letterSpacing: 3,
          }}>
            RATIO.
          </div>
        </TextReveal>

        <GoldLine width={140} delay={25} frame={frame - 936} thickness={2} />

        <TextReveal frame={frame - 936} delay={30}>
          <div style={{
            fontFamily: SERIF, fontSize: 16, color: TEXT_SEC,
            fontStyle: "italic",
          }}>
            The Digital Court Society
          </div>
        </TextReveal>

        <TextReveal frame={frame - 936} delay={42}>
          <div style={{
            marginTop: 20,
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

        <TextReveal frame={frame - 936} delay={55}>
          <div style={{
            fontFamily: SANS, fontSize: 12, color: TEXT_SEC,
            marginTop: 12,
          }}>
            Free for UK law students
          </div>
        </TextReveal>

        <TextReveal frame={frame - 936} delay={65}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: TEXT_TER,
            marginTop: 14, letterSpacing: 0.8,
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
