import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WizardStep2Props {
  inputs: WaterfallInputs;
  onUpdate: (key: keyof WaterfallInputs, value: number) => void;
}

const WizardStep2 = ({ inputs, onUpdate }: WizardStep2Props) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [showTaxCredits, setShowTaxCredits] = useState(inputs.credits > 0);
  const [showGapLoan, setShowGapLoan] = useState(inputs.mezzanineDebt > 0);

  const modals = {
    taxIncentives: {
      title: "TAX INCENTIVES",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <div>
            <span className="text-white font-bold">ESTIMATED TAX CREDIT</span>
            <p className="mt-1">Tax credits and incentives reduce your net equity requirement. These are non-recourse funds provided by states, countries, or federal programs to encourage film production in their jurisdiction.</p>
          </div>
          <div className="text-zinc-500 text-xs">
            Common examples: Georgia (20-30%), UK Film Tax Relief (25%), Canada (25-40%), Hungary (30%)
          </div>
        </div>
      )
    },
    debtService: {
      title: "DEBT SERVICE",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <div>
            <span className="text-white font-bold">SENIOR LOAN</span>
            <p className="mt-1">The primary production loan secured against pre-sales, minimum guarantees, or other collateral. First in line for repayment. Typical rates: 8-12%.</p>
          </div>
          <div className="my-3 border-b border-dashed border-zinc-700" />
          <div>
            <span className="text-white font-bold">GAP / BRIDGE LOAN</span>
            <p className="mt-1">High-risk, high-interest debt used to complete the bond when senior debt and equity aren't sufficient. Secured against unsold territories. Typical rates: 12-20%.</p>
          </div>
          <div className="text-zinc-500 text-xs">
            Gap lenders take significant risk as they're paid after senior debt in the waterfall.
          </div>
        </div>
      )
    },
    investorEquity: {
      title: "INVESTOR EQUITY",
      content: (
        <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
          <div>
            <span className="text-white font-bold">NET EQUITY NEEDED</span>
            <p className="mt-1">Cash investment required from equity investors after accounting for tax incentives and debt. Formula: Budget - Tax Credits - Senior Debt - Gap Debt = Net Equity.</p>
          </div>
          <div className="my-3 border-b border-dashed border-zinc-700" />
          <div>
            <span className="text-white font-bold">PREFERRED RETURN</span>
            <p className="mt-1">The minimum annual return promised to equity investors before profits are split. Also known as a "hurdle rate". Typical range: 10-25% depending on risk profile.</p>
          </div>
        </div>
      )
    }
  };

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string, isPercent: boolean = false) => {
    const value = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return isPercent ? Math.min(value, 100) : value;
  };

  const handleTaxToggle = (checked: boolean) => {
    setShowTaxCredits(checked);
    if (!checked) {
      onUpdate('credits', 0);
    }
  };

  const handleGapToggle = (checked: boolean) => {
    setShowGapLoan(checked);
    if (!checked) {
      onUpdate('mezzanineDebt', 0);
      onUpdate('mezzanineRate', 0);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* CARD 2A: TAX INCENTIVES - Collapsible */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
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
            <button
              onClick={() => setActiveModal('taxIncentives')}
              className="text-zinc-500 hover:text-[#D4AF37] transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
          <Switch
            checked={showTaxCredits}
            onCheckedChange={handleTaxToggle}
            className="scale-110 data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-zinc-700"
          />
        </div>
        
        {/* Collapsible Body */}
        <div 
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showTaxCredits ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{ backgroundColor: '#000000' }}
        >
          <div className="p-6">
            <div className="mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                ESTIMATED TAX CREDIT
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                $
              </span>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={formatValue(inputs.credits)}
                onChange={(e) => onUpdate('credits', parseValue(e.target.value))}
                placeholder="0"
                className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                style={{ backgroundColor: '#0a0a0a' }}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2B: DEBT SERVICE */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              2B | DEBT SERVICE
            </h2>
            <button
              onClick={() => setActiveModal('debtService')}
              className="text-zinc-500 hover:text-[#D4AF37] transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
          {/* Senior Loan Amount - Always Visible */}
          <div className="mb-4">
            <div className="mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                SENIOR LOAN AMOUNT
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                $
              </span>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={formatValue(inputs.debt)}
                onChange={(e) => onUpdate('debt', parseValue(e.target.value))}
                placeholder="0"
                className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                style={{ backgroundColor: '#0a0a0a' }}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Senior Rate & Fees */}
          <div>
            <div className="mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                RATE & FEES
              </span>
            </div>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={formatValue(inputs.seniorDebtRate)}
                onChange={(e) => onUpdate('seniorDebtRate', parseValue(e.target.value, true))}
                placeholder="0"
                className="pl-4 pr-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                style={{ backgroundColor: '#0a0a0a' }}
                onFocus={(e) => e.target.select()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                %
              </span>
            </div>
          </div>

          {/* Gap Sub-Header Bar */}
          <div 
            className="mt-6 -mx-6 px-6 h-12 flex items-center justify-between border-t border-zinc-800"
            style={{ backgroundColor: '#0d0d0d' }}
          >
            <span className="text-zinc-400 text-sm font-bold tracking-wide uppercase">
              GAP / BRIDGE LOAN
            </span>
            <Switch
              checked={showGapLoan}
              onCheckedChange={handleGapToggle}
              className="scale-110 data-[state=checked]:bg-[#D4AF37] data-[state=unchecked]:bg-zinc-700"
            />
          </div>

          {/* Gap Inputs - Collapsible */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showGapLoan ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            {/* Gap / Bridge Loan */}
            <div className="mb-4">
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">
                  LOAN AMOUNT
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                  $
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={formatValue(inputs.mezzanineDebt)}
                  onChange={(e) => onUpdate('mezzanineDebt', parseValue(e.target.value))}
                  placeholder="0"
                  className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  style={{ backgroundColor: '#0a0a0a' }}
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            {/* Gap Rate & Fees */}
            <div>
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">
                  RATE & FEES
                </span>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  value={formatValue(inputs.mezzanineRate)}
                  onChange={(e) => onUpdate('mezzanineRate', parseValue(e.target.value, true))}
                  placeholder="0"
                  className="pl-4 pr-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  style={{ backgroundColor: '#0a0a0a' }}
                  onFocus={(e) => e.target.select()}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2C: INVESTOR EQUITY */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <div className="flex items-center gap-3">
            <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
              2C | INVESTOR EQUITY
            </h2>
            <button
              onClick={() => setActiveModal('investorEquity')}
              className="text-zinc-500 hover:text-[#D4AF37] transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6" style={{ backgroundColor: '#000000' }}>
          {/* Net Equity Needed */}
          <div>
            <div className="mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                NET EQUITY NEEDED
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                $
              </span>
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={formatValue(inputs.equity)}
                onChange={(e) => onUpdate('equity', parseValue(e.target.value))}
                placeholder="0"
                className="pl-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                style={{ backgroundColor: '#0a0a0a' }}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Preferred Return */}
          <div>
            <div className="mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                PREFERRED RETURN
              </span>
            </div>
            <div className="relative">
              <Input
                type="text"
                inputMode="decimal"
                pattern="[0-9]*"
                value={formatValue(inputs.premium)}
                onChange={(e) => onUpdate('premium', parseValue(e.target.value, true))}
                placeholder="0"
                className="pl-4 pr-10 py-5 text-2xl font-mono text-white text-right rounded-sm border-zinc-800 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                style={{ backgroundColor: '#0a0a0a' }}
                onFocus={(e) => e.target.select()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-600">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modals */}
      {Object.entries(modals).map(([key, modal]) => (
        <Dialog key={key} open={activeModal === key} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="rounded-sm border-[#D4AF37] max-w-md" style={{ backgroundColor: '#111111' }}>
            <DialogHeader>
              <DialogTitle className="font-bebas text-xl tracking-wider" style={{ color: '#D4AF37' }}>
                {modal.title}
              </DialogTitle>
            </DialogHeader>
            <div className="pt-2">
              {modal.content}
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default WizardStep2;
