import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, TrendingUp, Lightbulb, FileText, Info } from 'lucide-react';
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
      <div className="min-h-screen bg-bg-void text-text-primary pt-16 pb-12 px-4 md:px-8 font-sans">
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
              This is how money moves through a film deal—from acquisition to your pocket. Most producers don't see this math until they've already signed away their upside.
            </p>
          </div>

          {/* Section 1: Why This Exists */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-6 md:p-8 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10 rounded-md">
                <ShieldCheck className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Why this exists</h3>
                <p className="text-text-dim text-sm leading-relaxed">
                  Most filmmakers guess their numbers. You won't. This calculator models the flow of money from acquisition sale to your pocket—accounting for sales agent fees, distributor commissions, and investor recoupment. Whether you're selling to Netflix, Amazon, Tubi, or an independent buyer, you need to know where the money goes before you promise anyone a return.
                </p>
              </div>
            </div>

            {/* Section 2: The Investor Advantage */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10 rounded-md">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">The Investor Advantage</h3>
                <p className="text-text-dim text-sm leading-relaxed">
                  Investors back producers who understand the risks. When you can walk someone through off-the-tops, collection fees, and recoupment positions, you're speaking their language. A clear waterfall demonstrates competence—and competence closes deals.
                </p>
              </div>
            </div>

            {/* Section 3: The Learning Curve Is The Point */}
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-gold/10 rounded-md">
                <Lightbulb className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">The Learning Curve Is The Point</h3>
                <p className="text-text-dim text-sm leading-relaxed">
                  If parts of this feel unfamiliar, that's expected. Film finance is deliberately complex—it protects the people who understand it. The terminology exists for a reason, and learning it is how you stop leaving money on the table.
                </p>
              </div>
            </div>
          </div>

          {/* Callout / Note */}
          <div className="bg-blue-900/10 border-l-4 border-blue-500/50 p-4 rounded-r-md flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-200/80">
              <span className="font-bold text-blue-200">Pro Tip:</span> Don't let unfamiliar terminology stop you. A <span className="text-white font-semibold">Glossary</span> is in development—for now, look for the <span className="text-blue-300">ℹ️</span> icons throughout the calculator for quick definitions.
            </div>
          </div>

          {/* FAQ Section - Accordion */}
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl font-bebas text-white">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border-default">
                <AccordionTrigger className="text-left text-text-primary hover:text-gold hover:no-underline">
                  Is this legal financial advice?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  No. This is a simulation tool for estimation and planning purposes only. Always consult with a qualified entertainment attorney or accountant for final deal structures.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border-default">
                <AccordionTrigger className="text-left text-text-primary hover:text-gold hover:no-underline">
                  Can I save my results?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  Yes. At the end of the simulation, you'll have options to export or view a summary of your waterfall model.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border-default">
                <AccordionTrigger className="text-left text-text-primary hover:text-gold hover:no-underline">
                  Is this for theatrical releases?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  No. This calculator is built for <span className="text-white font-medium">streamer acquisition and direct sales</span>—the dominant path for indie films today. It models what happens when you sell your finished film to Netflix, Amazon, Hulu, Tubi, or an independent buyer. That's where most indie deals close.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-border-default">
                <AccordionTrigger className="text-left text-text-primary hover:text-gold hover:no-underline">
                  I don't understand all the terms yet. Should I wait?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  No. The best way to learn recoupment is to <span className="text-white font-medium">interact with a working model</span>. Start with a simple scenario and adjust as you go. If you get stuck, use the in-app definitions or reach out—we'll walk you through it.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="border-border-default">
                <AccordionTrigger className="text-left text-text-primary hover:text-gold hover:no-underline">
                  How accurate is this compared to real deals?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  This calculator uses the same waterfall logic found in actual Operating Agreements and distribution contracts. The math is <span className="text-white font-medium">institutional-grade</span>. What varies deal-to-deal are specific fee percentages, expense caps, and waterfall positions—but the structural mechanics are universal. If you're modeling a real deal, adjust the inputs to match your term sheet.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6" className="border-border-default">
                <AccordionTrigger className="text-left text-text-primary hover:text-gold hover:no-underline">
                  I'm new to this. Where do I start?
                </AccordionTrigger>
                <AccordionContent className="text-text-dim">
                  <p>
                    Just follow the steps. The waterfall process is broken into <span className="text-white font-medium">4 stages</span>. If you get stuck, look for the quick tips inside the calculator. 👇
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Action Area - Centered CTA */}
          <div className="pt-8 flex flex-col items-center gap-4 border-t border-border-default">
            <Button 
              onClick={() => navigate('/calculator')}
              className="bg-gold hover:bg-gold-bright text-black font-bold text-lg px-10 py-6 rounded-md shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300 group"
            >
              Initialize Simulation
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <div className="text-text-dim text-xs font-mono">
              v2.0.4-stable
            </div>
          </div>

          {/* Back Link - Bottom */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => navigate('/home')}
              className="flex items-center gap-2 text-text-dim hover:text-white transition-colors text-sm"
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
