/**
 * RATIO. Moot Court — Cinematic Promo (73 seconds)
 *
 * Creative Direction:
 *   - Apple-style minimal pacing: let every frame breathe
 *   - Voiceover-aligned text reveals (one idea per scene)
 *   - Ken Burns slow zoom/pan on phone mockups
 *   - Gold accent animations (lines, glows, particles)
 *   - Dark navy canvas, serif headings, sans-serif body
 *   - No rush — institutional, premium, calm
 *
 * Voiceover Script (ElevenLabs — Charlie voice, natural pacing):
 *   [0–2s]    "Every advocate starts somewhere."
 *   [3–10s]   "Long before the courtroom. Before the wig, the gown…
 *              There's the work you do when nobody's watching."
 *   [10–19s]  "RATIO pairs you with an AI Judge. Four temperaments…
 *              You pick the bench."
 *   [19–29s]  "You get a genuine constitutional law brief.
 *              Real authorities, real facts, and a role."
 *   [30–39s]  "Then the session starts. You argue your case, live.
 *              And when you slip — the Judge pushes back."
 *   [39–48s]  "You distinguish the authorities. You think on your feet.
 *              It feels like standing before a real bench."
 *   [49–55s]  "When it's over, you get a proper judgment.
 *              Scored across seven dimensions of advocacy."
 *   [56–64s]  "Detailed written feedback. What worked, what didn't,
 *              and a clear sense of where to go next."
 *   [64–71s]  "RATIO. The Digital Court Society.
 *              Free for UK law students. You can start today."
 *
 * Music Direction:
 *   - Minimal piano, single notes with reverb (think Nils Frahm / Ólafur Arnalds)
 *   - Subtle low strings enter at scene 5 (court opens)
 *   - Gentle swell at scene 7 (feedback reveal)
 *   - Resolve to quiet at CTA
 *
 * Sound Design:
 *   - Soft room tone throughout
 *   - Gentle "page turn" whoosh on scene transitions
 *   - Subtle gavel tap at "court is in session" (scene 5)
 *   - Soft UI typing clicks during exchange (scene 6)
 *   - Score reveal: quiet chime
 */

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
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
const NAVY_LIGHT = "#1E3050";
const TEXT = "#F2EDE6";
const TEXT_SEC = "rgba(242, 237, 230, 0.55)";
const TEXT_TER = "rgba(242, 237, 230, 0.3)";

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// ── Scene Timeline (30fps × 73s = 2190 frames) ────────────────────────

interface Scene {
  id: string;
  /** Absolute start frame */
  start: number;
  /** Duration in frames */
  dur: number;
  /** Crossfade overlap with next scene (frames) */
  xfade: number;
}

// Timeline retimed for ElevenLabs voiceover (Charlie voice — natural pacing)
// Clip durations: 52, 205, 247, 280, 269, 271, 172, 232, 205 frames
const S: Scene[] = [
  { id: "cold-open",    start: 0,    dur: 85,   xfade: 10 }, //  0.0–2.8s   1.7s  "Every advocate starts somewhere."
  { id: "preparation",  start: 75,   dur: 240,  xfade: 10 }, //  2.5–10.5s  6.8s  "Long before the courtroom…"
  { id: "choose-judge", start: 305,  dur: 280,  xfade: 10 }, // 10.2–19.5s 8.2s  "RATIO pairs you with an AI Judge…"
  { id: "case-brief",   start: 575,  dur: 315,  xfade: 10 }, // 19.2–29.7s 9.3s  "You get a genuine brief…"
  { id: "court-opens",  start: 880,  dur: 305,  xfade: 10 }, // 29.3–39.5s 9.0s  "Then the session starts…"
  { id: "exchange",     start: 1175, dur: 305,  xfade: 10 }, // 39.2–49.3s 9.0s  "You distinguish the authorities…"
  { id: "feedback",     start: 1470, dur: 210,  xfade: 10 }, // 49.0–56.0s 5.7s  "When it's over…"
  { id: "improvement",  start: 1670, dur: 265,  xfade: 10 }, // 55.7–64.5s 7.7s  "Detailed written feedback…"
  { id: "cta",          start: 1925, dur: 265,  xfade: 0  }, // 64.2–73.0s 6.8s  "RATIO. The Digital Court Society…"
];

