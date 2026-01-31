import { WaterfallInputs, GuildState, formatCompactCurrency } from "@/lib/waterfall";
import { useEffect, useState } from "react";

interface OffTopTotalStepProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
}

const OffTopTotalStep = ({ inputs, guilds }: OffTopTotalStepProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [displayTotal, setDisplayTotal] = useState(0);

  // Calculate based on hypothetical 1.2x deal for context
  const hypotheticalRevenue = inputs.budget * 1.2;
  
  const salesFeeAmount = hypotheticalRevenue * (inputs.salesFee / 100);
  const camAmount = hypotheticalRevenue * 0.01;
  const marketingAmount = inputs.salesExp;
  
  const guildsPct = (guilds.sag ? 0.045 : 0) + (guilds.wga ? 0.012 : 0) + (guilds.dga ? 0.012 : 0);
  const guildsAmount = hypotheticalRevenue * guildsPct;

  const totalOffTop = salesFeeAmount + camAmount + marketingAmount + guildsAmount;

  const lines = [
    { label: `Sales Agent (${inputs.salesFee}%)`, amount: salesFeeAmount, show: inputs.salesFee > 0 },
    { label: 'CAM Fee (1%)', amount: camAmount, show: true },
    { label: 'Marketing Cap', amount: marketingAmount, show: marketingAmount > 0 },
    { label: 'Guild Residuals', amount: guildsAmount, show: guildsAmount > 0 },
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

  // Animate total counting up
  useEffect(() => {
    if (visibleLines >= lines.length) {
      const duration = 600;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayTotal(totalOffTop * eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      setTimeout(() => requestAnimationFrame(animate), 400);
    }
  }, [visibleLines, lines.length, totalOffTop]);

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
              -{formatCompactCurrency(line.amount)}
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

        {/* Total - Animated Count */}
        <div 
          className={`flex items-center justify-between transition-all duration-500 ${
            visibleLines >= lines.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: `${lines.length * 100 + 400}ms` }}
        >
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Total Off-The-Top
          </span>
          <span className="font-mono text-3xl text-destructive font-bold">
            -{formatCompactCurrency(displayTotal)}
          </span>
        </div>
      </div>

      {/* Ominous Message */}
      <div 
        className={`mt-8 text-center transition-all duration-500 ${
          visibleLines >= lines.length ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${lines.length * 100 + 600}ms` }}
      >
        <p className="text-muted-foreground text-sm italic">
          "And we haven't even talked about your <span className="text-gold">investors</span> yet."
        </p>
      </div>
    </div>
  );
};

export default OffTopTotalStep;
