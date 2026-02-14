import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PLATFORM_OPTIONS,
  DEAL_TYPE_OPTIONS,
  type IntakeFormData,
} from "@/lib/intake-types";

interface Props {
  formData: IntakeFormData;
  updateFormData: (updates: Partial<IntakeFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

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

const PercentField = ({
  label,
  value,
  onChange,
  isDefault,
  onEdit,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isDefault: boolean;
  onEdit: () => void;
  tooltip: string;
}) => (
  <div>
    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
      {label}
      <Tooltip text={tooltip} />
      <DefaultBadge show={isDefault} />
    </label>
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
  </div>
);

const CurrencyField = ({
  label,
  value,
  onChange,
  isDefault,
  onEdit,
  tooltip,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isDefault: boolean;
  onEdit: () => void;
  tooltip: string;
}) => (
  <div>
    <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
      {label}
      <Tooltip text={tooltip} />
      <DefaultBadge show={isDefault} />
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim font-mono text-sm">
        $
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={value ? value.toLocaleString("en-US") : ""}
        onChange={(e) => {
          const cleaned = e.target.value.replace(/[^0-9]/g, "");
          onChange(parseInt(cleaned, 10) || 0);
          onEdit();
        }}
        className="w-full h-11 pl-7 pr-3 rounded-md bg-bg-elevated border border-border-subtle text-text-primary font-mono text-sm focus:outline-none focus:border-gold/50"
      />
    </div>
  </div>
);

const IntakeStep4 = ({ formData, updateFormData, onNext, onBack }: Props) => {
  const canProceed = formData.distribution_model !== "";

  const selectedDealType = DEAL_TYPE_OPTIONS.find(
    (d) => d.value === formData.dp_deal_type
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-bebas text-2xl tracking-[0.06em] text-white mb-2">
          HOW DO YOU PLAN TO SELL THIS FILM?
        </h2>
        <p className="text-text-dim text-sm leading-relaxed">
          Your distribution strategy determines which fees are deducted from
          gross revenue before your investors see a dollar. This is where most
          producers underestimate the cost of getting paid.
        </p>
      </div>

      {/* Model Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => updateFormData({ distribution_model: "sales_agent" })}
          className={cn(
            "p-5 rounded-xl text-left transition-all",
            formData.distribution_model === "sales_agent"
              ? "border-2 border-gold bg-gold/[0.06]"
              : "border border-[#2A2A2A] bg-[#141414] hover:border-gold/30"
          )}
        >
          <h3 className="font-bebas text-lg tracking-[0.06em] text-white mb-2">
            SALES AGENT
          </h3>
          <p className="text-text-dim text-[11px] leading-relaxed mb-3">
            Territory-by-territory sales through an international agent
          </p>
          <p className="text-text-dim/60 text-[10px] leading-relaxed">
            Best for: Films with international appeal, festival strategy,
            presale potential
          </p>
        </button>

        <button
          onClick={() =>
            updateFormData({ distribution_model: "direct_platform" })
          }
          className={cn(
            "p-5 rounded-xl text-left transition-all",
            formData.distribution_model === "direct_platform"
              ? "border-2 border-gold bg-gold/[0.06]"
              : "border border-[#2A2A2A] bg-[#141414] hover:border-gold/30"
          )}
        >
          <h3 className="font-bebas text-lg tracking-[0.06em] text-white mb-2">
            DIRECT PLATFORM
          </h3>
          <p className="text-text-dim text-[11px] leading-relaxed mb-3">
            Single buyer acquires all or most rights directly
          </p>
          <p className="text-text-dim/60 text-[10px] leading-relaxed">
            Best for: Genre films with clear platform fit, cost-plus deals,
            negative pickups
          </p>
        </button>
      </div>

      {/* SALES AGENT FIELDS */}
      {formData.distribution_model === "sales_agent" && (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 space-y-4">
          <h3 className="font-bebas text-lg tracking-[0.06em] text-gold">
            SALES AGENT TERMS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PercentField
              label="Domestic Sales Commission"
              value={formData.sa_domestic_commission_pct}
              onChange={(v) =>
                updateFormData({ sa_domestic_commission_pct: v })
              }
              isDefault={formData.sa_domestic_commission_is_default}
              onEdit={() =>
                updateFormData({ sa_domestic_commission_is_default: false })
              }
              tooltip="Standard: 10%–15%. Domestic agents take a lower rate because the market is a single buyer (US theatrical + streaming)."
            />
            <PercentField
              label="International Sales Commission"
              value={formData.sa_international_commission_pct}
              onChange={(v) =>
                updateFormData({ sa_international_commission_pct: v })
              }
              isDefault={formData.sa_international_commission_is_default}
              onEdit={() =>
                updateFormData({
                  sa_international_commission_is_default: false,
                })
              }
              tooltip="Standard: 20%–25%. International agents sell territory by territory, justifying a higher commission for more complex work."
            />
            <CurrencyField
              label="Sales Agent Expense Cap"
              value={formData.sa_expense_cap}
              onChange={(v) => updateFormData({ sa_expense_cap: v })}
              isDefault={formData.sa_expense_cap_is_default}
              onEdit={() =>
                updateFormData({ sa_expense_cap_is_default: false })
              }
              tooltip="Standard: $35K–$100K. This caps what the agent can spend on markets, screenings, and deliverables before seeking your approval. ALWAYS negotiate a hard cap."
            />
            <PercentField
              label="CAM Fee"
              value={formData.cam_fee_pct}
              onChange={(v) => updateFormData({ cam_fee_pct: v })}
              isDefault={formData.cam_fee_is_default}
              onEdit={() => updateFormData({ cam_fee_is_default: false })}
              tooltip="Standard: 0.5%–1%. The Collection Account Manager receives gross receipts directly and distributes per the waterfall. Non-negotiable for budgets over $1M."
            />
            <PercentField
              label="Distribution Fee (Domestic)"
              value={formData.distribution_fee_domestic_pct}
              onChange={(v) =>
                updateFormData({ distribution_fee_domestic_pct: v })
              }
              isDefault={formData.distribution_fee_domestic_is_default}
              onEdit={() =>
                updateFormData({
                  distribution_fee_domestic_is_default: false,
                })
              }
              tooltip="Standard: 20%–35%. The distributor's commission on domestic revenues after the sales agent takes their cut."
            />
            <PercentField
              label="Distribution Fee (International)"
              value={formData.distribution_fee_international_pct}
              onChange={(v) =>
                updateFormData({ distribution_fee_international_pct: v })
              }
              isDefault={formData.distribution_fee_international_is_default}
              onEdit={() =>
                updateFormData({
                  distribution_fee_international_is_default: false,
                })
              }
              tooltip="Standard: 30%–40%. Higher than domestic due to complexity of international markets, dubbing, and localization."
            />
          </div>
        </div>
      )}

      {/* DIRECT PLATFORM FIELDS */}
      {formData.distribution_model === "direct_platform" && (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 space-y-4">
          <h3 className="font-bebas text-lg tracking-[0.06em] text-gold">
            PLATFORM DEAL TERMS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                Target Platform <span className="text-gold">*</span>
              </label>
              <select
                value={formData.dp_target_platform}
                onChange={(e) =>
                  updateFormData({ dp_target_platform: e.target.value })
                }
                className="w-full h-11 px-3 rounded-md bg-bg-elevated border border-border-subtle text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold/50"
              >
                <option value="" disabled>
                  Select platform
                </option>
                {PLATFORM_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-text-dim text-[9px] tracking-[0.12em] uppercase block mb-1">
                Deal Type <span className="text-gold">*</span>
              </label>
              <select
                value={formData.dp_deal_type}
                onChange={(e) =>
                  updateFormData({ dp_deal_type: e.target.value })
                }
                className="w-full h-11 px-3 rounded-md bg-bg-elevated border border-border-subtle text-text-primary text-sm appearance-none cursor-pointer focus:outline-none focus:border-gold/50"
              >
                <option value="" disabled>
                  Select deal type
                </option>
                {DEAL_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <PercentField
                label="CAM Fee"
                value={formData.cam_fee_pct}
                onChange={(v) => updateFormData({ cam_fee_pct: v })}
                isDefault={formData.cam_fee_is_default}
                onEdit={() => updateFormData({ cam_fee_is_default: false })}
                tooltip="Standard: 0.5%–1%. The Collection Account Manager receives gross receipts directly and distributes per the waterfall. Non-negotiable for budgets over $1M."
              />
            </div>
          </div>

          {/* Deal type explanation */}
          {selectedDealType && (
            <div className="p-4 rounded-lg bg-gold/[0.04] border border-gold/15">
              <p className="text-text-mid text-[11px] leading-relaxed">
                <span className="text-gold font-semibold">
                  {selectedDealType.label}:
                </span>{" "}
                {selectedDealType.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Teaching Copy */}
      {formData.distribution_model && (
        <div className="p-4 rounded-xl bg-gold/[0.04] border border-gold/15">
          <p className="text-text-mid text-[11px] leading-relaxed">
            Your distribution model is the single biggest variable in your
            waterfall. A sales agent adds 2-3 layers of fees before your
            investors see revenue. A direct platform sale eliminates those layers
            but may cap your total upside. Neither is universally better — the
            right choice depends on your film's market positioning and your risk
            tolerance.
          </p>
        </div>
      )}

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
          disabled={!canProceed}
          className={cn(
            "flex items-center gap-2 h-14 px-8 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96]",
            "bg-gold/[0.22] border-2 border-gold/60 text-gold text-sm",
            "hover:border-gold/80 hover:bg-gold/[0.28]",
            "disabled:opacity-30 disabled:cursor-not-allowed"
          )}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default IntakeStep4;
