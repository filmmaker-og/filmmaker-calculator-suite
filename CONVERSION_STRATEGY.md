# FILMMAKER.OG — Conversion Strategy

**Date:** March 29, 2026
**Purpose:** Full product ladder, pricing, funnel architecture, and execution plan. Single source of truth for all conversion-related decisions.

---

## 1. PRODUCT LADDER

### The Philosophy

The free Snapshot delivers maximum value — full waterfall, sensitivity modeling, donut chart, margin ruler, prose interpretation, 5-page branded PDF. This is the lead magnet. It's so generous that producers share it with other producers, creating organic growth.

Paid products solve the question the previous tier created. Each tier absorbs everything below it.

### Products

| Product | Price | Role | What's Included |
|---------|-------|------|-----------------|
| **Free Snapshot** | $0 | Lead magnet | Full waterfall analysis, revenue donut, margin ruler, breakeven, scenario analysis, 5-page PDF. Branded FILMMAKER.OG. |
| **Snapshot+** | $19 | Tripwire | Everything in Free Snapshot + white-labeled (user's company replaces FILMMAKER.OG on every page) + 4 diagnostic metrics (Margin of Safety, Erosion Rate, Off-the-Top Total, Cost of Capital). First Stripe transaction. |
| **Comp Report** | $595 / $995 | Evidence | Everything in Snapshot+ + 5 comparable acquisition deals (or 10 for $995) in user's genre/budget/cast tier. Defensible valuation range with methodology. |
| **Producer's Package** | $1,797 | Turnkey | Everything in Comp Report + custom lookbook, pitch deck with speaker notes, enhanced financial presentation, 10 comps, investor return profiles, executive summary, deal terms summary. |
| **+ Working Model** | +$79 | Add-on | Live formula-driven Excel workbook. Available ONLY as add-on at Producer's Package checkout. Not standalone. |
| **Boutique** | $2,997+ | Bespoke | Everything in Producer's Package + custom scope per engagement. |

### Dead Products (Do Not Reintroduce)

- **The Full Analysis ($197)** — Absorbed into the free Snapshot. All its features (sensitivity modeling, investor return profiles, institutional design) are now free.
- **The Snapshot as a paid product** — Was killed earlier. Snapshot is free.
- **The Package ($597)** — Replaced by Comp Report + Producer's Package.
- **The Full Package ($2,497)** — Replaced by Boutique.

### Credit Upgrade Path

Prior purchases apply toward the next tier. If someone buys Snapshot+ ($19) and later wants the Comp Report ($595), the $19 credits toward it. Each tier above absorbs everything below, so there's no "you should have bought this first" friction.

---

## 2. FUNNEL ARCHITECTURE

### The Journey

```
Instagram → Landing Page → Email Gate → Calculator → Free Snapshot → Snapshot+ ($19) → Store
```

### Step-by-Step

**Step 1: Instagram Discovery**
- @filmmaker.og carousel/reel hooks them with film financing education
- Every post CTA: "Run your waterfall free → filmmakerog.com"
- Bio link goes directly to filmmakerog.com (no Linktree, no intermediary)

**Step 2: Landing Page (filmmakerog.com)**
- Hero: "Model Your Recoupment Waterfall" + interactive 3-slider calculator
- Social proof, waterfall preview, stakes section
- Three CTAs throughout the page: "BUILD MY WATERFALL"
- All CTAs trigger the email gate

**Step 3: Email Gate (LeadCaptureModal)**
- Name + email required
- Copy: "BUILD YOUR WATERFALL" / "Your complete financial model — waterfall, capital stack, breakeven — generated in 60 seconds."
- On submit: save to localStorage + insert into Supabase `leads` table
- **NO OTP. NO MAGIC LINK. NO SUPABASE AUTH.** Instant redirect to /calculator.
- They are not "signing up." They are getting something.

**Step 4: Free Calculator Experience**
- 5-step flow: Project → Budget → Capital Stack → Deal Terms → Waterfall Output
- WaterfallDeck renders: Cold Open → Cover → Gate 0 (Snapshot+) → Deal → Numbers → Interpretation → Waterfall → Conclusion → CTA
- This is the free value delivery. It must feel genuinely valuable.

**Step 5: Gate 0 — Snapshot+ ($19)**
- Positioned after the Cover section (30-Second Card with headline numbers)
- "DOES YOUR DEAL ACTUALLY WORK?"
- 4 blurred diagnostic metrics with lock overlay
- "UNLOCK SNAPSHOT+ — $19"
- "Applies as credit toward higher tiers"
- Stripe Checkout redirect with email pre-filled from lead capture

**Step 6: Free PDF Export**
- Available below Gate 0 — the gate does NOT block the free value
- "Export Free Snapshot" button
- 5-page FILMMAKER.OG branded PDF (full analysis, zero upsell)
- Uses email from localStorage (no auth check)
- Back page includes one subtle breadcrumb: "Unlock deal diagnostics, branded formatting, and more at filmmakerog.com/store"

**Step 7: Post-Purchase / Email Nurture**
- Handled by Loops (see Section 4)

**Step 8: Store**
- For users who want to go deeper: Comp Report, Producer's Package, Boutique
- Accessible via nav, footer, and upgrade prompts within products

---

## 3. LEAD CAPTURE — TECHNICAL CHANGES

### Kill Supabase Auth from Lead Flow

The current flow fires `supabase.auth.signInWithOtp()` which sends a magic link email the user never asked for. This creates confusion and friction.

**Replace with:**

1. `LeadCaptureModal.tsx` — Remove `supabase.auth.signInWithOtp()`. Replace with simple insert to `leads` table. Keep localStorage save.
2. `EmailGateModal.tsx` — Evaluate for removal. Currently sends magic link for "save your progress." May not be needed if we're not using auth.
3. `Calculator.tsx` — Remove `supabase.auth.getSession()` check. Just check `localStorage.getItem('og_lead_email')`. If missing, show LeadCaptureModal.
4. `WaterfallDeck.tsx` (CTASection) — PDF export: switch from Supabase session email to `localStorage.getItem('og_lead_email')`.
5. `WaterfallDeck.tsx` (gatedNavigate) — Remove Supabase session check, use localStorage.
6. `Index.tsx` (gatedNavigate) — Same.

### New Supabase Table: `leads`

```sql
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  source TEXT DEFAULT 'calculator',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON public.leads(email);
```

Simple. No RLS complexity. Just a lead list.

---

## 4. EMAIL PLATFORM — LOOPS

### Why Loops

- Free for first 1,000 contacts (we're at zero)
- Native Supabase webhook integration
- Native Stripe integration
- Transactional + marketing in one platform
- Design-first email editor (matches FILMMAKER.OG brand)
- $0/month until 1,000+ contacts, then $49/month

### Integration Architecture

```
Lead submits email → Supabase `leads` table INSERT
  → Supabase database webhook fires
  → Loops receives webhook → creates contact → triggers welcome sequence

Stripe purchase event
  → Loops receives Stripe webhook → tags customer → triggers post-purchase sequence
```

### Email Sequences

**Lead Nurture (triggered on new lead):**

| Timing | Subject | Content | CTA |
|--------|---------|---------|-----|
| Immediate | "Your Waterfall Snapshot is ready" | Link back to /calculator + PDF download | Return to your model |
| Day 2 | "Does your deal actually work?" | Introduce Snapshot+ diagnostic metrics. Explain Margin of Safety. | Unlock for $19 |
| Day 5 | "What investors actually look at" | Educational — what makes a financial presentation credible | Soft intro to Comp Report |
| Day 10 | "Your model expires in 20 days" | Urgency. Model saved for 30 days. | Come back and finish |

**Post-Purchase: Snapshot+ (triggered on $19 Stripe event):**

| Timing | Subject | Content | CTA |
|--------|---------|---------|-----|
| Immediate | "Your Snapshot+ is ready" | Confirmation + link to branded PDF + diagnostics | View your results |
| Day 3 | "The question every investor asks" | "Why is this film worth that?" — introduces need for evidence | See the Comp Report |

**Post-Purchase: Comp Report (triggered on $595/$995 Stripe event):**

| Timing | Subject | Content | CTA |
|--------|---------|---------|-----|
| Immediate | "Your Comp Report is in progress" | Confirmation + 72-hour turnaround reminder | — |
| On delivery | "Your Comp Report is ready" | Download link + summary of findings | View the Producer's Package |

---

## 5. STORE PAGE CHANGES

### Remove
- The Full Analysis ($197) — product and page

### Update
- **Snapshot+**: $49 → $19. New description: white-label + 4 diagnostics.
- **Working Model**: `requiresBase` changes to `["the-producers-package"]` only.
- **Comp Report**: `upgradePrompt` no longer references Full Analysis. Now points directly from Snapshot+.
- **All upgradePrompt chains**: Snapshot+ → Comp Report → Producer's Package → Boutique.

### Store Layout Decision (Open)
- Does Snapshot+ belong on the store page? At $19 alongside $1,797, it may cheapen the premium tiers.
- Option A: Snapshot+ is ONLY surfaced in the WaterfallDeck gate. Store shows Comp Report, Producer's Package, Boutique.
- Option B: Snapshot+ is on the store but in a separate "Instant" section above the premium tiers.
- **Decision needed.**

---

## 6. STRIPE CHANGES

- Create/update Snapshot+ product: $19
- Remove The Full Analysis product
- Verify Comp Report ($595 / $995), Producer's Package ($1,797), Boutique ($2,997+), Working Model ($79) are correct
- Wire `create-checkout` edge function for Snapshot+ at $19
- Pre-fill customer email from lead capture data

---

## 7. OGBOT — SWITCH TO CLAUDE

### Current State
- OgBotSheet.tsx is fully built and functional
- Calls Supabase Edge Function `ask-the-og` (streaming SSE)
- Currently running on Gemini
- Edge function is deployed on Supabase but NOT checked into the repo

### Changes Needed
- Rebuild `ask-the-og` edge function using Anthropic Claude API
- Check the new function into the repo (`supabase/functions/ask-the-og/index.ts`)
- Update system prompt to reflect new product ladder (Snapshot+ at $19, no Full Analysis)
- Update store-related chip prompts in OgBotSheet.tsx
- Maintain streaming SSE response pattern

---

## 8. ANALYTICS

### Current State
No analytics of any kind in the codebase. Flying blind.

### Recommended
Add lightweight analytics to track:
- Landing page visits
- Email gate submissions (lead conversion rate)
- Calculator completions
- Snapshot+ gate impressions vs. purchases (tripwire conversion rate)
- Free PDF exports
- Store page visits

Options: Vercel Analytics (free tier, already on Vercel), Plausible (privacy-focused), or PostHog (event-based, generous free tier).

---

## 9. OPEN DECISIONS

1. **Store layout**: Does Snapshot+ appear on the store page or only inside the WaterfallDeck? (See Section 5)
2. **30-day model expiry**: Is this real? Does data have a TTL in Supabase? If not, remove the false urgency line from WaterfallDeck. If yes, ensure Loops Day 10 email references it.
3. **Free PDF back-page breadcrumb**: Subtle upsell line on last page — yes or no?
4. **Analytics platform choice**: Vercel Analytics, Plausible, or PostHog?
5. **Direct-to-store visitors**: If someone lands on /store without using the calculator, should the page push them to try the calculator first?

---

## 10. EXECUTION PRIORITY

| # | Task | Why This Order |
|---|------|---------------|
| 1 | Kill OTP auth, create `leads` table, simplify lead capture | Unblocks the entire funnel. Current flow sends confusing magic link emails. |
| 2 | Update `store-products.ts` (Snapshot+ $19, kill Full Analysis, fix Working Model) | Store is displaying dead/wrong products. |
| 3 | Wire Stripe checkout for Snapshot+ at $19 | Can't collect money without this. |
| 4 | Post-purchase UX (unlock diagnostics + branded PDF delivery) | The $19 needs to feel instant and worth it. |
| 5 | Set up Loops (welcome email, nurture sequence, Stripe integration) | Converts leads who don't buy on first visit. |
| 6 | Switch OgBot from Gemini to Claude | Product knowledge needs to be current. |
| 7 | Add analytics | Start collecting data to optimize. |
| 8 | Store page redesign (remove dead products, restructure layout) | Visual cleanup after product changes. |
| 9 | Update OgBot chip prompts for new product ladder | Small fix, depends on #2 and #6. |
| 10 | Free PDF back-page breadcrumb | Small revenue optimization. |
| 11 | ManyChat Instagram DM automation (Phase 2) | Once Instagram is posting consistently. |

---

## 11. PHASE 2 — MANYCHAT

When @filmmaker.og has consistent posting and engagement:
- Set up ManyChat for Instagram DM automation
- Keyword triggers on posts (e.g., comment "waterfall" → auto-DM with link)
- Captures leads inside DM before sending to site (two entry points: DM + website)
- ManyChat connects to Stripe for in-DM purchases
- Push DM-captured contacts to Loops audience via ManyChat API or Zapier
- Cost: $15/month

---

*This document is the single source of truth for conversion-related decisions. Update it as decisions are made.*
