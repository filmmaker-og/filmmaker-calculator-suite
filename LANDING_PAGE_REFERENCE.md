# filmmaker.og — Landing Page Reference Guide

**Source of truth:** `src/pages/Index.tsx` (1,088 lines, v16.4, commit d293e0e)
**Last extracted:** March 21, 2026
**Purpose:** The landing page is the most iterated, most polished surface in the product. Every pattern documented here was built through 16+ major versions and hundreds of micro-decisions. When building or updating ANY page in the application, use this document as the canonical reference for how things should look, feel, and behave.

---

## 1. PAGE ARCHITECTURE

### Container

```
maxWidth: 430px
margin: 0 auto
background: #000
paddingTop: 32px
```

The page is a single vertical column on true black. 430px is the product viewport — not a responsive compromise. Desktop renders the same column centered on black. All content lives inside this container.

### Section Stack (render order)

```
PILL NAV (fixed, floating — rendered by AppHeader)
§1  HERO — primary CTA card
    ── section divider ──
§2  HOW IT WORKS — 5-step vertical stepper
    ── section divider ──
§3  WATERFALL — card-based money flow
    ── section divider ──
§4  WHY THIS MATTERS — 4 badge cards
    ── section divider ──
§5  ARSENAL — Snapshot feature card
    ── section divider ──
§6  REALITY — blockquote + WITH/WITHOUT grid
    ── section divider ──
§7  CLOSER — final CTA card
FOOTER
```

### Section Divider (reusable pattern)

Every section is separated by the same 3px gradient bar:

```tsx
<div style={{
  height: "3px",
  background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)",
  boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)",
  margin: "0 24px",
}} />
```

This is the purple-gold-purple gradient with purple glow. It appears between every major section. The `margin: 0 24px` insets it from the container edges.

### Section Canopy (atmospheric top gradient)

Most sections have an atmospheric gradient at the top — a purple radial that creates depth:

```tsx
<div style={{
  position: "absolute", top: 0, left: 0, right: 0,
  height: "200px",  // varies: 180-240px by section
  background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)",
  pointerEvents: "none",
  zIndex: 0,
}} />
```

Opacity varies by section importance: 0.20 standard, 0.22 for Why, 0.25 for Arsenal. Height varies: 200px standard, 180px for Reality (tighter), 240px for Arsenal (more dramatic).

---

## 2. TYPOGRAPHY — Complete Scale

### Font Families (3 only)

| Font | Import | Assignment |
|------|--------|------------|
| `'Bebas Neue', sans-serif` | Google Fonts | Display headlines, section titles, card labels, CTA text |
| `'Inter', sans-serif` | Google Fonts | Body text, descriptions, feature lists |
| `'Roboto Mono', monospace` | Google Fonts | Eyebrow labels, data labels, CTA buttons, reassurance text, footer nav |

**Rule:** Never mix fonts within a single text element. Never use fonts outside these three.

### Complete Font Size Scale (22 distinct sizes)

**Display tier (Bebas Neue):**

| Size | Role | Where |
|------|------|-------|
| `4.2rem` | Hero h1 | Hero headline "Model Your Recoupment Waterfall" |
| `3.4rem` | Closer h2 | Closer headline "Your Investors Will Ask." |
| `3.2rem` | Section h2 | How/Waterfall/Why/Arsenal section headlines |
| `3rem` | Profit amount | Net Backend Profit count-up |
| `2.4rem` | Total deducted | Total Off The Top amount |
| `2.2rem` | Blockquote | Reality blockquote text |
| `2rem` | — | (available in scale, not currently used on landing page) |
| `1.8rem` | Card titles | Badge card titles, step titles, value statement, split amounts |
| `1.6rem` | Group labels | Waterfall group labels, badge nums, context card amounts, check header text |
| `1.5rem` | Hero sub / tax credit | Hero subtitle, context pair secondary amounts |
| `1.4rem` | Feature group names | Snapshot feature group headers (Model / Analyze / Share) |
| `1.3rem` | Pair card names | Waterfall tier names, split card labels |
| `1.1rem` | Context card labels | "Production Budget" / "Tax Credit (20%)" labels |
| `0.95rem` | Tier badge nums | Small tier badge numbers (01-08) |

**Body tier (Inter):**

