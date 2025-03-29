
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InfoIcon } from 'lucide-react';
import { COMMON_IMAGE_KEYS } from './constants';

interface KeySelectorProps {
  form: any;
  onSelect: (key: string) => void;
}

const KeySelector = ({ form, onSelect }: KeySelectorProps) => {
  const [showPredefinedKeys, setShowPredefinedKeys] = useState(false);

  return (
    <>
      {/* Image Key Field */}
      <FormField
        control={form.control}
        name="key"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-medium">Image Key <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g., hero-background, team-photo-1"
              />
            </FormControl>
            <FormMessage />
            <p className="text-xs text-gray-500 mt-1">
              A unique identifier used to fetch this image later
            </p>
          </FormItem>
        )}
      />
      
      {/* Predefined Keys Section */}
      <div className="bg-navy bg-opacity-10 rounded-lg p-4 flex items-start gap-3 mt-4">
        <InfoIcon className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-navy">Replace Website Images</h3>
          <p className="text-sm text-gray-700">
            To replace placeholder images on the website, use one of the predefined keys.
          </p>
          <button
            type="button"
            onClick={() => setShowPredefinedKeys(!showPredefinedKeys)}
            className="text-sm text-terracotta hover:text-terracotta-dark underline mt-2"
          >
            {showPredefinedKeys ? 'Hide predefined keys' : 'Show predefined keys'}
          </button>
        </div>
      </div>
      
      {/* Predefined Keys List */}
      {showPredefinedKeys && (
        <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto">
          <h4 className="font-medium text-navy mb-2">Select a predefined key:</h4>
          <div className="grid grid-cols-1 gap-2">
            {COMMON_IMAGE_KEYS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelect(item.key)}
                className="text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded text-sm transition-colors"
              >
                <span className="font-medium text-navy block">{item.key}</span>
                <span className="text-xs text-gray-600">{item.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default KeySelector;
