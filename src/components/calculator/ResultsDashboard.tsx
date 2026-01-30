import { useState, useEffect, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { WaterfallResult, WaterfallInputs, formatCompactCurrency, formatPercent, formatMultiple } from "@/lib/waterfall";
import { 
  Download, AlertTriangle, Users, Briefcase, Target, TrendingUp, 
  CheckCircle2, DollarSign, ChevronLeft, ChevronRight, Info
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
  const [displayedROI, setDisplayedROI] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Calculate ROI
  const totalInvested = inputs.debt + inputs.equity;
  const totalDistributed = result.recouped + result.profitPool;
  const roi = totalInvested > 0 ? (totalDistributed / totalInvested) * 100 : 0;
  const isProfitable = roi >= 100;
  const isUnderperforming = result.multiple < 1.2;

  // Animated count-up for ROI
  useEffect(() => {
    if (hasAnimated) return;
    
    const duration = 1200;
    const steps = 40;
    const increment = roi / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= roi) {
        setDisplayedROI(roi);
        clearInterval(timer);
        setHasAnimated(true);
      } else {
        setDisplayedROI(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [roi, hasAnimated]);

  // Waterfall flow calculations
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
    if (status === 'paid') return <CheckCircle2 size={12} className="text-emerald-400" />;
    if (status === 'partial') return <AlertTriangle size={12} className="text-amber-400" />;
    return <AlertTriangle size={12} className="text-red-400" />;
  };

  const cards = [
    {
      id: 'producer',
      icon: Users,
      label: 'Producer Pool',
      value: result.producer,
      subtitle: '50% profit share',
      color: '#666'
    },
    {
      id: 'investor',
      icon: Briefcase,
      label: 'Investor Net',
      value: result.investor,
      subtitle: 'Recoupment + 50%',
      color: '#D4AF37'
    },
    {
      id: 'waterfall',
      icon: TrendingUp,
      label: 'Waterfall',
      isWaterfall: true
    }
  ];

  return (
    <div ref={ref} className="step-enter space-y-4">
      {/* RESULTS HEADER */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">YOUR RESULTS</span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* HERO ROI CARD with Glow */}
      <div 
        className="relative p-6 rounded-sm text-center overflow-hidden hero-glow"
        style={{ 
          backgroundColor: '#111111', 
          border: `2px solid ${isProfitable ? '#D4AF37' : '#7f1d1d'}` 
        }}
      >
        {/* Glow Effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isProfitable 
              ? 'radial-gradient(circle at center, hsl(43 74% 52% / 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, hsl(0 84% 60% / 0.1) 0%, transparent 70%)'
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp size={18} style={{ color: isProfitable ? '#D4AF37' : '#ef4444' }} />
            <span className="text-xs uppercase tracking-widest text-zinc-400">Return on Investment</span>
          </div>
          
          <p 
            className="font-bebas text-6xl mb-3 tabular-nums" 
            style={{ 
              color: isProfitable ? '#D4AF37' : '#ef4444',
              textShadow: isProfitable ? '0 0 30px hsl(43 74% 52% / 0.5)' : '0 0 20px hsl(0 84% 60% / 0.4)'
            }}
          >
            {formatPercent(displayedROI)}
          </p>
          
          <span 
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-xs font-mono uppercase tracking-wider ${
              isProfitable 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {isProfitable ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
            {isProfitable ? 'PROFITABLE' : 'UNPROFITABLE'}
          </span>
        </div>
      </div>

      {/* QUICK STATS ROW */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-sm text-center" style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <DollarSign size={12} className={`mx-auto mb-1 ${result.profitPool >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
          <p className="text-[9px] text-zinc-500 uppercase mb-0.5">Net Profit</p>
          <p className={`font-mono text-sm ${result.profitPool >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCompactCurrency(result.profitPool)}
          </p>
        </div>
        <div className="p-3 rounded-sm text-center" style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <Target size={12} className="mx-auto mb-1 text-zinc-500" />
          <p className="text-[9px] text-zinc-500 uppercase mb-0.5">Breakeven</p>
          <p className="font-mono text-sm text-zinc-300">{formatCompactCurrency(result.totalHurdle)}</p>
        </div>
        <div className="p-3 rounded-sm text-center" style={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a' }}>
          <TrendingUp size={12} className={`mx-auto mb-1 ${result.multiple >= 1.2 ? 'text-[#D4AF37]' : 'text-zinc-500'}`} />
          <p className="text-[9px] text-zinc-500 uppercase mb-0.5">Multiple</p>
          <p className={`font-mono text-sm ${result.multiple >= 1.2 ? 'text-[#D4AF37]' : 'text-zinc-300'}`}>
            {formatMultiple(result.multiple)}
          </p>
        </div>
      </div>

      {/* HORIZONTAL CARD CAROUSEL */}
      <div className="relative">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500">Settlement Details</span>
          <div className="flex gap-1">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeCard ? 'bg-[#D4AF37] scale-110' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="results-carousel">
          {cards.map((card, i) => (
            <div 
              key={card.id}
              className="results-card"
              style={{ 
                backgroundColor: '#0a0a0a', 
                borderLeft: `3px solid ${card.color || '#333'}`,
                border: '1px solid #1a1a1a',
                borderLeftWidth: '3px',
                borderLeftColor: card.color || '#333'
              }}
            >
              {card.isWaterfall ? (
                // Waterfall Flow Card
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bebas text-sm tracking-wider text-zinc-300">Priority Flow</h3>
                    <button onClick={() => setShowInfoModal(true)} className="p-1">
                      <Info size={12} className="text-[#D4AF37]" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">1. First Money</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white">{formatCompactCurrency(firstMoneyPaid)}</span>
                        <StatusBadge status={firstMoneyStatus} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">2. Debt Service</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white">{formatCompactCurrency(debtPaid)}</span>
                        <StatusBadge status={debtStatus} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">3. Equity + Prem</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-white">{formatCompactCurrency(equityPaid)}</span>
                        <StatusBadge status={equityStatus} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800">
                      <span style={{ color: '#D4AF37' }}>4. Profit Pool</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono" style={{ color: '#D4AF37' }}>{formatCompactCurrency(remaining)}</span>
                        <StatusBadge status={profitStatus} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Settlement Card
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: card.color === '#D4AF37' ? '#D4AF37' : '#222' }}
                    >
                      <card.icon size={18} className={card.color === '#D4AF37' ? 'text-black' : 'text-zinc-400'} />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: card.color }}>
                        {card.label}
                      </p>
                      <p className="font-mono text-2xl" style={{ color: card.color === '#D4AF37' ? '#D4AF37' : 'white' }}>
                        {formatCompactCurrency(card.value || 0)}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-3">{card.subtitle}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Warning Banner - Conditional */}
      {isUnderperforming && (
        <div className="p-3 rounded-sm flex items-center gap-3" style={{ backgroundColor: '#0a0a0a', border: '1px solid #7f1d1d' }}>
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-white">
              ROI of {formatMultiple(result.multiple)} is below 1.2x threshold
            </p>
          </div>
          <button 
            onClick={() => setShowRestrictedModal(true)}
            className="text-[10px] text-[#D4AF37] uppercase tracking-wider whitespace-nowrap"
          >
            Fix →
          </button>
        </div>
      )}

      {/* Action Button */}
      <Button
        onClick={() => setShowRestrictedModal(true)}
        className="w-full py-5 rounded-sm font-bebas tracking-wider min-h-[56px] touch-press"
        style={{ backgroundColor: '#D4AF37', color: '#000000' }}
      >
        <Download className="w-5 h-5 mr-2" />
        DOWNLOAD INVESTOR DECK
      </Button>

      {/* Info Modal */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="bg-[#111111] border-[#333] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider text-[#D4AF37]">
              WATERFALL DEFINITIONS
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h3 className="font-bebas text-lg text-[#D4AF37] mb-1">PRIORITY OF PAYMENTS</h3>
              <DialogDescription className="text-zinc-400 text-sm leading-relaxed">
                Funds are distributed in strict order. First Money Out covers CAM fees, sales, and guild residuals. Then senior debt is repaid, followed by equity with premium. Any remainder flows to the profit pool.
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Restricted Access Modal */}
      <RestrictedAccessModal 
        isOpen={showRestrictedModal} 
        onClose={() => setShowRestrictedModal(false)} 
      />
    </div>
  );
});

ResultsDashboard.displayName = 'ResultsDashboard';

export default ResultsDashboard;
