import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { Mail, Loader2, Home, User, Sparkles } from "lucide-react";
import { z } from "zod";
import brandIconF from "@/assets/brand-icon-f.jpg";
import MobileMenu from "@/components/MobileMenu";

const emailSchema = z.string().email("Please enter a valid email address");
const nameSchema = z.string().min(1, "First name is required").max(50, "Name must be less than 50 characters");

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const haptics = useHaptics();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

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


  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate first name
    const nameResult = nameSchema.safeParse(firstName.trim());
    if (!nameResult.success) {
      haptics.error();
      toast({
        title: "Invalid Name",
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
            first_name: firstName.trim(),
          },
        },
      });
      if (error) throw error;
      
      haptics.success();
      setMagicLinkSent(true);
      toast({
        title: "Check Your Email",
        description: "We've sent you a secure login link.",
      });
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
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Consistent gold border */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 safe-top bg-background" style={{ borderBottom: '1px solid hsl(var(--gold))' }}>
        <button
          onClick={() => { haptics.light(); navigate("/"); }}
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-all duration-100 touch-press -ml-1"
        >
          <Home className="w-5 h-5 text-gold" />
        </button>
        
        <span className="flex-1 text-center font-bebas text-lg sm:text-xl tracking-widest text-gold">
          FILMMAKER.OG
        </span>
        
        <div className="flex items-center">
          <Link 
            to="/store" 
            className="hidden sm:block text-xs font-mono tracking-widest mr-4 hover:opacity-80 transition-opacity text-gold"
          >
            SERVICES
          </Link>
          <MobileMenu />
        </div>
      </header>

      {/* Main Content - Full-bleed elegant experience */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 pt-20">
        <div className="w-full max-w-sm">
          
          {/* Brand Icon with glow */}
          <div className="text-center mb-8 relative">
            <div className="relative inline-block">
              <img 
                src={brandIconF} 
                alt="Brand Seal" 
                className="w-20 h-20 mx-auto object-contain"
              />
              {/* Subtle glow */}
              <div 
                className="absolute inset-0 -z-10 blur-2xl opacity-40"
                style={{ backgroundColor: 'hsl(var(--gold))' }}
              />
            </div>
          </div>

          {/* Gold decorative line */}
          <div className="flex justify-center mb-8">
            <div 
              className="w-24 h-[1px]"
              style={{ 
                background: 'linear-gradient(90deg, transparent, hsl(var(--gold)), transparent)',
                boxShadow: '0 0 20px hsl(var(--gold) / 0.5)'
              }}
            />
          </div>

          {/* Title */}
          <h1 className="font-bebas text-2xl sm:text-3xl text-center tracking-[0.15em] text-foreground mb-8">
            ACCESS YOUR TERMINAL
          </h1>

          {!magicLinkSent ? (
            <form onSubmit={handleMagicLink} className="space-y-6">
              {/* First Name Input - Premium styling */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-[10px] tracking-[0.25em] uppercase font-mono text-muted-foreground block text-center">
                  First Name
                </label>
                <div className="relative auth-input-wrapper">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 text-gold/60" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-12 h-14 text-lg text-center rounded-sm text-foreground placeholder:text-muted-foreground/50 font-mono tracking-wide bg-card border-2 border-border focus:border-gold focus:ring-0 transition-all"
                    required
                    tabIndex={1}
                    autoFocus
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-[10px] tracking-[0.25em] uppercase font-mono text-muted-foreground block text-center">
                  Email Address
                </label>
                <div className="relative auth-input-wrapper">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 text-gold/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputMode="email"
                    className="pl-12 h-14 text-lg text-center rounded-sm text-foreground placeholder:text-muted-foreground/50 font-mono tracking-wide bg-card border-2 border-border focus:border-gold focus:ring-0 transition-all"
                    required
                    tabIndex={2}
                  />
                </div>
              </div>

              {/* CTA Button - Dramatic gold glow */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !firstName.trim()}
                  className="w-full h-14 rounded-sm font-bebas text-xl tracking-[0.15em] transition-all duration-300 disabled:cursor-not-allowed min-h-[56px] bg-gold text-primary-foreground hover:bg-gold-highlight touch-press auth-cta-button"
                  style={{ 
                    boxShadow: loading || !firstName.trim() ? 'none' : '0 0 30px hsl(var(--gold) / 0.4)'
                  }}
                  size="lg"
                  tabIndex={3}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      REQUEST ACCESS
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 border-2 border-gold flex items-center justify-center mx-auto mb-6 rounded-sm auth-success-pulse">
                <Mail className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-bebas text-2xl text-foreground mb-3">
                CHECK YOUR EMAIL
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                We've sent a secure login link to<br />
                <span className="text-foreground font-medium">{email}</span>
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="text-sm tracking-widest uppercase transition-colors text-gold hover:text-gold-highlight"
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Trust indicators */}
          {!magicLinkSent && (
            <div className="mt-8 text-center space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                No passwords • Bank-grade security
              </p>
              
              {/* Demo Access - More prominent */}
              <button
                onClick={() => navigate("/calculator?reset=true")}
                className="text-xs tracking-widest uppercase transition-all text-gold/70 hover:text-gold py-2 px-4 border border-border hover:border-gold/50 rounded-sm"
              >
                Demo Access →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
