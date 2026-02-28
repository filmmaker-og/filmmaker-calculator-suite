import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHaptics } from "@/hooks/use-haptics";

import { WikiSectionHeader, WikiCard, WikiCallout } from "@/components/shared";

/* ═══════════════════════════════════════════════════════════════════════════
   MINI WIKI: DISTRIBUTION FEES
   Deep-dive on fees that come off the top before anyone gets paid.

   WIKI CONTAINMENT: This mini wiki can ONLY link back to /
   Secondary exit: Subtle "Start Simulation" text link at bottom
   ═══════════════════════════════════════════════════════════════════════════ */

const FeesInfo = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();

  const handleBackToOverview = () => {
    haptics.light();
    navigate(-1);
    window.scrollTo(0, 0);
  };

  const handleStartSimulation = () => {
    haptics.medium();
    navigate('/calculator?tab=deal');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div
        className="min-h-screen text-white page-safe px-4 md:px-8 font-sans bg-black"
      >
        <div className="max-w-2xl mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="space-y-4 pt-6 animate-fade-in">
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-2 text-[14px] transition-colors mb-4 text-ink-secondary hover:text-ink-body"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>

            <h1 className="text-[40px] md:text-[40px] font-bebas tracking-wide leading-tight">
              Distribution <span className="text-gold">Fees</span>
            </h1>

            <p
              className="text-[16px] leading-relaxed max-w-lg text-ink-body"
            >
              The money that comes off the top before your waterfall even begins.
            </p>

            <div
              className="h-px w-full bg-gradient-to-r from-gold via-gold-muted/40 to-transparent"
            />
          </div>

          {/* SECTION: WHY FEES MATTER */}
          <WikiCard>
            <WikiSectionHeader number="01" title="Why Fees Matter" />

            <div className="p-5 space-y-4">
              <p className="text-[14px] leading-relaxed text-ink-body">
                When a streamer or buyer acquires your film for $2 million, that $2 million
                doesn't flow directly into your waterfall. <strong className="text-white">
                Distribution fees come off the top first</strong>—before senior debt, before
                equity recoupment, before anyone in your Operating Agreement sees a cent.
              </p>

              <p className="text-[14px] leading-relaxed text-ink-body">
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
              <p className="text-[14px] leading-relaxed text-ink-body">
                The <strong className="text-white">sales agent</strong> represents
                your film to international buyers and domestic distributors. They attend markets
                (Cannes, AFM, Berlin), pitch to acquisitions executives, negotiate deals, and
                sometimes advance marketing costs.
              </p>

              <p className="text-[14px] leading-relaxed text-ink-body">
                Sales agent fees typically range from <strong className="text-white">
                10-20%</strong> of gross revenues, depending on:
              </p>

              <ul className="text-[14px] space-y-2 pl-4 text-ink-body">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Territory</strong> —
                  domestic sales often command lower percentages than international</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Budget level</strong> —
                  larger films may negotiate better rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Cast/director</strong> —
                  star-driven packages may warrant lower fees</span>
                </li>
              </ul>

              <p className="text-[14px] leading-relaxed text-ink-body">
                Some sales agents also charge <strong className="text-white">
                market fees</strong> for attending festivals and markets, plus <strong className="text-white">
                recoupable expenses</strong> for marketing materials, screeners, and travel.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: COLLECTION AGENT FEE */}
          <WikiCard>
            <WikiSectionHeader number="03" title="Collection Agent Fee" />

            <div className="p-5 space-y-4">
              <p className="text-[14px] leading-relaxed text-ink-body">
                The <strong className="text-white">collection agent</strong> (also
                called a collection account manager or CAM) is a neutral third party who receives
                all revenues, applies the waterfall, and distributes payments to the correct parties.
              </p>

              <p className="text-[14px] leading-relaxed text-ink-body">
                Collection agent fees typically range from <strong className="text-white">
                1-5%</strong> of gross revenues. Common CAMs include Fintage House, Freeway, and
                Film Finances. While the percentage seems small, it comes off before anything else.
              </p>

              <p className="text-[14px] leading-relaxed text-ink-body">
                Why use a collection agent? They provide:
              </p>

              <ul className="text-[14px] space-y-2 pl-4 text-ink-body">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Investor confidence</strong> —
                  a neutral party ensures the waterfall is followed correctly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Audit trail</strong> —
                  detailed accounting for every dollar that flows through</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Lender requirement</strong> —
                  most senior lenders require a CAM before funding</span>
                </li>
              </ul>
            </div>
          </WikiCard>

          {/* SECTION: DELIVERY COSTS */}
          <WikiCard>
            <WikiSectionHeader number="04" title="Delivery Costs" />

            <div className="p-5 space-y-4">
              <p className="text-[14px] leading-relaxed text-ink-body">
                When a buyer acquires your film, they don't just want the movie—they want a
                complete <strong className="text-white">delivery package</strong>.
                This includes specific technical masters, audio mixes, subtitles, closed captions,
                artwork, and legal documentation.
              </p>

              <p className="text-[14px] leading-relaxed text-ink-body">
                Delivery costs vary significantly but can range from $25,000 to $150,000+ depending
                on the buyer's requirements. Streamers like Netflix have particularly detailed
                technical specifications.
              </p>

              <p className="text-[14px] leading-relaxed text-ink-body">
                In most deals, delivery costs are <strong className="text-white">
                recoupable</strong>—meaning they come off the top of your revenues, just like
                distribution fees. Make sure your budget includes a realistic delivery allowance.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: THE REAL MATH */}
          <WikiCard>
            <WikiSectionHeader number="05" title="The Real Math" />

            <div className="p-5 space-y-4">
              <p className="text-[14px] leading-relaxed text-ink-body">
                Here's what happens to a $2,000,000 acquisition before it reaches your waterfall:
              </p>

              <div
                className="p-4 font-mono text-[12px] space-y-1 bg-bg-surface rounded-xl border border-gold-border text-ink-body"
              >
                <div className="flex justify-between">
                  <span>Gross Acquisition</span>
                  <span className="text-white">$2,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Agent (15%)</span>
                  <span className="text-gold-muted">− $300,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Agent (3%)</span>
                  <span className="text-gold-muted">− $60,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Expenses</span>
                  <span className="text-gold-muted">− $40,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Costs</span>
                  <span className="text-gold-muted">− $75,000</span>
                </div>
                <div
                  className="pt-2 mt-2 flex justify-between font-semibold border-t border-gold-border"
                >
                  <span className="text-gold">Net to Waterfall</span>
                  <span className="text-gold">$1,525,000</span>
                </div>
              </div>

              <p className="text-[14px] leading-relaxed text-ink-body">
                That's nearly <strong className="text-white">24% gone</strong> before
                your senior debt, equity investors, or profit participants see anything. And this
                is just one territory—international sales may have additional layers of fees.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: NEGOTIATING FEES */}
          <WikiCard>
            <WikiSectionHeader number="06" title="Negotiating Fees" />

            <div className="p-5 space-y-4">
              <p className="text-[14px] leading-relaxed text-ink-body">
                While fees are standard in the industry, they're not set in stone. Producers
                with leverage (strong packages, track records, or competing offers) can negotiate:
              </p>

              <ul className="text-[14px] space-y-2 pl-4 text-ink-body">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Caps on recoupable expenses</strong> —
                  limit how much a sales agent can charge back</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Sliding scale percentages</strong> —
                  lower rates as revenues increase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Sunset clauses</strong> —
                  fees that reduce or expire after a certain period</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Territory carve-outs</strong> —
                  excluding territories where you have direct relationships</span>
                </li>
              </ul>

              <p className="text-[14px] leading-relaxed text-ink-body">
                Always have an entertainment attorney review your sales representation and
                collection agreements before signing. Small percentage differences can translate
                to significant dollar amounts.
              </p>
            </div>
          </WikiCard>

          {/* FOOTER — Back to Overview + subtle Start Simulation link */}
          <div className="pt-6 flex flex-col items-center gap-4 animate-fade-in">
            <div
              className="h-px w-full bg-gradient-to-r from-transparent via-gold-muted to-transparent"
            />

            {/* Primary: Back to Overview */}
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-2 text-[14px] transition-colors text-ink-secondary hover:text-ink-body"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>

            {/* Secondary: Subtle exit to calculator */}
            <button
              onClick={handleStartSimulation}
              className="text-[12px] transition-colors text-ink-secondary hover:text-ink-body"
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
