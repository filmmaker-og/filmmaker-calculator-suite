import { formatCompactCurrency } from "@/lib/waterfall";
import { ArrowDown } from "lucide-react";

interface WaterfallChartProps {
  revenue: number;
  offTheTop: number;
  debtService: number;
  equityPremium: number;
  profitPool: number;
}

const WaterfallChart = ({ revenue, offTheTop, debtService, equityPremium, profitPool }: WaterfallChartProps) => {

  // Calculate remaining after each tier
  const afterOffTheTop = revenue - offTheTop;
  const afterDebt = afterOffTheTop - debtService;
  const afterEquity = afterDebt - equityPremium;

  // Bar width percentages
  const getWidth = (amount: number) => {
    if (revenue <= 0) return 0;
    return Math.max(5, Math.min(100, (amount / revenue) * 100));
  };

  const tiers = [
    {
      label: "GROSS REVENUE",
      sublabel: "Streamer Buyout",
      amount: revenue,
      remaining: revenue,
      color: "bg-gold",
      barColor: "bg-gold/80",
      textColor: "text-gold",
      showArrow: true
    },
    {
      label: "OFF-THE-TOP",
      sublabel: "Sales, CAM, Guilds, Marketing",
      amount: offTheTop,
      remaining: afterOffTheTop,
      color: "bg-zinc-600",
      barColor: "bg-zinc-600",
      textColor: "text-zinc-400",
      showArrow: debtService > 0 || equityPremium > 0 || profitPool !== 0
    },
    ...(debtService > 0 ? [{
      label: "DEBT SERVICE",
      sublabel: "Senior + Mezz Repayment",
      amount: debtService,
      remaining: afterDebt,
      color: "bg-red-700",
      barColor: "bg-red-700/80",
      textColor: "text-red-400",
      showArrow: equityPremium > 0 || profitPool !== 0
    }] : []),
    ...(equityPremium > 0 ? [{
      label: "EQUITY + PREF",
      sublabel: "Principal + Preferred Return",
      amount: equityPremium,
      remaining: afterEquity,
      color: "bg-blue-700",
      barColor: "bg-blue-700/80",
      textColor: "text-blue-400",
      showArrow: true
    }] : []),
    {
      label: "PROFIT POOL",
      sublabel: "50/50 Producer / Investor",
      amount: profitPool,
      remaining: profitPool,
      color: profitPool > 0 ? "bg-emerald-600" : "bg-red-600",
      barColor: profitPool > 0 ? "bg-emerald-600" : "bg-red-600/50",
      textColor: profitPool > 0 ? "text-emerald-400" : "text-red-400",
      showArrow: false
    }
  ];

  return (
    <div className="space-y-1">
      {tiers.map((tier, index) => (
        <div key={tier.label}>
          {/* Tier Row */}
          <div className="flex items-center gap-4 py-3">
            {/* Left: Label */}
            <div className="w-28 flex-shrink-0">
              <p className={`text-[10px] font-bold uppercase tracking-wider ${tier.textColor}`}>
                {tier.label}
              </p>
              <p className="text-[9px] text-muted-foreground/70 leading-tight mt-0.5">
                {tier.sublabel}
              </p>
            </div>

            {/* Middle: Bar */}
            <div className="flex-1 relative">
              <div className="h-8 bg-muted/30 rounded-sm overflow-hidden">
                <div
                  className={`h-full ${tier.barColor} transition-all duration-700 ease-out flex items-center justify-end pr-2`}
                  style={{
                    width: `${getWidth(tier.remaining)}%`,
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {getWidth(tier.remaining) > 15 && (
                    <span className="text-[10px] font-mono text-white/90 font-semibold">
                      {formatCompactCurrency(tier.remaining)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Amount */}
            <div className="w-20 text-right flex-shrink-0">
              {index === 0 ? (
                <span className="font-mono text-sm text-gold font-semibold">
                  {formatCompactCurrency(tier.amount)}
                </span>
              ) : (
                <span className={`font-mono text-sm ${tier.textColor}`}>
                  {tier.label === "PROFIT POOL" && tier.amount > 0 ? '+' : '-'}
                  {formatCompactCurrency(Math.abs(tier.amount))}
                </span>
              )}
              <p className="text-[9px] text-muted-foreground/60 font-mono">
                {((tier.remaining / revenue) * 100).toFixed(0)}% left
              </p>
            </div>
          </div>

          {/* Arrow connector */}
          {tier.showArrow && index < tiers.length - 1 && (
            <div className="flex items-center gap-4 py-1">
              <div className="w-28" />
              <div className="flex-1 flex justify-center">
                <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
              </div>
              <div className="w-20" />
            </div>
          )}
        </div>
      ))}

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Final Profit Pool
          </span>
          <span className={`font-mono text-lg font-bold ${profitPool > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {profitPool > 0 ? '+' : ''}{formatCompactCurrency(profitPool)}
          </span>
        </div>
        <p className="text-[9px] text-muted-foreground/60 mt-1">
          Split 50/50 between producer and investors
        </p>
      </div>
    </div>
  );
};

export default WaterfallChart;
