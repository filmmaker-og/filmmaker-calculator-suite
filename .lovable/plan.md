
## Glossary Page: UX & Layout Fixes

### Summary of All Changes

Seven targeted issues to fix in `src/pages/Glossary.tsx` only — no other files need to change.

---

### 1. Rename the Page Header

Current text that needs to go:
- Eyebrow: "The Black Book" → rename to something direct and useful
- Title: "Protocol Glossary" → rename to something clear

New names:
- Eyebrow: **"Film Finance"** (direct, no jargon)
- Title: **"THE GLOSSARY"** (simple, obvious)
- Subtitle stays as-is (it's good)

---

### 2. Reduce Dead Space at the Top

The page header block has `pt-8 pb-6` plus a `Divider` below it, creating a large empty band before any content. Fix:
- Reduce top padding: `pt-8 pb-6` → `pt-4 pb-3`
- Remove the Divider between the header and the first section (it's redundant when content follows immediately)

---

### 3. Reorder Sections: Ask the OG Moves to the Top

Current order: Title → Top 10 → A-Z → Ask the OG

New order: Title → **Ask the OG** → Top 10 → A-Z

This is a JSX block reorder — the three `<div ref={rev___}>` sections swap positions. The scroll reveal hooks and refs stay unchanged.

---

### 4. Simplify "Ask the OG" Section

Current state: Long explanatory subtitle ("Ask anything about film financing, distribution, deal structures, or waterfall accounting. This AI knows the industry — not anything else.") + 5 example chips

New state:
- Subtitle → one short sentence: **"Film industry questions only."**
- Example chips → reduced from 5 to exactly 3:
  1. "What is a waterfall?"
  2. "How does gap financing work?"
  3. "What is a CAM?"
- Remove the "Ask again" chip block that appears after the first message (the input itself is obvious enough)
- The `SectionHeader` eyebrow changes from "Film Industry Only" → **"AI Search"**

---

### 5. Increase Top 10 Readability

Current definition text: `text-[13px] text-white/50` — small and too dim

Changes:
- Definition text: `text-[13px] text-white/50` → **`text-[15px] text-white/65`**
- Term heading: `text-xl` → **`text-2xl`** (Bebas Neue, so going up one step is fine)
- Number badge: stays the same (already reads well)
- Card padding: `p-4` → **`p-5`** for breathing room

---

### 6. Remove Dead Space Between Sections

The `Divider` components add `py-6` above and below each section. Between Top 10 and the Ask the OG section, you currently have: SectionFrame padding + Divider + SectionFrame padding — that's ~64px of empty space.

Fix: Replace the `<Divider />` separators between sections with a thinner spacer (`py-2`) so sections feel connected rather than isolated.

---

### 7. Increase AI Answer Text Size

The response body is currently `text-[13px] text-white/70` — it's hard to read at that size, especially on mobile.

Fix:
- Answer body text: `text-[13px] text-white/70` → **`text-[15px] text-white/80`**
- Input `textarea` placeholder text: `text-sm` → **`text-base`**
- "Thinking…" placeholder: keep as-is

---

### Technical Notes

- All changes are contained in **`src/pages/Glossary.tsx`** only
- No edge functions, no config, no routing changes needed
- The EXAMPLE_CHIPS array at line 276 will be trimmed from 5 items to 3
- Section order swap is a JSX structural change — the three scroll-reveal `<div>` wrappers move, but their internal markup is unchanged
- No new dependencies or hooks required
