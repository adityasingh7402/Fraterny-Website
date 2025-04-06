
// Re-export functions from modular files
export * from './utils';  // This should be exporting isValidImageKey already

// Export specific functions from singleImageUrl
export { 
  getImageUrlByKey,
  getImageUrlByKeyAndSize
} from './singleImageUrl';

// Export specific functions from batchImageUrl 
export { 
  batchGetImageUrls,
  getImageUrlBatched
} from './batchImageUrl';

// Export renamed batch function for backwards compatibility
// This is no longer used in the codebase
export { 
  getImageUrlBatched as getImageUrlBatchedOptimized 
} from './batchFunctions';
