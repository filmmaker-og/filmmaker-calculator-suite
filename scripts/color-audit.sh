#!/usr/bin/env bash
# COLOR DRIFT AUDIT — filmmaker.og
# Counts raw rgba() that should use tokens.ts. Fails if count goes UP.
# Usage: npm run color-audit         (check)
#        npm run color-audit -- fix   (update baseline)

set -euo pipefail
BASELINE_FILE=".color-baseline"

# Count raw rgba in component/page files (excluding token definitions)
TOTAL=$(grep -roh "rgba(" src/ --include="*.tsx" --include="*.ts" | wc -l | tr -d ' ')
DEFS=$(grep -oh "rgba(" src/lib/tokens.ts src/lib/design-system.ts 2>/dev/null | wc -l | tr -d ' ')
COUNT=$((TOTAL - DEFS))

echo ""
echo "  ════════════════════════════════════════"
echo "  COLOR DRIFT AUDIT"
echo "  ════════════════════════════════════════"
echo "  Raw rgba() in components/pages: $COUNT"

if [ -f "$BASELINE_FILE" ]; then
  BASELINE=$(cat "$BASELINE_FILE" | tr -d ' \n')
  DIFF=$((COUNT - BASELINE))
  if [ "$DIFF" -gt 0 ]; then
    echo "  ⚠️  DRIFT: +$DIFF new raw rgba since baseline ($BASELINE)"
    echo "  Use tokens.ts: gold(), white(), red(), green(), etc."
    echo ""
    exit 1
  elif [ "$DIFF" -lt 0 ]; then
    echo "  ✅ IMPROVED: ${DIFF#-} values migrated (baseline: $BASELINE)"
  else
    echo "  ✅ HOLDING at baseline ($BASELINE)"
  fi
else
  echo "  ℹ️  No baseline. Run: npm run color-audit -- fix"
fi

if [ "${1:-}" = "fix" ]; then
  echo "$COUNT" > "$BASELINE_FILE"
  echo "  📌 Baseline set to $COUNT"
fi
echo ""
