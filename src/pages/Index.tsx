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
    'dark' | 'searching' | 'found' | 'burst' | 'settle' | 'complete'
  >('dark');

  useEffect(() => {
    // Cinematic sequence - like a movie studio logo
    const timers = [
      setTimeout(() => setPhase('searching'), 300),    // Spotlight starts searching
      setTimeout(() => setPhase('found'), 1800),       // Spotlight finds the logo
      setTimeout(() => setPhase('burst'), 2400),       // Light burst + sparks
      setTimeout(() => setPhase('settle'), 3200),      // Settle into final state
      setTimeout(() => setPhase('complete'), 4000),    // Fade to homepage
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const isComplete = phase === 'complete';
  const isSearching = phase === 'searching';
  const isFound = ['found', 'burst', 'settle', 'complete'].includes(phase);
  const isBurst = ['burst', 'settle', 'complete'].includes(phase);
  const isSettled = ['settle', 'complete'].includes(phase);

  return (
    <>
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* ═══════════════════════════════════════════════════════════════════
            CINEMATIC INTRO - Movie Studio Logo Sequence
            ═══════════════════════════════════════════════════════════════════ */}
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700 ${
            isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ backgroundColor: '#000000' }}
        >

          {/* ─── SEARCHING SPOTLIGHT ─── */}
          {/* This is the beam that sweeps across looking for the logo */}
          <div
            className={`absolute transition-all ${
              isSearching ? 'spotlight-searching' : ''
            } ${isFound ? 'spotlight-found' : ''}`}
            style={{
              width: '300px',
              height: '100vh',
              background: isFound
                ? `radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255, 215, 0, 0.25) 0%, rgba(255, 215, 0, 0.1) 40%, transparent 70%)`
                : `radial-gradient(ellipse 80% 100% at 50% 0%, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 40%, transparent 60%)`,
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: phase === 'dark' ? 0 : 1,
              transition: 'opacity 0.5s ease, background 0.5s ease',
            }}
          />

          {/* ─── SPOTLIGHT CONE EDGES ─── */}
          <div
            className={`absolute top-0 left-1/2 transition-all duration-500 ${
              isFound ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '2px',
              height: '50vh',
              background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.1) 60%, transparent 100%)',
              transform: 'translateX(-80px) rotate(-12deg)',
              transformOrigin: 'top center',
            }}
          />
          <div
            className={`absolute top-0 left-1/2 transition-all duration-500 ${
              isFound ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '2px',
              height: '50vh',
              background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.6) 0%, rgba(255, 215, 0, 0.1) 60%, transparent 100%)',
              transform: 'translateX(80px) rotate(12deg)',
              transformOrigin: 'top center',
            }}
          />

          {/* ─── BURST FLASH ─── */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              phase === 'burst' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'radial-gradient(circle at 50% 45%, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0.1) 30%, transparent 60%)',
            }}
          />

          {/* ─── SPARK PARTICLES (Burst outward) ─── */}
          {isBurst && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="spark-particle"
                  style={{
                    '--angle': `${(i * 15)}deg`,
                    '--delay': `${Math.random() * 0.2}s`,
                    '--distance': `${100 + Math.random() * 150}px`,
                    '--size': `${2 + Math.random() * 3}px`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          {/* ─── AMBIENT PARTICLES (Floating in spotlight) ─── */}
          {isFound && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="ambient-particle"
                  style={{
                    left: `${40 + Math.random() * 20}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${4 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* ─── CENTER CONTENT ─── */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Logo glow (intensifies on burst) */}
            <div
              className={`absolute transition-all duration-500 ${
                isBurst ? 'opacity-100 scale-110' : isFound ? 'opacity-60 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0.1) 40%, transparent 70%)',
                width: '250px',
                height: '250px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                filter: 'blur(30px)',
              }}
            />

            {/* Logo */}
            <div
              className={`relative transition-all duration-700 ${
                isFound ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
            >
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className={`w-32 h-32 object-contain transition-all duration-500 ${
                  isBurst ? 'brightness-125 scale-105' : 'brightness-100 scale-100'
                }`}
              />
            </div>

            {/* Tagline - punches in after burst */}
            <div
              className={`mt-6 overflow-hidden transition-all duration-500 ${
                isSettled ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p
                className={`text-sm tracking-[0.4em] uppercase font-medium transition-transform duration-500 ${
                  isSettled ? 'translate-y-0' : 'translate-y-full'
                }`}
                style={{ color: '#FFD700' }}
              >
                Know Your Numbers
              </p>
            </div>

            {/* Gold underline - sweeps in */}
            <div
              className={`mt-4 h-[2px] bg-gold transition-all duration-700 ease-out ${
                isSettled ? 'w-40 opacity-100' : 'w-0 opacity-0'
              }`}
              style={{
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
              }}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            HOMEPAGE - With Visible Spotlight
            ═══════════════════════════════════════════════════════════════════ */}
        <main
          className={`flex-1 flex flex-col items-center justify-center px-6 pb-24 transition-all duration-700 ${
            isComplete ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Spotlight cone from above */}
          <div
            className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '500px',
              height: '70vh',
              background: `
                radial-gradient(
                  ellipse 60% 50% at 50% 0%,
                  rgba(255, 215, 0, 0.12) 0%,
                  rgba(255, 215, 0, 0.06) 30%,
                  rgba(255, 215, 0, 0.02) 50%,
                  transparent 70%
                )
              `,
            }}
          />

          {/* Spotlight beam edges */}
          <div
            className="fixed top-0 left-1/2 pointer-events-none opacity-40"
            style={{
              width: '1px',
              height: '35vh',
              background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.8) 0%, transparent 100%)',
              transform: 'translateX(-100px) rotate(-10deg)',
              transformOrigin: 'top center',
            }}
          />
          <div
            className="fixed top-0 left-1/2 pointer-events-none opacity-40"
            style={{
              width: '1px',
              height: '35vh',
              background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.8) 0%, transparent 100%)',
              transform: 'translateX(100px) rotate(10deg)',
              transformOrigin: 'top center',
            }}
          />

          <div className="w-full max-w-sm flex flex-col items-center text-center relative">

            {/* Logo glow */}
            <div
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none animate-spotlight-pulse"
              style={{
                background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.2) 0%, transparent 60%)',
                filter: 'blur(25px)',
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
