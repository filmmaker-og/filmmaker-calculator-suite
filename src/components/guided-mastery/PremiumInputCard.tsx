import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PremiumInputCardProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  prefix?: string;
  suffix?: string;
  helperText?: string;
  tooltip?: string;
  isComplete?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export const PremiumInputCard = ({
  label,
  value,
  onChange,
  type = 'text',
  prefix,
  suffix,
  helperText,
  tooltip,
  isComplete = false,
  error,
  placeholder,
  className,
}: PremiumInputCardProps) => {
  return (
    <div
      className={cn(
        'group relative bg-[#0A0A0A] border-2 rounded-lg p-6 transition-all duration-300',
        isComplete ? 'border-[#D4AF37]' : 'border-[#2A2A2A]',
        !isComplete && !error && 'hover:border-[#D4AF37]/50',
        error && 'border-red-500/50',
        className
      )}
    >
      {/* Label with tooltip */}
      <div className="flex items-center justify-between mb-3">
        <Label className="text-white font-semibold text-base">
          {label}
        </Label>
        
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-[#D4AF37] hover:text-[#F9E076] transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-[#0A0A0A] border-[#D4AF37] text-white max-w-xs">
                <p className="text-sm">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Input with prefix/suffix */}
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            {prefix}
          </span>
        )}
        
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'h-14 text-xl bg-black border-[#2A2A2A] text-white',
            'focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]',
            prefix && 'pl-8',
            suffix && 'pr-12'
          )}
        />
        
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            {suffix}
          </span>
        )}
      </div>

      {/* Helper text or error */}
      {(helperText || error) && (
        <div className="mt-3 flex items-start gap-2">
          <Info className={cn(
            'w-4 h-4 mt-0.5 flex-shrink-0',
            error ? 'text-red-500' : 'text-[#D4AF37]'
          )} />
          <p className={cn(
            'text-sm',
            error ? 'text-red-400' : 'text-gray-400'
          )}>
            {error || helperText}
          </p>
        </div>
      )}

      {/* Completion checkmark */}
      {isComplete && (
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Gold glow on focus */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg bg-[#D4AF37]/10 blur-xl" />
      </div>
    </div>
  );
};