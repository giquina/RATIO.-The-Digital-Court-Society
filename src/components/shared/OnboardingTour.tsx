"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTourStore } from "@/stores/tourStore";
import { TOUR_STEPS } from "@/lib/constants/tour-steps";
import { cn } from "@/lib/utils/helpers";

// ── Types ──

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

// ── Spotlight overlay using box-shadow ──

function Spotlight({ rect }: { rect: TargetRect }) {
  const padding = 8;
  return (
    <div
      className="fixed z-[100] rounded-court pointer-events-none"
      style={{
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
        borderRadius: 14,
      }}
    />
  );
}

// ── Progress dots ──

function ProgressDots({
  total,
  current,
}: {
  total: number;
  current: number;
}) {
  return (
    <div className="flex items-center gap-1.5 mt-4">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full transition-all duration-300",
            i < current
              ? "bg-gold"
              : i === current
                ? "bg-gold w-3"
                : "bg-white/20"
          )}
        />
      ))}
    </div>
  );
}

// ── Tooltip card ──

function TourTooltip({
  step,
  stepIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrev,
  onSkip,
}: {
  step: (typeof TOUR_STEPS)[number];
  stepIndex: number;
  totalSteps: number;
  targetRect: TargetRect;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  // Calculate tooltip position based on target rect and preferred position
  const calculatePosition = useCallback(() => {
    if (!tooltipRef.current) return;

    const tooltip = tooltipRef.current.getBoundingClientRect();
    const padding = 8; // spotlight padding
    const gap = 16; // gap between spotlight and tooltip
    const viewportPadding = 16; // keep away from viewport edges

    let top = 0;
    let left = 0;

    switch (step.position) {
      case "bottom":
        top = targetRect.top + targetRect.height + padding + gap;
        left = targetRect.left + targetRect.width / 2 - tooltip.width / 2;
        break;
      case "top":
        top = targetRect.top - padding - gap - tooltip.height;
        left = targetRect.left + targetRect.width / 2 - tooltip.width / 2;
        break;
      case "right":
        top = targetRect.top + targetRect.height / 2 - tooltip.height / 2;
        left = targetRect.left + targetRect.width + padding + gap;
        break;
      case "left":
        top = targetRect.top + targetRect.height / 2 - tooltip.height / 2;
        left = targetRect.left - padding - gap - tooltip.width;
        break;
    }

    // Clamp to viewport
    const maxLeft = window.innerWidth - tooltip.width - viewportPadding;
    const maxTop = window.innerHeight - tooltip.height - viewportPadding;
    left = Math.max(viewportPadding, Math.min(left, maxLeft));
    top = Math.max(viewportPadding, Math.min(top, maxTop));

    setTooltipStyle({ top, left });
  }, [targetRect, step.position]);

  useEffect(() => {
    // Wait one frame for the ref to be measured
    requestAnimationFrame(calculatePosition);
  }, [calculatePosition]);

  useEffect(() => {
    window.addEventListener("resize", calculatePosition);
    return () => window.removeEventListener("resize", calculatePosition);
  }, [calculatePosition]);

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed z-[101] w-[320px] max-w-[calc(100vw-2rem)] bg-navy-card border border-court-border rounded-court p-5 shadow-2xl shadow-black/40"
      style={tooltipStyle}
    >
      {/* Step counter */}
      <p className="text-court-xs text-court-text-ter tracking-wide mb-2">
        {stepIndex + 1} of {totalSteps}
      </p>

      {/* Title */}
      <h3 className="font-serif text-lg font-bold text-court-text mb-2">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-court-base text-court-text-sec leading-relaxed">
        {step.description}
      </p>

      {/* Progress dots */}
      <ProgressDots total={totalSteps} current={stepIndex} />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-court-border">
        <button
          onClick={onSkip}
          className="text-court-xs text-court-text-ter hover:text-court-text-sec transition-colors font-medium"
        >
          Skip tour
        </button>

        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="px-3 py-1.5 text-court-sm font-semibold text-court-text-sec hover:text-court-text hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              Back
            </button>
          )}
          <button
            onClick={onNext}
            className="px-4 py-1.5 text-court-sm font-bold bg-gold text-navy rounded-xl hover:bg-gold/90 transition-all duration-200"
          >
            {isLast ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Tour Component ──

export function OnboardingTour() {
  const pathname = usePathname();
  const {
    hasCompletedTour,
    isActive,
    currentStep,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
  } = useTourStore();

  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const [activeSteps, setActiveSteps] = useState(TOUR_STEPS);

  // Mount delay -- wait for splash screen to finish and DOM to settle
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-start the tour on /home for new advocates
  useEffect(() => {
    if (mounted && !hasCompletedTour && !isActive && pathname === "/home") {
      // Small additional delay to ensure all elements are rendered
      const timer = setTimeout(() => startTour(), 500);
      return () => clearTimeout(timer);
    }
  }, [mounted, hasCompletedTour, isActive, pathname, startTour]);

  // Filter steps to only those whose targets exist in the DOM
  useEffect(() => {
    if (!isActive) return;

    const available = TOUR_STEPS.filter((step) =>
      document.querySelector(step.target)
    );
    setActiveSteps(available.length > 0 ? available : TOUR_STEPS);
  }, [isActive]);

  // Calculate target element rect for current step
  const updateTargetRect = useCallback(() => {
    if (!isActive || activeSteps.length === 0) {
      setTargetRect(null);
      return;
    }

    const step = activeSteps[currentStep];
    if (!step) {
      // Past the end -- complete the tour
      completeTour();
      return;
    }

    const el = document.querySelector(step.target);
    if (!el) {
      // Target not found -- skip to the next available step
      if (currentStep < activeSteps.length - 1) {
        nextStep();
      } else {
        completeTour();
      }
      return;
    }

    const rect = el.getBoundingClientRect();
    setTargetRect({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    });

    // Scroll element into view if needed
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isActive, currentStep, activeSteps, completeTour, nextStep]);

  useEffect(() => {
    updateTargetRect();
  }, [updateTargetRect]);

  // Recalculate on resize
  useEffect(() => {
    if (!isActive) return;

    const handleResize = () => updateTargetRect();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isActive, updateTargetRect]);

  // Escape key to skip
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipTour();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, skipTour]);

  // Handle next -- either advance or complete
  const handleNext = useCallback(() => {
    if (currentStep >= activeSteps.length - 1) {
      completeTour();
    } else {
      nextStep();
    }
  }, [currentStep, activeSteps.length, completeTour, nextStep]);

  // Handle prev
  const handlePrev = useCallback(() => {
    prevStep();
  }, [prevStep]);

  // Don't render anything if tour is not active
  if (!isActive || activeSteps.length === 0) return null;

  const step = activeSteps[currentStep];
  if (!step) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]" aria-modal="true" role="dialog" aria-label="Onboarding tour">
      {/* Backdrop -- click does nothing (prevents accidental dismissal) */}
      <div className="absolute inset-0" />

      {/* Spotlight */}
      {targetRect && <Spotlight rect={targetRect} />}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        {targetRect && (
          <TourTooltip
            key={step.id}
            step={step}
            stepIndex={currentStep}
            totalSteps={activeSteps.length}
            targetRect={targetRect}
            onNext={handleNext}
            onPrev={handlePrev}
            onSkip={skipTour}
          />
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
