# filmmaker.og — Universal Pattern Library

**Source of truth:** Extracted from live codebase (commit d293e0e, March 21, 2026)
**Canonical reference:** The landing page (`Index.tsx` v16.4) is the most polished surface. When any pattern here conflicts with a page-specific implementation, the landing page version wins. Other pages should converge toward it.
**Companion doc:** `LANDING_PAGE_REFERENCE.md` covers the landing page in exhaustive detail. This doc covers what's shared across ALL pages.

---

## 1. PAGE SHELL — The Universal Container

Every page in filmmaker.og uses the same outer wrapper:

```tsx
<div style={{
  minHeight: "100vh",
  background: "#000",
  maxWidth: "430px",
  margin: "0 auto",
}}>
  {/* page content */}
</div>
```

**430px is the product.** Not a responsive compromise. Desktop renders the same column centered on true black. Mobile is the primary validation target. Do not add breakpoints, wider layouts, or responsive overrides unless explicitly requested.

**`paddingTop` varies by page:** Landing page uses `32px` (below pill nav). Store and Resources use page-specific values based on their header treatments.

---

## 2. STYLING CONVENTION — Inline First

### The Rule

Section-level backgrounds, borders, border-radius, and layout use **inline `style={{}}`**, not Tailwind utility classes.

| Page | `style={{}}` count | `className=` count | Verdict |
|------|--------------------|--------------------|---------|
| Index.tsx | 121 | 0 | Pure inline |
| Store.tsx | 115 | 0 | Pure inline |
| Resources.tsx | 68 | 12 | Mostly inline (className for scroll/utility only) |

### Why Inline

- Extended opacity values stay explicit (no guessing what a Tailwind class resolves to)
- The styles object at the bottom of the file is a self-contained visual spec
- No risk of Tailwind purge removing dynamic values
- Easier to audit colors and spacing in one scan

### Style Object Convention

Every inline-styled page defines its styles at the bottom of the file:

```tsx
const styles: Record<string, React.CSSProperties> = {
  hero: { ... },
  heroH1: { ... },
  // etc.
};
```

Or in Store: `const s: Record<string, React.CSSProperties> = { ... }`.

**When to use `className`:** Tailwind classes are acceptable for small UI utilities (`scrollbar-hide`, `animate-fade-in`, `grain-overlay`), not for card/section visual styling.

---

## 3. COLOR PALETTE — The Five Colors

filmmaker.og uses exactly five semantic colors. Every rgba value in the codebase derives from one of these five base RGB values, plus true black and white.

### Base RGB Values

| Color | RGB | Hex | Semantic Role |
|-------|-----|-----|---------------|
| Gold | `212,175,55` | `#D4AF37` | Brand identity, trust, structure |
| Purple | `120,60,180` | — | Interaction, premium, AI identity |
| Red | `220,38,38` | `#DC2626` | Risk, deduction, danger, negative |
| Green | `60,179,113` | `#3CB371` | Profit, positive, funded, success |
| White | `255,255,255` | `#FFFFFF` | Text, structural elements |

### Solid Hex Values Used

| Hex | Role | Where |
|-----|------|-------|
| `#000` / `#000000` | Page background, section backgrounds | Everywhere |
| `#0A0A0A` | Elevated surfaces (cards, footer) | Store cards, footer |
| `#D4AF37` | Gold text, icons, eyebrow labels | All pages |
| `#F9E076` | CTA gold (clickable elements ONLY) | Store CTA buttons |
| `#3CB371` | Green text (profit, checkmarks) | Landing page, store |
| `#DC2626` | Red text (deductions, risk) | Landing page waterfall |
| `#fff` / `#FFFFFF` | Headlines, primary text | All pages |

### Purple Gradient (not a hex — always a gradient or rgba)

```tsx
// Solid CTA gradient
background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)"

// Accent text
color: "rgb(180,140,255)"

// All rgba uses reference:
rgba(120,60,180, OPACITY)
```

### The Token Functions (src/lib/tokens.ts)