| Size | Role | Where |
|------|------|-------|
| `18px` | Primary body | Step descriptions, badge card bodies, section subs, closer body, feature list items, check cell text, arsenal sub, waterfall explainer |
| `16px` | Secondary body / check text | Eyebrow label (Roboto Mono), check grid cell text |
| `14px` | Compact | Footer text, footer dots |
| `13px` | Small labels | CTA reassurance (Roboto Mono), footer nav links (Roboto Mono) |

**Data/UI tier (Roboto Mono):**

| Size | Role | Where |
|------|------|-------|
| `24px` | Check icons | ✓ and ✗ symbols |
| `20px` | Feature checkmarks | Green checkmarks in Snapshot card |
| `18px` | CTA button text | "RUN MY WATERFALL" button label |
| `16px` | Eyebrow labels | Ruled eyebrow text ("The Process", "How the money flows", etc.) |
| `15px` | Store eyebrows | (Store variant, slightly smaller) |
| `13px` | Reassurance text | "No Credit Card · Instant Results" |
| `11px` | Summary bar labels | "Remaining" / "Deducted" labels |

### Letter Spacing Scale (8 values)

| Value | Use |
|-------|-----|
| `0.01em` | Hero h1 (very tight for giant display) |
| `0.02em` | Acquisition amount, badge titles, blockquote |
| `0.04em` | Waterfall group labels, check header text |
| `0.06em` | Feature group names (Model/Analyze/Share) |
| `0.08em` | Summary bar labels |
| `0.10em` | Footer nav links |
| `0.12em` | CTA buttons, reassurance text |
| `0.18em` | Eyebrow ruled labels |

**Pattern:** Tracking widens as text gets smaller and more functional. Display headlines: tight (0.01-0.02em). Structural labels: wide (0.12-0.18em).

### Line Height Scale (9 values)

| Value | Use |
|-------|-----|
| `0.86` | Hero h1 (ultra-tight stacked display) |
| `0.95` | Section h2s, closer h2 |
| `1.0` | Single-line amounts, badge titles, blockquote |
| `1.05` | Badge titles |
| `1.1` | Hero subtitle |
| `1.3` | Feature list items |
| `1.4` | Check cell text |
| `1.5` | Data labels |
| `1.55` | Body text (steps, badges, closer, waterfall explainer, footer) |

**Pattern:** Display text packs tight (0.86-0.95). Body text breathes (1.4-1.55).

---

## 3. COLOR SYSTEM — As Shipped

### Hex Solids (5 only)

| Color | Hex | Role |
|-------|-----|------|
| True Black | `#000` | Page background, section backgrounds |
| Near-Black | `#0A0A0A` | Footer background |
| Gold | `#D4AF37` | Brand color — text accents, icons, eyebrow labels |
| Green | `#3CB371` | Profit, positive values, checkmarks, tax credit |
| White | `#fff` | Headlines, primary text |

### Glass (the elevated surface material)

```
background: rgba(6,6,6,0.92)
backdropFilter: blur(40px)
WebkitBackdropFilter: blur(40px)
```

Used on: Hero card, Closer card, Blockquote, Context pair cards. This is the primary surface material for any card that "floats."

### Purple Gradient (interaction/premium color)

**Solid gradient (CTAs, badges):**
```
background: linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)
```

**Accent/glow reference point:** `rgb(120,60,180)` — used in all rgba purple values.

Purple is NOT a hex constant. It lives as `rgba(120,60,180,opacity)` or as the CTA gradient.

### Complete RGBA Census (Index.tsx)

**Gold — rgba(212,175,55,X) — 14 distinct opacities:**

| Opacity | Count | Primary Use |
|---------|-------|-------------|
| 0.08 | — | Gold subtle tier, radial bg stops |
| 0.10 | — | Card glow boxShadow, blockquote atmospheric |
| 0.12 | — | Arsenal card ambient glow |
| 0.15 | — | Gold medium tier, borders, gradient stops, blockquote bg |
| 0.18 | — | Hero glow overlay |
| 0.20 | — | Hero card border, feature separators, context card border, acquisition glow |
| 0.22 | — | Hero glow overlay (top radial) |
| 0.25 | — | Gold strong tier, acquisition card border, CTA ring, blockquote border, reality grid footer |
| 0.30 | — | Context pair card border, blockquote topline shadow |
| 0.35 | — | Topline gradient stops, divider gradient stops |
| 0.40 | — | Eyebrow ruled lines, divider midpoint, blockquote topline |
| 0.45 | — | Snapshot gradient border stop |
| 0.50 | — | Hero gold text-shadow, eyebrow ruled line, Snapshot topline, divider midpoint |
| 0.55 | — | Closer card border |
| 0.60 | — | Hero gold em text-shadow, closer gold text-shadow, footer hover |
| 0.65 | — | CTA reassurance text |

