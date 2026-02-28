import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Dynamic OG image for shared Moot Court results.
 *
 * Query params:
 *   s  = overall score (e.g. "3.5")
 *   a  = area of law  (e.g. "Public Law")
 *   j  = judge name   (e.g. "The Honourable Justice AI")
 *   s1 = Argument Structure score
 *   s2 = Use of Authorities score
 *   s3 = Oral Delivery score
 *   s4 = Response to Interventions score
 *
 * This image appears as the WhatsApp/email preview card when someone
 * shares their result link.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const score = searchParams.get("s") || "—";
  const area = searchParams.get("a") || "Moot Court";
  const judge = searchParams.get("j") || "AI Judge";
  const s1 = searchParams.get("s1") || "—";
  const s2 = searchParams.get("s2") || "—";
  const s3 = searchParams.get("s3") || "—";
  const s4 = searchParams.get("s4") || "—";

  // Score colour: gold for 3.5+, white for 2.5-3.4, dimmed for below
  const scoreNum = parseFloat(score);
  const scoreColor =
    scoreNum >= 3.5
      ? "#C9A84C"
      : scoreNum >= 2.5
        ? "#F2EDE6"
        : "rgba(242,237,230,0.5)";

  // Ring arc — the gold arc around the score (SVG)
  const pct = Math.min(scoreNum / 5, 1);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = `${circumference * pct} ${circumference}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0C1220 0%, #131E30 50%, #182640 100%)",
          fontFamily: "serif",
          padding: 40,
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: "1px solid rgba(201, 168, 76, 0.15)",
            borderRadius: 16,
            display: "flex",
          }}
        />

        {/* Top: RATIO. branding */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 36, fontWeight: 700, color: "#F2EDE6", letterSpacing: "0.15em" }}>
            RATIO
          </span>
          <span style={{ fontSize: 36, fontWeight: 700, color: "#C9A84C" }}>.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 14,
            color: "rgba(242,237,230,0.35)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Session Result
        </div>

        {/* Score ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: 140,
            height: 140,
            marginBottom: 12,
          }}
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            style={{ position: "absolute" }}
          >
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(242,237,230,0.08)"
              strokeWidth="6"
            />
            {/* Score arc */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="#C9A84C"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={strokeDash}
              transform="rotate(-90 70 70)"
            />
          </svg>
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: scoreColor,
            }}
          >
            {score}
          </span>
        </div>

        {/* Out of 5 */}
        <div
          style={{
            fontSize: 14,
            color: "rgba(242,237,230,0.4)",
            marginBottom: 28,
          }}
        >
          out of 5.0
        </div>

        {/* Area of law & judge */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#F2EDE6",
            marginBottom: 6,
          }}
        >
          {area}
        </div>
        <div
          style={{
            fontSize: 14,
            color: "rgba(242,237,230,0.4)",
            marginBottom: 32,
          }}
        >
          {judge}
        </div>

        {/* Score breakdown row */}
        <div
          style={{
            display: "flex",
            gap: 32,
          }}
        >
          {[
            { label: "Argument", val: s1 },
            { label: "Authorities", val: s2 },
            { label: "Delivery", val: s3 },
            { label: "Interventions", val: s4 },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#C9A84C",
                }}
              >
                {item.val}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(242,237,230,0.35)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 12,
            color: "rgba(242,237,230,0.2)",
            letterSpacing: "0.1em",
          }}
        >
          ratiothedigitalcourtsociety.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
