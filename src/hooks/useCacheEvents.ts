
import { useEffect, useRef } from 'react';

// Cache event types
type CacheEventType = 'invalidate' | 'update' | 'clear';

// Cache event data
interface CacheEvent {
  type: CacheEventType;
  key?: string;
  category?: string;
  prefix?: string;
  scope?: 'global' | 'key' | 'category' | 'prefix';
  timestamp: number;
}

// Cache event listeners store
const listeners = new Map<string, Set<(event: CacheEvent) => void>>();

// Create a unique ID for each listener
let nextListenerId = 1;

/**
 * Dispatch a cache event to all registered listeners
 */
export const dispatchCacheEvent = (event: CacheEvent): void => {
  listeners.forEach(listenerSet => {
    listenerSet.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in cache event listener:', error);
      }
    });
  });
};

/**
 * Hook to listen for cache events
 */
export const useCacheEvents = (
  callback: (event: CacheEvent) => void,
  deps: any[] = []
) => {
  const idRef = useRef<string | null>(null);
  
  useEffect(() => {
    // Generate a unique ID for this listener if it doesn't have one yet
    if (!idRef.current) {
      idRef.current = `listener-${nextListenerId++}`;
    }
    
    const id = idRef.current;
    
    // Create a listener set for this ID if it doesn't exist
    if (!listeners.has(id)) {
      listeners.set(id, new Set());
    }
    
    // Add the callback to the listener set
    const listenerSet = listeners.get(id)!;
    listenerSet.add(callback);
    
    // Clean up when the component unmounts or deps change
    return () => {
      if (listeners.has(id)) {
        const set = listeners.get(id)!;
        set.delete(callback);
        
        // Remove the listener set if it's empty
        if (set.size === 0) {
          listeners.delete(id);
        }
      }
    };
  }, [callback, ...deps]);
  
  // Return a function to manually dispatch events
  return {
    dispatchEvent: dispatchCacheEvent
  };
};

/**
 * Utility hook to listen for invalidation events for a specific resource
 */
export const useCacheInvalidation = (
  key: string | null | undefined,
  onInvalidate: () => void
) => {
  useCacheEvents((event) => {
    if (!key) return;
    
    // Check if this event affects our key
    const isRelevant = (
      event.type === 'invalidate' || 
      event.type === 'clear' || 
      (event.type === 'update' && event.scope === 'global')
    );
    
    const isTargeted = (
      event.key === key || 
      (event.prefix && key.startsWith(event.prefix)) ||
      (event.category && key.includes(`/${event.category}/`))
    );
    
    if (isRelevant && (isTargeted || !event.key)) {
      onInvalidate();
    }
  }, [key, onInvalidate]);
};
