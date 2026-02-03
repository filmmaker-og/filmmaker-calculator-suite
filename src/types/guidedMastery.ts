export type UserExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface GuidedMasteryState {
  experienceLevel: UserExperienceLevel | null;
  showTooltips: boolean;
  showExamples: boolean;
  showValidation: boolean;
  hasCompletedOnboarding: boolean;
  currentChapter: number;
}

export interface ChapterConfig {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  estimatedMinutes: number;
}

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 1,
    title: 'Your Asset',
    subtitle: 'Define your production budget',
    icon: '🎬',
    estimatedMinutes: 1,
  },
  {
    id: 2,
    title: 'Capital Structure',
    subtitle: 'How will you finance it?',
    icon: '💰',
    estimatedMinutes: 3,
  },
  {
    id: 3,
    title: 'Waterfall Mechanics',
    subtitle: 'Who gets paid first?',
    icon: '💧',
    estimatedMinutes: 2,
  },
  {
    id: 4,
    title: 'The Verdict',
    subtitle: 'Will your deal work?',
    icon: '⚖️',
    estimatedMinutes: 2,
  },
];