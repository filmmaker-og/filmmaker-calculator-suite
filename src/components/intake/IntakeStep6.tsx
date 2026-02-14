import { useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GENRE_OPTIONS,
  PRIORITY_OPTIONS,
  SECURITY_TYPE_OPTIONS,
  SOFT_MONEY_TYPE_OPTIONS,
  DEFERMENT_ROLE_OPTIONS,
  DEFERMENT_TRIGGER_OPTIONS,
  PLATFORM_OPTIONS,
  DEAL_TYPE_OPTIONS,
  type IntakeFormData,
} from "@/lib/intake-types";

interface Props {
  formData: IntakeFormData;
  tier: string;
  includesWorkingModel: boolean;
  email: string;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
}

const fmt$ = (v: number | null) =>
  v ? `$${v.toLocaleString("en-US")}` : "—";

const getLabel = (
  value: string,
  options: { value: string; label: string }[]
) => options.find((o) => o.value === value)?.label || value || "—";

const SummaryCard = ({
  title,
  stepNum,
  onEdit,
  children,
}: {
  title: string;
  stepNum: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
    <div className="flex items-center justify-between p-5 pb-0">
      <h3 className="font-bebas text-lg tracking-[0.06em] text-gold">
        {title}
      </h3>
      <button
        onClick={() => onEdit(stepNum)}
        className="flex items-center gap-1.5 text-text-dim text-[11px] hover:text-gold transition-colors"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>
    </div>
    <div className="p-5 space-y-2 text-sm">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-text-dim">{label}</span>
    <span className="text-text-primary text-right max-w-[60%]">{value}</span>
  </div>
);

const IntakeStep6 = ({
  formData,
  tier,
  includesWorkingModel,
  email,
  onEdit,
  onSubmit,
  onBack,
}: Props) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit();
    setSubmitting(false);
  };

  const tierLabel =
    tier === "the-pitch-package" ? "The Pitch Package" : "The Blueprint";

  // Collect defaults
  const defaults: { field: string; value: string; range: string }[] = [];
  formData.equity_investors.forEach((inv) => {
    if (inv.is_default) {
      defaults.push({
        field: `${inv.label} — Preferred Return`,
        value: `${inv.preferred_return_pct}%`,
        range: "110%–130%",
      });
      defaults.push({
        field: `${inv.label} — Profit Participation`,
        value: `${inv.profit_participation_pct}%`,
        range: "40%–60%",
      });
    }
  });
  if (formData.has_debt) {
    formData.debt_tranches.forEach((d) => {
      if (d.is_default) {
        defaults.push({
          field: `${d.label} — Interest Rate`,
          value: `${d.interest_rate_pct}%`,
          range: "8%–20%",
        });
      }
    });
  }
  if (formData.distribution_model === "sales_agent") {
    if (formData.sa_domestic_commission_is_default)
      defaults.push({
        field: "Domestic Sales Commission",
        value: `${formData.sa_domestic_commission_pct}%`,
        range: "10%–15%",
      });
    if (formData.sa_international_commission_is_default)
      defaults.push({
        field: "International Sales Commission",
        value: `${formData.sa_international_commission_pct}%`,
        range: "20%–25%",
      });
    if (formData.sa_expense_cap_is_default)
      defaults.push({
        field: "Sales Agent Expense Cap",
        value: fmt$(formData.sa_expense_cap),
        range: "$35K–$100K",
      });
    if (formData.distribution_fee_domestic_is_default)
      defaults.push({
        field: "Distribution Fee (Domestic)",
        value: `${formData.distribution_fee_domestic_pct}%`,
        range: "20%–35%",
      });
    if (formData.distribution_fee_international_is_default)
      defaults.push({
        field: "Distribution Fee (International)",
        value: `${formData.distribution_fee_international_pct}%`,
        range: "30%–40%",
      });
  }
  if (formData.cam_fee_is_default)
    defaults.push({
      field: "CAM Fee",
      value: `${formData.cam_fee_pct}%`,
      range: "0.5%–1%",
    });

  // Capital stack summary
  const totalEquity = formData.equity_investors.reduce(
    (s, i) => s + (i.amount || 0),
    0
  );
  const totalDebt = formData.has_debt
    ? formData.debt_tranches.reduce((s, d) => s + (d.principal || 0), 0)
    : 0;
  const totalSoftMoney = formData.soft_money.reduce(
    (s, m) => s + (m.amount || 0),
    0
  );
  const totalDeferments = formData.has_deferments
    ? formData.deferments.reduce((s, d) => s + (d.amount || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-bebas text-2xl tracking-[0.06em] text-white mb-2">
          REVIEW YOUR FINANCE PLAN
        </h2>
        <p className="text-text-dim text-sm leading-relaxed">
          Here's everything you entered. Review each section — click "Edit" to
          jump back to any step. When you're satisfied, submit and we'll
          generate your deliverables within 24 hours.
        </p>
      </div>

      {/* PROJECT */}
      <SummaryCard title="PROJECT" stepNum={1} onEdit={onEdit}>
        <Row label="Title" value={formData.project_title || "—"} />
        <Row label="Company" value={formData.production_company || "—"} />
        <Row label="Genre" value={formData.genre || "—"} />
        <Row label="Logline" value={formData.logline || "Not provided"} />
      </SummaryCard>

      {/* BUDGET */}
      <SummaryCard title="BUDGET" stepNum={2} onEdit={onEdit}>
        <Row
          label="Total Production Budget"
          value={fmt$(formData.total_budget)}
        />
      </SummaryCard>

      {/* CAPITAL STACK */}
      <SummaryCard title="CAPITAL STACK" stepNum={3} onEdit={onEdit}>
        {formData.equity_investors.map((inv, i) => (
          <Row
            key={i}
            label={inv.label}
            value={`${fmt$(inv.amount)} — ${inv.preferred_return_pct}% pref, ${inv.profit_participation_pct}% profit`}
          />
        ))}
        {totalEquity > 0 && (
          <Row label="Total Equity" value={fmt$(totalEquity)} />
        )}
        {formData.has_debt &&
          formData.debt_tranches.map((d, i) => (
            <Row
              key={i}
              label={d.label}
              value={`${fmt$(d.principal)} — ${d.interest_rate_pct}%`}
            />
          ))}
        {totalDebt > 0 && <Row label="Total Debt" value={fmt$(totalDebt)} />}
        {formData.soft_money.map((s, i) => (
          <Row
            key={i}
            label={s.label}
            value={fmt$(s.amount)}
          />
        ))}
        {totalSoftMoney > 0 && (
          <Row label="Total Soft Money" value={fmt$(totalSoftMoney)} />
        )}
        {formData.has_deferments &&
          formData.deferments.map((d, i) => (
            <Row
              key={i}
              label={getLabel(d.role, DEFERMENT_ROLE_OPTIONS)}
              value={`${fmt$(d.amount)} — ${getLabel(d.triggers_at, DEFERMENT_TRIGGER_OPTIONS)}`}
            />
          ))}
        {totalDeferments > 0 && (
          <Row label="Total Deferments" value={fmt$(totalDeferments)} />
        )}
      </SummaryCard>

      {/* DEAL STRUCTURE */}
      <SummaryCard title="DEAL STRUCTURE" stepNum={4} onEdit={onEdit}>
        <Row
          label="Model"
          value={
            formData.distribution_model === "sales_agent"
              ? "Sales Agent"
              : formData.distribution_model === "direct_platform"
                ? "Direct Platform"
                : "—"
          }
        />
        {formData.distribution_model === "sales_agent" && (
          <>
            <Row
              label="Domestic Commission"
              value={`${formData.sa_domestic_commission_pct}%`}
            />
            <Row
              label="International Commission"
              value={`${formData.sa_international_commission_pct}%`}
            />
            <Row
              label="Expense Cap"
              value={fmt$(formData.sa_expense_cap)}
            />
            <Row
              label="Distribution Fee (Dom)"
              value={`${formData.distribution_fee_domestic_pct}%`}
            />
            <Row
              label="Distribution Fee (Intl)"
              value={`${formData.distribution_fee_international_pct}%`}
            />
          </>
        )}
        {formData.distribution_model === "direct_platform" && (
          <>
            <Row
              label="Target Platform"
              value={getLabel(
                formData.dp_target_platform,
                PLATFORM_OPTIONS
              )}
            />
            <Row
              label="Deal Type"
              value={getLabel(formData.dp_deal_type, DEAL_TYPE_OPTIONS)}
            />
          </>
        )}
        <Row label="CAM Fee" value={`${formData.cam_fee_pct}%`} />
      </SummaryCard>

      {/* SCENARIOS */}
      <SummaryCard title="SCENARIOS" stepNum={5} onEdit={onEdit}>
        <Row
          label="Conservative"
          value={fmt$(formData.scenario_conservative)}
        />
        <Row label="Target" value={fmt$(formData.scenario_target)} />
        <Row
          label="Optimistic"
          value={fmt$(formData.scenario_optimistic)}
        />
      </SummaryCard>

      {/* DEFAULTS DISCLOSURE */}
      {defaults.length > 0 && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] p-5">
          <p className="text-text-mid text-[11px] leading-relaxed mb-3">
            The following assumptions use industry standard values. Your attorney
            should review these before you present to investors:
          </p>
          <div className="space-y-1.5">
            {defaults.map((d, i) => (
              <div
                key={i}
                className="flex justify-between text-[11px] font-mono"
              >
                <span className="text-text-dim">{d.field}</span>
                <span className="text-text-primary">
                  {d.value}{" "}
                  <span className="text-text-dim/50">(range: {d.range})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* YOUR PACKAGE */}
      <div className="rounded-xl border border-gold/20 bg-gold/[0.04] p-5">
        <h3 className="font-bebas text-lg tracking-[0.06em] text-gold mb-3">
          YOUR PACKAGE
        </h3>
        <div className="space-y-1.5 text-sm">
          <p className="text-text-primary">
            {tierLabel} —{" "}
            {tier === "the-pitch-package"
              ? "Full Investor Materials"
              : "Finance Plan PDF"}
          </p>
          {tier === "the-blueprint" && (
            <ul className="text-text-dim text-xs space-y-1 pl-4">
              <li>Finance Plan Summary PDF</li>
              <li>Capital Stack Breakdown</li>
              <li>Scenario Comparison Sheet</li>
              <li>Assumptions Reference</li>
            </ul>
          )}
          {tier === "the-pitch-package" && (
            <ul className="text-text-dim text-xs space-y-1 pl-4">
              <li>Everything in The Blueprint</li>
              <li>Individual Investor Return Profiles</li>
              <li>Pitch Deck (PowerPoint)</li>
              <li>One-Page Executive Summary</li>
              <li>Deal Terms Summary</li>
            </ul>
          )}
          {includesWorkingModel && (
            <p className="text-gold text-xs mt-2">
              + The Working Model — Live Excel Engine
            </p>
          )}
        </div>
      </div>

      {/* DELIVERY TIMELINE */}
      <div className="p-4 rounded-xl bg-bg-elevated border border-border-subtle">
        <p className="text-text-mid text-sm leading-relaxed">
          Your deliverables will be ready within 24 hours. We'll email you at{" "}
          <span className="text-white font-semibold">{email}</span> when
          they're ready for download.
        </p>
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
          onClick={handleSubmit}
          disabled={submitting}
          className={cn(
            "h-14 px-10 rounded-md font-bold tracking-[0.12em] uppercase transition-all active:scale-[0.96]",
            "bg-gold/[0.22] border-2 border-gold/60 text-gold text-base",
            "animate-cta-glow-soft hover:border-gold/80 hover:bg-gold/[0.28]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {submitting ? "SUBMITTING..." : "SUBMIT YOUR FINANCE PLAN"}
        </button>
      </div>
    </div>
  );
};

export default IntakeStep6;
