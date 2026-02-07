
# Store Redesign: Premium Wiki-Style Product Pages

## Overview

Transform the current plain-text Store into a **two-level premium experience** that matches your institutional-grade Wiki aesthetic and properly justifies the $197–$4,997 price points.

**Current Problem**: The Store is a simple list with bullet points. At these price points, users need narrative-driven value propositions, visual hierarchy, and detailed explanations of why each package matters.

**Solution**: Create a Store Hub with teaser cards that link to individual product detail pages, each using the established Wiki pattern (WikiCard, WikiSectionHeader, WikiCallout components).

---

## New Page Architecture

```text
Current:
  /store → Simple list of all products

Redesigned:
  /store                  → Store Hub (teaser cards, each clickable)
  /store/snapshot         → The Snapshot detail page
  /store/blueprint        → The Blueprint detail page  
  /store/investor-kit     → The Investor Kit detail page (featured)
  /store/greenlight       → The Greenlight Package detail page
```

---

## Store Hub Design

The main `/store` page becomes an attractive "menu" of products using the Wiki card aesthetic:

```text
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRODUCER'S SERVICES                                         │
│  Professional film finance tools for serious producers       │
│  ───────────────────────────────────── (gold divider)        │
│                                                              │
│  [ Founders Pricing Badge ]                                  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ │ 01 │ THE SNAPSHOT                          $197   > │   │
│  │       Your Deal at a Glance                           │   │
│  │       6-Sheet Excel • Executive Summary • 30 Days     │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ │ 02 │ THE BLUEPRINT                         $997   > │   │
│  │       Multi-Scenario Analysis                         │   │
│  │       3 Scenarios • Sensitivity Charts • 60 Days      │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ │ 03 │ THE INVESTOR KIT ★               ~~$2,997~~    │   │ (gold border)
│  │       Complete Investor Package           $1,997    > │   │
│  │       Comp Database • Pitch Deck • Strategy Call      │   │
│  │                                    MOST POPULAR       │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ │ 04 │ THE GREENLIGHT PACKAGE              $4,997   > │   │
│  │       White-Glove Service                             │   │
│  │       Custom Model • Dedicated Strategist • 1 Year    │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  FOOTER (disclaimer)                                         │
└─────────────────────────────────────────────────────────────┘
```

**Each card is clickable and navigates to the detailed product page.**

---

## Product Detail Page Structure

Each product page follows the established Wiki pattern with sections that tell the story:

