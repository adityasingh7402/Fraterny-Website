
import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { IMAGE_KEYS, IMAGE_USAGE_MAP } from './constants';

interface KeySelectorProps {
  form: any; // Using any here for simplicity, but should be typed properly in real code
  onSelect: (key: string) => void;
}

const KeySelector = ({ form, onSelect }: KeySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKeys = useMemo(() => {
    if (!searchTerm) return IMAGE_KEYS;
    
    return IMAGE_KEYS.filter(item => 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Group keys by type
  const groupedKeys = useMemo(() => {
    const groups: Record<string, typeof IMAGE_KEYS> = {};
    
    filteredKeys.forEach(item => {
      const group = item.key.split('-')[0] || 'other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    
    return groups;
  }, [filteredKeys]);

  return (
    <FormField
      control={form.control}
      name="key"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="font-medium">Image Key <span className="text-red-500">*</span></FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? IMAGE_KEYS.find((item) => item.key === field.value)?.description || field.value
                    : "Select a key"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search for image location..." 
                  onValueChange={setSearchTerm}
                  className="h-9"
                />
                <CommandEmpty>No matching image keys found.</CommandEmpty>
                {Object.entries(groupedKeys).map(([group, items]) => (
                  <CommandGroup key={group} heading={group.charAt(0).toUpperCase() + group.slice(1)}>
                    {items.map((item) => (
                      <CommandItem
                        key={item.key}
                        value={item.key}
                        onSelect={() => {
                          form.setValue("key", item.key);
                          onSelect(item.key);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            item.key === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div>
                          <p className="font-medium">{item.key}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default KeySelector;
