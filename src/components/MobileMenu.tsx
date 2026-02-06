import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Home, Calculator, BookOpen, Book } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 bottom-0 w-[280px] bg-bg-card border-l border-border-default z-[201] p-6 shadow-modal transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-text-dim hover:text-white rounded-full hover:bg-white/5 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-text-dim uppercase tracking-widest pl-3">Menu</h3>
            
            <button
              onClick={() => handleNavigate('/')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Home className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => handleNavigate('/calculator')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Calculator className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-medium">Calculator</span>
            </button>

            <button
              onClick={() => handleNavigate('/waterfall-info')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <BookOpen className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-medium">Waterfall Protocol</span>
            </button>

            <button
              onClick={() => handleNavigate('/glossary')}
              className="w-full flex items-center gap-3 p-3 rounded-lg text-text-primary hover:bg-bg-elevated transition-colors text-left group"
            >
              <Book className="w-5 h-5 text-gold/70 group-hover:text-gold" />
              <span className="font-medium">Glossary</span>
            </button>
          </div>

          <div className="pt-6 border-t border-border-default">
            <p className="text-xs text-text-dim px-3">
              FILMMAKER.OG v2.0.5
              <br />
              <span className="opacity-50">Build: {new Date().toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
