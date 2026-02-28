import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Mail, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";
import {
  mainProducts,
  addOnProduct,
  comparisonSections,
  type Product,
  type FeatureValue,
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
    q: "How does it work?",
    a: "After purchase, you'll be guided through a short intake form where you enter your project details, budget, capital stack, and deal structure. We use that information to build your finance plan and deliverables — delivered to your email within 24 hours.",
  },
  {
    q: "What's the difference between the three packages?",
    a: "The Blueprint gives you the complete finance plan documentation. The Pitch Package adds investor-facing materials — a pitch deck, investor return profiles, executive summary, and deal terms summary. The Market Case adds comparable acquisition research, a defensible valuation range, and a market positioning memo.",
  },
  {
    q: "What is The Working Model?",
    a: "A live, formula-driven Excel workbook. Change any input and every downstream calculation updates instantly. It's the engine behind your finance plan — reusable across unlimited future projects. Add it at checkout for $79 when bundled with any package.",
  },
  {
    q: "What if the deliverables don't meet my expectations?",
    a: "If your deliverables don't meet the institutional standard described, we'll revise them. These are the same financial models used in real production financing — if something doesn't hold up, we fix it.",
  },
  {
    q: "Can I upgrade later?",
    a: "Contact us and we'll apply what you've already paid toward the higher tier.",
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
   PRODUCT CARD
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
  const isPremium = product.tier === 3;

  return (
    <div
      className="flex flex-col p-6 rounded-xl"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 700ms ease-out, transform 700ms ease-out',
        transitionDelay: `${index * 120}ms`,
        border: isFeatured
          ? '2px solid rgba(212,175,55,0.50)'
          : isPremium
          ? '1px solid rgba(212,175,55,0.30)'
          : '1px solid rgba(212,175,55,0.25)',
        background: isFeatured
          ? 'rgba(212,175,55,0.04)'
          : '#000',
        boxShadow: isFeatured
          ? '0 0 48px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.06)'
          : 'inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="mb-4">
          <span className={cn(
            "inline-block px-3 py-1.5 text-[12px] tracking-[0.15em] uppercase font-bold rounded",
            isFeatured
              ? "bg-gold/20 border border-gold/40 text-gold"
              : isPremium
              ? "bg-gold/10 border border-gold/25 text-gold"
              : "border border-gold-border text-ink-secondary"
          )}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Name */}
      <h3 className="font-bebas text-[28px] tracking-[0.06em] text-white mb-2">
        {product.name.toUpperCase()}
      </h3>

      {/* Price */}
      <div className="mb-3">
        {product.originalPrice && (
          <span className="font-mono text-[16px] text-ink-secondary line-through mr-2">
            ${product.originalPrice}
          </span>
        )}
        <span className={cn(
          "font-mono font-bold text-white",
          isFeatured ? "text-[40px]" : isPremium ? "text-[40px]" : "text-[26px]"
        )}>
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
        {isPremium
          ? "GET THE FULL PACKAGE"
          : isFeatured
          ? "GET THE PITCH PACKAGE"
          : "START WITH THE BLUEPRINT"}
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
   COMPARE CELL — for inline comparison table
   ═══════════════════════════════════════════════════════════════════ */
const CompareCell = ({ value, featured }: { value: FeatureValue; featured?: boolean }) => {
  if (typeof value === "boolean") {
    return value ? (
      <Check className={cn("w-4 h-4 mx-auto", featured ? "text-gold" : "text-ink-body")} />
    ) : (
      <XIcon className="w-3.5 h-3.5 mx-auto text-ink-ghost" />
    );
  }
  return (
    <span className={cn("text-[12px] leading-snug", featured ? "text-white" : "text-ink-body")}>
      {value}
    </span>
  );
};


/* ═══════════════════════════════════════════════════════════════════
   MAIN STORE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Store = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [showPopup, setShowPopup] = useState<Product | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Mobile-sorted products: featured first, then premium, then base
  const mobileProducts = [...mainProducts].sort((a, b) => {
    if (a.featured) return -1;
    if (b.featured) return 1;
    return b.tier - a.tier;
  });

  // Reveal refs
  const revealProducts = useReveal();
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

  const handleBuy = (product: Product) => {
    haptics.medium();
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

      <main className="flex-1" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>

        {/* ──────────────────────────────────────────────────────────
             § 1  PRODUCT CARDS — first thing they see
             Three tiers + add-on. No preamble.
           ────────────────────────────────────────────────────────── */}
        <section id="products" className="pt-14 pb-14 md:pb-20 px-6">
          <div
            ref={revealProducts.ref}
            className="max-w-md mx-auto"
          >
            {/* Mobile: featured first, then stack */}
            <div className="space-y-5">
              {mobileProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => handleBuy(product)}
                  visible={revealProducts.visible}
                  index={i}
                />
              ))}
            </div>

            {/* ADD-ON: Working Model — bundled upsell note */}
            {addOnProduct && (
              <div
                className="mt-5 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl"
                style={{
                  border: '1px solid rgba(212,175,55,0.15)',
                  background: 'rgba(212,175,55,0.03)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="px-2 py-0.5 text-[12px] tracking-[0.12em] uppercase font-bold text-gold border border-gold-border rounded flex-shrink-0">
                    Add-on
                  </span>
                  <span className="font-bebas text-[16px] tracking-[0.06em] text-white truncate">
                    {addOnProduct.name.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 flex-shrink-0">
                  <span className="font-mono text-[14px] text-gold font-medium">$75 at checkout</span>
                  <span className="font-mono text-[12px] text-ink-secondary line-through">$149</span>
                </div>
              </div>
            )}

            {/* Compare packages link */}
            <div className="text-center mt-6">
              <button
                onClick={() => { haptics.light(); navigate("/store/compare"); }}
                className="text-ink-secondary text-[14px] hover:text-gold transition-colors tracking-[0.04em]"
              >
                Compare packages side by side {"\u2192"}
              </button>
            </div>
          </div>
        </section>


        {/* ──────────────────────────────────────────────────────────
             § 2  INLINE COMPARISON TABLE
             What's in each tier at a glance. No separate page needed.
           ────────────────────────────────────────────────────────── */}
        <section id="compare" className="py-14 md:py-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                WHAT{"\u2019"}S IN <span className="text-white">EACH TIER</span>
              </h2>
            </div>

            <div
              className="border border-gold-border bg-black overflow-hidden rounded-xl"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
            >
              {/* Column headers */}
              <div className="grid grid-cols-4 gap-0 px-3 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div />
                {mainProducts.map((p) => (
                  <div key={p.id} className="text-center">
                    <p className={cn(
                      "font-bebas text-[12px] tracking-[0.06em] leading-tight",
                      p.featured ? "text-gold" : "text-white"
                    )}>
                      {p.name.split(" ").slice(-1)[0].toUpperCase()}
                    </p>
                    <p className={cn(
                      "font-mono text-[12px] mt-0.5",
                      p.featured ? "text-gold" : "text-ink-secondary"
                    )}>
                      ${p.price.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sections + rows — skip "Use Case" (text too long for grid) */}
              {comparisonSections
                .filter((s) => s.title !== "Use Case")
                .map((section) => (
                <div key={section.title}>
                  <div className="px-3 pt-5 pb-2">
                    <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-gold font-bold">
                      {section.title}
                    </span>
                  </div>

                  {section.features.map((feat) => (
                    <div
                      key={feat.label}
                      className="grid grid-cols-4 gap-0 px-3 py-3 items-center"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <span className="text-[12px] text-ink-secondary leading-snug pr-2">
                        {feat.label}
                      </span>
                      <div className="text-center">
                        <CompareCell value={feat.theBlueprint} />
                      </div>
                      <div className="text-center">
                        <CompareCell value={feat.thePitchPackage} featured />
                      </div>
                      <div className="text-center">
                        <CompareCell value={feat.theMarketCase} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ──────────────────────────────────────────────────────────
             § 3  FAQ — clean accordion, no wrappers
           ────────────────────────────────────────────────────────── */}
        <section id="faq" className="py-14 md:py-20 px-6">
          <div
            ref={revealFaq.ref}
            className="max-w-md mx-auto"
            style={{
              opacity: revealFaq.visible ? 1 : 0,
              transform: revealFaq.visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 700ms ease-out, transform 700ms ease-out',
            }}
          >
            <div className="text-center mb-8">
              <h2 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                COMMON <span className="text-white">QUESTIONS</span>
              </h2>
            </div>

            <div
              className="border border-gold-border bg-black overflow-hidden rounded-xl px-6"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
            >
              <Accordion type="single" collapsible className="w-full">
                {storeFaqs.map((faq, i) => (
                  <AccordionItem
                    key={faq.q}
                    value={`faq-${i}`}
                    className={cn(i > 0 && "border-t border-bg-card-rule")}
                    style={{ borderBottom: 'none' }}
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
                border: '1px solid rgba(212,175,55,0.15)',
                background: 'rgba(255,255,255,0.02)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <h3 className="font-bebas text-[16px] tracking-[0.08em] text-gold mb-2">
                NEED SOMETHING CUSTOM?
              </h3>
              <p className="text-ink-secondary text-[16px] leading-relaxed mb-3">
                If your project requires bespoke financial modeling, custom comp
                research, or institutional-grade investor materials beyond what
                these packages cover — get in touch.
              </p>
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="inline-flex items-center gap-2 text-gold text-[14px] font-semibold hover:text-gold/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Us {"\u2192"}
              </a>
            </div>
          </div>
        </section>


        {/* ──────────────────────────────────────────────────────────
             FOOTER — legal only
           ────────────────────────────────────────────────────────── */}
        <footer className="py-8 px-6 max-w-md mx-auto">
          <p className="text-ink-ghost text-[12px] tracking-wide leading-relaxed text-center">
            For educational and informational purposes only. Not legal, tax, or
            investment advice. Consult a qualified entertainment attorney before
            making financing decisions.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Store;
