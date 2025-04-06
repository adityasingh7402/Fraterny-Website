
/**
 * Re-exports from cdnUtils.ts for backward compatibility
 * This file is maintained for compatibility with existing code but should be 
 * considered deprecated. Use direct Supabase methods instead.
 */

import { getImageUrl, isCdnEnabled, setCdnEnabled } from './cdnUtils';

export { getImageUrl, isCdnEnabled, setCdnEnabled };

// Legacy functions
export const getCdnUrl = getImageUrl;
export const testCdnConnection = async (): Promise<boolean> => {
  console.log('[Image System] CDN functionality has been removed. Using Supabase directly.');
  return false;
};
export const testCdnAvailability = async (): Promise<boolean> => false;
export const getCdnAvailability = async (): Promise<boolean> => false;
export const getCdnError = (): string | null => null;
export const getPathExclusions = (): string[] => [];
export const addPathExclusion = (_path: string): void => {};
export const removePathExclusion = (_path: string): void => {};
export const resetPathExclusions = (): void => {};
export const addCdnPathExclusion = (_path: string): void => {};
export const removeCdnPathExclusion = (_path: string): void => {};
export const clearCdnPathExclusions = (): void => {};
