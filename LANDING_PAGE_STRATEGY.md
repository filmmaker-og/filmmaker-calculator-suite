# Landing Page Strategy — Design System Review

> Strategic analysis of how to apply the FILMMAKER.OG Design System to a waterfall calculator landing page.
> This is a planning document. No code. No mockups.

---

## Document Conflict Note

The three design docs have meaningful conflicts:
- **FILMMAKER_OG_Modern_Design_System_2026.md** uses `#FFD700` gold, pushes heavy glassmorphism (Advisory)
- **DESIGN_SYSTEM.md** uses a two-gold system (`#D4AF37` metallic / `#F9E076` CTA), is more restrained (Mandatory)
- **README_TEMPLATE.md** correctly labels the 2026 doc as "Advisory" and the brand system as "Mandatory"

This analysis follows that hierarchy: brand system wins over 2026 reference when they conflict.

---

## 1. Highest-Impact Patterns (Top 5)

### #1: Progressive Disclosure
First-time indie filmmakers don't know what a waterfall is. If the landing page dumps every feature and term above the fold, they'll bounce. Reveal complexity gradually: emotional problem → solution exists → proof it works → invitation. Mirrors the chapter-by-chapter flow the calculator already uses.

### #2: Typography Hierarchy (Bebas Neue + Inter + Roboto Mono)
The three-font system is the single strongest brand signal. Bebas Neue = cinema (movie poster font). Roboto Mono on financial figures = "this does real math." Inter = modern, readable, professional. Subconscious message: "this feels like film AND finance."

### #3: The Two-Gold System
`#D4AF37` (metallic) creates premium institutional feel. `#F9E076` (CTA) draws the eye to interactive elements only. On a landing page, the distinction between "admire" gold and "act" gold is the difference between looking expensive and converting.

### #4: Black Void + Card Layering
The four-layer depth system (void → card → elevated → surface) creates cinematic quality no competitor has. Most SaaS pages are white/gray. This immediately feels different — like a theater darkening before the film starts.

### #5: Button Type Discipline
Landing page needs exactly two types: Primary CTA (`gold-cta`) and Ghost Gold (secondary actions). No Vault Buttons, no mixing patterns.

---

## 2. Brand Consistency Check

### Aligned with "Premium but Humble":
- Card-based depth system — institutional, not startup-y
- Roboto Mono for financial figures — Bloomberg terminal energy
- Bebas Neue for headlines — cinematic authority
- 11px uppercase tracking-widest labels — reads like a financial document
- Restrained animation (no pulse, no animated counters)

### Risk of feeling too consumer-tech/startup-y:
- Confetti/particle effects on export — Duolingo behavior. Kill for landing page
- "Breathing animation" on hover — `active:scale-[0.98]` is sufficient
- Bento grid layouts — reads as "tech dashboard." Use structured, consistent grid for landing page
- Adaptive UI / personalization concepts — irrelevant for landing page, makes filmmakers suspicious
- Social OAuth prominence — lead with email magic link, bury social auth

---

## 3. Liquid Glass Trade-offs

### Use glass for:
- Sticky header (translucent with blur) — subtle, functional, premium
- Modal overlays (email capture, video lightbox)
- Testimonial cards floating over background imagery

### No glass for:
- Hero section — needs to hit hard, no visual noise
- Feature explanation sections — financial calculators need clarity, not blur
- Pricing/package cards — maximum readability when money decisions happen
- Any section with numbers or financial terminology — Roboto Mono needs crisp rendering
- CTAs — never glass behind a call-to-action

**Rule: Glass = atmosphere and transition. Solid = information and action. Landing page is 80% information and action.**

---

## 4. Mobile Navigation Decision

**Do not use bottom navigation on the landing page.**

Bottom nav is for the app (multi-tab tool). Landing page is a linear narrative.

### Instead:
- **Single-scroll page, no traditional nav**
- **Sticky minimal header:** Logo left, one CTA button right. Fixed, translucent glass. No hamburger
- **If section nav needed:** Scroll-progress indicator or dot nav, not full nav bar
- **Bottom of page:** Footer with secondary links (Privacy, Terms, Contact)
- **Transition point:** Full-width CTA bridging marketing → product ("Ready? Start your first waterfall")

---

## 5. Section Order (First Impression Architecture)

### Section 1 — Hero: Name the Pain (above the fold)
- "Know Exactly Where Your Money Goes Before You Shoot"
- Name the specific anxiety: filmmakers don't understand waterfall recoupment
- Single CTA. No feature list. No screenshots yet
- Should feel like a movie poster, not a software ad

### Section 2 — Credibility Anchor
- "Built on the same recoupment logic used by [studio/financier names]"
- Institutional language. Logos, press mentions, advisory names
- Metallic gold (#D4AF37) for this section

### Section 3 — The "Aha" Moment
- Visual walkthrough: enter budget → see waterfall → understand who gets paid
- Roboto Mono numbers. One focused GIF or short video
- "From budget to waterfall in 4 steps"

### Section 4 — Feature Breakdown
- 3-4 cards: guild calculations, capital stack, scenario comparison, PDF export
- Card depth system. Short copy: one headline + one sentence each

### Section 5 — Social Proof
- Testimonials or specific use cases
- Fallback: "Who This Is For" section describing the exact target user

### Section 6 — Pricing / What's Free
- Transparent about free vs. paid. Filmmakers are budget-conscious and suspicious of bait-and-switch

### Section 7 — Final CTA
- Full-width, cinematic. Different copy angle
- "Your investors are going to ask how the money flows back. Have the answer."
- Subtle gold glow for atmosphere

### Section 8 — Footer
- Logo, legal links, contact. "Built by filmmakers, for filmmakers"

---

## 6. Micro-Interactions That Matter for Conversion

### Worth implementing:
- **Button hover/press feedback** — confirms CTA is interactive, builds confidence
- **Scroll-triggered fade-ins** — creates narrative momentum. Keep subtle
- **Loading state for interactive demo** — skeleton loader prevents "broken" impression
- **Interactive calculator preview** — if embedded, the input → result transition deserves polish (gold border flash, numbers counting up in Roboto Mono)

### Skip for landing page:
- Inline form validation animations (one email field max)
- Chapter completion animations (app patterns)
- Progress indicators / saving states
- Breathing/pulse animations (VISUAL_SYSTEM.md already bans these)
- Skeleton loading for content sections (should be static HTML/CSS)
- Confetti/particle effects
- Tooltips / glossary triggers (write clearly, explain inline)

---

## 7. Risk Assessment

### Risk #1: Treating the landing page like a miniature app
The Design System is built for a multi-step calculator. A landing page is a marketing document. If you apply app patterns directly (bottom nav, chapter cards, input styling), you'll build a stretched product screenshot, not a sales page. Use brand tokens (colors, fonts, spacing) but design structure around conversion.

### Risk #2: Over-applying glassmorphism
The 2026 doc is excited about Liquid Glass. But the audience is evaluating whether to trust this tool with real financial decisions involving other people's money. Every glass blur subtly says "aesthetic over substance." Bloomberg and Stripe keep marketing pages clean and solid. Use glass as atmosphere (header, modals), not as primary visual language.

### Risk #3: Optimizing for "premium feel" over "clear value proposition"
On a landing page, the hierarchy is: **clear > premium > clever**. A filmmaker needs to understand within 5 seconds: what this does, who it's for, why trust it. If those 5 seconds are spent admiring gold gradients without communicating value, the conversion is lost. Cinematic elegance is correct for the product experience (user already committed), but the landing page needs directness.

---

*Created: February 2026 | For: filmmaker.og Landing Page Planning*
