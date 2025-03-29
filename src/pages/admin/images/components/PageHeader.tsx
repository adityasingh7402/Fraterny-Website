
import { PlusCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageHeaderProps {
  onUploadClick: () => void;
}

const PageHeader = ({ onUploadClick }: PageHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <h1 className="text-3xl font-playfair text-navy">Image Management</h1>
      <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} gap-2`}>
        <Link 
          to="/" 
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all ${isMobile ? 'w-full' : ''}`}
        >
          <ArrowLeft size={16} />
          Back to Website
        </Link>
        <Link 
          to="/admin" 
          className={`flex items-center justify-center px-4 py-2 border border-navy text-navy rounded-md hover:bg-navy hover:text-white transition-colors ${isMobile ? 'w-full' : ''}`}
        >
          Admin Dashboard
        </Link>
        <button 
          onClick={onUploadClick}
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors ${isMobile ? 'w-full' : ''}`}
        >
          <PlusCircle className="w-5 h-5" />
          Add New Image
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
