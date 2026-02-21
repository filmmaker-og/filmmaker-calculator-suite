# Design Polish Pass: Curvature, Haptics, Header Refinement & Scroll Reveals

## Overview

The footer/bottom nav looks premium. Everything else is razor-sharp. The design contract is broken — the footer says "polished product" while the header, cards, and CTAs say "prototype." This plan brings the entire UI into alignment with a single cohesive design language: **structured with slight curvature**.

Additionally: haptics on every interactive element, the wordmark always navigates home, and the Blum card + scroll reveals need attention.

---

## Phase 1: Global Border-Radius Pass (Slight Curvature)

### Philosophy
- **Not pills.** Not bubbly. Just soften the razor edges.
- Cards already use 14px (`--radius-lg`). The inconsistency is that **CTAs, SectionFrames, and inline content boxes are 0px**.
- Target: 6px on CTA buttons, 8px on content blocks/cards, matching the footer's 16px only on large containers.

### 1A. CTA Buttons — `src/index.css`

All three button classes currently have `border-radius: 0`. Change to `6px`:

| Selector | Current | New |
|---|---|---|
| `.btn-cta-primary` (line ~674) | `border-radius: 0` | `border-radius: 6px` |
| `.btn-cta-final` (line ~730) | `border-radius: 0` | `border-radius: 6px` |
| `.btn-cta-secondary` (line ~783) | `border-radius: 0` | `border-radius: 6px` |

Why 6px: It's subtle — you feel the softness without it reading as "rounded button." Matches the premium/institutional tone. The gold gradient CTAs will feel more refined, not more casual.

### 1B. SectionFrame — `src/components/SectionFrame.tsx`

The main content wrapper on the landing page. Currently fully sharp.

**Change:** Add `rounded-lg` (14px) to the outer `<div>` that has the border:
```
<div className="flex overflow-hidden border border-white/[0.06] rounded-lg">
```

This gives every SectionFrame on the landing page gentle corners, matching `.chapter-card` and `.glass-card` which already use `--radius-lg`.

### 1C. Landing Page Inline Boxes — `src/pages/Index.tsx`

Several content containers on the landing page are sharp-edged `border border-white/[0.10]` divs:

| Section | Element | Change |
|---|---|---|
| § Evidence (line ~456) | `bg-white/[0.04] border border-white/[0.10]` | Add `rounded-lg` |
| § Mission (line ~662) | `bg-white/[0.04] border border-white/[0.10]` | Add `rounded-lg` |
| § Waterfall container (line ~557) | `border border-white/[0.06] bg-black` | Add `rounded-lg` |
| § Net Profits box (line ~602) | `border border-gold/25 bg-gold/[0.04]` | Add `rounded-md` (12px) |
| § Corridor boxes (lines ~624, ~631) | Two grid boxes | Add `rounded-md` |
| § Closed Doors cards (line ~804) | 2×2 grid gatekeeper cards | Add `rounded-lg` |
| § Blum quote card (line ~742) | `border-2 border-gold/45` | Add `rounded-lg` |
| § FAQ container (line ~982) | `bg-black px-5 border border-white/[0.06]` | Add `rounded-lg` |
| § Final CTA corner accents (line ~1007) | 8 absolute corner divs | Keep sharp — these are *decorative* corner brackets, not a container. No change. |
| § Product tier cards (line ~891) | arsenal cards | Add `rounded-lg` |

### 1D. Mobile Menu — `src/components/MobileMenu.tsx`

Menu nav items and contact/share grid items currently have `borderRadius: 0` (inline style):

| Element | Line | Change |
|---|---|---|
| Nav grid buttons (line ~129) | `style={{ borderRadius: 0 }}` | Change to `borderRadius: 8` |
| Contact email link (line ~165) | `style={{ borderRadius: 0 }}` | Change to `borderRadius: 8` |
| Contact Instagram link (line ~177) | `style={{ borderRadius: 0 }}` | Change to `borderRadius: 8` |
| Contact Share button (line ~187) | `style={{ borderRadius: 0 }}` | Change to `borderRadius: 8` |

### 1E. SectionHeader subtitle — `src/components/SectionHeader.tsx`

The non-plain subtitle variant has a border but no radius (line ~54):
```
"text-text-mid text-base px-4 py-2.5 bg-gold/[0.06] border border-gold/20"
```
**Add** `rounded-md` to this class string.

