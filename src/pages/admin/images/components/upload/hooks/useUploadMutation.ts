
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  uploadImage, 
  clearImageCache, 
  clearImageUrlCache, 
  updateGlobalCacheVersion,
  clearImageUrlCacheForKey
} from '@/services/images';
import { toast } from 'sonner';

export const useUploadImageMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: { 
      file: File, 
      key: string, 
      description: string, 
      alt_text: string, 
      category?: string 
    }) => {
      return uploadImage(
        data.file, 
        data.key, 
        data.description, 
        data.alt_text, 
        data.category
      );
    },
    onSuccess: async (_, variables) => {
      // Check if we're replacing an existing image
      try {
        const { data } = await queryClient.fetchQuery({
          queryKey: ['check-existing-image', variables.key],
          queryFn: async () => {
            const response = await fetch(`/api/images/exists?key=${variables.key}`);
            return response.json();
          }
        });
        
        // If we're replacing an existing image, use selective cache invalidation
        if (data && data.exists) {
          console.log(`Replacing existing image: ${variables.key}`);
          
          // Get the image key parts for more targeted invalidation
          const keyParts = variables.key.split('/');
          const prefix = keyParts.length > 1 ? keyParts[0] : '';
          
          if (prefix) {
            // If the image has a prefix (like "hero/" or "blog/"), only invalidate that section
            await updateGlobalCacheVersion({ 
              scope: 'prefix', 
              target: prefix 
            });
          } else {
            // Clear only caches related to this specific key
            clearImageUrlCacheForKey(variables.key);
          }
        } else {
          // For new images, we only need to invalidate the relevant queries
          // No need to clear caches since no existing cached data exists
          console.log(`New image uploaded: ${variables.key}`);
        }
        
        // If a category is provided, also invalidate category queries
        if (variables.category) {
          queryClient.invalidateQueries({ 
            queryKey: ['images', 'category', variables.category] 
          });
        }
      } catch (error) {
        console.error('Error checking if image exists:', error);
        // Fallback to traditional cache clearing if the check fails
        clearImageCache();
        clearImageUrlCacheForKey(variables.key);
      }
      
      // Always invalidate the general images query to show the new image
      queryClient.invalidateQueries({ 
        queryKey: ['website-images'],
        exact: false, 
        refetchType: 'all' 
      });
      
      // Show success message
      toast.success(`Image "${variables.key}" uploaded successfully`, {
        description: "The image will be available throughout the website where it's used.",
      });
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      toast.error('Failed to upload image', {
        description: 'Please try again or contact support if the problem persists.'
      });
      console.error('Upload error:', error);
    }
  });
  
  return mutation;
};
