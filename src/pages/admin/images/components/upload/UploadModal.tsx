
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ModalHeader from './ModalHeader';
import UploadForm from './UploadForm';
import { useIsMobile } from '@/hooks/use-mobile';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const isMobile = useIsMobile();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className={`bg-white rounded-lg w-full ${isMobile ? 'max-w-full h-[95vh]' : 'max-w-3xl max-h-[90vh]'} overflow-y-auto`}>
        <ModalHeader title="Add New Image" onClose={onClose} />
        <div className="p-3 md:p-6 overflow-y-auto">
          <UploadForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
