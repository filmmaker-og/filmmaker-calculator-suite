import { useState } from 'react';
import { HelpCircle, Film, BarChart3, Book, RotateCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface HelpEscapeHatchProps {
  onLoadExample: () => void;
  onShowRanges: () => void;
  onExplainPage: () => void;
  onStartOver: () => void;
  className?: string;
}

export const HelpEscapeHatch = ({
  onLoadExample,
  onShowRanges,
  onExplainPage,
  onStartOver,
  className,
}: HelpEscapeHatchProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-[#D4AF37] hover:bg-[#F9E076] text-black shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <HelpCircle className="w-7 h-7" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-72 bg-[#0A0A0A] border-[#D4AF37] border-2 text-white"
        >
          <div className="px-3 py-2 border-b border-[#2A2A2A]">
            <h4 className="font-semibold text-[#F9E076]">Need Help?</h4>
            <p className="text-xs text-gray-400 mt-1">
              Choose an option to get unstuck
            </p>
          </div>

          <DropdownMenuItem
            onClick={() => {
              onLoadExample();
              setIsOpen(false);
            }}
            className="cursor-pointer hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] py-3"
          >
            <Film className="w-5 h-5 mr-3 text-[#D4AF37]" />
            <div>
              <div className="font-medium">Load example deal</div>
              <div className="text-xs text-gray-400">See how real films structure</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              onShowRanges();
              setIsOpen(false);
            }}
            className="cursor-pointer hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] py-3"
          >
            <BarChart3 className="w-5 h-5 mr-3 text-[#D4AF37]" />
            <div>
              <div className="font-medium">Show typical ranges</div>
              <div className="text-xs text-gray-400">Industry standard data</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              onExplainPage();
              setIsOpen(false);
            }}
            className="cursor-pointer hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] py-3"
          >
            <Book className="w-5 h-5 mr-3 text-[#D4AF37]" />
            <div>
              <div className="font-medium">Explain this page</div>
              <div className="text-xs text-gray-400">What am I looking at?</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-[#2A2A2A]" />

          <DropdownMenuItem
            onClick={() => {
              onStartOver();
              setIsOpen(false);
            }}
            className="cursor-pointer hover:bg-[#2A2A2A] focus:bg-[#2A2A2A] py-3 text-red-400"
          >
            <RotateCcw className="w-5 h-5 mr-3" />
            <div>
              <div className="font-medium">Start over</div>
              <div className="text-xs text-gray-400">Clear all inputs</div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};