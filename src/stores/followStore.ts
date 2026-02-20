import { create } from "zustand";

interface FollowState {
  // Maps: profileId -> boolean (is following)
  following: Record<string, boolean>;
  // Maps: profileId -> count
  followerCounts: Record<string, number>;
  followingCounts: Record<string, number>;
  blockedUsers: Set<string>;
  // Community stats
  totalAdvocates: number;
  activeThisWeek: number;

  // Actions — will be replaced with Convex mutations when backend is connected
  follow: (profileId: string) => void;
  unfollow: (profileId: string) => void;
  isFollowing: (profileId: string) => boolean;
  blockUser: (profileId: string) => void;
  unblockUser: (profileId: string) => void;
  getFollowerCount: (profileId: string) => number;
  getFollowingCount: (profileId: string) => number;
}

// Demo seed data — 15 advocates with follow relationships
const DEMO_FOLLOW_MAP: Record<string, boolean> = {
  "profile_sarah_k": true,
  "profile_james_o": true,
  "profile_fatima_a": false,
  "profile_marcus_w": true,
  "profile_olivia_c": false,
};

const DEMO_FOLLOWER_COUNTS: Record<string, number> = {
  "profile_me": 142,
  "profile_sarah_k": 234,
  "profile_james_o": 89,
  "profile_fatima_a": 312,
  "profile_marcus_w": 67,
  "profile_olivia_c": 156,
  "profile_daniel_r": 45,
  "profile_priya_s": 278,
  "profile_liam_b": 93,
  "profile_emma_t": 201,
};

const DEMO_FOLLOWING_COUNTS: Record<string, number> = {
  "profile_me": 89,
  "profile_sarah_k": 56,
  "profile_james_o": 112,
  "profile_fatima_a": 78,
  "profile_marcus_w": 134,
  "profile_olivia_c": 45,
};

export const useFollowStore = create<FollowState>((set, get) => ({
  following: DEMO_FOLLOW_MAP,
  followerCounts: DEMO_FOLLOWER_COUNTS,
  followingCounts: DEMO_FOLLOWING_COUNTS,
  blockedUsers: new Set(),
  totalAdvocates: 1247,
  activeThisWeek: 389,

  follow: (profileId: string) => {
    const state = get();
    // Prevent self-follow
    if (profileId === "profile_me") return;
    // Prevent following blocked users
    if (state.blockedUsers.has(profileId)) return;

    set({
      following: { ...state.following, [profileId]: true },
      followerCounts: {
        ...state.followerCounts,
        [profileId]: (state.followerCounts[profileId] ?? 0) + 1,
      },
      followingCounts: {
        ...state.followingCounts,
        "profile_me": (state.followingCounts["profile_me"] ?? 0) + 1,
      },
    });
    // TODO: Replace with useMutation(api.social.toggleFollow)
  },

  unfollow: (profileId: string) => {
    const state = get();
    set({
      following: { ...state.following, [profileId]: false },
      followerCounts: {
        ...state.followerCounts,
        [profileId]: Math.max(0, (state.followerCounts[profileId] ?? 1) - 1),
      },
      followingCounts: {
        ...state.followingCounts,
        "profile_me": Math.max(0, (state.followingCounts["profile_me"] ?? 1) - 1),
      },
    });
    // TODO: Replace with useMutation(api.social.toggleFollow)
  },

  isFollowing: (profileId: string) => {
    return get().following[profileId] ?? false;
  },

  blockUser: (profileId: string) => {
    const state = get();
    const newBlocked = new Set(state.blockedUsers);
    newBlocked.add(profileId);
    // Silently unfollow when blocking
    const newFollowing = { ...state.following };
    delete newFollowing[profileId];
    set({ blockedUsers: newBlocked, following: newFollowing });
  },

  unblockUser: (profileId: string) => {
    const state = get();
    const newBlocked = new Set(state.blockedUsers);
    newBlocked.delete(profileId);
    set({ blockedUsers: newBlocked });
  },

  getFollowerCount: (profileId: string) => {
    return get().followerCounts[profileId] ?? 0;
  },

  getFollowingCount: (profileId: string) => {
    return get().followingCounts[profileId] ?? 0;
  },
}));
