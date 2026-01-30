import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WaterfallResult, formatCurrency, formatMultiple } from "@/lib/waterfall";
import { Download, AlertTriangle, Users, Briefcase, TrendingUp, Target, PieChart, CheckCircle } from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";

interface WizardStep6Props {
  result: WaterfallResult;
  equity: number;
}

const WizardStep6 = ({ result, equity }: WizardStep6Props) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const isUnderperforming = result.multiple < 1.2;
  const breakEvenRevenue = result.totalHurdle;

  return (
    <div className="animate-fade-in space-y-5">
      {/* SETTLEMENT SPLIT - Producer vs Investor */}
      <div className="rounded-sm overflow-hidden" style={{ border: '1px solid #D4AF37' }}>
        <div className="py-3 px-4" style={{ backgroundColor: '#111111', borderBottom: '1px solid #333333' }}>
          <h2 className="font-bebas text-base tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            Settlement
          </h2>
        </div>

        <div className="p-4 space-y-3" style={{ backgroundColor: '#000000' }}>
          {/* Producer Pool */}
          <div className="flex items-center gap-3 p-3 rounded-sm" style={{ backgroundColor: '#0a0a0a', borderLeft: '3px solid #666' }}>
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <Users size={18} className="text-zinc-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium">Producer Pool</p>
              <p className="text-[10px] text-zinc-500">50% profit participation</p>
            </div>
            <div className="font-mono text-xl text-white">
              {formatCurrency(result.producer)}
            </div>
          </div>

          {/* Investor Net */}
          <div className="flex items-center gap-3 p-3 rounded-sm" style={{ backgroundColor: '#0a0a0a', borderLeft: '3px solid #D4AF37' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AF37' }}>
              <Briefcase size={18} className="text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: '#D4AF37' }}>Investor Net</p>
              <p className="text-[10px] text-zinc-500">Recoupment + 50% profit</p>
            </div>
            <div className="font-mono text-xl" style={{ color: '#D4AF37' }}>
              {formatCurrency(result.investor)}
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS GRID - Compact 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <Target size={16} className="mx-auto mb-2 text-zinc-500" />
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Breakeven</p>
          <p className="font-mono text-base text-white">{formatCurrency(breakEvenRevenue)}</p>
        </div>

        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <TrendingUp size={16} className={`mx-auto mb-2 ${result.multiple >= 1.2 ? 'text-[#D4AF37]' : 'text-red-400'}`} />
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">ROI Multiple</p>
          <p className={`font-mono text-base ${result.multiple >= 1.2 ? 'text-[#D4AF37]' : 'text-red-400'}`}>
            {formatMultiple(result.multiple)}
          </p>
        </div>

        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <PieChart size={16} className="mx-auto mb-2 text-zinc-500" />
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Profit Pool</p>
          <p className="font-mono text-base text-white">{formatCurrency(result.profitPool)}</p>
        </div>

        <div className="p-4 rounded-sm text-center" style={{ backgroundColor: '#111111', border: '1px solid #1a1a1a' }}>
          <CheckCircle size={16} className={`mx-auto mb-2 ${result.recoupPct >= 100 ? 'text-emerald-400' : 'text-zinc-500'}`} />
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Recoupment</p>
          <p className={`font-mono text-base ${result.recoupPct >= 100 ? 'text-emerald-400' : 'text-white'}`}>
            {result.recoupPct.toFixed(0)}%
          </p>
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
        className="w-full py-5 rounded-sm font-bebas tracking-wider min-h-[56px]"
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
};

export default WizardStep6;
