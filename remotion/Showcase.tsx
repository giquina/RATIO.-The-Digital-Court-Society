import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  staticFile,
  Sequence,
} from "remotion";

// ── Constants ──

const GOLD = "#C9A84C";
const NAVY = "#0C1220";
const NAVY_MID = "#131E30";
const TEXT_PRIMARY = "#F2EDE6";
const TEXT_SEC = "rgba(242, 237, 230, 0.6)";

// ── Scenes Config ──
// Each scene gets a time window defined in frames (at 30fps)

interface Scene {
  id: string;
  startFrame: number;
  durationFrames: number;
}

const SCENES: Scene[] = [
  { id: "intro", startFrame: 0, durationFrames: 90 }, // 0-3s
  { id: "dashboard", startFrame: 75, durationFrames: 100 }, // 2.5-5.8s
  { id: "ai-practice", startFrame: 165, durationFrames: 100 }, // 5.5-8.8s
  { id: "sessions", startFrame: 255, durationFrames: 100 }, // 8.5-11.8s
  { id: "law-book", startFrame: 345, durationFrames: 100 }, // 11.5-14.8s
  { id: "community", startFrame: 435, durationFrames: 90 }, // 14.5-17.5s
  { id: "cta", startFrame: 510, durationFrames: 150 }, // 17-22s
];

// ── Helper: scene-local progress 0→1 ──

function useSceneProgress(scene: Scene, frame: number) {
  const local = frame - scene.startFrame;
  const progress = Math.max(0, Math.min(1, local / scene.durationFrames));
  return { local, progress, active: local >= 0 && local <= scene.durationFrames };
}

// ── Reusable Components ──

function GoldLine({ width, delay, frame }: { width: number; delay: number; frame: number }) {
  const lineWidth = interpolate(frame - delay, [0, 20], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: lineWidth,
        height: 1,
        background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        margin: "0 auto",
      }}
    />
  );
}

function FadeSlideIn({
  children,
  frame,
  delay = 0,
  direction = "up",
  style = {},
}: {
  children: React.ReactNode;
  frame: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  style?: React.CSSProperties;
}) {
  const f = frame - delay;
  const opacity = interpolate(f, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const offsetMap = { up: [20, 0], down: [-20, 0], left: [20, 0], right: [-20, 0] };
  const [from, to] = offsetMap[direction];
  const translate = interpolate(f, [0, 15], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const axis = direction === "up" || direction === "down" ? "Y" : "X";
  return (
    <div
      style={{
        opacity,
        transform: `translate${axis}(${translate}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Showcase Phone Mockup ──

function PhoneMockup({
  src,
  frame,
  delay = 0,
  scale = 0.85,
}: {
  src: string;
  frame: number;
  delay?: number;
  scale?: number;
}) {
  const f = frame - delay;
  const opacity = interpolate(f, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(f, [0, 20], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = interpolate(f, [0, 20], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${s * scale})`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 280,
          borderRadius: 32,
          overflow: "hidden",
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15)`,
          border: `2px solid rgba(201,168,76,0.2)`,
        }}
      >
        <Img src={src} style={{ width: "100%", display: "block" }} />
      </div>
    </div>
  );
}

// ── Scene: Intro ──

function IntroScene({ frame }: { frame: number }) {
  const scene = SCENES[0];
  const { local, active } = useSceneProgress(scene, frame);
  if (!active && local > scene.durationFrames + 30) return null;

  const fadeOut = interpolate(local, [70, 90], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: NAVY,
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)`,
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      <FadeSlideIn frame={frame} delay={5}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: TEXT_PRIMARY,
            textAlign: "center",
          }}
        >
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </FadeSlideIn>

      <GoldLine width={60} delay={20} frame={frame} />

      <FadeSlideIn frame={frame} delay={25}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14,
            color: TEXT_SEC,
            textAlign: "center",
            marginTop: 16,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            maxWidth: 280,
            lineHeight: 1.6,
          }}
        >
          The Digital Constitutional Society
        </div>
      </FadeSlideIn>

      <FadeSlideIn frame={frame} delay={40}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 12,
            color: `rgba(201,168,76,0.7)`,
            textAlign: "center",
            marginTop: 8,
            letterSpacing: "0.04em",
          }}
        >
          For UK Law Students
        </div>
      </FadeSlideIn>
    </AbsoluteFill>
  );
}

// ── Scene: Feature showcase (reusable) ──

