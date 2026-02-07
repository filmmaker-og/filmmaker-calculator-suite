# FILMMAKER.OG — Design System Reference

> **Single Source of Truth.** Every component, page, and feature MUST conform to these rules.
> When in doubt, this file wins. If code contradicts this document, the code is wrong.

---

## 1. Color System

### Two-Gold Rule

There are exactly **two golds**. Using the wrong one is a bug.

| Token | Hex | Usage | Never use for |
|-------|-----|-------|---------------|
| `--gold` / `text-gold` | `#D4AF37` | Borders, icons, dividers, labels, brand marks, decorative elements | Buttons, links, CTAs |
| `--gold-cta` / `text-gold-cta` | `#F9E076` | Buttons, links, interactive CTAs, tab active state | Static text, borders, decorations |

**The test:** Can the user click it? → `gold-cta`. Everything else → `gold`.

### Background Hierarchy

Four layers, darkest to lightest. Content never sits directly on void.

| Layer | Token | Hex | Usage |
|-------|-------|-----|-------|
| Void | `bg-bg-void` | `#000000` | Page background, full-bleed behind everything |
| Card | `bg-bg-card` | `#070707` | ChapterCard container, store cards, modal backgrounds |
| Elevated | `bg-bg-elevated` | `#0D0D0D` | ChapterCard body, inner input containers, quick-amount buttons |
| Surface | `bg-bg-surface` | `#111111` | Focused/active input states, selected rows, distribution expense blocks |

**Rule:** Every visible content block must have a background of `card` or darker. Inputs and interactive elements use `elevated`. Hover/focus states step up to `surface`.

### Text Hierarchy

| Token | Hex | Usage |
|-------|-----|-------|
| `text-text-primary` | `#FFFFFF` | Headings, input values, selected labels |
| `text-text-mid` | `#D4D4D4` | Body text, descriptions, secondary info |
| `text-text-dim` | `#999999` | Labels, hints, helper text, placeholders, disabled |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `border-border-default` | `rgba(212,175,55,0.20)` | Card outlines, ChapterCard borders, primary containers |
| `border-border-active` | `rgba(212,175,55,0.50)` | Focus rings, active input borders |
| `border-border-subtle` | `#222222` | Dividers, inner section borders, inactive input borders, tooltips |

---

## 2. Typography

### Font Stack

| Family | Token | Usage |
|--------|-------|-------|
| Bebas Neue | `font-bebas` | Page titles, chapter headers, modal headers, section headings |
| Inter | `font-sans` (default) | Body text, labels, buttons, descriptions |
| Roboto Mono | `font-mono` | Currency values, percentages, input fields, version numbers |

### Scale

| Level | Element | Font | Size | Weight | Tracking | Example |
|-------|---------|------|------|--------|----------|---------|
| H1 | Page title | Bebas | `text-5xl` / `text-6xl` | Normal | `tracking-wide` | "Filmmaker Waterfall Protocol" |
| H2 | Section heading | Bebas | `text-2xl` | Normal | `tracking-wide` | "Protocol FAQ" |
| H3 | Card/step title | Bebas | 22px (CSS) | Normal | `tracking-[1.5px]` | ChapterCard title |
| Label | Field label | Inter | `text-xs` (11px) | Bold (900) | `tracking-widest` | "TOTAL BUDGET", "UNION SIGNATORIES" |
| Body | Descriptions | Inter | `text-sm` / `text-xs` | Normal (400) | Normal | Card descriptions, FAQ answers |
| Mono | Values | Roboto Mono | `text-[22px]` input / `text-sm` display | 500 | `tabular-nums` | "$2,500,000", "15%" |

### Label Pattern

All field labels follow this exact pattern:
```
text-xs uppercase tracking-widest text-text-dim font-bold
```

---

## 3. Component Patterns

### 3A. Buttons (4 types, no exceptions)

#### Primary CTA (Progression)
Used for: "Continue to Capital Stack", "See the Waterfall", forward navigation.

```
bg-gold-cta-subtle border border-gold-cta-muted text-gold-cta
hover:bg-gold-cta-subtle hover:border-gold-cta
active:scale-[0.98]
shadow-button
```
- Min height: 52px (`py-4`)
- Text: `text-sm font-bold uppercase tracking-wider`
- Always includes `<ArrowRight>` icon
- Only appears when `isComplete === true`

