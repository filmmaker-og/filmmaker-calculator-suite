import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle, HelpCircle } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const haptics = useHaptics();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'sent'>('email');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/calculator");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/calculator");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      haptics.error();
      toast({
        title: "Invalid Email",
        description: emailResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    haptics.medium();
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/calculator`;
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
        },
      });
      if (error) throw error;

      haptics.success();
      setStep('sent');
    } catch (error: any) {
      haptics.error();
      toast({
        title: "Error",
        description: error.message || "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-black flex flex-col">

      {/* ═══════════════════════════════════════════════════════════════════
          FIXED HEADER - Always visible, back navigation
          ═══════════════════════════════════════════════════════════════════ */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-1 rounded-full transition-colors ${step === 'email' ? 'bg-gold' : 'bg-gold'}`} />
          <div className={`w-8 h-1 rounded-full transition-colors ${step === 'sent' ? 'bg-gold' : 'bg-white/20'}`} />
        </div>

        <div className="w-12" /> {/* Spacer for centering */}
      </header>

      {/* ═══════════════════════════════════════════════════════════════════
          MAIN CONTENT - Positioned to stay above keyboard
          ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col px-6 pt-8 pb-6">

        {step === 'email' ? (
          /* ─────────────────────────────────────────────────────────────────
             STEP 1: Email Entry
             ───────────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col">
            {/* Top section - Logo + Copy */}
            <div className="text-center mb-10">
              {/* Small F logo */}
              <div className="relative inline-block mb-6">
                <div
                  className="absolute"
                  style={{
                    width: '80px',
                    height: '80px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                    filter: 'blur(15px)',
                  }}
                />
                <span
                  className="font-bebas text-5xl relative z-10"
                  style={{
                    color: '#FFFFFF',
                    textShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
                  }}
                >
                  F
                </span>
              </div>

              <h1 className="font-bebas text-2xl tracking-[0.1em] text-white mb-3">
                SAVE YOUR RESULTS
              </h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                Enter your email to save your calculations
                and get your investor deck.
              </p>
            </div>

            {/* Form - stays in upper portion for keyboard */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[11px] tracking-[0.2em] uppercase text-white/40 font-medium"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 text-lg rounded-none bg-zinc-900 border-2 border-zinc-700 text-white placeholder:text-white/25 font-mono pl-4 pr-4 focus:border-gold focus:ring-0 input-focus-glow transition-colors"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full h-14 rounded-none font-black text-base tracking-[0.1em] bg-gold text-black hover:bg-gold-highlight disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  boxShadow: email ? '0 0 30px rgba(212, 175, 55, 0.3)' : 'none',
                }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    CONTINUE
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Help toggle */}
            <div className="mt-6">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center gap-2 text-white/30 hover:text-white/50 transition-colors mx-auto"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs tracking-wide">Why do we need this?</span>
              </button>

              {showHelp && (
                <div className="mt-4 p-4 bg-zinc-900/50 border border-zinc-800 text-white/50 text-xs leading-relaxed">
                  <p className="mb-2">
                    <strong className="text-white/70">Your email lets us:</strong>
                  </p>
                  <ul className="space-y-1 pl-4">
                    <li>• Save your calculations for later</li>
                    <li>• Send your personalized investor deck</li>
                    <li>• Keep you updated on new features</li>
                  </ul>
                  <p className="mt-3 text-white/30">
                    We never spam. Unsubscribe anytime.
                  </p>
                </div>
              )}
            </div>

            {/* Skip option - pushed to bottom */}
            <div className="mt-auto pt-8">
              <div className="border-t border-zinc-800 pt-6 text-center">
                <button
                  onClick={() => navigate("/calculator?skip=true")}
                  className="text-white/30 hover:text-white/50 text-sm transition-colors"
                >
                  Skip for now
                </button>
                <p className="text-white/15 text-[10px] mt-2">
                  You won't be able to save your results
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────────
             STEP 2: Email Sent Confirmation
             ───────────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            {/* Success icon */}
            <div className="relative mb-8">
              <div
                className="absolute"
                style={{
                  width: '120px',
                  height: '120px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />
              <div className="w-20 h-20 border-2 border-gold flex items-center justify-center relative z-10">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center z-20">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>

            <h2 className="font-bebas text-2xl tracking-[0.1em] text-white mb-3">
              CHECK YOUR EMAIL
            </h2>

            <p className="text-white/50 text-sm leading-relaxed mb-2">
              We sent a secure link to
            </p>
            <p className="font-mono text-gold text-base mb-8">
              {email}
            </p>

            <div className="space-y-4 text-sm text-white/40">
              <p>Click the link in your email to continue.</p>
              <p className="text-white/25 text-xs">
                Can't find it? Check your spam folder.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <button
                onClick={() => setStep('email')}
                className="text-gold hover:text-gold-highlight text-sm transition-colors"
              >
                Use a different email
              </button>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/calculator?skip=true")}
                  className="text-white/25 hover:text-white/40 text-xs transition-colors"
                >
                  Continue without saving →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Auth;
