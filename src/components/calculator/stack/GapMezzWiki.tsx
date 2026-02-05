import { CreditCard, TrendingUp, AlertTriangle, Layers } from "lucide-react";
import WikiScreen from "./WikiScreen";

interface GapMezzWikiProps {
  onContinue: () => void;
}

/**
 * GapMezzWiki - Education about gap/mezzanine financing
 */
const GapMezzWiki = ({ onContinue }: GapMezzWikiProps) => {
  return (
    <WikiScreen
      icon={CreditCard}
      title="Gap / Mezzanine"
      titleHighlight="Bridge Financing"
      subtitle="Higher-risk loans that bridge the gap between senior debt and equity."
      sections={[
        {
          icon: Layers,
          title: "What is gap financing?",
          content: "Gap loans cover the difference when your senior debt doesn't fully cover your soft costs or when you need to bridge timing. 'Mezzanine' means it sits between senior debt and equity.",
        },
        {
          icon: TrendingUp,
          title: "Higher risk, higher cost",
          content: "Because gap lenders are subordinate to senior debt, they take more risk and charge higher rates—typically 15-20% interest plus fees.",
        },
        {
          icon: AlertTriangle,
          title: "When you need it",
          content: "Common when pre-sales don't cover the full budget, or when you're waiting on tax credit cashflow. Some films skip this entirely.",
        },
      ]}
      proTip={{
        text: "Gap financing is expensive. If your senior debt + equity covers the budget, you can skip this.",
      }}
      onContinue={onContinue}
    />
  );
};

export default GapMezzWiki;
