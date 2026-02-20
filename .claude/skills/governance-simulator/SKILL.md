---
name: governance-simulator
description: Implement constitutional governance flows inside Ratio — Assembly motions, voting, tribunal/appeals, moderation, standing orders — with procedural safeguards. Use when working on parliament, tribunal, or governance features.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npx tsc *)
argument-hint: "[legislative or judicial or executive or full-spec]"
---

# Governance Simulator

Implement the three-branch constitutional governance system for Ratio. This system mirrors real UK institutional structures adapted for a digital student society.

## Mode

- `$ARGUMENTS` = "legislative": Focus on motions, voting, debates, standing orders
- `$ARGUMENTS` = "judicial": Focus on tribunal, cases, judgments, appeals
- `$ARGUMENTS` = "executive": Focus on moderation, roles, conduct code, audit
- `$ARGUMENTS` = "full-spec": Produce complete specification for all three branches

## Architecture

### Three Branches

```
LEGISLATIVE              EXECUTIVE              JUDICIAL
(Parliament)             (Administration)       (Tribunal)
├── Motions              ├── Standing Orders    ├── Case Filing
├── Amendments           ├── Governance Roles   ├── Submissions
├── Debates              ├── Moderation         ├── Hearings
├── Voting               ├── Question Time      ├── Judgments
└── Hansard              └── Audit Log          └── Appeals
```

### Governance Tiers

| Tier | Requirements | Capabilities |
|------|-------------|-------------|
| Member | Any registered user | View all proceedings |
| Accredited | 3+ moots, avg >= 50 | Speak in debates, file tribunal cases |
| Voting | 10+ moots, avg >= 60 | Propose motions, cast votes |
| Constitutional | 30+ moots, avg >= 70 | Propose constitutional amendments |
| Judicial | 50+ moots, avg >= 80 | Preside tribunal, issue judgments |

## Legislative Rules

### Motion Lifecycle
1. **Draft** → Author prepares (private)
2. **Tabled** → Submitted to Assembly (public, awaiting second)
3. **Seconded** → Another Voting member seconds (cannot self-second)
4. **Debating** → Open for debate contributions
5. **Voting** → Debate closed, voting period opens (72 hours)
6. **Passed** / **Defeated** → Based on vote count

### Voting Rules
- Simple majority for policy motions (>50% of Aye+No)
- Two-thirds supermajority for constitutional motions
- Quorum: 20% of eligible voters must participate
- One vote per member: Aye, No, or Abstain
- Votes are pseudonymised during voting, public after close
- No proxy voting
- Voting period: 72 hours (standard) / 7 days (constitutional)

### Debate Rules
- Speakers alternate between "for" and "against"
- Maximum 500 words per contribution
- Points of order dealt with immediately
- Speaker (governance role) manages debate order

## Executive Rules

### Moderation Workflow
1. Content flagged (by user or AI)
2. Respondent notified (48-hour response window)
3. Moderator reviews with proportionality assessment
4. Action: Warning → Content Removed → Restriction → Tribunal Referral
5. Every sanction requires written proportionality assessment

### Key Principle
**Controversial legal arguments are ALWAYS permissible** provided they are presented with professional decorum. The moderation system must distinguish between:
- Legitimate legal argument (always permitted, even if offensive to some)
- Harassment or personal attack (never permitted)
- Defamatory statements (removed under Defamation Act 2013 principles)

### Governance Roles
| Role | Appointed By | Duties |
|------|-------------|--------|
| Speaker | Elected by motion | Chair debates, manage order |
| Deputy Speaker | Appointed by Speaker | Deputise when Speaker absent |
| Whip | Elected by motion | Encourage participation, manage quorum |
| Clerk | Appointed by Speaker | Record proceedings, manage motions |
| Moderator | Elected by motion | Content moderation, enforce conduct code |

## Judicial Rules

### Case Lifecycle
1. **Filed** → Applicant submits IRAC-structured filing
2. **Acknowledged** → Tribunal reviews within 48 hours
3. **Served** → Respondent notified
4. **Submissions** → Both parties submit written arguments
5. **Hearing** → Live text-based hearing (if required)
6. **Judgment** → Published with full reasoning
7. **Appeal** → Single appeal to 3-member panel

### Remedies Available
- Decision voided
- Corrective action required
- Declaration of rights
- Restriction lifted
- With proportionality requirement for all remedies

### Vexatious Filing Protection
- 3+ dismissed cases = filing cooldown (30 days)
- Pattern detection: same filer, same respondent, similar issues
- Tribunal may declare a filer vexatious

## UK Legal Realism

- **Defamation Act 2013**: Conduct code prohibits defamatory statements
- **Equality Act 2010**: Vexatious filing detection
- **UK GDPR**: Votes pseudonymised, right to erasure (judgments anonymised)
- **Proportionality**: Every sanction requires written assessment
- **No Tokens/Securities**: Governance tiers are non-transferable, no financial value

## Existing Code

### Schema (in `convex/schema.ts`)
- `parliamentarySessions`, `motions`, `amendments`, `votes`, `debates`
- `standingOrders`, `governanceRoles`, `moderationActions`, `auditLog`
- `cases`, `caseSubmissions`, `hearings`, `judgments`
- `governanceTiers`, `conductCode`

### Backend (in `convex/governance/`)
- `legislative.ts` — Motions, voting, debates, standing orders
- `judicial.ts` — Cases, submissions, judgments
- `executive.ts` — Moderation, roles, conduct code, audit
- `tiers.ts` — Tier calculation

### Frontend (in `src/app/(app)/`)
- `parliament/` — Parliament hub, motions list, motion detail, create motion, standing orders
- `tribunal/` — Tribunal hub, case detail, file case

## Output

Produce detailed implementation plans with:
1. Convex mutations/queries needed (reference existing ones)
2. Frontend components to create/modify
3. Business logic rules (quorum calculation, vote tallying, tier checking)
4. Edge cases to handle
5. Test scenarios

Use the template in [templates/governance-spec.md](templates/governance-spec.md).
