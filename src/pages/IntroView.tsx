import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════════════════
   PRODUCT BIBLE v2.0 TOKENS
   ═══════════════════════════════════════════════════════════════════════════ */
const tokens = {
  // Backgrounds - More matte consistency
  bgVoid: '#000000',
  bgMatte: '#111111',      // Primary card surface
  bgSurface: '#161616',    // Slightly elevated
  
  // Gold System
  gold: '#FFD700',
  goldMuted: 'rgba(255, 215, 0, 0.45)',
  goldSubtle: 'rgba(255, 215, 0, 0.10)',
  goldGlow: 'rgba(255, 215, 0, 0.25)',
  
  // Borders
  borderMatte: '#222222',
  borderGold: 'rgba(255, 215, 0, 0.35)',
  
  // Text
  textPrimary: '#FFFFFF',
  textMid: '#B0B0B0',
  textDim: '#6B6B6B',
  
  // Radius
  radiusMd: '12px',
  radiusLg: '16px',
};

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Is this legal financial advice?",
    answer: "No. This is a planning tool only. Consult an entertainment attorney for final deal structures."
  },
  {
    question: "Is this for theatrical releases?",
    answer: "No. This models streamer acquisitions and direct sales—Netflix, Amazon, Tubi, or independent buyers."
  },
  {
    question: "How accurate is this?",
    answer: "The waterfall logic matches real Operating Agreements. Specific percentages vary by deal, but the mechanics are universal."
  },
  {
    question: "I'm new. Where do I start?",
    answer: "Just follow the steps. Look for the info icons for quick definitions."
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
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* ═══════════════════════════════════════════════════════════════
              HEADER
              ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-4 pt-4 animate-fade-in">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wide leading-tight">
              Waterfall <span style={{ color: tokens.gold }}>Protocol</span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className="text-base leading-relaxed"
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
              WHAT YOU'LL MODEL — Matte Card
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            {/* Card Header with Gold Gradient Top Border */}
            <div 
              className="px-5 py-4"
              style={{ 
                borderBottom: `1px solid ${tokens.borderMatte}`,
                background: `linear-gradient(180deg, rgba(255,215,0,0.06) 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="font-bebas text-lg"
                  style={{ color: tokens.gold }}
                >
                  01
                </span>
                <h2 
                  className="font-bold text-sm uppercase tracking-wide"
                  style={{ color: tokens.textPrimary }}
                >
                  What You'll Model
                </h2>
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span style={{ color: tokens.gold }}>•</span>
                  <p className="text-sm" style={{ color: tokens.textMid }}>
                    <span className="text-white font-medium">Production Budget</span> — Your total cost to make the film
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span style={{ color: tokens.gold }}>•</span>
                  <p className="text-sm" style={{ color: tokens.textMid }}>
                    <span className="text-white font-medium">Capital Stack</span> — How you're funding it (equity, debt, deferrals)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span style={{ color: tokens.gold }}>•</span>
                  <p className="text-sm" style={{ color: tokens.textMid }}>
                    <span className="text-white font-medium">Distribution Fees</span> — What comes off the top before anyone gets paid
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span style={{ color: tokens.gold }}>•</span>
                  <p className="text-sm" style={{ color: tokens.textMid }}>
                    <span className="text-white font-medium">Recoupment</span> — Who gets paid back, and in what order
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              WHY THIS MATTERS — Matte Card
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <div 
              className="px-5 py-4"
              style={{ 
                borderBottom: `1px solid ${tokens.borderMatte}`,
                background: `linear-gradient(180deg, rgba(255,215,0,0.06) 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="font-bebas text-lg"
                  style={{ color: tokens.gold }}
                >
                  02
                </span>
                <h2 
                  className="font-bold text-sm uppercase tracking-wide"
                  style={{ color: tokens.textPrimary }}
                >
                  Why This Matters
                </h2>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-sm leading-relaxed" style={{ color: tokens.textMid }}>
                Most filmmakers don't see this math until they've already signed. Investors back producers who understand the risks. When you can walk through collection fees and recoupment positions, you're speaking their language.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              FAQ — Matte Card
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <div 
              className="px-5 py-4"
              style={{ 
                borderBottom: `1px solid ${tokens.borderMatte}`,
                background: `linear-gradient(180deg, rgba(255,215,0,0.06) 0%, transparent 100%)`,
              }}
            >
              <div className="flex items-center gap-3">
                <span 
                  className="font-bebas text-lg"
                  style={{ color: tokens.gold }}
                >
                  03
                </span>
                <h2 
                  className="font-bold text-sm uppercase tracking-wide"
                  style={{ color: tokens.textPrimary }}
                >
                  Quick Answers
                </h2>
              </div>
            </div>
            
            {/* FAQ Accordion */}
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
                      openFAQ === index ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
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
          <div className="pt-4 flex flex-col items-center gap-6 animate-fade-in">
            {/* Gold Gradient Divider */}
            <div 
              className="h-px w-full"
              style={{ 
                background: `linear-gradient(90deg, transparent 10%, ${tokens.goldMuted} 50%, transparent 90%)` 
              }}
            />
            
            {/* CTA Button - Solid Gold */}
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
