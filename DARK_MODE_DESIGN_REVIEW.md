# Dark Mode Design Review — FILMMAKER.OG Calculator Suite

## Context

FILMMAKER.OG is a dark-mode-only React/Vite web app for filmmakers to model waterfall financials. The design system is built around gold (#D4AF37 metallic / #F9E076 CTA) on near-black (#141416) with warm-white text, OLED-optimized colors, and a 3-tier surface hierarchy. Typography uses Bebas Neue (headlines), Inter (body), and Roboto Mono (data). The app already has a strong foundation — this review identifies where it can level up to match premium 2026 dark-mode trends.

---

## MUST-FIX (Accessibility & Usability Gaps)

### 1. LeadCaptureModal light input fields break dark mode continuity
**Issue:** The email capture modal uses `rgba(255,255,255,0.95)` backgrounds with dark text — a jarring white flash in an otherwise all-dark app.
**Recommendation:** Switch to dark inputs matching the rest of the app: `#141416` background, gold border on focus, white text. The current approach feels like a different app embedded inside yours.
**Example:** Dark input with `1px solid rgba(212,175,55,0.15)` border, brightening to `rgba(212,175,55,0.25)` on focus, white placeholder text at 0.45 opacity.

### 2. Only two surface elevation levels creates flatness
**Issue:** The system defines three layers (void/elevated/surface) but surface and void share the same value (`#141416`), so in practice there are only two visual levels. Cards inside cards, nested content, and recessed areas all look the same depth.
**Recommendation:** Introduce a true third surface at approximately `#1A1A1E` for nested cards and content wells, sitting between void and elevated. This creates the "stacked paper" depth that 2026 dark UIs rely on (seen in Linear, Raycast, Arc Browser).
**Example:** A waterfall tier card (`#1A1A1E`) sitting inside a section wrapper (`#222226`), with the page void (`#141416`) visible behind — three distinct layers the eye can parse instantly.

### 3. Focus ring visibility on interactive elements
**Issue:** Focus-visible uses `outline: 2px solid #D4AF37` which is good, but many custom components (PercentStepper buttons, slider thumbs, tab bar items) lack visible keyboard focus indicators.
**Recommendation:** Audit every interactive element for `:focus-visible` styling. The gold focus ring should be universal. Tab bar items and stepper buttons especially need this — they're primary navigation and input controls.
**Example:** PercentStepper +/- buttons showing a `0 0 0 2px #D4AF37` ring with `2px` offset when focused via keyboard.

### 4. Text opacity hierarchy is too compressed
**Issue:** The text opacity range runs from 0.92 (primary) down to 0.65 (tertiary) — a delta of only 0.27. With OLED's high dynamic range, these steps can feel too similar, making it hard to scan and distinguish labels from body from metadata at a glance.
**Recommendation:** Widen the range. Push primary to 0.95, keep secondary at 0.75, and drop tertiary to 0.55 (for non-essential metadata only, decorative threshold). This gives a 0.40 delta — much easier to parse hierarchy.
**Example:** A waterfall card where the tier name (0.95) clearly dominates the amount (0.75), which clearly dominates the percentage label (0.55).

---

## HIGH-IMPACT (Premium Perception & 2026 Trends)

### 5. Add subtle surface noise/texture variation between layers
**Issue:** The grain overlay is applied uniformly. In 2026 premium dark UIs, different surface layers have slightly different texture treatments — matte for base, slightly glossy for elevated, micro-grain for interactive.
**Recommendation:** Vary the grain intensity per layer: 3% on void (ambient), 5% on elevated wrappers (presence), 2% or none on interactive elements like buttons and inputs (clean). This creates tactile differentiation.
**Example:** The section wrapper feels like brushed metal (visible grain), while the CTA button feels polished and smooth (no grain), creating an instinctive "this is tappable" signal.

### 6. Border-top highlight treatment needs evolution
**Issue:** Every section wrapper uses the same white structural border-top at `rgba(255,255,255,0.10-0.18)`. This is a 2023-era pattern. Premium 2026 dark UIs use variable-width gradient highlights that simulate light catching an edge.
**Recommendation:** Replace flat border-top with a short gradient highlight: a 1px line that's brightest at center and fades to transparent at edges. Vary the intensity by importance — hero sections brighter, secondary sections subtler.
**Example:** Section wrapper top edge: `linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.20) 50%, transparent 90%)` as a pseudo-element, creating a soft "light shelf" rather than a hard line.

### 7. Introduce micro-interaction feedback on data changes
**Issue:** When slider values change or calculations update, the numbers just swap. There's no visual feedback that the financial model recalculated. Premium 2026 apps (Linear, Vercel, Stripe Dashboard) use subtle number morphing or color flashes.
**Recommendation:** Add a brief (200ms) highlight pulse on changed values — a soft gold glow that fades, or a number that briefly scales to 1.02x then settles. This communicates "the model updated" without being distracting.
**Example:** When the user moves the budget slider, the "Net Profit" number briefly glows with `rgba(212,175,55,0.15)` background that fades over 300ms, confirming the cascade recalculated.

### 8. Card hover states need more dimensionality
**Issue:** Current hover is `translateY(-2px)` + shadow enhancement. This is functional but flat for 2026 standards. Premium dark UIs now combine lift with a subtle border-top brightening and inner glow to simulate a card "catching light" as it rises.
**Recommendation:** On hover, in addition to the Y-lift: brighten the border-top gradient, add an inner top shadow `inset 0 1px 0 rgba(255,255,255,0.06)`, and very subtly brighten the background by +2% lightness. The card should feel like it's moving toward a light source.
**Example:** Waterfall tier card on hover: rises 2px, border-top goes from 0.10 to 0.18 opacity, a faint inner white line appears at top, background shifts from `#222226` to `#252529`.

### 9. Glassmorphism on the app header is underutilized
**Issue:** The floating pill header has backdrop-blur, but the effect is subtle because the content behind it is mostly solid dark. Glassmorphism only impresses when there's visible content scrolling behind it.
**Recommendation:** Ensure the header backdrop-filter uses a stronger blur (20-24px) with a slightly tinted background (`rgba(20,20,22,0.75)`) so content bleeding through is visible but diffused. Add a subtle bottom border glow on scroll.
**Example:** As the user scrolls, content slides behind the header and becomes a soft, warm blur — the header gains a `1px solid rgba(212,175,55,0.08)` bottom border that wasn't there at scroll position 0.

### 10. The CTA button gold feels flat — add material depth
**Issue:** The CTA button is solid `#F9E076` with a top white border. Premium 2026 buttons simulate material — metal, glass, or satin — with internal gradients and reflections.
**Recommendation:** Add a subtle vertical gradient within the button: lighter gold at top (`#FBE88A`), standard at middle (`#F9E076`), slightly deeper at bottom (`#E8D06A`). Combined with the existing top white border, this creates a "gold bar" or "stamped metal" feel appropriate to the filmmaker/finance brand.
**Example:** The "MODEL YOUR DEAL" button looks like a polished gold ingot — brighter where light hits the top, deeper at the base, with a faint inner shadow at the bottom edge.

### 11. Color-coded data needs a secondary signal beyond hue
**Issue:** Green (#4DAF78) for profit and red (#C84040) for loss rely solely on color to communicate meaning. Approximately 8% of males have color vision deficiency.
**Recommendation:** Pair each semantic color with a shape or icon signal: upward arrow or + prefix for positive values, downward arrow or - prefix for negative. The waterfall tiers already use "FUNDED"/"UNFUNDED" labels (good), but the 30-Second Card metrics and slider outputs should follow suit.
**Example:** Net Profit displays as a green number with a small upward-right arrow icon; Total Deductions as red with a small downward arrow — readable even in grayscale.

### 12. Tab bar active state needs stronger differentiation
**Issue:** The bottom tab bar uses a gold underline and color change for active state. On OLED screens in bright ambient light, the underline can be hard to spot.
**Recommendation:** Add a subtle filled background to the active tab — `rgba(212,175,55,0.08)` with rounded corners — in addition to the underline. This creates a "pill" highlight that's visible even in direct sunlight. Also slightly increase the active icon size (20px to 22px) for immediate scannability.
**Example:** Active tab has a soft gold-tinted pill behind it (like iOS tab bars in 2026), making the current step obvious at a glance.

---

## OPTIONAL (Polish & Delight)

### 13. Consider animated gradient borders for the hero/closer sections
**Rationale:** Slow-moving gradient borders (gold shifting through warm amber tones over 8-10s) are a signature 2026 premium dark-mode treatment. Used sparingly on 1-2 hero moments, they communicate craft without feeling gimmicky.
**Example:** The closer section "YOUR NEXT PITCH IS COMING" wrapper has a border that slowly shifts from gold to warm amber and back, creating a "living" border that draws the eye to the CTA.

### 14. Add depth-of-field blur to background content when modals open
**Rationale:** Beyond the standard dark overlay, premium apps now blur the background content (4-8px) when a modal opens, creating a camera rack-focus effect. This is on-brand for a filmmaker tool.
**Example:** When the email gate modal opens, the calculator behind it doesn't just darken — it softly blurs like a shallow depth-of-field shot, then snaps back into focus when the modal closes.

### 15. Introduce a "scroll progress" ambient glow
**Rationale:** As the user scrolls through the landing page, a very faint ambient radial glow (gold, 2-3% opacity) could follow their scroll position, creating a subtle "spotlight" that tracks reading progress. This is especially effective on OLED where even 2% gold is perceptible.
**Example:** A large, soft radial gradient (400px radius) that's anchored vertically to the viewport center and follows scroll, like a reading lamp moving down the page.

### 16. Refine the grain overlay for different viewport contexts
**Rationale:** The film grain is a strong brand signal but currently static. In 2026, premium dark apps subtly animate grain (shifting 1-2 frames per second) to create a "living" texture. This would reinforce the filmmaker identity without adding visual noise.
**Example:** The grain shifts subtly every 500ms (2fps), just enough to feel organic but slow enough to not distract from content. Disabled under `prefers-reduced-motion`.

### 17. Typography: consider a display variable font for hero moments
**Rationale:** Bebas Neue is solid but limited (400 weight only, no optical sizing). Premium 2026 typography increasingly uses variable display fonts that can subtly adjust weight and width responsively. A variable alternative (like "Oswald" variable or a custom cut) would allow the hero headline to feel more dynamic at different viewport sizes.
**Example:** The hero headline uses a variable font where the weight subtly increases from 400 to 500 as the viewport widens, creating a naturally heavier presence on desktop without changing font-size alone.

### 18. Empty/loading states need premium treatment
**Rationale:** When the calculator is processing or sections are loading, skeleton states and loaders should match the premium dark aesthetic — gold shimmer placeholders instead of generic gray pulse animations.
**Example:** Loading skeleton cards use a slow gold shimmer sweep (`linear-gradient` animation from left to right, gold at 0.05 opacity) instead of the standard gray pulse, reinforcing the brand even during wait states.

---

## Priority Summary

| # | Category | Item | Impact |
|---|----------|------|--------|
| 1 | Must-Fix | Dark inputs in LeadCaptureModal | Breaks dark mode consistency |
| 2 | Must-Fix | Three-level surface elevation | Flatness undermines depth system |
| 3 | Must-Fix | Universal focus-visible states | Keyboard accessibility gap |
| 4 | Must-Fix | Widen text opacity hierarchy | Scannability and visual hierarchy |
| 5 | High | Vary grain texture per surface | Tactile material differentiation |
| 6 | High | Gradient border-top highlights | Modern edge-light treatment |
| 7 | High | Micro-interaction on data changes | Confirms model recalculation |
| 8 | High | Richer card hover dimensionality | Cards feel alive and responsive |
| 9 | High | Stronger header glassmorphism | Better scroll context + depth |
| 10 | High | CTA button material gradient | Gold bar/ingot premium feel |
| 11 | High | Shape signals alongside color | Color-blind accessibility |
| 12 | High | Tab bar active pill highlight | Sunlight legibility |
| 13 | Optional | Animated gradient hero borders | Signature premium flourish |
| 14 | Optional | Modal depth-of-field blur | Filmmaker-brand camera effect |
| 15 | Optional | Scroll-tracking ambient glow | Subtle reading progress signal |
| 16 | Optional | Animated grain (2fps) | Living texture, brand identity |
| 17 | Optional | Variable display font for hero | Responsive typographic weight |
| 18 | Optional | Gold shimmer loading skeletons | Branded loading states |
