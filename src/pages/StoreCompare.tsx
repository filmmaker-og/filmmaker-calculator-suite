import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X as XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  mainProducts,
  comparisonSections,
  type FeatureValue,
} from "@/lib/store-products";


/* ═══════════════════════════════════════════════════════════════════
   FEATURE VALUE CELL
   ═══════════════════════════════════════════════════════════════════ */
const FeatureCell = ({
  value,
  featured,
}: {
  value: FeatureValue;
  featured?: boolean;
}) => {
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
   STORE COMPARE PAGE — three-column comparison
   ═══════════════════════════════════════════════════════════════════ */
const StoreCompare = () => {
  const navigate = useNavigate();
  const blueprint = mainProducts.find((p) => p.id === "the-blueprint");
  const pitchPackage = mainProducts.find((p) => p.id === "the-pitch-package");
  const marketCase = mainProducts.find((p) => p.id === "the-market-case");

  return (
    <div className="min-h-screen bg-black flex flex-col grain-overlay">
      <main className="flex-1" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-md mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-[14px] text-ink-secondary hover:text-ink-body transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>
        </div>

        <section id="compare" className="py-14 md:py-20 px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-bebas text-[40px] tracking-[0.08em] text-gold">
                COMPARE <span className="text-white">PACKAGES</span>
              </h1>
            </div>

            {/* Comparison table */}
            <div
              className="border border-gold-border bg-black overflow-hidden rounded-xl"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
            >
              {/* Column headers */}
              <div className="grid grid-cols-4 gap-0 px-3 py-4 border-b border-bg-card-rule">
                <div /> {/* empty label col */}
                <div className="text-center">
                  <p className="font-bebas text-[12px] tracking-[0.06em] text-white leading-tight">
                    {blueprint?.name.toUpperCase()}
                  </p>
                  <p className="font-mono text-[12px] text-ink-secondary mt-0.5">
                    ${blueprint?.price}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bebas text-[12px] tracking-[0.06em] text-gold leading-tight">
                    {pitchPackage?.name.toUpperCase()}
                  </p>
                  <p className="font-mono text-[12px] text-gold mt-0.5">
                    ${pitchPackage?.price}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-bebas text-[12px] tracking-[0.06em] text-white leading-tight">
                    {marketCase?.name.toUpperCase()}
                  </p>
                  <p className="font-mono text-[12px] text-ink-secondary mt-0.5">
                    ${marketCase?.price.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Sections + rows */}
              {comparisonSections.map((section) => (
                <div key={section.title}>
                  {/* Section label */}
                  <div className="px-3 pt-5 pb-2">
                    <span className="font-mono text-[12px] tracking-[0.15em] uppercase text-gold font-bold">
                      {section.title}
                    </span>
                  </div>

                  {/* Feature rows */}
                  {section.features.map((feat) => (
                    <div
                      key={feat.label}
                      className="grid grid-cols-4 gap-0 px-3 py-3 border-t border-bg-card-rule items-center"
                    >
                      <span className="text-[12px] text-ink-secondary leading-snug pr-2">
                        {feat.label}
                      </span>
                      <div className="text-center">
                        <FeatureCell value={feat.theBlueprint} />
                      </div>
                      <div className="text-center">
                        <FeatureCell value={feat.thePitchPackage} featured />
                      </div>
                      <div className="text-center">
                        <FeatureCell value={feat.theMarketCase} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="space-y-3 mt-8">
              <button
                onClick={() => navigate("/store#products")}
                className="w-full h-14 btn-cta-primary animate-cta-glow-pulse"
              >
                CHOOSE YOUR PACKAGE
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
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

export default StoreCompare;
