# FILMMAKER.OG — Brand System

**Version:** 4.0
**Last updated:** March 29, 2026
**Source of truth for:** Every page, component, and visual decision in the product.

When building or reskinning any page, reference this file — not memory, not other pages. If a decision isn't in here, it hasn't been made yet.

---

## 1. COLOR

### The Rule
Gold + black + warm white. That's it. Every other color is semantic (communicates data) or an earned exception. No purple anywhere.

### Surface Hierarchy — Three-Step Depth System
| Token | Value | Use |
|---|---|---|
| Page (Void) | `#141416` | `<body>` background — lifted from pure black to eliminate OLED halation. Warm gradient overlay: `#141416 → #151517 → #141416` |
| Section Wrapper | `#222226` | The "stage" — lighter slate that clearly lifts off the void. `border-radius: 8px` |
| Inner Well | `#141416` | Near-black — content recessed into the wrapper like a shadow box |
| Header Band | `linear-gradient(180deg, rgba(212,175,55,0.08), #141416)` | First child inside every wrapper — warm gold gradient fading to dark well. `inset 0 2px 6px` shadow. |
| Inner Card | `linear-gradient(180deg, rgba(212,175,55,0.03), #141416)` | Content cards inside sections — subtle gold warmth |

The wrappers (#222226) are the brightest layer. Inner wells (#141416) are recessed below them. Gold, green, and red pop against the near-black wells. Section wrappers use white structural borders (`rgba(255,255,255,0.10-0.18)`), not gold.

Deprecated values (do not use): `#000`, `#111`, `#0C0C0E` (old void — caused halation), `#121214` (old inner well), `#1A1A1C` (old container), `#1E1E20`, `#232326` (old surface), `#242428`.

### Gold — The Brand Color
| Token | Value | Use |
|---|---|---|
| `GOLD` | `#D4AF37` | Borders, icons, dividers, brand elements |
| `CTA` / `#F9E076` | CTA Gold | **Exclusively** for clickable elements (buttons, links) |
| `gold(0.08)` | Header band gradient top, background tints |
| `gold(0.12)` | EyebrowPill background, waterfall subtitle highlight |
| `gold(0.18)` | Badge backgrounds (wfBadge, stakes circles) |
| `gold(0.22)` | Section dividers, feature badge borders |
| `gold(0.30)` | EyebrowPill border |
| `gold(0.40)` | Badge borders, testimonial left accent |
| `gold(0.70)` | Waterfall connector lines |

**The two-gold rule:** If it's not clickable, it's not `#F9E076`. Metallic gold (`#D4AF37`) is for brand elements. CTA gold is for buttons and links only.

### Semantic Colors (OLED-Desaturated)
| Color | Hex | Meaning |
|---|---|---|
| Green | `#4DAF78` | Positive, funded, profit, success |
| Red | `#C84040` | Negative, deductions, danger, error |
| Amber | `#F0A830` | Partial, warning, caution |

Colors are desaturated ~15% from their original values (`#3CB371`, `#DC2626`) to reduce optical vibration on OLED panels with dark backgrounds. These appear **only** when communicating data — waterfall tiers, profit/loss, status badges. Never decorative.

### Purple — ELIMINATED
Purple has been fully removed from the codebase. Waterfall tier number badges are now gold-rimmed white circles. No purple gradients, shadows, or accents exist anywhere.

### White — Text Hierarchy (Warm)
Body text uses warm-white (`rgba(250,248,244,...)`) not cold-white (`rgba(255,255,255,...)`). Labels and mono text stay cold-white for crispness.

| Role | Value | Use |
|---|---|---|
| Headlines | `#fff` or `white(0.95)` | Section headlines, hero headline |
| Body (primary) | `rgba(250,248,244,0.90-0.92)` | Testimonials, closer body, WITH column |
| Body (standard) | `rgba(250,248,244,0.85)` | All Inter body text, stakes body, descriptions |
| Labels (bright) | `rgba(250,248,244,0.80)` | Total Deductions label, important metadata |
| Labels | `rgba(255,255,255,0.80)` | Slider labels (14px), REMAINING, Estimated Net Profit (cold-white) |
| Tertiary | `rgba(250,248,244,0.65-0.75)` | Swipe indicator, ready-to-model text |
| Footer | `rgba(255,255,255,0.65)` | Footer text, disclaimers |
| Easter egg | `rgba(255,255,255,0.45)` | "Best viewed in the dark." — decorative only |

**Opacity floor:** No text intended to be read may go below `0.65` (OLED-hardened floor, raised from 0.60). Below that is decorative only.

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
| Slider/field label | Roboto Mono | 14px | `white(0.80)` | uppercase, `0.06em` tracking |
| Badge/tag text | Roboto Mono | 11px minimum | Varies | `letter-spacing: 0.06–0.08em`, uppercase |
| Footer text | Inter | 14px | `white(0.65)` | Disclaimer, legal |

### Rules
- Bebas Neue is always uppercase (it only has uppercase glyphs)
- Inter body text is always 16px with `line-height: 1.6`
- Roboto Mono labels are always uppercase with tracked letter-spacing
- Never use `font-weight: 700` on Bebas Neue (it only has 400)
- Use `clamp()` for responsive sizing on headlines

---

## 3. COMPONENTS

### Section Wrapper
```css
background: #222226;
border: 1px solid rgba(255,255,255,0.10);
border-top: 1px solid rgba(255,255,255,0.18);
border-radius: 8px;
padding: 36px clamp(24px, 5vw, 40px);
box-shadow: 0 6px 28px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.04), 0 0 1px rgba(212,175,55,0.06);
```
Add `className="grain-surface"`. First child is always a **Header Band**. Borders are white structural — gold reserved for accents only.

### Header Band (Inner Well)
First child inside every Section Wrapper:
```css
background: linear-gradient(180deg, rgba(212,175,55,0.08), #121214);
border: 1px solid rgba(255,255,255,0.06);
border-top: 1px solid rgba(255,255,255,0.10);
border-radius: 6px;
padding: 28px 24px;
margin-bottom: 20px;
text-align: center;
box-shadow: inset 0 2px 6px rgba(0,0,0,0.25);
```
Closer header band uses `rgba(212,175,55,0.08)` with `border-top: 0.12` — slightly brighter for CTA emphasis.

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
- Background: `#181819`
- Border-top: `1px solid rgba(212,175,55,0.15)`
- Social icons: gold at 0.50, 36px square with gold border at 0.20
- Nav links: Roboto Mono 13px, gold at 0.60
- Disclaimer: Inter 14px, white at 0.65
- "Best viewed in the dark." — Roboto Mono 11px, white at 0.45

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
3. **Waterfall** — Full 10-tier money flow with running balance counter
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
1. Executive Summary — title, genre, logline, team grid (Director, Writer, Producers, Production Co., Cast, Location), 2x2 metrics, supplementary row (Break-Even, Cash Basis, Investor ROI), 4-6 sentence executive summary prose
2. Revenue Allocation — bridge line, SVG donut, per-dollar table, erosion bar with external labels
3. The Waterfall — bridge line, tier cards, net backend profit bar, waterfall narrative (3-4 sentences), gold break, margin prose (italic), margin of safety ruler
4. Capital Structure + Scenarios — structure prose, capital sources table, bridge line, scenario stress test (variable + fixed off-top separation), scenario interpretation (2-3 sentences), assumptions table
5. Back Page — project title, gold divider, "MODEL YOUR WATERFALL BEFORE YOU SIGN." headline, value prop, FILMMAKER.OG brand mark, URL, date

PDF branding: FILMMAKER.OG header, gold bar, watermark, and filmmakerog.com footer on every page. No upsell. No gate cards.

### PDF Prose Rules
- All prose is generated from deal data — zero fabrication, zero filler
- Bridge lines are italic, at `rgba(250,248,244,0.60)` (opacity floor)
- No readable text below 0.60 opacity (footer page numbers are decorative)
- Minimum font size: 8px (for labels and metadata)
- Team grid includes `writers` field (serialized from intake, renders if present)

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
| `grain-surface` | SVG noise overlay at 0.035 opacity (mobile: 0.06) | All section containers |

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
| `api/_pdf-template.ts` | PDF export template (5-page narrative document) (~749 lines) |
| `docs/deal-insight-edge-function.md` | Documentation for external AI insight edge function |
| `src/components/OgBotFab.tsx` | Floating action button (gold gradient, border) |
| `BRAND_SYSTEM.md` | This document |

---

## 11. OLED & MOBILE READABILITY (March 29, 2026)

Modern OLED phones (Pixel 9, iPhone 15 Pro, Galaxy S24+) dynamically adjust contrast and brightness. These optimizations ensure the page renders consistently across all display processing.

### Why These Changes Were Made
- **Background lift (`#0C0C0E` → `#141416`):** OLED pixels at near-black have slower response times than at dark-gray. When scrolling, white text on near-black creates a visible ghost/smear trail (halation). Lifting the base gives pixels a head start, eliminating the effect. Costs only 0.3% more battery.
- **Color desaturation (~15%):** Saturated green/red on dark backgrounds creates optical vibration (a buzzing effect that causes eye fatigue). OLED auto-contrast amplifies this further.
- **Text opacity floors raised:** OLED dynamic contrast crushes low-opacity text. In direct sunlight with auto-brightness maxed, `0.55` opacity text becomes invisible. Floor raised to `0.65` for all readable text.
- **`color-scheme: dark` meta tag:** Tells the OS-level contrast engine to treat the page as natively dark, preventing the browser from applying its own contrast corrections on top of ours.
- **`dynamic-range: high` media query:** Detects HDR OLED panels and scales down glow intensities so gold gradients don't blow out on high-nit displays.
- **Static glow orbs:** Replaced `filter: blur(40-50px)` runtime blur with pre-blurred multi-stop radial gradients. Identical visual result, zero per-frame GPU cost.
- **Grain overlay mobile bump:** OLED's infinite contrast makes 4% opacity grain invisible. Bumped to 6-7% on mobile for tactile texture.
- **Inter Variable with `font-optical-sizing: auto`:** Automatically thickens strokes at small sizes, refines them at large sizes.
- **`-webkit-font-smoothing: antialiased`:** Prevents subpixel rendering that causes color fringing on OLED PenTile subpixel layouts.
- **SVG check/cross icons:** Replaced Unicode ✓/✗ characters which render inconsistently across Android and iOS with inline SVGs.
- **`content-visibility: auto` on waterfall section:** Skips rendering of off-screen tier cards until scroll-near, improving initial paint.

### CSS Media Queries Added
```css
@media (dynamic-range: high) { /* Tame glows on HDR OLED */ }
@media (prefers-reduced-motion: reduce) { /* Kill ALL animations globally */ }
@media (max-width: 767px) { /* Mobile grain + blur reductions */ }
```

### Minimum Sizes (OLED-Hardened)
- Body text: 16px
- Slider labels: 14px (was 12px)
- Card header labels: 11px minimum (was 9-10px)
- Badge/tag text: 11px minimum
- No readable text below 0.65 opacity

---

*"The tool speaks for itself."*
