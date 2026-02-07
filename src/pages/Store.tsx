import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Download, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const products = [
  {
    id: "snapshot",
    name: "The Snapshot",
    price: 197,
    originalPrice: 297,
    accessDays: 30,
    description: "Your Deal at a Glance",
    features: [
      "6-Sheet Professional Excel Export",
      "Executive Summary Dashboard",
      "Full Waterfall Breakdown",
      "Investor-Ready Formatting",
    ],
  },
  {
    id: "blueprint",
    name: "The Blueprint",
    price: 997,
    originalPrice: 1497,
    accessDays: 60,
    description: "Multi-Scenario Analysis",
    features: [
      "Everything in The Snapshot",
      "3 Scenario Comparison Tool",
      "Sensitivity Analysis Charts",
      "60-Day Platform Access",
      "Priority Email Support",
    ],
  },
  {
    id: "investor-kit",
    name: "The Investor Kit",
    price: 1997,
    originalPrice: 2997,
    accessDays: 180,
    featured: true,
    description: "Complete Investor Package",
    features: [
      "Everything in The Blueprint",
      "Comparable Films Database",
      "Investor Pitch Deck Template",
      "Term Sheet Framework",
      "6-Month Platform Access",
      "1-on-1 Strategy Call (30 min)",
    ],
  },
  {
    id: "greenlight",
    name: "The Greenlight Package",
    price: 4997,
    originalPrice: 7500,
    accessDays: 365,
    description: "White-Glove Service",
    features: [
      "Everything in The Investor Kit",
      "Custom Financial Model Build",
      "White-Label Report Branding",
      "Tax Incentive Optimization",
      "12-Month Platform Access",
      "Dedicated Strategist (3 calls)",
      "Ongoing Support Channel",
    ],
  },
];

const Store = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [agreedTerms, setAgreedTerms] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const handlePurchase = async (product: typeof products[0]) => {
    if (!agreedTerms[product.id]) return;
    
    setLoading(product.id);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          productId: product.id,
          productName: product.name,
          price: product.price,
          accessDays: product.accessDays,
          userEmail: user?.email,
          userId: user?.id,
        },
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="SUCCESS" />
        <main className="flex-1 px-6 py-16 flex items-center justify-center animate-page-in">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 border-2 border-gold mx-auto mb-6 flex items-center justify-center">
              <Check className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-bebas text-4xl text-foreground mb-4">
              PAYMENT SUCCESSFUL
            </h1>
            <p className="text-muted-foreground mb-8">
              Your purchase has been confirmed. You now have access to export your professional reports.
            </p>
            <Button
              onClick={() => navigate("/calculator")}
              className="btn-vault w-full py-4 min-h-[52px]"
            >
              <Download className="w-5 h-5 mr-2" />
              GO TO CALCULATOR
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="PACKAGES" />

      <main className="flex-1 px-6 py-8 animate-page-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bebas text-4xl md:text-5xl text-foreground mb-3">
            CHOOSE YOUR PACKAGE
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
            Professional film finance tools for serious producers
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs tracking-[0.15em] uppercase">
              Founders Pricing — Limited Time
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="space-y-6 pb-8 max-w-2xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className={`glass-card p-6 ${product.featured ? 'border-gold' : ''}`}
            >
              {product.featured && (
                <span className="text-gold text-xs tracking-[0.3em] uppercase mb-3 block">
                  Most Popular
                </span>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bebas text-xl text-foreground">
                    {product.name.toUpperCase()}
                  </h3>
                  <p className="text-muted-foreground text-xs">{product.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground text-sm line-through block">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="font-mono text-2xl text-gold">
                    ${product.price.toLocaleString()}
                  </span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <div className="flex items-start gap-3 min-h-[44px] py-2">
                  <Checkbox
                    id={`terms-${product.id}`}
                    checked={agreedTerms[product.id] || false}
                    onCheckedChange={(checked) => 
                      setAgreedTerms(prev => ({ ...prev, [product.id]: !!checked }))
                    }
                    className="mt-0.5 border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold w-5 h-5"
                  />
                  <label 
                    htmlFor={`terms-${product.id}`} 
                    className="text-muted-foreground text-xs cursor-pointer leading-relaxed"
                  >
                    I agree to the terms of service and understand this is a digital product
                  </label>
                </div>

                <Button
                  onClick={() => handlePurchase(product)}
                  disabled={!agreedTerms[product.id] || loading === product.id}
                  className={`w-full py-4 min-h-[52px] touch-feedback ${product.featured ? 'btn-vault' : 'btn-ghost-gold disabled:opacity-30'}`}
                >
                  {loading === product.id 
                    ? 'LOADING...' 
                    : agreedTerms[product.id] 
                      ? 'PURCHASE' 
                      : 'AGREE TO TERMS'
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
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
