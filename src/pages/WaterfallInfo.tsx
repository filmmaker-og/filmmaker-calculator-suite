import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from "@/components/Header";
import { colors, radius } from "@/lib/design-system";

/* ═══════════════════════════════════════════════════════════════════════════
   MINI WIKI: RECOUPMENT WATERFALL
   Deep-dive on how revenues are distributed in order of priority.
   
   WIKI CONTAINMENT: This mini wiki can ONLY link back to /intro
   Secondary exit: Subtle "Start Simulation" text link at bottom
   ═══════════════════════════════════════════════════════════════════════════ */
// Sourced from design-system.ts (aligned to index.css)
const tokens = {
  bgVoid: colors.void,
  bgMatte: colors.card,
  bgHeader: colors.elevated,
  bgSurface: colors.surface,
  gold: colors.gold,
  goldMuted: colors.goldMuted,
  goldSubtle: colors.goldSubtle,
  goldGlow: colors.goldGlow,
  goldFill: colors.goldSubtle,
  goldRadiant: colors.goldGlow,
  borderMatte: colors.borderSubtle,
  borderSubtle: colors.borderSubtle,
  textPrimary: colors.textPrimary,
  textMid: colors.textMid,
  textDim: colors.textDim,
  radiusMd: radius.md,
  radiusLg: radius.lg,
};

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADER — Radiant Gold Left Border
   ═══════════════════════════════════════════════════════════════════════════ */
interface SectionHeaderProps {
  number: string;
  title: string;
}

