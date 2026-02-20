import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from "@/components/Header";
import { WikiSectionHeader, WikiCard, WikiCallout } from "@/components/shared";

/* ═══════════════════════════════════════════════════════════════════════════
   MINI WIKI: CAPITAL STACK
   Full educational deep-dive on how indie films are financed.

   WIKI CONTAINMENT: This mini wiki can ONLY link back to /
   Secondary exit: Subtle "Start Simulation" text link at bottom
   ═══════════════════════════════════════════════════════════════════════════ */

const CapitalInfo = () => {
  const navigate = useNavigate();

  const handleBackToOverview = () => {
    navigate(-1);
    window.scrollTo(0, 0);
  };

  const handleStartSimulation = () => {
    navigate('/calculator?tab=stack');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header />

      <div className="min-h-screen text-white page-safe px-4 md:px-8 font-sans bg-bg-void">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* PAGE HEADER */}
          <div className="space-y-4 pt-6 animate-fade-in">
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-2 text-sm transition-colors mb-4 text-text-dim hover:text-text-mid"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>

            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide leading-tight">
              Capital <span className="text-gold">Stack</span>
            </h1>

            <p className="text-base leading-relaxed max-w-lg text-text-mid">
              Understanding how independent films are financed—and who gets paid back first.
            </p>

            <div className="h-px w-full bg-gradient-to-r from-gold via-gold-muted/40 to-transparent" />
          </div>

          {/* SECTION: WHAT IS A CAPITAL STACK */}
          <WikiCard>
            <WikiSectionHeader number="01" title="What Is a Capital Stack?" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-text-mid">
                The <strong className="text-white">capital stack</strong> is
                the combination of all funding sources used to finance your production. Like
                layers in a building, each capital source sits in a specific position—and that
                position determines when (and if) each investor gets repaid.
              </p>

              <p className="text-sm leading-relaxed text-text-mid">
                Most independent films can't be funded by a single source. Instead, producers
                piece together a stack from multiple sources: equity investors, senior lenders,
                gap financiers, tax incentives, and sometimes pre-sales or minimum guarantees.
                Each comes with different terms, risks, and recoupment positions.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: EQUITY */}
          <WikiCard>
            <WikiSectionHeader number="02" title="Equity Investors" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-text-mid">
                <strong className="text-white">Equity</strong> is risk capital.
                Equity investors give you money in exchange for ownership—a percentage of the
                profits if the film succeeds. They don't get interest payments or guaranteed
                returns. If the film loses money, equity investors lose their investment.
              </p>

              <p className="text-sm leading-relaxed text-text-mid">
                Because equity is the riskiest capital, equity investors typically demand:
              </p>

              <ul className="text-sm space-y-2 pl-4 text-text-mid">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Priority recoupment</strong> —
                  they want their principal back before anyone else (except senior debt)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Premium</strong> —
                  a percentage on top of their investment (typically 10-25%) before profits split</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Backend participation</strong> —
                  a share of profits after recoupment (often 50%)</span>
                </li>
              </ul>
            </div>
          </WikiCard>

          {/* SECTION: SENIOR DEBT */}
          <WikiCard>
            <WikiSectionHeader number="03" title="Senior Debt" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-text-mid">
                <strong className="text-white">Senior debt</strong> is the
                safest position in the stack. Senior lenders get repaid first, before anyone
                else sees a dollar. Because of this priority position, senior debt charges
                lower rates than equity demands—but it must be repaid regardless of the film's success.
              </p>

              <p className="text-sm leading-relaxed text-text-mid">
                Common sources of senior debt include:
              </p>

              <ul className="text-sm space-y-2 pl-4 text-text-mid">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Bank loans</strong> —
                  secured against pre-sales, tax credits, or minimum guarantees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Tax credit advances</strong> —
                  lenders who front cash against confirmed incentive rebates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span><strong className="text-white">Minimum guarantee loans</strong> —
                  discounted advances against contracted distribution deals</span>
                </li>
              </ul>

              <WikiCallout label="Key Point">
                Senior debt sits at the top of the waterfall. Every dollar of revenue goes to
                senior lenders first—including their interest and fees—before equity investors
                or profit participants see anything.
              </WikiCallout>
            </div>
          </WikiCard>

          {/* SECTION: GAP FINANCING */}
          <WikiCard>
            <WikiSectionHeader number="04" title="Gap Financing" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-text-mid">
                <strong className="text-white">Gap financing</strong> fills the
                space between your secured capital (pre-sales, tax credits) and your total budget.
                It's called "gap" because it bridges the gap—typically 15-25% of budget.
              </p>

              <p className="text-sm leading-relaxed text-text-mid">
                Gap lenders take real risk. They're betting that your unsold territories will
                eventually sell for enough to cover their loan. Because of this risk, gap financing
                is more expensive than senior debt—expect interest rates of 12-18% plus fees.
              </p>

              <p className="text-sm leading-relaxed text-text-mid">
                Gap typically sits after senior debt but before equity in the recoupment waterfall.
                Some deals subordinate gap to equity recoupment—the terms vary significantly by lender
                and by the strength of your sales estimates.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: HOW IT ALL FITS */}
          <WikiCard>
            <WikiSectionHeader number="05" title="How It All Fits Together" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-text-mid">
                A typical indie capital stack might look like this:
              </p>

              <div className="p-4 font-mono text-xs space-y-1 bg-bg-surface rounded-[--radius-md] border border-border-subtle text-text-mid">
                <div className="flex justify-between">
                  <span>Tax Credit Advance (Senior)</span>
                  <span className="text-white">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pre-sale Loan (Senior)</span>
                  <span className="text-white">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>Gap Financing</span>
                  <span className="text-white">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>Equity Investment</span>
                  <span className="text-white">40%</span>
                </div>
                <div className="pt-2 mt-2 flex justify-between font-semibold border-t border-border-subtle">
                  <span className="text-gold">Total</span>
                  <span className="text-gold">100%</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-text-mid">
                When revenues come in, they flow through the waterfall in order: distribution
                fees first, then senior debt gets repaid, then gap, then equity recovers their
                investment plus premium, and finally—if there's anything left—profits split
                according to the Operating Agreement.
              </p>
            </div>
          </WikiCard>

          {/* SECTION: WHAT THIS MEANS FOR YOU */}
          <WikiCard>
            <WikiSectionHeader number="06" title="What This Means For You" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed text-text-mid">
                As a producer, understanding the capital stack is essential because:
              </p>

              <ul className="text-sm space-y-2 pl-4 text-text-mid">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>It determines how your waterfall is structured—you can't negotiate
                  recoupment positions without understanding who's providing what</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Each capital source has different cost implications—interest,
                  premiums, and backend participation all reduce what's available for profit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>Your personal backend (producer profit) only starts after everyone
                  else is satisfied—knowing the math helps you set realistic expectations</span>
                </li>
              </ul>

              <p className="text-sm leading-relaxed text-text-mid">
                The simulation in this tool lets you model different capital structures and see
                exactly how each scenario affects your waterfall. Small changes in the stack can
                have significant impacts on who actually gets paid.
              </p>
            </div>
          </WikiCard>

          {/* FOOTER — Back to Overview + subtle Start Simulation link */}
          <div className="pt-6 flex flex-col items-center gap-4 animate-fade-in">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gold-muted to-transparent" />

            {/* Primary: Back to Overview */}
            <button
              onClick={handleBackToOverview}
              className="flex items-center gap-2 text-sm transition-colors text-text-dim hover:text-text-mid"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>

            {/* Secondary: Subtle exit to calculator */}
            <button
              onClick={handleStartSimulation}
              className="text-xs transition-colors text-text-dim hover:text-text-mid"
            >
              Ready to run the numbers? Start Simulation →
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CapitalInfo;
