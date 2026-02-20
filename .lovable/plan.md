
# Three Focused Fixes: Auth Typography, Bottom Bar Gold System, Bot Sheet Premium Feel

## What's Broken + Why

**1. Auth Page — Wrong Font Stack**
The Auth page inputs use the shadcn `<Input>` component with no explicit font override. That component inherits from the global default `DM Sans`, which is correct — but two problems exist:
- The `label` elements use `font-semibold` — not `font-bebas`. Every other page in the app uses `font-bebas tracking-[0.2em]` for field labels exactly as the design system dictates. Auth labels should match.
- The "Continue without saving →" skip link uses `text-base font-semibold` — a generic weight/size combo that doesn't match the app's action text convention (all action text is `font-bebas` or `font-mono`, never `font-semibold` plain DM Sans).
- The "Your work won't be saved" micro-copy uses `text-xs` no font specification — it should be `font-mono` to match the app's convention for small utility text.
- The `<p>` subtitle below the heading ("We'll email you a link…") has no font class — it defaults to DM Sans at `text-sm`. That's fine but the tracking should be `tracking-[0.06em]` to match the landing page body copy convention.

**Specific fixes:**
- Labels: Already `font-semibold text-xs uppercase tracking-[0.2em]` — add `font-bebas` and remove `font-semibold` (Bebas Neue has no semibold weight, it's all-caps by default)
- Skip button: Change from `text-base font-semibold` → `font-bebas text-[15px] tracking-[0.12em]`
- Skip sub-copy: Add `font-mono` to the "Your work won't be saved" text
- The "sent" confirmation step has `text-sm font-normal` on its action buttons — same fix, use `font-bebas` for "Use different email" and "Continue without saving →"

---

**2. Bottom Tab Bar — All-Gold System with Matte Active State**

The user's instinct is exactly right: **all tabs should be gold**, one gets highlighted when active with a matte/dark contrast background.

**Current state:** Inactive = `text-white/55`. Active = `text-gold` with subtle `bg-gold/[0.06]`. The problem is the contrast split isn't reading as premium — it feels like "some white, some gold" with no clear hierarchy.

**New system — Inverted active state:**

All tabs (active AND inactive) use gold. The active tab is distinguished not by color change but by **value/weight** — the inactive tabs are dim gold, the active tab is full-brightness gold with a matte dark inset background.

```
INACTIVE: text-gold/45  (dim gold — readable but clearly subordinate)
ACTIVE:   text-gold     (full gold) + bg-[#1A1300] (warm matte dark) + top 2px gold bar
```

The `#1A1300` is a warm very-dark-brown — it's the matte contrast inversion. On the `#0A0A0A` tab bar background, a `#1A1300` active cell creates a visually distinct "pressed in" or "lit from within" effect — premium, not garish.

**F icon treatment:**
- Inactive: `opacity-40` with a `sepia(0.3) saturate(0.8)` filter — makes it look gold-tinted but dim
- Active: `opacity-1`, full `drop-shadow(0 0 6px rgba(212,175,55,0.9))` glow

**Label treatment:**
- Inactive: `font-bebas text-[9px] tracking-[0.10em] text-gold/45`
- Active: `font-bebas text-[10px] tracking-[0.18em] text-gold`

**Tab bar border and glow — enhanced:**
- Border top: `2px solid rgba(212,175,55,0.35)` (up from 1px 0.28)
- Box shadow: `0 -12px 40px rgba(0,0,0,0.95), 0 -2px 0 rgba(212,175,55,0.15), inset 0 1px 0 rgba(212,175,55,0.08)`
- The `inset 0 1px 0` creates a faint inner gold rim at the top of the nav — a luxury watch bezel detail

**File:** `src/components/BottomTabBar.tsx`

---

**3. Bot Sheet — Premium Black with Landing Page Section DNA**

The bot sheet needs to feel like one of the landing page's `SectionFrame` containers but in a vertical sheet form. The landing page containers are the design reference: `bg-black`, `border border-white/[0.06]`, gold left accent bar 3px, cinematic paragraph reveals.

**What the landing page sections do (the DNA to port into the bot):**

1. **Background:** Pure `#000000` — not brownish `#111008`. The landing page containers live on pure black. The bot should too.
2. **Border language:** `border border-white/[0.06]` for internal structure — the same near-invisible white border that gives the landing page its "contained" feel without glowing.
3. **Gold left accent:** The 3px gradient left bar from the `SectionFrame` component — `linear-gradient(to bottom, rgba(212,175,55,0.55), rgba(212,175,55,0.25), transparent)`. This is the single most recognizable brand element in the app. The bot should have it running down its left edge.
4. **Header band:** The landing page section headers use `eyebrow + flanking lines` for authority. The bot header should use the same language: flanking gold rule lines with `ASK THE OG` centered — not a pill, not a badge, but the actual eyebrow pattern.
5. **Question bubbles:** The landing page uses `border border-white/[0.10] bg-white/[0.04]` for content containers (§2, §4 manifesto cards). The question bubbles should use this same low-opacity white container pattern with a gold left accent — not a gold-filled bubble. This is the insight: the user's question should look like a landing page "content card", not a gold-tinted chat bubble.
6. **Answer card:** Keep the gold header bar (`bg-gold`, black text, Bebas Neue) — this already matches the SectionFrame gold top accent. But the body should be `bg-black border border-gold/20` not `bg-#131000`.

**Specific changes to OgBotSheet.tsx:**

**Sheet container:**
- Background: `#000000` (pure black, matching landing page)
- Border top: `border-t-0` — instead, add a gold left accent bar running the full height of the sheet left edge (3px, same as SectionFrame)
- Box shadow: `0 -20px 60px rgba(212,175,55,0.20), 0 -4px 0 rgba(212,175,55,0.35)` — the top edge becomes a strong gold line, the ambient glow is wider

**Sheet header band (eyebrow pattern):**
Replace the pill `bg-gold` button look with the landing page eyebrow pattern:
```
── gold line ── [ F icon ] ASK THE OG ── gold line ──
```
- Flanking lines: `h-[1px] flex-1 bg-gradient-to-r from-transparent to-gold/40`
- Center: F icon (18px) + `FILM INDUSTRY Q&A` in `text-[10px] font-mono tracking-[0.25em] text-gold/60`
- Below that, the `ASK THE OG` label in `font-bebas text-[22px] tracking-[0.15em] text-gold` — the BIG title, like the section header titles

This is the critical change — the bot opens and you read `ASK THE OG` in the same oversized Bebas Neue that all the section titles use. It immediately feels like part of the app's design language.

**Question bubbles — port the manifesto card pattern:**
```
Current:  gold border + gold background fill (feels like a chat bubble)
New:      white/[0.06] bg + white/[0.10] border + gold 3px left accent
          (feels like a landing page content card)
```
- Container: `bg-white/[0.04] border border-white/[0.10]`
- Left accent: `absolute left-0 top-0 bottom-0 w-[3px]` with gold gradient (same as landing page)
- Text: Full white, `text-base leading-relaxed`

**Answer card — SectionFrame match:**
- Container background: `bg-black border border-gold/25` (matches `SectionFrame`'s gold border language)
- Header band: Keep `bg-gold` with F icon + `THE OG` — this is the active state, same as a filled gold element on the landing page
- Body text: Full white, `text-base leading-[1.8]`
- Add a subtle `boxShadow: "0 0 30px rgba(212,175,55,0.10)"` — same as the landing page featured card glow

**Example chips — match landing page pill language:**
The landing page's `SectionHeader` uses `bg-gold/[0.06] border border-gold/20` for subtitle pills. The chips should match exactly:
- `border border-gold/30 bg-gold/[0.08] text-gold/75` → on hover: `border-gold/60 bg-gold/[0.14] text-gold`
- Font: `font-mono text-[12px] uppercase tracking-[0.18em]`

**Input area — SectionFrame bottom edge:**
- The input sits at the bottom like the footer of a section. Give it the gold left accent treatment: `border-l-[3px] border-gold` on the textarea container (this is already there but needs the side visuals to match)
- Background of the input container: `bg-black` (was brownish)

**Empty state text (between chips and input):**
Add a transition phrase above the chips, exactly like the landing page does it — a small centered eyebrow:
```
[ flanking line ] WHAT DO YOU WANT TO KNOW [ flanking line ]
```
`text-[11px] font-mono tracking-[0.2em] text-white/25` — the same dim utility text convention from the landing page's section eyebrows.

---

## File Summary

| File | Changes |
|---|---|
| `src/pages/Auth.tsx` | Fix label typography (add `font-bebas`, remove `font-semibold`); fix skip button to `font-bebas`; fix micro-copy to `font-mono` |
| `src/components/BottomTabBar.tsx` | All tabs → dim gold inactive (`text-gold/45`), active gets warm matte bg `#1A1300` + full gold + top bar; enhanced border/shadow on nav |
| `src/components/OgBotSheet.tsx` | Full premium rethink: pure black bg, gold left accent bar, eyebrow-style header with flanking lines and large Bebas title, landing page manifesto card pattern for question bubbles, SectionFrame DNA for answer card, empty state flanking line eyebrow |

No other files change.

---

## Visual Result

**Auth page:** Every text element now uses the correct app font — Bebas Neue for labels and actions, Roboto Mono for utility text, DM Sans only for body copy.

**Bottom bar:** Opens any page and the nav is an all-gold bar — five dim gold icons at rest, one fully lit gold tab on a warm matte black inset. The effect reads like luxury product navigation — consistent, intentional, premium.

**Bot sheet:** Swipes up from the bottom and the first thing you read is `ASK THE OG` in large Bebas Neue gold letters, flanked by the same rule lines you see on every landing page section. The question you type appears as a content card with a gold left accent — it looks like it belongs in the app. The answer appears in a SectionFrame-style black container with a gold header band. Every element is the same design language as the rest of the product.
