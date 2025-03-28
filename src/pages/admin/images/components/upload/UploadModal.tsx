
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadImage, clearImageCache, clearImageUrlCache } from '@/services/images';
import PredefinedKeysSection from './PredefinedKeysSection';
import UploadForm from './UploadForm';
import { useUploadForm } from './useUploadForm';
import ModalHeader from './ModalHeader';
import UploadFormSubmit from './UploadFormSubmit';
import ImageCropHandler from './ImageCropHandler';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPredefinedKeys, setShowPredefinedKeys] = useState(false);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  
  const { 
    uploadForm, 
    setUploadForm, 
    resetUploadForm,
    imageSrc,
    setImageSrc
  } = useUploadForm();
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (data: { file: File, key: string, description: string, alt_text: string, category?: string }) => 
      uploadImage(data.file, data.key, data.description, data.alt_text, data.category),
    onSuccess: (_, variables) => {
      // Clear caches to ensure fresh data
      clearImageCache();
      clearImageUrlCache();
      
      // Clear specific cache for this image key
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      
      // Show success message with key
      handleClose();
      toast.success(`Image "${variables.key}" uploaded successfully`, {
        description: "The image will be available throughout the website where it's used.",
      });
    },
    onError: (error) => {
      toast.error('Failed to upload image');
      console.error(error);
    }
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadForm(prev => ({
        ...prev,
        file
      }));
      
      // Create preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setCroppedFile(null);
    }
  };
  
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Please select a file');
      return;
    }
    
    // Use cropped file if available, otherwise use the original file
    const fileToUpload = croppedFile || uploadForm.file;
    
    uploadMutation.mutate({
      file: fileToUpload,
      key: uploadForm.key,
      description: uploadForm.description,
      alt_text: uploadForm.alt_text,
      category: uploadForm.category || undefined
    });
  };
  
  const handleClose = () => {
    onClose();
    resetUploadForm();
    setCroppedFile(null);
  };
  
  const selectPredefinedKey = (key: string, description: string) => {
    setUploadForm(prev => ({
      ...prev,
      key: key,
      description: description
    }));
    setShowPredefinedKeys(false);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <ModalHeader 
          title="Add New Image" 
          onClose={handleClose} 
        />
        
        <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
          {/* Image Preview and Cropping */}
          <ImageCropHandler 
            imageSrc={imageSrc}
            uploadFile={uploadForm.file}
            onCroppedFile={(file) => setCroppedFile(file)}
          />
          
          {/* Placeholder Replacement Information */}
          <PredefinedKeysSection
            showPredefinedKeys={showPredefinedKeys}
            setShowPredefinedKeys={setShowPredefinedKeys}
            onSelectKey={selectPredefinedKey}
          />
          
          {/* Form fields */}
          <UploadForm
            uploadForm={uploadForm}
            setUploadForm={setUploadForm}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
          />
          
          <UploadFormSubmit
            onCancel={handleClose}
            isPending={uploadMutation.isPending}
          />
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
