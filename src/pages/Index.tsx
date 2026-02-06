import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight } from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const haptics = useHaptics();

  // Check if we should skip intro based on URL param
  const shouldSkip = searchParams.get("skipIntro") === "true";

  const [phase, setPhase] = useState<
    'dark' | 'beam' | 'logo' | 'pulse' | 'tagline' | 'complete'
  >(shouldSkip ? 'complete' : 'dark');

  useEffect(() => {
    if (shouldSkip) return;

    // Cinematic spotlight sequence - theatrical reveal (slowed for drama)
    const timers = [
      setTimeout(() => setPhase('beam'), 400),        // Spotlight beam fans open
      setTimeout(() => setPhase('logo'), 1200),       // Logo fades up into light
      setTimeout(() => setPhase('pulse'), 2000),      // Light intensifies
      setTimeout(() => setPhase('tagline'), 2800),    // Tagline + progress bar
      setTimeout(() => setPhase('complete'), 4000),   // Fade to homepage
    ];

    return () => timers.forEach(clearTimeout);
  }, [shouldSkip]);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/intro");
  };

  const isComplete = phase === 'complete';
  const showBeam = phase !== 'dark' && !shouldSkip;
  const showLogo = (phase !== 'dark' && phase !== 'beam') || shouldSkip;
  const isPulsed = ['pulse', 'tagline', 'complete'].includes(phase) || shouldSkip;
  const showTagline = ['tagline', 'complete'].includes(phase) || shouldSkip;

  return (
    <>
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════════════════════════════════════════════════════════════════
            CINEMATIC INTRO - Theatrical Spotlight (Enhanced)
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000",
            isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
          )}
          style={{
            backgroundColor: '#000000',
          }}
        >
          {/* ─── OUTER SPOTLIGHT CONE BEAM (Wide, Gold-tinged) ─── */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-all duration-1000",
              showBeam ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `
                radial-gradient(
                  ellipse 70% 60% at 50% 0%,
                  rgba(212, 175, 55, 0.08) 0%,
                  rgba(255, 255, 255, 0.12) 20%,
                  rgba(255, 255, 255, 0.05) 40%,
                  rgba(255, 255, 255, 0.01) 60%,
                  transparent 80%
                )
              `,
              clipPath: showBeam ? 'polygon(25% 0%, 75% 0%, 95% 100%, 5% 100%)' : 'polygon(48% 0%, 52% 0%, 52% 30%, 48% 30%)',
              transition: 'clip-path 1.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.8s ease',
            }}
          />

          {/* ─── BRIGHT CORE BEAM (Center, Intense) ─── */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-all duration-1000",
              showBeam ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `
                radial-gradient(
                  ellipse 30% 45% at 50% 0%,
                  rgba(255, 255, 255, 0.35) 0%,
                  rgba(255, 255, 255, 0.15) 30%,
                  rgba(212, 175, 55, 0.05) 50%,
                  transparent 70%
                )
              `,
              clipPath: showBeam ? 'polygon(38% 0%, 62% 0%, 78% 100%, 22% 100%)' : 'polygon(48% 0%, 52% 0%, 52% 30%, 48% 30%)',
              transition: 'clip-path 1s cubic-bezier(0.22, 1, 0.36, 1) 0.1s, opacity 0.8s ease',
            }}
          />

          {/* ─── DUST PARTICLES / ATMOSPHERE ─── */}
          <div
            className={cn(
              "absolute inset-0 pointer-events-none transition-opacity duration-1500",
              showBeam ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `
                radial-gradient(
                  ellipse 80% 100% at 50% 0%,
                  rgba(212, 175, 55, 0.02) 0%,
                  transparent 60%
                )
              `,
            }}
          />

          {/* ─── FOCAL POOL (where light lands - Enhanced) ─── */}
          <div
            className={cn(
              "absolute left-1/2 top-1/2 w-[400px] h-[400px] pointer-events-none transition-all duration-700",
              showLogo ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `
                radial-gradient(
                  circle,
                  rgba(212, 175, 55, 0.12) 0%,
                  rgba(255, 255, 255, 0.08) 30%,
                  rgba(255, 255, 255, 0.03) 50%,
                  transparent 70%
                )
              `,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(40px)',
              animation: isPulsed ? 'focal-pulse 3s ease-in-out infinite' : 'none',
            }}
          />

          {/* ─── CENTER CONTENT ─── */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Logo - emerges dramatically */}
            <div
              className={cn(
                "relative transition-all duration-1000 ease-out",
                showLogo ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-6"
              )}
            >
              {/* Logo glow */}
              <div
                className={cn(
                  "absolute inset-0 -m-4 transition-opacity duration-700",
                  isPulsed ? "opacity-100" : "opacity-0"
                )}
                style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
                  filter: 'blur(15px)',
                }}
              />
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-32 h-32 object-contain rounded-lg relative"
                style={{
                  filter: isPulsed
                    ? 'brightness(1.2) drop-shadow(0 0 30px rgba(212, 175, 55, 0.5))'
                    : 'brightness(0.9)',
                  transition: 'filter 0.7s ease',
                }}
              />
            </div>

            {/* Tagline */}
            <p
              className={cn(
                "mt-8 text-sm tracking-[0.4em] uppercase font-semibold transition-all duration-700",
                showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              )}
              style={{
                color: '#D4AF37',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.4)',
              }}
            >
              Know Your Numbers
            </p>

            {/* Animated Progress Line */}
            <div className="mt-6 w-32 h-[2px] overflow-hidden bg-border-subtle rounded-full">
              <div
                className={cn(
                  "h-full bg-gold rounded-full transition-all",
                  showTagline && !shouldSkip ? "animate-progress-draw" : ""
                )}
                style={{
                  boxShadow: '0 0 15px rgba(212, 175, 55, 0.7)',
                  width: shouldSkip ? '100%' : (showTagline ? undefined : '0%'),
                }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            HOMEPAGE - With Ambient Spotlight
            ═══════════════════════════════════════════════════════════════════ */}
        <main
          className={cn(
            "flex-1 flex flex-col items-center justify-center px-6 pb-24 transition-all duration-700",
            isComplete ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Cinematic Vignette */}
          <div className="vignette" />

          {/* Ambient spotlight glow from above */}
          <div
            className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
            style={{
              width: '100vw',
              height: '75vh',
              background: `
                radial-gradient(
                  ellipse 50% 40% at 50% 10%,
                  rgba(212, 175, 55, 0.1) 0%,
                  rgba(212, 175, 55, 0.04) 40%,
                  transparent 70%
                )
              `,
            }}
          />

          <div className="w-full max-w-sm flex flex-col items-center text-center relative">

            {/* Logo with aura */}
            <div className="mb-6 relative z-10">
              <div
                className="absolute inset-0 -m-6"
                style={{
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
              />
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="relative w-24 h-24 object-contain rounded-lg"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 25px rgba(212, 175, 55, 0.45))',
                }}
              />
            </div>

            {/* Title */}
            <h1 className="font-bebas text-3xl tracking-[0.08em] text-text-primary mb-4 leading-tight relative z-10">
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
                backgroundColor: 'rgba(249, 224, 118, 0.12)',
                border: '1px solid rgba(249, 224, 118, 0.45)',
                color: '#F9E076',
                boxShadow: '0 10px 40px rgba(249, 224, 118, 0.25)',
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
          className={cn(
            "py-4 text-center transition-all duration-500",
            isComplete ? "opacity-100" : "opacity-0"
          )}
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
