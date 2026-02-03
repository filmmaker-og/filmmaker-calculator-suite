import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export type UserExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (level: UserExperienceLevel) => void;
}

export const OnboardingModal = ({ isOpen, onComplete }: OnboardingModalProps) => {
  const [experienceLevel, setExperienceLevel] = useState<UserExperienceLevel>('beginner');

  const handleContinue = () => {
    onComplete(experienceLevel);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[500px] bg-black border-[#D4AF37] border-2">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white mb-4">
            FILMMAKER.OG WATERFALL TOOL
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 text-white">
          <p className="text-gray-300 leading-relaxed">
            Model your film's financial structure before your first investor meeting.
          </p>
          
          <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#D4AF37]">⏱</span>
              <span>Takes 5-8 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#D4AF37]">🔒</span>
              <span>All calculations happen in your browser (nothing saved)</span>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-lg font-semibold text-white">
              How familiar are you with recoupment waterfalls?
            </Label>
            
            <RadioGroup
              value={experienceLevel}
              onValueChange={(value) => setExperienceLevel(value as UserExperienceLevel)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-[#2A2A2A] hover:border-[#D4AF37] transition-colors cursor-pointer">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="cursor-pointer flex-1">
                  <div className="font-medium">First time learning this</div>
                  <div className="text-sm text-gray-400">I'll show you helpful tips along the way</div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-[#2A2A2A] hover:border-[#D4AF37] transition-colors cursor-pointer">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="cursor-pointer flex-1">
                  <div className="font-medium">Seen examples, need practice</div>
                  <div className="text-sm text-gray-400">I'll provide context when relevant</div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg border border-[#2A2A2A] hover:border-[#D4AF37] transition-colors cursor-pointer">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="cursor-pointer flex-1">
                  <div className="font-medium">Already familiar, just testing</div>
                  <div className="text-sm text-gray-400">Minimal guidance, fast input</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full bg-[#F9E076] hover:bg-[#F9E076]/90 text-black font-semibold py-6 text-lg"
          >
            Continue →
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};