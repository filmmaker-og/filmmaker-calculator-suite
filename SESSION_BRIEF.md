# FILMMAKER.OG — Session Brief for Claude Code

**Date:** March 28, 2026
**Purpose:** Comprehensive context handoff. Everything you need to work on this codebase.

---

## 1. WHAT THIS IS

A film finance simulator for independent producers. The product helps filmmakers model recoupment waterfalls, capital stacks, and investor returns before signing deals. It's a React SPA hosted on Vercel at [filmmakerog.com](https://filmmakerog.com).

The user is a "vibe coder" — gives creative direction, expects proactive complete solutions. Frustrated by incremental fixes. Wants complete lists upfront and holistic thinking.

---

## 2. TECH STACK

| Layer | Tech |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui + heavy inline React CSSProperties |
| Backend | Supabase (database, edge functions) |
| Hosting | Vercel (auto-deploys from `main` branch) |
| Domain | filmmakerog.com (Vercel Domains) |
| Email | Google Workspace — og@filmmakerog.com |
| Email Marketing | Loops.so (transactional + nurture sequences) |
| Payments | Stripe (one-time checkout) |
| Fonts | Bebas Neue, Inter, Roboto Mono (Google Fonts) |
| State | React hooks (useState, useEffect, useRef). No Redux/Zustand. |

### Git
- **Repo:** `filmmaker-og/filmmaker-calculator-suite` (private)
- **Branch:** `main` is production. Always branch for changes, merge after build passes.
- **Config:** `user.email="og@filmmakerog.com"`, `user.name="filmmaker-og"`
- **Safety tag:** `pre-refresh` on main saves the state before the major overhaul sessions began

### Lead Capture Flow
- Lead capture: collect name + email → insert to Supabase `leads` table + save to localStorage (`og_lead_name`, `og_lead_email`) → navigate straight to `/calculator`
- Supabase database webhook fires on INSERT → calls `sync-lead-to-loops` edge function → creates contact in Loops
- Calculator auth gate: checks `localStorage.getItem('og_lead_email')`. If missing, shows LeadCaptureModal.
- **NO OTP. NO MAGIC LINK. NO SUPABASE AUTH.** Lead capture is best-effort — users get through even if insert fails.

### Product Ladder
| Product | Price | Stripe Product ID |
|---------|-------|-------------------|
| Free Snapshot | $0 | — |
| Snapshot+ | $19 | `prod_UEmfhPqL9VPQXt` |
| Comp Report | $595 / $995 | TBD |
| Producer's Package | $1,797 | TBD |
| Boutique | $2,997+ | TBD |
| Working Model | +$79 (add-on) | TBD |

### Supabase Edge Functions
| Function | Purpose |
|----------|--------|
| `ask-the-og` | AI chatbot (Claude) — streaming SSE |
| `sync-lead-to-loops` | Webhook receiver — pushes new leads to Loops |

### Email Marketing (Loops)
- **Lead nurture**: welcome → Day 2 Snapshot+ pitch → Day 5 education → Day 10 urgency
- **Post-purchase**: per-product confirmation + upsell sequences
- **Integration**: Supabase webhook → Edge Function → Loops API + Stripe webhook → Loops

### Environment Variables
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```
These are in Vercel's environment config. `.env` is gitignored. `.env.example` has placeholders.

---

## 3. DESIGN SYSTEM (v3.0)

Full documentation: `BRAND_SYSTEM.md` in the repo root. (v3.1)

### Quick Reference
| Token | Value |
|---|---|
| Page bg | `#0C0C0E` |
| Container bg | `#1A1A1C` |
| Surface bg | `#232326` |
| Footer bg | `#161618` |
| Gold (brand) | `#D4AF37` |
| Gold (CTA) | `#F9E076` |
| Body text | `rgba(250,248,244,0.88)` (warm white) |
| Labels | `rgba(255,255,255,0.70)` (cold white, Roboto Mono) |
| Green (positive) | `#3CB371` |
| Red (negative) | `#DC2626` |

### Color Functions (tokens.ts)
```typescript
import { gold, white, red, green, GOLD, CTA, BG } from '@/lib/tokens';
gold(0.15)  // rgba(212,175,55,0.15)
white(0.70) // rgba(255,255,255,0.70)
BG.void     // #0C0C0E
BG.elevated // #1A1A1C
BG.surface  // #232326
```

