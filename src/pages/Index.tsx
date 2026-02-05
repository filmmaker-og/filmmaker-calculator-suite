import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight } from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [phase, setPhase] = useState<
    'dark' | 'spotlight' | 'logo' | 'pulse' | 'tagline' | 'complete'
  >('dark');

  useEffect(() => {
    // Classic projector sequence - simple and elegant
    const timers = [
      setTimeout(() => setPhase('spotlight'), 400),   // Spotlight fades in
      setTimeout(() => setPhase('logo'), 1000),       // Logo emerges
      setTimeout(() => setPhase('pulse'), 1800),      // Light intensifies
      setTimeout(() => setPhase('tagline'), 2400),    // Tagline appears
      setTimeout(() => setPhase('complete'), 3500),   // Fade to homepage
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const isComplete = phase === 'complete';
  const showSpotlight = phase !== 'dark';
  const showLogo = ['logo', 'pulse', 'tagline', 'complete'].includes(phase);
  const isPulsed = ['pulse', 'tagline', 'complete'].includes(phase);
  const showTagline = ['tagline', 'complete'].includes(phase);

  return (
    <>
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════════════════════════════════════════════════════════════════
            CINEMATIC INTRO - Classic Projector Style
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 ${
            isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ backgroundColor: '#000000' }}
        >

          {/* ─── SPOTLIGHT FROM ABOVE ─── */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
              showSpotlight ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '100vw',
              height: '100vh',
              background: `
                radial-gradient(
                  ellipse 40% 50% at 50% 30%,
                  rgba(255, 215, 0, ${isPulsed ? '0.15' : '0.08'}) 0%,
                  rgba(255, 215, 0, ${isPulsed ? '0.08' : '0.03'}) 40%,
                  transparent 70%
                )
              `,
              transition: 'all 0.6s ease',
            }}
          />

          {/* ─── CENTER CONTENT ─── */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Glow behind logo */}
            <div
              className={`absolute transition-all duration-700 ${
                showLogo ? 'opacity-100' : 'opacity-0'
              } ${isPulsed ? 'scale-125' : 'scale-100'}`}
              style={{
                background: `radial-gradient(circle at center, rgba(255, 215, 0, ${isPulsed ? '0.35' : '0.2'}) 0%, transparent 60%)`,
                width: '280px',
                height: '280px',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) scale(${isPulsed ? 1.25 : 1})`,
                filter: 'blur(40px)',
                transition: 'all 0.6s ease',
              }}
            />

            {/* Logo - emerges and scales */}
            <div
              className={`relative transition-all duration-700 ease-out ${
                showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-32 h-32 object-contain transition-all duration-500"
                style={{
                  filter: isPulsed ? 'brightness(1.2)' : 'brightness(1)',
                }}
              />
            </div>

            {/* Tagline */}
            <p
              className={`mt-8 text-sm tracking-[0.4em] uppercase font-medium transition-all duration-700 ${
                showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ color: '#FFD700' }}
            >
              Know Your Numbers
            </p>

            {/* Gold line */}
            <div
              className={`mt-5 h-[1px] transition-all duration-700 ease-out ${
                showTagline ? 'w-32 opacity-100' : 'w-0 opacity-0'
              }`}
              style={{
                backgroundColor: '#FFD700',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)',
              }}
            />
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
            className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none animate-spotlight-pulse"
            style={{
              width: '100vw',
              height: '80vh',
              background: `
                radial-gradient(
                  ellipse 50% 40% at 50% 20%,
                  rgba(255, 215, 0, 0.1) 0%,
                  rgba(255, 215, 0, 0.04) 40%,
                  transparent 70%
                )
              `,
            }}
          />

          <div className="w-full max-w-sm flex flex-col items-center text-center relative">

            {/* Logo glow */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 60%)',
                filter: 'blur(20px)',
              }}
            />

            {/* Logo */}
            <div className="mb-8 relative z-10">
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-28 h-28 object-contain"
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
