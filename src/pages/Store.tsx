import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Check, Download, Sparkles, ArrowRight, Crown, Star, Shield } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ════════════════════════════════════════════════════════════════════════
   PRODUCT DATA — matches strategy doc exactly
   ════════════════════════════════════════════════════════════════════════ */

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  strikePrice?: number;
  pricingNote?: string;
  accessDays: number;
  accessLabel: string;
  featured?: boolean;
  features: string[];
  notIncluded?: string[];
  buyerThought: string;
}

const products: Product[] = [
  {
    id: "snapshot",
    name: "The Snapshot",
    tagline: "Your deal at a glance — ready to share.",
    price: 197,
    accessDays: 30,
    accessLabel: "30-day access",
    features: [
      "6-sheet professional Excel export",
      "Executive summary dashboard",
      "Full waterfall distribution ledger",
      "Investor return & multiple breakdown",
      "Cost of capital summary",
      "Plain-English glossary",
      "Cinematic black & gold design",
      "Unlimited recalculations & re-exports",
    ],
    notIncluded: [
      "No scenario comparisons",
      "No comparable films",
      "No investor memo or one-pager",
    ],
    buyerThought: "Less than Final Draft — and I actually need this to raise money.",
  },
  {
    id: "blueprint",
    name: "The Blueprint",
    tagline: "Your film's financial story. Professionally packaged.",
    price: 997,
    accessDays: 60,
    accessLabel: "60-day access",
    features: [
      "Everything in The Snapshot",
      "3-scenario comparison (conservative, base, upside)",
      "Side-by-side investor returns per scenario",
      "Visual chart comparing all three outcomes",
      '"How to Read Your Blueprint" guide',
      "Plain-English walkthrough of every number",
    ],
    buyerThought: "$997 to look like I've done this before? My film costs $1.5M. This is a rounding error.",
  },
  {
    id: "investor-kit",
    name: "The Investor Kit",
    tagline: "Everything you need to walk into a room and be taken seriously.",
    price: 1997,
    strikePrice: 2997,
    pricingNote: "Founders Price",
    accessDays: 180,
    accessLabel: "6-month access",
    featured: true,
    features: [
      "Everything in The Blueprint",
      "Comparable films report (5 real titles)",
      "Genre & budget-matched acquisition data",
      "Investor one-pager (PDF)",
      "Investor memo (3-5 page PDF)",
      '"What Investors Actually Ask" cheat sheet',
      "15 common questions with your-numbers answers",
    ],
    buyerThought: "A finance consultant wanted $15K. This gives me 80% of it for $2K.",
  },
  {
    id: "greenlight",
    name: "The Greenlight Package",
    tagline: "The closest thing to having a team without having a team.",
    price: 4997,
    accessDays: 365,
    accessLabel: "12-month access",
    features: [
      "Everything in The Investor Kit",
      "Deep comp analysis (10 titles + trends)",
      "Territory breakdown & festival insights",
      "3-year acquisition trend analysis",
      "Term sheet outline (framework, not legal advice)",
      "Distribution strategy brief",
      "White-label everything — your brand, your logo",
      "Multiple projects under one account",
    ],
    buyerThought: "$5K for everything I need to raise $1M+? My lawyer alone will cost more.",
  },
];

/* ════════════════════════════════════════════════════════════════════════
   VALUE ANCHORING — what they'd pay without us
   ════════════════════════════════════════════════════════════════════════ */

const alternatives = [
  { label: "Entertainment Lawyer", cost: "$5K – $15K", note: "if you can even get a meeting" },
  { label: "Film Finance Consultant", cost: "$10K – $30K", note: "custom model + comp analysis" },
  { label: "Producer's Rep Commission", cost: "$50K – $250K+", note: "5–15% of your budget" },
  { label: "Business School Friend", cost: "Free + a favor", note: "something that kills the deal" },
];

/* ════════════════════════════════════════════════════════════════════════
   FEATURE COMPARISON TABLE
   ════════════════════════════════════════════════════════════════════════ */

