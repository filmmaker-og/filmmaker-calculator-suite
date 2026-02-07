import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getProduct, products } from "@/lib/store-products";

const StorePackage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProduct(slug || "");

  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);
    };
    checkUser();
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="NOT FOUND" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-text-mid mb-4">Package not found.</p>
            <button onClick={() => navigate("/store")} className="text-gold text-sm hover:underline">
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
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { productId: product.id, email: getEmail() },
      });
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "PROCESSING...";
    if (!isEmailValid()) return "ENTER EMAIL ABOVE";
    if (!agreedTerms) return "AGREE TO TERMS";
    return "GET STARTED";
  };

  const Icon = product.icon;
  const isFeatured = !!product.featured;

  // Find next/prev for navigation
  const currentIdx = products.findIndex((p) => p.slug === product.slug);
  const prev = currentIdx > 0 ? products[currentIdx - 1] : null;
  const next = currentIdx < products.length - 1 ? products[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="PACKAGES" />

      <main className="flex-1 animate-fade-in">
        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-2xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-sm text-text-dim hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Packages
          </button>
        </div>

        {/* HERO */}
        <section className="px-6 pt-8 pb-6 max-w-2xl mx-auto">
          {isFeatured && (
            <div className="flex items-center gap-1.5 mb-4">
              <Star className="w-3 h-3 text-gold fill-gold" />
              <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold">
                Most Popular
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 mb-4">
            <div
              className={cn(
                "w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0",
                isFeatured
                  ? "bg-gold/15 border border-gold/30"
                  : "bg-white/5 border border-white/10"
              )}
            >
              <Icon className={cn("w-5 h-5", isFeatured ? "text-gold" : "text-text-dim")} />
            </div>
            <div>
              <h1 className="font-bebas text-3xl md:text-4xl text-foreground leading-tight">
                {product.name.toUpperCase()}
              </h1>
              <p className="text-text-dim text-[10px] tracking-[0.2em] uppercase">
                {product.tagline}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="mb-2">
            {product.originalPrice && (
              <span className="text-text-dim text-sm line-through mr-2">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className={cn("font-mono text-4xl font-bold", isFeatured ? "text-gold-cta" : "text-gold")}>
              ${product.price.toLocaleString()}
            </span>
          </div>

          {product.originalPrice && (
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3 h-3 text-gold" />
              <span className="text-gold text-[10px] tracking-[0.15em] uppercase font-semibold">
                Founders Price
              </span>
            </div>
          )}

          <p className="text-text-dim text-[11px] mb-6">
            {product.accessLabel} unlimited access &middot; One-time purchase
          </p>

          <p className="text-text-mid text-sm leading-relaxed mb-1">
            {product.description}
          </p>
          <p className={cn("text-xs italic mb-6", isFeatured ? "text-gold/70" : "text-text-dim")}>
            {product.hook}
          </p>

          <div className="h-px w-full bg-gradient-to-r from-gold via-gold-muted/40 to-transparent" />
        </section>

        {/* DETAIL SECTIONS */}
        <section className="px-6 pb-8 max-w-2xl mx-auto space-y-6">
          {product.detailSections.map((section, i) => (
            <div key={i} className="bg-bg-card border border-border-subtle rounded-[--radius-lg] p-5">
              <h3 className="font-bebas text-lg tracking-[0.08em] text-foreground mb-3">
                {section.title.toUpperCase()}
              </h3>
              <p className="text-text-mid text-sm leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </section>

        {/* FEATURES LIST */}
        <section className="px-6 pb-8 max-w-2xl mx-auto">
          <div className="bg-bg-card border border-border-subtle rounded-[--radius-lg] p-5">
            <h3 className="font-bebas text-lg tracking-[0.08em] text-foreground mb-4">
              WHAT'S INCLUDED
            </h3>
            <ul className="space-y-3">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className={cn("w-4 h-4 mt-0.5 flex-shrink-0", isFeatured ? "text-gold" : "text-text-dim")} />
                  <span className="text-foreground text-[13px] leading-snug">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* BUYER MATH */}
        <section className="px-6 pb-8 max-w-2xl mx-auto">
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-md px-4 py-3">
            <p className="text-text-dim text-[11px] leading-relaxed italic">
              "{product.buyerMath}"
            </p>
          </div>
        </section>

        {/* PURCHASE SECTION */}
        <section className="px-6 pb-10 max-w-2xl mx-auto">
          <div className={cn(
            "rounded-[--radius-lg] p-6 space-y-4",
            isFeatured
              ? "bg-gold/[0.04] border border-gold/20"
              : "bg-bg-card border border-border-subtle"
          )}>
            <h3 className="font-bebas text-lg tracking-[0.08em] text-foreground">
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
                  className="bg-bg-elevated border-border-subtle text-foreground h-12"
                />
                <p className="text-text-dim text-[10px] mt-2">
                  Required for purchase confirmation and document access.
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
              <label htmlFor="terms" className="text-text-dim text-[11px] cursor-pointer leading-relaxed">
                I agree to the terms of service and understand this is a digital product
              </label>
            </div>

            {/* CTA */}
            <Button
              onClick={handlePurchase}
              disabled={!agreedTerms || !isEmailValid() || loading}
              className={cn(
                "w-full py-4 min-h-[52px] touch-feedback",
                isFeatured ? "btn-vault" : "btn-ghost-gold disabled:opacity-30"
              )}
            >
              {getButtonText()}
            </Button>
          </div>
        </section>

        {/* COMPARE LINK */}
        <section className="px-6 pb-6 max-w-2xl mx-auto text-center">
          <button
            onClick={() => navigate("/store/compare")}
            className="text-text-dim text-[11px] tracking-[0.15em] uppercase hover:text-gold transition-colors"
          >
            Compare All Packages →
          </button>
        </section>

        {/* PREV / NEXT NAV */}
        <section className="border-t border-border-subtle px-6 py-6">
          <div className="max-w-2xl mx-auto flex justify-between">
            {prev ? (
              <button
                onClick={() => navigate(`/store/${prev.slug}`)}
                className="flex items-center gap-2 text-text-dim hover:text-gold transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">{prev.name}</span>
                <span className="sm:hidden">Prev</span>
              </button>
            ) : <div />}
            {next ? (
              <button
                onClick={() => navigate(`/store/${next.slug}`)}
                className="flex items-center gap-2 text-text-dim hover:text-gold transition-colors text-sm"
              >
                <span className="hidden sm:inline">{next.name}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StorePackage;
