import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X as XIcon } from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import {
  mainProducts,
  comparisonSections,
  type FeatureValue,
} from "@/lib/store-products";
import SectionFrame from "@/components/SectionFrame";
import SectionHeader from "@/components/SectionHeader";

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
      <Check className={cn("w-4 h-4 mx-auto", featured ? "text-gold" : "text-text-mid")} />
    ) : (
      <XIcon className="w-3.5 h-3.5 mx-auto text-text-dim/30" />
    );
  }
  return (
    <span className={cn("text-xs leading-snug", featured ? "text-text-primary" : "text-text-mid")}>
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

  return (
    <div className="min-h-screen bg-bg-void flex flex-col">
      <Header />

      <main className="flex-1 animate-fade-in">
        {/* BACK NAV */}
        <div className="px-6 pt-6 max-w-3xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-sm text-text-dim hover:text-text-mid transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>
        </div>

        <SectionFrame id="compare">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              eyebrow="Side by Side"
              title={
                <>
                  COMPARE <span className="text-white">PACKAGES</span>
                </>
              }
            />

            {/* Column headers */}
            <div className="overflow-x-auto">
              <table className="store-compare-table w-full">
                <thead>
                  <tr>
                    <th className="text-left" />
                    <th>
                      <div className="flex flex-col items-center gap-1">
                        <span>{blueprint?.name}</span>
                        <span className="font-mono text-text-mid text-sm font-medium">
                          ${blueprint?.price}
                        </span>
                      </div>
                    </th>
                    <th className="featured-col">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-gold">{pitchPackage?.name}</span>
                        <span className="font-mono text-gold text-sm font-medium">
                          ${pitchPackage?.price}
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
                          colSpan={3}
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
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => navigate("/store#products")}
                className="h-12 text-sm btn-cta-secondary"
              >
                START WITH THE BLUEPRINT
              </button>
              <button
                onClick={() => navigate("/store#products")}
                className="h-12 text-sm btn-cta-primary"
              >
                GET THE FULL PACKAGE
              </button>
            </div>
          </div>
        </SectionFrame>
      </main>
    </div>
  );
};

export default StoreCompare;
