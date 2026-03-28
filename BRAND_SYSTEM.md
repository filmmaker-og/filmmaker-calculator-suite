# FILMMAKER.OG — Brand System

**Version:** 1.0
**Last updated:** March 27, 2026
**Source of truth for:** Every page, component, and visual decision in the product.

This document codifies every design decision proven on the landing page (`feature/hero-calculator` branch). When building or reskinning any page, reference this file — not memory, not other pages. If a decision isn't in here, it hasn't been made yet.

---

## 1. COLOR

### The Rule
Gold + black + white. That's it. Every other color is semantic (communicates data) or an earned exception.

### Backgrounds
| Token | Hex | Use |
|---|---|---|
| `BG.void` | `#000000` | Page wrappers, true black canvas |
| `BG.elevated` | `#0A0A0A` | Cards, modals, elevated surfaces |
| `BG.surface` | `#1A1A1A` | Input fields, form backgrounds |

Use `#000` for the page. Use `#0A0A0A` for everything that sits on top of it. Never use `#111`, `#121212`, or any other gray — only the three above.

### Gold — The Brand Color
| Token | Value | Use |
|---|---|---|
| `GOLD` | `#D4AF37` | Borders, icons, dividers, brand elements |
| `CTA` / `#F9E076` | CTA Gold | **Exclusively** for clickable elements (buttons, links) |
| `gold(0.15)` | `rgba(212,175,55,0.15)` | Card borders (default) |
| `gold(0.25)` | `rgba(212,175,55,0.25)` | Active/hover borders |
| `gold(0.40)` | `rgba(212,175,55,0.40)` | Eyebrow ruled lines, strong accents |
| `gold(0.08)` | `rgba(212,175,55,0.08)` | Background tints |
| `gold(0.03)` | `rgba(212,175,55,0.03)` | Ghost/ambient fill |

**The two-gold rule:** If it's not clickable, it's not `#F9E076`. Metallic gold (`#D4AF37`) is for brand elements. CTA gold is for buttons and links only.

### Semantic Colors
| Color | Hex | Meaning |
|---|---|---|
| Green | `#3CB371` | Positive, funded, profit, success |
| Red | `#DC2626` | Negative, deductions, danger, error |
| Amber | `#F0A830` | Partial, warning, caution |

These appear **only** when communicating data — waterfall tiers, profit/loss, status badges. Never decorative.

### Purple — The Exception
| Token | Value | Where it lives |
|---|---|---|
| `purple()` | `rgb(120,60,180)` | Waterfall tier number badges (01, 02, etc.) |
| | | Pill nav box-shadow (very subtle, `0.08` opacity) |

**That's it.** Purple does not appear in section headers, card backgrounds, atmospheric gradients, step badges, or dividers. Its scarcity is what makes the waterfall section distinctive.

### White — Text Hierarchy
| Role | Value | Use |
|---|---|---|
| Primary | `white(0.92)` or `#fff` | Headlines, primary text |
| Secondary | `white(0.75)` | Body text, descriptions |
| Muted | `white(0.55)` | Secondary descriptions |
| Tertiary | `white(0.40)` | Labels, metadata, placeholders |
| Ghost | `white(0.06)` | Dividers within cards, track backgrounds |

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

### Size Scale
| Element | Font | Size | Color | Notes |
|---|---|---|---|---|
| Hero headline | Bebas Neue | 4.2rem | `#fff` | Landing page hero only |
| Section headline | Bebas Neue | 3.2rem | `#fff` | One per section, gold accent on key word |
| Card title | Bebas Neue | 1.4–1.8rem | `#fff` | Inside cards |
| Data callout | Bebas Neue | 2.4–3.2rem | Semantic color | Large numbers (profit, totals) |
| Body | Inter | 16px | `white(0.75)` | All descriptions. Not 15px. Not 18px. |
| Body secondary | Inter | 14–15px | `white(0.60)` | Supporting text beneath body |
| Eyebrow label | Roboto Mono | 12px | `#D4AF37` | `letter-spacing: 0.18em`, uppercase |
| Slider/field label | Roboto Mono | 11px | `white(0.50)` | `letter-spacing: 0.08em`, uppercase |
| Badge/tag text | Roboto Mono | 10–11px | Varies | `letter-spacing: 0.06–0.08em`, uppercase |
| Footer text | Inter | 14px | `white(0.50)` | Disclaimer, legal |

### Rules
- Bebas Neue is always uppercase (it only has uppercase glyphs)
- Inter body text is always 16px with `line-height: 1.45–1.55`
- Roboto Mono labels are always uppercase with tracked letter-spacing
- Never use `font-weight: 700` on Bebas Neue (it only has 400)

---

## 3. COMPONENTS

### Card
The one card style used everywhere:
```css
background: #0A0A0A;
border: 1px solid rgba(212,175,55,0.15);
border-radius: 8px;
padding: 20–24px;
```
No radial gradients. No glassmorphism. No layered box-shadows. The border does the work.

