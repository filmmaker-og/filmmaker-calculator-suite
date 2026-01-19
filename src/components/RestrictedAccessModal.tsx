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
      <DialogContent className="w-[calc(100%-2rem)] max-w-sm sm:max-w-md mx-auto bg-surface border-gold/20 overflow-hidden p-0">
        {/* Gold accent bar at top */}
        <div className="h-1 w-full bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#D4AF37]" />
        
        <div className="p-6 pt-8">
          <DialogHeader className="mb-2">
            <DialogTitle className="font-bebas text-3xl sm:text-4xl text-center text-foreground tracking-wider">
              UNLOCK YOUR DECK
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <p className="text-muted-foreground text-center text-base leading-relaxed">
              Your numbers are ready. Get the investor-grade presentation to close your funding.
            </p>
            
            <div className="space-y-3">
              <Link to="/store" onClick={onClose}>
                <Button className="w-full btn-vault py-5 text-base min-h-[56px] font-bebas tracking-wider">
                  SEE PRODUCER SERVICES
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full py-4 min-h-[48px] text-muted-foreground hover:text-foreground"
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestrictedAccessModal;
