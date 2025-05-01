import { useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import { useDebounce } from '../../../shared/components/ui/multi-selector';

interface EventsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export const EventsSearch = ({ searchQuery, onSearchChange, className }: EventsSearchProps) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [debouncedValue] = useDebounce(inputValue, 300);

  useEffect(() => {
    onSearchChange(debouncedValue);
  }, [debouncedValue, onSearchChange]);

  useEffect(() => {
    if (searchQuery === inputValue) return;
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div className={`relative flex-grow ${className}`}>
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search events, categories, or locations..."
        className="pl-10 pr-10 w-full"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {inputValue && (
        <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={handleClear}>
          <FiX className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
