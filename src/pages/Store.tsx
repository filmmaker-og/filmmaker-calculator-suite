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
} from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { products, comparisonSections, type Product } from "@/lib/store-products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ═══════════════════════════════════════════════════════════════════
   SHARE CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */
const SHARE_URL = "https://filmmaker.og";
const SHARE_TEXT =
  "Before you sign a deal, see exactly who gets paid and what's left for you. Free film finance tool — no account required.";
const SHARE_TITLE = "FILMMAKER.OG — See Where Every Dollar Goes";

/* ═══════════════════════════════════════════════════════════════════
   FAQ DATA — Store-specific
   ═══════════════════════════════════════════════════════════════════ */
const storeFaqs = [
  {
    q: "How fast do I get my files?",
    a: "Your files are generated instantly after purchase. Download immediately from your confirmation page.",
  },
  {
    q: "Can I use these for multiple projects?",
    a: "The Export and Pitch Package are generated from your current calculator inputs — one project per purchase. The Working Model includes a reusable Excel template you can use across unlimited future projects.",
  },
  {
    q: "What if I want to upgrade later?",
    a: "Contact us and we'll apply what you've already paid toward the higher tier.",
  },
  {
    q: "Do I need to re-enter my data?",
    a: "No. Your exports are generated directly from the financial model you already built in the calculator. Every number carries over automatically.",
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
    cost: "$97–$397",
    label: "filmmaker.og",
    desc: "Instant. Professional. Yours.",
    featured: true,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER — Matches Index.tsx pattern exactly
   ═══════════════════════════════════════════════════════════════════ */
const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  plainSubtitle,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  plainSubtitle?: boolean;
}) => (
  <div className="text-center mb-8">
    <div className="flex items-center gap-2 justify-center mb-3">
      {Icon && <Icon className="w-5 h-5 text-gold" />}
      <p className="text-text-dim text-xs tracking-[0.3em] uppercase font-semibold">
        {eyebrow}
      </p>
    </div>
    <h2 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-gold">
      {title}
    </h2>
    {subtitle && (
      <p
        className={cn(
          "text-center max-w-lg mx-auto mt-4 leading-relaxed",
          plainSubtitle
            ? "text-text-mid text-sm"
            : "text-text-mid text-sm px-4 py-2.5 rounded-xl bg-gold/[0.06] border border-gold/20"
        )}
      >
        {subtitle}
      </p>
    )}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   SECTION FRAME — Gold accent border on every section
   ═══════════════════════════════════════════════════════════════════ */
const SectionFrame = ({
  id,
  children,
  className,
  alt,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
}) => (
  <section id={id} className="px-4 py-6">
    <div className="flex rounded-2xl overflow-hidden border border-white/[0.06]">
      <div
        className="w-1 flex-shrink-0 bg-gradient-to-b from-gold via-gold/60 to-gold/20"
        style={{ boxShadow: "0 0 16px rgba(212,175,55,0.30)" }}
      />
      <div
        className={cn(
          "flex-1 min-w-0",
          alt ? "bg-bg-surface" : "bg-bg-elevated",
          className
        )}
      >
        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  </section>
);

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
   PRODUCT CARD
   ═══════════════════════════════════════════════════════════════════ */
const ProductCard = ({
  product,
  onBuy,
  onDetails,
  visible,
  index,
}: {
  product: Product;
  onBuy: () => void;
  onDetails: () => void;
  visible: boolean;
  index: number;
}) => {
  const isFeatured = product.featured;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl p-6 transition-all",
        staggerChild(visible),
        isFeatured
          ? "border-2 border-gold bg-[#141414] shadow-[0_0_40px_rgba(212,175,55,0.12)] md:scale-[1.03] md:z-10 relative"
          : "border border-[#2A2A2A] bg-[#141414]"
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

      {/* CTA Button — translucent gold system */}
      <button
        onClick={onBuy}
        className={cn(
          "w-full h-14 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96] mb-3",
          isFeatured
            ? "bg-gold/[0.22] border-2 border-gold/60 text-gold text-base animate-cta-glow-soft hover:border-gold/80 hover:bg-gold/[0.28]"
            : "bg-gold/[0.12] border-2 border-gold/40 text-gold text-sm hover:border-gold/60 hover:bg-gold/[0.18]"
        )}
      >
        {isFeatured
          ? `Get The Pitch Package — $${product.price}`
          : product.slug === "the-export"
            ? `Get My Export — $${product.price}`
            : `Get The Working Model — $${product.price}`}
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
const tierKeys = ["theExport", "thePitchPackage", "theWorkingModel"] as const;

/* ═══════════════════════════════════════════════════════════════════
   MAIN STORE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Store = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
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
  const mobileProducts = [...products].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  );

  const handleCopyLink = useCallback(() => {
    navigator.clipboard
      .writeText(`${SHARE_TEXT}\n\n${SHARE_URL}`)
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
          url: SHARE_URL,
        });
        return;
      } catch {}
    }
    handleCopyLink();
  }, [handleCopyLink]);

  /* ─── SUCCESS / CONFIRMATION VIEW ─── */
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-bg-void flex flex-col">
        <Header title="CONFIRMED" />
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
                className="w-full h-14 rounded-md border-2 border-gold/40 bg-gold/[0.12] text-gold text-sm font-bold tracking-[0.12em] uppercase hover:border-gold/60 hover:bg-gold/[0.18] transition-all active:scale-[0.96]"
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
      <Header title="PACKAGES" />

      <main className="flex-1 animate-fade-in">
        {/* ═══════════════════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 pt-10 pb-8 max-w-3xl mx-auto text-center">
          <h1 className="font-bebas text-[clamp(2rem,7vw,3.2rem)] leading-[1.05] mb-4">
            <span className="text-gold">YOUR NUMBERS.</span>{" "}
            <span className="text-white">PRESENTATION-READY.</span>
          </h1>
          <p className="text-text-mid text-sm leading-relaxed max-w-lg mx-auto mb-6">
            You built the model. Now export it in the format that matches your
            next move.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-3 rounded-md border-2 border-gold/50 bg-gold/[0.12] text-gold text-sm font-bold tracking-[0.12em] uppercase hover:border-gold/60 hover:bg-gold/[0.18] transition-all active:scale-[0.96]"
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
                          : "bg-bg-elevated border border-[#2A2A2A]"
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
            PRODUCT GRID
            ═══════════════════════════════════════════════════════════ */}
        <SectionFrame id="products" alt>
          <div
            ref={revealProducts.ref}
            className={cn(
              "max-w-5xl mx-auto transition-all duration-500 ease-out",
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

            {/* Desktop: original order (Export / Pitch / Working Model) */}
            <div className="hidden md:grid md:grid-cols-3 gap-5">
              {products.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => navigate(`/store/${product.slug}`)}
                  onDetails={() => navigate(`/store/${product.slug}`)}
                  visible={revealProducts.visible}
                  index={i}
                />
              ))}
            </div>

            {/* Mobile: featured product first */}
            <div className="md:hidden space-y-5">
              {mobileProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onBuy={() => navigate(`/store/${product.slug}`)}
                  onDetails={() => navigate(`/store/${product.slug}`)}
                  visible={revealProducts.visible}
                  index={i}
                />
              ))}
            </div>
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
              "max-w-5xl mx-auto transition-all duration-500 ease-out",
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
              subtitle="Every tier is built from the same institutional-grade financial model. The difference is depth, format, and flexibility."
            />

            <div className="overflow-x-auto rounded-xl border border-[#2A2A2A] bg-[#141414]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-text-dim text-[10px] font-sans font-semibold tracking-wider p-3 border-b border-[#2A2A2A] min-w-[160px]">
                      Feature
                    </th>
                    {products.map((p) => (
                      <th
                        key={p.id}
                        className={cn(
                          "p-3 text-center border-b border-[#2A2A2A] min-w-[120px]",
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
                              Most Popular
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
                      {/* Section header row */}
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 pt-5 pb-2 border-b border-[#2A2A2A]"
                        >
                          <span className="font-bebas text-sm tracking-[0.1em] text-gold uppercase">
                            {section.title}
                          </span>
                        </td>
                      </tr>

                      {/* Feature rows */}
                      {section.features.map((feature) => (
                        <tr
                          key={feature.label}
                          className="border-b border-[#2A2A2A]/50"
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/store/${p.slug}`)}
                  className={cn(
                    "h-14 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96]",
                    p.featured
                      ? "bg-gold/[0.22] border-2 border-gold/60 text-gold text-base hover:border-gold/80 hover:bg-gold/[0.28]"
                      : "bg-gold/[0.08] border-2 border-gold/40 text-gold text-sm hover:border-gold/60 hover:bg-gold/[0.18]"
                  )}
                >
                  {p.slug === "the-export"
                    ? `Get My Export — $${p.price}`
                    : p.featured
                      ? `Get The Pitch Package — $${p.price}`
                      : `Get The Working Model — $${p.price}`}
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
            <div className="bg-[#141414] rounded-xl px-5 border border-[#2A2A2A]">
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
                  className="w-full max-w-[320px] h-16 text-base font-bold tracking-[0.14em] transition-all active:scale-[0.96] rounded-md bg-gold/[0.18] border-2 border-gold/50 text-gold hover:border-gold/70 hover:bg-gold/[0.22]"
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
