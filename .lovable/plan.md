
# Making FILMMAKER.OG Feel Native — Full App-Like Upgrade

## What You're Already Doing Right

Before listing what to fix, it's worth noting what's already native-quality:
- Fixed header with `--appbar-h` CSS token — correct
- TabBar with `padding-bottom: env(safe-area-inset-bottom)` — correct
- Swipe gesture hook with rubber-band physics — correct
- Haptic feedback on interactions — correct
- `viewport-fit=cover` and `apple-mobile-web-app-capable` in `index.html` — correct
- 16px minimum font-size on inputs to prevent iOS zoom — correct
- `font-size: 16px` on all inputs (already in `index.css`) — correct

---

## The 7 Things That Would Make It Feel Dramatically More Native

These are ranked by user-visible impact.

---

### 1 — Bottom Sheet Navigation (Hamburger Menu)

**Current problem:** Right-side drawer (`translate-x-full → translate-x-0`, `w-[280px]`). This is a web pattern. No native app on iOS or Android uses a right-side drawer for the primary nav.

**Fix:** Full-width bottom sheet that slides up from the bottom.

**File:** `src/components/MobileMenu.tsx`

Changes:
- `fixed top-0 right-0 bottom-0 w-[280px]` → `fixed bottom-0 left-0 right-0`
- `translate-x-full` → `translate-y-full`, `translate-x-0` → `translate-y-0`
- Add `rounded-t-2xl` on the sheet (the only rounded corners in the whole app — standard iOS sheet)
- Add a decorative drag handle: `w-8 h-1 bg-white/15 rounded-full mx-auto mt-3 mb-6`
- Add `padding-bottom: env(safe-area-inset-bottom)` so it clears the home indicator
- Change nav links from vertical list to `grid grid-cols-2 gap-2` — more compact, more app-like
- Sheet height: `max-h-[85vh]` with `overflow-y-auto` — so it never covers the full screen

Animation: Same `duration-300 ease-out` already in place — just vertical now.

Add swipe-to-dismiss: attach `onTouchStart`/`onTouchEnd` to detect a downward swipe and close the sheet.

---

### 2 — Global OG Bot as a Floating Action Button + Bottom Sheet

**Current problem:** Bot lives only on `/glossary`. Users who need help mid-calculator or mid-store have no access.

**Fix:** New `src/components/OgBotSheet.tsx` — a self-contained FAB + sheet:

- Gold circle FAB, `fixed bottom-20 right-4 z-[160]` (above content, below any modal)
- `w-12 h-12`, `bg-gold`, black `Sparkles` icon
- Gold ambient glow: `box-shadow: 0 4px 24px rgba(212,175,55,0.30)`
- Tapping it opens a `70vh` bottom sheet (same pattern as new hamburger menu)
- Full streaming chat UI extracted from `Glossary.tsx` lives inside

The FAB sits at `bottom-20` so it doesn't collide with the TabBar on the Calculator (which is `--tabbar-h: 62px`). On all other pages it sits above the bottom of the screen.

**App.tsx:** Add `<OgBotSheet />` at root level, outside `<Routes>`, inside `<BrowserRouter>`.

**Glossary.tsx:** Remove the inline bot section. The page becomes purely the 10 Essentials pill grid.

---

### 3 — Model + Input Cap Upgrade (film-search Edge Function)

This was already planned and approved in the conversation. Bundle it here:

**File:** `supabase/functions/film-search/index.ts`
- Line 38: `gemini-3-flash-preview` → `google/gemini-3-pro-preview`
- Line 41: `question.slice(0, 500)` → `question.slice(0, 1500)`

---

### 4 — PWA Manifest + Home Screen Install

**Current problem:** `index.html` has `apple-mobile-web-app-capable` but no actual PWA manifest. Users can't install it to their home screen. There's no app icon, no theme color, no standalone display mode.

**Fix:** Add a `public/manifest.json` and link it in `index.html`:

```json
{
  "name": "FILMMAKER.OG",
  "short_name": "FILMMAKER",
  "description": "Film finance simulator. See where every dollar goes.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#000000",
  "icons": [
    { "src": "/favicon.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Add to `index.html`:
```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#000000" />
<meta name="apple-mobile-web-app-title" content="FILMMAKER.OG" />
```

This is the difference between "a website that works on mobile" and "an app." Once installed from Safari's Share → Add to Home Screen, it launches fullscreen with no browser chrome — exactly like a native app.

---

### 5 — Pull-to-Refresh Suppression + Scroll Behavior

**Current problem:** On iOS Safari, pulling down on any scroll container triggers the browser's native pull-to-refresh, which looks janky and breaks the cinematic feel.

**Fix:** Add to `index.css`:
```css
html, body {
  overscroll-behavior: none;
}
```

This single line suppresses iOS Safari's bounce scroll and pull-to-refresh rubber-band on the root document. It does not affect internal scroll containers (like the Calculator's `main` element), which still scroll normally.

Also add `touch-action: manipulation` to all interactive elements (already partially handled by Tailwind's `active:` states, but this ensures no 300ms click delay on older mobile browsers).

---

### 6 — Active State Press Feedback on All Tappable Elements

**Current problem:** Many interactive elements (nav menu buttons, info pills, card taps) don't have a press-down feel. Native apps have instant visual compression on every tap.

**Fix:** Add a global active-state rule to `index.css`:
```css
button:active,
a:active,
[role="button"]:active {
  transform: scale(0.97);
  opacity: 0.85;
  transition: transform 80ms ease, opacity 80ms ease;
}
```

This is a single CSS rule that applies across the whole app. Every tappable element now compresses on touch — which is the most low-effort, highest-impact native feel improvement possible. The Calculator's `active:scale-95` Tailwind classes already do this for specific elements; this rule makes it universal.

Add a carve-out for elements that already have their own active transforms:
```css
button[class*="active:scale"]:active {
  transform: none; /* let Tailwind handle it */
}
```

---

### 7 — Safe Area Insets on All Page Wrappers

**Current problem:** Several pages (`WaterfallInfo`, `BudgetInfo`, `CapitalInfo`, `FeesInfo`, `Glossary`, `Store`) use hardcoded `pt-[68px]` or `pb-16` without accounting for iOS safe areas. On phones with a notch or Dynamic Island, content can be cut off at the top or bottom.

**Fix:** In `index.css`, add:
```css
.page-safe {
  padding-top: max(var(--appbar-h), env(safe-area-inset-top));
  padding-bottom: max(64px, env(safe-area-inset-bottom));
}
```

Then systematically replace `pt-[68px]` and `pb-16` on these pages with `pt-safe pb-safe` (using Tailwind's `env()` support, or the `.page-safe` class). This ensures the app content never overlaps the notch area.

---

## What Does NOT Change

- No new routing changes
- No new dependencies (manifest.json is a static file)
- No database changes
- The Calculator's TabBar already handles safe-area insets correctly — leave it alone
- The cinematic intro on the homepage is already native-quality — leave it alone
- The swipe gesture system is already correct — leave it alone

---

## File Summary

| File | What Changes |
|---|---|
| `src/components/MobileMenu.tsx` | Bottom-up sheet, drag handle, 2-col grid, swipe-to-dismiss |
| `src/components/OgBotSheet.tsx` | New file — global FAB + bottom sheet with full bot UI |
| `src/App.tsx` | Add `<OgBotSheet />` at root level |
| `src/pages/Glossary.tsx` | Remove inline bot, keep 10 terms pill grid only |
| `supabase/functions/film-search/index.ts` | Upgrade model, raise input cap |
| `public/manifest.json` | New PWA manifest |
| `index.html` | Link manifest, add theme-color, apple title |
| `src/index.css` | `overscroll-behavior: none`, universal active-state press, `.page-safe` class |

---

## Priority Order for Implementation

These can be done in one pass — they don't conflict:

1. `overscroll-behavior: none` + universal active state (CSS-only, zero risk)
2. Bottom sheet hamburger menu (MobileMenu.tsx)
3. OgBotSheet.tsx creation + App.tsx integration
4. Glossary.tsx cleanup
5. PWA manifest + index.html
6. film-search model upgrade
7. Safe area inset cleanup across info pages

The app will feel genuinely native after all 7 of these are in place.
