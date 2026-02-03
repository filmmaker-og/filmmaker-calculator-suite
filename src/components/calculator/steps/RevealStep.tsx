import { WaterfallResult, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { getVerdictStatus } from "@/lib/design-system";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Award,
  Sparkles,
  FileText,
  Users,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { StatusBadge, VerdictCard, CtaCard } from "@/components/ui/matte-card";

interface RevealStepProps {
  result: WaterfallResult;
  equity: number;
}

const RevealStep = ({ result, equity }: RevealStepProps) => {
  const [displayProfit, setDisplayProfit] = useState(0);
  const [displayProducer, setDisplayProducer] = useState(0);
  const [displayInvestor, setDisplayInvestor] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const hasAnimated = useRef(false);

  const isProfitable = result.profitPool > 0;
  const verdict = getVerdictStatus(result.multiple, isProfitable);

  // Get status key for styling
  const getStatusKey = (): "excellent" | "good" | "marginal" | "underwater" => {
    if (!isProfitable) return "underwater";
    if (result.multiple >= 1.3) return "excellent";
    if (result.multiple >= 1.15) return "good";
    return "marginal";
  };

  const statusKey = getStatusKey();

  // Get icon for status
  const getStatusIcon = () => {
    switch (statusKey) {
      case "excellent":
        return <Award className="w-5 h-5" />;
      case "good":
        return <TrendingUp className="w-5 h-5" />;
      case "marginal":
        return <AlertTriangle className="w-5 h-5" />;
      case "underwater":
        return <TrendingDown className="w-5 h-5" />;
    }
  };

  // Animated count-up effect
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayProfit(result.profitPool * eased);
      setDisplayProducer(result.producer * eased);
      setDisplayInvestor(result.investor * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimationComplete(true);
        // Show details with a delay for dramatic effect
        setTimeout(() => setShowDetails(true), 400);
      }
    };

    // Delay start for dramatic effect
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 500);
  }, [result.profitPool, result.producer, result.investor]);

  return (
    <div className="step-enter pb-8">
      {/* THE DRAMATIC REVEAL */}
      <div className="min-h-[45vh] flex flex-col items-center justify-center text-center px-2 mb-8">
        {/* Verdict Badge - Appears first */}
        <div
          className={`mb-8 transition-all duration-500 ${
            animationComplete
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <StatusBadge
            status={statusKey}
            label={verdict.label}
            icon={getStatusIcon()}
          />
        </div>

        {/* The Big Number */}
        <VerdictCard
          title="Your Profit Pool"
          value={`${isProfitable ? "+" : ""}${formatCompactCurrency(displayProfit)}`}
          status={statusKey}
          subtitle={
            animationComplete ? "Available after all repayments" : undefined
          }
        />

        {/* Multiple indicator */}
        {equity > 0 && animationComplete && (
          <div
            className={`mt-8 transition-all duration-500 ${
              showDetails
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#0A0A0A] border border-[#1A1A1A]">
              <span className="text-xs text-white/40 uppercase tracking-wider">
                Investor Return
              </span>
              <span
                className={`font-mono text-xl font-bold ${
                  statusKey === "excellent"
                    ? "text-emerald-400"
                    : statusKey === "good"
                      ? "text-gold"
                      : statusKey === "marginal"
                        ? "text-amber-400"
                        : "text-red-400"
                }`}
              >
                {formatMultiple(result.multiple)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECONDARY STATS */}
      <div
        className={`transition-all duration-700 ${
          showDetails
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
      >
        {/* Split breakdown */}
        <div className="matte-section overflow-hidden mb-6">
          <div className="matte-section-header px-5 py-3">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              The Split
            </span>
          </div>

          <div className="divide-y divide-[#1A1A1A]">
            {/* Producer share */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-gold/10 border border-gold/30">
                  <Sparkles className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    You Take
                  </p>
                  <p className="font-mono text-xl text-white font-semibold">
                    {formatCompactCurrency(displayProducer)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-white/30 uppercase">50%</span>
            </div>

            {/* Investor share */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#0D0D0D] border border-[#2A2A2A]">
                  <Users className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Investors
                  </p>
                  <p className="font-mono text-xl text-gold font-semibold">
                    {formatCompactCurrency(displayInvestor)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-white/30 uppercase">50%</span>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="glass-card-gold p-5 mb-8">
          <p className="text-sm text-white/70 leading-relaxed">
            <span
              className={`font-semibold ${
                statusKey === "excellent"
                  ? "text-emerald-400"
                  : statusKey === "good"
                    ? "text-gold"
                    : statusKey === "marginal"
                      ? "text-amber-400"
                      : "text-red-400"
              }`}
            >
              {verdict.label}.
            </span>{" "}
            {verdict.description}
          </p>
        </div>

        {/* SIMPLIFIED WATERFALL - Where did the money go? */}
        <div className="matte-section overflow-hidden mb-8">
          <div className="matte-section-header px-5 py-3">
            <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
              Where Did The Money Go?
            </span>
          </div>

          <div className="divide-y divide-[#1A1A1A]">
            {/* Off-the-top fees */}
            {(result.cam + result.salesFee + result.guilds + result.marketing) > 0 && (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-zinc-500" />
                  <span className="text-sm text-white/60">Off-the-Top Fees</span>
                </div>
                <span className="font-mono text-sm text-white/70">
                  -{formatCompactCurrency(result.cam + result.salesFee + result.guilds + result.marketing)}
                </span>
              </div>
            )}

            {/* Debt Repayment */}
            {result.ledger.some(l => l.name === "Senior Debt" || l.name === "Gap/Mezz Debt") && (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-white/60">Debt Repayment</span>
                </div>
                <span className="font-mono text-sm text-white/70">
                  -{formatCompactCurrency(
                    result.ledger
                      .filter(l => l.name === "Senior Debt" || l.name === "Gap/Mezz Debt")
                      .reduce((sum, l) => sum + l.amount, 0)
                  )}
                </span>
              </div>
            )}

            {/* Equity + Premium */}
            {result.ledger.some(l => l.name === "Equity") && (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-white/60">Equity + Premium</span>
                </div>
                <span className="font-mono text-sm text-white/70">
                  -{formatCompactCurrency(
                    result.ledger.find(l => l.name === "Equity")?.amount || 0
                  )}
                </span>
              </div>
            )}

            {/* Profit Pool - highlighted */}
            <div className={`p-4 flex items-center justify-between ${
              isProfitable
                ? 'bg-gradient-to-r from-emerald-500/10 to-transparent'
                : 'bg-gradient-to-r from-red-500/10 to-transparent'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isProfitable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-semibold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                  Profit Pool
                </span>
              </div>
              <span className={`font-mono text-sm font-semibold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
                {isProfitable ? '+' : ''}{formatCompactCurrency(result.profitPool)}
              </span>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-[#1A1A1A]">
            <p className="text-[10px] text-white/30 text-center">
              Swipe right for the full waterfall breakdown
            </p>
          </div>
        </div>

        {/* CONVERSION CTAs - The money shot */}
        <div className="space-y-3">
          <p className="text-xs text-white/30 uppercase tracking-wider text-center mb-4">
            Take the next step
          </p>

          <CtaCard
            icon={<FileText className="w-5 h-5 text-gold" />}
            title="Get Your Custom Model"
            description="Download a full Excel waterfall model tailored to your specific deal structure."
            ctaText="Build My Model"
            href="https://filmmaker.og/store"
            variant="primary"
          />

          <CtaCard
            icon={<GraduationCap className="w-5 h-5 text-white/60" />}
            title="Learn the Business"
            description="Master film finance with our comprehensive producer courses and templates."
            ctaText="Explore Courses"
            href="https://filmmaker.og/courses"
            variant="secondary"
          />

          <CtaCard
            icon={<Users className="w-5 h-5 text-white/60" />}
            title="Talk to an Expert"
            description="Get personalized guidance on structuring your deal from industry professionals."
            ctaText="Book a Call"
            href="mailto:thefilmmaker.og@gmail.com?subject=Deal%20Review%20Request"
            variant="secondary"
          />
        </div>

        {/* Bottom note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-white/20 max-w-xs mx-auto leading-relaxed">
            Swipe right to see the full waterfall breakdown, or tap "See
            Breakdown" below.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevealStep;
