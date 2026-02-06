import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Header from "@/components/Header";

/* ═══════════════════════════════════════════════════════════════════════════
   MINI WIKI: PRODUCTION BUDGET
   Full educational deep-dive on budget ranges, composition, and pitfalls.

   WIKI CONTAINMENT: This mini wiki can ONLY link back to /intro
   Secondary exit: Subtle "Start Simulation" text link at bottom
   ═══════════════════════════════════════════════════════════════════════════ */
// Sourced from design-system.ts (aligned to index.css)
import { colors, radius } from "@/lib/design-system";
import { WikiSectionHeader, WikiCard, WikiCallout } from "@/components/shared";

const tokens = {
  bgVoid: colors.void,
  bgMatte: colors.card,
  bgHeader: colors.elevated,
  bgSurface: colors.surface,
  gold: colors.gold,
  goldMuted: colors.goldMuted,
  goldSubtle: colors.goldSubtle,
  goldGlow: colors.goldGlow,
  borderMatte: colors.borderSubtle,
  borderSubtle: colors.borderSubtle,
  textPrimary: colors.textPrimary,
  textMid: colors.textMid,
  textDim: colors.textDim,
  radiusMd: radius.md,
  radiusLg: radius.lg,
};

/* ═══════════════════════════════════════════════════════════════════════════
   GOLD INTENSITY TIERS — Budget tier accent colors
   Full gold -> muted gold -> subtle gold (replacing green/yellow/red)
   ═══════════════════════════════════════════════════════════════════════════ */
const tierAccents = {
  low: '#FFD700',                // 100% gold
  mid: 'rgba(255, 215, 0, 0.6)', // 60% gold
  high: 'rgba(255, 215, 0, 0.3)', // 30% gold
};

/* ═══════════════════════════════════════════════════════════════════════════
   BUDGET TIER CARD — Visual benchmarks for budget ranges
   ═══════════════════════════════════════════════════════════════════════════ */
interface BudgetTierCardProps {
  tier: string;
  range: string;
  description: string;
  accentColor: string;
}

