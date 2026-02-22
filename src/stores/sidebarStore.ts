import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;
  beginnerMode: boolean;
  visitedRoutes: string[];
  toggleCollapsed: () => void;
  setBeginnerMode: (value: boolean) => void;
  markRouteVisited: (route: string) => void;
  hasVisited: (route: string) => boolean;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      beginnerMode: true, // on by default for new advocates
      visitedRoutes: [],

      toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),

      setBeginnerMode: (value) => set({ beginnerMode: value }),

      markRouteVisited: (route) => {
        const current = get().visitedRoutes;
        if (!current.includes(route)) {
          set({ visitedRoutes: [...current, route] });
        }
      },

      hasVisited: (route) => get().visitedRoutes.includes(route),
    }),
    {
      name: "ratio_sidebar",
      partialize: (state) => ({
        collapsed: state.collapsed,
        beginnerMode: state.beginnerMode,
        visitedRoutes: state.visitedRoutes,
      }),
    }
  )
);
