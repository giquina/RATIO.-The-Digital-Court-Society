import { create } from "zustand";
import { persist } from "zustand/middleware";

type ClerkTab = "help" | "glossary" | "guide";

interface ClerkState {
  isOpen: boolean;
  activeTab: ClerkTab;
  searchQuery: string;
  dismissedHints: string[];
  open: (tab?: ClerkTab) => void;
  close: () => void;
  setTab: (tab: ClerkTab) => void;
  setSearch: (query: string) => void;
  dismissHint: (hintId: string) => void;
  isHintDismissed: (hintId: string) => boolean;
}

export const useClerkStore = create<ClerkState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      activeTab: "help",
      searchQuery: "",
      dismissedHints: [],

      open: (tab) => set({ isOpen: true, ...(tab ? { activeTab: tab } : {}) }),

      close: () => set({ isOpen: false, searchQuery: "" }),

      setTab: (tab) => set({ activeTab: tab, searchQuery: "" }),

      setSearch: (query) => set({ searchQuery: query }),

      dismissHint: (hintId) =>
        set((state) => ({
          dismissedHints: state.dismissedHints.includes(hintId)
            ? state.dismissedHints
            : [...state.dismissedHints, hintId],
        })),

      isHintDismissed: (hintId) => get().dismissedHints.includes(hintId),
    }),
    {
      name: "ratio_clerk",
      partialize: (state) => ({ dismissedHints: state.dismissedHints }),
    }
  )
);