const comparisonFeatures = [
  { name: "Professional Excel waterfall report", snap: true, blue: true, kit: true, green: true },
  { name: "Investor-ready design & formatting", snap: true, blue: true, kit: true, green: true },
  { name: "Plain-English glossary", snap: true, blue: true, kit: true, green: true },
  { name: "3-scenario comparison", snap: false, blue: true, kit: true, green: true },
  { name: '"How to Read This" guide', snap: false, blue: true, kit: true, green: true },
  { name: "Comparable films report", snap: false, blue: false, kit: "5 titles", green: "10 + trends" },
  { name: "Investor one-pager (PDF)", snap: false, blue: false, kit: true, green: true },
  { name: "Investor memo (PDF)", snap: false, blue: false, kit: true, green: true },
  { name: '"What Investors Ask" guide', snap: false, blue: false, kit: true, green: true },
  { name: "Term sheet outline", snap: false, blue: false, kit: false, green: true },
  { name: "Distribution strategy brief", snap: false, blue: false, kit: false, green: true },
  { name: "White-label (your brand)", snap: false, blue: false, kit: false, green: true },
  { name: "Multiple projects", snap: false, blue: false, kit: false, green: true },
  { name: "Access period", snap: "30 days", blue: "60 days", kit: "6 months", green: "12 months" },
];

/* ════════════════════════════════════════════════════════════════════════
   STORE COMPONENT
   ════════════════════════════════════════════════════════════════════════ */

