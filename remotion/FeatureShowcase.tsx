/**
 * RATIO. Feature Showcase (70 seconds)
 *
 * "More than practice." — A rapid-fire tour of RATIO's features:
 * Sessions, Rankings, Chambers, Parliament, Badges, Law Book, Stats.
 * Pure motion graphics — no screenshots, no phone mockups.
 *
 * Scene Timeline (30fps x 70s = 2100 frames):
 *   1. Cold Open      0–110    "RATIO is more than practice."
 *   2. Sessions        100–440  "Book a moot court…"
 *   3. Rankings        430–670  "See where you stand…"
 *   4. Chambers        660–950  "Choose your chamber…"
 *   5. Parliament      940–1280 "Shape the constitution…"
 *   6. Badges          1270–1580 "Earn milestones…"
 *   7. Law Book        1570–1850 "Forty structured legal modules…"
 *   8. Stats           1840–1910 "142 UK universities…"
 *   9. CTA             1900–2100 "RATIO. The Digital Court Society…"
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
  spring,
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
const BURGUNDY = "#6B2D3E";

const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'DM Sans', system-ui, sans-serif";

// ── Chamber data ──────────────────────────────────────────────────────────

const CHAMBERS = [
  { name: "Gray's", color: "#6B2D3E", motto: "Wisdom through advocacy", icon: "\u2696\uFE0F" },
  { name: "Lincoln's", color: "#2E5090", motto: "Justice through scholarship", icon: "\uD83D\uDCD8" },
  { name: "Inner", color: "#3D6B45", motto: "Service through practice", icon: "\uD83C\uDF3F" },
  { name: "Middle", color: "#8B6914", motto: "Excellence through tradition", icon: "\uD83C\uDFDB\uFE0F" },
];

const RANKS = ["Pupil", "Junior Counsel", "Senior Counsel", "King's Counsel", "Bencher"];

const MOOT_ROLES = [
  "Presiding Judge",
  "Leading Counsel (Appellant)",
  "Junior Counsel (Appellant)",
  "Leading Counsel (Respondent)",
  "Junior Counsel (Respondent)",
  "Clerk",
];

const BADGE_LIST = [
  { name: "First Moot", icon: "\u2696\uFE0F" },
  { name: "7-Day Streak", icon: "\uD83D\uDD25" },
  { name: "Seasoned Counsel", icon: "\uD83C\uDFDB\uFE0F" },
  { name: "100-Day Streak", icon: "\uD83C\uDFC6" },
  { name: "AI Sparring Partner", icon: "\uD83E\uDD16" },
  { name: "Respected Advocate", icon: "\u2B50" },
];

const MODULE_CATEGORIES = [
  { name: "Public Law", count: 8, color: "#2E5090" },
  { name: "Criminal", count: 7, color: "#6B2D3E" },
  { name: "Commercial", count: 6, color: "#8B6914" },
  { name: "Human Rights", count: 5, color: "#3D6B45" },
  { name: "Property", count: 5, color: "#5C3D8F" },
  { name: "Procedure", count: 4, color: "#2D6B6B" },
  { name: "Others", count: 5, color: "#4A4A4A" },
];

// ── Scene Timeline ────────────────────────────────────────────────────────

interface Scene {
  id: string;
  start: number;
  dur: number;
  xfade: number;
}

// Scene timeline retimed for ElevenLabs voiceover (Charlie — natural pacing)
// Clip durations: 80, 303, 200, 254, 306, 275, 248, 166, 183 frames
// Total VO ~67s → video extended to 70s (2100 frames)
const S: Scene[] = [
  { id: "cold-open",   start: 0,    dur: 110,  xfade: 10 },  //  0.0s–3.7s
  { id: "sessions",    start: 100,  dur: 340,  xfade: 10 },  //  3.3s–14.7s
  { id: "rankings",    start: 430,  dur: 240,  xfade: 10 },  // 14.3s–22.3s
  { id: "chambers",    start: 660,  dur: 290,  xfade: 10 },  // 22.0s–31.7s
  { id: "parliament",  start: 940,  dur: 340,  xfade: 10 },  // 31.3s–42.7s
  { id: "badges",      start: 1270, dur: 310,  xfade: 10 },  // 42.3s–52.7s
  { id: "lawbook",     start: 1570, dur: 280,  xfade: 10 },  // 52.3s–61.7s
  { id: "stats",       start: 1840, dur: 70,   xfade: 10 },  // 61.3s–63.7s
  { id: "cta",         start: 1900, dur: 200,  xfade: 0  },  // 63.3s–70.0s
];

// ── Animation Helpers ─────────────────────────────────────────────────────

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function sceneFade(scene: Scene, frame: number): number {
  const local = frame - scene.start;
  const fadeIn = clamp01(local / 20);
  const fadeOut = scene.xfade > 0
    ? clamp01((scene.dur - local) / scene.xfade)
    : local <= scene.dur ? 1 : 0;
  return fadeIn * fadeOut;
}

function isVisible(scene: Scene, frame: number): boolean {
  const local = frame - scene.start;
  return local >= -10 && local <= scene.dur + 10;
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

function GoldParticles({ frame, count = 18 }: { frame: number; count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => {
    const seed = i * 137.5;
    const x = ((seed * 0.618) % 1) * 393;
    const baseY = ((seed * 0.381) % 1) * 852;
    const speed = 0.15 + (i % 5) * 0.08;
    const size = 1.5 + (i % 3) * 1;
    const delay = (i * 7) % 30;
    const drift = Math.sin((frame + seed) * 0.02) * 15;
    const y = baseY - (frame + delay) * speed;
    const normY = ((y % 852) + 852) % 852;
    const opacity = 0.15 + Math.sin((frame + seed) * 0.04) * 0.1;
    return (
      <div key={i} style={{
        position: "absolute", left: x + drift, top: normY,
        width: size, height: size, borderRadius: "50%",
        background: GOLD, opacity, filter: "blur(0.5px)",
      }} />
    );
  });
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>{particles}</div>;
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
      position: "absolute", bottom: 60, left: 20, right: 20,
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
        <span style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.5, letterSpacing: 0.2 }}>
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

// ── Scene-Specific Components ─────────────────────────────────────────────

/** Scene 2: Session roles filling up one by one */
function SessionRolesCard({ frame }: { frame: number }) {
  return (
    <div style={{
      width: 320, margin: "0 auto",
      background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
      borderRadius: 16, padding: "20px 24px",
      border: `1px solid rgba(201, 168, 76, 0.12)`,
    }}>
      {/* Session header */}
      <TextReveal frame={frame} delay={10} style={{ marginBottom: 6 }}>
        <div style={{
          fontFamily: SERIF, fontSize: 18, color: GOLD,
          fontWeight: 600, letterSpacing: 0.5,
        }}>
          Constitutional Law Moot
        </div>
      </TextReveal>
      <TextReveal frame={frame} delay={18} style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: SANS, fontSize: 11, color: TEXT_SEC,
          display: "flex", gap: 16,
        }}>
          <span>6 roles</span>
          <span>60 min</span>
          <span>Advanced</span>
        </div>
      </TextReveal>

      {/* Role slots */}
      {MOOT_ROLES.map((role, i) => {
        const slotDelay = 30 + i * 20;
        const fillDelay = slotDelay + 15;
        const slotOpacity = easeOut(frame, 0, 1, slotDelay, slotDelay + 12);
        const isFilled = frame > fillDelay;
        const fillWidth = easeOut(frame, 0, 100, fillDelay, fillDelay + 15);

        return (
          <div key={role} style={{
            opacity: slotOpacity,
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 8, height: 32,
          }}>
            {/* Status dot */}
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isFilled ? "#4CAF50" : "rgba(242, 237, 230, 0.15)",
              transition: "background 0.3s",
              boxShadow: isFilled ? "0 0 8px rgba(76, 175, 80, 0.4)" : "none",
            }} />
            {/* Role name */}
            <div style={{
              fontFamily: SANS, fontSize: 12, color: TEXT,
              flex: 1,
            }}>
              {role}
            </div>
            {/* Fill bar */}
            <div style={{
              width: 50, height: 4, borderRadius: 2,
              background: "rgba(242, 237, 230, 0.08)",
              overflow: "hidden",
            }}>
              <div style={{
                width: `${fillWidth}%`, height: "100%",
                background: isFilled
                  ? `linear-gradient(90deg, ${GOLD}, #4CAF50)`
                  : "transparent",
                borderRadius: 2,
              }} />
            </div>
          </div>
        );
      })}

      {/* Countdown */}
      <TextReveal frame={frame} delay={170} style={{ marginTop: 12, textAlign: "center" }}>
        <div style={{
          fontFamily: SANS, fontSize: 13, color: GOLD,
          letterSpacing: 1,
        }}>
          SESSION STARTS IN 2:34
        </div>
      </TextReveal>
    </div>
  );
}

