# Production vs. Repo Congruency Audit — Filmmaker.OG

**Date:** 2026-04-05
**Repo:** `filmmaker-calculator-suite`
**Live Site:** https://filmmakerog.com
**Branch:** `claude/audit-prod-repo-congruency-O2ufc`

> **Note:** The live site returns HTTP 403 for automated crawlers. Production URL verification is based on the repo's `sitemap.xml`, route definitions (`src/App.tsx`), navigation components, and Vercel config. A manual browser verification of the live site is recommended as a follow-up.

---

## Severity Summary

| Severity | Count | Key Items |
|---|---|---|
| **CRITICAL** | 3 | Comp Report price mismatch ($90 vs $595); 5 edge functions not in repo (`deal-insight` + 4 `film-intel-*`); 8 migrated tables not deployed to production |
| **HIGH** | 2 | AI bot & Calculator link to `/store/*` URLs that redirect away from product context; 3 Stripe subscription products exist with no checkout flow in code |
| **MEDIUM** | 5 | Sitemap lists `/store` not `/pricing`; SaaS tables with no frontend code; legacy tier names in investor deck; `saved_calculations` orphan table; Boutique in Stripe but not in `create-checkout` |
| **LOW** | 6 | `exports` orphan table; `film-search` in repo but not deployed; `filmmaker-logo.jpg` unused; 3 legacy Stripe products; 2 ops tables in prod not in repo; ops tables without migrations |

---

## 1. Route Mapping — Parity Report

### Routes defined in `src/App.tsx` (lines 67-85)

| Route | Component | In Sitemap? | In Nav? | Status |
|---|---|---|---|---|
| `/` | `Index` | Yes | Home (`MobileMenu.tsx:275`) | OK |
| `/calculator` | `Calculator` | Yes | `MobileMenu.tsx:227` | OK |
| `/store` | `<Navigate to="/pricing">` | Yes (stale) | `MobileMenu.tsx:228` ("Shop") | **Medium** — sitemap lists `/store` which 301s to `/pricing` |
| `/store/:slug` | `<Navigate to="/pricing">` | No | `ask-the-og` links to `/store/snapshot-plus`, `/store/comp-report`, `/store/the-producers-package` | **High** — AI bot sends users to redirect URLs that lose product context |
| `/pricing` | `Pricing` | **No** | Not linked in any nav | **Medium** — canonical pricing page missing from sitemap and navigation |
| `/resources` | `Resources` | Yes | `MobileMenu.tsx:229` | OK |
| `/budget-info` | `BudgetInfo` | Yes | — | OK |
| `/capital-info` | `CapitalInfo` | Yes | — | OK |
| `/fees-info` | `FeesInfo` | Yes | — | OK |
| `/waterfall-info` | `<Navigate to="/resources?tab=waterfall">` | No | — | OK (redirect) |
| `/glossary` | `<Navigate to="/resources?tab=terms">` | No | — | OK (redirect) |
| `/auth` | `Auth` | No | — | OK |
| `/signup` | `Signup` | No | — | OK |
| `/login` | `Login` | No | — | OK |
| `/build-your-plan` | `BuildYourPlan` | No | — | OK |
| `/dashboard` | `Dashboard` | No | — | OK |
| `*` | `NotFound` | — | — | OK |

### 404s in Repo
None — all sitemap URLs have route handlers.

### Ghost Pages (code in repo, not reachable from site)

| File | Issue | Detail |
|---|---|---|
| `src/pages/StorePackage.tsx` | **ORPHANED** | Full 257-line product detail page. Not in any route definition. Imports `@/lib/store-products` which **does not exist** — would break the build if ever imported. |
| `src/pages/Store.tsx` | **VESTIGIAL** | One-line redirect (`<Navigate to="/pricing" />`). Redundant since `App.tsx:80` already defines this redirect inline. |

---

## 2. Pricing Reconciliation — Parity Report

### CRITICAL: Comp Report Price Mismatch

The Pricing page displays "starts at $90" for the Comp Report, while **every other source** lists $595 / $995.

