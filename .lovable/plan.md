
# Navigation, Bot, and Header Overhaul

## Summary of What's Being Fixed

There are 5 distinct problems to solve:

1. **Bottom tab bar is hard to read** — inactive tabs at `text-white/30` and `opacity-30` are nearly invisible, no visual hierarchy between active/inactive
2. **No `...` / More button** — Share, Glossary, Instagram etc. are buried in the now-orphaned `MobileMenu.tsx` which has no trigger in the UI
3. **No header on inner pages, F icon instead** — but the landing page keeps its full header
4. **Bot sheet is hard to read** — background too dark, low contrast text, weak visual weight
5. **Header should be removed from all non-landing pages and replaced with a small centered F icon with the light effect**

---

## Problem 1 — Bottom Tab Bar Readability

**Current state:**
- Inactive: `text-white/30`, F icon has `opacity-30 grayscale` — nearly invisible on black
- Active: `text-gold` — correct
- No indicator line, no background differentiation

**Fix — three layers of visual hierarchy:**

**Layer 1: Inactive state boost**
- Icons: `text-white/55` (up from `text-white/30`) — still clearly dimmed but readable
- Labels: `text-[10px]` (up from `text-[9px]`) and `tracking-[0.12em]` — more legible
- F icon: `opacity-55` without grayscale — gold tint always faintly visible

**Layer 2: Active state punch**
- Gold top indicator bar: `2px` line at the TOP of the tab (this is the iOS tab bar convention — the indicator sits at the top edge, not the bottom, because the tab bar is at the bottom of the screen). `absolute top-0`, full tab width, gold.
- Active icon: `text-gold` ✓ (keep)
- Active label: slightly brighter, `tracking-[0.15em]`
- Active tab gets a very subtle gold ambient background: `bg-gold/[0.06]`

**Layer 3: Tab bar itself**
- Increase border-top to `rgba(212,175,55,0.28)` (up from `0.18`) — more defined separation from page content
- Add a very subtle upward glow: `boxShadow: "0 -8px 32px rgba(0,0,0,0.90), 0 -1px 0 rgba(212,175,55,0.20)"`

**File:** `src/components/BottomTabBar.tsx`

---

## Problem 2 — Add the `···` More Tab

The `MobileMenu.tsx` slide-up sheet exists and works perfectly — it has Glossary, Waterfall, Share, Email, Instagram, and Packages. It just has no trigger in the UI since the header hamburger was removed.

**Fix:** Add a 5th tab to the bottom bar — `···` or `MORE` — that opens the `MobileMenu` sheet.

This keeps the sheet as-is (no rework needed) but gives it a persistent trigger in the tab bar. The 5 tabs become:

```
[ HOME ] [ CALC ] [ PKGS ] [ ASK ] [ ··· ]
```

**Architecture:**
- `BottomTabBar` gets a new `onMoreOpen` prop (just like `onBotOpen`)
- `App.tsx` manages `isMobileMenuOpen` state, passes it down
- `MobileMenu` already accepts no external props — it manages its own `isOpen` internally. We need to convert it to accept optional `isOpen`/`onOpenChange` controlled props, same pattern as `OgBotSheet`.
- When `···` is tapped, `setIsMobileMenuOpen(true)` in `App.tsx` opens the sheet

**Tab icon:** `MoreHorizontal` from lucide (three dots), `w-5 h-5`
**Label:** `MORE`

**Files:** `src/components/BottomTabBar.tsx`, `src/components/MobileMenu.tsx`, `src/App.tsx`

---

## Problem 3 — Replace Header on All Pages Except Landing

**Current:** All pages (Calculator, Glossary, Store, BudgetInfo, CapitalInfo, FeesInfo, WaterfallInfo, Auth, StorePackage, StoreCompare, NotFound) use `<Header />` which renders a full-width header bar with `FILMMAKER.OG` text.

**New pattern — Mini F Icon Header:**

Replace `<Header />` on all non-landing pages with a new component: `<MiniHeader />`.

`MiniHeader` renders:
- No full-width bar (no `bg-bg-header`, no fixed height)
- A centered block with:
  - The F icon at `w-8 h-8 object-contain` with the light/glow effect (same as landing page hero)
  - A subtle ambient radial glow behind it: `radial-gradient(circle, rgba(212,175,55,0.35) 0%, transparent 70%)` blurred — a "mini spotlight"
  - Tapping it navigates to `/`
- Fixed position at the top, `z-[150]`, height `~48px`
- NOT on the landing page — `Index.tsx` keeps `<Header />` as-is (it has the sticky CTA slot that only works with the full header)

**Visual result:** Every inner page has a small glowing F centered at the top — brand consistent, navigates home, takes up minimal space. The full `FILMMAKER.OG` text header is gone from inner pages.

**Implementation:**
- Create `src/components/MiniHeader.tsx` — new file, ~30 lines
- In each page that imports `Header`, replace with `MiniHeader`
- Remove the unused `rightSlot` prop pattern from inner pages
- `Index.tsx` keeps `<Header rightSlot={stickyCtaButton} />` exactly as-is

