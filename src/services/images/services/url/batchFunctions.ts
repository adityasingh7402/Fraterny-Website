
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
    // Extract all keys
    const keys = items.map(item => item.args[0]);
    console.log(`[BatchFunction] Processing batch of ${keys.length} keys`);
    
    // Fetch all URLs in a batch
    const urlMap = await batchGetImageUrls(keys);
    
    // Return URLs in the same order as the keys
    return keys.map(key => {
      const url = urlMap[key] || '/placeholder.svg';
      console.log(`[BatchFunction] Resolved key "${key}" to URL: ${url}`);
      return url;
    });
  }
);