| Source | Comp Report Price | Evidence |
|---|---|---|
| `src/pages/Pricing.tsx:92` | **"starts at $90"** | Hardcoded in `adHocServices` array |
| `supabase/functions/create-checkout/index.ts:55` | **$595** (5 comps) / **$995** (10 comps) | Stripe price IDs with amounts in cents |
| `supabase/functions/ask-the-og/index.ts:207` | "$595 for 5 comps / $995 for 10 comps" | AI system prompt |
| `README.md:81` | $595 / $995 | Project documentation |
| `CONVERSION_STRATEGY.md:22` | $595 / $995 | Strategy document |

**Impact:** Users see $90 on the pricing page but would encounter $595 at Stripe checkout. This is a customer trust and conversion issue.

### Full Pricing Manifest

| Product/Tier | Pricing Page (`Pricing.tsx`) | Stripe Checkout (`create-checkout`) | AI Bot (`ask-the-og`) | Source Type | Primary Source |
|---|---|---|---|---|---|
| **Free** | $0 | N/A | N/A | Hardcoded | `src/pages/Pricing.tsx:80` |
| **Founding Member** | $19/mo | N/A (no subscription checkout) | $19 | Hardcoded | `src/pages/Pricing.tsx:34` |
| **Standard** | $49/mo | N/A | N/A | Hardcoded | `src/pages/Pricing.tsx:49` |
| **Power** | $97/mo | N/A | N/A | Hardcoded | `src/pages/Pricing.tsx:63` |
| **Snapshot+** | Not listed | $19 one-time (`price: 1900`) | $19 | Stripe | `create-checkout/index.ts:49` |
| **Comp Report (5)** | "starts at $90" | **$595** (`price: 59500`) | $595 | **MISMATCH** | `Pricing.tsx:92` vs `create-checkout:55` |
| **Comp Report (10)** | Not listed | $995 (`price: 99500`) | $995 | Stripe | `create-checkout/index.ts:61` |
| **Producer's Package** | Not listed | $1,797 (`price: 179700`) | $1,797 | Stripe | `create-checkout/index.ts:67` |
| **Working Model** | Not listed | $79 add-on (`price: 7900`) | $79 | Stripe | `create-checkout/index.ts:73` |
| **Boutique** | Not listed | Not in checkout | $2,997+ | AI bot only | `ask-the-og/index.ts:210` |
| **Custom Financial Model** | "starts at $2,500" | Not in checkout | N/A | Hardcoded | `src/pages/Pricing.tsx:93` |
| **Lookbook** | "starts at $1,500" | Not in checkout | N/A | Hardcoded | `src/pages/Pricing.tsx:94` |

### Stripe Products Audit (verified via Stripe MCP)

**Stripe has 12 products. Repo `create-checkout` handles 5. 3 are new subscription products with no checkout code. 3 are legacy.**

#### Active Stripe Products vs Repo

| Stripe Product | Stripe ID | Price | Type | In `create-checkout`? | On `/pricing`? | Status |
|---|---|---|---|---|---|---|
| Snapshot+ | `prod_UEmfhPqL9VPQXt` | $19 one-time (`price_1TGJ6fJEIERVYlyFXkKoNnwL`) | One-time | Yes (`snapshot-plus`) | No | OK |
| Comp Report (5 Comps) | `prod_UG8rcODgC3Y46E` | $595 (`price_1THcZrJEIERVYlyFFyTQNRTt`) | One-time | Yes | "starts at $90" | **CRITICAL mismatch** |
| Comp Report (10 Comps) | `prod_UG8rTuZKGMgzKz` | $995 (`price_1THcZsJEIERVYlyFjNRrZSrd`) | One-time | Yes | Not listed | OK |
| Producer's Package | `prod_UG8rqQgC4jDotd` | $1,797 (`price_1THcZsJEIERVYlyFoX1KDFvQ`) | One-time | Yes | Not listed | OK |
| Working Model | `prod_UG8r1omjYQkH4Q` | $79 (`price_1THcZtJEIERVYlyFuLnYEsKQ`) | One-time | Yes (add-on) | Not listed | OK |
| Boutique | `prod_UG8r6gJomU7OMM` | $2,997 (`price_1THcZtJEIERVYlyFFsbhFWUT`) | One-time | **No** | Not listed | **Medium** — Stripe product exists but not in `create-checkout` |
| Snapshot+ Founding ($19/mo) | `prod_UGSHt8q44xSpxM` | $19/mo recurring (`price_1THvMxJEIERVYlyFj1cIqtGK`) | Subscription | **No** | $19/mo | **High** — Stripe subscription product exists, displayed on `/pricing`, but no checkout flow |
| Standard Dashboard ($49/mo) | `prod_UGSH4a1Jid7qGo` | $49/mo recurring (`price_1THvMxJEIERVYlyFVkZuQH7Q`) | Subscription | **No** | $49/mo | **High** — same issue |
| Power Tier ($97/mo) | `prod_UGSHv1tfnvcmjv` | $97/mo recurring (`price_1THvMyJEIERVYlyFwB9lDDmc`) | Subscription | **No** | $97/mo | **High** — same issue |

