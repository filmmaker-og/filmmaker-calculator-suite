# filmmaker.og — Landing Page Reference Guide

**Source of truth:** `src/pages/Index.tsx` (1,241 lines, v16.4+, commit a33740b)
**Last extracted:** March 25, 2026
**Purpose:** The landing page is the most iterated, most polished surface in the product. Every pattern documented here was built through 16+ major versions and hundreds of micro-decisions. When building or updating ANY page in the application, use this document as the canonical reference for how things should look, feel, and behave.

---

## 1. PAGE ARCHITECTURE

### Container

```
maxWidth: 430px
margin: 0 auto
background: #000
paddingTop: 24px
```

The page is a single vertical column on true black. 430px is the product viewport — not a responsive compromise. Desktop renders the same column centered on black. All content lives inside this container.

**Note:** `paddingTop` was reduced from 32px → 24px in PR #526 to tighten above-the-fold density.

### Section Stack (render order)

```
PILL NAV (fixed, floating — rendered by AppHeader)
§1  HERO — primary CTA card (no subtitle)
    ── section divider ──
§2  HOW IT WORKS — 5-step vertical stepper
    ── section divider ──
§3  WATERFALL — card-based money flow + mid-section CTA
    ── section divider ──
§4  WHY THIS MATTERS — 4 badge cards
    ── section divider ──
§5  ARSENAL — single Snapshot card (no CTA — CTA lives mid-waterfall now)
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

Opacity and height follow the **Atmospheric Arc** (see §12A below). Values range from 0.10 (Reality — coldest) to 0.28 (Arsenal — hottest). Height ranges from 160px (Reality) to 260px (Arsenal). Reality has NO bottom canopy. Closer has a NEW canopy (0.22, 120% wide ellipse).

---

## 2. TYPOGRAPHY — Complete Scale

### Font Families (3 only)

| Font | Import | Assignment |
|------|--------|------------|
| `'Bebas Neue', sans-serif` | Google Fonts | Display headlines, section titles, card labels, value statements |
| `'Inter', sans-serif` | Google Fonts | Body text, descriptions, feature lists, **CTA button text** |
| `'Roboto Mono', monospace` | Google Fonts | Eyebrow labels, data labels, reassurance text, footer nav |

**Rule:** Never mix fonts within a single text element. Never use fonts outside these three.

**CTA font change (PR #525):** The "RUN MY WATERFALL" button switched from Roboto Mono to **Inter fontWeight 700**. This gives the CTA more visual mass and authority compared to the monospace treatment. All other buttons on the page that reference `ctaBtn` inherit this.

### Complete Font Size Scale

**Display tier (Bebas Neue):**

| Size | Role | Where |
|------|------|-------|
| `4.2rem` | Hero h1 | Hero headline "Model Your Recoupment Waterfall" |
| `3.4rem` | Closer h2 | Closer headline "Your Investors Will Ask." |
| `3.2rem` | Section h2 / Acq amount | How/Waterfall/Why/Arsenal section headlines, Acquisition Offer amount |
| `3rem` | Profit amount | Net Backend Profit count-up |
| `2.4rem` | Total deducted | Total Off The Top amount |
| `2.2rem` | Blockquote | Reality blockquote text |
| `1.8rem` | Card titles / value statement | Badge card titles, step titles, Snapshot value text, split amounts |
| `1.6rem` | Group labels | Waterfall group labels, badge nums, check header text |
| `1.5rem` | Context amounts | Context pair secondary amounts (tax credit) |
| `1.4rem` | Feature group names / tier names | Snapshot feature group headers (Model / Analyze / Share), waterfall tier card names, split card labels |
| `1.3rem` | — | (was tier names in v16.4, now bumped to 1.4rem) |
| `1.1rem` | Context card labels | "Production Budget" / "Tax Credit (20%)" labels |
| `0.95rem` | Tier badge nums | Small tier badge numbers (01-08) |

**Body tier (Inter):**

| Size | Role | Where |
|------|------|-------|
| `18px` | Primary body / CTA text | Step descriptions, badge card bodies, section subs, closer body, feature title text, CTA button label |
| `16px` | Secondary body / check text | Eyebrow label (Roboto Mono), check grid cell text |
| `15px` | Feature subtitles | Arsenal feature description lines (below title) |
| `14px` | Compact | Footer text, footer dots |
| `13px` | Small labels | CTA reassurance (Roboto Mono), footer nav links (Roboto Mono) |

**Data/UI tier (Roboto Mono):**

| Size | Role | Where |
|------|------|-------|
| `24px` | Check icons | ✓ and ✗ symbols |
| `18px` | Arsenal checkmarks | Green checkmarks in circled containers |
| `16px` | Eyebrow labels | Ruled eyebrow text ("The Process", "How the money flows", etc.) |
| `13px` | Reassurance / footer nav | "No Credit Card · Instant Results", footer nav links |
| `11px` | Summary bar labels | "Remaining" / "Deducted" labels |

### Letter Spacing Scale (8 values)

| Value | Use |
|-------|-----|
| `0.01em` | Hero h1 (very tight for giant display) |
| `0.02em` | Acquisition amount, badge titles, blockquote, value statement |
| `0.04em` | Waterfall group labels, check header text |
| `0.06em` | Feature group names (Model/Analyze/Share) |
| `0.08em` | Summary bar labels, **CTA button text** |
| `0.10em` | Footer nav links |
| `0.12em` | Reassurance text |
| `0.18em` | Eyebrow ruled labels |

**Pattern:** Tracking widens as text gets smaller and more functional. Display headlines: tight (0.01-0.02em). Structural labels: wide (0.12-0.18em). **CTA button letter-spacing changed from 0.12em → 0.08em** when the font switched from Roboto Mono to Inter.

### Line Height Scale (9 values)

| Value | Use |
|-------|-----|
| `0.86` | Hero h1 (ultra-tight stacked display) |
| `0.95` | Section h2s, closer h2 |
| `1.0` | Single-line amounts, badge titles, blockquote, value statement |
| `1.05` | Badge titles |
| `1.1` | Hero subtitle (style exists but subtitle currently killed) |
| `1.3` | Feature list items (title), arsenal feature subtitles (1.4) |
| `1.35` | Arsenal feature title lines |
| `1.4` | Check cell text, arsenal feature subtitle lines |
| `1.5` | Data labels, arsenal sub |
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
background: rgba(6,6,6,0.85)   // Hero card (0.85 — more translucent, lets atmosphere through)
background: rgba(6,6,6,0.85) + 4 baked-in radials   // Closer card (0.85 — atmospheric haze baked in, overlay killed)
background: rgba(6,6,6,0.92)   // Blockquote, Context pair cards (0.92 — denser/more contained)
backdropFilter: blur(40px)
WebkitBackdropFilter: blur(40px)
```

