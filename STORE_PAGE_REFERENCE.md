# filmmaker.og — Store Page Reference Guide

**Source of truth:** `src/pages/Store.tsx` (1,508 lines), `src/lib/store-products.ts`
**Last extracted:** March 21, 2026 (commit d293e0e)
**Companion docs:** `LANDING_PAGE_REFERENCE.md` (canonical visual standard), `UNIVERSAL_PATTERN_LIBRARY.md` (shared patterns)

---

## 1. PAGE ARCHITECTURE

### Container

```tsx
<div style={{ minHeight: "100vh", background: "#000", maxWidth: "430px", margin: "0 auto" }}>
```

Same shell as the landing page. 430px mobile-first, true black, centered.

### Section Stack (render order)

```
§1  ON DEMAND — hero + Full Analysis product card
    ── 48px spacer ──
§2  RESEARCH — hero + Comp Report product card
    ── 48px spacer ──
§3  TURNKEY — hero + Producer's Package + Boutique service cards
    ── breath line ──
§4  FAQ — "Before You Buy" accordion (5 items)
    ── breath line ──
    BESPOKE CLOSER — "Need Something Different?" email CTA
    FOOTER
```

### Key Architectural Differences from Landing Page

| Pattern | Landing Page | Store |
|---------|-------------|-------|
| Section dividers | 3px purple-gold gradient bar | 48px spacers (no visible line) between product sections; 1px gold breath lines before FAQ and closer |
| Section canopies | Purple radial at top | Color-matched radial per section (gold §1, green §2, gold §3/§4) |
| Card surfaces | Glass (`rgba(6,6,6,0.92)` + blur) | Opaque `#0A0A0A` with radial gradient atmospheric |
| Borders | Standard `1px solid rgba(...)` | CSS mask gradient borders |
| CTA buttons | Purple gradient only | Tier-colored solid fills |
| Body font size | `18px` | `19px` (slightly larger) |

### Styling Convention

Zero Tailwind classes. All styles via `const s: Record<string, React.CSSProperties>` + `tierStyles` object. Follows the same inline convention as the landing page.

---

## 2. THREE-SECTION PRODUCT ARCHITECTURE

Products are grouped into three sections by category:

| Section | Category Filter | Products | Accent Color |
|---------|----------------|----------|-------------|
| On Demand | `category === "product"` | The Full Analysis ($197) | Gold `#D4AF37` |
| Research | `category === "research"` | Comp Report ($595/$995) | Green `#3CB371` |
| Turnkey | `category === "service"` | Producer's Package ($1,797), Boutique ($2,997+) | Purple `rgb(120,60,180)` / Gold-to-Purple gradient |

Data source: `src/lib/store-products.ts` exports `selfServeProducts`, `researchProducts`, `turnkeyServices`.

### Product Data Shape

```typescript
interface Product {
  id: string;            // Stripe-facing identifier
  slug: string;          // URL slug for /store/:slug
  name: string;          // Display name
  price: number;         // Dollar amount
  priceNote: string | null;  // "5 comps · 10 comps for $995"
  badge: string | null;  // "TRENDING", "DATA", etc.
  tier: number;          // Sort order
  category: "product" | "service" | "research";
  turnaround?: string;   // "Instant" or "5 business days"
  shortDescription: string;
  features: string[];    // Checkmark list
  pickThisIf: string | null;  // Gold subtitle
  ctaLabel: string;      // Button text
  // ... plus fullDescription, whatsIncluded, whoItsFor, upgradePrompt
}
```

---

## 3. FOUR-TIER COLOR SYSTEM

Each product tier has a complete color definition controlling every visual element of its card.

### Gold Tier (Full Analysis)

```tsx
{
  card: {
    background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, #0A0A0A 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
  },
  gradientBorder: "linear-gradient(180deg, rgba(212,175,55,0.55) 0%, rgba(212,175,55,0.20) 50%, rgba(212,175,55,0.40) 100%)",
  topline: { height: "1px", background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.50), transparent)" },
  featureCheck: { color: "#D4AF37", textShadow: "0 0 12px rgba(212,175,55,0.4)" },
  btn: "btnGoldSolid",  // #D4AF37 bg, #000 text
}
```

### Green Tier (Comp Report)

