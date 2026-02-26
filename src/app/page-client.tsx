"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { captureUTMParams } from "@/lib/utils/utm";
import { PromoBanner } from "@/components/shared/PromoBanner";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

/*
 * Landing Page — RATIO's public-facing homepage.
 *
 * What changed:
 *  - Auth detection: signed-in users see "Go to Dashboard" instead of "Sign In"
 *  - 5 new sections added (Certificates, Portfolio, Badges, Social, Ambassador)
 *  - New sections are lazy-loaded with next/dynamic so the initial page load
 *    stays fast (they're below the fold, so no one notices the async load)
 *  - Floating "Join Free" pill + "Back to Top" button for the long scroll
 *  - Every section has an `id` prop for anchor linking
 *
 * Section order (23 total):
 *  1-10:  Existing sections (unchanged)
 *  11-12: CertificateShowcase, PortfolioShowcase (new — after Tools)
 *  13-15: LawBookPreview, GovernanceShowcase, ChambersPreview (existing)
 *  16-18: BadgesShowcase, SocialShowcase, AmbassadorShowcase (new — after Chambers)
 *  19-23: Testimonials, Pricing, FAQ, CTA, Footer (existing)
 */

// ── Existing sections (eagerly loaded — they're above the fold) ──
import { HeroSection } from "@/components/landing/HeroSection";
import { TrustBar } from "@/components/landing/TrustBar";
import { DisclaimerBanner } from "@/components/landing/DisclaimerBanner";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StudyUseCases } from "@/components/landing/StudyUseCases";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AIShowcase } from "@/components/landing/AIShowcase";

// ── Below-fold existing sections (eagerly loaded — small components) ──
import { VideoMootingShowcase } from "@/components/landing/VideoMootingShowcase";
import { TournamentShowcase } from "@/components/landing/TournamentShowcase";
import { ToolsShowcase } from "@/components/landing/ToolsShowcase";
import { LawBookPreview } from "@/components/landing/LawBookPreview";
import { GovernanceShowcase } from "@/components/landing/GovernanceShowcase";
import { ChambersPreview } from "@/components/landing/ChambersPreview";
import { TestimonialSection } from "@/components/landing/TestimonialSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";
import { FooterSection } from "@/components/landing/FooterSection";
import { FirstVisitSplash } from "@/components/shared/FirstVisitSplash";

// ── NEW sections (lazy-loaded — they're deep below the fold) ──
// next/dynamic splits these into separate JS chunks that only load when
// the browser scrolls near them. This keeps the initial page load fast.
const CertificateShowcase = dynamic(
  () => import("@/components/landing/CertificateShowcase").then((m) => ({ default: m.CertificateShowcase })),
  { ssr: true }
);
const PortfolioShowcase = dynamic(
  () => import("@/components/landing/PortfolioShowcase").then((m) => ({ default: m.PortfolioShowcase })),
  { ssr: true }
);
const BadgesShowcase = dynamic(
  () => import("@/components/landing/BadgesShowcase").then((m) => ({ default: m.BadgesShowcase })),
  { ssr: true }
);
const SocialShowcase = dynamic(
  () => import("@/components/landing/SocialShowcase").then((m) => ({ default: m.SocialShowcase })),
  { ssr: true }
);
const AmbassadorShowcase = dynamic(
  () => import("@/components/landing/AmbassadorShowcase").then((m) => ({ default: m.AmbassadorShowcase })),
  { ssr: true }
);

// ── Floating actions (lazy — not needed until user scrolls) ──
const FloatingActions = dynamic(
  () => import("@/components/landing/FloatingActions").then((m) => ({ default: m.FloatingActions })),
  { ssr: false }
);

/* ────────────────────────────────────────────────────────────
   Shared landing shell — receives `isAuthenticated` as a prop
   so that the hook call is isolated to the wrapper below.
   ──────────────────────────────────────────────────────────── */
