
import { useState } from 'react';
import { type Crop as CropArea } from 'react-image-crop';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadImage, clearImageCache, clearImageUrlCache } from '@/services/images';
import { toast } from 'sonner';

export interface UploadFormState {
  key: string;
  description: string;
  alt_text: string;
  category: string;
  file: File | null;
}

export const useUploadForm = () => {
  // Form state for upload
  const [uploadForm, setUploadForm] = useState<UploadFormState>({
    key: '',
    description: '',
    alt_text: '',
    category: '',
    file: null
  });
  
  // Image cropping state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropArea>({
    unit: 'px',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<CropArea | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  
  const resetUploadForm = () => {
    setUploadForm({
      key: '',
      description: '',
      alt_text: '',
      category: '',
      file: null
    });
    
    setImageSrc(null);
    setCrop({
      unit: 'px',
      width: 80,
      height: 80,
      x: 10,
      y: 10
    });
    setCompletedCrop(null);
    setZoom(1);
    setRotation(0);
    setIsCropping(false);
  };
  
  return {
    uploadForm,
    setUploadForm,
    resetUploadForm,
    imageSrc,
    setImageSrc,
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    isCropping,
    setIsCropping
  };
};

// Add the missing useUploadImageMutation hook
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
