import dayjs from 'dayjs';
import { ChevronRight, Share2 } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Image } from '../../../../shared/components/common/image';
import { Link } from '../../../../shared/components/common/link';
import { Button } from '../../../../shared/components/ui/button';
import { cn } from '../../../../shared/lib/utils';
import { CompanyNews } from '../../interfaces/news.interface';

interface NewsCardProps extends Partial<ComponentProps<typeof Link>> {
  item: CompanyNews;
  onShare: () => void;
}

// Update the NewsCard component to use imageUrl instead of image
export const NewsCard = ({ item, onShare, className, ...props }: NewsCardProps) => {
  const formattedDate = dayjs(item.createdAt).format('MMM D, YYYY');

  return (
    <Link
      unstyled
      to={`/companies/news/${item.id}`}
      {...props}
      className={cn(
        'border rounded-lg overflow-hidden bg-card hover:border-primary transition-colors duration-300 flex group',
        className
      )}>
      <div className="flex flex-col md:flex-row w-full">
        {item.imageUrl && (
          <div className="md:w-1/3 max-h-48 md:max-h-60 h-full overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.title}
              wrapperClassName="transition-transform duration-500 group-hover:scale-105"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className={`p-3 flex flex-col  ${item.imageUrl ? 'md:w-2/3' : 'w-full basis-full'}`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>

          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3 w-full grow">{item.content}</p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onShare();
              }}
              className="gap-1">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-1 ml-auto max-sm:grow">
              Read More
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};
