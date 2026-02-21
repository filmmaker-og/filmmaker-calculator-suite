

# Header Floating Bar + Rounded Corner Brackets

## Two Changes

### 1. Header — Float It Like the Footer

Right now the header stretches edge-to-edge across the full screen width. The bottom nav is a floating box-rounded pill (340px max, 16px radius, gold border ring). The user wants the header to match that language — a floating bar, centered, with a gold border ring and rounded corners — but **wider** than the footer pill since it holds more content (logo + CTA + icons).

**Spec:**
- The outer `<header>` wrapper stays `fixed top-0 left-0 right-0` but becomes **transparent** (no background on the full-width container)
- Inside it, a centered `<div>` becomes the actual visible bar:
  - `max-width: 420px` (wider than footer's 340px, but not full-width)
  - `border-radius: 16px` (same as footer)
  - `background: rgba(10,10,10,0.88)` with backdrop blur (same as current)
  - `border: 1.5px solid rgba(212,175,55,0.35)` — gold ring matching footer
  - `box-shadow` matching footer's float effect
  - `margin-top: 12px` — breathing room from top edge (mirrors footer's 12px bottom margin)
- Remove the full-width gold gradient separator lines (top and bottom) — the gold border ring replaces them
- Add a subtle gold top-edge gradient line inside the bar (1px, like footer has)

**File:** `src/components/AppHeader.tsx`

### 2. Corner Brackets — Slight Round

The four gold corner brackets on the final CTA section (lines 1016-1023 of `Index.tsx`) are currently sharp rectangles (`w-12 h-[2px]` and `w-[2px] h-12` divs). The user wants them "a tad round" — not fully rounded, just softened.

**Fix:** Add `rounded-full` to each of the 8 corner accent divs. Since they're only 2px thick, `rounded-full` (999px) will give them softly capped ends — like a gold pen stroke rather than a sharp cut rectangle. This is the minimal change that removes the "boxy" feeling while keeping the cinematic bracket aesthetic.

**File:** `src/pages/Index.tsx` — add `rounded-full` to all 8 corner bracket divs (lines 1016-1023)

## Files Changed

| File | Change |
|---|---|
| `src/components/AppHeader.tsx` | Restructure to floating centered bar (420px max, 16px radius, gold border ring, 12px top margin) matching footer's floating language |
| `src/pages/Index.tsx` | Add `rounded-full` to all 8 gold corner bracket divs in the final CTA section |

