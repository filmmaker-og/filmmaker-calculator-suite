

# Stripe Store & Excel Export Implementation Plan

## Overview

This plan implements a complete payment and export system for Filmmaker.OG, including:
- Stripe Checkout integration with 4 tiered products
- Professional Excel report generation (6 sheets)
- Purchase-gated export functionality
- Updated Store page with new product structure

---

## Phase 1: Enable Stripe & Configure Secrets

### Step 1.1: Enable Stripe Integration
First, I'll enable the Stripe integration which will prompt you to enter your Stripe secret key. You'll need:
- **Stripe Secret Key** (starts with `sk_live_` or `sk_test_`)
- **Stripe Publishable Key** (starts with `pk_live_` or `pk_test_`)

After you provide these, I'll also need to set up a webhook secret for payment confirmations.

### Step 1.2: Install Dependencies
Add required packages:
- `exceljs` - Browser-side Excel generation with styling
- `file-saver` - Triggers browser file downloads
- `@stripe/stripe-js` - Stripe.js for checkout redirects
- `@types/file-saver` - TypeScript types

---

## Phase 2: Database Setup

### Step 2.1: Create `purchases` Table
```text
Table: purchases
- id (UUID, primary key)
- user_id (UUID, references auth.users, nullable for guest purchases)
- email (text, required)
- stripe_session_id (text, unique)
- stripe_payment_intent (text)
- product_id (text)
- product_name (text)
- amount_paid (integer, cents)
- currency (text, default 'usd')
- status (text, default 'pending')
- access_expires_at (timestamptz)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Step 2.2: Create `exports` Table
```text
Table: exports
- id (UUID, primary key)
- purchase_id (UUID, references purchases)
- user_id (UUID, references auth.users)
- export_type (text)
- calculator_inputs (JSONB)
- created_at (timestamptz)
```

### Step 2.3: RLS Policies
- Users can view their own purchases
- Users can create/view their own exports
- Service role can manage all purchases (for webhooks)

---

## Phase 3: Backend Functions

### Step 3.1: Create `create-checkout` Edge Function
Handles Stripe Checkout session creation:
- Accepts: `productId`, `email`, `userId`
- Creates Stripe Checkout session with product details
- Returns checkout URL for redirect
- Includes proper CORS headers

**Products Configuration:**
| Product | Price | Access Period |
|---------|-------|---------------|
| The Snapshot | $197 | 30 days |
| The Blueprint | $997 | 60 days |
| The Investor Kit | $1,997 | 6 months |
| The Greenlight Package | $4,997 | 12 months |

### Step 3.2: Create `stripe-webhook` Edge Function
Handles Stripe webhook events:
- Validates webhook signature
- On `checkout.session.completed`:
  - Creates purchase record in database
  - Sets access expiration date
  - Updates status to "completed"

---

## Phase 4: Rewrite Store Page

### Step 4.1: New Product Data Structure
Replace current packages with 4 new products:
- **The Snapshot** ($197) - Quick export with 6-sheet Excel
- **The Blueprint** ($997) - 3 scenario comparison + 60 days
- **The Investor Kit** ($1,997, featured) - Most popular, includes comps + investor docs
- **The Greenlight Package** ($4,997) - Full package with white-label

### Step 4.2: UI Components
- Header: Use existing `Header` component
- Title: "CHOOSE YOUR PACKAGE" in Bebas Neue
- Cards: Stacked vertically, using `glass-card` styling
- Featured card (Investor Kit): Gold border + "MOST POPULAR" badge
- Founders pricing: Show strikethrough original price
- Terms checkbox: Required before purchase
- CTA buttons: `btn-vault` for featured, ghost style for others

### Step 4.3: Stripe Integration
- Load Stripe.js on component mount
- `handlePurchase` function:
  1. Check terms agreement
  2. Get user email (from auth or prompt)
  3. Call `create-checkout` edge function
  4. Redirect to Stripe Checkout

### Step 4.4: Success State
When returning from Stripe with `?success=true`:
- Display success message with gold checkmark
- Show "Download Your Report" button
- Link to calculator with export enabled

---

## Phase 5: Excel Export Engine

### Step 5.1: Create `src/lib/excel-export.ts`
Core export functionality using ExcelJS:

**Sheet 1: Executive Summary**
- Title: "FILMMAKER.OG FINANCIAL SNAPSHOT"
- Three big numbers: Budget, Acquisition Price, Producer Net Profit
- Breakeven status with cushion/shortfall
- Investor summary with multiple
- Recoupment status

**Sheet 2: Budget & Financing**
- Production budget
- Guild commitments (only active guilds)
- Capital stack table with sources, amounts, terms
- Funding gap calculation

**Sheet 3: The Deal**
- Acquisition price
- Breakeven calculation breakdown
- Cushion/shortfall analysis
- Plain-language deal summary

**Sheet 4: Waterfall Distribution**
- Full ledger table with all tiers
- Columns: Priority, Line Item, Detail, Amount, Running Total, % of Revenue
- Color-banded rows by tier type
- Producer/Investor profit split

**Sheet 5: Who Gets Paid**
- Investor returns breakdown
- Multiple calculation
- Producer profit share
- Plain-English summaries

**Sheet 6: Glossary**
- 15 key terms with definitions
- Terms: Waterfall, CAM, Senior Debt, Gap/Mezz, Equity, Premium, Deferments, Recoupment, Profit Pool, Multiple, Guild Reserves, Breakeven, Off-the-Top, Sales Agent Fee, Acquisition Price

### Step 5.2: Excel Styling
Following brand guidelines:
- Black backgrounds (ARGB format)
- Gold (#D4AF37) for headers and accents
- White text for primary content
- Roboto Mono for numbers
- No green/red colors
- Print-ready formatting

---

## Phase 6: Purchase Access Hook

### Step 6.1: Create `src/hooks/usePurchaseAccess.ts`
Hook to check if user has active purchase:
- Query purchases table for current user
- Check if access hasn't expired
- Return: `hasAccess`, `productId`, `expiresAt`, `loading`

---

## Phase 7: Export Button Integration

### Step 7.1: Modify WaterfallTab
Add export button at bottom of waterfall results:
- Check purchase access with hook
- If access: Show "EXPORT YOUR REPORT" button
- If no access: Show "GET YOUR PROFESSIONAL REPORT" button that links to Store
- Use Download icon from Lucide

---

## Phase 8: Define Missing CSS Classes

### Step 8.1: Add Button Classes to index.css
The Store page uses `btn-vault` and `btn-ghost-gold` classes that need definitions:

**btn-vault** (filled gold CTA):
- Background: gold-cta
- Text: black
- Shadow and glow effects

**btn-ghost-gold** (outlined):
- Transparent background
- Gold border
- Gold text
- Hover: subtle gold fill

**glass-card** (standard matte card):
- Dark background (#1A1A1A)
- Subtle border
- No radius (sharp edges per brand guidelines)

---

## File Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/pages/Store.tsx` | REWRITE | New 4-product pricing grid with Stripe |
| `src/lib/excel-export.ts` | CREATE | 6-sheet Excel generation engine |
| `src/hooks/usePurchaseAccess.ts` | CREATE | Check active purchase status |
| `supabase/functions/create-checkout/index.ts` | CREATE | Stripe session creation |
| `supabase/functions/stripe-webhook/index.ts` | CREATE | Payment confirmation handler |
| `src/components/calculator/tabs/WaterfallTab.tsx` | MODIFY | Add export button |
| `src/index.css` | MODIFY | Add btn-vault, btn-ghost-gold, glass-card classes |

---

## Technical Considerations

### Data Flow
1. User selects package on Store page
2. Clicks purchase (after agreeing to terms)
3. Edge function creates Stripe session
4. User completes payment on Stripe
5. Webhook writes purchase to database
6. User returns to Store with success message
7. Export button becomes active in Calculator
8. Export reads from localStorage, generates Excel

### Security
- RLS policies protect purchase data
- Webhook validates Stripe signature
- Access expiration enforced server-side
- No sensitive data stored client-side

### Brand Compliance
- Two-gold system maintained
- No green/red colors
- Bebas Neue for headlines
- Roboto Mono for numbers
- Sharp edges on cards
- 48px touch targets on mobile

---

## Next Steps After Approval

1. Enable Stripe integration (you'll enter your API key)
2. Create database tables with migrations
3. Build edge functions
4. Rewrite Store page
5. Create Excel export engine
6. Add purchase access hook
7. Integrate export button
8. Test end-to-end flow

