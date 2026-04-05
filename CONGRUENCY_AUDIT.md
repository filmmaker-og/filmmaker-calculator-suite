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
| **CRITICAL** | 2 | Comp Report price mismatch ($90 vs $595); `deal-insight` edge function not in repo |
| **HIGH** | 1 | AI bot links to `/store/*` URLs that redirect away from product context |
| **MEDIUM** | 5 | Sitemap lists `/store` not `/pricing`; SaaS tables with no frontend; legacy tier names in investor deck; `saved_calculations` orphan table |
| **LOW** | 5 | `exports` orphan table; `film-search` Lovable gateway; `filmmaker-logo.jpg` unused; `film_intel_*` tables; ops tables without migrations |

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

### Pricing Observations

1. **Snapshot+ ($19 one-time)** exists in Stripe checkout but is invisible on `/pricing`. Only surfaced via:
   - AI bot nudge (`ask-the-og/index.ts:128,140`)
   - WaterfallDeck CTA button (`src/components/calculator/WaterfallDeck.tsx:1637`: "UNLOCK SNAPSHOT+ — $19")

2. **Subscription tiers have no checkout flow.** Founding Member/Standard/Power are displayed on `/pricing` with CTA buttons that navigate to `/signup` — not to a Stripe checkout. The `subscriptions` table (migration `20260403000000`) exists but no subscription-creation edge function is implemented.

3. **Producer's Package ($1,797) and Boutique ($2,997+)** are purchasable via Stripe (or via email for Boutique) but do not appear on `/pricing`. They are only referenced in the AI bot system prompt and `CONVERSION_STRATEGY.md`.

4. **Ad hoc services on `/pricing`** ("Custom Financial Model" at $2,500, "Lookbook" at $1,500) have no corresponding Stripe products or checkout flows. These appear to be inquiry-based services with no self-serve purchase path.

---

## 3. Database Schema / Edge Function Audit — Parity Report

### Edge Functions: Repo vs Production

| Function | In Repo? | Called from Code? | Status | Detail |
|---|---|---|---|---|
| `ask-the-og` | Yes | Yes (`OgBotSheet`) | OK | Claude-powered AI assistant; 555 lines |
| `create-checkout` | Yes | Yes (Stripe flow) | OK | Stripe session creation; 212 lines |
| `stripe-webhook` | Yes | Yes (Stripe events) | OK | Handles `checkout.session.completed`; 108 lines |
| `sync-lead-to-loops` | Yes | Yes (DB trigger) | OK | Syncs leads to Loops CRM; 100 lines |
| `seed-ops` | Yes | No (ops tool) | OK | Dev/ops seed data; 86 lines |
| `film-search` | Yes | Unknown | **Low** | Uses "Lovable AI Gateway" (Gemini). May be deprecated infrastructure. 127 lines |
| **`deal-insight`** | **NO** | **Yes** (`WaterfallDeck.tsx:364`) | **CRITICAL** | Production function with no source in repo. Called via `${VITE_SUPABASE_URL}/functions/v1/deal-insight`. Source, prompt template, and behavior are unauditable. Documented in `docs/deal-insight-edge-function.md` with explicit TODO: "Add the edge function source to this repository." |

### Database Tables: Code vs Migrations

#### Tables with full migrations

| Table | Migration | Referenced in Code? | Status |
|---|---|---|---|
| `profiles` | `20260131174838` | Implicit (auth trigger creates on signup) | OK |
| `purchases` | `20260207051556` | Yes (`BuildYourPlan.tsx`, `stripe-webhook/index.ts:80`) | OK |
| `exports` | `20260207051556` | No app code references | **Low** — orphan table, created but never queried |
| `saved_calculations` | `20260118041606` | No app code references | **Medium** — legacy table replaced by `deals` |
| `intake_submissions` | `20260214120000` | Yes (`BuildYourPlan.tsx`, `useIntakeAutoSave.ts`) | OK |
| `subscriptions` | `20260403000000` | No app code references | **Medium** — schema exists, no frontend subscription management |
| `deals` | `20260403000000` | No app code references | **Medium** — new SaaS table, no frontend implementation |
| `shareable_links` | `20260403000000` | No app code references | **Medium** — new SaaS table, no frontend implementation |
| `user_branding` | `20260403000000` | No app code references | **Medium** — new SaaS table, no frontend implementation |

#### Tables with RLS policies only (no CREATE TABLE migration in repo)

| Table | RLS Migration | Referenced in Code? | Status |
|---|---|---|---|
| `leads` | `20260401200000` | Yes (`LeadCaptureModal.tsx`) | OK |
| `waterfall_snapshots` | `20260401200000` | Yes (`WaterfallDeck.tsx`) | OK |
| `og_bot_leads` | `20260401200000` | Yes (`ask-the-og/index.ts:286,312,472,485`) | OK |
| `og_bot_messages` | `20260401200000` | Implied by `ask-the-og` | OK |
| `og_bot_sessions` | `20260401200000` | Implied by `ask-the-og` | OK |
| `glossary_terms` | `20260401200000` | Yes (`src/lib/glossary-rotation.ts`) | OK |
| `film_intel_articles` | `20260401200000` | No app code references | **Low** — content table, likely populated externally |
| `film_intel_sources` | `20260401200000` | No app code references | **Low** — content table, likely populated externally |

#### Tables referenced by `seed-ops` with no migrations

| Table | Status |
|---|---|
| `ops_tasks` | **Low** — dev/ops only, seeded by `seed-ops/index.ts:26` |
| `ops_passwords` | **Low** — dev/ops only, seeded by `seed-ops/index.ts:51` |
| `ops_inbox` | **Low** — dev/ops only, seeded by `seed-ops/index.ts:67` |
| `ops_workflows` | **Low** — dev/ops only, seeded by `seed-ops/index.ts:79` |

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

---

## 9. Orphan Edge Functions

| Function | Status | Detail |
|---|---|---|
| `deal-insight` | **Missing from repo** | Deployed to Supabase but not version-controlled. Called from `WaterfallDeck.tsx:364`. Must be added to `supabase/functions/deal-insight/`. |
| `film-search` | **Potentially deprecated** | Uses "Lovable AI Gateway" (`supabase/functions/film-search/index.ts`). No clear frontend caller identified. May be a development artifact from the Lovable platform. |
| `seed-ops` | **Dev-only** | Seeds ops portal tables (`ops_tasks`, `ops_passwords`, `ops_inbox`, `ops_workflows`). These tables have no CREATE TABLE migration. Safe for dev use but should not run in production. |

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
