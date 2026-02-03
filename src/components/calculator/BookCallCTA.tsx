import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookCallCTAProps {
  onBookCall?: () => void;
}

const BookCallCTA = ({ onBookCall }: BookCallCTAProps) => {
  const handleClick = () => {
    // Open Calendly or contact form - for now open in new tab
    if (onBookCall) {
      onBookCall();
    } else {
      window.open("https://calendly.com", "_blank");
    }
  };

  return (
    <div className="matte-card-gold p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
          <Phone className="w-5 h-5 text-gold" />
        </div>
        <div className="flex-1">
          <h4 className="font-bebas text-lg tracking-wider text-foreground mb-1">
            TALK TO AN EXPERT
          </h4>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Get deal structuring advice from a pro who's done this before.
          </p>
          <Button
            onClick={handleClick}
            className="w-full h-12 text-sm font-semibold tracking-wider rounded-none bg-gold-cta text-black hover:brightness-110"
            style={{
              boxShadow: '0 0 30px rgba(212, 175, 55, 0.25)',
            }}
          >
            BOOK A CALL
          </Button>
          <p className="text-[10px] text-muted-foreground/60 text-center mt-2">
            Free 30-min consultation
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookCallCTA;
