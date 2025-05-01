import { Calendar, MapPin } from 'lucide-react';
import type React from 'react';
import type { FC } from 'react';

import { Image } from '../../../shared/components/common/image';
import { Link } from '../../../shared/components/common/link';
import { Badge } from '../../../shared/components/ui/badge';
import dayjs from '../../../shared/lib/dayjs';
import { cn } from '../../../shared/lib/utils';
import { getStaticMapImageUrl } from '../../../shared/utils/maps.utils';
import type { Event } from '../interfaces/event.interface';

interface ShortEventCardProps extends Partial<React.ComponentProps<typeof Link>> {
  event: Event;
}

export const ShortEventCard: FC<ShortEventCardProps> = ({ event, className, ...props }) => {
  return (
    <Link
      key={event.id}
      unstyled
      to={`/events/${event.id}`}
      {...props}
      className={cn(
        'bg-card rounded-lg border p-2 hover:border-primary transition-colors group flex hover:bg-muted',
        className
      )}>
      <div className="flex gap-4">
        <Image
          src={
            event.posterUrl ||
            (event.location &&
              getStaticMapImageUrl({
                center: event.location,
                zoom: 12,
                size: {
                  width: 200,
                  height: 200
                },
                markers: [{ position: event.location }]
              }))
          }
          alt={event.title}
          wrapperClassName="h-24 w-24 rounded-md overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          className="h-full w-full object-cover"
        />

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>

          <div className="grid gap-0.5">
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {dayjs(event.startDate).format('MMM D, YYYY')}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3 w-3" />
              <span className="line-clamp-1">{event.location?.address || 'Online'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap overflow-hidden max-h-6 grow">
            <Badge variant="outline" className="text-xs">
              {event.price ? `$${event.price.toFixed(2)}` : 'Free'}
            </Badge>

            {event.format && (
              <Badge variant="secondary" className="text-xs">
                {event.format}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
