/**
 * index.ts
 * Export all result card components and utilities for easy importing
 */

// Card Components
export { default as MindCard } from './MindCard';
export { default as FindingsCard } from './FindingsCard';
export { default as QuotesCard } from './QuotesCard';

// Types
export type { MindCardData, MindCardAttribute } from './MindCard';

// Utils
export { parseContent } from './utils/cardUtils';

// Helper Functions
export * from './utils/animations';
export * from './utils/cardUtils';

// Particles
export { 
  default as Particles,
  MindCardParticles,
  FindingsCardParticles,
  QuotesCardParticles
} from './utils/particles';

/**
 * Example usage:
 * 
 * import { MindCard, FindingsCard, QuotesCard, parseContent } from 'src/components/quest/views/questresultcards';
 * 
 * // In your component
 * const { findings, quotes } = parseContent(resultData.results["section 3"]);
 * 
 * return (
 *   <>
 *     <MindCard data={resultData.results["Mind Card"]} />
 *     <FindingsCard findings={findings} />
 *     <QuotesCard quotes={quotes} />
 *   </>
 * );
 */