Used on: Hero card (0.85), Closer card (0.85 with baked-in haze), Blockquote, Context pair cards (0.92). Hero and Closer now share the same glass opacity (0.85) — both use baked-in atmospheric radials rather than overlay divs. Blockquote/Context cards use 0.92 (denser/more contained).

### Purple Gradient (interaction/premium color)

**Solid gradient (CTAs):**
```
background: linear-gradient(180deg, rgb(110,50,170) 0%, rgb(75,30,130) 100%)
```

**Note:** Gradient direction changed from `135deg` (diagonal) → `180deg` (top-to-bottom) in PR #525. The volumetric CTA redesign uses a vertical gradient with inset highlights for a physical button appearance.

**Badge gradient (step badges, tier badges):**
```
background: linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)
```

Badges retain the original 135deg diagonal gradient.

**Accent/glow reference point:** `rgb(120,60,180)` — used in all rgba purple values.

Purple is NOT a hex constant. It lives as `rgba(120,60,180,opacity)` or as the CTA/badge gradients.

### Complete RGBA Census (Index.tsx)

**Gold — rgba(212,175,55,X) — notable opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.08 | Gold subtle tier, radial bg stops, wide CTA outer glow |
| 0.10 | Card glow boxShadow, blockquote atmospheric |
| 0.12 | Arsenal card ambient glow, CTA outer gold glow |
| 0.14 | Arsenal value statement radial bg |
| 0.15 | Gold medium tier, borders, gradient stops, blockquote bg, arsenal card border bottom |
| 0.14 | Arsenal card baked-in gold radial (top) |
| 0.18 | Closer baked-in gold radial (top) |
| 0.20 | Hero card border, feature separators, acquisition glow |
| 0.22 | Arsenal card boxShadow (increased from 0.12) |
| 0.25 | Gold strong tier, acquisition card border, blockquote border, topline glow, comet dividers, arsenal atmospheric (top) |
| 0.28 | Hero glow overlay (top radial — **increased from 0.22**) |
| 0.30 | CTA gold ring boxShadow (increased from 0.25), blockquote topline shadow |
| 0.35 | Topline gradient stops, divider gradient stops |
| 0.40 | Eyebrow ruled lines, divider midpoint, blockquote topline, arsenal gradient border |
| 0.45 | Snapshot gradient border stop |
| 0.50 | Eyebrow ruled line, Snapshot topline, divider midpoint, hero gold em text-shadow |
| 0.30 | Closer card border (atmospheric compensates) |
| 0.55 | Arsenal gradient border top |
| 0.60 | Closer gold text-shadow, footer hover |
| 0.65 | CTA reassurance text |

**Purple — rgba(120,60,180,X) — notable opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.10 | Stepper container bg, mid-waterfall CTA atmospheric |
| 0.12 | Hero boxShadow outermost layer (**new — 4th shadow layer**) |
| 0.15 | Section canopy base, badge grid bg, closer contour emission (top/bottom), eyebrow glow, reality bottom canopy |
| 0.18 | How header bg, badge card warmth base, blockquote bottom atmospheric, reality bottom canopy |
| 0.20 | Section canopy standard, hero glow (bottom radial) |
| 0.20 | Closer baked-in purple radials (top, bottom) |
| 0.22 | Why canopy (warmer), arsenal card boxShadow, **hero page-top wash (new — 120px, 140% wide)** |
| 0.24 | Hero glow (bottom radial — **increased from 0.20**) |
| 0.25 | Section borders, stepper border, arsenal canopy (warmest), **hero canopy (new — 220px, boosted from 0.18)** |
| 0.28 | Step icon bg radial |
| 0.30 | Hero glow (bottom radial — **increased from 0.24**), reality check grid border |
| 0.35 | Hero glow (gold top — **increased from 0.28**), hero glow (off-center purple accent at 80% 20% — **NEW 4th layer**) |
| 0.40 | Hero glow (purple center — **increased from 0.28**), arsenal gradient border |
| 0.45 | CTA boxShadow (tight glow — **increased from 0.40**) |
| 0.50 | Section divider, tier badge boxShadow |
| 0.55 | Badge num boxShadow |
| 0.60 | Step line gradient start |

