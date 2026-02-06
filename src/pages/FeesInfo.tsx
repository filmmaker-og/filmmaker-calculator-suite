import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from "@/components/Header";
import { colors, radius } from "@/lib/design-system";
import { WikiSectionHeader, WikiCard, WikiCallout } from "@/components/shared";

/* ═══════════════════════════════════════════════════════════════════════════
   MINI WIKI: DISTRIBUTION FEES
   Deep-dive on fees that come off the top before anyone gets paid.

   WIKI CONTAINMENT: This mini wiki can ONLY link back to /intro
   Secondary exit: Subtle "Start Simulation" text link at bottom
   ═══════════════════════════════════════════════════════════════════════════ */

const tokens = {
  bgVoid: colors.void,
  bgSurface: colors.surface,
  gold: colors.gold,
  goldMuted: colors.goldMuted,
  goldSubtle: colors.goldSubtle,
  borderSubtle: colors.borderSubtle,
  textPrimary: colors.textPrimary,
  textMid: colors.textMid,
  textDim: colors.textDim,
  radiusMd: radius.md,
  radiusLg: radius.lg,
};

const FeesInfo = () => {
  const navigate = useNavigate();

  const handleBackToOverview = () => {
    navigate('/intro');
    window.scrollTo(0, 0);
  };

  const handleStartSimulation = () => {
    navigate('/calculator?tab=deal');
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
              Distribution <span style={{ color: tokens.gold }}>Fees</span>
            </h1>

            <p
              className="text-base leading-relaxed max-w-lg"
              style={{ color: tokens.textMid }}
            >
              The money that comes off the top before your waterfall even begins.
            </p>

            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldMuted} 40%, transparent 80%)`
              }}
            />
          </div>

          {/* SECTION: WHY FEES MATTER */}
          <WikiCard>
            <WikiSectionHeader number="01" title="Why Fees Matter" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                When a streamer or buyer acquires your film for $2 million, that $2 million
                doesn't flow directly into your waterfall. <strong style={{ color: tokens.textPrimary }}>
                Distribution fees come off the top first</strong>—before senior debt, before
                equity recoupment, before anyone in your Operating Agreement sees a cent.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                These fees aren't optional. They're contractual obligations to the entities
                who sold, delivered, and collected on your film. Understanding them is
                critical because they directly reduce what's available for your waterfall.
              </p>

              <WikiCallout label="Reality Check">
                On a $2M acquisition, fees can easily total 20-30%. That means $400K-$600K
                comes off before anyone in your waterfall gets paid.
              </WikiCallout>
            </div>
          </WikiCard>

          {/* SECTION: SALES AGENT FEE */}
          <WikiCard>
            <WikiSectionHeader number="02" title="Sales Agent Fee" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                The <strong style={{ color: tokens.textPrimary }}>sales agent</strong> represents
                your film to international buyers and domestic distributors. They attend markets
                (Cannes, AFM, Berlin), pitch to acquisitions executives, negotiate deals, and
                sometimes advance marketing costs.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Sales agent fees typically range from <strong style={{ color: tokens.textPrimary }}>
                10-20%</strong> of gross revenues, depending on:
              </p>

              <ul className="text-sm space-y-2 pl-4" style={{ color: tokens.textMid }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Territory</strong> —
                  domestic sales often command lower percentages than international</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Budget level</strong> —
                  larger films may negotiate better rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Cast/director</strong> —
                  star-driven packages may warrant lower fees</span>
                </li>
              </ul>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Some sales agents also charge <strong style={{ color: tokens.textPrimary }}>
                market fees</strong> for attending festivals and markets, plus <strong style={{ color: tokens.textPrimary }}>
                recoupable expenses</strong> for marketing materials, screeners, and travel.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: COLLECTION AGENT FEE */}
          <WikiCard>
            <WikiSectionHeader number="03" title="Collection Agent Fee" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                The <strong style={{ color: tokens.textPrimary }}>collection agent</strong> (also
                called a collection account manager or CAM) is a neutral third party who receives
                all revenues, applies the waterfall, and distributes payments to the correct parties.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Collection agent fees typically range from <strong style={{ color: tokens.textPrimary }}>
                1-5%</strong> of gross revenues. Common CAMs include Fintage House, Freeway, and
                Film Finances. While the percentage seems small, it comes off before anything else.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Why use a collection agent? They provide:
              </p>

              <ul className="text-sm space-y-2 pl-4" style={{ color: tokens.textMid }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Investor confidence</strong> —
                  a neutral party ensures the waterfall is followed correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Audit trail</strong> —
                  detailed accounting for every dollar that flows through</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Lender requirement</strong> —
                  most senior lenders require a CAM before funding</span>
                </li>
              </ul>
            </div>
          </WikiCard>

          {/* SECTION: DELIVERY COSTS */}
          <WikiCard>
            <WikiSectionHeader number="04" title="Delivery Costs" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                When a buyer acquires your film, they don't just want the movie—they want a
                complete <strong style={{ color: tokens.textPrimary }}>delivery package</strong>.
                This includes specific technical masters, audio mixes, subtitles, closed captions,
                artwork, and legal documentation.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Delivery costs vary significantly but can range from $25,000 to $150,000+ depending
                on the buyer's requirements. Streamers like Netflix have particularly detailed
                technical specifications.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                In most deals, delivery costs are <strong style={{ color: tokens.textPrimary }}>
                recoupable</strong>—meaning they come off the top of your revenues, just like
                distribution fees. Make sure your budget includes a realistic delivery allowance.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: THE REAL MATH */}
          <WikiCard>
            <WikiSectionHeader number="05" title="The Real Math" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Here's what happens to a $2,000,000 acquisition before it reaches your waterfall:
              </p>

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
                  <span>Gross Acquisition</span>
                  <span style={{ color: tokens.textPrimary }}>$2,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Agent (15%)</span>
                  <span style={{ color: tokens.goldMuted }}>− $300,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Agent (3%)</span>
                  <span style={{ color: tokens.goldMuted }}>− $60,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Expenses</span>
                  <span style={{ color: tokens.goldMuted }}>− $40,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Costs</span>
                  <span style={{ color: tokens.goldMuted }}>− $75,000</span>
                </div>
                <div
                  className="pt-2 mt-2 flex justify-between font-semibold"
                  style={{ borderTop: `1px solid ${tokens.borderSubtle}` }}
                >
                  <span style={{ color: tokens.gold }}>Net to Waterfall</span>
                  <span style={{ color: tokens.gold }}>$1,525,000</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                That's nearly <strong style={{ color: tokens.textPrimary }}>24% gone</strong> before
                your senior debt, equity investors, or profit participants see anything. And this
                is just one territory—international sales may have additional layers of fees.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: NEGOTIATING FEES */}
          <WikiCard>
            <WikiSectionHeader number="06" title="Negotiating Fees" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                While fees are standard in the industry, they're not set in stone. Producers
                with leverage (strong packages, track records, or competing offers) can negotiate:
              </p>

              <ul className="text-sm space-y-2 pl-4" style={{ color: tokens.textMid }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Caps on recoupable expenses</strong> —
                  limit how much a sales agent can charge back</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Sliding scale percentages</strong> —
                  lower rates as revenues increase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Sunset clauses</strong> —
                  fees that reduce or expire after a certain period</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Territory carve-outs</strong> —
                  excluding territories where you have direct relationships</span>
                </li>
              </ul>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Always have an entertainment attorney review your sales representation and
                collection agreements before signing. Small percentage differences can translate
                to significant dollar amounts.
              </p>
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

export default FeesInfo;
