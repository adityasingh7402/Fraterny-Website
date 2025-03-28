
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { deleteImage, WebsiteImage } from '@/services/images';
import { showSuccess, showError } from '@/utils/errorHandler';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: WebsiteImage;
}

const DeleteModal = ({ isOpen, onClose, image }: DeleteModalProps) => {
  const queryClient = useQueryClient();
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      onClose();
      showSuccess('Image deleted successfully');
    },
    onError: (error) => {
      showError(error, 'Failed to delete image', {
        title: 'Image Deletion Error'
      });
    }
  });
  
  const handleDeleteConfirm = () => {
    deleteMutation.mutate(image.id);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-medium text-navy">Confirm Deletion</h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700">
            Are you sure you want to delete the image <strong>{image.key}</strong>? This action cannot be undone.
          </p>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
