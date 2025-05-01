import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

import { EventSortOption } from '../services/event.service';

interface EventsSortProps {
  sortOption: EventSortOption;
  onSortChange: (option: EventSortOption) => void;
}

export const EventsSort = ({ sortOption, onSortChange }: EventsSortProps) => {
  return (
    <Select value={sortOption} onValueChange={(value) => onSortChange(value as EventSortOption)}>
      <SelectTrigger className="min-w-45 grow">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="date-asc">Date (Soonest)</SelectItem>
        <SelectItem value="date-desc">Date (Latest)</SelectItem>
        <SelectItem value="price-low">Price (Low to High)</SelectItem>
        <SelectItem value="price-high">Price (High to Low)</SelectItem>
        <SelectItem value="name">Name (A-Z)</SelectItem>
      </SelectContent>
    </Select>
  );
};
