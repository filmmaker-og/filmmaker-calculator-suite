import { useMemo } from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveCalculationPanelProps {
  budget: number;
  sources: number;
  offTopTotal: number;
  breakEven: number | null;
  isMobile?: boolean;
  className?: string;
}

export const LiveCalculationPanel = ({
  budget,
  sources,
  offTopTotal,
  breakEven,
  isMobile = false,
  className,
}: LiveCalculationPanelProps) => {
  const isOverFinanced = sources > budget;
  const overFinancedAmount = sources - budget;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={cn(
        'bg-[#0A0A0A] border-2 border-[#D4AF37] rounded-lg p-6 space-y-6',
        isMobile ? 'sticky bottom-0 z-50' : 'sticky top-6',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">LIVE CALCULATION</h3>
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
      </div>

      <div className="h-px bg-[#D4AF37]/30" />

      {/* Budget */}
      <div className="space-y-2">
        <div className="text-gray-400 text-sm">Budget</div>
        <div className="text-white text-2xl font-bold">
          {budget > 0 ? formatCurrency(budget) : '—'}
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-2">
        <div className="text-gray-400 text-sm">Total Sources</div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'text-2xl font-bold',
            isOverFinanced ? 'text-orange-400' : 'text-white'
          )}>
            {sources > 0 ? formatCurrency(sources) : '—'}
          </div>
          {isOverFinanced && (
            <AlertCircle className="w-5 h-5 text-orange-400" />
          )}
        </div>
        {isOverFinanced && (
          <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 mt-2">
            <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-orange-300">
              Over budget by {formatCurrency(overFinancedAmount)}. This dilutes ROI.
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-[#D4AF37]/30" />

      {/* Off-Top Total */}
      <div className="space-y-2">
        <div className="text-gray-400 text-sm">Off-Top Costs</div>
        <div className="text-white text-2xl font-bold">
          {offTopTotal > 0 ? formatCurrency(offTopTotal) : '—'}
        </div>
        {offTopTotal > 0 && budget > 0 && (
          <div className="text-gray-400 text-xs">
            {((offTopTotal / budget) * 100).toFixed(1)}% of budget
          </div>
        )}
      </div>

      {/* Break-Even */}
      {breakEven !== null && breakEven > 0 && (
        <>
          <div className="h-px bg-[#D4AF37]/30" />
          <div className="space-y-2">
            <div className="text-gray-400 text-sm">Break-Even Target</div>
            <div className="text-[#F9E076] text-2xl font-bold">
              {formatCurrency(breakEven)}
            </div>
            <div className="text-gray-400 text-xs">
              Minimum to recoup all costs + returns
            </div>
          </div>
        </>
      )}

      {/* Show full breakdown CTA */}
      {breakEven && (
        <button className="w-full py-3 bg-[#D4AF37] hover:bg-[#F9E076] text-black font-semibold rounded-lg transition-colors">
          Show Full Breakdown ↓
        </button>
      )}
    </div>
  );
};