**Purple — rgba(120,60,180,X) — 14 distinct opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.10 | Stepper container bg |
| 0.15 | Stepper container glow, section canopy base, badge grid bg, closer glow, eyebrow glow, reality bottom canopy, blockquote bottom atmospheric |
| 0.16 | Hero glow (center bridge) |
| 0.18 | How header bg, badge card warmth base, blockquote bottom atmospheric |
| 0.20 | Section canopies (standard), divider gradient, closer bottom glow, reality top canopy |
| 0.22 | Why section canopy (warmer), closer bottom glow |
| 0.25 | Stepper container border, Arsenal canopy (warmest), badge grid border |
| 0.28 | Step num column radial |
| 0.30 | Divider gradient stops, reality grid border |
| 0.35 | Divider boxShadow |
| 0.40 | CTA boxShadow, divider gradient stops |
| 0.50 | Divider gradient peaks, step badge boxShadow, tier badge boxShadow |
| 0.55 | Badge num boxShadow |
| 0.60 | Step line gradient start |

**Red — rgba(220,38,38,X) — 12 distinct opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.08 | Check cell right radial bg |
| 0.10 | Deduction cards boxShadow glow |
| 0.12 | Check header without border |
| 0.15 | Waterfall card radial bg, Total Off The Top radial |
| 0.20 | Tier card boxShadow, red connector boxShadow, profit count-up text-shadow |
| 0.25 | Waterfall card border, Total card border, red connector boxShadow (strong) |
| 0.30 | Total topline gradient |
| 0.35 | Waterfall topline gradients |
| 0.50 | Red connector lines, deducted bar, deducted label, check header topline |
| 0.60 | Red-strong connector |
| 0.70 | Check header WITHOUT text |
| 0.85 | Total deducted amount text |
| 0.88 | Tier amount text |

**Green — rgba(60,179,113,X) — 12 distinct opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.10 | Tax credit context radial bg |
| 0.12 | Check cell left radial bg |
| 0.15 | Split card radial bg |
| 0.18-0.28 | Profit card glow (animated: resting 0.18, pulse 0.28) |
| 0.20 | Check header WITH border |
| 0.25 | Green checkmark text-shadow (inner), tax credit text-shadow, split card text-shadow, green connector boxShadow |
| 0.30 | Profit topline boxShadow, green connector boxShadow |
| 0.35 | Profit text-shadow |
| 0.40 | Tax credit topline gradient |
| 0.50 | Profit card border, split card border, remaining bar, remaining label, checkmark text-shadow (outer) |
| 0.55 | Green connector lines |
| 0.60 | Check header topline, checkmark text-shadow (innermost) |

**White — rgba(255,255,255,X) — 7 distinct opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.06 | Inset top-edge highlights, summary bar bg, check grid internal bg |
| 0.08 | Check grid row backgrounds, check grid internal borders |
| 0.12 | Footer top border |
| 0.35 | CTA shimmer brightness |
| 0.48 | Footer disclaimer text |
| 0.70 | Context card labels |
| 0.88 | Body text (steps, badges, section subs, closer body, split labels, feature items) |
| 0.90 | Feature list items (fontWeight 500) |

**Black — rgba(0,0,0,X) — 6 distinct opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.4 | Split card boxShadow |
| 0.5 | Waterfall card boxShadow, context card boxShadow, blockquote boxShadow, badge grid boxShadow, Total boxShadow, profit boxShadow |
| 0.6 | Hero boxShadow, stepper boxShadow, badge grid boxShadow |
| 0.8 | Hero text-shadow, closer body text-shadow, closer boxShadow |
| 0.9 | Hero text-shadows (secondary) |
| 0.95 | Hero h1 primary text-shadow |

---

## 4. SURFACE SYSTEM — Card Archetypes

Every card on the landing page uses one of these archetypes. When building new sections, pick the closest archetype and adapt.

### Archetype A: Glass Feature Card (Hero, Closer)

The hottest surface. Reserved for CTA-carrying sections.