**Variants:**
| Variant | Modification |
|---|---|
| Default | As above |
| Gold left accent | Add `border-left: 3px solid rgba(212,175,55,0.40)` |
| Semantic border | Replace gold border with semantic color (green/red/amber) at 0.20–0.25 opacity |
| Glassmorphic | Use **only** for 1–2 premium moments per page: `background: rgba(10,10,10,0.85); backdrop-filter: blur(20px)` |

### CTA Button
```css
background: #F9E076;
color: #000;
font-family: 'Bebas Neue', sans-serif;
font-size: 20px;
letter-spacing: 0.18em;
font-weight: 400;
text-transform: uppercase;
border-radius: 8px;
border: none;
padding: 18–22px 0;
display: block;
width: 100%;
text-align: center;
```
- One-shot shimmer animation (runs once on first view, not infinite)
- Idle glow pulse: `box-shadow` breathing at 4s cycle, very subtle
- Press state: `scale(0.98)` on mouseDown/touchStart
- Always full-width within its container

### Section Divider
```css
height: 1px;
max-width: 120px;
margin: 32px auto; /* or 48px after dense sections */
background: rgba(212,175,55,0.15);
```

### Eyebrow Ruled
Horizontal gold lines flanking a centered label:
```
──── gold line ──── LABEL TEXT ──── gold line ────
```
- Lines: `gold(0.40)`, 1px height
- Label: Roboto Mono, 12px, `#D4AF37`, `letter-spacing: 0.18em`, uppercase
- Gap: 12px between lines and label
- Margin-bottom: 14px

### Film Slate Line
Decorative horizontal line used **only** in hero and closer:
```css
height: 1px;
width: 60%;
margin: 0 auto;
background: rgba(212,175,55,0.12);
```

### Pill Nav (AppHeader)
- Max-width: 382px, height: 54px
- Background: `rgba(6,6,6,0.85)` with `backdrop-filter: blur(24px)`
- Border: `1px solid gold(0.35)`
- Border-radius: 12px
- Auto-hides on scroll down, reappears on scroll up
- z-index: 150
- Logo: "FILMMAKER" in gold, ".OG" in white, Bebas Neue 28px

### Footer
- Background: `#0A0A0A`
- Border-top: `1px solid white(0.08)`
- Social icons: gold at 0.50, 36px square with gold border at 0.15
- Nav links: Roboto Mono 13px, gold at 0.50
- Disclaimer: Inter 14px, white at 0.50
- "Best viewed in the dark." — Roboto Mono 11px, white at 0.35

---

## 4. MOTION

### Scroll Reveal (default entrance)
```typescript
opacity: 0 → 1
transform: translateY(16px) → translateY(0)
transition: 0.8s cubic-bezier(0.16, 1, 0.3, 1)
```
- Triggered once via IntersectionObserver, does not replay
- Staggered delays: `delay * 100ms` for sequential elements
- Always respect `prefers-reduced-motion` — skip to final state

### One-Shot Shimmer (CTA buttons)
```css
animation: lp-shimmer 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s 1;
```
Runs once after 0.5s delay. Does not loop.

### Stamp (waterfall tier amounts)
```css
@keyframes stamp {
  0% { transform: scale(1.08) translateX(2px); opacity: 0; }
  40% { transform: scale(1.02) translateX(-2px); opacity: 1; }
  70% { transform: scale(1) translateX(1px); opacity: 1; }
  100% { transform: scale(1) translateX(0); opacity: 1; }
}
```
Applied when tier cards enter viewport. One-shot.

### Typing Reveal (Reality blockquote)
- 35ms per character
- Blinking cursor (`|`) via CSS animation, disappears when complete
- One-shot, does not replay

### Count-Up (profit, split numbers)
- `requestAnimationFrame` with cubic ease-out
- Duration: 1200–1800ms
- Triggered once on IntersectionObserver

### Rules
- **No infinite animations** except the CTA idle glow (4s, barely perceptible)
- **No purple glow pulses, no breathing borders, no looping shimmers**
- Every animation earns its existence by communicating information or providing feedback
- Touch feedback: `scale(0.97–0.98)` on press, 80ms transition

---

## 5. LAYOUT

### Container
```css
max-width: 430px;
margin: 0 auto;
background: #000;
```
430px is the product viewport. Desktop renders the same column centered on black. This is intentional, not a responsive compromise.

### Section Padding
| Context | Padding |
|---|---|
| Standard section | `48px 24px 0` top/sides/bottom |
| Dense section (waterfall) | `0 24px 0` (let content density speak) |
| Closer section | `64px 24px 24px` (extra top space for breathing) |
| Cards within sections | `margin: 0 24px` (align with section padding) |

### Spacing Between Sections
- Standard: 32px (via section divider margin)
- After dense sections (waterfall): 48px
- Before footer: 40px margin-top

### Scroll Progress Gold Thread
- 2px wide, fixed to left edge of 430px column
- `background: linear-gradient(180deg, gold(0.40), gold(0.10))`
- Grows from 0% to 100% height as user scrolls
- Hidden when footer is visible
- z-index: 50

