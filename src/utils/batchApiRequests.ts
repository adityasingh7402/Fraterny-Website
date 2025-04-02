
/**
 * Utility for batching multiple API requests together
 */

type BatchableFunction<T> = (...args: any[]) => Promise<T>;
type BatchKey = string;

interface BatchItem<T> {
  resolve: (value: T) => void;
  reject: (error: any) => void;
  args: any[];
}

// Map to store batch queues
const batchQueues = new Map<
  BatchKey, 
  {
    timer: NodeJS.Timeout | null;
    items: BatchItem<any>[];
  }
>();

/**
 * Creates a batched version of a function
 * @param fn The original function to be batched
 * @param batchKey A unique key to identify this batch group
 * @param delay Delay in ms before the batch is processed (default: 50ms)
 * @param processBatch Function to process the batched requests
 * @returns A batched version of the function
 */
export function createBatchedFunction<T, U>(
  fn: BatchableFunction<T>,
  batchKey: BatchKey,
  delay: number = 50,
  processBatch?: (items: BatchItem<U>[]) => Promise<U[]>
): (...args: Parameters<typeof fn>) => Promise<T> {
  
  return (...args: Parameters<typeof fn>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      // Initialize batch queue if it doesn't exist
      if (!batchQueues.has(batchKey)) {
        batchQueues.set(batchKey, { timer: null, items: [] });
      }
      
      const queue = batchQueues.get(batchKey)!;
      
      // Add item to queue
      queue.items.push({ resolve, reject, args });
      
      // Clear existing timer
      if (queue.timer) {
        clearTimeout(queue.timer);
        queue.timer = null;
      }
      
      // Set new timer
      queue.timer = setTimeout(async () => {
        const items = queue.items;
        queue.items = [];
        queue.timer = null;
        
        try {
          if (processBatch) {
            // Custom batch processing logic
            const results = await processBatch(items);
            items.forEach((item, index) => item.resolve(results[index]));
          } else {
            // Default batch processing: call the function for each item
            for (const item of items) {
              try {
                const result = await fn(...item.args);
                item.resolve(result);
              } catch (error) {
                item.reject(error);
              }
            }
          }
        } catch (error) {
          // Reject all promises in the batch if processing fails
          items.forEach(item => item.reject(error));
        }
      }, delay);
    });
  };
}
