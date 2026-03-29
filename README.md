# FILMMAKER.OG — Film Finance Simulator

Free film budget calculator and recoupment waterfall simulator for independent producers. Model your production budget, capital stack, and investor returns before you sign.

**Live:** [filmmakerog.com](https://filmmakerog.com)

## What It Does

- **Interactive Calculator** — 4-step input wizard (Project, Budget, Capital Stack, Deal Terms) with live calculations
- **Cinematic Output** — Cold open reveal, revenue donut, margin ruler, per-dollar breakdown, animated waterfall cascade
- **Free PDF Export** — 5-page branded financial analysis document, no paywall
- **8-Tier Waterfall** — Visualize exactly who gets paid first, from distribution fees through producer profit
- **Capital Stack Modeling** — Structure debt, equity, and gap financing with real fee calculations
- **Store** — Snapshot+ ($19), comp reports ($595+), turnkey producer packages ($1,797)
- **Educational Resources** — Resource Vault with glossary, budget breakdowns, capital structure guides

## Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui + custom design system
- **Backend:** Supabase (database, edge functions)
- **Hosting:** Vercel (deploys from `main`)
- **Domain:** filmmakerog.com (Vercel Domains)
- **Email:** Google Workspace — og@filmmakerog.com
- **Email Marketing:** Loops.so (transactional + nurture sequences)
- **Payments:** Stripe (one-time checkout)
- **Fonts:** Bebas Neue, Inter, Roboto Mono (Google Fonts)

## Design System

The visual system is documented in [`BRAND_SYSTEM.md`](./BRAND_SYSTEM.md) (v3.1). Key principles:

- **Dark-first** — `#0C0C0E` page background, warm `#1A1A1C` containers, `#232326` surfaces
- **Two-gold system** — Metallic `#D4AF37` for brand elements, `#F9E076` for CTAs only
- **Warm-white text** — `rgba(250,248,244,...)` for body, cold-white for labels
- **Responsive** — 780px max-width, `clamp()` padding (mobile-first, desktop breathes wider)
- **No purple** — fully eliminated, gold system throughout

## Landing Page Structure (v18)

1. Hero — headline + CTA above fold, interactive calculator below
2. Product Preview — 5 output preview cards (scrollable mobile, grid desktop)
3. Waterfall — 8-tier money flow with running balance counter
4. What's At Stake — 4 reason cards (2x2 on desktop)
5. Reality — typing reveal + WITH/WITHOUT comparison grid
6. Social Proof — testimonial + feature badges
7. Closer — "YOUR NEXT PITCH IS COMING."

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Lead Capture Flow

```
Landing Page → LeadCaptureModal (name + email)
  → Insert to Supabase `leads` table + localStorage
  → Supabase webhook → Edge Function → Loops contact
  → Calculator → Free PDF → Snapshot+ gate ($19) → Store
```

No auth, no magic links, no OTP. Lead capture is best-effort — users get through even if the insert fails.

## Product Ladder

| Product | Price | Type |
|---------|-------|------|
| Free Snapshot | $0 | Lead magnet — full waterfall, donut, margin ruler, 5-page PDF |
| Snapshot+ | $19 | White-labeled + 4 diagnostic metrics |
| Comp Report | $595 / $995 | 5 or 10 comparable acquisition deals |
| Producer's Package | $1,797 | Turnkey — lookbook, pitch deck, financials, 10 comps |
| Boutique | $2,997+ | Custom scope per engagement |
| Working Model | +$79 | Add-on at Producer's Package checkout |

## Project Structure

```
src/
├── pages/           # Route-level pages (Index, Calculator, Store, Resources, etc.)
├── components/      # Shared UI components
│   ├── calculator/  # Calculator-specific (tabs, cards, waterfall deck)
│   └── ui/          # shadcn/ui primitives
├── hooks/           # Custom hooks (haptics, intersection observer)
├── integrations/    # Supabase client + types
└── lib/             # Design tokens (tokens.ts), utilities, store product data
supabase/
└── functions/       # Edge functions (ask-the-og, sync-lead-to-loops)
api/
├── generate-pdf.ts  # Vercel serverless — PDF generation
└── _pdf-template.ts # PDF template (5-page branded document)
```

## Key Files

| File | Purpose |
|---|---|
| `BRAND_SYSTEM.md` | Design system documentation (v3.1) |
| `CONVERSION_STRATEGY.md` | Full product ladder, pricing, funnel architecture |
| `src/lib/tokens.ts` | Color token functions — single source of truth for all colors |
| `src/lib/store-products.ts` | Product definitions, pricing, and upgrade paths |
| `src/index.css` | Global styles, keyframes, hover classes, responsive utilities |
| `src/pages/Index.tsx` | Landing page (~1300 lines, reference implementation) |
| `src/components/calculator/WaterfallDeck.tsx` | Waterfall output (~2890 lines) |
| `api/_pdf-template.ts` | PDF export template (~660 lines) |
