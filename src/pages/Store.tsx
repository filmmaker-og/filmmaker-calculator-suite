import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Check, Volume2 } from "lucide-react";
import MobileMenu from "@/components/MobileMenu";

const packages = [
  {
    id: "producer",
    name: "Producer Package",
    price: 997,
    description: "Templates & Decks",
    features: [
      "Film Finance Model Templates",
      "Investor Pitch Deck Framework",
      "Term Sheet Templates",
      "Distribution Waterfall Guides",
    ],
    stripeLink: "#",
  },
  {
    id: "institutional",
    name: "Institutional Package",
    price: 1297,
    description: "Custom Models + Tax Map",
    featured: true,
    features: [
      "Everything in Producer Package",
      "Custom Financial Model Build",
      "Tax Incentive Optimization Map",
      "Gap Financing Analysis",
      "60-min Strategy Call",
    ],
    stripeLink: "#",
  },
  {
    id: "bespoke",
    name: "Bespoke Modeling",
    price: 2500,
    description: "1-on-1 Strategy",
    features: [
      "Everything in Institutional Package",
      "Dedicated Financial Strategist",
      "Full Project Financial Model",
      "Investor Presentation Review",
      "Ongoing Support (30 days)",
    ],
    stripeLink: "#",
  },
];

const Store = () => {
  const [agreedTerms, setAgreedTerms] = useState<Record<string, boolean>>({});

  const handlePurchase = (packageId: string, stripeLink: string) => {
    if (!agreedTerms[packageId]) return;
    window.open(stripeLink, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu */}
      <MobileMenu />

      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-bebas text-foreground tracking-wider text-xl">
              FILMMAKER.OG
            </span>
          </Link>
          <Link to="/" className="text-muted-foreground hover:text-gold text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-bebas text-4xl md:text-5xl text-foreground mb-3">
            SERVICES
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Professional film finance consulting for serious producers
          </p>
        </div>

        {/* Trust Bridge - Audio Player Placeholder */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 border border-gold flex items-center justify-center hover:bg-gold/10 transition-colors flex-shrink-0">
              <Volume2 className="w-6 h-6 text-gold" />
            </button>
            <div className="flex-1 min-w-0">
              <span className="text-gold text-xs tracking-[0.2em] uppercase block mb-2">
                Listen to the Process
              </span>
              <div className="flex items-center gap-0.5 h-6 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gold/30 w-1 rounded-full flex-shrink-0"
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      minHeight: '4px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards - Stacked on Mobile */}
        <div className="space-y-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`glass-card p-6 ${pkg.featured ? 'border-gold' : ''}`}
            >
              {pkg.featured && (
                <span className="text-gold text-xs tracking-[0.3em] uppercase mb-3 block">
                  Most Popular
                </span>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bebas text-xl text-foreground">
                    {pkg.name.toUpperCase()}
                  </h3>
                  <p className="text-muted-foreground text-xs">{pkg.description}</p>
                </div>
                <span className="font-mono text-2xl text-gold">
                  ${pkg.price.toLocaleString()}
                </span>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={`terms-${pkg.id}`}
                    checked={agreedTerms[pkg.id] || false}
                    onCheckedChange={(checked) => 
                      setAgreedTerms(prev => ({ ...prev, [pkg.id]: !!checked }))
                    }
                    className="mt-0.5 border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                  />
                  <label 
                    htmlFor={`terms-${pkg.id}`} 
                    className="text-muted-foreground text-xs cursor-pointer leading-relaxed"
                  >
                    I agree this is a non-refundable consulting service
                  </label>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id, pkg.stripeLink)}
                  disabled={!agreedTerms[pkg.id]}
                  className={`w-full py-4 ${pkg.featured ? 'btn-vault' : 'btn-ghost-gold disabled:opacity-30'}`}
                >
                  {agreedTerms[pkg.id] ? 'PURCHASE' : 'AGREE TO TERMS'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-8">
        <div className="px-6 text-center">
          <p className="text-muted-foreground text-xs tracking-wide leading-relaxed max-w-md mx-auto">
            Educational disclaimer: For educational purposes only. This is not legal, tax, accounting, or investment advice. Consult a qualified entertainment attorney and financial advisor.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Store;