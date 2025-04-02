
import { createBatchedFunction } from "@/utils/batchApiRequests";
import { getImageUrlByKey } from "./singleImageUrl";
import { batchGetImageUrls } from "./batchImageUrl";

/**
 * Create batched versions of the functions
 */
export const getImageUrlBatched = createBatchedFunction(
  getImageUrlByKey,
  'getImageUrl',
  50, // 50ms delay to collect batch requests
  async (items) => {
    // Extract all keys
    const keys = items.map(item => item.args[0]);
    
    // Fetch all URLs in a batch
    const urlMap = await batchGetImageUrls(keys);
    
    // Return URLs in the same order as the keys
    return keys.map(key => urlMap[key] || '/placeholder.svg');
  }
);
