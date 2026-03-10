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
          "relative flex items-center justify-between p-4 overflow-hidden transition-all duration-300",
          revealCount > 0 ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: "rgba(212,175,55,0.08)",
          border: "1px solid rgba(212,175,55,0.20)",
        }}
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
          <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(255,255,255,0.40)" }}>
            GROSS REVENUE
          </p>
          <p className="text-sm font-semibold" style={{ color: "#fff" }}>Acquisition Price</p>
        </div>
        <p className="font-mono text-xl font-medium tabular-nums" style={{ color: "#fff" }}>
          {formatCompactCurrency(revenue)}
        </p>
      </div>

      {/* Tiers */}
      {tiers.map((tier, index) => {
        const isRevealed = index + 1 < revealCount;
        const percentage = getPercentage(tier);
        const isProfit = tier.label === "Profit Pool";

        const isFilled = tier.status === "filled" || (isProfit && tier.paid > 0);

        return (
          <div
            key={tier.label}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              isRevealed ? "opacity-100" : "opacity-0"
            )}
          >
            <div
              className="relative p-4"
              style={{
                border: "1px solid " + (isFilled ? "rgba(212,175,55,0.20)" : "rgba(255,255,255,0.06)"),
                background: isFilled
                  ? "rgba(212,175,55,0.08)"
                  : tier.status === "partial"
                    ? "#0A0A0A"
                    : "#000",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              {/* Progress Fill */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background: tier.status === "filled" ? "rgba(212,175,55,0.04)" : "rgba(212,175,55,0.02)",
                  width: `${percentage}%`,
                }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  {/* Phase Badge */}
                  <div
                    className="flex items-center justify-center text-[9px] font-mono font-medium"
                    style={{
                      width: "28px",
                      height: "28px",
                      ...(tier.status === "filled"
                        ? { background: "#D4AF37", color: "#000", boxShadow: "0 0 10px rgba(212,175,55,0.35)" }
                        : tier.status === "partial"
                          ? { background: "rgba(212,175,55,0.20)", color: "#fff", border: "1px solid rgba(212,175,55,0.20)" }
                          : { background: "#000", color: "rgba(255,255,255,0.40)", border: "1px solid rgba(255,255,255,0.06)" }
                      ),
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* Labels */}
                  <div>
                    <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>
                      {tier.phase}
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: tier.status === "filled"
                          ? "#fff"
                          : tier.status === "partial"
                            ? "rgba(255,255,255,0.70)"
                            : "rgba(255,255,255,0.40)",
                      }}
                    >
                      {tier.label}
                    </p>
                  </div>
                </div>

                {/* Amounts */}
                <div className="text-right">
                  <p
                    className="font-mono text-base font-medium tabular-nums"
                    style={{
                      color: isProfit && tier.paid > 0
                        ? "#D4AF37"
                        : !isProfit && tier.status === "filled"
                          ? "#fff"
                          : !isProfit && tier.status === "partial"
                            ? "rgba(255,255,255,0.70)"
                            : "rgba(255,255,255,0.40)",
                    }}
                  >
                    {isProfit ? "+" : "-"}{formatCompactCurrency(tier.paid)}
                  </p>
                  {tier.status === "partial" && (
                    <p className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.40)" }}>
                      of {formatCompactCurrency(tier.amount)}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar (Visual Indicator) */}
              <div className="relative mt-3 overflow-hidden rounded-full" style={{ height: "4px", background: "#000" }}>
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    background: isProfit ? "#D4AF37" : "rgba(212,175,55,0.50)",
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Footer — The Big Number */}
      <div
        className={cn(
          "relative mt-4 pt-5 pb-2 transition-opacity duration-300",
          revealCount > tiers.length ? "opacity-100" : "opacity-0"
        )}
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
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
            <p className="text-[9px] uppercase tracking-wider mb-1 font-semibold" style={{ color: "rgba(255,255,255,0.40)" }}>
              REMAINING FOR SPLIT
            </p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
              50% Producer / 50% Investor
            </p>
          </div>
          <p
            className="font-mono text-2xl font-medium tabular-nums"
            style={{
              color: profitPool > 0 ? "#D4AF37" : "rgba(255,255,255,0.40)",
              ...(profitPool > 0 ? { textShadow: '0 0 20px rgba(212,175,55,0.4)' } : {}),
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
