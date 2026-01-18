import { WaterfallResult, formatCurrency, formatPercent } from "@/lib/waterfall";

interface WizardStep5Props {
  result: WaterfallResult;
}

const WizardStep5 = ({ result }: WizardStep5Props) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <span className="text-gold text-xs tracking-[0.3em] uppercase">Step 5</span>
        <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
          THE AUDIT
        </h2>
        <p className="text-dim mt-3 max-w-xl">
          Review the payment waterfall and recoupment analysis.
        </p>
      </div>

      {/* Recoupment Progress */}
      <div className="glass-card p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-mid text-xs tracking-widest uppercase">Recoupment Status</span>
          <span className={`font-mono text-2xl ${result.recoupPct >= 100 ? 'text-gold' : 'text-destructive'}`}>
            {formatPercent(result.recoupPct)}
          </span>
        </div>
        <div className="progress-gold h-3 mb-4">
          <div 
            className="progress-gold-fill h-full"
            style={{ width: `${Math.min(result.recoupPct, 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-dim">Total Hurdles: <span className="font-mono text-mid">{formatCurrency(result.totalHurdle)}</span></span>
          <span className="text-dim">Revenue: <span className="font-mono text-gold">{formatCurrency(result.recouped + result.profitPool)}</span></span>
        </div>
      </div>

      {/* Payment Order Ledger */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-display text-xl text-foreground">PAYMENT WATERFALL</h3>
          <p className="text-dim text-sm mt-1">Priority order of distribution</p>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-background/50">
              <tr className="text-left text-xs tracking-widest uppercase text-dim">
                <th className="px-6 py-4">Position</th>
                <th className="px-6 py-4">Detail</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {result.ledger.map((item, index) => (
                <tr key={index} className="border-t border-border">
                  <td className="px-6 py-4">
                    <span className="text-gold font-mono text-sm mr-3">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-foreground font-medium">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-dim text-sm">{item.detail}</td>
                  <td className="px-6 py-4 text-right font-mono text-foreground">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-background/50 border-t-2 border-gold">
              <tr>
                <td className="px-6 py-4 font-display text-gold">TOTAL HURDLES</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-right font-mono text-gold text-lg">
                  {formatCurrency(result.totalHurdle)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Stacked Cards */}
        <div className="md:hidden divide-y divide-border">
          {result.ledger.map((item, index) => (
            <div key={index} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-gold font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-foreground font-medium text-sm">{item.name}</span>
                </div>
                <span className="font-mono text-foreground text-sm">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <p className="text-dim text-xs">{item.detail}</p>
            </div>
          ))}
          <div className="p-4 bg-background/50">
            <div className="flex items-center justify-between">
              <span className="font-display text-gold text-sm">TOTAL HURDLES</span>
              <span className="font-mono text-gold">{formatCurrency(result.totalHurdle)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep5;
