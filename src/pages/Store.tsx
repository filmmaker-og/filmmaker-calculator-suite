import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Check,
  Download,
  Sparkles,
  Shield,
  FileSpreadsheet,
  BarChart3,
  Users,
  Crown,
  ChevronDown,
  ArrowRight,
  Minus,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA — Matches strategy document exactly
   ═══════════════════════════════════════════════════════════════════ */

const products = [
  {
    id: "snapshot",
    name: "The Snapshot",
    tagline: "Quick Export",
    price: 197,
    originalPrice: null as number | null, // No strikethrough per strategy
    accessDays: 30,
    accessLabel: "30 days",
    icon: FileSpreadsheet,
    description: "Your deal at a glance. Professionally packaged.",
    hook: "Beautiful enough to email. Detailed enough to impress.",
    features: [
      "6-Sheet Professional Excel Export",
      "Executive Summary Dashboard",
      "Full Waterfall Distribution Ledger",
      "Capital Stack Breakdown",
      "Investor Return Summary",
      "Plain-English Glossary",
      "Investor-Ready Formatting",
    ],
    buyerMath:
      "Less than Final Draft costs — and this actually helps you raise money.",
  },
  {
    id: "blueprint",
    name: "The Blueprint",
    tagline: "Present With Confidence",
    price: 997,
    originalPrice: null as number | null,
    accessDays: 60,
    accessLabel: "60 days",
    icon: BarChart3,
    description: "Your film's financial story. Ready for any room.",
    hook: "Show range. Show confidence. Show you've done the work.",
    features: [
      "Everything in The Snapshot",
      "3 Scenario Comparison (Conservative / Base / Upside)",
      "Side-by-Side Investor Return Analysis",
      "Visual Scenario Comparison Chart",
      '"How to Read Your Blueprint" Guide',
    ],
    buyerMath:
      "A single lawyer hour costs $350–$750. This is your entire financial story.",
  },
  {
    id: "investor-kit",
    name: "The Investor Kit",
    tagline: "Most Popular",
    price: 1997,
    originalPrice: 2997, // Permanent strikethrough — Founders Price
    accessDays: 180,
    accessLabel: "6 months",
    featured: true,
    icon: Users,
    description:
      "Everything you need to walk into a room and be taken seriously.",
    hook: "Even if it's your first time.",
    features: [
      "Everything in The Blueprint",
      "Comparable Films Report (5 Titles)",
      "Investor One-Pager (PDF)",
      "Investor Memo (3–5 Page PDF)",
      '"What Investors Actually Ask" Guide',
    ],
    buyerMath:
      "A consultant would charge $15K. This gives you 80% of what they'd deliver.",
  },
  {
    id: "greenlight",
    name: "The Greenlight Package",
    tagline: "The Full Package",
    price: 4997,
    originalPrice: null as number | null,
    accessDays: 365,
    accessLabel: "12 months",
    icon: Crown,
    description: "The closest thing to having a team without having a team.",
    hook: "White-labeled. Multi-project. Complete.",
    features: [
      "Everything in The Investor Kit",
      "Deep Comp Analysis (10 Titles + Trends)",
      "Term Sheet Outline",
      "Distribution Strategy Brief",
      "White-Label Everything (Your Brand)",
      "Multiple Projects",
    ],
    buyerMath:
      "Your lawyer alone will cost more — and you don't even have one yet.",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   COMPARISON TABLE DATA
   ═══════════════════════════════════════════════════════════════════ */

type FeatureValue = boolean | string;

interface ComparisonFeature {
  label: string;
  snapshot: FeatureValue;
  blueprint: FeatureValue;
  investorKit: FeatureValue;
  greenlight: FeatureValue;
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    label: "Beautiful Excel Waterfall Report",
    snapshot: true,
    blueprint: true,
    investorKit: true,
    greenlight: true,
  },
  {
    label: "Professional Design & Branding",
    snapshot: true,
    blueprint: true,
    investorKit: true,
    greenlight: true,
  },
  {
    label: "Plain-English Glossary",
    snapshot: true,
    blueprint: true,
    investorKit: true,
    greenlight: true,
  },
  {
    label: "3 Scenario Comparison",
    snapshot: false,
    blueprint: true,
    investorKit: true,
    greenlight: true,
  },
  {
    label: '"How to Read This" Guide',
    snapshot: false,
    blueprint: true,
    investorKit: true,
    greenlight: true,
  },
  {
    label: "Comparable Films",
    snapshot: false,
    blueprint: false,
    investorKit: "5 titles",
    greenlight: "10 + trends",
  },
  {
    label: "Investor One-Pager (PDF)",
    snapshot: false,
    blueprint: false,
    investorKit: true,
    greenlight: true,
  },
  {
    label: "Investor Memo (PDF)",
    snapshot: false,
    blueprint: false,
    investorKit: true,
    greenlight: true,
  },
  {
    label: '"What Investors Ask" Guide',
    snapshot: false,
    blueprint: false,
    investorKit: true,
    greenlight: true,
  },
  {
    label: "Term Sheet Outline",
    snapshot: false,
    blueprint: false,
    investorKit: false,
    greenlight: true,
  },
  {
    label: "Distribution Strategy Brief",
    snapshot: false,
    blueprint: false,
    investorKit: false,
    greenlight: true,
  },
  {
    label: "White-Label (Your Brand)",
    snapshot: false,
    blueprint: false,
    investorKit: false,
    greenlight: true,
  },
  {
    label: "Multiple Projects",
    snapshot: false,
    blueprint: false,
    investorKit: false,
    greenlight: true,
  },
  {
    label: "Access Period",
    snapshot: "30 days",
    blueprint: "60 days",
    investorKit: "6 months",
    greenlight: "12 months",
  },
];

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const Store = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [agreedTerms, setAgreedTerms] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const compareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
    }

    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    checkUser();
  }, [searchParams]);

  const getEmail = () => userEmail || guestEmail;
  const isEmailValid = () => {
    const email = getEmail();
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handlePurchase = async (product: (typeof products)[0]) => {
    if (!agreedTerms[product.id]) return;
    if (!isEmailValid()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(product.id);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            productId: product.id,
            email: getEmail(),
          },
        }
      );

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

  const handleToggleCompare = () => {
    setShowCompare((prev) => !prev);
    if (!showCompare) {
      setTimeout(() => {
        compareRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const getButtonText = (productId: string) => {
    if (loading === productId) return "PROCESSING...";
    if (!isEmailValid()) return "ENTER EMAIL ABOVE";
    if (!agreedTerms[productId]) return "AGREE TO TERMS";
    return "GET STARTED";
  };

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
              Your purchase has been confirmed. You now have access to export
              your professional reports.
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

  /* ─── MAIN STORE VIEW ─── */
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="PRODUCER'S STORE" />

      <main className="flex-1 animate-fade-in">
        {/* ═══════════════════════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          {/* Ambient spotlight */}
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
            {/* Mission line */}
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-6 font-semibold">
              Democratizing the Business of Film
            </p>

            {/* Headline */}
            <h1 className="font-bebas text-[clamp(2.2rem,8vw,3.5rem)] leading-[1.05] text-foreground mb-5">
              TURN YOUR NUMBERS
              <br />
              INTO A{" "}
              <span className="text-gold">DEAL</span>
            </h1>

            {/* Subhead */}
            <p className="text-text-mid text-sm leading-relaxed max-w-lg mx-auto mb-8">
              Professional film finance documents that make investors take you
              seriously. The same materials entertainment lawyers charge{" "}
              <span className="text-white font-semibold">
                $5,000–$15,000
              </span>{" "}
              to produce.
            </p>

            {/* Founders badge */}
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
                {
                  label: "Filmmaker.OG",
                  cost: "From $197",
                  highlight: true,
                },
              ].map((item) => (
                <div key={item.label} className="py-2">
                  <p
                    className={cn(
                      "font-mono text-lg font-bold",
                      item.highlight ? "text-gold-cta" : "text-text-dim line-through decoration-text-dim/40"
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
            EMAIL INPUT (Guests only)
            ═══════════════════════════════════════════════════════════ */}
        {!userEmail && (
          <section className="px-6 pt-8 pb-2 max-w-md mx-auto">
            <label className="text-text-dim text-[10px] tracking-[0.15em] uppercase font-semibold block mb-2">
              Your Email
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="bg-bg-elevated border-border-subtle text-foreground h-12"
            />
            <p className="text-text-dim text-[10px] mt-2">
              Required for purchase confirmation and document access.
            </p>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            PRODUCT CARDS
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
                <div
                  key={product.id}
                  className={cn(
                    "flex flex-col",
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
                    <div>
                      <h3 className="font-bebas text-xl text-foreground leading-tight">
                        {product.name.toUpperCase()}
                      </h3>
                    </div>
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

                  {/* Founders badge for Investor Kit */}
                  {product.originalPrice && (
                    <p className="text-gold text-[10px] tracking-[0.15em] uppercase font-semibold mb-4">
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

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {product.features.map((feature, index) => (
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
                  </ul>

                  {/* Buyer's math */}
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-md px-3 py-2.5 mb-5">
                    <p className="text-text-dim text-[11px] leading-relaxed italic">
                      "{product.buyerMath}"
                    </p>
                  </div>

                  {/* Terms + CTA */}
                  <div className="mt-auto space-y-3">
                    <div className="flex items-start gap-3 min-h-[44px] py-2">
                      <Checkbox
                        id={`terms-${product.id}`}
                        checked={agreedTerms[product.id] || false}
                        onCheckedChange={(checked) =>
                          setAgreedTerms((prev) => ({
                            ...prev,
                            [product.id]: !!checked,
                          }))
                        }
                        className="mt-0.5 border-border data-[state=checked]:bg-gold data-[state=checked]:border-gold w-5 h-5"
                      />
                      <label
                        htmlFor={`terms-${product.id}`}
                        className="text-text-dim text-[11px] cursor-pointer leading-relaxed"
                      >
                        I agree to the terms of service and understand this is
                        a digital product
                      </label>
                    </div>

                    <Button
                      onClick={() => handlePurchase(product)}
                      disabled={
                        !agreedTerms[product.id] ||
                        !isEmailValid() ||
                        loading === product.id
                      }
                      className={cn(
                        "w-full py-4 min-h-[52px] touch-feedback",
                        isFeatured
                          ? "btn-vault"
                          : "btn-ghost-gold disabled:opacity-30"
                      )}
                    >
                      {getButtonText(product.id)}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            COMPARE ALL PACKAGES (Expandable)
            ═══════════════════════════════════════════════════════════ */}
        <section className="px-6 pb-10 max-w-5xl mx-auto">
          <button
            onClick={handleToggleCompare}
            className="w-full flex items-center justify-center gap-2 py-3 text-text-dim hover:text-gold transition-colors"
          >
            <span className="text-[11px] tracking-[0.2em] uppercase font-semibold">
              Compare All Packages
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                showCompare && "rotate-180"
              )}
            />
          </button>

          {showCompare && (
            <div
              ref={compareRef}
              className="mt-4 overflow-x-auto rounded-lg border border-border-subtle bg-bg-card animate-fade-in"
            >
              <table className="store-compare-table">
                <thead>
                  <tr>
                    <th className="text-left text-text-dim text-[10px] font-sans font-semibold tracking-wider">
                      Feature
                    </th>
                    <th>Snapshot</th>
                    <th>Blueprint</th>
                    <th className="featured-col">
                      Investor Kit
                    </th>
                    <th>Greenlight</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Price row */}
                  <tr>
                    <td className="font-semibold text-text-mid">Price</td>
                    <td className="font-mono text-foreground font-bold">
                      $197
                    </td>
                    <td className="font-mono text-foreground font-bold">
                      $997
                    </td>
                    <td className="featured-col">
                      <span className="text-text-dim text-[11px] line-through block">
                        $2,997
                      </span>
                      <span className="font-mono text-gold-cta font-bold text-base">
                        $1,997
                      </span>
                    </td>
                    <td className="font-mono text-foreground font-bold">
                      $4,997
                    </td>
                  </tr>

                  {/* Feature rows */}
                  {comparisonFeatures.map((feature) => (
                    <tr key={feature.label}>
                      <td>{feature.label}</td>
                      {(
                        [
                          "snapshot",
                          "blueprint",
                          "investorKit",
                          "greenlight",
                        ] as const
                      ).map((tier) => {
                        const val = feature[tier];
                        const isFeaturedCol = tier === "investorKit";
                        return (
                          <td
                            key={tier}
                            className={
                              isFeaturedCol ? "featured-col" : undefined
                            }
                          >
                            {val === true ? (
                              <Check className="w-4 h-4 text-gold mx-auto" />
                            ) : val === false ? (
                              <Minus className="w-3.5 h-3.5 text-white/10 mx-auto" />
                            ) : (
                              <span className="text-foreground text-[11px] font-semibold">
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
          )}
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
