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
    'dark' | 'logo' | 'tagline' | 'complete'
  >('dark');

  useEffect(() => {
    // Faster, cleaner animation sequence (1.8s total)
    const timers = [
      setTimeout(() => setAnimationPhase('logo'), 300),
      setTimeout(() => setAnimationPhase('tagline'), 900),
      setTimeout(() => setAnimationPhase('complete'), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/calculator");
  };

  const showLogo = animationPhase !== 'dark';
  const showTagline = ['tagline', 'complete'].includes(animationPhase);
  const isComplete = animationPhase === 'complete';

  return (
    <>
      {/* HEADER - Outside overflow container for iOS Safari touch target fix */}
      {isComplete && <Header />}

      <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

        {/* CINEMATIC SPLASH - Clean, minimal */}
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${
            isComplete ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ 
            backgroundColor: '#000000',
            pointerEvents: isComplete ? 'none' : 'auto',
          }}
        >
          <div className="flex flex-col items-center">
            {/* Logo - simple fade in */}
            <div
              className={`transition-all duration-500 ${
                showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-24 h-24 object-contain"
              />
            </div>

            {/* Gold line */}
            <div
              className={`mt-5 h-[1px] bg-gold transition-all duration-500 ${
                showLogo ? 'w-32 opacity-100' : 'w-0 opacity-0'
              }`}
            />

            {/* Tagline */}
            <p
              className={`mt-5 text-xs tracking-[0.3em] uppercase transition-all duration-400 ${
                showTagline ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ color: '#D4AF37' }}
            >
              Know your numbers
            </p>
          </div>
        </div>

      {/* HERO - Clean and focused */}
      <main
        className={`flex-1 flex flex-col items-center justify-center px-6 pb-24 transition-all duration-500 ${
          isComplete ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full max-w-sm flex flex-col items-center text-center">

          {/* Logo */}
          <div className="mb-8">
            <img
              src={filmmakerLogo}
              alt="Filmmaker.OG"
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="font-bebas text-3xl tracking-[0.08em] text-white mb-4 leading-tight">
            STREAMER ACQUISITION
            <br />
            <span className="text-gold">CALCULATOR</span>
          </h1>

          {/* Subtitle - one clear line */}
          <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-[280px]">
            Model your deal like the agencies do.
            See where every dollar goes.
          </p>

          {/* CTA - Clean, no shimmer */}
          <button
            onClick={handleStartClick}
            className="w-full max-w-[280px] h-14 text-sm font-black tracking-[0.12em] bg-gold text-black hover:bg-gold-bright transition-colors active:scale-[0.98]"
            style={{
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.25)',
            }}
          >
            <span className="flex items-center justify-center gap-2">
              RUN THE NUMBERS
              <ArrowRight size={18} />
            </span>
          </button>

          {/* Subtle hint */}
          <p className="text-white/30 text-[11px] tracking-wider mt-6">
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
        <p className="text-[10px] tracking-wider text-white/20">
          Educational purposes only
        </p>
        </footer>
      </div>
    </>
  );
};

export default Index;
