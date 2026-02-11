import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Product configuration
const PRODUCTS = {
  snapshot: {
    name: "The Snapshot",
    price: 19700, // $197 in cents
    accessDays: 30,
  },
  blueprint: {
    name: "The Blueprint",
    price: 99700, // $997 in cents
    accessDays: 60,
  },
  "investor-kit": {
    name: "The Investor Kit",
    price: 199700, // $1,997 in cents
    accessDays: 180,
  },
  greenlight: {
    name: "The Greenlight Package",
    price: 499700, // $4,997 in cents
    accessDays: 365,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, email } = await req.json();

    if (!productId || !PRODUCTS[productId as keyof typeof PRODUCTS]) {
      throw new Error("Invalid product ID");
    }

    const product = PRODUCTS[productId as keyof typeof PRODUCTS];

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
    let userEmail = email;
    
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
        userEmail = data.user.email || email;
      }
    }

    if (!userEmail) {
      throw new Error("Email is required");
    }

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: `${product.accessDays} days of access to professional film finance tools`,
            },
            unit_amount: product.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/store?canceled=true`,
      metadata: {
        productId,
        productName: product.name,
        accessDays: product.accessDays.toString(),
        userId: userId || "",
        userEmail,
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