```tsx
{
  position: "relative",
  textAlign: "center",
  overflow: "hidden",
  borderRadius: "12px",
  background: "rgba(6,6,6,0.92)",       // glass material
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid rgba(212,175,55,0.20)",  // hero: 0.20, closer: 0.55
  boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)",
}
```

**Plus atmospheric overlay** — a separate div covering the card:
```tsx
// Hero: 3-layer radial (gold top, purple center bridge, purple bottom)
background: "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(212,175,55,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(120,60,180,0.16) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 50% 100%, rgba(120,60,180,0.20) 0%, transparent 60%)"

// Closer: 2-layer radial (gold top, purple bottom)
background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 60%), radial-gradient(ellipse 90% 60% at 50% 100%, rgba(120,60,180,0.22) 0%, transparent 65%)"
```

Hero uses `margin: 0 24px` + `padding: 24px 24px 16px`. Closer uses `margin: 0 24px 28px` + `padding: 32px 24px 40px` (asymmetric — tight top, generous bottom for CTA breathing room).

### Archetype B: Glass Content Card (Blockquote, Context Pair Cards)

Mid-temperature glass. Used for featured content that isn't a CTA.

```tsx
{
  position: "relative",
  overflow: "hidden",
  borderRadius: "12px",
  border: "1px solid rgba(212,175,55,0.25-0.30)",
  background: "radial-gradient(circle at 50% 24px, rgba(212,175,55,0.15) 0%, transparent 55%), rgba(6,6,6,0.92)",
  backdropFilter: "blur(20px)",             // lighter blur than feature cards
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 12px rgba(212,175,55,0.08)",
}
```

Context pair cards add a topline: `position absolute, top 0, height 2px, linear-gradient(90deg, transparent, color, transparent)`.

### Archetype C: Deduction Card (Waterfall Tier Cards)

Red-themed glass with purple badges. Used for financial deduction items.

```tsx
{
  position: "relative",
  overflow: "hidden",
  borderRadius: "12px",
  background: "radial-gradient(circle at 50% 40px, rgba(220,38,38,0.15) 0%, transparent 60%), rgba(6,6,6,0.92)",
  border: "1px solid rgba(220,38,38,0.25)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 16px rgba(220,38,38,0.10)",
}
```

Pair layout: `padding: 10px 8px`. Full layout: `padding: 12px 16px`.

Each card has: red topline, purple radial glow overlay (`wfBadgeGlow`), purple gradient circular badge.

### Archetype D: Profit/Positive Card (Net Profit, Split)

Green-themed glass. Used for positive outcomes.

```tsx
{
  position: "relative",
  overflow: "hidden",
  borderRadius: "12px",
  border: "1px solid rgba(60,179,113,0.50)",
  background: "radial-gradient(ellipse at 50% 0%, rgba(60,179,113,0.15-0.18) 0%, rgba(6,6,6,0.92) 70%)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 30px rgba(60,179,113,0.15)",
}
```

Profit card has animated glow: resting at 0.18, pulses to 0.28 on first view, transitions back over 600ms.

### Archetype E: Contained Grid (Stepper, Badge Grid, WITH/WITHOUT)

Cards that are really containers for grid-based sub-items. The container has a border and boxShadow; internal items are separated by 1px colored gaps.

```tsx
// Badge grid wrapper
{
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid rgba(120,60,180,0.25)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15)",
  position: "relative",
}

// Inner grid (items separated by color)
{
  display: "grid",
  gridTemplateColumns: "1fr",  // or "1fr 1fr" for WITH/WITHOUT
  gap: "1px",
  background: "rgba(120,60,180,0.15)",  // the gap color
}

// Individual items
{
  background: "radial-gradient(circle at 45px 57px, rgba(120,60,180,0.15) 0%, rgba(6,6,6,0.92) 65%)",
  padding: "36px 24px",
}
```

The `gap: "1px"` + colored grid `background` creates visible separators between items without explicit border elements.

### Archetype F: Gradient-Border Card (Snapshot/Arsenal)

Uses CSS mask technique for a gradient border effect:

```tsx
// Gradient border overlay (absolute positioned)
{
  position: "absolute", inset: 0,
  borderRadius: "12px",
  padding: "1px",
  pointerEvents: "none",
  background: "linear-gradient(180deg, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.18) 50%, rgba(212,175,55,0.30) 100%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
}

// Card body
{
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
  textAlign: "center",
  border: "none",  // no standard border — gradient replaces it
  background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, rgba(6,6,6,0.92) 70%)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 40px rgba(212,175,55,0.12), 0 0 20px rgba(120,60,180,0.15)",
}
```

