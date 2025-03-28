
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  onUploadClick: () => void;
}

const PageHeader = ({ onUploadClick }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-playfair text-navy">Image Management</h1>
      <div className="flex gap-4">
        <Link 
          to="/admin" 
          className="px-4 py-2 border border-navy text-navy rounded-md hover:bg-navy hover:text-white transition-colors"
        >
          Back to Dashboard
        </Link>
        <button 
          onClick={onUploadClick}
          className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Image
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