### Key Rules
- **No purple anywhere** — fully eliminated
- **Two-gold rule** — #D4AF37 for brand, #F9E076 for buttons only
- **Warm-white body text** — `rgba(250,248,244,...)`, not `rgba(255,255,255,...)`
- **Body line-height: 1.6** everywhere
- **Responsive layout** — 780px max-width, `clamp()` padding
- **Grain texture** — `className="grain-surface"` on all section containers (0.035 opacity)
- **Container border pattern** — `border: 1px solid rgba(212,175,55,0.15)` + `borderTop: 1px solid rgba(255,255,255,0.08)`

---

## 4. FILE MAP

### Pages
| File | Lines | What it is |
|---|---|---|
| `src/pages/Index.tsx` | ~1317 | Landing page — reference implementation of the design system. 7 sections + footer. |
| `src/pages/Calculator.tsx` | ~505 | Main product — step-based calculator with auth gate |
| `src/pages/Store.tsx` | ~1440 | Product store — packages, FAQ, pricing |
| `src/pages/StorePackage.tsx` | ~256 | Individual package detail page |
| `src/pages/Resources.tsx` | ~1255 | Resource Vault — search/filter, glossary, educational cards |
| `src/pages/Auth.tsx` | ~312 | Auth page (mostly superseded by LeadCaptureModal) |
| `src/pages/BudgetInfo.tsx` | ~298 | Info page — production budget education |
| `src/pages/CapitalInfo.tsx` | ~285 | Info page — capital stack education |
| `src/pages/FeesInfo.tsx` | ~317 | Info page — fee structures education |
| `src/pages/BuildYourPlan.tsx` | ~495 | Post-purchase plan builder |
| `src/pages/NotFound.tsx` | ~30 | 404 page |

### Components
| File | Lines | What it is |
|---|---|---|
| `src/components/AppHeader.tsx` | ~108 | Pill-style floating nav bar |
| `src/components/MobileMenu.tsx` | ~514 | Slide-out mobile navigation |
| `src/components/LeadCaptureModal.tsx` | ~204 | Name + email capture modal (white inputs) |
| `src/components/EmailGateModal.tsx` | ~149 | Secondary email gate (used in Calculator) |
| `src/components/OgBotSheet.tsx` | ~665 | AI chatbot bottom sheet |
| `src/components/OgBotFab.tsx` | ~65 | Floating action button for OG bot |

### Calculator Components
| File | Lines | What it is |
|---|---|---|
| `src/components/calculator/WaterfallDeck.tsx` | ~2890 | Waterfall output deck — largest component |
| `api/_pdf-template.ts` | ~660 | PDF export template — 5-page branded document |
| `src/components/calculator/ChapterCard.tsx` | ~251 | Accordion-style step cards |
| `src/components/calculator/TabBar.tsx` | ~158 | Bottom tab navigation |
| `src/components/calculator/ContextBar.tsx` | ~95 | Top context/status bar |
| `src/components/calculator/GlossaryTrigger.tsx` | ~163 | (i) info button with term definitions |
| `src/components/calculator/StandardStepLayout.tsx` | ~122 | Layout wrapper for calculator steps |
| `src/components/calculator/FilmLeaderCountdown.tsx` | ~329 | Film countdown loading animation |

### Core Files
| File | Purpose |
|---|---|
| `src/lib/tokens.ts` | Color token functions — single source of truth |
| `src/index.css` | Global styles, keyframes, CSS variables, hover classes |
| `src/App.tsx` | Router with lazy-loaded pages, ErrorBoundary |
| `BRAND_SYSTEM.md` | Design system documentation (v3.1) |
| `vercel.json` | Vercel config — SPA rewrites, caching headers |

---

## 5. ROUTES

```
/               → Index.tsx (landing page)
/calculator     → Calculator.tsx (auth-gated)
/store          → Store.tsx
/store/:slug    → StorePackage.tsx
/resources      → Resources.tsx
/build-your-plan → BuildYourPlan.tsx
/auth           → Auth.tsx
/budget-info    → BudgetInfo.tsx
/capital-info   → CapitalInfo.tsx
/fees-info      → FeesInfo.tsx
/waterfall-info → REDIRECT → /resources?tab=waterfall
/glossary       → REDIRECT → /resources?tab=terms
*               → NotFound.tsx (404)
```

---

## 6. LANDING PAGE ARCHITECTURE (Index.tsx)

### Section Order (v18)
1. **Hero** — Headline ("Model Your Recoupment Waterfall") + CTA above fold, interactive 3-slider calculator below fold
2. **Product Preview** — 5 horizontally scrollable cards showing output types (Cascade, Verdict, Split, Stack, Break-Even)
3. **Waterfall** — Full 8-tier money flow: Acquisition → Off-the-Tops → Sales → Debt → Equity → Total Off Top → Net Profit → Split
4. **What's At Stake** — 4 reason cards with gold numeral + title + body
5. **Reality** — Typing reveal blockquote + 3-row WITH/WITHOUT comparison grid
6. **Social Proof** — Testimonial with gold left border + 4 feature badges
7. **Closer** — "YOUR NEXT PITCH IS COMING." + final CTA

