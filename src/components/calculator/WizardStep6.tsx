import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WaterfallResult, formatCurrency, formatMultiple } from "@/lib/waterfall";
import { Save, Loader2, ArrowRight, AlertTriangle } from "lucide-react";

interface WizardStep6Props {
  result: WaterfallResult;
  equity: number;
  onSave: () => void;
  saving: boolean;
}

const WizardStep6 = ({ result, equity, onSave, saving }: WizardStep6Props) => {
  const isUnderperforming = result.multiple < 1.2;
  const breakEvenRevenue = result.totalHurdle;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Step 6</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
          SETTLEMENT
        </h2>
        <p className="text-dim mt-3 max-w-xl">
          Final distribution analysis and investor returns.
        </p>
      </div>

      {/* The Vaults - Two Large Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Producer Pool */}
        <div className="glass-card p-8 border-gold/20">
          <div className="text-center">
            <span className="text-dim text-xs tracking-[0.3em] uppercase block mb-4">
              Producer Pool
            </span>
            <div className="font-mono text-4xl md:text-5xl text-foreground mb-2">
              {formatCurrency(result.producer)}
            </div>
            <p className="text-dim text-sm">
              50% of profit participation
            </p>
          </div>
        </div>

        {/* Investor Net */}
        <div className="glass-card p-8 border-gold">
          <div className="text-center">
            <span className="text-gold text-xs tracking-[0.3em] uppercase block mb-4">
              Investor Net
            </span>
            <div className="font-mono text-4xl md:text-5xl text-gold mb-2">
              {formatCurrency(result.investor)}
            </div>
            <p className="text-dim text-sm">
              Recoupment + 50% profit share
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card p-6 text-center">
          <span className="text-dim text-xs tracking-widest uppercase block mb-2">
            Break-Even Point
          </span>
          <span className="font-mono text-2xl text-foreground">
            {formatCurrency(breakEvenRevenue)}
          </span>
        </div>
        <div className="glass-card p-6 text-center">
          <span className="text-dim text-xs tracking-widest uppercase block mb-2">
            ROI Multiple
          </span>
          <span className={`font-mono text-2xl ${result.multiple >= 1.2 ? 'text-gold' : 'text-destructive'}`}>
            {formatMultiple(result.multiple)}
          </span>
        </div>
      </div>

      {/* The Upsell - Conditional */}
      {isUnderperforming && (
        <div className="glass-card p-6 mb-8 border-destructive/50">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-display text-xl text-foreground mb-2">
                NUMBERS DON'T WORK?
              </h3>
              <p className="text-dim text-sm mb-4">
                Your projected ROI of {formatMultiple(result.multiple)} is below institutional thresholds. 
                Consider restructuring your capital stack or improving your packaging.
              </p>
              <Link to="/store">
                <Button className="btn-ghost-gold px-6 py-3 rounded-none text-sm">
                  FIX YOUR PACKAGING
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Save CTA */}
      <div className="glass-card p-8 text-center">
        <h3 className="font-display text-2xl text-foreground mb-3">
          SAVE TO VAULT
        </h3>
        <p className="text-dim text-sm mb-6 max-w-md mx-auto">
          Persist this calculation to your secure vault for future reference.
        </p>
        <Button
          onClick={onSave}
          disabled={saving}
          className="btn-vault px-10 py-5 rounded-none text-lg"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {saving ? "SAVING..." : "SAVE CALCULATION"}
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-8 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-dim text-xs block mb-1">Total Hurdles</span>
            <span className="font-mono text-mid">{formatCurrency(result.totalHurdle)}</span>
          </div>
          <div>
            <span className="text-dim text-xs block mb-1">Profit Pool</span>
            <span className="font-mono text-mid">{formatCurrency(result.profitPool)}</span>
          </div>
          <div>
            <span className="text-dim text-xs block mb-1">Equity Investment</span>
            <span className="font-mono text-mid">{formatCurrency(equity)}</span>
          </div>
          <div>
            <span className="text-dim text-xs block mb-1">Recoupment</span>
            <span className={`font-mono ${result.recoupPct >= 100 ? 'text-gold' : 'text-mid'}`}>
              {result.recoupPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep6;
