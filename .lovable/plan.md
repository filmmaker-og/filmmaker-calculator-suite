

# Implement Progress Bar + Glowing Menu Logo

## What We're Building

1. **Progress Bar** - Fixed below the calculator header showing 4 step badges with a connecting gold line
2. **Glowing F Logo** - Add the logo icon with gold glow above "PRODUCER'S SERVICES" in the mobile menu

---

## Changes

### 1. Calculator Page (`src/pages/Calculator.tsx`)

- Import `ProgressBar` component
- Add it below the header spacer
- Create tab-to-step mapping (budget=1, stack=2, deal=3, waterfall=4)
- Wire up `onStepClick` to allow tapping completed steps to navigate back
- Add spacer for the fixed progress bar height

### 2. Progress Bar (`src/components/calculator/ProgressBar.tsx`)

- Make it fixed-position at `top: var(--appbar-h)`
- Change background to matte grey (`#1A1A1A`)
- Set `z-index: 40` (below header)
- Keep the existing badge + line logic

### 3. Mobile Menu (`src/components/MobileMenu.tsx`)

- Import `filmmakerLogo` from assets
- Add logo image (72x72px) above the navigation links
- Apply gold glow filter:
  ```
  filter: brightness(1.15) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))
  ```
- Add subtle radial aura gradient behind it

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Calculator.tsx` | Add ProgressBar below header, wire up navigation |
| `src/components/calculator/ProgressBar.tsx` | Fixed position, matte grey background |
| `src/components/MobileMenu.tsx` | Add glowing F logo above nav links |

