import { WaterfallInputs, GuildState, formatCompactCurrency, getOffTopRate } from "@/lib/waterfall";
import { useEffect, useState } from "react";

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
  const marketingCap = inputs.salesExp || 0;

  const totalOffTopRate = getOffTopRate(inputs, guilds);

  const lines = [
    { label: 'Sales Agent', value: `${salesFeePct}%`, show: salesFeePct > 0 },
    { label: 'CAM Fee', value: `${camPct}%`, show: true },
    { label: 'Guild Residuals', value: `${guildsPct.toFixed(1)}%`, show: guildsPct > 0 },
  ].filter(l => l.show);

  // Animate lines appearing
  useEffect(() => {
    setVisibleLines(0);
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= lines.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => clearInterval(timer);
  }, [lines.length]);

  // Animate rate counting up
  useEffect(() => {
    if (visibleLines >= lines.length) {
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
  }, [visibleLines, lines.length, totalOffTopRate]);

  return (
    <div className="step-enter min-h-[60vh] flex flex-col justify-center">
      {/* The Header */}
      <div className="text-center mb-8">
        <h2 className="font-bebas text-2xl tracking-[0.1em] text-foreground mb-2">
          Here's what comes off
          <br />
          <span className="text-gold">the top</span>
        </h2>
        <p className="text-muted-foreground text-sm">
          Before anyone gets repaid.
        </p>
      </div>

      {/* The Ledger - Animated */}
      <div className="bg-card border border-border p-6 space-y-4">
        {lines.map((line, index) => (
          <div
            key={line.label}
            className={`flex items-center justify-between py-3 border-b border-border/50 last:border-0 transition-all duration-300 ${
              index < visibleLines ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <span className="text-foreground text-sm">{line.label}</span>
            <span className="font-mono text-lg text-destructive">
              -{line.value}
            </span>
          </div>
        ))}

        {/* Divider */}
        <div 
          className={`h-px bg-gold/50 my-4 transition-all duration-500 ${
            visibleLines >= lines.length ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ transitionDelay: `${lines.length * 100 + 200}ms` }}
        />

        {/* Total Rate - Animated */}
        <div 
          className={`flex items-center justify-between transition-all duration-500 ${
            visibleLines >= lines.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${lines.length * 100 + 400}ms` }}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Off-The-Top Rate
          </span>
          <span className="font-mono text-3xl text-destructive font-bold">
            -{displayRate.toFixed(1)}%
          </span>
        </div>

        {/* Marketing Cap - Fixed Amount */}
        {marketingCap > 0 && (
          <div 
            className={`flex items-center justify-between pt-4 border-t border-border/50 transition-all duration-500 ${
              visibleLines >= lines.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${lines.length * 100 + 500}ms` }}
          >
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Plus: Marketing Cap
            </span>
            <span className="font-mono text-lg text-destructive">
              -{formatCompactCurrency(marketingCap)}
            </span>
          </div>
        )}
      </div>

      {/* Explanation */}
      <div 
        className={`mt-8 text-center transition-all duration-500 ${
          visibleLines >= lines.length ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${lines.length * 100 + 600}ms` }}
      >
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
          <span className="text-gold font-semibold">{displayRate.toFixed(1)}%</span> of whatever the streamer pays goes to these parties first
          {marketingCap > 0 && <>, plus <span className="text-gold font-semibold">{formatCompactCurrency(marketingCap)}</span> in marketing</>}.
        </p>
      </div>

      {/* Ominous Message */}
      <div 
        className={`mt-6 text-center transition-all duration-500 ${
          visibleLines >= lines.length ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${lines.length * 100 + 800}ms` }}
      >
        <p className="text-muted-foreground/60 text-xs italic">
          "And we haven't even talked about your <span className="text-gold">investors</span> yet."
        </p>
      </div>
    </div>
  );
};

export default OffTopTotalStep;
