'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface LocationSearchProps {
  onLocationSubmit: (location: string) => void;
  isLoading: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSubmit, isLoading }) => {
  const [inputValue, setInputValue] = useState<string>('New York, NY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onLocationSubmit(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center w-full max-w-md">
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter city or zip code"
        className="flex-grow"
        aria-label="Enter location"
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading} aria-label="Search location">
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Search />
        )}
        <span className="ml-2 hidden sm:inline">Search</span>
      </Button>
    </form>
  );
};

export default LocationSearch;
