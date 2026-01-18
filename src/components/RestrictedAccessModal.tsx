import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, ArrowRight } from "lucide-react";

interface RestrictedAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RestrictedAccessModal = ({ isOpen, onClose }: RestrictedAccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-surface border-gold/20 max-w-md mx-6">
        <DialogHeader>
          <div className="w-16 h-16 border border-gold flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gold" />
          </div>
          <DialogTitle className="font-bebas text-3xl text-center text-foreground tracking-wider">
            RESTRICTED ACCESS
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-muted-foreground text-center text-sm leading-relaxed">
            Generating investor-ready artifacts requires a service package. 
            We audit models to ensure bankability.
          </p>
          
          <div className="space-y-3">
            <Link to="/store" onClick={onClose}>
              <Button className="w-full btn-vault py-5 text-base">
                VIEW PACKAGING SERVICES
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full py-4 text-muted-foreground hover:text-foreground"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestrictedAccessModal;