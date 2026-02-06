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
  // Backgrounds - Matte surfaces
  bgVoid: '#000000',
  bgMatte: '#0D0D0D',      // Primary card surface
  bgHeader: '#111111',     // Header bars
  bgSurface: '#141414',    // Elevated surfaces
  
  // Gold System — Use sparingly
  gold: '#FFD700',
  goldMuted: 'rgba(255, 215, 0, 0.45)',
  goldSubtle: 'rgba(255, 215, 0, 0.08)',
  goldGlow: 'rgba(255, 215, 0, 0.25)',
  
  // Borders
  borderMatte: '#1A1A1A',
  borderSubtle: '#222222',
  
  // Text
  textPrimary: '#FFFFFF',
  textMid: '#B0B0B0',
  textDim: '#6B6B6B',
  
  // Radius
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
   SECTION HEADER COMPONENT — Gold Left Border Accent (Signature Element)
   ═══════════════════════════════════════════════════════════════════════════ */
interface SectionHeaderProps {
  number: string;
  title: string;
}

const SectionHeader = ({ number, title }: SectionHeaderProps) => (
  <div 
    className="flex items-stretch"
    style={{ 
      background: tokens.bgHeader,
      borderBottom: `1px solid ${tokens.borderMatte}`,
    }}
  >
    {/* Gold Left Border Accent — THE signature element */}
    <div 
      className="w-1 flex-shrink-0"
      style={{ background: tokens.gold }}
    />
    
    {/* Chapter Number Box */}
    <div 
      className="flex items-center justify-center px-4 py-4"
      style={{ 
        borderRight: `1px solid ${tokens.borderSubtle}`,
        minWidth: '56px',
      }}
    >
      <span 
        className="font-bebas text-xl tracking-wide"
        style={{ color: tokens.gold }}
      >
        {number}
      </span>
    </div>
    
    {/* Title */}
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

const IntroView = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleInitialize = () => {
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
            
            {/* Gold Gradient Divider */}
            <div 
              className="h-px w-full"
              style={{ 
                background: `linear-gradient(90deg, ${tokens.gold}, ${tokens.goldMuted} 40%, transparent 80%)` 
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 01 — WHAT YOU'LL MODEL (Comprehensive)
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="01" title="What You'll Model" />
            
            <div className="p-5 space-y-5">
              {/* Intro Context */}
              <p 
                className="text-sm leading-relaxed"
                style={{ color: tokens.textMid }}
              >
                This simulator walks you through the four pillars of independent film finance. 
                Each section builds on the last, creating a complete picture of how revenue 
                flows from acquisition to final profit splits.
              </p>
              
              {/* The Four Pillars */}
              <div className="space-y-4">
                <div 
                  className="p-4"
                  style={{ 
                    background: tokens.bgSurface,
                    borderRadius: tokens.radiusMd,
                    borderLeft: `2px solid ${tokens.goldMuted}`,
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-1">Production Budget</p>
                  <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
                    Your total cost to produce the film. This becomes the baseline for 
                    everything else—capital requirements, recoupment thresholds, and profit calculations.
                  </p>
                </div>
                
                <div 
                  className="p-4"
                  style={{ 
                    background: tokens.bgSurface,
                    borderRadius: tokens.radiusMd,
                    borderLeft: `2px solid ${tokens.goldMuted}`,
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-1">Capital Stack</p>
                  <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
                    How you're funding production. The mix of equity, debt, and deferrals 
                    determines who gets paid first and at what rates. Senior debt always 
                    recoup before equity sees a dime.
                  </p>
                </div>
                
                <div 
                  className="p-4"
                  style={{ 
                    background: tokens.bgSurface,
                    borderRadius: tokens.radiusMd,
                    borderLeft: `2px solid ${tokens.goldMuted}`,
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-1">Distribution Fees</p>
                  <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
                    What comes off the top before anyone gets paid. Collection agents, 
                    sales agents, and distributors each take their cut from gross revenue, 
                    leaving Net Receipts for the waterfall.
                  </p>
                </div>
                
                <div 
                  className="p-4"
                  style={{ 
                    background: tokens.bgSurface,
                    borderRadius: tokens.radiusMd,
                    borderLeft: `2px solid ${tokens.goldMuted}`,
                  }}
                >
                  <p className="text-sm font-semibold text-white mb-1">Recoupment Waterfall</p>
                  <p className="text-xs leading-relaxed" style={{ color: tokens.textDim }}>
                    The contractual order of who gets paid back. Each position must fully 
                    recoup before the next tier sees money. This is where deals are won or lost.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 02 — WHY THIS MATTERS
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="02" title="Why This Matters" />
            
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
                className="p-4 mt-4"
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
              SECTION 03 — FAQ (Restored name)
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="03" title="FAQ" />
            
            {/* FAQ Accordion — Notion-style toggles */}
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
            {/* Gold Gradient Divider */}
            <div 
              className="h-px w-full"
              style={{ 
                background: `linear-gradient(90deg, transparent 10%, ${tokens.goldMuted} 50%, transparent 90%)` 
              }}
            />
            
            {/* CTA Button — Solid Gold */}
            <Button 
              onClick={handleInitialize}
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
            
            {/* Back Link */}
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
