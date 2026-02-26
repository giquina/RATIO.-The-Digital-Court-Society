/**
 * RATIO. AI Practice — 30-Second High-Impact Cut
 *
 * Designed for: Instagram Reels, TikTok, WhatsApp Status
 * Pacing: Punchy but still breathing — no scene shorter than 3 seconds
 * Hook: First 3 seconds grab attention (text-only provocation)
 *
 * On-screen copy (no voiceover needed — designed to work silent):
 *   [0–3s]    "Can you argue before a judge?"
 *   [3–7s]    "RATIO. trains you with AI."
 *   [7–11s]   Phone: Choose your AI Judge
 *   [11–15s]  Phone: Your case brief
 *   [15–20s]  Phone: Live courtroom session
 *   [20–24s]  Phone: Your score + feedback
 *   [24–30s]  CTA: "Start Practice — Free for UK Law Students"
 *
 * Music: Upbeat minimal electronic, 120bpm, builds to drop at 15s
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

// ── Brand Tokens ──

const GOLD = "#C9A84C";
const NAVY = "#0C1220";
const NAVY_MID = "#131E30";
const TEXT = "#F2EDE6";
const TEXT_SEC = "rgba(242, 237, 230, 0.55)";
const TEXT_TER = "rgba(242, 237, 230, 0.3)";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// ── Scene Timeline (30fps × ~31.7s = 950 frames) ──
// Retimed for Charlie narrator clips (shorter hook/intro, longer CTA)

interface Scene {
  id: string;
  start: number;
  dur: number;
  xfade: number;
}

const S: Scene[] = [
  { id: "hook",         start: 0,   dur: 90,  xfade: 15 }, //  0–3s    Hook question
  { id: "intro",        start: 80,  dur: 120, xfade: 15 }, //  2.7–6.7s RATIO trains you
  { id: "choose-judge", start: 190, dur: 120, xfade: 15 }, //  6.3–10.3s Choose judge
  { id: "case-brief",   start: 300, dur: 120, xfade: 15 }, // 10–14s   Case brief
  { id: "session",      start: 410, dur: 150, xfade: 15 }, // 13.7–18.7s Live session
  { id: "feedback",     start: 550, dur: 120, xfade: 15 }, // 18.3–22.3s Feedback
  { id: "cta",          start: 650, dur: 300, xfade: 0  }, // 21.7–31.7s CTA (extended for longer Charlie clip)
];

// ── Helpers ──

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

function sceneFade(scene: Scene, frame: number): number {
  const local = frame - scene.start;
  const fadeIn = clamp01(local / 18);
  const fadeOut = scene.xfade > 0
    ? clamp01((scene.dur - local) / scene.xfade)
    : local <= scene.dur ? 1 : 0;
  return fadeIn * fadeOut;
}

function localFrame(scene: Scene, frame: number): number {
  return frame - scene.start;
}

function isVisible(scene: Scene, frame: number): boolean {
  const local = frame - scene.start;
  return local >= -5 && local <= scene.dur + 5;
}

function easeOut(v: number, from: number, to: number, s: number, e: number): number {
  return interpolate(v, [s, e], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
}

function easeInOut(v: number, from: number, to: number, s: number, e: number): number {
  return interpolate(v, [s, e], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
}

// ── Components ──

function TextReveal({
  children,
  frame,
  delay = 0,
  duration = 18,
  style = {},
}: {
  children: React.ReactNode;
  frame: number;
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const f = frame - delay;
  const opacity = easeOut(f, 0, 1, 0, duration);
  const y = easeOut(f, 18, 0, 0, duration);
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
}

function GoldLine({ width, delay, frame }: { width: number; delay: number; frame: number }) {
  const w = easeOut(frame - delay, 0, width, 0, 20);
  return (
    <div style={{ width: w, height: 1, background: `linear-gradient(90deg, ${GOLD}, transparent)`, margin: "10px auto", opacity: 0.7 }} />
  );
}

function PhoneMockup({ src, frame, delay = 0, tiltDirection = "left" }: {
  src: string; frame: number; delay?: number; tiltDirection?: "left" | "right" | "none";
}) {
  const f = frame - delay;
  const mockupWidth = 250;
  const bezelPadding = 7;
  const borderRadius = 34;
  const screenRadius = borderRadius - bezelPadding + 2;

  // Entry
  const entryOpacity = easeOut(f, 0, 1, 0, 25);
  const entryY = easeOut(f, 50, 0, 0, 30);
  const entryScale = easeOut(f, 0.88, 1, 0, 30);

  // 3D tilt
  const tiltSign = tiltDirection === "right" ? -1 : tiltDirection === "left" ? 1 : 0;
  const rotateY = easeOut(f, 16 * tiltSign, 3 * tiltSign, 0, 40) + (f > 40 ? Math.sin((f - 40) * 0.015) * 1.2 * tiltSign : 0);
  const rotateX = easeOut(f, 6, 1.5, 0, 40) + Math.sin((f - 40) * 0.018) * 0.4;

  // Glare
  const glarePos = easeInOut(f, -30, 130, 8, 150);
  const glareOpacity = easeOut(f, 0, 1, 15, 40);

  // Shadow
  const shadowX = rotateY * -2;
  const shadowY = 18 + rotateX * 2;
  const shadowBlur = 50 + Math.abs(rotateY) * 3;

  const glowOpacity = easeOut(f, 0, 0.15, 10, 35);

  return (
    <div style={{ opacity: entryOpacity, transform: `translateY(${entryY}px) scale(${entryScale})`, display: "flex", justifyContent: "center", position: "relative", perspective: 800 }}>
      {/* Glow */}
      <div style={{
        position: "absolute", width: mockupWidth + 70, height: mockupWidth * 1.5, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: glowOpacity, filter: "blur(35px)",
      }} />

      {/* 3D phone */}
      <div style={{
        width: mockupWidth,
        transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
        transformStyle: "preserve-3d",
        position: "relative",
      }}>
        {/* Phone body */}
        <div style={{
          width: mockupWidth, borderRadius, padding: bezelPadding,
          background: "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #1a1a1a 100%)",
          boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.08), inset 0 0 0 0.5px rgba(255,255,255,0.05)`,
          position: "relative",
        }}>
          {/* Power button */}
          <div style={{ position: "absolute", right: -2, top: mockupWidth * 0.35, width: 3, height: 24, borderRadius: "0 2px 2px 0", background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)" }} />
          {/* Volume buttons */}
          <div style={{ position: "absolute", left: -2, top: mockupWidth * 0.28, width: 3, height: 16, borderRadius: "2px 0 0 2px", background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)" }} />
          <div style={{ position: "absolute", left: -2, top: mockupWidth * 0.37, width: 3, height: 16, borderRadius: "2px 0 0 2px", background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)" }} />

          {/* Screen */}
          <div style={{ borderRadius: screenRadius, overflow: "hidden", position: "relative", background: "#000" }}>
            <Img src={src} style={{ width: "100%", display: "block" }} />

            {/* Dynamic Island */}
            <div style={{
              position: "absolute", top: 7, left: "50%", transform: "translateX(-50%)",
              width: mockupWidth * 0.3, height: 20, borderRadius: 12, background: "#000",
              boxShadow: "0 1px 3px rgba(0,0,0,0.5)", zIndex: 10,
            }}>
              <div style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                width: 7, height: 7, borderRadius: "50%",
                background: "radial-gradient(circle, #1a1a2e 40%, #0d0d15 100%)",
              }} />
            </div>

            {/* Glare */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(115deg, transparent ${glarePos - 20}%, rgba(255,255,255,0.04) ${glarePos - 5}%, rgba(255,255,255,0.07) ${glarePos}%, rgba(255,255,255,0.04) ${glarePos + 5}%, transparent ${glarePos + 20}%)`,
              opacity: glareOpacity, pointerEvents: "none", borderRadius: screenRadius,
            }} />

            {/* Screen edge highlight */}
            <div style={{ position: "absolute", inset: 0, borderRadius: screenRadius, boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Surface reflection */}
        <div style={{
          position: "absolute", bottom: -25, left: "12%", right: "12%", height: 25,
          background: "linear-gradient(180deg, rgba(201,168,76,0.03) 0%, transparent 100%)",
          filter: "blur(6px)", borderRadius: "50%",
        }} />
      </div>
    </div>
  );
}

