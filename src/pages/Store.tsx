import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  HelpCircle,
  Package,
  Mail,
  Instagram,
  Share2,
  Link2,
  X,
  ClipboardList,
  Cog,
  Send,
} from "lucide-react";
import MiniHeader from "@/components/MiniHeader";
import { cn } from "@/lib/utils";
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
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════════════════════════ */
const storeFaqs = [
  {
    q: "How does it work?",
    a: "After purchase, you'll be guided through a short intake form where you enter your project details, budget, capital stack, and deal structure. We use that information to build your finance plan and deliverables — delivered to your email within 24 hours.",
  },
  {
    q: "What's the difference between The Blueprint and The Pitch Package?",
    a: "The Blueprint gives you the complete finance plan documentation (PDF, capital stack breakdown, scenario analysis, assumptions reference). The Pitch Package adds investor-facing materials: a PowerPoint pitch deck, individual investor return profiles, an executive summary leave-behind, and a deal terms summary.",
  },
  {
    q: "What is The Working Model?",
    a: "It's a live, formula-driven Excel workbook. Change any input and every downstream calculation updates instantly. It's the engine behind your finance plan — reusable across unlimited future projects. You can add it at checkout for $49 when bundled with any package.",
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
   TRUST ANCHOR DATA
   ═══════════════════════════════════════════════════════════════════ */
const trustRows = [
  { label: "Entertainment Lawyer", cost: "$5,000–$15,000", featured: false },
  { label: "Finance Consultant", cost: "$10,000–$30,000", featured: false },
  { label: "filmmaker.og", cost: "$197–$497", featured: true },
];

/* ═══════════════════════════════════════════════════════════════════
   HOW IT WORKS STEPS
   ═══════════════════════════════════════════════════════════════════ */
const howItWorksSteps = [
  {
    icon: ClipboardList,
    title: "Tell us about your project",
    description: "Complete a short intake form with your budget, capital stack, and deal structure.",
  },
  {
    icon: Cog,
    title: "We build your finance plan",
    description: "Modeled by a working producer using real production financing standards.",
  },
  {
    icon: Send,
    title: "Delivered to your inbox",
    description: "Within 24 hours — formatted, professional, and ready to use.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   GOLD DIVIDER
   ═══════════════════════════════════════════════════════════════════ */
const GoldDivider = () => (
  <div className="px-8">
    <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION REVEAL
   ═══════════════════════════════════════════════════════════════════ */
const useReveal = () => {
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
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

const staggerDelay = (
  index: number,
  visible: boolean
): React.CSSProperties => ({
  transitionDelay: visible ? `${index * 120}ms` : "0ms",
});

const staggerChild = (visible: boolean) =>
  cn(
    "transition-all duration-400 ease-out",
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
  );

/* ═══════════════════════════════════════════════════════════════════
   WORKING MODEL POPUP
   ═══════════════════════════════════════════════════════════════════ */
const WorkingModelPopup = ({
  baseProduct,
  onAccept,
  onDecline,
  onClose,
  loading,
}: {
  baseProduct: Product;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    />
    <div className="relative w-full max-w-md border border-gold/30 bg-bg-header p-6 space-y-5 animate-fade-in">
      <button
        onClick={onClose}
        disabled={loading}
        className="absolute top-4 right-4 text-text-dim hover:text-text-mid transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div>
        <h3 className="font-bebas text-2xl tracking-[0.06em] text-gold mb-1">
          ADD THE LIVE EXCEL MODEL
        </h3>
        <p className="text-text-mid text-sm">50% off when you bundle now</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-mono text-lg text-text-dim line-through">
          $99
        </span>
        <span className="font-mono text-3xl font-medium text-white">$49</span>
      </div>

      <p className="text-text-dim text-sm leading-relaxed">
        Get the formula-driven Excel engine behind your finance plan. Change any
        input — watch every investor's return recalculate instantly. Reuse on
        every project.
      </p>

      <div className="space-y-3">
        <button
          onClick={onAccept}
          disabled={loading}
          className="w-full h-14 text-base btn-cta-primary"
        >
          {loading ? "CONNECTING..." : "Yes, Add for $49"}
        </button>
        <button
          onClick={onDecline}
          disabled={loading}
          className="w-full text-center text-text-dim text-sm hover:text-text-mid transition-colors py-2"
        >
          {loading ? "CONNECTING..." : "No thanks, continue"}
        </button>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT CARD — Sharp edges, visual hierarchy
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
      className={cn(
        "flex flex-col p-6 transition-all",
        staggerChild(visible),
        isFeatured
          ? "border-2 border-gold bg-bg-card shadow-[0_0_48px_rgba(212,175,55,0.14)] relative"
          : "border border-border-subtle bg-bg-card"
      )}
      style={staggerDelay(index, visible)}
    >
      {/* Badge */}
      {isFeatured && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 bg-gold/20 border border-gold/40 text-gold text-xs tracking-[0.15em] uppercase font-bold">
            RECOMMENDED
          </span>
        </div>
      )}
      {product.badge && !isFeatured && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 bg-white/[0.04] border border-border-subtle text-text-dim text-xs tracking-[0.15em] uppercase font-bold">
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
          <span className="font-mono text-lg text-text-dim line-through mr-2">
            ${product.originalPrice}
          </span>
        )}
        <span
          className={cn(
            "font-mono font-medium text-white",
            isFeatured ? "text-5xl" : "text-3xl"
          )}
        >
          ${product.price}
        </span>
      </div>

      {/* Short description */}
      <p className="text-text-dim text-sm leading-relaxed mb-5">
        {product.shortDescription}
      </p>

      {/* Feature list */}
      <ul className="space-y-2.5 mb-6 flex-1">
        {product.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gold" />
            <span className="text-text-primary text-[13px] leading-snug">
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
            ? "text-base btn-cta-primary"
            : "text-sm btn-cta-secondary"
        )}
      >
        {isFeatured ? "GET THE FULL PACKAGE" : "START WITH THE BLUEPRINT"}
      </button>

      {/* Details link */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `/store/${product.slug}`;
        }}
        className="text-text-dim text-xs tracking-wider hover:text-text-mid transition-colors text-center mt-3"
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
  const [linkCopied, setLinkCopied] = useState(false);
  const [showPopup, setShowPopup] = useState<Product | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Mobile-sorted products: featured first
  const mobileProducts = [...mainProducts].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  // Reveal refs
  const revealTrust = useReveal();
  const revealHowItWorks = useReveal();
  const revealProducts = useReveal();
  const revealFaq = useReveal();

  /* ─── SHARE HELPERS ─── */
  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(`${SHARE_TEXT}\n\n${getShareUrl()}`)
      .then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => {});
  }, []);

  const handleShare = useCallback(async () => {
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
  }, [handleCopyLink]);

  /* ─── SMOOTH SCROLL ─── */
  const scrollToProducts = () => {
    const el = document.getElementById("products");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
    setShowPopup(product);
  };

  const handlePopupAccept = () => {
    if (!showPopup) return;
    startCheckout(showPopup.id, "the-working-model-discount");
  };

  const handlePopupDecline = () => {
    if (!showPopup) return;
    startCheckout(showPopup.id);
  };

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <MiniHeader />

      {/* Working Model Popup */}
      {showPopup && (
        <WorkingModelPopup
          baseProduct={showPopup}
          onAccept={handlePopupAccept}
          onDecline={handlePopupDecline}
          onClose={() => !checkoutLoading && setShowPopup(null)}
          loading={checkoutLoading}
        />
      )}

      {/* Checkout loading overlay */}
      {checkoutLoading && !showPopup && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center">
          <div className="text-gold text-sm tracking-[0.15em] animate-pulse">
            CONNECTING TO CHECKOUT...
          </div>
        </div>
      )}

      <main className="flex-1 animate-fade-in">
        {/* ═══════════════════════════════════════════════════════════
            1. HERO — spotlight gradient, bold headline, scroll CTA
            ═══════════════════════════════════════════════════════════ */}
        <section className="relative px-6 pt-14 pb-12 max-w-2xl mx-auto text-center overflow-hidden">
          {/* Gold spotlight gradient */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none animate-spotlight-pulse"
            style={{
              background: "radial-gradient(ellipse 50% 60% at 50% 20%, rgba(212,175,55,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <h1 className="font-bebas text-[clamp(2.6rem,9vw,4.2rem)] leading-[0.95] mb-4 tracking-[0.04em]">
              <span className="text-gold">YOUR FINANCE PLAN.</span>
              <br />
              <span className="text-white">BUILT FOR YOU.</span>
            </h1>
            <p className="text-text-mid text-base leading-relaxed max-w-md mx-auto mb-8">
              Your complete finance plan — delivered within 24 hours.
            </p>
            <button
              onClick={scrollToProducts}
              className="btn-cta-primary h-14 px-10 text-base mx-auto"
            >
              SEE PACKAGES
            </button>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            2. TRUST ANCHOR — SectionFrame, larger type, gold accent
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="trust" alt>
          <div
            ref={revealTrust.ref}
            className={cn(
              "max-w-lg mx-auto transition-all duration-500 ease-out",
              revealTrust.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <p className="text-text-dim text-xs tracking-[0.2em] uppercase text-center mb-6 font-semibold">
              What this costs everywhere else
            </p>

            <div className="space-y-3">
              {trustRows.map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between px-5 py-3.5 transition-all",
                    staggerChild(revealTrust.visible),
                    item.featured
                      ? "border-l-[3px] border-l-gold border border-gold/30 bg-gold/[0.06] shadow-[0_0_20px_rgba(212,175,55,0.08)]"
                      : "border border-border-subtle bg-bg-card"
                  )}
                  style={staggerDelay(i, revealTrust.visible)}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      item.featured ? "text-gold" : "text-text-mid"
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-base font-medium",
                      item.featured
                        ? "text-gold"
                        : "text-text-dim line-through decoration-text-dim/30"
                    )}
                  >
                    {item.cost}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-text-dim text-sm text-center mt-5 italic">
              Same financial models. Fraction of the cost.
            </p>
          </div>
        </SectionFrame>

        <GoldDivider />

        {/* ═══════════════════════════════════════════════════════════
            3. HOW IT WORKS — 3-step vertical flow, gold connectors
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="how-it-works">
          <div
            ref={revealHowItWorks.ref}
            className={cn(
              "max-w-lg mx-auto transition-all duration-500 ease-out",
              revealHowItWorks.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <SectionHeader
              eyebrow="The Process"
              title={
                <>
                  HOW IT <span className="text-white">WORKS</span>
                </>
              }
            />

            <div className="relative">
              {/* Gold connector line */}
              <div
                className="absolute left-5 top-8 bottom-8 w-[2px]"
                style={{
                  background: "linear-gradient(180deg, var(--gold) 0%, rgba(212,175,55,0.20) 100%)",
                }}
              />

              <div className="space-y-8">
                {howItWorksSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className={cn(
                        "flex items-start gap-5 relative",
                        staggerChild(revealHowItWorks.visible)
                      )}
                      style={staggerDelay(i, revealHowItWorks.visible)}
                    >
                      {/* Step circle */}
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-gold/40 bg-bg-card relative z-10">
                        <Icon className="w-4.5 h-4.5 text-gold" />
                      </div>

                      <div className="pt-1">
                        <h3 className="font-bebas text-xl tracking-[0.06em] text-white mb-1">
                          {step.title.toUpperCase()}
                        </h3>
                        <p className="text-text-dim text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionFrame>

        <GoldDivider />

        {/* ═══════════════════════════════════════════════════════════
            4. PRODUCT CARDS — sharp edges, featured glow
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="products">
          <div
            ref={revealProducts.ref}
            className={cn(
              "max-w-4xl mx-auto transition-all duration-500 ease-out",
              revealProducts.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <SectionHeader
              icon={Package}
              eyebrow="Choose Your Package"
              title={
                <>
                  EVERYTHING YOU NEED TO{" "}
                  <span className="text-white">CLOSE</span>
                </>
              }
            />

            {/* Desktop: side by side */}
            <div className="hidden md:grid md:grid-cols-2 gap-5">
              {mainProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => handleBuy(product)}
                  visible={revealProducts.visible}
                  index={i}
                />
              ))}
            </div>

            {/* Mobile: featured first */}
            <div className="md:hidden space-y-5">
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
              <div className="mt-5 border border-gold/20 bg-gold/[0.03] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="px-2 py-0.5 text-[9px] tracking-[0.12em] uppercase font-bold text-gold border border-gold/30 flex-shrink-0">
                    Add-on
                  </span>
                  <span className="font-bebas text-lg tracking-[0.06em] text-white truncate">
                    {addOnProduct.name.toUpperCase()}
                  </span>
                </div>
                <span className="text-gold font-mono text-sm font-medium flex-shrink-0">
                  Add for $49 at checkout
                </span>
              </div>
            )}

            {/* 5. Compare packages link */}
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/store/compare")}
                className="text-text-dim text-sm hover:text-gold transition-colors tracking-wider"
              >
                Compare packages side by side →
              </button>
            </div>
          </div>
        </SectionFrame>

        <GoldDivider />

        {/* ═══════════════════════════════════════════════════════════
            6. FAQ
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="faq" alt>
          <div
            ref={revealFaq.ref}
            className={cn(
              "max-w-2xl mx-auto transition-all duration-500 ease-out",
              revealFaq.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <SectionHeader
              icon={HelpCircle}
              eyebrow="Common Questions"
              title={
                <>
                  WHAT FILMMAKERS <span className="text-white">ASK</span>
                </>
              }
            />
            <div className="bg-bg-card px-5 border border-border-subtle">
              <Accordion type="single" collapsible className="w-full">
                {storeFaqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`faq-${i}`}>
                    <AccordionTrigger className="font-bebas text-xl tracking-[0.06em] uppercase text-gold hover:text-gold/70 hover:no-underline text-left">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-text-dim text-sm leading-relaxed normal-case font-sans">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Custom work prompt */}
            <div className="mt-5 border border-border-subtle bg-bg-card p-5">
              <h3 className="font-bebas text-lg tracking-[0.08em] text-gold mb-2">
                NEED SOMETHING CUSTOM?
              </h3>
              <p className="text-text-mid text-sm leading-relaxed mb-3">
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
          </div>
        </SectionFrame>

        {/* ═══════════════════════════════════════════════════════════
            7. FOOTER
            ═══════════════════════════════════════════════════════════ */}
        <footer className="py-10 px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent mb-8" />
          <div className="max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-[340px] mx-auto">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 border border-white/[0.08] hover:border-gold/30"
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

            <div className="flex items-center justify-center mb-4">
              <span className="font-bebas text-3xl tracking-[0.2em] text-gold">
                FILMMAKER<span className="text-white">.OG</span>
              </span>
            </div>
            <p className="text-text-dim/60 text-xs tracking-wide leading-relaxed text-center">
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
