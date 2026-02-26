/**
 * RATIO. Recruitment Promo (48 seconds)
 *
 * "We're building something for law students." — A WhatsApp-optimised
 * recruitment video announcing summer part-time roles and work experience
 * opportunities. Designed for university law society group chats.
 *
 * Tone: Starts institutional (what RATIO is), shifts to startup energy
 * (we're hiring). Summer roles, part-time, work experience after exams.
 * Birkbeck University must be highlighted prominently.
 *
 * Scene Timeline (30fps × 48s = 1440 frames, Charlie narrator):
 *   1. Hook             0–80     "We're building something for law students."
 *   2. What is RATIO    72–372   AI judges, live moots, national rankings
 *   3. We're Hiring     364–584  "Part-time roles. Summer work. Real experience."
 *   4. Role Cards        576–871  6 animated role cards
 *   5. Universities     863–1173  142 UK universities, Birkbeck highlighted
 *   6. CTA              1165–1440 "Come find us." + careers link
 *
 * Voiceover: ElevenLabs — Charlie voice (IKne3meq5aSn9XLyUdCD)
 * Clip durations: 62, 278, 201, 272, 293, 236 frames
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

// ── Role Data ─────────────────────────────────────────────────────────────

interface Role {
  title: string;
  type: "Part-time" | "Apprenticeship" | "Coming Soon";
  pay: string;
  color: string;
}

const ROLES: Role[] = [
  { title: "Law Society Outreach\n& Partnerships", type: "Part-time", pay: "\u00A312\u201315/hr", color: "#4A90D9" },
  { title: "Case Research &\nMoot Scenario Writer", type: "Part-time", pay: "\u00A312\u201315/hr", color: "#4CAF50" },
  { title: "Advocacy Community\nLead", type: "Apprenticeship", pay: "\u00A311\u201313k/yr", color: "#E67E22" },
  { title: "Legal Tech\nDeveloper", type: "Part-time", pay: "\u00A318\u201322k pro rata", color: "#9C27B0" },
  { title: "Legal UX\nResearcher", type: "Coming Soon", pay: "", color: "#F44336" },
  { title: "Legal Communications\n& Design", type: "Coming Soon", pay: "", color: GOLD },
];

// ── University Data ───────────────────────────────────────────────────────

interface University {
  name: string;
  highlighted?: boolean;
}

const UNIVERSITIES: University[] = [
  { name: "Birkbeck, University of London", highlighted: true },
  { name: "UCL" },
  { name: "King's College London" },
  { name: "University of Oxford" },
  { name: "University of Cambridge" },
  { name: "LSE" },
  { name: "University of Manchester" },
  { name: "University of Bristol" },
  { name: "University of Edinburgh" },
  { name: "University of Birmingham" },
  { name: "University of Leeds" },
  { name: "University of Nottingham" },
  { name: "Queen Mary" },
  { name: "SOAS" },
  { name: "University of Warwick" },
  { name: "Durham University" },
];

// ── Feature Badges (Scene 2) ──────────────────────────────────────────────

const FEATURES = [
  { label: "AI Judges", icon: "\u2696\uFE0F" },
  { label: "Live Moot Courts", icon: "\uD83C\uDFDB\uFE0F" },
  { label: "National Rankings", icon: "\uD83C\uDFC6" },
  { label: "Student Governance", icon: "\uD83D\uDCDC" },
  { label: "40+ Legal Modules", icon: "\uD83D\uDCDA" },
  { label: "142 Universities", icon: "\uD83C\uDF93" },
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

// ── Sub-Components ────────────────────────────────────────────────────────

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

// ── Role Card ─────────────────────────────────────────────────────────────

function RoleCard({ role, frame, delay }: {
  role: Role; frame: number; delay: number;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, 15);
  const x = easeOut(f, 40, 0, 0, 20);
  const scale = easeOut(f, 0.92, 1, 0, 15);

  const badgeColors: Record<string, { bg: string; text: string }> = {
    "Part-time": { bg: "rgba(74, 144, 217, 0.2)", text: "#6BAAF7" },
    "Apprenticeship": { bg: "rgba(230, 126, 34, 0.2)", text: "#F5A623" },
    "Coming Soon": { bg: "rgba(242, 237, 230, 0.08)", text: TEXT_SEC },
  };

  const badge = badgeColors[role.type] ?? badgeColors["Coming Soon"];

  return (
    <div style={{
      opacity,
      transform: `translateX(${x}px) scale(${scale})`,
      background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
      borderRadius: 12,
      padding: "10px 14px",
      borderLeft: `3px solid ${role.color}`,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div style={{
          fontFamily: SANS, fontSize: 11.5, color: TEXT,
          fontWeight: 600, lineHeight: 1.35, flex: 1,
          whiteSpace: "pre-line",
        }}>
          {role.title}
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 9,
          color: badge.text, fontWeight: 600,
          background: badge.bg,
          borderRadius: 8, padding: "3px 8px",
          marginLeft: 8, whiteSpace: "nowrap",
          letterSpacing: 0.3,
        }}>
          {role.type}
        </div>
      </div>
      {role.pay && (
        <div style={{
          fontFamily: SANS, fontSize: 10, color: GOLD,
          fontWeight: 500,
        }}>
          {role.pay}
        </div>
      )}
    </div>
  );
}

// ── University Pill ───────────────────────────────────────────────────────

function UniversityPill({ uni, frame, delay }: {
  uni: University; frame: number; delay: number;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, 12);
  const scale = easeOut(f, 0.85, 1, 0, 15);
  const y = easeOut(f, 15, 0, 0, 15);

  const isHighlighted = uni.highlighted;

  return (
    <div style={{
      opacity,
      transform: `scale(${scale}) translateY(${y}px)`,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: isHighlighted
        ? `linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.05))`
        : `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
      borderRadius: isHighlighted ? 14 : 10,
      padding: isHighlighted ? "10px 16px" : "7px 12px",
      border: isHighlighted
        ? `2px solid ${GOLD}`
        : `1px solid rgba(242, 237, 230, 0.06)`,
      boxShadow: isHighlighted
        ? `0 0 20px rgba(201, 168, 76, 0.15), 0 0 40px rgba(201, 168, 76, 0.05)`
        : "none",
    }}>
      {isHighlighted && (
        <span style={{ fontSize: 14 }}>{"\uD83C\uDF1F"}</span>
      )}
      <span style={{
        fontFamily: SANS,
        fontSize: isHighlighted ? 13 : 11,
        color: isHighlighted ? GOLD : TEXT,
        fontWeight: isHighlighted ? 700 : 500,
        letterSpacing: isHighlighted ? 0.3 : 0,
      }}>
        {uni.name}
      </span>
    </div>
  );
}

// ── Feature Badge ─────────────────────────────────────────────────────────

function FeatureBadge({ label, icon, frame, delay }: {
  label: string; icon: string; frame: number; delay: number;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, 15);
  const scale = easeOut(f, 0.9, 1, 0, 18);
  const y = easeOut(f, 20, 0, 0, 18);

  return (
    <div style={{
      opacity,
      transform: `scale(${scale}) translateY(${y}px)`,
      background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
      borderRadius: 12,
      padding: "12px 16px",
      border: `1px solid rgba(201, 168, 76, 0.1)`,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{
        fontFamily: SANS, fontSize: 13, color: TEXT,
        fontWeight: 500,
      }}>
        {label}
      </span>
    </div>
  );
}

// ── Animated Counter ──────────────────────────────────────────────────────

function AnimatedCounter({ target, frame, delay, duration = 40 }: {
  target: number; frame: number; delay: number; duration?: number;
}) {
  const f = frame - delay;
  const value = Math.round(easeOut(f, 0, target, 0, duration));
  const opacity = easeOut(f, 0, 1, 0, 15);

  return (
    <span style={{ opacity, fontVariantNumeric: "tabular-nums" }}>
      {value}
    </span>
  );
}

// ── Caption Data ──────────────────────────────────────────────────────────

const CAPTIONS: CaptionPhrase[] = [
  // Scene 1 — Hook (VO: 5-67)
  { text: "We're building something for law students.", from: 8, to: 65 },
  // Scene 2 — What is RATIO (VO: 80-358)
  { text: "RATIO is a constitutional training ground.", from: 83, to: 180 },
  { text: "AI judges, live moots, national rankings.", from: 185, to: 280 },
  { text: "Built for students who take advocacy seriously.", from: 285, to: 355 },
  // Scene 3 — We're Hiring (VO: 372-573)
  { text: "And now we're looking for the people who want to help us build it.", from: 375, to: 480 },
  { text: "Part-time roles. Summer work. Real experience.", from: 485, to: 570 },
  // Scene 4 — Roles (VO: 584-856)
  { text: "Growth and partnerships. Content and legal writing.", from: 587, to: 700 },
  { text: "Community management. Development. Design.", from: 705, to: 800 },
  { text: "And more roles opening soon.", from: 805, to: 853 },
  // Scene 5 — Universities (VO: 871-1164)
  { text: "We want students from across the UK.", from: 874, to: 950 },
  { text: "Birkbeck. UCL. King's. Oxford. Cambridge.", from: 955, to: 1070 },
  { text: "A hundred and forty-two universities and counting.", from: 1075, to: 1160 },
  // Scene 6 — CTA (VO: 1173-1409)
  { text: "If you're studying law and you want real work experience this summer,", from: 1176, to: 1320 },
  { text: "come find us. RATIO. The Digital Court Society.", from: 1325, to: 1405 },
];

// ── Gold Particle (floating accent) ───────────────────────────────────────

function GoldParticle({ x, y, size, delay, frame, drift = 20, speed = 0.008 }: {
  x: number; y: number; size: number; delay: number; frame: number;
  drift?: number; speed?: number;
}) {
  const f = frame - delay;
  if (f < 0) return null;
  const opacity = clamp01(f / 20) * 0.3 * (0.5 + 0.5 * Math.sin(f * speed * 2));
  const yOffset = Math.sin(f * speed) * drift;
  const xOffset = Math.cos(f * speed * 0.7) * drift * 0.5;

  return (
    <div style={{
      position: "absolute",
      left: x, top: y,
      width: size, height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${GOLD}, transparent)`,
      opacity,
      transform: `translate(${xOffset}px, ${yOffset}px)`,
      filter: "blur(1px)",
      pointerEvents: "none",
    }} />
  );
}

// ── Main Composition ──────────────────────────────────────────────────────

export const RecruitmentPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background music — subtle, builds energy
  const musicVolume = interpolate(frame,
    [0, 20, 72, 364, 576, 863, 1165, 1380, 1430],
    [0, 0.06, 0.05, 0.05, 0.06, 0.06, 0.08, 0.06, 0.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Scene opacities
  const hookOpacity = interpolate(frame, [0, 8, 62, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const whatOpacity = interpolate(frame, [72, 86, 352, 372], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const hiringOpacity = interpolate(frame, [364, 378, 564, 584], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const rolesOpacity = interpolate(frame, [576, 590, 851, 871], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const unisOpacity = interpolate(frame, [863, 877, 1153, 1173], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(frame, [1165, 1185, 1430, 1440], [0, 1, 1, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {/* Background glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(42, 32, 16, 0.15), transparent)`,
      }} />

      {/* Floating gold particles */}
      <GoldParticle x={40} y={150} size={4} delay={20} frame={frame} />
      <GoldParticle x={320} y={300} size={3} delay={60} frame={frame} speed={0.01} />
      <GoldParticle x={80} y={600} size={5} delay={100} frame={frame} drift={25} />
      <GoldParticle x={280} y={500} size={3} delay={200} frame={frame} speed={0.012} />
      <GoldParticle x={180} y={750} size={4} delay={300} frame={frame} />

      {/* ── Background Music ── */}
      <Audio src={staticFile("audio/music/ambient-pad-45s.mp3")} volume={musicVolume} />

      {/* ── Courtroom Ambiance ── */}
      <Audio src={staticFile("audio/sfx/courtroom-tone.mp3")} volume={0.06} />

      {/* ── Voiceover (ElevenLabs — Charlie) ── */}
      <Sequence from={5} durationInFrames={62} name="VO: Hook (Charlie, 2.043s)">
        <Audio src={staticFile("audio/voiceover/recruit-01-hook.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={80} durationInFrames={278} name="VO: What is RATIO (Charlie, 9.242s)">
        <Audio src={staticFile("audio/voiceover/recruit-02-what.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={372} durationInFrames={201} name="VO: We're Hiring (Charlie, 6.687s)">
        <Audio src={staticFile("audio/voiceover/recruit-03-hiring.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={584} durationInFrames={272} name="VO: Roles (Charlie, 9.056s)">
        <Audio src={staticFile("audio/voiceover/recruit-04-roles.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={871} durationInFrames={293} name="VO: Universities (Charlie, 9.752s)">
        <Audio src={staticFile("audio/voiceover/recruit-05-unis.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1173} durationInFrames={236} name="VO: CTA (Charlie, 7.848s)">
        <Audio src={staticFile("audio/voiceover/recruit-06-cta.mp3")} volume={0.92} />
      </Sequence>

      {/* ── SFX — whooshes on scene transitions ── */}
      <Sequence from={70} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={362} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={574} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={861} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={1163} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      {/* Chime at CTA */}
      <Sequence from={1175} durationInFrames={50}>
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.10} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 1 — Hook
          "We're building something for law students."
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: hookOpacity,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        zIndex: 10,
      }}>
        {/* RATIO badge */}
        <TextReveal frame={frame} delay={3}>
          <div style={{
            background: `linear-gradient(135deg, rgba(201, 168, 76, 0.15), ${NAVY_CARD})`,
            borderRadius: 14, padding: "8px 20px",
            border: `1px solid rgba(201, 168, 76, 0.2)`,
            marginBottom: 20,
          }}>
            <span style={{
              fontFamily: SANS, fontSize: 11, color: GOLD,
              textTransform: "uppercase", letterSpacing: 2, fontWeight: 600,
            }}>
              RATIO.
            </span>
          </div>
        </TextReveal>

        <TextReveal frame={frame} delay={8}>
          <div style={{
            fontFamily: SERIF, fontSize: 30, fontWeight: 700,
            color: TEXT, textAlign: "center", lineHeight: 1.25,
            padding: "0 30px",
          }}>
            We're building{"\n"}something.
          </div>
        </TextReveal>

        <GoldLine width={100} delay={15} frame={frame} thickness={2} />

        <TextReveal frame={frame} delay={20}>
          <div style={{
            fontFamily: SANS, fontSize: 14, color: TEXT_SEC,
            textAlign: "center",
          }}>
            For law students.
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 2 — What is RATIO
          Quick feature badges showcasing the platform
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: whatOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        padding: "0 24px",
        justifyContent: "center",
      }}>
        <TextReveal frame={frame - 72} delay={0}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: GOLD,
            textTransform: "uppercase", letterSpacing: 2,
            marginBottom: 8, fontWeight: 600,
          }}>
            The Platform
          </div>
        </TextReveal>

        <TextReveal frame={frame - 72} delay={5}>
          <div style={{
            fontFamily: SERIF, fontSize: 24, color: TEXT,
            fontWeight: 600, marginBottom: 20, lineHeight: 1.3,
          }}>
            A constitutional{"\n"}training ground.
          </div>
        </TextReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {FEATURES.map((feat, i) => (
            <FeatureBadge
              key={feat.label}
              label={feat.label}
              icon={feat.icon}
              frame={frame - 72}
              delay={15 + i * 12}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 3 — We're Hiring
          Bold hiring announcement — shift to startup energy
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: hiringOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 30px",
      }}>
        <TextReveal frame={frame - 364} delay={0}>
          <div style={{
            fontFamily: SERIF, fontSize: 38, fontWeight: 700,
            color: GOLD, textAlign: "center", lineHeight: 1.2,
          }}>
            We're hiring.
          </div>
        </TextReveal>

        <GoldLine width={140} delay={10} frame={frame - 364} thickness={2} />

        <TextReveal frame={frame - 364} delay={15}>
          <div style={{
            fontFamily: SANS, fontSize: 15, color: TEXT,
            textAlign: "center", lineHeight: 1.6, fontWeight: 500,
          }}>
            Part-time roles.{"\n"}Summer work.{"\n"}Real experience.
          </div>
        </TextReveal>

        <TextReveal frame={frame - 364} delay={30}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: TEXT_SEC,
            textAlign: "center", marginTop: 16, lineHeight: 1.5,
          }}>
            Perfect for law students looking for{"\n"}work experience after exams.
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 4 — Role Cards
          6 animated cards sliding in with staggered delays
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: rolesOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        padding: "0 20px",
        justifyContent: "center",
      }}>
        <TextReveal frame={frame - 576} delay={0}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: GOLD,
            textTransform: "uppercase", letterSpacing: 2,
            marginBottom: 6, fontWeight: 600,
          }}>
            Open Roles
          </div>
        </TextReveal>

        <TextReveal frame={frame - 576} delay={5}>
          <div style={{
            fontFamily: SERIF, fontSize: 20, color: TEXT,
            fontWeight: 600, marginBottom: 14,
          }}>
            Join the team.
          </div>
        </TextReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {ROLES.map((role, i) => (
            <RoleCard
              key={role.title}
              role={role}
              frame={frame - 576}
              delay={12 + i * 14}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 5 — Universities
          Counter + pill cascade with Birkbeck highlighted
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: unisOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        padding: "0 20px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Counter */}
        <TextReveal frame={frame - 863} delay={0}>
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <div style={{
              fontFamily: SERIF, fontSize: 48, fontWeight: 700,
              color: GOLD, lineHeight: 1,
            }}>
              <AnimatedCounter target={142} frame={frame - 863} delay={5} duration={50} />
            </div>
            <div style={{
              fontFamily: SANS, fontSize: 12, color: TEXT_SEC,
              marginTop: 4, letterSpacing: 1, textTransform: "uppercase",
              fontWeight: 600,
            }}>
              UK Universities
            </div>
          </div>
        </TextReveal>

        <GoldLine width={100} delay={10} frame={frame - 863} thickness={1} />

        <TextReveal frame={frame - 863} delay={15}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: TEXT_SEC,
            textAlign: "center", marginBottom: 14,
          }}>
            Open to all UK law students
          </div>
        </TextReveal>

        {/* University pills — flex wrap */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6,
          justifyContent: "center", maxWidth: 360,
        }}>
          {UNIVERSITIES.map((uni, i) => (
            <UniversityPill
              key={uni.name}
              uni={uni}
              frame={frame - 863}
              delay={20 + i * 6}
            />
          ))}
        </div>

        {/* "+126 more" label */}
        <TextReveal frame={frame - 863} delay={20 + UNIVERSITIES.length * 6 + 5}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: TEXT_TER,
            marginTop: 10, fontWeight: 500,
          }}>
            +126 more universities
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 6 — CTA
          RATIO logo + careers URL + apply button
          ═══════════════════════════════════════════════════════════════════ */}
      <AbsoluteFill style={{
        opacity: ctaOpacity,
        zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 24px",
      }}>
        {/* RATIO wordmark */}
        <TextReveal frame={frame - 1165} delay={0}>
          <div style={{
            fontFamily: SERIF, fontSize: 42, fontWeight: 700,
            color: TEXT, letterSpacing: 4, marginBottom: 4,
          }}>
            RATIO.
          </div>
        </TextReveal>

        <TextReveal frame={frame - 1165} delay={5}>
          <div style={{
            fontFamily: SANS, fontSize: 12, color: GOLD,
            letterSpacing: 1.5, textTransform: "uppercase",
            fontWeight: 600, marginBottom: 24,
          }}>
            The Digital Court Society
          </div>
        </TextReveal>

        <GoldLine width={140} delay={10} frame={frame - 1165} thickness={2} />

        {/* CTA button */}
        <TextReveal frame={frame - 1165} delay={18}>
          <div style={{
            background: `linear-gradient(135deg, ${GOLD}, #D4B85C)`,
            borderRadius: 14,
            padding: "14px 32px",
            marginTop: 10,
            boxShadow: `0 4px 20px rgba(201, 168, 76, 0.3)`,
          }}>
            <span style={{
              fontFamily: SANS, fontSize: 14, fontWeight: 700,
              color: NAVY, letterSpacing: 0.5,
            }}>
              Apply Now
            </span>
          </div>
        </TextReveal>

        {/* URL */}
        <TextReveal frame={frame - 1165} delay={25}>
          <div style={{
            fontFamily: SANS, fontSize: 10.5, color: TEXT_SEC,
            marginTop: 16, letterSpacing: 0.3,
            textAlign: "center",
          }}>
            ratiothedigitalcourtsociety.com/careers
          </div>
        </TextReveal>

        {/* Summer tagline */}
        <TextReveal frame={frame - 1165} delay={35}>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: TEXT_TER,
            marginTop: 20, textAlign: "center",
          }}>
            Free for UK law students
          </div>
        </TextReveal>
      </AbsoluteFill>

      {/* ── Visual overlays ── */}
      <CaptionOverlay frame={frame} captions={CAPTIONS} />
      <Vignette intensity={0.5} />
      <FilmGrain frame={frame} opacity={0.03} />
    </AbsoluteFill>
  );
};