#### Vault Button (Store Purchase)
Used for: Store purchase CTAs only.
```css
.btn-vault  /* defined in index.css */
```
- CTA gold text on gradient gold-subtle background
- Prominent box-shadow glow
- Reserved exclusively for money transactions

#### Ghost Gold (Secondary Action)
Used for: "Read Protocol", "Compare All Packages", secondary navigation.
```css
.btn-ghost-gold  /* defined in index.css */
```
- Metallic gold text on near-transparent background
- Gold border at 25% opacity

#### Text Link
Used for: "continue without saving", inline navigation, "Read the full breakdown here →".
```
text-text-dim hover:text-text-mid text-[11px] tracking-wider
```
- No background, no border
- Underscore on hover only (if needed)

### 3B. Cards

#### ChapterCard (Calculator Steps)
The primary container for all calculator step content.

Structure: `chapter-card` → `chapter-card-header` → `chapter-card-body`
- Outer: `bg-bg-card`, `border: 1px solid rgba(212,175,55,0.3)`, `border-radius: var(--radius-lg)`
- Header: 4-column grid (gold bar | chapter number | title | glossary slot)
- Body: `bg-bg-elevated/50`, `padding: var(--space-lg)`
- Active state: `border-color: var(--gold-muted)`, subtle outer glow

#### Inner Container (Input Groups)
Used inside ChapterCard for input fields, controls.
```
bg-bg-elevated border border-border-default rounded-lg p-5
focus-within:border-gold/50 focus-within:shadow-focus focus-within:bg-bg-surface
```

#### Section Block (Distribution Expenses, Live Assumptions)
Used for grouped secondary controls.
```
bg-bg-surface border border-border-subtle rounded-lg p-4
```

#### Store Card
```css
.store-card          /* Standard package */
.store-card-featured /* Featured/recommended package */
```

### 3C. Selection Pattern (List + Checkbox)

One pattern for all multi-select UIs (Capital Sources, Guild Toggles, any future toggles).

**Container:**
```
bg-bg-elevated border border-border-default rounded-lg overflow-hidden
```

**Header row:**
```
px-5 py-3 border-b border-border-subtle bg-bg-surface/50
```
- Label: `text-xs uppercase tracking-widest text-text-dim font-bold`
- Optional count: `text-xs text-text-dim font-mono`

**Each row (button):**
```
w-full p-4 text-left transition-all duration-150 group flex items-center gap-4
```
- Selected: `bg-bg-surface`
- Unselected: `bg-transparent hover:bg-bg-elevated`

**Row content:**
- Title: `text-sm font-medium` — selected: `text-gold`, unselected: `text-text-mid`
- Description: `text-xs text-text-dim`

**Checkbox (right side):**
```
w-5 h-5 flex items-center justify-center border rounded-sm
```
- Selected: `bg-gold border-gold` + `<Check className="w-3 h-3 text-black" />`
- Unselected: `bg-transparent border-border-subtle group-hover:border-text-dim`

### 3D. Input Fields

**Currency input:**
```
flex-1 bg-transparent outline-none font-mono text-[22px] text-text-primary text-right
placeholder:text-text-dim placeholder:text-base tabular-nums
```
- Always prefixed with `$` sign: `font-mono text-xl text-text-dim mr-2`
- Container handles focus styling (see Inner Container above)

**Slider:**
- Uses shadcn `<Slider>` component
- Value display: `font-mono text-sm font-bold text-text-primary`
- Range labels: `text-[9px] text-text-dim uppercase tracking-wider`

### 3E. Tooltips

All tooltips follow this exact pattern:
```
<TooltipContent side="right" className="max-w-[200px] bg-bg-card border-border-subtle text-xs">
```
- Trigger: `<Info className="w-3.5 h-3.5 text-text-dim/50 hover:text-gold cursor-pointer" />`
- Always `delayDuration={0}`

### 3F. Quick Amount Buttons

```
font-mono text-xs px-3 py-2 rounded transition-colors border
```
- Selected: `bg-gold/15 border-gold text-gold`
- Unselected: `bg-bg-elevated border-border-subtle text-text-mid hover:border-text-dim`

---

## 4. Layout

### Global Structure

| Token | Value | Usage |
|-------|-------|-------|
| `--appbar-h` | 56px | Fixed header height |
| `--tabbar-h` | 62px | Fixed bottom tab bar height |
| `--container-max` | 460px | Max width for calculator content |

