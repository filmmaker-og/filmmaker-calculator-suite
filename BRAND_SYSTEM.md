# FILMMAKER.OG — Brand System

**Version:** 3.1
**Last updated:** March 28, 2026
**Source of truth for:** Every page, component, and visual decision in the product.

When building or reskinning any page, reference this file — not memory, not other pages. If a decision isn't in here, it hasn't been made yet.

---

## 1. COLOR

### The Rule
Gold + black + warm white. That's it. Every other color is semantic (communicates data) or an earned exception. No purple anywhere.

### Surface Hierarchy (6 layers)
| Token | Value | Use |
|---|---|---|
| Page (Void) | `#0C0C0E` | `<body>` / outermost wrapper — near-black with a warm hint |
| Container | `#1A1A1C` | Section containers — warm dark gray with `grain-surface` overlay |
| Header Band | `linear-gradient(180deg, rgba(212,175,55,0.06), #232326)` | First child inside every container — visible gold warmth. Hero + closer run hotter at `0.10`. |
| Inner Card | `linear-gradient(180deg, rgba(212,175,55,0.02), #232326)` | Content cards inside sections — subtle gold warmth |
| Inner Surface | `#232326` | Calculator areas, data surfaces, WITH/WITHOUT grid cells |
| Footer | `#161618` | Footer background |

Each layer is progressively lighter. Container (`#1A1A1C`) lifts off the page (`#0C0C0E`). Header bands and inner cards add gold warmth via gradients. Never use `#000`, `#111`, `#121212`, `#1E1E22`, or `#242428` (these are deprecated values).

### Gold — The Brand Color
| Token | Value | Use |
|---|---|---|
| `GOLD` | `#D4AF37` | Borders, icons, dividers, brand elements |
| `CTA` / `#F9E076` | CTA Gold | **Exclusively** for clickable elements (buttons, links) |
| `gold(0.15)` | Container borders (sides) |
| `gold(0.25)` | Active/hover borders, OgBotFab border |
| `gold(0.30)` | Waterfall tier number badge border |
| `gold(0.12)` | Inner card borders, waterfall tier badge background |
| `gold(0.08)` | Background tints, eyebrow pill bg |
| `gold(0.03)` | Ghost/ambient fill |

**The two-gold rule:** If it's not clickable, it's not `#F9E076`. Metallic gold (`#D4AF37`) is for brand elements. CTA gold is for buttons and links only.

### Semantic Colors
| Color | Hex | Meaning |
|---|---|---|
| Green | `#3CB371` | Positive, funded, profit, success |
| Red | `#DC2626` | Negative, deductions, danger, error |
| Amber | `#F0A830` | Partial, warning, caution |

These appear **only** when communicating data — waterfall tiers, profit/loss, status badges. Never decorative.

### Purple — ELIMINATED
Purple has been fully removed from the codebase. Waterfall tier number badges are now gold-rimmed white circles. No purple gradients, shadows, or accents exist anywhere.

### White — Text Hierarchy (Warm)
Body text uses warm-white (`rgba(250,248,244,...)`) not cold-white (`rgba(255,255,255,...)`). Labels and mono text stay cold-white for crispness.

| Role | Value | Use |
|---|---|---|
| Headlines | `#fff` or `white(0.95)` | Section headlines, hero headline |
| Body (primary) | `rgba(250,248,244,0.90)` | Testimonials, WITH column text |
| Body (standard) | `rgba(250,248,244,0.88)` | All Inter body text, descriptions |
| Body (secondary) | `rgba(250,248,244,0.78)` | Supporting text, WITHOUT column, stake card body |
| Labels | `rgba(255,255,255,0.70)` | Slider labels, metadata (cold-white, Roboto Mono) |
| Tertiary | `rgba(255,255,255,0.60)` | Minimum for readable text — floor |
| Footer | `rgba(255,255,255,0.55)` | Footer text, disclaimers |
| Easter egg | `rgba(255,255,255,0.35)` | "Best viewed in the dark." — decorative only |

**Opacity floor:** No text intended to be read may go below `0.60`. Below that is decorative only.

### Import Rule
Always import from `@/lib/tokens`. Never write raw `rgba()` in `.tsx` files.

```typescript
import { gold, white, GOLD, CTA, BG } from '@/lib/tokens';
```

---

## 2. TYPOGRAPHY

