import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
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
          background: "linear-gradient(135deg, #0C1220 0%, #131E30 50%, #182640 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Decorative border */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1px solid rgba(201, 168, 76, 0.15)",
            borderRadius: 16,
            display: "flex",
          }}
        />

        {/* Scale icon (simplified) */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#C9A84C"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v19" />
          <path d="M5 8l7-2 7 2" />
          <path d="m5 8-2 7a5 5 0 0 0 4 0l-2-7" />
          <path d="m19 8-2 7a5 5 0 0 0 4 0l-2-7" />
          <path d="M9 21h6" />
        </svg>

        {/* RATIO. text */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: 24,
            letterSpacing: "0.2em",
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#F2EDE6",
            }}
          >
            RATIO
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#C9A84C",
            }}
          >
            .
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(242, 237, 230, 0.5)",
            letterSpacing: "0.15em",
            marginTop: 12,
            textTransform: "uppercase",
          }}
        >
          The Digital Court Society
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(242, 237, 230, 0.3)",
            marginTop: 20,
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          The constitutional training ground for UK legal education
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
