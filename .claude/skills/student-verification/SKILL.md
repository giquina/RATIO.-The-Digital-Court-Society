---
name: student-verification
description: Design and implement student-only access rules for Ratio, including UK-focused verification logic, onboarding messaging, and UK GDPR considerations. Use when working on verification flows, access control, or student identity management.
allowed-tools: Read, Grep, Glob, Edit, Write, Bash(npx tsc *)
argument-hint: "[design or implement or audit]"
---

# Student Verification System

Design and implement student-only access rules for Ratio — a UK law student constitutional institution.

## Mode

- `$ARGUMENTS` = "design": Produce a specification document only (no code changes)
- `$ARGUMENTS` = "implement": Write the code changes described in the spec
- `$ARGUMENTS` = "audit": Review existing verification code for completeness and compliance

## Core Principle

**Ratio membership is limited to verified UK law students and alumni associates.** This is not a gating mechanism for monetisation — it is an institutional integrity requirement. Like the Bar Standards Board requiring qualification before practice, Ratio requires student status before governance participation.

## Verification Methods

### Primary: University Email (.ac.uk)
- Accept any email ending in `.ac.uk`
- Maintain an approved domain list in `src/lib/constants/universities.ts`
- Send verification email with 6-digit code (valid 15 minutes)
- On verification: set `verifiedStatus: "verified"`, `verificationExpiry: +12 months`
- One email per account. Changing email requires re-verification.

### Fallback: Manual Review
- Student submits: university name, student ID, year of study
- Student ID is encrypted at rest (never stored in plaintext)
- Admin reviews within 1-2 working days
- Approval triggers same verified status as email verification

### Re-verification
- Verification expires after 12 months
- 30-day grace period after expiry (full access retained)
- After grace period: account transitions to "Associate" status
  - Associate: read-only governance, cannot vote or propose motions
  - Full profile and session history retained
  - Can re-verify at any time to restore full access

## Data Model Changes

### Extend `profiles` table (or create `verification` table):
```
verifiedStatus: "pending" | "verified" | "expired" | "associate"
verifiedAt: string (ISO date)
verificationExpiry: string (ISO date)
verificationMethod: "email" | "manual"
institutionDomain: string (e.g., "ucl.ac.uk")
```

### New `verificationRequests` table:
```
profileId: Id<"profiles">
type: "email" | "manual"
email: string (for email verification)
code: string (hashed, for email verification)
university: string (for manual verification)
studentId: string (encrypted, for manual verification)
status: "pending" | "approved" | "rejected" | "expired"
reviewedBy: optional Id<"profiles">
submittedAt: string
reviewedAt: optional string
```

## Routes/Components to Modify

| File | Change |
|------|--------|
| `src/app/(auth)/verify/page.tsx` | Already created — review and enhance |
| `src/components/guards/VerifiedOnly.tsx` | Already created — wire to real Convex query |
| `src/middleware.ts` | Add verification status check for governance routes |
| `src/app/(app)/parliament/**` | Wrap all pages in VerifiedOnly |
| `src/app/(app)/tribunal/**` | Wrap all pages in VerifiedOnly |
| `convex/schema.ts` | Add `verificationRequests` table |
| `convex/verification.ts` | New: verification mutations and queries |
| `src/stores/authStore.ts` | Extend with verification status |

## UK GDPR Compliance

1. **Data Minimisation**: Collect only what is necessary (email OR student ID, not both)
2. **Purpose Limitation**: Student ID used solely for verification, never shared
3. **Storage Limitation**: Delete unneeded verification data after 30 days
4. **Encryption**: Student IDs encrypted at rest
5. **Right to Erasure**: Users can request deletion of verification data
6. **Transparency**: Clear privacy notice on verification page explaining:
   - What data is collected
   - Why it is collected
   - How long it is retained
   - Who has access
7. **Lawful Basis**: Legitimate interest (institutional integrity)

## Safety Controls

- Rate limit: Max 3 verification attempts per hour per IP
- Fraud detection: Flag if same student ID used across multiple accounts
- Admin audit log: All verification decisions logged
- Appeal process: Rejected applicants can email support@ratio.law

## Output

When in "design" mode, produce a detailed specification document following the template in [templates/verification-spec.md](templates/verification-spec.md).

When in "implement" mode, create/modify the files listed above with working code.

When in "audit" mode, review existing code and produce a compliance checklist.
