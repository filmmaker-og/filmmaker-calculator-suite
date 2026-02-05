import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight } from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [phase, setPhase] = useState<
    'dark' | 'beam' | 'logo' | 'pulse' | 'tagline' | 'complete'
  >('complete'); // Start at complete if returning

  useEffect(() => {
    // Check if this is first visit (no calculator data saved)
    const hasVisited = localStorage.getItem('filmmaker_og_inputs');

    // Skip animation if user has already used the calculator
    if (hasVisited) {
      setPhase('complete');
      return;
    }

    // First time visitor - show animation
    setPhase('dark');
    const timers = [
      setTimeout(() => setPhase('beam'), 300),        // Spotlight beam fans open
      setTimeout(() => setPhase('logo'), 900),        // Logo fades up into light
      setTimeout(() => setPhase('pulse'), 1600),      // Light intensifies
      setTimeout(() => setPhase('tagline'), 2200),    // Tagline + progress bar
      setTimeout(() => setPhase('complete'), 3200),   // Fade to homepage
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const isComplete = phase === 'complete';
  const showBeam = phase !== 'dark';
  const showLogo = phase !== 'dark' && phase !== 'beam';
  const isPulsed = ['pulse', 'tagline', 'complete'].includes(phase);
  const showTagline = ['tagline', 'complete'].includes(phase);

  return (
    <>
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════════════════════════════════════════════════════════════════
            CINEMATIC INTRO - Theatrical Spotlight
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700",
            isComplete ? "opacity-0" : "opacity-100"
          )}
          style={{ 
            backgroundColor: '#000000',
            pointerEvents: isComplete ? 'none' : 'auto',
          }}
        >

          {/* ─── SPOTLIGHT CONE BEAM ─── */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none",
              showBeam ? "animate-spotlight-beam" : "opacity-0"
            )}
            style={{
              background: `
                radial-gradient(
                 ellipse 60% 50% at 50% 0%,
                 rgba(255, 255, 255, 0.18) 0%,
                 rgba(255, 255, 255, 0.08) 30%,
                 rgba(255, 255, 255, 0.02) 50%,
                 transparent 70%
                )
              `,
              clipPath: 'polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)',
            }}
          />

         {/* ─── BRIGHT CORE BEAM ─── */}
         <div
           className={cn(
             "absolute inset-0 pointer-events-none",
             showBeam ? "animate-spotlight-beam" : "opacity-0"
           )}
           style={{
             background: `
               radial-gradient(
                 ellipse 25% 35% at 50% 0%,
                 rgba(255, 255, 255, 0.25) 0%,
                 rgba(255, 255, 255, 0.1) 40%,
                 transparent 60%
               )
             `,
             clipPath: 'polygon(40% 0%, 60% 0%, 75% 100%, 25% 100%)',
           }}
         />

          {/* ─── FOCAL POOL (where light lands) ─── */}
          <div
            className={cn(
             "absolute left-1/2 top-1/2 w-[350px] h-[350px] pointer-events-none transition-all duration-700",
              showLogo ? "opacity-100" : "opacity-0",
              isPulsed && "animate-focal-pulse"
            )}
            style={{
             background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 70%)',
              transform: 'translate(-50%, -50%)',
             filter: 'blur(30px)',
            }}
          />

          {/* ─── CENTER CONTENT ─── */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Logo - emerges and scales */}
            <div
              className={cn(
                "relative transition-all duration-700 ease-out",
                showLogo ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"
              )}
            >
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-28 h-28 object-contain rounded-lg"
                style={{
                  filter: isPulsed ? 'brightness(1.15) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))' : 'brightness(1)',
                  transition: 'filter 0.5s ease',
                }}
              />
            </div>

            {/* Tagline */}
            <p
              className={cn(
                "mt-6 text-xs tracking-[0.35em] uppercase font-semibold transition-all duration-500",
                showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
              style={{ color: '#FFD700' }}
            >
              Know Your Numbers
            </p>

            {/* Animated Progress Line */}
            <div className="mt-5 w-28 h-[2px] overflow-hidden bg-white/10 rounded-full">
              <div
                className={cn(
                  "h-full bg-gold rounded-full",
                  showTagline && "animate-progress-draw"
                )}
                style={{
                  boxShadow: '0 0 12px rgba(255, 215, 0, 0.6)',
                  width: showTagline ? undefined : '0%',
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            HOMEPAGE - With Spotlight
            ═══════════════════════════════════════════════════════════════════ */}
        <main
          className={`flex-1 flex flex-col items-center justify-center px-6 pb-24 transition-all duration-700 ${
            isComplete ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Spotlight glow from above */}
          <div
            className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '100vw',
              height: '70vh',
              background: `
                radial-gradient(
                  ellipse 45% 35% at 50% 15%,
                  rgba(255, 215, 0, 0.08) 0%,
                  rgba(255, 215, 0, 0.03) 40%,
                  transparent 70%
                )
              `,
            }}
          />

          <div className="w-full max-w-sm flex flex-col items-center text-center relative">

            {/* Logo */}
            <div className="mb-6 relative z-10">
              {/* Radial aura behind logo */}
              <div
                className="absolute inset-0 -m-4"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
                  filter: 'blur(8px)',
                }}
              />
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="relative w-24 h-24 object-contain rounded-lg"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))',
                }}
              />
            </div>

            {/* Title */}
            <h1 className="font-bebas text-3xl tracking-[0.08em] text-white mb-4 leading-tight relative z-10">
              STREAMER ACQUISITION
              <br />
              <span className="text-gold">CALCULATOR</span>
            </h1>

            {/* Subtitle */}
            <p className="text-text-mid text-sm leading-relaxed mb-8 max-w-[280px] relative z-10">
              Model your deal like the agencies do.
              <br />
              See where every dollar goes.
            </p>

            {/* CTA */}
            <button
              onClick={handleStartClick}
              className="w-full max-w-[280px] h-14 text-sm font-black tracking-[0.12em] transition-all active:scale-[0.96] relative z-10 rounded-md"
              style={{
                backgroundColor: 'rgba(255, 215, 0, 0.12)',
                border: '1px solid rgba(255, 215, 0, 0.45)',
                color: '#FFD700',
                boxShadow: '0 10px 40px rgba(255, 215, 0, 0.2)',
              }}
            >
              <span className="flex items-center justify-center gap-2">
                RUN THE NUMBERS
                <ArrowRight size={18} />
              </span>
            </button>

            {/* Hint */}
            <p className="text-text-dim text-[11px] tracking-wider mt-6 relative z-10">
              Takes about 2 minutes
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer
          className={`py-4 text-center transition-all duration-500 ${
            isComplete ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          }}
        >
          <p className="text-[10px] tracking-wider text-text-dim">
            Educational purposes only
          </p>
        </footer>
      </div>
    </>
  );
};

export default Index;