### Page Layout
- Header: Fixed top, `z-[150]`, `bg-bg-header` (#0A0A0A)
- Content: Below header spacer, above tab bar
- Tab bar: Fixed bottom, `z-50`, `bg-bg-header` with `backdrop-filter: blur(14px)`

### Calculator Page
```
pt-[var(--appbar-h)] pb-[calc(var(--tabbar-h)+1rem)]
px-4 max-w-[var(--container-max)] mx-auto
```

---

## 5. Motion & Transitions

### Timing Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--timing-fast` | 100ms | Button press, checkbox toggle, hover states |
| `--timing-medium` | 150ms | Card transitions, focus states |
| `--timing-slow` | 200ms | Page transitions, accordion |

### Easing
```
--easing: cubic-bezier(.2,.8,.2,1)
```

### Standard Animations
- Page/step entrance: `animate-fade-in` (0.6s ease-out, translateY 10px → 0)
- Step content: `.step-enter` (0.4s ease-out, translateY 16px → 0)
- Accordion: 0.2s ease-out
- Button press: `active:scale-[0.98]` with `--timing-fast`

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` — transitions disabled, opacity forced to 1.

---

## 6. Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-focus` | `0 0 0 1px rgba(212,175,55,0.16)` | Input focus ring |
| `--shadow-button` | `0 10px 26px rgba(249,224,118,0.15)` | Primary CTA glow |
| `--shadow-card-active` | `0 0 20px rgba(212,175,55,0.08)` | Active ChapterCard |
| `--shadow-modal` | `0 20px 50px rgba(0,0,0,0.8)` | Modal backdrop |

---

## 7. Canonical User Journey

```
LAND (/ or /intro)
  → BUDGET (tab 1): Enter production budget + guild toggles
    → STACK (tab 2): Select capital sources → input amounts
      → DEAL (tab 3): Acquisition price + distribution fees
        → WATERFALL (tab 4): See results → Export CTA
          → EMAIL GATE (modal): Capture email or skip
            → STORE (/store): Browse packages → purchase
```

### Tab Bar States
- **Active tab:** `text-gold-cta`, `bg-gold-cta-subtle`
- **Completed tab:** `text-text-mid` + gold dot indicator (1.5px circle)
- **Default tab:** `text-text-dim`
- **No tabs are ever disabled.** User can navigate freely.

---

## 8. Header

- Fixed top, full width
- Logo: `FILMMAKER` in gold + `.OG` in white (hover inverts)
- Font: `font-bebas text-lg tracking-[0.2em]`
- Right side: Mobile hamburger menu
- Bottom edge: Gold gradient line separator (`rgba(212,175,55,0.45)`)
- Height: `var(--appbar-h)` (56px)

---

## 9. Anti-Patterns (DO NOT)

| Don't | Do Instead |
|-------|------------|
| Use `gold-cta` for static text/borders | Use `gold` (metallic) |
| Use `gold` for buttons/links | Use `gold-cta` |
| Put content directly on `bg-void` | Wrap in a card (`bg-card` or `bg-elevated`) |
| Use `border-gold/30` on tooltips | Use `border-border-subtle` |
| Create grid-based multi-select UIs | Use list+checkbox pattern (Section 3C) |
| Add gold background tints to inactive elements | Keep inactive elements neutral (elevated/subtle) |
| Use `font-bold` on Bebas text | Bebas is already bold; use normal weight |
| Disable tabs to block navigation | All tabs always accessible |
| Mix button patterns | Use exactly one of the 4 button types (Section 3A) |
| Auto-focus inputs on mobile | Let user tap to focus (prevents keyboard popup) |

---

## 10. File Map

| File | Role |
|------|------|
| `tailwind.config.ts` | All Tailwind extensions (colors, fonts, animations) |
| `src/index.css` | CSS custom properties, component classes, keyframes |
| `src/components/calculator/ChapterCard.tsx` | Calculator step container |
| `src/components/calculator/StandardStepLayout.tsx` | Step wrapper (ChapterCard + subtitle + CTA) |
| `src/components/calculator/TabBar.tsx` | Bottom navigation |
| `src/components/Header.tsx` | Fixed header with logo + menu |
| `src/components/calculator/stack/CapitalSelect.tsx` | Reference implementation of list+checkbox pattern |
| `src/components/calculator/tabs/BudgetTab.tsx` | Reference implementation of guild toggles (list+checkbox) |
| `src/lib/store-products.ts` | Store product data (single source of truth) |

---

*Last updated: 2026-02-07 — Phase 1 Design System Lockdown*
