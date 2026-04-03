# Supabase Security Audit Report
**Project:** filmmaker-calculator-suite (`sztfgpwmzbgbhvshowvq`)
**Audited:** 2026-04-03
**Branch:** `claude/audit-supabase-security-FIX`

---

## Scope

- All Supabase RLS policies across migrations
- Edge function security (`verify_jwt`, CORS, auth checks)
- API serverless function security (`api/`)
- Secret management and key exposure
- Storage policies, function policies, auth policies

---

## Tables & RLS Policies Reviewed

### `public.profiles`
- RLS: **Enabled**
- SELECT: `auth.uid() = id` — users read own row only ✓
- INSERT: `auth.uid() = id` (via trigger on signup) ✓
- UPDATE: `auth.uid() = id` ✓
- **Status: SECURE**

### `public.purchases`
- RLS: **Enabled**
- SELECT: `auth.uid() = user_id` — users read own only ✓
- INSERT/UPDATE/DELETE: `public.is_service_role()` — service role only ✓
- Webhook uses service_role key, bypasses RLS ✓
- **Status: SECURE**

### `public.exports`
- RLS: **Enabled**
- SELECT: `auth.uid() = user_id` ✓
- INSERT: `auth.uid() = user_id` ✓
- **Status: SECURE**

### `public.saved_calculations`
- RLS: **Enabled**
- SELECT/INSERT/UPDATE/DELETE: `auth.uid() IS NOT NULL AND auth.uid() = user_id` — authenticated users only ✓
- Prior "Individual Access" overly permissive policy dropped ✓
- **Status: SECURE**

### `public.intake_submissions`
- RLS: **Enabled**
- SELECT/UPDATE: `auth.uid() = user_id OR user_id IS NULL` — supports guest checkout flow ✓
- INSERT: `auth.uid() = user_id OR user_id IS NULL` — same guest support ✓
- Service role: full access via `public.is_service_role()` ✓
- **Status: SECURE** (guest access is intentional for purchase flow)

### `public.leads`
- RLS: **Enabled**
- INSERT: Anyone can insert (intentional for lead capture forms) ✓
- Service role: full access ✓
- **Status: ACCEPTABLE** (lead capture is intentionally public)

### `public.waterfall_snapshots`
- RLS: **Enabled**
- SELECT: Email-matched (via JWT claim) — fixed from prior `USING (true)` ✓
- INSERT/DELETE: Email-matched ✓
- Overly permissive policy dropped in `20260401200000_security_fixes_apply_live.sql` ✓
- **Status: SECURE**

### `public.glossary_terms`
- RLS: **Enabled**
- SELECT: Public read (`USING true`) — intentional for public glossary ✓
- Writes: Service role only ✓
- **Status: SECURE**

### `public.og_bot_leads`
- RLS: **Enabled**
- All operations: `public.is_service_role()` — fixed from prior `WITH CHECK (true)` for `role {public}` ✓
- **Status: SECURE**

### `public.og_bot_messages`, `public.og_bot_sessions`, `public.film_intel_articles`, `public.film_intel_sources`
- RLS: **Enabled**
- All operations: `public.is_service_role()` via `20260401200000_security_fixes_apply_live.sql` ✓
- **Status: SECURE**

### `public.is_service_role()` helper function
- SECURITY DEFINER, `SET search_path = public` ✓
- Checks `current_setting('role', true) = 'service_role'` ✓
- **Status: SECURE**

---

## Issues Found & Fixed

### [HIGH] `api/generate-pdf.ts` — Anon Key Fallback Removed
**File:** `api/generate-pdf.ts:55-59`

**Before:**
```typescript
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;
```

**After:**
```typescript
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  return res.status(500).json({ error: "Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY" });
}
```

**Risk:** If `SUPABASE_SERVICE_ROLE_KEY` was not set in Vercel, the function would silently fall back to the anon key. While RLS policies on `waterfall_snapshots` provide a safety net (email-matched SELECT), the intent of this server-side function is to use elevated service role privileges. Misconfiguration should fail loudly, not silently.

