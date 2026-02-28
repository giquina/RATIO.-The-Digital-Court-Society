import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
} from "remotion";

// ── Brand Tokens ──

const GOLD = "#C9A84C";
const NAVY = "#0C1220";
const NAVY_MID = "#131E30";
const TEXT = "#F2EDE6";
const TEXT_SEC = "rgba(242, 237, 230, 0.6)";
const BURGUNDY = "#6B2D3E";

// ── Scene Timeline (30fps) ──

interface Scene {
  id: string;
  start: number;
  dur: number;
}

const SCENES: Scene[] = [
  { id: "intro",          start: 0,   dur: 75  },  //  0.0–2.5s  Brand intro
  { id: "hook",           start: 65,  dur: 75  },  //  2.2–4.7s  Problem statement
  { id: "mode-select",    start: 130, dur: 80  },  //  4.3–7.0s  Choose your judge
  { id: "briefing",       start: 200, dur: 80  },  //  6.7–9.3s  Case brief
  { id: "session-open",   start: 270, dur: 80  },  //  9.0–11.7s Court opens
  { id: "session-active", start: 340, dur: 80  },  // 11.3–14.0s Active exchange
  { id: "feedback",       start: 410, dur: 80  },  // 13.7–16.3s Your score
  { id: "cta",            start: 480, dur: 120 },  // 16.0–20.0s Join CTA
];

// ── Helpers ──

function sceneProgress(scene: Scene, frame: number) {
  const local = frame - scene.start;
  return {
    local,
    progress: Math.max(0, Math.min(1, local / scene.dur)),
    visible: local >= -20 && local <= scene.dur + 20,
  };
}

