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
 * WaterfallVisual - Minimal payment ledger
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

  const tiers: LedgerTier[] = [];

  // Phase 1: Off-the-Top
  const offTopPaid = Math.min(offTheTop, remaining);
  remaining -= offTopPaid;
  tiers.push({
    phase: "PHASE 1",
    label: "Off-the-Top",
    amount: offTheTop,
    paid: offTopPaid,
    status: offTopPaid >= offTheTop ? "filled" : offTopPaid > 0 ? "partial" : "empty",
  });

  // Phase 2: Debt Service
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

  // Phase 3: Equity + Premium
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

  // Profit Pool
  const lastPhase = tiers.length + 1;
  tiers.push({
    phase: `PHASE ${lastPhase}`,
    label: "Profit Pool",
    amount: Math.max(0, profitPool),
    paid: Math.max(0, profitPool),
    status: profitPool > 0 ? "filled" : "empty",
  });

  // Animate reveal
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
    }, 200);
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
          "flex items-center justify-between p-4 bg-white/5 border border-[#1A1A1A] transition-all duration-300",
          revealCount > 0 ? "opacity-100" : "opacity-0"
        )}
      >
        <div>
          <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
            GROSS REVENUE
          </p>
          <p className="text-sm text-white">Acquisition Price</p>
        </div>
        <p className="font-mono text-xl text-white font-medium tabular-nums">
          {formatCompactCurrency(revenue)}
        </p>
      </div>

      {/* Tiers */}
      {tiers.map((tier, index) => {
        const isRevealed = index + 1 < revealCount;
        const percentage = getPercentage(tier);
        const isProfit = tier.label === "Profit Pool";

        return (
          <div
            key={tier.label}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              isRevealed ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className={cn(
                "relative p-4 border transition-colors",
                tier.status === "filled" && "bg-white/5 border-white/20",
                tier.status === "partial" && "bg-white/[0.02] border-[#1A1A1A]",
                tier.status === "empty" && "bg-black border-[#1A1A1A]",
                isProfit && tier.paid > 0 && "bg-white/5 border-white/20"
              )}
            >
              {/* Progress Fill */}
              <div
                className="absolute inset-0 bg-white/5 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Phase Badge */}
                  <div
                    className={cn(
                      "w-7 h-7 flex items-center justify-center text-[9px] font-mono font-medium",
                      tier.status === "filled" && "bg-white text-black",
                      tier.status === "partial" && "bg-white/20 text-white border border-white/20",
                      tier.status === "empty" && "bg-[#1A1A1A] text-white/30 border border-[#2A2A2A]"
                    )}
                  >
                    {index + 1}
                  </div>

                  {/* Labels */}
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/40 mb-0.5">
                      {tier.phase}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        tier.status === "filled" && "text-white",
                        tier.status === "partial" && "text-white/80",
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
                      "font-mono text-base font-medium tabular-nums",
                      isProfit && tier.paid > 0 && "text-gold",
                      !isProfit && tier.status === "filled" && "text-white",
                      !isProfit && tier.status === "partial" && "text-white/70",
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
              <div className="relative mt-3 h-[2px] bg-[#1A1A1A] overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    isProfit ? "bg-gold" : "bg-white/40"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Footer */}
      <div
        className={cn(
          "mt-4 pt-4 border-t border-[#1A1A1A] transition-opacity duration-300",
          revealCount > tiers.length ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">
              REMAINING FOR SPLIT
            </p>
            <p className="text-xs text-white/40">
              50% Producer / 50% Investor
            </p>
          </div>
          <p
            className={cn(
              "font-mono text-2xl font-medium tabular-nums",
              profitPool > 0 ? "text-gold" : "text-white/30"
            )}
          >
            {profitPool >= 0 ? "+" : ""}{formatCompactCurrency(profitPool)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterfallVisual;