#### Legacy Stripe Products (not referenced in repo)

| Stripe Product | Stripe ID | Price | Status |
|---|---|---|---|
| filmmaker.og film finance pdf | `prod_TutWYcUOZrhutg` | N/A (no amount) | **Low** — legacy product, not in repo |
| OG Digital Frameworks | `prod_TKwVuPrF1Ixjne` | N/A (2 prices, no amounts) | **Low** — legacy product, not in repo |
| Blockchain 101 Basics | `prod_Qmj0kWNgP4EYt4` | $5 / $10 | **Low** — legacy product, not in repo |

### Pricing Observations

1. **Snapshot+ ($19 one-time)** exists in Stripe checkout but is invisible on `/pricing`. Only surfaced via:
   - AI bot nudge (`ask-the-og/index.ts:128,140`)
   - WaterfallDeck CTA button (`src/components/calculator/WaterfallDeck.tsx:1637`: "UNLOCK SNAPSHOT+ — $19")

2. **Subscription tiers have Stripe products but no checkout flow.** Founding Member/Standard/Power are displayed on `/pricing` with CTA buttons that navigate to `/signup` — not to a Stripe checkout. The 3 recurring Stripe prices exist (`price_1THvMx...`, `price_1THvMx...`, `price_1THvMy...`) but `create-checkout` only handles one-time products. No subscription-creation edge function exists in the repo.

3. **Boutique ($2,997)** has a Stripe product and price but is not handled by `create-checkout`. The AI bot directs users to `og@filmmakerog.com` for Boutique inquiries.

4. **Producer's Package ($1,797)** is purchasable via Stripe but does not appear on `/pricing`. Only referenced in the AI bot system prompt and `CONVERSION_STRATEGY.md`.

5. **Ad hoc services on `/pricing`** ("Custom Financial Model" at $2,500, "Lookbook" at $1,500) have no corresponding Stripe products. These appear to be inquiry-based services with no self-serve purchase path.

6. **3 legacy Stripe products** exist that are not referenced anywhere in the codebase: "filmmaker.og film finance pdf", "OG Digital Frameworks", "Blockchain 101 Basics". These should be archived in Stripe.

---

## 3. Database Schema / Edge Function Audit — Parity Report

### Edge Functions: Repo vs Production (verified via Supabase MCP)

**Production has 9 active edge functions. Repo has 6. Only 4 overlap.**

| Function | In Repo? | In Production? | Called from Code? | Status | Detail |
|---|---|---|---|---|---|
| `ask-the-og` | Yes | Yes (v51) | Yes (`OgBotSheet`) | OK | Claude-powered AI assistant; 555 lines |
| `create-checkout` | Yes | Yes (v16) | Yes (Stripe flow) | OK | Stripe session creation; 212 lines |
| `stripe-webhook` | Yes | Yes (v15) | Yes (Stripe events) | OK | Handles `checkout.session.completed`; 108 lines |
| `sync-lead-to-loops` | Yes | Yes (v8) | Yes (DB trigger) | OK | Syncs leads to Loops CRM; 100 lines |
| `seed-ops` | Yes | **No** | No (ops tool) | OK | Dev-only seed data; not deployed to production |
| `film-search` | Yes | **No** | Unknown | **Low** | In repo but **not deployed** — confirmed deprecated. Uses "Lovable AI Gateway" (Gemini). 127 lines |
| **`deal-insight`** | **NO** | **Yes (v13)** | **Yes** (`WaterfallDeck.tsx:364`) | **CRITICAL** | Production function with no source in repo. Called via `${VITE_SUPABASE_URL}/functions/v1/deal-insight`. Source, prompt, and behavior are unauditable. `docs/deal-insight-edge-function.md` has explicit TODO. |
| **`film-intel-poll`** | **NO** | **Yes (v20)** | No | **CRITICAL** | Production function not version-controlled. Likely populates `film_intel_articles` (3,397 rows in prod). |
| **`film-intel-auth`** | **NO** | **Yes (v9)** | No | **CRITICAL** | Production function not version-controlled. Authentication for film intel system. |
| **`film-intel-interact`** | **NO** | **Yes (v14)** | No | **CRITICAL** | Production function not version-controlled. User interaction handler for film intel. |
| **`film-intel-digest`** | **NO** | **Yes (v8)** | No | **CRITICAL** | Production function not version-controlled. Digest generation for film intel. |

