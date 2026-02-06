import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, Loader2, Mail } from "lucide-react";
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
    <div className="min-h-screen min-h-[100dvh] bg-bg-void flex flex-col">
      
      {/* Header with hamburger menu */}
      <Header title="SIGN IN" />

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {step === 'email' ? (
            <>
              {/* Logo + Heading */}
              <div className="text-center mb-10">
                <img
                  src={filmmakerLogo}
                  alt="Filmmaker.OG"
                  className="w-16 h-16 object-contain mx-auto mb-6 opacity-90"
                />
                
                <h1 className="font-bebas text-3xl tracking-[0.12em] text-text-primary mb-3">
                  SAVE YOUR WATERFALL
                </h1>
                <p className="text-text-dim text-sm leading-relaxed">
                  We'll email you a link. No password needed.
                </p>
              </div>

              {/* Form - Consistent with calculator design */}
              <form onSubmit={handleSubmit} className="matte-section overflow-hidden">
                <div className="p-6 space-y-6">
                  
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs uppercase tracking-[0.2em] text-text-dim font-medium mb-3"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
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
                      className="h-12 bg-bg-surface border border-border-subtle text-text-primary placeholder:text-text-dim focus:border-gold focus:ring-0 focus:ring-offset-0 transition-colors rounded-none"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs uppercase tracking-[0.2em] text-text-dim font-medium mb-3"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      enterKeyHint="send"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && email && name.trim()) {
                          e.preventDefault();
                          handleSubmit(e as any);
                        }
                      }}
                      className="h-12 bg-bg-surface border border-border-subtle text-text-primary placeholder:text-text-dim font-mono focus:border-gold focus:ring-0 focus:ring-offset-0 transition-colors rounded-none"
                      required
                    />
                  </div>

                  {/* Primary CTA */}
                  <Button
                    type="submit"
                    disabled={loading || !email || !name.trim()}
                    className="w-full h-14 rounded-none font-black text-base tracking-[0.12em] bg-gold-cta text-black hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        SEND LINK
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>

                </div>
              </form>

              {/* Skip Option - Prominent and Neutral */}
              <div className="mt-8 text-center space-y-3">
                <button
                  onClick={() => navigate("/calculator?skip=true")}
                  className="text-text-dim hover:text-text-primary text-base font-semibold transition-colors"
                >
                  Continue without saving →
                </button>
                <p className="text-text-dim text-xs">
                  Your work won't be saved
                </p>
              </div>
            </>
          ) : (
            /* Email Sent Confirmation - Simplified */
            <div className="matte-section p-8">
              <div className="text-center">
                
                {/* Icon - Single, clean */}
                <div className="w-16 h-16 border-2 border-gold/50 flex items-center justify-center mx-auto mb-8">
                  <Mail className="w-8 h-8 text-gold" />
                </div>

                {/* Heading */}
                <h2 className="font-bebas text-2xl tracking-[0.12em] text-text-primary mb-4">
                  CHECK YOUR EMAIL
                </h2>

                {/* Email Display */}
                <p className="text-text-dim text-sm mb-2">
                  We sent a link to
                </p>
                <p className="font-mono text-gold text-base mb-10">
                  {email}
                </p>

                {/* Divider */}
                <div className="w-12 h-[1px] bg-gold/30 mx-auto mb-10" />

                {/* Actions */}
                <div className="space-y-6">
                  <button
                    onClick={() => setStep('email')}
                    className="text-text-dim hover:text-gold text-sm font-medium transition-colors"
                  >
                    Use different email
                  </button>

                  <div>
                    <button
                      onClick={() => navigate("/calculator?skip=true")}
                      className="text-text-dim hover:text-text-mid text-sm transition-colors"
                    >
                      Continue without saving →
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Auth;