function fade(local: number, dur: number) {
  const fadeIn = interpolate(local, [-15, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(local, [dur - 15, dur + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return fadeIn * fadeOut;
}

// ── Reusable ──

function GoldLine({ width, delay, frame }: { width: number; delay: number; frame: number }) {
  const w = interpolate(frame - delay, [0, 20], [0, width], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: w,
        height: 1,
        background: `linear-gradient(90deg, ${GOLD}, transparent)`,
        margin: "8px auto",
      }}
    />
  );
}

function SlideIn({
  children,
  frame,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  frame: number;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const f = frame - delay;
  const opacity = interpolate(f, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(f, [0, 15], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>;
}

function PhoneMockup({ src, frame, delay = 0 }: { src: string; frame: number; delay?: number }) {
  const f = frame - delay;
  const opacity = interpolate(f, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(f, [0, 20], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s = interpolate(f, [0, 20], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${s * 0.82})`,
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

// ── Scene Components ──

function IntroScene({ frame }: { frame: number }) {
  const { local, visible } = sceneProgress(SCENES[0], frame);
  if (!visible) return null;
  const opacity = fade(local, SCENES[0].dur);

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
      <SlideIn frame={local} delay={5}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: TEXT,
            textAlign: "center",
          }}
        >
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </SlideIn>
      <GoldLine width={60} delay={20} frame={local} />
      <SlideIn frame={local} delay={25}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 13,
            color: TEXT_SEC,
            textAlign: "center",
            marginTop: 8,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          AI Advocacy Training
        </div>
      </SlideIn>
    </AbsoluteFill>
  );
}

function HookScene({ frame }: { frame: number }) {
  const { local, visible } = sceneProgress(SCENES[1], frame);
  if (!visible) return null;
  const opacity = fade(local, SCENES[1].dur);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 28px",
        background: NAVY,
      }}
    >
      <SlideIn frame={local} delay={0}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28,
            fontWeight: 700,
            color: TEXT,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          How do you prepare for
          <br />
          <span style={{ color: GOLD }}>the courtroom</span>
          <br />
          before you get there?
        </div>
      </SlideIn>
      <GoldLine width={40} delay={15} frame={local} />
      <SlideIn frame={local} delay={20}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14,
            color: TEXT_SEC,
            textAlign: "center",
            marginTop: 16,
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          Argue before an AI Judge. Get scored on 7 dimensions. Practise anytime, anywhere.
        </div>
      </SlideIn>
    </AbsoluteFill>
  );
}

function FeatureScene({
  frame,
  sceneIdx,
  title,
  description,
  screenshotSrc,
}: {
  frame: number;
  sceneIdx: number;
  title: string;
  description: string;
  screenshotSrc: string;
}) {
  const scene = SCENES[sceneIdx];
  const { local, visible } = sceneProgress(scene, frame);
  if (!visible) return null;
  const opacity = fade(local, scene.dur);

  return (
    <AbsoluteFill
      style={{
        opacity,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 24px",
        background: NAVY,
      }}
    >
      <SlideIn frame={local} delay={0} style={{ textAlign: "center", marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22,
            fontWeight: 700,
            color: TEXT,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 12,
            color: TEXT_SEC,
            lineHeight: 1.5,
            maxWidth: 280,
          }}
        >
          {description}
        </div>
        <GoldLine width={30} delay={8} frame={local} />
      </SlideIn>
      <PhoneMockup src={screenshotSrc} frame={local} delay={10} />
    </AbsoluteFill>
  );
}

function CTAScene({ frame }: { frame: number }) {
  const { local, visible } = sceneProgress(SCENES[7], frame);
  if (!visible) return null;
  const fadeIn = interpolate(local, [-15, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
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
      <SlideIn frame={local} delay={5}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: TEXT,
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          RATIO<span style={{ color: GOLD }}>.</span>
        </div>
      </SlideIn>
      <GoldLine width={50} delay={15} frame={local} />
      <SlideIn frame={local} delay={20}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 14,
            color: TEXT_SEC,
            textAlign: "center",
            marginTop: 16,
            lineHeight: 1.7,
            maxWidth: 260,
          }}
        >
          Free for UK law students.
          <br />
          Train with AI. Score your advocacy.
        </div>
      </SlideIn>
      <SlideIn frame={local} delay={30}>
        <div
          style={{
            marginTop: 28,
            padding: "14px 36px",
            borderRadius: 12,
            background: `linear-gradient(135deg, ${GOLD}, #B8943F)`,
            color: NAVY,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          Start Practice
        </div>
      </SlideIn>
      <SlideIn frame={local} delay={40}>
        <div
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: 11,
            color: `rgba(201,168,76,0.6)`,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          ratiothedigitalcourtsociety.com
        </div>
      </SlideIn>
    </AbsoluteFill>
  );
}

// ── Main Composition ──

export const MootCourtPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_MID} 50%, ${NAVY} 100%)`,
        }}
      />

      {/* Scene 1: Brand intro */}
      <IntroScene frame={frame} />

      {/* Scene 2: Hook / problem */}
      <HookScene frame={frame} />

      {/* Scene 3: Choose your AI persona */}
      <FeatureScene
        frame={frame}
        sceneIdx={2}
        title="Choose Your AI Judge"
        description="Four judicial temperaments. Adversarial, strict, pragmatist, or Socratic."
        screenshotSrc={staticFile("screenshots/mobile/moot-court-mobile.png")}
      />

      {/* Scene 4: Case briefing */}
      <FeatureScene
        frame={frame}
        sceneIdx={3}
        title="Your Case Brief"
        description="Real constitutional law scenarios. Key authorities. Your role as counsel."
        screenshotSrc={staticFile("screenshots/mobile/ai-briefing-case.png")}
      />

      {/* Scene 5: Court opens */}
      <FeatureScene
        frame={frame}
        sceneIdx={4}
        title="The Court is in Session"
        description="Real-time exchanges with the AI Judge. Voice input. Quick phrases. 15-minute timer."
        screenshotSrc={staticFile("screenshots/mobile/ai-session-live.png")}
      />

      {/* Scene 6: Active courtroom exchange */}
      <FeatureScene
        frame={frame}
        sceneIdx={5}
        title="Argue Your Case"
        description="The Judge challenges your submissions. Distinguish authorities. Think on your feet."
        screenshotSrc={staticFile("screenshots/mobile/ai-session-exchange.png")}
      />

      {/* Scene 7: Feedback & score */}
      <FeatureScene
        frame={frame}
        sceneIdx={6}
        title="Your Judgment"
        description="Scored across 7 dimensions. Written feedback. Actionable improvement areas."
        screenshotSrc={staticFile("screenshots/mobile/ai-feedback-score.png")}
      />

      {/* Scene 8: CTA */}
      <CTAScene frame={frame} />

      {/* Progress bar */}
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
