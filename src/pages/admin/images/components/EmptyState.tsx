
import { ImageIcon, Upload } from 'lucide-react';

interface EmptyStateProps {
  selectedCategory: string | null;
  onClearFilter: () => void;
  onUploadClick: () => void;
}

const EmptyState = ({ selectedCategory, onClearFilter, onUploadClick }: EmptyStateProps) => {
  return (
    <div className="p-12 text-center">
      <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        {selectedCategory ? 'No images in this category' : 'No images yet'}
      </h3>
      <p className="mt-1 text-gray-500">
        {selectedCategory ? (
          <>
            No images found in the "{selectedCategory}" category.
            <button 
              onClick={onClearFilter}
              className="ml-2 text-navy hover:underline"
            >
              View all images
            </button>
          </>
        ) : (
          'Get started by adding your first image.'
        )}
      </p>
      {!selectedCategory && (
        <button
          onClick={onUploadClick}
          className="mt-6 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      )}
    </div>
  );
};

export default EmptyState;
