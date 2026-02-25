import type { Metadata } from "next";
import Link from "next/link";

/**
 * /share/result — Public page for shared AI Practice results.
 *
 * This page is what people see when they click a RATIO result link
 * shared via WhatsApp, email, etc. It doesn't require login.
 *
 * The OG meta tags point to /api/og/result which generates a
 * custom preview image with the score and breakdown.
 *
 * Query params (same as the OG image route):
 *   s  = overall score
 *   a  = area of law
 *   j  = judge name
 *   s1 = Argument Structure
 *   s2 = Use of Authorities
 *   s3 = Oral Delivery
 *   s4 = Response to Interventions
 */

const DOMAIN = "https://ratiothedigitalcourtsociety.com";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

// Dynamic OG tags so WhatsApp/email shows the score card
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const score = params.s || "—";
  const area = params.a || "AI Practice";
  const judge = params.j || "AI Judge";

  const title = `${score}/5.0 in ${area} — RATIO.`;
  const description = `Scored ${score} out of 5.0 in ${area} with ${judge}. Practice your advocacy on RATIO. — The Digital Court Society.`;

  // Build the OG image URL with all the score params
  const ogParams = new URLSearchParams();
  if (params.s) ogParams.set("s", params.s);
  if (params.a) ogParams.set("a", params.a);
  if (params.j) ogParams.set("j", params.j);
  if (params.s1) ogParams.set("s1", params.s1);
  if (params.s2) ogParams.set("s2", params.s2);
  if (params.s3) ogParams.set("s3", params.s3);
  if (params.s4) ogParams.set("s4", params.s4);

  const ogImage = `${DOMAIN}/api/og/result?${ogParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: `${DOMAIN}/share/result?${ogParams.toString()}`,
      siteName: "Ratio.",
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// Score categories for the breakdown
const CATEGORIES = [
  { key: "s1", label: "Argument Structure", icon: "⚖️" },
  { key: "s2", label: "Use of Authorities", icon: "📑" },
  { key: "s3", label: "Oral Delivery", icon: "🎤" },
  { key: "s4", label: "Response to Interventions", icon: "⚡" },
] as const;

export default async function ShareResultPage({ searchParams }: Props) {
  const params = await searchParams;
  const score = params.s || "—";
  const area = params.a || "AI Practice";
  const judge = params.j || "AI Judge";

  const scoreNum = parseFloat(score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C1220] via-[#131E30] to-[#182640] flex flex-col items-center justify-center px-4 py-12">
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-[rgba(201,168,76,0.15)] bg-[rgba(19,30,48,0.8)] backdrop-blur-sm p-8 flex flex-col items-center">
        {/* Branding */}
        <div className="flex items-baseline mb-1">
          <span className="font-serif text-2xl font-bold text-[#F2EDE6] tracking-[0.15em]">
            RATIO
          </span>
          <span className="font-serif text-2xl font-bold text-[#C9A84C]">.</span>
        </div>
        <p className="text-court-xs text-[rgba(242,237,230,0.35)] tracking-[0.15em] uppercase mb-8">
          Session Result
        </p>

        {/* Score ring (CSS version) */}
        <div className="relative w-32 h-32 mb-3">
          {/* Background ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="52"
              fill="none"
              stroke="rgba(242,237,230,0.08)"
              strokeWidth="5"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 52 * Math.min(scoreNum / 5, 1)} ${2 * Math.PI * 52}`}
            />
          </svg>
          <span
            className={`absolute inset-0 flex items-center justify-center font-serif text-4xl font-bold ${
              scoreNum >= 3.5
                ? "text-[#C9A84C]"
                : scoreNum >= 2.5
                  ? "text-[#F2EDE6]"
                  : "text-[rgba(242,237,230,0.5)]"
            }`}
          >
            {score}
          </span>
        </div>
        <p className="text-court-base text-[rgba(242,237,230,0.4)] mb-6">out of 5.0</p>

        {/* Area & Judge */}
        <h1 className="font-serif text-xl font-semibold text-[#F2EDE6] mb-1">{area}</h1>
        <p className="text-court-base text-[rgba(242,237,230,0.4)] mb-8">{judge}</p>

        {/* Score breakdown */}
        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          {CATEGORIES.map((cat) => {
            const val = params[cat.key];
            return (
              <div
                key={cat.key}
                className="flex items-center gap-2 rounded-lg bg-[rgba(12,18,32,0.5)] border border-[rgba(201,168,76,0.08)] px-3 py-2.5"
              >
                <span className="text-base">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[rgba(242,237,230,0.35)] truncate">
                    {cat.label}
                  </p>
                  <p className="text-court-base font-bold text-[#C9A84C]">{val || "—"}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/register"
          className="w-full py-3 rounded-lg bg-[#C9A84C] text-[#0C1220] font-semibold text-center text-court-base hover:bg-[#d4b85c] transition-colors"
        >
          Try RATIO. — Practice Your Advocacy
        </Link>
        <p className="text-[10px] text-[rgba(242,237,230,0.25)] mt-3">
          The Digital Court Society
        </p>
      </div>
    </div>
  );
}
