import { DollarSign, Target, TrendingUp, Handshake } from "lucide-react";
import { WikiScreen } from "../stack";

interface DealOverviewWikiProps {
  onContinue: () => void;
}

/**
 * DealOverviewWiki - Introduction to Acquisition/Deal concepts
 * 
 * Step 0 of Deal Tab: Educate user on acquisition price and breakeven
 * before they enter their revenue projection.
 */
const DealOverviewWiki = ({ onContinue }: DealOverviewWikiProps) => {
  return (
    <WikiScreen
      icon={Handshake}
      title="Modeling the"
      titleHighlight="Acquisition Deal"
      subtitle="Understanding what distributors pay—and what you need."
      stepLabel="Step 3 of 4 / Deal Modeling"
      sections={[
        {
          icon: DollarSign,
          title: "The Acquisition Price",
          content: "When a streamer or distributor buys your film, they pay an acquisition price—a flat fee for distribution rights.",
          highlight: "This number determines whether your investors get paid.",
        },
        {
          icon: Target,
          title: "Understanding Breakeven",
          content: "Your breakeven is the minimum sale price needed to pay back all costs: sales fees, guild residuals, marketing, debt service, and investor returns.",
          highlight: "We've already calculated this from your capital stack.",
        },
        {
          icon: TrendingUp,
          title: "How Distributors Think",
          content: "Distributors buy films they believe will generate more than they pay. They assess genre, cast, festival buzz, and comparable titles.",
          highlight: "A $1.5M acquisition for a $1M film is only possible if they expect $3M+ in revenue.",
        },
        {
          icon: Handshake,
          title: "Test Different Scenarios",
          content: "Enter an acquisition price to see if it clears your breakeven. Try different numbers to understand your negotiating position.",
          highlight: "What's the minimum you can accept? What's your dream scenario?",
        },
      ]}
      proTip={{
        text: "Most indie deals close between 100-130% of budget. Exceptional films with festival buzz or star power can command more. If your breakeven requires 150%+ of budget, you may need to restructure your capital stack.",
      }}
      onContinue={onContinue}
    />
  );
};

export default DealOverviewWiki;
