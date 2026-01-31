import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, HelpCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    'dark' | 'spark' | 'forge' | 'glow' | 'reveal' | 'complete'
  >('dark');

  useEffect(() => {
    // Cinematic animation sequence - forging the F from light
    const timers = [
      setTimeout(() => setAnimationPhase('spark'), 300),      // Spark appears
      setTimeout(() => setAnimationPhase('forge'), 700),      // F begins forming
      setTimeout(() => setAnimationPhase('glow'), 1400),      // F complete, glow intensifies
      setTimeout(() => setAnimationPhase('reveal'), 2200),    // Transition begins
      setTimeout(() => setAnimationPhase('complete'), 2800),  // Homepage revealed
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const showSplash = animationPhase !== 'complete';
  const showForge = animationPhase !== 'dark';
  const forgeComplete = ['glow', 'reveal', 'complete'].includes(animationPhase);
  const isRevealing = ['reveal', 'complete'].includes(animationPhase);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

      {/* ═══════════════════════════════════════════════════════════════════
          CINEMATIC SPLASH - Forging the F from Light
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${
          isRevealing ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        {/* Particle field - subtle floating embers */}
        <div className="absolute inset-0 overflow-hidden">
          {showForge && [...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-float-particle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 40}%`,
                backgroundColor: 'rgba(212, 175, 55, 0.6)',
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Central spark point */}
        <div
          className={`absolute w-2 h-2 rounded-full transition-all ${
            animationPhase === 'spark' ? 'opacity-100 scale-100' :
            animationPhase === 'dark' ? 'opacity-0 scale-0' : 'opacity-0 scale-150'
          }`}
          style={{
            backgroundColor: '#F9E076',
            boxShadow: '0 0 30px #F9E076, 0 0 60px #D4AF37',
            transitionDuration: animationPhase === 'spark' ? '400ms' : '300ms',
          }}
        />

        {/* The F - forged from light */}
        <div
          className={`relative transition-all ${
            showForge && animationPhase !== 'spark' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{
            transitionDuration: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Outer glow - intensifies as forge completes */}
          <div
            className={`absolute inset-0 transition-opacity ${
              forgeComplete ? 'opacity-100' : 'opacity-30'
            }`}
            style={{
              width: '200px',
              height: '200px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 70%)',
              filter: 'blur(40px)',
              transitionDuration: '800ms',
            }}
          />

          {/* Inner glow - core heat */}
          <div
            className={`absolute transition-opacity ${
              forgeComplete ? 'opacity-100' : 'opacity-50'
            }`}
            style={{
              width: '120px',
              height: '120px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(249, 224, 118, 0.4) 0%, transparent 60%)',
              filter: 'blur(20px)',
              transitionDuration: '600ms',
            }}
          />

          {/* The F letterform */}
          <span
            className="font-bebas text-8xl sm:text-9xl relative z-10 block"
            style={{
              color: forgeComplete ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              textShadow: forgeComplete
                ? '0 0 40px rgba(212, 175, 55, 0.8), 0 0 80px rgba(212, 175, 55, 0.4)'
                : '0 0 20px rgba(212, 175, 55, 0.3)',
              transition: 'all 600ms ease-out',
            }}
          >
            F
          </span>
        </div>

        {/* Tagline - appears after forge */}
        <p
          className={`absolute mt-48 text-xs tracking-[0.4em] uppercase transition-all ${
            forgeComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            color: '#D4AF37',
            transitionDuration: '600ms',
            transitionDelay: forgeComplete ? '200ms' : '0ms',
          }}
        >
          FILMMAKER.OG
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER - Minimal, authoritative
          ═══════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '100ms' : '0ms' }}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-bebas text-lg tracking-[0.2em] text-white/80">
            FILMMAKER
          </span>
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
          HERO - The F with radial glow, single CTA
          ═══════════════════════════════════════════════════════════════════ */}
      <main
        className={`flex-1 flex flex-col items-center justify-center px-8 transition-all duration-700 ${
          animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '200ms' : '0ms' }}
      >
        <div className="w-full max-w-sm flex flex-col items-center text-center">

          {/* F Logo with Radial Glow */}
          <div className="relative mb-10">
            {/* Outer glow ring */}
            <div
              className="absolute"
              style={{
                width: '280px',
                height: '280px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 40%, transparent 65%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Inner glow - warm core */}
            <div
              className="absolute"
              style={{
                width: '160px',
                height: '160px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(249, 224, 118, 0.2) 0%, rgba(212, 175, 55, 0.1) 50%, transparent 70%)',
                filter: 'blur(15px)',
              }}
            />
            {/* Subtle pulse animation on the glow */}
            <div
              className="absolute animate-pulse-slow"
              style={{
                width: '200px',
                height: '200px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 60%)',
                filter: 'blur(25px)',
              }}
            />
            {/* The F */}
            <span
              className="font-bebas text-8xl relative z-10 block"
              style={{
                color: '#FFFFFF',
                textShadow: '0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.2)',
              }}
            >
              F
            </span>
          </div>

          {/* Title */}
          <h1 className="font-bebas text-2xl sm:text-3xl tracking-[0.15em] text-white mb-4 leading-tight">
            STREAMER ACQUISITION
            <br />
            <span className="text-gold">CALCULATOR</span>
          </h1>

          {/* Subtitle */}
          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-xs">
            See exactly how the money flows before you sign.
            Model deals like the agencies do.
          </p>

          {/* Single CTA */}
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

          {/* Subtle reassurance */}
          <p className="text-white/25 text-[10px] tracking-[0.2em] uppercase mt-6">
            Free · No signup required
          </p>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER - Legal
          ═══════════════════════════════════════════════════════════════════ */}
      <footer
        className={`py-6 text-center transition-all duration-500 ${
          animationPhase === 'complete' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '400ms' : '0ms' }}
      >
        <p className="text-[9px] tracking-widest text-white/20 uppercase">
          Educational purposes only
        </p>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════
          HELP MODAL
          ═══════════════════════════════════════════════════════════════════ */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-sm mx-4">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl tracking-wider text-gold">
              WHAT IS THIS?
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm leading-relaxed pt-2">
              This calculator models how money flows in streamer acquisition deals —
              the kind where Netflix, Amazon, or Apple buys your film outright.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-white/50 leading-relaxed">
            <p>
              <strong className="text-white/80">The waterfall</strong> is the order in which
              revenue gets distributed: first to sales agents and guilds, then to debt holders,
              then to equity investors, and finally — if anything's left — to you.
            </p>
            <p>
              Most producers don't model this before signing. This tool helps you see
              what you'll actually take home.
            </p>
          </div>
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-[10px] text-white/30 leading-relaxed">
              <strong className="text-white/50">Disclaimer:</strong> For educational purposes only.
              This is a simplified model. Consult a qualified entertainment attorney for actual deals.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
