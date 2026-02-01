import { WaterfallResult, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface RevealStepProps {
  result: WaterfallResult;
  equity: number;
}

type VerdictState = 'underwater' | 'marginal' | 'profit' | 'strong';

interface VerdictConfig {
  state: VerdictState;
  label: string;
  color: string;
  glowColor: string;
  bgClass: string;
  Icon: typeof TrendingUp;
  message: string;
}

const RevealStep = ({ result, equity }: RevealStepProps) => {
  const [displayProfit, setDisplayProfit] = useState(0);
  const [displayProducer, setDisplayProducer] = useState(0);
  const [displayInvestor, setDisplayInvestor] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const hasAnimated = useRef(false);

  // Determine verdict state
  const getVerdictConfig = (): VerdictConfig => {
    if (result.profitPool < 0) {
      return {
        state: 'underwater',
        label: 'UNDERWATER',
        color: 'text-red-400',
        glowColor: 'rgba(239, 68, 68, 0.3)',
        bgClass: 'verdict-underwater',
        Icon: TrendingDown,
        message: "This deal loses money. The acquisition price doesn't cover all costs."
      };
    }
    if (result.multiple >= 1.2) {
      return {
        state: 'strong',
        label: 'STRONG DEAL',
        color: 'text-gold',
        glowColor: 'rgba(212, 175, 55, 0.4)',
        bgClass: 'verdict-strong',
        Icon: Sparkles,
        message: 'This return profile should attract institutional capital.'
      };
    }
    if (result.multiple >= 1.0 && equity > 0) {
      return {
        state: 'profit',
        label: 'PROFIT',
        color: 'text-emerald-400',
        glowColor: 'rgba(34, 197, 94, 0.3)',
        bgClass: 'verdict-profit',
        Icon: TrendingUp,
        message: "There's profit to share, but investors typically expect 1.2x minimum."
      };
    }
    return {
      state: 'marginal',
      label: 'MARGINAL',
      color: 'text-amber-400',
      glowColor: 'rgba(245, 158, 11, 0.3)',
      bgClass: 'verdict-marginal',
      Icon: AlertTriangle,
      message: 'Barely covers obligations. Consider renegotiating terms.'
    };
  };

  const verdict = getVerdictConfig();
  const VerdictIcon = verdict.Icon;

  // Animated count-up effect
  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1200;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

      setDisplayProfit(result.profitPool * eased);
      setDisplayProducer(result.producer * eased);
      setDisplayInvestor(result.investor * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimationComplete(true);
      }
    };

    // Delay start for dramatic effect
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, 300);
  }, [result.profitPool, result.producer, result.investor]);

  return (
    <div className="step-enter min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Verdict Label */}
      <div 
        className={`mb-6 inline-flex items-center gap-2 px-4 py-2 ${verdict.bgClass}`}
      >
        <VerdictIcon className={`w-4 h-4 ${verdict.color}`} />
        <span className={`font-bebas text-sm tracking-[0.2em] ${verdict.color}`}>
          {verdict.label}
        </span>
      </div>

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
            background: `radial-gradient(circle, ${verdict.glowColor} 0%, transparent 60%)`,
            filter: 'blur(40px)',
          }}
        />
        
        {/* Label */}
        <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground font-semibold mb-4 relative z-10">
          Your Profit Pool
        </p>
        
        {/* The Number - Animated */}
        <p
          className={`font-bebas text-7xl sm:text-8xl tabular-nums leading-none relative z-10 transition-transform ${verdict.color}`}
          style={{
            textShadow: `0 0 60px ${verdict.glowColor}`,
            transform: animationComplete ? 'scale(1)' : 'scale(1.02)',
          }}
        >
          {result.profitPool >= 0 ? '+' : ''}{formatCompactCurrency(displayProfit)}
        </p>
      </div>

      {/* Secondary Stats - Split Cards */}
      <div className="flex items-stretch justify-center gap-4 mb-8 w-full max-w-xs">
        <div className="flex-1 p-4 matte-card text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">You Take</p>
          <p className="font-mono text-xl text-foreground">{formatCompactCurrency(displayProducer)}</p>
        </div>
        <div className="flex-1 p-4 matte-card-gold text-center">
          <p className="text-[10px] uppercase tracking-wider text-gold/70 mb-2">Investors</p>
          <p className="font-mono text-xl text-gold">{formatCompactCurrency(displayInvestor)}</p>
        </div>
      </div>

      {/* Investor Multiple */}
      {equity > 0 && (
        <div className={`inline-flex items-center gap-3 px-5 py-3 ${verdict.bgClass} transition-all duration-500 ${
          animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <span className="text-sm text-foreground">
            Investor Multiple:
          </span>
          <span className={`font-mono text-xl font-semibold ${verdict.color}`}>
            {formatMultiple(result.multiple)}
          </span>
        </div>
      )}

      {/* Human Interpretation */}
      <div className={`mt-8 max-w-sm transition-all duration-500 delay-300 ${
        animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className={`font-semibold ${verdict.color}`}>{verdict.label}.</span>{' '}
          {verdict.message}
        </p>
      </div>
    </div>
  );
};

export default RevealStep;
