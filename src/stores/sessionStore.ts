import { create } from "zustand";

interface SessionStore {
  /** True when the user is inside an active Moot Court session */
  isSessionActive: boolean;
  enterSession: () => void;
  exitSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  isSessionActive: false,
  enterSession: () => set({ isSessionActive: true }),
  exitSession: () => set({ isSessionActive: false }),
}));
