
# Image System Documentation

This system provides a unified approach to handling images stored in Supabase Storage.

## Key Components

1. **Image URL Generation**
   - All images are stored in Supabase Storage bucket named `Website Images`
   - Image URLs are generated using the Supabase SDK's `getPublicUrl` method
   - URL transformation is handled by `pathUtils.ts` to ensure correct formatting

2. **Caching System**
   - Images are cached at multiple levels:
     - React Query - For data fetching and component-level caching
     - Memory Cache - For fast access during the current session
     - LocalStorage - For persistent caching between sessions
     - ServiceWorker - For offline access (when available)
   - Cache invalidation is coordinated across all layers

3. **Network Awareness**
   - The system adapts to network conditions automatically
   - Slow connections use longer cache TTLs and smaller images
   - Offline mode prioritizes cached content

4. **React Hooks**
   - `useImageUrl` - Get a single image URL by key
   - `useMultipleImageUrls` - Get multiple image URLs in one batch
   - `useSupabaseImage` - Low-level hook with detailed loading states
   - `useImagePreloader` - Preload images for better UX

## Usage Examples

### Basic Image Display

```tsx
import { useImageUrl } from '@/hooks/useImage';

function MyComponent() {
  const { url, isLoading, error } = useImageUrl('image-key');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading image</div>;
  
  return <img src={url} alt="My image" />;
}
```

### Multiple Images

```tsx
import { useMultipleImageUrls } from '@/hooks/useImage';

function Gallery() {
  const imageKeys = ['image-1', 'image-2', 'image-3'];
  const { urls, isLoading } = useMultipleImageUrls(imageKeys);
  
  if (isLoading) return <div>Loading gallery...</div>;
  
  return (
    <div>
      {imageKeys.map(key => (
        <img key={key} src={urls[key]} alt={key} />
      ))}
    </div>
  );
}
```

## Migration from Old CDN System

This system replaces the previous CDN architecture. Key differences:

1. Direct Supabase access instead of custom CDN worker
2. Simplified caching with fewer redundant systems
3. Consistent bucket name usage (`Website Images`)
4. Improved error handling and logging

## Storage Bucket Structure

All images are stored in the `Website Images` bucket in Supabase.
The key structure follows these conventions:

- `hero/homepage` - Homepage hero image
- `experience-*` - Experience gallery images
- `logos/*` - Logo variants

## Performance Considerations

- Images are automatically cached at multiple levels
- Network conditions are detected to optimize loading
- Batch operations reduce API calls
- Error handling provides fallbacks for missing images
