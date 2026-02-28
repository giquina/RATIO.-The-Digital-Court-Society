/**
 * RATIO. Analytics & Feedback Promo Video (~50 seconds)
 *
 * Creative Direction:
 *   - Apple-style minimal pacing: let every frame breathe
 *   - Voiceover-aligned text reveals (one idea per scene)
 *   - CSS-built phone mockups with 3D perspective and Ken Burns
 *   - Gold accent animations (lines, glows, particles)
 *   - Dark navy canvas, serif headings, sans-serif body
 *   - Institutional, premium, calm
 *
 * Voiceover Script (10 scenes, ~50s):
 *   [1] "How good are you, really?"
 *   [2] "After every session, RATIO tells you exactly where you stand."
 *   [3] "Seven dimensions of advocacy. Scored individually. So you know precisely what to work on."
 *   [4] "Detailed written feedback. Strengths highlighted. Improvements pinpointed."
 *   [5] "Your portfolio tracks every session. Watch your average climb over time."
 *   [6] "Review any past performance. Filter by module or session type."
 *   [7] "See your complete advocacy profile at a glance."
 *   [8] "Track your streak. Monitor your SQE2 readiness. Stay consistent."
 *   [9] "Every session makes you sharper."
 *   [10] "RATIO. See how far you can go."
 *
 * Scene Timeline (30fps x 50s = 1500 frames)
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
const GOLD_GLOW = "rgba(201, 168, 76, 0.06)";
const NAVY = "#0C1220";
const NAVY_MID = "#131E30";
const NAVY_CARD = "#182640";
const NAVY_LIGHT = "#1E3050";
const TEXT = "#F2EDE6";
const TEXT_SEC = "rgba(242, 237, 230, 0.55)";
const TEXT_TER = "rgba(242, 237, 230, 0.3)";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// ── Scene Timeline (30fps x 50s = 1500 frames) ──────────────────────────

interface Scene {
  id: string;
  /** Absolute start frame */
  start: number;
  /** Duration in frames */
  dur: number;
  /** Crossfade overlap with next scene (frames) */
  xfade: number;
}

const S: Scene[] = [
  { id: "hook",             start: 0,    dur: 120,  xfade: 10 },
  { id: "score-circle",     start: 110,  dur: 150,  xfade: 10 },
  { id: "seven-dimensions", start: 250,  dur: 210,  xfade: 10 },
  { id: "written-feedback", start: 450,  dur: 150,  xfade: 10 },
  { id: "portfolio",        start: 590,  dur: 180,  xfade: 10 },
  { id: "session-history",  start: 760,  dur: 150,  xfade: 10 },
  { id: "skills-radar",     start: 900,  dur: 150,  xfade: 10 },
  { id: "streak-readiness", start: 1040, dur: 150,  xfade: 10 },
  { id: "progress-montage", start: 1180, dur: 120,  xfade: 10 },
  { id: "cta",              start: 1290, dur: 210,  xfade: 0  },
];

// ── Feedback Dimensions ──────────────────────────────────────────────────

const SCORE_DIMENSIONS = [
  { label: "Argument Structure",        score: 78, icon: "IRAC" },
  { label: "Use of Authorities",        score: 82, icon: "Auth" },
  { label: "Oral Delivery",             score: 65, icon: "Oral" },
  { label: "Response to Interventions", score: 70, icon: "Resp" },
  { label: "Court Manner",              score: 85, icon: "Mann" },
  { label: "Persuasiveness",            score: 68, icon: "Pers" },
  { label: "Time Management",           score: 72, icon: "Time" },
];

// ── Session History Data ─────────────────────────────────────────────────

const SESSION_HISTORY = [
  { date: "13 Feb", module: "Constitutional Law", type: "Moot",        score: 78 },
  { date: "10 Feb", module: "Criminal Law",       type: "Moot Court", score: 72 },
  { date: "7 Feb",  module: "Tort Law",            type: "Moot",        score: 81 },
  { date: "3 Feb",  module: "Administrative Law",  type: "Moot Court", score: 65 },
  { date: "30 Jan", module: "Contract Law",        type: "Moot",        score: 74 },
];

// ── Radar Chart Data ─────────────────────────────────────────────────────

const RADAR_LABELS = [
  "Legal Knowledge",
  "Case Analysis",
  "Oral Delivery",
  "Procedure",
  "Persuasion",
  "Engagement",
  "Conduct",
];
const RADAR_VALUES = [78, 82, 65, 70, 85, 68, 72];

// ── Caption Data ─────────────────────────────────────────────────────────

interface CaptionPhrase {
  text: string;
  from: number;
  to: number;
}

const CAPTIONS: CaptionPhrase[] = [
  { text: "How good are you \u2014 really?", from: 5, to: 95 },
  { text: "After every session, RATIO tells you exactly where you stand.", from: 120, to: 240 },
  { text: "Seven dimensions of advocacy. Scored individually.", from: 260, to: 370 },
  { text: "So you know precisely what to work on.", from: 373, to: 440 },
  { text: "Detailed written feedback. Strengths highlighted.", from: 460, to: 540 },
  { text: "Improvements pinpointed.", from: 543, to: 590 },
  { text: "Your portfolio tracks every session.", from: 600, to: 690 },
  { text: "Watch your average climb over time.", from: 693, to: 760 },
  { text: "Review any past performance.", from: 770, to: 840 },
  { text: "Filter by module or session type.", from: 843, to: 900 },
  { text: "See your complete advocacy profile at a glance.", from: 910, to: 1030 },
  { text: "Track your streak. Monitor your SQE2 readiness.", from: 1050, to: 1140 },
  { text: "Stay consistent.", from: 1143, to: 1180 },
  { text: "Every session makes you sharper.", from: 1190, to: 1280 },
  { text: "RATIO. See how far you can go.", from: 1310, to: 1480 },
];

// ── Animation Helpers ────────────────────────────────────────────────────

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/** Smooth scene fade in/out with configurable crossfade duration */
function sceneFade(scene: Scene, frame: number): number {
  const local = frame - scene.start;
  const fadeInEnd = 25;

  const fadeIn = clamp01(local / fadeInEnd);
  const fadeOut = scene.xfade > 0
    ? clamp01((scene.dur - local) / scene.xfade)
    : local <= scene.dur ? 1 : 0;

  return fadeIn * fadeOut;
}