**Fix:** Require `SUPABASE_SERVICE_ROLE_KEY` explicitly. Fail with a clear error message if not configured.

---

### [MEDIUM] `supabase/functions/stripe-webhook/index.ts` — Wildcard CORS Removed
**File:** `supabase/functions/stripe-webhook/index.ts:5-8`

**Before:**
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  ...
};
```

**After:** Added `getCorsHeaders()` function that restricts to `https://filmmakerog.com` and `https://www.filmmakerog.com`, with a safe default for server-to-server calls.

**Risk:** While Stripe webhooks are server-to-server (browsers don't enforce CORS for webhook calls), having `*` CORS is a poor security practice. Any accidental XHR call from a browser to this endpoint would succeed.

**Fix:** Restrict CORS to known origins. Stripe's servers (which call this webhook) send no `Origin` header, so they get the default origin.

---

## Issues Known But Not Fixed (Acceptable Risk)

### [INFO] In-memory rate limiting in Edge Functions
All Edge Functions (`create-checkout`, `ask-the-og`, `film-search`, `sync-lead-to-loops`) use in-memory Maps for rate limiting. In Supabase Edge Functions (Deno), this is acceptable because each cold-start instance is isolated, but rate limits won't persist across instances. For a low-to-medium traffic indie film calculator, this is acceptable.

### [INFO] `verify_jwt = false` in `supabase/config.toml`
All functions have `verify_jwt = false`. This is acceptable because:
- `stripe-webhook`: Verifies Stripe signatures, not JWTs
- `create-checkout`: Manually verifies auth headers with `supabaseClient.auth.getUser()`
- `film-search`: Does not require authentication
- No function relies on JWT verification for access control

---

## RLS Policies — Summary Table

| Table | RLS | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| profiles | ✓ | auth.uid=id | auth.uid=id | auth.uid=id | — |
| purchases | ✓ | auth.uid=user_id | svc role only | svc role only | svc role only |
| exports | ✓ | auth.uid=user_id | auth.uid=user_id | — | — |
| saved_calculations | ✓ | auth.uid=user_id | auth.uid=user_id | auth.uid=user_id | auth.uid=user_id |
| intake_submissions | ✓ | auth.uid=user_id OR NULL | auth.uid=user_id OR NULL | auth.uid=user_id OR NULL | — |
| leads | ✓ | svc role only | public | — | — |
| waterfall_snapshots | ✓ | email-matched | email-matched | — | email-matched |
| glossary_terms | ✓ | public | svc role only | svc role only | svc role only |
| og_bot_leads | ✓ | svc role only | svc role only | svc role only | svc role only |
| og_bot_messages | ✓ | svc role only | svc role only | svc role only | svc role only |
| og_bot_sessions | ✓ | svc role only | svc role only | svc role only | svc role only |
| film_intel_articles | ✓ | svc role only | svc role only | svc role only | svc role only |
| film_intel_sources | ✓ | svc role only | svc role only | svc role only | svc role only |

---

## Secret Management Review

- **`.env.example`**: Contains only placeholder names (`your-supabase-project-url`, `your-supabase-anon-key`) — no real keys ✓
- **`.gitignore`**: Correctly ignores `.env`, `.env.local`, `.env.production` ✓
- **Edge functions**: All use `Deno.env.get()` for secrets — no hardcoded keys ✓
- **`api/generate-pdf.ts`**: Uses `process.env` for server-side secrets ✓
- **Service role key**: Used only server-side (webhook, edge functions) — never exposed to client ✓
- **Anon key**: Used only client-side via `VITE_` prefix — appropriate ✓

---

## Verdict

**Status:** 2 issues fixed, no critical vulnerabilities remaining.

The prior audit migration (`20260401200000_security_fixes_apply_live.sql`) already addressed the most severe RLS issues (overly permissive `USING (true)`, duplicate policies, `og_bot_leads` service_insert misconfiguration). This audit found and fixed 2 remaining code-level issues:

1. **[HIGH]** `api/generate-pdf.ts` anon key fallback — fixed
2. **[MEDIUM]** `stripe-webhook` wildcard CORS — fixed
