# filmmaker.og — Design System

Reference for all page-level work. Read this before modifying any page.

The source of truth for token values is `src/lib/design-system.ts`. This document explains how to apply them. When values conflict, design-system.ts wins.

---

## Color System

### Gold — 4 Tiers + 2 Solids

| Name | Value | Tailwind class | Use for |
|------|-------|---------------|---------|
| Full | `#D4AF37` | `text-gold-full`, `text-gold`, `border-gold` | Brand mark, icons, active labels, section eyebrows |
| Strong | `rgba(212,175,55,0.25)` | `border-gold-strong` | Active borders, hover states, emphasis borders |
| Medium | `rgba(212,175,55,0.15)` | `border-gold-medium`, `border-gold-border` | Card borders, section dividers, resting borders |
| Subtle | `rgba(212,175,55,0.08)` | `bg-gold-subtle` | Hover fills, zebra row tints, background tints |
| Ghost | `rgba(212,175,55,0.03)` | `bg-gold-glow` | Ambient glows, large area tints, radial backgrounds |
| Deep | `#7A5C12` | `text-gold-deep` | Gradient depth, dark gold shadows |
| CTA | `#F9E076` | `text-gold-cta` | **Clickable elements ONLY** — buttons, links, CTAs |

**No other gold opacity values exist.** If you need a gold opacity not listed here, use the closest tier.

### White / Text — 4 Tiers

| Name | Value | Tailwind class | Use for |
|------|-------|---------------|---------|
| Primary | `#FFFFFF` | `text-white` | Headlines, key numbers, emphasis, primary content |
| Secondary | `rgba(255,255,255,0.70)` | `text-ink-body` | Body text, descriptions, paragraph content |
| Tertiary | `rgba(255,255,255,0.40)` | `text-ink-secondary` | Captions, metadata, labels, constraints |
| Ghost | `rgba(255,255,255,0.06)` | `text-ink-ghost` | Hover backgrounds, surface tints, faint fills |

Additional text tier (non-landing pages):

| Name | Value | Tailwind class | Use for |
|------|-------|---------------|---------|
| Muted | `rgba(255,255,255,0.55)` | `text-ink-muted` | Readable subordinate text, between secondary and tertiary |

**Readability rule:** Never combine white 0.40 with font sizes below 14px on #000, or below 16px on #111. If both opacity and size are at their minimum, bump opacity to 0.70.

### Backgrounds — 3 Only

| Background | Hex | Use for |
|-----------|-----|---------|
| Void | `#000000` | Page backgrounds, primary card backgrounds |
| Elevated | `#111111` | Section panels, data cards, lifted containers |
| Surface | `#1A1A1A` | Input fields, nested containers, recessed areas |

No other background values. No `rgba(255,255,255,0.04)` card fills. Use #000 or #111 solid.

---

## Typography

### Font Assignments

| Font | Tailwind class | Use for |
|------|---------------|---------|
| Bebas Neue | `font-bebas` | Display headlines, section titles, bridge statements |
| Inter | `font-sans` (default) | Body text, descriptions, UI elements |
| Roboto Mono | `font-mono` | Numbers, prices, labels, data, section eyebrows, footnotes |

### Type Scale

| Size | Role | Font | Example |
|------|------|------|---------|
| `clamp(3.2rem,11vw,4.8rem)` | Hero headline only | Bebas | "SEE WHERE EVERY DOLLAR GOES" |
| `text-[40px]` / `text-[44px]` | Section H2 desktop | Bebas | "YOUR INVESTORS WILL ASK..." |
| `text-[28px]` / `text-[32px]` | Section H2 mobile | Bebas | Same content, mobile size |
| `text-[24px]` / `text-[26px]` | Subordinate H2 mobile | Bebas | Lower-priority section titles |
| `text-[18px]` / `text-[20px]` | Featured body, thesis statements, large data | Inter or Mono | Intro paragraphs, acquisition amounts |
| `text-[16px]` | Standard body text | Inter | Paragraphs, descriptions |
| `text-[14px]` | Secondary text, labels, data rows | Mono or Inter | Section labels, table data, punchlines |
| `text-[12px]` | Captions, footnotes, legal, counter labels | Mono | "Net Profits", disclaimers, metadata |

**Rules:**

- Use explicit pixel values only — never `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` etc.
- Never use `text-[13px]` or `text-[15px]` — they create visual ambiguity
- Bebas always uppercase with `tracking-[0.06em]` to `tracking-[0.08em]`
- Mono labels use `tracking-[0.12em]` to `tracking-[0.20em]` uppercase
- Never mix fonts within a single text element

---

## Border Radius — 8px Maximum

| Radius | CSS | Use for |
|--------|-----|---------|
| 4px | `borderRadius: "4px"` or `rounded-sm` | CTA buttons, small interactive elements |
| 6px | `borderRadius: "6px"` | Default cards, typical containers |
| 8px | `borderRadius: "8px"` | Maximum — feature cards, hero sections |

