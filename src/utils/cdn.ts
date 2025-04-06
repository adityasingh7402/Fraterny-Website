
/**
 * This file now only re-exports minimal functionality needed for backward compatibility
 * The CDN architecture has been completely removed in favor of direct Supabase integration
 */

// Export empty placeholder functions to avoid breaking existing imports
export const getCdnUrl = (url: string): string => url;
export const isCdnEnabled = (): boolean => false;
export const setCdnEnabled = (_enabled: boolean): void => {};
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