const Store = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [agreedTerms, setAgreedTerms] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  const handlePurchase = async (product: Product) => {
    if (!agreedTerms[product.id]) return;
    if (!isEmailValid()) {
      toast({
        title: "Email required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(product.id);

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          productId: product.id,
          email: getEmail(),
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  /* ── Success Screen ──────────────────────────────────────────────── */

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="SUCCESS" />
        <main className="flex-1 px-6 py-16 flex items-center justify-center animate-page-in">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 border-2 border-gold mx-auto mb-6 flex items-center justify-center">
              <Check className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-bebas text-4xl text-foreground mb-4">PAYMENT SUCCESSFUL</h1>
            <p className="text-muted-foreground mb-8">
              Your purchase has been confirmed. You now have access to export your professional
              reports.
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

  /* ── Main Store Page ─────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="PACKAGES" />

      <main className="flex-1 animate-page-in">
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="px-6 pt-8 pb-6 text-center">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-3">
            Democratizing the Business of Film
          </p>
          <h1 className="font-bebas text-4xl md:text-5xl text-foreground mb-3 leading-tight">
            YOUR NUMBERS DESERVE
            <br />A PROFESSIONAL PACKAGE
          </h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            The documents you need to walk into any room and be taken seriously — even if it's your
            first time.
          </p>
        </section>

        {/* ── FOUNDERS PRICING BADGE ───────────────────────────────── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold/30 bg-gold/5">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-gold text-xs tracking-[0.15em] uppercase font-semibold">
              Founders Pricing — Limited Time
            </span>
          </div>
        </div>

        {/* ── VALUE ANCHORING ──────────────────────────────────────── */}
        <section className="px-6 mb-10">
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-xs tracking-[0.2em] uppercase text-text-dim mb-4">
              What You'd Pay Without Us
            </p>
            <div className="grid grid-cols-2 gap-3">
              {alternatives.map((alt) => (
                <div
                  key={alt.label}
                  className="border border-border-subtle bg-bg-elevated p-3 rounded-lg"
                >
                  <span className="font-mono text-sm text-white/60 line-through block">
                    {alt.cost}
                  </span>
                  <span className="text-xs text-text-dim block mt-1">{alt.label}</span>
                  <span className="text-[10px] text-text-dim/60 italic">{alt.note}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EMAIL INPUT (guests) ─────────────────────────────────── */}
        {!userEmail && (
          <div className="px-6 mb-8">
            <div className="max-w-md mx-auto">
              <label className="text-xs tracking-[0.15em] uppercase text-text-dim block mb-2">
                Your Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="bg-bg-elevated border-border-default text-foreground h-12"
              />
            </div>
          </div>
        )}

        {/* ── PRICING CARDS ────────────────────────────────────────── */}
        <section className="px-6 pb-8">
          <div className="space-y-6 max-w-2xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className={`store-card p-6 relative ${
                  product.featured ? "store-card-featured" : ""
                }`}
              >
                {/* Featured badge */}
                {product.featured && (
                  <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}

                {/* Header row */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    {product.featured && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Crown className="w-3.5 h-3.5 text-gold" />
                        <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <h3 className="font-bebas text-2xl text-foreground leading-none">
                      {product.name.toUpperCase()}
                    </h3>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {product.strikePrice && (
                      <span className="text-text-dim text-sm line-through block leading-none">
                        ${product.strikePrice.toLocaleString()}
                      </span>
                    )}
                    <span className="font-mono text-3xl text-gold leading-none">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.pricingNote && (
                      <span className="text-gold/60 text-[10px] tracking-[0.1em] uppercase block mt-0.5">
                        {product.pricingNote}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed italic">
                  {product.tagline}
                </p>

                {/* Features */}
                <ul className="space-y-2.5 mb-5">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Not included (Snapshot only) */}
                {product.notIncluded && (
                  <div className="mb-5 pt-3 border-t border-border-subtle">
                    {product.notIncluded.map((item, index) => (
                      <p
                        key={index}
                        className="text-text-dim text-xs mb-1 flex items-center gap-2"
                      >
                        <span className="text-text-dim/40">—</span>
                        {item}
                      </p>
                    ))}
                  </div>
                )}

                {/* Access period */}
                <div className="flex items-center gap-2 mb-5">
                  <Shield className="w-3.5 h-3.5 text-gold/50" />
                  <span className="text-text-dim text-xs tracking-[0.1em] uppercase">
                    {product.accessLabel} — unlimited recalculations
                  </span>
                </div>

                {/* Buyer thought */}
                <div className="bg-gold/[0.03] border border-gold/10 px-4 py-3 mb-5 rounded-lg">
                  <p className="text-text-mid text-xs italic leading-relaxed">
                    "{product.buyerThought}"
                  </p>
                </div>

                {/* Terms + CTA */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 min-h-[44px] py-2">
                    <Checkbox
                      id={`terms-${product.id}`}
                      checked={agreedTerms[product.id] || false}
                      onCheckedChange={(checked) =>
                        setAgreedTerms((prev) => ({ ...prev, [product.id]: !!checked }))
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
                    disabled={
                      !agreedTerms[product.id] || !isEmailValid() || loading === product.id
                    }
                    className={`w-full py-4 min-h-[52px] touch-feedback ${
                      product.featured ? "btn-vault" : "btn-ghost-gold"
                    }`}
                  >
                    {loading === product.id ? (
                      "PROCESSING..."
                    ) : !isEmailValid() ? (
                      "ENTER EMAIL ABOVE"
                    ) : agreedTerms[product.id] ? (
                      <span className="flex items-center gap-2">
                        GET {product.name.toUpperCase().replace("THE ", "")}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    ) : (
                      "AGREE TO TERMS"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMPARISON TABLE ─────────────────────────────────────── */}
        <section className="px-6 pb-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-bebas text-2xl text-foreground text-center mb-6">
              COMPARE PACKAGES
            </h2>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-xs min-w-[520px]">
                <thead>
                  <tr className="border-b border-gold/20">
                    <th className="text-left py-3 pr-2 text-text-dim font-normal tracking-wider uppercase w-[40%]">
                      Feature
                    </th>
                    <th className="text-center py-3 px-1 text-text-dim font-normal tracking-wider uppercase">
                      $197
                    </th>
                    <th className="text-center py-3 px-1 text-text-dim font-normal tracking-wider uppercase">
                      $997
                    </th>
                    <th className="text-center py-3 px-1 text-gold font-bold tracking-wider uppercase">
                      $1,997
                    </th>
                    <th className="text-center py-3 px-1 text-text-dim font-normal tracking-wider uppercase">
                      $4,997
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={i} className="border-b border-border-subtle/50">
                      <td className="py-2.5 pr-2 text-text-mid">{row.name}</td>
                      {([row.snap, row.blue, row.kit, row.green] as (boolean | string)[]).map(
                        (val, j) => (
                          <td
                            key={j}
                            className={`text-center py-2.5 px-1 ${j === 2 ? "bg-gold/[0.03]" : ""}`}
                          >
                            {val === true ? (
                              <Check className="w-3.5 h-3.5 text-gold mx-auto" />
                            ) : val === false ? (
                              <span className="text-text-dim/30">—</span>
                            ) : (
                              <span className="text-text-mid text-[10px]">{val}</span>
                            )}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── TRUST SIGNAL ─────────────────────────────────────────── */}
        <section className="px-6 pb-10">
          <div className="max-w-md mx-auto text-center">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gold fill-gold" />
              ))}
            </div>
            <p className="text-text-mid text-sm italic leading-relaxed mb-2">
              "I spent months trying to figure out how to present my film's financials. This gave me
              everything in 20 minutes."
            </p>
            <p className="text-text-dim text-xs">— First-time producer, $1.2M budget</p>
          </div>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="px-6 text-center">
          <p className="text-muted-foreground text-[10px] tracking-wide leading-relaxed max-w-lg mx-auto">
            This document is generated by Filmmaker.OG for educational and informational purposes
            only. It does not constitute legal, tax, accounting, or investment advice. The financial
            projections contained herein are based on user-provided assumptions and should not be
            relied upon as guarantees of future performance. Consult a qualified entertainment
            attorney, accountant, and financial advisor before making any investment or financing
            decisions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Store;