### 1F. Header Sticky CTA — `src/pages/Index.tsx`

The `ctaButton` in the header (line ~316) has `style={{ borderRadius: 0 }}`. Change to `borderRadius: 6` to match the new CTA style.

---

## Phase 2: Header Refinement

### Goal
Make the header feel like it belongs to the same design family as the footer. Currently it's a flat black bar with a 1px gold gradient line. The footer has depth, glow, and presence. The header should echo that.

### Changes — `src/components/AppHeader.tsx`

**Current header:** Flat `--bg-header` (#0A0A0A) with a single `h-[1px] bg-gradient-to-r from-transparent via-gold/45 to-transparent` separator.

**New header:**
1. **Add subtle backdrop blur** — `backdropFilter: "blur(12px)"`, change background to `rgba(10,10,10,0.88)` for translucency
2. **Enhance the gold separator line** — From `via-gold/45` to `via-gold/55`, and add a subtle box-shadow glow: `0 1px 12px rgba(212,175,55,0.08)` on the line
3. **Add inner top gold edge** (matching the footer's top edge line): A 1px line at the very top of the header with `from-transparent via-gold/20 to-transparent` — very subtle, just enough to "bookend" with the footer

The header stays full-width (no max-width constraint like the footer pill). It's the same *family* but adapted for its role.

### Wordmark → Home Navigation

Already works correctly (line 50: `onClick={() => navigate("/")}`). **Verified — no change needed.**

---

## Phase 3: Haptics on Every Interactive Element

### Current State
- `useHaptics` hook exists at `src/hooks/use-haptics.ts` with `light`, `medium`, `heavy`, `success`, `error`, `step` methods
- Index.tsx already uses `haptics.medium()` on main CTAs and `haptics.light()` on chevrons and FAQ triggers
- BottomTabBar, AppHeader, and MobileMenu have **zero haptics**

### 3A. BottomTabBar — `src/components/BottomTabBar.tsx`

Add `useHaptics` import and call `haptics.light()` inside `handleTap`:

```typescript
const haptics = useHaptics();

const handleTap = useCallback((tab: typeof tabs[0]) => {
  haptics.light();
  setRippleId(tab.id);
  navigate(tab.path);
  setTimeout(() => setRippleId(null), 420);
}, [navigate, haptics]);
```

### 3B. AppHeader — `src/components/AppHeader.tsx`

Add haptics to both interactive elements:

1. **Wordmark button** (line ~49): Add `haptics.light()` on click alongside `navigate("/")`
2. **Ellipsis ⋮ button** (line ~73): Add `haptics.light()` on click alongside `onMoreOpen?.()`

```typescript
import { useHaptics } from "@/hooks/use-haptics";
// inside component:
const haptics = useHaptics();

// Wordmark:
onClick={() => { haptics.light(); navigate("/"); }}

// Ellipsis:
onClick={() => { haptics.light(); onMoreOpen?.(); }}
```

### 3C. MobileMenu — `src/components/MobileMenu.tsx`

Add haptics to all interactive elements in the menu:

1. **Nav grid buttons** (line ~127): `haptics.light()` in `handleNavigate`
2. **Email link** (line ~162): Add `onClick` with `haptics.light()`
3. **Instagram link** (line ~172): Add `onClick` with `haptics.light()`
4. **Share button** (line ~184): Add `haptics.light()` at start of `handleShare`
5. **Close X button** (line ~102): Add `haptics.light()`
6. **Brand footer wordmark** (line ~203): Add `haptics.light()` in click handler

Add `useHaptics` import and instantiate once. Inject into `handleNavigate`:
```typescript
const haptics = useHaptics();

const handleNavigate = (path: string) => {
  haptics.light();
  setIsOpen(false);
  navigate(path);
};
```

---

## Phase 4: Blum Card Haze Fix

### Issue
The Blum quote card at `src/pages/Index.tsx` line ~741 has a gold atmospheric haze effect via `boxShadow`, but it currently feels disconnected from the card's content — more like a debug glow than an intentional atmosphere.

### Fix
Add a subtle inner radial gradient overlay to give the card a warm diffused haze that fades from the top:

```tsx
{/* Inner atmospheric haze */}
<div
  className="absolute inset-0 pointer-events-none rounded-lg"
  style={{
    background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.06) 0%, transparent 70%)',
  }}
/>
```

This goes inside the Blum card `<div>` as the first child, creating a soft warm glow that pools at the top of the card.

---

## Phase 5: Scroll Reveal Improvements

### Current State
- `useReveal()` hook in Index.tsx uses `IntersectionObserver` with `threshold: 0.15`
- 11 reveal refs cover all landing page sections
- Animation pattern: `opacity-0 translate-y-6` → `opacity-100 translate-y-0` with 700ms duration
- Individual elements within sections use staggered `transitionDelay`

### Issues to Address
1. **Threshold too aggressive on tall sections** — Tall sections like the Waterfall may not trigger because 15% of a very tall element is a lot of pixels. For tall sections, use a lower threshold.
2. **No reveal on the hero section itself** — The hero just fades in with the cinematic intro completion. If the user has seen the intro before (`shouldSkip`), the hero should still have a subtle entrance.

### Changes

**In `useReveal` (Index.tsx line ~101):** Already accepts custom threshold — no structural change needed.

**For the hero section:** When `shouldSkip` is true (returning visitor), add a quick entrance fade:
```tsx
<main ... className={cn(
  "flex-1 flex flex-col transition-all duration-500",
  isComplete ? "opacity-100" : "opacity-0"
)}>
```
This already exists (line 388) — duration is 700ms. Leave as-is, it works.

**For Waterfall section:** The `waterBarRef` IntersectionObserver (line ~188) uses `threshold: 0.2` which is fine for the bar animation. The wrapping `revWater` uses default 0.15 — also fine. No change needed.

**Verify reduced-motion support:** Already handled in CSS (lines 206-211):
```css
@media (prefers-reduced-motion: reduce) {
  .entrance, .entrance.in-view {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
```
This only covers `.entrance` class. The inline transition styles on reveal sections are NOT covered. **Add a reduced-motion check to `useReveal`:**

```typescript
const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [visible, setVisible] = useState(prefersReduced);
  // ...rest unchanged
};
```

This ensures users who prefer reduced motion see all content immediately.

---

## Phase 6: Remaining Polish Items

### 6A. PKGS → SHOP Label Change — `src/components/BottomTabBar.tsx`

Change tab label from "PKGS" to "SHOP" (line 9):
```typescript
{ id: "store", path: "/store", label: "SHOP", icon: ShoppingBag },
```

This is clearer and more intuitive for users. "PKGS" is jargon.

### 6B. Ellipsis Menu Font Sizes — `src/components/MobileMenu.tsx`

The nav item labels are currently `text-[18px]` (line ~147). This is fine for the 2×2 grid. No change needed unless the user specifies otherwise.

---

## File Change Summary

| File | Changes |
|---|---|
| `src/index.css` | CTA button border-radius: 0 → 6px (3 selectors) |
| `src/components/AppHeader.tsx` | Backdrop blur, gold edge lines, haptics on wordmark + ellipsis |
| `src/components/BottomTabBar.tsx` | Haptics on tab tap, PKGS → SHOP label |
| `src/components/MobileMenu.tsx` | Haptics on all interactive elements, border-radius: 0 → 8 on all items |
| `src/components/SectionFrame.tsx` | Add `rounded-lg` to outer container |
| `src/components/SectionHeader.tsx` | Add `rounded-md` to subtitle variant |
| `src/pages/Index.tsx` | Add `rounded-lg` / `rounded-md` to ~10 inline content boxes, haptic header CTA border-radius fix, Blum card inner haze, reduced-motion support in useReveal |

---

## What Stays Sharp (Intentionally)

- **Final CTA corner brackets** (decorative frame, not a container)
- **Waterfall bar tracks** (data visualization — sharp bars are conventional)
- **Gold left accent bars** on SectionFrames and cards (these are 3px decorative lines)
- **Divider lines** (decorative, not containers)
- **The cinematic intro** (full-screen overlay, no corners to round)

---

## Implementation Order

1. **CSS: CTA border-radius** (3 lines in index.css — instant global effect)
2. **SectionFrame rounded-lg** (1 line — affects all landing page sections)
3. **Index.tsx inline boxes** (~10 className additions)
4. **AppHeader refinement** (blur + gold edges + haptics)
5. **BottomTabBar haptics + SHOP label**
6. **MobileMenu haptics + border-radius**
7. **SectionHeader subtitle radius**
8. **Blum card haze overlay**
9. **useReveal reduced-motion fix**
10. **Verify + test**
