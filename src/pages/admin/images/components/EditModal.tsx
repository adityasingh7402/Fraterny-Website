
import { WebsiteImage } from '@/services/images';
import { 
  EditModalHeader, 
  EditModalFooter, 
  EditFormFields, 
  ImagePreview,
  useEditImage 
} from './edit';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: WebsiteImage;
}

const EditModal = ({ isOpen, onClose, image }: EditModalProps) => {
  const {
    previewUrl,
    editForm,
    setEditForm,
    updateMutation,
    handleEditSubmit
  } = useEditImage(image, onClose);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <EditModalHeader onClose={onClose} />
        
        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
          <ImagePreview previewUrl={previewUrl} image={image} />
          
          <EditFormFields 
            editForm={editForm}
            setEditForm={setEditForm}
            image={image}
          />
          
          <EditModalFooter 
            onClose={onClose}
            isPending={updateMutation.isPending}
          />
        </form>
      </div>
    </div>
  );
};

export default EditModal;
