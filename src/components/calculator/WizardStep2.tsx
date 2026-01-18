import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WizardStep2Props {
  inputs: WaterfallInputs;
  onUpdate: (key: keyof WaterfallInputs, value: number) => void;
}

const WizardStep2 = ({ inputs, onUpdate }: WizardStep2Props) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Initialize toggles based on whether data exists
  const [showTaxCredits, setShowTaxCredits] = useState(inputs.credits > 0);
  const [showDebt, setShowDebt] = useState(inputs.debt > 0 || inputs.mezzanineDebt > 0);
  const [showGapLoan, setShowGapLoan] = useState(inputs.mezzanineDebt > 0);
  const [showEquity, setShowEquity] = useState(true); // Default Equity to true as it's most common

  // --- HANDLERS ---

  // 1. Tax Toggle
  const handleTaxToggle = (checked: boolean) => {
    setShowTaxCredits(checked);
    if (!checked) onUpdate('credits', 0);
  };

  // 2. Master Debt Toggle (Circuit Breaker)
  const handleDebtToggle = (checked: boolean) => {
    setShowDebt(checked);
    if (!checked) {
      onUpdate('debt', 0);
      onUpdate('seniorDebtRate', 0);
      onUpdate('mezzanineDebt', 0);
      onUpdate('mezzanineRate', 0);
      setShowGapLoan(false);
    }
  };

  // 3. Internal Gap Toggle (Sub-switch)
  const handleGapToggle = (checked: boolean) => {
    setShowGapLoan(checked);
    if (!checked) {
      onUpdate('mezzanineDebt', 0);
      onUpdate('mezzanineRate', 0);
    }
  };

  // 4. Equity Toggle
  const handleEquityToggle = (checked: boolean) => {
    setShowEquity(checked);
    if (!checked) {
      onUpdate('equity', 0);
      onUpdate('premium', 0);
    }
  };

  // --- UTILS ---
  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string, isPercent: boolean = false) => {
    const value = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return isPercent ? Math.min(value, 100) : value;
  };

  const modals = {
    taxIncentives: {
      title: "TAX INCENTIVES",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <div>
            <span className="text-white font-bold">ESTIMATED TAX CREDIT</span>
            <p className="mt-1">Non-recourse funds provided by government programs. These reduce the net capital required from investors.</p>
          </div>
          <div className="text-zinc-500 text-xs">Examples: UK (25%), Georgia (20-30%).</div>
        </div>
      )
    },
    debtService: {
      title: "DEBT FINANCING",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <div>
            <span className="text-white font-bold">SENIOR LOAN</span>
            <p className="mt-1">First-position debt secured against pre-sales or minimum guarantees. Paid back first.</p>
          </div>
          <div className="my-3 border-b border-dashed border-zinc-700" />
          <div>
            <span className="text-white font-bold">GAP / BRIDGE LOAN</span>
            <p className="mt-1">High-risk debt used to bridge the financing gap. Subordinate to Senior Debt.</p>
          </div>
        </div>
      )
    },
    investorEquity: {
      title: "INVESTOR EQUITY",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <div>
            <span className="text-white font-bold">NET EQUITY</span>
            <p className="mt-1">Cash investment required. (Budget - Tax Credits - Debt = Equity).</p>
          </div>
          <div className="my-3 border-b border-dashed border-zinc-700" />
          <div>
            <span className="text-white font-bold">PREFERRED RETURN</span>
            <p className="mt-1">The "Hurdle Rate" investors must receive before profits are split (typically 10-20%).</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* --- CARD 2A: TAX INCENTIVES --- */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* HEADER */}
        <div 
          className="py-4 px-6 flex items-center justify-between"
          style={{ 
            backgroundColor: '#111111',
            borderBottom: showTaxCredits ? '1px solid #333333' : 'none'
          }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              2A | TAX INCENTIVES
            </h2>
            <button onClick={() => setActiveModal('taxIncentives')} className="hover:opacity-80 transition-colors">
              <Info className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </button>
          </div>
          {/* MASTER TOGGLE */}
          <Switch 
            checked={showTaxCredits} 
            onCheckedChange={handleTaxToggle} 
            className="scale-110 data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-zinc-700" 
          />
        </div>
        
        {/* BODY (ACCORDION) */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showTaxCredits ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ backgroundColor: '#000000' }}
        >
          <div className="p-6">
            <div className="mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">ESTIMATED TAX CREDIT</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">$</span>
              <Input 
                type="text" 
                inputMode="decimal" 
                pattern="[0-9]*" 
                value={formatValue(inputs.credits)} 
                onChange={(e) => onUpdate('credits', parseValue(e.target.value))} 
                placeholder="0" 
                className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors bg-[#0a0a0a]" 
                onFocus={(e) => e.target.select()} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- CARD 2B: DEBT FINANCING (CIRCUIT BREAKER) --- */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* HEADER WITH MASTER TOGGLE */}
        <div 
          className="py-4 px-6 flex items-center justify-between"
          style={{ 
            backgroundColor: '#111111',
            borderBottom: showDebt ? '1px solid #333333' : 'none'
          }}
        >
          <div className="flex items-center gap-2">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              2B | DEBT SERVICE
            </h2>
            <button onClick={() => setActiveModal('debtService')} className="hover:opacity-80 transition-colors">
              <Info className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </button>
          </div>
          {/* MASTER TOGGLE FOR DEBT */}
          <Switch 
            checked={showDebt} 
            onCheckedChange={handleDebtToggle} 
            className="scale-110 data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-zinc-700" 
          />
        </div>

        {/* BODY (ACCORDION) */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showDebt ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ backgroundColor: '#000000' }}
        >
          <div className="p-6">
            
            {/* SENIOR DEBT (ALWAYS VISIBLE IF DEBT IS ON) */}
            <div className="mb-4">
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">SENIOR LOAN AMOUNT</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">$</span>
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.debt)} 
                  onChange={(e) => onUpdate('debt', parseValue(e.target.value))} 
                  placeholder="0" 
                  className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] bg-[#0a0a0a]" 
                  onFocus={(e) => e.target.select()} 
                />
              </div>
            </div>

            <div>
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">RATE & FEES</span>
              </div>
              <div className="relative">
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.seniorDebtRate)} 
                  onChange={(e) => onUpdate('seniorDebtRate', parseValue(e.target.value, true))} 
                  placeholder="0" 
                  className="pl-4 pr-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] bg-[#0a0a0a]" 
                  onFocus={(e) => e.target.select()} 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">%</span>
              </div>
            </div>

            {/* GAP LOAN DIVIDER & SUB-TOGGLE */}
            <div 
              className="mt-6 -mx-6 px-6 h-12 flex items-center justify-between border-t border-zinc-800"
              style={{ backgroundColor: '#0d0d0d' }}
            >
              <span className="text-zinc-400 text-sm font-bold tracking-wide uppercase">GAP / BRIDGE LOAN</span>
              <Switch 
                checked={showGapLoan} 
                onCheckedChange={handleGapToggle} 
                className="scale-110 data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-zinc-700" 
              />
            </div>

            {/* GAP INPUTS (ACCORDION INSIDE ACCORDION) */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showGapLoan ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
              }`}
            >
              <div className="mb-4">
                <div className="mb-3">
                  <span className="text-white font-bold text-sm tracking-wide uppercase">LOAN AMOUNT</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">$</span>
                  <Input 
                    type="text" 
                    inputMode="decimal" 
                    pattern="[0-9]*" 
                    value={formatValue(inputs.mezzanineDebt)} 
                    onChange={(e) => onUpdate('mezzanineDebt', parseValue(e.target.value))} 
                    placeholder="0" 
                    className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] bg-[#0a0a0a]" 
                    onFocus={(e) => e.target.select()} 
                  />
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <span className="text-white font-bold text-sm tracking-wide uppercase">RATE & FEES</span>
                </div>
                <div className="relative">
                  <Input 
                    type="text" 
                    inputMode="decimal" 
                    pattern="[0-9]*" 
                    value={formatValue(inputs.mezzanineRate)} 
                    onChange={(e) => onUpdate('mezzanineRate', parseValue(e.target.value, true))} 
                    placeholder="0" 
                    className="pl-4 pr-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] bg-[#0a0a0a]" 
                    onFocus={(e) => e.target.select()} 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">%</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* --- CARD 2C: EQUITY (CIRCUIT BREAKER) --- */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        {/* HEADER WITH MASTER TOGGLE */}
        <div 
          className="py-4 px-6 flex items-center justify-between"
          style={{ 
            backgroundColor: '#111111',
            borderBottom: showEquity ? '1px solid #333333' : 'none'
          }}
        >
          <div className="flex items-center gap-2">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              2C | INVESTOR EQUITY
            </h2>
            <button onClick={() => setActiveModal('investorEquity')} className="hover:opacity-80 transition-colors">
              <Info className="w-4 h-4" style={{ color: '#D4AF37' }} />
            </button>
          </div>
          {/* MASTER TOGGLE FOR EQUITY */}
          <Switch 
            checked={showEquity} 
            onCheckedChange={handleEquityToggle} 
            className="scale-110 data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-zinc-700" 
          />
        </div>

        {/* BODY (ACCORDION) */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showEquity ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ backgroundColor: '#000000' }}
        >
          <div className="p-6 space-y-6">
            <div>
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">NET EQUITY NEEDED</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">$</span>
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.equity)} 
                  onChange={(e) => onUpdate('equity', parseValue(e.target.value))} 
                  placeholder="0" 
                  className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] bg-[#0a0a0a]" 
                  onFocus={(e) => e.target.select()} 
                />
              </div>
            </div>

            <div>
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">PREFERRED RETURN</span>
              </div>
              <div className="relative">
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.premium)} 
                  onChange={(e) => onUpdate('premium', parseValue(e.target.value, true))} 
                  placeholder="0" 
                  className="pl-4 pr-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] bg-[#0a0a0a]" 
                  onFocus={(e) => e.target.select()} 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {Object.entries(modals).map(([key, modal]) => (
        <Dialog key={key} open={activeModal === key} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="rounded-sm border-[#D4AF37] max-w-md" style={{ backgroundColor: '#111111' }}>
            <DialogHeader>
              <DialogTitle className="font-bebas text-xl tracking-wider" style={{ color: '#D4AF37' }}>
                {modal.title}
              </DialogTitle>
            </DialogHeader>
            <div className="pt-2">{modal.content}</div>
          </DialogContent>
        </Dialog>
      ))}

    </div>
  );
};

export default WizardStep2;
