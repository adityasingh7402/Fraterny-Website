
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown } from 'lucide-react';
import { IMAGE_KEYS, IMAGE_USAGE_MAP } from './constants';

interface KeySelectorProps {
  form: any; // Using any here for simplicity, but this should be typed properly
  onSelect: (key: string) => void;
}

const KeySelector = ({ form, onSelect }: KeySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelectKey = (key: string) => {
    form.setValue('key', key);
    onSelect(key);
    setIsOpen(false);
  };
  
  const currentValue = form.watch('key');
  const isPredefinedKey = !!IMAGE_USAGE_MAP[currentValue];
  
  return (
    <FormField
      control={form.control}
      name="key"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <FormLabel className="font-medium flex items-center justify-between">
            <span>Image Key <span className="text-red-500">*</span></span>
            {isPredefinedKey && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Predefined</span>
            )}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., hero-background, team-photo-1"
                className={isPredefinedKey ? "border-green-300" : ""}
              />
            </FormControl>
            <button
              type="button"
              onClick={toggleDropdown}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100"
            >
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <FormMessage />
          
          {isOpen && (
            <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-2">
                <p className="text-xs text-gray-500 mb-2">Select a predefined key:</p>
                {IMAGE_KEYS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleSelectKey(item.key)}
                    className={`flex items-center w-full text-left p-2 text-sm hover:bg-gray-100 rounded-md ${
                      currentValue === item.key ? "bg-gray-50" : ""
                    }`}
                  >
                    {currentValue === item.key && (
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 truncate">
                      <p className="font-medium truncate">{item.key}</p>
                      <p className="text-xs text-gray-500 truncate">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            A unique identifier used to fetch this image later
          </p>
        </FormItem>
      )}
    />
  );
};

export default KeySelector;
