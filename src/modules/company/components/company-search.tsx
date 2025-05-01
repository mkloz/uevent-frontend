import { FiSearch, FiX } from 'react-icons/fi';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { CompanySortBy } from '../services/company.service';

interface CompanySearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: CompanySortBy;
  setSortBy: (sort: CompanySortBy) => void;
}

export const CompanySearch = ({ searchQuery, setSearchQuery, sortBy, setSortBy }: CompanySearchProps) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search companies by name, description, or location..."
            className="pl-10 pr-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearchQuery('')}>
              <FiX className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as CompanySortBy)}
            defaultValue={CompanySortBy.NEWEST}>
            <SelectTrigger className="min-w-35">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={CompanySortBy.NEWEST}>Newest</SelectItem>
              <SelectItem value={CompanySortBy.OLDEST}>Oldest</SelectItem>
              <SelectItem value={CompanySortBy.NAME}>Name (A-Z)</SelectItem>
              <SelectItem value={CompanySortBy.EVENTS}>Most Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
