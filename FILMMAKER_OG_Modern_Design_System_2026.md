# FILMMAKER.OG — MODERN DESIGN SYSTEM 2026
## A Reference Guide for Building Premium, Future-Proof Financial Tools

---

## DOCUMENT PURPOSE

This is your north star for building a waterfall calculator that looks, feels, and performs like a modern premium fintech product in 2026. It bridges your existing "Electric Gold" brand identity with cutting-edge design principles from the most successful mobile and web applications today.

**Use this when:**
- Building new features or pages
- Making design decisions
- Evaluating third-party components
- Reviewing developer work
- Explaining your vision to collaborators

---

## YOUR BRAND DNA (THE NON-NEGOTIABLES)

### Core Philosophy
**"Premium but Humble"**

You're building a trusted advisor that happens to dress well—not a cold institution. Every element guides without condescending.

**Target Emotion:** Confidence. The user should feel like they just hired a team, even though it's an app.

**Not:** Flashy startup. Not gamified. Not "fun." Not casual.  
**Is:** Professional. Institutional-grade. Cinematically elegant. Trustworthy.

### The Electric Gold Foundation

| Element | Value | Why It Matters |
|---------|-------|----------------|
| **Primary Accent** | #FFD700 (Pure Gold) | Signals premium, attention, value. Use sparingly. |
| **Background System** | Black void (#000000) with elevated cards (#070707) | Creates depth, drama, and luxury without being overwhelming |
| **Typography** | Bebas Neue (display) + Inter (UI) + Roboto Mono (numbers) | Cinematic authority + modern clarity + financial precision |
| **Shape Language** | Rounded (12-14px radius), never sharp | Warmth and approachability without sacrificing professionalism |

---

## 2026 DESIGN PRINCIPLES APPLIED TO YOUR APP

### 1. LIQUID GLASS / GLASSMORPHISM 2.0

**What It Is:**
Frosted-glass transparency with subtle blur, creating layered depth and a premium "crystal" aesthetic. Apple's iOS 26 design language, now adopted by Telegram, Wallet apps, and premium fintech products.

**How You Use It:**

✅ **DO:**
- **Modals/Overlays:** Semi-transparent backdrop with `backdrop-filter: blur(14px)`
- **App Bar/Tab Bar:** Translucent with blur effect
- **Glossary Panels:** When (i) triggers are tapped, the definition panel should float with glass effect
- **Success States:** Celebration modals with frosted glass backgrounds

```css
/* Example: Glossary Panel */
.glossary-panel {
  background: rgba(7, 7, 7, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 215, 0, 0.16);
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
}
```

❌ **DON'T:**
- Use on main content areas (reduces readability)
- Apply to form inputs (user needs to see what they're typing)
- Overdo it—glass effects should feel premium, not overwhelming

**Accessibility Note:**
Provide a "Power Saving" toggle in settings that disables blur effects for users on low-end devices or with visual processing sensitivities.

---

### 2. BOTTOM NAVIGATION (THUMB-ZONE ERGONOMICS)

**The Standard:**
In 2026, bottom navigation is the **dominant mobile UX pattern**. 70% of smartphone use is one-handed. Primary actions must be in the natural arc of the thumb.

**How You Use It:**

✅ **DO:**
- **Mobile: Bottom Tab Bar** with 3-4 primary sections:
  - Calculator (home)
  - Your Models (saved calculations)
  - Store (purchase packages)
  - Profile/Settings
- **Touch Targets:** Minimum 48x48px
- **Icon + Label:** Always pair icons with text labels (never icon-only)
- **Persistent:** Tab bar stays visible on all screens within those sections

❌ **DON'T:**
- Use hamburger menu for primary navigation
- Put critical actions in top-right overflow menus
- Hide navigation behind gestures

**Implementation:**
```
Mobile Layout:
┌────────────────────────────┐
│     [Header/Logo]          │ ← Minimal, non-interactive
│                            │
│   [Main Content Area]      │
│                            │
│                            │
│                            │
├────────────────────────────┤
│ 🧮  📊  🛒  👤            │ ← Bottom Nav (fixed)
│ Calc Models Store Me       │
└────────────────────────────┘
```

---

### 3. ADAPTIVE UI / PREDICTIVE PERSONALIZATION

**The Standard:**
Apps in 2026 adapt to user behavior. Netflix changes layout based on your viewing habits. Spotify surfaces features based on what you use most.

**How You Use It:**

✅ **Phase 1 (Now):**
- **Remember User Inputs:** If a user always uses SAG/DGA/WGA guilds, pre-check those boxes next time
- **Recent Models:** Show their 3 most recent calculations on the home screen
- **Progress Indicators:** "You've completed Chapters 1-2, continue to Chapter 3?"

✅ **Phase 2 (Future):**
- **Smart Defaults:** If 80% of their models use similar budget ranges, suggest that range
- **Dynamic Navigation:** If they never use the glossary, minimize it. If they use it constantly, make it more prominent
- **Contextual Prompts:** "Most users at this budget range also explore The Blueprint package"

**Technical Implementation:**
- Store user preferences in localStorage or Supabase user profiles
- Track interaction patterns (which features they use, which they skip)
- Use this data to **subtly customize** the interface

❌ **DON'T:**
- Make changes that confuse users (no surprise reorganization)
- Track without consent (be transparent about personalization)
- Remove features—just deprioritize them visually

---

### 4. MICRO-INTERACTIONS & MOTION DESIGN

**The Standard:**
In 2026, micro-interactions **communicate system intelligence**. They reduce hesitation, increase trust, and make complex actions feel simple.

**How You Use It:**

✅ **DO:**
- **Button Press:** `scale(0.92)` for 100ms (tactile feedback)
- **Loading States:** Don't just spin—show what's happening ("Calculating waterfall...")
- **Success States:** Checkmark animation + subtle gold glow
- **Form Validation:** Inline feedback as user types (not after submission)
- **Progress Animations:** When saving a model, show progress bar with stage labels

```jsx
// Example: Button with tactile feedback
<button 
  className="cta-button"
  style={{
    transform: isPressed ? 'scale(0.92)' : 'scale(1)',
    transition: 'transform 100ms cubic-bezier(0.4, 0, 0.2, 1)'
  }}
>
  CALCULATE WATERFALL
</button>
```

❌ **DON'T:**
- Use animation for decoration (every animation should have purpose)
- Make animations slow (keep under 300ms)
- Animate too many things at once (causes chaos)

**Key Micro-Interactions for Your App:**
- **Chapter Completion:** Gold checkmark appears, subtle glow effect
- **Input Validation:** Gold border when valid, red when error
- **Saving:** Progress indicator shows "Saving to your account..."
- **Export Success:** Confetti-style particle effect (gold particles)

---

### 5. BENTO GRID LAYOUTS (MODULAR CONTENT)

**The Standard:**
Card-based designs with **varying sizes** arranged in a grid. Inspired by Japanese bento boxes. Used by Apple, Netflix, and modern dashboards.

**How You Use It:**

✅ **DO:**
- **Dashboard/Models Page:** Show saved models as rounded cards of different sizes
  - Recent calculations: Large card (full width)
  - Saved templates: Medium cards (2-column)
  - Quick stats: Small cards (3-column on desktop)

```
Desktop Layout Example:
┌──────────────────────────────────────┐
│  [Recent: "Horror Film $2M Budget"]  │ ← Large card
│  Last edited: 2 hours ago            │
├──────────────────┬───────────────────┤
│ [Saved Model 1]  │ [Saved Model 2]   │ ← Medium cards
├──────────────────┴───────────────────┤
│ [📊 Stats] [💰 Revenue] [⏱️ Time]   │ ← Small cards
└──────────────────────────────────────┘
```

❌ **DON'T:**
- Make all cards the same size (boring, doesn't prioritize)
- Overcrowd with too many small cards (cognitive overload)

---

### 6. PROGRESSIVE DISCLOSURE (REDUCE COGNITIVE LOAD)

**The Standard:**
Show users **only what they need** at each step. Hide complexity until it's relevant.

**How You Use It:**

✅ **DO:**
- **Chapter-by-Chapter Flow:** Current design is correct—don't show all 4 chapters at once
- **Collapsible Sections:** Advanced options hidden behind "Show Advanced Options"
- **Tooltips/Glossary:** Financial terms explained on-demand via (i) triggers
- **Scenario Comparison:** Don't show 3 scenarios until they complete the base calculation

**Visual Pattern:**
```
Default State:
┌────────────────────────────┐
│  Budget Input              │
│  [Basic Options Visible]   │
│  ▼ Show Advanced Options   │ ← Collapsed
└────────────────────────────┘

Expanded State:
┌────────────────────────────┐
│  Budget Input              │
│  [Basic Options]           │
│  ▲ Hide Advanced Options   │
│  - Tax Credit Details      │
│  - Guild Reserve Overrides │
│  - CAM Fee Customization   │
└────────────────────────────┘
```

---

### 7. PASSWORDLESS AUTH & BIOMETRICS

**The Standard:**
In 2026, passwords are the enemy of conversion. Users expect **instant login** via biometrics or magic links.

**How You Use It:**

✅ **DO:**
- **Primary Method:** Magic link via email (Supabase supports this)
- **Secondary:** Social OAuth (Google, Apple) for premium users
- **Future:** Passkeys (cryptographic key pairs synced to devices)

❌ **DON'T:**
- Require password creation on first visit (massive friction)
- Force users to remember complex passwords
- Make logout too easy (they'll lose their work)

**User Flow:**
```
1. User enters email
2. Click "Send Magic Link"
3. Check email → click link → auto-logged in
4. (Optional) "Set up biometric login for faster access"
```

---

### 8. DARK MODE (NON-NEGOTIABLE IN 2026)

**The Standard:**
Dark mode is **not optional**. It reduces eye strain, saves battery, and is expected by users.

**Your Current State:**
✅ You already have dark mode (black void aesthetic)

**Optimization:**
- Add **"Automatic" mode** that follows system preferences
- Ensure all PDFs/exports respect dark mode (or offer light mode export for printing)
- Test contrast ratios (gold on black must be WCAG AA compliant minimum)

---

### 9. ACCESSIBILITY-FIRST DESIGN

**The Standard:**
Accessibility is a **core requirement**, not a checkbox. 15% of users have some form of disability.

**How You Use It:**

✅ **DO:**
- **Keyboard Navigation:** Every interactive element accessible via Tab key
- **Screen Reader Support:** Proper ARIA labels on all buttons/inputs
- **Focus States:** Gold border on focused elements (already in your system)
- **Color Contrast:** Gold (#FFD700) on black (#000000) = WCAG AAA compliant ✅
- **Text Sizing:** Allow users to scale text up to 200% without breaking layout
- **Alternative Text:** All icons have descriptive text or labels

❌ **DON'T:**
- Use color as the only indicator (e.g., green for success must also have checkmark icon)
- Hide important info behind hover-only interactions
- Use font sizes below 14px for body text (11px for labels is OK if uppercase + bold)

**Testing Checklist:**
- [ ] Can navigate entire app with keyboard only
- [ ] Screen reader announces all actions clearly
- [ ] All images have alt text
- [ ] Color contrast passes WCAG AA minimum
- [ ] Touch targets are 48x48px minimum

---

### 10. PERFORMANCE OPTIMIZATION (SUSTAINABLE DESIGN)

**The Standard:**
In 2026, apps are judged on **speed** and **battery efficiency**. Bloated UIs are punished.

**How You Use It:**

✅ **DO:**
- **Lazy Loading:** Load components only when needed
- **Image Optimization:** Use WebP format, serve responsive sizes
- **Code Splitting:** Bundle only what the current page needs
- **Defer Non-Critical JS:** Load analytics/tracking after interactive elements
- **Minimize Re-Renders:** Use React.memo(), useMemo() where appropriate

**Benchmarks to Hit:**
- **First Contentful Paint:** < 1.8s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

**Power Saving Mode:**
Give users a toggle that:
- Disables glass blur effects
- Reduces animations
- Simplifies shadows

---

## MODERN COMPONENT PATTERNS FOR YOUR APP

### The Chapter Card (Your Core Component)

**Current Design:** ✅ Already excellent

**2026 Enhancement:**
Add subtle **active state glow** when user is on that chapter:

```css
.chapter-card--active {
  border: 1px solid rgba(255, 215, 0, 0.45);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.08);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.08); }
  50% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.12); }
}
```

---

### Input Fields (With Inline Validation)

**Current Design:** ✅ Good foundation

**2026 Enhancement:**
Add **real-time validation feedback**:

```jsx
<div className="input-wrapper">
  <label>BUDGET <span className="required">*</span></label>
  <input 
    type="number"
    className={`input-field ${isValid ? 'valid' : 'invalid'}`}
    placeholder="$2,500,000"
  />
  {isValid && (
    <span className="validation-icon">✓</span>
  )}
  {!isValid && error && (
    <span className="error-message">{error}</span>
  )}
</div>
```

**Visual States:**
- **Default:** Gray border (#2A2A2A)
- **Focus:** Gold border + subtle glow
- **Valid:** Green checkmark appears (don't change border to green—gold is your brand)
- **Error:** Red border + error message below

---

### The Glossary Trigger (i)

**Current Design:** ✅ Good

**2026 Enhancement:**
Make it **feel more interactive**:

```jsx
<button 
  className="glossary-trigger"
  onClick={() => openGlossaryPanel(term)}
  aria-label={`Learn more about ${term}`}
>
  <span className="icon">i</span>
</button>

// Interaction
.glossary-trigger {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid #333;
  transition: all 150ms ease;
}

.glossary-trigger:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.45);
  transform: scale(1.08);
}

.glossary-trigger:active {
  transform: scale(0.95);
}
```

---

### Primary CTA Buttons

**Current Design:** ✅ Good bones

**2026 Enhancement:**
Add **"breathing" animation** on hover to draw attention:

```css
.cta-button {
  height: 52px;
  background: rgba(255, 215, 0, 0.12);
  border: 1px solid rgba(255, 215, 0, 0.45);
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 900;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #FFD700;
  transition: all 200ms ease;
  cursor: pointer;
}

.cta-button:hover {
  background: rgba(255, 215, 0, 0.18);
  border-color: rgba(255, 215, 0, 0.65);
  box-shadow: 0 10px 26px rgba(255, 215, 0, 0.18);
  transform: translateY(-2px);
}

.cta-button:active {
  transform: scale(0.96);
  transition-duration: 50ms;
}
```

---

### Results Dashboard (After Waterfall Calculates)

**New Pattern: Data Visualization Cards**

When showing results, use **KPI cards** with visual hierarchy:

```
Layout:
┌────────────────────────────────────────┐
│  WATERFALL RESULTS                     │
├──────────────────┬─────────────────────┤
│  💰 Total Return │  📈 Multiple        │ ← Large cards
│  $787,500        │  1.5x               │
├──────────────────┴─────────────────────┤
│  [Waterfall Visualization]             │ ← Full-width
│  [Interactive bar chart]               │
├────────────────────────────────────────┤
│  📊 Breakeven: $2.2M                   │ ← Status card
│  ✓ Above by $300K                      │
└────────────────────────────────────────┘
```

**Design Specs:**
- **KPI Cards:** 
  - Background: #0A0A0A (slightly lighter than #070707 for contrast)
  - Border: 1px solid #2A2A2A
  - Number: 32px Roboto Mono, #FFD700
  - Label: 11px Inter, weight 900, #8A8A8A
- **Waterfall Bar:**
  - Horizontal segmented bar showing each tier
  - Color-coded: Off-the-top (gray), Debt (blue), Equity (gold), Profit (green)
  - Tooltips on hover explaining each segment

---

## RESPONSIVE DESIGN STRATEGY

### Breakpoint System

| Breakpoint | Width | Layout Strategy |
|------------|-------|-----------------|
| **Mobile** | 320px - 767px | Single column, bottom nav, collapsible sections |
| **Tablet** | 768px - 1023px | 2-column where appropriate, side nav possible |
| **Desktop** | 1024px+ | Multi-column, side nav, more info density |

### Mobile-First Principles

✅ **DO:**
- Design for 375px width first (iPhone SE / standard mobile)
- Test on actual devices, not just browser responsive mode
- Use `clamp()` for fluid typography: `clamp(14px, 3vw, 18px)`
- Prioritize thumb-reachable actions at bottom
- Make tap targets 48x48px minimum

❌ **DON'T:**
- Assume desktop and scale down (mobile-first always)
- Use fixed pixel widths (use %, vw, or clamp)
- Hide critical features on mobile (adapt, don't remove)

---

## TYPOGRAPHY SYSTEM (REFINED)

### Font Loading Strategy

```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/BebasNeue-Regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Inter-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/RobotoMono-Medium.woff2" as="font" type="font/woff2" crossorigin>
```

### Type Scale (Responsive)

| Element | Mobile | Desktop | Usage |
|---------|--------|---------|-------|
| **Hero** | 36px | 64px | Landing page only |
| **Display Large** | 26px | 40px | Results numbers |
| **H1** | 24px | 32px | Page titles |
| **H2** | 20px | 26px | Section headings |
| **Chapter Number** | 24px | 24px | Chapter badges |
| **Input Value** | 20px | 22px | Form inputs (mono) |
| **Body** | 14px | 14px | Descriptions |
| **Label** | 11px | 11px | Field labels (uppercase, weight 900) |

**Implementation:**
```css
.display-hero {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(36px, 12vw, 64px);
  font-weight: 400;
  line-height: 1.1;
}

.input-value {
  font-family: 'Roboto Mono', monospace;
  font-size: clamp(20px, 4vw, 22px);
  font-weight: 500;
  letter-spacing: -0.02em;
}
```

---

## COLOR SYSTEM (EXTENDED)

### The Complete Palette

```css
:root {
  /* Backgrounds (Layered Depth) */
  --bg-void: #000000;
  --bg-card: #070707;
  --bg-surface: #141414;
  --bg-elevated: #111111;
  --bg-elevated-hover: #1A1A1A;
  
  /* Gold (The Star) */
  --gold: #FFD700;
  --gold-muted: rgba(255, 215, 0, 0.45);
  --gold-subtle: rgba(255, 215, 0, 0.12);
  --gold-glow: rgba(255, 215, 0, 0.3);
  
  /* Text Hierarchy */
  --text-primary: #FFFFFF;
  --text-mid: #CFCFCF;
  --text-dim: #8A8A8A;
  
  /* Status */
  --status-success: #00FF64;
  --status-warning: #FFD700;
  --status-danger: #FF5252;
  --status-info: #4DA6FF;
  
  /* Borders */
  --border-default: #2A2A2A;
  --border-subtle: #1A1A1A;
  --border-strong: #3A3A3A;
  
  /* Glass Effects */
  --glass-bg: rgba(7, 7, 7, 0.85);
  --glass-border: rgba(255, 215, 0, 0.16);
  --glass-blur: 14px;
}
```

### Usage Rules

1. **Gold is accent only** — If everything is gold, nothing is
2. **Never put text directly on --bg-void** — Always use --bg-card as container
3. **Status colors for feedback only** — Not for decoration
4. **Maintain hierarchy** — Primary > Mid > Dim for all text

---

## ANIMATION & TIMING SYSTEM

### Duration Standards

| Interaction | Duration | Easing |
|-------------|----------|--------|
| **Button Press** | 100ms | ease-out |
| **Focus State** | 150ms | ease |
| **Hover State** | 200ms | ease |
| **Panel Slide In** | 250ms | cubic-bezier(0.4, 0, 0.2, 1) |
| **Modal Fade In** | 300ms | ease-out |
| **Loading Spinner** | 800ms | linear (loop) |

### Standard Easing Functions

```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quad: cubic-bezier(0.45, 0, 0.55, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

---

## ICONOGRAPHY SYSTEM

### Icon Library: Lucide React

**Why:** Lightweight, consistent, customizable, widely supported

**Implementation:**
```jsx
import { DollarSign, TrendingUp, Info, Check, AlertCircle } from 'lucide-react';

<button className="cta">
  <DollarSign size={16} />
  <span>Calculate</span>
</button>
```

### Icon Usage Rules

✅ **DO:**
- Use 16px or 20px for inline icons (next to text)
- Use 24px for standalone icons (buttons, tabs)
- Always pair with text label (accessibility)
- Keep stroke width consistent (default: 2)

❌ **DON'T:**
- Mix icon libraries (stick to Lucide)
- Use decorative icons without semantic meaning
- Scale icons below 16px (too small to see)

---

## LOADING & EMPTY STATES

### Loading Indicators

**Skeleton Screens (Preferred):**
Show placeholder shapes while content loads—better perceived performance than spinners.

```jsx
<div className="skeleton-card">
  <div className="skeleton-text skeleton-text--large" />
  <div className="skeleton-text skeleton-text--medium" />
  <div className="skeleton-text skeleton-text--small" />
</div>
```

**Style:**
```css
.skeleton-text {
  height: 16px;
  background: linear-gradient(
    90deg,
    #111111 0%,
    #1A1A1A 50%,
    #111111 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Empty States

When user has no saved models yet:

```
┌────────────────────────────┐
│     [Icon: Calculator]     │
│                            │
│   No Models Yet            │
│                            │
│   Start your first         │
│   waterfall calculation    │
│                            │
│  [NEW CALCULATION →]       │
└────────────────────────────┘
```

**Tone:** Encouraging, not punishing. Show them the path forward.

---

## ERROR HANDLING & VALIDATION

### Error Message Hierarchy

1. **Inline Field Errors:** Show immediately as user types (red border + message below)
2. **Form-Level Errors:** Summary at top if multiple fields invalid
3. **System Errors:** Toast notification top-right (dismissible)

### Error Message Tone

❌ **Bad:** "Invalid input"  
✅ **Good:** "Budget must be a positive number"

❌ **Bad:** "Error 500"  
✅ **Good:** "We couldn't save your changes. Try again?"

**Always:**
- Explain what went wrong
- Tell user how to fix it
- Offer an action (try again, contact support)

---

## EXPORT/PDF DESIGN STANDARDS

When generating Excel/PDF exports (The Snapshot, Blueprint, etc.):

### Excel Styling

```
Sheet Design:
┌────────────────────────────────────┐
│  [Logo]    FILMMAKER.OG            │ ← Header (frozen)
│                                    │
│  Executive Summary                 │ ← Section title
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                    │
│  Budget:          $2,500,000       │ ← Data rows
│  Deal Price:      $2,750,000       │
│  Producer Profit: $325,000         │
│                                    │
│  [Chart: Waterfall Visualization]  │
└────────────────────────────────────┘
```

**Color Palette:**
- Background: #000000 (void)
- Cells: #070707 (card)
- Headers: #FFD700 (gold)
- Text: #FFFFFF (primary)
- Borders: #2A2A2A (default)

**Typography:**
- Headers: Arial Black, 14pt, #FFD700
- Data: Arial, 11pt, #FFFFFF
- Numbers: Courier New, 11pt, #FFD700 (monospace for alignment)

**Conditional Formatting:**
- Positive numbers: Green (#00FF64)
- Negative numbers: Red (#FF5252)
- Breakeven threshold: Gold highlight

---

## ACCESSIBILITY CHECKLIST (WCAG 2.1 AA)

✅ **Perceivable**
- [ ] All images have alt text
- [ ] Color is not the only indicator (icon + color)
- [ ] Contrast ratio ≥ 4.5:1 for text
- [ ] Text can scale to 200% without breaking

✅ **Operable**
- [ ] All functionality available via keyboard
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Sufficient time to read/interact

✅ **Understandable**
- [ ] Clear labels on all inputs
- [ ] Error messages explain how to fix
- [ ] Navigation is consistent
- [ ] Language of page is declared

✅ **Robust**
- [ ] Valid HTML (no broken tags)
- [ ] ARIA labels on interactive elements
- [ ] Compatible with assistive tech

---

## PERFORMANCE BUDGET

### Target Metrics (Lighthouse Score)

| Metric | Target | Why |
|--------|--------|-----|
| **Performance** | 90+ | Speed = trust |
| **Accessibility** | 95+ | Inclusive = larger market |
| **Best Practices** | 100 | Shows quality |
| **SEO** | 95+ | Organic discovery |

### File Size Limits

- **Images:** Max 200KB each (WebP format)
- **CSS Bundle:** Max 50KB (minified + gzipped)
- **JS Bundle:** Max 150KB initial (code-split after)
- **Fonts:** Max 100KB total (woff2 format)

### Optimization Checklist

- [ ] Images optimized with ImageOptim or Squoosh
- [ ] Unused CSS removed (PurgeCSS)
- [ ] JavaScript tree-shaken (no dead code)
- [ ] Critical CSS inlined in `<head>`
- [ ] Fonts subset to used characters only
- [ ] Third-party scripts loaded async/defer

---

## TESTING STRATEGY

### Browser Support

**Must Work:**
- Chrome (last 2 versions)
- Safari (last 2 versions)
- Firefox (last 2 versions)
- Edge (last 2 versions)

**Mobile:**
- iOS Safari (last 2 versions)
- Chrome Android (last 2 versions)

### Device Testing

**Minimum Test Set:**
- iPhone SE (small mobile)
- iPhone 14 Pro (standard mobile)
- iPad Air (tablet)
- MacBook Air (desktop)
- 1080p desktop monitor

### Accessibility Testing

**Tools:**
- axe DevTools (browser extension)
- Lighthouse (Chrome DevTools)
- VoiceOver (iOS/macOS screen reader)
- Keyboard navigation (Tab through every page)

---

## DESIGN DEBT TRACKING

### Current Issues from Your Codebase

**Priority 1 (Fix Now):**
- [ ] Unify #D4AF37 → #FFD700 (158 hardcoded values)
- [ ] Fix header logo gold color mismatch
- [ ] Delete 10 orphaned CSS files
- [ ] Fix capitalSelections bug (breakeven calculation)

**Priority 2 (Next Sprint):**
- [ ] Replace hardcoded colors with CSS variables
- [ ] Add skeleton loading states
- [ ] Implement bottom nav for mobile
- [ ] Add glass effect to modals

**Priority 3 (Future):**
- [ ] Adaptive UI (personalized defaults)
- [ ] Power Saving mode toggle
- [ ] Biometric login option

---

## INSPIRATION REFERENCE

### Apps Doing It Right in 2026

**Fintech:**
- **Robinhood:** Clean data visualization, bottom nav, micro-interactions
- **Cash App:** Simple flows, tactile feedback, instant feedback
- **Stripe Dashboard:** Professional, data-dense but readable

**Film Industry:**
- **Studiobinder:** Cinematic aesthetic, professional tools
- **Frame.io:** Dark UI, video-focused, collaboration features

**Mobile Excellence:**
- **Telegram (Feb 2026 redesign):** Bottom nav, Liquid Glass, performance optimization
- **Spotify:** Adaptive UI, personalized home screen
- **Netflix:** Predictive content, adaptive layouts

---

## FINAL DESIGN PRINCIPLES SUMMARY

1. **Gold is Power** — Use it sparingly. When you use it, mean it.

2. **Black is Canvas** — Deep black creates drama and makes gold pop. Never fight it.

3. **Glass is Premium** — Subtle blur and transparency signal quality. Don't overdo it.

4. **Thumbs Rule** — Primary actions at bottom on mobile. Always.

5. **Loading = Trust** — Show what's happening. Never leave users wondering.

6. **Errors = Guidance** — Don't just say "wrong"—show them right.

7. **Accessibility = Respect** — Every user deserves full access.

8. **Speed = Confidence** — Fast apps feel professional. Slow apps feel broken.

9. **Consistency = Memory** — Same patterns everywhere. Users learn once.

10. **Delight = Detail** — Micro-interactions separate good from great.

---

## HOW TO USE THIS DOCUMENT

**When building a new feature:**
1. Start with the component patterns section
2. Apply the 2026 principles (glass, bottom nav, micro-interactions)
3. Check accessibility checklist
4. Test performance budget

**When reviewing designer work:**
1. Does it use the correct gold (#FFD700)?
2. Are touch targets 48x48px minimum?
3. Does it follow the spacing system (multiples of 4)?
4. Is glass effect used appropriately (modals/overlays only)?

**When debugging:**
1. Check performance budget first (slow = broken)
2. Test keyboard navigation
3. Verify contrast ratios
4. Check mobile experience

---

## MANTRAS TO REMEMBER

> "If everything is gold, nothing is."

> "The best interface is no interface—but when we need one, it's elegant."

> "Premium doesn't mean complicated. Premium means confident simplicity."

> "Users shouldn't think about the design. They should think about their film."

> "Every animation has a job. No job = no animation."

---

**This is your north star. When in doubt, come back here.**

**Build something that makes filmmakers feel like they just hired a team.**

---

*Document Version: 1.0 | Created: February 2026 | For: filmmaker.og Waterfall Calculator*
