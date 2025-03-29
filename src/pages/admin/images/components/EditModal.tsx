
import { WebsiteImage } from '@/services/images';
import { 
  EditModalHeader, 
  EditModalFooter, 
  EditFormFields, 
  ImagePreview,
  useEditImage 
} from './edit';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: WebsiteImage;
}

const EditModal = ({ isOpen, onClose, image }: EditModalProps) => {
  const {
    previewUrl,
    file,
    isReplacing,
    editForm,
    setEditForm,
    updateMutation,
    replaceImageMutation,
    handleEditSubmit,
    handleFileChange,
    handleCroppedFile,
    cancelReplacement
  } = useEditImage(image, onClose);
  
  const isPending = updateMutation.isPending || replaceImageMutation.isPending;
  const isMobile = useIsMobile();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`bg-white rounded-lg ${isMobile ? 'w-full' : 'max-w-2xl w-full'} max-h-[90vh] overflow-y-auto`}>
        <EditModalHeader onClose={onClose} />
        
        <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
          <ImagePreview 
            previewUrl={previewUrl} 
            image={image} 
            isReplacing={isReplacing}
            file={file}
            onFileChange={handleFileChange}
            onCroppedFile={handleCroppedFile}
            onCancelReplace={cancelReplacement}
          />
          
          {!isReplacing && (
            <EditFormFields 
              editForm={editForm}
              setEditForm={setEditForm}
              image={image}
            />
          )}
          
          <EditModalFooter 
            onClose={onClose}
            isPending={isPending}
          />
        </form>
      </div>
    </div>
  );
};

export default EditModal;
