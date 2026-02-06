import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingUp, FileText, Info } from 'lucide-react';
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
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          
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

          {/* The "Why" - GitHub Readme Style Box */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-6 md:p-8 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10 rounded-md">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Why this exists</h3>
                <p className="text-text-dim text-sm leading-relaxed">
                  Most filmmakers guess their numbers. You won't. This calculator models the complex flow of money from box office to your pocket.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10 rounded-md">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">The Investor Advantage</h3>
                <p className="text-text-dim text-sm leading-relaxed">
                  Investors trust producers who understand the risks. By presenting a clear waterfall, you demonstrate competence and transparency.
                </p>
              </div>
            </div>
          </div>

          {/* Callout / Note */}
          <div className="bg-blue-900/10 border-l-4 border-blue-500/50 p-4 rounded-r-md flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-200/80">
              <span className="font-bold text-blue-200">Pro Tip:</span> Don't worry if you see terms you don't recognize. You can access the <span className="text-white font-semibold">Glossary</span> at any time via the menu in the top right corner.
            </div>
          </div>

          {/* FAQ Section - Accordion */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl font-bebas text-white">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border-default">
                <AccordionTrigger className="text-text-primary hover:text-gold hover:no-underline">
                  Is this legal financial advice?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  No. This is a simulation tool for estimation and planning purposes only. Always consult with a qualified entertainment attorney or accountant for final deal structures.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border-default">
                <AccordionTrigger className="text-text-primary hover:text-gold hover:no-underline">
                  Can I save my results?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  Yes. At the end of the simulation, you will have options to export or view a summary of your waterfall model.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border-default">
                <AccordionTrigger className="text-text-primary hover:text-gold hover:no-underline">
                  What is a "Waterfall"?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  A waterfall is the priority order in which revenue is distributed. 
                  <span 
                    className="text-gold cursor-pointer hover:underline ml-1"
                    onClick={() => navigate('/waterfall-info')}
                  >
                    Read the full breakdown here →
                  </span>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Action Area */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border-default">
            <div className="text-text-dim text-sm font-mono">
              v2.0.4-stable
            </div>
            <Button 
              onClick={() => navigate('/calculator')}
              className="w-full md:w-auto bg-gold hover:bg-gold-bright text-black font-bold text-lg px-8 py-6 rounded-md shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 group"
            >
              Initialize Simulation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default IntroView;
