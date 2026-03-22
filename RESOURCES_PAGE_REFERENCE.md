# filmmaker.og — Resources Page Reference Guide

**Source of truth:** `src/pages/Resources.tsx` (1,256 lines), `src/lib/glossary-rotation.ts`
**Last extracted:** March 21, 2026 (commit d293e0e)
**Companion docs:** `LANDING_PAGE_REFERENCE.md`, `UNIVERSAL_PATTERN_LIBRARY.md`
**Audit shipped:** March 22, 2026 (PR #TBD) — glass hero, pinned cards below command center with purple pins, purple command center, standard footer, atmospheric bumps across all card states. See session brief for full proposal list.

---

## 1. PAGE ARCHITECTURE

### Container

```tsx
<div style={{
  background: "#000",
  color: "rgba(255,255,255,0.95)",
  fontFamily: "'Inter', sans-serif",
  minHeight: "100vh",
}}>
```

**Key difference from Landing/Store:** Resources does NOT use `maxWidth: 430px`. The pinned section, command center, and grid use `maxWidth: 1000px, margin: 0 auto` — this is the only page that expands beyond 430px on desktop. Mobile still renders at mobile width via responsive overrides.

### Section Stack (render order)

```
HERO — Glass card: "RESOURCE / VAULT" + subtext (matches Index.tsx hero pattern)
── breath line ──
COMMAND CENTER — sticky search + filter bar (purple atmospheric + purple search border)
PINNED CARDS — 2 cornerstone entries, stacked vertically, purple pin indicators
── purple separator ──
RESULTS BAR — count + sort toggle
VAULT GRID — filtered VaultCard list
FOOTER — standard social + nav + disclaimer (synced with Index.tsx / Store.tsx)
```

### Styling Convention

Mostly inline `style={{}}` (68 instances) with 12 `className` usages for scroll utilities and responsive overrides. The responsive CSS is injected via a script block at the bottom of the file (not imported CSS).

---

## 2. CARD STATE SYSTEM

Resources uses a three-tier card state system instead of semantic colors:

| State | Meaning | Border | Topline | Haze | Badge |
|-------|---------|--------|---------|------|-------|
| `gold-featured` | Editor's pick / high-value | gold 0.30 (hover: 0.50) | 2px gold gradient (0.50, hover: 0.65) | Gold radial 0.10 | Gold bg 0.12 + gold border 0.30 |
| `gold` | Standard editorial content | gold 0.20 (hover: 0.35) | 1px gold gradient (0.20, hover: 0.35) | Gold radial 0.05 | Transparent bg + white border 0.12 |
| `neutral` | Glossary definitions | white 0.10 (hover: 0.20) | 1px white gradient (0.08, hover: 0.15) | None | White 0.04 bg + white border 0.08 |

Every card property adapts based on state: border, boxShadow, topline, haze, badge, eyebrow color, meta color, dot color, hover arrow color.

### Card State Assignment

Set in `VAULT_ENTRIES` data array per entry:
- `gold-featured`: SAG-AFTRA AI Provisions, Artists Equity Model
- `gold`: All other editorial articles/guides
- `neutral`: All glossary terms (auto-converted from Supabase `glossary_terms` table)

---

## 3. VAULT CARD ANATOMY

```tsx
<a style={{
  borderRadius: 12,
  position: "relative",
  overflow: "hidden",
  background: "#0A0A0A",
  display: "flex",
  flexDirection: "column",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
  padding: "24px 22px 20px",
  // + cardReveal animation
  // + getCardBorderStyle(state, hovered)
}}>
  [TOPLINE]     — 1-2px gradient, state-colored, absolute top
  [HAZE]        — 80px gold radial gradient, state-intensity
  [EYEBROW]     — Roboto Mono 11px, gold or muted, category label
  [TITLE]       — Bebas Neue 1.5rem, white, lineHeight 1.05
  [EXCERPT]     — Inter 16px, white 0.60, 3-line clamp (2 on mobile)
  [META ROW]    — badge pill + date + read time + hover arrow (→ or ↗)
</a>
```

### Card Reveal Animation

```tsx
const cardReveal: React.CSSProperties = {
  opacity: prefersReducedMotion || inView ? 1 : 0,
  transform: prefersReducedMotion || inView
    ? (hovered ? "translateY(-3px)" : "translateY(0)")
    : "translateY(20px)",
  transition: prefersReducedMotion
    ? "none"
    : "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, box-shadow 0.4s",
  transitionDelay: prefersReducedMotion ? "0ms" : `${(index % 6) * 50}ms`,
};
```

Stagger resets every 6 cards (`index % 6`) to avoid long delays on long lists.

---

## 4. PINNED CORNERSTONE CARDS

Two featured entries in a horizontal scroll container:

### Primary Pinned Card (78% width)

```tsx
{
  flex: "0 0 78%",
  scrollSnapAlign: "start",
  borderRadius: 12,
  padding: "22px 20px",
  background: "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08) 0%, #0A0A0A 70%)",
}
// Gold border 0.40 via absolute overlay div
// 2px gold topline (0.60)
// Content: "Start Here" eyebrow → "What Is a Recoupment Waterfall" title → "Editor's Choice" gold solid badge
```

### Secondary Pinned Card (stacked, full width)

```tsx
{
  // No flex sizing — stacked vertically below primary
  scrollSnapAlign: "start",
  borderRadius: 12,
  padding: "22px 20px",
  background: "#0A0A0A",
  border: "1px solid rgba(212,175,55,0.20)",
}
// 1px gold topline (0.35)
// Content: "Reference" eyebrow → "15 Terms Your Investors Expect You to Know" title → "Glossary" meta label
```

### Mobile Horizontal Scroll

```css
.vault-pinned-grid {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  margin: 0 -24px;     /* bleed to edges */
  padding: 0 24px 8px; /* inset content */
}
```

Edge-to-edge bleed with inset padding — content starts at 24px but scroll extends to screen edges.

---

## 5. COMMAND CENTER (sticky bar)

```tsx
{
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "rgba(0,0,0,0.88)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  borderTop: "1px solid rgba(212,175,55,0.10)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  padding: "14px 24px",
  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.9)",
}
```

Contains two elements in a flex row (gap 12px):

### Search Input

```tsx
{
  background: "rgba(212,175,55,0.04)",  // focused: 0.06
  border: "1px solid rgba(212,175,55,0.25)",  // focused: 0.40
  borderRadius: 12,
  height: 48,
  fontSize: 16,
  padding: "0 44px 0 48px",  // space for search icon and clear button
}
```

Gold search icon (18×18, `rgba(212,175,55,0.60)`) positioned left. Clear button (36px circle, `rgba(255,255,255,0.08)` bg) positioned right when search is active.

### Filter/Sort Dropdown

Mobile: 48×48 icon-only button with filter icon.
Desktop (768px+): wider button showing label text.

Dropdown panel: `rgba(8,8,8,0.98)` + `blur(20px)`, 240px wide, contains Sort section (Newest/Oldest) and Filter section (All/Financing/Distribution/etc). Active items have gold left border accent (2px solid #D4AF37).

Active filter indicator: 8px gold dot (`background: #D4AF37, borderRadius: 50%, boxShadow: 0 0 8px rgba(212,175,55,0.6)`) appears on the button when a non-default filter/sort is active.

---

## 6. GLOSSARY SYSTEM

### Daily Rotation

```tsx
import { getDailyGlossary, getAllGlossary } from '@/lib/glossary-rotation';

// On mount: fetch 4 daily terms (deterministic date-seeded, same for all users)
getDailyGlossary(4).then(setDailyGlossary);

// When "Glossary" filter selected: fetch all terms
getAllGlossary().then(setAllGlossary);
```

### Glossary → VaultEntry Conversion

```tsx
function glossaryToVaultEntry(term: GlossaryTerm): VaultEntry {
  return {
    id: `glossary-${term.id}`,
    title: term.term,
    excerpt: term.definition,
    category: "glossary",
    type: "glossary",
    cardState: "neutral",  // always neutral
    badgeLabel: "Definition",
    // ...
  };
}
```

### Data Source

Supabase `glossary_terms` table. RLS enabled (public read, admin-only writes). PKs via `gen_random_uuid()`, indexes on `term`, `category`, `created_at desc`.

---

## 7. FILTERING & SORTING

### Categories

```tsx
const CATEGORY_LABELS = {
  all: "All",
  financing: "Financing",
  distribution: "Distribution",
  "business-affairs": "Business Affairs",
  development: "Development",
  ai: "AI in Film",
  glossary: "Glossary",
};
```

### Filter Logic

When `activeFilter === "glossary"`: show ONLY glossary entries (editorial hidden).
When `activeFilter === "all"`: show editorial + daily glossary (4 terms).
Otherwise: show editorial entries matching category + glossary entries matching search.

Sort: `newest` (default, desc by date) or `oldest` (asc).

### Results Bar

Between command center and grid: shows `"{N} entries"` or `"{N} results for "query""` + sort toggle (clickable).

---

## 8. CONTENT DATA

### Editorial Entries (hardcoded in VAULT_ENTRIES)

| ID | Title | Category | State |
|----|-------|----------|-------|
| `sag-aftra-ai` | SAG-AFTRA's AI Provisions And What They Cost | ai | gold-featured |
| `artists-equity` | Why The Artists Equity Model Changes The Math | distribution | gold-featured |
| `theatrical-lottery` | The Theatrical Lottery Is Not A Strategy | distribution | gold |
| `tax-credits` | Tax Credits Are Not Free Money | financing | gold |
| `first-spv` | Structuring Your First SPV | business-affairs | gold |

All `href: "#"` — content not yet published. Cards are live but link to self.

---

## 9. BREATH LINES

Same pattern as Store:

```tsx
{
  height: 1,
  background: "linear-gradient(90deg, transparent 5%, rgba(212,175,55,0.35) 50%, transparent 95%)",
  boxShadow: "0 0 12px rgba(212,175,55,0.2)",
  margin: "0 24px",
}
```

Appears between header and pinned section, and between pinned section and command center.

---

## 10. FOOTER (synced with Index.tsx / Store.tsx)

Standard shared footer with social icons (Instagram, TikTok, Facebook), nav links (Home, Shop, Resources), and legal disclaimer. `#0A0A0A` background, gold `0.12` border-top, `32px 24px 40px` padding.

---

## 11. RESPONSIVE BEHAVIOR

Resources is the only page with explicit responsive CSS. Injected via script block at bottom of file:

### Mobile (max-width: 767px)
- Pinned cards: 78% width, horizontal scroll with snap
- Search: full width, 48px height, 16px font
- Filter: icon-only 48px button
- Dropdown: full viewport width minus gutters
- Card excerpts: 2-line clamp (vs 3 on desktop)

### Desktop (min-width: 768px)
- Pinned cards: side-by-side in flex row
- Filter: wider button with label text
- Card excerpts: 3-line clamp
- Content max-width: 1000px centered

---

## 12. TYPOGRAPHY SCALE (Resources-specific)

| Size | Font | Role |
|------|------|------|
| `4.2rem` | Bebas | Page header "Resource Vault" |
| `1.9rem` | Bebas | Primary pinned card title |
| `1.6rem` | Bebas | Secondary pinned card title |
| `1.8rem` | Bebas | Vault card titles (gold/gold-featured) |
| `1.6rem` | Bebas | Vault card titles (neutral) |
| `22px` | — | Hover arrow (→ / ↗) |
| `16px` | Inter | Card excerpt, search input |
| `14px` | Mono | Card meta (date, read time) |
| `13px` | Mono | Footer brand label, dropdown items |
| `12px` | Mono | Badges, pinned labels, "Editor's Choice", filter, results bar |
| `12px` | Mono | Card eyebrow |
| `11px` | Mono | Badge text, dropdown button |
| `8px` | — | Meta dot separator |

---

## 13. WHAT NOT TO DO

- Do NOT add `maxWidth: 430px` to Resources — it uses 1000px for desktop grid
- Do NOT remove the responsive CSS injection — it controls mobile behavior
- Do NOT change glossary rotation to cron-based — deterministic date seeding is by design
- Do NOT use glass blur on vault cards — they're opaque `#0A0A0A` (consistent with Store)
- Do NOT diverge the footer from Store.tsx / Index.tsx — Resources now uses the standard shared footer
- Do NOT put editorial content href links to "#" in production — they're placeholder
- Do NOT change card state assignment logic without updating all dependent style functions