### Top Line Treatment (universal pattern)

Almost every card has a glowing top line — a 1-2px gradient across the top edge:

```tsx
<div style={{
  position: "absolute", top: 0, left: 0, right: 0,
  height: "2px",  // or "1px" for subtler
  background: "linear-gradient(90deg, transparent, COLOR, transparent)",
  zIndex: 1,
}} />
```

Color matches the card's semantic color:
- Gold cards: `rgba(212,175,55,0.40-0.50)`
- Red cards: `rgba(220,38,38,0.35)`
- Green cards: `#3CB371` (solid) or `rgba(60,179,113,0.40)`
- Purple+gold combined: `linear-gradient(to right, transparent 0%, rgba(120,60,180,0.40) 20%, rgba(212,175,55,0.50) 50%, rgba(120,60,180,0.40) 80%, transparent 100%)`

---

## 5. COMPONENT PATTERNS

### EyebrowRuled (section opener)

Every section opens with this pattern. Centered mono label between two gold ruled lines:

```tsx
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "14px" }}>
  <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)", boxShadow: "0 0 8px rgba(212,175,55,0.15)" }} />
  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "16px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4AF37", whiteSpace: "nowrap" }}>
    {text}
  </span>
  <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)", boxShadow: "0 0 8px rgba(212,175,55,0.15)" }} />
</div>
```

Eyebrow labels used: "The Process", "How the money flows", "Why This Matters", "What you get"

### WaterfallConnector (vertical arrow between cards)

```tsx
<div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px" }}>
  {/* Line */}
  <div style={{
    width: "2px", height: "20px",
    background: COLOR_OR_GRADIENT,
    boxShadow: "0 0 8px rgba(COLOR,0.20-0.30)",
    borderRadius: "1px",
  }} />
  {/* Arrow triangle */}
  <div style={{
    width: 0, height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderTop: "6px solid ARROW_COLOR",
    marginTop: "-1px",
  }} />
</div>
```

Color transitions follow the money flow: gold → gold-to-red → red → red → red-strong → red-to-green → green → green.

Gradient connectors (transitions) use `linear-gradient(180deg, COLOR_A, COLOR_B)` for the line.

### WaterfallGroupLabel

```tsx
<div style={{ textAlign: "center", margin: "12px 0 6px" }}>
  <span style={{
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "1.6rem",
    color: LABEL_COLOR,
    letterSpacing: "0.04em",
  }}>{text}</span>
</div>
```

### Purple Gradient Badge (tier numbers)

```tsx
{
  width: "30px", height: "30px", borderRadius: "50%",
  background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.95rem", color: "#fff",
  boxShadow: "0 0 16px rgba(120,60,180,0.50), 0 0 32px rgba(120,60,180,0.25)",
}
```

For "Why This Matters" badges: 48px × 48px, fontSize 1.6rem.
For step icons: 48px × 48px, holds SVG icons (22×22).

### CTA Button (purple gradient + shimmer)

```tsx
{
  position: "relative", overflow: "hidden",
  fontFamily: "'Roboto Mono', monospace", fontWeight: 600,
  textTransform: "uppercase", color: "#fff",
  background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
  padding: "22px 0",
  letterSpacing: "0.12em", fontSize: "18px",
  borderRadius: "8px", border: "none", cursor: "pointer",
  display: "block", width: "100%", textAlign: "center",
  boxShadow:
    "0 0 0 1px rgba(212,175,55,0.25), " +    // gold ring
    "0 0 24px rgba(120,60,180,0.40), " +      // purple glow (tight)
    "0 0 60px rgba(120,60,180,0.20), " +      // purple glow (medium)
    "0 0 100px rgba(212,175,55,0.10)",         // gold glow (wide)
}
```

Shimmer overlay (absolute positioned inside button):
```tsx
{
  position: "absolute", top: 0, left: "-100%",
  width: "55%", height: "100%",
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
  transform: "skewX(-20deg)",
  animation: "lp-shimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
}
```

Keyframe:
```css
@keyframes lp-shimmer {
  0% { left: -100%; }
  30% { left: 200%; }
  100% { left: 200%; }
}
```

Button content wrapped in `<span style={{ position: "relative", zIndex: 1 }}>` to sit above shimmer.

