import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Profile {
  _id: string;
  fullName: string;
  university: string;
  universityShort: string;
  yearOfStudy: number;
  chamber: string;
  rank: string;
  streakDays: number;
  totalMoots: number;
  totalHours: number;
  totalPoints: number;
  readinessScore: number;
  followerCount: number;
  followingCount: number;
  commendationCount: number;
  modules: string[];
  bio?: string;
  avatarUrl?: string;
  isVerified: boolean;
  verificationStatus?: "none" | "pending" | "verified" | "expired";
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isOnboarded: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile, isOnboarded: !!profile }),
  logout: () => set({ user: null, profile: null, isAuthenticated: false, isOnboarded: false }),
}));
