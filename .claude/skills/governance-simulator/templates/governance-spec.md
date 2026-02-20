# Governance Implementation Specification

**Date**: [DATE]
**Branch**: [Legislative / Judicial / Executive / Full]

---

## 1. Current State

### Schema Tables
| Table | Fields | Indexes | Status |
|-------|--------|---------|--------|
| [Table] | [Count] | [Count] | [Exists/Missing] |

### Backend Functions
| Function | Type | Status |
|----------|------|--------|
| [Function] | [query/mutation/action] | [Exists/Stub/Missing] |

### Frontend Pages
| Route | Status | Wired to Backend? |
|-------|--------|--------------------|
| [Route] | [Exists/Missing] | [Yes/No/Partial] |

## 2. Implementation Plan

### Phase 1: Core Logic
- [ ] [Task with file reference]

### Phase 2: Business Rules
- [ ] Quorum calculation
- [ ] Vote tallying
- [ ] Tier verification
- [ ] Proportionality checks

### Phase 3: Frontend Wiring
- [ ] [Task with file reference]

## 3. Business Rules

### Voting
- Simple majority formula: `ayeVotes > noVotes`
- Supermajority formula: `ayeVotes >= (ayeVotes + noVotes) * 2/3`
- Quorum formula: `totalVotes >= eligibleVoters * 0.2`

### Tier Verification
- Check before: proposing motions, voting, filing cases
- Calculation: see `convex/governance/tiers.ts`

### Moderation Escalation
1. Warning (no restriction)
2. Content removal (reversible)
3. Temporary restriction (24h-30d)
4. Tribunal referral (permanent consequences possible)

## 4. Edge Cases

| Scenario | Expected Behavior |
|----------|------------------|
| Self-seconding | Blocked with error message |
| Double voting | Blocked by unique index |
| Vexatious filing (3+) | 30-day cooldown applied |
| Quorum not met | Motion cannot pass/fail, extended 24h |

## 5. Test Scenarios

| Test | Steps | Expected Result |
|------|-------|----------------|
| [Test] | [Steps] | [Result] |