**8px is the absolute maximum.** Do not use `rounded-lg`, `rounded-xl`, `rounded-2xl`, or `rounded-full` on cards or containers. The institutional aesthetic requires sharp corners. Use inline `borderRadius` or CSS variable equivalents (`--radius-sm`, `--radius-md`, `--radius-lg`).

Exception: `rounded-full` for pill elements (badges, tags) only.

---

## Container Treatments

### Data card (tables, ledgers, comparison grids)

```jsx
style={{
  border: '1px solid rgba(212,175,55,0.15)',
  borderRadius: '8px',
  background: '#111111',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
}}
```

- Row dividers: 1px `rgba(255,255,255,0.06)`
- Row padding: `px-6 py-4` or `px-5 py-3.5`
- Emphasis rows: `rgba(212,175,55,0.08)` background

### Narrative card (evidence panels, info cards)

```jsx
style={{
  border: '1px solid rgba(212,175,55,0.15)',
  borderRadius: '8px',
  background: '#111111',
}}
```

### CTA / Closer card (strongest emphasis)

```jsx
style={{
  border: '1px solid rgba(212,175,55,0.25)',
  borderRadius: '8px',
  background: '#000000',
  boxShadow: '0 0 60px rgba(212,175,55,0.03)',
}}
```

With radial gold gradient for warmth.

### Border opacity hierarchy (faintest → strongest)

1. Ambient cards: `rgba(212,175,55,0.08)`
2. Standard cards: `rgba(212,175,55,0.15)` — gold-medium
3. Active / emphasis cards: `rgba(212,175,55,0.25)` — gold-strong

Never invert this hierarchy. Stronger emphasis = stronger border.

---

## Scroll Reveals

Use IntersectionObserver, fire once, fade + slide up:

```tsx
const REVEAL_OPTIONS = { threshold: 0.2 }; // module-level constant

const ref = useRef<HTMLDivElement>(null);
const [visible, setVisible] = useState(false);

useEffect(() => {
  const el = ref.current;
  if (!el) return;
  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    },
    REVEAL_OPTIONS
  );
  obs.observe(el);
  return () => obs.disconnect();
}, []);
```

Apply to the container div:

```jsx
style={{
  opacity: visible ? 1 : 0,
  transform: visible ? 'translateY(0)' : 'translateY(20px)',
  transition: 'opacity 700ms ease-out, transform 700ms ease-out',
}}
```

- Threshold: `0.2` for most sections, `0.3` for hero waterfall, `0.5` for dramatic reveals
- Duration: 600-700ms
- Easing: `ease-out`
- Fire once only — always `obs.disconnect()` after trigger
- Sub-element reveals: use `translateY(12px)` with 200-300ms delay after parent

---

## CTA Buttons

### Primary CTA:

```jsx
<button className="w-full h-14 rounded-sm btn-cta-primary animate-cta-glow-pulse">
  BUTTON TEXT
</button>
```

- Max width: `max-w-[280px]` or `max-w-[320px]`
- Text is always uppercase
- Only `btn-cta-primary` gets the gold glow pulse animation
- Two CTAs on the same page should have different labels (progression, not repetition)

---

## Token Namespaces in tailwind.config.ts

The config has two generations of tokens. Use the correct ones:

**ACTIVE — use on all new/rebuilt pages:**

- `gold-full`, `gold-strong`, `gold-medium`, `gold-subtle`, `gold-glow`, `gold-cta`, `gold-deep`
- `ink-body` (0.70), `ink-muted` (0.55), `ink-secondary` (0.40), `ink-ghost` (0.06)
- `text-white` (full), `text-gold-full`, `text-gold-cta`
- `bg-black`, `bg-bg-elevated`, `bg-bg-surface`
- Inline rgba values using the 4-tier gold/white opacities listed above

**LEGACY — exists for unmigrated pages, do NOT use on new work:**

- `white-primary`, `white-body`, `white-tertiary`, `white-surface`
- `gold-label`, `gold-accent`, `gold-border` (aliases — use gold-medium directly)
- `text-text-primary`, `text-text-mid`, `text-text-dim`
- `border-border-subtle`, `bg-bg-card`

When rebuilding a page, replace ALL legacy tokens with the active equivalents. Do not mix systems on the same page.

---

## What NOT to Do

- No `rounded-xl`, `rounded-2xl`, `rounded-lg` on cards — max 8px, use inline borderRadius
- No Tailwind default text sizes (`text-sm`, `text-base`, `text-lg`) — explicit pixels only
- No `text-[13px]` or `text-[15px]` — not in the type scale
- No gold opacity values outside the 4-tier system (0.25/0.15/0.08/0.03)
- No white opacity values outside the system (0.70/0.55/0.40/0.15/0.06)
- No `rgba(255,255,255,0.04)` card backgrounds — use #000 or #111 solid
- No `SectionFrame` or `SectionHeader` wrapper components (legacy, removing)
- No mixing legacy and active tokens on the same page
- No stagger delay animations on list items — use single container reveals