```tsx
{
  card: {
    background: "radial-gradient(ellipse at 50% 0%, rgba(60,179,113,0.07) 0%, #0A0A0A 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.5), 0 0 40px rgba(60,179,113,0.04)",
  },
  gradientBorder: "linear-gradient(180deg, rgba(60,179,113,0.50) 0%, rgba(60,179,113,0.20) 50%, rgba(60,179,113,0.35) 100%)",
  topline: { height: "1px", background: "linear-gradient(90deg, transparent, rgba(60,179,113,0.50), transparent)", boxShadow: "0 0 12px rgba(60,179,113,0.3)" },
  featureCheck: { color: "#3CB371", textShadow: "0 0 12px rgba(60,179,113,0.4)" },
  btn: "btnGreenSolid",  // #3CB371 bg, #000 text
}
```

### Purple Tier (Producer's Package)

```tsx
{
  card: {
    background: "radial-gradient(ellipse at 50% 0%, rgba(120,60,180,0.08) 0%, rgba(212,175,55,0.04) 30%, #0A0A0A 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
  },
  gradientBorder: "linear-gradient(180deg, rgba(212,175,55,0.45) 0%, rgba(212,175,55,0.15) 40%, rgba(120,60,180,0.30) 70%, rgba(120,60,180,0.50) 100%)",
  topline: { height: "2px", background: "linear-gradient(90deg, transparent, rgba(120,60,180,0.50), rgba(212,175,55,0.40), transparent)" },
  featureCheck: { color: "rgb(160,100,255)", textShadow: "0 0 14px rgba(140,80,240,0.5)" },
  btn: "btnPurple",  // purple gradient bg, #fff text
}
```

### Purple-Elevated Tier (Boutique)

The highest-prominence tier. Everything about it is amplified:

```tsx
{
  card: {
    background: "radial-gradient(ellipse at 50% 0%, rgba(120,60,180,0.10) 0%, rgba(212,175,55,0.06) 30%, #0A0A0A 70%)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.8), 0 0 60px rgba(120,60,180,0.10), 0 0 120px rgba(212,175,55,0.06)",
  },
  gradientBorder: "linear-gradient(180deg, rgb(110,50,170) 0%, rgba(120,60,180,0.5) 30%, rgba(212,175,55,0.4) 70%, #D4AF37 100%)",
  topline: { height: "3px", background: "linear-gradient(90deg, transparent, rgb(110,50,170), #D4AF37, transparent)" },
  headerBg: "radial-gradient(ellipse at 50% 100%, rgba(120,60,180,0.06) 0%, transparent 70%)",
  badge: { boxShadow: "0 0 12px rgba(120,60,180,0.10)" },  // extra glow on badge
}
```

### Tier Assignment Logic

```tsx
const getTier = (product: Product) => {
  if (product.id === "the-full-analysis") return tierStyles.gold;
  if (product.id === "comp-report") return tierStyles.green;
  if (product.id === "boutique") return tierStyles.purpleTop;
  if (product.category === "service") return tierStyles.purple;
  return tierStyles.gold;  // fallback
};
```

---

## 4. CARD ANATOMY

### ProductCard (On Demand + Research tiers)

```
[GRADIENT BORDER] — CSS mask overlay, tier-colored
[TOPLINE] — 1-2px gradient, tier-colored
[HEADER] — badge + card name (2.6rem Bebas) + "Pick this if..." subtitle
[PRICE BLOCK] — price (2.4rem Roboto Mono 700) + priceNote + short description
[SUBDIVIDER] — tier-colored gradient
[FEATURES] — checkmark list (tier-colored ✓ + 18px Inter)
[ACTION] — primary CTA button + optional secondary + "See full details →" link
```

### ServiceCard (Turnkey tier)

Same anatomy as ProductCard with additions:
- Turnaround badge: clock icon + "5 business days" in muted chip
- `headerBg` radial gradient (purple-elevated only)

### Comp Report Special Handling

The Comp Report has a custom `CompPricingBlock` instead of a standard price display:

```tsx
// Two-row pricing: 10 comps ($995) primary + 5 comps ($595) secondary
// Green tint background, green borders
// Primary CTA: "GET 10 COMPS — $995"
// Secondary CTA: "OR GET 5 COMPS — $595" (outline style)
```

---

## 5. BUTTON SYSTEM

### Solid Fill Buttons (primary CTAs — ALL tiers)

All primary CTAs on the Store are solid fills. Base pattern:

```tsx
{
  width: "100%", padding: "18px",
  fontFamily: "'Roboto Mono', monospace",
  fontSize: "16px", fontWeight: 700,
  letterSpacing: "0.10em", textTransform: "uppercase",
  border: "none", borderRadius: "6px", cursor: "pointer",
}
```

