import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Check, Volume2 } from "lucide-react";

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
    stripeLink: "#", // Replace with actual Stripe Payment Link
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
    stripeLink: "#", // Replace with actual Stripe Payment Link
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
    stripeLink: "#", // Replace with actual Stripe Payment Link
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
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 border border-gold flex items-center justify-center">
              <span className="font-display text-gold text-sm">F</span>
            </div>
            <span className="font-display text-mid tracking-[0.2em] text-xs hidden sm:block">
              FILMMAKER.OG
            </span>
          </Link>
          <Link to="/" className="text-dim hover:text-gold text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl text-foreground mb-4">
            SERVICES
          </h1>
          <p className="text-dim text-lg max-w-2xl mx-auto">
            Professional film finance consulting for serious producers
          </p>
        </div>

        {/* Trust Bridge - Audio Player Placeholder */}
        <div className="glass-card p-8 mb-12">
          <div className="flex items-center gap-6">
            <button className="w-16 h-16 border border-gold flex items-center justify-center hover:bg-gold/10 transition-colors">
              <Volume2 className="w-8 h-8 text-gold" />
            </button>
            <div className="flex-1">
              <span className="text-gold text-xs tracking-[0.2em] uppercase block mb-2">
                Listen to the Process
              </span>
              {/* Waveform Placeholder */}
              <div className="flex items-center gap-1 h-8">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gold/30 w-1 rounded-full"
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`glass-card p-8 flex flex-col ${
                pkg.featured ? 'border-gold md:scale-105 md:-my-4' : ''
              }`}
            >
              {pkg.featured && (
                <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4">
                  Most Popular
                </span>
              )}
              
              <h3 className="font-display text-2xl text-foreground mb-2">
                {pkg.name.toUpperCase()}
              </h3>
              <p className="text-dim text-sm mb-6">{pkg.description}</p>
              
              <div className="mb-6">
                <span className="font-mono text-4xl text-gold">
                  ${pkg.price.toLocaleString()}
                </span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                    <span className="text-mid text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-4">
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
                    className="text-dim text-xs cursor-pointer leading-relaxed"
                  >
                    I agree this is a non-refundable consulting service
                  </label>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id, pkg.stripeLink)}
                  disabled={!agreedTerms[pkg.id]}
                  className={`w-full py-5 rounded-none ${
                    pkg.featured 
                      ? 'btn-vault' 
                      : 'btn-ghost-gold disabled:opacity-30'
                  }`}
                >
                  {agreedTerms[pkg.id] ? 'PURCHASE' : 'AGREE TO TERMS'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-dim text-xs tracking-wide">
            Educational Purposes Only. Not Financial Advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Store;
