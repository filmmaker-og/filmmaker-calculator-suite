import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ChevronDown, DollarSign, Layers, Percent, GitBranch } from 'lucide-react';
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
  bgElevated: '#1A1A1A',   // Even more elevated
  
  // Gold System — Radiant but controlled
  gold: '#FFD700',
  goldMuted: 'rgba(255, 215, 0, 0.45)',
  goldSubtle: 'rgba(255, 215, 0, 0.08)',
  goldGlow: 'rgba(255, 215, 0, 0.25)',
  goldFill: 'rgba(255, 215, 0, 0.12)',
  goldRadiant: 'rgba(255, 215, 0, 0.18)',  // For header glow effect
  
  // Borders
  borderMatte: '#1A1A1A',
  borderSubtle: '#222222',
  borderGold: 'rgba(255, 215, 0, 0.3)',
  
  // Text
  textPrimary: '#FFFFFF',
  textMid: '#B0B0B0',
  textDim: '#6B6B6B',
  
  // Radius
  radiusMd: '12px',
  radiusLg: '14px',
  radiusSm: '8px',
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
   SECTION HEADER COMPONENT — Radiant Gold Left Border + Matte Gray Surface
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
    {/* Radiant Gold Left Border Accent */}
    <div 
      className="w-1 flex-shrink-0"
      style={{ 
        background: `linear-gradient(180deg, ${tokens.gold} 0%, ${tokens.goldMuted} 100%)`,
        boxShadow: `0 0 12px ${tokens.goldGlow}`,
      }}
    />
    
    {/* Chapter Number Box with Gold Fill */}
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

/* ═══════════════════════════════════════════════════════════════════════════
   MINI-WIKI PREVIEW CARD — Shows actual content preview, clickable
   ═══════════════════════════════════════════════════════════════════════════ */
interface MiniWikiPreviewProps {
  number: string;
  title: string;
  icon: React.ReactNode;
  previewContent: {
    label: string;
    value: string;
  }[];
  exampleNote?: string;
  onClick: () => void;
}

