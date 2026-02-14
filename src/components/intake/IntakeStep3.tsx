import { ArrowRight, ArrowLeft, Plus, X, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  PRIORITY_OPTIONS,
  SECURITY_TYPE_OPTIONS,
  SOFT_MONEY_TYPE_OPTIONS,
  DEFERMENT_ROLE_OPTIONS,
  DEFERMENT_TRIGGER_OPTIONS,
  type IntakeFormData,
  type EquityInvestor,
  type DebtTranche,
  type SoftMoney,
  type Deferment,
} from "@/lib/intake-types";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

/* ─── helpers ─── */
const fmt = (v: number | null): string =>
  v === null || v === 0 ? "" : v.toLocaleString("en-US");
const parse$ = (s: string): number | null => {
  const n = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? null : n;
};
const fmtPct = (n: number) => `${n}%`;

const Tooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-flex ml-1.5">
    <Info className="w-3.5 h-3.5 text-text-dim/60 cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-[#1A1A1A] border border-white/10 text-text-mid text-[11px] leading-relaxed opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
      {text}
    </div>
  </div>
);

const DefaultBadge = ({ show }: { show: boolean }) =>
  show ? (
    <span className="ml-2 px-1.5 py-0.5 text-[8px] tracking-[0.1em] uppercase font-bold text-text-dim/50 border border-white/10 rounded">
      Industry Default
    </span>
  ) : null;

const CurrencyInput = ({
  value,
  onChange,
  placeholder = "0",
}: {
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder?: string;
}) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim font-mono text-sm">
      $
    </span>
    <input
      type="text"
      inputMode="numeric"
      value={fmt(value)}
      onChange={(e) => onChange(parse$(e.target.value))}
      placeholder={placeholder}
      className="w-full h-11 pl-7 pr-3 rounded-md bg-bg-elevated border border-border-subtle text-text-primary font-mono text-sm focus:outline-none focus:border-gold/50"
    />
  </div>
);

const PercentInput = ({
  value,
  onChange,
  isDefault,
  onEdit,
}: {
  value: number;
  onChange: (v: number) => void;
  isDefault: boolean;
  onEdit: () => void;
}) => (
  <div className="relative">
    <input
      type="number"
      step="0.1"
      value={value}
      onChange={(e) => {
        onChange(parseFloat(e.target.value) || 0);
        onEdit();
      }}
      className="w-full h-11 px-3 pr-8 rounded-md bg-bg-elevated border border-border-subtle text-text-primary font-mono text-sm focus:outline-none focus:border-gold/50"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim text-sm">
      %
    </span>
  </div>
);

const SelectField = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-11 px-3 rounded-md bg-bg-elevated border border-border-subtle text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold/50"
  >
    <option value="" disabled>
      {placeholder}
    </option>
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

/* ─── Section ─── */
const CollapsibleSection = ({
  title,
  description,
  children,
  defaultOpen = true,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div>
          <h3 className="font-bebas text-lg tracking-[0.06em] text-white">
            {title}
          </h3>
          <p className="text-text-dim text-[11px] leading-relaxed mt-1">
            {description}
          </p>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-text-dim flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-dim flex-shrink-0" />
        )}
      </button>
      {open && <div className="px-5 pb-5 space-y-4">{children}</div>}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   STEP 3 MAIN
   ═══════════════════════════════════════════════════════════════════ */