**Green — rgba(60,179,113,X) — notable opacities:**

| Opacity | Primary Use |
|---------|-------------|
| 0.06 | Arsenal checkmark circle bg (radial stop) |
| 0.10 | Tax credit bg, profit split bg, checkmark circle boxShadow outer |
| 0.12 | Check cell left bg |
| 0.15 | Profit card resting glow, profit split bg |
| 0.20 | Check header WITH bg, arsenal checkmark circle bg (radial start) |
| 0.25 | Checkmark circle boxShadow, green connector boxShadow, topline boxShadow |
| 0.30 | Checkmark circle border, profit topline boxShadow, green connector boxShadow |
| 0.35 | Profit text-shadow, checkmark text-shadow |
| 0.40 | Tax credit topline gradient |
| 0.50 | Profit card border, split card border, remaining bar, remaining label |
| 0.55 | Green connector lines |
| 0.60 | Check header topline |
| 0.70 | Arsenal checkmark text-shadow (inner) |

**White — rgba(255,255,255,X):**

| Opacity | Primary Use |
|---------|-------------|
| 0.06 | Inset top-edge highlights, summary bar bg, check grid internal bg |
| 0.08 | Check grid row backgrounds, check grid internal borders |
| 0.12 | Footer top border |
| 0.25 | CTA inset highlight (top — **new, volumetric**) |
| 0.35 | CTA shimmer brightness |
| 0.48 | Footer disclaimer text |
| 0.55 | Arsenal feature subtitle text |
| 0.70 | Context card labels, check WITHOUT text |
| 0.88 | Body text (steps, badges, section subs, closer body, split labels, check WITH text) |
| 0.90 | Arsenal feature title items (fontWeight 500 in old, now 600) |
| 0.92 | Arsenal feature title text (**new — higher than old 0.90**) |

**Black — rgba(0,0,0,X):**

| Opacity | Primary Use |
|---------|-------------|
| 0.4 | Split card boxShadow, CTA inset shadow (bottom — **new, volumetric**) |
| 0.5 | CTA boxShadow base, waterfall card boxShadow, context card boxShadow, blockquote boxShadow, badge grid boxShadow, Total boxShadow, profit boxShadow, CTA text-shadow |
| 0.6 | Hero boxShadow, stepper boxShadow, badge grid boxShadow, arsenal card boxShadow |
| 0.8 | Hero text-shadow, closer body text-shadow, closer boxShadow |
| 0.9 | Hero text-shadows (secondary), hero mid text-shadow |
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
  background: "rgba(6,6,6,0.85)",       // hero glass (0.85 — translucent); closer also 0.85 now
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  border: "1px solid rgba(212,175,55,0.20)",  // hero: 0.20, closer: 0.30
  boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.10), 0 0 20px rgba(120,60,180,0.15), 0 0 60px rgba(120,60,180,0.12)",
}
```

**Note:** Hero boxShadow now has 4 layers (added `0 0 60px rgba(120,60,180,0.12)` — a wide purple ambient that extends the card's presence).

**Plus atmospheric overlay** — a separate div covering the card:
```tsx
// Hero: 4-layer radial (INTENSIFIED — matches Store hero warmth)
background: "radial-gradient(ellipse 80% 50% at 50% 10%, rgba(212,175,55,0.35) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 80% 20%, rgba(120,60,180,0.35) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 50% 50%, rgba(120,60,180,0.40) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 50% 100%, rgba(120,60,180,0.30) 0%, transparent 60%)"

