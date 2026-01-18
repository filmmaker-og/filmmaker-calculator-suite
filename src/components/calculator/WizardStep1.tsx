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
      {/* Folder Tab Card */}
      <div 
        className="overflow-hidden"
        style={{ 
          border: '1px solid #D4AF37',
          borderRadius: '8px'
        }}
      >
        {/* Header Strip */}
        <div 
          className="px-6 py-4"
          style={{ backgroundColor: '#111111' }}
        >
          <h2 
            className="font-bebas text-xl tracking-wider"
            style={{ color: '#D4AF37' }}
          >
            01 | PROJECT BASIS
          </h2>
        </div>

        {/* Card Body */}
        <div 
          className="p-6"
          style={{ backgroundColor: '#000000' }}
        >
          {/* Label Row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white font-bold text-sm tracking-wide">
              NEGATIVE COST
            </span>
            <button
              onClick={() => setInfoOpen(true)}
              className="p-3 -m-3 transition-colors hover:opacity-80"
              aria-label="More information"
            >
              <Info className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </button>
          </div>

          {/* Input Box */}
          <div className="relative">
            <span 
              className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xl text-zinc-600"
            >
              $
            </span>
            <Input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              value={budget === 0 ? '' : budget.toLocaleString()}
              onChange={(e) => {
                const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
                onUpdate(value);
              }}
              placeholder="0"
              className="pl-10 py-6 text-2xl font-mono text-white text-right rounded-md transition-colors"
              style={{ 
                backgroundColor: '#0a0a0a',
                border: '1px solid #333333',
              }}
              onFocus={(e) => {
                e.target.select();
                e.currentTarget.style.borderColor = '#D4AF37';
                e.currentTarget.style.boxShadow = '0 0 0 1px #D4AF37';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#333333';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent 
          className="max-w-md"
          style={{ 
            backgroundColor: '#111111',
            border: '1px solid #D4AF37'
          }}
        >
          <DialogHeader>
            <DialogTitle 
              className="font-bebas text-2xl tracking-wider"
              style={{ color: '#D4AF37' }}
            >
              NEGATIVE COST
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Definition */}
            <div>
              <h4 className="text-white font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                The total capital required to produce the master and deliver to distributors. 
                Includes all Above-the-Line (Talent) and Below-the-Line (Crew/Locations) expenses. 
                Excludes marketing (P&A), sales fees, and financing costs.
              </p>
            </div>

            {/* The Streamer Reality */}
            <div>
              <h4 className="text-white font-bold text-sm mb-2">THE STREAMER REALITY</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                In Cost-Plus deals (Netflix, Amazon), P&A is handled independently by the platform. 
                The streamer pays the Negative Cost + Premium. They do not deduct marketing from 
                this recoupment bucket.
              </p>
            </div>

            {/* The Bottom Line */}
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
