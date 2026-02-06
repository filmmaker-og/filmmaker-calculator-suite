import { useEffect } from "react";
import Header from "@/components/Header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Share2, Printer, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WaterfallInfo = () => {
  // Fix scroll position on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-void text-text-primary pt-24 pb-12 px-4 md:px-8 font-sans">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          
          {/* Breadcrumb / Nav */}
          <div className="flex items-center gap-4 text-sm text-text-dim mb-8">
            <Link to="/intro" className="flex items-center gap-1 hover:text-gold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documentation</span>
            </Link>
            <span className="text-border-default">/</span>
            <span className="text-gold">Protocol 04: Waterfall</span>
          </div>

          {/* Title Section */}
          <div className="space-y-4 border-b border-border-default pb-8">
            <h1 className="text-5xl md:text-6xl font-bebas text-white tracking-wide">
              The <span className="text-gold">Waterfall</span> Protocol
            </h1>
            <p className="text-xl text-text-mid leading-relaxed max-w-2xl">
              Understanding the priority of payments is the single most critical skill for a producer. 
              This is the proprietary logic used by sales agents to distribute revenue.
            </p>
          </div>

          {/* Core Concept: The Bucket Metaphor */}
          <div className="bg-bg-surface border border-border-default rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bebas text-white">The "Bucket" Metaphor</h2>
            <div className="prose prose-invert prose-p:text-text-mid max-w-none">
              <p>
                Imagine a series of buckets arranged vertically. Water (money) is poured into the top bucket. 
                Only when the first bucket is full does it spill over into the next one.
              </p>
              <p>
                If the flow of water stops, the buckets at the bottom stay dry. 
                <span className="text-gold font-bold"> You (the Producer) are at the bottom.</span>
              </p>
            </div>
          </div>

          {/* The 4 Stages of the Waterfall */}
          <div className="space-y-8 pt-4">
            <h2 className="text-3xl font-bebas text-white">The 4 Stages of Recoupment</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Stage 1 */}
              <div className="bg-bg-card border border-gold/20 rounded-lg p-6 relative overflow-hidden group hover:border-gold/40 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-bebas text-8xl text-gold group-hover:scale-110 transition-transform">01</div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Sales & Fees</h3>
                <p className="text-text-dim text-sm leading-relaxed relative z-10">
                  Before anyone sees a dime, the Sales Agent takes their commission (10-20%) and recoups their expenses (Marketing/Festivals).
                </p>
              </div>

              {/* Stage 2 */}
              <div className="bg-bg-card border border-gold/20 rounded-lg p-6 relative overflow-hidden group hover:border-gold/40 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-bebas text-8xl text-gold group-hover:scale-110 transition-transform">02</div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Debt Repayment</h3>
                <p className="text-text-dim text-sm leading-relaxed relative z-10">
                  Lenders get paid next. Senior Debt (Banks) first, then Mezzanine/Gap lenders. They get their principal + interest.
                </p>
              </div>

              {/* Stage 3 */}
              <div className="bg-bg-card border border-gold/20 rounded-lg p-6 relative overflow-hidden group hover:border-gold/40 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-bebas text-8xl text-gold group-hover:scale-110 transition-transform">03</div>
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Equity Recoupment</h3>
                <p className="text-text-dim text-sm leading-relaxed relative z-10">
                  Investors get their money back (120% usually). They need to be made whole plus a premium before profits are split.
                </p>
              </div>

              {/* Stage 4 */}
              <div className="bg-bg-card border border-gold rounded-lg p-6 relative overflow-hidden group shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                <div className="absolute top-0 right-0 p-4 opacity-20 font-bebas text-8xl text-gold group-hover:scale-110 transition-transform">04</div>
                <h3 className="text-xl font-bold text-gold mb-2 relative z-10">Net Profits</h3>
                <p className="text-white text-sm leading-relaxed relative z-10">
                  Finally, what's left is split 50/50 between the Investor Pool and the Producer Pool. This is your "Backend."
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 border-t border-border-default flex justify-center">
            <Button 
              onClick={() => window.print()}
              variant="outline"
              className="border-gold/30 text-gold hover:bg-gold/10 gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Protocol
            </Button>
          </div>

        </div>
      </div>
    </>
  );
};

export default WaterfallInfo;
