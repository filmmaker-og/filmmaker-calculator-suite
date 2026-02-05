
# Fix Intro Spotlight + Build Error

## Problem Summary

1. **"Necklace" Effect**: The current spotlight gradient creates a soft circular blob at `50% 30%` - this looks like a pendant hanging, not a dramatic stage spotlight
2. **Build Error**: TypeScript error in StackTab.tsx where the glossary prop expects a specific literal type

---

## Phase 1: Fix Build Error (StackTab.tsx)

The `CapitalSourceCard` component's `glossary` prop is typed as `typeof GLOSSARY.seniorDebt`, which is a **literal type** that only matches the exact seniorDebt object. When passing custom glossary objects for Tax Credits, TypeScript rejects it.

**Fix**: Change the glossary prop type to accept any glossary-like object:

```typescript
// Line 48 - Change from:
glossary: typeof GLOSSARY.seniorDebt;

// To:
glossary: {
  term: string;
  title: string;
  description: string;
  details?: React.ReactNode;
};
```

---

## Phase 2: Transform Intro to Cinematic Spotlight

### Current Problem

The current gradient creates a soft ellipse blob:
```
      ╭─────────────────────╮
      │   ∙ ∙ ∙ ∙ ∙ ∙ ∙     │  ← Soft blob (looks like pendant)
      │  ∙ ∙ ∙ ∙ ∙ ∙ ∙ ∙   │
      │   ∙ ∙ ∙ ∙ ∙ ∙ ∙     │
      ╰─────────────────────╯
```

### Spotlight Effect Goal

Create a theatrical spotlight beam that originates from above and fans out:
```
            ▽ Spotlight source (top edge)
           /|\
          / | \
         /  |  \
        /   |   \
       /____|____\   ← Beam spreads downward
           [LOGO]
```

### Implementation Strategy

**Layer 1: Spotlight Beam (Cone Shape)**
- Use a **conic gradient** or layered radial gradients to simulate a cone
- Origin: Top center of screen
- Shape: Narrow at top, wide at bottom (inverted cone)
- Color: Subtle gold glow with soft edges

**Layer 2: Focal Circle**
- A soft radial gradient centered on the logo
- This is where the spotlight "lands"
- Creates the illuminated circle effect on stage

**Layer 3: Dust Particles (Optional)**
- Very subtle floating specs in the beam
- Adds depth and realism

### CSS Changes (index.css)

Add new keyframes for the spotlight beam animation:

```css
@keyframes spotlight-beam-in {
  0% {
    opacity: 0;
    clip-path: polygon(48% 0%, 52% 0%, 52% 0%, 48% 0%);
  }
  100% {
    opacity: 1;
    clip-path: polygon(35% 0%, 65% 0%, 85% 100%, 15% 100%);
  }
}

@keyframes spotlight-glow-pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.9;
  }
}
```

### Component Structure (Index.tsx)

Replace the current spotlight div with a more theatrical setup:

```tsx
{/* SPOTLIGHT BEAM - Cone from above */}
<div
  className={cn(
    "absolute inset-0 pointer-events-none transition-opacity duration-700",
    showSpotlight ? "opacity-100" : "opacity-0"
  )}
  style={{
    background: `
      linear-gradient(
        180deg,
        rgba(255, 215, 0, 0.25) 0%,
        rgba(255, 215, 0, 0.08) 30%,
        transparent 60%
      )
    `,
    clipPath: 'polygon(40% 0%, 60% 0%, 80% 100%, 20% 100%)',
    filter: 'blur(40px)',
  }}
/>

{/* FOCAL POOL - Where the light lands */}
<div
  className={cn(
    "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
    "w-[300px] h-[300px] pointer-events-none",
    "transition-all duration-700",
    showLogo ? "opacity-100 scale-100" : "opacity-0 scale-75"
  )}
  style={{
    background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
    filter: 'blur(30px)',
  }}
/>
```

### Visual Comparison

| Element | Current | New |
|---------|---------|-----|
| Shape | Ellipse blob | Cone beam + focal pool |
| Origin | Center (30% from top) | Top edge, fans downward |
| Feel | Pendant/necklace | Theater spotlight |
| Layers | 1 gradient | 2-3 layered effects |

---

## Phase 3: Enhanced Animation Sequence

Adjust timing to emphasize the dramatic spotlight:

| Phase | Time | What Happens |
|-------|------|--------------|
| `dark` | 0ms | Pure black, no light |
| `spotlight` | 300ms | Beam fans open from above (clip-path animation) |
| `logo` | 800ms | Logo fades up into the light pool |
| `pulse` | 1600ms | Light intensifies briefly |
| `tagline` | 2200ms | Tagline + progress bar appear |
| `complete` | 3200ms | Fade to homepage |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/calculator/tabs/StackTab.tsx` | Fix glossary prop type to accept generic object |
| `src/pages/Index.tsx` | Replace spotlight with cone beam + focal pool structure |
| `src/index.css` | Add spotlight-beam-in keyframe animation |

---

## Technical Notes

- **clip-path polygon**: Creates the cone shape by defining 4 points (narrow top, wide bottom)
- **filter: blur()**: Softens edges for realistic light diffusion
- **Layered gradients**: Multiple gradients stacked create depth and realism
- **No clip-path on mobile fallback**: Some older browsers may not animate clip-path, so we use opacity as fallback
