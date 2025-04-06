
import { createBatchedFunction } from "@/utils/batchApiRequests";
import { getImageUrlByKey } from "./singleImageUrl";
import { batchGetImageUrls } from "./batchImageUrl";

/**
 * Create batched versions of the functions
 * This uses a higher-order function to batch individual requests
 */
export const getImageUrlBatched = createBatchedFunction(
  getImageUrlByKey,
  'getImageUrl',
  50, // 50ms delay to collect batch requests
  async (items) => {
    // Extract all keys and ensure they're all valid
    const keys = items.map(item => {
      const key = item.args[0];
      // Validate keys directly to prevent undefined/empty keys
      if (!key || typeof key !== 'string' || key.trim() === '') {
        console.error(`[BatchFunction] Invalid key in batch: "${key}"`);
        return null;
      }
      return key.trim();
    }).filter(Boolean) as string[];
    
    if (keys.length === 0) {
      console.error('[BatchFunction] No valid keys in batch');
      return items.map(() => '/placeholder.svg');
    }
    
    console.log(`[BatchFunction] Processing batch of ${keys.length} keys`);
    
    // Fetch all URLs in a batch
    const urlMap = await batchGetImageUrls(keys);
    
    // Return URLs in the same order as the keys - handling any invalid keys with placeholders
    return items.map(item => {
      const key = item.args[0];
      if (!key || typeof key !== 'string' || key.trim() === '') {
        return '/placeholder.svg';
      }
      
      const normalizedKey = key.trim();
      const url = urlMap[normalizedKey] || '/placeholder.svg';
      console.log(`[BatchFunction] Resolved key "${normalizedKey}" to URL: ${url}`);
      return url;
    });
  }
);
