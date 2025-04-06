
/**
 * Type definitions for the image service
 */

export interface WebsiteImage {
  id: string;
  key: string;
  description: string;
  alt_text: string;
  storage_path: string;
  category?: string | null;
  width?: number | null;
  height?: number | null;
  sizes?: Record<string, string> | null;
  metadata?: Record<string, any> | null;
  url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ImageMetadata {
  placeholders?: {
    tiny?: string | null;
    color?: string | null;
  };
  contentHash?: string;
  lastModified?: string;
  [key: string]: any;
}

export interface CacheOptions {
  ttl?: number;
  priority?: 1 | 2 | 3 | 4; // 1 is highest, 4 is lowest
  staleWhileRevalidate?: boolean;
}

export interface ImageSize {
  width: number;
  height: number;
}

export type ImageSizeVariant = 'small' | 'medium' | 'large' | 'original';

export interface OptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  width?: number;
  height?: number;
}

export interface ServiceWorkerCacheEntry {
  url: string;
  timestamp: number;
  expires: number;
  key?: string;
}

// Define a Json type for compatibility with Supabase
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
