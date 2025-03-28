
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

const AdminImages = () => {
  const [selectedImage, setSelectedImage] = useState<WebsiteImage | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  
  // Fetch images based on selected category
  const { data, isLoading, error } = useQuery({
    queryKey: ['website-images', selectedCategory, page, pageSize],
    queryFn: async () => {
      if (selectedCategory) {
        return fetchImagesByCategory(selectedCategory, page, pageSize);
      }
      return fetchAllImages(page, pageSize);
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
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-navy">Website Images</h2>
              <p className="text-gray-600 mt-1">Manage the images used throughout the website</p>
            </div>
            
            {categories.length > 0 && (
              <ImageFilters 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onCategoryChange={setSelectedCategory} 
              />
            )}
          </div>
          
          {images.length > 0 ? (
            <ImageGallery 
              images={images} 
              onEdit={openEditModal} 
              onDelete={openDeleteModal} 
            />
          ) : (
            <EmptyState 
              selectedCategory={selectedCategory} 
              onClearFilter={() => setSelectedCategory(null)} 
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
