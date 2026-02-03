

# Complete Rebuild Plan: Critical Bugs + UI/UX Overhaul

## Critical Bug #1: Duplicate $75K Marketing Expenses

### The Problem
The field `salesExp` is being used for TWO different purposes:

1. **SalesAgentStep.tsx (lines 80-100)**: Shows "Sales Expenses (CAP)" with value `inputs.salesExp` = $75K
2. **MarketingStep.tsx (lines 69-82)**: Shows "Expense Cap" with value `inputs.salesExp` = $75K

Both steps are displaying and/or modifying the SAME field (`salesExp`). This is a **data model error** - you're seeing $75K twice because the same variable is used in two places.

### The Fix
Create a separate field for marketing expenses:

```text
Current data model:
  - salesExp: $75,000 (used for BOTH sales agent AND marketing)

Fixed data model:
  - salesExp: $75,000 (Sales Agent expenses only)
  - marketingExp: $75,000 (Marketing expenses - NEW FIELD)
```

**Files to modify:**
- `src/lib/waterfall.ts` - Add `marketingExp` to WaterfallInputs interface
- `src/pages/Calculator.tsx` - Add default value for `marketingExp`
- `src/components/calculator/steps/MarketingStep.tsx` - Use `marketingExp` instead of `salesExp`
- `src/components/calculator/steps/OffTopTotalStep.tsx` - Use both fields correctly

---

## Critical Bug #2: Auth Page Matte Gray Still Not Visible

### The Problem
The CSS was updated to use `#111111` (per brand guide), but this is extremely close to the black background (`#000000`). The contrast is only 7% - almost invisible.

### The Fix
For the Auth page specifically, use a more visible gray that creates actual contrast:

```css
/* Auth page input containers need higher contrast */
background: #1A1A1A; /* 10% gray - visible against black */
```

And apply this directly to the Auth page input container divs.

---

## UI/UX Assessment: Current State

### Homepage: B+
- Splash animation works
- Menu now functional
- CTA glows appropriately

### Auth Page: D
- Input boxes blend into background (nearly invisible)
- Return key issues on mobile
- Lacks visual hierarchy
- "Start here" guidance is confusing

### Calculator Steps: C-
The issues are pervasive:

| Step | Grade | Issues |
|------|-------|--------|
| Budget | B | Works, but input styling inconsistent |
| CAM Fee | B- | Good info, but no input - just display |
| Sales Agent | C | Has DUPLICATE $75K field that should only be here |
| Marketing | F | Using WRONG field (salesExp instead of marketingExp) |
| Guilds | B | Toggle styling could be cleaner |
| Off-Top | C | Shows both expenses but uses same field |
| Capital Select | B- | Works but toggle cards are cluttered |
| Breakeven | B | Clear display |
| Acquisition | B | Works |
| Reveal | B | Animation works |
| Waterfall | B | New visual added |

---

## Strategy: Page-by-Page Systematic Rebuild

Given the mess, I recommend a **strict page-by-page approach**:

### Phase 1: Data Model Fix (Immediate)
Fix the duplicate `$75K` bug first. This is a logic error that makes the calculator wrong.

### Phase 2: Auth Page Complete Overhaul
Make the entry point institutional-grade:
- Higher contrast containers (visible matte gray)
- Proper focus states
- Mobile keyboard navigation working
- Clean visual hierarchy

### Phase 3: Calculator Step-by-Step Polish
Go through each calculator step and standardize:
- Consistent matte section styling
- Consistent input components
- Consistent spacing/typography
- Each step follows same visual pattern

---

## Immediate Implementation Plan

### Part 1: Fix Data Model (salesExp vs marketingExp)

**File: `src/lib/waterfall.ts`**
Add new field to interface:
```typescript
export interface WaterfallInputs {
  // ... existing fields
  salesExp: number;      // Sales Agent expenses
  marketingExp: number;  // Marketing expenses (NEW)
}
```

Update calculation functions to use `marketingExp`.

**File: `src/pages/Calculator.tsx`**
Add default value:
```typescript
const defaultInputs: WaterfallInputs = {
  // ... existing
  salesExp: 75000,
  marketingExp: 75000, // NEW
};
```

**File: `src/components/calculator/steps/MarketingStep.tsx`**
Change from `salesExp` to `marketingExp`.

**File: `src/components/calculator/steps/OffTopTotalStep.tsx`**
Show both expenses separately in the ledger.

---

### Part 2: Auth Page Visual Overhaul

**File: `src/pages/Auth.tsx`**
Update input containers with visible styling:
```tsx
<div className="p-4 bg-[#1A1A1A] border border-[#2A2A2A]">
  {/* Input content */}
</div>
```

Key changes:
- Use `bg-[#1A1A1A]` (10% gray) instead of relying on CSS classes
- Add visible border `border-[#2A2A2A]`
- Remove `matte-card-glow` animation when not active
- Simplify focus states

---

### Part 3: Standardize Calculator Step Containers

Create a consistent pattern every step follows:
```text
Step Layout:
1. Icon + Header (centered, gold accents)
2. Matte Section Card (bg-[#111111], border-[#1A1A1A])
   - Section header (darker strip)
   - Input area (consistent padding)
   - Impact display (if applicable)
3. Helper collapsible (gold text)
```

---

## Files to Modify

| Priority | File | Changes |
|----------|------|---------|
| P0 | `src/lib/waterfall.ts` | Add `marketingExp` field, update calculations |
| P0 | `src/pages/Calculator.tsx` | Add default for `marketingExp` |
| P0 | `src/components/calculator/steps/MarketingStep.tsx` | Use `marketingExp` |
| P0 | `src/components/calculator/steps/OffTopTotalStep.tsx` | Use both expense fields |
| P1 | `src/pages/Auth.tsx` | Visual overhaul with visible containers |
| P2 | All step components | Standardize styling |

---

## Expected Results After Implementation

1. **No more duplicate $75K** - Sales expenses and marketing expenses are separate fields
2. **Auth page has visible input boxes** - Clear matte gray containers against black
3. **Mobile return key works** - Already added `enterKeyHint`, verify it functions
4. **Consistent visual language** - Every step follows same pattern

