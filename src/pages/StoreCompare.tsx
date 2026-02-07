import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Minus } from "lucide-react";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { products, comparisonFeatures } from "@/lib/store-products";

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
        <div className="px-6 pt-6 max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/store")}
            className="flex items-center gap-2 text-sm text-text-dim hover:text-text-mid transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Packages
          </button>
        </div>

        {/* HEADER */}
        <section className="px-6 pt-8 pb-6 max-w-5xl mx-auto text-center">
          <h1 className="font-bebas text-3xl md:text-4xl tracking-[0.1em] text-text-primary mb-3">
            COMPARE ALL PACKAGES
          </h1>
          <p className="text-text-mid text-sm max-w-lg mx-auto">
            Every package is a one-time purchase. No subscriptions. No hidden fees.
            Pick the one that matches where you are in your journey.
          </p>
        </section>

        {/* COMPARISON TABLE */}
        <section className="px-4 pb-10 max-w-5xl mx-auto">
          <div className="overflow-x-auto rounded-lg border border-border-subtle bg-bg-card">
            <table className="store-compare-table">
              <thead>
                <tr>
                  <th className="text-left text-text-dim text-[10px] font-sans font-semibold tracking-wider">
                    Feature
                  </th>
                  {products.map((p) => (
                    <th
                      key={p.id}
                      className={cn(p.featured && "featured-col")}
                    >
                      <button
                        onClick={() => navigate(`/store/${p.slug}`)}
                        className="hover:text-text-mid transition-colors"
                      >
                        {p.name.replace("The ", "")}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price row */}
                <tr>
                  <td className="font-semibold text-text-mid">Price</td>
                  {products.map((p) => (
                    <td key={p.id} className={cn(p.featured && "featured-col")}>
                      {p.originalPrice && (
                        <span className="text-text-dim text-[11px] line-through block">
                          ${p.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span
                        className={cn(
                          "font-mono font-bold",
                          p.featured ? "text-gold-cta text-base" : "text-text-primary"
                        )}
                      >
                        ${p.price.toLocaleString()}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Feature rows */}
                {comparisonFeatures.map((feature) => (
                  <tr key={feature.label}>
                    <td>{feature.label}</td>
                    {(["snapshot", "blueprint", "investorKit", "greenlight"] as const).map((tier) => {
                      const val = feature[tier];
                      const isFeaturedCol = tier === "investorKit";
                      return (
                        <td key={tier} className={isFeaturedCol ? "featured-col" : undefined}>
                          {val === true ? (
                            <Check className="w-4 h-4 text-gold mx-auto" />
                          ) : val === false ? (
                            <Minus className="w-3.5 h-3.5 text-white/10 mx-auto" />
                          ) : (
                            <span className="text-text-primary text-[11px] font-semibold">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* QUICK ACCESS CARDS */}
        <section className="px-6 pb-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <button
                  key={product.id}
                  onClick={() => navigate(`/store/${product.slug}`)}
                  className={cn(
                    "text-left p-4 rounded-[--radius-lg] border transition-all hover:border-border-default",
                    product.featured
                      ? "bg-gold/[0.04] border-border-default"
                      : "bg-bg-card border-border-subtle"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={cn("w-4 h-4", product.featured ? "text-gold" : "text-text-dim")} />
                    <span className="font-bebas text-lg text-text-primary">{product.name.toUpperCase()}</span>
                  </div>
                  <p className={cn("font-mono text-xl font-bold mb-2", product.featured ? "text-gold-cta" : "text-gold")}>
                    ${product.price.toLocaleString()}
                  </p>
                  <span className="flex items-center gap-1 text-text-dim text-[11px] hover:text-text-mid transition-colors">
                    View Details <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StoreCompare;
