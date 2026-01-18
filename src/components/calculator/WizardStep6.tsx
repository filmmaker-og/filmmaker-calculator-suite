import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WaterfallResult, formatCurrency, formatMultiple } from "@/lib/waterfall";
import { Save, Loader2, Download, AlertTriangle } from "lucide-react";
import RestrictedAccessModal from "@/components/RestrictedAccessModal";

interface WizardStep6Props {
  result: WaterfallResult;
  equity: number;
  onSave: () => void;
  saving: boolean;
}

const WizardStep6 = ({ result, equity, onSave, saving }: WizardStep6Props) => {
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const isUnderperforming = result.multiple < 1.2;
  const breakEvenRevenue = result.totalHurdle;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Settlement Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            06 | SETTLEMENT
          </h2>
        </div>

        {/* Body Area */}
        <div className="p-6 space-y-4" style={{ backgroundColor: '#000000' }}>
          {/* Producer Pool */}
          <div className="p-4 rounded-sm border-l-4 border-l-zinc-600" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-zinc-400 text-xs tracking-widest uppercase block mb-1">
                  Producer Pool
                </span>
                <p className="text-zinc-500 text-xs">50% of profit participation</p>
              </div>
              <div className="font-mono text-2xl text-white">
                {formatCurrency(result.producer)}
              </div>
            </div>
          </div>

          {/* Investor Net */}
          <div className="p-4 rounded-sm border-l-4 border-l-[#D4AF37]" style={{ backgroundColor: '#0a0a0a' }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[#D4AF37] text-xs tracking-widest uppercase block mb-1">
                  Investor Net
                </span>
                <p className="text-zinc-500 text-xs">Recoupment + 50% profit share</p>
              </div>
              <div className="font-mono text-2xl text-[#D4AF37]">
                {formatCurrency(result.investor)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            KEY METRICS
          </h2>
        </div>

        {/* Body Area */}
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 text-center rounded-sm" style={{ backgroundColor: '#0a0a0a' }}>
              <span className="text-zinc-500 text-xs tracking-widest uppercase block mb-2">
                Break-Even
              </span>
              <span className="font-mono text-lg text-white">
                {formatCurrency(breakEvenRevenue)}
              </span>
            </div>
            <div className="p-4 text-center rounded-sm" style={{ backgroundColor: '#0a0a0a' }}>
              <span className="text-zinc-500 text-xs tracking-widest uppercase block mb-2">
                ROI Multiple
              </span>
              <span className={`font-mono text-lg ${result.multiple >= 1.2 ? 'text-[#D4AF37]' : 'text-red-500'}`}>
                {formatMultiple(result.multiple)}
              </span>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800">
            <div className="text-center">
              <span className="text-zinc-500 text-xs block mb-1">Total Hurdles</span>
              <span className="font-mono text-sm text-white">{formatCurrency(result.totalHurdle)}</span>
            </div>
            <div className="text-center">
              <span className="text-zinc-500 text-xs block mb-1">Profit Pool</span>
              <span className="font-mono text-sm text-white">{formatCurrency(result.profitPool)}</span>
            </div>
            <div className="text-center">
              <span className="text-zinc-500 text-xs block mb-1">Equity Investment</span>
              <span className="font-mono text-sm text-white">{formatCurrency(equity)}</span>
            </div>
            <div className="text-center">
              <span className="text-zinc-500 text-xs block mb-1">Recoupment</span>
              <span className={`font-mono text-sm ${result.recoupPct >= 100 ? 'text-[#D4AF37]' : 'text-white'}`}>
                {result.recoupPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Card - Conditional */}
      {isUnderperforming && (
        <div className="rounded-sm border border-red-900 border-l-4 border-l-red-500 overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
          <div className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bebas text-lg text-white mb-1">
                NUMBERS DON'T WORK?
              </h3>
              <p className="text-zinc-500 text-xs mb-3">
                Your projected ROI of {formatMultiple(result.multiple)} is below institutional thresholds.
              </p>
              <button 
                onClick={() => setShowRestrictedModal(true)}
                className="text-[#D4AF37] text-xs tracking-widest uppercase hover:underline"
              >
                FIX YOUR PACKAGING →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={onSave}
          disabled={saving}
          variant="outline"
          className="w-full py-5 rounded-sm border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {saving ? "SAVING..." : "SAVE TO DASHBOARD"}
        </Button>

        <Button
          onClick={() => setShowRestrictedModal(true)}
          className="w-full py-5 rounded-sm font-bebas tracking-wider"
          style={{ backgroundColor: '#D4AF37', color: '#000000' }}
        >
          <Download className="w-5 h-5 mr-2" />
          DOWNLOAD INVESTOR DECK
        </Button>
      </div>

      {/* Restricted Access Modal */}
      <RestrictedAccessModal 
        isOpen={showRestrictedModal} 
        onClose={() => setShowRestrictedModal(false)} 
      />
    </div>
  );
};

export default WizardStep6;
