import { Landmark, Shield, Percent, FileCheck } from "lucide-react";
import WikiScreen from "./WikiScreen";

interface SeniorDebtWikiProps {
  onContinue: () => void;
}

/**
 * SeniorDebtWiki - Education about senior debt
 */
const SeniorDebtWiki = ({ onContinue }: SeniorDebtWikiProps) => {
  return (
    <WikiScreen
      icon={Landmark}
      title="Senior Debt"
      titleHighlight="First-Position Loans"
      subtitle="Bank loans secured against your pre-sales or tax credit receivables."
      sections={[
        {
          icon: Shield,
          title: "What is senior debt?",
          content: "Senior debt is a bank loan that sits in the 'senior' (safest) position of your capital stack. It's secured against collateral like pre-sales contracts or tax credit receivables.",
        },
        {
          icon: FileCheck,
          title: "Who provides it?",
          content: "Entertainment banks (like Comerica, East West Bank) or specialized film lenders. They typically want to see 100%+ coverage from your collateral.",
        },
        {
          icon: Percent,
          title: "Typical terms",
          content: "Interest rates usually 8-12% plus fees. Because it's secured, it's cheaper than gap financing or equity—but you need collateral to qualify.",
        },
      ]}
      proTip={{
        text: "If you don't have pre-sales or tax credits locked, you likely won't have senior debt. Skip if this doesn't apply.",
      }}
      onContinue={onContinue}
    />
  );
};

export default SeniorDebtWiki;
