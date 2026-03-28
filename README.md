# FILMMAKER.OG — Film Finance Simulator

Free film budget calculator and recoupment waterfall simulator for independent producers. Model your production budget, capital stack, and investor returns before you sign.

**Live:** [filmmakerog.com](https://filmmakerog.com)

## What It Does

- **Interactive Calculator** — Slide three inputs (budget, equity %, sales estimate) and instantly see your full financial picture
- **8-Tier Waterfall** — Visualize exactly who gets paid first, from distribution fees through producer profit
- **Capital Stack Modeling** — Structure debt, equity, and gap financing with real fee calculations
- **Store** — Premium report packages (Cascade, Verdict, Split, Stack, Break-Even)
- **Educational Resources** — Glossary, budget breakdowns, capital structure guides, fee explainers

## Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui + custom design system ([BRAND_SYSTEM.md](./BRAND_SYSTEM.md))
- **Backend:** Supabase (auth, database)
- **Hosting:** Vercel
- **Fonts:** Bebas Neue, Inter, Roboto Mono

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
│   ├── calculator/  # Calculator-specific components (tabs, cards, waterfall)
│   └── ui/          # shadcn/ui primitives
├── hooks/           # Custom hooks (haptics, intersection observer)
├── integrations/    # Supabase client + types
└── lib/             # Design tokens, utilities, store product data
```

## Design System

The visual system is documented in [`BRAND_SYSTEM.md`](./BRAND_SYSTEM.md) — surface hierarchy, color tokens, typography scale, spacing, and component patterns. All pages follow this single source of truth.