### Font Stack
| Role | Font | Weight | Where |
|---|---|---|---|
| Headlines | Bebas Neue | 400 | Section titles, card titles, hero text, data callouts |
| Body | Inter | 400, 500, 600 | Body copy, descriptions, UI text |
| Data / Labels | Roboto Mono | 500 | Numbers, labels, eyebrows, metadata |

All three loaded via Google Fonts in `index.css`.

### Size Scale (Responsive)
| Element | Font | Size | Color | Notes |
|---|---|---|---|---|
| Hero headline | Bebas Neue | `clamp(3.2rem, 8vw, 4.4rem)` | `#fff` | line-height: 0.90 |
| Section headline | Bebas Neue | `clamp(2.4rem, 6vw, 3.0rem)` | `#fff` | One per section, gold accent on key word |
| Closer headline | Bebas Neue | `clamp(2.8rem, 7vw, 3.6rem)` | `#fff` | Inside closer container |
| Hero subtitle | Inter | `clamp(14px, 2vw, 16px)` | `white(0.70)` | Below hero headline |
| Card title | Bebas Neue | 1.4–1.8rem | `#fff` | Inside cards |
| Data callout | Bebas Neue | 2.4–3.2rem | Semantic color | Large numbers (profit, totals) |
| Body | Inter | 16px | `rgba(250,248,244,0.88)` | line-height: 1.6. Not 1.45. Not 1.55. |
| EyebrowPill | Roboto Mono | 13px | `#D4AF37` | `letter-spacing: 0.16em`, uppercase |
| Slider/field label | Roboto Mono | 11-12px | `white(0.70-0.75)` | uppercase, tracked |
| Badge/tag text | Roboto Mono | 10–11px | Varies | `letter-spacing: 0.06–0.08em`, uppercase |
| Footer text | Inter | 14px | `white(0.55)` | Disclaimer, legal |

### Rules
- Bebas Neue is always uppercase (it only has uppercase glyphs)
- Inter body text is always 16px with `line-height: 1.6`
- Roboto Mono labels are always uppercase with tracked letter-spacing
- Never use `font-weight: 700` on Bebas Neue (it only has 400)
- Use `clamp()` for responsive sizing on headlines

---

## 3. COMPONENTS

### Section Container
```css
background: #1A1A1C;
border: 1px solid rgba(212,175,55,0.15);
border-top: 1px solid rgba(255,255,255,0.08);
border-radius: 8px;
padding: 32px clamp(16px, 4vw, 32px);
box-shadow: 0 4px 16px rgba(0,0,0,0.30);
```
Always add `className="grain-surface"` for SVG noise texture overlay (opacity: 0.035). First child is always a **Header Band**.

### Header Band
First child inside every Section Container:
```css
background: linear-gradient(180deg, rgba(212,175,55,0.06), #232326);
border: 1px solid rgba(255,255,255,0.04);
border-bottom: 1px solid rgba(212,175,55,0.10);
border-radius: 6px;
padding: 24px 20px;
margin-bottom: 16px;
text-align: center;
```
Hero and closer header bands use `rgba(212,175,55,0.10)` instead of `0.06` — hotter bookends.

### EyebrowPill
```css
font-family: 'Roboto Mono', monospace;
font-size: 13px;
color: #D4AF37;
letter-spacing: 0.16em;
text-transform: uppercase;
background: rgba(212,175,55,0.10);
border: 1px solid rgba(212,175,55,0.25);
padding: 6px 18px;
border-radius: 999px;
```

### Inner Card
```css
background: linear-gradient(180deg, rgba(212,175,55,0.02), #232326);
border: 1px solid rgba(212,175,55,0.12);
border-radius: 8px;
padding: 16px 14px;
```

