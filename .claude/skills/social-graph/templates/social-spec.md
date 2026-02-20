# Social Graph Specification

**Date**: [DATE]
**Status**: [Draft / In Progress / Complete]

---

## 1. Current State

### Data Layer
| Component | Location | Status |
|-----------|----------|--------|
| follows table | `convex/schema.ts` | [Exists/Missing] |
| followStore | `src/stores/followStore.ts` | [Exists/Missing] |
| Convex mutations | `convex/social.ts` | [Exists/Partial/Missing] |
| FollowButton | `src/components/ui/index.tsx` | [Exists/Missing] |

### UI Integration
| Page | Follow Integration | Status |
|------|-------------------|--------|
| Profile | Counts + button | [Done/Partial/Missing] |
| Community | Discovery section | [Done/Partial/Missing] |
| Home | Status bar | [Done/Partial/Missing] |
| Notifications | Follow notification | [Done/Partial/Missing] |

## 2. Implementation Tasks

### Backend
- [ ] `toggleFollow` mutation with duplicate prevention
- [ ] `getFollowers` / `getFollowing` queries with pagination
- [ ] `blockUser` mutation with auto-unfollow
- [ ] `getSuggestedUsers` query with 3 categories
- [ ] Rate limiting (30/hour/user)

### Frontend
- [ ] Wire FollowButton to Convex
- [ ] Add counts to profile page
- [ ] Add discovery section to community
- [ ] Add status bar to home
- [ ] Add follow notification type

## 3. Safety Audit

- [ ] Self-follow prevention tested
- [ ] Rate limiting active
- [ ] Block removes both follow directions
- [ ] No "online now" indicator
- [ ] Follower list privacy default: owner-only
- [ ] Following list: always private

## 4. Acceptance Test Results

| Test | Result |
|------|--------|
| Follow toggles in <100ms | [Pass/Fail] |
| Counts update real-time | [Pass/Fail] |
| Block is silent | [Pass/Fail] |
| Self-follow blocked | [Pass/Fail] |
| Rate limit enforced | [Pass/Fail] |