// Closer: baked into background (no overlay div) — 4 radials ~15% softer than hero
background: "radial-gradient(ellipse 70% 30% at 50% 0%, rgba(212,175,55,0.18) 0%, transparent 55%), radial-gradient(ellipse 100% 40% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 60%), radial-gradient(circle at 50% 55%, rgba(120,60,180,0.28) 0%, transparent 60%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(120,60,180,0.20) 0%, transparent 65%), rgba(6,6,6,0.85)"
// Closer border: 0.30 (atmospheric compensates for lighter border)
// Closer boxShadow: 6-layer contour emission (purple top/bottom + gold accent + ambient)
```

Hero glow is a 4-layer system: (1) gold top 0.35, (2) off-center purple accent at 80% 20% 0.35 (creates asymmetric depth — right side slightly warmer), (3) purple center 0.40, (4) purple bottom 0.30. The 4th layer (off-center accent) is what gives the hero its visual interest — centered radials feel flat.

**Atmospheric warmth hierarchy:** Hero (richest — 0.35/0.40 intensities) > Closer (slightly quieter — 0.18/0.20/0.28 intensities) > Arsenal (product-specific gold+purple split — 0.14/0.18).

Hero uses `margin: 0 24px` + `padding: 24px 24px 16px`.

### Archetype B: Glass Content Card (Blockquote, Context Pairs)

```tsx
{
  position: "relative", overflow: "hidden",
  borderRadius: "12px",
  border: "1px solid rgba(212,175,55,0.25)",
  padding: "28px 24px",
  background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.15) 0%, rgba(6,6,6,0.92) 65%)",
  backdropFilter: "blur(20px)",   // lighter blur than Archetype A
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.08), 0 0 20px rgba(120,60,180,0.10)",
}
```

Used for the Reality blockquote. Context pairs use similar glass but at smaller scale with `blur(20px)`.

### Archetype C: Opaque Red Cards (Waterfall Tiers)

```tsx
{
  position: "relative", overflow: "hidden", borderRadius: "12px",
  background: "radial-gradient(circle at 50% 40px, rgba(220,38,38,0.15) 0%, transparent 60%), rgba(6,6,6,0.92)",
  border: "1px solid rgba(220,38,38,0.25)",
  boxShadow: "0 12px 32px rgba(0,0,0,0.5), 0 0 16px rgba(220,38,38,0.10)",
}
```

Pair mode: `padding: 10px 8px`. Full-width mode: `padding: 12px 16px`.

### Archetype D: Green Profit Cards (Net Profit, Split)

```tsx
{
  position: "relative", overflow: "hidden", borderRadius: "12px",
  border: "1px solid rgba(60,179,113,0.50)",
  background: "radial-gradient(ellipse at 50% 0%, rgba(60,179,113,0.15) 0%, rgba(6,6,6,0.92) 70%)",
  boxShadow: "0 8px 24px rgba(0,0,0,0.4), 0 0 16px rgba(60,179,113,0.10)",
}
```

Profit card has dynamic glow (0.18 resting → 0.28 celebration → returns to 0.18).

### Archetype E: Contained Grid (Stepper, Badge Grid, Check Grid)

Shared structure: container with border + gap creates visual separation between cells.

```tsx
// Stepper (How It Works)
{
  display: "flex", flexDirection: "column", gap: "1px",
  background: "rgba(120,60,180,0.10)",  // purple gap color
  borderRadius: "12px", overflow: "hidden",
  margin: "0 24px",
  border: "1px solid rgba(120,60,180,0.25)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(120,60,180,0.15)",
}
```

Each cell inside uses `background: rgba(6,6,6,0.92)` so the gap color shows through.

### Archetype F: Gradient-Border Card (Arsenal Snapshot)

Uses CSS mask for gradient border instead of solid `border`:

```tsx
{
  position: "relative", borderRadius: "12px", overflow: "hidden", textAlign: "center",
  border: "none",
  background: "radial-gradient(ellipse 100% 50% at 50% 0%, rgba(212,175,55,0.14) 0%, transparent 60%), radial-gradient(ellipse 100% 50% at 50% 100%, rgba(120,60,180,0.18) 0%, transparent 60%), rgba(6,6,6,0.92)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.22), 0 0 30px rgba(120,60,180,0.22), 0 0 80px rgba(212,175,55,0.08)",
}

// Gradient border overlay (absolute positioned)
{
  position: "absolute", inset: 0, borderRadius: "12px", padding: "1px", pointerEvents: "none",
  background: "linear-gradient(180deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.20) 50%, rgba(212,175,55,0.40) 100%)",
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
}
```

**Baked-in atmospherics:** Arsenal card has gold top (0.14) + purple bottom (0.18) baked into the background — overlay divs killed. Gradient border and topline divs remain (structural, not atmospheric).

---

## 5. COMPONENT PATTERNS — Exact Recipes

### EyebrowRuled

```tsx
// Container: flex, centered, 12px gap, 14px marginBottom
// Lines: flex 1, 1px height, gold 0.40 bg, gold 0.15 boxShadow
// Label: Roboto Mono 16px, 0.18em tracking, uppercase, gold solid
```

### CTA Button (volumetric purple + shimmer)

```tsx
{
  position: "relative", overflow: "hidden",
  fontFamily: "'Inter', sans-serif", fontWeight: 700,
  textTransform: "uppercase", color: "#fff",
  background: "linear-gradient(180deg, rgb(110,50,170) 0%, rgb(75,30,130) 100%)",
  padding: "22px 0",
  letterSpacing: "0.08em", fontSize: "18px",
  borderRadius: "8px", border: "none", cursor: "pointer",
  display: "block", width: "100%", textAlign: "center",
  boxShadow:
    "inset 0 1px 1px rgba(255,255,255,0.25), " +    // top highlight (volumetric)
    "inset 0 -2px 4px rgba(0,0,0,0.4), " +           // bottom shadow (volumetric)
    "0 0 0 1px rgba(212,175,55,0.30), " +             // gold ring
    "0 8px 24px rgba(0,0,0,0.5), " +                  // drop shadow
    "0 0 40px rgba(120,60,180,0.45), " +              // purple glow (tight)
    "0 0 20px rgba(212,175,55,0.12)",                  // gold glow (ambient)
  textShadow: "0 2px 4px rgba(0,0,0,0.5)",
}
```

**Key changes from v16.4:**
- Font: Roboto Mono 600 → **Inter 700** (more visual mass)
- Gradient: `135deg` → **`180deg`** (vertical for volumetric look)
- Letter-spacing: `0.12em` → **`0.08em`** (tighter with Inter)
- BoxShadow: Completely redesigned — **inset highlights** create a physical button appearance. Gold ring increased from 0.25 → 0.30. Purple glow increased from 0.40 → 0.45. Drop shadow restructured.
- Added: **`textShadow: "0 2px 4px rgba(0,0,0,0.5)"`** for text depth

Shimmer overlay (unchanged):
```tsx
{
  position: "absolute", top: 0, left: "-100%", width: "55%", height: "100%",
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
  transform: "skewX(-20deg)",
  animation: "lp-shimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite",
}
```

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

### CTA Placement Map (3 locations)

| Location | Context | Wrapper |
|----------|---------|---------|
| §1 Hero | Above the fold, first thing user sees | Inside glass card, `margin: 8px 0 0` |
| §3 Waterfall (mid-section) | After profit split reveal — catch engagement at emotional peak | `padding: 24px 24px 8px`, subtle purple atmospheric (0.10) behind |
| §7 Closer | Final conversion push | Inside glass card |

**Standing decision:** Arsenal (§5) no longer has a CTA. The mid-waterfall CTA was added in PR #526 to catch users at the emotional peak of seeing profit numbers. Arsenal is pure feature display.

### Pair Card Layout

Two equal-width cards side by side:

```tsx
<div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
  <div style={{ flex: 1, ...cardStyles }}>...</div>
  <div style={{ flex: 1, ...cardStyles }}>...</div>