function FeatureScene({
  frame,
  scene,
  title,
  description,
  screenshotSrc,
  accentColor = GOLD,
}: {
  frame: number;
  scene: Scene;
  title: string;
  description: string;
  screenshotSrc: string;
  accentColor?: string;
}) {
  const { local, active } = useSceneProgress(scene, frame);
  if (!active && local < -15) return null;
  if (!active && local > scene.durationFrames + 30) return null;

  const fadeIn = interpolate(local, [-15, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(local, [scene.durationFrames - 15, scene.durationFrames + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn * fadeOut,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 24px",
        background: NAVY,
      }}
    >
      {/* Title + description */}
      <FadeSlideIn frame={local} delay={0} style={{ textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 24,
            fontWeight: 700,
            color: TEXT_PRIMARY,
            marginBottom: 8,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13,
            color: TEXT_SEC,
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          {description}
        </div>
        <GoldLine width={40} delay={10} frame={local} />
      </FadeSlideIn>

      {/* Screenshot mockup */}
      <PhoneMockup src={screenshotSrc} frame={local} delay={12} />
    </AbsoluteFill>
  );
}

// ── Scene: CTA ──

function CTAScene({ frame }: { frame: number }) {
  const scene = SCENES[6];
  const { local, active } = useSceneProgress(scene, frame);
  if (!active && local < -15) return null;

  const fadeIn = interpolate(local, [-15, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow effect
  const glowScale = interpolate(Math.sin(local * 0.08), [-1, 1], [0.95, 1.05]);

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 24px",
        background: NAVY,
      }}
    >
      {/* Gold radial glow */}
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)`,
          top: "35%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${glowScale})`,
        }}
      />

      <FadeSlideIn frame={local} delay={5}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: TEXT_PRIMARY,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </FadeSlideIn>

      <GoldLine width={50} delay={15} frame={local} />

      <FadeSlideIn frame={local} delay={20}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13,
            color: TEXT_SEC,
            textAlign: "center",
            marginTop: 20,
            lineHeight: 1.7,
            maxWidth: 260,
          }}
        >
          Free forever. Built for UK law students. 142 universities supported.
        </div>
      </FadeSlideIn>

      <FadeSlideIn frame={local} delay={30}>
        <div
          style={{
            marginTop: 28,
            padding: "12px 32px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${GOLD}, #B8943F)`,
            color: NAVY,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          Join as an Advocate
        </div>
      </FadeSlideIn>

      <FadeSlideIn frame={local} delay={40}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11,
            color: `rgba(201,168,76,0.6)`,
            textAlign: "center",
            marginTop: 16,
            letterSpacing: "0.03em",
          }}
        >
          ratiothedigitalcourtsociety.com
        </div>
      </FadeSlideIn>
    </AbsoluteFill>
  );
}

// ── Main Composition ──

export const RatioShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* Background gradient overlay — always present */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)`,
        }}
      />

      {/* Intro */}
      <IntroScene frame={frame} />

      {/* Dashboard Preview */}
      <FeatureScene
        frame={frame}
        scene={SCENES[1]}
        title="Your Dashboard"
        description="Track your advocacy journey. Practice streaks, session history, and skill progress — all in one place."
        screenshotSrc={staticFile("screenshots/mobile/dashboard-mobile.png")}
      />

      {/* AI Practice */}
      <FeatureScene
        frame={frame}
        scene={SCENES[2]}
        title="AI Advocacy Training"
        description="Practice against an AI Judge. Real-time feedback on argumentation, legal reasoning, and case strategy."
        screenshotSrc={staticFile("screenshots/mobile/ai-practice-mobile.png")}
      />

      {/* Sessions */}
      <FeatureScene
        frame={frame}
        scene={SCENES[3]}
        title="Live Video Mooting"
        description="Schedule and join live moot court sessions with peers. Video, roles, and structured format."
        screenshotSrc={staticFile("screenshots/mobile/sessions-mobile.png")}
      />

      {/* Law Book */}
      <FeatureScene
        frame={frame}
        scene={SCENES[4]}
        title="The Law Book"
        description="17 modules. 300+ topics. Core qualifying subjects, professional practice, specialist areas, and jurisprudence."
        screenshotSrc={staticFile("screenshots/mobile/law-book-mobile.png")}
      />

      {/* Community */}
      <FeatureScene
        frame={frame}
        scene={SCENES[5]}
        title="The Community"
        description="Connect with advocates from 142 UK universities. Follow, commend, and rise through the ranks."
        screenshotSrc={staticFile("screenshots/mobile/community-mobile.png")}
      />

      {/* CTA */}
      <CTAScene frame={frame} />

      {/* Progress bar at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          height: 3,
          background: `linear-gradient(90deg, ${GOLD}, transparent)`,
          width: `${(frame / durationInFrames) * 100}%`,
          opacity: frame > 60 ? 0.6 : 0,
        }}
      />
    </AbsoluteFill>
  );
};