// ── Animation Helpers ──────────────────────────────────────────────────

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/** Smooth scene fade in/out with configurable crossfade duration */
function sceneFade(scene: Scene, frame: number): number {
  const local = frame - scene.start;
  const fadeInEnd = 25;
  const fadeOutStart = scene.dur - scene.xfade;

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

// ── Reusable Components ────────────────────────────────────────────────

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

/** 3D Phone mockup — Apple keynote style
 *  Features: perspective tilt, dynamic island notch, screen glare,
 *  moving shadow, Ken Burns zoom/pan, subtle idle sway */
function PhoneMockup({
  src,
  frame,
  delay = 0,
  kenBurns = "zoom-in",
  mockupWidth = 270,
  tiltDirection = "left",
}: {
  src: string;
  frame: number;
  delay?: number;
  kenBurns?: "zoom-in" | "zoom-out" | "pan-up" | "pan-down";
  mockupWidth?: number;
  tiltDirection?: "left" | "right" | "none";
}) {
  const f = frame - delay;
  const phoneHeight = mockupWidth * 2.167; // iPhone aspect ratio
  const bezelPadding = 8;
  const borderRadius = 36;
  const screenRadius = borderRadius - bezelPadding + 2;

  // ── Entry animation ──
  const entryOpacity = easeOut(f, 0, 1, 0, 35);
  const entryY = easeOut(f, 60, 0, 0, 40);
  const entryScale = easeOut(f, 0.85, 1, 0, 40);

  // ── 3D perspective tilt ──
  // Phone enters tilted, settles to slight angle, then subtly sways
  const tiltSign = tiltDirection === "right" ? -1 : tiltDirection === "left" ? 1 : 0;
  const entryRotateY = easeOut(f, 18 * tiltSign, 4 * tiltSign, 0, 50);
  const entryRotateX = easeOut(f, 8, 2, 0, 50);
  // Subtle idle sway after entry
  const idleSway = f > 50 ? Math.sin((f - 50) * 0.012) * 1.5 * tiltSign : 0;
  const rotateY = entryRotateY + idleSway;
  const rotateX = entryRotateX + Math.sin((f - 50) * 0.015) * 0.5;

  // ── Ken Burns ──
  let kbScale = 1;
  let kbX = 0;
  let kbY = 0;
  if (kenBurns === "zoom-in") kbScale = easeInOut(f, 1, 1.04, 30, 220);
  else if (kenBurns === "zoom-out") kbScale = easeInOut(f, 1.04, 1, 30, 220);
  else if (kenBurns === "pan-up") kbY = easeInOut(f, 0, -8, 30, 220);
  else if (kenBurns === "pan-down") kbY = easeInOut(f, 0, 8, 30, 220);

  // ── Screen glare ── moves diagonally across the screen
  const glarePos = easeInOut(f, -30, 130, 10, 200); // % position
  const glareOpacity = easeOut(f, 0, 1, 20, 50);

  // ── Dynamic shadow ── shifts with tilt
  const shadowX = rotateY * -2;
  const shadowY = 20 + rotateX * 2;
  const shadowBlur = 60 + Math.abs(rotateY) * 3;

  // ── Glow behind phone ──
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
        {/* Phone body — dark frame with bezel */}
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
          {/* Side button — power (right side) */}
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
              background: "#000",
            }}
          >
            {/* Screenshot image */}
            <Img src={src} style={{ width: "100%", display: "block" }} />

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

            {/* Screen glare — diagonal shine moving across */}
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

/** Cinematic vignette — dark radial gradient on edges */
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

