import { useState, useEffect, useRef } from "react";
import { Check, Mail, X as XIcon, Clock, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";
import {
  selfServeProducts,
  turnkeyServices,
  type Product,
} from "@/lib/store-products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const storeFaqs = [
  {
    q: "How do the self-serve products work?",
    a: "After purchase, your calculator data is used to generate your deliverables automatically. Professional, white-labeled documents delivered to your email.",
  },
  {
    q: "How do the turnkey services work?",
    a: "After purchase, you complete a short intake form with your project details — logline, genre, budget, cast, tone references, and raise amount. We build your complete investor package and deliver it within 5 business days.",
  },
  {
    q: "What is The Working Model?",
    a: "A live, formula-driven Excel workbook. Change any input and every downstream calculation updates instantly. It\u2019s the engine behind your finance plan — reusable across unlimited future projects. Add it at checkout for $79 when bundled with any package.",
  },
  {
    q: "What if the deliverables don\u2019t meet my expectations?",
    a: "If your deliverables don\u2019t meet the institutional standard described, we\u2019ll revise them. These are the same financial models used in real production financing — if something doesn\u2019t hold up, we fix it.",
  },
  {
    q: "Can I upgrade later?",
    a: "Contact us and we\u2019ll apply what you\u2019ve already paid toward the higher tier.",
  },
];


/* ═══════════════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════════════════════════════ */
const useReveal = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};


/* ═══════════════════════════════════════════════════════════════════
   WORKING MODEL POPUP
   ═══════════════════════════════════════════════════════════════════ */
