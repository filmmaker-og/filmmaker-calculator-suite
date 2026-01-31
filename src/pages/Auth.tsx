import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useHaptics } from "@/hooks/use-haptics";
import { Mail, Loader2, Home, User, ArrowRight, Lock, Users, Shield } from "lucide-react";
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
      {/* Header - Clean, simple (NO context strip) */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-6 safe-top bg-background border-b border-border">
        <button
          onClick={() => { haptics.light(); navigate("/"); }}
          className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-all duration-100 touch-press -ml-1"
        >
          <Home className="w-5 h-5 text-muted-foreground" />
        </button>
        
        <span className="flex-1 text-center font-bebas text-lg tracking-wide text-foreground">
          FILMMAKER.OG
        </span>
        
        <div className="flex items-center">
          <Link 
            to="/store" 
            className="hidden sm:block text-xs font-mono tracking-widest mr-4 hover:opacity-80 transition-opacity text-muted-foreground"
          >
            SERVICES
          </Link>
          <MobileMenu />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 pt-24">
        <div className="w-full max-w-sm">
          
          {/* Brand Icon with glow */}
          <div className="text-center mb-5">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gold/15 rounded-full blur-xl scale-150" />
              <img
                src={brandIconF}
                alt="Brand Seal"
                className="w-16 h-16 mx-auto object-contain relative z-10"
              />
            </div>
          </div>

          {/* Gold Divider */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          {/* Title & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="font-bebas text-2xl tracking-wide text-foreground mb-2">
              PRODUCER ACCESS
            </h1>
            <p className="text-xs text-muted-foreground">
              Enter your details to access the waterfall calculator
            </p>
          </div>

          {!magicLinkSent ? (
            <form onSubmit={handleMagicLink} className="space-y-5">
              {/* First Name Input */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="input-label block">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-11 h-14 text-base rounded-sm text-foreground placeholder:text-muted-foreground/50 font-mono bg-card border border-border focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-left"
                    required
                    tabIndex={1}
                    autoFocus
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="input-label block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    inputMode="email"
                    className="pl-11 h-14 text-base rounded-sm text-foreground placeholder:text-muted-foreground/50 font-mono bg-card border border-border focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-left"
                    required
                    tabIndex={2}
                  />
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading || !firstName.trim()}
                  className="w-full h-14 rounded-sm font-bebas text-lg tracking-wide transition-all duration-150 disabled:cursor-not-allowed min-h-[56px] bg-gold text-primary-foreground hover:bg-gold-highlight touch-press"
                  style={{ 
                    boxShadow: loading || !firstName.trim() ? 'none' : '0 4px 20px hsl(var(--gold) / 0.3)'
                  }}
                  size="lg"
                  tabIndex={3}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      SEND LOGIN LINK
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-6 rounded-sm">
                <Mail className="w-7 h-7 text-gold" />
              </div>
              <h2 className="font-bebas text-xl text-foreground mb-3 tracking-wide">
                CHECK YOUR EMAIL
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                We've sent a secure login link to<br />
                <span className="text-foreground font-medium">{email}</span>
              </p>
              <button
                onClick={() => setMagicLinkSent(false)}
                className="text-sm tracking-wide uppercase transition-colors text-gold hover:text-gold-highlight"
              >
                Try a different email
              </button>
            </div>
          )}

          {/* Trust Badges & Demo - More prominent */}
          {!magicLinkSent && (
            <div className="mt-8 text-center space-y-6">
              {/* Trust Badges - Premium styling */}
              <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">500+ Producers</span>
                </div>
                <div className="flex flex-col items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Passwordless</span>
                </div>
                <div className="flex flex-col items-center gap-2 px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Secure</span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-border" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">or</span>
                <div className="flex-1 h-[1px] bg-border" />
              </div>

              {/* Demo Access - Clearer what it does */}
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/calculator?reset=true")}
                  className="text-sm tracking-wide text-gold hover:text-gold-highlight hover:bg-gold/10 py-3 px-6 border border-gold/30 hover:border-gold/50 transition-all"
                >
                  Try Demo Mode
                </Button>
                <p className="text-[10px] text-muted-foreground/70">
                  Explore with sample data — no account needed
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