/** Local frame relative to scene start */
function localFrame(scene: Scene, frame: number): number {
  return frame - scene.start;
}

/** Whether scene should render (with buffer for crossfade) */
function isVisible(scene: Scene, frame: number): boolean {
  const local = frame - scene.start;
  return local >= -10 && local <= scene.dur + 10;
}

/** Smooth ease-out interpolation */
function easeOut(value: number, from: number, to: number, startF: number, endF: number): number {
  return interpolate(value, [startF, endF], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

/** Smooth ease-in-out interpolation */
function easeInOut(value: number, from: number, to: number, startF: number, endF: number): number {
  return interpolate(value, [startF, endF], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
}

// ── Reusable Components ──────────────────────────────────────────────────

/** Text reveal with smooth slide + fade */
function TextReveal({
  children,
  frame,
  delay = 0,
  direction = "up",
  distance = 24,
  duration = 25,
  style = {},
}: {
  children: React.ReactNode;
  frame: number;
  delay?: number;
  direction?: "up" | "down";
  distance?: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, duration);
  const offset = direction === "up" ? distance : -distance;
  const y = easeOut(f, offset, 0, 0, duration);

  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>
      {children}
    </div>
  );
}

/** Animated gold accent line */
function GoldLine({
  width,
  delay,
  frame,
  thickness = 1,
}: {
  width: number;
  delay: number;
  frame: number;
  thickness?: number;
}) {
  const w = easeOut(frame - delay, 0, width, 0, 30);
  return (
    <div
      style={{
        width: w,
        height: thickness,
        background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        margin: "12px auto",
        opacity: 0.7,
      }}
    />
  );
}

/** Cinematic vignette -- dark radial gradient on edges */
function Vignette({ intensity = 0.6 }: { intensity?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,${intensity * 0.4}) 60%, rgba(0,0,0,${intensity}) 100%)`,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
}

/** Film grain overlay -- subtle noise texture */
function FilmGrain({ frame, opacity = 0.04 }: { frame: number; opacity?: number }) {
  const seed = (frame * 17) % 100;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${seed}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "128px 128px",
        mixBlendMode: "overlay",
        pointerEvents: "none",
        zIndex: 51,
      }}
    />
  );
}

/** Floating gold particle dots (ambient decoration) */
function GoldParticles({ frame, count = 12 }: { frame: number; count?: number }) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: (i * 37 + 13) % 100,
      speed: 0.15 + (i * 0.07) % 0.3,
      size: 1.5 + (i % 3),
      opacity: 0.06 + (i * 0.02) % 0.12,
      delay: i * 20,
    }));
  }, [count]);

  return (
    <>
      {particles.map((p, i) => {
        const y = 100 - ((frame * p.speed + p.delay) % 120);
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: GOLD,
            opacity: p.opacity,
            filter: `blur(${p.size > 2.5 ? 1 : 0}px)`,
            pointerEvents: "none",
            zIndex: 5,
          }} />
        );
      })}
    </>
  );
}

/** Animated caption overlay -- synced to voiceover */
function CaptionOverlay({ frame, captions }: { frame: number; captions: CaptionPhrase[] }) {
  const active = captions.find((c) => frame >= c.from && frame <= c.to);
  if (!active) return null;

  const progress = (frame - active.from) / (active.to - active.from);
  const fadeIn = easeOut(frame, 0, 1, active.from, active.from + 8);
  const fadeOut = frame > active.to - 8
    ? easeOut(frame, 1, 0, active.to - 8, active.to)
    : 1;
  const opacity = fadeIn * fadeOut;
  const y = easeOut(frame, 6, 0, active.from, active.from + 10);

  const words = active.text.split(" ");
  const wordIndex = Math.floor(progress * words.length);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 40,
        left: 20,
        right: 20,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
        zIndex: 60,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "rgba(12, 18, 32, 0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: 12,
          padding: "10px 18px",
          border: "1px solid rgba(201, 168, 76, 0.15)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          maxWidth: 340,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 14,
            fontWeight: 500,
            lineHeight: 1.5,
            textAlign: "center",
            letterSpacing: "0.01em",
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              style={{
                color: i <= wordIndex ? TEXT : TEXT_SEC,
                transition: "color 0.1s",
                marginRight: 4,
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Phone Mockup (CSS-built, 3D perspective) ─────────────────────────────

/** 3D Phone mockup with CSS-rendered screen content
 *  Features: perspective tilt, dynamic island notch, screen glare,
 *  moving shadow, Ken Burns zoom/pan, subtle idle sway */
function PhoneMockupCSS({
  children,
  frame,
  delay = 0,
  kenBurns = "zoom-in",
  mockupWidth = 270,
  tiltDirection = "left",
}: {
  children: React.ReactNode;
  frame: number;
  delay?: number;
  kenBurns?: "zoom-in" | "zoom-out" | "pan-up" | "pan-down";
  mockupWidth?: number;
  tiltDirection?: "left" | "right" | "none";
}) {
  const f = frame - delay;
  const phoneHeight = mockupWidth * 2.167;
  const bezelPadding = 8;
  const borderRadius = 36;
  const screenRadius = borderRadius - bezelPadding + 2;

  // Entry animation
  const entryOpacity = easeOut(f, 0, 1, 0, 35);
  const entryY = easeOut(f, 60, 0, 0, 40);
  const entryScale = easeOut(f, 0.85, 1, 0, 40);

  // 3D perspective tilt
  const tiltSign = tiltDirection === "right" ? -1 : tiltDirection === "left" ? 1 : 0;
  const entryRotateY = easeOut(f, 18 * tiltSign, 4 * tiltSign, 0, 50);
  const entryRotateX = easeOut(f, 8, 2, 0, 50);
  const idleSway = f > 50 ? Math.sin((f - 50) * 0.012) * 1.5 * tiltSign : 0;
  const rotateY = entryRotateY + idleSway;
  const rotateX = entryRotateX + Math.sin((f - 50) * 0.015) * 0.5;

  // Ken Burns
  let kbScale = 1;
  let kbX = 0;
  let kbY = 0;
  if (kenBurns === "zoom-in") kbScale = easeInOut(f, 1, 1.04, 30, 220);
  else if (kenBurns === "zoom-out") kbScale = easeInOut(f, 1.04, 1, 30, 220);
  else if (kenBurns === "pan-up") kbY = easeInOut(f, 0, -8, 30, 220);
  else if (kenBurns === "pan-down") kbY = easeInOut(f, 0, 8, 30, 220);

  // Screen glare
  const glarePos = easeInOut(f, -30, 130, 10, 200);
  const glareOpacity = easeOut(f, 0, 1, 20, 50);

  // Dynamic shadow
  const shadowX = rotateY * -2;
  const shadowY = 20 + rotateX * 2;
  const shadowBlur = 60 + Math.abs(rotateY) * 3;

  // Glow behind phone
  const glowOpacity = easeOut(f, 0, 0.18, 15, 45);

  return (
    <div
      style={{
        opacity: entryOpacity,
        transform: `translateY(${entryY}px) scale(${entryScale})`,
        display: "flex",
        justifyContent: "center",
        position: "relative",
        perspective: 900,
      }}
    >
      {/* Glow behind phone */}
      <div
        style={{
          position: "absolute",
          width: mockupWidth + 80,
          height: phoneHeight * 0.7,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%)`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          opacity: glowOpacity,
          filter: "blur(40px)",
        }}
      />

      {/* 3D phone container */}
      <div
        style={{
          width: mockupWidth,
          transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(${kbScale}) translate(${kbX}px, ${kbY}px)`,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* Phone body */}
        <div
          style={{
            width: mockupWidth,
            borderRadius,
            background: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)",
            padding: bezelPadding,
            boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.65),
                         0 0 0 0.5px rgba(255,255,255,0.08),
                         inset 0 0 0 0.5px rgba(255,255,255,0.05)`,
            position: "relative",
          }}
        >
          {/* Side button -- power (right side) */}
          <div
            style={{
              position: "absolute",
              right: -2,
              top: mockupWidth * 0.35,
              width: 3,
              height: 28,
              borderRadius: "0 2px 2px 0",
              background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
              boxShadow: "1px 0 3px rgba(0,0,0,0.3)",
            }}
          />

          {/* Volume buttons (left side) */}
          <div
            style={{
              position: "absolute",
              left: -2,
              top: mockupWidth * 0.28,
              width: 3,
              height: 18,
              borderRadius: "2px 0 0 2px",
              background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
              boxShadow: "-1px 0 3px rgba(0,0,0,0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -2,
              top: mockupWidth * 0.37,
              width: 3,
              height: 18,
              borderRadius: "2px 0 0 2px",
              background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
              boxShadow: "-1px 0 3px rgba(0,0,0,0.3)",
            }}
          />

          {/* Screen area */}
          <div
            style={{
              borderRadius: screenRadius,
              overflow: "hidden",
              position: "relative",
              background: NAVY,
              height: mockupWidth * 2.167 - bezelPadding * 2,
            }}
          >
            {/* Screen content (children) */}
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
              {children}
            </div>

            {/* Dynamic Island / Notch */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: "50%",
                transform: "translateX(-50%)",
                width: mockupWidth * 0.32,
                height: 22,
                borderRadius: 14,
                background: "#000",
                boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                zIndex: 10,
              }}
            >
              {/* Camera dot */}
              <div
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #1a1a2e 40%, #0d0d15 100%)",
                  boxShadow: "inset 0 0 2px rgba(255,255,255,0.08)",
                }}
              />
            </div>

            {/* Screen glare */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(
                  115deg,
                  transparent ${glarePos - 20}%,
                  rgba(255,255,255,0.04) ${glarePos - 5}%,
                  rgba(255,255,255,0.08) ${glarePos}%,
                  rgba(255,255,255,0.04) ${glarePos + 5}%,
                  transparent ${glarePos + 20}%
                )`,
                opacity: glareOpacity,
                pointerEvents: "none",
                borderRadius: screenRadius,
                zIndex: 11,
              }}
            />

            {/* Subtle edge highlight on screen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: screenRadius,
                boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.06)",
                pointerEvents: "none",
                zIndex: 12,
              }}
            />
          </div>
        </div>

        {/* Reflection on surface below phone */}
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: "10%",
            right: "10%",
            height: 30,
            background: `linear-gradient(180deg, rgba(201,168,76,0.04) 0%, transparent 100%)`,
            filter: "blur(8px)",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
}

/** Status bar for phone mockup screens */
function PhoneStatusBar() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "36px 16px 6px",
    }}>
      <div style={{ fontFamily: SANS, fontSize: 9, color: TEXT_TER }}>
        9:41
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <div style={{ width: 14, height: 8, borderRadius: 2, border: `1px solid ${TEXT_TER}`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 2, borderRadius: 1, background: TEXT_TER }} />
        </div>
      </div>
    </div>
  );
}

// ── Score Color Helper ───────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return "#4CAF50";
  if (score >= 70) return GOLD;
  return "#E67E22";
}

function scoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 60) return "Developing";
  return "Needs Work";
}

// ── Scene-Specific Components ────────────────────────────────────────────

/** Scene 2: Animated score circle with colour-shifting stroke */
function AnimatedScoreCircle({ frame, targetScore }: { frame: number; targetScore: number }) {
  const displayScore = Math.round(easeOut(frame, 0, targetScore, 10, 80));
  const circumference = 2 * Math.PI * 60;
  const progress = easeOut(frame, 0, targetScore / 100, 10, 80);
  const dashOffset = circumference - (progress * circumference);
  const glowOpacity = 0.3 + 0.2 * Math.sin(frame * 0.06);

  // Colour shifts based on current display value
  const currentColor = displayScore < 40
    ? "#E53935"
    : displayScore < 70
      ? GOLD
      : "#4CAF50";

  // Label fades in after score reaches target
  const labelOpacity = easeOut(frame, 0, 1, 85, 100);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      position: "relative",
    }}>
      {/* Pulsing glow behind circle */}
      <div style={{
        position: "absolute",
        width: 180, height: 180,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${currentColor}18, transparent)`,
        opacity: glowOpacity,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        filter: "blur(20px)",
      }} />

      <div style={{ position: "relative", width: 140, height: 140 }}>
        <svg width={140} height={140} style={{ position: "absolute" }}>
          {/* Background circle */}
          <circle
            cx={70} cy={70} r={60}
            fill="none" stroke="rgba(242, 237, 230, 0.06)"
            strokeWidth={7}
          />
          {/* Score arc */}
          <circle
            cx={70} cy={70} r={60}
            fill="none" stroke={currentColor}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 70 70)"
            style={{ filter: `drop-shadow(0 0 10px ${currentColor}66)` }}
          />
        </svg>

        {/* Score number */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            fontFamily: SERIF, fontSize: 42, fontWeight: 700,
            color: currentColor, lineHeight: 1,
          }}>
            {displayScore}
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 11, color: TEXT_SEC,
            marginTop: 2,
          }}>
            / 100
          </div>
        </div>
      </div>

      {/* Label: "Excellent" */}
      <div style={{
        opacity: labelOpacity,
        marginTop: 12,
        fontFamily: SERIF, fontSize: 18, fontWeight: 600,
        color: currentColor, letterSpacing: 0.5,
      }}>
        {scoreLabel(targetScore)}
      </div>
    </div>
  );
}

