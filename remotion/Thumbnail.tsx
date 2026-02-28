import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";

/* ───────────────────────── shared helpers ───────────────────────── */

const NAVY = "#0C1220";
const NAVY_MID = "#131E30";
const NAVY_CARD = "#182640";
const GOLD = "#C9A84C";
const GOLD_DIM = "rgba(201, 168, 76, 0.12)";
const BURGUNDY = "#6B2D3E";
const COURT_TEXT = "#F2EDE6";
const COURT_SEC = "rgba(242, 237, 230, 0.6)";
const COURT_TER = "rgba(242, 237, 230, 0.3)";

/* ───────────────────── Vignette (reused from videos) ──────────── */

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
      pointerEvents: "none",
    }}
  />
);

/* ───────────────────── Gold Particles ──────────────────────────── */

const GoldParticles: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      x: ((i * 137.508) % 100),
      y: ((i * 73.13) % 100),
      size: 1.5 + (i % 4) * 0.8,
      speed: 0.3 + (i % 5) * 0.15,
      phase: (i * 2.39996) % (Math.PI * 2),
    }));
  }, [count]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const drift = Math.sin(frame * 0.02 * p.speed + p.phase) * 15;
        const yOff = ((frame * p.speed * 0.3) % 120) - 10;
        const opacity = interpolate(
          Math.sin(frame * 0.03 + p.phase),
          [-1, 1],
          [0.15, 0.6]
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${p.x + drift * 0.1}%`,
              top: `${p.y - yOff * 0.1}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: GOLD,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────────────── Film Grain ──────────────────────────────── */

const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='${frame}' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        backgroundSize: "256px 256px",
        opacity: 0.5,
        pointerEvents: "none",
        mixBlendMode: "overlay",
      }}
    />
  );
};

/* ───────────────────── Gold Line ───────────────────────────────── */

const GoldLine: React.FC<{ width?: number; thickness?: number }> = ({
  width = 60,
  thickness = 2,
}) => (
  <div
    style={{
      width,
      height: thickness,
      background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
      margin: "0 auto",
    }}
  />
);

/* ═══════════════════════════════════════════════════════════════════
   THUMBNAIL 1 — General RATIO Thumbnail (9:16, matches video format)
   ═══════════════════════════════════════════════════════════════════ */