### Hero Slider Math
```
salesFee = acquisitionValue * (salesFeePercent / 100)
guilds = budgetValue * 0.055         // on production budget
camFee = acquisitionValue * 0.01     // on revenue
debtAmount = budgetValue * 0.50      // 50% leverage
debtService = debtAmount * 0.12      // 12% interest
totalDeductions = salesFee + guilds + camFee + debtService
heroNetProfit = acquisitionValue - totalDeductions
```

### Animations
- Scroll reveal on every section (IntersectionObserver, one-shot)
- Stamp animation on waterfall cards
- Typing reveal on Reality blockquote (35ms/char)
- Count-up on Net Profit and Split numbers
- CTA shimmer (one-shot) + idle glow (4s infinite, subtle)
- Scroll progress gold thread (desktop only, 840px+)

---

## 7. WHAT WAS DONE IN THIS SESSION

### Repo Health
- Made repo private (was public — business logic exposed)
- Deleted 75+ stale branches (only `main` remains)
- `npm audit fix` — patched dependency vulnerabilities
- Removed dead pages (Glossary.tsx, WaterfallInfo.tsx — routes are redirects)
- Removed stale docs (LANDING_PAGE_REFERENCE, RESOURCES_PAGE_REFERENCE)
- Removed deprecated `design-system.ts` (replaced by `tokens.ts`)
- Removed orphaned images (hero-bg.jpg, closer-bg.jpg, brand-icon-f.jpg, og-image.svg)
- Cleaned `package.json` metadata (was `vite_react_shadcn_ts` v0.0.0, now `filmmaker-calculator-suite` v1.0.0)
- Fixed sitemap.xml (wrong domain `filmmaker.og` → `filmmakerog.com`)
- Fixed robots.txt (added sitemap reference)
- Updated vercel.json (asset caching headers)
- Removed stray `console.log` in WaterfallDeck

### Visual System Overhaul
- Created `mockup/dark-gray` branch → iterated through 4-layer surface hierarchy
- Established containerized section pattern with warm gold header bands
- Built EyebrowPill component for consistent section headers
- Gold tints: 0.06 standard header bands, 0.10 hero/closer (hotter bookends)
- Updated BRAND_SYSTEM.md from v1.0 → v2.0 → v3.0

### Premium Overhaul
- Broke the 430px cage → responsive 780px max-width with `clamp()` padding
- Warmed all colors: containers `#1A1A1C`, surfaces `#232326`, text `rgba(250,248,244,...)`
- Reordered landing page sections: Hero → Preview → Waterfall → Stakes → Reality → Social → Closer
- Shortened hero: CTA above fold, calculator below
- Responsive typography via `clamp()` on all headlines
- Killed all purple → gold-rimmed white waterfall badges
- Variable section spacing (32px–72px) matching emotional weight
- Desktop layouts: 2x2 stake cards, preview cards wrap into row
- Hover micro-interactions via CSS classes (CTA brighten, card lift)
- Scroll thread hidden on mobile, desktop-only

### Brand System Sweep (19 files)
- Applied warm colors across every page and component
- Store, Calculator, WaterfallDeck widened from 430px → 780px
- Store FAQ wrapped in proper container
- OG Fab visibility boosted (stronger bg, border, repositioned)
- Resources vault hero spacing fixed
- All purple remnants eliminated (including OgBotFab)

### Holistic Polish (23 fixes)
- Fixed hero slider math (guilds on budget, realistic debt service)
- Fixed hero double gap (48px → 20px)
- Fixed warm-white consistency (4 cold-white remnants)
- Added testimonial gold left border
- Tightened feature badge padding
- CTA text consistency across all 3 buttons
- Differentiated post-waterfall reassurance text
- Updated page comment block to reflect actual section order

### Deck + PDF Overhaul (Second Session)

**WaterfallDeck.tsx** — 7 new components + structural reorganization:
- **Cold Open** — Full-viewport dramatic reveal (multiple + verdict word), screen only
- **30-Second Card** — 2x2 metric grid replacing old 6-cell KPI rows (Budget, Acquisition, Net Profit, Multiple)
- **Revenue Donut** — Pure SVG (no Recharts), stroke-dasharray segments showing where every dollar goes, per-dollar legend below
- **Margin Ruler** — Horizontal bar with gold breakeven marker + dollar gap, in callout card
- **TransitionBridge** — Italic one-liners between sections for narrative flow
- **Enhanced Verdict** — Existing verdict strip wrapped in card with radial glow
- **DealSection shortened** — First paragraph no longer recaps numbers visible in 30-Second Card

