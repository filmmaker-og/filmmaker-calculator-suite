
## The Resource — Page Rename, Identity & Menu Update

### Overview

Four focused changes across two files: `src/pages/Glossary.tsx` and `src/components/MobileMenu.tsx`. The route `/glossary` stays the same — only the visible labels change.

---

### Change 1 — Page Title: "THE RESOURCE"

**File:** `src/pages/Glossary.tsx`, lines 490–502

Current:
- Eyebrow: `Film Finance`
- H1: `The <span>Glossary</span>`
- Subtitle: "The film industry uses jargon to keep outsiders out. This is your decoder ring — {N} terms, curated from the front lines."

New:
- Eyebrow: `Film Finance` (keep — it's clean)
- H1: `The <span className="text-gold">Resource</span>`
- Subtitle: `"The film industry uses jargon to keep outsiders out. This is your definitive resource."`
- Remove the term count from the subtitle entirely (no number)

---

### Change 2 — Remove "AI Search" Eyebrow from Ask the OG Section

**File:** `src/pages/Glossary.tsx`, line 517

Current:
```
<SectionHeader eyebrow="AI Search" title={...} subtitle="Ask me film industry questions (only.)" />
```

New:
```
<SectionHeader eyebrow="" title={...} subtitle="Ask me film industry questions (only.)" />
```

The `SectionHeader` component renders the eyebrow text in a `<p>` tag — passing an empty string renders nothing visible. The gold Sparkles icon + "ASK THE OG" title + subtitle are sufficient identity on their own.

---

### Change 3 — Top 10 Section: Convert to Accordion Style

**File:** `src/pages/Glossary.tsx`, lines 658–700

The `@radix-ui/react-accordion` package is already installed. The current flat cards showing full definitions get replaced with an accordion where:

- Only the number badge + term name is visible by default (collapsed)
- Tapping/clicking reveals the definition below
- Only one item can be open at a time (`type="single" collapsible`)
- The "Master these 10 terms..." subtitle is removed
- The category badge is also removed (it's noise inside an accordion)

Structure of each accordion item:
```
[01]  WATERFALL                              ∨
      ──────────────────────────────────────
      [definition text, 16px, white/80]      ← only shown when expanded
```

The gold number badge, term name in Bebas Neue `text-2xl`, and gold chevron rotate on open — all consistent with existing accordion patterns in `src/components/ui/accordion.tsx`.

---

### Change 4 — Mobile Menu Label

**File:** `src/components/MobileMenu.tsx`, line 140

Current:
```tsx
<span className="font-bebas text-base tracking-wide">Glossary</span>
```

New:
```tsx
<span className="font-bebas text-base tracking-wide">ASK THE OG (BOT)</span>
```

The `Book` icon on line 139 stays — it's a good visual anchor. The label changes to exactly what was requested: `ASK THE OG (BOT)`.

---

### Summary Table

| # | File | What Changes |
|---|------|-------------|
| 1 | `Glossary.tsx` | H1 title → "The Resource", subtitle reworded, no term count |
| 2 | `Glossary.tsx` | Ask the OG eyebrow → empty (removed) |
| 3 | `Glossary.tsx` | Top 10 flat cards → accordion, no subtitle |
| 4 | `MobileMenu.tsx` | Menu label "Glossary" → "ASK THE OG (BOT)" |

No route changes. No new dependencies. No other files touched.
