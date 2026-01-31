import { useState, forwardRef, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WaterfallResult, WaterfallInputs, formatCompactCurrency, formatPercent, formatMultiple } from "@/lib/waterfall";
import { 
  Download, AlertTriangle, Users, Briefcase, Target, TrendingUp, 
  CheckCircle2, DollarSign, Info, ChevronLeft, ChevronRight
} from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ResultsDashboardProps {
  result: WaterfallResult;
  inputs: WaterfallInputs;
  equity: number;
}

const ResultsDashboard = forwardRef<HTMLDivElement, ResultsDashboardProps>(({ result, inputs, equity }, ref) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Track scroll to update active card and hide hint
  const handleCarouselScroll = () => {
    if (showSwipeHint) setShowSwipeHint(false);
    
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.offsetWidth * 0.85 + 12; // 85% + gap
      const newActive = Math.round(scrollLeft / cardWidth);
      setActiveCard(Math.min(newActive, 2));
    }
  };

  // Scroll to card on dot click
  const scrollToCard = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = carouselRef.current.offsetWidth * 0.85 + 12;
      carouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    }
  };

  const totalInvested = inputs.debt + inputs.equity;
  const totalDistributed = result.recouped + result.profitPool;
  const roi = totalInvested > 0 ? (totalDistributed / totalInvested) * 100 : 0;
  const isProfitable = result.profitPool > 0;
  const isUnderperforming = result.multiple < 1.2;
  const netProfit = result.profitPool;

  const firstMoneyOut = result.cam + result.salesFee + result.guilds + result.marketing;
  const debtService = result.ledger.find(l => l.name === "Senior Debt")?.amount || 0;
  const equityPrem = result.ledger.find(l => l.name === "Equity")?.amount || 0;

  let remaining = inputs.revenue;
  const firstMoneyPaid = Math.min(remaining, firstMoneyOut);
  remaining = Math.max(0, remaining - firstMoneyOut);
  const firstMoneyStatus = firstMoneyPaid >= firstMoneyOut ? 'paid' : firstMoneyPaid > 0 ? 'partial' : 'unpaid';

  const debtPaid = Math.min(remaining, debtService);
  remaining = Math.max(0, remaining - debtService);
  const debtStatus = debtPaid >= debtService ? 'paid' : debtPaid > 0 ? 'partial' : 'unpaid';

  const equityPaid = Math.min(remaining, equityPrem);
  remaining = Math.max(0, remaining - equityPrem);
  const equityStatus = equityPaid >= equityPrem ? 'paid' : equityPaid > 0 ? 'partial' : 'unpaid';
  const profitStatus = remaining > 0 ? 'paid' : 'unpaid';

  const StatusBadge = ({ status }: { status: 'paid' | 'partial' | 'unpaid' }) => {
    if (status === 'paid') return <CheckCircle2 size={14} className="text-emerald-400" />;
    if (status === 'partial') return <AlertTriangle size={14} className="text-amber-400" />;
    return <AlertTriangle size={14} className="text-red-400" />;
  };

  const cards = [
    {
      id: 'producer',
      icon: Users,
      label: 'Producer Pool',
      value: result.producer,
      subtitle: '50% profit share',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      accentColor: 'hsl(var(--muted-foreground))'
    },
    {
      id: 'investor',
      icon: Briefcase,
      label: 'Investor Net',
      value: result.investor,
      subtitle: 'Recoupment + 50%',
      color: 'text-gold',
      bgColor: 'bg-gold/10',
      accentColor: 'hsl(var(--gold))'
    },
    {
      id: 'waterfall',
      icon: TrendingUp,
      label: 'Waterfall',
      isWaterfall: true,
      accentColor: 'hsl(var(--gold))'
    }
  ];

  return (
    <div ref={ref} className="step-enter space-y-5">
      {/* Section Header - Number 4 badge */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-gold font-bebas text-sm">4</span>
        </div>
        <div>
          <h2 className="font-bebas text-lg text-foreground tracking-wide">YOUR RESULTS</h2>
          <p className="text-xs text-muted-foreground">Waterfall analysis complete</p>
        </div>
      </div>

      {/* Hero Net Profit Card - Instant display */}
      <div 
        className="relative p-6 rounded-sm text-center overflow-hidden border"
        style={{ 
          backgroundColor: 'hsl(var(--card))',
          borderColor: isProfitable ? 'hsl(var(--gold))' : 'hsl(0 84% 40%)',
          borderLeftWidth: '3px'
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <DollarSign size={18} className={isProfitable ? 'text-gold' : 'text-destructive'} />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">Net Profit</span>
          </div>
          
          <p 
            className="font-bebas text-5xl sm:text-6xl mb-4 tabular-nums" 
            style={{ color: isProfitable ? 'hsl(var(--gold))' : 'hsl(var(--destructive))' }}
          >
            {isProfitable ? '+' : ''}{formatCompactCurrency(netProfit)}
          </p>
          
          <span 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider ${
              isProfitable 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : 'bg-red-500/15 text-red-400 border border-red-500/30'
            }`}
          >
            {isProfitable ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
            {isProfitable ? 'PROFITABLE' : 'LOSS'}
          </span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-sm text-center bg-card border border-border min-h-[72px] flex flex-col justify-center">
          <TrendingUp size={14} className={`mx-auto mb-1.5 ${roi >= 100 ? 'text-emerald-400' : 'text-red-400'}`} />
          <p className="text-[10px] text-muted-foreground uppercase mb-0.5 font-semibold tracking-wide">ROI</p>
          <p className={`font-mono text-sm font-semibold ${roi >= 100 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatPercent(roi)}
          </p>
        </div>
        <div className="p-3 rounded-sm text-center bg-card border border-border min-h-[72px] flex flex-col justify-center">
          <Target size={14} className="mx-auto mb-1.5 text-muted-foreground" />
          <p className="text-[10px] text-muted-foreground uppercase mb-0.5 font-semibold tracking-wide">Breakeven</p>
          <p className="font-mono text-sm text-foreground">{formatCompactCurrency(result.totalHurdle)}</p>
        </div>
        <div className="p-3 rounded-sm text-center bg-card border border-border min-h-[72px] flex flex-col justify-center">
          <TrendingUp size={14} className={`mx-auto mb-1.5 ${result.multiple >= 1.2 ? 'text-gold' : 'text-muted-foreground'}`} />
          <p className="text-[10px] text-muted-foreground uppercase mb-0.5 font-semibold tracking-wide">Multiple</p>
          <p className={`font-mono text-sm font-semibold ${result.multiple >= 1.2 ? 'text-gold' : 'text-foreground'}`}>
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* Card Carousel - 85% width with peek */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Settlement Details</span>
          <div className="flex gap-1.5">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeCard ? 'bg-gold' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Swipe Hint - Subtle edge chevrons */}
        {showSwipeHint && (
          <div className="absolute left-0 right-0 top-1/2 translate-y-4 z-10 flex justify-between pointer-events-none px-1">
            <ChevronLeft size={18} className="text-muted-foreground/40 animate-pulse" />
            <ChevronRight size={18} className="text-muted-foreground/40 animate-pulse" />
          </div>
        )}

        <div 
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-hide"
          onScroll={handleCarouselScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((card) => (
            <div 
              key={card.id}
              className="snap-center flex-shrink-0 bg-card border border-border rounded-sm"
              style={{ 
                width: '85%',
                borderLeftWidth: '3px',
                borderLeftColor: card.accentColor
              }}
            >
              {card.isWaterfall ? (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bebas text-sm tracking-wider text-foreground">Priority Flow</h3>
                    <button 
                      onClick={() => setShowInfoModal(true)} 
                      className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors -mr-2"
                    >
                      <Info size={16} className="text-gold" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm min-h-[36px]">
                      <span className="text-muted-foreground">1. First Money</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-foreground">{formatCompactCurrency(firstMoneyPaid)}</span>
                        <StatusBadge status={firstMoneyStatus} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm min-h-[36px]">
                      <span className="text-muted-foreground">2. Debt Service</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-foreground">{formatCompactCurrency(debtPaid)}</span>
                        <StatusBadge status={debtStatus} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm min-h-[36px]">
                      <span className="text-muted-foreground">3. Equity + Prem</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-foreground">{formatCompactCurrency(equityPaid)}</span>
                        <StatusBadge status={equityStatus} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-border min-h-[36px]">
                      <span className="text-gold font-semibold">4. Profit Pool</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-gold font-semibold">{formatCompactCurrency(remaining)}</span>
                        <StatusBadge status={profitStatus} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${card.bgColor}`}>
                      <card.icon size={18} className={card.color} />
                    </div>
                    <div>
                      <p className={`text-xs uppercase tracking-wider mb-1 font-semibold ${card.color}`}>
                        {card.label}
                      </p>
                      <p className={`font-mono text-2xl font-semibold ${card.color}`}>
                        {formatCompactCurrency(card.value || 0)}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-4">{card.subtitle}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warning Banner */}
      {isUnderperforming && (
        <div className="p-4 rounded-sm flex items-center gap-3 bg-destructive/10 border border-destructive/30 min-h-[56px]">
          <AlertTriangle size={16} className="text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-foreground font-medium">
              ROI of {formatMultiple(result.multiple)} is below 1.2x threshold
            </p>
          </div>
          <button 
            onClick={() => setShowRestrictedModal(true)}
            className="text-xs text-gold uppercase tracking-wider whitespace-nowrap font-semibold hover:underline min-h-[44px] px-2"
          >
            Fix →
          </button>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={() => setShowRestrictedModal(true)}
        className="w-full py-5 rounded-sm font-bebas tracking-wider min-h-[56px] touch-press bg-gold text-primary-foreground hover:bg-gold-highlight"
      >
        <Download className="w-5 h-5 mr-2" />
        DOWNLOAD INVESTOR DECK
      </Button>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-card border-border text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              WATERFALL DEFINITIONS
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h3 className="font-bebas text-lg text-gold mb-1">PRIORITY OF PAYMENTS</h3>
              <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
                Funds are distributed in strict order. First Money Out covers CAM fees, sales, and guild residuals. Then senior debt is repaid, followed by equity with premium. Any remainder flows to the profit pool.
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RestrictedAccessModal 
        isOpen={showRestrictedModal} 
        onClose={() => setShowRestrictedModal(false)} 
      />
    </div>
  );
});

ResultsDashboard.displayName = 'ResultsDashboard';

export default ResultsDashboard;
