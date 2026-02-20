---
name: release-commander
description: Enforce clean Git + Vercel deploy workflow, environment separation, preview vs prod integrity, and release checklists. Use before deploying to production.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash(git *), Bash(npm *), Bash(npx *)
argument-hint: "[check or deploy or rollback]"
---

# Release Commander

Enforce a clean, disciplined release workflow for Ratio. This skill is manual-invocation only — Claude will never trigger it automatically.

## Mode

- `$ARGUMENTS` = "check": Run the full pre-release checklist without deploying
- `$ARGUMENTS` = "deploy": Run checklist, then guide deployment
- `$ARGUMENTS` = "rollback": Guide rollback procedure

## Pre-Release Checklist

Run each step in order. Stop on first failure.

### 1. Git Status
```bash
git status
```
- [ ] Working directory is clean (no uncommitted changes)
- [ ] On the correct branch (usually `main` for production)
- [ ] No untracked files that should be committed

### 2. Branch Sync
```bash
git fetch origin
git log HEAD..origin/main --oneline
```
- [ ] Local branch is up to date with remote
- [ ] No pending changes on remote that haven't been pulled

### 3. Lint
```bash
npx next lint
```
- [ ] Zero lint errors
- [ ] Zero lint warnings (or only known exceptions)

### 4. Type Check
```bash
npx tsc --noEmit
```
- [ ] Zero TypeScript errors

### 5. Build
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No unexpected warnings
- [ ] All routes generated (check route list in output)

### 6. Route Inventory
After build, verify the route count matches expectations:
- [ ] All expected routes present in build output
- [ ] No unexpected routes (could indicate accidental page creation)
- [ ] Dynamic routes have correct parameter patterns

### 7. Environment Variables
Check `.env.local` and Vercel dashboard:
- [ ] `NEXT_PUBLIC_CONVEX_URL` is set
- [ ] `CONVEX_DEPLOY_KEY` is set (if using Convex deploy)
- [ ] `ANTHROPIC_API_KEY` is set in Convex environment
- [ ] No secrets in committed files (check `.gitignore`)

### 8. Security Scan
```bash
grep -r "API_KEY\|SECRET\|PASSWORD\|TOKEN" --include="*.ts" --include="*.tsx" src/ | grep -v "process.env" | grep -v "// "
```
- [ ] No hardcoded secrets in source code
- [ ] All secrets accessed via `process.env`

### 9. Dependency Audit
```bash
npm audit --production
```
- [ ] No critical vulnerabilities
- [ ] No high vulnerabilities (or documented exceptions)

### 10. Bundle Size
- [ ] First Load JS shared < 100kB
- [ ] No individual page > 150kB First Load JS
- [ ] Check for unexpected large pages

## Deployment Procedure

### Preview Deploy (for PRs)
Vercel automatically deploys preview for every push to a non-main branch.
- Verify preview URL works
- Test critical flows: landing → login → home → sessions

### Production Deploy
Production deploys on push to `main`:

1. Create a new commit with version bump (if applicable)
2. Push to `main`:
   ```bash
   git push origin main
   ```
3. Monitor Vercel deployment dashboard
4. After deploy completes:
   - Verify production URL loads
   - Check Vercel deployment logs for errors
   - Test critical user flows

### Convex Deploy (if schema changed)
```bash
npx convex deploy
```
- Only run after successful Next.js build
- Schema changes require careful review (data migration?)

## Rollback Procedure

If something goes wrong after deployment:

### Quick Rollback (Vercel)
1. Go to Vercel dashboard → Deployments
2. Find the last known good deployment
3. Click "..." → "Promote to Production"
4. This instantly switches traffic to the previous build

### Git Rollback
```bash
# Create a revert commit (NEVER force push to main)
git revert HEAD
git push origin main
```

### Convex Rollback
- Convex schema changes are harder to rollback
- If a table was added: it can safely remain (unused tables don't harm)
- If a field was removed: restore it immediately with `npx convex deploy`

## Output Format

Generate a release checklist report using [templates/release-checklist.md](templates/release-checklist.md).

Mark each step as PASS, FAIL, or SKIP with details.
If any step fails, stop and report the failure with remediation steps.