/** Film grain overlay — subtle noise texture */
function FilmGrain({ frame, opacity = 0.04 }: { frame: number; opacity?: number }) {
  // Use frame-based pseudo-random offset to animate grain
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

/** Animated caption overlay — synced to voiceover */
interface CaptionPhrase {
  text: string;
  /** Start frame (absolute) */
  from: number;
  /** End frame (absolute) */
  to: number;
}

function CaptionOverlay({ frame, captions }: { frame: number; captions: CaptionPhrase[] }) {
  // Find the active caption
  const active = captions.find((c) => frame >= c.from && frame <= c.to);
  if (!active) return null;

  const progress = (frame - active.from) / (active.to - active.from);
  const fadeIn = easeOut(frame, 0, 1, active.from, active.from + 8);
  const fadeOut = frame > active.to - 8
    ? easeOut(frame, 1, 0, active.to - 8, active.to)
    : 1;
  const opacity = fadeIn * fadeOut;
  const y = easeOut(frame, 6, 0, active.from, active.from + 10);

  // Word-by-word highlight: calculate which word to highlight
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

/** Floating gold particle dots (ambient decoration) */
function GoldParticles({ frame, count = 6 }: { frame: number; count?: number }) {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const seed = i * 137.5; // golden angle distribution
    const x = (seed * 2.3) % 380;
    const baseY = (seed * 1.7) % 800;
    const drift = Math.sin((frame + seed) * 0.015) * 15;
    const opacity = interpolate(
      Math.sin((frame + seed * 3) * 0.02),
      [-1, 1],
      [0.03, 0.12],
    );
    const size = 2 + (i % 3);

    particles.push(
      <div
        key={i}
        style={{
          position: "absolute",
          left: x,
          top: baseY + drift,
          width: size,
          height: size,
          borderRadius: "50%",
          background: GOLD,
          opacity,
        }}
      />,
    );
  }
  return <>{particles}</>;
}

// ── Scene 1: Cold Open ────────────────────────────────────────────────
// VO: "Every advocate begins somewhere."
// Visual: Black → RATIO. logo fades in with gold glow

function ColdOpenScene({ frame }: { frame: number }) {
  const scene = S[0];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  // Radial glow expands slowly
  const glowSize = easeOut(local, 200, 450, 0, 120);
  const glowOpacity = easeOut(local, 0, 0.1, 10, 80);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: NAVY,
      }}
    >
      {/* Expanding gold glow */}
      <div
        style={{
          position: "absolute",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,${glowOpacity}) 0%, transparent 70%)`,
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* RATIO. logo */}
      <TextReveal frame={local} delay={15} duration={35}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: TEXT,
            textAlign: "center",
          }}
        >
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </TextReveal>

      <GoldLine width={60} delay={45} frame={local} />

      <TextReveal frame={local} delay={55} duration={30}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            color: TEXT_TER,
            textAlign: "center",
            marginTop: 4,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          The Digital Court Society
        </div>
      </TextReveal>
    </AbsoluteFill>
  );
}

// ── Scene 2: Preparation ──────────────────────────────────────────────
// VO: "Before the courtroom. Before the wig. Before the judgment.
//      There is preparation."
// Visual: Text only, staggered line reveals

function PreparationScene({ frame }: { frame: number }) {
  const scene = S[1];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 36px",
        background: NAVY,
      }}
    >
      <GoldParticles frame={frame} count={4} />

      <TextReveal frame={local} delay={10} duration={30}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            fontWeight: 600,
            color: TEXT_SEC,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Before the courtroom.
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={35} duration={30}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            fontWeight: 600,
            color: TEXT_SEC,
            textAlign: "center",
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          Before the wig.
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={60} duration={30}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            fontWeight: 600,
            color: TEXT_SEC,
            textAlign: "center",
            lineHeight: 1.5,
            marginTop: 8,
          }}
        >
          Before the judgment.
        </div>
      </TextReveal>

      <GoldLine width={40} delay={95} frame={local} />

      <TextReveal frame={local} delay={105} duration={30}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 30,
            fontWeight: 700,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.4,
            marginTop: 12,
          }}
        >
          There is{" "}
          <span style={{ color: GOLD }}>preparation</span>.
        </div>
      </TextReveal>
    </AbsoluteFill>
  );
}

// ── Scene 3: Choose Your Judge ────────────────────────────────────────
// VO: "RATIO gives you an AI Judge. Four judicial temperaments.
//      Choose the bench you wish to face."
// Visual: Phone mockup with mode selection / temperament picker

function ChooseJudgeScene({ frame }: { frame: number }) {
  const scene = S[2];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 80,
        background: NAVY,
      }}
    >
      <GoldParticles frame={frame} count={5} />

      {/* Title */}
      <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 8 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            fontWeight: 700,
            color: TEXT,
          }}
        >
          Choose Your{" "}
          <span style={{ color: GOLD }}>AI Judge</span>
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={20} duration={25} style={{ textAlign: "center", marginBottom: 4 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_SEC,
            lineHeight: 1.6,
            maxWidth: 280,
          }}
        >
          Four judicial temperaments.
          <br />
          Choose the bench you wish to face.
        </div>
      </TextReveal>

      <GoldLine width={35} delay={30} frame={local} />

      {/* Phone mockup — mode selection screen */}
      <div style={{ marginTop: 16 }}>
        <PhoneMockup
          src={staticFile("screenshots/mobile/moot-court-mobile.png")}
          frame={local}
          delay={25}
          kenBurns="zoom-in"
          mockupWidth={260}
          tiltDirection="left"
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 4: Case Brief ──────────────────────────────────────────────
// VO: "You receive a real constitutional law brief.
//      The authorities. The facts. Your role as counsel."
// Visual: Phone mockup with case brief screen

function CaseBriefScene({ frame }: { frame: number }) {
  const scene = S[3];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 80,
        background: NAVY,
      }}
    >
      <GoldParticles frame={frame} count={4} />

      <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 8 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            fontWeight: 700,
            color: TEXT,
          }}
        >
          Your <span style={{ color: GOLD }}>Case Brief</span>
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={20} duration={25} style={{ textAlign: "center", marginBottom: 4 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_SEC,
            lineHeight: 1.6,
            maxWidth: 280,
          }}
        >
          Real constitutional law scenarios.
          <br />
          The authorities. The facts. Your role as counsel.
        </div>
      </TextReveal>

      <GoldLine width={35} delay={30} frame={local} />

      <div style={{ marginTop: 16 }}>
        <PhoneMockup
          src={staticFile("screenshots/mobile/ai-briefing-case.png")}
          frame={local}
          delay={25}
          kenBurns="pan-down"
          mockupWidth={260}
          tiltDirection="right"
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 5: Court Opens ──────────────────────────────────────────────
// VO: "The court is in session. Argue your case in real time.
//      The Judge listens. The Judge challenges."
// Visual: Phone mockup with live session + Judge opening statement
// SFX: Subtle gavel tap

function CourtOpensScene({ frame }: { frame: number }) {
  const scene = S[4];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  // Flash of gold at "court is in session" moment
  const courtFlash = interpolate(local, [15, 25, 55], [0, 0.06, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 65,
        background: NAVY,
      }}
    >
      {/* Gold flash overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: GOLD,
          opacity: courtFlash,
          pointerEvents: "none",
        }}
      />

      <GoldParticles frame={frame} count={6} />

      <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 6 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 22,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: "0.03em",
            textTransform: "uppercase",
          }}
        >
          The Court is in Session
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={25} duration={25} style={{ textAlign: "center", marginBottom: 4 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_SEC,
            lineHeight: 1.6,
            maxWidth: 280,
          }}
        >
          Argue your case in real time.
          <br />
          The Judge listens. The Judge challenges.
        </div>
      </TextReveal>

      <GoldLine width={50} delay={35} frame={local} />

      <div style={{ marginTop: 12 }}>
        <PhoneMockup
          src={staticFile("screenshots/mobile/ai-session-live.png")}
          frame={local}
          delay={30}
          kenBurns="zoom-in"
          tiltDirection="left"
          mockupWidth={260}
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 6: Active Exchange ──────────────────────────────────────────
// VO: "Make your submissions. Distinguish the authorities.
//      Think on your feet — as you would before a live bench."
// Visual: Phone mockup with chat exchange

function ExchangeScene({ frame }: { frame: number }) {
  const scene = S[5];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 65,
        background: NAVY,
      }}
    >
      <GoldParticles frame={frame} count={5} />

      <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 6 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            fontWeight: 700,
            color: TEXT,
          }}
        >
          Argue Your <span style={{ color: GOLD }}>Case</span>
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={20} duration={25} style={{ textAlign: "center", marginBottom: 4 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_SEC,
            lineHeight: 1.6,
            maxWidth: 290,
          }}
        >
          Make your submissions. Distinguish the authorities.
          <br />
          Think on your feet.
        </div>
      </TextReveal>

      <GoldLine width={35} delay={30} frame={local} />

      <div style={{ marginTop: 12 }}>
        <PhoneMockup
          src={staticFile("screenshots/mobile/ai-session-exchange.png")}
          frame={local}
          delay={25}
          tiltDirection="right"
          kenBurns="pan-up"
          mockupWidth={260}
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 7: Feedback / Judgment ──────────────────────────────────────
// VO: "When the session ends, you receive your judgment.
//      Scored across seven dimensions of advocacy."
// Visual: Phone mockup with score circle + breakdown

function FeedbackScene({ frame }: { frame: number }) {
  const scene = S[6];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 65,
        background: NAVY,
      }}
    >
      <GoldParticles frame={frame} count={5} />

      <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 6 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 26,
            fontWeight: 700,
            color: TEXT,
          }}
        >
          Your <span style={{ color: GOLD }}>Judgment</span>
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={20} duration={25} style={{ textAlign: "center", marginBottom: 4 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_SEC,
            lineHeight: 1.6,
            maxWidth: 290,
          }}
        >
          Scored across seven dimensions of advocacy.
          <br />
          Know exactly where you stand.
        </div>
      </TextReveal>

      <GoldLine width={35} delay={30} frame={local} />

      <div style={{ marginTop: 12 }}>
        <PhoneMockup
          src={staticFile("screenshots/mobile/ai-feedback-score.png")}
          frame={local}
          tiltDirection="left"
          delay={25}
          kenBurns="zoom-in"
          mockupWidth={260}
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 8: Key Improvement ──────────────────────────────────────────
// VO: "Written feedback. Key improvements.
//      A clear path to becoming the advocate you intend to be."
// Visual: Phone mockup with judgment details

function ImprovementScene({ frame }: { frame: number }) {
  const scene = S[7];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 65,
        background: NAVY,
      }}
    >
      <GoldParticles frame={frame} count={4} />

      <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 6 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 24,
            fontWeight: 700,
            color: TEXT,
            lineHeight: 1.3,
          }}
        >
          Written Feedback.
          <br />
          <span style={{ color: GOLD }}>Key Improvements.</span>
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={25} duration={25} style={{ textAlign: "center", marginBottom: 4 }}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_SEC,
            lineHeight: 1.6,
            maxWidth: 290,
          }}
        >
          A clear path to becoming
          <br />
          the advocate you intend to be.
        </div>
      </TextReveal>

      <GoldLine width={35} delay={35} frame={local} />

      <div style={{ marginTop: 12 }}>
        <PhoneMockup
          src={staticFile("screenshots/mobile/ai-feedback-judgment.png")}
          frame={local}
          tiltDirection="right"
          delay={30}
          kenBurns="pan-down"
          mockupWidth={260}
        />
      </div>
    </AbsoluteFill>
  );
}

// ── Scene 9: CTA ──────────────────────────────────────────────────────
// VO: "RATIO. The Digital Court Society.
//      Free for UK law students. Start practice today."
// Visual: Logo, tagline, gold CTA button, URL

function CTAScene({ frame }: { frame: number }) {
  const scene = S[8];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  // Pulsing gold glow behind CTA
  const glowPulse = interpolate(
    Math.sin(local * 0.04),
    [-1, 1],
    [0.06, 0.14],
  );
  const glowSize = easeOut(local, 250, 400, 10, 80);

  // CTA button subtle pulse
  const btnScale = interpolate(
    Math.sin(local * 0.06),
    [-1, 1],
    [0.98, 1.02],
  );

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 32px",
        background: NAVY,
      }}
    >
      {/* Pulsing gold radial */}
      <div
        style={{
          position: "absolute",
          width: glowSize,
          height: glowSize,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,${glowPulse}) 0%, transparent 70%)`,
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <GoldParticles frame={frame} count={8} />

      {/* Logo */}
      <TextReveal frame={local} delay={10} duration={35}>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: TEXT,
            textAlign: "center",
          }}
        >
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </TextReveal>

      <GoldLine width={60} delay={35} frame={local} />

      {/* Tagline */}
      <TextReveal frame={local} delay={45} duration={30}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 14,
            color: TEXT_SEC,
            textAlign: "center",
            marginTop: 12,
            lineHeight: 1.7,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          The Digital Court Society
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={65} duration={30}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: TEXT_SEC,
            textAlign: "center",
            marginTop: 20,
            lineHeight: 1.7,
            maxWidth: 260,
          }}
        >
          Free for UK law students.
          <br />
          Train with AI. Score your advocacy.
        </div>
      </TextReveal>

      {/* CTA Button */}
      <TextReveal frame={local} delay={90} duration={30}>
        <div
          style={{
            marginTop: 32,
            padding: "15px 40px",
            borderRadius: 14,
            background: `linear-gradient(135deg, ${GOLD}, #B8943F)`,
            color: NAVY,
            fontFamily: SANS,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.03em",
            transform: `scale(${btnScale})`,
            boxShadow: `0 8px 30px rgba(201,168,76,0.25)`,
          }}
        >
          Start Practice
        </div>
      </TextReveal>

      {/* URL */}
      <TextReveal frame={local} delay={115} duration={25}>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 11,
            color: `rgba(201,168,76,0.5)`,
            textAlign: "center",
            marginTop: 20,
            letterSpacing: "0.02em",
          }}
        >
          ratiothedigitalcourtsociety.com
        </div>
      </TextReveal>
    </AbsoluteFill>
  );
}

