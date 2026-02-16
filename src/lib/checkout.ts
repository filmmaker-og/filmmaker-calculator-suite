import { supabase } from "@/integrations/supabase/client";

/**
 * Invoke create-checkout edge function and return the Stripe URL.
 * Email is NOT required — Stripe Checkout will collect it if not provided.
 */
export async function startCheckout(
  productId: string,
  addonId?: string
): Promise<string> {
  const body: Record<string, unknown> = addonId
    ? { items: [productId, addonId] }
    : { productId };

  const { data, error } = await supabase.functions.invoke("create-checkout", {
    body,
  });

  if (error) throw error;
  if (!data?.url) throw new Error("No checkout URL returned");
  return data.url;
}
