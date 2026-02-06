import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplets, ChevronDown, Shield, Target, Calculator, FileCheck } from 'lucide-react';
import Header from "@/components/Header";
import { colors, radius } from "@/lib/design-system";
import { WikiSectionHeader, WikiCard, WikiCallout } from "@/components/shared";

/* ═══════════════════════════════════════════════════════════════════════════
   MINI WIKI: RECOUPMENT WATERFALL
   Deep-dive on how revenues are distributed in order of priority.

   WIKI CONTAINMENT: This mini wiki can ONLY link back to /intro
   Secondary exit: Subtle "Start Simulation" text link at bottom

   DESIGN: Notion meets premium app — each section has its OWN visual
   identity. No two sections use the same internal layout pattern.
   ═══════════════════════════════════════════════════════════════════════════ */
// Sourced from design-system.ts (aligned to index.css)
const tokens = {
  bgVoid: colors.void,
  bgSurface: colors.surface,
  gold: colors.gold,
  goldMuted: colors.goldMuted,
  goldSubtle: colors.goldSubtle,
  goldGlow: colors.goldGlow,
  borderSubtle: colors.borderSubtle,
  textPrimary: colors.textPrimary,
  textMid: colors.textMid,
  textDim: colors.textDim,
  radiusMd: radius.md,
  radiusLg: radius.lg,
};

/* ═══════════════════════════════════════════════════════════════════════════
   FLOW TIER — Vertical pipeline step for Section 02
   All accent colors are gold intensity variations (no rainbow).
   ═══════════════════════════════════════════════════════════════════════════ */
interface FlowTierProps {
  position: number;
  label: string;
  sublabel: string;
  accentColor: string;
  isLast?: boolean;
}