// ── Main Composition ──────────────────────────────────────────────────

// ── Caption Data — synced to voiceover phrases ──────────────────────────

const CINEMATIC_CAPTIONS: CaptionPhrase[] = [
  // Scene 1 (VO: frame 8, 52f → ends 60)
  { text: "Every advocate starts somewhere.", from: 8, to: 60 },

  // Scene 2 (VO: frame 83, 205f → ends 288)
  { text: "Long before the courtroom.", from: 83, to: 145 },
  { text: "Before the wig, the gown, any of it.", from: 150, to: 225 },
  { text: "There's the work you do when nobody's watching.", from: 230, to: 288 },

  // Scene 3 (VO: frame 313, 247f → ends 560)
  { text: "RATIO pairs you with an AI Judge.", from: 313, to: 390 },
  { text: "Four temperaments — strict, Socratic, pragmatic, or standard.", from: 395, to: 500 },
  { text: "You pick the bench.", from: 505, to: 560 },

  // Scene 4 (VO: frame 583, 280f → ends 863)
  { text: "You get a genuine constitutional law brief.", from: 583, to: 680 },
  { text: "Real authorities, real facts,", from: 685, to: 770 },
  { text: "and a role — whichever suits you.", from: 775, to: 863 },

  // Scene 5 (VO: frame 888, 269f → ends 1157)
  { text: "Then the session starts.", from: 888, to: 958 },
  { text: "You argue your case, live, in real time.", from: 963, to: 1060 },
  { text: "And when you slip — the Judge pushes back.", from: 1065, to: 1157 },

  // Scene 6 (VO: frame 1183, 271f → ends 1454)
  { text: "You distinguish the authorities.", from: 1183, to: 1260 },
  { text: "You think on your feet.", from: 1265, to: 1340 },
  { text: "It feels like standing before a real bench.", from: 1345, to: 1454 },

  // Scene 7 (VO: frame 1478, 172f → ends 1650)
  { text: "When it's over, you get a proper judgment.", from: 1478, to: 1564 },
  { text: "Scored across seven dimensions of advocacy.", from: 1569, to: 1650 },

  // Scene 8 (VO: frame 1678, 232f → ends 1910)
  { text: "Detailed written feedback.", from: 1678, to: 1748 },
  { text: "What worked, what didn't,", from: 1753, to: 1823 },
  { text: "and a clear sense of where to go next.", from: 1828, to: 1910 },

  // Scene 9 (VO: frame 1933, 205f → ends 2138)
  { text: "RATIO. The Digital Court Society.", from: 1933, to: 2010 },
  { text: "It's free for UK law students.", from: 2015, to: 2075 },
  { text: "You can start today.", from: 2080, to: 2138 },
];