/** Scene 3: Animated podium with rank names */
function PodiumChart({ frame }: { frame: number }) {
  const barData = [
    { rank: "Pupil", height: 50, color: TEXT_TER },
    { rank: "Junior\nCounsel", height: 90, color: TEXT_SEC },
    { rank: "Senior\nCounsel", height: 140, color: "rgba(201, 168, 76, 0.5)" },
    { rank: "King's\nCounsel", height: 195, color: GOLD },
    { rank: "Bencher", height: 250, color: "#FFD700" },
  ];

  return (
    <div style={{
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      gap: 10, height: 320, padding: "0 20px",
    }}>
      {barData.map((bar, i) => {
        const barDelay = 15 + i * 18;
        const barHeight = easeOut(frame, 0, bar.height, barDelay, barDelay + 30);
        const labelOpacity = easeOut(frame, 0, 1, barDelay + 20, barDelay + 30);
        const isHighlighted = i === 3; // King's Counsel

        return (
          <div key={bar.rank} style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
          }}>
            {/* Rank label */}
            <div style={{
              fontFamily: SANS, fontSize: 9, color: isHighlighted ? GOLD : TEXT_SEC,
              textAlign: "center", opacity: labelOpacity,
              whiteSpace: "pre-line", lineHeight: 1.3,
              fontWeight: isHighlighted ? 600 : 400,
            }}>
              {bar.rank}
            </div>
            {/* Bar */}
            <div style={{
              width: 48, height: barHeight, borderRadius: "8px 8px 4px 4px",
              background: isHighlighted
                ? `linear-gradient(180deg, ${GOLD}, rgba(201, 168, 76, 0.3))`
                : `linear-gradient(180deg, ${bar.color}, rgba(242, 237, 230, 0.05))`,
              boxShadow: isHighlighted
                ? `0 0 20px rgba(201, 168, 76, 0.3), inset 0 1px 0 rgba(255,255,255,0.15)`
                : "inset 0 1px 0 rgba(255,255,255,0.05)",
              position: "relative",
            }}>
              {/* Points label inside bar */}
              {barHeight > 40 && (
                <div style={{
                  position: "absolute", bottom: 8, left: 0, right: 0,
                  textAlign: "center",
                  fontFamily: SANS, fontSize: 9, color: "rgba(12, 18, 32, 0.6)",
                  fontWeight: 700, opacity: labelOpacity,
                }}>
                  {[0, 100, 500, 1500, 5000][i]}pts
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Scene 4: Chamber colour cards animating in */
function ChamberCards({ frame }: { frame: number }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: 10, padding: "0 30px",
    }}>
      {CHAMBERS.map((chamber, i) => {
        const cardDelay = 10 + i * 22;
        const opacity = easeOut(frame, 0, 1, cardDelay, cardDelay + 18);
        const slideX = easeOut(frame, i % 2 === 0 ? -60 : 60, 0, cardDelay, cardDelay + 20);

        return (
          <div key={chamber.name} style={{
            opacity,
            transform: `translateX(${slideX}px)`,
            display: "flex", alignItems: "center", gap: 14,
            background: `linear-gradient(135deg, ${chamber.color}22, ${NAVY_CARD})`,
            borderRadius: 14, padding: "14px 18px",
            border: `1px solid ${chamber.color}44`,
          }}>
            {/* Colour dot */}
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${chamber.color}, ${chamber.color}88)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
              boxShadow: `0 0 12px ${chamber.color}33`,
            }}>
              {chamber.icon}
            </div>
            <div>
              <div style={{
                fontFamily: SERIF, fontSize: 17, color: TEXT,
                fontWeight: 600,
              }}>
                {chamber.name}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 10, color: TEXT_SEC,
                fontStyle: "italic",
              }}>
                {chamber.motto}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Scene 5: Animated voting bar */
function VotingBar({ frame }: { frame: number }) {
  const yesPercent = easeOut(frame, 0, 67, 20, 80);
  const noPercent = easeOut(frame, 0, 33, 30, 80);
  const totalVotes = Math.round(easeOut(frame, 0, 142, 20, 70));

  return (
    <div style={{ padding: "0 30px" }}>
      {/* Motion title */}
      <TextReveal frame={frame} delay={5} style={{ marginBottom: 20 }}>
        <div style={{
          background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
          borderRadius: 14, padding: "16px 20px",
          border: `1px solid rgba(201, 168, 76, 0.12)`,
        }}>
          <div style={{
            fontFamily: SANS, fontSize: 10, color: GOLD,
            textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
          }}>
            Motion before the Assembly
          </div>
          <div style={{
            fontFamily: SERIF, fontSize: 15, color: TEXT, lineHeight: 1.4,
          }}>
            "That this Assembly supports the adoption of a written constitution for the Society."
          </div>
        </div>
      </TextReveal>

      {/* Vote bar */}
      <TextReveal frame={frame} delay={35}>
        <div style={{
          height: 40, borderRadius: 12,
          display: "flex", overflow: "hidden",
          background: "rgba(242, 237, 230, 0.05)",
          border: `1px solid rgba(242, 237, 230, 0.08)`,
        }}>
          {/* Aye */}
          <div style={{
            width: `${yesPercent}%`, height: "100%",
            background: "linear-gradient(90deg, #3D6B45, #4CAF50)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "width 0.3s",
          }}>
            <span style={{
              fontFamily: SANS, fontSize: 13, color: TEXT,
              fontWeight: 700,
            }}>
              {Math.round(yesPercent)}% Aye
            </span>
          </div>
          {/* No */}
          <div style={{
            width: `${noPercent}%`, height: "100%",
            background: "linear-gradient(90deg, #8B3030, #6B2D3E)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "width 0.3s",
          }}>
            <span style={{
              fontFamily: SANS, fontSize: 13, color: TEXT,
              fontWeight: 700,
            }}>
              {Math.round(noPercent)}% No
            </span>
          </div>
        </div>
      </TextReveal>

      {/* Vote count */}
      <TextReveal frame={frame} delay={50} style={{ marginTop: 12, textAlign: "center" }}>
        <div style={{
          fontFamily: SANS, fontSize: 12, color: TEXT_SEC,
        }}>
          {totalVotes} advocates voted
        </div>
      </TextReveal>
    </div>
  );
}

/** Scene 6: Badge grid unlocking one by one */
function BadgeGrid({ frame }: { frame: number }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12, padding: "0 30px",
    }}>
      {BADGE_LIST.map((badge, i) => {
        const unlockDelay = 15 + i * 25;
        const isUnlocked = frame > unlockDelay;
        const opacity = easeOut(frame, 0.3, 1, unlockDelay, unlockDelay + 15);
        const scale = easeOut(frame, 0.7, 1, unlockDelay, unlockDelay + 12);
        const glowOpacity = isUnlocked
          ? easeOut(frame, 0, 0.6, unlockDelay, unlockDelay + 10) *
            (0.5 + 0.5 * Math.sin((frame - unlockDelay) * 0.08))
          : 0;

        return (
          <div key={badge.name} style={{
            opacity,
            transform: `scale(${scale})`,
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 6, padding: "14px 8px",
            background: isUnlocked
              ? `linear-gradient(135deg, rgba(201, 168, 76, 0.12), ${NAVY_CARD})`
              : NAVY_CARD,
            borderRadius: 14,
            border: isUnlocked
              ? `1px solid rgba(201, 168, 76, 0.25)`
              : `1px solid rgba(242, 237, 230, 0.05)`,
            position: "relative",
          }}>
            {/* Gold glow pulse */}
            {isUnlocked && (
              <div style={{
                position: "absolute", inset: -4,
                borderRadius: 18,
                background: `radial-gradient(ellipse, rgba(201, 168, 76, 0.15), transparent)`,
                opacity: glowOpacity,
                pointerEvents: "none",
              }} />
            )}
            <div style={{
              fontSize: 24,
              filter: isUnlocked ? "none" : "grayscale(1) opacity(0.3)",
            }}>
              {badge.icon}
            </div>
            <div style={{
              fontFamily: SANS, fontSize: 9, color: isUnlocked ? GOLD : TEXT_TER,
              textAlign: "center", fontWeight: 600,
              lineHeight: 1.2,
            }}>
              {badge.name}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Scene 7: Module category cards fanning out */
function ModuleCards({ frame }: { frame: number }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      gap: 8, padding: "0 30px",
    }}>
      {MODULE_CATEGORIES.map((cat, i) => {
        const cardDelay = 10 + i * 16;
        const opacity = easeOut(frame, 0, 1, cardDelay, cardDelay + 14);
        const slideX = easeOut(frame, 80, 0, cardDelay, cardDelay + 18);
        const barWidth = easeOut(frame, 0, (cat.count / 8) * 100, cardDelay + 8, cardDelay + 28);

        return (
          <div key={cat.name} style={{
            opacity,
            transform: `translateX(${slideX}px)`,
            display: "flex", alignItems: "center", gap: 12,
            background: NAVY_CARD,
            borderRadius: 10, padding: "10px 14px",
            border: `1px solid ${cat.color}33`,
          }}>
            {/* Category colour bar */}
            <div style={{
              width: 4, height: 28, borderRadius: 2,
              background: cat.color,
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: SANS, fontSize: 12, color: TEXT,
                fontWeight: 500,
              }}>
                {cat.name}
              </div>
              {/* Module count bar */}
              <div style={{
                height: 3, borderRadius: 2, marginTop: 4,
                background: "rgba(242, 237, 230, 0.06)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${barWidth}%`, height: "100%",
                  background: `linear-gradient(90deg, ${cat.color}, ${cat.color}66)`,
                  borderRadius: 2,
                }} />
              </div>
            </div>
            <div style={{
              fontFamily: SANS, fontSize: 11, color: TEXT_SEC,
              fontWeight: 600,
            }}>
              {cat.count}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Scene 8: Counter animation */
function CounterAnimation({ frame }: { frame: number }) {
  const unis = Math.round(easeOut(frame, 0, 142, 10, 50));
  const advocates = Math.round(easeOut(frame, 0, 2847, 15, 55));

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 30,
    }}>
      {/* Universities counter */}
      <div style={{ textAlign: "center" }}>
        <TextReveal frame={frame} delay={5}>
          <div style={{
            fontFamily: SERIF, fontSize: 56, color: GOLD,
            fontWeight: 700, lineHeight: 1,
          }}>
            {unis}
          </div>
        </TextReveal>
        <TextReveal frame={frame} delay={12}>
          <div style={{
            fontFamily: SANS, fontSize: 13, color: TEXT_SEC,
            marginTop: 6, letterSpacing: 1.5, textTransform: "uppercase",
          }}>
            UK Universities
          </div>
        </TextReveal>
      </div>

      {/* Divider */}
      <GoldLine width={120} delay={20} frame={frame} />

      {/* Advocates counter */}
      <div style={{ textAlign: "center" }}>
        <TextReveal frame={frame} delay={25}>
          <div style={{
            fontFamily: SERIF, fontSize: 42, color: TEXT,
            fontWeight: 600, lineHeight: 1,
          }}>
            {advocates.toLocaleString()}+
          </div>
        </TextReveal>
        <TextReveal frame={frame} delay={32}>
          <div style={{
            fontFamily: SANS, fontSize: 13, color: TEXT_SEC,
            marginTop: 6, letterSpacing: 1.5, textTransform: "uppercase",
          }}>
            Advocates
          </div>
        </TextReveal>
      </div>
    </div>
  );
}

// ── Caption Data ──────────────────────────────────────────────────────────

const CAPTIONS: CaptionPhrase[] = [
  // Scene 1 — Cold Open (VO: 8–88, 80 frames)
  { text: "RATIO is a lot more than practice.", from: 8, to: 88 },
  // Scene 2 — Sessions (VO: 108–411, 303 frames)
  { text: "You can book a moot court with other advocates in a few minutes.", from: 108, to: 252 },
  { text: "Six roles, real arguments — no waiting around for university schedules.", from: 257, to: 411 },
  // Scene 3 — Rankings (VO: 438–638, 200 frames)
  { text: "There's a national ranking system.", from: 438, to: 531 },
  { text: "You start as a Pupil and work your way up to King's Counsel.", from: 536, to: 638 },
  // Scene 4 — Chambers (VO: 668–922, 254 frames)
  { text: "You choose an Inn — Gray's, Lincoln's, Inner, or Middle.", from: 668, to: 810 },
  { text: "Each one has its own culture, its own colours.", from: 815, to: 922 },
  // Scene 5 — Parliament (VO: 948–1254, 306 frames)
  { text: "There's a whole governance layer.", from: 948, to: 1042 },
  { text: "Real motions, real votes.", from: 1047, to: 1122 },
  { text: "You actually shape the constitution of the society you belong to.", from: 1127, to: 1254 },
  // Scene 6 — Badges (VO: 1278–1553, 275 frames)
  { text: "You earn milestones as you go.", from: 1278, to: 1362 },
  { text: "First Moot, Seasoned Counsel, the Hundred-Day Streak.", from: 1367, to: 1482 },
  { text: "Things that actually mean something.", from: 1487, to: 1553 },
  // Scene 7 — Law Book (VO: 1578–1826, 248 frames)
  { text: "Over forty structured legal modules.", from: 1578, to: 1680 },
  { text: "Constitutional, criminal, commercial, human rights — all of it.", from: 1685, to: 1826 },
  // Scene 8 — Stats (VO: 1845–2011, 166 frames)
  { text: "A hundred and forty-two UK universities.", from: 1845, to: 1940 },
  { text: "Thousands of advocates already on it.", from: 1942, to: 2011 },
  // Scene 9 — CTA (VO: 1910–2093, 183 frames)
  { text: "RATIO. The Digital Court Society.", from: 1910, to: 2010 },
  { text: "Free for UK law students. Come join.", from: 2015, to: 2100 },
];

// ── Main Composition ──────────────────────────────────────────────────────

export const FeatureShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background music volume — retimed for 70s
  const musicVolume = interpolate(frame,
    [0, 30, 940, 1570, 1900, 2050, 2090],
    [0, 0.09, 0.11, 0.12, 0.10, 0.06, 0.03],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: NAVY, overflow: "hidden" }}>
      {/* ── Background ambient ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 50% at 50% 40%, rgba(30, 48, 80, 0.25), transparent)`,
      }} />

      <GoldParticles frame={frame} count={14} />

      {/* ── Background Music ── */}
      <Audio src={staticFile("audio/music/ambient-pad-75s.mp3")} volume={musicVolume} />

      {/* ── Courtroom Ambiance ── */}
      <Audio src={staticFile("audio/sfx/courtroom-tone.mp3")} volume={0.08} />
      <Sequence from={0} durationInFrames={200}>
        <Audio src={staticFile("audio/sfx/courtroom-murmur.mp3")} volume={0.06} />
      </Sequence>

      {/* ── Voiceover (ElevenLabs — Charlie) ── */}
      <Sequence from={8} durationInFrames={86}>
        <Audio src={staticFile("audio/voiceover/showcase-01-open.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={108} durationInFrames={310}>
        <Audio src={staticFile("audio/voiceover/showcase-02-sessions.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={438} durationInFrames={206}>
        <Audio src={staticFile("audio/voiceover/showcase-03-rankings.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={668} durationInFrames={260}>
        <Audio src={staticFile("audio/voiceover/showcase-04-chambers.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={948} durationInFrames={312}>
        <Audio src={staticFile("audio/voiceover/showcase-05-parliament.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1278} durationInFrames={281}>
        <Audio src={staticFile("audio/voiceover/showcase-06-badges.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1578} durationInFrames={255}>
        <Audio src={staticFile("audio/voiceover/showcase-07-lawbook.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1845} durationInFrames={172}>
        <Audio src={staticFile("audio/voiceover/showcase-08-stats.mp3")} volume={0.92} />
      </Sequence>
      <Sequence from={1910} durationInFrames={190}>
        <Audio src={staticFile("audio/voiceover/showcase-09-cta.mp3")} volume={0.92} />
      </Sequence>

      {/* ── SFX: Scene transition whooshes — barely perceptible ── */}
      {[95, 425, 655, 935, 1265, 1565, 1835, 1895].map((f) => (
        <Sequence key={`whoosh-${f}`} from={f} durationInFrames={15}>
          <Audio src={staticFile("audio/sfx/whoosh.mp3")} volume={0.04} />
        </Sequence>
      ))}

      {/* Gavel wood on sessions scene */}
      <Sequence from={110} durationInFrames={15}>
        <Audio src={staticFile("audio/sfx/gavel-wood.mp3")} volume={0.25} />
      </Sequence>

      {/* ── SFX: Chime on CTA ── */}
      <Sequence from={1905} durationInFrames={50}>
        <Audio src={staticFile("audio/sfx/chime.mp3")} volume={0.15} />
      </Sequence>

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 1 — Cold Open: "RATIO. More than practice."
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[0], frame) && (
        <Sequence from={S[0].start} durationInFrames={S[0].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[0], frame),
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            {/* Logo */}
            <TextReveal frame={frame - S[0].start} delay={5}>
              <div style={{
                fontFamily: SERIF, fontSize: 52, fontWeight: 700,
                color: GOLD, letterSpacing: 3,
              }}>
                RATIO.
              </div>
            </TextReveal>
            <GoldLine width={160} delay={15} frame={frame - S[0].start} />
            <TextReveal frame={frame - S[0].start} delay={22}>
              <div style={{
                fontFamily: SANS, fontSize: 16, color: TEXT_SEC,
                letterSpacing: 2, textTransform: "uppercase", marginTop: 4,
              }}>
                More than practice
              </div>
            </TextReveal>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 2 — Sessions: Animated role slots
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[1], frame) && (
        <Sequence from={S[1].start} durationInFrames={S[1].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[1], frame),
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: "0 10px",
          }}>
            <TextReveal frame={frame - S[1].start} delay={0} style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: SERIF, fontSize: 24, color: TEXT,
                fontWeight: 600, textAlign: "center", lineHeight: 1.3,
              }}>
                Book a moot court<br />in minutes
              </div>
            </TextReveal>
            <SessionRolesCard frame={frame - S[1].start} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 3 — Rankings: Animated podium bars
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[2], frame) && (
        <Sequence from={S[2].start} durationInFrames={S[2].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[2], frame),
            display: "flex", flexDirection: "column",
            justifyContent: "center",
          }}>
            <TextReveal frame={frame - S[2].start} delay={0} style={{
              textAlign: "center", marginBottom: 16,
            }}>
              <div style={{
                fontFamily: SERIF, fontSize: 24, color: TEXT,
                fontWeight: 600,
              }}>
                See where you stand
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 13, color: TEXT_SEC, marginTop: 6,
              }}>
                Rise through the ranks nationally
              </div>
            </TextReveal>
            <PodiumChart frame={frame - S[2].start} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 4 — Chambers: Coloured inn cards
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[3], frame) && (
        <Sequence from={S[3].start} durationInFrames={S[3].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[3], frame),
            display: "flex", flexDirection: "column",
            justifyContent: "center",
          }}>
            <TextReveal frame={frame - S[3].start} delay={0} style={{
              textAlign: "center", marginBottom: 20, padding: "0 30px",
            }}>
              <div style={{
                fontFamily: SERIF, fontSize: 24, color: TEXT,
                fontWeight: 600,
              }}>
                Choose your Inn
              </div>
            </TextReveal>
            <ChamberCards frame={frame - S[3].start} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 5 — Parliament: Voting bar
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[4], frame) && (
        <Sequence from={S[4].start} durationInFrames={S[4].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[4], frame),
            display: "flex", flexDirection: "column",
            justifyContent: "center",
          }}>
            <TextReveal frame={frame - S[4].start} delay={0} style={{
              textAlign: "center", marginBottom: 20, padding: "0 30px",
            }}>
              <div style={{
                fontFamily: SERIF, fontSize: 24, color: TEXT,
                fontWeight: 600,
              }}>
                Shape the constitution
              </div>
            </TextReveal>
            <VotingBar frame={frame - S[4].start} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 6 — Badges: Unlocking grid
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[5], frame) && (
        <Sequence from={S[5].start} durationInFrames={S[5].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[5], frame),
            display: "flex", flexDirection: "column",
            justifyContent: "center",
          }}>
            <TextReveal frame={frame - S[5].start} delay={0} style={{
              textAlign: "center", marginBottom: 20, padding: "0 30px",
            }}>
              <div style={{
                fontFamily: SERIF, fontSize: 24, color: TEXT,
                fontWeight: 600,
              }}>
                Earn your milestones
              </div>
            </TextReveal>
            <BadgeGrid frame={frame - S[5].start} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 7 — Law Book: Module category cards
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[6], frame) && (
        <Sequence from={S[6].start} durationInFrames={S[6].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[6], frame),
            display: "flex", flexDirection: "column",
            justifyContent: "center",
          }}>
            <TextReveal frame={frame - S[6].start} delay={0} style={{
              textAlign: "center", marginBottom: 16, padding: "0 30px",
            }}>
              <div style={{
                fontFamily: SERIF, fontSize: 22, color: TEXT,
                fontWeight: 600,
              }}>
                40+ Legal Modules
              </div>
            </TextReveal>
            <ModuleCards frame={frame - S[6].start} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 8 — Stats: Counter animation
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[7], frame) && (
        <Sequence from={S[7].start} durationInFrames={S[7].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[7], frame),
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <CounterAnimation frame={frame - S[7].start} />
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          SCENE 9 — CTA: Logo + button + URL
          ═══════════════════════════════════════════════════════════════════ */}
      {isVisible(S[8], frame) && (
        <Sequence from={S[8].start} durationInFrames={S[8].dur}>
          <AbsoluteFill style={{
            opacity: sceneFade(S[8], frame),
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <TextReveal frame={frame - S[8].start} delay={5}>
              <div style={{
                fontFamily: SERIF, fontSize: 48, fontWeight: 700,
                color: GOLD, letterSpacing: 3, textAlign: "center",
              }}>
                RATIO.
              </div>
            </TextReveal>
            <TextReveal frame={frame - S[8].start} delay={15}>
              <div style={{
                fontFamily: SERIF, fontSize: 18, color: TEXT,
                textAlign: "center", marginTop: 6,
                fontStyle: "italic",
              }}>
                The Digital Court Society
              </div>
            </TextReveal>
            <GoldLine width={180} delay={22} frame={frame - S[8].start} thickness={2} />

            {/* CTA Button */}
            <TextReveal frame={frame - S[8].start} delay={35}>
              <div style={{
                marginTop: 24,
                background: `linear-gradient(135deg, ${GOLD}, #B8973F)`,
                borderRadius: 14, padding: "14px 40px",
                boxShadow: `0 4px 20px rgba(201, 168, 76, 0.3)`,
              }}>
                <div style={{
                  fontFamily: SANS, fontSize: 15, fontWeight: 700,
                  color: NAVY, letterSpacing: 0.5,
                }}>
                  Join as an Advocate
                </div>
              </div>
            </TextReveal>

            {/* Free for students */}
            <TextReveal frame={frame - S[8].start} delay={48}>
              <div style={{
                fontFamily: SANS, fontSize: 12, color: TEXT_SEC,
                marginTop: 14, letterSpacing: 0.5,
              }}>
                Free for UK law students
              </div>
            </TextReveal>

            {/* URL */}
            <TextReveal frame={frame - S[8].start} delay={60}>
              <div style={{
                fontFamily: SANS, fontSize: 11, color: TEXT_TER,
                marginTop: 20, letterSpacing: 0.8,
              }}>
                ratiothedigitalcourtsociety.com
              </div>
            </TextReveal>
          </AbsoluteFill>
        </Sequence>
      )}

      {/* ── Overlays ── */}
      <Vignette intensity={0.5} />
      <FilmGrain frame={frame} opacity={0.03} />
      <CaptionOverlay frame={frame} captions={CAPTIONS} />
    </AbsoluteFill>
  );
};