// ── Visual Effects ──

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

/** Film grain overlay */
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

/** Animated caption overlay */
interface CaptionPhrase {
  text: string;
  from: number;
  to: number;
}

function CaptionOverlay({ frame, captions }: { frame: number; captions: CaptionPhrase[] }) {
  const active = captions.find((c) => frame >= c.from && frame <= c.to);
  if (!active) return null;

  const progress = (frame - active.from) / (active.to - active.from);
  const fadeIn = easeOut(frame, 0, 1, active.from, active.from + 6);
  const fadeOut = frame > active.to - 6
    ? easeOut(frame, 1, 0, active.to - 6, active.to)
    : 1;
  const opacity = fadeIn * fadeOut;
  const y = easeOut(frame, 5, 0, active.from, active.from + 8);

  const words = active.text.split(" ");
  const wordIndex = Math.floor(progress * words.length);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 36,
        left: 16,
        right: 16,
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
          borderRadius: 10,
          padding: "8px 14px",
          border: "1px solid rgba(201, 168, 76, 0.15)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          maxWidth: 320,
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 13,
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
                marginRight: 3,
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

// ── Scenes ──

function HookScene({ frame }: { frame: number }) {
  const scene = S[0];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 32px", background: NAVY }}>
      <TextReveal frame={local} delay={5} duration={20}>
        <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: TEXT, textAlign: "center", lineHeight: 1.3 }}>
          Can you argue
          <br />
          before a <span style={{ color: GOLD }}>judge</span>?
        </div>
      </TextReveal>
    </AbsoluteFill>
  );
}

