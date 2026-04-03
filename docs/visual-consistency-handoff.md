# FILMMAKER.OG — Visual Consistency Handoff
**For use with Claude Code**

---

## Context

A full visual brand audit was performed across all pages of filmmakerog.com. The site has a strong foundation — dark cinematic theme, good typography, consistent rounded corners. But there are specific inconsistencies that make it feel less premium than it should.

**This handoff covers ONLY visual/styling changes. No backend, no Supabase, no Stripe.**

---

## Brand Standards (Source of Truth)

These are already defined in `/src/lib/tokens.ts` — use these values:

| Token | Hex | Use |
|---|---|---|
| `GOLD` | `#D4AF37` | Metallic gold — borders, icons, dividers, brand elements (NOT clickable) |
| `CTA` | `#F9E076` | CTA gold — EXCLUSIVELY for buttons and links |
| `GREEN` | `#4DAF78` | Positive, profit, success |
| `RED` | `#C84040` | Negative, danger, risk |
| `AMBER` | `#F0A830` | Partial, warning |

**Fonts:** Bebas Neue (headlines, always uppercase) · Inter (body, 16px, line-height 1.6) · Roboto Mono (labels, data, numbers)

**Text opacity floor:** 0.65 minimum for readable text.

**NO PURPLE anywhere.**

---

## AUDIT FINDINGS — ALL PAGES

Pages audited: `/` (landing), `/pricing`, `/signup`, `/login`, `/resources`

---

### 🔴 CRITICAL — Fix These First

#### 1. GOLD SHADE IS ALL OVER THE PLACE

**Problem:** Different pages are using different gold shades. The tokens file defines the correct values (`GOLD = #D4AF37` for brand elements, `CTA = #F9E076` for buttons) but the pages are not consistently using them.