const WorkingModelPopup = ({
  onAccept,
  onDecline,
  onClose,
  loading,
}: {
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-6">
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    />
    <div
      className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-xl overflow-hidden animate-fade-in"
      style={{
        border: "1px solid rgba(212,175,55,0.35)",
        borderBottom: "none",
        background:
          "linear-gradient(165deg, rgba(22,22,22,0.99), rgba(8,8,8,0.99))",
        boxShadow:
          "0 -8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(212,175,55,0.06)",
      }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        disabled={loading}
        className="absolute top-4 right-4 z-10 text-ink-secondary hover:text-ink-body transition-colors"
      >
        <XIcon className="w-5 h-5" />
      </button>

      {/* Header band */}
      <div
        className="px-6 pt-6 pb-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 100%)",
        }}
      >
        <span className="inline-block px-3 py-1 bg-gold/15 border border-gold/30 text-gold text-[11px] tracking-[0.18em] uppercase font-bold rounded-full mb-3">
          ONE-TIME OFFER
        </span>
        <h3 className="font-bebas text-[26px] tracking-[0.06em] text-white leading-tight">
          ADD THE LIVE EXCEL MODEL
        </h3>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 space-y-4">
        {/* Price row */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-base text-ink-secondary line-through decoration-ink-secondary/40">
              $149
            </span>
            <span className="font-mono text-3xl font-semibold text-white">
              $79
            </span>
          </div>
          <span className="ml-auto px-2.5 py-1 bg-gold/10 border border-gold/20 text-gold text-[12px] tracking-[0.08em] font-semibold rounded-md">
            SAVE $70
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06]" />

        {/* Feature list */}
        <ul className="space-y-2.5">
          {[
            "Formula-driven Excel engine",
            "Change any input \u2014 everything recalculates",
            "Reusable across unlimited projects",
          ].map((feat) => (
            <li key={feat} className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold" />
              <span className="text-ink-body text-[14px] leading-snug">
                {feat}
              </span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onAccept}
            disabled={loading}
            className="w-full h-[52px] text-[15px] btn-cta-primary"
          >
            {loading ? "CONNECTING..." : "YES, ADD FOR $79"}
          </button>
          <button
            onClick={onDecline}
            disabled={loading}
            className="w-full text-center text-ink-secondary text-[13px] tracking-wide hover:text-ink-body transition-colors py-2"
          >
            {loading ? "Connecting..." : "No thanks, just the plan"}
          </button>
        </div>
      </div>
    </div>
  </div>
);


/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARD — self-serve tiers (1-2)
   ═══════════════════════════════════════════════════════════════════ */
const ProductCard = ({
  product,
  onBuy,
  visible,
  index,
}: {
  product: Product;
  onBuy: () => void;
  visible: boolean;
  index: number;
}) => {
  const isFeatured = product.featured;

  return (
    <div
      className="flex flex-col p-6 rounded-xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        transitionDelay: `${index * 120}ms`,
        border: isFeatured
          ? "2px solid rgba(212,175,55,0.50)"
          : "1px solid rgba(212,175,55,0.25)",
        background: isFeatured ? "rgba(212,175,55,0.04)" : "#000",
        boxShadow: isFeatured
          ? "0 0 48px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="mb-4">
          <span
            className={cn(
              "inline-block px-3 py-1.5 text-[12px] tracking-[0.15em] uppercase font-bold rounded",
              isFeatured
                ? "bg-gold/20 border border-gold/40 text-gold"
                : "border border-gold-border text-ink-secondary"
            )}
          >
            {product.badge}
          </span>
        </div>
      )}

      {/* Name */}
      <h3 className="font-bebas text-[28px] tracking-[0.06em] text-white mb-1">
        {product.name.toUpperCase()}
      </h3>

      {/* Pick this if */}
      {product.pickThisIf && (
        <p className="text-gold/70 text-[13px] italic mb-3">
          Pick this one if {product.pickThisIf}
        </p>
      )}

      {/* Price */}
      <div className="mb-3">
        <span
          className={cn(
            "font-mono font-bold text-white",
            isFeatured ? "text-[40px]" : "text-[26px]"
          )}
        >
          ${product.price.toLocaleString()}
        </span>
      </div>

      {/* Short description */}
      <p className="text-ink-secondary text-[16px] leading-relaxed mb-5">
        {product.shortDescription}
      </p>

      {/* Feature list */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold" />
            <span className="text-ink-body text-[14px] leading-snug">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onBuy}
        className={cn(
          "w-full h-14 uppercase tracking-[0.06em]",
          isFeatured
            ? "btn-cta-primary animate-cta-glow-pulse"
            : "btn-cta-secondary"
        )}
      >
        {product.ctaLabel}
      </button>

      {/* Details link */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/store/${product.slug}`;
        }}
        className="text-ink-secondary text-[12px] tracking-[0.08em] hover:text-ink-body transition-colors text-center mt-3"
      >
        See full details {"\u2192"}
      </button>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   SERVICE CARD — turnkey tiers (3-4)
   ═══════════════════════════════════════════════════════════════════ */
const ServiceCard = ({
  product,
  onBuy,
  visible,
  index,
}: {
  product: Product;
  onBuy: () => void;
  visible: boolean;
  index: number;
}) => {
  const isTop = product.tier === 4;

  return (
    <div
      className="flex flex-col p-6 rounded-xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 700ms ease-out, transform 700ms ease-out",
        transitionDelay: `${index * 120}ms`,
        border: isTop
          ? "1px solid rgba(212,175,55,0.40)"
          : "1px solid rgba(212,175,55,0.30)",
        background: isTop
          ? "linear-gradient(165deg, rgba(212,175,55,0.05), rgba(0,0,0,0.6))"
          : "linear-gradient(165deg, rgba(212,175,55,0.03), rgba(0,0,0,0.6))",
        boxShadow: isTop
          ? "0 0 40px rgba(212,175,55,0.08), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Badge + Turnaround row */}
      <div className="flex items-center justify-between mb-4">
        {product.badge && (
          <span
            className={cn(
              "inline-block px-3 py-1.5 text-[12px] tracking-[0.15em] uppercase font-bold rounded",
              isTop
                ? "bg-gold/15 border border-gold/30 text-gold"
                : "bg-gold/10 border border-gold/25 text-gold"
            )}
          >
            {product.badge}
          </span>
        )}
        {product.turnaround && (
          <span className="flex items-center gap-1.5 text-ink-secondary text-[12px] tracking-[0.06em]">
            <Clock className="w-3.5 h-3.5" />
            {product.turnaround}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-bebas text-[28px] tracking-[0.06em] text-white mb-1">
        {product.name.toUpperCase()}
      </h3>

      {/* Pick this if */}
      {product.pickThisIf && (
        <p className="text-gold/70 text-[13px] italic mb-3">
          Pick this one if {product.pickThisIf}
        </p>
      )}

      {/* Price */}
      <div className="mb-3">
        <span className="font-mono text-[40px] font-bold text-white">
          ${product.price.toLocaleString()}
        </span>
      </div>

      {/* Short description */}
      <p className="text-ink-secondary text-[16px] leading-relaxed mb-5">
        {product.shortDescription}
      </p>

      {/* Feature list */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold" />
            <span className="text-ink-body text-[14px] leading-snug">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onBuy}
        className="w-full h-14 uppercase tracking-[0.06em] btn-cta-primary flex items-center justify-center gap-2"
      >
        {product.ctaLabel}
      </button>

      {/* Details link */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/store/${product.slug}`;
        }}
        className="text-ink-secondary text-[12px] tracking-[0.08em] hover:text-ink-body transition-colors text-center mt-3"
      >
        See full details {"\u2192"}
      </button>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   MAIN STORE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Store = () => {
  const haptics = useHaptics();
  const [showPopup, setShowPopup] = useState<Product | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Reveal refs
  const revealProducts = useReveal();
  const revealServices = useReveal();
  const revealFaq = useReveal();

  /* ─── CHECKOUT — DIRECT TO STRIPE ─── */
  const startCheckout = async (productId: string, addonId?: string) => {
    setCheckoutLoading(true);
    try {
      const body: Record<string, unknown> = addonId
        ? { items: [productId, addonId] }
        : { productId };

      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        { body }
      );
      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  /* ─── BUY HANDLERS ─── */
  const handleBuyProduct = (product: Product) => {
    haptics.medium();
    setShowPopup(product);
  };

  const handleBuyService = (product: Product) => {
    haptics.medium();
    // TODO: Route to intake form (Typeform, Google Form, or custom)
    // For now, show the working model popup same as products
    setShowPopup(product);
  };

  const handlePopupAccept = () => {
    if (!showPopup) return;
    haptics.medium();
    startCheckout(showPopup.id, "the-working-model-discount");
  };

  const handlePopupDecline = () => {
    if (!showPopup) return;
    haptics.light();
    startCheckout(showPopup.id);
  };

  // Mobile sort: featured first for products
  const sortedProducts = [...selfServeProducts].sort((a, b) => {
    if (a.featured) return -1;
    if (b.featured) return 1;
    return a.tier - b.tier;
  });

  // Services: highest tier first
  const sortedServices = [...turnkeyServices].sort(
    (a, b) => a.tier - b.tier
  );

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen bg-black flex flex-col grain-overlay">
      {/* Working Model Popup */}
      {showPopup && (
        <WorkingModelPopup
          onAccept={handlePopupAccept}
          onDecline={handlePopupDecline}
          onClose={() => !checkoutLoading && setShowPopup(null)}
          loading={checkoutLoading}
        />
      )}

      {/* Checkout loading overlay */}
      {checkoutLoading && !showPopup && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center">
          <div className="text-gold text-[14px] tracking-[0.15em] animate-pulse">
            CONNECTING TO CHECKOUT...
          </div>
        </div>
      )}

      <main
        className="flex-1"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* ──────────────────────────────────────────────────────────
             § 1  SELF-SERVE PRODUCTS
             Tiers 1-2. Instant delivery. Stripe checkout.
           ────────────────────────────────────────────────────────── */}
        <section id="products" className="pt-14 pb-10 px-6">
          <div ref={revealProducts.ref} className="max-w-md mx-auto">
            {/* Section header */}
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                YOUR NUMBERS.{" "}
                <span className="text-white">INVESTOR-READY.</span>
              </h2>
              <p className="text-ink-secondary text-[15px] leading-relaxed mt-3">
                Professional financial documents built from your calculator
                data. Purchase and download.
              </p>
            </div>

            {/* Product cards */}
            <div className="space-y-5">
              {sortedProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => handleBuyProduct(product)}
                  visible={revealProducts.visible}
                  index={i}
                />
              ))}
            </div>

          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
             DIVIDER — category shift
           ────────────────────────────────────────────────────────── */}
        <div className="py-10 px-6">
          <div className="max-w-md mx-auto">
            <div
              className="h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(212,175,55,0.40), transparent)",
              }}
            />
          </div>
        </div>

        {/* ──────────────────────────────────────────────────────────
             § 2  TURNKEY SERVICES
             Tiers 3-4. Custom build. 5 business day turnaround.
           ────────────────────────────────────────────────────────── */}
        <section id="services" className="pb-14 px-6">
          <div ref={revealServices.ref} className="max-w-md mx-auto">
            {/* Section header */}
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                WE BUILD IT{" "}
                <span className="text-white">FOR YOU.</span>
              </h2>
              <p className="text-ink-secondary text-[15px] leading-relaxed mt-3">
                Tell us about your project. We build the complete investor
                package — turnkey, custom, delivered in 5 business days.
              </p>
            </div>

            {/* Service cards */}
            <div className="space-y-5">
              {sortedServices.map((product, i) => (
                <ServiceCard
                  key={product.id}
                  product={product}
                  onBuy={() => handleBuyService(product)}
                  visible={revealServices.visible}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
             § 3  FAQ
           ────────────────────────────────────────────────────────── */}
        <section id="faq" className="py-14 md:py-20 px-6">
          <div
            ref={revealFaq.ref}
            className="max-w-md mx-auto"
            style={{
              opacity: revealFaq.visible ? 1 : 0,
              transform: revealFaq.visible
                ? "translateY(0)"
                : "translateY(20px)",
              transition:
                "opacity 700ms ease-out, transform 700ms ease-out",
            }}
          >
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                COMMON <span className="text-white">QUESTIONS</span>
              </h2>
            </div>

            <div
              className="border border-gold-border bg-black overflow-hidden rounded-xl px-6"
              style={{
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <Accordion type="single" collapsible className="w-full">
                {storeFaqs.map((faq, i) => (
                  <AccordionItem
                    key={faq.q}
                    value={`faq-${i}`}
                    className={cn(
                      i > 0 && "border-t border-bg-card-rule"
                    )}
                    style={{ borderBottom: "none" }}
                  >
                    <AccordionTrigger className="font-bebas text-[16px] tracking-[0.06em] uppercase text-gold hover:text-gold/70 hover:no-underline text-left py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-ink-secondary text-[16px] leading-relaxed normal-case font-sans pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Custom work prompt */}
            <div
              className="mt-5 p-6 rounded-xl"
              style={{
                border: "1px solid rgba(212,175,55,0.30)",
                background:
                  "linear-gradient(165deg, rgba(212,175,55,0.05), rgba(0,0,0,0.6))",
                boxShadow:
                  "0 0 32px rgba(212,175,55,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <h3 className="font-bebas text-[18px] tracking-[0.08em] text-gold mb-2">
                NEED SOMETHING DIFFERENT?
              </h3>
              <p className="text-ink-body text-[15px] leading-relaxed mb-4">
                Bespoke financial modeling, custom comp research, or
                institutional-grade investor materials beyond what these
                packages cover.
              </p>
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="inline-flex items-center gap-2 text-gold text-[14px] font-semibold hover:text-gold/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Get In Touch {"\u2192"}
              </a>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────
             FOOTER — legal only
           ────────────────────────────────────────────────────────── */}
        <footer className="py-8 px-6 max-w-md mx-auto">
          <p className="text-ink-ghost text-[12px] tracking-wide leading-relaxed text-center">
            For educational and informational purposes only. Not legal, tax,
            or investment advice. Consult a qualified entertainment attorney
            before making financing decisions.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Store;
