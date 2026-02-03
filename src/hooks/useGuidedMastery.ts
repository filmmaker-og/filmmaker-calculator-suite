import { useState, useEffect } from 'react';
import { UserExperienceLevel } from '@/components/guided-mastery/OnboardingModal';

interface GuidedMasteryState {
  experienceLevel: UserExperienceLevel | null;
  showTooltips: boolean;
  showExamples: boolean;
  showValidation: boolean;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = 'filmmaker-og-guided-mastery';

export const useGuidedMastery = () => {
  const [state, setState] = useState<GuidedMasteryState>(() => {
    // Try to load from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load guided mastery state:', e);
    }

    // Default state for first-time users
    return {
      experienceLevel: null,
      showTooltips: true,
      showExamples: true,
      showValidation: true,
      hasCompletedOnboarding: false,
    };
  });

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save guided mastery state:', e);
    }
  }, [state]);

  const setExperienceLevel = (level: UserExperienceLevel) => {
    setState((prev) => ({
      ...prev,
      experienceLevel: level,
      hasCompletedOnboarding: true,
      // Adjust help settings based on experience
      showTooltips: level === 'beginner',
      showExamples: level !== 'advanced',
      showValidation: level !== 'advanced',
    }));
  };

  const resetOnboarding = () => {
    setState({
      experienceLevel: null,
      showTooltips: true,
      showExamples: true,
      showValidation: true,
      hasCompletedOnboarding: false,
    });
  };

  const updateSettings = (updates: Partial<Omit<GuidedMasteryState, 'hasCompletedOnboarding'>>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return {
    ...state,
    setExperienceLevel,
    resetOnboarding,
    updateSettings,
  };
};