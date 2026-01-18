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
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Step 6</span>
        <h2 className="font-bebas text-4xl md:text-5xl text-foreground mt-2">
          SETTLEMENT
        </h2>
        <p className="text-muted-foreground mt-3 max-w-xl">
          Final distribution analysis and investor returns.
        </p>
      </div>

      {/* The Vaults - Stacked Vertically on Mobile */}
      <div className="space-y-4 mb-8">
        {/* Producer Pool */}
        <div className="glass-card p-6 border-l-4 border-l-muted">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-muted-foreground text-xs tracking-[0.3em] uppercase block mb-1">
                Producer Pool
              </span>
              <p className="text-muted-foreground text-xs">
                50% of profit participation
              </p>
            </div>
            <div className="font-mono text-2xl md:text-3xl text-foreground">
              {formatCurrency(result.producer)}
            </div>
          </div>
        </div>

        {/* Investor Net */}
        <div className="glass-card p-6 border-l-4 border-l-gold">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-1">
                Investor Net
              </span>
              <p className="text-muted-foreground text-xs">
                Recoupment + 50% profit share
              </p>
            </div>
            <div className="font-mono text-2xl md:text-3xl text-gold">
              {formatCurrency(result.investor)}
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <span className="text-muted-foreground text-xs tracking-widest uppercase block mb-2">
            Break-Even
          </span>
          <span className="font-mono text-lg md:text-xl text-foreground">
            {formatCurrency(breakEvenRevenue)}
          </span>
        </div>
        <div className="glass-card p-4 text-center">
          <span className="text-muted-foreground text-xs tracking-widest uppercase block mb-2">
            ROI Multiple
          </span>
          <span className={`font-mono text-lg md:text-xl ${result.multiple >= 1.2 ? 'text-gold' : 'text-destructive'}`}>
            {formatMultiple(result.multiple)}
          </span>
        </div>
      </div>

      {/* The Upsell - Conditional */}
      {isUnderperforming && (
        <div className="glass-card p-4 mb-8 border-l-4 border-l-destructive">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bebas text-lg text-foreground mb-1">
                NUMBERS DON'T WORK?
              </h3>
              <p className="text-muted-foreground text-xs mb-3">
                Your projected ROI of {formatMultiple(result.multiple)} is below institutional thresholds.
              </p>
              <button 
                onClick={() => setShowRestrictedModal(true)}
                className="text-gold text-xs tracking-widest uppercase hover:underline"
              >
                FIX YOUR PACKAGING →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons - The Export Trap */}
      <div className="space-y-4">
        {/* Button A: Save to Dashboard */}
        <Button
          onClick={onSave}
          disabled={saving}
          className="w-full btn-ghost-gold py-5"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {saving ? "SAVING..." : "SAVE TO DASHBOARD"}
        </Button>

        {/* Button B: Download Investor Deck (The Trap) */}
        <Button
          onClick={() => setShowRestrictedModal(true)}
          className="w-full btn-vault py-5"
        >
          <Download className="w-5 h-5 mr-2" />
          DOWNLOAD INVESTOR DECK
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <span className="text-muted-foreground text-xs block mb-1">Total Hurdles</span>
            <span className="font-mono text-sm text-foreground">{formatCurrency(result.totalHurdle)}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block mb-1">Profit Pool</span>
            <span className="font-mono text-sm text-foreground">{formatCurrency(result.profitPool)}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block mb-1">Equity Investment</span>
            <span className="font-mono text-sm text-foreground">{formatCurrency(equity)}</span>
          </div>
          <div>
            <span className="text-muted-foreground text-xs block mb-1">Recoupment</span>
            <span className={`font-mono text-sm ${result.recoupPct >= 100 ? 'text-gold' : 'text-foreground'}`}>
              {result.recoupPct.toFixed(1)}%
            </span>
          </div>
        </div>
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