**api/_pdf-template.ts** — Complete rebuild:
- 5 pages: Executive Summary, Revenue Allocation, Waterfall, Capital Stack + Scenarios, Back Page
- 3 prose sections: "The Deal" (page 1), "The Margin" (page 3), "The Structure" (page 4)
- Heavy FILMMAKER.OG branding: gold header bar, brand name header, watermark, filmmakerog.com footer on every page
- Zero upsell — no gate cards, no "Full Analysis" pitch inside the PDF
- Static SVG donut + per-dollar table + margin ruler for print

**Product strategy shift**: Free PDF gets everything (donut, waterfall, scenarios, prose, margin ruler). Paid Snapshot+ ($49) becomes branded template (user's company name replaces FILMMAKER.OG). Full Analysis ($197) may be folded into free tier.

---

## 8. KNOWN REMAINING ITEMS

- **Snapshot+ checkout wiring** — Stripe product exists (`prod_UEmfhPqL9VPQXt`, $19). `TODO` in WaterfallDeck.tsx needs to call `create-checkout` edge function.
- **Loops LOOPS_API_KEY** — Must be set in Supabase Edge Function secrets via dashboard.
- **Loops database webhook** — Must be created in Supabase dashboard: `leads` table INSERT → `sync-lead-to-loops`.
- **Loops email sequences** — Welcome + nurture + post-purchase sequences need to be built in Loops dashboard.
- **Stripe webhook → Loops** — Connect Stripe to Loops for post-purchase email triggers.
- **Comp Report / Producer's Package / Boutique Stripe products** — Not yet created in Stripe.
- **Store page redesign** — Remove dead Full Analysis references, restructure layout for new product ladder.
- **BuildYourPlan** — Post-purchase flow exists but may need polish to match the new system fully.
- **WaterfallDeck FONT constant** — Has its own type system that predates the brand system. Aligned where possible, some exceptions documented in BRAND_SYSTEM.md.
- **Analytics** — No analytics in codebase. Recommended: Vercel Analytics, Plausible, or PostHog.
- **npm audit** — 5 remaining low/moderate vulnerabilities in dev dependencies (esbuild, jsdom) that require major version bumps to fix.

## COMPLETED (March 29, 2026)

- ✅ Supabase `leads` table created with RLS (anonymous inserts)
- ✅ OTP auth killed from LeadCaptureModal — replaced with leads table insert
- ✅ Calculator/Index/WaterfallDeck auth gates simplified to localStorage only
- ✅ Full Analysis ($197) removed from product ladder
- ✅ Snapshot+ repriced from $49 → $19
- ✅ Working Model restricted to Producer's Package add-on only
- ✅ Stripe product + price + payment link created for Snapshot+
- ✅ Loops.so connected — admin contact created
- ✅ `sync-lead-to-loops` edge function deployed to Supabase
- ✅ OgBot switched from Gemini to Claude (ask-the-og edge function)
- ✅ Google Workspace verified — og@filmmakerog.com live
- ✅ MX + SPF + DMARC + DKIM records configured for Loops sending domain
- ✅ GitHub + Vercel accounts updated to og@filmmakerog.com

---

## 9. USER PREFERENCES

- "It cannot feel mustard" — gold tints must be subtle
- Expects proactive, complete solutions — no incremental drip
- "Vibe coder" — gives creative direction, not line-by-line specs
- Research says: never mid-grey on dark grey (high contrast white)
- Prefers clear visual hierarchy with elevation differences
- User timezone: America/Chicago (CDT)
- Git user: `filmmaker-og` / `og@filmmakerog.com`
- Personal email: `thefilmmaker.og@gmail.com` (legacy/backup)
- Domain registrar: Vercel Domains

---

## 10. HOW TO WORK ON THIS CODEBASE

1. Always branch from `main`. Never commit directly to `main`.
2. Read `BRAND_SYSTEM.md` before making visual changes.
3. Use `tokens.ts` for colors — never hardcode rgba values.
4. Run `npx tsc --noEmit` before committing — must pass clean.
5. The landing page (`Index.tsx`) is the reference implementation. When in doubt, match its patterns.
6. All pages use 780px max-width with `clamp()` responsive padding.
7. All containers get `className="grain-surface"` + gold borders + white top border.
8. Body text is warm-white (`rgba(250,248,244,...)`), labels are cold-white (`rgba(255,255,255,...)`).
9. No purple. Anywhere. Ever.
10. Test on mobile (390px) AND desktop — the `clamp()` values handle the gap.
