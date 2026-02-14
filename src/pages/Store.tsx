import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Check,
  ArrowRight,
  Minus,
  Gavel,
  Calculator,
  HelpCircle,
} from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { products, type Product } from "@/lib/store-products";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
   PRODUCT CARD
   ═══════════════════════════════════════════════════════════════════ */
const ProductCard = ({
  product,
  onBuy,
  onDetails,
}: {
  product: Product;
  onBuy: () => void;
  onDetails: () => void;
}) => {
  const isFeatured = product.featured;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl p-6 transition-all",
        isFeatured
          ? "border-2 border-gold bg-[#141414] shadow-[0_0_40px_rgba(212,175,55,0.08)]"
          : "border border-[#2A2A2A] bg-[#141414]"
      )}
    >
      {/* Badge */}
      {product.badge && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full bg-gold text-black text-[10px] tracking-[0.15em] uppercase font-bold">
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
        <span className={cn("font-mono text-3xl font-medium", isFeatured ? "text-white" : "text-white")}>
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
          "w-full py-3.5 rounded-md text-sm font-bold tracking-[0.1em] uppercase transition-all active:scale-[0.96] mb-3",
          isFeatured
            ? "bg-gold-cta text-black hover:bg-gold-cta/90"
            : "border-2 border-gold/50 bg-transparent text-gold hover:border-gold/70 hover:bg-gold/[0.06]"
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
   MAIN STORE COMPONENT
   ═══════════════════════════════════════════════════════════════════ */
const Store = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
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
                <> to <span className="text-white font-semibold">{purchasedEmail}</span></>
              ) : null}{" "}
              within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/calculator")}
                className="w-full py-3.5 rounded-md border-2 border-gold/50 text-gold text-sm font-bold tracking-[0.1em] uppercase hover:border-gold/70 hover:bg-gold/[0.06] transition-all active:scale-[0.96]"
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
            PAGE HEADER
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 pt-10 pb-8 max-w-3xl mx-auto text-center">
          <h1 className="font-bebas text-[clamp(2rem,7vw,3.2rem)] leading-[1.05] text-white mb-4">
            YOUR NUMBERS.{" "}
            <span className="text-gold">PRESENTATION-READY.</span>
          </h1>
          <p className="text-text-mid text-sm leading-relaxed max-w-lg mx-auto">
            You built the model. Now export it in the format that matches your
            next move.
          </p>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            THREE-TIER GRID
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 pb-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={() => navigate(`/store/${product.slug}`)}
                onDetails={() => navigate(`/store/${product.slug}`)}
              />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            COMPARE LINK
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 pb-10 max-w-5xl mx-auto text-center">
          <button
            onClick={() => navigate("/store/compare")}
            className="inline-flex items-center gap-2 text-text-dim hover:text-text-mid transition-colors"
          >
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">
              Not sure which one? Compare all packages
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TRUST / ANCHORING SECTION
            ═══════════════════════════════════════════════════════════ */}
        <section className="border-t border-[#2A2A2A] px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-bebas text-2xl md:text-3xl tracking-[0.08em] text-gold text-center mb-8">
              WHAT THIS WOULD COST ANYWHERE ELSE
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-[#2A2A2A] flex items-center justify-center mx-auto mb-3">
                  <Gavel className="w-4 h-4 text-gold" />
                </div>
                <p className="font-mono text-lg font-medium text-text-primary line-through decoration-text-dim/30">
                  $5,000–$15,000
                </p>
                <p className="text-text-dim text-[10px] tracking-wider uppercase mt-1">
                  Entertainment Lawyer
                </p>
                <p className="text-text-dim text-[10px] mt-1 leading-snug">
                  To build your financial model
                </p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-lg bg-bg-elevated border border-[#2A2A2A] flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-4 h-4 text-gold" />
                </div>
                <p className="font-mono text-lg font-medium text-text-primary line-through decoration-text-dim/30">
                  $10,000–$30,000
                </p>
                <p className="text-text-dim text-[10px] tracking-wider uppercase mt-1">
                  Finance Consultant
                </p>
                <p className="text-text-dim text-[10px] mt-1 leading-snug">
                  To prepare investor materials
                </p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-lg bg-gold/[0.06] border border-gold/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-4 h-4 text-gold" />
                </div>
                <p className="font-mono text-lg font-medium text-gold">
                  $97–$397
                </p>
                <p className="text-gold text-[10px] tracking-wider uppercase mt-1 font-semibold">
                  filmmaker.og
                </p>
                <p className="text-text-dim text-[10px] mt-1 leading-snug">
                  Instant. Professional. Yours.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            STORE FAQ
            ═══════════════════════════════════════════════════════════ */}
        <section className="border-t border-[#2A2A2A] px-6 py-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 justify-center mb-6">
              <HelpCircle className="w-5 h-5 text-gold" />
              <h2 className="font-bebas text-2xl tracking-[0.08em] text-gold">
                COMMON QUESTIONS
              </h2>
            </div>
            <div className="bg-[#141414] rounded-xl px-5 border border-[#2A2A2A]">
              <Accordion type="single" collapsible className="w-full">
                {storeFaqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`faq-${i}`}>
                    <AccordionTrigger className="font-bebas text-lg tracking-[0.06em] uppercase text-gold hover:text-gold/70 hover:no-underline text-left">
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
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER DISCLAIMER
            ═══════════════════════════════════════════════════════════ */}
        <footer className="border-t border-[#2A2A2A] py-8 mt-auto">
          <div className="px-6 text-center max-w-2xl mx-auto">
            <p className="text-text-dim/60 text-[10px] tracking-wide leading-relaxed">
              This document is generated by Filmmaker.OG for educational and
              informational purposes only. It does not constitute legal, tax,
              accounting, or investment advice. The financial projections
              contained herein are based on user-provided assumptions and should
              not be relied upon as guarantees of future performance. Consult a
              qualified entertainment attorney, accountant, and financial advisor
              before making any investment or financing decisions.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Store;
