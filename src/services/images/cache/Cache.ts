
/**
 * Unified Cache implementation for the image system
 * Supports in-memory caching with localStorage persistence
 */
import { isBrowser } from "@/utils/environment";

type CacheOptions = {
  ttl: number;
  priority: number;
};

type CacheEntry<T> = {
  data: T;
  expires: number;
  priority: number;
  lastAccessed: number;
};

export class Cache<T> {
  private name: string;
  private cache: Map<string, CacheEntry<T>>;
  private maxSize: number;
  private defaultTTL: number;
  private persistToStorage: boolean;
  private debugMode: boolean;

  constructor(
    name: string,
    defaultTTL: number = 5 * 60 * 1000, // 5 minutes
    maxSize: number = 100,
    persistToStorage: boolean = true,
    debugMode: boolean = false
  ) {
    this.name = name;
    this.cache = new Map();
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.persistToStorage = persistToStorage && isBrowser;
    this.debugMode = debugMode;
    
    if (this.persistToStorage) {
      this.loadFromStorage();
    }
    
    this.log(`Cache "${name}" initialized with maxSize=${maxSize}, TTL=${defaultTTL}ms`);
  }

  /**
   * Set a value in the cache
   */
  set(
    key: string,
    data: T,
    options?: Partial<CacheOptions>
  ): void {
    const ttl = options?.ttl || this.defaultTTL;
    const priority = options?.priority || 3;
    
    const entry: CacheEntry<T> = {
      data,
      expires: Date.now() + ttl,
      priority,
      lastAccessed: Date.now()
    };

    // Check if we need to make room in the cache
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLeastValuable();
    }

    // Add to cache
    this.cache.set(key, entry);
    this.log(`Cache set: ${key}`);
    
    // Persist to localStorage if enabled
    if (this.persistToStorage) {
      this.saveToStorage();
    }
  }

  /**
   * Get a value from the cache
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.log(`Cache miss: ${key}`);
      return undefined;
    }
    
    // Check if entry has expired
    if (entry.expires < Date.now()) {
      this.log(`Cache expired: ${key}`);
      this.cache.delete(key);
      
      if (this.persistToStorage) {
        this.saveToStorage();
      }
      
      return undefined;
    }
    
    // Update last accessed time
    entry.lastAccessed = Date.now();
    this.log(`Cache hit: ${key}`);
    
    return entry.data;
  }

  /**
   * Delete a specific key from the cache
   */
  delete(key: string): boolean {
    const result = this.cache.delete(key);
    
    if (result) {
      this.log(`Cache delete: ${key}`);
      
      if (this.persistToStorage) {
        this.saveToStorage();
      }
    }
    
    return result;
  }

  /**
   * Clear all entries from the cache
   */
  clear(): void {
    this.cache.clear();
    this.log('Cache cleared');
    
    if (this.persistToStorage) {
      this.saveToStorage();
    }
  }

  /**
   * Delete matching entries by prefix or pattern
   */
  deleteByPattern(pattern: string | RegExp): number {
    const regex = typeof pattern === 'string' 
      ? new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      : pattern;
      
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      this.log(`Deleted ${count} entries by pattern ${pattern}`);
      
      if (this.persistToStorage) {
        this.saveToStorage();
      }
    }
    
    return count;
  }

  /**
   * Returns the number of entries in the cache
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if the cache has a valid entry for the given key
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    return !!entry && entry.expires > Date.now();
  }

  /**
   * Returns all valid keys in the cache
   */
  keys(): string[] {
    const now = Date.now();
    const validKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires > now) {
        validKeys.push(key);
      }
    }
    
    return validKeys;
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    if (!isBrowser) return;
    
    try {
      const storedData = localStorage.getItem(`cache:${this.name}`);
      
      if (storedData) {
        const parsed = JSON.parse(storedData);
        
        if (parsed && typeof parsed === 'object') {
          for (const [key, entry] of Object.entries(parsed)) {
            this.cache.set(key, entry as CacheEntry<T>);
          }
          
          this.log(`Loaded ${this.cache.size} entries from localStorage`);
          
          // Clean expired entries
          this.cleanExpired();
        }
      }
    } catch (error) {
      console.error(`Error loading cache from localStorage:`, error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    if (!isBrowser) return;
    
    try {
      // First clean expired entries
      this.cleanExpired();
      
      // Convert Map to object for JSON serialization
      const cacheObject: Record<string, CacheEntry<T>> = {};
      
      for (const [key, entry] of this.cache.entries()) {
        cacheObject[key] = entry;
      }
      
      localStorage.setItem(`cache:${this.name}`, JSON.stringify(cacheObject));
      this.log(`Saved ${this.cache.size} entries to localStorage`);
    } catch (error) {
      console.error(`Error saving cache to localStorage:`, error);
    }
  }

  /**
   * Remove expired entries from the cache
   */
  private cleanExpired(): number {
    const now = Date.now();
    let count = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expires < now) {
        this.cache.delete(key);
        count++;
      }
    }
    
    if (count > 0) {
      this.log(`Cleaned ${count} expired entries`);
    }
    
    return count;
  }

  /**
   * Evict the least valuable entry based on priority and access time
   */
  private evictLeastValuable(): void {
    let lowestPriority = 0;
    let oldestAccess = Infinity;
    let keyToEvict: string | null = null;
    
    for (const [key, entry] of this.cache.entries()) {
      // Higher priority number means lower importance
      if (
        entry.priority > lowestPriority || 
        (entry.priority === lowestPriority && entry.lastAccessed < oldestAccess)
      ) {
        lowestPriority = entry.priority;
        oldestAccess = entry.lastAccessed;
        keyToEvict = key;
      }
    }
    
    if (keyToEvict) {
      this.cache.delete(keyToEvict);
      this.log(`Evicted: ${keyToEvict} (priority=${lowestPriority})`);
    }
  }

  /**
   * Logging function that respects debug mode
   */
  private log(message: string): void {
    if (this.debugMode) {
      console.log(`[${this.name}] ${message}`);
    }
  }
}