For TypeScript files, import color functions:

```tsx
import { gold, white, red, green, black, glass, ctaGold } from '@/lib/tokens';
import { GOLD, CTA, RED, GREEN, BG } from '@/lib/tokens';

gold(0.25)     // → "rgba(212,175,55,0.25)"
white(0.88)    // → "rgba(255,255,255,0.88)"
glass(0.92)    // → "rgba(6,6,6,0.92)"
```

**Current reality:** Index.tsx still imports from deprecated `design-system.ts` and uses raw rgba strings inline. Store.tsx uses raw rgba strings exclusively. New code should use `tokens.ts` functions, but matching the page you're editing takes priority over migration.

---

## 4. GLASS MATERIAL SYSTEM

The signature filmmaker.og surface treatment. Used on premium elevated elements.

### Glass Surface Recipe

```tsx
{
  background: "rgba(6,6,6,0.92)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
}
```

### Where Glass Is Used

| Component | blur | Notes |
|-----------|------|-------|
| Hero card (Index) | 40px | + atmospheric overlay |
| Closer card (Index) | 40px | + atmospheric overlay |
| Blockquote (Index) | 20px | Lighter blur for content card |
| Context pair cards (Index) | 20px | Lighter blur |
| MobileMenu | 40px | Full-screen overlay |
| OgBotSheet | 40px | Bottom sheet |

### Where Glass Is NOT Used (yet)

Store cards use opaque `#0A0A0A`. Resources uses opaque backgrounds. Calculator uses opaque `#0A0A0A` / `#111111`. Glass sweep for these pages is planned but not shipped.

### Atmospheric Gradients (layered on glass)

Colored radial gradients create depth and temperature on glass surfaces:

```tsx
// Gold atmosphere (identity warmth)
"radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.15) 0%, transparent 55%)"

// Purple atmosphere (premium/interactive)
"radial-gradient(ellipse at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)"

// Combined (hero: gold top + purple center + purple bottom)
"radial-gradient(ellipse 80% 50% at 50% 10%, rgba(212,175,55,0.22) 0%, transparent 60%),
 radial-gradient(ellipse 60% 40% at 50% 50%, rgba(120,60,180,0.16) 0%, transparent 60%),
 radial-gradient(ellipse 100% 70% at 50% 100%, rgba(120,60,180,0.20) 0%, transparent 60%)"
```

**OLED rule:** Purple needs ~1.7x gold opacity for equivalent visibility. Don't copy gold values to purple 1:1.

---

## 5. TYPOGRAPHY — The Three Fonts

