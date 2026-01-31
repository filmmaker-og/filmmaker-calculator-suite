import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WaterfallInputs, formatCompactCurrency } from "@/lib/waterfall";
import { Info, CreditCard, Building, Users, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface WizardStep2Props {
  inputs: WaterfallInputs;
  onUpdate: (key: keyof WaterfallInputs, value: number) => void;
}

const WizardStep2 = ({ inputs, onUpdate }: WizardStep2Props) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [showTaxCredits, setShowTaxCredits] = useState(inputs.credits > 0);
  const [showDebt, setShowDebt] = useState(inputs.debt > 0 || inputs.mezzanineDebt > 0);
  const [showGapLoan, setShowGapLoan] = useState(inputs.mezzanineDebt > 0);
  const [showEquity, setShowEquity] = useState(true);

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

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string, isPercent: boolean = false) => {
    const value = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return isPercent ? Math.min(value, 100) : value;
  };

  // Summary text for collapsed state
  const getTaxSummary = () => {
    if (!showTaxCredits || inputs.credits === 0) return null;
    return formatCompactCurrency(inputs.credits);
  };

  const getDebtSummary = () => {
    if (!showDebt) return null;
    const parts: string[] = [];
    if (inputs.debt > 0) parts.push(`Senior ${formatCompactCurrency(inputs.debt)}`);
    if (inputs.mezzanineDebt > 0) parts.push(`Gap ${formatCompactCurrency(inputs.mezzanineDebt)}`);
    return parts.length > 0 ? parts.join(' + ') : null;
  };

  const getEquitySummary = () => {
    if (!showEquity || inputs.equity === 0) return null;
    return `${formatCompactCurrency(inputs.equity)} @ ${inputs.premium || 0}%`;
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
          <div className="text-muted-foreground text-xs">Examples: UK (25%), Georgia (20-30%), New Mexico (25-35%).</div>
        </div>
      )
    },
    debtService: {
      title: "DEBT FINANCING",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <div>
            <span className="text-foreground font-bold">SENIOR LOAN</span>
            <p className="mt-1">First-position debt secured against pre-sales or minimum guarantees. Paid back first in the waterfall.</p>
          </div>
          <div className="my-3 border-b border-dashed border-border" />
          <div>
            <span className="text-foreground font-bold">GAP / BRIDGE LOAN</span>
            <p className="mt-1">Higher-risk debt used to bridge the financing gap. Subordinate to Senior Debt but still ahead of equity.</p>
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
            <p className="mt-1">Cash investment required after tax credits and debt. Formula: Budget - Tax Credits - Debt = Equity Needed.</p>
          </div>
          <div className="my-3 border-b border-dashed border-border" />
          <div>
            <span className="text-foreground font-bold">PREFERRED RETURN</span>
            <p className="mt-1">The "Hurdle Rate" investors must receive before profits are split. Typically 15-20% for film investments.</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="step-enter space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
          <span className="text-gold font-bebas text-sm">2</span>
        </div>
        <div>
          <h2 className="font-bebas text-lg text-foreground tracking-wide">CAPITAL STRUCTURE</h2>
          <p className="text-xs text-muted-foreground">
            Where does the money come from? Tax credits, loans, or investors?
          </p>
        </div>
      </div>

      {/* Card: Tax Incentives */}
      <div className="rounded-sm border border-border overflow-hidden transition-all duration-200" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <button
          onClick={() => showTaxCredits ? setShowTaxCredits(false) : handleTaxToggle(true)}
          className="w-full py-3 px-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-4 h-4 text-gold" />
            <div className="text-left">
              <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
                TAX INCENTIVES
              </h3>
              {!showTaxCredits && getTaxSummary() && (
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{getTaxSummary()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveModal('taxIncentives'); }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
            </button>
            <Switch
              checked={showTaxCredits}
              onCheckedChange={handleTaxToggle}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-gold"
            />
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showTaxCredits ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`transition-all duration-300 ease-out overflow-hidden ${showTaxCredits ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-5 bg-background border-t border-border">
            <div className="mb-2">
              <span className="text-xs tracking-wider uppercase font-semibold text-foreground">ESTIMATED TAX CREDIT</span>
              <p className="text-[10px] text-muted-foreground mt-0.5">e.g., Georgia 20-30%, UK 25%</p>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.credits)}
                onChange={(e) => onUpdate('credits', parseValue(e.target.value))}
                placeholder="0"
                className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold focus:ring-1 focus:ring-gold transition-colors bg-card"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card: Debt Financing */}
      <div className="rounded-sm border border-border overflow-hidden transition-all duration-200" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <button
          onClick={() => showDebt ? setShowDebt(false) : handleDebtToggle(true)}
          className="w-full py-3 px-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Building className="w-4 h-4 text-gold" />
            <div className="text-left">
              <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
                DEBT FINANCING
              </h3>
              {!showDebt && getDebtSummary() && (
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{getDebtSummary()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveModal('debtService'); }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
            </button>
            <Switch
              checked={showDebt}
              onCheckedChange={handleDebtToggle}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-gold"
            />
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showDebt ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`transition-all duration-300 ease-out overflow-hidden ${showDebt ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-5 bg-background border-t border-border space-y-5">
            <div>
              <div className="mb-2">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">SENIOR LOAN AMOUNT</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">First-position, secured against pre-sales</p>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.debt)}
                  onChange={(e) => onUpdate('debt', parseValue(e.target.value))}
                  placeholder="0"
                  className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            <div>
              <div className="mb-2">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">INTEREST RATE + FEES</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Typically 8-12% all-in</p>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.seniorDebtRate)}
                  onChange={(e) => onUpdate('seniorDebtRate', parseValue(e.target.value, true))}
                  placeholder="10"
                  className="pl-4 pr-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card"
                  onFocus={(e) => e.target.select()}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
              </div>
            </div>

            {/* Gap Loan Sub-Section */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between min-h-[44px] mb-4">
                <div>
                  <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">GAP / BRIDGE LOAN</span>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">Higher-risk, subordinate debt</p>
                </div>
                <Switch
                  checked={showGapLoan}
                  onCheckedChange={handleGapToggle}
                  className="data-[state=checked]:bg-gold"
                />
              </div>

              <div className={`transition-all duration-300 ease-out overflow-hidden ${showGapLoan ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-5 pl-4 border-l-2 border-gold/30">
                  <div>
                    <div className="mb-2">
                      <span className="text-xs tracking-wider uppercase font-semibold text-foreground">LOAN AMOUNT</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatValue(inputs.mezzanineDebt)}
                        onChange={(e) => onUpdate('mezzanineDebt', parseValue(e.target.value))}
                        placeholder="0"
                        className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card"
                        onFocus={(e) => e.target.select()}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-2">
                      <span className="text-xs tracking-wider uppercase font-semibold text-foreground">INTEREST RATE + FEES</span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Typically 15-25% all-in</p>
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={formatValue(inputs.mezzanineRate)}
                        onChange={(e) => onUpdate('mezzanineRate', parseValue(e.target.value, true))}
                        placeholder="18"
                        className="pl-4 pr-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card"
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
      </div>

      {/* Card: Investor Equity */}
      <div className="rounded-sm border border-border overflow-hidden transition-all duration-200" style={{ borderLeft: '3px solid hsl(var(--gold))' }}>
        <button
          onClick={() => showEquity ? setShowEquity(false) : handleEquityToggle(true)}
          className="w-full py-3 px-4 flex items-center justify-between bg-card hover:bg-card/80 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-gold" />
            <div className="text-left">
              <h3 className="font-bebas text-sm tracking-widest uppercase text-gold">
                INVESTOR EQUITY
              </h3>
              {!showEquity && getEquitySummary() && (
                <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{getEquitySummary()}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setActiveModal('investorEquity'); }}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
            >
              <Info className="w-4 h-4 text-muted-foreground hover:text-gold transition-colors" />
            </button>
            <Switch
              checked={showEquity}
              onCheckedChange={handleEquityToggle}
              onClick={(e) => e.stopPropagation()}
              className="data-[state=checked]:bg-gold"
            />
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showEquity ? 'rotate-180' : ''}`} />
          </div>
        </button>

        <div className={`transition-all duration-300 ease-out overflow-hidden ${showEquity ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="p-5 bg-background border-t border-border space-y-5">
            <div>
              <div className="mb-2">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">NET EQUITY NEEDED</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Budget - Tax Credits - Debt = Equity</p>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.equity)}
                  onChange={(e) => onUpdate('equity', parseValue(e.target.value))}
                  placeholder="0"
                  className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>

            <div>
              <div className="mb-2">
                <span className="text-xs tracking-wider uppercase font-semibold text-foreground">PREFERRED RETURN</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">Hurdle rate before profit split. Typically 15-20%</p>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.premium)}
                  onChange={(e) => onUpdate('premium', parseValue(e.target.value, true))}
                  placeholder="20"
                  className="pl-4 pr-10 h-14 text-xl font-mono text-foreground text-right rounded-sm border-border focus:border-gold bg-card"
                  onFocus={(e) => e.target.select()}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {Object.entries(modals).map(([key, modal]) => (
        <Dialog key={key} open={activeModal === key} onOpenChange={(open) => !open && setActiveModal(null)}>
          <DialogContent className="rounded-sm border-border max-w-md bg-card">
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
