import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { WaterfallInputs, GuildState, formatCompactCurrency } from "@/lib/waterfall";
import { Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useHaptics } from "@/hooks/use-haptics";

interface InputSheetProps {
  inputs: WaterfallInputs;
  guilds: GuildState;
  onUpdateInput: (key: keyof WaterfallInputs, value: number) => void;
  onToggleGuild: (guild: keyof GuildState) => void;
}

const InputSheet = ({ inputs, guilds, onUpdateInput, onToggleGuild }: InputSheetProps) => {
  const haptics = useHaptics();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Toggle states for optional sections
  const [showTaxCredits, setShowTaxCredits] = useState(inputs.credits > 0);
  const [showGapLoan, setShowGapLoan] = useState(inputs.mezzanineDebt > 0);

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === 0) return '';
    return value.toLocaleString();
  };

  const parseValue = (str: string, isPercent: boolean = false) => {
    const value = parseInt(str.replace(/[^0-9]/g, '')) || 0;
    return isPercent ? Math.min(value, 100) : value;
  };

  // Calculate totals for inline feedback
  const totalCapital = inputs.credits + inputs.debt + inputs.mezzanineDebt + inputs.equity;
  const netPosition = inputs.revenue - inputs.budget;

  // Off-the-top calculation
  const guildPct = (guilds.sag ? 0.045 : 0) + (guilds.wga ? 0.012 : 0) + (guilds.dga ? 0.012 : 0);
  const offTheTopTotal = (inputs.revenue * (inputs.salesFee / 100)) + (inputs.revenue * 0.01) + (inputs.revenue * guildPct) + inputs.salesExp;

  const modals: Record<string, { title: string; content: React.ReactNode }> = {
    budget: {
      title: "NEGATIVE COST",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>The total capital required to produce the master and deliver to distributors. Includes all Above-the-Line and Below-the-Line expenses. Excludes marketing, sales fees, and financing costs.</p>
        </div>
      )
    },
    revenue: {
      title: "ACQUISITION PRICE",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>In a Cost-Plus buyout (Netflix/Amazon/Apple), the streamer purchases 100% of the copyright for a fixed price. This is your "Gross Receipts" — the single pot from which all debts and equity are repaid.</p>
        </div>
      )
    },
    taxCredits: {
      title: "TAX INCENTIVES",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>Non-recourse funds from government programs. These reduce the net capital required from investors.</p>
          <p className="text-xs text-muted-foreground/70">Examples: UK (25%), Georgia (20-30%), New Mexico (25-35%)</p>
        </div>
      )
    },
    debt: {
      title: "DEBT FINANCING",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p><strong className="text-foreground">Senior Loan:</strong> First-position debt secured against pre-sales. Paid back first in the waterfall.</p>
          <p><strong className="text-foreground">Gap Loan:</strong> Higher-risk debt to bridge the financing gap. Subordinate to senior debt but ahead of equity.</p>
        </div>
      )
    },
    equity: {
      title: "INVESTOR EQUITY",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p><strong className="text-foreground">Net Equity:</strong> Cash investment after tax credits and debt.</p>
          <p><strong className="text-foreground">Preferred Return:</strong> The hurdle rate investors must receive before profits split. Typically 15-20%.</p>
        </div>
      )
    },
    distribution: {
      title: "DISTRIBUTION COSTS",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p><strong className="text-foreground">Sales Agent Fee:</strong> Commission for securing distribution. Typically 10-20% of gross.</p>
          <p><strong className="text-foreground">Marketing Cap:</strong> Hard cap on expenses (festivals, markets, deliverables).</p>
        </div>
      )
    },
    guilds: {
      title: "GUILD RESIDUALS",
      content: (
        <div className="space-y-4 text-muted-foreground text-sm leading-relaxed">
          <p>Residuals are reuse-based payments under SAG-AFTRA/WGA/DGA agreements. Toggle ON only if your production is the signatory.</p>
          <p className="text-xs text-muted-foreground/70">In many streamer buyouts, the buyer assumes this obligation.</p>
        </div>
      )
    }
  };

  return (
    <div className="space-y-8 pb-4">

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: THE DEAL
          ═══════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="font-bebas text-sm tracking-[0.3em] text-muted-foreground">THE DEAL</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-4">
          {/* Budget */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-wider uppercase font-semibold text-foreground">
                Production Budget
              </label>
              <button
                onClick={() => setActiveModal('budget')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.budget)}
                onChange={(e) => onUpdateInput('budget', parseValue(e.target.value))}
                placeholder="2,000,000"
                className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold focus:ring-0 bg-card"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Revenue */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-wider uppercase font-semibold text-foreground">
                Acquisition Price
              </label>
              <button
                onClick={() => setActiveModal('revenue')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.revenue)}
                onChange={(e) => onUpdateInput('revenue', parseValue(e.target.value))}
                placeholder="3,500,000"
                className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold focus:ring-0 bg-card"
                onFocus={(e) => e.target.select()}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Netflix/Amazon typically pay 100-120% of budget</p>
          </div>

          {/* Net Position Indicator */}
          {inputs.budget > 0 && inputs.revenue > 0 && (
            <div className="flex items-center justify-between py-3 px-4 bg-card border border-border">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Net Position</span>
              <span className={`font-mono text-sm font-semibold ${netPosition >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {netPosition >= 0 ? '+' : ''}{formatCompactCurrency(netPosition)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: CAPITAL STACK
          ═══════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="font-bebas text-sm tracking-[0.3em] text-muted-foreground">CAPITAL STACK</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-4">
          {/* Tax Credits Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-card border border-border">
            <div className="flex items-center gap-3">
              <span className="text-xs tracking-wider uppercase font-semibold text-foreground">Tax Credits</span>
              <button
                onClick={() => setActiveModal('taxCredits')}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
            <Switch
              checked={showTaxCredits}
              onCheckedChange={(checked) => {
                haptics.light();
                setShowTaxCredits(checked);
                if (!checked) onUpdateInput('credits', 0);
              }}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          {showTaxCredits && (
            <div className="space-y-2 pl-4 border-l-2 border-gold/30">
              <label className="text-[10px] tracking-wider uppercase text-muted-foreground">Credit Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatValue(inputs.credits)}
                  onChange={(e) => onUpdateInput('credits', parseValue(e.target.value))}
                  placeholder="400,000"
                  className="pl-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            </div>
          )}

          {/* Senior Debt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-wider uppercase font-semibold text-foreground">Senior Debt</label>
              <button
                onClick={() => setActiveModal('debt')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.debt)}
                onChange={(e) => onUpdateInput('debt', parseValue(e.target.value))}
                placeholder="600,000"
                className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Senior Rate */}
          <div className="space-y-2 pl-4 border-l-2 border-border">
            <label className="text-[10px] tracking-wider uppercase text-muted-foreground">Interest + Fees</label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.seniorDebtRate)}
                onChange={(e) => onUpdateInput('seniorDebtRate', parseValue(e.target.value, true))}
                placeholder="10"
                className="pr-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                onFocus={(e) => e.target.select()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Typically 8-12% all-in</p>
          </div>

          {/* Gap Loan Toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-card border border-border">
            <span className="text-xs tracking-wider uppercase font-semibold text-foreground">Gap / Bridge Loan</span>
            <Switch
              checked={showGapLoan}
              onCheckedChange={(checked) => {
                haptics.light();
                setShowGapLoan(checked);
                if (!checked) {
                  onUpdateInput('mezzanineDebt', 0);
                  onUpdateInput('mezzanineRate', 0);
                }
              }}
              className="data-[state=checked]:bg-gold"
            />
          </div>

          {showGapLoan && (
            <div className="space-y-4 pl-4 border-l-2 border-gold/30">
              <div className="space-y-2">
                <label className="text-[10px] tracking-wider uppercase text-muted-foreground">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatValue(inputs.mezzanineDebt)}
                    onChange={(e) => onUpdateInput('mezzanineDebt', parseValue(e.target.value))}
                    placeholder="200,000"
                    className="pl-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] tracking-wider uppercase text-muted-foreground">Interest + Fees</label>
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    value={formatValue(inputs.mezzanineRate)}
                    onChange={(e) => onUpdateInput('mezzanineRate', parseValue(e.target.value, true))}
                    placeholder="18"
                    className="pr-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                    onFocus={(e) => e.target.select()}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
                </div>
                <p className="text-[10px] text-muted-foreground">Typically 15-25% all-in</p>
              </div>
            </div>
          )}

          {/* Equity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-wider uppercase font-semibold text-foreground">Equity Investment</label>
              <button
                onClick={() => setActiveModal('equity')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.equity)}
                onChange={(e) => onUpdateInput('equity', parseValue(e.target.value))}
                placeholder="1,000,000"
                className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>

          {/* Preferred Return */}
          <div className="space-y-2 pl-4 border-l-2 border-border">
            <label className="text-[10px] tracking-wider uppercase text-muted-foreground">Preferred Return</label>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.premium)}
                onChange={(e) => onUpdateInput('premium', parseValue(e.target.value, true))}
                placeholder="20"
                className="pr-10 h-12 text-lg font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                onFocus={(e) => e.target.select()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Hurdle rate before profit split. Typically 15-20%</p>
          </div>

          {/* Total Capital Indicator */}
          {totalCapital > 0 && (
            <div className="flex items-center justify-between py-3 px-4 bg-card border border-border">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Capital</span>
              <span className="font-mono text-sm font-semibold text-foreground">
                {formatCompactCurrency(totalCapital)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: OFF-THE-TOP
          ═══════════════════════════════════════════════════════════════════ */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px flex-1 bg-border" />
          <h2 className="font-bebas text-sm tracking-[0.3em] text-muted-foreground">OFF-THE-TOP</h2>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-4">
          {/* Sales Agent Fee */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-wider uppercase font-semibold text-foreground">Sales Agent Fee</label>
              <button
                onClick={() => setActiveModal('distribution')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.salesFee)}
                onChange={(e) => onUpdateInput('salesFee', parseValue(e.target.value, true))}
                placeholder="15"
                className="pr-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                onFocus={(e) => e.target.select()}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Typically 10-15% domestic, 15-20% international</p>
          </div>

          {/* Marketing Cap */}
          <div className="space-y-2">
            <label className="text-xs tracking-wider uppercase font-semibold text-foreground">Marketing Cap</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">$</span>
              <Input
                type="text"
                inputMode="numeric"
                value={formatValue(inputs.salesExp)}
                onChange={(e) => onUpdateInput('salesExp', parseValue(e.target.value))}
                placeholder="75,000"
                className="pl-10 h-14 text-xl font-mono text-foreground text-right rounded-none border-border focus:border-gold bg-card"
                onFocus={(e) => e.target.select()}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Hard cap on sales expenses (festivals, markets)</p>
          </div>

          {/* Guilds */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs tracking-wider uppercase font-semibold text-foreground">Guild Residuals</label>
              <button
                onClick={() => setActiveModal('guilds')}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gold/10"
              >
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { haptics.light(); onToggleGuild('sag'); }}
                className={`py-3 px-2 border text-center transition-all ${
                  guilds.sag
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-card border-border text-muted-foreground hover:border-gold/50'
                }`}
              >
                <span className="text-xs font-semibold block">SAG</span>
                <span className="text-[10px] font-mono opacity-70">4.5%</span>
              </button>
              <button
                onClick={() => { haptics.light(); onToggleGuild('wga'); }}
                className={`py-3 px-2 border text-center transition-all ${
                  guilds.wga
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-card border-border text-muted-foreground hover:border-gold/50'
                }`}
              >
                <span className="text-xs font-semibold block">WGA</span>
                <span className="text-[10px] font-mono opacity-70">1.2%</span>
              </button>
              <button
                onClick={() => { haptics.light(); onToggleGuild('dga'); }}
                className={`py-3 px-2 border text-center transition-all ${
                  guilds.dga
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-card border-border text-muted-foreground hover:border-gold/50'
                }`}
              >
                <span className="text-xs font-semibold block">DGA</span>
                <span className="text-[10px] font-mono opacity-70">1.2%</span>
              </button>
            </div>
          </div>

          {/* Off-the-top Total */}
          {inputs.revenue > 0 && offTheTopTotal > 0 && (
            <div className="flex items-center justify-between py-3 px-4 bg-card border border-border">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Total Deductions</span>
                <span className="text-[9px] text-muted-foreground/60">CAM (1%) + Sales + Guilds + Marketing</span>
              </div>
              <span className="font-mono text-sm font-semibold text-foreground">
                {formatCompactCurrency(offTheTopTotal)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="border-border max-w-md bg-card rounded-none">
          <DialogHeader>
            <DialogTitle className="font-bebas text-xl tracking-wider text-gold">
              {activeModal && modals[activeModal]?.title}
            </DialogTitle>
          </DialogHeader>
          {activeModal && modals[activeModal]?.content}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InputSheet;
