
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IMAGE_USAGE_MAP, getRecommendedAspectRatio } from './constants';

interface KeySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const KeySelector = ({ value, onChange }: KeySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKeys, setFilteredKeys] = useState<Array<{key: string, description: string}>>([]);
  
  // Convert the usage map to an array for easier filtering
  const keys = Object.entries(IMAGE_USAGE_MAP).map(([key, description]) => ({
    key,
    description
  }));
  
  // Filter keys based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredKeys(keys);
      return;
    }
    
    const filtered = keys.filter(item => 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredKeys(filtered);
  }, [searchTerm]);
  
  // Group keys by category
  const groupedKeys = filteredKeys.reduce((groups, item) => {
    // Extract category from key name (e.g., "hero-background" => "hero")
    let category = item.key.split('-')[0];
    category = category.charAt(0).toUpperCase() + category.slice(1);
    
    if (!groups[category]) {
      groups[category] = [];
    }
    
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof keys>);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value ? (
            <div className="flex items-center gap-2 truncate">
              <ImageIcon className="h-4 w-4 text-navy opacity-70" />
              <span className="truncate">{value}</span>
            </div>
          ) : (
            "Select an image placement"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search image placements..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>No image placement found.</CommandEmpty>
          <CommandList className="max-h-[300px]">
            {Object.entries(groupedKeys).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.key}
                    value={item.key}
                    onSelect={() => {
                      onChange(item.key);
                      setOpen(false);
                    }}
                    className="flex items-start py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.key}</span>
                      <span className="text-xs text-gray-500">{item.description}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.key ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default KeySelector;
