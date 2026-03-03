# filmmaker.og — Design System

The visual rulebook for everything we build. Read this before modifying any page or component.

**Authority order:** `src/lib/design-system.ts` owns token values → this doc explains how to apply them → `tailwind.config.ts` defines the Tailwind classes → `src/index.css` defines CSS custom properties and utility classes.

When anything conflicts, the code files win. This doc gets updated to match, not the other way around.

---

## Design Principles

These seven principles resolve every visual decision. When you're unsure what to do, run it through these.

### 1. The page is a stack of cards on true black
Every section is its own contained card — tight rounded corners, gold border, its own background treatment. Cards sit on pure black (#000) with space between them. The black bleeds through the gaps. Think presentation slides in a dark screening room. This is the structural foundation of every page.

### 2. Properly responsive
Mobile-first, but the page must look natural on every screen. Phone is the primary audience (Instagram traffic). But on tablet and desktop, the layout should fill out — wider cards, scaled typography, potentially side-by-side arrangements within cards. **Never force a mobile-width column on a desktop screen.** Never stretch a mobile layout until it looks wrong on a big monitor. Each breakpoint should feel intentionally designed.

### 3. Gold is heat
More gold = more important. Hero and closer cards get gold radial gradients and stronger gold borders (gold-strong, 0.25). Supporting cards are cooler — `#111` backgrounds, subtler borders (gold-medium, 0.15). The page warms up as you approach a CTA. Gold is never decoration. If it's not marking importance, trust, or action — it shouldn't be gold.

### 4. Typography carries everything
No images, no icons, no illustrations. Bebas Neue at large scale IS the visual element. Roboto Mono for data and labels creates the financial/institutional feel. Inter for readable body text. The fonts do the work that most brands use photos for.

### 5. Each card earns its spot
One idea per card. If you can't name the card's purpose in five words, it's doing too much. Split it. Every card moves the reader closer to the CTA or it doesn't belong.

### 6. Premium means space, not stuff
Generous padding inside every card. Wide gaps between cards. The page breathes. Adding more content or decoration to fill empty space makes it look cheaper, not better. When in doubt, remove.

### 7. Dark, tight-cornered, expensive-looking
True black, not dark grey. Gold, not yellow. Tight rounded corners (8px max), not bubbly — but not razor-sharp either. Monospace data labels, not casual sans-serif. It should feel like a luxury financial platform designed by someone with taste.

---

## Color System

### Gold — 4 Opacity Tiers + Solids

| Name | Value | Tailwind class | CSS variable | Use for |
|------|-------|---------------|-------------|---------|
| Full solid | `#D4AF37` | `text-gold`, `border-gold` | `--gold` | Brand mark, icons, active labels, section eyebrows |
| Full rgba | `rgba(212,175,55,1.0)` | `text-gold-full` | — | Same uses, when you need rgba consistency |
| CTA | `#F9E076` | `text-gold-cta`, `bg-gold-cta` | `--gold-cta` | **Clickable elements ONLY** — buttons, links |
| Deep | `#7A5C12` | `text-gold-deep` | `--gold-deep` | Gradient depth, dark gold shadows |
| Strong (0.25) | `rgba(212,175,55,0.25)` | `border-gold-strong`, `bg-gold-strong` | `--gold-strong` | Active borders, hover states, emphasis borders |
| Medium (0.15) | `rgba(212,175,55,0.15)` | `border-gold-medium`, `bg-gold-medium` | `--gold-medium` | Card borders, section dividers, resting borders |
| Subtle (0.08) | `rgba(212,175,55,0.08)` | `bg-gold-subtle` | `--gold-subtle` | Hover fills, zebra rows, background tints |
| Ghost (0.03) | `rgba(212,175,55,0.03)` | `bg-gold-glow` | `--gold-ghost` | Ambient glows, large area tints, radial bgs |

**ACTIVE CONFLICT — gold-glow / gold-ghost:**
- Tailwind class `gold-glow` = **0.03** (ghost level) — in `tailwind.config.ts`
- CSS variable `--gold-ghost` = **0.03** (ghost level) — in `index.css`
- CSS variable `--gold-glow` = **0.25** (strong level!) — in `index.css`

The Tailwind class and the CSS variable with similar names resolve to **different values**. If you use `bg-gold-glow` you get 0.03. If you use `var(--gold-glow)` you get 0.25. This will be reconciled — the CSS variable `--gold-glow` needs to be removed or renamed. Until then: **use `--gold-ghost` for 0.03 in CSS, and `bg-gold-glow` for 0.03 in Tailwind. Never use `var(--gold-glow)`.**

**No other gold opacity values exist.** If you need gold opacity, pick the closest tier from this list.

### Ink (Text) — 4 Tiers + Full White

The active text color system. Use these on all new work.

| Name | Value | Tailwind class | Use for |
|------|-------|---------------|---------|
| Primary | `#FFFFFF` | `text-white` | Headlines, key numbers, emphasis, primary content |
| Body (0.70) | `rgba(255,255,255,0.70)` | `text-ink-body` | Body text, descriptions, paragraph content |
| Muted (0.55) | `rgba(255,255,255,0.55)` | `text-ink-muted` | Readable subordinate text (between body and secondary) |
| Secondary (0.40) | `rgba(255,255,255,0.40)` | `text-ink-secondary` | Captions, metadata, labels, constraints |
| Ghost (0.06) | `rgba(255,255,255,0.06)` | `text-ink-ghost` | Hover backgrounds, surface tints, faint fills |

**Readability rule:** Never combine 0.40 opacity with font sizes below 14px on #000, or below 16px on #111. If both opacity and size are at their minimums, bump opacity to 0.70 (ink-body).

**Note:** There is no `ink-subtle (0.15)` class. For white at 0.15 (used on borders and dividers), use inline `rgba(255,255,255,0.15)` or the CSS variable `--border-subtle`. This is an open gap in the token system.

### White (DEPRECATED) — Legacy Text Namespace

These exist in `tailwind.config.ts` for pages that haven't been migrated yet. **Do not use on new work.**

| Legacy class | Value | Migrate to |
|-------------|-------|-----------|
| `text-white-primary` | rgba 0.90 | `text-white` (full) or `text-ink-body` (0.70) |
| `text-white-body` | rgba 0.60 | `text-ink-muted` (0.55) or `text-ink-body` (0.70) |
| `text-white-tertiary` | rgba 0.40 | `text-ink-secondary` (0.40) |
| `text-white-surface` | rgba 0.06 | `text-ink-ghost` (0.06) |

### Backgrounds — 3 Primary + 1 Utility

| Name | Hex | Tailwind class | CSS variable | Use for |
|------|-----|---------------|-------------|---------|
| Void | `#000000` | `bg-black`, `bg-bg-void` | `--bg-void` | Page backgrounds, primary card backgrounds |
| Elevated | `#111111` | `bg-bg-elevated` | `--bg-elevated` | Content cards, data panels, lifted containers |
| Surface | `#1A1A1A` | `bg-bg-surface` | `--bg-surface` | Input fields, nested containers, recessed areas |
| Overlay | `rgba(0,0,0,0.85)` | `bg-bg-overlay` | — | Modal/dialog backdrops |

No other background values. No `rgba(255,255,255,0.04)` card fills. Use #000 or #111 solid.

### Red / Danger — Risk Indicators

| Name | Value | Tailwind class |
|------|-------|---------------|
| Default | `#DC3C3C` | `text-danger`, `border-danger` |
| Strong (0.25) | `rgba(220,60,60,0.25)` | `bg-danger-strong` |
| Medium (0.15) | `rgba(220,60,60,0.15)` | `bg-danger-medium` |
| Subtle (0.08) | `rgba(220,60,60,0.08)` | `bg-danger-subtle` |
| Ghost (0.03) | `rgba(220,60,60,0.03)` | `bg-danger-ghost` |

### Waterfall Bar Colors

| Name | Value | Tailwind class |
|------|-------|---------------|
| Standard tier | `rgba(212,175,55,0.25)` | `bg-bar` |
| Net profits | `#D4AF37` | `bg-bar-final` |

---

## Typography

### Font Assignments

| Font | Tailwind class | Use for |
|------|---------------|---------|
| Bebas Neue | `font-bebas` | Display headlines, section titles, CTA button text |
| Inter | `font-sans` (default) | Body text, descriptions, UI elements |
| Roboto Mono | `font-mono` | Numbers, prices, labels, data, section eyebrows, footnotes |

**Do NOT use** `font-display` or `font-body` — those classes don't exist in the codebase.

### Type Scale — Explicit Pixels Only

| Size | Role | Font | Example |
|------|------|------|---------|
| `clamp(3.2rem,11vw,4.8rem)` | Hero headline only | Bebas | "SEE WHERE EVERY DOLLAR GOES" |
| `text-[40px]` / `text-[44px]` | Section H2 desktop | Bebas | Closer headline |
| `text-[28px]` / `text-[36px]` | Section H2 mobile / subordinate desktop | Bebas | Evidence headline |
| `text-[18px]` / `text-[20px]` | Featured body, large data | Inter or Mono | Intro paragraphs, acquisition amounts |
| `text-[16px]` | Standard body text | Inter | Paragraphs, descriptions |
| `text-[14px]` | Secondary text, labels, data rows | Mono or Inter | Section eyebrows, table data |
| `text-[12px]` | Captions, footnotes, legal, small labels | Mono | Disclaimers, metadata |

### Typography Rules

**Banned sizes:** Never use `text-[13px]` or `text-[15px]` — they create visual ambiguity between tiers.

**Banned Tailwind defaults:** Never use `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, or any other default Tailwind text size. Explicit pixel values only.

**Tracking:**
- Bebas: always uppercase with `tracking-[0.06em]` to `tracking-[0.08em]`
- Mono labels: `tracking-[0.12em]` to `tracking-[0.20em]` uppercase
- Inter body: `tracking-[0.02em]` or default

**Line height:**
- Bebas headlines: `leading-[0.96]` to `leading-[1.05]`
- Inter body: `leading-[1.6]` to `leading-[1.7]` or `leading-relaxed`
- Mono data: `leading-[1.5]`

**Never mix fonts** within a single text element.

---

## Border Radius — 8px Maximum

| Size | CSS | Use for |
|------|-----|---------|
| 4px | `borderRadius: "4px"` or `rounded-sm` | CTA buttons, small interactive elements |
| 6px | `borderRadius: "6px"` | Default cards, typical containers |
| 8px | `borderRadius: "8px"` | Feature cards, hero sections, maximum |

**8px is the absolute maximum.** The aesthetic is tight-cornered and modern — not bubbly, not razor-sharp.

Do not use `rounded-lg`, `rounded-xl`, `rounded-2xl` on cards or containers.

Exception: `rounded-full` for pill badges/tags only.

**Convention:** Section cards use inline `style={{ borderRadius: "8px" }}` rather than Tailwind rounded classes. This is the established pattern — follow it.

---

## Card Anatomy

Cards are the structural primitive. Every section is a card. Here's how they're built.

### Standard Content Card

```jsx
<div
  className="px-6 py-8 md:px-8 md:py-10 overflow-hidden"
  style={{
    borderRadius: "8px",
    background: "#111111",
    border: "1px solid rgba(212,175,55,0.15)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  }}
>
  {/* Content here */}
</div>
```

Key parts:
- Background, border, borderRadius, and boxShadow are **inline styles** (not Tailwind classes)
- Padding uses Tailwind responsive classes
- The `inset 0 1px 0` white-ghost highlight is the standard top-edge treatment
- `overflow-hidden` prevents scroll-reveal content from leaking during animation

### Warm Card (Hero / Closer — high emphasis)

```jsx
style={{
  borderRadius: "8px",
  border: "1px solid rgba(212,175,55,0.25)",
  background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 40%, transparent 100%)",
  boxShadow: "0 0 60px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
}}
```

Key differences from standard:
- Gold-strong border (0.25) instead of gold-medium (0.15)
- Radial gold gradient background instead of flat #111
- Outer gold glow shadow

### Neutral Card (Evidence / Data — supporting)

```jsx
style={{
  borderRadius: "8px",
  background: "#111111",
  border: "1px solid rgba(212,175,55,0.15)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
}}
```

Simpler treatment. No gradient, no outer glow. Still gets the inset top-edge highlight.

### Sub-Card (Stat pairs — compact supporting data)

```jsx
<div
  className="px-3.5 py-3.5 text-center"
  style={{
    borderRadius: "8px",
    background: "#111111",
    border: "1px solid rgba(212,175,55,0.15)",
  }}
>
```

Smaller padding, always in 2-up grids (`grid grid-cols-2 gap-2`).

### Card Content Structure

Every card should follow this internal hierarchy (not every card needs all levels):

```
[EYEBROW]      ← Mono, uppercase, gold-full, wide tracking
                  Primary: 14px, tracking 0.20em (hero, section cards)
                  Secondary: 12px, tracking 0.14em (nested evidence/data cards)
[HEADLINE]     ← Bebas, large, white, dramatic scale contrast from body
[BODY]         ← Inter 16px, ink-body (0.70), generous line-height
[ACTION/DATA]  ← CTA button, stat callout, or supporting element
```

The eye should always know where to start. Usually the gold eyebrow or the large headline.

### Card Background Hierarchy (warmth escalation)

| Card type | Background | Border | Glow | When to use |
|-----------|-----------|--------|------|-------------|
| Warm | Radial gold gradient | gold-strong (0.25) | Yes | Hero, Closer, primary CTAs |
| Tinted | `rgba(212,175,55,0.03)` flat | gold-medium (0.15) | No | Education/context cards |
| Neutral | `#111111` flat | gold-medium (0.15) | No | Content, evidence, data |
| Sub-card | `#111111` flat | gold-medium (0.15) | No | Stat pairs, feature pairs |

**Intent:** Pages should warm up toward conversion points. The closer you get to a CTA, the more gold appears. Cool middle sections provide contrast that makes the warm sections land harder.

---

## Section Backgrounds — Inline Style Convention

Section-level backgrounds use inline `style={{}}`, NOT Tailwind `bg-*` classes. This is the established convention.

```jsx
// ✅ Correct
<div style={{ background: "#111111", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "8px" }}>

// ❌ Wrong
<div className="bg-bg-elevated border border-gold-medium rounded-lg">
```

Tailwind `bg-*` and `border-*` classes are fine for small UI elements (buttons, badges, table rows). For card/section containers, use inline styles.

Why: Card backgrounds often need gradients, compound shadows, and specific border values that don't map to single Tailwind classes. Inline styles keep it explicit and prevent opacity drift.

---

## CTA Buttons

Two CTA classes are defined in `index.css`. Use these — don't hand-roll button styles.

### Primary: `.btn-cta-primary`

Gold background (#F9E076), black text, Bebas Neue 20px, uppercase, tracking 0.18em, 4px radius. The CSS class defines `font-weight: 400`, but the landing page overrides with Tailwind's `font-bold` (700) — follow the landing page pattern.

```jsx
<button className="w-full h-14 rounded-sm btn-cta-primary font-bold">
  BUILD YOUR WATERFALL
</button>
```

- Wrap in a max-width div: `max-w-[280px]` minimum, wider on desktop as needed
- Text is always uppercase
- `.animate-cta-glow-pulse` behavior differs by context:
  - **Hero CTA:** glow triggers on a 3500ms delay after page load (`setTimeout`)
  - **Closer CTA:** glow triggers on scroll visibility (IntersectionObserver)
- Two CTAs on the same page should have different labels (progression, not repetition)
- Hover: opacity 0.85 (**only on hover-capable devices** — wrapped in `@media (hover: hover)`)
- Active: scale 0.97. Disabled: opacity 0.3.

### Secondary: `.btn-cta-secondary`

Transparent background, gold-medium border, gold text, Bebas Neue, uppercase.

```jsx
<button className="w-full h-12 btn-cta-secondary">
  EXPLORE THE SHOP
</button>
```

Hover: border → gold-strong, background fills gold-subtle. Active: scale 0.96.

---

## Scroll Reveals

The landing page uses the `useInView` hook (in `src/hooks/useInView.tsx`) which wraps IntersectionObserver. Fire once. Fade + slide up.

```tsx
const { ref: sectionRef, inView: sectionVisible } = useInView<HTMLDivElement>({ threshold: 0.2 });
```

Apply to the card container:

```jsx
<div
  ref={sectionRef}
  style={{
    opacity: prefersReducedMotion || sectionVisible ? 1 : 0,
    transform: prefersReducedMotion || sectionVisible ? "translateY(0)" : "translateY(20px)",
    transition: prefersReducedMotion ? "none" : "opacity 700ms ease-out, transform 700ms ease-out",
  }}
>
```

**Rules:**
- Threshold: `0.2` for all landing page sections currently
- Duration: 600-700ms
- Easing: `ease-out`
- Fire once only — the hook disconnects after trigger
- Sub-element staggers: `translateY(12px)` with 200-400ms `transitionDelay`
- **Always respect `prefers-reduced-motion`** — check the media query and skip animations when enabled. The pattern is `prefersReducedMotion || visible` so content is immediately visible when motion is reduced.

---

## Grain Overlay

The `.grain-overlay` class applies a subtle SVG noise texture over the entire page at 4% opacity. Applied to the outermost page wrapper:

```jsx
<div className="min-h-screen flex flex-col relative overflow-hidden bg-black grain-overlay">
```

Fixed position, z-index 50, pointer-events none. Creates the film-grain texture. Don't remove it.

---

## What NOT to Do

### Banned values
- No `text-[13px]` or `text-[15px]` — visual ambiguity
- No Tailwind default text sizes (`text-sm`, `text-base`, `text-lg`, `text-xl`, etc.)
- No `rounded-lg`, `rounded-xl`, `rounded-2xl` on cards — 8px max via inline style
- No gold opacity values outside the 4-tier system (0.25 / 0.15 / 0.08 / 0.03)
- No off-system white opacity backgrounds (`rgba(255,255,255,0.04)`, etc.)
- No background colors other than #000, #111, #1A1A1A for solid fills
- No `font-display` or `font-body` — use `font-bebas` and `font-sans`

### Banned patterns
- No Tailwind `bg-*` / `border-*` classes for section/card backgrounds — use inline styles
- No mixing legacy `white-*` tokens with active `ink-*` tokens on the same page
- No stagger-delay animations on individual list items — reveal the parent container once
- No SectionFrame or SectionHeader wrapper components (dead code, not imported anywhere)
- No images, icons, or illustrations as visual anchors — typography carries the weight

### Legacy tokens — exist but do NOT use on new work

**Gold aliases:** `gold-label`, `gold-accent`, `gold-border`, `gold-cta-muted`, `gold-cta-subtle`

**White text:** `white-primary`, `white-body`, `white-tertiary`, `white-surface`

When rebuilding a page, replace ALL legacy tokens with active equivalents. Never mix systems on the same page.

### Compat tokens — actively used in calculator/intake flow

These exist as a parallel styling system throughout the calculator, intake steps, and shared UI components (~283 usages). They're not legacy cruft — they're the active system for the non-landing-page parts of the app.

**Text:** `text-text-primary` (#FFF), `text-text-mid` (0.70), `text-text-dim` (0.40)

**Borders:** `border-border-default` (gold 0.15), `border-border-active` (gold 0.25), `border-border-subtle` (white 0.15)

**Backgrounds:** `bg-bg-card` (#111, alias of bg-bg-elevated), `bg-bg-card-border` (white 0.15), `bg-bg-card-rule` (white 0.06), `bg-bg-overlay` (black 0.85)

**Rule of thumb:** For new standalone pages (landing, store, wiki), use the canonical tokens (gold-*, ink-*, bg-bg-void/elevated/surface). When modifying existing calculator/intake pages, you'll encounter compat tokens everywhere — don't mix canonical and compat on the same page. A full migration of calculator pages to canonical tokens is a future project.

**Dead code:** `SectionFrame.tsx` and `SectionHeader.tsx` files exist but are imported nowhere. Safe to delete.

**Bug:** `bg-bg-header` is used as a Tailwind class in several components (premium-input, EmailGateModal, WaterfallVisual, BuildYourPlan) but `header` does not exist in the bg block of tailwind.config.ts. The class resolves to nothing — these components may be relying on fallback CSS variables or the default black background. Needs investigation.

---

## Open Items (Unresolved)

Known gaps. Don't pretend they're fixed — work around them or flag them.

1. **gold-glow / gold-ghost CONFLICT** — Tailwind `gold-glow` = 0.03, CSS variable `--gold-glow` = 0.25, CSS variable `--gold-ghost` = 0.03. Two different values sharing the "glow" name across systems. Needs: rename Tailwind to `gold-ghost`, remove or rename CSS `--gold-glow` at 0.25.

2. **No ink-subtle (0.15) class** — White at 0.15 exists in design-system.ts (`whiteSubtle`) but has no `ink-*` Tailwind class. Use inline `rgba(255,255,255,0.15)` when needed.

3. **Legacy tokens on landing page** — 5 instances of `text-white-body` and `text-white-primary` remain in Index.tsx. Need migration to `text-ink-body` / `text-white`.

4. **LeadCaptureModal violations** — Multiple banned Tailwind text sizes (`text-xl`, `text-sm`, `text-xs`), uncontrolled autofill styling. Critical conversion path — needs cleanup.

5. **Responsive width** — Landing page locked to `max-w-xl` (~576px) on all screens. Needs rebuild to be properly responsive per Principle 2.

6. **Warmth escalation gaps** — Landing page has 4 consecutive neutral (#111) cards in the middle. Intent is warm-to-warmest progression toward the CTA. Execution has a flat middle.

7. **Gold gradient divider inside evidence cards** — A `linear-gradient(90deg, transparent → gold-strong → transparent)` 1px divider survives inside the evidence panels, separating body text from punchlines. The session handoff noted all gold gradient Divider components were removed, but this inline one survived.

8. **CTA active state CSS conflict** — Line 203 in index.css sets `transform: unset` on `:active` for CTA buttons. Lines 733/759 set `scale(0.97)` / `scale(0.96)`. The later rules win, but the conflict should be cleaned up.

9. **`bg-bg-header` phantom class** — Used in premium-input, EmailGateModal, WaterfallVisual, BuildYourPlan, MiniHeader — but `header` does not exist in the bg block of tailwind.config.ts. CSS variable `--bg-header: #000000` exists in index.css but Tailwind doesn't auto-generate classes from CSS variables. These components may silently fall back to other styles or the default black.

---

## Not Documented Here (Infrastructure)

The following exist in `index.css` but are shadcn/Radix infrastructure — not part of the filmmaker.og design system. Don't override them directly:

- HSL theme variables (`--background`, `--foreground`, `--card`, `--primary`, `--destructive`, etc.)
- `--radius: 6px` (shadcn's border-radius base — our cards use inline `borderRadius` instead)
- Timing variables (`--timing-fast: 100ms`, `--timing-medium: 150ms`, `--timing-slow: 200ms`, `--easing`)
- All Radix/shadcn component styles (accordion, dialog, popover, toast, etc.)