const FlowTier = ({ position, label, sublabel, accentColor, isLast }: FlowTierProps) => (
  <div className="flex gap-4">
    {/* Vertical connector line + node */}
    <div className="flex flex-col items-center" style={{ width: '32px' }}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={{
          background: `${accentColor}20`,
          border: `2px solid ${accentColor}`,
          color: accentColor,
        }}
      >
        {position}
      </div>
      {!isLast && (
        <div
          className="w-px flex-1 my-1"
          style={{ background: `linear-gradient(180deg, ${accentColor}60 0%, ${tokens.borderSubtle} 100%)` }}
        />
      )}
    </div>

    {/* Content */}
    <div className={`flex-1 ${isLast ? '' : 'pb-4'}`}>
      <p className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>{label}</p>
      <p className="text-xs mt-1 leading-relaxed" style={{ color: tokens.textDim }}>{sublabel}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   POSITION CARD — Gold-accented card for Section 03
   All cards use gold borderTop; risk labels use goldSubtle/goldMuted/gold.
   ═══════════════════════════════════════════════════════════════════════════ */
interface PositionCardProps {
  title: string;
  riskLabel: string;
  description: string;
}

const PositionCard = ({ title, riskLabel, description }: PositionCardProps) => (
  <div
    className="p-4 flex-1"
    style={{
      background: tokens.bgSurface,
      borderRadius: tokens.radiusMd,
      borderTop: `3px solid ${tokens.gold}`,
    }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-semibold" style={{ color: tokens.textPrimary }}>
        {title}
      </span>
      <span
        className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
        style={{
          background: tokens.goldSubtle,
          color: tokens.gold,
          border: `1px solid ${tokens.goldMuted}`,
        }}
      >
        {riskLabel}
      </span>
    </div>
    <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
      {description}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   SPLIT BAR — Visual proportional bar for Section 04
   Segments use gold at varying opacities (no rainbow).
   ═══════════════════════════════════════════════════════════════════════════ */
interface SplitSegment {
  label: string;
  percentage: number;
  color: string;
}

const SplitBar = ({ segments }: { segments: SplitSegment[] }) => (
  <div className="space-y-3">
    {/* The stacked bar */}
    <div
      className="flex overflow-hidden h-8"
      style={{ borderRadius: tokens.radiusMd }}
    >
      {segments.map((seg, i) => (
        <div
          key={i}
          className="flex items-center justify-center text-[10px] font-mono font-semibold"
          style={{
            width: `${seg.percentage}%`,
            background: seg.color,
            color: '#000',
            borderRight: i < segments.length - 1 ? '1px solid rgba(0,0,0,0.3)' : undefined,
          }}
        >
          {seg.percentage >= 10 ? `${seg.percentage}%` : ''}
        </div>
      ))}
    </div>

    {/* Legend */}
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {segments.map((seg, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: seg.color }}
          />
          <span className="text-[10px]" style={{ color: tokens.textDim }}>
            {seg.label} ({seg.percentage}%)
          </span>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   STRATEGY CARD — Icon-accented card for Section 06
   ═══════════════════════════════════════════════════════════════════════════ */
interface StrategyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StrategyCard = ({ icon, title, description }: StrategyCardProps) => (
  <div
    className="p-4 flex gap-3"
    style={{
      background: tokens.bgSurface,
      borderRadius: tokens.radiusMd,
      border: `1px solid ${tokens.borderSubtle}`,
    }}
  >
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{
        background: tokens.goldSubtle,
        border: `1px solid ${tokens.goldMuted}`,
      }}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold mb-1" style={{ color: tokens.textPrimary }}>{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>{description}</p>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */
const WaterfallInfo = () => {
  const navigate = useNavigate();

  const handleBackToOverview = () => {
    navigate('/intro');
    window.scrollTo(0, 0);
  };

  const handleStartSimulation = () => {
    navigate('/calculator?tab=waterfall');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header />

      <div
        className="min-h-screen text-white pt-16 pb-12 px-4 md:px-8 font-sans"
        style={{ background: tokens.bgVoid }}
      >
        <div className="max-w-2xl mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="space-y-4 pt-6 animate-fade-in">
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-2 text-sm transition-colors mb-4"
              style={{ color: tokens.textDim }}
              onMouseEnter={(e) => e.currentTarget.style.color = tokens.gold}
              onMouseLeave={(e) => e.currentTarget.style.color = tokens.textDim}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>

            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide leading-tight">
              Recoupment <span style={{ color: tokens.gold }}>Waterfall</span>
            </h1>

            <p
              className="text-base leading-relaxed max-w-lg"
              style={{ color: tokens.textMid }}
            >
              The contractual order that determines who gets paid—and when.
            </p>

            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldMuted} 40%, transparent 80%)`
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 01 — WHAT IS A WATERFALL?
              Layout: Definition callout aside + supporting context
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="01" title="What Is a Waterfall?" />

            <div className="p-5 space-y-4">
              {/* Key definition callout */}
              <WikiCallout
                label="Key Concept"
                icon={<Droplets className="w-5 h-5" style={{ color: tokens.gold }} />}
              >
                The <strong>recoupment waterfall</strong> is the contractual hierarchy that determines
                how revenues flow through a film deal. Like water flowing down a series of pools,
                money fills each "position" completely before spilling over to the next.
              </WikiCallout>

              {/* Supporting context — visually distinct from the callout */}
              <div
                className="pl-4 space-y-3"
                style={{ borderLeft: `2px solid ${tokens.borderSubtle}` }}
              >
                <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                  This isn't a metaphor—it's a legally binding document, typically defined in the
                  <strong style={{ color: tokens.textPrimary }}> Operating Agreement</strong> or
                  <strong style={{ color: tokens.textPrimary }}> Interparty Agreement</strong> that
                  governs your production. Every dollar of revenue follows this exact path.
                </p>

                <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                  Understanding your waterfall isn't optional—it's the only way to know whether
                  your "50% backend" actually means anything, or whether it triggers so late that
                  it's essentially worthless.
                </p>
              </div>
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 02 — TYPICAL WATERFALL ORDER
              Layout: Vertical connected pipeline with gold phase nodes
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="02" title="Typical Waterfall Order" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                While every deal is different, a typical indie film waterfall follows this order:
              </p>

              {/* Vertical pipeline flow */}
              <div
                className="p-4"
                style={{
                  background: tokens.bgSurface,
                  borderRadius: tokens.radiusMd,
                  border: `1px solid ${tokens.borderSubtle}`,
                }}
              >
                <FlowTier
                  position={1}
                  label="Distribution Fees"
                  sublabel="Sales agent, collection agent, market expenses"
                  accentColor={tokens.gold}
                />
                <FlowTier
                  position={2}
                  label="Delivery Costs"
                  sublabel="Technical masters, materials, recoupable expenses"
                  accentColor={tokens.goldMuted}
                />
                <FlowTier
                  position={3}
                  label="Senior Debt"
                  sublabel="Bank loans, tax credit advances (principal + interest)"
                  accentColor={tokens.gold}
                />
                <FlowTier
                  position={4}
                  label="Gap Financing"
                  sublabel="Gap loans (principal + interest + fees)"
                  accentColor={tokens.goldMuted}
                />
                <FlowTier
                  position={5}
                  label="Equity Recoupment"
                  sublabel="Investor principal + negotiated premium (10-25%)"
                  accentColor={tokens.gold}
                />
                <FlowTier
                  position={6}
                  label="Profit Participation"
                  sublabel="Producer backend, talent deferrals, investor backend"
                  accentColor={tokens.gold}
                  isLast
                />
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown className="w-3.5 h-3.5" style={{ color: tokens.goldMuted }} />
                <p className="text-xs" style={{ color: tokens.textDim }}>
                  Revenue flows top-to-bottom. Each tier fills completely before the next receives a dollar.
                </p>
              </div>
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 03 — RECOUPMENT POSITIONS
              Layout: Grid of gold-accented position cards
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="03" title="Recoupment Positions" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Your <strong style={{ color: tokens.textPrimary }}>recoupment position</strong> is
                where you sit in the waterfall. Earlier positions are safer but offer lower returns.
                Later positions take more risk but can be more lucrative if the film performs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PositionCard
                  title="First Dollar"
                  riskLabel="Lowest Risk"
                  description="The earliest position after fees. Safest for investors — you get paid before almost everyone else."
                />
                <PositionCard
                  title="Pari Passu"
                  riskLabel="Shared Risk"
                  description="Multiple parties sharing the same position proportionally. Common when two equity sources co-invest."
                />
                <PositionCard
                  title="Subordinated"
                  riskLabel="Higher Risk"
                  description="Only triggers after higher positions are fully satisfied. More upside potential, less certainty."
                />
                <PositionCard
                  title="Last Money In"
                  riskLabel="Negotiated"
                  description="Sometimes the final investor gets first recoupment as an incentive to close the financing gap."
                />
              </div>
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 04 — PROFIT CORRIDORS
              Layout: Visual split bar + monospace table
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="04" title="Profit Corridors" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                After everyone above the line recoups, the remaining money is
                <strong style={{ color: tokens.textPrimary }}> profit</strong>. But profit doesn't
                just pile up—it gets split according to the Operating Agreement.
              </p>

              {/* Visual proportional bar — gold opacity gradient */}
              <SplitBar
                segments={[
                  { label: 'Equity Investors', percentage: 50, color: tokens.gold },
                  { label: 'Producers', percentage: 25, color: 'rgba(255,215,0,0.7)' },
                  { label: 'Talent Deferrals', percentage: 15, color: 'rgba(255,215,0,0.5)' },
                  { label: 'Director', percentage: 5, color: 'rgba(255,215,0,0.3)' },
                  { label: 'Writer', percentage: 5, color: 'rgba(255,215,0,0.15)' },
                ]}
              />

              {/* Detailed table */}
              <div
                className="p-4 font-mono text-xs space-y-1"
                style={{
                  background: tokens.bgSurface,
                  borderRadius: tokens.radiusMd,
                  border: `1px solid ${tokens.borderSubtle}`,
                  color: tokens.textMid,
                }}
              >
                <div className="flex justify-between">
                  <span>Equity Investors (backend)</span>
                  <span style={{ color: tokens.textPrimary }}>50%</span>
                </div>
                <div className="flex justify-between">
                  <span>Producers (combined)</span>
                  <span style={{ color: tokens.textPrimary }}>25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Talent Deferrals</span>
                  <span style={{ color: tokens.textPrimary }}>15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Director</span>
                  <span style={{ color: tokens.textPrimary }}>5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Writer</span>
                  <span style={{ color: tokens.textPrimary }}>5%</span>
                </div>
                <div
                  className="pt-2 mt-2 flex justify-between font-semibold"
                  style={{ borderTop: `1px solid ${tokens.borderSubtle}` }}
                >
                  <span style={{ color: tokens.gold }}>Total</span>
                  <span style={{ color: tokens.gold }}>100%</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Some deals include <strong style={{ color: tokens.textPrimary }}>
                multiple profit corridors</strong>—for example, after equity recoups 110%,
                the split might shift to favor producers more heavily.
              </p>
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 05 — THE HARSH REALITY
              Layout: Step-down draindown ledger showing money disappearing
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="05" title="The Harsh Reality" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Here's what nobody tells you: on most independent films, the waterfall never
                reaches profit participation. Here's what a $1M film selling for $1.5M actually looks like:
              </p>

              {/* Draindown ledger — negative numbers use goldMuted instead of red */}
              <div
                className="p-4 font-mono text-xs space-y-1"
                style={{
                  background: tokens.bgSurface,
                  borderRadius: tokens.radiusMd,
                  border: `1px solid ${tokens.borderSubtle}`,
                  color: tokens.textMid,
                }}
              >
                <div className="flex justify-between">
                  <span>Gross Revenue</span>
                  <span style={{ color: tokens.textPrimary }}>$1,500,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Distribution Fees (20%)</span>
                  <span style={{ color: tokens.goldMuted }}>− $300,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Costs</span>
                  <span style={{ color: tokens.goldMuted }}>− $50,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Capital Recoupment</span>
                  <span style={{ color: tokens.goldMuted }}>− $1,000,000</span>
                </div>
                <div
                  className="pt-2 mt-2 flex justify-between font-semibold"
                  style={{ borderTop: `1px solid ${tokens.borderSubtle}` }}
                >
                  <span style={{ color: tokens.gold }}>Remaining for Profit</span>
                  <span style={{ color: tokens.gold }}>$150,000</span>
                </div>
              </div>

              {/* Visual progress: how much survives — already gold, kept as-is */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: tokens.textDim }}>Revenue survival rate</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: tokens.gold }}>10%</span>
                </div>
                <div
                  className="h-2 w-full overflow-hidden"
                  style={{
                    background: tokens.bgSurface,
                    borderRadius: '999px',
                    border: `1px solid ${tokens.borderSubtle}`,
                  }}
                >
                  <div
                    className="h-full"
                    style={{
                      width: '10%',
                      background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldMuted})`,
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
                  Only $150K reaches profit—and that still needs to be split among multiple parties.
                </p>
              </div>

              {/* "Bottom Line" warning — gold style instead of red */}
              <WikiCallout label="Bottom Line">
                A "generous" backend that triggers after $3M in prior positions might never pay out
                on a film that's realistic about its sales potential. Understand the math before you sign.
              </WikiCallout>
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 06 — PROTECTING YOURSELF
              Layout: 2x2 grid of icon-accented strategy cards
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="06" title="Protecting Yourself" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                As a producer, there are several ways to improve your position:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <StrategyCard
                  icon={<Shield className="w-4 h-4" style={{ color: tokens.gold }} />}
                  title="Negotiate a Producer Fee"
                  description="A fixed amount in the budget that you receive regardless of performance. This is your floor."
                />
                <StrategyCard
                  icon={<Target className="w-4 h-4" style={{ color: tokens.gold }} />}
                  title="First Position Corridor"
                  description="A small percentage that comes off before investor recoupment. Rare but powerful leverage."
                />
                <StrategyCard
                  icon={<Calculator className="w-4 h-4" style={{ color: tokens.gold }} />}
                  title="Run the Math"
                  description="Model your waterfall against realistic sales to see what you'll actually receive. No surprises."
                />
                <StrategyCard
                  icon={<FileCheck className="w-4 h-4" style={{ color: tokens.gold }} />}
                  title="Audit Rights"
                  description="Ensure you have the contractual right to audit the collection account. Trust, but verify."
                />
              </div>

              <WikiCallout label="Remember">
                Most importantly: have an entertainment attorney review your Operating Agreement
                before signing. The waterfall is where your deal is won or lost.
              </WikiCallout>
            </div>
          </WikiCard>

          {/* FOOTER — Back to Overview + subtle Start Simulation link */}
          <div className="pt-6 flex flex-col items-center gap-4 animate-fade-in">
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent 10%, ${tokens.goldMuted} 50%, transparent 90%)`
              }}
            />

            {/* Primary: Back to Overview */}
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: tokens.textDim }}
              onMouseEnter={(e) => e.currentTarget.style.color = tokens.gold}
              onMouseLeave={(e) => e.currentTarget.style.color = tokens.textDim}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>

            {/* Secondary: Subtle exit to calculator */}
            <button
              onClick={handleStartSimulation}
              className="text-xs transition-colors"
              style={{ color: tokens.textDim }}
              onMouseEnter={(e) => e.currentTarget.style.color = tokens.gold}
              onMouseLeave={(e) => e.currentTarget.style.color = tokens.textDim}
            >
              Ready to run the numbers? Start Simulation →
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default WaterfallInfo;
