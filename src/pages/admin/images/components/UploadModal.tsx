
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Upload } from 'lucide-react';
import { uploadImage } from '@/services/images';

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

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };
  
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Please select a file');
      return;
    }
    
    uploadMutation.mutate({
      file: uploadForm.file,
      key: uploadForm.key,
      description: uploadForm.description,
      alt_text: uploadForm.alt_text,
      category: uploadForm.category || undefined
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
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
            <p className="mt-1 text-sm text-gray-500">
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
            <p className="mt-1 text-sm text-gray-500">
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
