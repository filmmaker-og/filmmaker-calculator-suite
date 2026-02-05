import { Users, Target, TrendingUp, Percent } from "lucide-react";
import WikiScreen from "./WikiScreen";

interface EquityWikiProps {
  onContinue: () => void;
}

/**
 * EquityWiki - Education about equity investment
 */
const EquityWiki = ({ onContinue }: EquityWikiProps) => {
  return (
    <WikiScreen
      icon={Users}
      title="Equity"
      titleHighlight="Investment"
      subtitle="The cash that goes in last—and carries the most risk (and reward)."
      sections={[
        {
          icon: Target,
          title: "What is equity?",
          content: "Equity is cash investment that isn't secured by collateral. Equity investors take on the most risk because they only get paid after all debt is repaid.",
          highlight: "Last money in, last money out.",
        },
        {
          icon: Percent,
          title: "The preferred return",
          content: "To compensate for risk, equity investors typically receive their principal back PLUS a 'preferred return' (usually 15-25%) before any profit split.",
        },
        {
          icon: TrendingUp,
          title: "Upside participation",
          content: "After hitting their hurdle (principal + pref), equity investors typically split remaining profits 50/50 with producers. High risk, but uncapped upside.",
        },
      ]}
      proTip={{
        text: "Every film needs equity to cover the gap between debt/credits and budget. This is usually the largest single source of capital.",
      }}
      onContinue={onContinue}
    />
  );
};

export default EquityWiki;
