import { FiX } from 'react-icons/fi';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';

interface ActiveFiltersProps {
  searchQuery: string;
  onClearSearch: () => void;
  hasFilters: boolean;
  companyId?: string;
  onClearCompanyId?: () => void;
  onToggleFilters: () => void;
}

export const ActiveFilters = ({
  searchQuery,
  onClearSearch,
  hasFilters,
  onToggleFilters,
  companyId,
  onClearCompanyId
}: ActiveFiltersProps) => {
  if (!searchQuery && !companyId && !hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: {searchQuery}
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={onClearSearch}>
            <FiX className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {/* Uncomment this when companyId is available */}
      {companyId && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Company: {companyId}
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={onClearCompanyId}>
            <FiX className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {hasFilters && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Filters Active
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={onToggleFilters}>
            <FiX className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
};
