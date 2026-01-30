

# 5 Premium Mobile UI/UX Improvements + Haptics

## Overview
These enhancements will transform the app from a functional mobile experience to a **premium, native-feeling** application with tactile feedback and seamless interactions.

---

## 1. Haptic Feedback System

Add haptic feedback for all interactive elements to create a tactile, premium feel.

**What it does:**
- Light tap on buttons and toggles
- Medium impact on step changes
- Success vibration on form submissions
- Subtle buzz on swipe gestures

**Technical Implementation:**
Create a `use-haptics.ts` hook that wraps the Vibration API with fallbacks:

```typescript
// src/hooks/use-haptics.ts
export const useHaptics = () => {
  const vibrate = (pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  return {
    light: () => vibrate(10),      // Quick tap
    medium: () => vibrate(25),     // Button press
    heavy: () => vibrate(50),      // Important action
    success: () => vibrate([30, 50, 30]), // Success pattern
    error: () => vibrate([50, 30, 50, 30, 50]), // Error pattern
  };
};
```

**Where to apply:**
- Step indicator pill taps
- Next/Previous button presses
- Swipe gesture completion
- Form submissions (magic link sent)
- Guild toggles in Step 3
- CTA button presses

---

## 2. Smooth Page Transitions with Shared Element Animation

Replace abrupt page changes with fluid, iOS-style transitions.

**What it does:**
- Fade + slide transitions between routes
- Shared element morphing (brand logo animates between pages)
- Hardware-accelerated animations

**Technical Implementation:**
Create a transition wrapper component:

```css
/* New animation keyframes */
@keyframes slideInFromRight {
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutToLeft {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-30px); opacity: 0; }
}

.page-enter { animation: slideInFromRight 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.page-exit { animation: slideOutToLeft 0.2s cubic-bezier(0.4, 0, 1, 1); }
```

**Files to modify:**
- `src/index.css` - Add new keyframes
- `src/App.tsx` - Wrap routes with AnimatePresence-like logic
- All page components - Add transition classes

---

## 3. Premium Input Interactions

Upgrade all form inputs with micro-interactions that feel responsive and polished.

**What it does:**
- Inputs gently scale up on focus (1.01x)
- Floating labels that animate into position
- Subtle glow effect on focus
- Number inputs with increment/decrement gestures
- Value changes animate smoothly

**Technical Implementation:**

```css
/* Enhanced input styling */
.premium-input {
  transition: transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.premium-input:focus {
  transform: scale(1.01);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15), 0 0 20px rgba(212, 175, 55, 0.1);
  border-color: #D4AF37;
}

/* Number value animation */
.value-change {
  animation: valuePop 0.2s ease-out;
}

@keyframes valuePop {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); color: #F9E076; }
  100% { transform: scale(1); }
}
```

**Files to modify:**
- `src/index.css` - Add premium input classes
- `src/components/calculator/WizardStep1.tsx` through `WizardStep4.tsx` - Apply new classes
- Add haptic feedback on value changes

---

## 4. Gesture-Enhanced Navigation with Visual Feedback

Upgrade the swipe navigation to show real-time visual feedback during gestures.

**What it does:**
- Content follows your finger during swipe
- Opacity fades as you swipe away
- Rubber-band effect at boundaries (can't go past step 1 or 6)
- Step indicator pills animate in the direction of swipe
- Haptic pulse when completing a swipe

**Technical Implementation:**

Upgrade `use-swipe.ts` to track position and expose progress:

```typescript
interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onProgress?: (progress: number, direction: 'left' | 'right') => void;
  threshold?: number;
}
```

Add visual feedback component:

```tsx
// In Calculator.tsx
<main 
  style={{
    transform: `translateX(${swipeProgress}px)`,
    opacity: 1 - Math.abs(swipeProgress) / 300,
    transition: swiping ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out',
  }}
>
```

**Files to modify:**
- `src/hooks/use-swipe.ts` - Add progress tracking
- `src/pages/Calculator.tsx` - Apply transform styles during swipe
- `src/components/calculator/StepIndicator.tsx` - Animate pills during swipe

---

## 5. Refined Touch Feedback & Micro-animations

Add subtle but impactful micro-animations throughout the app.

**What it does:**
- Buttons have subtle press-down effect (not just scale)
- Cards have depth shadow on press
- Success states animate (checkmarks draw in)
- Loading states feel alive (gold shimmer pulse)
- Icons have subtle bounce on tap

**Technical Implementation:**

```css
/* Button press depth effect */
.touch-press {
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.touch-press:active {
  transform: scale(0.97) translateY(2px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* Icon bounce on tap */
.icon-bounce:active {
  animation: iconBounce 0.15s ease-out;
}

@keyframes iconBounce {
  0% { transform: scale(1); }
  50% { transform: scale(0.85); }
  100% { transform: scale(1); }
}

/* Success checkmark draw-in */
@keyframes drawCheck {
  0% { stroke-dashoffset: 20; }
  100% { stroke-dashoffset: 0; }
}

.check-animate {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: drawCheck 0.3s ease-out forwards;
}

/* Gold shimmer for loading states */
@keyframes goldShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.loading-shimmer {
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(212, 175, 55, 0.3) 50%, 
    transparent 100%
  );
  background-size: 200% 100%;
  animation: goldShimmer 1.5s ease-in-out infinite;
}
```

**Files to modify:**
- `src/index.css` - Add all micro-animation classes
- `src/components/ui/button.tsx` - Add touch-press class by default
- `src/components/calculator/WizardStep5.tsx` - Animate status badges
- Loading skeletons throughout

---

## Implementation Summary

| File | Changes |
|------|---------|
| `src/hooks/use-haptics.ts` | **NEW** - Haptic feedback hook |
| `src/hooks/use-swipe.ts` | Add progress tracking for visual feedback |
| `src/index.css` | Add all animation classes and micro-interactions |
| `src/pages/Calculator.tsx` | Integrate haptics + swipe visual feedback |
| `src/pages/Index.tsx` | Add page transitions + button haptics |
| `src/pages/Auth.tsx` | Add input animations + haptics on submit |
| `src/components/calculator/StepIndicator.tsx` | Add haptic on tap + swipe animation |
| `src/components/calculator/WizardStep1-6.tsx` | Premium input classes + haptics |
| `src/components/ui/button.tsx` | Add touch-press class by default |
| `src/components/MobileMenu.tsx` | Add haptics on menu open/close + link taps |

---

## Expected Premium Mobile Experience

1. **Tap a button** → Feel a light vibration, see it press down with depth
2. **Swipe between steps** → Content follows your finger, haptic pulse on complete
3. **Focus an input** → Subtle scale + glow, feels responsive
4. **Change a value** → Number animates, light haptic confirmation
5. **Complete the calculator** → Success vibration pattern, checkmarks animate in
6. **Navigate between pages** → Smooth slide transitions, no jarring cuts

This transforms the app from "good mobile site" to "feels like a native app."

