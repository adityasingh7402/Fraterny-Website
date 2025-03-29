
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateImage, WebsiteImage, getImageUrlByKey, uploadImage } from '@/services/images';

export const useEditImage = (image: WebsiteImage, onClose: () => void) => {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [isReplacing, setIsReplacing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    key: image.key,
    description: image.description,
    alt_text: image.alt_text,
    category: image.category || ''
  });
  
  // Load the original image on mount
  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await getImageUrlByKey(image.key);
        setPreviewUrl(url);
      } catch (error) {
        console.error('Failed to load image preview:', error);
      }
    };
    
    fetchImageUrl();
    
    // Clean up any blob URLs when unmounting
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [image.key]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile) {
      // Clean up previous blob URL if exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setFile(selectedFile);
      setCroppedFile(null);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setIsReplacing(true);
    }
  };

  const handleCroppedFile = (newCroppedFile: File) => {
    // Clean up previous blob URL if exists
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setCroppedFile(newCroppedFile);
    
    // Update preview with cropped version
    const objectUrl = URL.createObjectURL(newCroppedFile);
    setPreviewUrl(objectUrl);
  };

  const cancelReplacement = () => {
    // Clean up any blob URLs to prevent memory leaks
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    setFile(null);
    setCroppedFile(null);
    setIsReplacing(false);
    
    // Restore original image preview
    const fetchOriginalImage = async () => {
      try {
        const url = await getImageUrlByKey(image.key);
        setPreviewUrl(url);
      } catch (error) {
        console.error('Failed to restore original image preview:', error);
      }
    };
    
    fetchOriginalImage();
  };
  
  const replaceImageMutation = useMutation({
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
    onSuccess: () => {
      // Clean up any blob URLs
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      onClose();
      toast.success('Image replaced successfully');
    },
    onError: (error) => {
      toast.error('Failed to replace image');
      console.error(error);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: { id: string, updates: Partial<WebsiteImage> }) => 
      updateImage(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      onClose();
      toast.success('Image updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update image');
      console.error(error);
    }
  });
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we're replacing the image
    if (isReplacing && (croppedFile || file)) {
      const fileToUpload = croppedFile || file;
      if (fileToUpload) {
        replaceImageMutation.mutate({
          file: fileToUpload,
          key: editForm.key,
          description: editForm.description,
          alt_text: editForm.alt_text,
          category: editForm.category || undefined,
        });
        return;
      }
    }
    
    // Otherwise just update the metadata
    updateMutation.mutate({
      id: image.id,
      updates: {
        key: editForm.key,
        description: editForm.description,
        alt_text: editForm.alt_text,
        category: editForm.category || null
      }
    });
  };

  return {
    previewUrl,
    file,
    croppedFile,
    isReplacing,
    editForm,
    setEditForm,
    updateMutation,
    replaceImageMutation,
    handleEditSubmit,
    handleFileChange,
    handleCroppedFile,
    setIsReplacing,
    cancelReplacement
  };
};
