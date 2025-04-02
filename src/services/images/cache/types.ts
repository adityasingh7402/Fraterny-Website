
import { WebsiteImage } from '../types';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Re-export WebsiteImage type for convenience
export type { WebsiteImage };
