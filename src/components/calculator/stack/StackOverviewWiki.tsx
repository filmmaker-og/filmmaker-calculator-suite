import { Layers, TrendingUp, Shield, Info } from "lucide-react";
import WikiScreen from "./WikiScreen";

interface StackOverviewWikiProps {
  onContinue: () => void;
}

/**
 * StackOverviewWiki - Introduction to Capital Stack concept
 * 
 * Step 0 of Stack Tab: Educate user on what a capital stack is
 * before they start entering individual capital sources.
 */
const StackOverviewWiki = ({ onContinue }: StackOverviewWikiProps) => {
  return (
    <WikiScreen
      icon={Layers}
      title="What is a"
      titleHighlight="Capital Stack?"
      subtitle="Understanding how your film gets funded—and who gets paid first."
      stepLabel="Step 2 of 4 / Capital Stack"
      sections={[
        {
          icon: Layers,
          title: "The Stack = Your Funding Sources",
          content: "The capital stack is how your budget gets funded—different money sources stacked on top of each other. Each layer has different risk, cost, and repayment priority.",
          highlight: "Think of it like a layer cake where the bottom gets served first.",
        },
        {
          icon: TrendingUp,
          title: "Repayment Order (The Waterfall)",
          content: "When your film sells, money flows through the stack from top to bottom. Tax credits first (lowest risk), then debt, then equity.",
          highlight: "Each tier must be fully paid before the next tier sees a dollar.",
        },
        {
          icon: Shield,
          title: "Risk vs. Reward",
          content: "Higher risk = higher reward. Tax credits take almost no risk (so no upside). Equity investors take the most risk but get a premium plus profit share.",
        },
      ]}
      proTip={{
        text: "Most indie films use 2-3 capital sources. You don't need all of them—we'll walk through each one and you can skip what doesn't apply.",
      }}
      onContinue={onContinue}
    />
  );
};

export default StackOverviewWiki;
