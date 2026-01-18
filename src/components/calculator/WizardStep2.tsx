import { useState } from "react";
import { Input } from "@/components/ui/input";
import { WaterfallInputs } from "@/lib/waterfall";
import { Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface WizardStep2Props {
  inputs: WaterfallInputs;
  onUpdate: (key: keyof WaterfallInputs, value: number) => void;
}

const WizardStep2 = ({ inputs, onUpdate }: WizardStep2Props) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const modals = {
    softMoney: {
      title: "SOFT MONEY / TAX INCENTIVES",
      description: "Tax credits and incentives reduce your net equity requirement. These are non-recourse funds provided by states, countries, or federal programs to encourage film production in their jurisdiction. Common examples include Georgia's 20-30% tax credit or the UK's 25% Film Tax Relief."
    },
    mezzanine: {
      title: "MEZZANINE / GAP FINANCING",
      description: "Gap financing is high-risk, high-interest debt used to complete the production bond when senior debt and equity aren't sufficient. It's secured against unsold territories and typically carries interest rates of 12-18%. Lenders take on significant risk as they're paid after senior debt in the waterfall."
    }
  };

  const formatValue = (value: number) => {
    return value === 0 ? '' : value.toLocaleString();
  };

  const parseValue = (str: string, isPercent: boolean = false) => {
    const value = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return isPercent ? Math.min(value, 100) : value;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* MODULE A: SOFT MONEY */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            02A | TAX INCENTIVES
          </h2>
          <button
            onClick={() => setActiveModal('softMoney')}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-zinc-500 hover:text-[#D4AF37] transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6" style={{ backgroundColor: '#000000' }}>
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

      {/* MODULE B: DEBT FINANCING */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        <div className="py-4 px-6 border-b border-[#333333] flex items-center justify-between" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            02B | DEBT SERVICE
          </h2>
          <button
            onClick={() => setActiveModal('mezzanine')}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-zinc-500 hover:text-[#D4AF37] transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6" style={{ backgroundColor: '#000000' }}>
          {/* Section 1: Senior Debt */}
          <div>
            <div className="mb-4 pb-2 border-b border-zinc-800">
              <span className="text-zinc-400 text-xs tracking-widest uppercase">
                SENIOR DEBT
              </span>
            </div>
            
            {/* Principal Amount */}
            <div className="mb-4">
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">
                  PRINCIPAL AMOUNT
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

            {/* Interest Rate */}
            <div>
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">
                  INTEREST RATE + FEES
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
          </div>

          {/* Section 2: Mezzanine / Gap */}
          <div>
            <div className="mb-4 pb-2 border-b border-zinc-800">
              <span className="text-zinc-400 text-xs tracking-widest uppercase">
                MEZZANINE / GAP
              </span>
            </div>
            
            {/* Principal Amount */}
            <div className="mb-4">
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">
                  MEZZANINE / GAP PRINCIPAL
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

            {/* Interest Rate */}
            <div>
              <div className="mb-3">
                <span className="text-white font-bold text-sm tracking-wide uppercase">
                  INTEREST RATE + FEES
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

      {/* MODULE C: EQUITY */}
      <div className="rounded-sm border border-[#D4AF37] overflow-hidden">
        <div className="py-4 px-6 border-b border-[#333333]" style={{ backgroundColor: '#111111' }}>
          <h2 className="font-bebas text-xl tracking-wider uppercase" style={{ color: '#D4AF37' }}>
            02C | INVESTOR EQUITY
          </h2>
        </div>
        <div className="p-6 space-y-6" style={{ backgroundColor: '#000000' }}>
          {/* Cash Equity */}
          <div>
            <div className="mb-3">
              <span className="text-white font-bold text-sm tracking-wide uppercase">
                CASH EQUITY REQUIRED
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
                PREFERRED RETURN (HURDLE)
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
              <DialogDescription className="text-zinc-300 text-sm leading-relaxed pt-2">
                {modal.description}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default WizardStep2;
