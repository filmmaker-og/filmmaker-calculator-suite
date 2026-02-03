
# Calculator Improvement Plan Based on Brand Guidelines

## Build Error Fix (Immediate)
The calculator has a TypeScript error on line 254 where `AcquisitionStep` receives `selections={{}}` instead of a properly typed `CapitalSelections` object with all four required boolean properties: `taxCredits`, `seniorDebt`, `gapLoan`, and `equity`.

**Fix:** Add `capitalSelections` state to Calculator.tsx and pass it correctly to AcquisitionStep.

---

## Brand Guideline Analysis Summary

After reviewing the 46-page brand guidelines, here are the key requirements and how the calculator currently measures up:

### What's Working Well
- Black background (#000000)
- Gold color usage (#D4AF37 for metallic, #F9E076 for CTAs)
- Bebas Neue for headers, Roboto Mono for numbers
- Mobile-first design approach
- Off-top deduction logic (CAM, Sales Agent, Marketing, Guilds)
- Waterfall flow visualization

### Areas Needing Improvement

---

## 1. Color System Violations

**Issue:** The WaterfallStep uses `red-400`, `emerald-400`, and `blue` colors for status indicators, violating the brand's strict gold-only palette.

**Brand Rule (Section 3.1):**
- Only Black, White, Metallic Gold (#D4AF37), and Bright Gold (#F9E076)
- No red, green, or blue

**Fix:**
- Replace `text-red-400` → `text-gold/50` (underperforming)
- Replace `text-emerald-400` → `text-gold` (positive status)
- Replace semantic gradient colors → gold intensity variations
- Status indicators should use gold opacity levels (gold/30, gold/50, gold/80, gold)

---

## 2. Missing Legal Disclaimer

**Issue:** No liability disclaimer present on the calculator.

**Brand Rule (Section 6.3):**
- Disclaimer required: "Educational model only. Not financial, legal, or investment advice. Consult qualified entertainment counsel and financial advisor."
- Must appear in footer of calculator AND on results display

**Fix:** Add disclaimer component to the results step and footer.

---

## 3. Step Flow Simplification Incomplete

**Issue:** The calculator was simplified to 5 steps but the Capital step currently only shows Tax Credits, missing Senior Debt, Gap Loan, and Equity inputs.

**Current Flow:**
1. Costs (Budget only)
2. Guilds
3. Capital (only Tax Credits showing)
4. Acquisition
5. Results

**Brand Strategy:** The "Anxiety-First" narrative requires users to understand the full capital stack hierarchy (who gets paid first) before seeing the verdict.

**Fix:** The Capital step should either:
- Include all capital inputs (Tax Credits, Senior Debt, Gap Loan, Equity) on one screen
- Or restore the multi-step capital flow with proper selections

---

## 4. Implementation Gap Not Enforced

**Issue:** The calculator results give away too much without driving conversion.

**Brand Rule (Section 6.3):**
- Calculator shows WHAT and WHY (free)
- Execution details reserved for paid products

**Fix:**
- Lock the Investor Deck behind email capture
- Add "Get Custom Model" CTA that drives to paid products
- Add "Producer Services" bypass path for high-intent users

---

## 5. Typography Consistency

**Issue:** Some steps use inconsistent text sizes and weights.

**Brand Rule (Section 3.1):**
- Body text: 16-18px minimum
- Numerical data: Roboto Mono
- Brand elements: Bebas Neue
- UI text: Inter

**Fix:** Ensure all numerical displays use `font-mono`, all headers use `font-bebas`, and body text meets 16px minimum.

---

## 6. Missing "Skim Test" Compliance

**Issue:** Landing and results pages don't pass the "skim test" where users should understand the offer by reading only H1s, H2s, and Buttons.

**Brand Rule (Section 7.1):**
- Users must grasp value proposition from headings alone

**Fix:** Review results step hierarchy - ensure key metrics (Profit Pool, Breakeven, Multiple) are prominently displayed with clear labels.

---

## Technical Implementation Plan

### Phase 1: Critical Fixes

```text
┌─────────────────────────────────────────┐
│  Step 1: Fix Build Error                │
│  - Add capitalSelections state          │
│  - Pass proper object to AcquisitionStep│
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Step 2: Fix Color Violations           │
│  - WaterfallStep: remove red/emerald    │
│  - GuildsStep: remove red for impact    │
│  - TaxCreditsStep: remove emerald       │
│  - Use gold intensity only              │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Step 3: Add Legal Disclaimer           │
│  - Create DisclaimerFooter component    │
│  - Add to WaterfallStep results         │
│  - Ensure presence on any export        │
└─────────────────────────────────────────┘
```

### Phase 2: Capital Stack Restoration

The Capital step needs to include all four capital sources:
1. Tax Credits (reduces cost)
2. Senior Debt (paid 1st)
3. Gap/Mezz Loan (paid 2nd)
4. Equity Investment (paid last)

Users should be able to:
- Select which sources apply to their deal
- Enter amounts and rates for each
- See the priority hierarchy clearly

### Phase 3: Conversion Optimization

1. **Email Gate for Results Export**
   - Free viewing of on-screen results
   - Paid/email-gated PDF export

2. **Clear CTAs**
   - Primary: "GET YOUR CUSTOM MODEL" (bright gold)
   - Secondary: "TRY DIFFERENT NUMBERS" (matte styling)

3. **Implementation Gap Signals**
   - Show what calculator reveals
   - Hint at what requires expertise

---

## Files to Modify

| File | Changes |
|------|---------|
| `Calculator.tsx` | Fix CapitalSelections state, restore capital flow |
| `WaterfallStep.tsx` | Remove red/emerald/blue colors, add disclaimer |
| `GuildsStep.tsx` | Remove red for impact amounts |
| `TaxCreditsStep.tsx` | Remove emerald color |
| `AcquisitionStep.tsx` | Fix props, remove semantic colors |
| New: `DisclaimerFooter.tsx` | Legal disclaimer component |

---

## Summary

The calculator is structurally sound but violates several brand guidelines:

1. **Color palette** - Using red, emerald, blue instead of gold-only
2. **Legal compliance** - Missing required disclaimer
3. **Capital flow** - Incomplete capital stack experience
4. **Conversion mechanics** - Not enforcing Implementation Gap

These fixes will align the calculator with the institutional-grade, premium aesthetic defined in the brand guidelines while maintaining the educational diagnostic function that drives conversions.
