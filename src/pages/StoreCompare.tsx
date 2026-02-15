import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Minus } from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { mainProducts, comparisonSections } from "@/lib/store-products";

const tierKeys = ["theBlueprint", "thePitchPackage"] as const;

const StoreCompare = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <Header title="PACKAGES" />

      <main className="flex-1 animate-fade-in">
        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-sm text-text-dim hover:text-text-mid transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Packages
          </button>
        </div>

        {/* HEADER */}
        <section className="px-6 pt-8 pb-6 max-w-4xl mx-auto text-center">
          <h1 className="font-bebas text-3xl md:text-4xl tracking-[0.08em] text-white mb-3">
            COMPARE <span className="text-gold">PACKAGES</span>
          </h1>
          <p className="text-text-mid text-sm max-w-lg mx-auto">
            Both tiers are built from the same institutional-grade financial
            model. The difference is depth and deliverables.
          </p>
        </section>

        {/* COMPARISON TABLE */}
        <section className="px-4 pb-10 max-w-4xl mx-auto">
          <div className="overflow-x-auto rounded-xl border border-border-subtle bg-bg-card">
            <table className="w-full border-collapse">
              {/* Table Header */}
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
                    {/* Section header row */}
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

                    {/* Feature rows */}
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
        </section>

        {/* CTA ROW */}
        <section className="px-4 sm:px-6 pb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => navigate(`/store/${p.slug}`)}
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

          {/* Anchoring reminder */}
          <p className="text-text-dim text-xs text-center mt-6 italic">
            What a finance consultant charges to build these materials:
            $10,000–$30,000
          </p>
        </section>
      </main>
    </div>
  );
};

export default StoreCompare;
