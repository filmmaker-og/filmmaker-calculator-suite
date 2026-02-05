import { Clock, Users, Gift, FileText } from "lucide-react";
import WikiScreen from "./WikiScreen";

interface DefermentsWikiProps {
  onContinue: () => void;
}

/**
 * DefermentsWiki - Education about deferred compensation
 */
const DefermentsWiki = ({ onContinue }: DefermentsWikiProps) => {
  return (
    <WikiScreen
      icon={Clock}
      title="Deferred"
      titleHighlight="Compensation"
      subtitle="Fees that key talent agrees to defer until the film makes money."
      sections={[
        {
          icon: Users,
          title: "What are deferments?",
          content: "Deferments are fees that producers, directors, writers, or actors agree to delay receiving until after investors are repaid. It's a way to reduce upfront costs.",
        },
        {
          icon: Gift,
          title: "Why they matter",
          content: "Deferments reduce your production budget, making the film easier to finance. But they still need to be repaid before anyone sees profit participation.",
        },
        {
          icon: FileText,
          title: "Waterfall position",
          content: "Deferments are typically paid AFTER equity investors get their principal + preferred return, but BEFORE the 50/50 profit split kicks in.",
        },
      ]}
      proTip={{
        text: "Common deferments: producer fees, director fees, writer bonuses, and sometimes above-the-line talent participation.",
      }}
      onContinue={onContinue}
    />
  );
};

export default DefermentsWiki;