### CTA Button
```css
background: #F9E076;
color: #000;
font-family: 'Bebas Neue', sans-serif;
font-size: 20px;
letter-spacing: 0.18em;
border-radius: 8px;
border-top: 1px solid rgba(255,255,255,0.15);
padding: 18px 0;
width: 100%;
```
- Add `className="cta-gold-btn"` for hover brightening (#FBE88A)
- One-shot shimmer animation
- Idle glow pulse: 4s cycle breathing box-shadow
- Press: `scale(0.98)` on mouseDown

### Waterfall Tier Badge (gold-rimmed)
```css
width: 30px; height: 30px; border-radius: 50%;
background: rgba(212,175,55,0.12);
border: 1px solid rgba(212,175,55,0.30);
color: #fff;
font-family: 'Bebas Neue', sans-serif;
font-size: 0.95rem;
```
Add `className="wf-card"` to waterfall cards for hover lift effect.

### Testimonial Blockquote
```css
padding-left: 16px;
border-left: 2px solid rgba(212,175,55,0.25);
```

### Footer
- Background: `#161618`
- Border-top: `1px solid rgba(212,175,55,0.15)`
- Social icons: gold at 0.50, 36px square with gold border at 0.20
- Nav links: Roboto Mono 13px, gold at 0.60
- Disclaimer: Inter 14px, white at 0.55
- "Best viewed in the dark." — Roboto Mono 11px, white at 0.35

---

## 4. MOTION

### Scroll Reveal (default entrance)
```
opacity: 0 → 1; translateY(16px) → 0; 0.8s cubic-bezier(0.16, 1, 0.3, 1)
```
Staggered delays: `delay * 100ms`. Respects `prefers-reduced-motion`.

### CTA Shimmer — one-shot, 1.5s, 0.5s delay
### Stamp — one-shot on waterfall card enter
### Typing Reveal — 35ms/char, Reality section
### Count-Up — rAF with cubic ease-out, 1200–1800ms
### Card Hover — `translateY(-2px)` + enhanced shadow (desktop only, via CSS class)

### Rules
- No infinite animations except CTA idle glow (4s, barely perceptible)
- Every animation earns its existence by communicating information
- Touch feedback: `scale(0.97–0.98)` on press

---

## 5. LAYOUT

### Responsive Page Container
```css
max-width: 780px;
margin: 0 auto;
background: #0C0C0E;
```
Mobile stays tight via `clamp()` padding. Desktop breathes wider. This applies to ALL pages (landing, calculator, store, resources).

### Section Padding (Responsive)
```css
padding: 0 clamp(20px, 5vw, 48px);  /* section wrapper */
padding: 32px clamp(16px, 4vw, 32px);  /* container inner */
```

### Section Spacing (Variable — Landing Page)
| Transition | Spacer | Reason |
|---|---|---|
| Hero → Preview | 32px | Fast, keep momentum |
| Preview → Waterfall | 64px | Big shift, give air |
| Waterfall → Stakes | 48px | Continuation |
| Stakes → Reality | 40px | Tight, building tension |
| Reality → Social | 56px | Mood shift |
| Social → Closer | 72px | Dramatic pause |

### Desktop Responsive
- What's At Stake: `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))` — 2x2 on desktop
- Product Preview: CSS class `preview-scroll` wraps into row at 640px+
- Scroll progress thread: hidden on mobile, visible at 840px+ via `.scroll-thread` class

### Desktop Ambient Glow
```css
@media (min-width: 768px) {
  body::before { /* purple radial, top-left */ }
  body::after  { /* gold radial, bottom-right */ }
}
```

---

## 6. LANDING PAGE STRUCTURE (v18)
1. **Hero** — Headline + CTA above fold, interactive 3-slider calculator below fold
2. **Product Preview** — "What You'll Build" — 5 scrollable/wrapping preview cards
3. **Waterfall** — Full 8-tier money flow with running balance counter
4. **What's At Stake** — 4 reason cards (2x2 on desktop)
5. **Reality** — Typing reveal blockquote + WITH/WITHOUT grid
6. **Social Proof** — Testimonial (gold left border) + feature badges
7. **Closer** — "YOUR NEXT PITCH IS COMING." + CTA
8. **Footer**

### Hero Slider Math
```typescript
salesFee = acquisitionValue * (salesFeePercent / 100)
guilds = budgetValue * 0.055        // on production budget
camFee = acquisitionValue * 0.01    // on revenue
debtAmount = budgetValue * 0.50     // 50% leverage
debtService = debtAmount * 0.12     // 12% interest
```

---

## 7. CALCULATOR OUTPUT (WaterfallDeck)

The calculator output is a cinematic financial brief displayed after the user completes all 4 input tabs. It reads like a film — cold open, rising action, climax, resolution.

### Screen Output Structure
1. **Cold Open** (screen only) — Full-viewport dramatic reveal. Giant multiple number (100-140px), color-coded verdict word (FUNDED/PARTIAL/UNDERWATER), "Scroll to explore" prompt.
2. **Cover / Executive Summary** — 2x2 "30-Second Card" (Budget, Acquisition, Net Profit, Multiple) + supplementary metrics (Break-Even, Cash Basis) + verdict strip with radial glow + AI deal insight.
3. **Gate 0: Snapshot+** — Locked diagnostic metrics ($49)
4. **The Deal** — Investment thesis prose (capital structure narrative, verdict context)
5. **Visual Cluster: The Numbers** — Off-the-top erosion bar, Revenue Donut (SVG, per-dollar breakdown), net-to-investors strip, capital stack visual, scenario stress test (4 price points), Gate 1: Sensitivity locked
6. **The Interpretation** — Prose explaining cascade mechanics, Margin of Safety ruler (breakeven visual with dollar gap), recoupment waterfall cascade, Gate 2: Comps locked
7. **The Waterfall** — Tier-by-tier cascade with funded/unfunded status
8. **The Conclusion** — Enhanced verdict, closing context, Gate 3: Investor Memo locked
9. **CTA** — Export Free Snapshot PDF + upsell

### Transition Bridges
Italic one-liners between sections guide the narrative flow:
- "The structure behind the numbers."
- "Now let's see where the money actually goes."
- "What this means for your investors."

### Key Visual Components
| Component | Type | Description |
|---|---|---|
| Cold Open | Screen only | Full-viewport multiple + verdict reveal |
| 30-Second Card | Both | 2x2 metric grid — the screenshot moment |
| Revenue Donut | Both | SVG donut — where every dollar goes, with per-dollar legend |
| Margin Ruler | Both | Horizontal bar with breakeven marker + dollar gap |
| TransitionBridge | Screen only | Italic narrative connectors between sections |

### PDF Export (5 pages, zero upsell)
1. Executive Summary — title, 2x2 metrics, verdict, "The Deal" prose
2. Revenue Allocation — SVG donut, per-dollar table, erosion bar
3. The Waterfall — tier cards, net profit, "The Margin" prose, margin ruler
4. Capital Stack + Scenarios — "The Structure" prose, sources, stress test, assumptions
5. Back Page — "Prepared using FILMMAKER.OG" + date + URL

PDF branding: FILMMAKER.OG header, gold bar, watermark, and filmmakerog.com footer on every page. No upsell. No gate cards.

---

## 8. PAGE NOTES

### Calculator (Calculator.tsx)
- 780px max-width, matches landing page
- ChapterCard headers with gold accent bars
- WaterfallDeck uses its own FONT constant — aligned with system where possible

### Store (Store.tsx)
- 780px max-width
- FAQ section wrapped in standard container (not floating on void)
- Featured product card may use glassmorphic variant
- Price text: Bebas Neue in gold

### Resources (Resources.tsx)
- Glass hero card with "Resource Vault" title
- Sticky command center (search + filter)
- Vault cards with expandable detail

### Auth (Auth.tsx) + Info Pages
- White input fields for forms
- Standard container patterns
- Minimal, functional

---

## 9. HOVER / INTERACTION CLASSES (CSS)
| Class | Effect | Where |
|---|---|---|
| `cta-gold-btn` | Hover brightens to `#FBE88A` | All CTA buttons |
| `wf-card` | Hover lifts `translateY(-2px)` + enhanced shadow | Waterfall tier cards |
| `preview-card` | Hover lifts + gold border brightens | Product preview cards |
| `preview-scroll` | Horizontal scroll mobile, wrap on 640px+ | Preview card container |
| `scroll-thread` | Hidden mobile, visible 840px+ | Scroll progress gold line |
| `grain-surface` | SVG noise overlay at 0.035 opacity | All section containers |

---

## 10. FILES THAT IMPLEMENT THIS SYSTEM
| File | Role |
|---|---|
| `src/lib/tokens.ts` | Color functions and hex constants (single source of truth) |
| `src/index.css` | Global styles, keyframes, hover classes, desktop ambient glow |
| `src/pages/Index.tsx` | Landing page (reference implementation) |
| `src/components/AppHeader.tsx` | Pill nav |
| `src/components/LeadCaptureModal.tsx` | Lead capture with white inputs |
| `src/components/calculator/WaterfallDeck.tsx` | Waterfall output (~2890 lines) |
| `api/_pdf-template.ts` | PDF export template (5-page branded document) (~659 lines) |
| `src/components/OgBotFab.tsx` | Floating action button (gold gradient, border) |
| `BRAND_SYSTEM.md` | This document |

---

*"The tool speaks for itself."*
