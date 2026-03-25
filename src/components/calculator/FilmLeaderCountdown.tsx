import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";

interface FilmLeaderCountdownProps {
  projectTitle: string;
  onComplete: () => void;
}

const FilmLeaderCountdown = ({ projectTitle, onComplete }: FilmLeaderCountdownProps) => {
  const numRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const cueDotRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  const [isPlaying, setIsPlaying] = useState(true);

  // Keep ref current without retriggering effects
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  const displayTitle = projectTitle.trim() || "WATERFALL SNAPSHOT";

  // Randomize grain position for organic feel
  useEffect(() => {
    const interval = setInterval(() => {
      if (grainRef.current) {
        grainRef.current.style.backgroundPosition =
          `${Math.random() * 100}px ${Math.random() * 100}px`;
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Skip on tap
  const handleSkip = useCallback(() => {
    if (!isPlaying) return;
    setIsPlaying(false);
    onCompleteRef.current();
  }, [isPlaying]);

  // Run countdown
  useEffect(() => {
    if (!isPlaying) return;

    const num = numRef.current;
    const sweep = sweepRef.current;
    const flash = flashRef.current;
    const cueDot = cueDotRef.current;
    if (!num || !sweep || !flash || !cueDot) return;

    const steps = [3, 2, 1];
    let step = 0;
    let beatTimeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const beat = () => {
      if (cancelled) return;

      if (step >= steps.length) {
        // Gold flash then reveal
        flash.style.background =
          "radial-gradient(circle at 50% 50%, rgba(249,224,118,0.15) 0%, rgba(212,175,55,0.06) 50%, transparent 70%)";
        flash.style.opacity = "1";
        setTimeout(() => { if (!cancelled) flash.style.opacity = "0"; }, 200);
        setTimeout(() => { if (!cancelled) onCompleteRef.current(); }, 600);
        return;
      }

      // Set number
      num.textContent = String(steps[step]);

      // Gold flash on beat
      flash.style.background =
        "radial-gradient(circle at 50% 50%, rgba(249,224,118,0.12) 0%, rgba(212,175,55,0.06) 40%, transparent 65%)";
      flash.style.opacity = "1";
      setTimeout(() => { if (!cancelled) flash.style.opacity = "0"; }, 180);

      // Cue dot
      cueDot.style.opacity = "1";
      setTimeout(() => { if (!cancelled) cueDot.style.opacity = "0"; }, 300);

      // Sweep rotation — full 360 per beat
      const startAngle = step * 360;
      const endAngle = (step + 1) * 360;
      sweep.style.transition = "none";
      sweep.style.transform = `rotate(${startAngle}deg)`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          sweep.style.transition = "transform 0.9s linear";
          sweep.style.transform = `rotate(${endAngle}deg)`;
        });
      });

      // Number punch
      num.style.transition = "none";
      num.style.transform = "scale(1.08)";
      num.style.textShadow =
        "0 0 40px rgba(249,224,118,0.50), 0 0 80px rgba(212,175,55,0.35), 0 0 120px rgba(212,175,55,0.15)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled) return;
          num.style.transition =
            "transform 0.6s ease-out, text-shadow 0.6s ease-out, opacity 0.3s ease-out";
          num.style.transform = "scale(1)";
          num.style.textShadow =
            "0 0 30px rgba(249,224,118,0.35), 0 0 60px rgba(212,175,55,0.25), 0 0 100px rgba(212,175,55,0.10)";
        });
      });

      // Fade before next beat
      setTimeout(() => { if (!cancelled) num.style.opacity = "0.5"; }, 750);
      setTimeout(() => { if (!cancelled) num.style.opacity = "1"; }, 920);

      step++;
      beatTimeout = setTimeout(beat, 1000);
    };

    const kickoff = setTimeout(beat, 200);

    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      clearTimeout(beatTimeout);
    };
  }, [isPlaying]);

  // Sprocket holes
  const sprockets = Array.from({ length: 28 }, (_, i) => (
    <div key={i} style={{
      width: "14px", height: "10px", borderRadius: "2px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
    }} />
  ));

  return createPortal(
    <div
      onClick={handleSkip}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        background: "#0a0a08", overflow: "hidden",
        cursor: "pointer",
        animation: "leader-jitter 0.15s steps(4) infinite",
      }}
    >
      {/* Sprocket strips */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: 0, width: "28px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        gap: "18px", padding: "40px 0 40px 4px", zIndex: 10,
      }}>
        {sprockets}
      </div>
      <div style={{
        position: "absolute", top: 0, bottom: 0, right: 0, width: "28px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        gap: "18px", padding: "40px 0", paddingRight: "4px", alignItems: "flex-end", zIndex: 10,
      }}>
        {sprockets}
      </div>

      {/* Frame lines */}
      <div style={{ position: "absolute", left: "28px", right: "28px", top: "60px", height: "1px", background: "rgba(255,255,255,0.08)", zIndex: 8 }} />
      <div style={{ position: "absolute", left: "28px", right: "28px", bottom: "60px", height: "1px", background: "rgba(255,255,255,0.08)", zIndex: 8 }} />

      {/* Registration marks */}
      {[
        { top: "80px", left: "48px", borderTop: "1px solid rgba(255,255,255,0.10)", borderLeft: "1px solid rgba(255,255,255,0.10)" },
        { top: "80px", right: "48px", borderTop: "1px solid rgba(255,255,255,0.10)", borderRight: "1px solid rgba(255,255,255,0.10)" },
        { bottom: "80px", left: "48px", borderBottom: "1px solid rgba(255,255,255,0.10)", borderLeft: "1px solid rgba(255,255,255,0.10)" },
        { bottom: "80px", right: "48px", borderBottom: "1px solid rgba(255,255,255,0.10)", borderRight: "1px solid rgba(255,255,255,0.10)" },
      ].map((s, i) => (
        <div key={i} style={{ position: "absolute", width: "16px", height: "16px", zIndex: 8, ...s } as React.CSSProperties} />
      ))}

      {/* Center crosshairs */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "320px", height: "320px", zIndex: 8 }}>
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Edge text — project title top, brand bottom (centered) */}
      <div style={{
        position: "absolute", top: "38px", left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Roboto Mono', monospace", fontSize: "13px", letterSpacing: "0.10em",
        fontWeight: 500, color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
        textAlign: "center", zIndex: 8, whiteSpace: "nowrap",
      }}>
        {displayTitle}
      </div>
      <div style={{
        position: "absolute", bottom: "38px", left: "50%", transform: "translateX(-50%)",
        fontFamily: "'Roboto Mono', monospace", fontSize: "13px", letterSpacing: "0.10em",
        fontWeight: 500, color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
        textAlign: "center", zIndex: 8,
      }}>
        filmmaker.og
      </div>

      {/* Countdown circle */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "240px", height: "240px", zIndex: 20,
      }}>
        {/* Outer ring */}
        <div style={{
          width: "100%", height: "100%", borderRadius: "50%",
          border: "2px solid rgba(212,175,55,0.25)",
          position: "relative",
        }}>
          {/* Sweep hand */}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
            <div ref={sweepRef} style={{
              position: "absolute", top: 0, left: "50%", width: "50%", height: "50%",
              transformOrigin: "bottom left",
              background: "rgba(212,175,55,0.25)",
              transform: "rotate(0deg)",
            }} />
          </div>
        </div>
        {/* Inner ring — solid brand gold */}
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: "180px", height: "180px", borderRadius: "50%",
          border: "1.5px solid #D4AF37",
          boxShadow: "0 0 24px rgba(212,175,55,0.35), 0 0 60px rgba(249,224,118,0.10), inset 0 0 20px rgba(212,175,55,0.06)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div ref={numRef} style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: "120px",
            letterSpacing: "0.04em", lineHeight: 1,
            color: "rgba(255,255,255,0.92)",
            textShadow: "0 0 30px rgba(249,224,118,0.35), 0 0 60px rgba(212,175,55,0.25), 0 0 100px rgba(212,175,55,0.10)",
          }}>
            3
          </div>
        </div>
      </div>

      {/* Cue dot */}
      <div ref={cueDotRef} style={{
        position: "absolute", top: "100px", right: "60px", zIndex: 15,
        width: "12px", height: "12px", borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.15)",
        opacity: 0, transition: "opacity 0.1s",
      }} />

      {/* Gold flash */}
      <div ref={flashRef} style={{
        position: "absolute", inset: 0, zIndex: 26, pointerEvents: "none",
        opacity: 0, transition: "opacity 0.08s",
      }} />

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 27, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 50%, rgba(0,0,0,0.40) 100%)",
      }} />

      {/* Film grain */}
      <div ref={grainRef} style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 30,
        opacity: 0.06, mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      {/* Dust particles */}
      {[
        { size: 3, top: "30%", left: "65%", delay: "0.5s" },
        { size: 2, top: "55%", left: "25%", delay: "1.2s" },
        { size: 4, top: "70%", left: "78%", delay: "2.0s" },
        { size: 2, top: "20%", left: "40%", delay: "0.8s" },
      ].map((d, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          width: `${d.size}px`, height: `${d.size}px`,
          top: d.top, left: d.left, zIndex: 29, pointerEvents: "none",
          animation: `dust-float 4s ease-in-out ${d.delay} infinite`,
        }} />
      ))}

      {/* Scratches */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{
          position: "absolute",
          width: "1px",
          height: `${100 + i * 50}px`,
          background: "rgba(255,255,255,0.04)",
          left: `${15 + i * 20}%`,
          top: `${10 + i * 15}%`,
          zIndex: 28, pointerEvents: "none",
          animation: `scratch-drift ${2 + i * 0.5}s linear ${i * 0.4}s infinite`,
        }} />
      ))}

      {/* Keyframe styles */}
      <style>{`
        @keyframes leader-jitter {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(0.5px, -0.5px); }
          20% { transform: translate(-0.3px, 0.3px); }
          30% { transform: translate(0.2px, 0.8px); }
          40% { transform: translate(-0.6px, -0.2px); }
          50% { transform: translate(0.4px, 0.5px); }
          60% { transform: translate(-0.3px, -0.7px); }
          70% { transform: translate(0.7px, 0.2px); }
          80% { transform: translate(-0.4px, 0.6px); }
          90% { transform: translate(0.3px, -0.4px); }
        }
        @keyframes dust-float {
          0%, 100% { opacity: 0; transform: translateY(0); }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-60px); }
        }
        @keyframes scratch-drift {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default FilmLeaderCountdown;