export const ThumbnailGeneral: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        fontFamily: "DM Sans, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Radial glow behind logo */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201, 168, 76, 0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Decorative top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "0 40px",
          zIndex: 1,
        }}
      >
        {/* RATIO. logo */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 72,
            fontWeight: 700,
            color: GOLD,
            letterSpacing: 12,
            textTransform: "uppercase",
          }}
        >
          RATIO.
        </div>

        <GoldLine width={120} thickness={2} />

        {/* Tagline */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 22,
            color: COURT_TEXT,
            textAlign: "center",
            letterSpacing: 3,
            textTransform: "uppercase",
            lineHeight: 1.6,
          }}
        >
          The Digital Court Society
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 32,
            alignItems: "center",
          }}
        >
          {[
            "AI Advocacy Training",
            "Live Moot Courts",
            "National Rankings",
          ].map((text, i) => (
            <div
              key={i}
              style={{
                padding: "10px 24px",
                borderRadius: 20,
                border: `1px solid rgba(201, 168, 76, 0.3)`,
                backgroundColor: GOLD_DIM,
                color: GOLD,
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 40,
            padding: "14px 40px",
            borderRadius: 14,
            backgroundColor: GOLD,
            color: NAVY,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Free for UK Law Students
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 12,
            color: COURT_TER,
            letterSpacing: 1,
            marginTop: 8,
          }}
        >
          ratiothedigitalcourtsociety.com
        </div>
      </div>

      <GoldParticles count={25} />
      <Vignette />
      <FilmGrain />

      {/* Bottom gold border */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   THUMBNAIL 2 — Moot Court Thumbnail
   ═══════════════════════════════════════════════════════════════════ */

export const ThumbnailMootCourt: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        fontFamily: "DM Sans, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201, 168, 76, 0.12) 0%, transparent 70%)`,
        }}
      />

      {/* Top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          padding: "0 36px",
          zIndex: 1,
        }}
      >
        {/* Small RATIO wordmark */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 28,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          RATIO.
        </div>

        <GoldLine width={80} />

        {/* Main heading */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 44,
            fontWeight: 700,
            color: COURT_TEXT,
            textAlign: "center",
            lineHeight: 1.2,
            letterSpacing: 1,
          }}
        >
          AI Advocacy{"\n"}Training
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 16,
            color: COURT_SEC,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 280,
          }}
        >
          Argue before an AI Judge. Get scored across seven dimensions.
        </div>

        {/* Mock score display */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {/* Score circle */}
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              border: `3px solid ${GOLD}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(201, 168, 76, 0.08)",
            }}
          >
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 36,
                fontWeight: 700,
                color: GOLD,
                lineHeight: 1,
              }}
            >
              78
            </div>
            <div style={{ fontSize: 10, color: COURT_SEC, marginTop: 2 }}>
              / 100
            </div>
          </div>

          {/* Mini dimension bars */}
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "flex-end",
              height: 30,
            }}
          >
            {[0.85, 0.72, 0.68, 0.91, 0.65, 0.78, 0.74].map((v, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 30 * v,
                  borderRadius: 2,
                  backgroundColor:
                    v > 0.8
                      ? GOLD
                      : v > 0.7
                        ? "rgba(201, 168, 76, 0.6)"
                        : "rgba(201, 168, 76, 0.35)",
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 10, color: COURT_TER, letterSpacing: 1 }}>
            7 DIMENSIONS OF ADVOCACY
          </div>
        </div>

        {/* Personas */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 16,
          }}
        >
          {["Strict", "Socratic", "Pragmatic", "Standard"].map((p, i) => (
            <div
              key={i}
              style={{
                padding: "6px 12px",
                borderRadius: 12,
                border: `1px solid rgba(201, 168, 76, ${i === 1 ? "0.6" : "0.2"})`,
                backgroundColor:
                  i === 1 ? GOLD_DIM : "rgba(255,255,255,0.03)",
                color: i === 1 ? GOLD : COURT_SEC,
                fontSize: 11,
                fontWeight: i === 1 ? 600 : 400,
              }}
            >
              {p}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 28,
            padding: "12px 32px",
            borderRadius: 14,
            backgroundColor: GOLD,
            color: NAVY,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Start Practice
        </div>
      </div>

      <GoldParticles count={20} />
      <Vignette />
      <FilmGrain />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   THUMBNAIL 3 — Constitutional Law Thumbnail
   ═══════════════════════════════════════════════════════════════════ */

export const ThumbnailConstitutionalLaw: React.FC = () => {
  const cases = [
    { name: "Entick v Carrington", year: "1765" },
    { name: "Factortame", year: "1990" },
    { name: "Miller (No 1)", year: "2017" },
    { name: "Miller (No 2)", year: "2019" },
  ];

  const topics = [
    "Parliamentary Sovereignty",
    "Rule of Law",
    "Judicial Review",
    "Separation of Powers",
    "Human Rights Act",
    "Royal Prerogative",
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        fontFamily: "DM Sans, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle burgundy glow for constitutional law */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(107, 45, 62, 0.15) 0%, transparent 60%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201, 168, 76, 0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${BURGUNDY}, ${GOLD}, ${BURGUNDY}, transparent)`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "0 32px",
          zIndex: 1,
        }}
      >
        {/* RATIO wordmark */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 24,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          RATIO.
        </div>

        <GoldLine width={80} />

        {/* Main heading */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 40,
            fontWeight: 700,
            color: COURT_TEXT,
            textAlign: "center",
            lineHeight: 1.15,
            letterSpacing: 1,
          }}
        >
          Constitutional{"\n"}Law
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 14,
            color: COURT_SEC,
            textAlign: "center",
            lineHeight: 1.5,
            maxWidth: 300,
          }}
        >
          The foundation of the legal system. Practice the landmark cases.
        </div>

        {/* Topic grid */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
            marginTop: 12,
            maxWidth: 340,
          }}
        >
          {topics.map((topic, i) => (
            <div
              key={i}
              style={{
                padding: "5px 14px",
                borderRadius: 14,
                border: `1px solid rgba(201, 168, 76, 0.25)`,
                backgroundColor: GOLD_DIM,
                color: GOLD,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {topic}
            </div>
          ))}
        </div>

        {/* Key cases */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            width: "100%",
            maxWidth: 300,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: COURT_TER,
              letterSpacing: 2,
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            Landmark Cases
          </div>
          {cases.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 16px",
                borderRadius: 10,
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div
                style={{
                  fontFamily: "Cormorant Garamond, Georgia, serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: COURT_TEXT,
                  fontStyle: "italic",
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: GOLD,
                  fontWeight: 600,
                }}
              >
                {c.year}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 20,
            padding: "12px 32px",
            borderRadius: 14,
            backgroundColor: GOLD,
            color: NAVY,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Start Practice
        </div>

        <div
          style={{
            fontSize: 11,
            color: COURT_TER,
            letterSpacing: 0.5,
          }}
        >
          Free for UK Law Students
        </div>
      </div>

      <GoldParticles count={20} />
      <Vignette />
      <FilmGrain />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${BURGUNDY}, ${GOLD}, ${BURGUNDY}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   THUMBNAIL 4 — Live Session Thumbnail
   ═══════════════════════════════════════════════════════════════════ */

export const ThumbnailLiveSession: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: NAVY,
        fontFamily: "DM Sans, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201, 168, 76, 0.1) 0%, transparent 70%)`,
        }}
      />

      {/* Top border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "0 28px",
          zIndex: 1,
          width: "100%",
        }}
      >
        {/* RATIO wordmark */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 24,
            fontWeight: 600,
            color: GOLD,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          RATIO.
        </div>

        <GoldLine width={80} />

        {/* Main heading */}
        <div
          style={{
            fontFamily: "Cormorant Garamond, Georgia, serif",
            fontSize: 36,
            fontWeight: 700,
            color: COURT_TEXT,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          Live AI{"\n"}Court Session
        </div>

        {/* Mock chat bubbles */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            width: "100%",
            maxWidth: 330,
          }}
        >
          {/* Session header */}
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              backgroundColor: NAVY_CARD,
              border: `1px solid rgba(201, 168, 76, 0.2)`,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#4ADE80",
              }}
            />
            <div style={{ fontSize: 11, color: GOLD, fontWeight: 600 }}>
              Session in Progress
            </div>
          </div>

          {/* Judge message */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: NAVY_CARD,
              borderLeft: `3px solid ${GOLD}`,
              maxWidth: "85%",
            }}
          >
            <div
              style={{
                fontFamily: "Cormorant Garamond, Georgia, serif",
                fontSize: 11,
                color: GOLD,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Justice AI
            </div>
            <div
              style={{
                fontSize: 12,
                color: COURT_TEXT,
                lineHeight: 1.4,
                fontStyle: "italic",
              }}
            >
              "Counsel, what is the ratio in Factortame? Apply it to the facts
              before this court."
            </div>
            {/* Sound wave indicator */}
            <div
              style={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.3].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 2,
                    height: 8 * h,
                    borderRadius: 1,
                    backgroundColor: GOLD,
                    opacity: 0.6,
                  }}
                />
              ))}
              <div
                style={{
                  fontSize: 9,
                  color: COURT_TER,
                  marginLeft: 6,
                }}
              >
                Voice enabled
              </div>
            </div>
          </div>

          {/* Advocate message */}
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              maxWidth: "85%",
              alignSelf: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: COURT_SEC,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              You (Counsel)
            </div>
            <div
              style={{
                fontSize: 12,
                color: COURT_TEXT,
                lineHeight: 1.4,
              }}
            >
              "My Lord, in Factortame, the House of Lords held that European
              Community law must be given primacy..."
            </div>
          </div>

          {/* Typing indicator */}
          <div
            style={{
              padding: "8px 16px",
              borderRadius: 12,
              backgroundColor: NAVY_CARD,
              borderLeft: `3px solid ${GOLD}`,
              maxWidth: 100,
              display: "flex",
              gap: 4,
              alignItems: "center",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: GOLD,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 16,
            padding: "12px 32px",
            borderRadius: 14,
            backgroundColor: GOLD,
            color: NAVY,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Watch a Session
        </div>
      </div>

      <GoldParticles count={15} />
      <Vignette />
      <FilmGrain />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
