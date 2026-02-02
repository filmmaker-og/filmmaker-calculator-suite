import { useEffect, useState } from "react";
import { formatCompactCurrency } from "@/lib/waterfall";
import { Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterfallTier {
  label: string;
  sublabel: string;
  amount: number;
  remaining: number;
  colorClass: string;
  textColorClass: string;
}

interface WaterfallVisualProps {
  revenue: number;
  offTheTop: number;
  debtService: number;
  equityPremium: number;
  profitPool: number;
}

const WaterfallVisual = ({
  revenue,
  offTheTop,
  debtService,
  equityPremium,
  profitPool,
}: WaterfallVisualProps) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  // Calculate remaining after each tier
  const afterOffTheTop = revenue - offTheTop;
  const afterDebt = afterOffTheTop - debtService;
  const afterEquity = afterDebt - equityPremium;

  // Build dynamic tiers
  const tiers: WaterfallTier[] = [
    {
      label: "GROSS REVENUE",
      sublabel: "Streamer Buyout",
      amount: revenue,
      remaining: revenue,
      colorClass: "bg-gold",
      textColorClass: "text-gold",
    },
    {
      label: "OFF-THE-TOP",
      sublabel: "Sales, CAM, Guilds, Marketing",
      amount: offTheTop,
      remaining: afterOffTheTop,
      colorClass: "bg-zinc-600",
      textColorClass: "text-zinc-400",
    },
  ];

  if (debtService > 0) {
    tiers.push({
      label: "DEBT SERVICE",
      sublabel: "Senior + Mezz Repayment",
      amount: debtService,
      remaining: afterDebt,
      colorClass: "bg-red-600",
      textColorClass: "text-red-400",
    });
  }

  if (equityPremium > 0) {
    tiers.push({
      label: "EQUITY + PREF",
      sublabel: "Principal + Preferred Return",
      amount: equityPremium,
      remaining: afterEquity,
      colorClass: "bg-blue-600",
      textColorClass: "text-blue-400",
    });
  }

  tiers.push({
    label: "PROFIT POOL",
    sublabel: "50/50 Producer / Investor",
    amount: Math.abs(profitPool),
    remaining: profitPool,
    colorClass: profitPool > 0 ? "bg-emerald-500" : "bg-red-500",
    textColorClass: profitPool > 0 ? "text-emerald-400" : "text-red-400",
  });

  // Animate tiers appearing one by one
  useEffect(() => {
    setAnimationPhase(0);
    const timer = setInterval(() => {
      setAnimationPhase((prev) => {
        if (prev >= tiers.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(timer);
  }, [tiers.length]);

  // Bar width calculation
  const getWidth = (remaining: number) => {
    if (revenue <= 0) return 0;
    return Math.max(3, Math.min(100, (remaining / revenue) * 100));
  };

  return (
    <div className="relative">
      {/* Header with drip icon */}
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-4 h-4 text-gold/60" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-gold/60 font-medium">
          Revenue Flow
        </span>
      </div>

      {/* Waterfall visualization */}
      <div className="space-y-1">
        {tiers.map((tier, index) => {
          const isVisible = index < animationPhase;
          const isLast = index === tiers.length - 1;

          return (
            <div
              key={tier.label}
              className={cn(
                "transition-all duration-500 ease-out",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Tier row */}
              <div className="flex items-center gap-3 py-2">
                {/* Label column */}
                <div className="w-24 flex-shrink-0">
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", tier.textColorClass)}>
                    {tier.label}
                  </p>
                  <p className="text-[8px] text-muted-foreground/60 leading-tight mt-0.5 truncate">
                    {tier.sublabel}
                  </p>
                </div>

                {/* Bar */}
                <div className="flex-1 relative h-7">
                  <div className="absolute inset-0 bg-muted/20 rounded-sm" />
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-sm transition-all duration-700 ease-out flex items-center justify-end pr-2",
                      tier.colorClass,
                      isLast && profitPool > 0 && "animate-pulse"
                    )}
                    style={{
                      width: `${getWidth(isLast ? Math.abs(tier.remaining) : tier.remaining)}%`,
                    }}
                  >
                    {getWidth(tier.remaining) > 20 && (
                      <span className="text-[9px] font-mono text-white/90 font-semibold">
                        {formatCompactCurrency(Math.abs(tier.remaining))}
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount column */}
                <div className="w-16 text-right flex-shrink-0">
                  {index === 0 ? (
                    <span className="font-mono text-xs text-gold font-semibold">
                      {formatCompactCurrency(tier.amount)}
                    </span>
                  ) : isLast ? (
                    <span className={cn("font-mono text-xs font-semibold", tier.textColorClass)}>
                      {profitPool >= 0 ? "+" : "-"}
                      {formatCompactCurrency(tier.amount)}
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-destructive">
                      -{formatCompactCurrency(tier.amount)}
                    </span>
                  )}
                </div>
              </div>

              {/* Drip connector between tiers */}
              {!isLast && isVisible && (
                <div className="flex items-center gap-3 py-0.5">
                  <div className="w-24" />
                  <div className="flex-1 flex justify-start pl-2">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-0.5 h-3 transition-all duration-300",
                        tier.colorClass,
                        "opacity-40"
                      )} />
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full animate-drip transition-opacity",
                        tier.colorClass
                      )} />
                    </div>
                  </div>
                  <div className="w-16" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Final summary */}
      <div
        className={cn(
          "mt-6 pt-4 border-t border-border transition-all duration-500",
          animationPhase >= tiers.length ? "opacity-100" : "opacity-0"
        )}
        style={{ transitionDelay: `${tiers.length * 100 + 200}ms` }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Final Profit Pool
          </span>
          <span
            className={cn(
              "font-mono text-xl font-bold",
              profitPool > 0 ? "text-emerald-400" : "text-red-400"
            )}
          >
            {profitPool >= 0 ? "+" : ""}
            {formatCompactCurrency(profitPool)}
          </span>
        </div>
        <p className="text-[9px] text-muted-foreground/50 mt-1">
          Split 50/50 between producer and investors
        </p>
      </div>
    </div>
  );
};

export default WaterfallVisual;
