---
name: social-graph
description: Implement the follow/unfollow system and community growth signals for Ratio. Covers follow edges, counts, block/mute, suggested users, and safe homepage metrics. Use when working on the social layer, community features, or follow system.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npx tsc *)
argument-hint: "[implement or spec or audit]"
---

# Social Graph System

Implement a professional, privacy-respecting follow system for Ratio. This is NOT social media — it's an institutional observation system where Advocates follow colleagues' advocacy journeys.

## Mode

- `$ARGUMENTS` = "implement": Write the code changes
- `$ARGUMENTS` = "spec": Produce specification document only
- `$ARGUMENTS` = "audit": Review existing social code for completeness

## Core Model: One-Way Follow (Twitter/X Style)

- Follow is one-directional (A follows B does not mean B follows A)
- Terminology: "Follow" / "Following" (NEVER "Subscribe", "Connect", "Friend")
- Silent actions: unfollow and block produce no notification to the target
- Self-follow: prevented at the mutation level

## Data Architecture

### Convex Tables (already in schema)

**follows** table:
```
followerId: Id<"profiles">
followingId: Id<"profiles">
Indexes: by_follower, by_following, by_pair
```

### Zustand Store (already created)
**File**: `src/stores/followStore.ts`
- `following` map, `followerCounts`, `followingCounts`, `blockedUsers`
- Actions: `follow()`, `unfollow()`, `isFollowing()`, `blockUser()`, `unblockUser()`
- TODO comments marking where Convex mutations will replace Zustand

### Convex Backend (to create)
**File**: `convex/social.ts` (partially exists)
- `toggleFollow` mutation: Create/delete follow edge + update counts
- `getFollowers` query: List followers for a profile
- `getFollowing` query: List following for a profile
- `isFollowing` query: Check if A follows B
- `blockUser` mutation: Block + auto-unfollow
- `getSuggestedUsers` query: Discovery algorithm

## Follow Button Component

**File**: `src/components/ui/index.tsx` (FollowButton already exists)

States:
1. **Not Following**: Gold filled button → "Follow"
2. **Following**: Outlined button with checkmark → "Following"
3. **Hover on Following** (desktop): Turns to red outline → "Unfollow"
4. **Own Profile**: Don't show Follow, show "Edit Profile"
5. **Blocked User**: Don't show button at all

Requirements:
- Minimum 44px tap target (mobile-first)
- Instant optimistic update (update UI before server confirms)
- Debounce rapid clicks (prevent spam follow/unfollow)

## Profile Page Integration

**File**: `src/app/(app)/profile/page.tsx`

Add below profile header:
- `142 followers  ·  89 following` (clickable to see lists)
- Follow button (or "Edit Profile" if own profile)
- "Recent Followers" section: last 3 avatars + "+X more"

Privacy settings:
- Follower list visible to owner only by default
- Following list always private
- Toggle: "Hide follower count" (shows to self only)

## Community Status Bar (Home Page)

**File**: `src/app/(app)/home/page.tsx`

Add glass-card module below greeting:
- Normal (100+ members): `1,247 Advocates  ·  389 active this week`
- Early-stage (<100): `Founding Advocates: 47  ·  Est. 2025`
- NEVER show "online now" (stalking risk)

## Discovery Section (Community Page)

**File**: `src/app/(app)/community/page.tsx`

"Advocates to Follow" section with 3 categories:
1. **From Your University** — same university members
2. **Rising This Week** — most new followers this week
3. **Your Chamber** — same Chamber members

Rules:
- Max 4 per category
- Curated, no infinite scroll
- Exclude blocked users
- Exclude users the viewer already follows

## Follow Notifications

**File**: `src/app/(app)/notifications/page.tsx`

- New follow notification: "[Name] started following you" with avatar
- Batch format: "Sarah K. and 3 others started following you"
- Tapping navigates to their profile

## Safety Controls

| Control | Implementation |
|---------|---------------|
| Self-follow prevention | Mutation rejects `followerId === followingId` |
| Rate limiting | Max 30 follows per hour per user |
| Silent unfollow | No notification sent to unfollowed user |
| Silent block | Auto-unfollows both directions, no notification |
| Blocked user visibility | Blocked users cannot see your profile |
| Follower list privacy | Owner-only by default |
| No "online now" | Stalking risk — never implement |

## Acceptance Criteria

1. Follow/unfollow toggles with optimistic update in <100ms
2. Follower/following counts update in real-time
3. Block removes follow relationship silently
4. Self-follow is impossible
5. Discovery section shows 3 categories with max 4 per category
6. Community status bar shows on home page
7. Follow notification fires for new follows
8. Rate limiting prevents spam (30/hour)
9. No "online now" indicator anywhere

## Rollout Plan

### Phase 1: Core (Week 1)
- [ ] Wire FollowButton to Convex mutation
- [ ] Implement follower/following counts query
- [ ] Add follow counts to profile page
- [ ] Add follow notification type

### Phase 2: Discovery (Week 2)
- [ ] Implement suggested users algorithm
- [ ] Add "Advocates to Follow" section to community page
- [ ] Add community status bar to home page

### Phase 3: Safety (Week 3)
- [ ] Implement block/mute mutations
- [ ] Add rate limiting
- [ ] Add privacy settings for follower list visibility
- [ ] Audit for safety edge cases

## Output

Produce detailed implementation plan with file references, code snippets for key mutations, and test scenarios. Use the template in [templates/social-spec.md](templates/social-spec.md).
