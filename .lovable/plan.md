
## Rebuild the Glossary Page: Top 10 Essentials + A-Z Search + AI "Ask the OG" Strip

### What We're Building

A full rebuild of `/glossary` that adds three major upgrades while matching the landing page's visual language (SectionFrame gold border, Bebas Neue headers, spotlight dividers, scroll-reveal animations):

1. **Top 10 Must-Know Terms** — A curated, ranked list including Recoupment, Waterfall, Producer's Corridor, Capital Stack, Cross-Collateralization, etc., displayed as numbered cards with the gold left-accent SectionFrame style.
2. **A-Z Glossary with Search** — The existing 100+ term A-Z section, rebuilt with the landing page's visual treatment — gold letter dividers, SectionFrame containers, and a prominent gold-accented search bar.
3. **"Ask the OG" AI Strip** — A compact AI search bar at the bottom of the page using a new `film-search` backend function, limited strictly to film industry questions, with streaming responses that render inline in the same gold-card style used throughout the app.

---

### Visual Design — Matching the Landing Page

The landing page uses these specific visual patterns we'll carry over:

- `SectionFrame` — the gold left-bar + faint top line + dark bg container (already used on `/`)
- `SectionHeader` — eyebrow + large Bebas title with optional flanking gradient lines
- Scroll-reveal: `useReveal` hook (opacity + translateY transition on IntersectionObserver)
- Spotlight gradient dividers (`Divider` component from Index.tsx)
- Category color badges replaced with gold-intensity-only labels (no color semantics per design rules)
- Number labels in `font-mono tabular-nums` for the Top 10

---

### Top 10 Must-Know Terms

These 10 are hand-curated and will be hard-coded in display order with short expert descriptions:

| # | Term |
|---|------|
| 1 | Waterfall |
| 2 | Recoupment |
| 3 | Capital Stack |
| 4 | Negative Cost |
| 5 | Senior Debt |
| 6 | Equity |
| 7 | Cross-Collateralization |
| 8 | Sales Agent |
| 9 | Producer's Corridor |
| 10 | CAM (Collection Account Manager) |

Each card will display: gold number badge, term name in Bebas, one-line definition, and a category label.

---

### Files to Create / Modify

**New files:**
1. `supabase/functions/film-search/index.ts` — Streaming edge function calling Lovable AI with a strict film-industry-only system prompt.

**Modified files:**
2. `src/pages/Glossary.tsx` — Full rebuild with:
   - Landing page visual style (SectionFrame, scroll-reveal, spotlight dividers)
   - Top 10 section as numbered SectionFrame cards
   - Improved A-Z search with gold-accented input bar
   - "Ask the OG" AI strip at the bottom (streaming inline response)
3. `supabase/config.toml` — Register `film-search` with `verify_jwt = false`

---

### Technical Architecture

**Backend (Edge Function: `film-search`)**

```text
POST /functions/v1/film-search
Body: { question: string }

→ Calls Lovable AI Gateway (Gemini 3 Flash Preview)
→ System prompt: "Film industry expert only. Decline anything not about film."
→ Streams SSE response back to client
→ Handles 429/402 errors with clear messages
```

**Frontend (in Glossary.tsx)**

```text
User types in "Ask the OG" bar → hits Enter or clicks ASK button
→ fetch() to film-search function with SSE streaming
→ Response appears token-by-token in a gold WikiCard-style answer block
→ Typing indicator (3 pulsing gold dots) while streaming
→ Previous answers stay visible above the input (session-only, no DB)
```

**System Prompt (film-only guard):**
> You are an expert in the independent film industry — financing, production, distribution, waterfall accounting, deal structures, and film business vocabulary. You ONLY answer questions related to film and television. If asked about anything else, politely decline and redirect. Keep answers concise, practical, and expert-level. Use plain text only — no markdown headers, use short paragraphs.

---

### Page Layout (top to bottom)

```text
┌─────────────────────────────────────┐
│  HEADER (fixed)                     │
├─────────────────────────────────────┤
│  Page title block                   │
│  "Protocol Glossary"                │
│  "The Black Book" eyebrow           │
├─────────────────────────────────────┤
│  Spotlight Divider                  │
├─────────────────────────────────────┤
│  SectionFrame: "KNOW THESE FIRST"   │
│  Top 10 numbered cards              │
│  (01 Waterfall … 10 CAM)           │
├─────────────────────────────────────┤
│  Spotlight Divider                  │
├─────────────────────────────────────┤
│  SectionFrame: "A–Z GLOSSARY"       │
│  Gold search bar (full width)       │
│  Alphabet rail (sticky)             │
│  Terms grouped by letter            │
├─────────────────────────────────────┤
│  Spotlight Divider                  │
├─────────────────────────────────────┤
│  SectionFrame: "ASK THE OG"         │
│  Subtitle: "Film industry only."    │
│  Question input + ASK button        │
│  Streaming answer card              │
│  Example chips: "What is a CAM?"   │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

---

### Key Constraints Respected

- **No color semantics** — category labels will use gold-only styling instead of amber/emerald/sky/rose colors (violates the design system)
- **No border radius** — all cards and buttons will use `rounded-none` (sharp edges only per brand rules)
- **No green/red** — AI answer cards styled in the same gold-border dark pattern as the rest of the app
- **Streaming** — responses appear token-by-token, not in a single bulk render
- **Session-only** — no database writes; AI history lives in component state only
- **Character limit** — input capped at 500 characters with a visible counter
- **Error handling** — 429 (rate limit) and 402 (credits) errors surface as inline messages, not toasts
