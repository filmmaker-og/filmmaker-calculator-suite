
# Complete Overhaul Plan: Logic Flow, Authentication & Header

This plan addresses three critical areas that need fixing:
1. **Calculator Logic Flow** - Fix the broken math and restructure steps
2. **Authentication Page** - Magic link with proper name + email capture
3. **Header Design** - Replace logo icon with text, matte charcoal with gold line

---

## Current State Analysis

### What's Wrong

**Calculator Logic (Critical):**
- `BreakevenStep.tsx` and `AcquisitionStep.tsx` use `budget * 1.2` as fake revenue - this makes the math meaningless
- `OffTopTotalStep.tsx` shows dollar amounts based on hypothetical revenue that doesn't exist yet
- `CapitalDetailsStep.tsx` shows all financing cards at once, violating one-card-per-screen principle
- The breakeven should be calculated algebraically, not with placeholder numbers

**Authentication (Missing Features):**
- Current flow only captures email, but you need NAME + EMAIL for lead capture
- Magic link (OTP) is implemented but needs a name field added
- Need to store the name in the user's profile data

**Header (Design Issues):**
- Uses `filmmaker-logo.jpg` image in the header (should be text only)
- Missing the matte charcoal (#0A0A0A) background
- The gold line exists but header uses the logo icon

---

## Part 1: Fix Calculator Logic Flow

### Phase 1A: Fix the Breakeven Calculation

The core math problem is that we're using `budget * 1.2` as a proxy revenue. Instead, we need to calculate the true algebraic breakeven.

**The correct formula:**

```text
Breakeven X = (DebtRepayment + EquityRepayment - Credits + MarketingCap) / (1 - salesFee% - CAM% - guilds%)
```

This solves for the minimum revenue needed where all obligations are met.

**Changes to `src/lib/waterfall.ts`:**
- Add new function `calculateBreakeven()` that takes inputs, guilds, and capital selections
- Returns the exact breakeven revenue point

**Changes to `src/components/calculator/steps/BreakevenStep.tsx`:**
- Remove the fake `hypotheticalRevenue = inputs.budget * 1.2`
- Use the new `calculateBreakeven()` function
- Show the actual breakeven number based on real math

**Changes to `src/components/calculator/steps/AcquisitionStep.tsx`:**
- Use the same `calculateBreakeven()` function for consistency
- Remove duplicate calculation logic

### Phase 1B: Fix Off-Top Display

**Changes to `src/components/calculator/steps/OffTopTotalStep.tsx`:**
- Instead of showing dollar amounts based on fake revenue, show PERCENTAGES
- Display: "22.9% of whatever the streamer pays goes to these parties first"
- Show the marketing cap as a fixed dollar amount (it's not percentage-based)

New display format:
```text
Sales Agent     15%
CAM Fee          1%
Guild Residuals  6.9%
────────────────────
OFF-TOP RATE   22.9%

Plus: Marketing Cap $75K
```

### Phase 1C: Split Capital Details Into Individual Steps (Dynamic)

Currently `CapitalDetailsStep.tsx` shows all selected financing cards at once. This needs to be one card per screen.

**New component files to create:**
- `src/components/calculator/steps/TaxCreditsStep.tsx`
- `src/components/calculator/steps/SeniorDebtStep.tsx`
- `src/components/calculator/steps/GapLoanStep.tsx`
- `src/components/calculator/steps/EquityStep.tsx`

**Changes to `src/pages/Calculator.tsx`:**
- Dynamic step count based on capital selections
- After "Capital Selection" step, show individual steps only for selected sources
- Base flow: 8 steps minimum (Budget through Waterfall)
- Add 1 step for each selected financing source (0-4 additional)

New step sequence:
```text
1. Budget
2. Sales Agent
3. CAM Fee
4. Marketing
5. Guilds
6. Off-Top Total (shows percentages)
7. Capital Selection (toggles)
8. [Dynamic] Tax Credits Details (if selected)
9. [Dynamic] Senior Debt Details (if selected)
10. [Dynamic] Gap Loan Details (if selected)
11. [Dynamic] Equity Details (if selected)
12. Breakeven (real math)
13. Acquisition Price
14. Reveal
15. Waterfall
```

**Delete:** `src/components/calculator/steps/CapitalDetailsStep.tsx`

---

## Part 2: Fix Authentication with Name + Email

### Phase 2A: Add Name Field to Auth Flow

**Changes to `src/pages/Auth.tsx`:**

Current state captures only email. Need to add:
1. Name input field (required)
2. Store name in user metadata when sending magic link
3. Update form validation to require both fields

The magic link flow with Supabase OTP supports passing user metadata:

```typescript
await supabase.auth.signInWithOtp({
  email: email.trim(),
  options: {
    emailRedirectTo: redirectUrl,
    data: {
      full_name: name.trim(),
    }
  },
});
```

**New form layout:**
```text
YOUR NAME
[____________________]

EMAIL ADDRESS  
[____________________]

[GET ACCESS →]
```

### Phase 2B: Create Profiles Table for User Data

**Database migration needed:**

```sql
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Phase 2C: Verify Magic Link Works

The current implementation uses `signInWithOtp` which is correct. Key points:
- Redirect URL goes to `/calculator`
- Auth state listener in `Calculator.tsx` already handles session
- Need to ensure email confirmation is working (check Supabase auth settings)

---

## Part 3: Fix Header Design

### Phase 3A: Remove Logo Icon, Add Text

**Changes to `src/components/Header.tsx`:**

Current header shows the `filmmaker-logo.jpg` image. Replace with:
- Text only: "FILMMAKER.OG" in Bebas font
- Matte charcoal background (#0A0A0A)
- Gold gradient line underneath
- Keep hamburger menu on right

New header structure:
```text
┌─────────────────────────────────────┐
│ FILMMAKER.OG                    ☰   │  ← #0A0A0A bg
├─────────────────────────────────────┤  ← Gold gradient line
```

**Specific changes:**
1. Remove `<img src={filmmakerLogo}` from header
2. Replace with `<span className="font-bebas">FILMMAKER.OG</span>`
3. Ensure background is `#0A0A0A` (matte charcoal)
4. Gold line already exists (keep it)
5. Remove conditional `hidden sm:inline` - always show text

### Phase 3B: Update Calculator Header

The calculator has its own inline header in `Calculator.tsx`. Update it to match:
- Same matte charcoal background
- "FILMMAKER.OG" text on left
- Step title in center
- Gold line underneath

---

## Implementation Order

### Batch 1 (Logic & Math)
1. Add `calculateBreakeven()` to `src/lib/waterfall.ts`
2. Update `OffTopTotalStep.tsx` to show percentages
3. Update `BreakevenStep.tsx` with real calculation
4. Update `AcquisitionStep.tsx` with real calculation

### Batch 2 (Dynamic Capital Steps)
5. Create `TaxCreditsStep.tsx`
6. Create `SeniorDebtStep.tsx`
7. Create `GapLoanStep.tsx`
8. Create `EquityStep.tsx`
9. Update `Calculator.tsx` with dynamic step logic
10. Delete `CapitalDetailsStep.tsx`

### Batch 3 (Authentication)
11. Database migration for profiles table
12. Update `Auth.tsx` with name field
13. Test magic link flow end-to-end

### Batch 4 (Header)
14. Update `Header.tsx` - remove logo, add text
15. Update calculator header in `Calculator.tsx`
16. Ensure consistent styling across all pages

---

## Files to Modify

| File | Action | Batch |
|------|--------|-------|
| `src/lib/waterfall.ts` | Add calculateBreakeven() | 1 |
| `src/components/calculator/steps/OffTopTotalStep.tsx` | Show percentages | 1 |
| `src/components/calculator/steps/BreakevenStep.tsx` | Use real calculation | 1 |
| `src/components/calculator/steps/AcquisitionStep.tsx` | Use real calculation | 1 |
| `src/components/calculator/steps/TaxCreditsStep.tsx` | CREATE | 2 |
| `src/components/calculator/steps/SeniorDebtStep.tsx` | CREATE | 2 |
| `src/components/calculator/steps/GapLoanStep.tsx` | CREATE | 2 |
| `src/components/calculator/steps/EquityStep.tsx` | CREATE | 2 |
| `src/pages/Calculator.tsx` | Dynamic step logic | 2 |
| `src/components/calculator/steps/CapitalDetailsStep.tsx` | DELETE | 2 |
| Database migration | CREATE profiles table | 3 |
| `src/pages/Auth.tsx` | Add name field | 3 |
| `src/components/Header.tsx` | Text instead of logo | 4 |
| `src/pages/Calculator.tsx` | Update header styling | 4 |

---

## Technical Notes

### Breakeven Formula Explained

The breakeven X must satisfy:
```
X = OffTop(X) + DebtRepayment + EquityRepayment - Credits + Marketing
```

Where `OffTop(X) = X * (salesFee% + CAM% + guildsPct)`

Solving:
```
X = X * offTopRate + fixedCosts
X - X * offTopRate = fixedCosts
X * (1 - offTopRate) = fixedCosts
X = fixedCosts / (1 - offTopRate)
```

This gives the exact revenue needed to cover all obligations.

### Dynamic Steps Logic

```typescript
const getSteps = () => {
  const baseSteps = ['budget', 'sales', 'cam', 'marketing', 'guilds', 'offtop', 'capitalSelect'];
  const capitalSteps = [];
  if (selections.taxCredits) capitalSteps.push('taxCredits');
  if (selections.seniorDebt) capitalSteps.push('seniorDebt');
  if (selections.gapLoan) capitalSteps.push('gapLoan');
  if (selections.equity) capitalSteps.push('equity');
  const endSteps = ['breakeven', 'acquisition', 'reveal', 'waterfall'];
  return [...baseSteps, ...capitalSteps, ...endSteps];
};
```

### Demo Access

The "TRY WITHOUT SAVING" button stays - it's for your testing. It navigates to `/calculator?skip=true` which bypasses auth. This remains unchanged.