</div>
```

Used for: Context cards (Production Budget / Tax Credit), waterfall tier pairs, profit split (Investor / Producer).

### Arsenal Feature List (NEW — grid-based with circled checkmarks)

The Arsenal card's feature list was completely rebuilt in PR #525. Old pattern (flex rows with bare checkmarks) replaced with a grid-based system:

```tsx
// Feature item
<div style={{
  display: "grid",
  gridTemplateColumns: "50px 1fr",
  alignItems: "start",
  marginBottom: "14px",  // 0 on last item in group
  // Cascade entrance animation
  opacity: prefersReducedMotion || arsenalCoreVisible ? 1 : 0,
  animation: !prefersReducedMotion && arsenalCoreVisible
    ? `check-cascade 0.4s ease-out ${index * 80}ms both`
    : "none",
}}>
  {/* Checkmark circle */}
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "4px" }}>
    <div style={{
      width: "34px", height: "34px", borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(circle at 50% 40%, rgba(60,179,113,0.20) 0%, rgba(60,179,113,0.06) 100%)",
      border: "1px solid rgba(60,179,113,0.30)",
      boxShadow: "0 0 12px rgba(60,179,113,0.25), 0 0 24px rgba(60,179,113,0.10)",
    }}>
      <span style={{
        fontSize: "18px", color: "#3CB371",
        textShadow: "0 0 8px rgba(60,179,113,0.70), 0 0 16px rgba(60,179,113,0.35)",
      }}>✓</span>
    </div>
  </div>
  {/* Title + subtitle */}
  <div style={{ padding: "2px 0 2px 8px", textAlign: "left" }}>
    <p style={{
      fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 600,
      color: "rgba(255,255,255,0.92)", lineHeight: 1.35,
    }}>{title}</p>
    <p style={{
      fontFamily: "'Inter', sans-serif", fontSize: "15px",
      color: "rgba(255,255,255,0.55)", lineHeight: 1.4, marginTop: "3px",
    }}>{subtitle}</p>
  </div>
</div>
```

**Feature group headers:** Bebas Neue 1.4rem, gold `#D4AF37`, 0.06em tracking, `paddingLeft: 52px` (aligns with title text), `textShadow: 0 0 12px rgba(212,175,55,0.15)`.

**Comet tail dividers** between groups:
```tsx
{
  height: "1px",
  background: "linear-gradient(90deg, rgba(212,175,55,0.25) 0%, transparent 100%)",
  margin: "20px 0 20px 50px",  // left margin aligns with content column
}
```

### Arsenal Feature Data (9 features, 3 groups)

**Model:**
1. "11-Tier Recoupment Waterfall" / "Every deduction from revenue to profit"
2. "Capital Stack Breakdown" / "Equity, debt, tax credits, soft money"
3. "Investor / Producer Profit Split" / "See who gets what after recoupment"

**Analyze:**
1. "Off-the-Top Fee Mapping" / "Where the money goes before you see a dime"
2. "Deal Quality Verdict" / "Instant read on whether your deal works"
3. "Profit & Loss Breakdown" / "Total deductions vs. net backend"

**Share:**
1. "Formatted PDF Export" / "Print-ready for meetings and pitches"
2. "Investor-Ready Presentation" / "Full waterfall output, presentation-grade"
3. "Deal-Specific Calculations" / "Every number from your inputs, not templates"

**Note:** Feature list was rewritten in PR #525. Old items ("Break-Even Scenario Analysis", "Sensitivity on Key Variables", "Shareable Web Link", "White-Labeled to Your Project") removed and replaced with benefit-oriented copy.

### Step Icons (48px badge)

Purple gradient circle with inline SVG:
```tsx
{
  width: "48px", height: "48px", borderRadius: "50%",
  background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 0 20px rgba(120,60,180,0.50), 0 0 40px rgba(120,60,180,0.25)",
}
```

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