function LandingShell({ isAuthenticated }: { isAuthenticated: boolean }) {
  // Capture UTM params from URL on first visit (for signup attribution)
  useEffect(() => { captureUTMParams(); }, []);

  return (
    <FirstVisitSplash>
    <div className="min-h-screen overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(201,168,76,0.06),transparent_60%)]" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(107,45,62,0.06),transparent_60%)]" />
        <div className="absolute top-[40%] right-[-150px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(46,80,144,0.04),transparent_60%)]" />
      </div>

      {/* Nav — auth-aware */}
      <nav className="relative z-10 flex justify-between items-center px-4 md:px-6 lg:px-8 pt-3 pb-4 max-w-4xl mx-auto">
        <div className="font-serif text-lg font-bold tracking-[0.12em]">
          RATIO<span className="text-gold">.</span>
        </div>
        {isAuthenticated ? (
          <Link
            href="/home"
            className="text-court-sm font-semibold px-4 py-2 rounded-lg bg-gold text-navy hover:bg-gold/90 transition-all"
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-court-sm text-court-text-sec font-semibold px-4 py-2 rounded-lg border border-court-border hover:border-white/10 transition-all"
          >
            Sign In
          </Link>
        )}
      </nav>

      {/* ═══════════════════════════════════════════
          Sections 1-10: Core story (unchanged)
          ═══════════════════════════════════════════ */}
      <HeroSection isAuthenticated={isAuthenticated} />
      <TrustBar />
      <DisclaimerBanner />
      <FeaturesGrid id="features" />
      <StudyUseCases />
      <HowItWorks />
      <AIShowcase id="ai-showcase" />
      <VideoMootingShowcase id="video-mooting" />
      <TournamentShowcase id="tournaments" />
      <ToolsShowcase id="tools" />

      {/* ═══════════════════════════════════════════
          Sections 11-12: Outcomes (NEW)
          "You used the tools, here's what you earn"
          ═══════════════════════════════════════════ */}
      <CertificateShowcase id="certificates" />
      <PortfolioShowcase id="portfolio" />

      {/* ═══════════════════════════════════════════
          Sections 13-15: Society & governance (existing)
          ═══════════════════════════════════════════ */}
      <LawBookPreview id="law-book" />
      <GovernanceShowcase id="governance" />
      <ChambersPreview id="chambers" />

      {/* ═══════════════════════════════════════════
          Sections 16-18: Community & growth (NEW)
          ═══════════════════════════════════════════ */}
      <BadgesShowcase id="badges" />
      <SocialShowcase id="social" />
      <AmbassadorShowcase id="ambassadors" />

      {/* ═══════════════════════════════════════════
          Sections 19-23: Trust funnel → conversion
          ═══════════════════════════════════════════ */}
      <TestimonialSection />
      <PricingSection />
      <FAQSection id="faq" />
      <CTASection />
      <FooterSection />

      {/* Floating "Join Free" pill + Back to Top button */}
      <FloatingActions isAuthenticated={isAuthenticated} />
      <PromoBanner />
    </div>
    </FirstVisitSplash>
  );
}

/* ────────────────────────────────────────────────────────────
   Auth-aware wrapper — calls useConvexAuth() which requires
   ConvexAuthProvider. Only rendered when CONVEX_URL is set.
   ──────────────────────────────────────────────────────────── */
function LandingWithAuth() {
  const { isAuthenticated } = useConvexAuth();
  return <LandingShell isAuthenticated={isAuthenticated} />;
}

/* ────────────────────────────────────────────────────────────
   Entry point — mirrors the pattern in (app)/layout-client.tsx.
   In demo mode (no CONVEX_URL), skip useConvexAuth entirely
   because the provider is plain ConvexProvider (no auth).
   ──────────────────────────────────────────────────────────── */
export default function LandingPageClient() {
  if (!CONVEX_URL) {
    return <LandingShell isAuthenticated={false} />;
  }
  return <LandingWithAuth />;
}
