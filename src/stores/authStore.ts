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

// ── Profile Completion Rules ──
// Required fields and their weights for computing profile completeness
const PROFILE_REQUIRED_FIELDS: { key: keyof Profile; weight: number }[] = [
  { key: "university", weight: 25 },
  { key: "yearOfStudy", weight: 15 },
  { key: "modules", weight: 25 },
  { key: "chamber", weight: 25 },
  { key: "bio", weight: 10 },
];

export function getProfileCompletion(profile: Profile | null): {
  percentage: number;
  isComplete: boolean;
  missingFields: string[];
} {
  if (!profile) return { percentage: 0, isComplete: false, missingFields: ["All fields"] };

  let earned = 0;
  const missing: string[] = [];

  for (const { key, weight } of PROFILE_REQUIRED_FIELDS) {
    const value = profile[key];
    const filled =
      key === "modules"
        ? Array.isArray(value) && value.length > 0
        : key === "yearOfStudy"
          ? typeof value === "number"
          : typeof value === "string" && value.trim().length > 0;

    if (filled) {
      earned += weight;
    } else {
      missing.push(key);
    }
  }

  return {
    percentage: earned,
    isComplete: earned >= 90, // university + year + modules + chamber = 90%
    missingFields: missing,
  };
}

// ── Features that require profile completion ──
export const LOCKED_FEATURES = [
  { path: "/sessions/create", label: "Create Session" },
  { path: "/ai-practice", label: "AI Practice" },
  { path: "/tools/argument-builder", label: "Argument Builder" },
  { path: "/tools/case-brief", label: "Case Brief Generator" },
  { path: "/parliament", label: "Parliament" },
  { path: "/tribunal", label: "Tribunal" },
  { path: "/law-book/contribute", label: "Contribute to Law Book" },
  { path: "/portfolio", label: "Portfolio" },
] as const;

export function isFeatureLocked(path: string, profile: Profile | null): boolean {
  const { isComplete } = getProfileCompletion(profile);
  if (isComplete) return false;
  return LOCKED_FEATURES.some((f) => path.startsWith(f.path));
}

// ── Always accessible (even without profile) ──
// /home, /sessions (view only), /law-book (read only), /community (browse),
// /profile (to complete it), /settings, /notifications, /help, /about

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  profileSkipped: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  skipOnboarding: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isOnboarded: false,
  profileSkipped: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setProfile: (profile) => set({ profile, isOnboarded: !!profile }),
  skipOnboarding: () => set({ profileSkipped: true, isOnboarded: true }),
  logout: () =>
    set({
      user: null,
      profile: null,
      isAuthenticated: false,
      isOnboarded: false,
      profileSkipped: false,
    }),
}));
