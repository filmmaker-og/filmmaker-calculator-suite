import { Receipt, Building2, DollarSign, Globe } from "lucide-react";
import WikiScreen from "./WikiScreen";

interface TaxCreditsWikiProps {
  onContinue: () => void;
}

/**
 * TaxCreditsWiki - Education about tax credits/incentives
 */
const TaxCreditsWiki = ({ onContinue }: TaxCreditsWikiProps) => {
  return (
    <WikiScreen
      icon={Receipt}
      title="Tax Credits &"
      titleHighlight="Incentives"
      subtitle="Government money that reduces what your investors need to put in."
      sections={[
        {
          icon: Building2,
          title: "What are they?",
          content: "Tax credits are government incentives (typically 20-40% of qualifying spend) designed to attract film production to specific locations.",
          highlight: "It's essentially free money.",
        },
        {
          icon: DollarSign,
          title: "Why they matter",
          content: "Credits offset your capital requirements—every dollar in credits is a dollar less your equity investors need to risk. They're also the first money repaid in the waterfall.",
        },
        {
          icon: Globe,
          title: "Common locations",
          content: "UK (25%), Georgia (20-30%), New Mexico (25-35%), Ireland (32%), Canada (varies by province). Rates and rules change frequently.",
        },
      ]}
      proTip={{
        text: "If you haven't locked a location yet, skip this step. You can always come back and add credits later.",
      }}
      onContinue={onContinue}
    />
  );
};

export default TaxCreditsWiki;