Press feedback: `onMouseDown → scale(0.98)`, `onMouseUp → scale(1)`.

### CTA Reassurance Text

```tsx
{
  fontFamily: "'Roboto Mono', monospace", fontSize: "13px",
  color: "rgba(212,175,55,0.65)", letterSpacing: "0.12em",
  textTransform: "uppercase", textAlign: "center", marginTop: "14px",
}
```

Text: "No Credit Card · Instant Results"

### Pair Card Layout

Two equal-width cards side by side:

```tsx
<div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
  <div style={{ flex: 1, ...cardStyles }}>...</div>
  <div style={{ flex: 1, ...cardStyles }}>...</div>
</div>
```

Used for: Context cards (Production Budget / Tax Credit), waterfall tier pairs, profit split (Investor / Producer).

### Feature List with Checkmarks

```tsx
<div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
  <span style={{
    fontSize: "20px", color: "#3CB371", flexShrink: 0, marginTop: "1px",
    textShadow: "0 0 10px rgba(60,179,113,0.60), 0 0 20px rgba(60,179,113,0.25)",
  }}>✓</span>
  <p style={{
    fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500,
    color: "rgba(255,255,255,0.90)", lineHeight: 1.3,
  }}>{text}</p>
</div>
```

Grouped under Bebas Neue headings (Model / Analyze / Share) separated by gold dividers.

---

## 6. ANIMATION SYSTEM

### Scroll Reveal (section-level)

The `reveal()` function returns inline styles:

```tsx
const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: prefersReducedMotion || visible ? 1 : 0,
  transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(30px)",
  transition: prefersReducedMotion
    ? "none"
    : "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay * 100}ms`,
});
```

Each section has its own `useInView` ref. Stagger delay via the second arg (1 = 100ms, 2 = 200ms, etc.).

### Card Entrance (waterfall cards)

```tsx
const cardReveal = (entered: boolean, delay = 0): React.CSSProperties => ({
  opacity: prefersReducedMotion || entered ? 1 : 0,
  transform: prefersReducedMotion || entered ? "translateY(0)" : "translateY(20px)",
  transition: prefersReducedMotion
    ? "none"
    : `opacity 0.4s ease-out ${delay}ms, transform 0.4s ease-out ${delay}ms`,
});
```

Uses separate IntersectionObserver array for waterfall cards (threshold 0.3), tracked via `enteredCards` Set.

### Profit Count-Up

```tsx
// Triggered when profitCardRef enters view
const duration = 600;
const startTime = performance.now();
const tick = (now: number) => {
  const elapsed = now - startTime;
  const progress = Math.min(elapsed / duration, 1);
  const eased = 1 - Math.pow(1 - progress, 3);  // ease-out cubic
  setProfitCountUp(Math.round(NET_PROFIT * eased));
  if (progress < 1) {
    profitAnimRef.current = requestAnimationFrame(tick);
  }
};
```

Accompanied by:
- Haptic feedback: `haptics.success()`
- Glow pulse: 0.18 → 0.28, returns after 600ms
- Fires once only via `profitCelebrated` boolean

### Badge Card Progressive Warmth

```tsx
const warmth = 0.15 + (i * 0.04);
// Card 0: 0.15, Card 1: 0.19, Card 2: 0.23, Card 3: 0.27
background: `radial-gradient(circle at 45px 57px, rgba(120,60,180,${warmth}) 0%, rgba(6,6,6,0.92) 65%)`
```

Cards get progressively warmer (more purple) as you scroll through them. The radial is anchored at the badge position (45px, 57px).

---

## 7. DATA & CONTENT

### Waterfall Tier Data

```tsx
const WATERFALL_TIERS = [
  { tier: '01', name: 'CAM Fee',           amount: 30_000,    group: 'otts' },
  { tier: '02', name: 'Guild Residuals',   amount: 165_000,   group: 'otts' },
  { tier: '03', name: 'Agent Commission',  amount: 300_000,   group: 'sales' },
  { tier: '04', name: 'Agent Expenses',    amount: 75_000,    group: 'sales' },
  { tier: '05', name: 'Senior Debt',       amount: 800_000,   group: 'debt' },
  { tier: '06', name: 'Mezzanine Debt',    amount: 200_000,   group: 'debt' },
  { tier: '07', name: 'Equity Recoupment', amount: 1_000_000, group: 'equity' },
  { tier: '08', name: 'Deferments',        amount: 12_000,    group: 'equity' },
];
const PRODUCTION_BUDGET = 2_500_000;
const TAX_CREDIT = 500_000;
const TOTAL_ACQUISITION = 3_000_000;
const TOTAL_DEDUCTED = 2_582_000;
const NET_PROFIT = 418_000;
const SPLIT = 209_000;  // 50/50 profit split
```

Groups render in order: Off-the-Tops → Sales Agency → Debt Service → Equity & Deferments.

Each group with 2 items renders as a pair card layout. Groups with 1 item render as a single full-width card.

### Badge Cards

4 cards, each with `num`, `title`, `body`. Topics: double-selling equity, fee awareness, deal clarity, investor protection.

### WITH/WITHOUT Grid

4 rows comparing the product benefit (green ✓) against the risk without it (red ✗ at dimmed 0.70 opacity).

### Steps (How It Works)

5 steps, each with `title`, `body`, and an inline SVG `icon` (22×22, white fill). Topics: budget, capital stack, deal terms, waterfall, export.

---

## 8. SECTION ANATOMY (detailed)

### §1 HERO

- **Container:** Glass feature card (Archetype A), margin 0 24px, borderRadius 12px
- **Atmosphere:** 3-layer radial overlay (gold top + purple center + purple bottom)
- **Content stack:** h1 (three lines: "Model Your" / "Recoupment" / "Waterfall" in gold) → subtitle → CTA button → reassurance
- **No header, no eyebrow.** Hero opens cold.
- **Standing decision:** No heroCard gold wrapper. Button sits directly in the hero content.

### §2 HOW IT WORKS

- **Container:** `position: relative, background: #000, padding: 48px 0 0`
- **Canopy:** Purple radial (0.20, 200px)
- **Header zone:** EyebrowRuled + h2 + section sub, centered, with purple radial bg (0.18)
- **Stepper:** Contained grid (Archetype E) with purple gap color (0.10), purple border (0.25). Each step is a 2-column grid (56px icon col + content col). Icon column has radial purple gradient and vertical line connecting to next step.

