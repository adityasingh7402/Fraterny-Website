import { useState, useRef, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Upload, Info, Crop, ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';
import { uploadImage } from '@/services/images';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

// Available image categories
const IMAGE_CATEGORIES = [
  'Hero',
  'Background',
  'Banner',
  'Icon',
  'Profile',
  'Thumbnail',
  'Gallery',
  'Product'
];

// Common website image keys that replace placeholders
const COMMON_IMAGE_KEYS = [
  { key: 'hero-background', description: 'Main Hero Section - Homepage' },
  { key: 'villalab-social', description: 'Villa Lab Section - Social Events' },
  { key: 'villalab-mentorship', description: 'Villa Lab Section - Mentorship' },
  { key: 'villalab-brainstorm', description: 'Villa Lab Section - Brainstorming' },
  { key: 'villalab-group', description: 'Villa Lab Section - Group Activities' },
  { key: 'villalab-networking', description: 'Villa Lab Section - Networking' },
  { key: 'villalab-candid', description: 'Villa Lab Section - Candid Interactions' },
  { key: 'villalab-gourmet', description: 'Villa Lab Section - Gourmet Meals' },
  { key: 'villalab-workshop', description: 'Villa Lab Section - Workshops' },
  { key: 'villalab-evening', description: 'Villa Lab Section - Evening Sessions' },
  { key: 'experience-villa-retreat', description: 'Experience Page - Villa Retreat' },
  { key: 'experience-workshop', description: 'Experience Page - Workshop' },
  { key: 'experience-networking', description: 'Experience Page - Networking' },
  { key: 'experience-collaboration', description: 'Experience Page - Collaboration' },
  { key: 'experience-evening-session', description: 'Experience Page - Evening Session' },
  { key: 'experience-gourmet-dining', description: 'Experience Page - Gourmet Dining' }
];

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPredefinedKeys, setShowPredefinedKeys] = useState(false);
  
  // Image cropping state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  
  // Form state for upload
  const [uploadForm, setUploadForm] = useState({
    key: '',
    description: '',
    alt_text: '',
    category: '',
    file: null as File | null
  });
  
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
  
  // Helper functions
  const resetUploadForm = () => {
    setUploadForm({
      key: '',
      description: '',
      alt_text: '',
      category: '',
      file: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setImageSrc(null);
    setCrop({
      unit: '%',
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
  
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Please select a file');
      return;
    }
    
    // If crop is complete, use the cropped image
    if (completedCrop && isCropping) {
      const croppedFile = getCroppedImg(uploadForm.file.name, uploadForm.file.type);
      if (croppedFile) {
        uploadMutation.mutate({
          file: croppedFile,
          key: uploadForm.key,
          description: uploadForm.description,
          alt_text: uploadForm.alt_text,
          category: uploadForm.category || undefined
        });
        return;
      }
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
  
  // Image cropping functions
  const getCroppedImg = (fileName: string, fileType: string): File | null => {
    if (!imgRef.current || !completedCrop || !canvasRef.current) {
      return null;
    }
    
    const canvas = canvasRef.current;
    const image = imgRef.current;
    const crop = completedCrop;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return null;
    }
    
    // Set canvas size to the dimensions of the crop
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    // Apply rotation and crop
    ctx.save();
    
    // Move the crop origin to the canvas center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply zoom
    ctx.scale(zoom, zoom);
    
    // Move back to the top left corner
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // Draw the image with the crop applied
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    
    ctx.restore();
    
    // Convert canvas to file
    return new Promise<File | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          
          const file = new File([blob], fileName, {
            type: fileType,
            lastModified: Date.now(),
          });
          
          resolve(file);
        },
        fileType,
        0.95
      );
    }) as unknown as File | null;
  };
  
  const handleToggleCrop = () => {
    setIsCropping(!isCropping);
  };
  
  const increaseZoom = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };
  
  const decreaseZoom = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };
  
  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  const applyChanges = () => {
    if (completedCrop && imgRef.current && canvasRef.current && uploadForm.file) {
      setIsCropping(false);
      toast.success('Crop applied successfully');
    }
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
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-navy">Image Preview</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleToggleCrop}
                    className={`p-2 rounded-full ${isCropping ? 'bg-navy text-white' : 'bg-gray-100 text-navy'}`}
                    title={isCropping ? "Exit crop mode" : "Enter crop mode"}
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                  
                  {isCropping && (
                    <>
                      <button
                        type="button"
                        onClick={increaseZoom}
                        className="p-2 bg-gray-100 rounded-full text-navy"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={decreaseZoom}
                        className="p-2 bg-gray-100 rounded-full text-navy"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={rotateImage}
                        className="p-2 bg-gray-100 rounded-full text-navy"
                        title="Rotate"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={applyChanges}
                        className="p-2 bg-navy rounded-full text-white"
                        title="Apply changes"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex justify-center">
                {isCropping ? (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={undefined}
                    className="max-h-[400px] object-contain"
                  >
                    <img
                      ref={imgRef}
                      src={imageSrc}
                      alt="Preview"
                      style={{
                        maxHeight: '400px',
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                        transition: 'transform 0.2s ease-in-out'
                      }}
                    />
                  </ReactCrop>
                ) : (
                  <img
                    src={imageSrc}
                    alt="Preview"
                    className="max-h-[400px] object-contain"
                  />
                )}
              </div>
              
              {/* Hidden canvas for cropping */}
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
              
              {isCropping && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Drag to crop the image. Use the controls above to zoom and rotate.
                </p>
              )}
            </div>
          )}
          
          {/* Placeholder Replacement Information */}
          <div className="bg-navy bg-opacity-10 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-navy">Replace Website Images</h3>
              <p className="text-sm text-gray-700">
                To replace placeholder images on the website, use one of the predefined keys. 
                Custom keys will be available for use but won't automatically replace website images.
              </p>
              <button
                type="button"
                onClick={() => setShowPredefinedKeys(!showPredefinedKeys)}
                className="text-sm text-terracotta hover:text-terracotta-dark underline mt-2"
              >
                {showPredefinedKeys ? 'Hide predefined keys' : 'Show predefined keys'}
              </button>
            </div>
          </div>
          
          {/* Predefined Keys List */}
          {showPredefinedKeys && (
            <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
              <h4 className="font-medium text-navy mb-2">Select a predefined key:</h4>
              <div className="grid grid-cols-1 gap-2">
                {COMMON_IMAGE_KEYS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => selectPredefinedKey(item.key, item.description)}
                    className="text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm transition-colors"
                  >
                    <span className="font-medium text-navy block">{item.key}</span>
                    <span className="text-xs text-gray-600">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Form fields */}
          <div>
            <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
              Image Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="key"
              value={uploadForm.key}
              onChange={(e) => setUploadForm(prev => ({ ...prev, key: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              placeholder="e.g., hero-background, team-photo-1"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              A unique identifier used to fetch this image later
            </p>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={uploadForm.category}
              onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
            >
              <option value="">Select a category</option>
              {IMAGE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              value={uploadForm.description}
              onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              placeholder="e.g., Main hero background image"
              required
            />
          </div>
          
          <div>
            <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="alt_text"
              value={uploadForm.alt_text}
              onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              placeholder="e.g., Luxury villa with ocean view"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Text description for accessibility
            </p>
          </div>
          
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Image File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              accept="image/*"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Upload file (PNG, JPG, WEBP or SVG format, max 50MB)
            </p>
          </div>
          
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
