# Release Checklist

**Date**: [DATE]
**Branch**: [BRANCH]
**Commit**: [SHA]
**Mode**: [check / deploy / rollback]

---

## Pre-Release Checks

| # | Check | Status | Details |
|---|-------|--------|---------|
| 1 | Git clean | [ ] PASS / FAIL | [Details] |
| 2 | Branch synced | [ ] PASS / FAIL | [Details] |
| 3 | Lint | [ ] PASS / FAIL | [Errors: N] |
| 4 | Type check | [ ] PASS / FAIL | [Errors: N] |
| 5 | Build | [ ] PASS / FAIL | [Routes: N, Warnings: N] |
| 6 | Route inventory | [ ] PASS / FAIL | [Expected: N, Found: N] |
| 7 | Environment vars | [ ] PASS / FAIL | [Missing: N] |
| 8 | Security scan | [ ] PASS / FAIL | [Findings: N] |
| 9 | Dependency audit | [ ] PASS / FAIL | [Critical: N, High: N] |
| 10 | Bundle size | [ ] PASS / FAIL | [Shared: XkB, Largest page: XkB] |

## Result

**Overall**: [READY TO DEPLOY / BLOCKED]

**Blockers** (if any):
1. [Blocker description + remediation]

## Deployment Log (if deploying)

| Step | Time | Status |
|------|------|--------|
| Push to main | [TIME] | [Done/Pending] |
| Vercel build | [TIME] | [Done/Pending] |
| Production URL verified | [TIME] | [Done/Pending] |
| Convex deploy (if needed) | [TIME] | [Done/Pending/N/A] |

## Post-Deploy Verification

- [ ] Landing page loads at production URL
- [ ] Login flow works
- [ ] Home page renders with data
- [ ] Sessions page accessible
- [ ] AI Practice mode functional
- [ ] No console errors in browser
