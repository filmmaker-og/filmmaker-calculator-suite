

# Mobile UX Overhaul: Fix Visual Issues + App-Like Improvements

## Issues Identified

### 1. Data Overlapping & Cut-off Content
**Root Cause Analysis:**
- **WizardStep5 (Output - Priority of Payments)**: The 3-column hero metrics grid (`grid-cols-3`) is too cramped on small mobile screens, causing text to overlap
- **Currency values in the flow items** are displayed with `text-lg` which combined with the status badge creates horizontal overflow
- The `truncate` class is hiding important data instead of wrapping it properly

### 2. "Weird Haze" Effect
**Root Cause Analysis:**
- The **vignette gradient** on the Index page (`radial-gradient(ellipse at center, rgba(30,30,30,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)`) creates a grey haze in the center of the screen
- The `premium-input` focus styles (`box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15)`) combined with the dark backgrounds create visual noise
- Multiple overlapping opacity effects during swipe (`opacity: 1 - Math.abs(swipeState.offset) / 300`) create transparency issues

### 3. App-Like Functionality Gaps
**Current Issues:**
- **No clear visual separation** between input steps (1-4) and output steps (5-6)
- **Step transitions are jerky** - content just appears without smooth animation
- **Console warnings** about refs on WizardStep6 and RestrictedAccessModal (need forwardRef)
- **No bottom sheet pattern** for the output summary - feels like a web page not an app
- **Currency formatting** at larger numbers gets cut off on mobile

---

## Solution Plan

### Phase 1: Fix Critical Visual Bugs

#### 1.1 Fix WizardStep5 Layout (Priority of Payments)
**Problem**: 3-column grid causes overlap on small screens

**Solution**:
- Change hero metrics from `grid-cols-3` to a stacked vertical layout on mobile
- Make ROI the hero metric (large, prominent) 
- Stack Net Profit and Breakeven below as secondary metrics
- Reduce font sizes for better fit
- Remove `truncate` in favor of allowing natural wrapping

**Changes to `WizardStep5.tsx`**:
```tsx
// BEFORE: grid-cols-3 gap-3
// AFTER: Single column stack with ROI as hero

{/* HERO METRIC - ROI only */}
<div className="p-5 rounded-sm text-center" style={{ ... }}>
  <p className="font-bebas text-4xl">{formatPercent(roi)}</p>
</div>

{/* SECONDARY METRICS - 2 column grid */}
<div className="grid grid-cols-2 gap-3">
  {/* Net Profit + Breakeven side by side */}
</div>
```

#### 1.2 Fix Currency Display Overflow
**Problem**: Long dollar amounts like `$1,200,000` overflow containers

**Solution**:
- Use responsive font sizing (`text-sm sm:text-base` instead of fixed `text-lg`)
- Add `overflow-hidden text-ellipsis` with proper min-width
- Shorten large numbers to `$1.2M` format when over 1 million

**New Utility Function**:
```typescript
const formatCompactCurrency = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return formatCurrency(value);
};
```

#### 1.3 Remove/Fix the "Haze" Effect
**Problem**: Vignette creates grey haze making content hard to read

**Solution**:
- Remove the vignette radial gradient from Index page entirely
- Keep the pure black background for maximum contrast
- Reduce the intensity of focus glow effects on inputs

**Changes to `Index.tsx`**:
```tsx
// REMOVE this entire block:
<div 
  className="absolute inset-0 pointer-events-none"
  style={{
    background: 'radial-gradient(ellipse at center, rgba(30,30,30,0.3) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,1) 100%)'
  }}
/>
```

**Changes to `index.css`**:
```css
/* Reduce premium-input glow intensity */
.premium-input:focus {
  transform: scale(1.01);
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1); /* Reduced from 3px/0.15 */
  border-color: hsl(var(--gold)) !important;
}
```

---

### Phase 2: Improve Output Data Presentation

#### 2.1 Redesign WizardStep5 (Performance Metrics)
**Goal**: Make output data scannable and clear on mobile

