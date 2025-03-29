
import { WebsiteSettings, SettingsCache } from './types';

// Cache for website settings
let settingsCache: SettingsCache | null = null;

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const getSettingsFromCache = (): WebsiteSettings | null => {
  if (settingsCache && Date.now() - settingsCache.timestamp < CACHE_DURATION) {
    console.log('Using cached website settings');
    return settingsCache.settings;
  }
  return null;
};

export const updateSettingsCache = (settings: WebsiteSettings): void => {
  settingsCache = {
    settings,
    timestamp: Date.now()
  };
};

export const invalidateSettingsCache = (): void => {
  settingsCache = null;
  console.log('Website settings cache invalidated');
};
