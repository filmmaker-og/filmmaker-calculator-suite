import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { WaterfallResult, formatCompactCurrency, formatMultiple } from "@/lib/waterfall";
import { Download, AlertTriangle, Users, Briefcase, Target, TrendingUp, PieChart, CheckCircle } from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";

interface WizardStep6Props {
  result: WaterfallResult;
  equity: number;
}

const WizardStep6 = forwardRef<HTMLDivElement, WizardStep6Props>(({ result, equity }, ref) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const isUnderperforming = result.multiple < 1.2;
  const breakEvenRevenue = result.totalHurdle;

  return (
    <div ref={ref} className="step-enter space-y-4">
      {/* SETTLEMENT HEADER */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
          SETTLEMENT
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* STACKED SETTLEMENT CARDS */}
      <div className="space-y-3">
        {/* Producer Pool Card */}
        <div 
          className="p-4 rounded-sm" 
          style={{ backgroundColor: '#0a0a0a', borderLeft: '3px solid #666' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-zinc-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Producer Pool</p>
              <p className="font-mono text-2xl text-white">
                {formatCompactCurrency(result.producer)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 ml-13">50% profit participation</p>
        </div>

        {/* Investor Net Card - Gold Highlight */}
        <div 
          className="p-4 rounded-sm" 
          style={{ backgroundColor: '#0a0a0a', borderLeft: '3px solid #D4AF37' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}>
              <Briefcase size={18} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: '#D4AF37' }}>Investor Net</p>
              <p className="font-mono text-2xl" style={{ color: '#D4AF37' }}>
                {formatCompactCurrency(result.investor)}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 ml-13">Recoupment + 50% profit</p>
        </div>
      </div>

      {/* KEY METRICS - Horizontal Scrollable Pills */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="flex gap-2 min-w-max pb-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-zinc-900 border border-zinc-800">
            <Target size={12} className="text-zinc-500" />
            <span className="text-[10px] text-zinc-500 uppercase">Breakeven</span>
            <span className="font-mono text-xs text-white">{formatCompactCurrency(breakEvenRevenue)}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-zinc-900 border border-zinc-800">
            <TrendingUp size={12} className={result.multiple >= 1.2 ? 'text-[#D4AF37]' : 'text-red-400'} />
            <span className="text-[10px] text-zinc-500 uppercase">Multiple</span>
            <span className={`font-mono text-xs ${result.multiple >= 1.2 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
              {formatMultiple(result.multiple)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-zinc-900 border border-zinc-800">
            <PieChart size={12} className="text-zinc-500" />
            <span className="text-[10px] text-zinc-500 uppercase">Profit Pool</span>
            <span className="font-mono text-xs text-white">{formatCompactCurrency(result.profitPool)}</span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-zinc-900 border border-zinc-800">
            <CheckCircle size={12} className={result.recoupPct >= 100 ? 'text-emerald-400' : 'text-zinc-500'} />
            <span className="text-[10px] text-zinc-500 uppercase">Recoup</span>
            <span className={`font-mono text-xs ${result.recoupPct >= 100 ? 'text-emerald-400' : 'text-white'}`}>
              {result.recoupPct.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Warning Card - Conditional */}
      {isUnderperforming && (
        <div className="rounded-sm overflow-hidden" style={{ backgroundColor: '#0a0a0a', border: '1px solid #7f1d1d' }}>
          <div className="p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-bebas text-base text-white mb-1">
                Numbers Don't Work?
              </h3>
              <p className="text-zinc-500 text-xs mb-2">
                ROI of {formatMultiple(result.multiple)} is below institutional thresholds (1.2x minimum).
              </p>
              <button 
                onClick={() => setShowRestrictedModal(true)}
                className="text-[#D4AF37] text-xs tracking-widest uppercase hover:underline"
              >
                Fix Your Packaging →
              </button>
            </div>
          </div>
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

      {/* Restricted Access Modal */}
      <RestrictedAccessModal 
        isOpen={showRestrictedModal} 
        onClose={() => setShowRestrictedModal(false)} 
      />
    </div>
  );
});

WizardStep6.displayName = 'WizardStep6';

export default WizardStep6;
