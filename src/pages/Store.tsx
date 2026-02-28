import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Mail, Instagram, Share2, Link2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useHaptics } from "@/hooks/use-haptics";
import {
  mainProducts,
  addOnProduct,
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
import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";

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
    a: "The Blueprint gives you the complete finance plan documentation. The Pitch Package adds investor-facing materials \u2014 a pitch deck, investor return profiles, executive summary, and deal terms summary. The Market Case adds comparable acquisition research, a defensible valuation range, and a market positioning memo.",
  },
  {
    q: "What is The Working Model?",
    a: "A live, formula-driven Excel workbook. Change any input and every downstream calculation updates instantly. It's the engine behind your finance plan \u2014 reusable across unlimited future projects. Add it at checkout for $79 when bundled with any package.",
  },
  {
    q: "What if the deliverables don't meet my expectations?",
    a: "If your deliverables don't meet the institutional standard described, we'll revise them. These are the same financial models used in real production financing \u2014 if something doesn't hold up, we fix it.",
  },
  {
    q: "Can I upgrade later?",
    a: "Contact us and we'll apply what you've already paid toward the higher tier.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   TRUST ANCHOR DATA
   ═══════════════════════════════════════════════════════════════════ */
const trustRows = [
  { label: "Entertainment Lawyer", cost: "$5,000\u2013$15,000", isBrand: false },
  { label: "Finance Consultant", cost: "$10,000\u2013$30,000", isBrand: false },
  { label: "filmmaker.og", cost: "$349\u2013$1,997", isBrand: true },
];

/* ═══════════════════════════════════════════════════════════════════
   SECTION REVEAL
   ═══════════════════════════════════════════════════════════════════ */
const useReveal = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
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
        <X className="w-5 h-5" />
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
      className={cn(
        "flex flex-col p-6 rounded-xl transition-all duration-400 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      style={{
        transitionDelay: visible ? `${index * 120}ms` : "0ms",
        border: isFeatured
          ? "2px solid var(--gold)"
          : isPremium
          ? "1px solid rgba(212,175,55,0.5)"
          : "1px solid var(--gold-border)",
        background: isFeatured
          ? "linear-gradient(145deg, rgba(212,175,55,0.06), rgba(10,10,10,0.98))"
          : isPremium
          ? "linear-gradient(145deg, rgba(212,175,55,0.04), rgba(10,10,10,0.98))"
          : "rgba(15,15,15,0.6)",
        boxShadow: isFeatured
          ? "0 0 48px rgba(212,175,55,0.14)"
          : isPremium
          ? "0 0 32px rgba(212,175,55,0.08)"
          : "none",
      }}
    >
      {/* Badge */}
      {isFeatured && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 bg-gold/20 border border-gold/40 text-gold text-[12px] tracking-[0.15em] uppercase font-bold rounded-full">
            RECOMMENDED
          </span>
        </div>
      )}
      {product.badge && !isFeatured && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 bg-white/[0.04] border border-gold-border text-ink-secondary text-[12px] tracking-[0.15em] uppercase font-bold rounded-full">
            {product.badge}
          </span>
        </div>
      )}

      {/* Name */}
      <h3 className="font-bebas text-2xl tracking-[0.06em] text-white mb-2">
        {product.name.toUpperCase()}
      </h3>

      {/* Price */}
      <div className="mb-3">
        {product.originalPrice && (
          <span className="font-mono text-lg text-ink-secondary line-through mr-2">
            ${product.originalPrice.toLocaleString()}
          </span>
        )}
        <span
          className={cn(
            "font-mono font-medium text-white",
            isFeatured ? "text-5xl" : "text-3xl"
          )}
        >
          ${product.price.toLocaleString()}
        </span>
      </div>

      {/* Short description */}
      <p className="text-ink-secondary text-[14px] leading-relaxed mb-5">
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
          "w-full h-14",
          isFeatured
            ? "text-base btn-cta-primary animate-cta-glow-pulse"
            : isPremium
            ? "text-[14px] btn-cta-primary"
            : "text-[14px] btn-cta-secondary"
        )}
      >
        {isFeatured
          ? "GET THE FULL PACKAGE"
          : isPremium
          ? "GET THE FULL PACKAGE"
          : "START WITH THE BLUEPRINT"}
      </button>

      {/* Details link */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/store/${product.slug}`;
        }}
        className="text-ink-secondary text-[12px] tracking-wider hover:text-ink-body transition-colors text-center mt-3"
      >
        See full details →
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN STORE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Store = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPopup, setShowPopup] = useState<Product | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Mobile-sorted products: featured first, then by tier desc
  const mobileProducts = [...mainProducts].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.tier - a.tier
  );

  // Reveal refs
  const revealTrust = useReveal();
  const revealProducts = useReveal();
  const revealFaq = useReveal();

  /* ─── SHARE HELPERS ─── */
  const handleCopyLink = useCallback(() => {
    haptics.light();
    navigator.clipboard
      .writeText(`${SHARE_TEXT}\n\n${getShareUrl()}`)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => {});
  }, [haptics]);

  const handleShare = useCallback(async () => {
    haptics.light();
    if (navigator.share) {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: getShareUrl(),
        });
        return;
      } catch {}
    }
    handleCopyLink();
  }, [handleCopyLink, haptics]);

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

      <main className="flex-1 animate-fade-in">
        {/* ═══════════════════════════════════════════════════════════
            1. TRUST ANCHOR — ledger-style data cards
            ═══════════════════════════════════════════════════════════ */}
        <section id="trust" className="px-6 py-12">
          <div
            ref={revealTrust.ref}
            className={cn(
              "max-w-lg mx-auto transition-all duration-500 ease-out",
              revealTrust.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <p className="text-ink-secondary text-[12px] tracking-[0.2em] uppercase text-center mb-6 font-semibold">
              What this costs everywhere else
            </p>

            <div className="rounded-xl border border-gold-border overflow-hidden">
              {trustRows.map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5 transition-all duration-400 ease-out",
                    revealTrust.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                    i < trustRows.length - 1 && "border-b border-bg-card-rule",
                    item.isBrand
                      ? "bg-gold/[0.06]"
                      : "bg-transparent"
                  )}
                  style={{
                    transitionDelay: revealTrust.visible ? `${i * 120}ms` : "0ms",
                  }}
                >
                  <span
                    className={cn(
                      "text-[14px] font-medium",
                      item.isBrand ? "text-gold" : "text-ink-body"
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-base font-medium",
                      item.isBrand
                        ? "text-gold"
                        : "text-ink-secondary line-through decoration-ink-secondary/30"
                    )}
                  >
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-ink-secondary text-[14px] text-center mt-5 italic">
              Same financial models. Fraction of the cost.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. PRODUCT CARDS — single column, max-w-md
            ═══════════════════════════════════════════════════════════ */}
        <section id="products" className="px-6 py-12">
          <div
            ref={revealProducts.ref}
            className={cn(
              "max-w-md mx-auto transition-all duration-500 ease-out",
              revealProducts.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            {/* Mobile: featured first, then by tier desc */}
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

            {/* ADD-ON: Working Model — slim horizontal upsell bar */}
            {addOnProduct && (
              <div className="mt-5 rounded-xl border border-gold/20 bg-gold/[0.03] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="px-2 py-0.5 text-[9px] tracking-[0.12em] uppercase font-bold text-gold border border-gold/30 flex-shrink-0 rounded">
                    Add-on
                  </span>
                  <span className="font-bebas text-lg tracking-[0.06em] text-white truncate">
                    {addOnProduct.name.toUpperCase()}
                  </span>
                </div>
                <span className="text-gold font-mono text-[14px] font-medium flex-shrink-0">
                  Add for $79 at checkout
                </span>
              </div>
            )}

            {/* Compare packages link */}
            <div className="text-center mt-6">
              <button
                onClick={() => { haptics.light(); navigate("/store/compare"); }}
                className="text-ink-secondary text-[14px] hover:text-gold transition-colors tracking-wider"
              >
                Compare packages side by side →
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            3. FAQ
            ═══════════════════════════════════════════════════════════ */}
        <section id="faq" className="px-6 py-12">
          <div
            ref={revealFaq.ref}
            className={cn(
              "max-w-2xl mx-auto transition-all duration-500 ease-out",
              revealFaq.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <p className="text-ink-secondary text-[12px] tracking-[0.2em] uppercase text-center mb-6 font-semibold">
              Common Questions
            </p>
            <div className="rounded-xl border border-gold-border bg-transparent px-5">
              <Accordion type="single" collapsible className="w-full">
                {storeFaqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`faq-${i}`}>
                    <AccordionTrigger className="font-bebas text-xl tracking-[0.06em] uppercase text-gold hover:text-gold/70 hover:no-underline text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-ink-secondary text-[14px] leading-relaxed normal-case font-sans">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Custom work prompt */}
            <div className="mt-5 rounded-xl border border-gold-border bg-transparent p-5">
              <h3 className="font-bebas text-lg tracking-[0.08em] text-gold mb-2">
                NEED SOMETHING CUSTOM?
              </h3>
              <p className="text-ink-body text-[14px] leading-relaxed mb-3">
                If your project requires bespoke financial modeling, custom comp
                research, or institutional-grade investor materials beyond what
                these packages cover — get in touch.
              </p>
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="inline-flex items-center gap-2 text-gold text-[14px] font-semibold hover:text-gold/80 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Contact Us →
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            4. FOOTER
            ═══════════════════════════════════════════════════════════ */}
        <footer className="py-10 px-6">
          <div className="max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-[340px] mx-auto">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="flex items-center justify-center gap-2 text-[14px] tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-gold-border hover:border-gold/30"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-[14px] tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-gold-border hover:border-gold/30"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 text-[14px] tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-gold-border hover:border-gold/30"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 text-[14px] tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-gold-border hover:border-gold/30"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4 text-gold" />
                    <span className="text-gold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center mb-2">
              <span className="font-bebas text-3xl tracking-[0.2em] text-gold">
                FILMMAKER<span className="text-white">.OG</span>
              </span>
            </div>
            <p className="text-ink-secondary/60 text-[12px] tracking-wide text-center mb-4">
              Democratizing the business of film.
            </p>
            <p className="text-ink-secondary/60 text-[12px] tracking-wide leading-relaxed text-center">
              For educational and informational purposes only. Not legal, tax, or
              investment advice. Consult a qualified entertainment attorney before
              making financing decisions.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Store;