### Font Stack

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@500&display=swap');
```

| Font | Tailwind | Inline | Weights | Role |
|------|----------|--------|---------|------|
| Bebas Neue | `font-bebas` | `"'Bebas Neue', sans-serif"` | 400 only | Display headlines, section titles, card labels |
| Inter | `font-sans` | `"'Inter', sans-serif"` | 400, 500, 600 | Body text, descriptions, features |
| Roboto Mono | `font-mono` | `"'Roboto Mono', monospace"` | 500 | Eyebrows, data labels, CTA text, prices |

**Critical:** Bebas Neue only has weight 400. Do NOT apply `font-bold` or `fontWeight: 700` to it. `fontWeight: 600` or `700` on Roboto Mono is correct for CTAs and prices.

### Universal Type Patterns

**Section headline:**
```tsx
{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.2rem", color: "#fff", lineHeight: 0.95 }
```

**Section subtitle:**
```tsx
{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.88)", lineHeight: 1.55, marginTop: "10px" }
```

**Body text:**
```tsx
{ fontFamily: "'Inter', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.88)", lineHeight: 1.55 }
```

**Note:** The landing page uses `0.88` white for body text — NOT `0.70`. This is the premium standard. The `ink-body` Tailwind class at 0.70 is for calculator/intake pages. New pages should match the landing page at `0.88`.

**Eyebrow label:**
```tsx
{ fontFamily: "'Roboto Mono', monospace", fontSize: "16px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4AF37" }
```

**CTA button text:**
```tsx
{ fontFamily: "'Roboto Mono', monospace", fontSize: "18px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }
```

**Small data label:**
```tsx
{ fontFamily: "'Roboto Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" }
```

---

## 6. REUSABLE COMPONENTS

### EyebrowRuled — Section Opener

Used on: Index.tsx, Store.tsx. The standard way to open any section.

```tsx
const EyebrowRuled = ({ text }: { text: string }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "14px" }}>
    <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)", boxShadow: "0 0 8px rgba(212,175,55,0.15)" }} />
    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "16px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#D4AF37", whiteSpace: "nowrap" }}>
      {text}
    </span>
    <div style={{ flex: 1, height: "1px", background: "rgba(212,175,55,0.40)", boxShadow: "0 0 8px rgba(212,175,55,0.15)" }} />
  </div>
);
```

**Store variant:** fontSize `15px` instead of `16px`. This is a minor inconsistency — new pages should use `16px`.

### Section Divider — Purple-Gold Gradient Bar

Used on: Index.tsx (6 instances). The visual separator between major sections.

```tsx
<div style={{
  height: "3px",
  background: "linear-gradient(to right, transparent 0%, rgba(120,60,180,0.50) 20%, rgba(212,175,55,0.40) 50%, rgba(120,60,180,0.50) 80%, transparent 100%)",
  boxShadow: "0 0 8px rgba(120,60,180,0.35), 0 0 20px rgba(120,60,180,0.20)",
  margin: "0 24px",
}} />
```

### Top Line — Card Crown

Almost every card has a glowing top-edge line:

```tsx
<div style={{
  position: "absolute", top: 0, left: 0, right: 0,
  height: "2px",  // or "1px" for subtler
  background: "linear-gradient(90deg, transparent, COLOR, transparent)",
  zIndex: 1,
}} />
```

Color matches the card's semantic purpose: gold for identity cards, red for deduction cards, green for profit cards, purple+gold for premium cards.

### Gradient Border (CSS Mask Technique)

Used on: Index.tsx (Snapshot card), Store.tsx (product cards). Creates a gradient that follows the card border.

```tsx
<div style={{
  position: "absolute", inset: 0,
  borderRadius: "12px",
  padding: "1px",
  pointerEvents: "none",
  background: GRADIENT,  // e.g. "linear-gradient(180deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.20) 50%, rgba(212,175,55,0.40) 100%)"
  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
}} />
```

The card itself uses `border: "none"` — the gradient overlay replaces the standard border.

### Pair Card Layout

Two equal-width cards side-by-side:

```tsx
<div style={{ display: "flex", gap: "8px", alignItems: "stretch" }}>
  <div style={{ flex: 1, ...cardStyles }}>...</div>
  <div style={{ flex: 1, ...cardStyles }}>...</div>
</div>
```

### Feature Checkmark Row

```tsx
<div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
  <span style={{ fontSize: "20px", color: CHECKMARK_COLOR, flexShrink: 0, marginTop: "1px", textShadow: GLOW }}>✓</span>
  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "18px", fontWeight: 500, color: "rgba(255,255,255,0.90)", lineHeight: 1.3 }}>
    {text}
  </p>
</div>
```

Checkmark color varies by context: `#3CB371` (landing page), `#D4AF37` (store gold tier), `rgb(160,100,255)` (store purple tier).

---

## 7. ANIMATION SYSTEM

### Scroll Reveal (universal)

All three pages use the same reveal pattern. The canonical version (from Index.tsx):

```tsx
const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: prefersReducedMotion || visible ? 1 : 0,
  transform: prefersReducedMotion || visible ? "translateY(0)" : "translateY(30px)",
  transition: prefersReducedMotion
    ? "none"
    : "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  transitionDelay: prefersReducedMotion || delay === 0 ? "0ms" : `${delay * 100}ms`,
});
```

