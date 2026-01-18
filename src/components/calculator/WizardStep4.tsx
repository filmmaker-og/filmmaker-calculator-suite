import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WizardStep4Props {
  revenue: number;
  onUpdate: (value: number) => void;
}

const WizardStep4 = ({ revenue, onUpdate }: WizardStep4Props) => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Terminal Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              04 | STREAMER BUYOUT
            </h2>
            <button
              onClick={() => setInfoOpen(true)}
              className="transition-colors hover:opacity-80"
              aria-label="More information"
            >
              <Info className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </button>
          </div>
        </div>

        {/* Body Area */}
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
          {/* Label Row */}
          <div className="mb-4">
            <span className="text-white font-bold text-sm tracking-wide uppercase">
              TOTAL ACQUISITION PRICE
            </span>
          </div>

          {/* Input Box */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-zinc-600">
              $
            </span>
            <Input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              value={revenue === 0 ? '' : revenue.toLocaleString()}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                onUpdate(value);
              }}
              placeholder="0"
              className="pl-10 py-6 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
              style={{ backgroundColor: '#0a0a0a' }}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent 
          className="max-w-md rounded-sm"
          style={{ 
            backgroundColor: '#111111',
            border: '1px solid #D4AF37'
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider" style={{ color: '#D4AF37' }}>
              STREAMER ACQUISITION
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <h4 className="text-white font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                In a Cost-Plus buyout (Netflix/Amazon/Apple), the streamer purchases 100% of the 
                copyright for a fixed price. This fee usually covers the Negative Cost plus a 
                negotiated Premium (Profit).
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-2">THE GOAL</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                This number is the "Gross Receipts" for the purpose of the waterfall. It is the 
                single pot of money from which all debts and equity must be repaid.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep4;
