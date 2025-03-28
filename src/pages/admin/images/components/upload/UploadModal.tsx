
import { useState } from 'react';
import ModalHeader from './ModalHeader';
import UploadForm from './UploadForm';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <ModalHeader title="Add New Image" onClose={onClose} />
        <div className="p-6">
          <UploadForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
