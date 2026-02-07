import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Check,
  Download,
  Sparkles,
  Shield,
  ArrowRight,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { products } from "@/lib/store-products";

const Store = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  /* ─── SUCCESS VIEW ─── */
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="SUCCESS" />
        <main className="flex-1 px-6 py-16 flex items-center justify-center animate-fade-in">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 border-2 border-gold mx-auto mb-6 rounded-lg flex items-center justify-center">
              <Check className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-bebas text-4xl text-foreground mb-4">
              PAYMENT SUCCESSFUL
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Your purchase has been confirmed. Your professional export is
              now available from the Waterfall tab.
            </p>
            <Button
              onClick={() => navigate("/calculator?tab=waterfall")}
              className="btn-vault w-full py-4 min-h-[52px]"
            >
              <Download className="w-5 h-5 mr-2" />
              VIEW YOUR WATERFALL
            </Button>
          </div>
        </main>
      </div>
    );
  }

  /* ─── MAIN STORE VIEW ─── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="PACKAGES" />

      <main className="flex-1 animate-fade-in">
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "100vw",
              height: "500px",
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212, 175, 55, 0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative px-6 pt-10 pb-8 max-w-3xl mx-auto text-center">
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-6 font-semibold">
              Democratizing the Business of Film
            </p>

            <h1 className="font-bebas text-[clamp(2.2rem,8vw,3.5rem)] leading-[1.05] text-foreground mb-5">
              TURN YOUR NUMBERS
              <br />
              INTO A{" "}
              <span className="text-gold">DEAL</span>
            </h1>

            <p className="text-text-mid text-sm leading-relaxed max-w-lg mx-auto mb-8">
              Professional film finance documents that make investors take you
              seriously. The same materials entertainment lawyers charge{" "}
              <span className="text-white font-semibold">
                $5,000–$15,000
              </span>{" "}
              to produce.
            </p>

            <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/30 bg-gold/5 rounded-sm">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-[11px] tracking-[0.15em] uppercase font-semibold">
                Founders Pricing
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TRUST ANCHORING BAR
            ═══════════════════════════════════════════════════════════ */}
        <section className="border-y border-border-subtle bg-bg-elevated">
          <div className="px-6 py-6 max-w-3xl mx-auto">
            <p className="text-text-dim text-[10px] tracking-[0.2em] uppercase text-center mb-4 font-semibold">
              What Others Charge
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {[
                { label: "Entertainment Lawyer", cost: "$5K–$15K" },
                { label: "Finance Consultant", cost: "$10K–$30K" },
                { label: "Producer's Rep", cost: "$50K–$250K+" },
                { label: "Filmmaker.OG", cost: "From $197", highlight: true },
              ].map((item) => (
                <div key={item.label} className="py-2">
                  <p
                    className={cn(
                      "font-mono text-lg font-bold",
                      item.highlight
                        ? "text-gold-cta"
                        : "text-text-dim line-through decoration-text-dim/40"
                    )}
                  >
                    {item.cost}
                  </p>
                  <p className="text-text-dim text-[10px] tracking-wider uppercase mt-1">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            PACKAGE CARDS — Link to detail pages
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 py-10 max-w-5xl mx-auto">
          <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground text-center mb-2">
            CHOOSE YOUR PACKAGE
          </h2>
          <p className="text-text-dim text-xs text-center mb-8 max-w-md mx-auto">
            Every package is a one-time purchase. No subscriptions. No hidden
            fees.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {products.map((product) => {
              const Icon = product.icon;
              const isFeatured = !!product.featured;

              return (
                <button
                  key={product.id}
                  onClick={() => navigate(`/store/${product.slug}`)}
                  className={cn(
                    "flex flex-col text-left transition-all hover:scale-[1.01]",
                    isFeatured ? "store-card-featured store-card" : "store-card"
                  )}
                >
                  {/* Badge */}
                  {isFeatured && (
                    <div className="flex items-center gap-1.5 mb-4">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-1">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0",
                        isFeatured
                          ? "bg-gold/15 border border-gold/30"
                          : "bg-white/5 border border-white/10"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          isFeatured ? "text-gold" : "text-text-dim"
                        )}
                      />
                    </div>
                    <h3 className="font-bebas text-xl text-foreground leading-tight">
                      {product.name.toUpperCase()}
                    </h3>
                  </div>

                  {/* Tagline */}
                  <p className="text-text-dim text-[10px] tracking-[0.2em] uppercase mb-4">
                    {product.tagline}
                  </p>

                  {/* Price */}
                  <div className="mb-1">
                    {product.originalPrice && (
                      <span className="text-text-dim text-sm line-through mr-2">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={cn(
                        "font-mono text-3xl font-bold",
                        isFeatured ? "text-gold-cta" : "text-gold"
                      )}
                    >
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Founders badge */}
                  {product.originalPrice && (
                    <p className="text-gold text-[10px] tracking-[0.15em] uppercase font-semibold mb-3">
                      Founders Price
                    </p>
                  )}

                  {/* Access period */}
                  <p className="text-text-dim text-[11px] mb-5">
                    {product.accessLabel} unlimited access
                  </p>

                  {/* Description */}
                  <p className="text-text-mid text-sm leading-relaxed mb-1">
                    {product.description}
                  </p>
                  <p
                    className={cn(
                      "text-xs italic mb-5",
                      isFeatured ? "text-gold/70" : "text-text-dim"
                    )}
                  >
                    {product.hook}
                  </p>

                  {/* Divider */}
                  <div className="premium-divider mb-5" />

                  {/* Top features (first 3) */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        <Check
                          className={cn(
                            "w-3.5 h-3.5 mt-0.5 flex-shrink-0",
                            isFeatured ? "text-gold" : "text-text-dim"
                          )}
                        />
                        <span className="text-foreground text-[13px] leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                    {product.features.length > 3 && (
                      <li className="text-text-dim text-[11px] pl-6">
                        + {product.features.length - 3} more included
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto flex items-center gap-2 text-gold text-[11px] tracking-[0.15em] uppercase font-semibold">
                    View Details <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            COMPARE ALL LINK
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 pb-10 max-w-5xl mx-auto text-center">
          <button
            onClick={() => navigate("/store/compare")}
            className="inline-flex items-center gap-2 py-3 text-text-dim hover:text-gold transition-colors"
          >
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">
              Compare All Packages
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            TRUST SECTION
            ═══════════════════════════════════════════════════════════ */}
        <section className="border-t border-border-subtle bg-bg-elevated px-6 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <Shield className="w-6 h-6 text-gold mx-auto mb-4" />
            <h3 className="font-bebas text-xl tracking-[0.1em] text-foreground mb-3">
              WHO THIS IS FOR
            </h3>
            <p className="text-text-mid text-sm leading-relaxed max-w-lg mx-auto mb-6">
              You have a script and a vision. Maybe it's your first film, maybe
              your second. You don't have an entertainment lawyer on retainer.
              You don't have a sales agent. You've never built a waterfall.
            </p>
            <p className="text-text-mid text-sm leading-relaxed max-w-lg mx-auto mb-6">
              We give you the documents and the confidence to walk into any room
              and be taken seriously — even if it's your first time.
            </p>
            <div className="inline-flex items-center gap-2 text-gold text-[10px] tracking-[0.25em] uppercase font-semibold">
              <ArrowRight className="w-3 h-3" />
              Every Document. Presentation-Grade. Yours to Keep.
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FOOTER DISCLAIMER
            ═══════════════════════════════════════════════════════════ */}
        <footer className="border-t border-border-subtle py-8 mt-auto">
          <div className="px-6 text-center max-w-2xl mx-auto">
            <p className="text-text-dim text-[10px] tracking-wide leading-relaxed">
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