const IntakeStep3 = ({ formData, updateFormData, onNext, onBack }: Props) => {
  const budget = formData.total_budget || 0;

  // Helpers for updating nested arrays
  const updateInvestor = (idx: number, patch: Partial<EquityInvestor>) => {
    const next = formData.equity_investors.map((inv, i) =>
      i === idx ? { ...inv, ...patch } : inv
    );
    updateFormData({ equity_investors: next });
  };

  const addInvestor = () => {
    if (formData.equity_investors.length >= 5) return;
    updateFormData({
      equity_investors: [
        ...formData.equity_investors,
        {
          label: `Equity Investor ${formData.equity_investors.length + 1}`,
          amount: null,
          priority: "first_position",
          preferred_return_pct: 120,
          profit_participation_pct: 50,
          is_default: true,
        },
      ],
    });
  };

  const removeInvestor = (idx: number) => {
    if (formData.equity_investors.length <= 1) return;
    updateFormData({
      equity_investors: formData.equity_investors.filter((_, i) => i !== idx),
    });
  };

  const updateDebt = (idx: number, patch: Partial<DebtTranche>) => {
    const next = formData.debt_tranches.map((d, i) =>
      i === idx ? { ...d, ...patch } : d
    );
    updateFormData({ debt_tranches: next });
  };

  const addDebt = () => {
    if (formData.debt_tranches.length >= 3) return;
    updateFormData({
      debt_tranches: [
        ...formData.debt_tranches,
        {
          label: `Debt Tranche ${formData.debt_tranches.length + 1}`,
          principal: null,
          interest_rate_pct: 10,
          security_type: "",
          priority: "first_position",
          is_default: true,
        },
      ],
    });
  };

  const removeDebt = (idx: number) => {
    if (formData.debt_tranches.length <= 1) return;
    updateFormData({
      debt_tranches: formData.debt_tranches.filter((_, i) => i !== idx),
    });
  };

  const updateSoftMoney = (idx: number, patch: Partial<SoftMoney>) => {
    const next = formData.soft_money.map((s, i) =>
      i === idx ? { ...s, ...patch } : s
    );
    updateFormData({ soft_money: next });
  };

  const addSoftMoney = () => {
    if (formData.soft_money.length >= 5) return;
    updateFormData({
      soft_money: [
        ...formData.soft_money,
        {
          label: `Source ${formData.soft_money.length + 1}`,
          type: "",
          amount: null,
          is_default: true,
        },
      ],
    });
  };

  const removeSoftMoney = (idx: number) => {
    if (formData.soft_money.length <= 1) return;
    updateFormData({
      soft_money: formData.soft_money.filter((_, i) => i !== idx),
    });
  };

  const updateDeferment = (idx: number, patch: Partial<Deferment>) => {
    const next = formData.deferments.map((d, i) =>
      i === idx ? { ...d, ...patch } : d
    );
    updateFormData({ deferments: next });
  };

  const addDeferment = () => {
    if (formData.deferments.length >= 5) return;
    updateFormData({
      deferments: [
        ...formData.deferments,
        {
          role: "",
          amount: null,
          triggers_at: "after_equity_recoupment",
          is_default: true,
        },
      ],
    });
  };

  const removeDeferment = (idx: number) => {
    if (formData.deferments.length <= 1) return;
    updateFormData({
      deferments: formData.deferments.filter((_, i) => i !== idx),
    });
  };

  // Capital stack summary
  const totalEquity = formData.equity_investors.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const totalDebt = formData.has_debt
    ? formData.debt_tranches.reduce((sum, d) => sum + (d.principal || 0), 0)
    : 0;
  const totalSoftMoney = formData.soft_money.reduce(
    (sum, s) => sum + (s.amount || 0),
    0
  );
  const totalDeferments = formData.has_deferments
    ? formData.deferments.reduce((sum, d) => sum + (d.amount || 0), 0)
    : 0;
  const totalCovered = totalEquity + totalDebt + totalSoftMoney + totalDeferments;
  const gap = budget - totalCovered;
  const gapPct = budget > 0 ? (gap / budget) * 100 : 0;
  const pctOf = (n: number) =>
    budget > 0 ? `${Math.round((n / budget) * 100)}%` : "—";

  const getGapStatus = () => {
    if (budget === 0) return null;
    if (totalCovered > budget * 1.05)
      return {
        color: "text-yellow-500/80",
        text: `Your funding sources exceed your budget by $${(totalCovered - budget).toLocaleString()}. This may be intentional (contingency buffer) or an error.`,
      };
    if (totalCovered < budget * 0.8)
      return {
        color: "text-yellow-500/80",
        text: `Your capital stack covers ${Math.round((totalCovered / budget) * 100)}% of your budget. You'll need additional funding sources to close the gap.`,
      };
    if (Math.abs(gap) <= budget * 0.05)
      return {
        color: "text-green-400/80",
        text: "Your capital stack is fully funded.",
      };
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-bebas text-2xl tracking-[0.06em] text-white mb-2">
          HOW ARE YOU FINANCING THIS FILM?
        </h2>
        <p className="text-text-dim text-sm leading-relaxed">
          Build your capital stack — the combination of funding sources that add
          up to your budget. We've started with a common structure. Adjust to
          match your plan, or accept the defaults if you're still figuring it
          out.
        </p>
      </div>

      {/* 3A: EQUITY */}
      <CollapsibleSection
        title="EQUITY INVESTMENT"
        description="Private investors who put in cash and receive a share of profits. They sit behind any debt in the recoupment waterfall — higher risk, higher potential return."
      >
        {formData.equity_investors.map((inv, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <Input
                value={inv.label}
                onChange={(e) =>
                  updateInvestor(idx, { label: e.target.value })
                }
                className="bg-transparent border-none text-white font-semibold text-sm p-0 h-auto focus-visible:ring-0"
              />
              {formData.equity_investors.length > 1 && (
                <button
                  onClick={() => removeInvestor(idx)}
                  className="text-text-dim hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                  Amount <span className="text-gold">*</span>
                </label>
                <CurrencyInput
                  value={inv.amount}
                  onChange={(v) => updateInvestor(idx, { amount: v })}
                />
              </div>
              <div>
                <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                  Priority Position
                </label>
                <SelectField
                  value={inv.priority}
                  onChange={(v) => updateInvestor(idx, { priority: v })}
                  options={PRIORITY_OPTIONS}
                />
              </div>
              <div>
                <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                  Preferred Return
                  <Tooltip text="Industry standard: 120% (investor gets back 100% of principal + 20% premium before profit split). Range: 110%–130%." />
                  <DefaultBadge show={inv.is_default} />
                </label>
                <PercentInput
                  value={inv.preferred_return_pct}
                  onChange={(v) =>
                    updateInvestor(idx, { preferred_return_pct: v })
                  }
                  isDefault={inv.is_default}
                  onEdit={() => updateInvestor(idx, { is_default: false })}
                />
              </div>
              <div>
                <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                  Profit Participation
                  <Tooltip text="Industry standard: 50/50 split of net profits between investor pool and producer pool after recoupment. Range: 40%–60%." />
                  <DefaultBadge show={inv.is_default} />
                </label>
                <PercentInput
                  value={inv.profit_participation_pct}
                  onChange={(v) =>
                    updateInvestor(idx, { profit_participation_pct: v })
                  }
                  isDefault={inv.is_default}
                  onEdit={() => updateInvestor(idx, { is_default: false })}
                />
              </div>
            </div>
          </div>
        ))}

        {formData.equity_investors.length < 5 && (
          <button
            onClick={addInvestor}
            className="flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Investor
          </button>
        )}

        <div className="text-sm font-mono">
          <span className="text-text-dim">Total Equity: </span>
          <span className="text-white">
            ${totalEquity.toLocaleString()}
          </span>
          {budget > 0 && (
            <span
              className={cn(
                "ml-2",
                totalEquity / budget >= 0.3 && totalEquity / budget <= 0.7
                  ? "text-green-400/80"
                  : "text-yellow-500/80"
              )}
            >
              ({pctOf(totalEquity)} of budget)
            </span>
          )}
        </div>
      </CollapsibleSection>

      {/* 3B: DEBT */}
      <CollapsibleSection
        title="DEBT FINANCING"
        description="Loans that get repaid with interest before equity investors see returns. Lower cost of capital, but requires collateral (presales, tax credits, completion bond)."
        defaultOpen={formData.has_debt}
      >
        <div className="flex items-center gap-3 mb-2">
          <label className="text-text-mid text-sm">
            Does your plan include debt financing?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => updateFormData({ has_debt: true })}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold tracking-wider uppercase transition-all",
                formData.has_debt
                  ? "bg-gold/20 border border-gold/50 text-gold"
                  : "bg-bg-elevated border border-border-subtle text-text-dim"
              )}
            >
              Yes
            </button>
            <button
              onClick={() => updateFormData({ has_debt: false })}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold tracking-wider uppercase transition-all",
                !formData.has_debt
                  ? "bg-gold/20 border border-gold/50 text-gold"
                  : "bg-bg-elevated border border-border-subtle text-text-dim"
              )}
            >
              No
            </button>
          </div>
        </div>

        {formData.has_debt && (
          <>
            {formData.debt_tranches.map((tranche, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Input
                    value={tranche.label}
                    onChange={(e) =>
                      updateDebt(idx, { label: e.target.value })
                    }
                    className="bg-transparent border-none text-white font-semibold text-sm p-0 h-auto focus-visible:ring-0"
                  />
                  {formData.debt_tranches.length > 1 && (
                    <button
                      onClick={() => removeDebt(idx)}
                      className="text-text-dim hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                      Principal <span className="text-gold">*</span>
                    </label>
                    <CurrencyInput
                      value={tranche.principal}
                      onChange={(v) => updateDebt(idx, { principal: v })}
                    />
                  </div>
                  <div>
                    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                      Interest Rate
                      <Tooltip text="Industry standard for senior debt secured by tax credits or presales: 8%–12%. Gap/mezzanine debt: 12%–20%." />
                      <DefaultBadge show={tranche.is_default} />
                    </label>
                    <PercentInput
                      value={tranche.interest_rate_pct}
                      onChange={(v) =>
                        updateDebt(idx, { interest_rate_pct: v })
                      }
                      isDefault={tranche.is_default}
                      onEdit={() => updateDebt(idx, { is_default: false })}
                    />
                  </div>
                  <div>
                    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                      Security Type
                    </label>
                    <SelectField
                      value={tranche.security_type}
                      onChange={(v) =>
                        updateDebt(idx, { security_type: v })
                      }
                      options={SECURITY_TYPE_OPTIONS}
                      placeholder="Select security type"
                    />
                  </div>
                  <div>
                    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                      Priority
                    </label>
                    <SelectField
                      value={tranche.priority}
                      onChange={(v) => updateDebt(idx, { priority: v })}
                      options={PRIORITY_OPTIONS.slice(0, 2)}
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.debt_tranches.length < 3 && (
              <button
                onClick={addDebt}
                className="flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Debt Tranche
              </button>
            )}
          </>
        )}
      </CollapsibleSection>

      {/* 3C: SOFT MONEY */}
      <CollapsibleSection
        title="TAX CREDITS & SOFT MONEY"
        description="Government incentives, grants, and rebates that reduce your cash requirement. In 2025, most viable independent films have 20-40% of their budget covered by soft money."
      >
        {formData.soft_money.map((source, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <Input
                value={source.label}
                onChange={(e) =>
                  updateSoftMoney(idx, { label: e.target.value })
                }
                className="bg-transparent border-none text-white font-semibold text-sm p-0 h-auto focus-visible:ring-0"
              />
              {formData.soft_money.length > 1 && (
                <button
                  onClick={() => removeSoftMoney(idx)}
                  className="text-text-dim hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                  Type
                </label>
                <SelectField
                  value={source.type}
                  onChange={(v) => updateSoftMoney(idx, { type: v })}
                  options={SOFT_MONEY_TYPE_OPTIONS}
                  placeholder="Select type"
                />
              </div>
              <div>
                <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                  Amount <span className="text-gold">*</span>
                </label>
                <CurrencyInput
                  value={source.amount}
                  onChange={(v) => updateSoftMoney(idx, { amount: v })}
                />
              </div>
            </div>
          </div>
        ))}
        {formData.soft_money.length < 5 && (
          <button
            onClick={addSoftMoney}
            className="flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Another Source
          </button>
        )}
        <p className="text-text-dim text-[11px] leading-relaxed">
          Tax credits typically cover 20-30% of qualified local expenditure. If
          you don't yet know your tax credit amount, estimate 25% of your budget
          as a starting point — your production accountant will refine this.
        </p>
      </CollapsibleSection>

      {/* 3D: DEFERMENTS */}
      <CollapsibleSection
        title="DEFERRED COMPENSATION"
        description="Key team members who accept reduced upfront pay in exchange for payment from the waterfall after investors are recouped. Deferments lower your cash basis — the core Artists Equity principle."
        defaultOpen={formData.has_deferments}
      >
        <div className="flex items-center gap-3 mb-2">
          <label className="text-text-mid text-sm">
            Does your plan include deferred compensation?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => updateFormData({ has_deferments: true })}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold tracking-wider uppercase transition-all",
                formData.has_deferments
                  ? "bg-gold/20 border border-gold/50 text-gold"
                  : "bg-bg-elevated border border-border-subtle text-text-dim"
              )}
            >
              Yes
            </button>
            <button
              onClick={() => updateFormData({ has_deferments: false })}
              className={cn(
                "px-3 py-1 rounded text-xs font-bold tracking-wider uppercase transition-all",
                !formData.has_deferments
                  ? "bg-gold/20 border border-gold/50 text-gold"
                  : "bg-bg-elevated border border-border-subtle text-text-dim"
              )}
            >
              No
            </button>
          </div>
        </div>

        {formData.has_deferments && (
          <>
            {formData.deferments.map((def, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-bg-elevated border border-border-subtle space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm">
                    Deferment {idx + 1}
                  </span>
                  {formData.deferments.length > 1 && (
                    <button
                      onClick={() => removeDeferment(idx)}
                      className="text-text-dim hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                      Role
                    </label>
                    <SelectField
                      value={def.role}
                      onChange={(v) => updateDeferment(idx, { role: v })}
                      options={DEFERMENT_ROLE_OPTIONS}
                      placeholder="Select role"
                    />
                  </div>
                  <div>
                    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                      Amount Deferred <span className="text-gold">*</span>
                    </label>
                    <CurrencyInput
                      value={def.amount}
                      onChange={(v) => updateDeferment(idx, { amount: v })}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                      Triggers At
                      <DefaultBadge show={def.is_default} />
                    </label>
                    <SelectField
                      value={def.triggers_at}
                      onChange={(v) => {
                        updateDeferment(idx, {
                          triggers_at: v,
                          is_default: false,
                        });
                      }}
                      options={DEFERMENT_TRIGGER_OPTIONS}
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.deferments.length < 5 && (
              <button
                onClick={addDeferment}
                className="flex items-center gap-2 text-gold text-sm font-semibold hover:text-gold/80 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Deferment
              </button>
            )}
          </>
        )}
      </CollapsibleSection>

      {/* CAPITAL STACK SUMMARY */}
      <div className="rounded-xl border border-gold/20 bg-gold/[0.03] p-5">
        <h3 className="font-bebas text-lg tracking-[0.06em] text-gold mb-4">
          YOUR CAPITAL STACK
        </h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between text-text-dim">
            <span>Total Budget:</span>
            <span className="text-white">${budget.toLocaleString()}</span>
          </div>
          <div className="h-px bg-white/10 my-2" />
          {totalEquity > 0 && (
            <div className="flex justify-between">
              <span className="text-text-dim">Equity:</span>
              <span className="text-white">
                ${totalEquity.toLocaleString()}{" "}
                <span className="text-text-dim text-xs">{pctOf(totalEquity)}</span>
              </span>
            </div>
          )}
          {totalSoftMoney > 0 && (
            <div className="flex justify-between">
              <span className="text-text-dim">Tax Credits / Soft Money:</span>
              <span className="text-white">
                ${totalSoftMoney.toLocaleString()}{" "}
                <span className="text-text-dim text-xs">{pctOf(totalSoftMoney)}</span>
              </span>
            </div>
          )}
          {totalDebt > 0 && (
            <div className="flex justify-between">
              <span className="text-text-dim">Debt:</span>
              <span className="text-white">
                ${totalDebt.toLocaleString()}{" "}
                <span className="text-text-dim text-xs">{pctOf(totalDebt)}</span>
              </span>
            </div>
          )}
          {totalDeferments > 0 && (
            <div className="flex justify-between">
              <span className="text-text-dim">Deferments:</span>
              <span className="text-white">
                ${totalDeferments.toLocaleString()}{" "}
                <span className="text-text-dim text-xs">{pctOf(totalDeferments)}</span>
              </span>
            </div>
          )}
          <div className="h-px bg-white/10 my-2" />
          <div className="flex justify-between">
            <span className="text-text-dim">Total Covered:</span>
            <span className="text-white">
              ${totalCovered.toLocaleString()}{" "}
              <span className="text-text-dim text-xs">
                {budget > 0
                  ? `${Math.round((totalCovered / budget) * 100)}%`
                  : "—"}
              </span>
            </span>
          </div>
          {budget > 0 && (
            <div className="flex justify-between">
              <span className="text-text-dim">Gap:</span>
              <span
                className={cn(
                  gap <= 0 ? "text-green-400/80" : "text-yellow-500/80"
                )}
              >
                ${Math.abs(gap).toLocaleString()}{" "}
                <span className="text-xs">
                  {Math.abs(Math.round(gapPct))}%
                </span>
              </span>
            </div>
          )}
        </div>
        {getGapStatus() && (
          <p
            className={cn(
              "text-xs mt-3 leading-relaxed",
              getGapStatus()!.color
            )}
          >
            {getGapStatus()!.text}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-dim text-sm hover:text-text-mid transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className={cn(
            "flex items-center gap-2 h-14 px-8 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96]",
            "bg-gold/[0.22] border-2 border-gold/60 text-gold text-sm",
            "hover:border-gold/80 hover:bg-gold/[0.28]"
          )}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IntakeStep3;
