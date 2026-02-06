import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT BIBLE v2.0 — NOTION MEETS APPS
   
   Design DNA:
   - Notion: Clean hierarchy, toggle sections, database-level organization
   - Apps: Gold left border accent, dark matte surfaces, premium sparse gold
   ═══════════════════════════════════════════════════════════════════════════ */
const tokens = {
  bgVoid: '#000000',
  bgMatte: '#0D0D0D',
  bgHeader: '#111111',
  bgSurface: '#141414',
  
  gold: '#FFD700',
  goldMuted: 'rgba(255, 215, 0, 0.45)',
  goldSubtle: 'rgba(255, 215, 0, 0.08)',
  goldGlow: 'rgba(255, 215, 0, 0.25)',
  goldFill: 'rgba(255, 215, 0, 0.12)',
  goldRadiant: 'rgba(255, 215, 0, 0.18)',
  
  borderMatte: '#1A1A1A',
  borderSubtle: '#222222',
  
  textPrimary: '#FFFFFF',
  textMid: '#B0B0B0',
  textDim: '#6B6B6B',
  
  radiusMd: '12px',
  radiusLg: '14px',
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
    answer: "Just follow the steps. Each input has an info icon with context. Start with your budget, then we'll walk you through capital structure, fees, and recoupment."
  }
];

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADER — Radiant Gold Left Border + Matte Gray Surface
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

/* ═══════════════════════════════════════════════════════════════════════════
   PILLAR SECTION — Each pillar gets its own containment header
   ═══════════════════════════════════════════════════════════════════════════ */
interface PillarSectionProps {
  number: string;
  title: string;
  children: React.ReactNode;
  learnMorePath: string;
}

const PillarSection = ({ number, title, children, learnMorePath }: PillarSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="overflow-hidden animate-fade-in"
      style={{ 
        background: tokens.bgMatte,
        border: `1px solid ${tokens.borderMatte}`,
        borderRadius: tokens.radiusLg,
      }}
    >
      <SectionHeader number={number} title={title} />
      
      <div className="p-5 space-y-4">
        {children}
        
        <button
          onClick={() => navigate(learnMorePath)}
          className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
          style={{ color: tokens.gold }}
        >
          <span>Deep dive</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const IntroView = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleStartSimulation = () => {
    navigate('/calculator');
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
              PAGE HEADER
              ═══════════════════════════════════════════════════════════════ */}
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

          {/* ═══════════════════════════════════════════════════════════════
              PILLAR 01 — PRODUCTION BUDGET
              ═══════════════════════════════════════════════════════════════ */}
          <PillarSection
            number="01"
            title="Production Budget"
            learnMorePath="/budget-info"
          >
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              Also called <strong style={{ color: tokens.textPrimary }}>Negative Cost</strong>—the 
              total amount required to produce your film. This includes everything from script 
              development through final delivery: above-the-line talent, crew, equipment, 
              locations, post-production, and contingency.
            </p>
            
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              Your budget isn't just a number—it's the foundation of your entire deal structure. 
              It determines how much capital you need to raise, what your realistic sales 
              expectations should be, and ultimately how the waterfall will flow.
            </p>
          </PillarSection>

          {/* ═══════════════════════════════════════════════════════════════
              PILLAR 02 — CAPITAL STACK
              ═══════════════════════════════════════════════════════════════ */}
          <PillarSection
            number="02"
            title="Capital Stack"
            learnMorePath="/capital-info"
          >
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              The <strong style={{ color: tokens.textPrimary }}>capital stack</strong> is how 
              your production gets funded. Most independent films combine multiple sources: 
              equity investors who own a piece of the upside, senior debt that gets repaid 
              first, gap financing against unsold territories, and sometimes tax incentives 
              or soft money.
            </p>
            
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              The structure of your capital stack directly determines your waterfall. Whoever 
              provides the riskiest money typically demands the most favorable recoupment 
              position. Understanding this relationship is essential before you sign anything.
            </p>
          </PillarSection>

          {/* ═══════════════════════════════════════════════════════════════
              PILLAR 03 — DISTRIBUTION FEES
              ═══════════════════════════════════════════════════════════════ */}
          <PillarSection
            number="03"
            title="Distribution Fees"
            learnMorePath="/fees-info"
          >
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              Before anyone in your waterfall sees a dollar, <strong style={{ color: tokens.textPrimary }}>
              distribution fees come off the top</strong>. Sales agents typically take 10-20%, 
              collection agents take 1-5%, and there may be additional market fees, delivery 
              costs, and recoupable expenses.
            </p>
            
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              A $2M acquisition doesn't mean $2M flows to your waterfall. After fees, you 
              might see $1.6M or less. This is why understanding the fee stack is critical 
              before celebrating any sale.
            </p>
          </PillarSection>

          {/* ═══════════════════════════════════════════════════════════════
              PILLAR 04 — RECOUPMENT WATERFALL
              ═══════════════════════════════════════════════════════════════ */}
          <PillarSection
            number="04"
            title="Recoupment Waterfall"
            learnMorePath="/waterfall-info"
          >
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              The <strong style={{ color: tokens.textPrimary }}>waterfall</strong> is the 
              contractual order in which revenues are distributed. Each position must be 
              fully satisfied before the next position receives anything. Senior debt typically 
              sits first, followed by equity recoupment, then profit participation.
            </p>
            
            <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
              Your position in the waterfall determines when—and if—you get paid. A producer 
              with a 50% backend sounds great, but if that backend only triggers after $5M 
              in prior positions are satisfied, the reality might be very different.
            </p>
          </PillarSection>

          {/* ═══════════════════════════════════════════════════════════════
              WHY THIS MATTERS
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="05" title="Why This Matters" />
            
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
                  Key Insight
                </p>
                <p className="text-sm leading-relaxed" style={{ color: tokens.textPrimary }}>
                  A $2M acquisition doesn't mean $2M in your pocket. After fees and recoupment, 
                  that number can shrink dramatically. This tool shows you exactly where the 
                  money goes—before you sign anything.
                </p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              FAQ
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="06" title="FAQ" />
            
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
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CTA SECTION
              ═══════════════════════════════════════════════════════════════ */}
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