### Database Tables: Repo Migrations vs Live Production (verified via Supabase MCP)

**Production has 15 tables. Repo migrations define 9 tables (+ RLS for 8 more). 8 migrated tables do NOT exist in production.**

#### Tables in BOTH repo and production

| Table | Migration | In Production? | Rows | Referenced in Code? | Status |
|---|---|---|---|---|---|
| `purchases` | `20260207051556` | Yes | 0 | Yes (`BuildYourPlan.tsx`, `stripe-webhook/index.ts:80`) | OK |
| `glossary_terms` | RLS only (`20260401200000`) | Yes | 20 | Yes (`src/lib/glossary-rotation.ts`) | OK |
| `waterfall_snapshots` | RLS only (`20260401200000`) | Yes | 16 | Yes (`WaterfallDeck.tsx`) | OK |
| `leads` | RLS only (`20260401200000`) | Yes | 1 | Yes (`LeadCaptureModal.tsx`) | OK |
| `og_bot_leads` | RLS only (`20260401200000`) | Yes | 1 | Yes (`ask-the-og/index.ts:286,312,472,485`) | OK |
| `og_bot_messages` | RLS only (`20260401200000`) | Yes | 0 | Implied by `ask-the-og` | OK |
| `og_bot_sessions` | RLS only (`20260401200000`) | Yes | 0 | Implied by `ask-the-og` | OK |
| `film_intel_articles` | RLS only (`20260401200000`) | Yes | 3,397 | No app code — populated by `film-intel-poll` edge function | OK |
| `film_intel_sources` | RLS only (`20260401200000`) | Yes | 16 | No app code — populated by `film-intel-poll` edge function | OK |

#### Tables in repo migrations but NOT in production (migrations never applied)

| Table | Migration | Status |
|---|---|---|
| `profiles` | `20260131174838` | **CRITICAL** — migration not applied. Auth trigger to auto-create profiles does not exist in prod. |
| `saved_calculations` | `20260118041606` | **Medium** — legacy table, replaced by `deals`. Migration not applied. |
| `exports` | `20260207051556` | **Medium** — migration not applied. No code references anyway. |
| `intake_submissions` | `20260214120000` | **CRITICAL** — migration not applied, but `BuildYourPlan.tsx` and `useIntakeAutoSave.ts` actively query it. Intake form will fail in production. |
| `subscriptions` | `20260403000000` | **Medium** — migration not applied. No frontend code either. |
| `deals` | `20260403000000` | **Medium** — migration not applied. No frontend code. |
| `shareable_links` | `20260403000000` | **Medium** — migration not applied. No frontend code. |
| `user_branding` | `20260403000000` | **Medium** — migration not applied. No frontend code. |

#### Tables in production but NOT in repo (no migration, no code reference)

| Table | Rows | Status |
|---|---|---|
| `ops_tasks` | 10 | **Low** — seeded by `seed-ops/index.ts:26` but no CREATE TABLE migration |
| `ops_passwords` | 0 | **Low** — seeded by `seed-ops/index.ts:51` but no CREATE TABLE migration |
| `ops_inbox` | 1 | **Low** — seeded by `seed-ops/index.ts:67` but no CREATE TABLE migration |
| `ops_workflows` | 0 | **Low** — seeded by `seed-ops/index.ts:79` but no CREATE TABLE migration |
| **`ops_briefing_log`** | 0 | **Low** — exists in production only. No repo code references it. |
| **`ops_api_keys`** | 0 | **Low** — exists in production only. No repo code references it. |

### Duplicate Migration Note
Migration `20260218113548` (`_437f7f61-...`) contains a duplicate/alternative schema definition for `intake_submissions` (already created in `20260214120000`). This may cause issues if migrations are re-run from scratch.

---

## 4. Repository Sanitization — Ghost Components

