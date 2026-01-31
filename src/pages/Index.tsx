import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, HelpCircle } from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    'dark' | 'logo' | 'line' | 'tagline' | 'complete'
  >('dark');

  useEffect(() => {
    // Premium animation sequence - logo first, then gold line
    const timers = [
      setTimeout(() => setAnimationPhase('logo'), 400),      // Logo fades in
      setTimeout(() => setAnimationPhase('line'), 1200),     // Gold line draws
      setTimeout(() => setAnimationPhase('tagline'), 1800),  // Tagline appears
      setTimeout(() => setAnimationPhase('complete'), 2800), // Transition to homepage
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/auth");
  };

  const showSplash = animationPhase !== 'complete';
  const showLogo = animationPhase !== 'dark';
  const showLine = ['line', 'tagline', 'complete'].includes(animationPhase);
  const showTagline = ['tagline', 'complete'].includes(animationPhase);
  const isRevealing = animationPhase === 'complete';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

      {/* ═══════════════════════════════════════════════════════════════════
          CINEMATIC SPLASH - Logo with Gold Underline
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${
          isRevealing ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        <div className="flex flex-col items-center">
          {/* Logo Image */}
          <div
            className={`transition-all duration-700 ${
              showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <img
              src={filmmakerLogo}
              alt="Filmmaker.OG"
              className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
              style={{
                filter: showLine ? 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.5))' : 'none',
                transition: 'filter 0.6s ease',
              }}
            />
          </div>

          {/* Gold Underline */}
          <div
            className={`mt-6 h-[2px] bg-gold transition-all duration-700 ${
              showLine ? 'w-48 opacity-100' : 'w-0 opacity-0'
            }`}
            style={{
              boxShadow: showLine ? '0 0 20px rgba(212, 175, 55, 0.6)' : 'none',
            }}
          />

          {/* Tagline */}
          <p
            className={`mt-6 text-xs tracking-[0.3em] uppercase transition-all duration-500 ${
              showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ color: 'hsl(var(--gold))' }}
          >
            Know your numbers
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '100ms' : '0ms' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={filmmakerLogo}
              alt="Filmmaker.OG"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bebas text-base tracking-[0.15em] text-white/80">
              FILMMAKER.OG
            </span>
          </div>
          <button
            onClick={() => setShowHelpModal(true)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
            aria-label="What is this?"
          >
            <HelpCircle className="w-5 h-5 text-white/40" />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <main
        className={`flex-1 flex flex-col items-center justify-center px-6 transition-all duration-700 ${
          animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '200ms' : '0ms' }}
      >
        <div className="w-full max-w-sm flex flex-col items-center text-center">

          {/* Logo with Glow */}
          <div className="relative mb-8">
            {/* Glow effect */}
            <div
              className="absolute"
              style={{
                width: '200px',
                height: '200px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 65%)',
                filter: 'blur(30px)',
              }}
            />
            <img
              src={filmmakerLogo}
              alt="Filmmaker.OG"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.4))',
              }}
            />
          </div>

          {/* Title */}
          <h1 className="font-bebas text-2xl sm:text-3xl tracking-[0.1em] text-white mb-4 leading-tight">
            STREAMER ACQUISITION
            <br />
            <span className="text-gold">CALCULATOR</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs">
            See exactly how the money flows before you sign.
            Model deals like the agencies do.
          </p>

          {/* CTA */}
          <Button
            onClick={handleStartClick}
            className="w-full max-w-xs h-14 text-base font-black tracking-[0.15em] rounded-none bg-gold text-black hover:bg-gold-highlight transition-all duration-200 touch-press group"
            style={{
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.35), 0 0 80px rgba(212, 175, 55, 0.15)',
            }}
          >
            <span className="flex items-center justify-center gap-3">
              RUN THE NUMBERS
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>

          {/* Trust signal */}
          <p className="text-white/40 text-[11px] tracking-[0.15em] uppercase mt-6">
            Free · No credit card required
          </p>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════ */}
      <footer
        className={`py-6 text-center transition-all duration-500 ${
          animationPhase === 'complete' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '400ms' : '0ms' }}
      >
        <p className="text-[10px] tracking-widest text-white/40 uppercase">
          Educational purposes only · Not financial advice
        </p>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════
          HELP MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="bg-card border-border max-w-sm mx-4 rounded-none">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider text-gold">
              WHAT IS THIS?
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed pt-2">
              This calculator models how money flows in streamer acquisition deals —
              the kind where Netflix, Amazon, or Apple buys your film outright.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">The waterfall</strong> is the order in which
              revenue gets distributed: first to sales agents and guilds, then to debt holders,
              then to equity investors, and finally — if anything's left — to you.
            </p>
            <p>
              Most producers don't model this before signing. This tool helps you see
              what you'll actually take home.
            </p>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
              <strong className="text-muted-foreground">Disclaimer:</strong> For educational purposes only.
              This is a simplified model. Consult a qualified entertainment attorney for actual deals.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
