import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TourState {
  /** Whether the advocate has completed (or skipped) the onboarding tour */
  hasCompletedTour: boolean;
  /** Current step index (0-based) */
  currentStep: number;
  /** Whether the tour overlay is currently visible */
  isActive: boolean;

  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  /** Reset tour state so it can be replayed from settings */
  resetTour: () => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set) => ({
      hasCompletedTour: false,
      currentStep: 0,
      isActive: false,

      startTour: () => set({ isActive: true, currentStep: 0 }),

      nextStep: () =>
        set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),

      skipTour: () =>
        set({ isActive: false, currentStep: 0, hasCompletedTour: true }),

      completeTour: () =>
        set({ isActive: false, currentStep: 0, hasCompletedTour: true }),

      resetTour: () =>
        set({ hasCompletedTour: false, currentStep: 0, isActive: false }),
    }),
    {
      name: "ratio_tour",
      partialize: (state) => ({
        hasCompletedTour: state.hasCompletedTour,
      }),
    }
  )
);