| File | Lines | Status | Rationale |
|---|---|---|---|
| `src/pages/StorePackage.tsx` | 257 | **ORPHANED** | Not in any route definition. Imports `@/lib/store-products` which does not exist. Would cause build failure if imported. |
| `src/components/NavLink.tsx` | 28 | **ORPHANED** | Custom `NavLink` wrapper (forwardRef around react-router-dom's NavLink). Zero imports in the entire codebase. |
| `src/pages/Store.tsx` | 6 | **VESTIGIAL** | One-line `<Navigate to="/pricing" />`. Redundant — `App.tsx:80-81` already defines the `/store` and `/store/:slug` redirects inline. This file is imported by `App.tsx:28` but unused since the route uses `<Navigate>` directly. |

---

## 5. Repository Sanitization — Hardcoded Drift

| Pattern | File:Line | Current Value | Expected/Correct Value | Severity |
|---|---|---|---|---|
| Comp Report price | `src/pages/Pricing.tsx:92` | `"starts at $90"` | `"$595 / $995"` | **CRITICAL** |
| Legacy tier names | `public/presentations/investor_overview.html:464` | `"60/30/10 Starter/Pro/Studio mix"` | Should be `Free/Founding/Standard/Power` | **Medium** |
| Old `/store/*` URLs in AI bot | `supabase/functions/ask-the-og/index.ts:128` | `https://filmmakerog.com/store/snapshot-plus` | Redirects to `/pricing` — user loses product context | **High** |
| Old `/store/*` URLs in AI bot | `supabase/functions/ask-the-og/index.ts:140` | `https://filmmakerog.com/store/snapshot-plus` | Same redirect issue | **High** |
| Old `/store/*` URLs in AI bot | `supabase/functions/ask-the-og/index.ts:206` | `https://filmmakerog.com/store/snapshot-plus` | Same redirect issue | **High** |
| Old `/store/*` URLs in AI bot | `supabase/functions/ask-the-og/index.ts:207` | `https://filmmakerog.com/store/comp-report` | Same redirect issue | **High** |
| Old `/store/*` URLs in AI bot | `supabase/functions/ask-the-og/index.ts:208` | `https://filmmakerog.com/store/the-producers-package` | Same redirect issue | **High** |
| Export CTA navigates to `/store/snapshot-plus` | `src/pages/Calculator.tsx:229` | `navigate('/store/snapshot-plus')` | Redirects to generic `/pricing` — user loses Snapshot+ context | **High** |
| BuildYourPlan navigates to `/store` | `src/pages/BuildYourPlan.tsx:196,305,313` | `navigate("/store")` | Redirects to `/pricing` — functional but semantically stale | **Low** |
| Resources footer links to `/store` | `src/pages/Resources.tsx:1188` | `window.location.href = '/store'` | Redirects to `/pricing` — functional but stale label "Shop" | **Low** |
| "Founding Member" label | `src/pages/Pricing.tsx:33` | `"Founding Member"` | Intentional — matches DB `tier` column | OK |
| Legacy "$197" references | `CONVERSION_STRATEGY.md`, `supabase/functions/ask-the-og/index.ts:213` | Listed as "DEAD, never mention" | Properly deprecated | OK |
| WaterfallDeck Snapshot+ CTA | `src/components/calculator/WaterfallDeck.tsx:1637` | `"UNLOCK SNAPSHOT+ — $19"` | Matches Stripe price ($19) | OK |
| Investor overview tier prices | `public/presentations/investor_overview.html:406` | `"$19–$97/mo"` | Matches current tier range | OK |
| Fundraising HTML prices | `public/presentations/fundraising-analysis.html:845` | `"$49 to $2,997+"` | Range matches current products | OK |

---

## 6. Asset Consistency

| Asset | Path | Imported By | Status |
|---|---|---|---|
| `filmmaker-f-icon.png` | `src/assets/filmmaker-f-icon.png` | `src/pages/Auth.tsx` | OK |
| `filmmaker-logo.jpg` | `src/assets/filmmaker-logo.jpg` | Not imported anywhere | **Low** — unused asset |
| `og-logo-gold.jpg` | `public/branding/og-logo-gold.jpg` | Referenced via public URL | OK |
| `favicon.ico` | `public/favicon.ico` | `index.html` | OK |
| `favicon.png` | `public/favicon.png` | `index.html` | OK |
| `og-image.png` | `public/og-image.png` | `index.html` (meta) | OK |
| `pwa-icon-192.png` | `public/pwa-icon-192.png` | `manifest.json` | OK |
| `pwa-icon-512.png` | `public/pwa-icon-512.png` | `manifest.json` | OK |

**BRAND_SYSTEM.md alignment:** `src/lib/tokens.ts` implements all color constants (`GOLD=#D4AF37`, `CTA=#F9E076`, `BG.void=#141416`, etc.) matching BRAND_SYSTEM.md v4.0 exactly. No deviations found.

---

## 7. Sitemap Drift

**File:** `public/sitemap.xml`

| Issue | Detail | Severity |
|---|---|---|
| `/store` listed in sitemap | Redirects 301 to `/pricing`. Search engines index a redirect. | **Medium** |
| `/pricing` missing from sitemap | Canonical pricing page is invisible to crawlers. | **Medium** |
| No `lastmod` dates | All URLs lack `lastmod` elements. | **Low** |
| `/build-your-plan` missing | Active page not in sitemap (may be intentional if gated). | **Low** |

---

## 8. Purge List

| File Path (relative) | Rationale |
|---|---|
| `src/pages/StorePackage.tsx` | Orphaned page component. Not routed. Imports non-existent module `@/lib/store-products`. Would cause build failure if imported. 257 lines of dead code. |
| `src/components/NavLink.tsx` | Orphaned component. Custom NavLink wrapper with zero imports anywhere in codebase. 28 lines of dead code. |
| `src/pages/Store.tsx` | Redundant one-line redirect. `App.tsx:80-81` already handles `/store` → `/pricing` redirect inline via `<Navigate>`. 6 lines, but imports add to bundle analysis noise. |
| `supabase/functions/film-search/` | Deprecated edge function using "Lovable AI Gateway" (Gemini). Not deployed to production. No frontend caller. 127 lines. |

---

## 9. Orphan Edge Functions

### Production functions NOT in repo (verified via Supabase MCP)

| Function | Supabase Version | Status | Detail |
|---|---|---|---|
| `deal-insight` | v13 | **CRITICAL — Missing from repo** | Deployed and actively called from `WaterfallDeck.tsx:364`. Source, prompt, and behavior are unauditable. Must be added to `supabase/functions/deal-insight/`. |
| `film-intel-poll` | v20 | **CRITICAL — Missing from repo** | Populates `film_intel_articles` (3,397 rows) and `film_intel_sources` (16 rows). Entire film intel pipeline is unversioned. |
| `film-intel-auth` | v9 | **CRITICAL — Missing from repo** | Authentication for film intel system. Not version-controlled. |
| `film-intel-interact` | v14 | **CRITICAL — Missing from repo** | User interaction handler for film intel. Not version-controlled. |
| `film-intel-digest` | v8 | **CRITICAL — Missing from repo** | Digest generation for film intel. Not version-controlled. |

### Repo functions NOT in production

| Function | Status | Detail |
|---|---|---|
| `film-search` | **Not deployed** | In repo at `supabase/functions/film-search/index.ts` (127 lines) but not in production. Uses "Lovable AI Gateway" (Gemini) — confirmed deprecated. Candidate for purge. |
| `seed-ops` | **Not deployed** | Dev-only seed data tool. Correctly excluded from production. |

---

## Appendix: Legacy Products (Fully Deprecated)

These products are documented as retired across the codebase. No active code serves them.

| Product | Legacy Price | Current Status | Where Referenced |
|---|---|---|---|
| The Full Analysis | $197 | Absorbed into free Snapshot | `ask-the-og:213`, `CONVERSION_STRATEGY.md:29`, `README.md:86` |
| The Package | $597 | Replaced by Comp Report + Producer's Package | `ask-the-og:214`, `CONVERSION_STRATEGY.md:31` |
| The Full Package | $2,497 | Replaced by Boutique | `ask-the-og:215`, `CONVERSION_STRATEGY.md:32` |
| The Blueprint | N/A | Rejected at checkout with clear message | `create-checkout/index.ts:81` (`LEGACY_PRODUCT_IDS`) |
| The Pitch Package | N/A | Rejected at checkout with clear message | `create-checkout/index.ts:81` (`LEGACY_PRODUCT_IDS`) |
