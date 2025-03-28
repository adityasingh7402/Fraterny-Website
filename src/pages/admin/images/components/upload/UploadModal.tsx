import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Upload } from 'lucide-react';
import { uploadImage } from '@/services/images';
import ImagePreview from './ImagePreview';
import ImageCropper from './ImageCropper';
import PredefinedKeysSection from './PredefinedKeysSection';
import UploadForm from './UploadForm';
import { useUploadForm } from './useUploadForm';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [showPredefinedKeys, setShowPredefinedKeys] = useState(false);
  
  const { 
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
  } = useUploadForm();
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (data: { file: File, key: string, description: string, alt_text: string, category?: string }) => 
      uploadImage(data.file, data.key, data.description, data.alt_text, data.category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      onClose();
      resetUploadForm();
      toast.success('Image uploaded successfully');
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
    }
  };
  
  // Function to apply crop
  const getCroppedImg = useCallback(async (): Promise<File | null> => {
    if (!completedCrop || !uploadForm.file || !imgRef.current) {
      toast.error('Unable to crop image, try again');
      return null;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    // Account for zoom and rotation
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Unable to create canvas context');
      return null;
    }
    
    const pixelRatio = window.devicePixelRatio;
    
    // Set canvas size to the cropped area
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    // Clear the canvas
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cropped image
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    // Create a blob from the canvas
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob || !uploadForm.file) {
          resolve(null);
          return;
        }
        
        // Create a new file with the cropped image
        const croppedFile = new File([blob], uploadForm.file.name, {
          type: uploadForm.file.type,
          lastModified: Date.now(),
        });
        
        resolve(croppedFile);
      }, uploadForm.file.type, 0.95);
    });
  }, [completedCrop, uploadForm.file]);
  
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Please select a file');
      return;
    }
    
    // If crop is complete, use the cropped image
    if (isCropping && completedCrop) {
      const croppedFile = await getCroppedImg();
      
      if (!croppedFile) {
        toast.error('Failed to process cropped image');
        return;
      }
      
      uploadMutation.mutate({
        file: croppedFile,
        key: uploadForm.key,
        description: uploadForm.description,
        alt_text: uploadForm.alt_text,
        category: uploadForm.category || undefined
      });
      return;
    }
    
    // Otherwise use the original file
    uploadMutation.mutate({
      file: uploadForm.file,
      key: uploadForm.key,
      description: uploadForm.description,
      alt_text: uploadForm.alt_text,
      category: uploadForm.category || undefined
    });
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
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-medium text-navy">Add New Image</h2>
          <button
            onClick={() => {
              onClose();
              resetUploadForm();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
          {/* Image Preview and Cropping */}
          {imageSrc && (
            <ImagePreview
              imageSrc={imageSrc}
              isCropping={isCropping}
              onToggleCrop={() => setIsCropping(!isCropping)}
            >
              {isCropping ? (
                <ImageCropper
                  imageSrc={imageSrc}
                  crop={crop}
                  setCrop={setCrop}
                  setCompletedCrop={setCompletedCrop}
                  zoom={zoom}
                  setZoom={setZoom}
                  rotation={rotation}
                  setRotation={setRotation}
                  imgRef={imgRef}
                  onApplyChanges={() => {
                    if (completedCrop) {
                      setIsCropping(false);
                      toast.success('Crop applied successfully');
                    }
                  }}
                />
              ) : null}
            </ImagePreview>
          )}
          
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
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetUploadForm();
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
