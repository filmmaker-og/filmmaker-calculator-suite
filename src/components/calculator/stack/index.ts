// Stack Mini-App Components
// Step-based architecture: each step is an isolated mini-app

export { default as WikiScreen } from './WikiScreen';
export { default as StackInputCard } from './StackInputCard';

// Step 0: Overview
export { default as StackOverviewWiki } from './StackOverviewWiki';

// Step 1-2: Tax Credits
export { default as TaxCreditsWiki } from './TaxCreditsWiki';
export { default as TaxCreditsInput } from './TaxCreditsInput';

// Step 3-4: Senior Debt
export { default as SeniorDebtWiki } from './SeniorDebtWiki';
export { default as SeniorDebtInput } from './SeniorDebtInput';

// Step 5-6: Gap/Mezz
export { default as GapMezzWiki } from './GapMezzWiki';
export { default as GapMezzInput } from './GapMezzInput';

// Step 7-8: Equity
export { default as EquityWiki } from './EquityWiki';
export { default as EquityInput } from './EquityInput';

// Step 9-10: Deferments
export { default as DefermentsWiki } from './DefermentsWiki';
export { default as DefermentsInput } from './DefermentsInput';

// Step 11: Summary
export { default as StackSummary } from './StackSummary';
