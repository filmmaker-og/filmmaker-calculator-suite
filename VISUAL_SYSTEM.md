# Visual Design System

## Overview
This document defines the standardized visual system for all calculator steps. All components must follow these rules to maintain consistency.

---

## Core Principles

### 1. **Single Source of Truth**
All steps use `StandardStepLayout` component. No custom layouts.

### 2. **Brand Color Adherence**
Stick to the brand guidelines:
- **Black**: `#000000` (backgrounds)
- **White**: Text
- **Metallic Gold**: `#D4AF37` (trust elements, diagrams, accents)
- **Bright Gold**: `#F9E076` (CTAs ONLY)

**No emerald green. No red. Only gold intensity variations.**

### 3. **Visual Restraint**
Less is more. One focal point per step.

---

## Standardized Elements

### Icon Treatment
**ALWAYS USE:**
```tsx
<div className="relative w-14 h-14 border border-gold/30 bg-gold/5">
  <Icon className="w-7 h-7 text-gold" />
</div>
```

**Glow:**
```tsx
style={{
  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
  filter: 'blur(15px)',
  transform: 'scale(2)',
}}
```

**NO MORE:**
- ✗ Random sizes (w-16, w-20)
- ✗ Different border weights
- ✗ Different glow intensities
- ✗ Pulsing animations on icons

---

### Header Sizing
**ALWAYS USE:**
```tsx
<h2 className="font-bebas text-3xl tracking-[0.08em]">
```

**NO MORE:**
- ✗ text-4xl (except maybe final results)
- ✗ Random hierarchy

---

### Section Headers
**ALWAYS USE:**
```tsx
<div className="matte-section-header px-5 py-3">
  {SectionIcon && <SectionIcon className="w-4 h-4 text-gold/60" />}
  <span className="text-xs uppercase tracking-wider text-white/40">
    {label}
  </span>
  {isCompleted && (
    <span className="text-xs text-gold font-mono">✓</span>
  )}
</div>
```

**NO MORE:**
- ✗ Gradient backgrounds
- ✗ Pulsing dots
- ✗ font-semibold variations
- ✗ Different padding (py-3 vs py-4)
- ✗ Color changes for completion (emerald-400 etc)

---

### Status Indicators
**Use gold intensity for status:**

**Above target:**
```tsx
border-gold/30 bg-gold/5
text-gold
```

**Below target:**
```tsx
border-gold/20 bg-gold/[0.02]
text-gold/50
```

**NO MORE:**
- ✗ Emerald green for success
- ✗ Red for failure
- ✗ Progress bar animations
- ✗ Animated counters

---

### Animations
**ALLOWED:**
- Static icon glow (no pulse)
- Collapsible transitions
- Input focus states

**REMOVED:**
- ✗ animate-pulse on dots
- ✗ animate-pulse-slow on glows
- ✗ requestAnimationFrame counters
- ✗ Progress bar fills
- ✗ Multiple simultaneous animations

---

## Migration Guide

To migrate an existing step:

### 1. Import StandardStepLayout
```tsx
import StandardStepLayout from "../StandardStepLayout";
```

### 2. Replace custom header/icon code
**Before:**
```tsx
<div className="relative w-20 h-20 border-2 border-gold/50">
  <Icon className="w-10 h-10" />
</div>
<h2 className="font-bebas text-4xl">
  Title
</h2>
```

**After:**
```tsx
<StandardStepLayout
  icon={Icon}
  title="First part"
  titleHighlight="second part"
  subtitle="Description"
  sectionLabel="Section Name"
  isCompleted={isCompleted}
>
  {/* Your input components */}
</StandardStepLayout>
```

### 3. Add contextCard (optional)
For cards that appear above main input:
```tsx
contextCard={
  <div className="glass-card-gold p-4">
    {/* Context content */}
  </div>
}
```

### 4. Add quickReference (optional)
For info that appears below input:
```tsx
quickReference={
  <div className="py-4 px-5 bg-[#0A0A0A] border border-[#1A1A1A]">
    {/* Reference content */}
  </div>
}
```

### 5. Add helpContent (optional)
For collapsible help:
```tsx
helpContent={
  <Collapsible>
    {/* Help content */}
  </Collapsible>
}
```

---

## Examples

See refactored components:
- `src/components/calculator/steps/BudgetStep.tsx`
- `src/components/calculator/steps/AcquisitionStep.tsx`

---

## Why These Changes?

### Problem: Visual Inconsistency
- Every step looked different
- Icon sizes: w-14, w-16, w-20
- Header sizes: text-3xl, text-4xl
- Border weights: border, border-2
- Glow intensities: blur(15px), blur(20px), blur(25px)

### Problem: Too Many Animations
- Pulsing icons
- Pulsing dots  
- Animated counters
- Progress bars
- All competing for attention

### Problem: Brand Color Violations
Brand guide says gold only, but code used:
- Emerald green (success)
- Red (failure)
- Diluted premium aesthetic

### Solution: Standardization
One component. One set of rules. Consistent experience.

---

## Next Steps

To fully standardize the app:

1. ✓ Create StandardStepLayout
2. ✓ Refactor BudgetStep
3. ✓ Refactor AcquisitionStep
4. □ Refactor remaining 11 steps:
   - SalesAgentStep
   - GuildsStep
   - CamFeeStep
   - TaxCreditsStep
   - SeniorDebtStep
   - GapLoanStep
   - EquityStep
   - BreakevenStep
   - OffTopTotalStep
   - CapitalSelectStep
   - WaterfallStep
   - RevealStep

---

## Questions?

Refer to brand guidelines: `Brand-Guidline_OG.md`

Color system defined in Section 3.1: Visual Identity System
