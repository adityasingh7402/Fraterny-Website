
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IMAGE_CATEGORIES, IMAGE_USAGE_MAP } from '@/services/images/constants';
import PredefinedKeysSection from './PredefinedKeysSection';

interface ImageDetailsFormProps {
  form: UseFormReturn<any>;
  isPredefinedKey: boolean;
  key: string;
  handleKeyChange: (value: string) => void;
  handleKeySelection: (selectedKey: string) => void;
}

const ImageDetailsForm = ({ 
  form, 
  isPredefinedKey, 
  key, 
  handleKeyChange, 
  handleKeySelection 
}: ImageDetailsFormProps) => {
  return (
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
  );
};

export default ImageDetailsForm;