Applied to every section header and major content block. The easing `cubic-bezier(0.16, 1, 0.3, 1)` gives a spring-like overshoot.

### Card Entrance (waterfall tier cards)

```tsx
const cardReveal = (entered: boolean, delay = 0): React.CSSProperties => ({
  opacity: prefersReducedMotion || entered ? 1 : 0,
  transform: prefersReducedMotion || entered ? "translateY(0)" : "translateY(20px)",
  transition: prefersReducedMotion
    ? "none"
    : `opacity 0.4s ease-out ${delay}ms, transform 0.4s ease-out ${delay}ms`,
});
```

Uses `IntersectionObserver` per card (threshold 0.3), fires once per card.

### Keyframe Animations (5 total)

```css
@keyframes lp-shimmer {
  0% { left: -100%; }
  30% { left: 200%; }
  100% { left: 200%; }
}

@keyframes badge-pop {
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.15); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes check-cascade {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes slide-from-left {
  0% { opacity: 0; transform: translateX(-22px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes slide-from-right {
  0% { opacity: 0; transform: translateX(22px); }
  100% { opacity: 1; transform: translateX(0); }
}
```

| Animation | Where | Trigger | Stagger |
|-----------|-------|---------|---------|
| `lp-shimmer` | CTA button | Always running (2.5s cycle) | — |
| `badge-pop` | Why badge numbers | Section inView | `(i + 2) * 100 + 50`ms |
| `check-cascade` | Arsenal feature items | Card inView | `i * 80`ms |
| `slide-from-left` | WITH/WITHOUT left cells | Grid inView | `i * 120`ms |
| `slide-from-right` | WITH/WITHOUT right cells | Grid inView | `i * 120`ms |

### Count-Up Animations (2)

**Net Backend Profit:**
- Duration: 1800ms (increased from 600ms)
- Easing: cubic ease-out `1 - Math.pow(1 - progress, 3)`
- Glow pulse: 0.18 → 0.28 for 2000ms (increased from 600ms), then returns
- Haptic: `haptics.success()` on trigger

**Profit Split:**
- Duration: 1200ms
- Easing: same cubic ease-out
- No haptic, no glow pulse

Both trigger once via IntersectionObserver (threshold 0.1 for profit, 0.3 for split) and set a `celebrated` flag to prevent re-firing.

### Accessibility

All animations respect `prefers-reduced-motion: reduce`. When active, all transitions/animations return `"none"` and elements render at their final state immediately.

---

## 7. SECTION-BY-SECTION ANATOMY

### §1 HERO

- **Container:** Glass card (Archetype A), `margin: 0 24px`, `padding: 24px 24px 16px`
- **Glow:** 3-layer radial overlay (gold top 0.28, purple center 0.28, purple bottom 0.24)
- **Content:** h1 + CTA button + reassurance text. **No subtitle** — killed in PR #525 (was "Your Deal Structure Begins Here." — deemed redundant with button copy)
- **h1:** "Model Your / Recoupment / Waterfall" — three lines via `display: block` spans. "Waterfall" is gold `<em>` (non-italic).
- **Standing decision:** No heroCard gold wrapper. Button sits directly in hero content. Hero opens cold (no subtitle = CTA appears sooner in scroll).

### §2 HOW IT WORKS

- **Container:** `position: relative, background: #000, padding: 36px 0 0` (**changed from 48px**)
- **Canopy:** Purple radial (0.20, 200px)
- **Header zone:** EyebrowRuled + h2 + section sub, centered, with purple radial bg (0.18)
- **Stepper:** Contained grid (Archetype E) with purple gap color (0.10), purple border (0.25). Each step is a 2-column grid (56px icon col + content col). Icon column has radial purple gradient and vertical line connecting to next step.

### §3 WATERFALL

- **Container:** `position: relative, background: #000, padding: 32px 0 0`
- **Flow:** Header → Explainer text → Context pair (Production Budget / Tax Credit) → Arrow → Acquisition Offer → Arrow → Tier card groups (4 groups × 2 cards each) → Arrow → Total Off The Top → Arrow → Net Backend Profit (count-up) → Arrow → Profit Split (count-up) → **Mid-Section CTA**
- **All content inset with `margin: 0 24px`** (except connectors which use `padding: 0 24px`)
- **Summary bar:** Inside Total card — 8px height progress bar (green remaining / red deducted) with Roboto Mono labels
- **Mid-section CTA (NEW):** After profit split, wrapped in `padding: 24px 24px 8px` with subtle purple atmospheric (0.10). Same `ctaBtn` style as hero/closer.

### §4 WHY THIS MATTERS

- **Container:** `position: relative, background: #000, textAlign: center, padding: 48px 0 0`
- **Canopy:** Purple radial (0.22, 220px — warmer than standard, width 120%)
- **Header zone:** EyebrowRuled + h2 (gold "(4) Four" + white "Reasons You Can't Skip This") + section sub
- **Grid:** Contained grid (Archetype E) with progressive purple warmth per card (0.15 + i*0.04)
- **Badge numbers:** Pop animation on scroll, 48px purple gradient circles

### §5 ARSENAL

