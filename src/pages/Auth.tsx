import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, Loader2, Mail, CheckCircle, Lock, Shield } from "lucide-react";
import { z } from "zod";
import filmmakerLogo from "@/assets/filmmaker-logo.jpg";
import Header from "@/components/Header";

const emailSchema = z.string().email("Please enter a valid email address");
const nameSchema = z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const haptics = useHaptics();
  const [name, setName] = useState("");
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

    // Validate name
    const nameResult = nameSchema.safeParse(name.trim());
    if (!nameResult.success) {
      haptics.error();
      toast({
        title: "Name Required",
        description: nameResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    // Validate email
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
          data: {
            full_name: name.trim(),
          }
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

      {/* Header with hamburger menu */}
      <Header title="SIGN IN" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pt-6 pb-6">

        {step === 'email' ? (
          <div className="flex-1 flex flex-col">
            {/* Logo + Copy */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div
                  className="absolute"
                  style={{
                    width: '160px',
                    height: '160px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)',
                    filter: 'blur(25px)',
                  }}
                />
                <img
                  src={filmmakerLogo}
                  alt="Filmmaker.OG"
                  className="w-24 h-24 object-contain relative z-10"
                  style={{
                    filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.5))',
                  }}
                />
              </div>

              {/* Gold divider */}
              <div className="w-16 h-[2px] bg-gold mx-auto mb-6" style={{ boxShadow: '0 0 15px rgba(212, 175, 55, 0.6)' }} />

              <h1 className="font-bebas text-3xl tracking-[0.1em] text-white mb-4">
                SAVE YOUR RESULTS
              </h1>
              <p className="text-white/60 text-base leading-relaxed max-w-xs mx-auto">
                Enter your name and email to save calculations and
                <span className="text-gold font-semibold"> get your investor deck</span>.
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center bg-gold/5">
                  <Lock className="w-5 h-5 text-gold" />
                </div>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Encrypted</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center bg-gold/5">
                  <Shield className="w-5 h-5 text-gold" />
                </div>
                <span className="text-[10px] text-white/50 uppercase tracking-wider">Private</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field - Primary attention grabber */}
              <div
                className={`p-4 transition-all duration-300 ${
                  !name.trim()
                    ? 'matte-card-glow animate-border-glow'
                    : name.trim()
                      ? 'matte-card-gold'
                      : 'matte-card'
                }`}
              >
                <label
                  htmlFor="name"
                  className={`block text-xs tracking-[0.2em] uppercase font-semibold mb-3 transition-colors ${
                    !name.trim() ? 'text-gold' : 'text-white/60'
                  }`}
                >
                  Your Name {!name.trim() && <span className="text-gold animate-pulse">← Start here</span>}
                </label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  autoCapitalize="words"
                  autoFocus
                  placeholder="John Producer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && name.trim()) {
                      e.preventDefault();
                      document.getElementById('email')?.focus();
                    }
                  }}
                  className="h-14 text-lg rounded-none bg-transparent border-0 border-b-2 border-white/20 text-white placeholder:text-white/30 pl-0 pr-0 focus:border-gold focus:ring-0 transition-colors"
                  required
                />
              </div>

              {/* Email Field */}
              <div
                className={`p-4 transition-all duration-300 ${
                  name.trim() && !email
                    ? 'matte-card-glow animate-border-glow'
                    : email
                      ? 'matte-card-gold'
                      : 'matte-card'
                }`}
              >
                <label
                  htmlFor="email"
                  className={`block text-xs tracking-[0.2em] uppercase font-semibold mb-3 transition-colors ${
                    name.trim() && !email ? 'text-gold' : 'text-white/60'
                  }`}
                >
                  Email Address {name.trim() && !email && <span className="text-gold animate-pulse">← Now this</span>}
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email && name.trim()) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  className="h-14 text-lg rounded-none bg-transparent border-0 border-b-2 border-white/20 text-white placeholder:text-white/30 font-mono pl-0 pr-0 focus:border-gold focus:ring-0 transition-colors"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !email || !name.trim()}
                className="w-full h-16 rounded-none font-black text-lg tracking-[0.1em] bg-gold text-black hover:bg-gold-highlight disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  boxShadow: email && name.trim() ? '0 0 40px rgba(212, 175, 55, 0.4)' : 'none',
                }}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    GET ACCESS
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Access */}
            <div className="mt-8">
              <Button
                onClick={() => navigate("/calculator?skip=true")}
                variant="outline"
                className="w-full h-14 rounded-none border-zinc-700 text-white/60 hover:text-white hover:border-gold/50 hover:bg-transparent text-base font-semibold tracking-wider"
              >
                TRY WITHOUT SAVING
              </Button>
              <p className="text-white/30 text-xs text-center mt-4">
                Your calculations won't be saved
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
                  width: '140px',
                  height: '140px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
                  filter: 'blur(25px)',
                }}
              />
              <div className="w-24 h-24 border-2 border-gold flex items-center justify-center relative z-10">
                <Mail className="w-10 h-10 text-gold" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center z-20">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <h2 className="font-bebas text-3xl tracking-[0.1em] text-white mb-4">
              CHECK YOUR EMAIL
            </h2>

            <p className="text-white/60 text-base leading-relaxed mb-2">
              We sent a secure link to
            </p>
            <p className="font-mono text-gold text-lg mb-10">
              {email}
            </p>

            <div className="space-y-4 text-base text-white/50">
              <p>Click the link in your email to continue.</p>
              <p className="text-white/30 text-sm">
                Can't find it? Check your spam folder.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              <button
                onClick={() => setStep('email')}
                className="text-gold hover:text-gold-highlight text-base font-semibold transition-colors"
              >
                Use a different email
              </button>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/calculator?skip=true")}
                  className="text-white/40 hover:text-white/60 text-sm transition-colors"
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
