"use client";

import { type ReactNode } from "react";
import Image from "next/image";
import { Scale } from "lucide-react";

interface SideVisualPanelProps {
  /** Path to the branded image (in /public or remote URL) */
  imageSrc?: string;
  /** Panel position relative to content */
  position?: "left" | "right";
  /** Overlay darkness: 0 = transparent, 1 = fully opaque */
  overlayStrength?: number;
  /** Alt text for the image */
  alt?: string;
  /** Whether to load eagerly (above-fold panels) */
  priority?: boolean;
  /** Optional overlay heading text */
  heading?: string;
  /** Optional overlay subheading text */
  subheading?: string;
  /** Custom panel content — when provided, replaces the default Scale icon + heading */
  children?: ReactNode;
}

/**
 * SideVisualPanel — a branded sticky image panel shown beside page content on desktop.
 *
 * Renders a full-viewport-height sticky panel with a dark navy gradient overlay.
 * Hidden on mobile/tablet (< lg breakpoint). Used to create a 60/40 split layout
 * alongside page content on desktop.
 */
export default function SideVisualPanel({
  imageSrc,
  position = "right",
  overlayStrength = 0.75,
  alt = "Ratio — The Digital Court Society",
  priority = false,
  heading,
  subheading,
  children,
}: SideVisualPanelProps) {
  // Compute overlay gradient based on strength
  const overlayTop = Math.min(overlayStrength + 0.1, 1);
  const overlayBottom = Math.max(overlayStrength - 0.15, 0.3);

  return (
    <div
      className="hidden lg:block sticky top-0 h-dvh w-full overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Background image or gradient fallback */}
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={alt}
          fill
          sizes="40vw"
          className="object-cover"
          priority={priority}
          quality={80}
        />
      ) : (
        /* Gradient fallback when no image is provided */
        <div
          className="absolute inset-0"
          style={{
            background: position === "left"
              ? "linear-gradient(135deg, #0a1628 0%, #162240 40%, #1a2d4a 100%)"
              : "linear-gradient(225deg, #0a1628 0%, #162240 40%, #1a2d4a 100%)",
          }}
        />
      )}

      {/* Dark navy overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(5,15,35,${overlayTop}), rgba(5,15,35,${overlayBottom}))`,
        }}
      />

      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Content overlay */}
      {children ? (
        <div className="relative h-full flex flex-col items-center justify-center px-8">
          {children}
        </div>
      ) : (
        <div className="relative h-full flex flex-col items-center justify-center px-8">
          {/* Gold accent line */}
          <div className="w-8 h-[2px] bg-gold/30 mb-6" />

          {/* Scale icon */}
          <Scale size={28} className="text-gold/20 mb-4" strokeWidth={1.5} />

          {/* Heading */}
          {heading && (
            <h2 className="font-serif text-xl text-court-text/30 text-center leading-snug mb-2">
              {heading}
            </h2>
          )}

          {/* Subheading */}
          {subheading && (
            <p className="text-court-xs text-court-text-ter/40 text-center max-w-[200px] leading-relaxed">
              {subheading}
            </p>
          )}

          {/* Bottom accent */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-6 h-[1px] bg-gold/15" />
          </div>
        </div>
      )}
    </div>
  );
}