function IntroScene({ frame }: { frame: number }) {
  const scene = S[1];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  const glowSize = easeOut(local, 150, 350, 0, 80);

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: NAVY }}>
      <div style={{
        position: "absolute", width: glowSize, height: glowSize, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)`,
        top: "42%", left: "50%", transform: "translate(-50%, -50%)",
      }} />

      <TextReveal frame={local} delay={8} duration={25}>
        <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, letterSpacing: "0.14em", color: TEXT, textAlign: "center" }}>
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </TextReveal>

      <GoldLine width={50} delay={25} frame={local} />

      <TextReveal frame={local} delay={30} duration={22}>
        <div style={{ fontFamily: SANS, fontSize: 14, color: TEXT_SEC, textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
          trains you with <span style={{ color: GOLD }}>AI</span>
        </div>
      </TextReveal>
    </AbsoluteFill>
  );
}

function ChooseJudgeScene({ frame }: { frame: number }) {
  const scene = S[2];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: 70, background: NAVY }}>
      <TextReveal frame={local} delay={3} duration={18} style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: TEXT }}>
          Choose Your <span style={{ color: GOLD }}>AI Judge</span>
        </div>
      </TextReveal>
      <GoldLine width={30} delay={12} frame={local} />
      <div style={{ marginTop: 10 }}>
        <PhoneMockup src={staticFile("screenshots/mobile/ai-practice-mobile.png")} frame={local} delay={12} tiltDirection="left" />
      </div>
    </AbsoluteFill>
  );
}

function CaseBriefScene({ frame }: { frame: number }) {
  const scene = S[3];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: 70, background: NAVY }}>
      <TextReveal frame={local} delay={3} duration={18} style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: TEXT }}>
          Your <span style={{ color: GOLD }}>Case Brief</span>
        </div>
      </TextReveal>
      <GoldLine width={30} delay={12} frame={local} />
      <div style={{ marginTop: 10 }}>
        <PhoneMockup src={staticFile("screenshots/mobile/ai-briefing-case.png")} frame={local} delay={12} tiltDirection="right" />
      </div>
    </AbsoluteFill>
  );
}

function SessionScene({ frame }: { frame: number }) {
  const scene = S[4];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  const courtFlash = interpolate(local, [10, 20, 40], [0, 0.05, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: 60, background: NAVY }}>
      <div style={{ position: "absolute", inset: 0, background: GOLD, opacity: courtFlash, pointerEvents: "none" }} />

      <TextReveal frame={local} delay={3} duration={18} style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: GOLD, letterSpacing: "0.02em", textTransform: "uppercase" }}>
          Court is in Session
        </div>
      </TextReveal>
      <TextReveal frame={local} delay={15} duration={18} style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontFamily: SANS, fontSize: 12, color: TEXT_SEC, lineHeight: 1.5 }}>
          Real-time exchanges with the AI Judge
        </div>
      </TextReveal>
      <GoldLine width={40} delay={18} frame={local} />
      <div style={{ marginTop: 8 }}>
        <PhoneMockup src={staticFile("screenshots/mobile/ai-session-exchange.png")} frame={local} delay={18} tiltDirection="left" />
      </div>
    </AbsoluteFill>
  );
}

function FeedbackScene({ frame }: { frame: number }) {
  const scene = S[5];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", paddingTop: 70, background: NAVY }}>
      <TextReveal frame={local} delay={3} duration={18} style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: TEXT }}>
          Your <span style={{ color: GOLD }}>Judgment</span>
        </div>
      </TextReveal>
      <TextReveal frame={local} delay={14} duration={18} style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontFamily: SANS, fontSize: 12, color: TEXT_SEC }}>
          Scored across 7 dimensions
        </div>
      </TextReveal>
      <GoldLine width={30} delay={16} frame={local} />
      <div style={{ marginTop: 10 }}>
        <PhoneMockup src={staticFile("screenshots/mobile/ai-feedback-score.png")} frame={local} delay={16} tiltDirection="right" />
      </div>
    </AbsoluteFill>
  );
}

function CTAScene({ frame }: { frame: number }) {
  const scene = S[6];
  if (!isVisible(scene, frame)) return null;
  const local = localFrame(scene, frame);
  const opacity = sceneFade(scene, frame);

  const glowPulse = interpolate(Math.sin(local * 0.05), [-1, 1], [0.06, 0.14]);
  const btnScale = interpolate(Math.sin(local * 0.07), [-1, 1], [0.98, 1.02]);

  return (
    <AbsoluteFill style={{ opacity, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 28px", background: NAVY }}>
      <div style={{
        position: "absolute", width: 350, height: 350, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(201,168,76,${glowPulse}) 0%, transparent 70%)`,
        top: "38%", left: "50%", transform: "translate(-50%, -50%)",
      }} />

      <TextReveal frame={local} delay={8} duration={25}>
        <div style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 700, letterSpacing: "0.12em", color: TEXT, textAlign: "center" }}>
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </TextReveal>

      <GoldLine width={50} delay={25} frame={local} />

      <TextReveal frame={local} delay={35} duration={22}>
        <div style={{ fontFamily: SANS, fontSize: 13, color: TEXT_SEC, textAlign: "center", marginTop: 16, lineHeight: 1.7, maxWidth: 250 }}>
          Free for UK law students.
          <br />
          Train with AI. Score your advocacy.
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={55} duration={22}>
        <div style={{
          marginTop: 28, padding: "14px 36px", borderRadius: 12,
          background: `linear-gradient(135deg, ${GOLD}, #B8943F)`,
          color: NAVY, fontFamily: SANS, fontSize: 15, fontWeight: 700,
          letterSpacing: "0.03em", transform: `scale(${btnScale})`,
          boxShadow: "0 8px 30px rgba(201,168,76,0.25)",
        }}>
          Start Practice
        </div>
      </TextReveal>

      <TextReveal frame={local} delay={70} duration={20}>
        <div style={{ fontFamily: SANS, fontSize: 11, color: "rgba(201,168,76,0.5)", textAlign: "center", marginTop: 16 }}>
          ratiothedigitalcourtsociety.com
        </div>
      </TextReveal>
    </AbsoluteFill>
  );
}

