import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Edit, Upload, X, Check, Image as ImageIcon, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchAllImages, 
  uploadImage, 
  updateImage, 
  deleteImage, 
  WebsiteImage 
} from '@/services/images';

// Available image categories
const IMAGE_CATEGORIES = [
  'Hero',
  'Background',
  'Banner',
  'Icon',
  'Profile',
  'Thumbnail',
  'Gallery',
  'Product'
];

const AdminImages = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<WebsiteImage | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Form state for upload
  const [uploadForm, setUploadForm] = useState({
    key: '',
    description: '',
    alt_text: '',
    category: '',
    file: null as File | null
  });
  
  // Form state for edit
  const [editForm, setEditForm] = useState({
    key: '',
    description: '',
    alt_text: '',
    category: ''
  });
  
  // Fetch all images
  const { data: images, isLoading, error } = useQuery({
    queryKey: ['website-images'],
    queryFn: fetchAllImages
  });
  
  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (data: { file: File, key: string, description: string, alt_text: string, category?: string }) => 
      uploadImage(data.file, data.key, data.description, data.alt_text, data.category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      setIsUploadModalOpen(false);
      resetUploadForm();
      toast.success('Image uploaded successfully');
    },
    onError: (error) => {
      toast.error('Failed to upload image');
      console.error(error);
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: { id: string, updates: Partial<WebsiteImage> }) => 
      updateImage(data.id, data.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      setIsEditModalOpen(false);
      toast.success('Image updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update image');
      console.error(error);
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['website-images'] });
      setIsDeleteModalOpen(false);
      setSelectedImage(null);
      toast.success('Image deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete image');
      console.error(error);
    }
  });
  
  // Helper functions
  const resetUploadForm = () => {
    setUploadForm({
      key: '',
      description: '',
      alt_text: '',
      category: '',
      file: null
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm(prev => ({
        ...prev,
        file: e.target.files![0]
      }));
    }
  };
  
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error('Please select a file');
      return;
    }
    
    uploadMutation.mutate({
      file: uploadForm.file,
      key: uploadForm.key,
      description: uploadForm.description,
      alt_text: uploadForm.alt_text,
      category: uploadForm.category || undefined
    });
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) return;
    
    updateMutation.mutate({
      id: selectedImage.id,
      updates: {
        key: editForm.key,
        description: editForm.description,
        alt_text: editForm.alt_text,
        category: editForm.category || null
      }
    });
  };
  
  const openEditModal = (image: WebsiteImage) => {
    setSelectedImage(image);
    setEditForm({
      key: image.key,
      description: image.description,
      alt_text: image.alt_text,
      category: image.category || ''
    });
    setIsEditModalOpen(true);
  };
  
  const openDeleteModal = (image: WebsiteImage) => {
    setSelectedImage(image);
    setIsDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (selectedImage) {
      deleteMutation.mutate(selectedImage.id);
    }
  };
  
  const getImageUrl = useCallback((path: string) => {
    const { data } = supabase.storage
      .from('website-images')
      .getPublicUrl(path);
    return data.publicUrl;
  }, []);

  // Extract all unique categories from images
  const categories = images
    ? [...new Set(images.filter(img => img.category).map(img => img.category))]
    : [];

  // Filter images based on selected category
  const filteredImages = selectedCategory
    ? images?.filter(img => img.category === selectedCategory)
    : images;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-playfair text-navy mb-8">Image Management</h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-gray-600">Loading images...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-playfair text-navy mb-8">Image Management</h1>
          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl text-red-600 mb-2">Error loading images</h2>
            <p className="text-gray-700">Please try refreshing the page</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-navy">Image Management</h1>
          <div className="flex gap-4">
            <a 
              href="/admin/dashboard" 
              className="px-4 py-2 border border-navy text-navy rounded-md hover:bg-navy hover:text-white transition-colors"
            >
              Back to Dashboard
            </a>
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Image
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-navy">Website Images</h2>
              <p className="text-gray-600 mt-1">Manage the images used throughout the website</p>
            </div>
            
            {categories.length > 0 && (
              <div className="flex items-center">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          {filteredImages && filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredImages.map((image) => (
                <div key={image.id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-video bg-gray-200 relative">
                    <img 
                      src={getImageUrl(image.storage_path)} 
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-navy">{image.key}</h3>
                      {image.category && (
                        <span className="px-2 py-1 bg-navy bg-opacity-10 text-navy text-xs rounded">
                          {image.category}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
                    {(image.width && image.height) && (
                      <p className="text-xs text-gray-500 mt-1">
                        {image.width} × {image.height}px
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs text-gray-500">
                        Added: {new Date(image.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(image)}
                          className="p-1 text-gray-600 hover:text-navy"
                          aria-label="Edit image"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(image)}
                          className="p-1 text-gray-600 hover:text-red-600"
                          aria-label="Delete image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
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
                      onClick={() => setSelectedCategory(null)}
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
                  onClick={() => setIsUploadModalOpen(true)}
                  className="mt-6 px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium text-navy">Add New Image</h2>
                <button
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    resetUploadForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
                    Image Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="key"
                    value={uploadForm.key}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, key: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                    placeholder="e.g., hero-background, team-photo-1"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    A unique identifier used to fetch this image later
                  </p>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                  >
                    <option value="">Select a category</option>
                    {IMAGE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                    placeholder="e.g., Main hero background image"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="alt_text" className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="alt_text"
                    value={uploadForm.alt_text}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, alt_text: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                    placeholder="e.g., Luxury villa with ocean view"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Text description for accessibility
                  </p>
                </div>
                
                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                    Image File <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    id="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                    accept="image/*"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Upload file (PNG, JPG, WEBP or SVG format, max 50MB)
                  </p>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      resetUploadForm();
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Edit Modal */}
        {isEditModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-medium text-navy">Edit Image</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="edit_key" className="block text-sm font-medium text-gray-700 mb-1">
                    Image Key <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit_key"
                    value={editForm.key}
                    onChange={(e) => setEditForm(prev => ({ ...prev, key: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="edit_category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="edit_category"
                    value={editForm.category}
                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                  >
                    <option value="">Select a category</option>
                    {IMAGE_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="edit_description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit_description"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit_alt_text" className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit_alt_text"
                    value={editForm.alt_text}
                    onChange={(e) => setEditForm(prev => ({ ...prev, alt_text: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                    required
                  />
                </div>

                {(selectedImage.width && selectedImage.height) && (
                  <div className="text-sm text-gray-600">
                    Image dimensions: {selectedImage.width} × {selectedImage.height}px
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-medium text-navy">Confirm Deletion</h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700">
                  Are you sure you want to delete the image <strong>{selectedImage.key}</strong>? This action cannot be undone.
                </p>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
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
        )}
      </div>
    </div>
  );
};

export default AdminImages;