**Resources variant:** Uses `translateY(20px)` (shorter travel), `0.6s` duration, and `delay * 50ms` (tighter stagger). Store uses the same pattern as Index.

### useInView Hook

```tsx
import { useInView } from "@/hooks/useInView";

const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
```

Fires once (unobserves after first intersection). Default threshold `0.12`. Always used with the reveal function.

### Shimmer Animation

The diagonal light sweep on primary CTAs. Locked spec:

```css
@keyframes lp-shimmer {
  0% { left: -100%; }
  30% { left: 200%; }
  100% { left: 200%; }
}
```

Container: `position: relative, overflow: hidden`. Shimmer div: `position: absolute, width: 55%, skewX(-20deg), animation: lp-shimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite`.

**Used on:** Landing page CTA ("RUN MY WATERFALL"), Menu ASK THE OG button. Not for secondary buttons.

### Press Feedback

Every interactive element:
```tsx
onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
```

CSS also provides universal press feedback:
```css
button:active, a:active, [role="button"]:active {
  transform: scale(0.97);
}
```

### Haptics

```tsx
import { useHaptics } from "@/hooks/use-haptics";
const haptics = useHaptics();

haptics.light();    // navigation, menu taps
haptics.medium();   // CTA presses
haptics.success();  // celebrations (profit reveal)
```

---

## 8. BUTTON SYSTEM

### Primary CTA — Purple Gradient + Shimmer (Landing Page)

The highest-prominence button. Used for the main conversion action.

```tsx
{
  position: "relative", overflow: "hidden",
  fontFamily: "'Roboto Mono', monospace", fontWeight: 600,
  textTransform: "uppercase", color: "#fff",
  background: "linear-gradient(135deg, rgb(75,30,130) 0%, rgb(110,50,170) 100%)",
  padding: "22px 0", letterSpacing: "0.12em", fontSize: "18px",
  borderRadius: "8px", border: "none", cursor: "pointer",
  display: "block", width: "100%", textAlign: "center",
  boxShadow: "0 0 0 1px rgba(212,175,55,0.25), 0 0 24px rgba(120,60,180,0.40), 0 0 60px rgba(120,60,180,0.20), 0 0 100px rgba(212,175,55,0.10)",
}
```

Always includes the shimmer overlay. Always followed by reassurance text.

### Solid Color Buttons (Store)

Store uses a tier-based button system. All share the same base:

```tsx
{
  width: "100%", padding: "18px",
  fontFamily: "'Roboto Mono', monospace", fontSize: "16px",
  fontWeight: 700, letterSpacing: "0.10em",
  textTransform: "uppercase", border: "none",
  borderRadius: "6px", cursor: "pointer",
}
```

| Variant | Color | Background | boxShadow |
|---------|-------|------------|-----------|
| Gold Solid | `#000` text | `#D4AF37` | `0 0 20px rgba(212,175,55,0.35), 0 0 50px rgba(212,175,55,0.10)` |
| Green Solid | `#000` text | `#3CB371` | `0 0 20px rgba(60,179,113,0.35), 0 0 50px rgba(60,179,113,0.10)` |
| CTA Gold | `#000` text | `#F9E076` | `0 0 20px rgba(249,224,118,0.3), 0 0 60px rgba(249,224,118,0.1)` |
| Purple Solid | `#fff` text | gradient | `0 0 24px rgba(120,60,180,0.35), 0 0 60px rgba(212,175,55,0.10)` |

### Outline Buttons (Store secondary)

```tsx
{
  // Same base as solid buttons, but:
  color: SEMANTIC_COLOR,
  background: "rgba(COLOR,0.05)",
  border: "1px solid rgba(COLOR,0.30)",
}
```

Variants: Gold outline, Green outline, Purple outline.

---

## 9. CARD SYSTEM

### Universal Card Properties

Every card on every page shares:

```tsx
{
  position: "relative",   // for absolute-positioned toplines and overlays
  overflow: "hidden",     // contains toplines, atmospheric gradients
  borderRadius: "12px",   // universal card radius (except buttons at 6-8px)
}
```

