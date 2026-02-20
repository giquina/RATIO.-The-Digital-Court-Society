import type { Metadata, Viewport } from "next";
import { ConvexClientProvider } from "@/components/shared/ConvexProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ratio",
  description: "Ratio — The digital court society for UK law students",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ratio",
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
    <html lang="en" className="dark">
      <body className="bg-navy text-court-text font-sans antialiased min-h-screen">
        <ConvexClientProvider>
          <div className="max-w-lg mx-auto min-h-screen relative">
            {children}
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
