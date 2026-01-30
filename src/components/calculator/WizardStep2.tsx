import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info, CreditCard, Building, Users } from "lucide-react";
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
  const [showEquity, setShowEquity] = useState(true);

  // --- HANDLERS ---
  const handleTaxToggle = (checked: boolean) => {
    setShowTaxCredits(checked);
    if (!checked) onUpdate('credits', 0);
  };

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

  const handleGapToggle = (checked: boolean) => {
    setShowGapLoan(checked);
    if (!checked) {
      onUpdate('mezzanineDebt', 0);
      onUpdate('mezzanineRate', 0);
    }
  };

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
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <div>
            <span className="text-foreground font-bold">ESTIMATED TAX CREDIT</span>
            <p className="mt-1">Non-recourse funds provided by government programs. These reduce the net capital required from investors.</p>
          </div>
          <div className="text-muted-foreground text-xs">Examples: UK (25%), Georgia (20-30%).</div>
        </div>
      )
    },
    debtService: {
      title: "DEBT FINANCING",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <div>
            <span className="text-foreground font-bold">SENIOR LOAN</span>
            <p className="mt-1">First-position debt secured against pre-sales or minimum guarantees. Paid back first.</p>
          </div>
          <div className="my-3 border-b border-dashed border-border" />
          <div>
            <span className="text-foreground font-bold">GAP / BRIDGE LOAN</span>
            <p className="mt-1">High-risk debt used to bridge the financing gap. Subordinate to Senior Debt.</p>
          </div>
        </div>
      )
    },
    investorEquity: {
      title: "INVESTOR EQUITY",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <div>
            <span className="text-foreground font-bold">NET EQUITY</span>
            <p className="mt-1">Cash investment required. (Budget - Tax Credits - Debt = Equity).</p>
          </div>
          <div className="my-3 border-b border-dashed border-border" />
          <div>
            <span className="text-foreground font-bold">PREFERRED RETURN</span>
            <p className="mt-1">The "Hurdle Rate" investors must receive before profits are split (typically 10-20%).</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="animate-fade-in space-y-5">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-gold font-bebas text-sm">2</span>
        </div>
        <div>
          <h2 className="font-bebas text-xl text-foreground tracking-wide">CAPITAL STRUCTURE</h2>
          <p className="text-xs text-muted-foreground">Configure your financing sources</p>
        </div>
      </div>
      
      {/* --- CARD 2A: TAX INCENTIVES --- */}
      <div className="rounded-sm border border-gold overflow-hidden">
        <div 
          className={`py-4 px-5 flex items-center justify-between bg-card ${showTaxCredits ? 'border-b border-border' : ''}`}
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gold" />
            <h3 className="font-bebas text-base tracking-wider uppercase text-gold">
              TAX INCENTIVES
            </h3>
            <button onClick={() => setActiveModal('taxIncentives')} className="hover:opacity-80 transition-colors">
              <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-gold" />
            </button>
          </div>
          <Switch 
            checked={showTaxCredits} 
            onCheckedChange={handleTaxToggle} 
            className="data-[state=checked]:bg-gold" 
          />
        </div>
        
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showTaxCredits ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-5 bg-background">
            <div className="mb-3">
              <span className="text-foreground font-semibold text-xs tracking-wide uppercase">ESTIMATED TAX CREDIT</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input 
                type="text" 
                inputMode="decimal" 
                pattern="[0-9]*" 
                value={formatValue(inputs.credits)} 
                onChange={(e) => onUpdate('credits', parseValue(e.target.value))} 
                placeholder="0" 
                className="pl-10 py-5 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold focus:ring-1 focus:ring-gold transition-colors bg-card" 
                onFocus={(e) => e.target.select()} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- CARD 2B: DEBT FINANCING --- */}
      <div className="rounded-sm border border-gold overflow-hidden">
        <div 
          className={`py-4 px-5 flex items-center justify-between bg-card ${showDebt ? 'border-b border-border' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Building className="w-4 h-4 text-gold" />
            <h3 className="font-bebas text-base tracking-wider uppercase text-gold">
              DEBT FINANCING
            </h3>
            <button onClick={() => setActiveModal('debtService')} className="hover:opacity-80 transition-colors">
              <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-gold" />
            </button>
          </div>
          <Switch 
            checked={showDebt} 
            onCheckedChange={handleDebtToggle} 
            className="data-[state=checked]:bg-gold" 
          />
        </div>

        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showDebt ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-5 bg-background space-y-5">
            {/* Senior Debt */}
            <div>
              <div className="mb-3">
                <span className="text-foreground font-semibold text-xs tracking-wide uppercase">SENIOR LOAN AMOUNT</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.debt)} 
                  onChange={(e) => onUpdate('debt', parseValue(e.target.value))} 
                  placeholder="0" 
                  className="pl-10 py-5 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card" 
                  onFocus={(e) => e.target.select()} 
                />
              </div>
            </div>

            <div>
              <div className="mb-3">
                <span className="text-foreground font-semibold text-xs tracking-wide uppercase">RATE & FEES</span>
              </div>
              <div className="relative">
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.seniorDebtRate)} 
                  onChange={(e) => onUpdate('seniorDebtRate', parseValue(e.target.value, true))} 
                  placeholder="0" 
                  className="pl-4 pr-10 py-5 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card" 
                  onFocus={(e) => e.target.select()} 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
              </div>
            </div>

            {/* Gap Loan Toggle */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">GAP / BRIDGE LOAN</span>
                <Switch 
                  checked={showGapLoan} 
                  onCheckedChange={handleGapToggle} 
                  className="data-[state=checked]:bg-gold" 
                />
              </div>
            </div>

            {/* Gap Inputs */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showGapLoan ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-5 pt-4">
                <div>
                  <div className="mb-3">
                    <span className="text-foreground font-semibold text-xs tracking-wide uppercase">LOAN AMOUNT</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                    <Input 
                      type="text" 
                      inputMode="decimal" 
                      pattern="[0-9]*" 
                      value={formatValue(inputs.mezzanineDebt)} 
                      onChange={(e) => onUpdate('mezzanineDebt', parseValue(e.target.value))} 
                      placeholder="0" 
                      className="pl-10 py-5 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card" 
                      onFocus={(e) => e.target.select()} 
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-3">
                    <span className="text-foreground font-semibold text-xs tracking-wide uppercase">RATE & FEES</span>
                  </div>
                  <div className="relative">
                    <Input 
                      type="text" 
                      inputMode="decimal" 
                      pattern="[0-9]*" 
                      value={formatValue(inputs.mezzanineRate)} 
                      onChange={(e) => onUpdate('mezzanineRate', parseValue(e.target.value, true))} 
                      placeholder="0" 
                      className="pl-4 pr-10 py-5 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card" 
                      onFocus={(e) => e.target.select()} 
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CARD 2C: EQUITY --- */}
      <div className="rounded-sm border border-gold overflow-hidden">
        <div 
          className={`py-4 px-5 flex items-center justify-between bg-card ${showEquity ? 'border-b border-border' : ''}`}
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gold" />
            <h3 className="font-bebas text-base tracking-wider uppercase text-gold">
              INVESTOR EQUITY
            </h3>
            <button onClick={() => setActiveModal('investorEquity')} className="hover:opacity-80 transition-colors">
              <Info className="w-3.5 h-3.5 text-muted-foreground hover:text-gold" />
            </button>
          </div>
          <Switch 
            checked={showEquity} 
            onCheckedChange={handleEquityToggle} 
            className="data-[state=checked]:bg-gold" 
          />
        </div>

        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showEquity ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="p-5 bg-background space-y-5">
            <div>
              <div className="mb-3">
                <span className="text-foreground font-semibold text-xs tracking-wide uppercase">NET EQUITY NEEDED</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.equity)} 
                  onChange={(e) => onUpdate('equity', parseValue(e.target.value))} 
                  placeholder="0" 
                  className="pl-10 py-5 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card" 
                  onFocus={(e) => e.target.select()} 
                />
              </div>
            </div>

            <div>
              <div className="mb-3">
                <span className="text-foreground font-semibold text-xs tracking-wide uppercase">PREFERRED RETURN</span>
              </div>
              <div className="relative">
                <Input 
                  type="text" 
                  inputMode="decimal" 
                  pattern="[0-9]*" 
                  value={formatValue(inputs.premium)} 
                  onChange={(e) => onUpdate('premium', parseValue(e.target.value, true))} 
                  placeholder="0" 
                  className="pl-4 pr-10 py-5 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card" 
                  onFocus={(e) => e.target.select()} 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {Object.entries(modals).map(([key, modal]) => (
        <Dialog key={key} open={activeModal === key} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="rounded-sm border-gold max-w-md bg-card">
            <DialogHeader>
              <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
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
