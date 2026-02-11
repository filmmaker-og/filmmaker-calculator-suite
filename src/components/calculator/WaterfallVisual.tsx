import { useEffect, useState } from "react";
import { formatCompactCurrency } from "@/lib/waterfall";
import { cn } from "@/lib/utils";

interface WaterfallVisualProps {
  revenue: number;
  offTheTop: number;
  debtService: number;
  equityPremium: number;
  deferments: number;
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
 * WaterfallVisual - Minimal payment ledger with "Grass" (Graph) visual indicators
 */
const WaterfallVisual = ({
  revenue,
  offTheTop,
  debtService,
  equityPremium,
  deferments,
  profitPool,
}: WaterfallVisualProps) => {
  const [revealCount, setRevealCount] = useState(0);

  // Calculate waterfall flow
  let remaining = revenue;

  const tiers: LedgerTier[] = [];
  let phaseNum = 1;

  // Phase 1: Off-the-Top
  const offTopPaid = Math.min(offTheTop, remaining);
  remaining -= offTopPaid;
  tiers.push({
    phase: `PHASE ${phaseNum}`,
    label: "Off-the-Top",
    amount: offTheTop,
    paid: offTopPaid,
    status: offTopPaid >= offTheTop ? "filled" : offTopPaid > 0 ? "partial" : "empty",
  });
  phaseNum++;

  // Phase 2: Debt Service
  if (debtService > 0) {
    const debtPaid = Math.min(debtService, remaining);
    remaining -= debtPaid;
    tiers.push({
      phase: `PHASE ${phaseNum}`,
      label: "Debt Service",
      amount: debtService,
      paid: debtPaid,
      status: debtPaid >= debtService ? "filled" : debtPaid > 0 ? "partial" : "empty",
    });
    phaseNum++;
  }

  // Phase 3: Equity + Premium
  if (equityPremium > 0) {
    const equityPaid = Math.min(equityPremium, remaining);
    remaining -= equityPaid;
    tiers.push({
      phase: `PHASE ${phaseNum}`,
      label: "Equity + Premium",
      amount: equityPremium,
      paid: equityPaid,
      status: equityPaid >= equityPremium ? "filled" : equityPaid > 0 ? "partial" : "empty",
    });
    phaseNum++;
  }

  // Phase 4: Deferments (after equity, before profit split)
  if (deferments > 0) {
    const defermentsPaid = Math.min(deferments, remaining);
    remaining -= defermentsPaid;
    tiers.push({
      phase: `PHASE ${phaseNum}`,
      label: "Deferments",
      amount: deferments,
      paid: defermentsPaid,
      status: defermentsPaid >= deferments ? "filled" : defermentsPaid > 0 ? "partial" : "empty",
    });
    phaseNum++;
  }

  // Profit Pool
  tiers.push({
    phase: `PHASE ${phaseNum}`,
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
  }, [revenue, offTheTop, debtService, equityPremium, deferments, profitPool]);

  const getPercentage = (tier: LedgerTier) => {
    if (tier.amount <= 0) return 0;
    return Math.min(100, (tier.paid / tier.amount) * 100);
  };

  return (
    <div className="space-y-1">
      {/* Gross Revenue Header */}
      <div
        className={cn(
          "relative flex items-center justify-between p-4 border transition-all duration-300 overflow-hidden",
          "bg-gold-subtle border-gold/20",
          revealCount > 0 ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Gold left accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background: 'linear-gradient(180deg, #D4AF37 0%, rgba(212,175,55,0.45) 100%)',
            boxShadow: '0 0 12px rgba(212,175,55,0.25)',
          }}
        />
        <div className="pl-3">
          <p className="text-[9px] uppercase tracking-wider text-text-dim mb-1">
            GROSS REVENUE
          </p>
          <p className="text-sm text-text-primary font-semibold">Acquisition Price</p>
        </div>
        <p className="font-mono text-xl text-text-primary font-medium tabular-nums">
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
                tier.status === "filled" && "bg-gold-subtle border-gold/20",
                tier.status === "partial" && "bg-bg-elevated border-border-subtle",
                tier.status === "empty" && "bg-bg-void border-border-subtle",
                isProfit && tier.paid > 0 && "bg-gold-subtle border-gold/20"
              )}
            >
              {/* Progress Fill (The "Grass" Visual?) - Making it more prominent */}
              <div
                className={cn(
                    "absolute inset-0 transition-all duration-500",
                    tier.status === "filled" ? "bg-gold-subtle/50" : "bg-gold-subtle/20" 
                )}
                style={{ width: `${percentage}%` }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  {/* Phase Badge */}
                  <div
                    className={cn(
                      "w-7 h-7 flex items-center justify-center text-[9px] font-mono font-medium",
                      tier.status === "filled" && "bg-gold text-black",
                      tier.status === "partial" && "bg-gold/20 text-text-primary border border-gold/20",
                      tier.status === "empty" && "bg-bg-header text-text-dim border border-border-subtle"
                    )}
                    style={tier.status === "filled" ? { boxShadow: '0 0 10px rgba(212,175,55,0.35)' } : undefined}
                  >
                    {index + 1}
                  </div>

                  {/* Labels */}
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-text-dim mb-0.5">
                      {tier.phase}
                    </p>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        tier.status === "filled" && "text-text-primary",
                        tier.status === "partial" && "text-text-mid",
                        tier.status === "empty" && "text-text-dim"
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
                      !isProfit && tier.status === "filled" && "text-text-primary",
                      !isProfit && tier.status === "partial" && "text-text-mid",
                      tier.status === "empty" && "text-text-dim"
                    )}
                  >
                    {isProfit ? "+" : "-"}{formatCompactCurrency(tier.paid)}
                  </p>
                  {tier.status === "partial" && (
                    <p className="text-[9px] text-text-dim font-mono">
                      of {formatCompactCurrency(tier.amount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar (Visual Indicator) */}
              <div className="relative mt-3 h-[4px] bg-bg-header overflow-hidden rounded-full">
                <div
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    isProfit ? "bg-gold" : "bg-gold-muted"
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Footer — The Big Number */}
      <div
        className={cn(
          "relative mt-4 pt-5 pb-2 border-t border-border-subtle transition-opacity duration-300",
          revealCount > tiers.length ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Radial gold glow behind profit number */}
        {profitPool > 0 && (
          <div
            className="absolute right-0 top-0 bottom-0 w-48 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at right center, rgba(212,175,55,0.12) 0%, transparent 70%)',
            }}
          />
        )}
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-wider text-text-dim mb-1 font-semibold">
              REMAINING FOR SPLIT
            </p>
            <p className="text-xs text-text-dim">
              50% Producer / 50% Investor
            </p>
          </div>
          <p
            className={cn(
              "font-mono text-2xl font-medium tabular-nums",
              profitPool > 0 ? "text-gold" : "text-text-dim"
            )}
            style={profitPool > 0 ? { textShadow: '0 0 20px rgba(212,175,55,0.4)' } : undefined}
          >
            {profitPool >= 0 ? "+" : ""}{formatCompactCurrency(profitPool)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WaterfallVisual;
