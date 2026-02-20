#!/bin/bash
# Pre-release check script for Ratio
# Run: bash .claude/skills/release-commander/scripts/pre-release-check.sh

set -e

echo "========================================="
echo "  RATIO PRE-RELEASE CHECK"
echo "========================================="
echo ""

# 1. Git Status
echo "[1/8] Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
  echo "  FAIL: Working directory has uncommitted changes"
  git status --short
  exit 1
else
  echo "  PASS: Working directory clean"
fi

# 2. Branch Check
echo "[2/8] Checking branch..."
BRANCH=$(git branch --show-current)
echo "  Current branch: $BRANCH"

# 3. Lint
echo "[3/8] Running lint..."
if npx next lint --quiet 2>/dev/null; then
  echo "  PASS: No lint errors"
else
  echo "  FAIL: Lint errors found"
  exit 1
fi

# 4. Type Check
echo "[4/8] Running type check..."
if npx tsc --noEmit 2>/dev/null; then
  echo "  PASS: No type errors"
else
  echo "  FAIL: Type errors found"
  exit 1
fi

# 5. Build
echo "[5/8] Running build..."
if npm run build 2>/dev/null; then
  echo "  PASS: Build successful"
else
  echo "  FAIL: Build failed"
  exit 1
fi

# 6. Security Scan
echo "[6/8] Scanning for hardcoded secrets..."
SECRETS=$(grep -r "API_KEY\|SECRET\|PASSWORD\|TOKEN" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | grep -v "process.env" | grep -v "// " | grep -v "interface\|type\|const.*=" || true)
if [ -z "$SECRETS" ]; then
  echo "  PASS: No hardcoded secrets found"
else
  echo "  WARN: Potential secrets found:"
  echo "$SECRETS"
fi

# 7. Dependency Audit
echo "[7/8] Running dependency audit..."
AUDIT=$(npm audit --production 2>/dev/null || true)
CRITICAL=$(echo "$AUDIT" | grep -c "critical" || echo "0")
HIGH=$(echo "$AUDIT" | grep -c "high" || echo "0")
echo "  Critical: $CRITICAL, High: $HIGH"

# 8. Bundle Size Check
echo "[8/8] Bundle size check..."
echo "  (Review build output above for bundle sizes)"

echo ""
echo "========================================="
echo "  PRE-RELEASE CHECK COMPLETE"
echo "========================================="
