import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", (err as Error).message);
      return new Response(`Webhook signature verification failed: ${(err as Error).message}`, { status: 400 });
    }

    console.log("Received event:", event.type);

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const metadata = session.metadata || {};

      // Create Supabase admin client
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      // Pull email from Stripe's customer_details (collected on checkout page),
      // then fall back to customer_email or metadata.
      const purchaseEmail =
        session.customer_details?.email ||
        session.customer_email ||
        metadata.userEmail ||
        "";

      // Insert purchase record
      const { error: insertError } = await supabaseAdmin.from("purchases").insert({
        user_id: metadata.userId || null,
        email: purchaseEmail,
        stripe_session_id: session.id,
        stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : null,
        product_id: metadata.productId || "",
        product_name: metadata.productName || "",
        amount_paid: session.amount_total || 0,
        currency: session.currency || "usd",
        status: "completed",
      });

      if (insertError) {
        console.error("Failed to insert purchase:", insertError);
        return new Response(`Database error: ${insertError.message}`, { status: 500 });
      }

      console.log("Purchase recorded successfully for session:", session.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(`Webhook error: ${(error as Error).message}`, { status: 500 });
  }
});
