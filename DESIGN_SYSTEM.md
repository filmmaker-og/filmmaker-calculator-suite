# filmmaker.og — Design System

Reference for all page-level work. Read this before modifying any page.

The landing page (`src/pages/Index.tsx`) is the reference implementation. When in doubt, match it.

---

## Type Scale (7 steps — no others)

| Size | Role | Font | Example |
|------|------|------|---------|
| `text-[clamp(3.2rem,11vw,4.8rem)]` | Hero headline only | Bebas Neue | "SEE WHERE EVERY DOLLAR GOES" |
| `text-[40px]` | Section headlines, bridge statements | Bebas Neue | "YOUR INVESTORS WILL ASK..." |
| `text-[28px]` | Product/feature names | Bebas Neue | "THE WATERFALL" |
| `text-[26px]` | Counter values, large data | Mono or Bebas | "$417,500" |
| `text-[16px]` | Body text, descriptions, list items | DM Sans | Check/X items, explainer text |
| `text-[14px]` | Section labels, secondary labels | Roboto Mono | "With your waterfall", footer tagline |
| `text-[12px]` | Captions, footnotes, legal, counter labels | Roboto Mono / DM Sans | "Net Profits", disclaimers |

**Rules:**

- Never use `text-[13px]` or `text-[15px]` — they're too close to 14/16 and create visual ambiguity
- Never use `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` etc. — use explicit pixel values only
- Every size has exactly one job. If it doesn't fit the table above, the size is wrong.

---

## Font Assignments

| Font | Tailwind class | Use for |
|------|---------------|---------|
| Bebas Neue | `font-bebas` | Display headlines, section titles, product names, bridge lines |
| DM Sans | `font-sans` (default) | Body text, descriptions, UI elements, list items |
| Roboto Mono | `font-mono` | Numbers, prices, labels, data, footnotes, section eyebrows |

**Rules:**

- Bebas is always uppercase with `tracking-[0.06em]` to `tracking-[0.08em]`
- Mono labels use `tracking-[0.12em]` uppercase
- Never mix fonts within a single text element

---

## Color Tokens (use these, not legacy)

### Text Colors

| Token | Tailwind class | Use for |
|-------|---------------|---------|
| White | `text-white` or `text-ink` | Headlines, key numbers, emphasis |
| Body | `text-ink-body` | Paragraph text, descriptions |
| Secondary | `text-ink-secondary` | Supporting info, metadata, constraints |
| Ghost | `text-ink-ghost` | Disclaimers, fine print, legal |
| Gold | `text-gold` | Gold headlines, labels, brand elements |
| Gold label | `text-gold-label` | Micro-labels, muted gold text |

### Borders

| Token | Tailwind class | Use for |
|-------|---------------|---------|
| Card border | `border-gold-border` | Card/section container borders |
| Inner rule | `border-bg-card-rule` | Row dividers inside cards |

### Backgrounds

| Token | Tailwind class | Use for |
|-------|---------------|---------|
| Void | `bg-black` | Page background, card backgrounds |
| Surface | `bg-bg-surface` | Section panels (#111111) |
| Card fill | `bg-bg-card` | rgba(255,255,255,0.04) subtle card fill |
| Emphasis row | inline `rgba(255,255,255,0.02)` | Highlighted rows within tables |

### LEGACY TOKENS — DO NOT USE ON NEW/REBUILT PAGES

These exist in `tailwind.config.ts` under "LEGACY COMPAT" for pages not yet migrated:

- `text-text-primary`, `text-text-mid`, `text-text-dim` → replace with `text-white`, `text-ink-body`, `text-ink-secondary`
- `border-border-subtle` → replace with `border-gold-border` or `border-bg-card-rule`
- `bg-bg-card`, `bg-bg-header`, `bg-bg-void` → replace with `bg-black`, `bg-bg-surface`, or inline rgba values

When rebuilding a page, replace ALL legacy tokens with the correct modern token. Do not mix systems on the same page.

---

## Container Treatments

### Data card (tables, ledgers, comparison grids)

```jsx
className="border border-gold-border bg-black overflow-hidden rounded-xl"
style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
```

- Row dividers: `border-t border-bg-card-rule`
- Row padding: `px-6 py-4` or `px-6 py-5`
- Emphasis rows: add `style={{ background: 'rgba(255,255,255,0.02)' }}`

### Hero/feature card (subtle containment)

```jsx
className="rounded-2xl px-2 pt-6 pb-5"
style={{
  border: '1px solid rgba(212,175,55,0.10)',
  background: 'rgba(255,255,255,0.02)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 40px rgba(212,175,55,0.03)',
}}
```

### CTA card (strongest emphasis)

```jsx
className="rounded-2xl px-8 py-10 md:py-14 text-center"
style={{
  border: '1px solid rgba(212,175,55,0.30)',
  background: 'rgba(255,255,255,0.04)',
  boxShadow: '0 0 60px rgba(212,175,55,0.06), 0 0 120px rgba(212,175,55,0.03), inset 0 1px 0 rgba(255,255,255,0.06)',
}}
```

### Border opacity hierarchy (faintest → strongest)

1. Hero card: `rgba(212,175,55,0.10)`
2. Data cards: `border-gold-border` (0.25)
3. CTA card: `rgba(212,175,55,0.30)`

Never invert this hierarchy. Stronger emphasis = stronger border.

---

## Section Structure

Use raw `<section>` tags with direct styling. Do NOT use `SectionFrame` or `SectionHeader` wrapper components — these are legacy and will be removed.

```jsx
<section id="section-name" className="py-14 md:py-20 px-6">
  <div className="max-w-md mx-auto">
    {/* content */}
  </div>
</section>
```

- Mobile max-width: `max-w-md` (448px)
- Section padding: `py-14 md:py-20 px-6`
- No ambient gradient backgrounds unless the section is a hero or primary feature

---

## Scroll Reveals

Use IntersectionObserver, fire once, fade + slide up:

```tsx
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
    { threshold: 0.2 }
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

---

## CTA Buttons

### Primary CTA:

```jsx
<button className="w-full h-14 btn-cta-primary animate-cta-glow-pulse">
  BUTTON TEXT
</button>
```

- Max width: `max-w-[280px]` or `max-w-[320px]`
- Text is always uppercase
- Only `btn-cta-primary` gets the gold glow pulse animation
- Two CTAs on the same page should have different labels (progression, not repetition)

---

## What NOT to Do

- No `rounded-lg` or `rounded-md` — use `rounded-xl` for data cards, `rounded-2xl` for feature/CTA cards
- No Tailwind default text sizes (`text-sm`, `text-base`, `text-lg`) — explicit pixels only
- No gradient gold dividers between sections — these are legacy Store page patterns
- No `SectionFrame` or `SectionHeader` components
- No lucide-react icons in section headers — the landing page uses none
- No stagger delay animations on list items — use single container reveals
- No mixing legacy and modern tokens on the same page
