# Lovable.dev Build Instructions — Stripe Store & Excel Export

## For: Filmmaker.OG Calculator Suite
## Purpose: Implement payment processing and Excel export functionality

---

## OVERVIEW

This document provides step-by-step instructions for Lovable.dev AI to build:

1. **A Stripe Checkout integration** on the existing Store page
2. **An Excel export engine** that generates styled, multi-sheet financial reports
3. **A purchase-gated export flow** connecting payment to document delivery
4. **Updated Store page UI** reflecting the new product/pricing structure

---

## IMPORTANT CONTEXT

### Existing Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS 3.4 + shadcn/ui (Radix UI)
- Supabase (auth + PostgreSQL)
- React Router DOM 6
- React Hook Form + Zod
- Recharts (charting)
- Lucide React (icons)

### Existing Files You'll Modify
- `src/pages/Store.tsx` — Current store page (needs full rewrite)
- `src/lib/waterfall.ts` — Calculation engine (DO NOT MODIFY — read only)
- `src/lib/design-system.ts` — Brand colors and tokens (reference only)
- `src/components/calculator/WaterfallVisual.tsx` — Reference for data flow

### Existing Data Flow
Calculator state is stored in `localStorage` under key `"filmmaker_og_inputs"` and includes:
- `inputs`: All `WaterfallInputs` fields (revenue, budget, credits, debt, seniorDebtRate, mezzanineDebt, mezzanineRate, equity, premium, salesFee, salesExp, deferments)
- `guilds`: `{ sag: boolean, wga: boolean, dga: boolean }`
- `sourceSelections`: Which capital sources are active
- `activeTab`: Current calculator tab

