import { useEffect, useState } from "react";
import { formatCompactCurrency } from "@/lib/waterfall";
import { cn } from "@/lib/utils";

interface WaterfallVisualProps {
  revenue: number;
  offTheTop: number;
  debtService: number;
  equityPremium: number;
  profitPool: number;
}

interface LedgerTier {
  phase: string;
  label: string;
  amount: number;
  paid: number;
  status: "empty" | "partial" | "filled";
}

/**
 * WaterfallVisual - Row-based payment ledger
 *
 * Shows how revenue flows through each tier with:
 * - Phase groupings (Off-the-Top, Debt, Equity, Profit)
 * - Progress fill bars showing % paid
 * - Gold-only color palette (brand compliant)
 * - Animated sequential reveal
 */
const WaterfallVisual = ({
  revenue,
  offTheTop,
  debtService,
  equityPremium,
  profitPool,
}: WaterfallVisualProps) => {
  const [revealCount, setRevealCount] = useState(0);

  // Calculate waterfall flow
  let remaining = revenue;

  // Build tiers dynamically based on what's actually in the deal
  const tiers: LedgerTier[] = [];

  // Phase 1: Off-the-Top (always present)
  const offTopPaid = Math.min(offTheTop, remaining);
  remaining -= offTopPaid;
  tiers.push({
    phase: "PHASE 1",
    label: "Off-the-Top",
    amount: offTheTop,
    paid: offTopPaid,
    status: offTopPaid >= offTheTop ? "filled" : offTopPaid > 0 ? "partial" : "empty",
  });

  // Phase 2: Debt Service (if any)
  if (debtService > 0) {
    const debtPaid = Math.min(debtService, remaining);
    remaining -= debtPaid;
    tiers.push({
      phase: "PHASE 2",
      label: "Debt Service",
      amount: debtService,
      paid: debtPaid,
      status: debtPaid >= debtService ? "filled" : debtPaid > 0 ? "partial" : "empty",
    });
  }

  // Phase 3: Equity + Premium (if any)
  if (equityPremium > 0) {
    const equityPaid = Math.min(equityPremium, remaining);
    remaining -= equityPaid;
    tiers.push({
      phase: debtService > 0 ? "PHASE 3" : "PHASE 2",
      label: "Equity + Premium",
      amount: equityPremium,
      paid: equityPaid,
      status: equityPaid >= equityPremium ? "filled" : equityPaid > 0 ? "partial" : "empty",
    });
  }

  // Phase 4: Profit Pool
  const lastPhase = tiers.length + 1;
  tiers.push({
    phase: `PHASE ${lastPhase}`,
    label: "Profit Pool",
    amount: Math.max(0, profitPool),
    paid: Math.max(0, profitPool),
    status: profitPool > 0 ? "filled" : "empty",
  });

  // Animate tiers revealing one by one
  useEffect(() => {
    setRevealCount(0);
    const timer = setInterval(() => {
      setRevealCount((prev) => {
        if (prev >= tiers.length + 1) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [revenue, offTheTop, debtService, equityPremium, profitPool]);

  const getPercentage = (tier: LedgerTier) => {
    if (tier.amount <= 0) return 0;
    return Math.min(100, (tier.paid / tier.amount) * 100);
  };

  return (
    <div className="space-y-1">
      {/* Gross Revenue Header */}
      <div
        className={cn(
          "flex items-center justify-between p-4 bg-gold/10 border border-gold/30 transition-all duration-500",
          revealCount > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-gold/60 mb-1">
            GROSS REVENUE
          </p>
          <p className="text-sm text-white font-medium">Acquisition Price</p>
        </div>
        <p className="font-mono text-xl text-gold font-bold tabular-nums">
          {formatCompactCurrency(revenue)}
        </p>
      </div>

      {/* Waterfall Tiers */}
      {tiers.map((tier, index) => {
        const isRevealed = index + 1 < revealCount;
        const percentage = getPercentage(tier);
        const isProfit = tier.label === "Profit Pool";

        return (
          <div
            key={tier.label}
            className={cn(
              "relative overflow-hidden transition-all duration-500",
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: `${(index + 1) * 100}ms` }}
          >
            {/* Tier Container */}
            <div
              className={cn(
                "relative p-4 border transition-all duration-300",
                tier.status === "filled" && "bg-gold/5 border-gold/30",
                tier.status === "partial" && "bg-gold/[0.02] border-gold/20",
                tier.status === "empty" && "bg-[#0A0A0A] border-[#1A1A1A]",
                isProfit && tier.paid > 0 && "bg-gold/10 border-gold/40"
              )}
            >
              {/* Progress Fill Background */}
              <div
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-out",
                  isProfit ? "bg-gold/20" : "bg-gold/10"
                )}
                style={{
                  width: `${percentage}%`,
                  boxShadow: percentage > 0 ? "inset -2px 0 8px rgba(212, 175, 55, 0.2)" : "none",
                }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Phase Badge */}
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center text-[9px] font-mono font-bold transition-colors",
                      tier.status === "filled" && "bg-gold text-black",
                      tier.status === "partial" && "bg-gold/30 text-gold border border-gold/50",
                      tier.status === "empty" && "bg-[#1A1A1A] text-white/30 border border-[#2A2A2A]"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Labels */}
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-0.5">
                      {tier.phase}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors",
                        tier.status === "filled" && "text-gold",
                        tier.status === "partial" && "text-white",
                        tier.status === "empty" && "text-white/50"
                      )}
                    >
                      {tier.label}
                    </p>
                  </div>
                </div>

                {/* Amounts */}
                <div className="text-right">
                  <p
                    className={cn(
                      "font-mono text-base font-semibold tabular-nums transition-colors",
                      isProfit && tier.paid > 0 && "text-gold",
                      !isProfit && tier.status === "filled" && "text-gold",
                      !isProfit && tier.status === "partial" && "text-white",
                      tier.status === "empty" && "text-white/30"
                    )}
                  >
                    {isProfit ? "+" : "-"}{formatCompactCurrency(tier.paid)}
                  </p>
                  {tier.status === "partial" && (
                    <p className="text-[9px] text-white/30 font-mono">
                      of {formatCompactCurrency(tier.amount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative mt-3 h-1 bg-[#1A1A1A] overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-700 ease-out",
                    isProfit ? "bg-gold" : "bg-gold/60"
                  )}
                  style={{
                    width: `${percentage}%`,
                    boxShadow: percentage > 0 ? "0 0 8px rgba(212, 175, 55, 0.5)" : "none",
                  }}
                />
              </div>

              {/* Status Indicator */}
              {tier.status === "filled" && !isProfit && (
                <div className="absolute top-2 right-2">
                  <span className="text-[8px] uppercase tracking-wider text-gold/60 font-semibold">
                    PAID
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Summary Footer */}
      <div
        className={cn(
          "mt-4 pt-4 border-t border-gold/20 transition-all duration-500",
          revealCount > tiers.length ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: `${(tiers.length + 1) * 100}ms` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1">
              REMAINING FOR SPLIT
            </p>
            <p className="text-xs text-white/50">
              50% Producer / 50% Investor
            </p>
          </div>
          <p
            className={cn(
              "font-mono text-2xl font-bold tabular-nums",
              profitPool > 0 ? "text-gold" : "text-white/30"
            )}
            style={{
              textShadow: profitPool > 0 ? "0 0 30px rgba(212, 175, 55, 0.5)" : "none",
            }}
          >
            {profitPool >= 0 ? "+" : ""}{formatCompactCurrency(profitPool)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterfallVisual;
