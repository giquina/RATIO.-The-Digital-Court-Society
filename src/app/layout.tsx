import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { ConvexClientProvider } from "@/components/shared/ConvexProvider";
import { Analytics } from "@/components/shared/Analytics";
import { CookieConsent } from "@/components/shared/CookieConsent";
import { Toaster } from "sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const DOMAIN = "https://ratiothedigitalcourtsociety.com";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "Ratio. — The Digital Court Society",
    template: "%s | Ratio.",
  },
  description:
    "The constitutional training ground for UK law students. Organise moots, practise with an AI Judge, track your advocacy, and build your portfolio.",
  keywords: [
    "moot court",
    "UK law students",
    "advocacy training",
    "AI judge",
    "legal practice",
    "mooting",
    "law society",
    "SQE preparation",
    "legal portfolio",
  ],
  authors: [{ name: "Ratio." }],
  creator: "Ratio.",
  manifest: "/manifest.json",
  alternates: {
    canonical: DOMAIN,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: DOMAIN,
    siteName: "Ratio.",
    title: "Ratio. — The Digital Court Society",
    description:
      "The constitutional training ground for UK law students. Organise moots, practise with an AI Judge, and build your portfolio.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ratio. — The Digital Court Society",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ratio. — The Digital Court Society",
    description:
      "The constitutional training ground for UK law students. Organise moots, practise with an AI Judge, and build your portfolio.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ratio.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0C1220",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Prevent FOUC: critical background color before CSS loads */}
        <style dangerouslySetInnerHTML={{ __html: `html,body{background:#0C1220;color:#F2EDE6}` }} />
      </head>
      <body className="bg-navy text-court-text font-sans antialiased min-h-screen">
        <ConvexClientProvider>
          <div className="min-h-screen relative">
            {children}
          </div>
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              style: {
                background: "#131E30",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#F2EDE6",
                fontFamily: "var(--font-dm-sans), system-ui, sans-serif",
                fontSize: "0.8125rem",
              },
            }}
          />
        </ConvexClientProvider>
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
