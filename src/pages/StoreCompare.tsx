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
      <XIcon className="w-3.5 h-3.5 mx-auto text-ink-secondary/30" />
    );
  }
  return (
    <span className={cn("text-[12px] leading-snug", featured ? "text-white" : "text-ink-body")}>
      {value}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   STORE COMPARE PAGE
   ═══════════════════════════════════════════════════════════════════ */
const StoreCompare = () => {
  const navigate = useNavigate();
  const blueprint = mainProducts.find((p) => p.id === "the-blueprint");
  const pitchPackage = mainProducts.find((p) => p.id === "the-pitch-package");
  const marketCase = mainProducts.find((p) => p.id === "the-market-case");

  return (
    <div className="min-h-screen bg-black flex flex-col grain-overlay">
      <main className="flex-1 animate-fade-in">
        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-[14px] text-ink-secondary hover:text-ink-body transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>
        </div>

        <section id="compare" className="px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-ink-secondary text-[12px] tracking-[0.2em] uppercase text-center mb-2 font-semibold">
              Side by Side
            </p>
            <h2 className="font-bebas text-3xl tracking-[0.06em] text-gold text-center mb-8">
              COMPARE <span className="text-white">PACKAGES</span>
            </h2>

            {/* Column headers */}
            <div className="overflow-x-auto">
              <table className="store-compare-table w-full">
                <thead>
                  <tr>
                    <th className="text-left" />
                    <th>
                      <div className="flex flex-col items-center gap-1">
                        <span>{blueprint?.name}</span>
                        <span className="font-mono text-ink-body text-[14px] font-medium">
                          ${blueprint?.price.toLocaleString()}
                        </span>
                      </div>
                    </th>
                    <th className="featured-col">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-gold">{pitchPackage?.name}</span>
                        <span className="font-mono text-gold text-[14px] font-medium">
                          ${pitchPackage?.price.toLocaleString()}
                        </span>
                      </div>
                    </th>
                    <th>
                      <div className="flex flex-col items-center gap-1">
                        <span>{marketCase?.name}</span>
                        <span className="font-mono text-ink-body text-[14px] font-medium">
                          ${marketCase?.price.toLocaleString()}
                        </span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonSections.map((section) => (
                    <>
                      <tr key={`section-${section.title}`}>
                        <td
                          colSpan={4}
                          className="!text-left !text-gold !text-[11px] !tracking-[0.15em] !uppercase !font-bold !pt-6 !pb-2 !border-b-0"
                        >
                          {section.title}
                        </td>
                      </tr>
                      {section.features.map((feat) => (
                        <tr key={feat.label}>
                          <td>{feat.label}</td>
                          <td>
                            <FeatureCell value={feat.theBlueprint} />
                          </td>
                          <td className="featured-col">
                            <FeatureCell value={feat.thePitchPackage} featured />
                          </td>
                          <td>
                            <FeatureCell value={feat.theMarketCase} />
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <button
                onClick={() => navigate("/store#products")}
                className="h-12 text-[14px] btn-cta-secondary"
              >
                START WITH THE BLUEPRINT
              </button>
              <button
                onClick={() => navigate("/store#products")}
                className="h-12 text-[14px] btn-cta-primary"
              >
                GET THE PITCH PACKAGE
              </button>
              <button
                onClick={() => navigate("/store#products")}
                className="h-12 text-[14px] btn-cta-secondary"
              >
                GET THE FULL PACKAGE
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StoreCompare;
