import { WaterfallInputs, GuildState, formatCompactCurrency, getOffTopRate } from "@/lib/waterfall";
import { useEffect, useState } from "react";
import { Percent, DollarSign, Scissors } from "lucide-react";

interface OffTopTotalStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
}

const OffTopTotalStep = ({ inputs, guilds }: OffTopTotalStepProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [displayRate, setDisplayRate] = useState(0);

  // Calculate percentages (not dollar amounts)
  const salesFeePct = inputs.salesFee || 0;
  const camPct = 1; // Fixed 1%
  const guildsPct = (guilds.sag ? 4.5 : 0) + (guilds.wga ? 1.2 : 0) + (guilds.dga ? 1.2 : 0);
  const salesExpCap = inputs.salesExp || 0;
  const marketingCap = inputs.marketingExp || 0;

  const totalOffTopRate = getOffTopRate(inputs, guilds);

  // Percentage-based lines (variable costs)
  const percentageLines = [
    { label: 'Sales Agent Commission', value: `${salesFeePct}%`, show: salesFeePct > 0, icon: Percent },
    { label: 'Collection Account (CAM)', value: `${camPct}%`, show: true, icon: Percent },
    { label: 'Guild Residuals', value: `${guildsPct.toFixed(1)}%`, show: guildsPct > 0, icon: Percent },
  ].filter(l => l.show);

  // Fixed dollar lines (sales expenses + marketing are now separate)
  const fixedLines = [
    { label: 'Sales Expenses', value: formatCompactCurrency(salesExpCap), show: salesExpCap > 0, icon: DollarSign },
    { label: 'Marketing & Delivery', value: formatCompactCurrency(marketingCap), show: marketingCap > 0, icon: DollarSign },
  ].filter(l => l.show);

  const allLines = [...percentageLines, ...fixedLines];

  // Animate lines appearing
  useEffect(() => {
    setVisibleLines(0);
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= allLines.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [allLines.length]);

  // Animate rate counting up
  useEffect(() => {
    if (visibleLines >= allLines.length) {
      const duration = 600;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayRate(totalOffTopRate * eased);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      setTimeout(() => requestAnimationFrame(animate), 400);
    }
  }, [visibleLines, allLines.length, totalOffTopRate]);

  return (
    <div className="step-enter min-h-[60vh] flex flex-col justify-center">
      {/* Step Header with icon - Consistent with other steps */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
              filter: 'blur(15px)',
              transform: 'scale(2)',
            }}
          />
          <div className="relative w-14 h-14 border border-gold/30 bg-gold/5 flex items-center justify-center">
            <Scissors className="w-7 h-7 text-gold" />
          </div>
        </div>

        <h2 className="font-bebas text-3xl tracking-[0.08em] text-white mb-2">
          Here's what comes off
          <br />
          <span className="text-gold">the top</span>
        </h2>
        <p className="text-white/50 text-sm">
          Before anyone gets repaid.
        </p>
      </div>

      {/* The Ledger - Using matte-section for consistency */}
      <div className="matte-section overflow-hidden">
        {/* Section: Variable Costs */}
        <div className="p-5 pb-2">
          <p className="text-[9px] uppercase tracking-widest text-white/30 mb-3">
            Variable (% of gross)
          </p>
          {percentageLines.map((line, index) => {
            const Icon = line.icon;
            return (
              <div
                key={line.label}
                className={`flex items-center justify-between py-3 border-b border-[#1A1A1A] last:border-0 transition-all duration-300 ${
                  index < visibleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-white text-sm">{line.label}</span>
                </div>
                <span className="font-mono text-base text-red-400 font-medium">
                  -{line.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Section: Fixed Costs */}
        {fixedLines.length > 0 && (
          <div className="px-5 pt-3 border-t border-[#1A1A1A]">
            <p className="text-[9px] uppercase tracking-widest text-white/30 mb-3">
              Fixed Amount
            </p>
            {fixedLines.map((line, index) => {
              const Icon = line.icon;
              const globalIndex = percentageLines.length + index;
              return (
                <div
                  key={line.label}
                  className={`flex items-center justify-between py-3 transition-all duration-300 ${
                    globalIndex < visibleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
                  style={{ transitionDelay: `${globalIndex * 100}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-white text-sm">{line.label}</span>
                  </div>
                  <span className="font-mono text-base text-red-400 font-medium">
                    -{line.value}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div className="px-5">
          <div
            className={`h-px bg-gold/50 my-4 transition-all duration-500 ${
              visibleLines >= allLines.length ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transitionDelay: `${allLines.length * 100 + 200}ms`, transformOrigin: 'left' }}
          />
        </div>

        {/* Total Rate - Animated */}
        <div className="p-5 pt-0">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              visibleLines >= allLines.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${allLines.length * 100 + 400}ms` }}
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-white/40 block">
                Combined Off-Top Rate
              </span>
              {(salesExpCap > 0 || marketingCap > 0) && (
                <span className="text-[10px] text-white/30">
                  + {formatCompactCurrency(salesExpCap + marketingCap)} fixed costs
                </span>
              )}
            </div>
            <span className="font-mono text-3xl text-red-400 font-bold">
              -{displayRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div
        className={`mt-8 text-center transition-all duration-500 ${
          visibleLines >= allLines.length ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${allLines.length * 100 + 600}ms` }}
      >
        <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
          <span className="text-gold font-semibold">{displayRate.toFixed(1)}%</span> of whatever the streamer pays goes to these parties first
          {(salesExpCap > 0 || marketingCap > 0) && <>, plus <span className="text-gold font-semibold">{formatCompactCurrency(salesExpCap + marketingCap)}</span> in fixed costs</>}.
        </p>
      </div>

      {/* Ominous Message */}
      <div
        className={`mt-6 text-center transition-all duration-500 ${
          visibleLines >= allLines.length ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${allLines.length * 100 + 800}ms` }}
      >
        <p className="text-white/30 text-xs italic">
          "And we haven't even talked about your <span className="text-gold">investors</span> yet."
        </p>
      </div>
    </div>
  );
};

export default OffTopTotalStep;
