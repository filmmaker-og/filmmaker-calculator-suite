import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight } from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [animationPhase, setAnimationPhase] = useState<
    'dark' | 'spotlight' | 'reveal' | 'complete'
  >('dark');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cinematic animation sequence (2.5s total)
    const timers = [
      setTimeout(() => setAnimationPhase('spotlight'), 200),
      setTimeout(() => setAnimationPhase('reveal'), 1200),
      setTimeout(() => setAnimationPhase('complete'), 2500),
    ];

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const showSpotlight = animationPhase !== 'dark';
  const showReveal = ['reveal', 'complete'].includes(animationPhase);
  const isComplete = animationPhase === 'complete';

  return (
    <>
      {/* HEADER - Outside overflow container for iOS Safari touch target fix */}
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════════════════════════════════════════════════════════════════
            CINEMATIC SPOTLIGHT SPLASH
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
            isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ backgroundColor: '#000000' }}
        >
          {/* Spotlight cone from above */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
              showSpotlight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '200vw',
              height: '120vh',
              background: `
                radial-gradient(
                  ellipse 35% 60% at 50% 0%,
                  rgba(255, 215, 0, 0.08) 0%,
                  rgba(255, 215, 0, 0.04) 30%,
                  rgba(255, 215, 0, 0.01) 50%,
                  transparent 70%
                )
              `,
              transform: 'translateX(-50%)',
            }}
          />

          {/* Spotlight beam edges (subtle) */}
          <div
            className={`absolute top-0 left-1/2 transition-all duration-1000 delay-200 ${
              showSpotlight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '2px',
              height: '40vh',
              background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.3) 0%, transparent 100%)',
              transform: 'translateX(-50%) rotate(-15deg)',
              transformOrigin: 'top center',
            }}
          />
          <div
            className={`absolute top-0 left-1/2 transition-all duration-1000 delay-200 ${
              showSpotlight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '2px',
              height: '40vh',
              background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.3) 0%, transparent 100%)',
              transform: 'translateX(-50%) rotate(15deg)',
              transformOrigin: 'top center',
            }}
          />

          {/* Dust particles in spotlight */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {showSpotlight && [...Array(20)].map((_, i) => (
              <div
                key={i}
                className="spotlight-particle"
                style={{
                  left: `${35 + Math.random() * 30}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>

          {/* Center content - illuminated by spotlight */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Glow behind logo */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ${
                showSpotlight ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 60%)',
                width: '200px',
                height: '200px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(30px)',
              }}
            />

            {/* Logo - revealed in spotlight */}
            <div
              className={`relative transition-all duration-700 ${
                showSpotlight ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-28 h-28 object-contain"
                style={{
                  filter: showReveal ? 'brightness(1.1)' : 'brightness(0.8)',
                  transition: 'filter 0.5s ease',
                }}
              />
            </div>

            {/* Tagline - fades in after reveal */}
            <p
              className={`mt-6 text-xs tracking-[0.35em] uppercase transition-all duration-500 ${
                showReveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ color: '#FFD700' }}
            >
              Know your numbers
            </p>

            {/* Gold progress bar */}
            <div
              className={`mt-8 transition-all duration-500 ${
                showSpotlight ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ width: '120px' }}
            >
              <div
                className="h-[2px] rounded-full overflow-hidden"
                style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: '#FFD700',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            HOMEPAGE - After splash completes
            ═══════════════════════════════════════════════════════════════════ */}
        <main
          className={`flex-1 flex flex-col items-center justify-center px-6 pb-24 transition-all duration-700 ${
            isComplete ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-full max-w-sm flex flex-col items-center text-center relative">

            {/* Flowing gold aura behind logo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-[200px] h-[200px] pointer-events-none">
              {/* Primary breathing glow */}
              <div
                className="absolute inset-0 rounded-full animate-breathe"
                style={{
                  background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.12) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
              {/* Secondary pulsing ring */}
              <div
                className="absolute inset-4 rounded-full animate-pulse-ring"
                style={{
                  border: '1px solid rgba(255, 215, 0, 0.1)',
                }}
              />
              {/* Subtle particle flow */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flow-particle"
                    style={{
                      left: `${40 + Math.random() * 20}%`,
                      animationDelay: `${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Logo */}
            <div className="mb-8 relative z-10">
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Title */}
            <h1 className="font-bebas text-3xl tracking-[0.08em] text-white mb-4 leading-tight relative z-10">
              STREAMER ACQUISITION
              <br />
              <span className="text-gold">CALCULATOR</span>
            </h1>

            {/* Subtitle - one clear line */}
            <p className="text-text-mid text-sm leading-relaxed mb-8 max-w-[280px] relative z-10">
              Model your deal like the agencies do.
              <br />
              See where every dollar goes.
            </p>

            {/* CTA - Electric Gold */}
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

            {/* Subtle hint */}
            <p className="text-text-dim text-[11px] tracking-wider mt-6 relative z-10">
              Takes about 2 minutes
            </p>
          </div>
        </main>

        {/* FOOTER */}
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