/** Scene 3: Seven dimension bars with staggered fill */
function SevenDimensionBars({ frame }: { frame: number }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: 8, width: "100%", padding: "0 24px",
    }}>
      {/* Title */}
      <TextReveal frame={frame} delay={5} style={{ marginBottom: 8 }}>
        <div style={{
          fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
          textTransform: "uppercase", letterSpacing: 2.5, textAlign: "center",
        }}>
          Advocacy Dimensions
        </div>
      </TextReveal>

      {SCORE_DIMENSIONS.map((dim, i) => {
        const barDelay = 25 + i * 12;
        const opacity = easeOut(frame, 0, 1, barDelay, barDelay + 15);
        const barWidth = easeOut(frame, 0, dim.score, barDelay + 5, barDelay + 30);
        const color = scoreColor(dim.score);

        return (
          <div key={dim.label} style={{ opacity }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: 3,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Icon abbreviation */}
                <div style={{
                  fontFamily: SANS, fontSize: 8, fontWeight: 700,
                  color: NAVY, background: color,
                  borderRadius: 3, padding: "2px 4px",
                  letterSpacing: 0.5, lineHeight: 1,
                }}>
                  {dim.icon}
                </div>
                <span style={{
                  fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
                }}>
                  {dim.label}
                </span>
              </div>
              <span style={{
                fontFamily: SANS, fontSize: 11, color,
                fontWeight: 700, minWidth: 20, textAlign: "right",
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
                background: `linear-gradient(90deg, ${color}, ${color}88)`,
                borderRadius: 3,
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Scene 4: Written Feedback screen content for PhoneMockup */
function WrittenFeedbackScreen({ frame }: { frame: number }) {
  const scrollY = easeInOut(frame, 0, -60, 30, 130);

  const strengths = [
    "Strong application of case authorities",
    "Clear structure in submissions",
    "Confident court manner",
  ];
  const improvements = [
    "Develop statutory interpretation argument",
    "Manage time allocation better",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PhoneStatusBar />

      {/* Header */}
      <div style={{
        padding: "8px 16px 10px",
        borderBottom: `1px solid rgba(242, 237, 230, 0.06)`,
      }}>
        <div style={{
          fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: TEXT,
        }}>
          Written Judgment
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 8, color: TEXT_TER, marginTop: 2,
        }}>
          Constitutional Law \u2022 13 February 2026
        </div>
      </div>

      {/* Scrolling content */}
      <div style={{
        flex: 1, overflow: "hidden", position: "relative",
      }}>
        <div style={{
          transform: `translateY(${scrollY}px)`,
          padding: "12px 14px",
        }}>
          {/* Judgment text block */}
          <div style={{
            fontFamily: SANS, fontSize: 9, color: TEXT_SEC, lineHeight: 1.6,
            marginBottom: 14,
          }}>
            The Advocate demonstrated a strong grasp of the constitutional principles at issue.
            The submissions were well-structured and the authorities were applied with
            precision to the facts before the court. The overall presentation was confident
            and appropriate for the bench.
          </div>

          {/* Strengths */}
          <div style={{
            fontFamily: SANS, fontSize: 9, fontWeight: 700, color: "#4CAF50",
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
          }}>
            Strengths
          </div>
          {strengths.map((s, i) => {
            const itemDelay = 40 + i * 15;
            const itemOpacity = easeOut(frame, 0, 1, itemDelay, itemDelay + 15);
            return (
              <div key={i} style={{
                opacity: itemOpacity,
                display: "flex", alignItems: "flex-start", gap: 6,
                marginBottom: 6,
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: "rgba(76, 175, 80, 0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  <div style={{
                    fontFamily: SANS, fontSize: 8, color: "#4CAF50", fontWeight: 700,
                  }}>
                    {"\u2713"}
                  </div>
                </div>
                <div style={{
                  fontFamily: SANS, fontSize: 9, color: TEXT, lineHeight: 1.4,
                }}>
                  {s}
                </div>
              </div>
            );
          })}

          {/* Improvements */}
          <div style={{
            fontFamily: SANS, fontSize: 9, fontWeight: 700, color: GOLD,
            textTransform: "uppercase", letterSpacing: 1.5,
            marginTop: 12, marginBottom: 8,
          }}>
            Areas for Development
          </div>
          {improvements.map((s, i) => {
            const itemDelay = 85 + i * 15;
            const itemOpacity = easeOut(frame, 0, 1, itemDelay, itemDelay + 15);
            return (
              <div key={i} style={{
                opacity: itemOpacity,
                display: "flex", alignItems: "flex-start", gap: 6,
                marginBottom: 6,
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: GOLD_DIM,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: 1,
                }}>
                  <div style={{
                    fontFamily: SANS, fontSize: 8, color: GOLD, fontWeight: 700,
                  }}>
                    {"\u2192"}
                  </div>
                </div>
                <div style={{
                  fontFamily: SANS, fontSize: 9, color: TEXT, lineHeight: 1.4,
                }}>
                  {s}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom gradient */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
          background: `linear-gradient(transparent, ${NAVY})`,
        }} />
      </div>
    </div>
  );
}

/** Scene 5: Portfolio screen content for PhoneMockup */
function PortfolioScreen({ frame }: { frame: number }) {
  const stats = [
    { label: "Sessions", value: 24, suffix: "", icon: "\uD83D\uDCC5" },
    { label: "Avg Score", value: 72, suffix: "%", icon: "\u2B50" },
    { label: "Best Module", value: -1, text: "Tort Law", icon: "\uD83D\uDCD6" },
    { label: "Streak", value: 12, suffix: " days", icon: "\uD83D\uDD25" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PhoneStatusBar />

      {/* Header */}
      <div style={{
        padding: "8px 16px 12px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 5,
          background: GOLD_DIM,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10,
        }}>
          {"\uD83D\uDCC8"}
        </div>
        <div style={{
          fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: TEXT,
        }}>
          Your Portfolio
        </div>
      </div>

      {/* 2x2 stat cards */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 8,
        padding: "0 14px",
      }}>
        {stats.map((stat, i) => {
          const cardDelay = 15 + i * 12;
          const cardOpacity = easeOut(frame, 0, 1, cardDelay, cardDelay + 20);
          const cardY = easeOut(frame, 16, 0, cardDelay, cardDelay + 20);

          const displayValue = stat.value === -1
            ? 0
            : Math.round(easeOut(frame, 0, stat.value, cardDelay + 5, cardDelay + 40));

          return (
            <div key={stat.label} style={{
              opacity: cardOpacity,
              transform: `translateY(${cardY}px)`,
              width: "calc(50% - 4px)",
              background: NAVY_CARD,
              borderRadius: 10,
              padding: "14px 12px",
              border: `1px solid rgba(242, 237, 230, 0.06)`,
            }}>
              <div style={{
                fontSize: 14, marginBottom: 6,
              }}>
                {stat.icon}
              </div>
              <div style={{
                fontFamily: SERIF, fontSize: 22, fontWeight: 700,
                color: GOLD, lineHeight: 1,
              }}>
                {stat.value === -1 ? (
                  <span style={{
                    opacity: easeOut(frame, 0, 1, cardDelay + 10, cardDelay + 25),
                    fontSize: 14, fontFamily: SANS,
                  }}>
                    {stat.text}
                  </span>
                ) : (
                  <>{displayValue}{stat.suffix}</>
                )}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 8, color: TEXT_TER,
                marginTop: 4, textTransform: "uppercase", letterSpacing: 1,
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini chart placeholder */}
      <div style={{
        margin: "14px 14px 0",
        background: NAVY_CARD,
        borderRadius: 10,
        padding: "12px 14px",
        border: `1px solid rgba(242, 237, 230, 0.06)`,
      }}>
        <div style={{
          fontFamily: SANS, fontSize: 8, color: TEXT_SEC,
          textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8,
        }}>
          Score Trend
        </div>
        {/* Simplified line chart using bars */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 3, height: 30,
        }}>
          {[45, 52, 58, 55, 62, 68, 65, 72].map((v, i) => {
            const barDelay = 60 + i * 5;
            const barHeight = easeOut(frame, 0, (v / 100) * 30, barDelay, barDelay + 15);
            return (
              <div key={i} style={{
                flex: 1,
                height: barHeight,
                background: `linear-gradient(180deg, ${GOLD}, ${GOLD}44)`,
                borderRadius: 2,
              }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Scene 6: Session History scrolling cards */
function SessionHistoryCards({ frame }: { frame: number }) {
  const scrollY = easeInOut(frame, 0, -80, 20, 130);

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      width: "100%", padding: "0 20px",
      overflow: "hidden", maxHeight: 380,
      position: "relative",
    }}>
      {/* Title */}
      <TextReveal frame={frame} delay={5} style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
          textTransform: "uppercase", letterSpacing: 2.5, textAlign: "center",
        }}>
          Session History
        </div>
      </TextReveal>

      <div style={{
        transform: `translateY(${scrollY}px)`,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        {SESSION_HISTORY.map((session, i) => {
          const cardDelay = 15 + i * 10;
          const cardOpacity = easeOut(frame, 0, 1, cardDelay, cardDelay + 15);
          const cardX = easeOut(frame, 30, 0, cardDelay, cardDelay + 15);
          const barWidth = easeOut(frame, 0, session.score, cardDelay + 10, cardDelay + 30);
          const color = scoreColor(session.score);

          return (
            <div key={i} style={{
              opacity: cardOpacity,
              transform: `translateX(${cardX}px)`,
              background: NAVY_CARD,
              borderRadius: 10,
              padding: "12px 14px",
              border: `1px solid rgba(242, 237, 230, 0.06)`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              {/* Date badge */}
              <div style={{
                background: NAVY_LIGHT,
                borderRadius: 6,
                padding: "6px 8px",
                flexShrink: 0,
              }}>
                <div style={{
                  fontFamily: SANS, fontSize: 8, fontWeight: 700,
                  color: TEXT_SEC, textAlign: "center", lineHeight: 1.3,
                  whiteSpace: "nowrap",
                }}>
                  {session.date}
                </div>
              </div>

              {/* Session info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: SANS, fontSize: 10, fontWeight: 600, color: TEXT,
                  marginBottom: 2,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {session.module}
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  marginBottom: 4,
                }}>
                  <div style={{
                    fontFamily: SANS, fontSize: 7, color: TEXT_TER,
                    background: "rgba(242, 237, 230, 0.06)",
                    borderRadius: 3, padding: "1px 5px",
                  }}>
                    {session.type}
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{
                  height: 3, borderRadius: 2,
                  background: "rgba(242, 237, 230, 0.06)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${barWidth}%`, height: "100%",
                    background: `linear-gradient(90deg, ${color}, ${color}88)`,
                    borderRadius: 2,
                  }} />
                </div>
              </div>

              {/* Score */}
              <div style={{
                fontFamily: SERIF, fontSize: 16, fontWeight: 700,
                color, flexShrink: 0,
              }}>
                {Math.round(barWidth)}%
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom gradient */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 50,
        background: `linear-gradient(transparent, ${NAVY})`,
        zIndex: 5,
      }} />
    </div>
  );
}

/** Scene 7: SVG Spider/Radar chart with 7 axes */
function SkillsRadarChart({ frame }: { frame: number }) {
  const cx = 150;
  const cy = 150;
  const maxR = 100;
  const numAxes = 7;
  const angleStep = (2 * Math.PI) / numAxes;
  const startAngle = -Math.PI / 2; // Start from top

  // Animation progress: polygon expands from center
  const expandProgress = easeOut(frame, 0, 1, 15, 60);

  // Concentric rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Calculate axis endpoints
  const axisPoints = React.useMemo(() => {
    return Array.from({ length: numAxes }, (_, i) => {
      const angle = startAngle + i * angleStep;
      return {
        x: cx + Math.cos(angle) * maxR,
        y: cy + Math.sin(angle) * maxR,
        angle,
      };
    });
  }, []);

  // Calculate ring polygons
  const ringPaths = rings.map((ringScale) => {
    const points = axisPoints.map((ap) => {
      const r = maxR * ringScale;
      const x = cx + Math.cos(ap.angle) * r;
      const y = cy + Math.sin(ap.angle) * r;
      return `${x},${y}`;
    });
    return points.join(" ");
  });

  // Calculate data polygon
  const dataPoints = RADAR_VALUES.map((val, i) => {
    const r = (val / 100) * maxR * expandProgress;
    const angle = startAngle + i * angleStep;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  });
  const dataPath = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  // Label positions (slightly outside the chart)
  const labelPositions = RADAR_LABELS.map((label, i) => {
    const angle = startAngle + i * angleStep;
    const labelR = maxR + 22;
    return {
      label,
      x: cx + Math.cos(angle) * labelR,
      y: cy + Math.sin(angle) * labelR,
      angle,
    };
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
    }}>
      <TextReveal frame={frame} delay={5} style={{ marginBottom: 8 }}>
        <div style={{
          fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
          textTransform: "uppercase", letterSpacing: 2.5, textAlign: "center",
        }}>
          Advocacy Profile
        </div>
      </TextReveal>

      <div style={{ position: "relative", width: 300, height: 300 }}>
        <svg width={300} height={300} viewBox="0 0 300 300">
          {/* Concentric ring polygons */}
          {ringPaths.map((path, i) => (
            <polygon
              key={`ring-${i}`}
              points={path}
              fill="none"
              stroke="rgba(242, 237, 230, 0.06)"
              strokeWidth={0.8}
            />
          ))}

          {/* Axis lines */}
          {axisPoints.map((ap, i) => (
            <line
              key={`axis-${i}`}
              x1={cx} y1={cy}
              x2={ap.x} y2={ap.y}
              stroke="rgba(242, 237, 230, 0.06)"
              strokeWidth={0.5}
            />
          ))}

          {/* Data polygon fill */}
          <polygon
            points={dataPath}
            fill={GOLD_DIM}
            stroke={GOLD}
            strokeWidth={1.5}
            opacity={easeOut(frame, 0, 0.8, 15, 50)}
            style={{ filter: `drop-shadow(0 0 6px ${GOLD}44)` }}
          />

          {/* Vertex dots */}
          {dataPoints.map((p, i) => {
            const dotOpacity = easeOut(frame, 0, 1, 30 + i * 4, 45 + i * 4);
            return (
              <circle
                key={`dot-${i}`}
                cx={p.x} cy={p.y} r={3}
                fill={GOLD}
                opacity={dotOpacity}
                style={{ filter: `drop-shadow(0 0 4px ${GOLD}88)` }}
              />
            );
          })}
        </svg>

        {/* Labels positioned around the chart */}
        {labelPositions.map((lp, i) => {
          const labelOpacity = easeOut(frame, 0, 1, 25 + i * 5, 40 + i * 5);
          // Text alignment based on position
          const isLeft = Math.cos(lp.angle) < -0.2;
          const isRight = Math.cos(lp.angle) > 0.2;
          const textAlign = isLeft ? "right" : isRight ? "left" : "center";

          return (
            <div
              key={`label-${i}`}
              style={{
                position: "absolute",
                left: lp.x,
                top: lp.y,
                transform: "translate(-50%, -50%)",
                fontFamily: SANS,
                fontSize: 8,
                color: TEXT_SEC,
                textAlign: textAlign as "left" | "right" | "center",
                opacity: labelOpacity,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {lp.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Scene 8: Streak counter + SQE2 readiness ring */
function StreakAndReadiness({ frame }: { frame: number }) {
  const streakCount = Math.round(easeOut(frame, 0, 12, 10, 40));
  const readinessProgress = easeOut(frame, 0, 68, 10, 60);
  const readinessDisplay = Math.round(readinessProgress);

  // Conic gradient angle for readiness ring
  const conicAngle = (readinessProgress / 100) * 360;

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 30, width: "100%",
    }}>
      {/* Streak Section */}
      <TextReveal frame={frame} delay={5}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {/* Flame + number */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
          }}>
            {/* SVG flame icon */}
            <svg width={28} height={34} viewBox="0 0 24 32" fill="none">
              <path
                d="M12 0C12 0 18 8 18 16C18 20 16 24 12 28C8 24 6 20 6 16C6 8 12 0 12 0Z"
                fill="url(#flameGrad)"
                opacity={0.9 + 0.1 * Math.sin(frame * 0.1)}
              />
              <path
                d="M12 10C12 10 15 14 15 18C15 20.5 14 23 12 25C10 23 9 20.5 9 18C9 14 12 10 12 10Z"
                fill="#FFD54F"
                opacity={0.8}
              />
              <defs>
                <linearGradient id="flameGrad" x1="12" y1="0" x2="12" y2="32">
                  <stop offset="0%" stopColor="#FF6B35" />
                  <stop offset="50%" stopColor="#E53935" />
                  <stop offset="100%" stopColor={GOLD} />
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              fontFamily: SERIF, fontSize: 44, fontWeight: 700,
              color: GOLD, lineHeight: 1,
            }}>
              {streakCount}
            </div>
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 13, color: TEXT_SEC,
            marginTop: 4, letterSpacing: 0.5,
          }}>
            Day Streak
          </div>
          {/* Streak milestone bar */}
          <div style={{
            width: 120, height: 4, borderRadius: 2,
            background: "rgba(242, 237, 230, 0.06)",
            marginTop: 10, overflow: "hidden",
          }}>
            <div style={{
              width: `${easeOut(frame, 0, (12 / 30) * 100, 20, 50)}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${GOLD}, #E67E22)`,
              borderRadius: 2,
            }} />
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 8, color: TEXT_TER,
            marginTop: 4,
          }}>
            12 / 30 day milestone
          </div>
        </div>
      </TextReveal>

      {/* SQE2 Readiness Section */}
      <TextReveal frame={frame} delay={20}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
        }}>
          {/* Conic-gradient ring */}
          <div style={{
            width: 100, height: 100,
            borderRadius: "50%",
            background: `conic-gradient(
              ${GOLD} 0deg,
              ${GOLD} ${conicAngle}deg,
              rgba(242, 237, 230, 0.06) ${conicAngle}deg,
              rgba(242, 237, 230, 0.06) 360deg
            )`,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
            boxShadow: `0 0 20px ${GOLD_GLOW}`,
          }}>
            {/* Inner cutout to make it a ring */}
            <div style={{
              width: 80, height: 80,
              borderRadius: "50%",
              background: NAVY,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                fontFamily: SERIF, fontSize: 24, fontWeight: 700,
                color: GOLD, lineHeight: 1,
              }}>
                {readinessDisplay}%
              </div>
            </div>
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 13, color: TEXT_SEC,
            marginTop: 8, letterSpacing: 0.5,
          }}>
            SQE2 Ready
          </div>
        </div>
      </TextReveal>
    </div>
  );
}

/** Scene 9: Progress montage — 4 score circles in rapid succession */
function ProgressMontage({ frame }: { frame: number }) {
  const scores = [
    { target: 45, color: "#E53935" },
    { target: 62, color: "#E67E22" },
    { target: 71, color: GOLD },
    { target: 78, color: "#4CAF50" },
  ];
  const circleSize = 56;
  const circumference = 2 * Math.PI * 22;

  // Overall bar that fills from 45% to 78%
  const overallBarProgress = easeOut(frame, 45, 78, 10, 80);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 20, width: "100%",
    }}>
      {/* Score circles row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 6,
      }}>
        {scores.map((s, i) => {
          const startF = i * 20;
          const endF = startF + 20;
          const circleOpacity = i < 3
            ? interpolate(frame, [startF, startF + 8, endF - 5, endF], [0, 1, 1, 0.3], {
                extrapolateLeft: "clamp", extrapolateRight: "clamp",
              })
            : easeOut(frame, 0, 1, startF, startF + 12); // Last one stays
          const displayScore = Math.round(easeOut(frame, 0, s.target, startF + 2, endF - 2));
          const progress = easeOut(frame, 0, s.target / 100, startF + 2, endF - 2);
          const dashOffset = circumference - (progress * circumference);

          return (
            <React.Fragment key={i}>
              <div style={{
                opacity: circleOpacity,
                display: "flex", flexDirection: "column", alignItems: "center",
              }}>
                <div style={{ position: "relative", width: circleSize, height: circleSize }}>
                  <svg width={circleSize} height={circleSize}>
                    <circle
                      cx={circleSize / 2} cy={circleSize / 2} r={22}
                      fill="none" stroke="rgba(242, 237, 230, 0.06)"
                      strokeWidth={4}
                    />
                    <circle
                      cx={circleSize / 2} cy={circleSize / 2} r={22}
                      fill="none" stroke={s.color}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                    />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <div style={{
                      fontFamily: SERIF, fontSize: 16, fontWeight: 700,
                      color: s.color, lineHeight: 1,
                    }}>
                      {displayScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow between circles */}
              {i < 3 && (
                <div style={{
                  opacity: easeOut(frame, 0, 0.5, startF + 10, startF + 18),
                  fontFamily: SANS, fontSize: 12, color: TEXT_TER,
                }}>
                  {"\u2192"}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div style={{ width: 240 }}>
        <div style={{
          height: 6, borderRadius: 3,
          background: "rgba(242, 237, 230, 0.06)",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${overallBarProgress}%`, height: "100%",
            background: `linear-gradient(90deg, #E53935, #E67E22, ${GOLD}, #4CAF50)`,
            borderRadius: 3,
          }} />
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 6,
        }}>
          <span style={{
            fontFamily: SANS, fontSize: 9, color: TEXT_TER,
          }}>
            Session 1
          </span>
          <span style={{
            fontFamily: SANS, fontSize: 9, color: TEXT_TER,
          }}>
            Session 24
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Composition ─────────────────────────────────────────────────────

export const AnalyticsFeedbackVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background music — duck under VO sections
  const musicVolume = interpolate(frame,
    [0, 15, 100, 115, 235, 255, 435, 455, 585, 605, 745, 765, 895, 915, 1035, 1055, 1175, 1195, 1275, 1295, 1475, 1500],
    [0, 0.08, 0.08, 0.03, 0.03, 0.08, 0.03, 0.08, 0.03, 0.08, 0.03, 0.08, 0.03, 0.08, 0.03, 0.08, 0.03, 0.08, 0.08, 0.03, 0.03, 0.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {/* Background ambient glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 30%, rgba(30, 48, 80, 0.2), transparent)`,
      }} />

      {/* ── Background Music ── */}
      <Audio src={staticFile("audio/music/ambient-pad-60s.mp3")} volume={musicVolume} />

      {/* ── Voiceover Clips ── */}
      <Sequence from={5} durationInFrames={90} name="VO: Scene 1">
        <Audio src={staticFile("audio/voiceover/analytics/scene-01.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={120} durationInFrames={120} name="VO: Scene 2">
        <Audio src={staticFile("audio/voiceover/analytics/scene-02.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={260} durationInFrames={180} name="VO: Scene 3">
        <Audio src={staticFile("audio/voiceover/analytics/scene-03.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={460} durationInFrames={130} name="VO: Scene 4">
        <Audio src={staticFile("audio/voiceover/analytics/scene-04.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={600} durationInFrames={150} name="VO: Scene 5">
        <Audio src={staticFile("audio/voiceover/analytics/scene-05.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={770} durationInFrames={130} name="VO: Scene 6">
        <Audio src={staticFile("audio/voiceover/analytics/scene-06.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={910} durationInFrames={120} name="VO: Scene 7">
        <Audio src={staticFile("audio/voiceover/analytics/scene-07.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1050} durationInFrames={130} name="VO: Scene 8">
        <Audio src={staticFile("audio/voiceover/analytics/scene-08.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1190} durationInFrames={90} name="VO: Scene 9">
        <Audio src={staticFile("audio/voiceover/analytics/scene-09.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1310} durationInFrames={120} name="VO: Scene 10">
        <Audio src={staticFile("audio/voiceover/analytics/scene-10.mp3")} volume={0.92} />
      </Sequence>

      {/* ── SFX ── */}
      {/* Chime on score reveal (Scene 2) */}
      <Sequence from={150} durationInFrames={50}>
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.15} />
      </Sequence>
      {/* Whoosh on transitions */}
      <Sequence from={108} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={248} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={448} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={588} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={758} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={898} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={1038} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={1178} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>
      <Sequence from={1288} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 1 — Hook: "How good are you, really?"
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[0], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[0], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <GoldParticles frame={frame} count={10} />

          <TextReveal frame={localFrame(S[0], frame)} delay={5}>
            <div style={{
              fontFamily: SERIF, fontSize: 32, fontWeight: 600,
              color: GOLD, textAlign: "center", lineHeight: 1.3,
            }}>
              How good are you?
            </div>
          </TextReveal>

          <GoldLine width={80} delay={15} frame={localFrame(S[0], frame)} />

          <TextReveal frame={localFrame(S[0], frame)} delay={30}>
            <div style={{
              fontFamily: SERIF, fontSize: 24, fontWeight: 500,
              color: TEXT_SEC, textAlign: "center", lineHeight: 1.3,
              fontStyle: "italic",
            }}>
              {"\u2014 really?"}
            </div>
          </TextReveal>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 2 — Score Circle: Animating 0→78
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[1], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[1], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          {/* Subtle label above */}
          <TextReveal frame={localFrame(S[1], frame)} delay={3} style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
              textTransform: "uppercase", letterSpacing: 2.5,
            }}>
              Session Complete \u2014 Judgment Delivered
            </div>
          </TextReveal>

          <AnimatedScoreCircle frame={localFrame(S[1], frame)} targetScore={78} />
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 3 — Seven Dimensions
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[2], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[2], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <SevenDimensionBars frame={localFrame(S[2], frame)} />
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 4 — Written Feedback (Phone Mockup)
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[3], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[3], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <PhoneMockupCSS
            frame={localFrame(S[3], frame)}
            delay={0}
            kenBurns="pan-up"
            mockupWidth={240}
            tiltDirection="left"
          >
            <WrittenFeedbackScreen frame={localFrame(S[3], frame)} />
          </PhoneMockupCSS>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 5 — Portfolio Overview (Phone Mockup)
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[4], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[4], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <PhoneMockupCSS
            frame={localFrame(S[4], frame)}
            delay={0}
            kenBurns="zoom-in"
            mockupWidth={240}
            tiltDirection="right"
          >
            <PortfolioScreen frame={localFrame(S[4], frame)} />
          </PhoneMockupCSS>
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 6 — Session History
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[5], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[5], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10, padding: "0 8px",
        }}>
          <SessionHistoryCards frame={localFrame(S[5], frame)} />
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 7 — Skills Radar (Spider Chart)
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[6], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[6], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <SkillsRadarChart frame={localFrame(S[6], frame)} />
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 8 — Streak + SQE2 Readiness
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[7], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[7], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <StreakAndReadiness frame={localFrame(S[7], frame)} />
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 9 — Progress Montage
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[8], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[8], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          <ProgressMontage frame={localFrame(S[8], frame)} />
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 10 — CTA: "RATIO. See how far you can go."
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[9], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[9], frame),
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          zIndex: 10,
        }}>
          {(() => {
            const lf = localFrame(S[9], frame);
            // Gentle scale up
            const scale = easeInOut(lf, 0.95, 1.0, 0, 60);
            return (
              <div style={{
                transform: `scale(${scale})`,
                display: "flex", flexDirection: "column",
                alignItems: "center",
              }}>
                <GoldParticles frame={frame} count={14} />

                <TextReveal frame={lf} delay={5}>
                  <div style={{
                    fontFamily: SERIF, fontSize: 36, fontWeight: 700,
                    color: GOLD, letterSpacing: 3,
                  }}>
                    RATIO.
                  </div>
                </TextReveal>

                <GoldLine width={140} delay={15} frame={lf} thickness={2} />

                <TextReveal frame={lf} delay={22}>
                  <div style={{
                    fontFamily: SANS, fontSize: 16, color: TEXT_SEC,
                    textAlign: "center", lineHeight: 1.4,
                  }}>
                    See how far you can go.
                  </div>
                </TextReveal>

                <TextReveal frame={lf} delay={40}>
                  <div style={{
                    fontFamily: SANS, fontSize: 11, color: TEXT_TER,
                    marginTop: 20, letterSpacing: 0.8,
                  }}>
                    ratiothedigitalcourtsociety.com
                  </div>
                </TextReveal>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ── Overlays ── */}
      <Vignette intensity={0.45} />
      <FilmGrain frame={frame} opacity={0.025} />
      <CaptionOverlay frame={frame} captions={CAPTIONS} />
    </AbsoluteFill>
  );
};
