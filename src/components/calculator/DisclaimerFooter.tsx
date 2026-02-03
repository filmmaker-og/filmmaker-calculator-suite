import { AlertTriangle } from "lucide-react";

const DisclaimerFooter = () => {
  return (
    <div className="mt-8 py-4 border-t border-[#1A1A1A]">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-gold/40 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-white/30 leading-relaxed">
          <span className="text-gold/50 font-medium">Educational model only.</span>{" "}
          Not financial, legal, or investment advice. Consult qualified entertainment 
          counsel and financial advisor before making deal decisions.
        </p>
      </div>
    </div>
  );
};

export default DisclaimerFooter;
