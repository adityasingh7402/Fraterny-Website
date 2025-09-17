import React, { useState, useEffect, useRef } from 'react';
import { searchCities, CityResult } from '../../../utils/cityApi';
import { motion } from 'framer-motion';

interface CityAutocompleteProps {
  onCitySelect: (city: string) => void;
  placeholder?: string;
  selectedCity?: string;
  isAnonymousMode?: boolean;
// onToggleAnonymous?: () => void;
}

export function CityAutocomplete({ 
  onCitySelect, 
  placeholder = "Start typing a city name...",
  selectedCity = "",
  isAnonymousMode = false,
  // onToggleAnonymous
}: CityAutocompleteProps) {
  const [query, setQuery] = useState(selectedCity);
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(true);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  // Sync internal query state when selectedCity prop changes
useEffect(() => {
  setQuery(selectedCity);
}, [selectedCity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleCitySelect = (city: CityResult) => {
    setQuery(city.displayName);
    setSuggestions([]);
    setShowDropdown(false);
    onCitySelect(city.displayName);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={isAnonymousMode 
          ? "To know the cultural context of your upbringing." 
          : "Start typing your place"
        }
        disabled={isAnonymousMode}
        className="p-3 pb-10 bg-white rounded-lg border border-zinc-400 h-full w-full justify-start text-black text-xl font-normal font-['Gilroy-Medium'] placeholder:text-xl placeholder:text-wrap placeholder:leading-tight placeholder:align-top placeholder:pt-0"
      />

      {/* {onToggleAnonymous && (
        <motion.div 
          className="absolute right-10 top-1/2 transform -translate-y-1/2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            type="button"
            onClick={onToggleAnonymous}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              isAnonymousMode ? 'bg-gray-300' : 'bg-blue-500'
            }`}
            animate={{ backgroundColor: isAnonymousMode ? '#D1D5DB' : '#3B82F6' }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              className="inline-block h-4 w-4 transform rounded-full bg-white shadow"
              animate={{ x: isAnonymousMode ? 2 : 22 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </motion.button>
        </motion.div>
      )} */}
      
      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {suggestions.map((city) => (
            <li
              key={city.id}
              onClick={() => handleCitySelect(city)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
            >
              {city.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}