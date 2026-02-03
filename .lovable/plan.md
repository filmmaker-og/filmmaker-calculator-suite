

# Fix: Homepage Hamburger Menu - The Real Problem

## Root Cause Analysis

The Header component itself is correctly set to `z-[150]`. However, **in Index.tsx**, the Header is wrapped in a div that causes z-index stacking context issues:

```tsx
// Line 125-132 in Index.tsx
<div
  className={`relative z-[200] transition-all duration-500 ${
    animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
  }`}
  style={{ transitionDelay: animationPhase === 'complete' ? '100ms' : '0ms' }}
>
  <Header />
</div>
```

### Problems:
1. **During animation** (before 'complete'): The wrapper is invisible (`opacity-0`) but still captures mouse events - blocking clicks to anything behind it
2. **Stacking context conflict**: The wrapper has `relative z-[200]` but the Header inside has `fixed z-[150]`. The fixed element's z-index is relative to the viewport, not the parent, causing unpredictable behavior
3. **The wrapper doesn't need to exist** since the Header already handles its own positioning

---

## Solution

Remove the wrapper div entirely and let the Header manage its own visibility through props or internal state. The Header is already `fixed` positioned, so it doesn't need a wrapper for layout.

### File: `src/pages/Index.tsx`

**Before:**
```tsx
<div
  className={`relative z-[200] transition-all duration-500 ${
    animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
  }`}
  style={{ transitionDelay: animationPhase === 'complete' ? '100ms' : '0ms' }}
>
  <Header />
</div>
```

**After:**
```tsx
{animationPhase === 'complete' && <Header />}
```

This simply waits until the animation is complete before rendering the Header at all, eliminating all z-index conflicts.

---

## Why This Works

1. **No invisible blocking elements** - The Header only renders when it should be visible
2. **No stacking context conflicts** - The Header's `fixed z-[150]` works directly against the viewport
3. **Clean and simple** - No wrapper divs with competing z-index values
4. **The splash overlay (`z-[100]`)** will be below the Header (`z-[150]`) which is below the menu overlay (`z-[200]`)

---

## Z-Index Hierarchy (Final)

| Element | Z-Index | Notes |
|---------|---------|-------|
| Splash animation | `z-[100]` | Fades out when complete |
| Header bar | `z-[150]` | Fixed, only renders after animation |
| Menu overlay | `z-[200]` | Opens above everything |

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Remove wrapper div, conditionally render Header |