**Files:**
- New: `src/components/MiniHeader.tsx`
- Edit: `Calculator.tsx`, `Glossary.tsx`, `Store.tsx`, `StorePackage.tsx`, `StoreCompare.tsx`, `Auth.tsx`, `NotFound.tsx`, `WaterfallInfo.tsx`, `BudgetInfo.tsx`, `CapitalInfo.tsx`, `FeesInfo.tsx`

**The `--appbar-h` CSS variable is currently 56px.** Pages use it for their top padding. With `MiniHeader` we keep the same `48px` height so layouts don't break — just update the variable to `--appbar-h: 48px` in `index.css` and keep the spacer div at the same height.

---

## Problem 4 — Bot Sheet Contrast & Readability

**Current issues:**
- Sheet background: `#0D0900` — very dark brownish black, almost no contrast with text
- Messages area: very dark, text at `text-white/90` which should be fine but the dark background makes it feel murky
- Question bubbles: `bg-gold/[0.10]` — too subtle, hard to distinguish from the sheet bg
- Answer card: `background: "#080600"` — nearly black, no contrast
- Input area: `border-gold/10` separator — barely visible
- Example chips: `text-gold/60` and `bg-gold/[0.06]` — very hard to read

**Fix — Full contrast overhaul:**

**Sheet itself:**
- Background: `#0F0C00` → `#111008` — slightly warmer and slightly lighter, keeps the cinematic brown-black but more legible
- Add a stronger gold ambient glow at top: `boxShadow: "0 -8px 60px rgba(212,175,55,0.18), 0 -2px 30px rgba(0,0,0,0.90)"`

**Header band:**
- Border: `border-gold/20` → `border-gold/30`
- "ASK THE OG" gold pill: Keep as-is (already gold bg, good contrast)
- Add the `"Film industry Q&A"` subtitle visible on mobile too (remove `hidden sm:block`)

**Example chips (empty state):**
- Border: `border-gold/25` → `border-gold/40`
- Background: `bg-gold/[0.06]` → `bg-gold/[0.10]`
- Text: `text-gold/60` → `text-gold/80`
- Font size: `text-[12px]` → `text-[13px]`

**Question bubble (user message):**
- Border: `border-gold/30` → `border-gold/50`
- Background: `bg-gold/[0.10]` → `bg-gold/[0.15]`
- Text: `text-white/90` → `text-white` (full white)
- Font size: `text-[15px]` → `text-base` (same but explicit)

**Answer card:**
- Container background: `#080600` → `#131000` — a noticeably lighter near-black
- Container border: `border-gold/20` → `border-gold/35`
- Container shadow: `rgba(212,175,55,0.06)` → `rgba(212,175,55,0.14)` — visible glow
- Answer text: `text-white/90` → `text-white`
- Thinking text: `text-white/20` → `text-white/40`

**Input area:**
- Border-top separator: `border-gold/10` → `border-gold/25`
- Input container border: `border-gold/40` → `border-gold/55`
- Left accent line: keep `3px solid var(--gold)` ✓
- Placeholder: `placeholder-white/20` → `placeholder-white/35`
- `focus-within:border-gold` — keep ✓

**File:** `src/components/OgBotSheet.tsx`

---

## File Summary

| File | What Changes |
|---|---|
| `src/components/BottomTabBar.tsx` | Readability upgrade: inactive `white/55`, active indicator bar, `···` MORE tab |
| `src/components/MobileMenu.tsx` | Accept controlled `isOpen`/`onOpenChange` props so it can be triggered from tab bar |
| `src/App.tsx` | Add `isMobileMenuOpen` state, wire `MobileMenu` + new `···` tab together |
| `src/components/MiniHeader.tsx` | New file — small centered F icon with glow, replaces Header on inner pages |
| `src/pages/Calculator.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/Glossary.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/Store.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/StorePackage.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/StoreCompare.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/Auth.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/NotFound.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/WaterfallInfo.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/BudgetInfo.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/CapitalInfo.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/pages/FeesInfo.tsx` | Replace `<Header />` with `<MiniHeader />` |
| `src/components/OgBotSheet.tsx` | Full contrast overhaul on all message areas |
| `src/index.css` | Optionally reduce `--appbar-h` to `48px` to match slimmer mini header |

**`Index.tsx` is NOT touched** — the landing page keeps its full `<Header />` with the sticky CTA slot exactly as-is.

---

## What the App Will Feel Like After This

- **Tab bar:** Clearly legible at all times. Inactive tabs visible but subordinate. Active tab has a gold top-line indicator and subtle gold wash. The `···` tab is always there to reach Glossary, Share, Instagram.
- **Inner pages:** Opening Calculator, Store, or Glossary — a small glowing F icon centered at the top, tappable to go home. No text header cluttering the top.
- **Bot sheet:** Opens and the conversation is immediately readable. High contrast, warm dark background, gold accents pop against it. The chips are tappable. The answers feel like they belong to a premium product.
- **Landing page:** Unchanged. Full header, spotlight cones, cinematic F icon logo, sticky CTA.
