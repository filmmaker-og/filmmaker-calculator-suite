import { WaterfallResult, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface RevealStepProps {
  result: WaterfallResult;
  equity: number;
}

const RevealStep = ({ result, equity }: RevealStepProps) => {
  const isProfitable = result.profitPool > 0;
  const isStrong = result.multiple >= 1.2;
  const isUnderperforming = result.multiple < 1.2 && equity > 0;

  return (
    <div className="step-enter min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* The Big Reveal */}
      <div className="relative mb-8">
        {/* Glow effect */}
        <div
          className="absolute"
          style={{
            width: '300px',
            height: '300px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: isProfitable 
              ? 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 50%, transparent 70%)'
              : 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }}
        />
        
        {/* Label */}
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground font-semibold mb-4 relative z-10">
          Your Profit Pool
        </p>
        
        {/* The Number */}
        <p
          className="font-bebas text-7xl sm:text-8xl tabular-nums leading-none relative z-10"
          style={{
            color: isProfitable ? 'hsl(var(--gold))' : 'hsl(0 70% 60%)',
            textShadow: isProfitable 
              ? '0 0 60px rgba(212, 175, 55, 0.4)'
              : '0 0 40px rgba(239, 68, 68, 0.3)',
          }}
        >
          {isProfitable ? '+' : ''}{formatCompactCurrency(result.profitPool)}
        </p>
      </div>

      {/* Secondary Stats */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">You Take</p>
          <p className="font-mono text-xl text-foreground">{formatCompactCurrency(result.producer)}</p>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Investors</p>
          <p className="font-mono text-xl text-gold">{formatCompactCurrency(result.investor)}</p>
        </div>
      </div>

      {/* Investor Multiple */}
      {equity > 0 && (
        <div className={`inline-flex items-center gap-2 px-5 py-3 border ${
          isStrong 
            ? 'border-gold bg-gold/10' 
            : isUnderperforming 
              ? 'border-amber-500/50 bg-amber-500/10' 
              : 'border-border bg-card'
        }`}>
          {isStrong ? (
            <TrendingUp className="w-5 h-5 text-gold" />
          ) : isUnderperforming ? (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm text-foreground">
            Investor Multiple: 
          </span>
          <span className={`font-mono text-lg font-semibold ${
            isStrong ? 'text-gold' : isUnderperforming ? 'text-amber-400' : 'text-red-400'
          }`}>
            {formatMultiple(result.multiple)}
          </span>
        </div>
      )}

      {/* Interpretation */}
      <div className="mt-8 max-w-xs">
        {isProfitable && isStrong ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-gold font-semibold">Strong deal.</span> This return profile 
            should attract institutional capital.
          </p>
        ) : isProfitable && isUnderperforming ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-amber-400 font-semibold">Marginal returns.</span> Investors 
            typically expect 1.2x+ multiples. Consider renegotiating terms.
          </p>
        ) : !isProfitable ? (
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="text-red-400 font-semibold">Underwater deal.</span> The acquisition 
            price doesn't cover all costs. Review your capital structure.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default RevealStep;
