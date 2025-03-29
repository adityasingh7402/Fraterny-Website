
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage, clearImageCache, clearImageUrlCache } from '@/services/images';
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
    onSuccess: (_, variables) => {
      // Clear caches to ensure fresh data
      clearImageCache();
      clearImageUrlCache();
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      
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
