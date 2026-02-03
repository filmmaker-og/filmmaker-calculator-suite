import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight } from "lucide-react";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";

const Index = () => {
  const navigate = useNavigate();
  const haptics = useHaptics();
  const [animationPhase, setAnimationPhase] = useState<
    'dark' | 'logo' | 'glow' | 'tagline' | 'complete'
  >('dark');

  useEffect(() => {
    // Premium animation sequence
    const timers = [
      setTimeout(() => setAnimationPhase('logo'), 400),
      setTimeout(() => setAnimationPhase('glow'), 1000),
      setTimeout(() => setAnimationPhase('tagline'), 1600),
      setTimeout(() => setAnimationPhase('complete'), 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStartClick = () => {
    haptics.medium();
    navigate("/auth");
  };

  const showLogo = animationPhase !== 'dark';
  const showGlow = ['glow', 'tagline', 'complete'].includes(animationPhase);
  const showTagline = ['tagline', 'complete'].includes(animationPhase);
  const isRevealing = animationPhase === 'complete';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">

      {/* ═══════════════════════════════════════════════════════════════════
          CINEMATIC SPLASH
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${
          isRevealing ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{ backgroundColor: '#000000' }}
      >
        <div className="flex flex-col items-center">
          {/* Logo with Growing Glow */}
          <div className="relative">
            {/* Outer glow - appears second */}
            <div
              className={`absolute transition-all duration-700 ${
                showGlow ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{
                width: '280px',
                height: '280px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.35) 0%, rgba(212, 175, 55, 0.15) 40%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
            {/* Inner glow */}
            <div
              className={`absolute transition-all duration-500 ${
                showGlow ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                width: '160px',
                height: '160px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(249, 224, 118, 0.4) 0%, transparent 60%)',
                filter: 'blur(25px)',
              }}
            />
            {/* Logo */}
            <div
              className={`relative z-10 transition-all duration-700 ${
                showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <img
                src={filmmakerLogo}
                alt="Filmmaker.OG"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                style={{
                  filter: showGlow ? 'drop-shadow(0 0 50px rgba(212, 175, 55, 0.6))' : 'none',
                  transition: 'filter 0.6s ease',
                }}
              />
            </div>
          </div>

          {/* Gold Underline */}
          <div
            className={`mt-6 h-[2px] bg-gold transition-all duration-700 ${
              showGlow ? 'w-52 opacity-100' : 'w-0 opacity-0'
            }`}
            style={{
              boxShadow: showGlow ? '0 0 25px rgba(212, 175, 55, 0.7)' : 'none',
            }}
          />

          {/* Tagline */}
          <p
            className={`mt-6 text-sm tracking-[0.35em] uppercase transition-all duration-500 ${
              showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ color: '#D4AF37' }}
          >
            Know your numbers
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          HEADER - With hamburger menu (z-[200] to stay above splash)
          ═══════════════════════════════════════════════════════════════════ */}
      {animationPhase === 'complete' && <Header />}

      {/* ═══════════════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════════════ */}
      <main
        className={`flex-1 flex flex-col items-center justify-center px-6 pb-20 transition-all duration-700 ${
          animationPhase === 'complete' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '200ms' : '0ms' }}
      >
        <div className="w-full max-w-sm flex flex-col items-center text-center">

          {/* Logo with Strong Glow */}
          <div className="relative mb-10">
            {/* Outer glow ring - MORE VISIBLE */}
            <div
              className="absolute animate-pulse-slow"
              style={{
                width: '320px',
                height: '320px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 40%, transparent 65%)',
                filter: 'blur(40px)',
              }}
            />
            {/* Inner warm glow */}
            <div
              className="absolute"
              style={{
                width: '180px',
                height: '180px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(249, 224, 118, 0.3) 0%, rgba(212, 175, 55, 0.15) 50%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            {/* Logo - BIGGER */}
            <img
              src={filmmakerLogo}
              alt="Filmmaker.OG"
              className="w-28 h-28 sm:w-32 sm:h-32 object-contain relative z-10"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.5))',
              }}
            />
          </div>

          {/* Title - BIGGER */}
          <h1 className="font-bebas text-3xl sm:text-4xl tracking-[0.1em] text-white mb-5 leading-tight">
            STREAMER ACQUISITION
            <br />
            <span className="text-gold">CALCULATOR</span>
          </h1>

          {/* Subtitle - BIGGER */}
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xs">
            See exactly how the money flows before you sign.
            Model deals like the agencies do.
          </p>

          {/* CTA - WITH GLOW */}
          <Button
            onClick={handleStartClick}
            className="w-full max-w-xs h-16 text-lg font-black tracking-[0.12em] rounded-none bg-gold-cta text-black hover:brightness-110 transition-all duration-200 touch-press group"
            style={{
              boxShadow: '0 0 50px rgba(212, 175, 55, 0.45), 0 0 100px rgba(212, 175, 55, 0.2)',
            }}
          >
            <span className="flex items-center justify-center gap-3">
              RUN THE NUMBERS
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Button>

          {/* Trust signal */}
          <p className="text-white/40 text-xs tracking-[0.15em] uppercase mt-8">
            Free · No account needed
          </p>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER - Better positioned
          ═══════════════════════════════════════════════════════════════════ */}
      <footer
        className={`py-4 pb-6 text-center transition-all duration-500 ${
          animationPhase === 'complete' ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: animationPhase === 'complete' ? '400ms' : '0ms' }}
      >
        <p className="text-xs tracking-wider text-white/30">
          Educational purposes only · Not financial advice
        </p>
      </footer>
    </div>
  );
};

export default Index;
