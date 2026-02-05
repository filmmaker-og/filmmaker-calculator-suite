import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, TrendingUp, Lightbulb, FileText, Zap, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

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
    // Smooth transition to calculator
    navigate('/calculator');
  };

  return (
    <>
      <Header />
      
      {/* Cinematic Vignette Overlay */}
      <div className="vignette" />
      
      <div className="min-h-screen bg-bg-void text-text-primary pt-16 pb-12 px-4 md:px-8 font-sans relative">
        
        {/* Subtle top spotlight glow */}
        <div
          className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
          style={{
            width: '100vw',
            height: '50vh',
            background: `
              radial-gradient(
                ellipse 50% 40% at 50% 0%,
                rgba(255, 215, 0, 0.04) 0%,
                rgba(255, 215, 0, 0.01) 50%,
                transparent 80%
              )
            `,
          }}
        />
        
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          
          {/* ═══════════════════════════════════════════════════════════════════
              HEADER SECTION - Documentation Style
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="space-y-4 pb-8 animate-fade-in"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="flex items-center space-x-2 text-gold/80 text-sm font-mono uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              <span>Documentation / Readme.md</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bebas text-white tracking-wide leading-tight">
              Filmmaker <span className="text-gold">Waterfall</span> Protocol
            </h1>
            
            <p className="text-lg text-text-mid leading-relaxed max-w-2xl">
              This is how money moves through a film deal—from acquisition to your pocket. Most producers don't see this math until they've already signed away their upside.
            </p>
            
            {/* Premium divider */}
            <div className="premium-divider mt-6" />
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              MAIN CONTENT CARD - Deep Matte Black Treatment
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="relative overflow-hidden animate-fade-in"
            style={{ 
              animationDelay: '0.2s',
              background: 'linear-gradient(180deg, #0A0A0A 0%, #080808 100%)',
              border: '1px solid rgba(255, 215, 0, 0.10)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.02), 0 4px 24px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Subtle gold glow at top */}
            <div 
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.25), transparent)',
              }}
            />
            
            <div className="p-6 md:p-8 space-y-6">
              
              {/* Section 1: Why This Exists */}
              <div className="flex items-start space-x-4">
                <div 
                  className="p-2.5 flex-shrink-0"
                  style={{
                    background: 'rgba(255, 215, 0, 0.06)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <ShieldCheck className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Why this exists</h3>
                  <p className="text-text-dim text-sm leading-relaxed">
                    Most filmmakers guess their numbers. You won't. This calculator models the flow of money from acquisition sale to your pocket—accounting for sales agent fees, distributor commissions, and investor recoupment. Whether you're selling to Netflix, Amazon, Tubi, or an independent buyer, you need to know where the money goes before you promise anyone a return.
                  </p>
                </div>
              </div>

              {/* Subtle divider */}
              <div className="border-t border-white/5" />

              {/* Section 2: The Investor Advantage */}
              <div className="flex items-start space-x-4">
                <div 
                  className="p-2.5 flex-shrink-0"
                  style={{
                    background: 'rgba(255, 215, 0, 0.06)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <TrendingUp className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">The Investor Advantage</h3>
                  <p className="text-text-dim text-sm leading-relaxed">
                    Investors back producers who understand the risks. When you can walk someone through off-the-tops, collection fees, and recoupment positions, you're speaking their language. A clear waterfall demonstrates competence—and competence closes deals.
                  </p>
                </div>
              </div>

              {/* Subtle divider */}
              <div className="border-t border-white/5" />

              {/* Section 3: The Learning Curve Is The Point */}
              <div className="flex items-start space-x-4">
                <div 
                  className="p-2.5 flex-shrink-0"
                  style={{
                    background: 'rgba(255, 215, 0, 0.06)',
                    border: '1px solid rgba(255, 215, 0, 0.15)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <Lightbulb className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-2">The Learning Curve Is The Point</h3>
                  <p className="text-text-dim text-sm leading-relaxed">
                    If parts of this feel unfamiliar, that's expected. Film finance is deliberately complex—it protects the people who understand it. The terminology exists for a reason, and learning it is how you stop leaving money on the table.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              PRO TIP - GOLD THEME (Brand Consistent)
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="relative overflow-hidden animate-fade-in"
            style={{ 
              animationDelay: '0.3s',
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(255, 215, 0, 0.02) 100%)',
              borderLeft: '4px solid rgba(255, 215, 0, 0.6)',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              boxShadow: 'inset 0 0 30px rgba(255, 215, 0, 0.03)',
            }}
          >
            <div className="p-4 flex items-start space-x-3">
              <Zap className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
              <div className="text-sm leading-relaxed">
                <span className="font-bold text-gold">Pro Tip:</span>
                <span className="text-white/80 ml-1">
                  Don't let unfamiliar terminology stop you. A <span className="text-white font-semibold">Glossary</span> is in development—for now, look for the 
                </span>
                <span className="inline-flex items-center justify-center w-5 h-5 mx-1 text-xs font-bold text-gold border border-gold/40 rounded-full bg-gold/10">i</span>
                <span className="text-white/80">icons throughout the calculator for quick definitions.</span>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              FAQ SECTION - Wrapped in Matte Gray Container
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            {/* FAQ Container Card - Matte Gray */}
            <div
              style={{
                background: '#111111',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* FAQ Header */}
              <h3 className="text-2xl font-bebas text-white tracking-wide mb-4">
                Frequently Asked <span className="text-gold">Questions</span>
              </h3>
              
              {/* FAQ Accordion */}
              <div 
                className="overflow-hidden"
                style={{
                  background: '#0A0A0A',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {faqItems.map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "transition-all duration-200",
                      index !== faqItems.length - 1 && "border-b border-white/5"
                    )}
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 text-left transition-all duration-200",
                        "hover:bg-white/[0.02]",
                        openFAQ === index && "bg-gold/[0.03]"
                      )}
                    >
                      {/* Chapter Number */}
                      <div 
                        className={cn(
                          "w-7 h-7 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold transition-colors duration-200",
                          openFAQ === index ? "text-gold" : "text-text-dim"
                        )}
                        style={{
                          background: openFAQ === index ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          border: openFAQ === index ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      
                      {/* Question */}
                      <span className={cn(
                        "flex-1 text-sm font-medium transition-colors duration-200",
                        openFAQ === index ? "text-white" : "text-text-mid"
                      )}>
                        {item.question}
                      </span>
                      
                      {/* Chevron */}
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 flex-shrink-0 transition-all duration-200",
                          openFAQ === index ? "text-gold rotate-180" : "text-text-dim"
                        )}
                      />
                    </button>
                    
                    {/* Answer - Collapsible */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-out",
                        openFAQ === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div 
                        className="px-4 pb-4 pl-[60px] text-sm text-text-dim leading-relaxed"
                        style={{
                          borderLeft: '2px solid rgba(255, 215, 0, 0.15)',
                          marginLeft: '18px',
                        }}
                      >
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              ACTION AREA - CTA
              ═══════════════════════════════════════════════════════════════════ */}
          <div 
            className="pt-8 flex flex-col items-center gap-4 animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="premium-divider w-full mb-4" />
            
            <Button 
              onClick={handleInitialize}
              className="bg-gold hover:bg-gold-bright text-black font-bold text-base px-10 py-6 rounded-md transition-all duration-300 group"
              style={{
                boxShadow: '0 0 30px rgba(255, 215, 0, 0.25), 0 10px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              Initialize Simulation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="text-text-dim text-xs font-mono tracking-wider">
              v2.0.5-stable
            </div>
          </div>

          {/* Back Link */}
          <div 
            className="pt-4 flex justify-center animate-fade-in"
            style={{ animationDelay: '0.6s' }}
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-text-dim hover:text-gold transition-colors text-sm"
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
