/**
 * RATIO. AI Judge Promo Video (~55 seconds)
 *
 * Creative Direction:
 *   - Apple-style minimal pacing: let every frame breathe
 *   - Voiceover-aligned text reveals (one idea per scene)
 *   - CSS-built phone mockups with 3D perspective and Ken Burns
 *   - Gold accent animations (lines, glows, particles)
 *   - Dark navy canvas, serif headings, sans-serif body
 *   - Institutional, premium, calm
 *
 * Voiceover Script (10 scenes, ~55s):
 *   [1] "What if you could face a High Court judge"
 *   [2] "whenever you wanted?"
 *   [3] "RATIO puts a courtroom in your pocket."
 *   [4] "Twenty four seven. No scheduling. No waiting. Practice on your terms."
 *   [5] "Choose a module. Receive a realistic case brief."
 *   [6] "Stand before the judge. Present your argument. Face real interventions."
 *   [7] "Four judicial temperaments. Each one challenges you differently."
 *   [8] "Instant, detailed feedback across seven dimensions of advocacy."
 *   [9] "Know exactly what you did well and where to sharpen."
 *   [10] "RATIO. Your courtroom is always open."
 *
 * Scene Timeline (30fps x 55s = 1650 frames)
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

// ── Scene Timeline (30fps x 55s = 1650 frames) ──────────────────────────

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
  { id: "cold-open",       start: 0,    dur: 120,  xfade: 10 },
  { id: "reveal",          start: 110,  dur: 120,  xfade: 10 },
  { id: "phone-mockup",    start: 220,  dur: 150,  xfade: 10 },
  { id: "twenty-four-seven", start: 360, dur: 150, xfade: 10 },
  { id: "case-brief",      start: 500,  dur: 150,  xfade: 10 },
  { id: "courtroom-chat",  start: 640,  dur: 210,  xfade: 10 },
  { id: "judge-personas",  start: 840,  dur: 150,  xfade: 10 },
  { id: "score-reveal",    start: 980,  dur: 180,  xfade: 10 },
  { id: "strengths",       start: 1150, dur: 150,  xfade: 10 },
  { id: "cta",             start: 1290, dur: 360,  xfade: 0  },
];

// ── Feedback Dimensions ─────────────────────────────────────────────────

const SCORE_DIMENSIONS = [
  { label: "Argument Structure", score: 78 },
  { label: "Use of Authorities", score: 82 },
  { label: "Oral Delivery", score: 65 },
  { label: "Response to Interventions", score: 70 },
  { label: "Court Manner", score: 85 },
  { label: "Persuasiveness", score: 68 },
  { label: "Time Management", score: 72 },
];

// ── Animation Helpers ───────────────────────────────────────────────────

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

// ── Reusable Components ─────────────────────────────────────────────────

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
interface CaptionPhrase {
  text: string;
  /** Start frame (absolute) */
  from: number;
  /** End frame (absolute) */
  to: number;
}

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

// ── Phone Screen Content Components ──────────────────────────────────────

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