- **Container:** `position: relative, background: #000, textAlign: center, padding: 48px 0 0`
- **Canopy:** Purple radial (0.25, 240px — warmest section canopy)
- **Single card:** Gradient-border card (Archetype F) with dual atmospheric layers (gold top + purple bottom), 3 feature groups separated by comet tail dividers
- **Feature layout:** Grid-based (50px icon col + 1fr content), 34px circled checkmarks with glow, title (18px/600/0.92) + subtitle (15px/0.55) per feature
- **Entrance:** `check-cascade` animation per feature (80ms stagger)
- **No CTA.** Arsenal is pure feature display. CTA moved to mid-waterfall (§3).
- **Bottom spacer:** `padding: 8px 24px 28px` (fills card bottom)

### §6 REALITY

- **Container:** `position: relative, background: #000, textAlign: left, padding: 48px 24px 24px`
- **Two canopies:** top (0.20, 180px) + bottom (0.18, 240px) for wrap-around atmospheric
- **Blockquote:** Glass content card (Archetype B) with gold border, glass blur, gold + purple atmospheric layers. Centered Bebas text with gold accent word.
- **WITH/WITHOUT grid:** Contained grid (Archetype E) with 2-column layout. Split topline: green left half, red right half.
- **Entrance animations (NEW):** Each row animates in with `slide-from-left` (WITH cells) and `slide-from-right` (WITHOUT cells), staggered at 120ms per row.

### §7 CLOSER