// ── Caption Data ──

const SHORT_CAPTIONS: CaptionPhrase[] = [
  // Hook VO — Charlie (frame 8, 75 frames = 2.472s)
  { text: "Can you argue before a judge?", from: 8, to: 83 },

  // Intro VO — Charlie (frame 90, 81 frames = 2.688s)
  { text: "RATIO trains you with AI.", from: 90, to: 171 },

  // CTA VO — Charlie (frame 665, 269 frames = 8.952s)
  { text: "RATIO. The Digital Court Society.", from: 665, to: 755 },
  { text: "Free for UK law students.", from: 759, to: 839 },
  { text: "Start practice today.", from: 843, to: 934 },
];

// ── Main ──

export const AIPracticeShort: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progressOpacity = easeOut(frame, 0, 0.5, 80, 100);

  // Background music volume (retimed for 950-frame total)
  const musicVolume = interpolate(
    frame,
    [0,    15,   400,  650,  900,  950],
    [0,    0.08, 0.10, 0.08, 0.04, 0.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)` }} />

      {/* ── Background Music ── */}
      <Audio
        src={staticFile("audio/music/ambient-pad-30s.mp3")}
        volume={musicVolume}
        startFrom={0}
      />

      {/* ── Sound Effects ── */}
      <Sequence from={75} durationInFrames={15} name="SFX: Whoosh 1">
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.20} />
      </Sequence>
      <Sequence from={185} durationInFrames={15} name="SFX: Whoosh 2">
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.18} />
      </Sequence>
      <Sequence from={295} durationInFrames={15} name="SFX: Whoosh 3">
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.18} />
      </Sequence>
      <Sequence from={405} durationInFrames={15} name="SFX: Whoosh 4">
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.18} />
      </Sequence>
      <Sequence from={415} durationInFrames={12} name="SFX: Gavel">
        <Audio src={staticFile("audio/sfx/gavel-tap.mp3")} volume={0.30} />
      </Sequence>
      <Sequence from={545} durationInFrames={15} name="SFX: Whoosh 5">
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.18} />
      </Sequence>
      <Sequence from={555} durationInFrames={45} name="SFX: Score Chime">
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.12} />
      </Sequence>
      <Sequence from={645} durationInFrames={15} name="SFX: Whoosh 6">
        <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.15} />
      </Sequence>

      {/* ── Voiceover audio tracks — Charlie narrator (retimed) ── */}
      <Sequence from={8} durationInFrames={75} name="VO: Hook (Charlie, 2.472s)">
        <Audio src={staticFile("audio/voiceover/short-01-hook.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={90} durationInFrames={81} name="VO: Intro (Charlie, 2.688s)">
        <Audio src={staticFile("audio/voiceover/short-02-intro.mp3")} volume={0.85} />
      </Sequence>
      <Sequence from={665} durationInFrames={269} name="VO: CTA (Charlie, 8.952s)">
        <Audio src={staticFile("audio/voiceover/short-03-cta.mp3")} volume={0.85} />
      </Sequence>

      <HookScene frame={frame} />
      <IntroScene frame={frame} />
      <ChooseJudgeScene frame={frame} />
      <CaseBriefScene frame={frame} />
      <SessionScene frame={frame} />
      <FeedbackScene frame={frame} />
      <CTAScene frame={frame} />

      {/* ── Animated Captions ── */}
      <CaptionOverlay frame={frame} captions={SHORT_CAPTIONS} />

      {/* ── Cinematic overlays ── */}
      <Vignette intensity={0.5} />
      <FilmGrain frame={frame} opacity={0.03} />

      <div style={{
        position: "absolute", bottom: 0, left: 0, height: 2,
        background: `linear-gradient(90deg, ${GOLD}, rgba(201,168,76,0.3))`,
        width: `${(frame / durationInFrames) * 100}%`, opacity: progressOpacity,
        zIndex: 55,
      }} />
    </AbsoluteFill>
  );
};
