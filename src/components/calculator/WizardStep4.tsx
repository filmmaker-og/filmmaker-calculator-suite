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
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            04 | PROJECTED REVENUE
          </h2>
        </div>

        {/* Body Area */}
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
          {/* Label Row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white font-bold text-sm tracking-wide uppercase">
              GROSS REVENUE
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

          {/* Tip */}
          <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
            <span style={{ color: '#D4AF37' }} className="font-semibold">Tip:</span> Consider all revenue windows including 
            theatrical, streaming licenses, SVOD, AVOD, international presales, and ancillary rights.
          </p>
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
              GROSS REVENUE
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div>
              <h4 className="text-white font-bold text-sm mb-2">DEFINITION</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                The total money received from all distribution windows before any deductions. 
                This includes theatrical box office, streaming platform licenses, VOD sales, 
                international presales, and ancillary rights.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-2">REVENUE STREAMS</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                Theatrical (Domestic & International), SVOD/AVOD Licenses, TVOD/EST Sales, 
                Pay TV Windows, Free TV Syndication, Airline/Hotel Rights, Merchandise, and 
                any other exploitation rights.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold text-sm mb-2">THE BOTTOM LINE</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#999999' }}>
                This is your "Top Line" number. All distribution fees, sales expenses, guild residuals, 
                and investor recoupment will be deducted from this amount in the waterfall.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardStep4;