- **Container:** Glass feature card (Archetype A), `margin: 0 24px 28px`, `borderRadius: 12px`
- **Hotter than hero:** border 0.55 (vs hero's 0.20), stronger gold text-shadow on "Will Ask."
- **Content stack:** h2 ("Your Investors" / "Will Ask." — gold with 40px+80px text-shadow) → body → CTA → reassurance

---

## 8. DATA — Waterfall Constants

```tsx
const WATERFALL_TIERS = [
  { tier: '01', name: 'CAM Fee', amount: 30_000, group: 'otts' },
  { tier: '02', name: 'Guild Residuals', amount: 165_000, group: 'otts' },
  { tier: '03', name: 'Agent Commission', amount: 300_000, group: 'sales' },
  { tier: '04', name: 'Agent Expenses', amount: 75_000, group: 'sales' },
  { tier: '05', name: 'Senior Debt', amount: 800_000, group: 'debt' },
  { tier: '06', name: 'Mezzanine Debt', amount: 200_000, group: 'debt' },
  { tier: '07', name: 'Equity Recoupment', amount: 1_000_000, group: 'equity' },
  { tier: '08', name: 'Deferments', amount: 12_000, group: 'equity' },
];
const PRODUCTION_BUDGET = 2_500_000;
const TAX_CREDIT = 500_000;
const TOTAL_ACQUISITION = 3_000_000;
const TOTAL_DEDUCTED = 2_582_000;
const NET_PROFIT = 418_000;
const SPLIT = 209_000;
```

**Note:** "CAMA Fee" was corrected to "CAM Fee" in PR #525.

---

## 9. COPY — Exact Text

### Badge Cards (§4 Why)

1. "Don't Sell The Same Dollar Twice" / "Track exactly where the money goes so you never over-promise equity and accidentally collapse your own backend."
2. "Know What You're Giving Away" / "Every sales fee, CAM, and deferment eats into the profit before you see a dime. See the reality before you sign."
3. "Explain The Deal Clearly" / "Walk into the pitch with institutional-grade math. Answer recoupment questions before they're asked."
4. "Protect Early Investors" / "Keep your earliest, riskiest backers from getting blindsided by senior debt and off-the-top distribution deductions."

### Steps (§2 How)

1. "Enter Your Budget" / "Total budget, cash basis after deferments and tax credits, investor equity."
2. "Build Your Capital Stack" / "Equity, debt, tax credits, deferments. Structure your financing the way real deals close."
3. "Set Your Deal Terms" / "Fees, guild rates, distribution costs. Every line between revenue and profit."
4. "See the Full Waterfall" / "Every tier with accurate rates, off-the-tops through net backend profit. Adjust and stress-test until you know what you can't afford to give away."
5. "Export & Share" / "Download a formatted PDF. Share directly with investors, financiers, and co-producers."

### WITH / WITHOUT (§6 Reality)

WITH: "Model every fee" / "Show exact returns" / "Know your leverage" / "Know break-even first"
WITHOUT: "Guessing at the table" / "Overpromising returns" / "Giving away leverage" / "Backend gone at signing"

---

## 10. FOOTER

Background `#0A0A0A`, white border top at `rgba(255,255,255,0.12)`. Social icons (IG/TikTok/FB) → nav links (Calculator · Shop · Resources) → legal disclaimer.

Footer icons: 36px × 36px containers, gold 0.50 color, gold 0.15 border, 8px border-radius. Hover: gold 0.60 color, gold 0.25 border.

Footer nav: Roboto Mono 13px, 0.1em tracking, gold 0.50 color. Hover: gold 0.60.

Footer text: Inter 14px, white 0.48.

**Note:** Resources link uses `navigate()` directly (no `gatedNavigate`), while Calculator and Shop use `gatedNavigate()`.

---

## 11. WHAT NOT TO DO

- Do NOT add prices to the landing page (Store is the pricing surface)
- Do NOT add a subtitle back to the hero (killed intentionally — h1 + CTA is sufficient)
- Do NOT use Roboto Mono on the CTA button (switched to Inter 700 intentionally)
- Do NOT use 135deg gradient on the CTA (changed to 180deg for volumetric look)
- Do NOT add a CTA to the Arsenal card (moved to mid-waterfall)
- Do NOT reduce hero glow opacities back to pre-PR #525 levels (they were intentionally boosted)
- Do NOT change container paddingTop back to 32px (reduced to 24px intentionally)
- Do NOT change How section padding back to 48px (reduced to 36px intentionally)
- Do NOT use bare checkmarks in Arsenal (switched to 34px circled checkmarks with glow)
- Do NOT use the old Arsenal feature names (list was rewritten — see §5 data above)
- Do NOT remove the mid-waterfall CTA (it's at the emotional peak of the profit reveal)
- Do NOT change "CAM Fee" back to "CAMA Fee" (corrected terminology)
- §1 hero now uses a two-layer canopy system: page-top wash (0.22, 120px) + hero canopy (0.25, 220px) — stacks additively with internal glass card glow
- Do NOT change §1 hero padding away from 24/24/16 — this is the canonical standard
- Hero glass is 0.85, closer glass is 0.85 — both use baked-in atmospheric radials. Closer is ~15% softer than hero (0.18/0.20/0.28 vs 0.35/0.40). Do NOT boost closer to hero intensity — the hierarchy is intentional.
- Hero glow is a 4-layer system (gold top 0.35, off-center purple 0.35, purple center 0.40, purple bottom 0.30). Do NOT remove the off-center accent layer — it creates the asymmetric depth.

---

## 12. CHANGELOG (since initial extraction)

| Date | PRs | Key Changes |
|------|-----|-------------|
| March 21 | — | Initial extraction (v16.4, commit d293e0e) |
| March 25 | #519-526 | CTA volumetric redesign (Inter 700, 180deg, inset shadows), hero glow boost, hero subtitle killed, container paddingTop 24px, How padding 36px, Arsenal card rebuild (grid checkmarks, title+subtitle features, dual atmospheric, comet dividers, cascade animations), Arsenal CTA killed, mid-waterfall CTA added, profit split count-up animation, WITH/WITHOUT slide animations, 4 new keyframes, copy corrections (CAM, feature rewrites), waterfall tier names 1.3→1.4rem |
| March 27 | — | Closer: baked-in haze (4 radials, glass 0.85, border 0.30, 6-layer contour boxShadow, closerGlowOverlay killed). Arsenal: baked-in atmospheric (gold top 0.14 + purple bottom 0.18, overlay divs killed). Atmospheric warmth hierarchy documented: Hero > Closer > Arsenal. **Atmospheric Arc system** — canopy opacities retuned per scroll position (PEAK→dip→build→build→PEAK→DROP→PEAK), gold header haze escalation (0.08→0.08→0.10→0.12), Reality bottom canopy killed, Closer canopy added |

---

## 12A. ATMOSPHERIC ARC SYSTEM

The landing page uses a deliberate atmospheric arc that controls emotional temperature through scroll position. The pattern is: **PEAK → dip → build → build → PEAK → DROP → PEAK**.

### Canopy Scroll Map (top-to-bottom)

| Section | Opacity | Height | Arc Position | Notes |
|---------|---------|--------|--------------|-------|
| §1 Hero | rich (reference) | — | PEAK | No change — baked-in multi-layer system |
| §2 How | 0.15 | 200px | dip | Cool breather after hero intensity |
| §3 Waterfall | 0.18 | 200px | build | Slight warmth increase — dread building |
| §4 Why | 0.22 | 200px | build | Stakes escalating (unchanged from prior) |
| §5 Arsenal | 0.28 | 260px | PEAK | Hottest non-bookend section — peak before the drop |
| §6 Reality | 0.10 | 160px | DROP | Clinical cold. Top canopy barely visible. **No bottom canopy** (intentionally killed) |
| §7 Closer | 0.22 | 200px | PEAK | Warmth floods back. NEW canopy (120% wide ellipse, 80% tall) |

### Gold Header Haze (escalating scale)

| Section | Gold Opacity | Label |
|---------|-------------|-------|
| §2 How | 0.08 | "THE PROCESS" |
| §3 Waterfall | 0.08 | "HOW THE MONEY FLOWS" |
| §4 Why | 0.10 | "WHY THIS MATTERS" |
| §5 Arsenal | 0.12 | "WHAT YOU GET" |
| §6 Reality | none | Clinical — no gold haze |
| §7 Closer | none | Gold baked into card, not header |

### Design Intent

- **The Drop:** Arsenal → Reality is the key emotional beat. Arsenal is the warmest (0.28, 260px), then Reality strips nearly everything (0.10, 160px, no bottom canopy). This temperature shock makes the WITH/WITHOUT grid feel clinical and stark.
- **The Return:** Reality → Closer brings warmth back (0.22 canopy). The CTA lives in restored warmth after the cold truth.
- **Gold escalation** builds subconscious "value accumulation" — by the time you reach Arsenal (0.12), the gold feels earned.
- **Reality has no gold** — intentional. The truth section should feel unadorned.
