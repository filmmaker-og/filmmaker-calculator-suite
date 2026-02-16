import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Product configuration
const PRODUCTS: Record<string, { name: string; price: number }> = {
  "the-blueprint": {
    name: "The Blueprint",
    price: 19700, // $197 in cents
  },
  "the-pitch-package": {
    name: "The Pitch Package",
    price: 49700, // $497 in cents
  },
  "the-working-model": {
    name: "The Working Model",
    price: 9900, // $99 in cents
  },
  "the-working-model-discount": {
    name: "The Working Model (Bundle Discount)",
    price: 4900, // $49 in cents
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
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
    let userEmail = email || null;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
        userEmail = data.user.email || email || null;
      }
    }

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
      // Use the first item (base product) as the primary product in metadata
      const baseProduct = PRODUCTS[items[0]];
      metaProductId = items.join(",");
      metaProductName = items.map((id: string) => PRODUCTS[id]?.name || id).join(" + ");
    } else if (productId && PRODUCTS[productId]) {
      // Single product checkout (backward compatible)
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
    // If no email is known, Stripe Checkout will collect it from the customer.
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : (userEmail || undefined),
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
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
