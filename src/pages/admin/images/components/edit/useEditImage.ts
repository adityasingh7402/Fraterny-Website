
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateImage, WebsiteImage, getImageUrlByKey } from '@/services/images';

export const useEditImage = (image: WebsiteImage, onClose: () => void) => {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [editForm, setEditForm] = useState({
    key: image.key,
    description: image.description,
    alt_text: image.alt_text,
    category: image.category || ''
  });
  
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
  }, [image.key]);
  
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
    editForm,
    setEditForm,
    updateMutation,
    handleEditSubmit
  };
};