```text
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ← Back to Packages                                          │
│                                                              │
│  THE INVESTOR KIT                                            │
│  Complete Investor Package                                   │
│  ───────────────────────────────────── (gold divider)        │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 01 │ WHAT YOU GET                                     │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ Feature grid with icons and detailed descriptions     │   │
│  │ - Comparable Films Report (5 titles)                  │   │
│  │ - Investor One-Pager (PDF)                            │   │
│  │ - Investor Memo (3-5 pages)                           │   │
│  │ - "What Investors Ask" Guide                          │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 02 │ WHY IT MATTERS                                   │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ Narrative value proposition explaining the "why"      │   │
│  │                                                       │   │
│  │ [CALLOUT: Pro Tip]                                    │   │
│  │ This is the single most valuable data...              │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 03 │ WHO IT'S FOR                                     │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ Ideal customer profiles and use cases                 │   │
│  │ • Producers raising $500K+                            │   │
│  │ • Projects seeking institutional investment           │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ 04 │ WHAT'S INCLUDED FROM LOWER TIERS                 │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │ Visual showing everything from Blueprint + Snapshot   │   │
│  └───────────────────────────────────────────────────────┘   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ~~$2,997~~  $1,997  FOUNDERS PRICE                 │    │
│  │                                                      │    │
│  │  [ Email input if guest ]                           │    │
│  │  ☐ I agree to terms of service                      │    │
│  │                                                      │    │
│  │  [ PURCHASE NOW ]                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  FOOTER (disclaimer)                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Product Content

### The Snapshot ($197)

**Headline**: "Your Deal at a Glance"

**Section 01 - What You Get**:
- 6-sheet professional Excel workbook
- Executive Summary dashboard with key metrics
- Full waterfall breakdown showing every payment tier
- Investor-ready formatting matching industry standards

**Section 02 - Why It Matters**:
"When you walk into an investor meeting with a professionally formatted financial report, you're no longer just a filmmaker asking for money — you're a business partner who understands the numbers. The Snapshot transforms your calculator inputs into a document that speaks the language of finance."

**Section 03 - Who It's For**:
- Producers with a single deal ready to present
- First-time filmmakers building credibility
- Anyone who needs a quick, professional export

**Buyer's internal math**: "That's less than Final Draft. And I actually need this to raise money."

---

### The Blueprint ($997)

**Headline**: "Present With Confidence"

**Section 01 - What You Get** (in addition to Snapshot):
- 3-scenario comparison tool (Best/Base/Worst case)
- Sensitivity analysis charts showing range of outcomes
- "How to Read Your Blueprint" guide
- 60-day platform access
- Priority email support

**Section 02 - Why It Matters**:
"Sophisticated investors don't just ask 'What if it works?' They ask 'What if it doesn't?' The Blueprint lets you present multiple scenarios side-by-side, demonstrating that you've thought through the range of outcomes. This is how institutional money evaluates deals."

**Section 03 - Who It's For**:
- Producers actively raising equity
- Projects with multiple financing structures to evaluate
- Experienced filmmakers who need scenario modeling

**Buyer's internal math**: "$997 to look like I've done this before? My film costs $1.5M to make. This is a rounding error."

---

### The Investor Kit ($1,997) — Featured Tier

**Headline**: "Complete Investor Package"

**Section 01 - What You Get** (in addition to Blueprint):
- Comparable Films Report (5 real titles matched by budget/genre)
- Investor One-Pager (PDF) — fill form, template populates
- Investor Memo (3-5 page PDF) — narrative document
- "What Investors Actually Ask" guide with 15 Q&As
- 6-month platform access
- 1-on-1 strategy call (30 minutes)

**Section 02 - Why It Matters**:
"This is the complete toolkit for closing serious capital. The pitch deck template has been refined through dozens of successful raises. The comp data is what sales agents charge 10-15% commissions for — and we hand it to you for the first time. The strategy call gives you direct access to expertise that would cost thousands in consulting fees."

[CALLOUT - Pro Insight]:
"The Comparable Films Report is the single most valuable item in the entire product line. An aspiring filmmaker literally cannot access this data without knowing someone. We hand it to them for the first time."

**Section 03 - Who It's For**:
- Producers raising $500K+
- Projects seeking institutional or family office investment
- Filmmakers who want professional-grade materials without hiring a consultant

**Buyer's internal math**: "A producer's rep would cost $50K–$150K in commissions. A consultant would charge $15K. This gives me 80% of what they'd deliver for $2K."

---

### The Greenlight Package ($4,997)

**Headline**: "White-Glove Service"

**Section 01 - What You Get** (in addition to Investor Kit):
- Deep Comp Analysis (10 titles + 3-year trends + territory breakdowns)
- Custom Financial Model Build (tailored to your specific deal)
- White-Label Everything (your logo, your branding)
- Term Sheet Outline (framework for lawyers)
- Distribution Strategy Brief
- 12-month platform access
- Dedicated Strategist (3 calls over project lifecycle)
- Ongoing Support Channel

**Section 02 - Why It Matters**:
"For projects with complex financing structures — multiple territories, co-productions, tax incentive stacking — you need more than a template. The Greenlight Package gives you a dedicated professional who builds your model from scratch and stays with you through closing."

**Section 03 - Who It's For**:
- Productions with budgets over $2M
- International co-productions
- Projects with complex tax incentive strategies
- Producers who want a financial partner, not just a tool

**Buyer's internal math**: "$5K for everything I need? My lawyer alone will cost more — and I don't even have one yet."

---

## Technical Implementation

### Files to Create

1. **`src/data/products.ts`**
   - Centralized product data with all content, features, pricing, value propositions
   - Single source of truth for both Hub and Detail pages

2. **`src/pages/store/StoreHub.tsx`**
   - The overview page at `/store`
   - Uses WikiCard pattern for teaser cards
   - Each card clickable, navigates to detail page

3. **`src/pages/store/ProductDetail.tsx`**
   - Reusable template component for all product pages
   - Receives product data as props
   - Handles purchase flow (email input, terms checkbox, Stripe redirect)

4. **`src/pages/store/SnapshotDetail.tsx`** — route component for `/store/snapshot`
5. **`src/pages/store/BlueprintDetail.tsx`** — route component for `/store/blueprint`
6. **`src/pages/store/InvestorKitDetail.tsx`** — route component for `/store/investor-kit`
7. **`src/pages/store/GreenlightDetail.tsx`** — route component for `/store/greenlight`

### Files to Update

1. **`src/App.tsx`**
   - Add new routes for `/store/:productId` pattern
   - Update Store import to StoreHub

2. **`src/pages/Store.tsx`**
   - Either rename to StoreHub or refactor entirely
   - Success view can remain here or move to separate component

### Components to Reuse

- `WikiSectionHeader` — Gold-accented section headers
- `WikiCard` — Matte card containers
- `WikiCallout` — Pro tips and key insights
- `Header` — Standard navigation
- Design tokens from `design-system.ts`
- Existing Stripe checkout integration

### Design System Alignment

- Background: `colors.void` (#000000)
- Cards: `colors.card` (#070707) with `colors.borderSubtle` borders
- Gold accents: `colors.gold` (#D4AF37) for non-interactive, `colors.goldCta` (#F9E076) for CTAs
- Typography: Bebas Neue for headers, Roboto Mono for prices, Inter for body
- No border-radius per design constraints
- Mobile-first with 44px touch targets

---

## User Flow

1. User clicks "Producer's Services" in menu
2. Lands on `/store` — sees 4 attractive Wiki-style product cards
3. Clicks a product card → navigates to `/store/investor-kit` (for example)
4. Reads detailed value proposition in Wiki sections (What You Get, Why It Matters, Who It's For)
5. Scrolls to sticky purchase section at bottom
6. Enters email (if not logged in), agrees to terms checkbox
7. Clicks "PURCHASE" → Stripe checkout opens
8. Returns with `?success=true` → success confirmation view

---

## Mobile Considerations

- All content within `w-[calc(100vw-2rem)]` to maintain edge gutter
- Touch targets minimum 48px
- Sticky purchase section at bottom of detail pages
- Back navigation via text link (not header arrow per design system)
- Smooth scroll between sections

---

## Implementation Order

1. Create `src/data/products.ts` with all product content
2. Build `StoreHub.tsx` with clickable teaser cards
3. Build `ProductDetail.tsx` reusable template
4. Create individual route components for each product
5. Update `App.tsx` with new routes
6. Test purchase flow end-to-end
7. Verify mobile responsiveness

