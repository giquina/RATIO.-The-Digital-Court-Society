#!/bin/bash
# RATIO Doc Sync Checker
# Run at the start of each session to catch contradictions between project docs.
# Usage: bash scripts/doc-sync-check.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ISSUES=0

echo "========================================="
echo "  RATIO — Doc Sync Check"
echo "  $(date '+%Y-%m-%d %H:%M')"
echo "========================================="
echo ""

# --- 1. Check table count consistency ---
# Count defineTable calls (exclude the import line)
SCHEMA_TABLES=$(grep -c ": defineTable(" "$PROJECT_ROOT/convex/schema.ts" 2>/dev/null || echo "?")
echo "[1] Schema table count: $SCHEMA_TABLES"

for file in CLAUDE.md ARCHITECTURE.md UPOS.md README.md; do
  MENTIONED=$(grep -oP '\d+ tables' "$PROJECT_ROOT/$file" 2>/dev/null | head -1)
  if [ -n "$MENTIONED" ] && ! echo "$MENTIONED" | grep -q "$SCHEMA_TABLES"; then
    echo "  WARNING: $file says '$MENTIONED' but schema has $SCHEMA_TABLES"
    ISSUES=$((ISSUES + 1))
  fi
done
echo ""

# --- 2. Check route count consistency ---
ROUTE_COUNT=$(ls -d "$PROJECT_ROOT/src/app/(app)"/*/ 2>/dev/null | wc -l | tr -d ' ')
echo "[2] Authenticated route count: $ROUTE_COUNT"

for file in CLAUDE.md ARCHITECTURE.md UPOS.md; do
  MENTIONED=$(grep -oP '\d+ (authenticated )?routes' "$PROJECT_ROOT/$file" 2>/dev/null | head -1)
  if [ -n "$MENTIONED" ] && ! echo "$MENTIONED" | grep -q "$ROUTE_COUNT"; then
    echo "  WARNING: $file says '$MENTIONED' but filesystem has $ROUTE_COUNT"
    ISSUES=$((ISSUES + 1))
  fi
done
echo ""

# --- 3. Check AI model references ---
echo "[3] AI model references:"
HAIKU_COUNT=$(grep -rl "claude-haiku" "$PROJECT_ROOT/src/app/api/ai/" 2>/dev/null | wc -l | tr -d ' ')
SONNET_COUNT=$(grep -rl "claude-sonnet" "$PROJECT_ROOT/convex/" 2>/dev/null | wc -l | tr -d ' ')
echo "  API routes using Haiku: $HAIKU_COUNT files"
echo "  Convex backend using Sonnet: $SONNET_COUNT files"

# Check if docs still mention wrong models
for file in CLAUDE.md ARCHITECTURE.md UPOS.md README.md docs/PRODUCT.md docs/FAQ.md; do
  if grep -q "Claude Sonnet (primary)" "$PROJECT_ROOT/$file" 2>/dev/null; then
    echo "  WARNING: $file still says 'Claude Sonnet (primary)' — should distinguish Sonnet (backend) vs Haiku (API)"
    ISSUES=$((ISSUES + 1))
  fi
done
echo ""

# --- 4. Check LOGS.md is up to date ---
echo "[4] LOGS.md freshness:"
LAST_LOG_DATE=$(grep -oP '202\d-\d{2}-\d{2}' "$PROJECT_ROOT/LOGS.md" 2>/dev/null | tail -1)
TODAY=$(date '+%Y-%m-%d')
echo "  Last log entry date: ${LAST_LOG_DATE:-unknown}"
echo "  Today: $TODAY"
if [ "$LAST_LOG_DATE" != "$TODAY" ] && [ -n "$LAST_LOG_DATE" ]; then
  DAYS_SINCE=$(( ($(date -d "$TODAY" +%s) - $(date -d "$LAST_LOG_DATE" +%s)) / 86400 ))
  if [ "$DAYS_SINCE" -gt 1 ]; then
    echo "  WARNING: LOGS.md is ${DAYS_SINCE} days behind. Remember to log this session."
    ISSUES=$((ISSUES + 1))
  fi
fi
echo ""

# --- 5. Check SECURITY.md for false claims ---
echo "[5] SECURITY.md reality check:"
if grep -q "All Convex mutations verify" "$PROJECT_ROOT/SECURITY.md" 2>/dev/null; then
  # Check if requireProfile helper actually exists
  if [ ! -f "$PROJECT_ROOT/convex/lib/auth.ts" ]; then
    echo "  WARNING: SECURITY.md claims all mutations verify identity, but convex/lib/auth.ts doesn't exist"
    ISSUES=$((ISSUES + 1))
  fi
fi
if grep -q "validate input strings against length limits" "$PROJECT_ROOT/SECURITY.md" 2>/dev/null; then
  if [ ! -f "$PROJECT_ROOT/convex/lib/validation.ts" ]; then
    echo "  WARNING: SECURITY.md references convex/lib/validation.ts but it doesn't exist"
    ISSUES=$((ISSUES + 1))
  fi
fi

# Check for "planned" vs "current state" language
PLANNED_COUNT=$(grep -c "Planned\|Known issue\|not yet\|has not been implemented" "$PROJECT_ROOT/SECURITY.md" 2>/dev/null || echo 0)
echo "  Honest 'planned/known issue' markers in SECURITY.md: $PLANNED_COUNT"
echo ""

# --- 6. Check open security findings ---
echo "[6] Open security findings:"
OPEN_FINDINGS=$(grep -c "| Open |" "$PROJECT_ROOT/SECURITY.md" 2>/dev/null || echo 0)
echo "  Open findings in SECURITY.md: $OPEN_FINDINGS"
echo ""

# --- Summary ---
echo "========================================="
if [ "$ISSUES" -eq 0 ]; then
  echo "  All clear. No contradictions found."
else
  echo "  Found $ISSUES issue(s). Fix before continuing."
fi
echo "========================================="
