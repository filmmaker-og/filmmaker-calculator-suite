import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, TrendingUp, Lightbulb, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT BIBLE v2.0 TOKENS
   ═══════════════════════════════════════════════════════════════════════════ */
const tokens = {
  // Backgrounds
  bgVoid: '#000000',
  bgCard: '#070707',
  bgSurface: '#141414',
  bgElevated: '#111111',
  
  // Gold System
  gold: '#FFD700',
  goldMuted: 'rgba(255, 215, 0, 0.45)',
  goldSubtle: 'rgba(255, 215, 0, 0.12)',
  goldGlow: 'rgba(255, 215, 0, 0.3)',
  
  // Borders
  borderDefault: '#2A2A2A',
  borderGold: 'rgba(255, 215, 0, 0.45)',
  
  // Text
  textPrimary: '#FFFFFF',
  textMid: '#CFCFCF',
  textDim: '#8A8A8A',
  
  // Radius
  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '14px',
};

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    question: "Is this legal financial advice?",
    answer: "No. This is a simulation tool for estimation and planning purposes only. Always consult with a qualified entertainment attorney or accountant for final deal structures."
  },
  {
    question: "Can I save my results?",
    answer: "Yes. At the end of the simulation, you'll have options to export or view a summary of your waterfall model."
  },
  {
    question: "Is this for theatrical releases?",
    answer: (
      <>
        No. This calculator is built for <span className="text-white font-medium">streamer acquisition and direct sales</span>—the dominant path for indie films today. It models what happens when you sell your finished film to Netflix, Amazon, Hulu, Tubi, or an independent buyer.
      </>
    )
  },
  {
    question: "I don't understand all the terms yet. Should I wait?",
    answer: (
      <>
        No. The best way to learn recoupment is to <span className="text-white font-medium">interact with a working model</span>. Start with a simple scenario and adjust as you go. If you get stuck, use the in-app definitions or reach out—we'll walk you through it.
      </>
    )
  },
  {
    question: "How accurate is this compared to real deals?",
    answer: (
      <>
        This calculator uses the same waterfall logic found in actual Operating Agreements and distribution contracts. The math is <span className="text-white font-medium">institutional-grade</span>. What varies deal-to-deal are specific fee percentages, expense caps, and waterfall positions—but the structural mechanics are universal.
      </>
    )
  },
  {
    question: "I'm new to this. Where do I start?",
    answer: "Just follow the steps. The waterfall process is broken into 4 stages. If you get stuck, look for the quick tips inside the calculator."
  }
];

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
        <div className="max-w-3xl mx-auto space-y-6">
          
          {/* ═══════════════════════════════════════════════════════════════════
              HEADER - Documentation Style
              ═══════════════════════════════════════════════════════════════════ */}
          <div className="space-y-4 pb-6 animate-fade-in">
            {/* Breadcrumb */}
            <div 
              className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest"
              style={{ color: tokens.gold }}
            >
              <FileText className="w-4 h-4" />
              <span>Protocol / Overview</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide leading-tight">
              Filmmaker <span style={{ color: tokens.gold }}>Waterfall</span> Protocol
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-base leading-relaxed max-w-2xl"
              style={{ color: tokens.textMid }}
            >
              This is how money moves through a film deal—from acquisition to your pocket. 
              Most producers don't see this math until they've already signed away their upside.
            </p>
            
            {/* Divider */}
            <div 
              className="h-px w-full mt-4"
              style={{ 
                background: `linear-gradient(90deg, ${tokens.goldMuted}, transparent 60%)` 
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              MAIN CONTENT CARD - Chapter Style
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgCard,
              border: `1px solid ${tokens.borderDefault}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            {/* Card Header - Elevated */}
            <div 
              className="flex items-center gap-4 px-5 py-4"
              style={{ 
                background: tokens.bgElevated,
                borderBottom: `1px solid ${tokens.borderDefault}`,
              }}
            >
              {/* Chapter Number */}
              <div 
                className="w-10 h-10 flex items-center justify-center font-bebas text-lg"
                style={{
                  background: tokens.goldSubtle,
                  border: `1px solid ${tokens.goldMuted}`,
                  borderRadius: tokens.radiusMd,
                  color: tokens.gold,
                }}
              >
                01
              </div>
              <div>
                <h2 
                  className="font-bold text-sm uppercase tracking-wide"
                  style={{ color: tokens.textPrimary }}
                >
                  Before You Begin
                </h2>
                <p 
                  className="text-xs"
                  style={{ color: tokens.textDim }}
                >
                  Understanding the waterfall
                </p>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-5 space-y-5">
              
              {/* Section 1 */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-2.5 flex-shrink-0"
                  style={{
                    background: tokens.goldSubtle,
                    border: `1px solid ${tokens.goldMuted}`,
                    borderRadius: tokens.radiusMd,
                  }}
                >
                  <ShieldCheck className="w-5 h-5" style={{ color: tokens.gold }} />
                </div>
                <div>
                  <h3 
                    className="text-sm font-bold mb-1.5"
                    style={{ color: tokens.textPrimary }}
                  >
                    Why this exists
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: tokens.textDim }}
                  >
                    Most filmmakers guess their numbers. You won't. This calculator models the flow of money from acquisition sale to your pocket—accounting for sales agent fees, distributor commissions, and investor recoupment. Whether you're selling to Netflix, Amazon, Tubi, or an independent buyer, you need to know where the money goes before you promise anyone a return.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${tokens.borderDefault}` }} />

              {/* Section 2 */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-2.5 flex-shrink-0"
                  style={{
                    background: tokens.goldSubtle,
                    border: `1px solid ${tokens.goldMuted}`,
                    borderRadius: tokens.radiusMd,
                  }}
                >
                  <TrendingUp className="w-5 h-5" style={{ color: tokens.gold }} />
                </div>
                <div>
                  <h3 
                    className="text-sm font-bold mb-1.5"
                    style={{ color: tokens.textPrimary }}
                  >
                    The Investor Advantage
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: tokens.textDim }}
                  >
                    Investors back producers who understand the risks. When you can walk someone through off-the-tops, collection fees, and recoupment positions, you're speaking their language. A clear waterfall demonstrates competence—and competence closes deals.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${tokens.borderDefault}` }} />

              {/* Section 3 */}
              <div className="flex items-start gap-4">
                <div 
                  className="p-2.5 flex-shrink-0"
                  style={{
                    background: tokens.goldSubtle,
                    border: `1px solid ${tokens.goldMuted}`,
                    borderRadius: tokens.radiusMd,
                  }}
                >
                  <Lightbulb className="w-5 h-5" style={{ color: tokens.gold }} />
                </div>
                <div>
                  <h3 
                    className="text-sm font-bold mb-1.5"
                    style={{ color: tokens.textPrimary }}
                  >
                    The Learning Curve Is The Point
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: tokens.textDim }}
                  >
                    If parts of this feel unfamiliar, that's expected. Film finance is deliberately complex—it protects the people who understand it. The terminology exists for a reason, and learning it is how you stop leaving money on the table.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              PRO TIP CALLOUT
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="flex items-start gap-3 p-4 animate-fade-in"
            style={{ 
              background: tokens.goldSubtle,
              borderLeft: `3px solid ${tokens.gold}`,
              borderRadius: `0 ${tokens.radiusMd} ${tokens.radiusMd} 0`,
            }}
          >
            <span 
              className="text-xs font-bold uppercase tracking-wide flex-shrink-0"
              style={{ color: tokens.gold }}
            >
              Tip
            </span>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: tokens.textMid }}
            >
              Don't let unfamiliar terminology stop you. Look for the 
              <span 
                className="inline-flex items-center justify-center w-5 h-5 mx-1 text-xs font-bold rounded-full"
                style={{ 
                  color: tokens.gold, 
                  border: `1px solid ${tokens.goldMuted}`,
                  background: tokens.goldSubtle,
                }}
              >i</span>
              icons throughout the calculator for quick definitions.
            </p>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              FAQ CARD - Chapter Style
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgCard,
              border: `1px solid ${tokens.borderDefault}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            {/* Card Header */}
            <div 
              className="flex items-center gap-4 px-5 py-4"
              style={{ 
                background: tokens.bgElevated,
                borderBottom: `1px solid ${tokens.borderDefault}`,
              }}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center font-bebas text-lg"
                style={{
                  background: tokens.goldSubtle,
                  border: `1px solid ${tokens.goldMuted}`,
                  borderRadius: tokens.radiusMd,
                  color: tokens.gold,
                }}
              >
                02
              </div>
              <div>
                <h2 
                  className="font-bold text-sm uppercase tracking-wide"
                  style={{ color: tokens.textPrimary }}
                >
                  Common Questions
                </h2>
                <p 
                  className="text-xs"
                  style={{ color: tokens.textDim }}
                >
                  Quick answers before you start
                </p>
              </div>
            </div>
            
            {/* FAQ Accordion */}
            <div className="divide-y" style={{ borderColor: tokens.borderDefault }}>
              {faqItems.map((item, index) => (
                <div 
                  key={index}
                  style={{ borderColor: tokens.borderDefault }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center gap-4 p-4 text-left transition-all duration-150"
                    style={{
                      background: openFAQ === index ? tokens.goldSubtle : 'transparent',
                    }}
                  >
                    {/* Number Badge */}
                    <div 
                      className="w-7 h-7 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold"
                      style={{
                        background: openFAQ === index ? tokens.goldSubtle : tokens.bgSurface,
                        border: `1px solid ${openFAQ === index ? tokens.goldMuted : tokens.borderDefault}`,
                        borderRadius: tokens.radiusSm,
                        color: openFAQ === index ? tokens.gold : tokens.textDim,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
                    {/* Question */}
                    <span 
                      className="flex-1 text-sm font-medium"
                      style={{ color: openFAQ === index ? tokens.textPrimary : tokens.textMid }}
                    >
                      {item.question}
                    </span>
                    
                    {/* Chevron */}
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 flex-shrink-0 transition-transform duration-200",
                        openFAQ === index && "rotate-180"
                      )}
                      style={{ color: openFAQ === index ? tokens.gold : tokens.textDim }}
                    />
                  </button>
                  
                  {/* Answer */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      openFAQ === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div 
                      className="px-4 pb-4 text-sm leading-relaxed"
                      style={{ 
                        color: tokens.textDim,
                        marginLeft: '44px',
                        borderLeft: `2px solid ${tokens.goldMuted}`,
                        paddingLeft: '16px',
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              CTA SECTION
              ═══════════════════════════════════════════════════════════════════ */}
          <div className="pt-6 flex flex-col items-center gap-5 animate-fade-in">
            {/* Divider */}
            <div 
              className="h-px w-full"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${tokens.goldMuted}, transparent)` 
              }}
            />
            
            {/* CTA Button - Product Bible Style */}
            <Button 
              onClick={handleInitialize}
              className="group px-8 py-6 text-xs font-black uppercase tracking-widest transition-all duration-200"
              style={{
                background: tokens.goldSubtle,
                border: `1px solid ${tokens.goldMuted}`,
                borderRadius: tokens.radiusMd,
                color: tokens.gold,
                boxShadow: `0 10px 26px rgba(255, 215, 0, 0.18)`,
              }}
            >
              Initialize Simulation
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {/* Version */}
            <div 
              className="text-xs font-mono tracking-wider"
              style={{ color: tokens.textDim }}
            >
              v2.0.5-stable
            </div>
          </div>

          {/* Back Link */}
          <div className="pt-2 flex justify-center animate-fade-in">
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
