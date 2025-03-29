
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PredefinedKeysSelector from './PredefinedKeysSelector';

interface KeySelectorProps {
  form: any;
  onSelect: (key: string) => void;
}

const KeySelector = ({ form, onSelect }: KeySelectorProps) => {
  const handlePredefinedKeySelection = (key: string, description: string) => {
    form.setValue('key', key);
    form.setValue('description', description);
    onSelect(key);
  };
  
  return (
    <div className="space-y-4">
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
                onChange={(e) => {
                  field.onChange(e);
                  onSelect(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
            <p className="mt-1 text-xs text-gray-500">
              A unique identifier used to fetch this image later
            </p>
          </FormItem>
        )}
      />
      
      <PredefinedKeysSelector onSelectKey={handlePredefinedKeySelection} />
    </div>
  );
};

export default KeySelector;
