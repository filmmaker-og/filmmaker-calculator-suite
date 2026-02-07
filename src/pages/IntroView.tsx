import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, FileText, Info, Lock, Eye, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";

const IntroView = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-void text-text-primary pt-24 pb-12 px-4 md:px-8 font-sans">
        <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
          
          {/* Header Section - Notion/Wiki Style */}
          <div className="space-y-4 border-b border-border-default pb-8">
            <div className="flex items-center space-x-2 text-gold/80 text-sm font-mono uppercase tracking-widest">
              <FileText className="w-4 h-4" />
              <span>Documentation / Readme.md</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wide">
              Filmmaker <span className="text-gold">Waterfall</span> Protocol
            </h1>
            <p className="text-xl text-text-mid leading-relaxed max-w-2xl">
              You are about to enter a professional financial simulation. This tool is designed to arm you with the clarity needed to close investors and protect your backend.
            </p>
          </div>

          {/* The Manifesto: "Shadow Authority" */}
          <div className="relative bg-bg-surface border border-gold/20 p-8 rounded-lg overflow-hidden">
            {/* Ambient background glow - made subtler for matte look */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gold/10 rounded-full border border-gold/20">
                  <Eye className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-sm font-mono uppercase tracking-widest text-gold">Mission Statement</h3>
              </div>
              
              <h2 className="text-2xl font-bold text-white font-bebas tracking-wide">
                Democratizing the Business of Film
              </h2>
              
              <div className="space-y-4 text-text-mid leading-relaxed text-sm md:text-base">
                <p>
                  For too long, the mechanics of film finance have been obscured by gatekeepers. 
                  Agencies, distributors, and studios thrive on information asymmetry. They know the numbers; you don't.
                </p>
                <p>
                  <span className="text-white font-medium">We built this protocol to level the playing field.</span>
                </p>
                <p>
                  We operate in the shadows so you can stand in the light. This tool extracts the proprietary logic 
                  used by top-tier entertainment lawyers and sales agents, putting institutional-grade modeling 
                  directly into your hands. No fees. No middlemen. Just the math.
                </p>
              </div>
            </div>
          </div>

          {/* The "Why" - Tactical Value */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-bg-surface border border-border-default rounded-lg p-6 space-y-3 hover:border-gold/30 transition-colors">
              <div className="p-2 w-fit bg-gold/10 rounded-md">
                <ShieldCheck className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-white">Protect Your Backend</h3>
              <p className="text-text-dim text-sm leading-relaxed">
                Most filmmakers sign deals that guarantee they never see a dollar. This protocol reveals exactly 
                how money trickles down, so you can spot the leaks before you sign.
              </p>
            </div>

            <div className="bg-bg-surface border border-border-default rounded-lg p-6 space-y-3 hover:border-gold/30 transition-colors">
              <div className="p-2 w-fit bg-gold/10 rounded-md">
                <TrendingUp className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-lg font-bold text-white">Close Investors</h3>
              <p className="text-text-dim text-sm leading-relaxed">
                Confidence closes deals. When you present a clear, mathematical path to recoupment (ROI), 
                you shift the conversation from "artistic risk" to "financial opportunity."
              </p>
            </div>
          </div>

          {/* Callout / Note — Gold-only */}
          <div className="bg-gold/[0.04] border-l-4 border-gold/50 p-4 rounded-r-md flex items-start space-x-3">
            <Info className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
            <div className="text-sm text-text-mid">
              <span className="font-bold text-gold">Pro Tip:</span> Don't worry if you see terms you don't recognize. You can access the <span className="text-white font-semibold">Glossary</span> at any time via the menu in the top right corner.
            </div>
          </div>

          {/* FAQ Section - Expanded */}
          <div className="space-y-6 pt-4">
            <h3 className="text-2xl font-bebas text-white border-b border-border-default pb-2">Protocol FAQ</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border-default">
                <AccordionTrigger className="text-text-primary hover:text-gold hover:no-underline font-medium">
                  Who is this tool for?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim leading-relaxed">
                  This protocol is built for <span className="text-white">Independent Producers</span>, <span className="text-white">Directors</span>, and <span className="text-white">Investors</span>. 
                  Whether you are raising $50k or $5M, the mechanics of recoupment remain the same. If you intend to sell your film for profit, you need this.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2" className="border-border-default">
                <AccordionTrigger className="text-text-primary hover:text-gold hover:no-underline font-medium">
                  How do I use these results?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim leading-relaxed">
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Pitch Decks:</strong> Screenshot the "Waterfall" chart to show ROI potential.</li>
                    <li><strong>Deal Memos:</strong> Use the "Net Producer Share" as your baseline for negotiation.</li>
                    <li><strong>Financing:</strong> Show investors exactly where they sit in the "Capital Stack" priority.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-border-default">
                <AccordionTrigger className="text-text-primary hover:text-gold hover:no-underline font-medium">
                  Is this legal financial advice?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  No. This is a simulation tool for estimation and planning purposes only. Always consult with a qualified entertainment attorney or accountant for final deal structures.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4" className="border-border-default">
                <AccordionTrigger className="text-text-primary hover:text-gold hover:no-underline font-medium">
                  What is a "Waterfall"?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  A waterfall is the priority order in which revenue is distributed. 
                  <span 
                    className="text-gold cursor-pointer hover:underline ml-1 font-medium"
                    onClick={() => navigate('/waterfall-info')}
                  >
                    Read the full breakdown here →
                  </span>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Action Area - NOW WITH DUAL BUTTONS */}
          <div className="pt-8 border-t border-border-default space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <Button 
              onClick={() => navigate('/calculator')}
              className="w-full md:flex-1 bg-gold hover:bg-gold-bright text-black font-bold text-lg px-8 py-6 rounded-md shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 group"
            >
              Initialize Simulation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button 
              onClick={() => navigate('/waterfall-info')}
              className="w-full md:w-auto border border-border-subtle bg-bg-surface hover:bg-bg-elevated text-text-mid hover:text-white font-medium text-lg px-8 py-6 rounded-md transition-all duration-300 group"
            >
              <BookOpen className="mr-2 w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              Read Protocol
            </Button>
          </div>
          
          <div className="text-center md:text-left text-text-dim text-sm font-mono flex items-center justify-center md:justify-start gap-2">
              <Lock className="w-3 h-3" />
              v2.0.5-stable
          </div>

        </div>
      </div>
    </>
  );
};

export default IntroView;