### Brand Design System (MUST FOLLOW)
- **Backgrounds**: Layered blacks (#000000, #070707, #111111, #0D0D0D, #0A0A0A)
- **Metallic Gold**: #D4AF37 — borders, icons, dividers, brand elements (non-interactive)
- **CTA Gold**: #F9E076 — EXCLUSIVELY for clickable elements (buttons, links, CTAs)
- **Text**: White (#FFFFFF), Mid (#CFCFCF), Dim (#8A8A8A)
- **Font**: Bebas Neue for headlines, Inter for body, Roboto Mono for numbers
- **No green. No red. Only gold intensity variations for status.**
- **No border-radius on cards** — sharp edges, cinematic aesthetic

---

## PHASE 1: INSTALL DEPENDENCIES

### Required New Packages

```bash
npm install exceljs file-saver @stripe/stripe-js
npm install -D @types/file-saver
```

**ExcelJS** — Browser-side Excel generation with full styling (colors, fonts, merged cells, conditional formatting, charts)
**file-saver** — Triggers browser file download
**@stripe/stripe-js** — Stripe.js for redirecting to Stripe Checkout

---

## PHASE 2: SUPABASE SETUP

### Create a `purchases` Table

Run this SQL in the Supabase SQL editor:

```sql
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent TEXT,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  amount_paid INTEGER NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending',
  access_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_email ON purchases(email);
CREATE INDEX idx_purchases_stripe_session ON purchases(stripe_session_id);

-- Row Level Security
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Users can read their own purchases
CREATE POLICY "Users can view own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can insert/update (for webhook processing)
CREATE POLICY "Service role can manage purchases"
  ON purchases FOR ALL
  USING (auth.role() = 'service_role');
```

### Create an `exports` Table (tracks each download)

```sql
CREATE TABLE exports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_id UUID REFERENCES purchases(id),
  user_id UUID REFERENCES auth.users(id),
  export_type TEXT NOT NULL,
  calculator_inputs JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE exports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exports"
  ON exports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own exports"
  ON exports FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## PHASE 3: STRIPE CONFIGURATION

### Stripe Products to Create (in Stripe Dashboard)

Create these 4 products in Stripe with **one-time** payment mode:

| Product Name | Price | Stripe Price ID (example) |
|---|---|---|
| The Snapshot | $197.00 | price_snapshot_197 |
| The Blueprint | $997.00 | price_blueprint_997 |
| The Investor Kit | $1,997.00 | price_investorkit_1997 |
| The Greenlight Package | $4,997.00 | price_greenlight_4997 |

### Environment Variables

Add to `.env` (and Supabase Edge Function secrets):

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

---

## PHASE 4: CREATE STRIPE CHECKOUT EDGE FUNCTION

### Create Supabase Edge Function: `create-checkout`

File: `supabase/functions/create-checkout/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const PRODUCTS: Record<string, { name: string; price: number; accessDays: number }> = {
  snapshot: { name: "The Snapshot", price: 19700, accessDays: 30 },
  blueprint: { name: "The Blueprint", price: 99700, accessDays: 60 },
  investor_kit: { name: "The Investor Kit", price: 199700, accessDays: 180 },
  greenlight: { name: "The Greenlight Package", price: 499700, accessDays: 365 },
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { productId, email, userId } = await req.json();

    const product = PRODUCTS[productId];
    if (!product) {
      return new Response(JSON.stringify({ error: "Invalid product" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `Filmmaker.OG — ${product.name}`,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        product_id: productId,
        user_id: userId || "",
        access_days: product.accessDays.toString(),
      },
      success_url: `${req.headers.get("origin")}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/store?canceled=true`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

### Create Supabase Edge Function: `stripe-webhook`

File: `supabase/functions/stripe-webhook/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.0.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { product_id, user_id, access_days } = session.metadata!;

    const accessExpiresAt = new Date();
    accessExpiresAt.setDate(accessExpiresAt.getDate() + parseInt(access_days));

    await supabase.from("purchases").insert({
      user_id: user_id || null,
      email: session.customer_email,
      stripe_session_id: session.id,
      stripe_payment_intent: session.payment_intent,
      product_id: product_id,
      product_name: session.line_items?.data?.[0]?.description || product_id,
      amount_paid: session.amount_total,
      currency: session.currency,
      status: "completed",
      access_expires_at: accessExpiresAt.toISOString(),
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

---

## PHASE 5: REWRITE THE STORE PAGE

### Replace `src/pages/Store.tsx` entirely

The new Store page must display 4 products in this exact structure:

#### Product Data

```typescript
const products = [
  {
    id: "snapshot",
    name: "The Snapshot",
    tagline: "Quick Export",
    price: 197,
    originalPrice: null,
    badge: null,
    description: "Your calculator results, professionally packaged and ready to share.",
    features: [
      "Beautiful 6-sheet Excel waterfall report",
      "Professional cinema-grade design",
      "Plain-English glossary included",
      "Print-ready formatting",
    ],
    accessPeriod: "30 days access",
  },
  {
    id: "blueprint",
    name: "The Blueprint",
    tagline: "Present With Confidence",
    price: 997,
    originalPrice: null,
    badge: null,
    description: "Your film's financial story, packaged for any room.",
    features: [
      "Everything in The Snapshot",
      "3 scenario comparison (conservative / base / upside)",
      '"How to Read Your Blueprint" plain-English guide',
      "60 days unlimited recalculations",
    ],
    accessPeriod: "60 days access",
  },
  {
    id: "investor_kit",
    name: "The Investor Kit",
    tagline: "MOST POPULAR",
    price: 1997,
    originalPrice: 2997,
    badge: "Founders Price",
    featured: true,
    description: "Everything you need to walk into a room and be taken seriously.",
    features: [
      "Everything in The Blueprint",
      "Comparable films report (5 matched titles)",
      "Investor one-pager (PDF)",
      "Investor memo (3-5 page PDF)",
      '"What Investors Actually Ask" guide',
      "6 months unlimited access",
    ],
    accessPeriod: "6 months access",
  },
  {
    id: "greenlight",
    name: "The Greenlight Package",
    tagline: "The Full Package",
    price: 4997,
    originalPrice: null,
    badge: null,
    description: "The closest thing to having a team without having a team.",
    features: [
      "Everything in The Investor Kit",
      "Deep comp analysis (10 titles + trends)",
      "Term sheet outline",
      "Distribution strategy brief",
      "White-label (your brand on everything)",
      "Multiple projects supported",
      "12 months unlimited access",
    ],
    accessPeriod: "12 months access",
  },
];
```

#### UI Requirements

1. **Header**: Use existing `<Header title="SERVICES" />` component
2. **Page title**: "CHOOSE YOUR PACKAGE" in Bebas Neue, centered
3. **Subtitle**: "From quick export to full investor package. Every document cinema-grade." in text-sm text-muted-foreground
4. **Cards**: Stacked vertically on mobile, displayed as cards with these rules:
   - Each card uses the `glass-card` class (existing utility)
   - The `featured` card (Investor Kit) gets `border-gold` class
   - The `featured` card shows the "MOST POPULAR" tagline in gold tracking-widest uppercase
   - The `featured` card shows ~~$2,997~~ crossed out next to $1,997
   - The "Founders Price" badge displays in a small gold pill/tag
   - Price displayed in `font-mono text-2xl text-gold`
   - Original price (if present) in `font-mono text-lg text-muted-foreground line-through`
   - Features listed with gold Check icons (Lucide)
   - Access period shown in `text-xs text-muted-foreground`
5. **Terms checkbox**: Required before purchase button enables (same pattern as current Store.tsx)
6. **Purchase button**:
   - Featured card: `btn-vault` class (gold filled CTA)
   - Other cards: `btn-ghost-gold` class (outlined)
   - When clicked: calls the `create-checkout` Edge Function
   - Shows loading spinner during redirect
7. **Footer disclaimer**: Keep existing educational disclaimer

#### Stripe Integration in Store Page

```typescript
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const handlePurchase = async (productId: string) => {
  if (!agreedTerms[productId]) return;

  setLoading(productId);

  // Get current user email (from Supabase auth or email gate)
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email || capturedEmail;

  if (!email) {
    // Show email capture modal
    setShowEmailModal(true);
    setLoading(null);
    return;
  }

  // Call Edge Function to create Stripe Checkout session
  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body: {
      productId,
      email,
      userId: user?.id || null,
    },
  });

  if (error || !data?.url) {
    toast.error("Something went wrong. Please try again.");
    setLoading(null);
    return;
  }

  // Redirect to Stripe Checkout
  window.location.href = data.url;
};
```

#### Success State

When the URL contains `?success=true&session_id=xxx`:
- Show a success message: "Payment successful! Your export is ready."
- Show a "Download Your Report" button that triggers the Excel generation
- Store the session_id for verification

---

## PHASE 6: BUILD THE EXCEL EXPORT ENGINE

### Create `src/lib/excel-export.ts`

This is the core engine. It reads calculator state from localStorage, runs the waterfall calculation, and generates a styled Excel workbook.

#### Architecture

```typescript
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  calculateWaterfall,
  calculateBreakeven,
  formatCurrency,
  formatPercent,
  formatMultiple,
  type WaterfallInputs,
  type GuildState,
  type WaterfallResult,
  type CapitalSelections,
} from "./waterfall";

// Brand colors for Excel (ARGB format — ExcelJS uses ARGB without #)
const COLORS = {
  black: "FF000000",
  cardBg: "FF070707",
  surfaceBg: "FF111111",
  gold: "FFD4AF37",
  goldCta: "FFF9E076",
  goldSubtle: "FF1A1600",
  white: "FFFFFFFF",
  textMid: "FFCFCFCF",
  textDim: "FF8A8A8A",
  borderSubtle: "FF1A1A1A",
};

// Font definitions
const FONTS = {
  title: { name: "Arial", size: 20, bold: true, color: { argb: COLORS.white } },
  heading: { name: "Arial", size: 14, bold: true, color: { argb: COLORS.gold } },
  subheading: { name: "Arial", size: 11, bold: true, color: { argb: COLORS.white } },
  body: { name: "Arial", size: 10, color: { argb: COLORS.textMid } },
  mono: { name: "Courier New", size: 11, color: { argb: COLORS.white } },
  monoGold: { name: "Courier New", size: 14, bold: true, color: { argb: COLORS.gold } },
  label: { name: "Arial", size: 8, color: { argb: COLORS.textDim } },
  disclaimer: { name: "Arial", size: 7, italic: true, color: { argb: COLORS.textDim } },
};

export async function generateSnapshot(
  inputs: WaterfallInputs,
  guilds: GuildState,
  sourceSelections: CapitalSelections
): Promise<void> {
  const result = calculateWaterfall(inputs, guilds);
  const breakeven = calculateBreakeven(inputs, guilds, sourceSelections);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Filmmaker.OG";
  workbook.created = new Date();

  // Build all 6 sheets
  buildExecutiveSummary(workbook, inputs, guilds, result, breakeven);
  buildBudgetFinancing(workbook, inputs, guilds, sourceSelections);
  buildDealSheet(workbook, inputs, result, breakeven);
  buildWaterfallSheet(workbook, inputs, result);
  buildWhoGetsPaid(workbook, inputs, result);
  buildGlossary(workbook);

  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Filmmaker_OG_Snapshot_${new Date().toISOString().slice(0, 10)}.xlsx`);
}
```

#### Sheet 1: Executive Summary

```typescript
function buildExecutiveSummary(
  workbook: ExcelJS.Workbook,
  inputs: WaterfallInputs,
  guilds: GuildState,
  result: WaterfallResult,
  breakeven: number
): void {
  const ws = workbook.addWorksheet("Executive Summary", {
    properties: { tabColor: { argb: COLORS.gold } },
  });

  // Hide gridlines
  ws.views = [{ showGridLines: false }];

  // Set column widths
  ws.columns = [
    { width: 3 },   // A - margin
    { width: 25 },  // B - labels
    { width: 20 },  // C - values
    { width: 3 },   // D - spacer
    { width: 25 },  // E - labels
    { width: 20 },  // F - values
    { width: 3 },   // G - margin
  ];

  // Fill entire visible area with black background
  for (let row = 1; row <= 40; row++) {
    for (let col = 1; col <= 7; col++) {
      const cell = ws.getCell(row, col);
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.black } };
    }
  }

  // Row 2-3: Title
  ws.mergeCells("B2:F2");
  const titleCell = ws.getCell("B2");
  titleCell.value = "FILMMAKER.OG";
  titleCell.font = { ...FONTS.title, size: 24 };
  titleCell.alignment = { horizontal: "center" };

  ws.mergeCells("B3:F3");
  const subtitleCell = ws.getCell("B3");
  subtitleCell.value = "FINANCIAL SNAPSHOT";
  subtitleCell.font = { ...FONTS.label, size: 10, letterSpacing: 5 };
  subtitleCell.alignment = { horizontal: "center" };

  // Row 5: Gold divider line
  for (let col = 2; col <= 6; col++) {
    ws.getCell(5, col).border = {
      bottom: { style: "thin", color: { argb: COLORS.gold } },
    };
  }

  // Row 7-9: Three Big Numbers
  // Budget
  ws.getCell("B7").value = "PRODUCTION BUDGET";
  ws.getCell("B7").font = FONTS.label;
  ws.getCell("B8").value = inputs.budget;
  ws.getCell("B8").font = FONTS.monoGold;
  ws.getCell("B8").numFmt = '$#,##0';

  // Acquisition Price
  ws.getCell("C7").value = "ACQUISITION PRICE";
  ws.getCell("C7").font = FONTS.label;
  ws.getCell("C8").value = inputs.revenue;
  ws.getCell("C8").font = FONTS.monoGold;
  ws.getCell("C8").numFmt = '$#,##0';

  // Producer Net Profit
  ws.getCell("E7").value = "PRODUCER NET PROFIT";
  ws.getCell("E7").font = FONTS.label;
  ws.getCell("E8").value = result.producer;
  ws.getCell("E8").font = FONTS.monoGold;
  ws.getCell("E8").numFmt = '$#,##0';

  // Row 11: Breakeven status
  const isAboveBreakeven = inputs.revenue >= breakeven;
  ws.mergeCells("B11:F11");
  const statusCell = ws.getCell("B11");
  statusCell.value = isAboveBreakeven
    ? `ABOVE BREAKEVEN — ${((inputs.revenue / breakeven - 1) * 100).toFixed(1)}% cushion`
    : `BELOW BREAKEVEN — shortfall of ${formatCurrency(breakeven - inputs.revenue)}`;
  statusCell.font = { ...FONTS.subheading, color: { argb: COLORS.gold } };
  statusCell.alignment = { horizontal: "center" };

  // Row 13-17: Investor Summary
  ws.getCell("B13").value = "INVESTOR SUMMARY";
  ws.getCell("B13").font = FONTS.heading;

  ws.getCell("B14").value = "Equity Invested";
  ws.getCell("B14").font = FONTS.body;
  ws.getCell("C14").value = inputs.equity;
  ws.getCell("C14").font = FONTS.mono;
  ws.getCell("C14").numFmt = '$#,##0';

  ws.getCell("B15").value = "Total Investor Return";
  ws.getCell("B15").font = FONTS.body;
  ws.getCell("C15").value = result.investor;
  ws.getCell("C15").font = FONTS.mono;
  ws.getCell("C15").numFmt = '$#,##0';

  ws.getCell("B16").value = "Investor Multiple";
  ws.getCell("B16").font = FONTS.body;
  ws.getCell("C16").value = `${result.multiple.toFixed(2)}x`;
  ws.getCell("C16").font = { ...FONTS.mono, color: { argb: COLORS.gold } };

  // Row 19-23: Recoupment
  ws.getCell("B19").value = "RECOUPMENT STATUS";
  ws.getCell("B19").font = FONTS.heading;

  ws.getCell("B20").value = "Total Hurdle";
  ws.getCell("B20").font = FONTS.body;
  ws.getCell("C20").value = result.totalHurdle;
  ws.getCell("C20").font = FONTS.mono;
  ws.getCell("C20").numFmt = '$#,##0';

  ws.getCell("B21").value = "Amount Recouped";
  ws.getCell("B21").font = FONTS.body;
  ws.getCell("C21").value = result.recouped;
  ws.getCell("C21").font = FONTS.mono;
  ws.getCell("C21").numFmt = '$#,##0';

  ws.getCell("B22").value = "Recoupment %";
  ws.getCell("B22").font = FONTS.body;
  ws.getCell("C22").value = `${result.recoupPct.toFixed(1)}%`;
  ws.getCell("C22").font = FONTS.mono;

  ws.getCell("B23").value = "Profit Pool";
  ws.getCell("B23").font = FONTS.body;
  ws.getCell("C23").value = result.profitPool;
  ws.getCell("C23").font = { ...FONTS.mono, color: { argb: COLORS.gold } };
  ws.getCell("C23").numFmt = '$#,##0';

  // Footer
  ws.mergeCells("B38:F38");
  ws.getCell("B38").value = "Generated by Filmmaker.OG — Democratizing the Business of Film";
  ws.getCell("B38").font = FONTS.disclaimer;
  ws.getCell("B38").alignment = { horizontal: "center" };

  // Print setup
  ws.pageSetup = {
    orientation: "portrait",
    fitToPage: true,
    paperSize: 1, // Letter
    margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5, header: 0, footer: 0 },
  };
}
```

#### Sheet 2: Budget & Financing

Build a table showing:
- Production budget (large, prominent)
- Guild commitments: SAG (4.5%), WGA (1.2%), DGA (1.2%) — only rows for active guilds
- Capital Stack table with columns: Source | Amount | % of Budget | Terms
- Include rows only for selected capital sources
- Show funding gap: budget minus total capital raised
- Use gold borders and black backgrounds throughout
- Same print/page setup as Sheet 1

#### Sheet 3: The Deal

Build a layout showing:
- Acquisition price (large)
- Breakeven calculation explained:
  - "Total cost of capital: $X"
  - "Off-the-top deductions at this revenue: $Y"
  - "Breakeven point: $Z"
- Cushion or shortfall amount
- Plain-language merged cell: "This deal generates $X above/below breakeven..."
- Status indicator using gold intensity (bright gold = above, dim gold = below)

#### Sheet 4: Waterfall Distribution

Build the full ledger table:
- Columns: Priority | Line Item | Detail | Amount | Running Total | % of Revenue
- One row per `result.ledger` item
- Add rows for the profit pool split (Producer 50%, Investor 50%)
- Color-band rows by tier:
  - Off-the-top items: darker surface background
  - Debt items: slightly lighter
  - Equity: gold-subtle background
  - Profit: gold accent
- Gold top border on header row
- Running total column uses formula: previous running total + current amount
- % of Revenue column: amount / revenue * 100

#### Sheet 5: Who Gets Paid

Simple two-section layout:
- **INVESTOR RETURNS** section:
  - Equity invested
  - Preferred return earned
  - Equity recoupment total
  - 50% profit share
  - Total investor return
  - Multiple on investment
  - Plain-English: "The equity investor put in $X and receives $Y back — a Z.Zx return."
- **PRODUCER PROFIT** section:
  - 50% of profit pool
  - Plain-English: "The producer receives $X as their share of net profits after all obligations."

#### Sheet 6: Glossary

Two-column table (Term | Definition) with these entries:

```typescript
const GLOSSARY = [
  { term: "Waterfall", definition: "The sequential order in which revenue from a film is distributed to various stakeholders, from first-position lenders down to profit participants." },
  { term: "CAM (Collection Account Management)", definition: "A 1% administrative fee taken off the top of gross revenue to manage the collection and distribution of funds." },
  { term: "Senior Debt", definition: "First-position bank financing that gets repaid before all other capital sources. Lowest risk, lowest interest rate." },
  { term: "Gap/Mezzanine Debt", definition: "Bridge financing that sits behind senior debt in repayment priority. Higher risk than senior debt, carries a higher interest rate." },
  { term: "Equity Investment", definition: "Cash investment in the film in exchange for a share of profits. Last to be repaid but receives profit participation." },
  { term: "Preferred Return (Premium)", definition: "An additional percentage return promised to equity investors on top of their principal, paid before any profit split." },
  { term: "Deferments", definition: "Compensation owed to talent, producers, or crew that is deferred until the film generates sufficient revenue." },
  { term: "Recoupment", definition: "The process of recovering invested capital from film revenue. Full recoupment means all costs have been covered." },
  { term: "Profit Pool", definition: "The remaining revenue after all costs, debts, and obligations have been paid. Typically split 50/50 between producer and investors." },
  { term: "Multiple", definition: "The total return divided by the original investment. A 1.5x multiple means the investor received 1.5 times their original investment." },
  { term: "Guild Reserves", definition: "Pension & Health (P&H) contributions required by union agreements — SAG-AFTRA (4.5%), WGA (1.2%), DGA (1.2%) — taken off the top of revenue." },
  { term: "Breakeven", definition: "The minimum revenue required to fully repay all capital sources and obligations. Revenue above breakeven flows to the profit pool." },
  { term: "Off-the-Top", definition: "Costs deducted from gross revenue before any capital is repaid — includes CAM, sales fees, guild reserves, and marketing." },
  { term: "Sales Agent Fee", definition: "Commission paid to the sales agent or distributor for selling the film, calculated as a percentage of gross revenue." },
  { term: "Acquisition Price", definition: "The total amount a distributor or buyer pays to acquire distribution rights to the finished film." },
];
```

---

## PHASE 7: CONNECT EXPORT TO PURCHASE FLOW

### Create `src/hooks/usePurchaseAccess.ts`

```typescript
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PurchaseAccess {
  hasAccess: boolean;
  productId: string | null;
  expiresAt: Date | null;
  loading: boolean;
}

export function usePurchaseAccess(): PurchaseAccess {
  const [access, setAccess] = useState<PurchaseAccess>({
    hasAccess: false,
    productId: null,
    expiresAt: null,
    loading: true,
  });

  useEffect(() => {
    async function checkAccess() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAccess(prev => ({ ...prev, loading: false }));
        return;
      }

      const { data: purchases } = await supabase
        .from("purchases")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .gte("access_expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (purchases && purchases.length > 0) {
        setAccess({
          hasAccess: true,
          productId: purchases[0].product_id,
          expiresAt: new Date(purchases[0].access_expires_at),
          loading: false,
        });
      } else {
        setAccess(prev => ({ ...prev, loading: false }));
      }
    }

    checkAccess();
  }, []);

  return access;
}
```

### Add Export Button to Calculator

In `src/components/calculator/tabs/WaterfallTab.tsx`, add an export button that:

1. Checks if user has active purchase via `usePurchaseAccess()`
2. If yes → triggers `generateSnapshot()` from `excel-export.ts`
3. If no → navigates to `/store` with a toast: "Purchase a package to export your results"

```typescript
// Add to WaterfallTab
import { usePurchaseAccess } from "@/hooks/usePurchaseAccess";
import { generateSnapshot } from "@/lib/excel-export";
import { Download } from "lucide-react";

// Inside the component:
const { hasAccess } = usePurchaseAccess();

// In the JSX, after the waterfall visual:
<Button
  onClick={() => {
    if (hasAccess) {
      generateSnapshot(inputs, guilds, sourceSelections);
    } else {
      navigate("/store");
      toast("Purchase a package to export your professional report.");
    }
  }}
  className="w-full btn-vault mt-6 py-4"
>
  <Download className="w-5 h-5 mr-2" />
  {hasAccess ? "EXPORT YOUR REPORT" : "GET YOUR PROFESSIONAL REPORT"}
</Button>
```

---

## PHASE 8: SUCCESS PAGE FLOW

When user returns from Stripe with `?success=true`:

1. Parse `session_id` from URL
2. Show success state in the Store page:
   - Gold checkmark animation
   - "Payment Successful" heading
   - "Your [Product Name] is ready"
   - "Go to Calculator" button → navigates to `/calculator?tab=waterfall`
   - The export button on the waterfall tab will now be active

---

## PHASE 9: TESTING CHECKLIST

Before going live, verify:

- [ ] Stripe test mode works end-to-end (use `pk_test_` and `sk_test_` keys)
- [ ] All 4 products create checkout sessions correctly
- [ ] Webhook correctly writes to `purchases` table
- [ ] Success redirect shows correct state
- [ ] Cancel redirect returns to store cleanly
- [ ] Excel export generates with all 6 sheets
- [ ] Excel opens correctly in Excel, Google Sheets, and Apple Numbers
- [ ] All numbers match the calculator output exactly
- [ ] Styling renders correctly (black backgrounds, gold text)
- [ ] Print preview produces clean output
- [ ] Access expiry works (expired purchase = no export access)
- [ ] Non-authenticated users are prompted for email before checkout
- [ ] Mobile: store page is fully responsive
- [ ] Mobile: export download works on iOS Safari and Android Chrome

---

## FILE SUMMARY — WHAT TO CREATE

| File | Action | Purpose |
|---|---|---|
| `src/pages/Store.tsx` | REWRITE | New pricing grid with Stripe checkout |
| `src/lib/excel-export.ts` | CREATE | Excel generation engine (ExcelJS) |
| `src/hooks/usePurchaseAccess.ts` | CREATE | Check if user has active purchase |
| `supabase/functions/create-checkout/index.ts` | CREATE | Stripe Checkout session creation |
| `supabase/functions/stripe-webhook/index.ts` | CREATE | Handle Stripe payment confirmation |
| `src/components/calculator/tabs/WaterfallTab.tsx` | MODIFY | Add export button |

### SQL to Run in Supabase
- `purchases` table creation
- `exports` table creation
- RLS policies for both tables

### Packages to Install
- `exceljs`
- `file-saver`
- `@types/file-saver`
- `@stripe/stripe-js`

---

## DESIGN RULES — DO NOT VIOLATE

1. **TWO-GOLD SYSTEM**: Metallic Gold (#D4AF37) for non-interactive elements. CTA Gold (#F9E076) ONLY for buttons and clickable elements.
2. **NO GREEN. NO RED.** Use gold intensity variations for status.
3. **NO BORDER RADIUS on cards.** Sharp edges only.
4. **BLACK BACKGROUNDS.** Layered system: #000000, #070707, #111111, #0D0D0D.
5. **BEBAS NEUE** for headlines. **INTER** for body. **ROBOTO MONO** for numbers.
6. **VISUAL RESTRAINT.** One focal point per section. Less is more.
7. **MOBILE FIRST.** All layouts must work on 375px width minimum.
8. **TOUCH TARGETS.** Minimum 44px height for all interactive elements.

---

## IMPORTANT NOTES

- **DO NOT modify `src/lib/waterfall.ts`** — this is the source of truth for all calculations. Read from it, never write to it.
- **DO NOT add new routes** — the Store page already exists at `/store`. Rewrite it in place.
- **DO NOT change the calculator UI** — only add the export button to WaterfallTab.
- **Use existing UI components** from `src/components/ui/` (shadcn/ui) wherever possible.
- **Follow the existing pattern** for Supabase integration — see `src/integrations/supabase/` for client setup.
- **Test with Stripe test keys first.** Never commit live keys to the repository.

---

*Built for Filmmaker.OG — Democratizing the Business of Film*