### Card Temperature Scale

Cards escalate in warmth toward conversion points:

| Temperature | Background | Border | Atmospheric | Use |
|-------------|-----------|--------|-------------|-----|
| Cold | `#0A0A0A` | gold 0.15 | none | Store base cards, data surfaces |
| Warm | `rgba(6,6,6,0.92)` glass | gold 0.20-0.30 | single radial | Content cards, blockquotes |
| Hot | `rgba(6,6,6,0.92)` glass | gold 0.42-0.55 | multi-layer radial | Hero, closer, premium CTAs |

### Store Tier Color System

The store extends the card system with four color tiers:

| Tier | Color | Products |
|------|-------|----------|
| Gold | `#D4AF37` | Full Analysis ($197) |
| Green | `#3CB371` | Comp Report ($595/$995) |
| Purple | `rgb(120,60,180)` | Producer's Package ($1,797) |
| Purple-Elevated | gold→purple gradient | Boutique ($2,997+) |

Each tier has: gradient border, topline, feature checkmark color, badge color, price color, CTA button variant.

---

## 10. SECTION CANOPY PATTERN

Most sections have an atmospheric purple gradient at the top, creating depth:

```tsx
<div style={{
  position: "absolute", top: 0, left: 0, right: 0,
  height: "200px",
  background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(120,60,180,0.20) 0%, transparent 70%)",
  pointerEvents: "none",
  zIndex: 0,
}} />
```

**Height varies by section importance:** 180-240px.
**Opacity varies:** 0.20 standard, up to 0.25 for premium sections.

Some sections add a bottom canopy for wrap-around atmospheric (Reality section uses top + bottom).

---

## 11. BORDER RADIUS SCALE

| Value | Use |
|-------|-----|
| `4px` | Small badges, summary bar, small interactive elements |
| `6px` | Store buttons, shadcn components |
| `8px` | Landing page CTA buttons, footer social icons |
| `12px` | Cards (universal standard) |
| `50%` | Circular badges (step numbers, tier numbers) |
| `999px` | Pill nav, pill-shaped badges |

**Default for new cards: `12px`.** Never use `16px` or larger on cards (v12 closer used 16px, v16 normalized to 12px).

---

## 12. SPACING SYSTEM

### Page Gutters

All content insets from container edge: `margin: 0 24px` or `padding: 0 24px`. This is the universal gutter — do not vary it.

### Section Spacing

```
Top section padding: 48px (standard), 32px (waterfall — tighter)
Section divider: 3px height (gradient bar, inset 24px)
Between card and next section: determined by section padding, not card margin
```

### Card Internal Spacing

```
Card padding: 24px horizontal (standard), varies vertically by card type
Between elements within a card: 8-16px (tight), 24px (standard gap)
Feature list gap: 12-16px between items
```

### Conversion Acceleration

**Locked principle:** Spacing tightens as the page progresses toward the CTA. Top sections breathe (48px+). Bottom sections compress (32px). This creates psychological urgency.

---

## 13. AUTH FLOW — gatedNavigate

The universal auth check pattern:

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

**Every CTA that leads to a gated page (calculator, store purchases) must use `gatedNavigate`.** Direct `navigate()` calls bypass lead capture for anonymous users.

**Known bug:** 7 ungated CTA calls still use `navigate()` directly. Fix pattern: thread `gatedNavigate` as prop from `Index.tsx`.

---

## 14. GLOBAL INFRASTRUCTURE

### Components Available on Every Page (mounted by App.tsx)

| Component | Purpose |
|-----------|---------|
| `AppHeader` | Site header with navigation (landing page uses its own pill nav instead) |
| `OgBotFab` | Floating AI assistant button (bottom-right) |
| `OgBotSheet` | AI assistant bottom sheet |
| `MobileMenu` | Full-screen nav overlay |

### Shared Hooks

