
# Bottom Tab Bar + Bot Sheet: Precise Diagnosis & Fix

## What's Actually Wrong — Root Causes

### Problem 1: Bottom Tab Bar — Readability + Premium Feel

The screenshot reveals three compounding failures:

**A — Inactive tabs are invisible at scale.** `gold/45` at 9px Bebas Neue on `#0A0A0A` black simply cannot be read. Gold at low opacity on near-black collapses to a brown-grey smear. The minimum readable gold opacity on black is ~70% — anything under 60% fails.

**B — Active state (`#1A1300`) looks muddy, not premium.** A warm dark-brown cell on a black bar reads as a dirt stain, not a selected state. The "lit from within" effect requires either:
- A bright element (the gold top bar is correct) contrasted against a truly dark neutral cell, OR
- The active tab simply being full-gold while inactive are noticeably dimmer — but still gold

**C — Icons are too small at 18px and labels at 9px are below minimum legibility.** Premium native apps use 22-24px icons and 11px labels minimum.

**The fix — Simplified, high-contrast system:**
- Drop the `#1A1300` muddy active background entirely
- Active: full gold top bar (3px, not 2px) + full `rgba(212,175,55,1)` icon/label color
- Inactive: `rgba(212,175,55,0.65)` — meaningfully visible but clearly subordinate. This is the key number: 65% gold on black is readable AND still clearly "less than" 100% gold
- Icons bump to 20px, labels bump to 11px `font-mono` (not Bebas — Bebas at 9-11px is unreadable; Roboto Mono at 11px is sharp and legible)
- Tab bar border-top stays gold but at `rgba(212,175,55,0.40)` — crisp separation
- Remove the `inset` box-shadow trick — it's invisible and adds nothing
- Active top bar: `3px solid rgba(212,175,55,1)` — a clear, assertive indicator

The resulting system: **five gold tabs, one fully lit, four at 65% — unmistakably clear, never muddy**.

### Problem 2: Bot Sheet — "Too Thick Wrapper" + Font Inconsistencies

**The thick wrapper:** The current `boxShadow: "0 -4px 0 rgba(212,175,55,0.55)"` creates a literal 4px solid gold border at the top of the sheet. Combined with the `3px` left accent bar, the sheet looks like it's wrapped in a gold frame. This is the "too thick wrapper" complaint.

Fix: Replace the `0 -4px 0` hard offset shadow with a pure ambient glow. The sheet top edge should be defined by a single `1px` gold gradient line (like the landing page's `SectionFrame` top edge), not a chunky shadow-border. The left accent bar stays — it's the SectionFrame DNA and it's working.

```
REMOVE: boxShadow: "0 -4px 0 rgba(212,175,55,0.55), 0 -20px 70px rgba(212,175,55,0.22)..."
ADD:    A 1px gold gradient div at the absolute top of the sheet (like the landing page header separator)
        + boxShadow: "0 -20px 60px rgba(212,175,55,0.18), 0 -40px 80px rgba(0,0,0,0.95)"
```

**Font inconsistencies — three different font voices fighting each other:**

| Element | Current | Problem |
|---|---|---|
| "FILM INDUSTRY Q&A" | `font-mono tracking-[0.28em]` | Mono is correct for eyebrows |
| "ASK THE OG" | `font-bebas text-[28px]` | Bebas is correct for titles |
| "WHAT DO YOU WANT TO KNOW" | `font-mono uppercase` — no `font-mono` class, just inline text | Falls through to DM Sans |
| Chip text | `font-mono text-[12px] uppercase tracking-[0.18em]` | Correct |
| "THE OG" label in answer header | `font-bebas text-xs` | Correct |
| Answer body text | `text-base` — inherits DM Sans | Correct |

The fix is simple: **two voices only — Bebas Neue for titles, Roboto Mono for everything else that's UI chrome (eyebrows, labels, chips).** DM Sans only for answer body copy (prose content).

Specifically:
- The "WHAT DO YOU WANT TO KNOW" eyebrow separator: add explicit `font-mono` class (it currently inherits DM Sans because it uses `<span>` with only inline style color)
- The drag handle: change from gold-tinted `rgba(212,175,55,0.35)` to `rgba(255,255,255,0.15)` — neutral, standard iOS drag handle
- The "Reset" button uses `font-mono` ✓ already correct
- The char counter uses `font-mono` ✓ already correct

**Bot sheet height + overflow fix:** The sheet is set to `72vh`. On short devices the messages area gets squeezed. Change to `min(72vh, 580px)` and ensure `max-height` is respected. This is a secondary fix but contributes to the "thick wrapper" feeling when the sheet top edge is too close to the page content.

## Files Changed

| File | What Changes |
|---|---|
| `src/components/BottomTabBar.tsx` | Drop `#1A1300` muddy active bg; raise inactive to `gold/65`; bump icons to 20px; switch labels to `font-mono 11px`; thicken active indicator to 3px; simplify box-shadow |
| `src/components/OgBotSheet.tsx` | Replace thick `0 -4px 0` gold shadow-border with a `1px` gradient top-edge div; fix "WHAT DO YOU WANT TO KNOW" eyebrow to use `font-mono`; change drag handle from gold to neutral white; tighten the overall gold glow to be ambient not structural |

Only 2 files. Precise surgical changes.

## Visual Result

**Tab bar after fix:** Five crisp gold tabs on a clean black bar. The active tab is unmistakably full gold with a `3px` bright gold line at its top edge. The inactive four are clearly visible at 65% gold — you can read every label. No muddy brown active state. No invisible 9px labels. It reads like a luxury product nav.

**Bot sheet after fix:** Opens with a clean, thin gold line at the top (1px gradient, not 4px shadow-border). The left accent bar gives the SectionFrame identity. "ASK THE OG" in large Bebas Neue reads immediately. The eyebrow text, chips, and labels all use Roboto Mono consistently. The drag handle is a clean neutral white pill — the standard iOS affordance. The sheet feels like a clean black panel with gold editorial accents — not a gold-framed box.
