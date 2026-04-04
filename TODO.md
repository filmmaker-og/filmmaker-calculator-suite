# FILMMAKER.OG — Code vs Strategy Congruency Roadmap

**Audit Date:** 2026-04-04
**Source of Truth:** `CONVERSION_STRATEGY.md`
**Status:** Report only. No destructive edits executed.

---

## HIGH-RISK MISMATCHES

| ID | Issue | File(s) | Strategy Says | Code Says |
|----|-------|---------|---------------|-----------|
| H1 | **Wrong business model on Pricing page** | `src/pages/Pricing.tsx:31-76` | One-time purchases: Snapshot+ $19, Comp Report $595, etc. | SaaS subscriptions: Founding $19/mo, Standard $49/mo, Power $97/mo |
| H2 | **SaaS tier migration contradicts strategy** | `supabase/migrations/20260403000000_saas_tier_migration_v1.sql` | One-time purchases only | Creates subscriptions table, tier columns, recurring billing schema |
| H3 | **Active OTP/magic-link in lead flow** | `src/pages/Auth.tsx:70-78`, `src/components/EmailGateModal.tsx:47-52` | "NO OTP. NO MAGIC LINK. NO SUPABASE AUTH." | `signInWithOtp()` actively called |
| H4 | **`leads` table missing** | No migration exists | Create `public.leads` table (Section 3) | Only referenced in security fixes migration that drops policies on it |
| H5 | **`store-products.ts` missing** | `src/lib/store-products.ts` (does not exist) | Update store-products.ts (Execution #2) | StorePackage.tsx imports from it — would break build |
| H6 | **`deal-insight` edge function not in repo** | `src/components/calculator/WaterfallDeck.tsx:364` | Edge functions should be source-controlled | Called from client code but no source in `/supabase/functions/` |

## MEDIUM-RISK ISSUES

| ID | Issue | File(s) |
|----|-------|---------|
| M1 | BuildYourPlan.tsx references dead products (the-full-analysis, the-blueprint, the-pitch-package) | `src/pages/BuildYourPlan.tsx:134,177-186` |
| M2 | IntakeStep6.tsx references dead products | `src/components/intake/IntakeStep6.tsx:87-88,346-358` |
| M3 | Pricing.tsx ad-hoc services show wrong prices (Comp Report "starts at $90") | `src/pages/Pricing.tsx:91-95` |
| M4 | `film-search` edge function orphaned — never invoked | `supabase/functions/film-search/` |
| M5 | `sync-lead-to-loops` WEBHOOK_SECRET is optional (security gap) | `supabase/functions/sync-lead-to-loops/index.ts:26-31` |
| M6 | `og_bot_leads` table has no CREATE migration in repo | Used by `supabase/functions/ask-the-og/index.ts` |

## LOW-RISK ISSUES

| ID | Issue | File(s) |
|----|-------|---------|
| L1 | Orphaned auth pages: Auth.tsx, Login.tsx, Signup.tsx + routes | `src/pages/Auth.tsx`, `Login.tsx`, `Signup.tsx`, `src/App.tsx:75,78-79` |
| L2 | `input-otp` dependency unused | `package.json:60` |
| L3 | `supabase/config.toml` incomplete (3 of 6 functions listed) | `supabase/config.toml` |
| L4 | Supabase client auth config still enabled | `src/integrations/supabase/client.ts` |
| L5 | No analytics in codebase | Strategy Section 8 |

## ZOMBIE COMPONENTS

| File | Type | Issue |
|------|------|-------|
| `src/pages/Auth.tsx` | Page | Active OTP flow, strategy says delete |
| `src/pages/Login.tsx` | Page | Empty placeholder |
| `src/pages/Signup.tsx` | Page | Empty placeholder |
| `src/components/EmailGateModal.tsx` | Component | Active OTP, strategy says evaluate for removal |
| `src/pages/Pricing.tsx` | Page | Entire SaaS subscription model contradicts strategy |
| `supabase/functions/film-search/` | Edge Function | Never invoked, superseded by ask-the-og |
| `supabase/migrations/20260403000000_saas_tier_migration_v1.sql` | Migration | SaaS subscription schema not in strategy (not applied to prod) |
| `package.json` → `input-otp` | Dependency | Unused |

## WHAT'S WORKING (Strategy-Aligned)

| Component | Status |
|-----------|--------|
| `create-checkout` edge function prices | Snapshot+ $19, Comp Report $595/$995, Producer's Package $1,797, Working Model $79 |
| `WaterfallDeck.tsx` Gate 0 | Shows $19 Snapshot+ gate correctly |
| `ask-the-og` edge function | Switched to Claude, streaming SSE, product ladder in system prompt |
| `stripe-webhook` edge function | Handles checkout.session.completed → purchases table |
| Legacy product blocking in create-checkout | Returns errors for the-blueprint, the-pitch-package |

---

## EXECUTION ROADMAP

### Phase 1: Critical Fixes (Unblock the Funnel)

- [ ] **T1.1** Create `leads` table migration per strategy Section 3 schema
- [ ] **T1.2** Create `og_bot_leads` table migration (match production schema)
- [ ] **T1.3** Remove `signInWithOtp()` from `src/pages/Auth.tsx` and `src/components/EmailGateModal.tsx`
- [ ] **T1.4** Update `LeadCaptureModal.tsx` to insert into `leads` table (if not already)
- [ ] **T1.5** Remove `supabase.auth.getSession()` from `Calculator.tsx` — use `localStorage.getItem('og_lead_email')` instead
- [ ] **T1.6** Create `src/lib/store-products.ts` with product definitions matching strategy Section 1

### Phase 2: Purge Dead Code

- [ ] **T2.1** Delete `src/pages/Auth.tsx`, `src/pages/Login.tsx`, `src/pages/Signup.tsx`
- [ ] **T2.2** Remove `/auth`, `/login`, `/signup` routes from `src/App.tsx`
- [ ] **T2.3** Evaluate and likely delete `src/components/EmailGateModal.tsx`
- [ ] **T2.4** Remove `input-otp` from `package.json`
- [ ] **T2.5** Delete `supabase/functions/film-search/` directory
- [ ] **T2.6** Remove `film-search` entry from `supabase/config.toml`
- [ ] **T2.7** Delete `supabase/migrations/20260403000000_saas_tier_migration_v1.sql`

### Phase 3: Fix Pricing Contradictions

- [ ] **T3.1** Rewrite `src/pages/Pricing.tsx` — one-time purchases: Snapshot+ $19, Comp Report $595/$995, Producer's Package $1,797, Boutique $2,997+
- [ ] **T3.2** Update `BuildYourPlan.tsx` — remove dead product refs, preserve backward compat for existing purchases
- [ ] **T3.3** Update `IntakeStep6.tsx` — same treatment

### Phase 4: Edge Function Parity

- [ ] **T4.1** Add `deal-insight` source to `/supabase/functions/deal-insight/index.ts` (pull from Supabase dashboard)
- [ ] **T4.2** Add missing functions to `supabase/config.toml` (ask-the-og, sync-lead-to-loops, seed-ops)
- [ ] **T4.3** Make `WEBHOOK_SECRET` mandatory in `sync-lead-to-loops/index.ts`
- [ ] **T4.4** Configure Supabase database webhook: `leads.INSERT` → `sync-lead-to-loops`

### Phase 5: Polish & Infrastructure

- [ ] **T5.1** Add analytics integration (strategy Section 8)
- [ ] **T5.2** Implement free PDF back-page breadcrumb (strategy Section 2, step 6)
- [ ] **T5.3** Set up Loops email sequences (strategy Section 4)
- [ ] **T5.4** Store page redesign (strategy Execution #8)

---

## DECISIONS (RESOLVED)

| # | Decision | Answer |
|---|----------|--------|
| 1 | SaaS migration applied to production? | **No.** Safe to delete. |
| 2 | Pricing.tsx disposition? | **Rewrite** to match strategy one-time purchase model. |
| 3 | Auth purge scope? | **Lead flow only.** Keep auth for BuildYourPlan/Dashboard. |
| 4 | film-search edge function? | **Delete.** Orphaned, superseded by ask-the-og. |
| 5 | Snapshot+ on store page? | **Open.** Needs decision. |

---

*Generated by codebase audit. Execute phase-by-phase with stakeholder approval.*