/** Moot Court screen content for phone mockup */
function MootCourtScreenContent({ frame }: { frame: number }) {
  const modules = [
    { name: "Constitutional Law", highlighted: true },
    { name: "Criminal Law", highlighted: false },
    { name: "Tort Law", highlighted: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PhoneStatusBar />

      {/* Header */}
      <div style={{
        padding: "10px 16px 8px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{
          width: 24, height: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14,
        }}>
          {"\u2696\uFE0F"}
        </div>
        <div style={{
          fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: TEXT,
        }}>
          Moot Court
        </div>
      </div>

      {/* Subtitle */}
      <div style={{
        padding: "0 16px 12px",
        fontFamily: SANS, fontSize: 9, color: TEXT_SEC,
      }}>
        Select a module to begin your session
      </div>

      {/* Module cards */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {modules.map((mod, i) => {
          const cardDelay = 15 + i * 10;
          const cardOpacity = easeOut(frame, 0, 1, cardDelay, cardDelay + 15);
          const cardY = easeOut(frame, 12, 0, cardDelay, cardDelay + 15);

          return (
            <div key={mod.name} style={{
              opacity: cardOpacity,
              transform: `translateY(${cardY}px)`,
              background: mod.highlighted
                ? `linear-gradient(135deg, rgba(201,168,76,0.12), ${NAVY_CARD})`
                : NAVY_CARD,
              borderRadius: 10,
              padding: "12px 14px",
              border: mod.highlighted
                ? `1px solid rgba(201,168,76,0.3)`
                : `1px solid rgba(242,237,230,0.06)`,
            }}>
              <div style={{
                fontFamily: SANS, fontSize: 10, fontWeight: 600,
                color: mod.highlighted ? GOLD : TEXT,
              }}>
                {mod.name}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 8, color: TEXT_TER, marginTop: 3,
              }}>
                {mod.highlighted ? "12 case briefs available" : "Coming soon"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Begin Session button */}
      <div style={{ padding: "16px 16px", marginTop: "auto" }}>
        <div style={{
          opacity: easeOut(frame, 0, 1, 50, 65),
          background: `linear-gradient(135deg, ${GOLD}, #B8973F)`,
          borderRadius: 10,
          padding: "10px 0",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 700, color: NAVY,
          }}>
            Begin Session
          </div>
        </div>
      </div>
    </div>
  );
}

/** Case brief screen content for phone mockup */
function CaseBriefScreenContent({ frame }: { frame: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PhoneStatusBar />

      {/* Header */}
      <div style={{
        padding: "10px 16px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <div style={{
          fontSize: 12, color: TEXT_SEC,
        }}>
          {"\u2190"}
        </div>
        <div style={{
          fontFamily: SERIF, fontSize: 14, fontWeight: 700, color: TEXT,
        }}>
          Case Brief
        </div>
      </div>

      {/* Case brief card */}
      <div style={{ padding: "0 16px" }}>
        <div style={{
          opacity: easeOut(frame, 0, 1, 10, 25),
          transform: `translateX(${easeOut(frame, 30, 0, 10, 25)}px)`,
          background: `linear-gradient(135deg, rgba(201,168,76,0.08), ${NAVY_CARD})`,
          borderRadius: 12,
          padding: "14px 14px",
          border: `1px solid rgba(201,168,76,0.2)`,
        }}>
          {/* Module tag */}
          <div style={{
            display: "inline-block",
            background: GOLD_DIM,
            borderRadius: 6,
            padding: "3px 8px",
            marginBottom: 8,
          }}>
            <div style={{
              fontFamily: SANS, fontSize: 8, fontWeight: 600, color: GOLD,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>
              Constitutional Law
            </div>
          </div>

          {/* Case title */}
          <div style={{
            fontFamily: SERIF, fontSize: 13, fontWeight: 700, color: TEXT,
            lineHeight: 1.3, marginBottom: 6,
          }}>
            R (Miller) v Secretary of State for Exiting the EU
          </div>

          {/* Role */}
          <div style={{
            fontFamily: SANS, fontSize: 9, color: GOLD, marginBottom: 8,
            fontWeight: 600,
          }}>
            Your role: Counsel for the Appellant
          </div>

          {/* Brief summary */}
          <div style={{
            fontFamily: SANS, fontSize: 8.5, color: TEXT_SEC, lineHeight: 1.5,
          }}>
            The appellant challenges the Government's use of prerogative power to trigger Article 50
            without parliamentary approval. You must argue that the European Communities Act 1972
            created statutory rights that cannot be removed by executive action alone.
          </div>
        </div>
      </div>

      {/* Begin Session button */}
      <div style={{ padding: "16px 16px", marginTop: "auto" }}>
        <div style={{
          opacity: easeOut(frame, 0, 1, 40, 55),
          background: `linear-gradient(135deg, ${GOLD}, #B8973F)`,
          borderRadius: 10,
          padding: "10px 0",
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 700, color: NAVY,
          }}>
            Begin Session
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Chat UI Components ──────────────────────────────────────────────────

/** Courtroom session header bar */
function CourtroomHeader({ frame }: { frame: number }) {
  const opacity = easeOut(frame, 0, 1, 0, 20);
  const dotOpacity = 0.5 + 0.5 * Math.sin(frame * 0.08);

  return (
    <div style={{
      opacity,
      padding: "8px 12px 6px",
      borderBottom: `1px solid rgba(201, 168, 76, 0.15)`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `linear-gradient(135deg, ${GOLD}, #B8973F)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13,
          boxShadow: `0 0 8px rgba(201, 168, 76, 0.25)`,
        }}>
          {"\u2696\uFE0F"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: SERIF, fontSize: 10, color: TEXT, fontWeight: 600,
          }}>
            The Honourable Justice AI
          </div>
          <div style={{
            fontFamily: SANS, fontSize: 7.5, color: TEXT_SEC,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#4CAF50",
              opacity: dotOpacity,
              boxShadow: "0 0 4px rgba(76, 175, 80, 0.5)",
            }} />
            Session in Progress
          </div>
        </div>
      </div>
    </div>
  );
}

/** Typing indicator -- three pulsing dots */
function TypingIndicator({ frame, isJudge }: { frame: number; isJudge: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: isJudge ? "flex-start" : "flex-end",
      padding: "0 12px", marginBottom: 4,
    }}>
      <div style={{
        background: isJudge
          ? `linear-gradient(135deg, rgba(201, 168, 76, 0.08), ${NAVY_CARD})`
          : NAVY_CARD,
        borderRadius: 10,
        padding: "7px 12px",
        borderLeft: isJudge ? `2px solid ${GOLD}` : "none",
        borderRight: !isJudge ? `2px solid ${NAVY_LIGHT}` : "none",
        display: "flex", gap: 3, alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => {
          const delay = i * 6;
          const dotOpacity = 0.3 + 0.7 * Math.abs(Math.sin((frame + delay) * 0.12));
          const y = Math.sin((frame + delay) * 0.12) * 2;
          return (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: "50%",
              background: isJudge ? GOLD : TEXT_SEC,
              opacity: dotOpacity,
              transform: `translateY(${y}px)`,
            }} />
          );
        })}
      </div>
    </div>
  );
}

/** Chat bubble with typewriter text */
function ChatBubbleInline({
  text,
  isJudge,
  frame,
  typingStart,
  messageStart,
  charsPerFrame = 2.5,
  label,
}: {
  text: string;
  isJudge: boolean;
  frame: number;
  typingStart: number;
  messageStart: number;
  charsPerFrame?: number;
  label: string;
}) {
  if (frame < typingStart) return null;

  const isTyping = frame >= typingStart && frame < messageStart;

  if (isTyping) {
    return <TypingIndicator frame={frame} isJudge={isJudge} />;
  }

  const revealFrame = frame - messageStart;
  const opacity = easeOut(revealFrame, 0, 1, 0, 12);
  const slideY = easeOut(revealFrame, 8, 0, 0, 12);

  const totalChars = text.length;
  const visibleChars = Math.min(totalChars, Math.floor(revealFrame * charsPerFrame));
  const displayText = text.slice(0, visibleChars);
  const isStillTyping = visibleChars < totalChars;

  return (
    <div style={{
      opacity,
      transform: `translateY(${slideY}px)`,
      display: "flex", justifyContent: isJudge ? "flex-start" : "flex-end",
      padding: "0 12px", marginBottom: 6,
    }}>
      <div style={{
        maxWidth: "88%",
        background: isJudge
          ? `linear-gradient(135deg, rgba(201, 168, 76, 0.06), ${NAVY_CARD})`
          : NAVY_CARD,
        borderRadius: 10,
        padding: "8px 10px",
        borderLeft: isJudge ? `2px solid ${GOLD}` : "none",
        borderRight: !isJudge ? `2px solid ${NAVY_LIGHT}` : "none",
      }}>
        <div style={{
          fontFamily: isJudge ? SERIF : SANS,
          fontSize: 7.5, color: isJudge ? GOLD : TEXT_SEC,
          fontWeight: 600, marginBottom: 3,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: SANS, fontSize: 8.5, color: TEXT,
          lineHeight: 1.5,
        }}>
          {displayText}
          {isStillTyping && (
            <span style={{
              display: "inline-block", width: 1.5, height: 10,
              background: isJudge ? GOLD : TEXT_SEC,
              marginLeft: 1, verticalAlign: "middle",
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

// ── Caption Data ────────────────────────────────────────────────────────

const CAPTIONS: CaptionPhrase[] = [
  { text: "What if you could face a High Court judge", from: 5, to: 100 },
  { text: "whenever you wanted?", from: 115, to: 210 },
  { text: "RATIO puts a courtroom in your pocket.", from: 225, to: 350 },
  { text: "Twenty four seven. No scheduling. No waiting.", from: 365, to: 440 },
  { text: "Practice on your terms.", from: 442, to: 500 },
  { text: "Choose a module. Receive a realistic case brief.", from: 510, to: 630 },
  { text: "Stand before the judge. Present your argument.", from: 645, to: 745 },
  { text: "Face real interventions.", from: 748, to: 830 },
  { text: "Four judicial temperaments.", from: 845, to: 925 },
  { text: "Each one challenges you differently.", from: 928, to: 980 },
  { text: "Instant, detailed feedback across seven dimensions.", from: 990, to: 1100 },
  { text: "Know exactly what you did well", from: 1155, to: 1220 },
  { text: "and where to sharpen.", from: 1223, to: 1280 },
  { text: "RATIO. Your courtroom is always open.", from: 1310, to: 1500 },
];

// ── Main Composition ────────────────────────────────────────────────────

export const AIJudgeVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Background music volume: duck under VO sections
  const musicVolume = interpolate(
    frame,
    [0, 20, 40, 1280, 1310, 1600, 1645],
    [0, 0.08, 0.04, 0.04, 0.06, 0.06, 0.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* Subtle gradient overlay -- always present */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)`,
        }}
      />

      {/* ── Background Music ── */}
      <Audio
        src={staticFile("audio/music/ambient-pad-60s.mp3")}
        volume={musicVolume}
      />

      {/* ── Voiceover Clips ── */}
      <Sequence from={5} durationInFrames={100} name="VO: Scene 01">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-01.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={115} durationInFrames={95} name="VO: Scene 02">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-02.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={225} durationInFrames={130} name="VO: Scene 03">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-03.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={365} durationInFrames={140} name="VO: Scene 04">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-04.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={510} durationInFrames={130} name="VO: Scene 05">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-05.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={645} durationInFrames={190} name="VO: Scene 06">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-06.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={845} durationInFrames={135} name="VO: Scene 07">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-07.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={990} durationInFrames={160} name="VO: Scene 08">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-08.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1155} durationInFrames={125} name="VO: Scene 09">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-09.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1310} durationInFrames={190} name="VO: Scene 10">
        <Audio src={staticFile("audio/voiceover/ai-judge/scene-10.mp3")} volume={0.92} />
      </Sequence>

      {/* ── SFX ── */}
      {/* Gavel wood knock at cold open */}
      <Sequence from={0} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx/gavel-wood.mp3")} volume={0.3} />
      </Sequence>
      {/* Chime on score reveal */}
      <Sequence from={990} durationInFrames={50}>
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.15} />
      </Sequence>
      {/* Whooshes on scene transitions */}
      {[108, 218, 358, 498, 638, 838, 978, 1148, 1288].map((f) => (
        <Sequence key={`whoosh-${f}`} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
        </Sequence>
      ))}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 1 — Cold Open
          "What if you could face a High Court judge"
          Gold gavel emoji fades in center with radial glow
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[0], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[0], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[0], frame);

            // Gavel scale animation
            const gavelScale = easeOut(local, 0.6, 1, 10, 50);
            const gavelOpacity = easeOut(local, 0, 1, 5, 35);

            // Pulsing radial gold glow
            const glowSize = easeOut(local, 150, 350, 5, 80);
            const glowPulse = 0.08 + 0.04 * Math.sin(local * 0.05);

            return (
              <>
                {/* Pulsing gold glow behind gavel */}
                <div style={{
                  position: "absolute",
                  width: glowSize,
                  height: glowSize,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(201,168,76,${glowPulse}) 0%, transparent 70%)`,
                  top: "45%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }} />

                {/* Gold gavel emoji */}
                <div style={{
                  opacity: gavelOpacity,
                  transform: `scale(${gavelScale})`,
                  fontSize: 72,
                  textAlign: "center",
                  filter: "drop-shadow(0 0 20px rgba(201,168,76,0.3))",
                }}>
                  {"\u2696\uFE0F"}
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 2 — Reveal
          "...whenever you wanted?"
          Large serif text reveal with gold shimmer
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[1], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[1], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 36px",
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[1], frame);

            return (
              <>
                <GoldParticles frame={frame} count={8} />

                <TextReveal frame={local} delay={10} duration={30}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 34,
                    fontWeight: 700,
                    color: TEXT,
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}>
                    ...whenever you{" "}
                    <span style={{ color: GOLD }}>wanted</span>?
                  </div>
                </TextReveal>

                <GoldLine width={80} delay={30} frame={local} thickness={2} />

                <TextReveal frame={local} delay={45} duration={25}>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    color: TEXT_SEC,
                    textAlign: "center",
                    marginTop: 8,
                  }}>
                    No courtroom needed. Just your phone.
                  </div>
                </TextReveal>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 3 — Phone Mockup
          "RATIO puts a courtroom in your pocket."
          CSS-built phone showing Moot Court screen
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[2], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[2], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 60,
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[2], frame);

            return (
              <>
                <GoldParticles frame={frame} count={6} />

                <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 8 }}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT,
                  }}>
                    A Courtroom in Your{" "}
                    <span style={{ color: GOLD }}>Pocket</span>
                  </div>
                </TextReveal>

                <GoldLine width={35} delay={15} frame={local} />

                <div style={{ marginTop: 10 }}>
                  <PhoneMockupCSS
                    frame={local}
                    delay={15}
                    kenBurns="zoom-in"
                    mockupWidth={240}
                    tiltDirection="left"
                  >
                    <MootCourtScreenContent frame={Math.max(0, local - 15)} />
                  </PhoneMockupCSS>
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 4 — 24/7 Badge
          "Twenty four seven. No scheduling. No waiting."
          Clock animation, huge 24/7 text
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[3], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[3], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 36px",
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[3], frame);

            // Clock hand rotation
            const hourRotation = easeOut(local, 0, 720, 0, 60);
            const minuteRotation = easeOut(local, 0, 360 * 4, 0, 60);
            const clockOpacity = easeOut(local, 0, 1, 0, 25);
            const clockScale = easeOut(local, 0.7, 1, 0, 30);

            return (
              <>
                <GoldParticles frame={frame} count={10} />

                {/* Clock SVG */}
                <div style={{
                  opacity: clockOpacity,
                  transform: `scale(${clockScale})`,
                  marginBottom: 20,
                }}>
                  <svg width={80} height={80} viewBox="0 0 80 80">
                    {/* Clock face */}
                    <circle cx={40} cy={40} r={36} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.4} />
                    <circle cx={40} cy={40} r={2} fill={GOLD} />
                    {/* Hour markers */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
                      const angle = (h * 30 - 90) * (Math.PI / 180);
                      const x1 = 40 + Math.cos(angle) * 30;
                      const y1 = 40 + Math.sin(angle) * 30;
                      const x2 = 40 + Math.cos(angle) * 34;
                      const y2 = 40 + Math.sin(angle) * 34;
                      return (
                        <line key={h} x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke={GOLD} strokeWidth={1.5} opacity={0.5}
                        />
                      );
                    })}
                    {/* Hour hand */}
                    <line
                      x1={40} y1={40}
                      x2={40 + Math.cos((hourRotation - 90) * Math.PI / 180) * 18}
                      y2={40 + Math.sin((hourRotation - 90) * Math.PI / 180) * 18}
                      stroke={GOLD} strokeWidth={2.5} strokeLinecap="round"
                    />
                    {/* Minute hand */}
                    <line
                      x1={40} y1={40}
                      x2={40 + Math.cos((minuteRotation - 90) * Math.PI / 180) * 26}
                      y2={40 + Math.sin((minuteRotation - 90) * Math.PI / 180) * 26}
                      stroke={TEXT} strokeWidth={1.5} strokeLinecap="round" opacity={0.7}
                    />
                  </svg>
                </div>

                {/* 24/7 text */}
                <TextReveal frame={local} delay={15} duration={25}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 48,
                    fontWeight: 700,
                    color: GOLD,
                    textAlign: "center",
                    letterSpacing: "0.08em",
                  }}>
                    24/7
                  </div>
                </TextReveal>

                <TextReveal frame={local} delay={30} duration={25}>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: 14,
                    color: TEXT_SEC,
                    textAlign: "center",
                    marginTop: 12,
                    lineHeight: 1.6,
                  }}>
                    No scheduling. No waiting.
                  </div>
                </TextReveal>

                <TextReveal frame={local} delay={50} duration={25}>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: 13,
                    color: TEXT_TER,
                    textAlign: "center",
                    marginTop: 8,
                  }}>
                    Practice on your terms.
                  </div>
                </TextReveal>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 5 — Case Brief
          "Choose a module. Receive a realistic case brief."
          Phone mockup with case brief card sliding in
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[4], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[4], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingTop: 60,
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[4], frame);

            return (
              <>
                <GoldParticles frame={frame} count={5} />

                <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 6 }}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT,
                  }}>
                    Your{" "}
                    <span style={{ color: GOLD }}>Case Brief</span>
                  </div>
                </TextReveal>

                <TextReveal frame={local} delay={15} duration={25} style={{ textAlign: "center", marginBottom: 4 }}>
                  <div style={{
                    fontFamily: SANS, fontSize: 12, color: TEXT_SEC, lineHeight: 1.6, maxWidth: 260,
                  }}>
                    Real constitutional law scenarios.
                    <br />
                    Real authorities. Your role as counsel.
                  </div>
                </TextReveal>

                <GoldLine width={35} delay={22} frame={local} />

                <div style={{ marginTop: 8 }}>
                  <PhoneMockupCSS
                    frame={local}
                    delay={18}
                    kenBurns="pan-down"
                    mockupWidth={240}
                    tiltDirection="right"
                  >
                    <CaseBriefScreenContent frame={Math.max(0, local - 18)} />
                  </PhoneMockupCSS>
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 6 — Courtroom Chat
          "Stand before the judge. Present your argument. Face real interventions."
          Mini chat UI with typewriter messages
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[5], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[5], frame),
          display: "flex",
          flexDirection: "column",
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[5], frame);

            return (
              <>
                <GoldParticles frame={frame} count={5} />

                {/* Phone frame with chat UI */}
                <div style={{
                  margin: "40px auto 0",
                  width: 340,
                  display: "flex",
                  justifyContent: "center",
                }}>
                  <PhoneMockupCSS
                    frame={local}
                    delay={5}
                    kenBurns="zoom-in"
                    mockupWidth={280}
                    tiltDirection="none"
                  >
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      background: NAVY,
                    }}>
                      <PhoneStatusBar />
                      <CourtroomHeader frame={Math.max(0, local - 8)} />

                      {/* Chat area */}
                      <div style={{
                        flex: 1,
                        overflow: "hidden",
                        paddingTop: 8,
                      }}>
                        {/* Judge message 1 */}
                        <ChatBubbleInline
                          text="Counsel, you may proceed with your submissions on parliamentary sovereignty."
                          isJudge={true}
                          frame={local}
                          typingStart={15}
                          messageStart={30}
                          charsPerFrame={0.6}
                          label="Justice AI"
                        />

                        {/* Advocate response */}
                        <ChatBubbleInline
                          text="My Lord, the doctrine of parliamentary sovereignty as established in Dicey's framework..."
                          isJudge={false}
                          frame={local}
                          typingStart={80}
                          messageStart={95}
                          charsPerFrame={1.8}
                          label="You (Counsel)"
                        />

                        {/* Judge pushback */}
                        <ChatBubbleInline
                          text="Counsel, are you suggesting the duty of care extends that far? What is the ratio in Factortame?"
                          isJudge={true}
                          frame={local}
                          typingStart={140}
                          messageStart={155}
                          charsPerFrame={0.5}
                          label="Justice AI"
                        />
                      </div>

                      {/* Bottom gradient */}
                      <div style={{
                        position: "absolute",
                        bottom: 0, left: 0, right: 0, height: 40,
                        background: `linear-gradient(transparent, ${NAVY})`,
                      }} />
                    </div>
                  </PhoneMockupCSS>
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 7 — Judge Personas
          "Four judicial temperaments. Each one challenges you differently."
          2x2 grid of persona cards
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[6], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[6], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 24px",
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[6], frame);

            const personas = [
              { emoji: "\u2696\uFE0F", label: "Standard", name: "The Honourable Justice AI", desc: "Balanced High Court Judge" },
              { emoji: "\uD83D\uDCD6", label: "Strict", name: "Justice Blackstone AI", desc: "The Strict Constructionist" },
              { emoji: "\uD83D\uDD0D", label: "Pragmatist", name: "Justice Denning AI", desc: "The Pragmatist" },
              { emoji: "\u2753", label: "Socratic", name: "Justice Socrates AI", desc: "The Questioner" },
            ];

            return (
              <>
                <GoldParticles frame={frame} count={6} />

                <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 6 }}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 24,
                    fontWeight: 700,
                    color: TEXT,
                  }}>
                    Four{" "}
                    <span style={{ color: GOLD }}>Judicial</span>{" "}
                    Temperaments
                  </div>
                </TextReveal>

                <TextReveal frame={local} delay={15} duration={25} style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: TEXT_SEC,
                    lineHeight: 1.6,
                  }}>
                    Each one challenges you differently.
                  </div>
                </TextReveal>

                {/* 2x2 grid */}
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  justifyContent: "center",
                  maxWidth: 340,
                }}>
                  {personas.map((p, i) => {
                    const cardDelay = 25 + i * 12;
                    const cardOpacity = easeOut(local, 0, 1, cardDelay, cardDelay + 18);
                    const cardY = easeOut(local, 20, 0, cardDelay, cardDelay + 18);
                    const cardScale = easeOut(local, 0.9, 1, cardDelay, cardDelay + 18);

                    return (
                      <div key={p.label} style={{
                        opacity: cardOpacity,
                        transform: `translateY(${cardY}px) scale(${cardScale})`,
                        width: 155,
                        background: NAVY_CARD,
                        borderRadius: 12,
                        padding: "14px 12px",
                        borderLeft: `3px solid ${GOLD}`,
                        border: `1px solid rgba(242,237,230,0.06)`,
                        borderLeftWidth: 3,
                        borderLeftColor: GOLD,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ fontSize: 18 }}>
                            {p.emoji}
                          </div>
                          <div style={{
                            fontFamily: SANS, fontSize: 11, fontWeight: 700,
                            color: GOLD,
                          }}>
                            {p.label}
                          </div>
                        </div>
                        <div style={{
                          fontFamily: SERIF, fontSize: 10, fontWeight: 600,
                          color: TEXT, lineHeight: 1.3, marginBottom: 3,
                        }}>
                          {p.name}
                        </div>
                        <div style={{
                          fontFamily: SANS, fontSize: 8.5, color: TEXT_SEC,
                        }}>
                          {p.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 8 — Score Reveal
          "Instant, detailed feedback across seven dimensions of advocacy."
          ScoreCircle animates to 78, DimensionBars fill below
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[7], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[7], frame),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
          gap: 16,
        }}>
          {(() => {
            const local = localFrame(S[7], frame);

            return (
              <>
                <GoldParticles frame={frame} count={6} />

                <TextReveal frame={local} delay={5} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
                    textTransform: "uppercase", letterSpacing: 2,
                  }}>
                    Session Complete — Judgment Delivered
                  </div>
                </TextReveal>

                <ScoreCircle frame={local} score={78} />

                <TextReveal frame={local} delay={15} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: SERIF, fontSize: 16, color: GOLD,
                    fontWeight: 600,
                  }}>
                    Overall Score
                  </div>
                </TextReveal>

                <DimensionBars frame={local} />
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 9 — Strengths & Improvements
          "Know exactly what you did well and where to sharpen."
          Split layout with green strengths and gold improvements
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[8], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[8], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px 24px",
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[8], frame);

            const strengths = [
              "Strong application of Factortame precedent",
              "Clear, structured oral submissions",
              "Good court manner and composure",
            ];

            const improvements = [
              "Develop response to EU Withdrawal Act argument",
              "Time management — ran 2 minutes over",
              "Use more concise case citations",
            ];

            return (
              <>
                <GoldParticles frame={frame} count={5} />

                <TextReveal frame={local} delay={5} duration={25} style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT,
                  }}>
                    Know Where You{" "}
                    <span style={{ color: GOLD }}>Stand</span>
                  </div>
                </TextReveal>

                {/* Strengths section */}
                <div style={{
                  width: "100%",
                  maxWidth: 320,
                  marginBottom: 18,
                }}>
                  <TextReveal frame={local} delay={15} duration={20}>
                    <div style={{
                      fontFamily: SANS, fontSize: 11, fontWeight: 700,
                      color: "#4CAF50",
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      marginBottom: 10,
                    }}>
                      Strengths
                    </div>
                  </TextReveal>

                  {strengths.map((item, i) => {
                    const itemDelay = 22 + i * 10;
                    const itemOpacity = easeOut(local, 0, 1, itemDelay, itemDelay + 15);
                    const itemX = easeOut(local, -20, 0, itemDelay, itemDelay + 15);

                    return (
                      <div key={i} style={{
                        opacity: itemOpacity,
                        transform: `translateX(${itemX}px)`,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        marginBottom: 8,
                      }}>
                        <div style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: "#4CAF50",
                          marginTop: 4,
                          flexShrink: 0,
                          boxShadow: "0 0 6px rgba(76,175,80,0.4)",
                        }} />
                        <div style={{
                          fontFamily: SANS, fontSize: 11, color: TEXT,
                          lineHeight: 1.5,
                        }}>
                          {item}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Improvements section */}
                <div style={{
                  width: "100%",
                  maxWidth: 320,
                }}>
                  <TextReveal frame={local} delay={55} duration={20}>
                    <div style={{
                      fontFamily: SANS, fontSize: 11, fontWeight: 700,
                      color: GOLD,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                      marginBottom: 10,
                    }}>
                      Areas to Improve
                    </div>
                  </TextReveal>

                  {improvements.map((item, i) => {
                    const itemDelay = 62 + i * 10;
                    const itemOpacity = easeOut(local, 0, 1, itemDelay, itemDelay + 15);
                    const itemX = easeOut(local, -20, 0, itemDelay, itemDelay + 15);

                    return (
                      <div key={i} style={{
                        opacity: itemOpacity,
                        transform: `translateX(${itemX}px)`,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 8,
                        marginBottom: 8,
                      }}>
                        <div style={{
                          width: 7, height: 7, borderRadius: "50%",
                          background: GOLD,
                          marginTop: 4,
                          flexShrink: 0,
                          boxShadow: "0 0 6px rgba(201,168,76,0.4)",
                        }} />
                        <div style={{
                          fontFamily: SANS, fontSize: 11, color: TEXT,
                          lineHeight: 1.5,
                        }}>
                          {item}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 10 — CTA
          "RATIO. Your courtroom is always open."
          Logo, tagline, gold line, website URL
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[9], frame) && (
        <AbsoluteFill style={{
          opacity: sceneFade(S[9], frame),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px 32px",
          background: NAVY,
          zIndex: 10,
        }}>
          {(() => {
            const local = localFrame(S[9], frame);

            // Gentle scale-up
            const ctaScale = easeInOut(local, 0.95, 1.0, 0, 200);

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
              <div style={{
                transform: `scale(${ctaScale})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
                {/* Pulsing gold radial */}
                <div style={{
                  position: "absolute",
                  width: glowSize,
                  height: glowSize,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, rgba(201,168,76,${glowPulse}) 0%, transparent 70%)`,
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }} />

                <GoldParticles frame={frame} count={10} />

                {/* RATIO. logo */}
                <TextReveal frame={local} delay={10} duration={35}>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: 48,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: GOLD,
                    textAlign: "center",
                  }}>
                    RATIO<span style={{ color: TEXT }}>.</span>
                  </div>
                </TextReveal>

                <GoldLine width={80} delay={35} frame={local} thickness={2} />

                {/* Tagline */}
                <TextReveal frame={local} delay={50} duration={30}>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: 15,
                    color: TEXT_SEC,
                    textAlign: "center",
                    marginTop: 12,
                    lineHeight: 1.7,
                  }}>
                    Your courtroom is always open.
                  </div>
                </TextReveal>

                {/* CTA Button */}
                <TextReveal frame={local} delay={80} duration={30}>
                  <div style={{
                    marginTop: 28,
                    padding: "14px 36px",
                    borderRadius: 14,
                    background: `linear-gradient(135deg, ${GOLD}, #B8943F)`,
                    color: NAVY,
                    fontFamily: SANS,
                    fontSize: 15,
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    transform: `scale(${btnScale})`,
                    boxShadow: `0 8px 30px rgba(201,168,76,0.25)`,
                  }}>
                    Start Practice
                  </div>
                </TextReveal>

                {/* Free for UK law students */}
                <TextReveal frame={local} delay={100} duration={25}>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: 12,
                    color: TEXT_SEC,
                    textAlign: "center",
                    marginTop: 16,
                  }}>
                    Free for UK law students
                  </div>
                </TextReveal>

                {/* URL */}
                <TextReveal frame={local} delay={120} duration={25}>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: 11,
                    color: TEXT_TER,
                    textAlign: "center",
                    marginTop: 16,
                    letterSpacing: "0.02em",
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