| Variant | `color` | `background` | `boxShadow` |
|---------|---------|-------------|-------------|
| `btnGoldSolid` | `#000` | `#D4AF37` | `0 0 20px rgba(212,175,55,0.35), 0 0 50px rgba(212,175,55,0.10)` |
| `btnGreenSolid` | `#000` | `#3CB371` | `0 0 20px rgba(60,179,113,0.35), 0 0 50px rgba(60,179,113,0.10)` |
| `btnCta` | `#000` | `#F9E076` | `0 0 20px rgba(249,224,118,0.3), 0 0 60px rgba(249,224,118,0.1)` |
| `btnPurple` | `#fff` | gradient | `0 0 24px rgba(120,60,180,0.35), 0 0 60px rgba(212,175,55,0.10)` |

Purple CTA differentiation (intentional): btnPurple uses fontSize: 18px and fontWeight: 600 — deliberately different from the 16px/700 standard on gold and green CTAs. The slightly larger, lighter weight gives turnkey-tier buttons (Producer's Package, Boutique) a more luxurious, less transactional presence. This is a brand signal, not an inconsistency. Do not normalize to 16px/700.

### Outline Buttons (secondary actions)

```tsx
{
  // Same base but:
  fontWeight: 600, // (not 700)
  color: TIER_COLOR,
  background: "rgba(TIER_COLOR,0.05)",
  border: "1px solid rgba(TIER_COLOR,0.30)",
}
```

Used for: secondary Comp Report CTA ("OR GET 5 COMPS"), bespoke email CTA.

### Hover States

Solid buttons: `boxShadow` intensifies, `translateY` lift (gold/green: -2px, purpleTop: -4px).
Outline buttons: `background` brightens, `borderColor` brightens.

All buttons: `scale(0.98)` on mouseDown.

---

## 6. SECTION HEROES

Each product section has a hero with the same pattern:

```tsx
<section style={{ padding: "SECTION_PADDING", textAlign: "center", position: "relative" }}>
  {/* Atmospheric canopy */}
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    background: "radial-gradient(ellipse 80% 60% at 50% POSITION%, rgba(COLOR,OPACITY) 0%, transparent 70%)",
    pointerEvents: "none",
  }} />
  <div style={{ position: "relative" }}>
    <EyebrowRuled text="SECTION_NAME" />
    <h1/h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: SIZE, ... }}>
      LINE_1<br/><span style={{ color: ACCENT }}>LINE_2</span>
    </h1/h2>
    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "19px", color: "rgba(255,255,255,0.88)", ... }}>
      SUB_TEXT
    </p>
  </div>
</section>
```

| Section | Eyebrow | Headline | Gold Accent | Atmospheric |
|---------|---------|----------|-------------|-------------|
| On Demand | "On Demand" | "Your Numbers. Investor-Ready." | "Investor-Ready." | gold 0.25 at top |
| Research | "Research" | "Defend Your Valuation." | green "Valuation." | green 0.08 at 60% |
| Turnkey | "Turnkey" | "We Build It With You." | gold "With You." | gold 0.10 at 60% |
| FAQ | "Questions" | "Before You Buy" | gold "Buy" | gold 0.10 at 60% |

§1 hero: `padding: 40px 24px 32px`, `h1` at `3.8rem`.
§2/§3/§4 heroes: `padding: 16px 24px 32px`, `h2` at `3.2rem`.

---

## 7. FAQ — "Before You Buy"

Framed as purchase-objection handling, not generic FAQ.

### FaqItem Component

```tsx
// Accordion pattern: Bebas 1.5rem question + ChevronDown icon
// Open state: gold text, rotated chevron, animated answer reveal
// Answer: Inter 19px at rgba(255,255,255,0.70), lineHeight 1.6
// Separated by gold 0.15 bottom borders
// Animation: @keyframes faqOpen (opacity 0→1, translateY -5px→0, 0.3s ease-out)
```

### FAQ Data (5 items)

1. "What do you need from me?"
2. "Can I see what I'm getting before I buy?"
3. "What happens if the deliverables don't hold up?"
4. "What's The Working Model and when do I see it?"
5. "Can I upgrade and apply what I've already paid?"

---

## 8. BESPOKE CLOSER

A standalone card below the FAQ — soft CTA for custom engagements.

```tsx
{
  background: "#0A0A0A",
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: "12px",
  padding: "36px 24px",
  textAlign: "center",
}
// Plus: inner decorative border inset 6px at gold 0.08
// Hover: outer border 0.25 → 0.40
```

Headline: "NEED SOMETHING DIFFERENT?" (gold on "DIFFERENT?")
CTA: Gold outline `mailto` link with Mail icon → "Get In Touch →"

---

## 9. WORKING MODEL POPUP

Bottom-sheet upsell that appears at checkout for any product purchase.

```tsx
// Overlay: rgba(0,0,0,0.80) + blur(4px)
// Sheet: #0A0A0A, top-radius 12px, gold border 0.35 (no bottom border)
// Animation: faqOpen keyframe (same as FAQ)
// Header: gold atmospheric gradient + "ADD-ON" badge + "$79" price
// Body: product description + feature list
// Actions: "ADD TO ORDER" (gold solid CTA) + "No thanks" (text link)
```

The popup triggers `startCheckout` with either `productId` alone (decline) or `[productId, "the-working-model-discount"]` (accept).

---

## 10. CHECKOUT FLOW

```tsx
const startCheckout = async (productId: string, addonId?: string) => {
  const body = addonId ? { items: [productId, addonId] } : { productId };
  const { data, error } = await supabase.functions.invoke("create-checkout", { body });
  if (data?.url) window.location.href = data.url;
};
```

Boutique is special: `mailto` link instead of checkout.
Loading overlay: fixed, full-screen, gold Roboto Mono "CONNECTING TO CHECKOUT..."

---

## 11. TYPOGRAPHY SCALE (15 distinct sizes)

| Size | Font | Role |
|------|------|------|
| `3.8rem` | Bebas | Store hero h1 ("Your Numbers.") |
| `3.2rem` | Bebas | Section h2s (Research, Turnkey, FAQ) |
| `2.6rem` | Bebas | Product card names |
| `2.4rem` | Roboto Mono | Prices |
| `2.2rem` | Bebas | Bespoke closer headline |
| `1.8rem` | Roboto Mono | Working Model price |
| `1.5rem` | Bebas | FAQ question text |
| `20px` | Roboto Mono | Feature checkmarks |
| `19px` | Inter | Body text, section subs, FAQ answers |
| `18px` | Inter/Mono | Feature text, comp pricing, CTA buttons |
| `16px` | Inter/Mono | Pick-this-if text, buttons, comp row text |
| `15px` | Inter/Mono | Details link, eyebrow label, bespoke CTA |
| `14px` | Mono | Footer text, working model details |
| `12px` | Mono | Turnaround badge, footer nav, price notes |
| `11px` | Mono | Badge labels, working model badge |

---

## 12. SECTION SPACERS AND DIVIDERS

| Between | Pattern | Size |
|---------|---------|------|
| §1 → §2 | Empty spacer | `48px` |
| §2 → §3 | Empty spacer | `48px` |
| §3 → §4 | Breath line (1px gold gradient) | `24px` padding above/below |
| §4 → Closer | Breath line (1px gold gradient) | `16px` padding above/below |

Breath line:
```tsx
{
  height: "1px",
  background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.35) 50%, transparent 95%)",
  boxShadow: "0 0 12px rgba(212,175,55,0.2)",
  margin: "0 24px",
}
```

The spacing tightens toward the bottom of the page (conversion acceleration — same principle as landing page).

---

## 13. FOOTER

Synced with landing page footer pattern. Background `#0A0A0A`, gold border top at `rgba(212,175,55,0.12)`. Social icons (IG/TikTok/FB) → nav links (Shop · Resources) → legal disclaimer.

Minor differences from landing page footer: gold border (not white), different nav link opacity (0.35 vs 0.50), footer font size 12px (not 13px).

---

## 14. WHAT NOT TO DO

- Do NOT add prices to the landing page (Store is the pricing surface)
- Do NOT use the landing page's purple gradient CTA on Store (Store uses tier-colored solid fills)
- Do NOT mix tier colors on a single card (one tier = one color system)
- Do NOT use glass `blur()` on Store cards (they're opaque `#0A0A0A` — glass sweep planned but not shipped)
- Do NOT change the product data in `Store.tsx` — it lives in `src/lib/store-products.ts`
- Do NOT break the Working Model popup flow — it's the upsell mechanism
- Do NOT change Boutique from `mailto` to checkout — it's intentionally contact-only
