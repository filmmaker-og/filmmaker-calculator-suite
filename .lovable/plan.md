

## Mobile UI/UX Enhancement Plan

### Issues Identified

#### 1. **"Jumping Around" Bug on Calculator Access**
The issue is caused by multiple factors:
- **Layout shift during auth check**: The Calculator page shows a loading spinner while checking auth state, then renders the full page. This causes a visible "jump" as the layout changes.
- **No smooth page transition**: Navigation from Index → Auth → Calculator has no transition, causing abrupt shifts.
- **Fixed header + spacer mismatch**: The `h-14` spacer assumes header height is always 14, but safe area padding (`safe-top`) can add additional height on notched devices, causing content to jump.
- **localStorage hydration flash**: When loading saved state from localStorage, multiple `setInputs`/`setGuilds`/`setCurrentStep` calls cause re-renders.

#### 2. **Index Page Mobile Issues**
- Header lacks safe area padding for notched phones
- "SERVICES" link hidden on mobile without clear alternative
- Legal footer button has tiny touch target (`text-[9px]`)
- No loading state when navigating

#### 3. **Auth Page Mobile Issues**
- Form inputs could benefit from better visual feedback
- Magic link sent state has no clear "back to home" action
- Demo Access link is subtle (intentional but could be more discoverable)

#### 4. **Calculator Mobile Issues**
- Progress bar step indicator is text-only, not tappable
- No visual indication of which steps are complete
- Step transitions are abrupt (no animation between steps)
- Bottom nav buttons don't have consistent width when "Previous" appears/disappears
- No pull-to-refresh or gesture navigation

#### 5. **Store Page Mobile Issues**
- MobileMenu is rendered but positioned incorrectly (not in header)
- No fixed header for navigation consistency
- Cards could benefit from better spacing on small screens

---

### Implementation Plan

#### Phase 1: Fix the "Jumping" Bug (Critical)

**1.1 Add CSS for smooth page transitions**
- Add `animate-fade-in` class to main content wrappers
- Ensure consistent initial state before hydration

**1.2 Fix Calculator loading state**
- Use a full-page skeleton that matches the final layout dimensions
- Prevent layout shift by maintaining header/footer structure during load

**1.3 Fix safe-area spacer calculation**
- Replace static `h-14` spacer with CSS calc that includes safe area
- Create a new utility class `header-spacer` that accounts for both

**1.4 Batch localStorage hydration**
- Load all values at once before rendering to prevent multiple re-renders

---

#### Phase 2: Index Page Mobile Improvements

**2.1 Add safe area to header**
- Add `safe-top` class to header
- Increase header height to accommodate

**2.2 Improve legal footer touch target**
- Increase font size from `text-[9px]` to `text-xs`
- Add padding for 44px touch target

**2.3 Add page transition**
- Wrap content in `animate-fade-in` for smooth entrance

---

#### Phase 3: Calculator Page Mobile Improvements

**3.1 Create tappable step indicators**
- Replace text "Step 1 of 6" with visual dots/pills
- Allow direct navigation to completed steps
- Visual distinction for current, completed, and upcoming steps

**3.2 Improve bottom navigation consistency**
- When on Step 1 (no "Previous" button), center the "NEXT STEP" button
- Use consistent button sizing regardless of step

**3.3 Add step transition animations**
- Fade out current step, fade in next step
- Or horizontal slide animation for forward/back navigation

**3.4 Fix header spacer for safe areas**
- Dynamic spacer that includes `var(--safe-area-top)`

---

#### Phase 4: Store Page Mobile Fixes

**4.1 Implement proper header layout**
- Match the command bar pattern from other pages
- Move MobileMenu to header right side
- Add safe area support

**4.2 Improve card spacing**
- Better padding on mobile for thumb-friendly interactions

---

### Technical Implementation Details

#### File Changes Summary

| File | Changes |
|------|---------|
| `src/index.css` | Add `.header-spacer`, improve `animate-fade-in`, add step indicator styles |
| `src/pages/Index.tsx` | Add safe area to header, improve legal footer touch target |
| `src/pages/Calculator.tsx` | Fix loading skeleton, add tappable step indicators, fix spacer, improve nav consistency |
| `src/pages/Auth.tsx` | Minor polish, ensure consistent transitions |
| `src/pages/Store.tsx` | Proper header structure with MobileMenu, safe areas |

---

### Detailed Code Changes

#### 1. `src/index.css` - New Utilities
```css
/* Header spacer that accounts for safe area */
.header-spacer {
  height: calc(56px + var(--safe-area-top));
}

/* Smooth page entrance */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Step indicator pills */
.step-pill {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.step-pill.completed { background: #D4AF37; }
.step-pill.current { background: #D4AF37; box-shadow: 0 0 8px rgba(212, 175, 55, 0.5); }
.step-pill.upcoming { background: #333; }
```

#### 2. `src/pages/Calculator.tsx` - Loading & Step Indicators
- Replace current loading state with skeleton that maintains layout
- Add step indicator component with dots that are tappable for completed steps
- Fix spacer height to use CSS variable
- Ensure bottom nav has consistent layout

**Loading Skeleton Structure:**
```tsx
if (loading) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header skeleton - same dimensions as real header */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 border-b border-zinc-900 safe-top" style={{ backgroundColor: '#000000' }}>
        <div className="w-12 h-12" /> {/* Home placeholder */}
        <span className="flex-1 text-center font-bebas text-lg tracking-widest text-gold">
          WATERFALL TERMINAL
        </span>
        <div className="w-12 h-12" /> {/* Menu placeholder */}
      </header>
      <div className="header-spacer" />
      {/* Content skeleton */}
      <div className="flex-1 flex items-center justify-center">
        <div className="skeleton-gold w-16 h-16 rounded-full" />
      </div>
    </div>
  );
}
```

**Step Indicator Component:**
```tsx
const StepIndicator = ({ currentStep, onStepClick }: { currentStep: number; onStepClick: (step: number) => void }) => (
  <div className="flex items-center justify-center gap-3">
    {[1, 2, 3, 4, 5, 6].map((step) => (
      <button
        key={step}
        onClick={() => step <= currentStep && onStepClick(step)}
        disabled={step > currentStep}
        className={`step-pill ${
          step < currentStep ? 'completed' : 
          step === currentStep ? 'current' : 'upcoming'
        } ${step <= currentStep ? 'cursor-pointer' : 'cursor-default'}`}
        aria-label={`Go to step ${step}`}
      />
    ))}
  </div>
);
```

#### 3. `src/pages/Index.tsx` - Safe Areas & Touch Targets
- Add `safe-top` to header
- Increase legal footer touch target size

#### 4. `src/pages/Store.tsx` - Proper Header
- Restructure header to match command bar pattern
- Move MobileMenu to proper position
- Add safe area support

---

### Expected Outcomes

1. **No more jumping**: Layout remains stable during auth check and page transitions
2. **Better navigation**: Users can tap step indicators to jump to completed steps
3. **Consistent experience**: All pages have matching header patterns and safe areas
4. **Smoother transitions**: Fade animations make navigation feel polished
5. **Improved touch targets**: All interactive elements meet 44px minimum

