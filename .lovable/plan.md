
## Glossary Page — Full UX Fix Pass

Here is a complete breakdown of every issue identified, plus a mobile audit of additional problems not yet addressed.

---

### Issues to Fix (User-Reported)

**1. AI Output Hard to Read**
The current answer text is `text-[15px] text-white/80 leading-relaxed`. The problem is `leading-relaxed` (1.625) is not enough for a dense AI paragraph, and `text-white/80` is still slightly dim on a pure black `bg-black` background.
- Fix: `text-white/80` → `text-white/90`, `leading-relaxed` → `leading-[1.8]`, bump to `text-[16px]`
- The question bubble on the right also uses `text-sm text-white/80` — increase to `text-[15px] text-white/85`

**2. Dead Space at Bottom**
Line 844 has `pt-10 mt-4` on the footer — that's `40px + 16px = 56px` of space before a border, then the content. Plus the main wrapper has `pb-16` (64px bottom padding). Combined with the `SectionFrame`'s own `py-4` padding, the bottom of the page has ~120px of emptiness after the A-Z list ends.
- Fix: Remove `mt-4` from footer div, reduce `pt-10` → `pt-6`, reduce main wrapper `pb-16` → `pb-4`

**3. Dead Space at Top**
The header block at line 490 uses `pt-4 pb-3`. That's fine, but the `SectionFrame` component itself wraps everything in `snap-section px-4 py-4`, meaning the "Ask the OG" section starts with an additional `py-4` (16px) gap. The page title block padding is fine but the `mb-3` on the eyebrow and the `mt-3` on the subtitle stack up.
- Fix: Reduce page title `pb-3` → `pb-1` so the Ask the OG section follows immediately

**4. Subtitle Text Change**
Line 524: `subtitle="Film industry questions only."` → `"Ask me film industry questions (only.)"`

**5. Top 10 Should Hide in "OG Mode"**
When the user has sent at least one message to Ask the OG (`ogMessages.length > 0`), the Top 10 section (`#top10`) should be hidden. This is a single conditional render: wrap the entire Top 10 `<div ref={revTop10.ref}>` block in `{ogMessages.length === 0 && (...)}`

---

### Mobile UX Audit — Additional Issues Found

**6. A-Z Definition Text Too Dim** (line 820)
`text-[13px] text-white/40` — on mobile in daylight, `white/40` is nearly invisible. This is the dimmer of all text on the page.
- Fix: `text-[13px] text-white/40` → `text-[14px] text-white/55`

**7. Alphabet Rail Tap Targets Too Small** (line 750)
Each letter button is `w-8 h-8` (32×32px). Apple HIG recommends 44px minimum touch targets. On a 390px wide iPhone, fitting 26 letters with `gap-0.5` means some letters are getting squeezed below 30px wide.
- Fix: Change `w-8 h-8 text-xs` → `w-7 h-8 text-[11px]` (keeps them fitting while increasing height). Better: replace fixed `w-8` with `flex-1 max-w-[36px]` so they scale properly.

**8. Search Input Text Too Small** (line 730)
The A-Z search bar uses `text-sm` (14px) which is the iOS minimum before it auto-zooms the viewport on focus. This causes the page to zoom unexpectedly on iPhone.
- Fix: `text-sm` → `text-base` (16px) — this prevents iOS auto-zoom on input focus, a critical mobile bug.

**9. Textarea Input Same Issue** (line 614)
The Ask the OG `<textarea>` already uses `text-base` — good. But its `rows={2}` means on mobile the input area is ~60px tall, which is fine. However on small phones the send button `px-5` may not have enough hit area.
- Fix: Add `min-h-[52px]` to the textarea for consistency.

**10. Example Chips Hard to Tap** (line 537)
The example chips use `px-3 py-1.5` — that's about 30px tall. On mobile, small tap targets cause mis-taps.
- Fix: `px-3 py-1.5` → `px-4 py-2.5` and increase text to `text-[12px]`

**11. Scroll-Reveal Threshold Too High for Mobile**
`useReveal(0.1)` fires when 10% of the element is visible. On mobile with a small viewport, the Top 10 section (which is very tall) may never fire if the intersection ratio stays below 10% with partial views. This can cause sections to never animate in.
- Fix: The `Ask the OG` section uses `revAsk = useReveal()` — change all three to `useReveal(0.05)` so they trigger earlier on small screens.

**12. SectionFrame inner padding too wide on mobile** 
The `SectionFrame` uses `px-7 py-5 md:px-10 md:py-7`. On mobile, `px-7` (28px) on top of the outer `px-4` container = 32px total side padding. With a 390px screen width, the content area is only `390 - 64 = 326px`. Fine, but the alphabet rail uses `-mx-7 px-7` to break out of this — which is correct.

No fix needed here — this is working as intended.

---

### Files to Change

Only **`src/pages/Glossary.tsx`** — no other files.

### Summary of All Changes

| # | Location | Current | Fix |
|---|----------|---------|-----|
| 1 | AI answer text | `text-[15px] text-white/80 leading-relaxed` | `text-[16px] text-white/90 leading-[1.8]` |
| 2 | Footer dead space | `pt-10 mt-4` + wrapper `pb-16` | `pt-6` + wrapper `pb-4` |
| 3 | Top dead space | title block `pb-3` | `pb-1` |
| 4 | AI subtitle | "Film industry questions only." | "Ask me film industry questions (only.)" |
| 5 | Top 10 visibility | Always shown | Hidden when `ogMessages.length > 0` |
| 6 | A-Z definition text | `text-[13px] text-white/40` | `text-[14px] text-white/55` |
| 7 | Alphabet letter buttons | `w-8 h-8 text-xs` | `flex-1 max-w-[36px] h-9 text-[11px]` |
| 8 | A-Z search input | `text-sm` | `text-base` (prevents iOS zoom) |
| 9 | Textarea min height | `rows={2}` | Add `min-h-[52px]` |
| 10 | Example chips | `px-3 py-1.5 text-[11px]` | `px-4 py-2.5 text-[12px]` |
| 11 | Scroll reveal threshold | `useReveal(0.1)` (default) | `useReveal(0.05)` for all three |
