# Landing Page Overhaul Plan

## Files to modify
- `src/pages/Index.tsx` — all section changes
- `src/index.css` — button/animation tweaks if needed

---

## 1. Hero Section

- Remove "Used by independent producers financing films from $1M–$10M" line entirely
- Change "No account required. Results in 60 seconds." → **"Results in two minutes."**
- ChevronDown: bump from `text-gold/60 w-5 h-5` → `text-gold w-6 h-6` so it's actually visible
- Keep CTA as-is ("BUILD YOUR WATERFALL — FREE") — it works

## 2. Thesis Section — Make It Pop

- Film row ("Gatekept.") needs to visually break the pattern — gold-tinted background, bolder text, more contrast vs the three "have tools" rows
- Asset class names: bump size for more presence
- "Until now." kicker: bigger font, more whitespace above/below so it lands like a punch
- Overall: make the grid feel like a revelation, not a spreadsheet

## 3. Blum Quote Box

- Opening quotation mark: `text-gold/20` → `text-gold/40` for OLED visibility
- Add a proper footer/bottom treatment — matte padded cite area or gold bottom line to close the box (right now it just ends)

## 4. Problem Section (01, 02, 03)

- Numbers: bump from `text-lg` → `text-2xl` or `text-3xl`, lighter opacity — background texture feel
- Fix punchline inconsistency: all three should use the same formatting system (all quoted italic, with the loud one getting extra weight but same structure) — right now it looks like a formatting error
- Keep gold left elbows, keep the copy (strongest section)

## 5. Waterfall — Color Gradient Story

Replace monochrome gold bars with a warm→red→green color arc:

| Tier | Color | Hex |
|---|---|---|
| Acquisition Price | Bright gold | `#D4AF37` at 0.70 opacity |
| CAM Fees | Warm amber | `rgba(230, 160, 50, 0.55)` |
| Sales Agent | Orange | `rgba(220, 120, 40, 0.50)` |
| Senior Debt | Red-orange | `rgba(200, 80, 40, 0.45)` |
| Mezzanine | Muted red | `rgba(180, 50, 50, 0.40)` |
| Equity Recoupment | Dark red/maroon | `rgba(140, 30, 40, 0.35)` |
| Net Profits | Green | `#00C853` |

- Change "This is the standard waterfall." → **"A simplified waterfall."**
- Dollar amounts stay most prominent (already bumped to 17px)

## 6. Closed Doors — Complete Rebuild

Current: single-column list with lock icons (too passive, unreadable)

New: **2×2 grid of matte-padded cards**, each with:
- Gold left elbow accent (3px bar)
- Door name big and bold at top
- Lock reason underneath in readable text
- Cost in corner
- Visible card background (`bg-white/[0.05]`) with `border-white/[0.08]`
- Proper padding (`p-5` or `p-6`)

Keep header: "THE DOORS ARE CLOSED."

## 7. Declaration

- Change: "We Built The Toolkit That Levels The Playing Field" → **"We Built The Toolkit They Didn't Teach You In Film School"**

## 8. Product Ladder / Toolkit — Rethink

- Remove proportional gold bars (confusing — suggests quantity not quality)
- Three distinct cards instead of stacked rows
- Each card gets a "View Package →" or "Get Started" link pointing to store
- Kill "Start free. Upgrade when you're ready." — redundant
- Recommended badge: bigger, more prominent
- Each card: tier label, product name, price, one-line description, CTA link

## 9. Final CTA / Moment of Truth

- Border: `border-gold/20` → `border-gold/40` (more pronounced frame)
- Corner accents: `bg-gold/50` → `bg-gold/70`
- Keep everything else — this is the best section

## 10. Footer

- Divider line: `via-gold/25` → `via-gold/40` to match header weight
- Email/Instagram/Share/Copy grid: `gap-3 py-3.5` → `gap-4 py-5` for more breathing room
- Keep Terms/Privacy links

## 11. Structural — Less Is More

- Remove some Divider diamonds between sections — not every section needs a pause. Specifically, remove the divider between Closed Doors and Declaration (they should crash into each other), and between Declaration and Product Ladder (they're one thought)
- This reduces visual breaks and tightens the flow

---

## Order of execution
1. Hero fixes (quick copy/style changes)
2. Waterfall colors (data change + copy fix)
3. Closed Doors rebuild (2×2 grid)
4. Declaration copy swap
5. Thesis section pop (Film row treatment, "Until now" sizing)
6. Blum quote box bottom treatment
7. Problem section number sizing + punchline consistency
8. Product Ladder rethink (cards + store links, remove bars)
9. Final CTA border/accent bump
10. Footer padding + divider strength
11. Remove excess dividers
12. Type check, commit, push
