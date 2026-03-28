# FILMMAKER.OG — Film Finance Simulator

Free film budget calculator and recoupment waterfall simulator for independent producers. Model your production budget, capital stack, and investor returns before you sign.

**Live:** [filmmakerog.com](https://filmmakerog.com)

## What It Does

- **Interactive Calculator** — Slide three inputs (budget, equity %, sales estimate) and instantly see your full financial picture
- **8-Tier Waterfall** — Visualize exactly who gets paid first, from distribution fees through producer profit
- **Capital Stack Modeling** — Structure debt, equity, and gap financing with real fee calculations
- **Store** — Premium report packages (Cascade, Verdict, Split, Stack, Break-Even)
- **Educational Resources** — Resource Vault with glossary, budget breakdowns, capital structure guides, fee explainers

## Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui + custom design system
- **Backend:** Supabase (auth, database)
- **Hosting:** Vercel (deploys from `main`)
- **Fonts:** Bebas Neue, Inter, Roboto Mono (Google Fonts)

## Design System

The visual system is documented in [`BRAND_SYSTEM.md`](./BRAND_SYSTEM.md) (v3.0). Key principles:

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
```

## Key Files

| File | Purpose |
|---|---|
| `BRAND_SYSTEM.md` | Design system documentation (v3.0) |
| `src/lib/tokens.ts` | Color token functions — single source of truth for all colors |
| `src/index.css` | Global styles, keyframes, hover classes, responsive utilities |
| `src/pages/Index.tsx` | Landing page (~1300 lines, reference implementation) |
| `src/components/calculator/WaterfallDeck.tsx` | Waterfall output (~2100 lines) |
