import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getProduct, mainProducts } from "@/lib/store-products";

const StorePackage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const product = getProduct(slug || "");
  const addonId = searchParams.get("addon"); // e.g. "the-working-model" or "the-working-model-discount"

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);
    };
    checkUser();
  }, [slug]);

  // If it's the add-on product page, redirect to store (can't buy alone)
  if (product?.isAddOn) {
    navigate("/store");
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-void flex flex-col">
        <Header title="NOT FOUND" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-mid mb-4">Package not found.</p>
            <button
              onClick={() => navigate("/store")}
              className="text-text-dim text-sm hover:text-text-mid transition-colors"
            >
              Back to Packages
            </button>
          </div>
        </main>
      </div>
    );
  }

  const getEmail = () => userEmail || guestEmail;
  const isEmailValid = () => {
    const email = getEmail();
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePurchase = async () => {
    if (!agreedTerms || !isEmailValid()) return;
    setLoading(true);
    try {
      // Save email for confirmation page
      try {
        localStorage.setItem("filmmaker_og_purchase_email", getEmail()!);
      } catch { /* ignore */ }

      // Build the checkout request
      let body: Record<string, unknown>;
      if (addonId) {
        // Multi-item: base product + addon
        body = { items: [product.id, addonId], email: getEmail() };
      } else {
        // Single product
        body = { productId: product.id, email: getEmail() };
      }

      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        { body }
      );
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFeatured = product.featured;

  // Prev / next navigation (only among main products)
  const navProducts = mainProducts;
  const currentIdx = navProducts.findIndex((p) => p.slug === product.slug);
  const prev = currentIdx > 0 ? navProducts[currentIdx - 1] : null;
  const next =
    currentIdx < navProducts.length - 1 ? navProducts[currentIdx + 1] : null;

  // Format description paragraphs
  const descParagraphs = product.fullDescription.split("\n\n");

  // Calculate total price with addon
  const addonPrice = addonId === "the-working-model-discount" ? 49 : addonId === "the-working-model" ? 99 : 0;
  const totalPrice = product.price + addonPrice;

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <Header title="PACKAGES" />

      <main className="flex-1 animate-fade-in">
        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-sm text-text-dim hover:text-text-mid transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Packages
          </button>
        </div>

        {/* HERO */}
        <section className="px-6 pt-8 pb-6 max-w-2xl mx-auto">
          {/* Badge */}
          {product.badge && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1.5 rounded-full bg-gold/[0.15] border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-bold">
                {product.badge}
              </span>
            </div>
          )}

          {/* Name */}
          <h1 className="font-bebas text-3xl md:text-4xl text-white leading-tight mb-3">
            {product.name.toUpperCase()}
          </h1>

          {/* Price */}
          <div className="mb-6">
            {product.originalPrice && (
              <span className="font-mono text-lg text-text-dim line-through mr-2">
                ${product.originalPrice}
              </span>
            )}
            <span className="font-mono text-4xl font-medium text-white">
              ${product.price}
            </span>
            {addonId && (
              <span className="ml-3 text-gold text-sm font-mono">
                + ${addonPrice} Working Model
              </span>
            )}
          </div>

          {/* Full description */}
          <div className="space-y-4 mb-6">
            {descParagraphs.map((p, i) => (
              <p key={i} className="text-text-mid text-sm leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="px-6 pb-8 max-w-2xl mx-auto">
          <h2 className="font-bebas text-2xl tracking-[0.08em] text-gold mb-5">
            WHAT'S INCLUDED
          </h2>
          <div className="space-y-4">
            {product.whatsIncluded.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5"
              >
                <div className="flex items-start gap-3 mb-2">
                  <Check className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <h3 className="font-bebas text-lg tracking-[0.06em] text-white">
                    {item.title.toUpperCase()}
                  </h3>
                </div>
                <p className="text-text-mid text-sm leading-relaxed pl-7">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WHO THIS IS FOR */}
        <section className="px-6 pb-8 max-w-2xl mx-auto">
          <h2 className="font-bebas text-2xl tracking-[0.08em] text-gold mb-4">
            WHO THIS IS FOR
          </h2>
          <p className="text-text-mid text-sm leading-relaxed">
            {product.whoItsFor}
          </p>
        </section>

        {/* WHAT YOU'LL BUILD */}
        <section className="px-6 pb-8 max-w-2xl mx-auto">
          <h2 className="font-bebas text-2xl tracking-[0.08em] text-gold mb-4">
            WHAT YOU'LL BUILD
          </h2>
          <p className="text-text-mid text-sm leading-relaxed">
            {product.whatYoullBuild}
          </p>
        </section>

        {/* PURCHASE SECTION */}
        <section className="px-6 pb-8 max-w-2xl mx-auto">
          <div
            className={cn(
              "rounded-xl p-6 space-y-4",
              isFeatured
                ? "bg-gold/[0.04] border-2 border-gold"
                : "bg-[#141414] border border-[#2A2A2A]"
            )}
          >
            <h3 className="font-bebas text-xl tracking-[0.08em] text-white">
              GET {product.name.toUpperCase()}
            </h3>

            {/* Email (guests only) */}
            {!userEmail && (
              <div>
                <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
                  Your Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="bg-bg-elevated border-border-subtle text-text-primary h-12"
                />
                <p className="text-text-dim text-[10px] mt-2">
                  Required for purchase confirmation and file delivery.
                </p>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-3 min-h-[44px] py-2">
              <Checkbox
                id="terms"
                checked={agreedTerms}
                onCheckedChange={(checked) => setAgreedTerms(!!checked)}
                className="mt-0.5 border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold w-5 h-5"
              />
              <label
                htmlFor="terms"
                className="text-text-dim text-[11px] cursor-pointer leading-relaxed"
              >
                I agree to the terms of service and understand this is a digital
                product
              </label>
            </div>

            {/* CTA */}
            <button
              onClick={handlePurchase}
              disabled={!agreedTerms || !isEmailValid() || loading}
              className={cn(
                "w-full h-14 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96] disabled:opacity-30 disabled:cursor-not-allowed",
                isFeatured
                  ? "bg-gold/[0.22] border-2 border-gold/60 text-gold text-base animate-cta-glow-soft hover:border-gold/80 hover:bg-gold/[0.28]"
                  : "bg-gold/[0.12] border-2 border-gold/40 text-gold text-sm hover:border-gold/60 hover:bg-gold/[0.18]"
              )}
            >
              {loading
                ? "PROCESSING..."
                : !isEmailValid()
                  ? "ENTER EMAIL ABOVE"
                  : !agreedTerms
                    ? "AGREE TO TERMS"
                    : addonId
                      ? `Get ${product.name} + Working Model — $${totalPrice}`
                      : isFeatured
                        ? `Get The Pitch Package — $${product.price}`
                        : `Get The Blueprint — $${product.price}`}
            </button>
          </div>
        </section>

        {/* UPGRADE / CUSTOM PROMPT */}
        {product.upgradePrompt ? (
          <section className="px-6 pb-8 max-w-2xl mx-auto">
            <div className="rounded-xl border border-gold/20 bg-gold/[0.04] p-5">
              <h3 className="font-bebas text-lg tracking-[0.08em] text-gold mb-2">
                {product.upgradePrompt.title}
              </h3>
              <p className="text-text-mid text-sm leading-relaxed mb-4">
                {product.upgradePrompt.body}
              </p>
              <button
                onClick={() => navigate(product.upgradePrompt!.link)}
                className="text-gold text-sm font-semibold hover:text-gold/80 transition-colors"
              >
                {product.upgradePrompt.cta}
              </button>
            </div>
          </section>
        ) : (
          <section className="px-6 pb-8 max-w-2xl mx-auto">
            <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5">
              <h3 className="font-bebas text-lg tracking-[0.08em] text-gold mb-2">
                NEED SOMETHING CUSTOM?
              </h3>
              <p className="text-text-mid text-sm leading-relaxed mb-4">
                If your project requires bespoke financial modeling, custom comp
                research, or institutional-grade investor materials beyond what
                these packages cover — get in touch.
              </p>
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="inline-flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Us →
              </a>
            </div>
          </section>
        )}

        {/* COMPARE LINK */}
        <section className="px-6 pb-6 max-w-2xl mx-auto text-center">
          <button
            onClick={() => navigate("/store/compare")}
            className="text-text-dim text-[11px] tracking-[0.15em] uppercase hover:text-text-mid transition-colors"
          >
            Compare all packages →
          </button>
        </section>

        {/* PREV / NEXT NAV */}
        <section className="border-t border-[#2A2A2A] px-6 py-6">
          <div className="max-w-2xl mx-auto flex justify-between">
            {prev ? (
              <button
                onClick={() => navigate(`/store/${prev.slug}`)}
                className="flex items-center gap-2 text-text-dim hover:text-text-mid transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{prev.name}</span>
                <span className="sm:hidden">Prev</span>
              </button>
            ) : (
              <div />
            )}
            {next ? (
              <button
                onClick={() => navigate(`/store/${next.slug}`)}
                className="flex items-center gap-2 text-text-dim hover:text-text-mid transition-colors text-sm"
              >
                <span className="hidden sm:inline">{next.name}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StorePackage;
