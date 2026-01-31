import { useMemo } from "react";
import { formatCompactCurrency } from "@/lib/waterfall";

interface WaterfallChartProps {
  revenue: number;
  offTheTop: number;
  debtService: number;
  equityPremium: number;
  profitPool: number;
}

interface WaterfallTier {
  label: string;
  sublabel: string;
  amount: number;
  cumulative: number;
  color: string;
  textColor: string;
}

const WaterfallChart = ({ revenue, offTheTop, debtService, equityPremium, profitPool }: WaterfallChartProps) => {
  const tiers = useMemo<WaterfallTier[]>(() => {
    let cumulative = 0;

    const items: WaterfallTier[] = [
      {
        label: "GROSS REVENUE",
        sublabel: "Streamer Buyout",
        amount: revenue,
        cumulative: 0,
        color: "bg-gold",
        textColor: "text-gold"
      }
    ];

    if (offTheTop > 0) {
      cumulative += offTheTop;
      items.push({
        label: "FIRST MONEY OUT",
        sublabel: "CAM, Sales, Guilds, Marketing",
        amount: offTheTop,
        cumulative,
        color: "bg-zinc-600",
        textColor: "text-zinc-400"
      });
    }

    if (debtService > 0) {
      cumulative += debtService;
      items.push({
        label: "DEBT SERVICE",
        sublabel: "Senior + Mezz Repayment",
        amount: debtService,
        cumulative,
        color: "bg-red-900/80",
        textColor: "text-red-400"
      });
    }

    if (equityPremium > 0) {
      cumulative += equityPremium;
      items.push({
        label: "EQUITY + PREMIUM",
        sublabel: "Investor Principal + Preferred",
        amount: equityPremium,
        cumulative,
        color: "bg-blue-900/80",
        textColor: "text-blue-400"
      });
    }

    items.push({
      label: "PROFIT POOL",
      sublabel: "50/50 Split Available",
      amount: profitPool,
      cumulative: cumulative + profitPool,
      color: profitPool > 0 ? "bg-emerald-600" : "bg-red-600",
      textColor: profitPool > 0 ? "text-emerald-400" : "text-red-400"
    });

    return items;
  }, [revenue, offTheTop, debtService, equityPremium, profitPool]);

  // Calculate widths as percentages
  const getWidth = (amount: number) => {
    if (revenue <= 0) return 0;
    return Math.max(0, Math.min(100, (amount / revenue) * 100));
  };

  return (
    <div className="space-y-3">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bebas text-sm tracking-widest text-gold uppercase">
          Revenue Waterfall
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          {formatCompactCurrency(revenue)} TOTAL
        </span>
      </div>

      {/* Stacked Bar Visualization */}
      <div className="relative h-12 bg-card rounded-sm overflow-hidden border border-border">
        <div className="absolute inset-0 flex">
          {/* Off-the-top */}
          {offTheTop > 0 && (
            <div
              className="h-full bg-zinc-700 transition-all duration-500 flex items-center justify-center"
              style={{ width: `${getWidth(offTheTop)}%` }}
            >
              {getWidth(offTheTop) > 10 && (
                <span className="text-[10px] font-mono text-zinc-300 truncate px-1">
                  {formatCompactCurrency(offTheTop)}
                </span>
              )}
            </div>
          )}
          {/* Debt */}
          {debtService > 0 && (
            <div
              className="h-full bg-red-900/70 transition-all duration-500 flex items-center justify-center"
              style={{ width: `${getWidth(debtService)}%` }}
            >
              {getWidth(debtService) > 10 && (
                <span className="text-[10px] font-mono text-red-300 truncate px-1">
                  {formatCompactCurrency(debtService)}
                </span>
              )}
            </div>
          )}
          {/* Equity */}
          {equityPremium > 0 && (
            <div
              className="h-full bg-blue-900/70 transition-all duration-500 flex items-center justify-center"
              style={{ width: `${getWidth(equityPremium)}%` }}
            >
              {getWidth(equityPremium) > 10 && (
                <span className="text-[10px] font-mono text-blue-300 truncate px-1">
                  {formatCompactCurrency(equityPremium)}
                </span>
              )}
            </div>
          )}
          {/* Profit Pool */}
          <div
            className={`h-full transition-all duration-500 flex items-center justify-center ${
              profitPool > 0 ? 'bg-emerald-600' : 'bg-red-600/50'
            }`}
            style={{ width: `${getWidth(Math.max(0, profitPool))}%` }}
          >
            {getWidth(profitPool) > 8 && (
              <span className={`text-[10px] font-mono truncate px-1 ${
                profitPool > 0 ? 'text-emerald-100' : 'text-red-200'
              }`}>
                {formatCompactCurrency(profitPool)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-zinc-700" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Off-the-Top</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-red-900/70" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Debt Service</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-blue-900/70" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Equity + Pref</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-sm ${profitPool > 0 ? 'bg-emerald-600' : 'bg-red-600/50'}`} />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Profit Pool</span>
        </div>
      </div>

      {/* Tier Breakdown List */}
      <div className="mt-4 space-y-2 pt-4 border-t border-border">
        {tiers.slice(1).map((tier, index) => (
          <div
            key={tier.label}
            className="flex items-center justify-between py-2 px-3 rounded-sm bg-card/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-[10px] font-mono text-muted-foreground">{index + 1}</span>
              </div>
              <div>
                <p className={`text-xs font-semibold ${tier.textColor}`}>{tier.label}</p>
                <p className="text-[10px] text-muted-foreground">{tier.sublabel}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-mono text-sm ${tier.textColor}`}>
                {tier.label === "PROFIT POOL" && tier.amount > 0 ? '+' : '-'}
                {formatCompactCurrency(Math.abs(tier.amount))}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {((tier.amount / revenue) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterfallChart;