const BudgetTierCard = ({ tier, range, description, accentColor }: BudgetTierCardProps) => (
  <div
    className="p-4 flex-1"
    style={{
      background: tokens.bgSurface,
      borderRadius: tokens.radiusMd,
      borderTop: `3px solid ${accentColor}`,
    }}
  >
    <span
      className="font-bebas text-xs tracking-wide uppercase"
      style={{ color: accentColor }}
    >
      {tier}
    </span>
    <p
      className="text-lg font-bold text-white mt-1 mb-2"
      style={{ fontFamily: 'Roboto Mono, monospace' }}
    >
      {range}
    </p>
    <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
      {description}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   BUDGET COMPONENT CARD — Category breakdowns
   ═══════════════════════════════════════════════════════════════════════════ */
interface BudgetComponentProps {
  category: string;
  percentage: string;
  items: string[];
}

const BudgetComponent = ({ category, percentage, items }: BudgetComponentProps) => (
  <div
    className="p-4"
    style={{
      background: tokens.bgSurface,
      borderRadius: tokens.radiusMd,
      borderLeft: `2px solid ${tokens.goldMuted}`,
    }}
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-semibold text-white">{category}</span>
      <span
        className="text-xs font-mono px-2 py-1 rounded"
        style={{
          background: tokens.goldSubtle,
          color: tokens.gold,
        }}
      >
        {percentage}
      </span>
    </div>
    <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
      {items.join(' · ')}
    </p>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   MISTAKE CARD — Common pitfalls with gold warning styling
   ═══════════════════════════════════════════════════════════════════════════ */
interface MistakeCardProps {
  title: string;
  description: string;
}

const MistakeCard = ({ title, description }: MistakeCardProps) => (
  <div
    className="p-4 flex gap-3"
    style={{
      background: tokens.goldSubtle,
      borderRadius: tokens.radiusMd,
      border: `1px solid ${tokens.goldMuted}`,
    }}
  >
    <AlertTriangle
      className="w-5 h-5 flex-shrink-0 mt-0.5"
      style={{ color: tokens.gold }}
    />
    <div>
      <p className="text-sm font-semibold text-white mb-1">{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
        {description}
      </p>
    </div>
  </div>
);

const BudgetInfo = () => {
  const navigate = useNavigate();

  const handleBackToOverview = () => {
    navigate('/intro');
    window.scrollTo(0, 0);
  };

  const handleStartSimulation = () => {
    navigate('/calculator?tab=budget');
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

          {/* ═══════════════════════════════════════════════════════════════
              PAGE HEADER — Matches CapitalInfo/FeesInfo style
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-4 pt-6 animate-fade-in">
            {/* Back to Overview — ONLY navigation link allowed */}
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
              Production <span style={{ color: tokens.gold }}>Budget</span>
            </h1>

            <p
              className="text-base leading-relaxed max-w-lg"
              style={{ color: tokens.textMid }}
            >
              Your budget isn't just a number—it's the foundation of your entire deal structure.
              Everything flows from here: capital requirements, investor returns, and your ultimate profit position.
            </p>

            {/* Gold Gradient Divider */}
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldMuted} 40%, transparent 80%)`
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 01 — BUDGET RANGE BENCHMARKS
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="01" title="Budget Range Benchmarks" />

            <div className="p-5 space-y-5">
              <p
                className="text-sm leading-relaxed"
                style={{ color: tokens.textMid }}
              >
                Independent films operate across a wide spectrum. Where you land determines
                your financing options, crew expectations, and realistic sales projections.
              </p>

              {/* Three-tier budget cards — gold intensity variations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BudgetTierCard
                  tier="Micro/Low"
                  range="$100K – $1M"
                  description="Lean crews, deferred pay, limited locations. Often self-financed or angel-backed. Streamers pay $250K–$800K."
                  accentColor={tierAccents.low}
                />

                <BudgetTierCard
                  tier="Mid-Budget"
                  range="$1M – $5M"
                  description="Union or hybrid crews, modest talent attachments. Typical equity + gap financing. Sales potential $1M–$3M."
                  accentColor={tierAccents.mid}
                />

                <BudgetTierCard
                  tier="Elevated Indie"
                  range="$5M – $15M"
                  description="Name cast required, full union, complex financing. Presales often mandatory. Territory-by-territory deals common."
                  accentColor={tierAccents.high}
                />
              </div>

              <WikiCallout label="Rule of Thumb">
                Your realistic acquisition price is typically 0.8x – 1.5x your production budget
                for first-time filmmakers. Established track records can push this to 2x–3x.
              </WikiCallout>
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 02 — BUDGET COMPOSITION
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="02" title="Budget Composition" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                A professional budget breaks into predictable categories. Understanding these
                helps you identify where costs can flex—and where they can't.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <BudgetComponent
                  category="Above-the-Line"
                  percentage="20-35%"
                  items={['Writer', 'Director', 'Producers', 'Lead Cast']}
                />

                <BudgetComponent
                  category="Below-the-Line"
                  percentage="45-60%"
                  items={['Crew', 'Equipment', 'Locations', 'Art/Wardrobe']}
                />

                <BudgetComponent
                  category="Post-Production"
                  percentage="10-15%"
                  items={['Edit', 'VFX', 'Sound Mix', 'Color/DCP']}
                />

                <BudgetComponent
                  category="Contingency + Insurance"
                  percentage="10-12%"
                  items={['Overages', 'E&O', 'Production Insurance', 'Bonds']}
                />
              </div>

              <p className="text-xs leading-relaxed pt-2" style={{ color: tokens.textDim }}>
                These percentages shift based on genre and approach. VFX-heavy films push post
                to 25%+. Star-driven projects can see ATL exceed 40%.
              </p>
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 03 — COMMON MISTAKES
              ═══════════════════════════════════════════════════════════════ */}
          <WikiCard>
            <WikiSectionHeader number="03" title="Common Mistakes" />

            <div className="p-5 space-y-3">
              <MistakeCard
                title="Underestimating Post"
                description="First-time producers routinely budget 5% for post and discover they need 15%. Sound design and color alone can exceed expectations by 2x."
              />

              <MistakeCard
                title="No Contingency Buffer"
                description="Things go wrong. Weather, talent issues, equipment failures. A 10% contingency isn't padding—it's survival. Investors expect to see it."
              />

              <MistakeCard
                title="Ignoring Delivery Requirements"
                description="Distributors require specific deliverables: M&E tracks, DCP, closed captions, marketing materials. Budget $30K–$75K for delivery alone."
              />
            </div>
          </WikiCard>

          {/* ═══════════════════════════════════════════════════════════════
              FOOTER — Back to Overview + subtle Start Simulation link
              ═══════════════════════════════════════════════════════════════ */}
          <div className="pt-6 flex flex-col items-center gap-4 animate-fade-in">
            {/* Gold Gradient Divider */}
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

export default BudgetInfo;