const MiniWikiPreview = ({ number, title, icon, previewContent, exampleNote, onClick }: MiniWikiPreviewProps) => (
  <button
    onClick={onClick}
    className="w-full text-left group transition-all duration-200 hover:scale-[1.01]"
    style={{ 
      background: tokens.bgMatte,
      border: `1px solid ${tokens.borderMatte}`,
      borderRadius: tokens.radiusLg,
      overflow: 'hidden',
    }}
  >
    {/* Mini Header with Gold Accent */}
    <div 
      className="flex items-stretch"
      style={{ 
        background: `linear-gradient(90deg, ${tokens.goldRadiant} 0%, ${tokens.bgHeader} 20%, ${tokens.bgHeader} 100%)`,
        borderBottom: `1px solid ${tokens.borderMatte}`,
      }}
    >
      {/* Gold Left Border */}
      <div 
        className="w-1 flex-shrink-0"
        style={{ 
          background: tokens.gold,
          boxShadow: `0 0 8px ${tokens.goldGlow}`,
        }}
      />
      
      {/* Number Box */}
      <div 
        className="flex items-center justify-center px-3 py-3"
        style={{ 
          borderRight: `1px solid ${tokens.borderSubtle}`,
          minWidth: '44px',
          background: tokens.goldFill,
        }}
      >
        <span 
          className="font-bebas text-base tracking-wide"
          style={{ color: tokens.gold }}
        >
          {number}
        </span>
      </div>
      
      {/* Icon + Title */}
      <div className="flex items-center gap-2 px-3 py-3">
        <span style={{ color: tokens.goldMuted }}>{icon}</span>
        <h3 
          className="font-bold text-xs uppercase tracking-widest"
          style={{ color: tokens.textPrimary }}
        >
          {title}
        </h3>
      </div>
      
      {/* Arrow on hover */}
      <div className="ml-auto flex items-center pr-3">
        <ArrowRight 
          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: tokens.gold }}
        />
      </div>
    </div>
    
    {/* Preview Content — Example of what they'll see */}
    <div className="p-4 space-y-3">
      {/* Example Label */}
      <div 
        className="text-[10px] uppercase tracking-widest font-medium"
        style={{ color: tokens.goldMuted }}
      >
        Preview
      </div>
      
      {/* Preview Items */}
      <div className="space-y-2">
        {previewContent.map((item, idx) => (
          <div 
            key={idx}
            className="flex justify-between items-center py-2 px-3"
            style={{ 
              background: tokens.bgSurface,
              borderRadius: tokens.radiusSm,
              border: `1px solid ${tokens.borderSubtle}`,
            }}
          >
            <span className="text-xs" style={{ color: tokens.textMid }}>
              {item.label}
            </span>
            <span 
              className="text-xs font-mono font-semibold"
              style={{ color: tokens.textPrimary }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
      
      {/* Example Note */}
      {exampleNote && (
        <p 
          className="text-[11px] italic pt-1"
          style={{ color: tokens.textDim }}
        >
          {exampleNote}
        </p>
      )}
      
      {/* Learn More Link */}
      <div 
        className="flex items-center gap-1 pt-2 text-xs font-medium group-hover:gap-2 transition-all"
        style={{ color: tokens.gold }}
      >
        <span>Learn more</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  </button>
);

const IntroView = () => {
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleStartSimulation = () => {
    navigate('/budget-info');
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
              SECTION 01 — WHAT'S YOUR MODEL? (Mini-Wiki Previews)
              ═══════════════════════════════════════════════════════════════ */}
          <div 
            className="overflow-hidden animate-fade-in"
            style={{ 
              background: tokens.bgMatte,
              border: `1px solid ${tokens.borderMatte}`,
              borderRadius: tokens.radiusLg,
            }}
          >
            <SectionHeader number="01" title="What's Your Model?" />
            
            <div className="p-5 space-y-5">
              {/* Intro Context */}
              <p 
                className="text-sm leading-relaxed"
                style={{ color: tokens.textMid }}
              >
                Here's an example of what you'll model. Each section below previews the actual 
                content—click any to dive deeper before starting your simulation.
              </p>
              
              {/* Mini-Wiki Previews — 2×2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PRODUCTION BUDGET Preview */}
                <MiniWikiPreview
                  number="01"
                  title="Production Budget"
                  icon={<DollarSign className="w-4 h-4" />}
                  previewContent={[
                    { label: "Negative Cost", value: "$850,000" },
                    { label: "Above-the-Line", value: "$127,500" },
                    { label: "Contingency", value: "$42,500" },
                  ]}
                  exampleNote="This is what it costs to make the film."
                  onClick={() => navigate('/budget-info')}
                />
                
                {/* CAPITAL STACK Preview */}
                <MiniWikiPreview
                  number="02"
                  title="Capital Stack"
                  icon={<Layers className="w-4 h-4" />}
                  previewContent={[
                    { label: "Senior Debt", value: "$340,000" },
                    { label: "Equity", value: "$425,000" },
                    { label: "Deferrals", value: "$85,000" },
                  ]}
                  exampleNote="How production is funded."
                  onClick={() => navigate('/capital-info')}
                />
                
                {/* DISTRIBUTION FEES Preview */}
                <MiniWikiPreview
                  number="03"
                  title="Distribution Fees"
                  icon={<Percent className="w-4 h-4" />}
                  previewContent={[
                    { label: "Sales Agent", value: "10%" },
                    { label: "Collection Agent", value: "5%" },
                    { label: "Net to Waterfall", value: "85%" },
                  ]}
                  exampleNote="What comes off the top first."
                  onClick={() => navigate('/fees-info')}
                />
                
                {/* RECOUPMENT WATERFALL Preview */}
                <MiniWikiPreview
                  number="04"
                  title="Recoupment Waterfall"
                  icon={<GitBranch className="w-4 h-4" />}
                  previewContent={[
                    { label: "Position 1", value: "Senior Debt" },
                    { label: "Position 2", value: "Equity" },
                    { label: "Position 3", value: "Profit Split" },
                  ]}
                  exampleNote="The order money flows out."
                  onClick={() => navigate('/waterfall-info')}
                />
                
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
              SECTION 03 — FAQ
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
            
            {/* CTA Button — Routes to /budget-info (first wiki page) */}
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
