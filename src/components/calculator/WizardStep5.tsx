import { WaterfallResult, formatCurrency, formatPercent } from "@/lib/waterfall";

interface WizardStep5Props {
  result: WaterfallResult;
}

const WizardStep5 = ({ result }: WizardStep5Props) => {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Recoupment Status Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            05 | RECOUPMENT STATUS
          </h2>
        </div>

        {/* Body Area */}
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-400 text-xs tracking-widest uppercase">Progress</span>
            <span className={`font-mono text-2xl ${result.recoupPct >= 100 ? 'text-[#D4AF37]' : 'text-red-500'}`}>
              {formatPercent(result.recoupPct)}
            </span>
          </div>
          <div className="h-3 rounded-sm overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
            <div 
              className="h-full transition-all duration-500 rounded-sm"
              style={{ 
                width: `${Math.min(result.recoupPct, 100)}%`,
                backgroundColor: '#D4AF37'
              }}
            />
          </div>
          <div className="flex items-center justify-between text-sm mt-4">
            <span className="text-zinc-500">Total Hurdles: <span className="font-mono text-zinc-300">{formatCurrency(result.totalHurdle)}</span></span>
            <span className="text-zinc-500">Revenue: <span className="font-mono text-[#D4AF37]">{formatCurrency(result.recouped + result.profitPool)}</span></span>
          </div>
        </div>
      </div>

      {/* Payment Waterfall Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            PAYMENT WATERFALL
          </h2>
          <p className="text-zinc-500 text-sm mt-1">Priority order of distribution</p>
        </div>

        {/* Body Area */}
        <div style={{ backgroundColor: '#000000' }}>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs tracking-widest uppercase text-zinc-500 border-b border-zinc-800">
                  <th className="px-6 py-4">Position</th>
                  <th className="px-6 py-4">Detail</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {result.ledger.map((item, index) => (
                  <tr key={index} className="border-b border-zinc-800">
                    <td className="px-6 py-4">
                      <span className="text-[#D4AF37] font-mono text-sm mr-3">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-white font-medium">{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 text-sm">{item.detail}</td>
                    <td className="px-6 py-4 text-right font-mono text-white">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-[#D4AF37]">
                <tr style={{ backgroundColor: '#0a0a0a' }}>
                  <td className="px-6 py-4 font-bebas text-[#D4AF37]">TOTAL HURDLES</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4 text-right font-mono text-[#D4AF37] text-lg">
                    {formatCurrency(result.totalHurdle)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile Stacked Cards */}
          <div className="md:hidden divide-y divide-zinc-800">
            {result.ledger.map((item, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#D4AF37] font-mono text-xs">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-white font-medium text-sm">{item.name}</span>
                  </div>
                  <span className="font-mono text-white text-sm">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs">{item.detail}</p>
              </div>
            ))}
            <div className="p-4" style={{ backgroundColor: '#0a0a0a' }}>
              <div className="flex items-center justify-between">
                <span className="font-bebas text-[#D4AF37] text-sm">TOTAL HURDLES</span>
                <span className="font-mono text-[#D4AF37]">{formatCurrency(result.totalHurdle)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardStep5;