const SectionHeader = ({ number, title }: SectionHeaderProps) => (
  <div 
    className="flex items-stretch"
    style={{ 
      background: `linear-gradient(90deg, ${tokens.goldRadiant} 0%, ${tokens.bgHeader} 15%, ${tokens.bgHeader} 100%)`,
      borderBottom: `1px solid ${tokens.borderMatte}`,
    }}
  >
    <div 
      className="w-1 flex-shrink-0"
      style={{ 
        background: `linear-gradient(180deg, ${tokens.gold} 0%, ${tokens.goldMuted} 100%)`,
        boxShadow: `0 0 12px ${tokens.goldGlow}`,
      }}
    />
    
    <div 
      className="flex items-center justify-center px-4 py-4"
      style={{ 
        borderRight: `1px solid ${tokens.borderSubtle}`,
        minWidth: '56px',
        background: tokens.goldFill,
      }}
    >
      <span 
        className="font-bebas text-xl tracking-wide"
        style={{ color: tokens.gold }}
      >
        {number}
      </span>
    </div>
    
    <div className="flex items-center px-4 py-4">
      <h2 
        className="font-bold text-xs uppercase tracking-widest"
        style={{ color: tokens.textPrimary }}
      >
        {title}
      </h2>
    </div>
  </div>
);

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

          {/* SECTION: WHAT IS A WATERFALL */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="01" title="What Is a Waterfall?" />
            
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                The <strong style={{ color: tokens.textPrimary }}>recoupment waterfall</strong> is 
                the contractual hierarchy that determines how revenues flow through a film deal. 
                Like water flowing down a series of pools, money fills each "position" completely 
                before spilling over to the next.
              </p>
              
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

          {/* SECTION: TYPICAL WATERFALL ORDER */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="02" title="Typical Waterfall Order" />
            
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                While every deal is different, a typical indie film waterfall follows this order:
              </p>
              
              <div 
                className="p-4 font-mono text-xs space-y-3"
                style={{ 
                  background: tokens.bgSurface,
                  borderRadius: tokens.radiusMd,
                  border: `1px solid ${tokens.borderSubtle}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: tokens.goldFill, color: tokens.gold }}
                  >
                    1
                  </span>
                  <div>
                    <span style={{ color: tokens.textPrimary }}>Distribution Fees</span>
                    <p style={{ color: tokens.textDim }} className="mt-1">Sales agent, collection agent, market expenses</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: tokens.goldFill, color: tokens.gold }}
                  >
                    2
                  </span>
                  <div>
                    <span style={{ color: tokens.textPrimary }}>Delivery Costs</span>
                    <p style={{ color: tokens.textDim }} className="mt-1">Technical masters, materials, recoupable expenses</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: tokens.goldFill, color: tokens.gold }}
                  >
                    3
                  </span>
                  <div>
                    <span style={{ color: tokens.textPrimary }}>Senior Debt</span>
                    <p style={{ color: tokens.textDim }} className="mt-1">Bank loans, tax credit advances (principal + interest)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: tokens.goldFill, color: tokens.gold }}
                  >
                    4
                  </span>
                  <div>
                    <span style={{ color: tokens.textPrimary }}>Gap Financing</span>
                    <p style={{ color: tokens.textDim }} className="mt-1">Gap loans (principal + interest + fees)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: tokens.goldFill, color: tokens.gold }}
                  >
                    5
                  </span>
                  <div>
                    <span style={{ color: tokens.textPrimary }}>Equity Recoupment</span>
                    <p style={{ color: tokens.textDim }} className="mt-1">Investor principal + negotiated premium (10-25%)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <span 
                    className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center"
                    style={{ background: tokens.goldFill, color: tokens.gold }}
                  >
                    6
                  </span>
                  <div>
                    <span style={{ color: tokens.textPrimary }}>Profit Participation</span>
                    <p style={{ color: tokens.textDim }} className="mt-1">Producer backend, talent deferrals, investor backend</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: RECOUPMENT POSITIONS */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="03" title="Recoupment Positions" />
            
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Your <strong style={{ color: tokens.textPrimary }}>recoupment position</strong> is 
                where you sit in the waterfall. Earlier positions get paid first—which means 
                they're safer but typically offer lower returns. Later positions take more risk 
                but can be more lucrative if the film performs well.
              </p>
              
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Common position structures:
              </p>
              
              <ul className="text-sm space-y-2 pl-4" style={{ color: tokens.textMid }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>First dollar</strong> — 
                  the earliest position after fees; the safest for investors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Pari passu</strong> — 
                  multiple parties sharing the same position proportionally</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Subordinated</strong> — 
                  a position that only triggers after higher positions are satisfied</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Last money in</strong> — 
                  sometimes the final investor gets first recoupment as an incentive</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SECTION: PROFIT CORRIDORS */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="04" title="Profit Corridors" />
            
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                After everyone above the line recoups, the remaining money is 
                <strong style={{ color: tokens.textPrimary }}> profit</strong>. But profit doesn't 
                just pile up—it gets split according to the Operating Agreement.
              </p>
              
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                A typical split might look like:
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
          </div>

          {/* SECTION: THE HARSH REALITY */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="05" title="The Harsh Reality" />
            
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Here's what nobody tells you: on most independent films, the waterfall never 
                reaches profit participation. The combination of distribution fees, delivery 
                costs, and capital recoupment often exceeds what the film earns.
              </p>
              
              <div 
                className="p-4 mt-2"
                style={{ 
                  background: tokens.goldSubtle,
                  borderRadius: tokens.radiusMd,
                  border: `1px solid ${tokens.goldMuted}`,
                }}
              >
                <p 
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ color: tokens.gold }}
                >
                  Industry Reality
                </p>
                <p className="text-sm leading-relaxed" style={{ color: tokens.textPrimary }}>
                  A $1M film that sells for $1.5M might look profitable on paper. But after 
                  20% in fees ($300K), $50K in delivery, and $1M in capital recoupment, only 
                  $150K reaches profit—and that still needs to be split among multiple parties.
                </p>
              </div>
              
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                This is why understanding the waterfall before you sign is critical. A "generous" 
                backend that triggers after $3M in prior positions might never pay out on a film 
                that's realistic about its sales potential.
              </p>
            </div>
          </div>

          {/* SECTION: PROTECTING YOURSELF */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="06" title="Protecting Yourself" />
            
            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                As a producer, there are several ways to improve your position:
              </p>
              
              <ul className="text-sm space-y-2 pl-4" style={{ color: tokens.textMid }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Negotiate a producer fee</strong> — 
                  a fixed amount in the budget that you receive regardless of performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>First position corridor</strong> — 
                  a small percentage that comes off before investor recoupment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Run the math</strong> — 
                  model your waterfall against realistic sales to see what you'll actually receive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: tokens.gold }}>•</span>
                  <span><strong style={{ color: tokens.textPrimary }}>Audit rights</strong> — 
                  ensure you have the contractual right to audit the collection account</span>
                </li>
              </ul>
              
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Most importantly: have an entertainment attorney review your Operating Agreement 
                before signing. The waterfall is where your deal is won or lost.
              </p>
            </div>
          </div>

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