**New Layout**:
```
┌────────────────────────────────┐
│         🏆 ROI: 218%           │  ← Hero metric, large gold text
│       ■■■■■■■■■□□ PROFITABLE   │  ← Visual status indicator
└────────────────────────────────┘

┌──────────────┬──────────────┐
│ Net Profit   │  Breakeven   │
│  +$520,000   │   $2.98M     │
└──────────────┴──────────────┘

┌────────────────────────────────┐
│ PRIORITY OF PAYMENTS       ⓘ  │
├────────────────────────────────┤
│ 1. First Money Out    $485K ✓ │
│ 2. Debt Service       $660K ✓ │
│ 3. Equity + Premium   $1.2M ✓ │
│ 4. Net Profit Pool    $520K ✓ │  ← Gold highlight
└────────────────────────────────┘
```

**Key Changes**:
- Single prominent ROI hero metric
- Status badge shows "PROFITABLE" or "UNPROFITABLE"
- Compact currency format for large numbers
- Vertical list with clear paid/unpaid status
- Remove accordion, show all items by default

#### 2.2 Redesign WizardStep6 (Settlement)
**Goal**: Clear investor vs producer breakdown

**New Layout**:
```
┌────────────────────────────────┐
│         SETTLEMENT             │
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ 👤 PRODUCER POOL           │ │
│ │    $260,000                │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ 💼 INVESTOR NET            │ │  ← Gold border
│ │    $1,460,000              │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘

┌────────────────────────────────┐
│ ⓘ KEY METRICS                  │
│ Breakeven: $2.98M | ROI: 1.3x  │
│ Profit Pool: $520K | Recoup: ✓ │
└────────────────────────────────┘
```

**Key Changes**:
- Stacked cards instead of side-by-side
- Larger, more readable currency values
- Horizontal scrollable metric pills for secondary data
- Warning card only appears if ROI < 1.2x

---

### Phase 3: App-Like Polish

#### 3.1 Fix React Ref Warnings
**Problem**: Console warns about refs on WizardStep6 and RestrictedAccessModal

**Solution**: Wrap components with `forwardRef` or remove ref dependencies

```tsx
// RestrictedAccessModal.tsx
const RestrictedAccessModal = forwardRef<HTMLDivElement, Props>(({ isOpen, onClose }, ref) => {
  // ...
});
```

#### 3.2 Smoother Step Transitions
**Current**: Content just appears/disappears
**Improved**: Add slide + fade animation between steps

**Changes to Calculator.tsx**:
```tsx
// Add transition wrapper with direction awareness
<main 
  className="step-content"
  key={currentStep}
  style={{
    animation: 'stepEnter 0.25s ease-out'
  }}
>
```

**New CSS**:
```css
@keyframes stepEnter {
  from { 
    opacity: 0; 
    transform: translateX(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0); 
  }
}
```

#### 3.3 Visual Step Type Indicator
**Improvement**: Show users they're entering "Results" mode

**Add a divider before Step 5**:
```tsx
{currentStep === 5 && (
  <div className="mb-4 flex items-center gap-3">
    <div className="h-px flex-1 bg-zinc-800" />
    <span className="text-[10px] uppercase tracking-widest text-zinc-500">
      RESULTS
    </span>
    <div className="h-px flex-1 bg-zinc-800" />
  </div>
)}
```

#### 3.4 Consistent Touch Feedback
**Improvement**: Ensure all interactive elements have haptic + visual feedback

- Add `touch-press` class to all buttons universally (already done in button.tsx)
- Add subtle scale on press to step indicator pills
- Add haptic pulse when entering results (Step 5)

---

## Implementation Summary

| File | Changes |
|------|---------|
| `src/index.css` | Remove haze effect, reduce glow intensity, add step animations |
| `src/pages/Index.tsx` | Remove vignette gradient |
| `src/components/calculator/WizardStep5.tsx` | Complete redesign - vertical layout, compact currencies, cleaner data presentation |
| `src/components/calculator/WizardStep6.tsx` | Stacked cards, horizontal metric pills, cleaner layout |
| `src/lib/waterfall.ts` | Add `formatCompactCurrency()` helper |
| `src/pages/Calculator.tsx` | Add step transition animations, results divider |
| `src/components/RestrictedAccessModal.tsx` | Add forwardRef to fix console warning |

---

## Expected Outcomes

1. **No more overlapping data** - Vertical stacking and responsive font sizes prevent overflow
2. **No more haze** - Pure black backgrounds with minimal glow effects
3. **Clear data hierarchy** - ROI is the hero, supporting metrics are secondary
4. **Feels like an app** - Smooth transitions, haptic feedback, visual polish
5. **No console warnings** - Clean React component structure

