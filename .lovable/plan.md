
# Batch 1: Critical Bug Fixes

## Overview
Three critical bugs need to be fixed to ensure basic functionality works correctly.

---

## Fix 1: Homepage Hamburger Menu Z-Index

### Problem
The hamburger menu button on the homepage is clickable but when it opens, the menu overlay is hidden behind the cinematic splash animation. This happens because:
- The splash animation has `z-[100]` (Index.tsx line 44)
- The Header component itself has `z-50` (Header.tsx line 31)
- Even though the menu overlay has `z-[200]`, the Header's button at `z-50` means clicks are intercepted by elements above it

### Solution
Increase the Header's z-index to be above the splash animation:

**File: `src/components/Header.tsx`**
- Change the header element from `z-50` to `z-[150]` so it sits above the splash (`z-[100]`) but below the menu overlay (`z-[200]`)

---

## Fix 2: "Try Without Saving" Jumps to Wrong Step

### Problem
When clicking "TRY WITHOUT SAVING" on the Auth page, it navigates to `/calculator?skip=true`, but the calculator loads saved state from localStorage, causing it to jump to a random step from a previous session.

### Solution
Add a check for `skip=true` to reset state, similar to how `reset=true` works.

**File: `src/pages/Calculator.tsx`**
- Add handling for `skip=true` parameter alongside the existing `reset=true` logic
- When `skip=true` is detected, clear localStorage and reset to step 0
- This ensures a fresh start for demo users

---

## Fix 3: Capital Stack Pre-Selected

### Problem
The Capital Stack selection step comes with "Senior Debt" and "Equity" already selected, which is confusing and doesn't allow users to make their own choices from scratch.

### Solution
Change the default capital selections to all `false`.

**File: `src/pages/Calculator.tsx`**
- Change `defaultCapitalSelections` (lines 53-58) to have all values set to `false`

---

## Implementation Summary

| File | Change |
|------|--------|
| `src/components/Header.tsx` | Change `z-50` to `z-[150]` on header element |
| `src/pages/Calculator.tsx` | Add `skip=true` handling to reset state |
| `src/pages/Calculator.tsx` | Set all `defaultCapitalSelections` to `false` |

---

## Expected Results

1. **Menu Fix**: Hamburger menu on homepage will open and be fully visible above all other content
2. **Skip Fix**: "Try Without Saving" will always start at step 1 (Budget) with clean slate
3. **Capital Fix**: Capital Stack step will show all options unselected, requiring user to make explicit choices
