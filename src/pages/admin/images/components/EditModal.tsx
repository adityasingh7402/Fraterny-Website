import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Check, Info } from 'lucide-react';
import { updateImage, WebsiteImage, getImageUrlByKey } from '@/services/images';
import ResponsiveImage from '@/components/ui/ResponsiveImage';
import { IMAGE_CATEGORIES, IMAGE_USAGE_MAP } from '@/services/images/constants';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: WebsiteImage;
}

const EditModal = ({ isOpen, onClose, image }: EditModalProps) => {
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [editForm, setEditForm] = useState({
    key: image.key,
    description: image.description,
    alt_text: image.alt_text,
    category: image.category || ''
  });
  
  useEffect(() => {
    if (isOpen) {
      const fetchImageUrl = async () => {
        try {
          const url = await getImageUrlByKey(image.key);
          setPreviewUrl(url);
        } catch (error) {
          console.error('Failed to load image preview:', error);
        }
      };
      
      fetchImageUrl();
    }
  }, [isOpen, image.key]);
  
  const usageLocation = IMAGE_USAGE_MAP[image.key] || 'Custom image (not tied to a specific website section)';
  
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
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-medium text-navy">Edit Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
          {previewUrl && (
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={previewUrl} 
                alt={image.alt_text} 
                className="w-full h-auto object-contain"
              />
            </div>
          )}
          
          <div className="bg-navy bg-opacity-10 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-navy">Usage Location:</h3>
              <p className="text-sm text-gray-700">{usageLocation}</p>
              <p className="text-xs text-gray-500 mt-1">
                Images with fixed keys replace placeholder images throughout the website.
              </p>
            </div>
          </div>
          
          <div>
            <label htmlFor="edit_key" className="block text-sm font-medium text-gray-700 mb-1">
              Image Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit_key"
              value={editForm.key}
              onChange={(e) => setEditForm(prev => ({ ...prev, key: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Changing this key can break website image references.
            </p>
          </div>

          <div>
            <label htmlFor="edit_category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="edit_category"
              value={editForm.category}
              onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
            >
              <option value="">Select a category</option>
              {IMAGE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="edit_description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit_description"
              value={editForm.description}
              onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit_alt_text" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="edit_alt_text"
              value={editForm.alt_text}
              onChange={(e) => setEditForm(prev => ({ ...prev, alt_text: e.target.value }))}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
              required
            />
          </div>

          {(image.width && image.height) && (
            <div className="text-sm text-gray-600">
              Image dimensions: {image.width} × {image.height}px
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