### Desktop Ambient Glow
```css
@media (min-width: 768px) {
  body::before { /* purple, top-left, 400px, blur 120px, 0.06 opacity */ }
  body::after  { /* gold, bottom-right, 350px, blur 120px, 0.04 opacity */ }
}
```
Barely visible — just enough to prevent the desktop from feeling like pure void.

---

## 6. FORM INPUTS

### Lead Capture Modal
- Modal background: `#000` with `1px solid gold(0.15)`, 6px radius
- Gold accent line at top: `linear-gradient(90deg, transparent, #D4AF37, transparent)`
- Input fields: **white background** (`rgba(255,255,255,0.95)`), black text, 4px radius
- Focus state: gold border (`#D4AF37`) with `0 0 0 3px gold(0.15)` ring
- Placeholder text: `rgba(0,0,0,0.40)`
- Submit button: uses standard CTA button style

### Calculator Inputs
- Background: `BG.surface` (`#1A1A1A`)
- Border: `1px solid white(0.15)`
- Focus: gold border + gold shadow ring
- Font: Roboto Mono, 22px, right-aligned
- These stay dark because they're part of the product UI, not a conversion form

### Sliders
- Track: 6px height, `white(0.08)` background, 3px radius
- Thumb: 22px gold circle (styled in index.css)
- Labels: Roboto Mono 11px uppercase on left, Bebas Neue 1.2rem gold value on right

---

## 7. WATERFALL TIER COLORS

When displaying waterfall tiers by group, use these border/topline colors:

| Group | RGB | Use |
|---|---|---|
| Off-the-Tops | `240,168,48` (amber) | Border, topline, amount text |
| Sales Agency | `220,120,48` (orange-red) | Border, topline, amount text |
| Debt Service | `220,38,38` (red) | Border, topline, amount text |
| Equity & Deferments | `120,60,180` (purple) | Border, topline, amount text |

Tier number badges are always purple gradient circles regardless of group.

---

## 8. PAGE-SPECIFIC NOTES

### Landing Page (Index.tsx)
- Interactive hero with sliders — the product IS the marketing
- No "How It Works" section (hero demonstrates it)
- No "Arsenal" checklist (features become badge pills)
- Sections: Hero → Waterfall → Social Proof → What's At Stake → Reality → Closer → Product Preview → Footer

### Calculator (Calculator.tsx)
- **Stress-test target for this system.** If the card style works here with dense data tables, it works everywhere.
- Chapter cards with gold accent bars may need a documented exception for the numbered header pattern
- The WaterfallDeck output uses its own locked type system (FONT constant) — align with this guide where possible, document exceptions where not

### Store (Store.tsx)
- Featured product card may use glassmorphic variant
- Price text: Bebas Neue in gold
- Comparison table: maintain current structure, apply flat card style

### Auth (Auth.tsx)
- White input fields (same as LeadCaptureModal)
- Minimal — logo, form, done

### Info Pages (BudgetInfo, CapitalInfo, FeesInfo, WaterfallInfo)
- Template pages — same structure, different content
- Use flat cards for content sections
- Eyebrow + headline pattern for each section
- Body text at 16px Inter

### Resources (Resources.tsx)
- Tab-based layout
- Content cards use standard flat card style
- Educational content at 16px Inter, generous line-height

### Glossary (Glossary.tsx)
- Alphabetical list — simplest page
- Term: Bebas Neue 1.4rem
- Definition: Inter 16px

---

## 9. WHEN TO DEVIATE

Not every element will fit the system perfectly. Document exceptions here rather than silently breaking rules.

**Current documented exceptions:**
- Waterfall tier cards use group-specific border colors instead of standard gold
- WaterfallDeck output component has its own type scale (FONT constant) — this predates the system and will be aligned incrementally
- Pill nav uses glassmorphism — this is the one persistent glass element
- Calculator chapter card headers use a gold accent bar + numbered grid layout — this is a product pattern, not a brand violation

**Rule for new exceptions:** If a component needs to break a rule, add it to this list with a one-line reason. If the list grows past 10 items, the system needs to evolve.

---

## 10. IMPLEMENTATION PRIORITY

Apply this system to pages in this order:

1. **Calculator** — highest usage, stress-test for the system
2. **Store / StorePackage** — revenue page, must feel premium
3. **Auth** — first impression after CTA, should feel seamless
4. **Resources** — content page, straightforward reskin
5. **Info pages** (Budget, Capital, Fees, Waterfall) — similar template, batch them
6. **Glossary** — simplest page, lowest priority

---

## 11. FILES THAT IMPLEMENT THIS SYSTEM

| File | Role |
|---|---|
| `src/lib/tokens.ts` | Color functions and hex constants (single source of truth for colors) |
| `src/index.css` | Global styles, keyframes, base typography, desktop ambient glow |
| `src/pages/Index.tsx` | Landing page (reference implementation of the system) |
| `src/components/AppHeader.tsx` | Pill nav |
| `src/components/LeadCaptureModal.tsx` | Lead capture with white inputs |
| `BRAND_SYSTEM.md` | This document |

---

*"The tool speaks for itself."*