export const MootCourtCinematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Progress bar only shows after intro
  const progressOpacity = easeOut(frame, 0, 0.5, 150, 180);
  const progressWidth = (frame / durationInFrames) * 100;

  // Background music volume: starts quiet, builds slightly, resolves at CTA
  const musicVolume = interpolate(
    frame,
    [0,     30,   880,   1470,  1925,  2100,  2180],
    [0,     0.08, 0.10,  0.12,  0.10,  0.06,  0.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* Subtle gradient overlay — always present */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)`,
        }}
      />

      {/* ── Background Music ── */}
      <Audio
        src={staticFile("audio/music/ambient-pad-75s.mp3")}
        volume={musicVolume}
        startFrom={0}
      />

      {/* ── Courtroom Ambiance ── continuous room tone throughout */}
      <Audio src={staticFile("audio/sfx/courtroom-tone.mp3")} volume={0.12} />

      {/* Courtroom murmur — fades in at start, out before court opens */}
      <Sequence from={0} durationInFrames={300}>
        <Audio src={staticFile("audio/sfx/courtroom-murmur.mp3")} volume={0.10} />
      </Sequence>

      {/* ── Sound Effects ── */}
      {/* Scene transition whooshes — barely perceptible */}
      {[70, 300, 570, 875, 1170, 1465, 1665, 1920].map((f) => (
        <Sequence key={`whoosh-${f}`} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
        </Sequence>
      ))}

      {/* Gavel tap (wood) at "court opens" */}
      <Sequence from={885} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/gavel-wood.mp3")} volume={0.40} />
      </Sequence>

      {/* Paper shuffle at case brief */}
      <Sequence from={585} durationInFrames={25}>
        <Audio src={staticFile("audio/sfx/paper-shuffle.mp3")} volume={0.15} />
      </Sequence>

      {/* Door close at cold open — setting the scene */}
      <Sequence from={3} durationInFrames={45}>
        <Audio src={staticFile("audio/sfx/door-close.mp3")} volume={0.12} />
      </Sequence>

      {/* Chime at feedback reveal */}
      <Sequence from={1475} durationInFrames={45}>
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.15} />
      </Sequence>

      {/* ── Voiceover (ElevenLabs — Charlie, British male) ── */}
      <Sequence from={8} durationInFrames={52}>
        <Audio src={staticFile("audio/voiceover/cinematic-01-cold-open.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={83} durationInFrames={205}>
        <Audio src={staticFile("audio/voiceover/cinematic-02-preparation.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={313} durationInFrames={247}>
        <Audio src={staticFile("audio/voiceover/cinematic-03-choose-judge.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={583} durationInFrames={280}>
        <Audio src={staticFile("audio/voiceover/cinematic-04-case-brief.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={888} durationInFrames={269}>
        <Audio src={staticFile("audio/voiceover/cinematic-05-court-opens.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1183} durationInFrames={271}>
        <Audio src={staticFile("audio/voiceover/cinematic-06-exchange.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1478} durationInFrames={172}>
        <Audio src={staticFile("audio/voiceover/cinematic-07-feedback.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1678} durationInFrames={232}>
        <Audio src={staticFile("audio/voiceover/cinematic-08-improvement.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1933} durationInFrames={205}>
        <Audio src={staticFile("audio/voiceover/cinematic-09-cta.mp3")} volume={0.92} />
      </Sequence>

      {/* Scenes — layered, crossfading */}
      <ColdOpenScene frame={frame} />
      <PreparationScene frame={frame} />
      <ChooseJudgeScene frame={frame} />
      <CaseBriefScene frame={frame} />
      <CourtOpensScene frame={frame} />
      <ExchangeScene frame={frame} />
      <FeedbackScene frame={frame} />
      <ImprovementScene frame={frame} />
      <CTAScene frame={frame} />

      {/* ── Animated Captions ── */}
      <CaptionOverlay frame={frame} captions={CINEMATIC_CAPTIONS} />

      {/* ── Cinematic overlays ── */}
      <Vignette intensity={0.55} />
      <FilmGrain frame={frame} opacity={0.03} />

      {/* Bottom progress bar — thin gold line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 2,
          background: `linear-gradient(90deg, ${GOLD}, rgba(201,168,76,0.3))`,
          width: `${progressWidth}%`,
          opacity: progressOpacity,
          zIndex: 55,
        }}
      />
    </AbsoluteFill>
  );
};
