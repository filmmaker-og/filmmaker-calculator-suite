
# Fix: Homepage Menu Accessibility Issue

## Problem Identified

The hamburger menu on the homepage is intermittently inaccessible. After analyzing the code, I found a potential z-index and pointer-events timing conflict.

## Root Cause Analysis

Looking at the z-index layers in `Index.tsx`:

| Element | Z-Index | Notes |
|---------|---------|-------|
| Cinematic Splash | `z-[100]` | Gets `opacity-0 pointer-events-none` when complete |
| Header | `z-[150]` | Only mounts after animation completes |
| Mobile Menu Overlay | `z-[200]` | Opens on top of everything |

**The Issue:** The cinematic splash overlay at `z-[100]` is positioned **below** the header at `z-[150]`, BUT:

1. The splash has `fixed inset-0` which covers the entire viewport
2. When `isComplete` becomes true, `pointer-events-none` is applied
3. However, the opacity transition takes 500ms to complete
4. On some mobile browsers, the stacking context can cause touch events to be swallowed during this transition

**Secondary Issue:** The parent container has `overflow-hidden` which can interfere with fixed-position touch targets on iOS Safari.

## Solution

### Fix 1: Ensure Splash is Fully Non-Interactive Immediately

Update the cinematic splash to guarantee no pointer events block the header:

```tsx
// In Index.tsx - Line 38-41
<div
  className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
    isComplete ? 'opacity-0' : 'opacity-100'
  }`}
  style={{ 
    backgroundColor: '#000000',
    pointerEvents: isComplete ? 'none' : 'auto',  // Inline style for immediate effect
  }}
>
```

This uses inline `pointerEvents` style instead of Tailwind class to ensure it takes effect immediately with no CSS transition delay.

### Fix 2: Move Header Outside the Overflow Container

Restructure the page so the Header renders outside the `overflow-hidden` container:

```tsx
// Current structure (problematic):
<div className="min-h-screen ... overflow-hidden">
  {/* Splash */}
  {isComplete && <Header />}  // Inside overflow container
  <main>...</main>
</div>

// Fixed structure:
<>
  {isComplete && <Header />}  // Outside, at root level
  <div className="min-h-screen ... overflow-hidden">
    {/* Splash */}
    <main>...</main>
  </div>
</>
```

This prevents iOS Safari from potentially clipping touch targets on the fixed header.

### Fix 3: Add Explicit Touch Target Styling

Ensure the hamburger button has proper touch handling:

```tsx
// In MobileMenu.tsx - Hamburger button
<button
  onClick={handleOpenMenu}
  className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-all duration-100 -mr-1 relative z-10"
  style={{ touchAction: 'manipulation' }}  // Prevents touch delay
  aria-label="Open menu"
>
```

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Move Header outside overflow container, use inline pointerEvents |
| `src/components/MobileMenu.tsx` | Add `touchAction: 'manipulation'` to button |

## Technical Notes

- The `touchAction: 'manipulation'` CSS property eliminates the 300ms tap delay on mobile browsers
- Using inline `pointerEvents` style ensures immediate effect without waiting for CSS transition
- Moving the Header outside `overflow-hidden` prevents iOS Safari's aggressive touch target optimization from interfering

## Testing Checklist

After implementation:
1. Load homepage on mobile
2. Wait for splash animation to complete
3. Tap hamburger menu immediately - should open
4. Tap close button - should close
5. Navigate to Calculator and back - menu should still work