### §3 WATERFALL

- **Container:** `position: relative, background: #000, padding: 32px 0 0`
- **Flow:** Header → Explainer text → Context pair (Production Budget / Tax Credit) → Arrow → Acquisition Offer → Arrow → Tier card groups (4 groups × 2 cards each) → Arrow → Total Off The Top → Arrow → Net Backend Profit → Arrow → Profit Split
- **All content inset with `margin: 0 24px`** (except connectors which use `padding: 0 24px`)
- **Summary bar:** Inside Total card — 8px height progress bar (green remaining / red deducted) with Roboto Mono labels

### §4 WHY THIS MATTERS

- **Container:** `position: relative, background: #000, textAlign: center, padding: 48px 0 0`
- **Canopy:** Purple radial (0.22, 220px — warmer than standard)
- **Header zone:** EyebrowRuled + h2 (gold "(4) Four" + white "Reasons You Can't Skip This") + section sub
- **Grid:** Contained grid (Archetype E) with progressive purple warmth per card

### §5 ARSENAL

- **Container:** `position: relative, background: #000, textAlign: center, padding: 48px 0 0`
- **Canopy:** Purple radial (0.25, 240px — warmest section canopy)
- **Single card:** Gradient-border card (Archetype F) with 3 feature groups separated by gold dividers
- **Feature groups:** Model (3 items), Analyze (3 items), Share (3 items) — each with Bebas heading + checkmark list
- **CTA:** Same purple gradient button as hero

### §6 REALITY

- **Container:** `position: relative, background: #000, textAlign: left, padding: 48px 24px 24px`
- **Two canopies:** top (0.20, 180px) + bottom (0.18, 240px) for wrap-around atmospheric
- **Blockquote:** Glass content card (Archetype B) with gold border, glass blur, gold + purple atmospheric layers. Centered Bebas text with gold accent word.
- **WITH/WITHOUT grid:** Contained grid (Archetype E) with 2-column layout. Green atmospheric from checkmarks, red atmospheric from x-marks. Split topline: green left half, red right half.

### §7 CLOSER

