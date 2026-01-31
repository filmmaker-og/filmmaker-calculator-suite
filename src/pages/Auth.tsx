import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowLeft, ArrowRight, Loader2, Mail, CheckCircle, Lock, Users, Shield } from "lucide-react";
import { z } from "zod";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";

const emailSchema = z.string().email("Please enter a valid email address");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const haptics = useHaptics();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'email' | 'sent'>('email');

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

      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-border">
        <button
          onClick={() => navigate("/")}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors -ml-2"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>

        <span className="font-bebas text-base tracking-widest text-gold">
          PRODUCER ACCESS
        </span>

        <div className="w-12" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pt-8 pb-6">

        {step === 'email' ? (
          <div className="flex-1 flex flex-col">
            {/* Logo + Copy */}
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                <div
                  className="absolute"
                  style={{
                    width: '120px',
                    height: '120px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                    filter: 'blur(20px)',
                  }}
                />
                <img
                  src={filmmakerLogo}
                  alt="Filmmaker.OG"
                  className="w-20 h-20 object-contain relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.4))',
                  }}
                />
              </div>

              {/* Gold divider */}
              <div className="w-12 h-[2px] bg-gold mx-auto mb-6" style={{ boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)' }} />

              <h1 className="font-bebas text-2xl tracking-[0.1em] text-white mb-3">
                UNLOCK YOUR RESULTS
              </h1>
              <p className="text-white/50 text-sm leading-relaxed max-w-xs mx-auto">
                Before you sign that term sheet, see exactly how much
                <span className="text-gold font-semibold"> you'll actually take home</span>.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border border-border flex items-center justify-center">
                  <Lock className="w-4 h-4 text-gold" />
                </div>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">Encrypted</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border border-border flex items-center justify-center">
                  <Users className="w-4 h-4 text-gold" />
                </div>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">1,200+ Users</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border border-border flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gold" />
                </div>
                <span className="text-[9px] text-white/40 uppercase tracking-wider">Private</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[11px] tracking-[0.2em] uppercase text-white/50 font-medium"
                >
                  Email Address
                </label>
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
                  className="h-14 text-lg rounded-none bg-card border-2 border-border text-white placeholder:text-white/25 font-mono pl-4 pr-4 focus:border-gold focus:ring-0 input-focus-glow transition-colors text-left"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full h-14 rounded-none font-black text-base tracking-[0.1em] bg-gold text-black hover:bg-gold-highlight disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 auth-cta-glow"
                style={{
                  boxShadow: email ? '0 0 30px rgba(212, 175, 55, 0.3)' : 'none',
                }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    GET ACCESS
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Access */}
            <div className="mt-8">
              <Button
                onClick={() => navigate("/calculator?skip=true")}
                variant="outline"
                className="w-full h-12 rounded-none border-border text-white/60 hover:text-white hover:border-gold/50 hover:bg-transparent text-sm font-semibold tracking-wider"
              >
                TRY DEMO WITHOUT SAVING
              </Button>
              <p className="text-white/30 text-[10px] text-center mt-3">
                Demo mode — your calculations won't be saved
              </p>
            </div>
          </div>
        ) : (
          /* Email Sent Confirmation */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
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

            <div className="space-y-4 text-sm text-white/50">
              <p>Click the link in your email to continue.</p>
              <p className="text-white/30 text-xs">
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
                  className="text-white/30 hover:text-white/50 text-xs transition-colors"
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
