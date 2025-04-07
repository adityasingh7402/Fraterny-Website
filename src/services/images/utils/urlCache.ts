export interface URLCacheEntry {
  url: string;
  timestamp: number;
  expiresAt: number;
}

export class URLCache {
  private cache = new Map<string, URLCacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.url;
  }

  set(key: string, url: string, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      url,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const urlCache = new URLCache(); 