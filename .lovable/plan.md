
# Cleanup + Navigation Architecture Rethink

## What's Being Fixed + Decided

There are 6 distinct things to address, some quick cleanup and one architectural decision.

---

## 1 — Landing Page: Remove "Copy Link" from Footer

**Current:** The footer grid has 4 items: Email / Instagram / Share / Copy Link. Share and Copy Link do the same thing — Share is superior (uses native share sheet on mobile).

**Fix:** Remove the "Copy Link" button entirely. The 2x2 grid becomes a 3-item row. Clean it up to: Email · Instagram · Share — three equal cells in a `grid-cols-3`.

Also remove the `linkCopied` state, `handleCopyLink` function, `Link2` icon import, and the `handleShare` fallback that was calling `handleCopyLink`.

**File:** `src/pages/Index.tsx`

---

## 2 — Landing Page: Remove the paragraph above the Final CTA

**Current (lines 1030–1031):**
```
That meeting shouldn't be the first time you think about your recoupment structure.
```

This line exists directly above the "BUILD YOUR WATERFALL" CTA button in the "Moment of Truth" section. The heading `YOUR INVESTOR WILL ASK HOW THE MONEY FLOWS BACK` is already complete as a standalone statement — the paragraph weakens it. Remove it. The CTA button follows the heading directly.

**File:** `src/pages/Index.tsx` — remove the `<p>` tag at line 1030–1032.

---

## 3 — Menu: Add X button (upper right) + Visual Premium Upgrade

The slide-up menu currently has: drag handle → nav grid → contact/share → brand footer. It needs:

**X Close Button:** A positioned close button in the upper-right corner of the sheet, overlaid on the drag handle row. This is the native iOS pattern — every bottom sheet has an X in the top-right.

```
[ ──── ]           ← drag handle centered
                [X]  ← absolute positioned top-right
```

The X button: `absolute top-3 right-4`, `w-8 h-8 flex items-center justify-center`, gold `X` icon at `w-4 h-4` opacity 50%, hover to full opacity.

**Premium Visual Upgrade:** The current menu feels flat. Three changes to make it pop:

- **Gold ambient glow on the sheet itself:** Add `boxShadow: "0 -4px 60px rgba(212,175,55,0.12), 0 -2px 20px rgba(0,0,0,0.80)"` to the bottom sheet container. This is the cinematic upward light leak.
- **Gold top edge line:** Replace the plain `border-t border-border-default` with a full-width gold gradient line at the very top of the sheet — same pattern as the header separator.
- **Featured nav items get more visual weight:** The "Packages" button (currently already gold-bordered) gets upgraded to use a proper gold fill: `bg-gold/[0.10]` → `bg-gold/[0.15]` and the border upgraded to `border-gold/50`. Add a small `ShoppingBag` icon in gold.
- **Section labels ("Menu", "Contact & Share") upgrade:** From dim text to a proper gold rule with flanking lines — `flex items-center gap-3` with `h-[1px] bg-gold/20` on each side. Matches the cinematic design language.

**File:** `src/components/MobileMenu.tsx`

---

## 4 — FAB: Replace Sparkles with F Icon + Label

Replace the `<Sparkles>` icon in the FAB with `/brand-icon-f.jpg` at `w-7 h-7 object-contain`, and add "ASK" as a label below in `font-bebas text-[9px] tracking-[0.18em] text-black`.

The FAB container becomes `w-14 h-auto py-2.5 flex-col gap-0.5`.

**File:** `src/components/OgBotSheet.tsx`

---

## 5 — Naming: "The Resource" → "Glossary" in the Menu

In `MobileMenu.tsx`, the nav button currently reads "The Resource". Change the label back to **"Glossary"** — it's universally understood, it scans faster, and the page title itself already says "The Resource" as the H1 so the menu entry doesn't need to repeat it.

**File:** `src/components/MobileMenu.tsx` — one word change.

---

## 6 — The Big Question: Persistent Bottom Tab Bar (Header → Footer)

**The user's instinct is architecturally correct.** Here is the honest assessment:

Every major native app — Instagram, TikTok, Apple Podcasts, Spotify — uses a persistent bottom tab bar. No hamburger menu. The tabs are always visible, always accessible, never hidden behind a gesture. This is the single biggest signal that something is an app vs. a website.

**What the new architecture looks like:**

```
┌─────────────────────────┐
│  [F]   FILMMAKER.OG     │  ← slim header, just brand mark. No hamburger.
│─────────────────────────│
│                         │
│   page content          │
│                         │
│─────────────────────────│
│  [Home] [Calc] [Store] [OG] │  ← persistent bottom tab bar
└─────────────────────────┘
```

The OG Bot becomes a tab, not a FAB. Tapping it opens the bot sheet from the tab bar, not from a floating button. This is how every native AI app works (Perplexity, ChatGPT on mobile).

**What gets removed:**
- The hamburger button entirely
- The FAB
- The slide-up hamburger menu sheet

**What gets added:**
- A new `src/components/BottomTabBar.tsx` — fixed bottom bar, `h-[60px]`, 4 tabs
- Tab icons: `Home` · `Calculator` · `ShoppingBag` · `F icon` (for bot)
- Active tab highlighted in gold, inactive in `white/30`
- The OG Bot sheet opens from the tab tap, same sheet as before, but no FAB

**The header** becomes purely the brand mark — `FILMMAKER.OG` text only, no hamburger. A secondary "more" or settings access (for contact/share/instagram) could live in the bot tab or a minimal menu off the header logo long-press.

**Tradeoffs to surface:**
- Removes the hamburger slide-up menu entirely — contact/share/instagram need a new home (footer on landing page already has them; other pages could lose them or they move into the bot tab area)
- The calculator page already has a TabBar for Budget/Stack/Waterfall — a bottom tab bar needs to coexist without collision. The calculator's internal tab bar would sit above the global nav bar, requiring a `padding-bottom` adjustment on the calculator layout.
- The Glossary/Waterfall-Info pages would need a `pb-[60px]` adjustment for the bar.

**Recommendation:** Implement the bottom tab bar, but keep a minimal "more" `···` button in the header for the contact/share/instagram links. The hamburger goes away. The FAB goes away. Navigation becomes permanently visible and instantly accessible.

---

## Files Changed

| File | What Changes |
|---|---|
| `src/pages/Index.tsx` | Remove Copy Link button + footer grid cleanup; remove paragraph above final CTA |
| `src/components/MobileMenu.tsx` | Add X close button; premium visual upgrades; rename "The Resource" → "Glossary" |
| `src/components/OgBotSheet.tsx` | Replace Sparkles FAB with F icon + "ASK" label |
| `src/components/BottomTabBar.tsx` | New file — persistent 4-tab bottom nav |
| `src/components/Header.tsx` | Remove hamburger reference, simplify to brand mark only |
| `src/App.tsx` | Mount `BottomTabBar` at root; remove `OgBotSheet` FAB if bot moves to tab |
| Various pages | Add `pb-[60px]` to account for bottom tab bar |

---

## Implementation Order

1. Quick cleanup first (Copy Link removal, paragraph removal) — zero risk
2. Menu X button + premium visual upgrades — self-contained
3. FAB icon upgrade — single component, zero risk
4. Rename "The Resource" → "Glossary" in menu — one word
5. Bottom tab bar — new component, then wire up to App.tsx, then adjust all pages

The bottom tab bar change is the biggest one and should be approved as a separate step if the user wants to see the smaller fixes first.
