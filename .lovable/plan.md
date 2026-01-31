# Complete Overhaul Plan: Logic Flow, Authentication & Header

## STATUS: ✅ ALL BATCHES COMPLETED

---

## ✅ Batch 1: Logic & Math (COMPLETED)

- Added `calculateBreakeven()` function to `src/lib/waterfall.ts` - uses algebraic formula
- Added `getOffTopRate()` helper function for display
- Updated `OffTopTotalStep.tsx` to show **percentages** instead of fake dollar amounts
- Updated `BreakevenStep.tsx` to use the new algebraic calculation
- Updated `AcquisitionStep.tsx` to use the same calculation

**Breakeven Formula:**
```
X = (DebtRepayment + EquityRepayment - Credits + MarketingCap) / (1 - salesFee% - CAM% - guilds%)
```

---

## ✅ Batch 2: Dynamic Capital Steps (COMPLETED)

Created individual step components:
- `TaxCreditsStep.tsx` - Tax incentives input
- `SeniorDebtStep.tsx` - Senior debt principal + interest
- `GapLoanStep.tsx` - Gap/bridge loan input
- `EquityStep.tsx` - Equity investment + preferred return

Updated `Calculator.tsx`:
- Dynamic step array based on capital selections using `useMemo`
- Steps now adjust automatically (11-15 steps depending on selections)
- Proper navigation with dynamic indexing

Deleted:
- `CapitalDetailsStep.tsx` (replaced by individual steps)
- `DealStep.tsx` (orphaned)
- `DeductionsStep.tsx` (orphaned)

---

## ✅ Batch 3: Authentication (COMPLETED)

Database migration ran successfully:
- Created `profiles` table with `full_name` and `email`
- RLS policies for user access (SELECT, UPDATE, INSERT)
- Auto-create profile trigger on signup via `handle_new_user()`
- `updated_at` trigger for automatic timestamps

Updated `Auth.tsx`:
- Added **Name** field (required, validated)
- Name stored in user metadata via magic link `data: { full_name }`
- Form validates both name and email before submission

---

## ✅ Batch 4: Header Design (COMPLETED)

Updated `Header.tsx`:
- Removed logo image import
- Now shows "FILMMAKER.OG" text in Bebas font
- Matte charcoal background (#0A0A0A)
- Gold gradient line underneath

Updated Calculator header in `Calculator.tsx`:
- Matches the same matte charcoal style
- Gold line separator below header

---

## New Dynamic Step Flow

**Base Steps (always shown):**
1. Budget
2. Sales Agent
3. CAM Fee
4. Marketing
5. Guilds
6. Off-Top Total (shows percentages)
7. Capital Selection

**Dynamic Capital Steps (based on selection):**
- Tax Credits (if selected)
- Senior Debt (if selected)
- Gap Loan (if selected)
- Equity (if selected)

**End Steps (always shown):**
- Breakeven (algebraic calculation)
- Acquisition Price
- Reveal
- Waterfall

Total: 11-15 steps depending on capital source selections.
