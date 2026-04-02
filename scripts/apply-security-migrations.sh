#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Run security migrations on filmmaker-calculator-suite Supabase project
# Project: sztfgpwmzbgbhvshowvq
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

echo "🔒 Running security migrations for filmmaker-calculator-suite..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI not found. Install it with one of these:"
  echo ""
  echo "  macOS:      brew install supabase/tap/supabase"
  echo "  Linux/WSL:  brew install supabase/tap/supabase  (if you have brew)"
  echo "  npm:        npx supabase@latest login"
  echo ""
  echo "Or use the SQL Editor at https://supabase.com/dashboard/project/sztfgpwmzbgbhvshowvq/sql"
  echo "and paste each migration file manually."
  exit 1
fi

# Check for management token
SUPABACE_ACCESS_TOKEN="${SUPABACE_ACCESS_TOKEN:-}"
if [ -z "$SUPABACE_ACCESS_TOKEN" ]; then
  echo "🔑 You need your Supabase Management Token to push migrations."
  echo ""
  echo "Get it from: https://supabase.com/dashboard/account/tokens"
  echo ""
  read -p "Paste your management token: " SUPABACE_ACCESS_TOKEN
  export SUPABACE_ACCESS_TOKEN
fi

echo "📋 Applying 4 migrations..."
echo ""

MIGRATIONS=(
  "20260401200000_fix_intake_rls_guest_isolation.sql"
  "20260401200100_fix_purchases_exports_rls.sql"
  "20260401200200_add_missing_rls_policies.sql"
  "20260401200300_add_intake_check_constraints.sql"
)

for migration in "${MIGRATIONS[@]}"; do
  echo "  ➡️  $migration"
done
echo ""

# Push all migrations to the remote project
supabase db push \
  --db-url "postgresql://postgres:$(echo "Enter your database password: "; stty -echo; read -r pw; stty echo; echo "$pw")@db.sztfgpwmzbgbhvshowvq.supabase.co:5432/postgres" \
  --include-all

echo ""
echo "✅ All migrations applied!"
echo "Your security patches are now live."
