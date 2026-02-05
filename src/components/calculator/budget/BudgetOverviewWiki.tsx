import { DollarSign, Sparkles, Lightbulb, Target } from "lucide-react";
import { WikiScreen } from "../stack";

interface BudgetOverviewWikiProps {
  onContinue: () => void;
}

/**
 * BudgetOverviewWiki - Introduction to Negative Cost concept
 * 
 * Step 0 of Budget Tab: Educate user on what the budget means
 * before they enter their number.
 */
const BudgetOverviewWiki = ({ onContinue }: BudgetOverviewWikiProps) => {
  return (
    <WikiScreen
      icon={DollarSign}
      title="What is the"
      titleHighlight="Negative Cost?"
      subtitle="The foundation of every financial projection for your film."
      stepLabel="Step 1 of 4 / Budget"
      sections={[
        {
          icon: DollarSign,
          title: "Your Total Production Budget",
          content: "The negative cost is every dollar it takes to get your film from development through final delivery. It's called 'negative' because it's the cost to create the negative (the original master).",
          highlight: "This number is the foundation of every investor projection.",
        },
        {
          icon: Sparkles,
          title: "What's Typically Included",
          content: "Development, pre-production, principal photography, post-production, music licensing, deliverables, insurance, legal, and contingency.",
          highlight: "It does NOT include marketing or distribution costs—those come later.",
        },
        {
          icon: Target,
          title: "Why Investors Care",
          content: "Your budget determines your breakeven point—the minimum sale price needed to pay everyone back. A lower budget means a lower bar to clear.",
          highlight: "Investors want to know you can make a sellable film at a realistic price.",
        },
      ]}
      proTip={{
        text: "If you don't have a locked budget yet, use a realistic estimate. You can always adjust—the goal is to understand how the math works at different budget levels.",
      }}
      onContinue={onContinue}
    />
  );
};

export default BudgetOverviewWiki;