| Hook | Import | Purpose |
|------|--------|---------|
| `useInView` | `@/hooks/useInView` | Scroll reveal trigger (fires once) |
| `useHaptics` | `@/hooks/use-haptics` | Vibration feedback on mobile |
| `useMobileKeyboard` | `@/hooks/use-mobile-keyboard` | Input focus management |

### Shared Libraries

| File | Purpose |
|------|---------|
| `src/lib/tokens.ts` | Color functions (gold(), white(), etc.) — NEW, preferred |
| `src/lib/design-system.ts` | Color constants — DEPRECATED, still imported by Index.tsx |
| `src/lib/constants.ts` | Share URL, share text, email key |
| `src/lib/store-products.ts` | Product data for store page |
| `src/lib/glossary-rotation.ts` | Daily glossary term rotation |
| `src/lib/waterfall.ts` | Waterfall calculation engine |

---

## 15. CHECKLIST — Building a New Page

1. **Page shell:** `minHeight: 100vh, background: #000, maxWidth: 430px, margin: 0 auto`
2. **Styling:** Inline styles via `const styles: Record<string, React.CSSProperties>` at bottom of file
3. **Colors:** Import from `@/lib/tokens.ts` or use raw rgba from the five base colors
4. **Sections:** Each section gets a canopy, EyebrowRuled opener, h2 headline, sub text
5. **Cards:** Pick from the 6 archetypes in `LANDING_PAGE_REFERENCE.md`, always include topline
6. **Animation:** `useInView` + `reveal()` function + `prefersReducedMotion` check
7. **Haptics:** `useHaptics()` on all interactive elements
8. **Auth:** `gatedNavigate` for any CTA leading to gated content
9. **Typography:** Bebas Neue display, Inter body at 18px/0.88, Roboto Mono labels
10. **Dividers:** Purple-gold gradient bar between sections
11. **Footer:** Match landing page footer (social icons + nav + disclaimer)

### What NOT To Do (Universal)

- No Tailwind classes for section/card backgrounds on inline-styled pages
- No `#111111` for new elevated surfaces — use glass `rgba(6,6,6,0.92)` or `#0A0A0A`
- No `font-bold` on Bebas Neue (only has weight 400)
- No `border-radius` larger than `12px` on cards
- No images, icons, or illustrations as visual anchors (typography carries the weight)
- No body text at `0.70` opacity — landing page standard is `0.88`
- No new colors outside the five base palette
- No desktop-specific layouts or breakpoints
- No skipping topline gradients on cards
- No skipping `prefersReducedMotion` accessibility check

---

## 16. MIGRATION NOTES — Legacy vs Active

### Active (use these)

| System | For | Source |
|--------|-----|--------|
| `tokens.ts` functions | Colors in new TypeScript | `@/lib/tokens` |
| `ink-*` Tailwind classes | Text hierarchy in Tailwind | `tailwind.config.ts` |
| Inline `style={{}}` | Section/card visuals | Page-level styles objects |
| Glass material | Elevated surfaces | `rgba(6,6,6,0.92)` + blur |

### Deprecated (don't use on new work)

| System | Replacement |
|--------|-------------|
| `design-system.ts` colors object | `tokens.ts` functions |
| `white-*` Tailwind classes | `ink-*` classes |
| `var(--gold-glow)` CSS variable | `var(--gold-ghost)` or `bg-gold-glow` |
| Legacy gold aliases (`gold-label`, `gold-accent`) | `gold-strong`, `gold-medium`, `gold-subtle` |
| `#111111` elevated backgrounds | Glass or `#0A0A0A` |

### Active But Legacy (don't mix with new system on same page)

| System | Used By | Notes |
|--------|---------|-------|
| `text-text-primary/mid/dim` | Calculator, intake | Active compat system for ~245 usages |
| `border-border-default/active/subtle` | Calculator, intake | Active compat system for ~79 usages |
| `bg-bg-card` | Calculator, shared UI | Active for calculator family |

When modifying calculator/intake pages, follow the compat tokens already in use. When building new standalone pages, use the canonical landing page patterns.
