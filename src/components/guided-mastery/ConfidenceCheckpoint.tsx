import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfidenceCheckpointProps {
  title: string;
  value: string;
  context?: string;
  insight?: string;
  warning?: string;
  className?: string;
}

export const ConfidenceCheckpoint = ({
  title,
  value,
  context,
  insight,
  warning,
  className,
}: ConfidenceCheckpointProps) => {
  return (
    <div className={cn(
      'bg-[#0A0A0A] border-2 border-[#D4AF37] rounded-lg p-6',
      'animate-in fade-in-50 slide-in-from-bottom-4 duration-500',
      className
    )}>
      <div className="flex items-start gap-4">
        {/* Checkmark */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-black" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <h3 className="text-white font-semibold text-lg">
            ✓ {title}
          </h3>

          {/* Main value */}
          <div className="text-2xl font-bold text-[#F9E076]">
            {value}
          </div>

          {/* Context text */}
          {context && (
            <p className="text-gray-400 text-sm">
              {context}
            </p>
          )}

          {/* Insight (positive) */}
          {insight && (
            <div className="flex items-start gap-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-3">
              <span className="text-[#D4AF37] text-lg">💡</span>
              <p className="text-gray-300 text-sm">
                {insight}
              </p>
            </div>
          )}

          {/* Warning (cautionary) */}
          {warning && (
            <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
              <span className="text-orange-400 text-lg">⚠</span>
              <p className="text-gray-300 text-sm">
                {warning}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};