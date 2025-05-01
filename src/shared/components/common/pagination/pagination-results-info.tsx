import { cn } from '@/shared/lib/utils';

interface PaginationResultsInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export const PaginationResultsInfo = ({ currentPage, pageSize, totalItems, className }: PaginationResultsInfoProps) => {
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={cn('text-sm text-muted-foreground', className)}>
      Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
      <span className="font-medium">{totalItems}</span> results
    </div>
  );
};
