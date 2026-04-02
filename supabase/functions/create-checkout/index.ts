import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const ALLOWED_ORIGINS = ["https://filmmakerog.com", "https://www.filmmakerog.com"];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };
  }
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
}

// Rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = rateLimitMap.get(ip) || [];
  const recent = window.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) return false;
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, ts] of rateLimitMap.entries()) {
    const recent = ts.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recent.length === 0) rateLimitMap.delete(k);
    else rateLimitMap.set(k, recent);
  }
}, 5 * 60 * 1000);

// Product configuration
const PRODUCTS: Record<string, { name: string; price: number }> = {
  // Current products
  "snapshot-plus": {
    name: "Snapshot+",
    price: 1900, // $19
  },
  "comp-report": {
    name: "Comp Report (5 Comps)",
    price: 59500, // $595
  },
  "comp-report-10": {
    name: "Comp Report (10 Comps)",
    price: 99500, // $995
  },
  "the-producers-package": {
    name: "The Producer's Package",
    price: 179700, // $1,797
  },
  "the-working-model": {
    name: "The Working Model",
    price: 7900, // $79
  },
  // Legacy IDs (backward compat)
  "the-blueprint": {
    name: "The Full Analysis (Legacy)",
    price: 19700,
  },
  "the-pitch-package": {
    name: "The Producer's Package (Legacy)",
    price: 179700,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: getCorsHeaders(req) });
  }

  const clientIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "unknown";
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded" }),
      { status: 429, headers: { ...getCorsHeaders(req), "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await req.json();
    const { productId, items, email } = body;

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Try to get authenticated user
    let userId: string | null = null;
    let userEmail: string | undefined = email;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
        userEmail = data.user.email || email;
      }
    }

    // Email is now optional — Stripe collects it at checkout
    // If we have it, we'll pre-fill. If not, Stripe handles it.

    // Check if customer exists (only if we have an email)
    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Build line items — support both single productId and items array
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
    let metaProductId: string;
    let metaProductName: string;

    if (items && Array.isArray(items) && items.length > 0) {
      // Multi-item checkout (e.g., base product + Working Model bundle)
      lineItems = items.map((itemId: string) => {
        const product = PRODUCTS[itemId];
        if (!product) throw new Error(`Invalid product ID: ${itemId}`);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `FILMMAKER.OG — ${product.name}`,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        };
      });
      metaProductId = items.join(",");
      metaProductName = items.map((id: string) => PRODUCTS[id]?.name || id).join(" + ");
    } else if (productId && PRODUCTS[productId]) {
      // Single product checkout
      const product = PRODUCTS[productId];
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `FILMMAKER.OG — ${product.name}`,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ];
      metaProductId = productId;
      metaProductName = product.name;
    } else {
      throw new Error("Invalid product ID or items array");
    }

    // Create checkout session
    // - If we have a customer ID, use it (pre-fills email)
    // - If we have email but no customer, pre-fill via customer_email
    // - If neither, Stripe will collect email at checkout
    const session = await stripe.checkout.sessions.create({
      ...(customerId
        ? { customer: customerId }
        : userEmail
          ? { customer_email: userEmail }
          : {}),
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/build-your-plan?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/store?canceled=true`,
      metadata: {
        productId: metaProductId,
        productName: metaProductName,
        userId: userId || "",
        userEmail: userEmail || "",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: "Checkout failed. Please try again." }), {
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      status: 500,
    });
  }
});
