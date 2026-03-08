# filmmaker.og — Design System

The visual rulebook for everything we build. Read this before modifying any page or component.

**Authority order:** `src/lib/design-system.ts` owns token values → this doc explains how to apply them → `tailwind.config.ts` defines the Tailwind classes → `src/index.css` defines CSS custom properties and utility classes.

When anything conflicts, the code files win. This doc gets updated to match, not the other way around.

**Last verified:** March 8, 2026 against live repo (commit b384907).

---

## Design Principles

These seven principles resolve every visual decision. When you're unsure what to do, run it through these.

### 1. The page is a stack of cards on true black

Every section is its own contained card — rounded corners, gold border, its own background treatment. Cards sit on pure black (#000) with space between them. The black bleeds through the gaps. Think presentation slides in a dark screening room.

### 2. Properly responsive

Mobile-first, but the page must look natural on every screen. Phone is the primary audience (Instagram traffic). On tablet and desktop, the layout should fill out. Never force a mobile-width column on a desktop screen. Never stretch a mobile layout until it looks wrong on a big monitor.

### 3. Gold is heat

More gold = more important. Hero and closer cards get gold radial gradients and stronger gold borders. Supporting cards are cooler — darker backgrounds, subtler borders. The page warms up as you approach a CTA. Gold is never decoration. If it's not marking importance, trust, or action — it shouldn't be gold.

### 4. Typography carries everything

No images, no icons, no illustrations. Bebas Neue at large scale IS the visual element. Roboto Mono for data and labels creates the financial/institutional feel. Inter for readable body text. The fonts do the work that most brands use photos for.

### 5. Each card earns its spot

One idea per card. If you can't name the card's purpose in five words, it's doing too much. Split it. Every card moves the reader closer to the CTA or it doesn't belong.

### 6. Premium means space, not stuff

Generous padding inside every card. Wide gaps between cards. The page breathes. Adding more content or decoration to fill empty space makes it look cheaper, not better. When in doubt, remove.

### 7. Dark, tight-cornered, expensive-looking

True black, not dark grey. Gold, not yellow. Tight rounded corners, not bubbly — but not razor-sharp either. Monospace data labels, not casual sans-serif. It should feel like a luxury financial platform designed by someone with taste.

---

## Color System

### Gold — Two Solids + Four Opacity Tiers

Two golds, non-negotiable:

| Name          | Value     | Use for                                                                                  |
|---------------|-----------|------------------------------------------------------------------------------------------|
| Metallic Gold | `#D4AF37` | Borders, icons, dividers, labels, brand elements — anything non-interactive              |
| CTA Gold      | `#F9E076` | Clickable elements ONLY — buttons, links. If it's not clickable, it's not CTA gold.     |
| Deep Gold     | `#7A5C12` | Gradient depth, dark gold shadows                                                        |

Four opacity tiers for standard contexts:

| Tier            | Value                       | Tailwind class       | CSS variable     | Standard use                                              |
|-----------------|-----------------------------|----------------------|------------------|-----------------------------------------------------------|
| Strong (0.25)   | `rgba(212,175,55,0.25)`     | `border-gold-strong` | `--gold-strong`  | Active borders, hover states, emphasis                    |
| Medium (0.15)   | `rgba(212,175,55,0.15)`     | `border-gold-medium` | `--gold-medium`  | Card borders, section dividers, resting borders           |
| Subtle (0.08)   | `rgba(212,175,55,0.08)`     | `bg-gold-subtle`     | `--gold-subtle`  | Hover fills, zebra rows, background tints                 |
| Ghost (0.03)    | `rgba(212,175,55,0.03)`     | `bg-gold-glow`       | `--gold-ghost`   | Ambient glows, large area tints, radial backgrounds       |

**Extended contexts — intermediate gold opacities are expected and intentional:**

The four tiers govern standard card borders, section dividers, and background tints. But gradients, animations, pill nav borders, premium card treatments, closer card borders, shimmer effects, and radial glows all use intermediate values. Index.tsx uses 18 distinct gold opacities. Resources.tsx uses 11. This is by design — visual richness requires values between the tiers.

Common extended values in the codebase: 0.05, 0.06, 0.10, 0.12, 0.20, 0.30, 0.35, 0.38 (pill nav border), 0.40, 0.42 (closer card border), 0.50, 0.60, 0.80 (shimmer, gradient stops, gold text).

**Rule of thumb:** if you're setting a single border or background on a standard card, use a tier. If you're building a gradient, glow, animation, or premium treatment and the tiers look flat — use what looks right.

**Known naming conflict:**

| Reference         | Name       | Resolves to             |
|--------------------|-----------|-------------------------|
| Tailwind class     | gold-glow | 0.03 (ghost level)      |
| CSS variable       | --gold-ghost | 0.03 (ghost level)   |
| CSS variable       | --gold-glow  | 0.25 (strong level!) |

`bg-gold-glow` and `var(--gold-ghost)` both give you 0.03. `var(--gold-glow)` gives you 0.25. **Never use `var(--gold-glow)`.** Use `--gold-ghost` for 0.03 in CSS and `bg-gold-glow` for 0.03 in Tailwind. The `--gold-glow` variable needs to be removed from `index.css`.

---

### Ink (Text) — Active Namespace

The active text color system. Use these on all new work.

| Name             | Value                       | Tailwind class     | Use for                                          |
|------------------|-----------------------------|--------------------|--------------------------------------------------|
| Primary          | `#FFFFFF`                   | `text-white`       | Headlines, key numbers, emphasis                 |
| Body (0.70)      | `rgba(255,255,255,0.70)`    | `text-ink-body`    | Body text, descriptions, paragraphs              |
| Muted (0.55)     | `rgba(255,255,255,0.55)`    | `text-ink-muted`   | Readable subordinate text                        |
| Secondary (0.40) | `rgba(255,255,255,0.40)`    | `text-ink-secondary` | Captions, metadata, labels                     |
| Ghost (0.06)     | `rgba(255,255,255,0.06)`    | `text-ink-ghost`   | Hover backgrounds, surface tints                 |

Extended white opacities exist in the codebase — the same principle as gold applies. Inline-styled pages use a rich range of white opacities (0.08, 0.20, 0.35, 0.45, 0.50, 0.65, 0.75, 0.78, 0.85, 0.88, 0.92, 0.95) for fine-grained text hierarchy, step indicators, and emphasis gradations within cards. The five `ink-*` Tailwind classes cover the standard cases; inline styles handle the extended range.

**No `ink-subtle` (0.15) class exists.** For white at 0.15 (borders and dividers), use inline `rgba(255,255,255,0.15)` or `--border-subtle`.

---

### White (DEPRECATED) — Legacy Text Namespace

These exist in `tailwind.config.ts` for unmigrated pages. **Do not use on new work.**

| Legacy class         | Value      | Migrate to                           |
|----------------------|------------|--------------------------------------|
| `text-white-primary` | rgba 0.90  | `text-white` or `text-ink-body`      |
| `text-white-body`    | rgba 0.60  | `text-ink-muted` or `text-ink-body`  |
| `text-white-tertiary`| rgba 0.40  | `text-ink-secondary`                 |
| `text-white-surface` | rgba 0.06  | `text-ink-ghost`                     |

---

### Backgrounds

| Name        | Hex                    | Tailwind class     | CSS variable     | Use for                                                                                     |
|-------------|------------------------|--------------------|------------------|---------------------------------------------------------------------------------------------|
| Void        | `#000000`              | `bg-black`         | `--bg-void`      | Page backgrounds, primary surfaces                                                          |
| Near-black  | `#050505`              | — (inline only)    | —                | Data cards, badge cards, product cards — used throughout Index.tsx and Resources.tsx          |
| Data        | `#0A0A0A`              | — (inline only)    | —                | Waterfall tier table, stepper cards, with/without grid, footer                              |
| Elevated    | `#111111`              | `bg-bg-elevated`   | `--bg-elevated`  | Content cards, data panels, lifted containers                                               |
| Surface     | `#1A1A1A`              | `bg-bg-surface`    | `--bg-surface`   | Input fields, nested containers, recessed areas                                             |
| Overlay     | `rgba(0,0,0,0.85)`    | `bg-bg-overlay`    | —                | Modal/dialog backdrops                                                                      |

**Note:** `#050505` and `#0A0A0A` are actively used across the landing page and resource vault for sub-elevated card tones. These sit between void and elevated, creating subtle depth within dark sections.

---

### Red / Danger — Risk Indicators

| Name            | Value                       | Tailwind class     |
|-----------------|-----------------------------|--------------------|
| Default         | `#DC3C3C`                   | `text-danger`      |
| Strong (0.25)   | `rgba(220,60,60,0.25)`      | `bg-danger-strong` |
| Medium (0.15)   | `rgba(220,60,60,0.15)`      | `bg-danger-medium` |
| Subtle (0.08)   | `rgba(220,60,60,0.08)`      | `bg-danger-subtle` |
| Ghost (0.03)    | `rgba(220,60,60,0.03)`      | `bg-danger-ghost`  |

---

### Waterfall Bar Colors

| Name            | Value                       | Tailwind class |
|-----------------|-----------------------------|----------------|
| Standard tier   | `rgba(212,175,55,0.25)`     | `bg-bar`       |
| Net profits     | `#D4AF37`                   | `bg-bar-final` |

---

## Typography

### Font Assignments

| Font         | Tailwind class       | Use for                                                          |
|--------------|----------------------|------------------------------------------------------------------|
| Bebas Neue   | `font-bebas`         | Display headlines, section titles, CTA button text               |
| Inter        | `font-sans` (default)| Body text, descriptions, UI elements                             |
| Roboto Mono  | `font-mono`          | Numbers, prices, labels, data, section eyebrows, footnotes       |

**Do NOT use `font-display` or `font-body`** — those classes don't exist.

### Type Scale

Sizes used in the live codebase. Organized by role, not by a rigid scale — the landing page uses what works for each context.

**Display (Bebas Neue):** 4.6rem, 3.8rem, 3.6rem, 3.2rem, 3rem, 2.4rem, 2.2rem, 2rem, 1.7rem, 1.5rem, 1.45rem, 1.4rem, 1.3rem, 1.2rem
Also: `clamp(3.5rem, 7vw, 5rem)` for responsive hero headlines.

**Body (Inter):** 16px standard body, 15px and 14px for secondary text, 13px for compact labels, 12px for metadata, 11px for eyebrows and small labels, 10px for footnotes.

**Data (Roboto Mono):** 22px for large numbers, 16px for data rows, 14px for labels, 12px–11px for small data, 10px for footnotes.

### Typography Rules

**Tracking:** Bebas Neue: always uppercase with tracking `0.06em` to `0.08em`. Roboto Mono labels: tracking `0.12em` to `0.20em` uppercase. Inter body: tracking `0.02em` or default.

**Line height:** Bebas headlines: `0.96` to `1.05`. Inter body: `1.6` to `1.7`. Mono data: `1.5`.

Never mix fonts within a single text element.

---

## Border Radius

Actual values in the codebase, organized by use:

| Size   | Use for                                    | Where                                           |
|--------|--------------------------------------------|-------------------------------------------------|
| `4px`  | CTA buttons, small interactive elements    | `.btn-cta-primary`, badges                      |
| `6px`  | Default cards, shadcn components           | Calculator cards, glass cards                   |
| `8px`  | Standard content cards                     | Landing page stepper, waterfall                 |
| `12px` | Feature cards, product cards, arsenal tier cards | Landing page arsenal, with/without grid   |
| `16px` | Hero/closer emphasis cards                 | Closer card                                     |
| `50%`  | Circular elements                          | Step number badges                              |
| `999px`| Pill shapes                                | Pill nav, pill badges                           |

The aesthetic is tight-cornered and modern — not bubbly, not razor-sharp. Most new cards should default to `8px` or `12px` depending on prominence.

**Do not use `rounded-lg`, `rounded-xl`, `rounded-2xl` on cards.** Use inline `borderRadius` with explicit pixel values — this is the established convention on inline-styled pages.

---

## Card Anatomy

Cards are the structural primitive. Every section is a card.

### Standard Content Card

```jsx
style={{
  borderRadius: "8px",
  background: "#111111",
  border: "1px solid rgba(212,175,55,0.15)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
}}
```

The `inset 0 1px 0 white-ghost` highlight is the standard top-edge treatment. `overflow: "hidden"` prevents scroll-reveal content from leaking.

### Warm Card (Hero / Closer)

```jsx
style={{
  borderRadius: "16px",
  border: "1px solid rgba(212,175,55,0.42)",
  background: "radial-gradient(ellipse at center top, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 40%, transparent 100%)",
  boxShadow: "0 0 60px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)",
}}
```

Hotter border (0.42), radial gold gradient, outer glow, larger radius.

### Product / Feature Card

```jsx
style={{
  borderRadius: "12px",
  background: "#050505",
  border: "1px solid rgba(212,175,55,0.25)",
}}
```

Mid-range prominence. Used for arsenal tier cards, badge cards, product cards.

### Data Card

```jsx
style={{
  borderRadius: "12px",
  background: "#0a0a0a",
  border: "1px solid rgba(212,175,55,0.20)",
}}
```

Used for waterfall tiers, stepper steps, comparison grids.

### Card Background Hierarchy (warmth escalation)

| Card type | Background            | Border              | Glow | When                  |
|-----------|-----------------------|---------------------|------|-----------------------|
| Warm      | Radial gold gradient  | gold 0.42           | Yes  | Hero, Closer          |
| Feature   | `#050505`             | gold-strong (0.25)  | No   | Arsenal, products     |
| Data      | `#0a0a0a`             | gold 0.20           | No   | Tables, steppers      |
| Neutral   | `#111111`             | gold-medium (0.15)  | No   | Content, evidence     |

Pages should warm up toward conversion points. Cool middle sections provide contrast that makes the warm sections hit harder.

### Card Content Structure

Every card follows this internal hierarchy (not every card needs all levels):

```
[EYEBROW]      ← Mono, uppercase, gold, wide tracking
[HEADLINE]     ← Bebas, large, white, dramatic scale contrast from body
[BODY]         ← Inter 16px, ink-body (0.70), generous line-height
[ACTION/DATA]  ← CTA button, stat callout, or supporting element
```

---

## Inline Styles Convention

Section-level backgrounds, borders, and border-radius use inline `style={{}}`, NOT Tailwind classes. This is the established convention on the landing page, resources page, and all new pages.

```jsx
// ✅ Correct
<div style={{ background: "#111111", border: "1px solid rgba(212,175,55,0.15)", borderRadius: "8px" }}>

// ❌ Wrong
<div className="bg-bg-elevated border border-gold-medium rounded-lg">
```

Tailwind classes are fine for small UI elements (buttons, badges, table rows). For card and section containers, use inline styles. This keeps extended opacity values explicit and prevents drift between what Tailwind resolves and what you intended.

---

## CTA Buttons

Two CTA classes defined in `index.css`. Use these — don't hand-roll button styles.

### Primary: `.btn-cta-primary`

Gold background (`#F9E076`), black text, Bebas Neue 20px, uppercase, tracking `0.18em`, 4px radius. The landing page adds `font-bold` (700).

```jsx
<button className="w-full h-14 rounded-sm btn-cta-primary font-bold">
  BUILD YOUR WATERFALL
</button>
```

**Hover:** opacity 0.85 (hover-capable devices only via `@media (hover: hover)`). **Active:** scale 0.97. **Disabled:** opacity 0.3.

### Secondary: `.btn-cta-secondary`

Transparent background, gold-medium border, gold text, Bebas Neue, uppercase.

**Hover:** border → gold-strong, background fills gold-subtle. **Active:** scale 0.96.

### CTA Glow Behavior

`.animate-cta-glow-pulse` triggers differently by context. Hero CTA: glow on a 3500ms delay after page load. Closer CTA: glow on scroll visibility via IntersectionObserver. Two CTAs on the same page should have different labels (progression, not repetition).

---

## Scroll Reveals

The landing page uses the `useInView` hook (`src/hooks/useInView.tsx`) wrapping IntersectionObserver. Fire once, fade + slide up.

```tsx
const { ref: sectionRef, inView: sectionVisible } = useInView<HTMLDivElement>({ threshold: 0.15 });
```

Applied via inline styles:

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

**Rules:** duration 600-700ms, easing ease-out, fire once only (hook disconnects), sub-element staggers via `transitionDelay`. Always respect `prefers-reduced-motion` — the pattern is `prefersReducedMotion || visible` so content is immediately visible.

---

## Grain Overlay

`.grain-overlay` applies a subtle SVG noise texture over the entire page at 4% opacity. Fixed position, z-index 50, pointer-events none. Creates the film-grain texture. Applied to the outermost page wrapper. Don't remove it.

---

## Compat Tokens — Calculator / Intake Pages

The calculator, intake steps, and shared UI components use a parallel token system (~245 usages of `text-text-`, ~79 of `border-border-`, ~14 of `bg-bg-card`). These are **NOT** legacy cruft — they're the active system for the non-landing-page parts of the app.

| System      | Examples                                                                                           |
|-------------|----------------------------------------------------------------------------------------------------|
| Text        | `text-text-primary` (#FFF), `text-text-mid` (0.70), `text-text-dim` (0.40)                        |
| Borders     | `border-border-default` (gold 0.15), `border-border-active` (gold 0.25), `border-border-subtle` (white 0.15) |
| Backgrounds | `bg-bg-card` (#111), `bg-bg-card-border` (white 0.15), `bg-bg-card-rule` (white 0.06)             |

**Rule of thumb:** for new standalone pages (landing, store, resources), use canonical tokens (`gold-`, `ink-`, `bg-bg-void/elevated/surface`) with inline styles. When modifying existing calculator/intake pages, follow the compat tokens already in use — don't mix systems on the same page.

---

## Shared Components

### Globally Mounted (available on all pages)

**AppHeader** (`src/components/AppHeader.tsx`) — Site header with navigation. The landing page uses its own pill nav instead.
**OgBotFab** (`src/components/OgBotFab.tsx`) — Floating AI assistant button. Rendered by App layout, not by individual pages.
**MobileMenu** (`src/components/MobileMenu.tsx`) — Full-screen nav overlay.

### Wiki / Info Pages

**WikiCallout**, **WikiCard**, **WikiSectionHeader** (`src/components/shared/`) — Content components for info pages (FeesInfo, CapitalInfo, BudgetInfo).

### Dead Code (safe to delete)

**SectionFrame** (`src/components/SectionFrame.tsx`) and **SectionHeader** (`src/components/SectionHeader.tsx`) — exist as files but are imported nowhere in the codebase. Not to be confused with WikiSectionHeader, which is a different component that IS actively used.

### Auth Flow

**LeadCaptureModal** (`src/components/LeadCaptureModal.tsx`) — Email capture gating calculator access via Supabase magic links.
**EmailGateModal** (`src/components/EmailGateModal.tsx`) — Alternative email gate.

---

## What NOT to Do

### Banned patterns

- No Tailwind `bg-*` / `border-*` classes for section/card backgrounds on inline-styled pages — use inline styles.
- No mixing legacy `white-*` tokens with active `ink-*` tokens on the same page.
- No images, icons, or illustrations as visual anchors — typography carries the weight.

### Legacy tokens — exist but do NOT use on new work

- **Gold aliases:** `gold-label`, `gold-accent`, `gold-border`, `gold-cta-muted`, `gold-cta-subtle`
- **White text:** `white-primary`, `white-body`, `white-tertiary`, `white-surface`
- **CSS variables:** `--gold-glow` (resolves to 0.25 — conflicts with Tailwind `gold-glow` at 0.03)

When rebuilding a page, replace all legacy tokens with active equivalents. Never mix systems on the same page.

---

## Open Items

Known gaps. Don't pretend they're fixed — work around them or flag them.

1. **gold-glow / gold-ghost naming conflict** — Tailwind `gold-glow` = 0.03, CSS `--gold-glow` = 0.25, CSS `--gold-ghost` = 0.03. Needs: remove or rename `--gold-glow` in `index.css`.

2. **No `ink-subtle` (0.15) class** — White at 0.15 exists in `design-system.ts` but has no `ink-*` Tailwind class. Use inline `rgba(255,255,255,0.15)`.

3. **`bg-bg-header` phantom class** — Used in premium-input, EmailGateModal, WaterfallVisual, BuildYourPlan, MiniHeader — but `header` does not exist in the `bg` block of `tailwind.config.ts`. CSS variable `--bg-header: #000000` exists in `index.css` but Tailwind doesn't auto-generate classes from CSS variables.

4. **LeadCaptureModal token violations** — Multiple Tailwind default text sizes (`text-xl`, `text-sm`, `text-xs`). Critical conversion path — needs cleanup.

5. **Landing page responsive width** — Locked to `maxWidth: 430px` on all screens. Desktop experience is mobile-centered. May need future consideration for wider layouts.

6. **`design-system.ts` header comment says "ONLY THESE 4"** — Accurate for the TS constants file, but the inline-styled pages use extended values. The comment should note that pages supplement these constants with context-specific values.
