import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Check,
  Minus,
  Gavel,
  Calculator,
  HelpCircle,
  Award,
  Package,
  Layers,
  Mail,
  Instagram,
  Share2,
  Link2,
  ChevronDown,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import {
  mainProducts,
  addOnProduct,
  comparisonSections,
  type Product,
} from "@/lib/store-products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from "@/lib/constants";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA — Store-specific
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
    a: "It's a live, formula-driven Excel workbook. Change any input and every downstream calculation updates instantly. It's the engine behind your finance plan — reusable across unlimited future projects.",
  },
  {
    q: "Can I upgrade later?",
    a: "Contact us and we'll apply what you've already paid toward the higher tier.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   TRUST ANCHOR DATA
   ═══════════════════════════════════════════════════════════════════ */
const trustColumns = [
  {
    icon: Gavel,
    cost: "$5,000–$15,000",
    label: "Entertainment Lawyer",
    desc: "To build your financial model",
    featured: false,
  },
  {
    icon: Calculator,
    cost: "$10,000–$30,000",
    label: "Finance Consultant",
    desc: "To prepare investor materials",
    featured: false,
  },
  {
    icon: Check,
    cost: "$197–$497",
    label: "filmmaker.og",
    desc: "Professional. 24-hour delivery.",
    featured: true,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   GOLD DIVIDER — Between every section
   ═══════════════════════════════════════════════════════════════════ */
const GoldDivider = () => (
  <div className="px-8">
    <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION REVEAL — one-shot slide-up (IntersectionObserver)
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

/** Stagger delay style for children within a visible section */
const staggerDelay = (
  index: number,
  visible: boolean
): React.CSSProperties => ({
  transitionDelay: visible ? `${index * 120}ms` : "0ms",
});

/** Class for stagger-animated child items */
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
}: {
  baseProduct: Product;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    />
    {/* Modal */}
    <div className="relative w-full max-w-md rounded-xl border border-gold/30 bg-bg-header p-6 space-y-5 animate-fade-in">
      <button
        onClick={onClose}
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
          className="w-full h-14 text-base btn-cta-primary"
        >
          Yes, Add for $49
        </button>
        <button
          onClick={onDecline}
          className="w-full text-center text-text-dim text-sm hover:text-text-mid transition-colors py-2"
        >
          No thanks, continue
        </button>
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
  onDetails,
  visible,
  index,
  workingModelSelected,
}: {
  product: Product;
  onBuy: () => void;
  onDetails: () => void;
  visible: boolean;
  index: number;
  workingModelSelected: boolean;
}) => {
  const isFeatured = product.featured;
  const addOnPrice = workingModelSelected ? 99 : 0;
  const totalPrice = product.price + addOnPrice;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl p-6 transition-all",
        staggerChild(visible),
        isFeatured
          ? "border-2 border-gold bg-bg-card shadow-[0_0_40px_rgba(212,175,55,0.12)] md:scale-[1.03] md:z-10 relative"
          : "border border-border-subtle bg-bg-card"
      )}
      style={staggerDelay(index, visible)}
    >
      {/* Badge */}
      {product.badge && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1.5 rounded-full bg-gold/[0.15] border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-bold">
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
            isFeatured ? "text-4xl" : "text-3xl"
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

      {/* CTA Button */}
      <button
        onClick={onBuy}
        className={cn(
          "w-full h-14 mb-3",
          isFeatured
            ? "text-base btn-cta-primary"
            : "text-sm btn-cta-secondary"
        )}
      >
        {workingModelSelected
          ? `Get ${product.name} — $${totalPrice}`
          : isFeatured
            ? `Get The Pitch Package — $${product.price}`
            : `Get The Blueprint — $${product.price}`}
      </button>

      {/* Details link */}
      <button
        onClick={onDetails}
        className="text-text-dim text-xs tracking-wider hover:text-text-mid transition-colors text-center"
      >
        See full details →
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   COMPARISON TABLE TIER KEYS
   ═══════════════════════════════════════════════════════════════════ */
const tierKeys = ["theBlueprint", "thePitchPackage"] as const;

/* ═══════════════════════════════════════════════════════════════════
   MAIN STORE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Store = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [workingModelSelected, setWorkingModelSelected] = useState(false);
  const [showPopup, setShowPopup] = useState<Product | null>(null);
  const [purchasedEmail] = useState(() => {
    try {
      return localStorage.getItem("filmmaker_og_purchase_email") || "";
    } catch {
      return "";
    }
  });

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  // Reveal refs
  const revealTrust = useReveal();
  const revealProducts = useReveal();
  const revealCompare = useReveal();
  const revealFaq = useReveal();

  // Mobile-sorted products: featured first
  const mobileProducts = [...mainProducts].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

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

  const handleBuy = (product: Product) => {
    if (workingModelSelected) {
      // Working Model already selected at full price — go straight to checkout
      navigate(`/store/${product.slug}?addon=the-working-model`);
    } else {
      // Show Working Model popup
      setShowPopup(product);
    }
  };

  const handlePopupAccept = () => {
    if (!showPopup) return;
    // Bundle: base + discounted Working Model
    navigate(`/store/${showPopup.slug}?addon=the-working-model-discount`);
    setShowPopup(null);
  };

  const handlePopupDecline = () => {
    if (!showPopup) return;
    // Base product only
    navigate(`/store/${showPopup.slug}`);
    setShowPopup(null);
  };

  /* ─── SUCCESS / CONFIRMATION VIEW ─── */
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-bg-void flex flex-col">
        <Header />
        <main className="flex-1 px-6 py-16 flex items-center justify-center animate-fade-in">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 border-2 border-gold mx-auto mb-6 rounded-lg flex items-center justify-center">
              <Check className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-bebas text-4xl text-text-primary mb-4">
              YOUR PURCHASE IS CONFIRMED
            </h1>
            <p className="text-text-mid text-sm leading-relaxed mb-2">
              Thank you for your purchase.
            </p>
            <p className="text-text-mid text-sm leading-relaxed mb-8">
              Your files are being prepared and will be delivered
              {purchasedEmail ? (
                <>
                  {" "}
                  to{" "}
                  <span className="text-white font-semibold">
                    {purchasedEmail}
                  </span>
                </>
              ) : null}{" "}
              within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/calculator")}
                className="w-full h-14 text-sm btn-cta-secondary"
              >
                Return to Calculator
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* ─── MAIN STORE VIEW ─── */
  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <Header />

      {/* Working Model Popup */}
      {showPopup && (
        <WorkingModelPopup
          baseProduct={showPopup}
          onAccept={handlePopupAccept}
          onDecline={handlePopupDecline}
          onClose={() => setShowPopup(null)}
        />
      )}

      <main className="flex-1 animate-fade-in">
        {/* ═══════════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 pt-10 pb-8 max-w-3xl mx-auto text-center">
          <h1 className="font-bebas text-[clamp(2rem,7vw,3.2rem)] leading-[1.05] mb-4">
            <span className="text-gold">YOUR FINANCE PLAN.</span>{" "}
            <span className="text-white">BUILT FOR YOU.</span>
          </h1>
          <p className="text-text-mid text-sm leading-relaxed max-w-lg mx-auto mb-6">
            Tell us about your project. We build your complete finance plan —
            delivered within 24 hours.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 text-sm btn-cta-secondary"
          >
            SEE PACKAGES
          </button>
          <div
            className="mt-6 flex justify-center animate-bounce-subtle cursor-pointer active:scale-[0.97]"
            onClick={() =>
              document
                .getElementById("trust")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ChevronDown className="w-5 h-5 text-gold/60" />
          </div>
        </section>

        <GoldDivider />

        {/* ═══════════════════════════════════════════════════════════
            TRUST ANCHOR — "What This Costs Everywhere Else"
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="trust">
          <div
            ref={revealTrust.ref}
            className={cn(
              "max-w-2xl mx-auto transition-all duration-500 ease-out",
              revealTrust.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <SectionHeader
              icon={Award}
              eyebrow="The Industry Standard"
              title={
                <>
                  WHAT THIS COSTS{" "}
                  <span className="text-white">EVERYWHERE ELSE</span>
                </>
              }
              plainSubtitle
              subtitle="Professional investor materials typically require a finance consultant or entertainment attorney. Here's what they charge."
            />
            <div className="grid grid-cols-3 gap-4 text-center">
              {trustColumns.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={staggerChild(revealTrust.visible)}
                    style={staggerDelay(i, revealTrust.visible)}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3",
                        item.featured
                          ? "bg-gold/[0.06] border border-gold/20"
                          : "bg-bg-elevated border border-border-subtle"
                      )}
                    >
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <p
                      className={cn(
                        "font-mono text-lg font-medium",
                        item.featured
                          ? "text-gold"
                          : "text-text-primary line-through decoration-text-dim/30"
                      )}
                    >
                      {item.cost}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] tracking-wider uppercase mt-1",
                        item.featured
                          ? "text-gold font-semibold"
                          : "text-text-dim"
                      )}
                    >
                      {item.label}
                    </p>
                    <p className="text-text-dim text-[10px] mt-1 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionFrame>

        <GoldDivider />

        {/* ═══════════════════════════════════════════════════════════
            PRODUCT GRID — Two main products
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="products" alt>
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
                  onDetails={() => navigate(`/store/${product.slug}`)}
                  visible={revealProducts.visible}
                  index={i}
                  workingModelSelected={workingModelSelected}
                />
              ))}
            </div>

            {/* Mobile: featured product first */}
            <div className="md:hidden space-y-5">
              {mobileProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => handleBuy(product)}
                  onDetails={() => navigate(`/store/${product.slug}`)}
                  visible={revealProducts.visible}
                  index={i}
                  workingModelSelected={workingModelSelected}
                />
              ))}
            </div>

            {/* ADD-ON: The Working Model */}
            {addOnProduct && (
              <div
                className={cn(
                  "mt-5 rounded-xl p-5 transition-all cursor-pointer",
                  workingModelSelected
                    ? "border-2 border-gold bg-gold/[0.06]"
                    : "border border-border-subtle bg-bg-card hover:border-gold/30"
                )}
                onClick={() => setWorkingModelSelected(!workingModelSelected)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[9px] tracking-[0.12em] uppercase font-bold text-text-dim border border-white/10">
                        Add-on
                      </span>
                      <h3 className="font-bebas text-lg tracking-[0.06em] text-white">
                        {addOnProduct.name.toUpperCase()}
                      </h3>
                    </div>
                    <p className="text-text-dim text-sm leading-relaxed">
                      {addOnProduct.shortDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-2xl font-medium text-white">
                      ${addOnProduct.price}
                    </span>
                    <div
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center transition-all",
                        workingModelSelected
                          ? "border-gold bg-gold"
                          : "border-white/20 bg-transparent"
                      )}
                    >
                      {workingModelSelected && (
                        <Check className="w-4 h-4 text-black" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SectionFrame>

        <GoldDivider />

        {/* ═══════════════════════════════════════════════════════════
            INLINE COMPARISON TABLE
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="compare">
          <div
            ref={revealCompare.ref}
            className={cn(
              "max-w-4xl mx-auto transition-all duration-500 ease-out",
              revealCompare.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <SectionHeader
              icon={Layers}
              eyebrow="Side by Side"
              title={
                <>
                  COMPARE <span className="text-white">PACKAGES</span>
                </>
              }
              plainSubtitle
              subtitle="Both tiers are built from the same institutional-grade financial model. The difference is depth and deliverables."
            />

            <div className="overflow-x-auto rounded-xl border border-border-subtle bg-bg-card">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-text-dim text-[10px] font-sans font-semibold tracking-wider p-3 border-b border-border-subtle min-w-[160px]">
                      Feature
                    </th>
                    {mainProducts.map((p) => (
                      <th
                        key={p.id}
                        className={cn(
                          "p-3 text-center border-b border-border-subtle min-w-[120px]",
                          p.featured && "bg-gold/[0.04]"
                        )}
                      >
                        <button
                          onClick={() => navigate(`/store/${p.slug}`)}
                          className="hover:text-gold transition-colors"
                        >
                          <span className="font-bebas text-sm tracking-wider text-white block">
                            {p.name.toUpperCase()}
                          </span>
                          <span
                            className={cn(
                              "font-mono text-xs",
                              p.featured ? "text-gold" : "text-text-dim"
                            )}
                          >
                            ${p.price}
                          </span>
                          {p.featured && (
                            <span className="block text-[8px] tracking-[0.15em] uppercase text-gold font-bold mt-1">
                              Recommended
                            </span>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {comparisonSections.map((section) => (
                    <React.Fragment key={`section-${section.title}`}>
                      <tr>
                        <td
                          colSpan={3}
                          className="px-3 pt-5 pb-2 border-b border-border-subtle"
                        >
                          <span className="font-bebas text-sm tracking-[0.1em] text-gold uppercase">
                            {section.title}
                          </span>
                        </td>
                      </tr>

                      {section.features.map((feature) => (
                        <tr
                          key={feature.label}
                          className="border-b border-border-subtle/50"
                        >
                          <td className="px-3 py-2.5 text-text-dim text-[11px] leading-snug">
                            {feature.label}
                          </td>
                          {tierKeys.map((tier) => {
                            const val = feature[tier];
                            const isFeaturedCol = tier === "thePitchPackage";
                            return (
                              <td
                                key={tier}
                                className={cn(
                                  "px-3 py-2.5 text-center",
                                  isFeaturedCol && "bg-gold/[0.04]"
                                )}
                              >
                                {val === true ? (
                                  <Check className="w-4 h-4 text-gold mx-auto" />
                                ) : val === false ? (
                                  <Minus className="w-3.5 h-3.5 text-white/10 mx-auto" />
                                ) : (
                                  <span className="text-text-primary text-[11px] leading-snug">
                                    {val}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTA row below table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {mainProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleBuy(p)}
                  className={cn(
                    "h-14",
                    p.featured
                      ? "text-base btn-cta-primary"
                      : "text-sm btn-cta-secondary"
                  )}
                >
                  {p.featured
                    ? `Get The Pitch Package — $${p.price}`
                    : `Get The Blueprint — $${p.price}`}
                </button>
              ))}
            </div>
          </div>
        </SectionFrame>

        <GoldDivider />

        {/* ═══════════════════════════════════════════════════════════
            FAQ
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
            <div className="bg-bg-card rounded-xl px-5 border border-border-subtle">
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
          </div>
        </SectionFrame>

        {/* ═══════════════════════════════════════════════════════════
            FINAL CTA — matching Index.tsx pattern
            ═══════════════════════════════════════════════════════════ */}
        <section id="final-cta" className="py-8 px-4">
          <div className="flex rounded-2xl overflow-hidden border border-white/[0.06]">
            <div
              className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20"
              style={{ boxShadow: "0 0 16px rgba(212,175,55,0.30)" }}
            />
            <div className="bg-bg-elevated flex-1 min-w-0 overflow-hidden relative">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  width: "100%",
                  height: "100%",
                  background: `radial-gradient(ellipse 60% 60% at 50% 10%, rgba(212,175,55,0.08) 0%, transparent 70%)`,
                }}
              />
              <div className="relative p-8 md:p-12 max-w-md mx-auto text-center">
                <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold mb-4">
                  YOUR NEXT INVESTOR MEETING SHOULDN'T BE THE FIRST TIME YOU SEE
                  YOUR OWN <span className="text-white">WATERFALL</span>.
                </h2>
                <p className="text-text-mid text-sm leading-relaxed max-w-xs mx-auto mb-6">
                  Walk in with institutional-grade materials — or don't walk in
                  at all.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("products")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full max-w-[320px] h-16 text-base btn-cta-primary"
                >
                  GET YOUR PACKAGE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER — matching Index.tsx
            ═══════════════════════════════════════════════════════════ */}
        <footer className="py-10 px-6">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/25 to-transparent mb-8" />
          <div className="max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-3 mb-8 max-w-[340px] mx-auto">
              <a
                href="mailto:thefilmmaker.og@gmail.com"
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
              <a
                href="https://www.instagram.com/filmmaker.og"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 text-sm tracking-wider text-gold/70 hover:text-gold transition-colors active:scale-[0.97] py-3.5 rounded-lg border border-white/[0.08] hover:border-gold/30"
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
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
