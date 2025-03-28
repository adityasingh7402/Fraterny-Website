
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllImages, fetchImagesByCategory, WebsiteImage } from '@/services/images';
import ImageGallery from './components/ImageGallery';
import ImageFilters from './components/ImageFilters';
import PageHeader from './components/PageHeader';
import EmptyState from './components/EmptyState';
import UploadModal from './components/UploadModal';
import EditModal from './components/EditModal';
import DeleteModal from './components/DeleteModal';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import { Search, Info } from 'lucide-react';

const AdminImages = () => {
  const [selectedImage, setSelectedImage] = useState<WebsiteImage | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Fetch images based on selected category and search term
  const { data, isLoading, error } = useQuery({
    queryKey: ['website-images', selectedCategory, searchTerm, page, pageSize],
    queryFn: async () => {
      if (selectedCategory) {
        return fetchImagesByCategory(selectedCategory, page, pageSize, searchTerm);
      }
      return fetchAllImages(page, pageSize, searchTerm);
    }
  });
  
  // Extract images and total count from response
  const images = data?.images || [];
  const totalCount = data?.total || 0;
  
  // Extract all unique categories from images
  const categories = images.length > 0
    ? [...new Set(images.filter(img => img.category).map(img => img.category))] as string[]
    : [];
  
  // Modal handlers
  const openEditModal = (image: WebsiteImage) => {
    setSelectedImage(image);
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (image: WebsiteImage) => {
    setSelectedImage(image);
    setIsDeleteModalOpen(true);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (newPage - 1) * pageSize < totalCount) {
      setPage(newPage);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to page 1 when searching
    setPage(1);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader onUploadClick={() => setIsUploadModalOpen(true)} />
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h2 className="text-xl font-medium text-navy">Website Images</h2>
                <p className="text-gray-600 mt-1">Manage the images used throughout the website</p>
              </div>
              
              <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-2 sm:space-y-0 sm:space-x-2">
                {/* Search bar */}
                <form onSubmit={handleSearch} className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent w-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <button type="submit" className="sr-only">Search</button>
                </form>
                
                {/* Category filter */}
                {categories.length > 0 && (
                  <ImageFilters 
                    categories={categories} 
                    selectedCategory={selectedCategory} 
                    onCategoryChange={setSelectedCategory} 
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Instructions Panel */}
          <div className="p-4 bg-navy bg-opacity-5 border-b border-navy border-opacity-20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-navy">Image Management System</h3>
                <p className="text-sm text-gray-700 mt-1">
                  This system allows you to upload and manage images used throughout the website. 
                  Images with predefined keys (marked as "Website Image") will automatically replace placeholder 
                  images on the website. Upload new images with the same keys to update content in real-time.
                </p>
              </div>
            </div>
          </div>
          
          {images.length > 0 ? (
            <>
              <ImageGallery 
                images={images} 
                onEdit={openEditModal} 
                onDelete={openDeleteModal} 
              />
              
              {/* Pagination */}
              {totalCount > pageSize && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {page} of {Math.ceil(totalCount / pageSize)}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={(page * pageSize) >= totalCount}
                    className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              selectedCategory={selectedCategory} 
              searchTerm={searchTerm}
              onClearFilter={() => {
                setSelectedCategory(null);
                setSearchTerm('');
              }} 
              onUploadClick={() => setIsUploadModalOpen(true)} 
            />
          )}
        </div>
        
        {/* Modals */}
        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
        />
        
        {selectedImage && (
          <>
            <EditModal 
              isOpen={isEditModalOpen} 
              onClose={() => setIsEditModalOpen(false)} 
              image={selectedImage} 
            />
            
            <DeleteModal 
              isOpen={isDeleteModalOpen} 
              onClose={() => setIsDeleteModalOpen(false)} 
              image={selectedImage} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminImages;
