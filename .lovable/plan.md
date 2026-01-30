

# Tighter App Experience + Stunning Outputs

## Current State Analysis

### Step Structure (6 steps currently)
1. **Step 1**: Negative Cost (single input - budget)
2. **Step 2**: Capital Stack (Tax Credits, Debt, Equity - 3 collapsible cards)
3. **Step 3**: Deductions (Guild Residuals, Distribution Costs - 2 cards)
4. **Step 4**: Streamer Buyout (single input - revenue)
5. **Step 5**: Performance Metrics (ROI, Priority of Payments)
6. **Step 6**: Settlement (Producer vs Investor split)

### Problems Identified
- **Step 1 and Step 4 are nearly identical** - single input fields that feel redundant
- **Too much vertical scrolling** - 6 steps with lots of whitespace
- **Outputs are functional but not "stunning"** - no visual drama or hierarchy
- **No clear visual separation** between "what you put in" vs "what you get out"

---

## Proposed Restructure: 4 Steps

Consolidate from 6 steps to 4 for a tighter, app-like flow:

### NEW STEP 1: "THE DEAL" (Combines old Steps 1 + 4)
Two stacked input cards on ONE screen:
```
┌─────────────────────────────────────┐
│  PRODUCTION BUDGET                  │
│  $  ___________________________     │
│     Negative Cost                   │
└─────────────────────────────────────┘
           ↓  (visual arrow/divider)
┌─────────────────────────────────────┐
│  STREAMER BUYOUT                    │
│  $  ___________________________     │
│     Acquisition Price               │
└─────────────────────────────────────┘
```
- Immediate visual of "cost vs price" on one screen
- Users instantly see the core economic tension
- No scrolling needed for basic scenario

### NEW STEP 2: "CAPITAL STACK" (Old Step 2)
- Keep as-is with smart-rack toggles
- Already works well

### NEW STEP 3: "DEDUCTIONS" (Old Step 3)
- Keep as-is
- Guild residuals + distribution costs

### NEW STEP 4: "RESULTS" (Combines old Steps 5 + 6)
Premium dashboard with two sections:
1. **Hero ROI Card** with animated number reveal
2. **Horizontal swipeable cards** for Settlement (Producer | Investor | Waterfall)

---

## Stunning Output Redesign (New Step 4)

### Visual Hierarchy
```
┌─────────────────────────────────────┐
│          ★  YOUR RETURN  ★          │
│                                     │
│        ┌─────────────────┐          │
│        │     218.5%      │ ← Animated count-up
│        │   ROI MULTIPLE  │    Gold text, glow effect
│        └─────────────────┘          │
│                                     │
│    ● PROFITABLE   Net: +$520K       │
└─────────────────────────────────────┘

     ← SWIPE FOR DETAILS →

┌─────────┐ ┌─────────┐ ┌─────────┐
│PRODUCER │ │INVESTOR │ │WATERFALL│  ← Horizontal snap scroll
│ $260K   │ │ $1.46M  │ │ FLOW    │
└─────────┘ └─────────┘ └─────────┘
```

### Design Elements for "Stunning"
1. **Animated number reveal** - ROI counts up from 0 on entry
2. **Glowing hero metric** - Pulsing gold shadow behind the number
3. **Horizontal card carousel** - Native iOS-style snap scrolling
4. **Circular progress rings** - For recoupment visualization
5. **Status badges with micro-animations** - Check marks that draw in

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Calculator.tsx` | Reduce to 4 steps, update step logic |
| `src/components/calculator/WizardStep1.tsx` | Combine with Step 4 - dual input |
| `src/components/calculator/WizardStep4.tsx` | **DELETE** - merged into Step 1 |
| `src/components/calculator/WizardStep5.tsx` | **DELETE** - merged into new Step 4 |
| `src/components/calculator/WizardStep6.tsx` | Rename to WizardStep4, redesign as "Results Dashboard" |
| `src/components/calculator/StepIndicator.tsx` | Update totalSteps default to 4 |
| `src/index.css` | Add count-up animation, carousel styles, glowing hero |

### New Component: ResultsDashboard

The new Step 4 will be a complete redesign with:

1. **Hero Metric Section**
   - Large animated ROI with count-up effect
   - Dynamic color (gold = profitable, red = loss)
   - Pulsing glow animation for emphasis

2. **Quick Stats Row** (Below hero)
   - 3 compact pills: Net Profit | Breakeven | Multiple
   - All visible at once, no scrolling

3. **Horizontal Card Carousel**
   - Card 1: Producer Pool (with icon + amount)
   - Card 2: Investor Net (gold highlighted)
   - Card 3: Waterfall Flow (priority list)
   - Native snap-scroll behavior
   - Dot indicators below

4. **Action Footer**
   - Download Investor Deck CTA
   - Warning banner if underperforming (< 1.2x)

### New CSS Additions

```css
/* Count-up animation for numbers */
@keyframes countUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulsing glow for hero metric */
@keyframes heroGlow {
  0%, 100% { box-shadow: 0 0 30px hsl(43 74% 52% / 0.3); }
  50% { box-shadow: 0 0 50px hsl(43 74% 52% / 0.6); }
}

/* Horizontal snap carousel */
.results-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 12px;
  padding: 0 24px;
  scrollbar-width: none;
}

.results-carousel::-webkit-scrollbar { display: none; }

.results-card {
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 280px;
}
```

---

## Additional App-Like Improvements

### 1. Sticky Summary Bar (Optional Future Enhancement)
A mini-bar at bottom showing key metrics that persists during input steps.

### 2. Input Step Animation
When entering values, the number should "pop" with a subtle scale effect + haptic.

### 3. Transition Between Inputs and Results
Special visual divider animation when moving from Step 3 to Step 4.

### 4. Circular Progress Visualization
For recoupment percentage, show as an animated ring that fills:
```
    ┌───────┐
   /    87%  \    ← Ring fills with gold
  │  RECOUP  │
   \        /
    └───────┘
```

---

## Summary of UX Benefits

| Before | After |
|--------|-------|
| 6 steps | 4 steps |
| Scrolly and redundant | Tight and purposeful |
| Outputs are lists | Outputs are visual dashboards |
| Static numbers | Animated reveals |
| Vertical waterfall | Horizontal card carousel |
| Web-like | Native app-like |

---

## Implementation Priority

1. **First**: Merge Step 1 + Step 4 into new dual-input "The Deal" step
2. **Second**: Merge Step 5 + Step 6 into stunning "Results Dashboard"  
3. **Third**: Update Calculator.tsx routing for 4 steps
4. **Fourth**: Add animations and polish (count-up, carousel, glow)

This reduces cognitive load, eliminates redundant navigation, and makes the output feel like a premium data visualization rather than a form result.

