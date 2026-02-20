
# Floating Nav: Box-Rounded Not Full-Pill

## What the User Is Saying

The previous plan spec'd `border-radius: 28px` — a full capsule/pill shape. That is inconsistent with the app's design system, which has a "No Border Radius" cinematic aesthetic and a radius scale that stops at `--radius-xl: 18px`. The user correctly noticed this clash.

**Box-rounded** means a rectangular container with a modest corner radius — premium, intentional, consistent. Not a pill. Not sharp. Just a clean rounded rectangle that matches the existing token scale.

---

## The Radius Decision

The design system defines these radius tokens:

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Small elements |
| `--radius-md` | 12px | Cards |
| `--radius-lg` | 14px | Standard Shadcn radius |
| `--radius-xl` | 18px | Largest defined radius |

**The correct choice: `16px`** — between `--radius-lg` (14px) and `--radius-xl` (18px). This gives a clearly box-rounded container that reads as a purposeful UI element, not a pill. It is consistent with the cinematic aesthetic: structured, not bubbly.

Compare:
- `28px` (old plan) → full pill — reads as iOS Messages / soft consumer app
- `16px` (new) → box-rounded rectangle — reads as premium tool UI, Telegram's actual tab bar shape
- `0px` → sharp — too harsh for a floating widget

---

## What Changes in the Implementation

The floating nav architecture from the approved plan remains exactly the same. Only the `borderRadius` value changes:

**In `BottomTabBar.tsx` — the pill `<nav>` element:**
```
BEFORE (from plan):  borderRadius: 28
AFTER:               borderRadius: 16
```

That is the only delta. All other specs — the gold `1.5px` border ring, the black background, the 3-tab layout (HOME · CALC · PKGS), the floating bottom margin, the box shadow — all remain as planned.

**Active indicator within the pill:** The approved plan mentioned a dot-style or sub-pill indicator inside the floating nav. With `16px` radius on the outer container, the active tab's inner background highlight (if used) should also be `12px` radius — keeping the inner/outer radius relationship natural (inner = outer minus inset).

---

## The Full Floating Nav Architecture (Unchanged From Approved Plan)

For completeness, here is the full floating nav spec that the plan already approved, now with the corrected radius:

**Wrapper (full-width, transparent, handles safe-area):**
- `position: fixed`, `bottom: 0`, `left: 0`, `right: 0`
- `display: flex; justify-content: center`
- `paddingBottom: calc(12px + env(safe-area-inset-bottom))`
- Background: transparent — the pill floats, the page shows through underneath it

**Pill `<nav>` element:**
- `maxWidth: 340px`, centered via `mx-auto`
- `borderRadius: 16` ← the corrected value
- `background: #0A0A0A`
- `border: 1.5px solid rgba(212,175,55,0.35)` — gold ring
- `boxShadow: "0 8px 32px rgba(0,0,0,0.90), 0 0 0 1px rgba(212,175,55,0.12)"`
- Height: `54px`
- `paddingLeft: 8px; paddingRight: 8px`

**Tabs (3 only — HOME, CALC, PKGS):**
- Bot (ASK) moves to header
- MORE (⋮) moves to header
- Active tab: full gold, small 2px × 20px gold dot beneath icon (Telegram dot indicator)
- Inactive: `rgba(212,175,55,0.65)`

**CSS variable update (`index.css`):**
- `--bottom-bar-h: 82px` (up from 60px, accounts for pill 54px + 12px margin + ~16px breathing room)

---

## Files Changed

| File | Change |
|---|---|
| `src/components/BottomTabBar.tsx` | Full floating pill implementation, `borderRadius: 16` (box-rounded), 3 tabs only, transparent outer wrapper, gold border ring |
| `src/components/AppHeader.tsx` | New unified header — `FILMMAKER.OG` left, Bot F-icon + vertical `⋮` right |
| `src/components/MobileMenu.tsx` | Remove internal hamburger (now externally controlled) |
| `src/App.tsx` | Render `AppHeader` globally, wire bot + menu handlers, add `HeaderCtaContext` |
| `src/pages/Index.tsx` | Remove `<Header />`, use context to inject sticky CTA into `AppHeader` center slot |
| `src/pages/Calculator.tsx` + all other inner pages | Remove `<MiniHeader />` (now global) |
| `src/index.css` | `--bottom-bar-h: 82px` |

---

## Visual Result

The floating nav will look like a dark rectangular chip with soft 16px corners, a 1.5px gold border ring, hovering above the bottom edge. Closer to a TV remote's button cluster shape — structured, premium, intentional — than a pill or a browser tab. It is consistent with every other rounded element in the app (cards, input fields, dialogs all use the 12–18px radius range).
