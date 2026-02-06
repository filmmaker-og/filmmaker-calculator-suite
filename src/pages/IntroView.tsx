import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { colors, radius } from "@/lib/design-system";
import { WikiSectionHeader, WikiCard, WikiCallout } from "@/components/shared";

const tokens = {
  bgVoid: colors.void,
  bgMatte: colors.card,
  gold: colors.gold,
  goldMuted: colors.goldMuted,
  goldSubtle: colors.goldSubtle,
  goldGlow: colors.goldGlow,
  borderMatte: colors.borderSubtle,
  textPrimary: colors.textPrimary,
  textMid: colors.textMid,
  textDim: colors.textDim,
  radiusMd: radius.md,
  radiusLg: radius.lg,
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Is this legal financial advice?",
    answer: "No. This is an educational planning tool only. Always consult an entertainment attorney before finalizing any deal structures or operating agreements."
  },
  {
    question: "Is this for theatrical releases?",
    answer: "No. This models streamer acquisitions and direct sales—Netflix, Amazon, Tubi, or independent buyers. Theatrical P&A waterfalls are significantly more complex."
  },
  {
    question: "How accurate is this?",
    answer: "The waterfall logic matches real Operating Agreements used in independent film finance. Specific percentages vary by deal, but the mechanics and recoupment order are universal."
  },
  {
    question: "I'm new to film finance. Where do I start?",
    answer: "Just follow the steps. Each input has an info icon with context. Start with your budget, then we'll walk you through capital stack, fees, and recoupment."
  }
];

interface PillarData {
  number: string;
  title: string;
  summary: string;
  learnMorePath: string;
}

const pillars: PillarData[] = [
  {
    number: "01",
    title: "Production Budget",
    summary: "Also called Negative Cost—the total amount required to produce your film. Your budget isn't just a number—it's the foundation of your entire deal structure. It determines how much capital you need to raise, what financing options are available to you, and what acquisition price you need to break even. Independent budgets typically range from $100K to $15M, with each tier opening different doors for crew, talent, and distribution. Getting this number right is the first step to building a deal that actually works.",
    learnMorePath: "/budget-info",
  },
  {
    number: "02",
    title: "Capital Stack",
    summary: "How your production gets funded. Most indie films can't be financed by a single source—producers piece together a stack from equity investors, senior lenders, gap financiers, and tax incentives. Each source sits in a specific position in the repayment hierarchy, and that position determines when (and if) each party gets their money back. Equity is the riskiest capital and demands the highest returns. Senior debt gets paid first but charges interest. Understanding how these layers interact is essential to structuring a deal that attracts investors and still leaves room for your producer backend.",
    learnMorePath: "/capital-info",
  },
  {
    number: "03",
    title: "Distribution Fees",
    summary: "Before anyone in your waterfall sees a dollar, fees come off the top. Sales agents typically take 10–20% for representing your film to buyers at markets like Cannes and AFM. Collection agents take another 1–5% for managing the flow of funds. Then there are market expenses, delivery costs, and recoupable charges. On a $2M acquisition, these fees can easily total 20–30%—meaning $400K–$600K disappears before your senior lenders, equity investors, or profit participants receive anything. These aren't optional costs—they're contractual obligations built into every deal.",
    learnMorePath: "/fees-info",
  },
  {
    number: "04",
    title: "Recoupment Waterfall",
    summary: "The contractual order in which revenues are distributed after fees are paid. Like water flowing down a series of pools, money fills each position completely before spilling over to the next: senior debt first, then gap financing, then equity investors recover their principal plus a negotiated premium. Only after all of those positions are satisfied does any money reach the profit pool—where producers, talent deferrals, and backend participants finally get paid. On most independent films, the waterfall never reaches profit participation. This tool shows you exactly where the money goes so you can negotiate from a position of knowledge.",
    learnMorePath: "/waterfall-info",
  },
];

interface PillarAccordionProps {
  pillar: PillarData;
  isExpanded: boolean;
  onToggle: () => void;
}

