
# Minimal Dots Progress Bar

## Design

Replace the numbered badges with clean 8px dots that feel native and premium:

```text
    ●────────○────────○────────○
 completed  current  future   future
  (gold)   (ring)   (dim)    (dim)
```

### Dot States
- **Completed**: Solid gold fill (8px)
- **Current**: Gold ring/outline with slight glow (8px)
- **Future**: Dim grey outline (8px)

### Connection Line
- Thin 1px line connecting dots
- Uses same gold dash pattern at 30% opacity
- No animated fill needed (dots tell the story)

---

## Technical Changes

### `src/components/calculator/ProgressBar.tsx`

| Change | Details |
|--------|---------|
| Dot size | Reduce from `w-6 h-6` (24px) to `w-2 h-2` (8px) |
| Remove numbers | No text inside dots |
| Remove checkmarks | Just solid fill for completed |
| Completed state | `bg-gold` solid fill |
| Current state | `border border-gold` ring + subtle `box-shadow` glow |
| Future state | `border border-white/20` dim ring |
| Line adjustment | Align to smaller dots, keep dashed pattern |
| Touch target | Wrap dots in larger invisible button for accessibility (44px) |
| Animation | Add `scale(1.25)` on current dot for emphasis |

---

## Code Preview

```tsx
// Dot instead of numbered badge
<button
  className={cn(
    "relative z-10 flex items-center justify-center",
    "w-11 h-11", // 44px touch target
    "transition-all duration-200"
  )}
  onClick={() => isCompleted && onStepClick?.(stepNum)}
  disabled={!isCompleted}
>
  <span
    className={cn(
      "w-2 h-2 rounded-full transition-all duration-200",
      isActive && "border-2 border-gold scale-125",
      isActive && "shadow-[0_0_8px_rgba(212,175,55,0.5)]",
      isCompleted && "bg-gold",
      isFuture && "border border-white/20"
    )}
  />
</button>
```

---

## Visual Result

- Ultra-clean, minimal iOS-style navigation
- Current step has subtle glow + scale for emphasis
- No text clutter - just dots
- Maintains accessibility with proper touch targets
