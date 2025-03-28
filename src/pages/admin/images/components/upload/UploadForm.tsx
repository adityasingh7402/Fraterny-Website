
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info, Upload, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { IMAGE_CATEGORIES, IMAGE_USAGE_MAP } from '@/services/images/constants';
import { useUploadImageMutation } from './useUploadForm';
import { uploadFormSchema } from './constants';
import PredefinedKeysSection from './PredefinedKeysSection';
import UploadFormSubmit from './UploadFormSubmit';
import ImageCropHandler from './ImageCropHandler';

export const UploadForm = ({ onClose }: { onClose: () => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [key, setKey] = useState<string>('');
  const [isPredefinedKey, setIsPredefinedKey] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      key: '',
      description: '',
      alt_text: '',
      category: '',
    },
  });
  
  const { mutate, isPending, isSuccess } = useUploadImageMutation(onClose);
  
  // Clear the preview when unmounting
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile) {
      setFile(selectedFile);
      setCroppedFile(null);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      
      // Auto-fill the alt text with the file name (without extension)
      const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      const formattedAltText = fileNameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      form.setValue('alt_text', formattedAltText);
    }
  };
  
  // Handle predefined key selection
  const handleKeySelection = (selectedKey: string) => {
    setKey(selectedKey);
    form.setValue('key', selectedKey);
    setIsPredefinedKey(true);
    
    // Prefill description and alt text based on key
    if (IMAGE_USAGE_MAP[selectedKey]) {
      const usageDescription = IMAGE_USAGE_MAP[selectedKey];
      form.setValue('description', `Image for ${usageDescription}`);
      form.setValue('alt_text', usageDescription.replace(' - ', ': '));
      
      // Set appropriate category based on key
      if (selectedKey.includes('hero')) {
        form.setValue('category', 'Hero');
      } else if (selectedKey.includes('background')) {
        form.setValue('category', 'Background');
      } else if (selectedKey.includes('banner')) {
        form.setValue('category', 'Banner');
      } else if (selectedKey.includes('villalab')) {
        form.setValue('category', 'Gallery');
      } else if (selectedKey.includes('experience')) {
        form.setValue('category', 'Gallery');
      }
    }
  };
  
  // Handle key input change
  const handleKeyChange = (value: string) => {
    setKey(value);
    setIsPredefinedKey(!!IMAGE_USAGE_MAP[value]);
  };
  
  // Handle cropped file
  const handleCroppedFile = (newCroppedFile: File) => {
    setCroppedFile(newCroppedFile);
    
    // Update preview with cropped version
    const objectUrl = URL.createObjectURL(newCroppedFile);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(objectUrl);
  };
  
  // Handle form submission
  const onSubmit = form.handleSubmit((data) => {
    const fileToUpload = croppedFile || file;
    
    if (!fileToUpload) {
      form.setError('root', { 
        message: 'Please select an image file to upload.' 
      });
      return;
    }
    
    mutate({
      file: fileToUpload,
      key: data.key,
      description: data.description,
      alt_text: data.alt_text,
      category: data.category,
    });
  });
  
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <FormLabel className="block mb-1 font-medium">Image</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              
              {file && previewUrl && (
                <ImageCropHandler 
                  imageSrc={previewUrl} 
                  uploadFile={file}
                  onCroppedFile={handleCroppedFile}
                  imageKey={key}
                />
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <FormLabel className="font-medium">Image Details</FormLabel>
              <p className="text-sm text-gray-500">
                Complete the following information about your image.
              </p>
            </div>
            
            <PredefinedKeysSection onKeySelect={handleKeySelection} />
            
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Key {isPredefinedKey && <Badge className="ml-2 bg-terracotta">Predefined</Badge>}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          handleKeyChange(e.target.value);
                        }}
                      />
                      {isPredefinedKey && (
                        <div className="absolute right-2 top-2 text-terracotta">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isPredefinedKey && IMAGE_USAGE_MAP[key] && (
              <div className="flex items-start gap-2 p-3 bg-navy bg-opacity-5 rounded-md border border-navy border-opacity-20">
                <Info className="h-4 w-4 text-navy flex-shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-navy">This is a predefined image key</p>
                  <p className="text-gray-700">
                    Location: <span className="font-medium">{IMAGE_USAGE_MAP[key]}</span>
                  </p>
                  <p className="text-gray-700 text-xs">
                    This image will automatically replace the placeholder at this location on the website.
                  </p>
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Brief description of this image"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="alt_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Alt Text 
                    <span className="ml-1 text-sm text-gray-500 font-normal">(for accessibility)</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Describe the image for screen readers"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {IMAGE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <UploadFormSubmit
          isPending={isPending}
          isSuccess={isSuccess}
          onCancel={onClose}
        />
      </form>
    </Form>
  );
};

export default UploadForm;