const PillarAccordion = ({ pillar, isExpanded, onToggle }: PillarAccordionProps) => {
  const navigate = useNavigate();

  const handleDeepDive = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(pillar.learnMorePath);
    window.scrollTo(0, 0);
  };

  return (
    <WikiCard>
      <WikiSectionHeader
        number={pillar.number}
        title={pillar.title}
        isExpanded={isExpanded}
        onClick={onToggle}
        isClickable={true}
      />

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          isExpanded ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-5 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
            {pillar.summary}
          </p>

          <button
            onClick={handleDeepDive}
            className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
            style={{ color: tokens.gold }}
          >
            <span>Deep dive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </WikiCard>
  );
};

const IntroView = () => {
  const navigate = useNavigate();
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const togglePillar = (index: number) => {
    setExpandedPillar(expandedPillar === index ? null : index);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleStartSimulation = () => {
    navigate('/calculator?tab=budget');
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
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide leading-tight">
              Waterfall <span style={{ color: tokens.gold }}>Protocol</span>
            </h1>

            <p
              className="text-base leading-relaxed max-w-lg"
              style={{ color: tokens.textMid }}
            >
              How money moves through a film deal—from acquisition to your pocket.
            </p>

            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldMuted} 40%, transparent 80%)`
              }}
            />
          </div>

          {/* PILLARS 01-04 */}
          {pillars.map((pillar, index) => (
            <PillarAccordion
              key={pillar.number}
              pillar={pillar}
              isExpanded={expandedPillar === index}
              onToggle={() => togglePillar(index)}
            />
          ))}

          {/* WHY THIS MATTERS */}
          <WikiCard>
            <WikiSectionHeader number="05" title="Why This Matters" />

            <div className="p-5 space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Most filmmakers don't see this math until they've already signed.
                By then, the deal terms are locked—and the surprises aren't pleasant.
              </p>

              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Understanding the waterfall before you negotiate changes the conversation.
                Investors back producers who can walk through collection fees, recoupment
                positions, and profit corridors with confidence. You're not just pitching
                a film—you're demonstrating you understand the business.
              </p>

              <WikiCallout label="Key Insight">
                A $2M acquisition doesn't mean $2M in your pocket. After fees and recoupment,
                that number can shrink dramatically. This tool shows you exactly where the
                money goes—before you sign anything.
              </WikiCallout>
            </div>
          </WikiCard>

          {/* FAQ */}
          <WikiCard>
            <WikiSectionHeader number="06" title="FAQ" />

            <div>
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  style={{ borderTop: index > 0 ? `1px solid ${tokens.borderMatte}` : 'none' }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left transition-all duration-150"
                    style={{
                      background: openFAQ === index ? tokens.goldSubtle : 'transparent',
                    }}
                  >
                    <span
                      className="text-sm font-medium pr-4"
                      style={{ color: openFAQ === index ? tokens.textPrimary : tokens.textMid }}
                    >
                      {item.question}
                    </span>

                    <ChevronDown
                      className={cn(
                        "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                        openFAQ === index && "rotate-180"
                      )}
                      style={{ color: openFAQ === index ? tokens.gold : tokens.textDim }}
                    />
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      openFAQ === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div
                      className="px-4 pb-4 text-sm leading-relaxed"
                      style={{ color: tokens.textDim }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </WikiCard>

          {/* CTA */}
          <div className="pt-6 flex flex-col items-center gap-6 animate-fade-in">
            <div
              className="h-px w-full"
              style={{
                background: `linear-gradient(90deg, transparent 10%, ${tokens.goldMuted} 50%, transparent 90%)`
              }}
            />

            <Button
              onClick={handleStartSimulation}
              className="group px-10 py-6 text-sm font-black uppercase tracking-widest transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${tokens.gold} 0%, #E6C200 100%)`,
                border: 'none',
                borderRadius: tokens.radiusMd,
                color: '#000000',
                boxShadow: `0 8px 24px ${tokens.goldGlow}`,
              }}
            >
              Start Simulation
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: tokens.textDim }}
              onMouseEnter={(e) => e.currentTarget.style.color = tokens.gold}
              onMouseLeave={(e) => e.currentTarget.style.color = tokens.textDim}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default IntroView;