- **Container:** Glass feature card (Archetype A), margin 0 24px 28px, borderRadius 12px
- **Hotter than hero:** border 0.55 (vs hero's 0.20), stronger gold text-shadow on "Will Ask."
- **Content stack:** h2 ("Your Investors" / "Will Ask." in gold) → body → CTA → reassurance
- **Asymmetric padding:** `32px top, 40px bottom` — tight top, generous bottom for CTA room

### FOOTER

- **Container:** `background: #0A0A0A, borderTop: 1px solid rgba(255,255,255,0.12), padding: 32px 24px 40px`
- **Content:** Social icons (IG/TikTok/FB in gold-bordered circles) → nav links (Calculator · Shop · Resources in Roboto Mono) → disclaimer text
- **Hover states:** Gold icons brighten from 0.50 to 0.60, borders from 0.15 to 0.25

---

## 9. INFRASTRUCTURE

### Imports

```tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useHaptics } from "@/hooks/use-haptics";
import { useInView } from "@/hooks/useInView";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Instagram } from "lucide-react";
import { colors } from "@/lib/design-system";
```

Note: `colors` is imported from deprecated `design-system.ts` but only used in a few places. Most colors are inline rgba values.

### Auth Flow

```tsx
const gatedNavigate = useCallback(async (destination: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    navigate(destination);
  } else {
    setShowLeadCapture(true);
  }
}, [navigate]);
```

**Known bug:** 7 ungated CTA calls still use `navigate()` directly (footer nav links to calculator and store). Fix: thread `gatedNavigate` as needed.

### useInView Hook

```tsx
export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  // Returns { ref, inView }
  // Fires once (unobserves after first intersection)
  // Default threshold: 0.12
}
```

### Styles Object

All styles live in `const styles: Record<string, React.CSSProperties>` at the bottom of the file. This is the convention for all inline-styled pages.

---

## 10. BUILDER RULES — How to Replicate These Patterns

### Starting a New Section

1. Pick a section archetype from the existing page
2. Add a section divider above it (the purple-gold gradient bar)
3. Add a section canopy (purple radial, 200px height, 0.20 opacity)
4. Open with EyebrowRuled
5. Add section h2 in Bebas Neue (3.2rem, white, lineHeight 0.95) with gold accent word
6. Add section sub in Inter (18px, rgba white 0.88, lineHeight 1.55)
7. Add useInView ref + reveal() animation
8. All margins use 24px page gutters

### Starting a New Card

1. Pick a card archetype (A through F)
2. Always include: overflow hidden, position relative, borderRadius 12px
3. Add a topline gradient (2px, transparent-to-color-to-transparent)
4. Use glass material (`rgba(6,6,6,0.92)` + blur) for premium feel
5. Use radial gradients for atmospheric warmth — anchor at the point of visual interest
6. Add boxShadow with black depth (0 Xpx Ypx rgba(0,0,0,0.5)) + colored glow

### Text Hierarchy Within Any Card

```
EYEBROW:  Roboto Mono, 16px, 0.18em tracking, uppercase, #D4AF37
HEADLINE: Bebas Neue, 1.8-3.2rem, 0.02em tracking, #fff, lineHeight 0.95-1
BODY:     Inter, 18px, rgba(255,255,255,0.88), lineHeight 1.55
DATA:     Roboto Mono, 11-13px, 0.08-0.12em tracking, uppercase, semantic color
```

### Pair Layout

Wrap two `flex: 1` divs in a `display: flex, gap: 8px, alignItems: stretch` container. Both cards use the same archetype. Content within each: label → amount → optional badge/icon.

### Color Temperature Rules

The page warms from cool to hot as it approaches CTAs:
- Cool sections (How It Works, Why): standard purple canopy (0.20)
- Warm sections (Arsenal): stronger canopy (0.25)
- Hot sections (Hero, Closer): glass + multi-layer atmospheric + gold text-shadows
- The closer is hotter than the hero (stronger border, stronger glows)

### What NOT To Do

- Do NOT use Tailwind utility classes on the landing page
- Do NOT use `#111111` for backgrounds (use `rgba(6,6,6,0.92)` glass or `#000`)
- Do NOT use `font-bold` or `font-semibold` on Bebas Neue (it only has weight 400)
- Do NOT create new border colors — use gold, purple, red, or green from the existing palette
- Do NOT add images, icons, or illustrations beyond inline SVGs in step badges
- Do NOT create card border-radius larger than 12px (hero/closer max was 16px in v12, now 12px)
- Do NOT skip the topline gradient on cards — it's a universal pattern
- Do NOT use `rgba(255,255,255,0.70)` for body text — the landing page uses 0.88 (premium)
