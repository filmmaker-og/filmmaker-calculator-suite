import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { z } from "zod";
import filmmakerLogo from "@/assets/filmmaker-f-icon.png";


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
    } catch (error) {
      haptics.error();
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send magic link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-black flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {step === 'email' ? (
            <>
              {/* Logo + Heading */}
              <div className="text-center mb-10">
                <img
                  src={filmmakerLogo}
                  alt="Filmmaker.OG"
                  className="w-16 h-16 object-contain mx-auto mb-6"
                  style={{ filter: 'brightness(1.5) saturate(1.2)' }}
                />
                <h1 className="font-bebas text-[28px] tracking-[0.12em] text-white mb-3">
                  SAVE YOUR WATERFALL
                </h1>
                <p className="text-ink-secondary text-[16px] leading-relaxed">
                  We'll email you a link. No password needed.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(212,175,55,0.25)',
                  background: '#000',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div className="p-6 space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[12px] uppercase tracking-[0.2em] text-ink-secondary font-bebas mb-3"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      autoCapitalize="words"
                      enterKeyHint="next"
                      placeholder="John Producer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && name.trim()) {
                          e.preventDefault();
                          document.getElementById('email')?.focus();
                        }
                      }}
                      className="h-12 bg-bg-surface border border-gold-border text-white placeholder:text-ink-ghost focus:border-gold focus:ring-0 focus:ring-offset-0 transition-colors rounded-lg"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[12px] uppercase tracking-[0.2em] text-ink-secondary font-bebas mb-3"
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
                      className="h-12 bg-bg-surface border border-gold-border text-white placeholder:text-ink-ghost font-mono focus:border-gold focus:ring-0 focus:ring-offset-0 transition-colors rounded-lg"
                      required
                    />
                  </div>

                  {/* Primary CTA */}
                  <Button
                    type="submit"
                    disabled={loading || !email || !name.trim()}
                    className="w-full min-h-[52px] btn-cta-primary disabled:opacity-40 disabled:cursor-not-allowed"
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

              {/* Skip Option */}
              <div className="mt-8 text-center space-y-3">
                <button
                  onClick={() => navigate("/calculator?skip=true")}
                  className="text-ink-secondary hover:text-white font-bebas text-[16px] tracking-[0.12em] transition-colors"
                >
                  Continue without saving →
                </button>
                <p className="text-ink-ghost text-[12px] font-mono">
                  Your work won't be saved
                </p>
              </div>
            </>
          ) : (
            /* Email Sent Confirmation */
            <div
              className="rounded-xl p-8"
              style={{
                border: '1px solid rgba(212,175,55,0.25)',
                background: '#000',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-gold-border flex items-center justify-center mx-auto mb-8">
                  <Mail className="w-8 h-8 text-gold" />
                </div>

                <h2 className="font-bebas text-[28px] tracking-[0.12em] text-white mb-4">
                  CHECK YOUR EMAIL
                </h2>

                <p className="text-ink-secondary text-[16px] mb-2">
                  We sent a link to
                </p>
                <p className="font-mono text-gold text-[16px] mb-10">
                  {email}
                </p>

                <div className="w-12 h-[1px] bg-gold-border mx-auto mb-10" />

                <div className="space-y-6">
                  <button
                    onClick={() => setStep('email')}
                    className="text-ink-secondary hover:text-ink-body font-mono text-[14px] tracking-[0.08em] transition-colors"
                  >
                    Use different email
                  </button>

                  <div>
                    <button
                      onClick={() => navigate("/calculator?skip=true")}
                      className="text-ink-secondary hover:text-ink-body font-bebas text-[16px] tracking-[0.12em] transition-colors"
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
