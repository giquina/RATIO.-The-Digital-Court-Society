"use client";

import { type ReactNode } from "react";
import SideVisualPanel from "./SideVisualPanel";

interface PageWithPanelProps {
  children: ReactNode;
  /** Panel position: "left" puts image on left, "right" on right */
  panelPosition?: "left" | "right";
  /** Path to the branded image */
  imageSrc?: string;
  /** Overlay darkness (0–1) */
  overlayStrength?: number;
  /** Alt text for the panel image */
  alt?: string;
  /** Eagerly load image for above-fold panels */
  priority?: boolean;
  /** Optional overlay heading */
  heading?: string;
  /** Optional overlay subheading */
  subheading?: string;
}

/**
 * PageWithPanel — wraps page content in a 60/40 split layout on desktop.
 *
 * On lg+ screens: shows a sticky branded image panel beside the scrollable content.
 * On mobile/tablet: renders only the children (panel is hidden via CSS).
 *
 * Usage:
 * ```tsx
 * <PageWithPanel panelPosition="right" imageSrc="/images/society-panel.jpg">
 *   <YourPageContent />
 * </PageWithPanel>
 * ```
 */
export default function PageWithPanel({
  children,
  panelPosition = "right",
  imageSrc,
  overlayStrength = 0.75,
  alt,
  priority = false,
  heading,
  subheading,
}: PageWithPanelProps) {
  const panel = (
    <div className="hidden lg:block lg:w-[40%] xl:w-[38%] 2xl:w-[35%] shrink-0">
      <SideVisualPanel
        imageSrc={imageSrc}
        position={panelPosition}
        overlayStrength={overlayStrength}
        alt={alt}
        priority={priority}
        heading={heading}
        subheading={subheading}
      />
    </div>
  );

  return (
    <div className="flex min-h-[calc(100dvh-56px)] lg:min-h-dvh">
      {panelPosition === "left" && panel}

      {/* Main scrollable content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </div>

      {panelPosition === "right" && panel}
    </div>
  );
}
