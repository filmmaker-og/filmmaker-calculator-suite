
## Fix: Remove Excessive Top Padding on The Resource Page

### Root Cause

The Glossary page wrapper at line 486 has `pt-[68px]` applied:

```tsx
<div className="min-h-screen bg-black text-white pt-[68px] pb-4 font-sans">
```

The `<Header />` component already renders a **56px spacer div** immediately after the fixed header bar (`<div style={{ height: 'var(--appbar-h)' }} />`). This means the page content is already correctly positioned below the header before `pt-[68px]` even fires.

**The result:** 56px (Header spacer) + 68px (wrapper padding) + 16px (title block `pt-4`) = **140px** of dead space before "Film Finance" appears.

---

### The Fix

**File:** `src/pages/Glossary.tsx`, line 486

Change:
```tsx
<div className="min-h-screen bg-black text-white pt-[68px] pb-4 font-sans">
```

To:
```tsx
<div className="min-h-screen bg-black text-white pb-4 font-sans">
```

Remove `pt-[68px]` entirely. The Header spacer handles all the clearance needed.

The title block `pt-4` (line 491) can also be reduced to `pt-2` for a tighter, more intentional gap between the header separator line and the "Film Finance" eyebrow.

---

### Summary

| Location | Current | Fix |
|----------|---------|-----|
| Wrapper div (line 486) | `pt-[68px]` | Remove entirely |
| Title block (line 491) | `pt-4` | `pt-2` (tighter breath below header) |

**File:** `src/pages/Glossary.tsx` only. Single change, two lines.
