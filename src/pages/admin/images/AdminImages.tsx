
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from '@/services/images';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ImagePlus, Trash2, RefreshCw, Search } from 'lucide-react';
import { UploadModal } from './components/upload';
import ImageContainer from './components/ImageContainer';
import { useImageManagement } from './hooks/useImageManagement';

const AdminImages = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();
  
  // Use the custom hook for managing images
  const {
    images,
    totalCount,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm: hookSearchTerm,
    setSearchTerm: setHookSearchTerm,
    page,
    pageSize,
    isLoading,
    error,
    isUploadModalOpen,
    setIsUploadModalOpen,
    openEditModal,
    openDeleteModal,
    handlePageChange,
    handleSearch,
    clearFilters
  } = useImageManagement();

  // Sync the hook's search term with local state
  React.useEffect(() => {
    setHookSearchTerm(searchTerm);
  }, [searchTerm, setHookSearchTerm]);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        
        // Verify that the bucket exists first
        const { data: bucketData, error: bucketError } = await supabase.storage
          .getBucket('website-images');
          
        if (bucketError) {
          console.error("Storage bucket error:", bucketError);
          // If bucket doesn't exist, try to create it
          if (bucketError.message.includes('not found')) {
            const { data: createData, error: createError } = await supabase.storage
              .createBucket('website-images', { public: true });
              
            if (createError) {
              throw new Error(`Failed to create storage bucket: ${createError.message}`);
            }
          } else {
            throw bucketError;
          }
        }
        
        // Upload to storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('website-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (storageError) {
          console.error("Storage upload error:", storageError);
          throw storageError;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('website-images')
          .getPublicUrl(fileName);
          
        // Create record in website_images table
        const { data: dbData, error: dbError } = await supabase
          .from('website_images')
          .insert([
            {
              key: file.name.split('.')[0], // Use filename as key (without extension)
              description: `Uploaded image: ${file.name}`,
              storage_path: fileName,
              alt_text: file.name,
              width: null, // Add logic to get dimensions if needed
              height: null
            }
          ])
          .select()
          .single();
          
        if (dbError) {
          console.error("Database insert error:", dbError);
          throw dbError;
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Refresh the images list
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      toast.success("Image(s) uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Delete image mutation
  const deleteMutation = useMutation({
    mutationFn: async (image: WebsiteImage) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('website-images')
        .remove([image.storage_path]);
        
      if (storageError) {
        console.error("Storage deletion error:", storageError);
        throw storageError;
      }
      
      // Delete from database
      const { error: dbError } = await supabase
        .from('website_images')
        .delete()
        .eq('id', image.id);
        
      if (dbError) {
        console.error("Database deletion error:", dbError);
        throw dbError;
      }
      
      return image.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-images'] });
      toast.success("Image deleted successfully");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Handle delete image
  const handleDeleteImage = (image: WebsiteImage) => {
    if (confirm(`Are you sure you want to delete ${image.key}?`)) {
      deleteMutation.mutate(image);
    }
  };

  // Open the upload modal
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Image Management</CardTitle>
              <CardDescription>Loading images...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              <RefreshCw className="h-12 w-12 animate-spin text-navy opacity-50" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-300">
            <CardHeader>
              <CardTitle className="text-red-600">Error Loading Images</CardTitle>
              <CardDescription>
                There was a problem loading the images. Please try again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-red-50 p-4 rounded text-red-800 text-sm">
                {JSON.stringify(error, null, 2)}
              </pre>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-images'] })}
                variant="outline"
              >
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  // Render main content
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Image Management</CardTitle>
              <CardDescription>Upload and manage website images</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search images..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="image-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <Button disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={openUploadModal}
              >
                Advanced Upload
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value={selectedTab} className="mt-0">
                <ImageContainer 
                  images={images}
                  selectedCategory={selectedCategory}
                  searchTerm={searchTerm}
                  onClearFilter={clearFilters}
                  onUploadClick={openUploadModal}
                  onEdit={openEditModal}
                  onDelete={handleDeleteImage}
                  page={page}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onPageChange={handlePageChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </div>
  );
};

export default AdminImages;
