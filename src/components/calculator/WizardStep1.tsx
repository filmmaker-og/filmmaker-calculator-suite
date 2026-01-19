import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WizardStep1Props {
  budget: number;
  onUpdate: (value: number) => void;
}

const WizardStep1 = ({ budget, onUpdate }: WizardStep1Props) => {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Terminal Card */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* Header Strip */}
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              01 | PROJECT BASIS
            </h2>
            <button
              onClick={() => setInfoOpen(true)}
              className="transition-all duration-100 hover:opacity-80 active:scale-95 p-2 -m-2"
              aria-label="More information"
            >
              <Info className="w-5 h-5" style={{ color: '#D4AF37' }} />
            </button>
          </div>
        </div>

        {/* Body Area */}
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
          {/* Label Row */}
          <div className="mb-4">
            <span className="text-white font-bold text-sm tracking-wide uppercase">
              NEGATIVE COST
            </span>
          </div>

          {/* Input Box */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-zinc-600">
              $
            </span>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={budget === 0 ? '' : budget.toLocaleString()}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                onUpdate(value);
              }}
              placeholder="0"
              className="pl-10 py-6 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all focus:scale-[1.01] min-h-[60px]"
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
              NEGATIVE COST
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <h4 className="text-white font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                The total capital required to produce the master and deliver to distributors. 
                Includes all Above-the-Line (Talent) and Below-the-Line (Crew/Locations) expenses. 
                Excludes marketing (P&A), sales fees, and financing costs.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-2">THE STREAMER REALITY</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                In Cost-Plus deals (Netflix, Amazon), P&A is handled independently by the platform. 
                The streamer pays the Negative Cost + Premium. They do not deduct marketing from 
                this recoupment bucket.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-2">THE BOTTOM LINE</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                This is your "Cost Basis." This number must be fully recouped from the Buyout Price 
                before Net Profits are calculated.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep1;