- Landing page uses a flat butter/sand gold (#F3E086 approximately)
- Pricing page "90 DAYS LEFT" text uses amber/orange gold (#FFB800)
- Resources page "VAULT" text uses a saturated orange-gold
- Auth pages use a paler version than the logo

**Fix:** Audit every page and ensure:
- All brand elements (logo, "VAULT" text, pin icons, brand icons) use `GOLD = #D4AF37`
- All CTA buttons use `CTA = #F9E076`
- Urgency/amber elements (like "90 DAYS LEFT") use `AMBER = #F0A830` — and only use it for urgency, not brand elements
- Search the codebase for any raw hex values like `#F3E086`, `#F9E076`, `#FFB800`, `#F0A825` and replace with the appropriate token

#### 2. LINKTREE OVERLAY ON LANDING PAGE + /RESOURCES

**Problem:** Both the landing page and /resources page have a center overlay/modal with sections for "Navigate," "Follow," and "Connect" — styled like a social media link-in-bio page. On /resources it actively HIDES the actual content (the Resource Vault is behind it).

This fights with the Bloomberg-for-film-finance positioning. The site should feel like a professional finance tool, not an influencer bio page.

**Fix:**
- Remove the Linktree-style overlay from the landing page entirely
- On /resources, remove the overlay or make it dismissible so the Resource Vault content is visible
- Move social links (Instagram, TikTok, Facebook) to the footer only — they should not be in a prominent center overlay
- If the nav menu still needs a hamburger/drawer, keep it minimal and professional without the "Follow/Connect" sections

#### 3. FLAT YELLOW CTAs LACK PREMIUM FEEL

**Problem:** CTA buttons use solid flat `CTA = #F9E076` with no gradient or metallic sheen. For a cinematic premium brand this reads as "construction warning sign yellow" rather than "Oscars gold."

**Fix:** Add a subtle linear gradient to the CTA buttons to give them a metallic feel. The gradient should be very subtle — just enough to suggest metallic depth without being obvious:

```css
/* Apply to all primary CTA buttons */
background: linear-gradient(
  180deg,
  rgba(255,255,255,0.15) 0%,
  rgba(255,255,255,0.05) 40%,
  rgba(0,0,0,0.1) 100%
),
#F9E076;
```

This gives a slight "light from above" metallic effect while keeping the gold color intact.

---

### 🟠 HIGH — Fix Before Launch

#### 4. EMPTY BLACK CONTAINERS ON LANDING PAGE

**Problem:** Large dark boxes at the bottom of the landing page are empty. They look like broken content or failed loading states.

**Fix:** Either fill with real content or remove the containers entirely. If there's supposed to be content there, add it. If not, delete the containers.

#### 5. EMPTY BLACK SPACE ON /RESOURCES

**Problem:** The bottom half of the /resources page is dead void — just black empty space.

**Fix:** If the Resource Vault has fewer items than expected, the page should scroll naturally without forced empty containers. Or add meaningful content to fill the space (recent additions, featured resources, etc.)

#### 6. SOCIAL ICONS LOOK CHEAP

**Problem:** Standard line-weight icons for Instagram, TikTok, Facebook in the nav overlay don't match premium positioning.

**Fix:** Either use custom monochrome SVG icons that match the site's style, or remove them from the nav overlay entirely (move to footer as planned in Critical #2).

#### 7. STANDARD BROWSER SLIDER STYLING

**Problem:** The production budget slider on the landing page uses default browser/OS slider styling instead of custom-styled gold thumb.

**Fix:** Style the slider thumb to match the brand — gold color, custom size, subtle shadow. The slider track can remain dark but the thumb should feel intentional.

#### 8. "90 DAYS LEFT" WRONG COLOR ON /PRICING

**Problem:** The "90 DAYS LEFT" urgency text uses amber/orange gold (#FFB800) which is different from everything else.

**Fix:** This should use `AMBER = #F0A830` — and since it's an urgency indicator, amber is actually the correct semantic choice here. But ensure it's consistent with the token.

#### 9. LEGAL DISCLAIMER UNREADABLE

**Problem:** "For educational and informational purposes only..." text at the bottom of most pages is extremely low contrast — grey text on dark grey background.

**Fix:** Increase text opacity. Use `rgba(255,255,255,0.55)` or higher. This is both a usability and legal clarity issue.

#### 10. "VAULT" TEXT AND PIN ICONS WRONG COLOR ON /RESOURCES

**Problem:** The "VAULT" header text and the pin/saved icons use a saturated orange-gold, not the brand gold.

**Fix:** Change "VAULT" text and pin icons to `GOLD = #D4AF37`.

---

### 🟡 MEDIUM — Polish Before Launch

#### 11. PRICING CARDS HAVE NO EXPLICIT CTA BUTTONS

**Problem:** The pricing tier cards don't have "Select" or "Get Started" buttons. The whole card acts as the click target.

**Fix:** Add explicit CTA buttons at the bottom of each pricing card. Style them to match the CTA button gradient from Critical #3.

#### 12. BOTTOM DRAWER CLUTTERS AUTH PAGES

**Problem:** On /signup and /login, there's an "ASK THE OG" drawer at the bottom AND a floating action button (FAB) in the corner. The bottom of the page feels crowded.

**Fix:** Pick one — either the drawer or the FAB, not both. Recommend keeping the FAB (it's globally consistent) and removing the drawer from auth pages.

#### 13. SUBTEXT CONTRAST ON AUTH PAGES

**Problem:** "Sign in to your account" and "Don't have an account?" text is medium grey on dark grey — slightly low contrast.

**Fix:** Increase to `rgba(255,255,255,0.65)` or higher for these labels.

#### 14. CTA STYLES MIXED ON /RESOURCES

**Problem:** Some buttons are solid gold, others are outline/ghost style.

**Fix:** Standardize — all primary CTAs should be solid gold with the metallic gradient. Secondary actions can be outline.

#### 15. NAV BAR FEELS DISCONNECTED ON /RESOURCES

**Problem:** The floating pill nav at the top feels small and "lost" on a page that has heavy visual weight.

**Fix:** Ensure the nav bar has appropriate presence — sizing, spacing, and weight should feel intentional relative to the page content below it.

---

### 🟢 LOW — Polish

#### 16. GLOW EFFECT ON PRICING "LOCK IN $19/MO" (already noted in handoff)

**Problem:** The outer glow on the "LOCK IN $19/MO" text feels early-2010s.

**Fix:** Either remove the glow or replace with a more subtle gradient. Commit to the modern flat aesthetic.

#### 17. ICON STROKE WEIGHTS VARY

**Problem:** Footer/social icons have inconsistent line weights.

**Fix:** Standardize all icons to the same stroke weight.

---

## IMPORTANT — Verify These Pages Exist in Repo

**The audit was performed on the LIVE site at filmmakerog.com**

The following pages were audited on the live site but may NOT exist in this repo yet:

| Live Site Route | Audit Finding | Status in Repo |
|---|---|---|
| `/pricing` | "90 DAYS LEFT", founding tier pricing cards | **NOT IN REPO** — no `/pricing` route or page exists |
| `/signup` | Auth card, FAB, bottom drawer | **NOT IN REPO** — no `/signup` route |
| `/login` | Auth card, FAB, bottom drawer | **NOT IN REPO** — no `/login` route |

The repo has `/store` (product store) and `/auth` (combined auth page) instead.

**Before executing this handoff:** Verify whether the pricing/signup/login pages were deployed separately or need to be created first. The visual changes in this handoff apply to pages that may not be in the codebase yet.

---

## FILE-BY-FILE CHANGES

### `/src/pages/Index.tsx` (Landing Page)
- ✅ IN REPO — Make changes here
- Remove Linktree overlay OR make it dismissible
- Move social links to footer only
- Fix any raw hex gold values → use tokens
- Apply metallic gradient to CTA buttons
- Remove or fill empty containers at bottom
- Style the production budget slider thumb

### `/src/pages/Resources.tsx`
- ✅ IN REPO — Make changes here
- Remove Linktree overlay OR make it dismissible
- Fix "VAULT" text → `GOLD = #D4AF37`
- Fix pin/saved icons → `GOLD = #D4AF37`
- Fix empty black space at bottom
- Standardize CTA button styles (solid gold, not outline)
- Remove bottom drawer clutter

### `/src/pages/Pricing.tsx`
- ❌ NOT IN REPO — This page doesn't exist in the codebase yet
- If creating it: Fix "90 DAYS LEFT" → `AMBER = #F0A830`
- If creating it: Add explicit CTA buttons to pricing cards
- If creating it: Remove early-2010s glow effect on "LOCK IN $19/MO"
- If creating it: Fix raw hex gold values → use tokens
- If creating it: Apply metallic gradient to CTA buttons

### `/src/pages/Signup.tsx` and `/src/pages/Login.tsx`
- ❌ NOT IN REPO — Auth is currently handled by `/auth` (combined page)
- If creating separate pages: Remove bottom drawer (keep FAB only)
- If creating separate pages: Fix subtext contrast → `rgba(255,255,255,0.65)`
- If creating separate pages: Apply metallic gradient to CTA buttons
- If creating separate pages: Fix raw hex gold values → use tokens

### `/src/pages/Store.tsx`
- ✅ IN REPO — Make changes here
- This is the product store (NOT a subscription pricing page)
- Review for any raw hex values that need token replacement
- Apply consistent gold usage

### `/src/pages/Auth.tsx`
- ✅ IN REPO — Combined signup/login page
- Check for bottom drawer clutter
- Fix subtext contrast → `rgba(255,255,255,0.65)`
- Apply metallic gradient to CTA buttons

### `/src/index.css`
- Define a CSS utility class for the metallic gold button gradient
- Audit for any raw hex values (#F3E086, #F9E076, #FFB800, etc.) and replace with CSS variables that reference the tokens

### `/src/components/OgBotFab.tsx` (FAB component)
- Verify it's using the correct gold token
- Already noted as globally consistent — verify it matches after changes

### `/src/components/MobileMenu.tsx`
- Move social icons to footer only
- Style any nav buttons consistently
- Remove Linktree-style "Follow/Connect" sections from menu

### `/src/components/ui/button.tsx`
- Add metallic gradient to primary button variant
- Ensure all buttons use the correct gold token

---

## VERIFICATION CHECKLIST

After making changes, verify:

- [ ] Search codebase for raw hex values `#F3E086`, `#FFB800`, `#F0A825` — none should remain
- [ ] All CTA buttons have the metallic gradient applied
- [ ] Linktree overlay is gone from landing page and /resources
- [ ] Social links appear ONLY in footer (if at all)
- [ ] Empty containers removed or filled on landing page
- [ ] Empty black space removed from /resources page
- [ ] "VAULT" text is `GOLD = #D4AF37`
- [ ] "90 DAYS LEFT" is `AMBER = #F0A830`
- [ ] Legal disclaimer is readable
- [ ] FAB is the only persistent bottom element (no competing drawer on auth pages)
- [ ] Pricing cards have explicit CTA buttons
- [ ] No raw hex values in CSS — all reference tokens

---

## ORDER OF EXECUTION

1. **Audit raw hex values** — Search for `#F3E086`, `#FFB800`, `#F0A825`, `#F9A825` in the codebase. Replace with tokens.
2. **Fix gold token usage** — Ensure all brand elements use `GOLD`, all CTAs use `CTA`.
3. **Add metallic gradient** — Define in CSS, apply to all primary buttons.
4. **Remove Linktree overlay** — Landing + /resources.
5. **Move social links to footer** — Remove from nav overlays.
6. **Fill or remove empty containers** — Landing + /resources bottom sections.
7. **Fix /resources page** — "VAULT" text, pin icons, empty space.
8. **Fix pricing page** — "90 DAYS LEFT" color, CTA buttons, glow effect.
9. **Fix auth pages** — Remove drawer, fix contrast.
10. **Style slider** — Custom gold thumb.
11. **Final sweep** — Verify no raw hex values remain.

---

## NOTES

- The existing `tokens.ts` file is the source of truth. Do not modify it — it already has the correct values.
- The FAB component (`OgBotFab.tsx`) is already noted as globally consistent — verify after changes, don't redesign it.
- The dark cinematic theme is working — don't flip to light mode or change the background colors.
- Bebas Neue for headlines, Inter for body, Roboto Mono for data — these fonts are already set, don't change them.
- The brand two-gold rule is already documented: `GOLD` for brand elements, `CTA` for clickable elements. Follow it.

---

## FILES TO MODIFY

**In Repo — Make Changes:**
- `/src/pages/Index.tsx` ✅
- `/src/pages/Resources.tsx` ✅
- `/src/pages/Store.tsx` ✅
- `/src/pages/Auth.tsx` ✅
- `/src/index.css`
- `/src/components/MobileMenu.tsx`
- `/src/components/ui/button.tsx`

**Not in Repo — Needs Verification:**
- `/src/pages/Pricing.tsx` ❌ (route doesn't exist)
- `/src/pages/Signup.tsx` ❌ (route doesn't exist — use /auth)
- `/src/pages/Login.tsx` ❌ (route doesn't exist — use /auth)

**Reference Only (don't modify):**
- `/src/lib/tokens.ts` (source of truth — already correct)
- `/src/components/OgBotFab.tsx` (already consistent)
