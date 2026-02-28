import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UsherMessage = {
  id: string;
  role: "visitor" | "usher";
  content: string;
  timestamp: number;
  type: "text" | "quick-reply" | "email-capture" | "greeting";
  source?: "faq" | "ai" | "fallback" | "system";
};

interface UsherState {
  sessionId: string;
  messages: UsherMessage[];
  isOpen: boolean;
  hasGreeted: boolean;
  visitorEmail: string | null;
  isMuted: boolean;
  lastPageUrl: string;

  open: () => void;
  close: () => void;
  toggle: () => void;
  addMessage: (msg: Omit<UsherMessage, "id" | "timestamp">) => void;
  setGreeted: () => void;
  setEmail: (email: string) => void;
  toggleMute: () => void;
  setPageUrl: (url: string) => void;
  clearMessages: () => void;
}

function generateId(): string {
  return crypto.randomUUID();
}

export const useUsherStore = create<UsherState>()(
  persist(
    (set, get) => ({
      sessionId: generateId(),
      messages: [],
      isOpen: false,
      hasGreeted: false,
      visitorEmail: null,
      isMuted: false,
      lastPageUrl: "",

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addMessage: (msg) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { ...msg, id: generateId(), timestamp: Date.now() },
          ],
        })),

      setGreeted: () => set({ hasGreeted: true }),
      setEmail: (email) => set({ visitorEmail: email }),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      setPageUrl: (url) => set({ lastPageUrl: url }),
      clearMessages: () => set({ messages: [], hasGreeted: false }),
    }),
    {
      name: "ratio_usher",
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
        hasGreeted: state.hasGreeted,
        visitorEmail: state.visitorEmail,
        isMuted: state.isMuted,
        lastPageUrl: state.lastPageUrl,
      }),
    }
  )
);
