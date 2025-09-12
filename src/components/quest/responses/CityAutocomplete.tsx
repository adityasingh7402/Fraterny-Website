import React, { useState, useEffect, useRef } from 'react';
import { searchCities, CityResult } from '../../../utils/cityApi';

interface CityAutocompleteProps {
  onCitySelect: (city: string) => void;
  placeholder?: string;
  selectedCity?: string;
}

export function CityAutocomplete({ 
  onCitySelect, 
  placeholder = "Start typing a city name...",
  selectedCity = ""
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
        placeholder={placeholder}
        className="p-3 bg-white rounded-lg border border-zinc-400 w-full justify-start text-black text-xl font-normal font-['Gilroy-Medium'] focus:outline-none placeholder:text-gray-500 placeholder:font-normal placeholder:font-['Gilroy-Medium'] placeholder:opacity-50"
      />
      
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