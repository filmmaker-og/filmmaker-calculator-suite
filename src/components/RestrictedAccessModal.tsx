import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";

interface RestrictedAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RestrictedAccessModal = ({ isOpen, onClose }: RestrictedAccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm sm:max-w-md mx-auto bg-card border-border overflow-hidden p-0">
        {/* Premium gold accent bar at top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-gold via-[#FFE44D] to-gold" />

        <div className="p-6 pt-8">
          <DialogHeader className="mb-3">
            <DialogTitle className="font-bebas text-3xl sm:text-4xl text-center text-foreground tracking-wider">
              UNLOCK YOUR DECK
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your waterfall is calculated. Now get the investor-ready deck to close your financing.
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                Term sheets • Financial models • Pitch decks
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/store" onClick={onClose}>
                <Button className="w-full btn-vault py-5 text-base min-h-[56px] font-bebas tracking-wider relative overflow-hidden group">
                  <span className="relative z-10 flex items-center justify-center">
                    VIEW PRODUCER SERVICES
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                </Button>
              </Link>

              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full py-4 min-h-[48px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue Modeling
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestrictedAccessModal;
