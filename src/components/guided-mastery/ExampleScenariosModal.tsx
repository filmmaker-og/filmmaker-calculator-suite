import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Film } from 'lucide-react';

export interface ExampleScenario {
  id: string;
  name: string;
  description: string;
  budget: number;
  taxCredits: number;
  debtAmount?: number;
  debtRate?: number;
  equityAmount: number;
  salesAgentRate: number;
  marketingCap: number;
  hasGuilds: boolean;
}

const EXAMPLE_SCENARIOS: ExampleScenario[] = [
  {
    id: 'micro',
    name: '$500K Micro-Budget',
    description: 'First-time producer. No-name cast. Regional festival premiere strategy.',
    budget: 500000,
    taxCredits: 150000, // 30%
    equityAmount: 350000,
    salesAgentRate: 15,
    marketingCap: 25000,
    hasGuilds: false,
  },
  {
    id: 'mid-range',
    name: '$2M Mid-Range Indie',
    description: 'Recognizable cast. Sales agent attached. Pre-sales to cover gap.',
    budget: 2000000,
    taxCredits: 600000, // 30%
    debtAmount: 800000,
    debtRate: 10,
    equityAmount: 600000,
    salesAgentRate: 15,
    marketingCap: 75000,
    hasGuilds: true,
  },
  {
    id: 'prestige',
    name: '$5M Prestige Package',
    description: 'A-list talent. Major festival premiere. Theatrical ambitions.',
    budget: 5000000,
    taxCredits: 1500000, // 30%
    debtAmount: 2000000,
    debtRate: 8,
    equityAmount: 1500000,
    salesAgentRate: 12,
    marketingCap: 150000,
    hasGuilds: true,
  },
];

interface ExampleScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: ExampleScenario) => void;
}

export const ExampleScenariosModal = ({
  isOpen,
  onClose,
  onSelectScenario,
}: ExampleScenariosModalProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-black border-[#D4AF37] border-2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            🎬 Load Example Deal
          </DialogTitle>
          <p className="text-gray-400 text-sm mt-2">
            See how real films structure their financing. Select one to populate the calculator.
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {EXAMPLE_SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-[#0A0A0A] border-2 border-[#2A2A2A] hover:border-[#D4AF37] rounded-lg p-6 transition-all cursor-pointer group"
              onClick={() => {
                onSelectScenario(scenario);
                onClose();
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg group-hover:text-[#F9E076] transition-colors">
                    {scenario.name}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {scenario.description}
                  </p>
                </div>
                <Film className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="text-gray-500 text-xs">Budget</div>
                  <div className="text-white font-semibold">
                    {formatCurrency(scenario.budget)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Tax Credits</div>
                  <div className="text-white font-semibold">
                    {formatCurrency(scenario.taxCredits)}
                  </div>
                </div>
                {scenario.debtAmount && (
                  <div>
                    <div className="text-gray-500 text-xs">Debt</div>
                    <div className="text-white font-semibold">
                      {formatCurrency(scenario.debtAmount)} @ {scenario.debtRate}%
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500 text-xs">Equity</div>
                  <div className="text-white font-semibold">
                    {formatCurrency(scenario.equityAmount)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs">
                <span className={`px-2 py-1 rounded ${scenario.hasGuilds ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-gray-700 text-gray-400'}`}>
                  {scenario.hasGuilds ? 'Union' : 'Non-Union'}
                </span>
                <span className="text-gray-400">
                  {scenario.salesAgentRate}% sales agent
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#2A2A2A]">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-[#2A2A2A] hover:border-[#D4AF37] text-white"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};