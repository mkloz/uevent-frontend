import dayjs, { type Dayjs } from 'dayjs';
import { CreditCard } from 'lucide-react';
import type React from 'react';
import type { MouseEventHandler } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { FiBell, FiCalendar, FiDollarSign, FiMapPin, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Image } from '../../../shared/components/common/image';
import { Link } from '../../../shared/components/common/link';
import { Button, buttonVariants } from '../../../shared/components/ui/button';
import { useShare } from '../../../shared/hooks/use-share';
import { cn } from '../../../shared/lib/utils';
import { getStaticMapImageUrl } from '../../../shared/utils/maps.utils';
import { CompanyLogo } from '../../company/components/company-logo';
import { useEventFollow } from '../hooks/use-event-follow';
import type { Event } from '../interfaces/event.interface';

interface EventListItemProps {
  event: Event;
}

const formatDate = (dateString: string | Dayjs | Date) => dayjs(dateString).format('MMM D, YYYY');

export const EventCard: React.FC<EventListItemProps> = ({ event }) => {
  const share = useShare();
  const nav = useNavigate();
  const handleShare: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!event) return;
    share({
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href
    });
  };

  const { isFollowing, toggle } = useEventFollow(event.id);
  const isEventPassed = event.endDate
    ? dayjs(event.endDate).isBefore(dayjs())
    : dayjs(event.startDate).isBefore(dayjs());

  return (
    <article className="bg-card rounded-xl overflow-hidden shadow transition-all duration-300 @container min-h-fit min-w-80 hover:shadow-2xl hover:scale-[1.02] group border">
      <Link to={`/events/${event.id}`} className="h-full flex flex-col @lg:flex-row @lg:min-h-80 min-h-148" unstyled>
        {/* Image container - 2/5 height in vertical, 2/5 width in horizontal */}
        <div className="relative min-h-2/5 @lg:h-auto @lg:w-2/5 flex-none overflow-hidden max-h-60  @lg:max-h-100 ">
          <Image
            alt={event.title}
            src={
              event.posterUrl ||
              (event.location &&
                getStaticMapImageUrl({
                  center: event.location,
                  zoom: 12,
                  size: {
                    width: 600,
                    height: 600
                  },
                  markers: [{ position: event.location }]
                }))
            }
            wrapperClassName="group-hover:scale-110 transition-transform duration-700 "
            className="object-cover size-full"
          />
          {/* Badge for category */}
          <div className="absolute top-4 left-4 flex items-center">
            <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
              {event.format.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col grow">
          <div className="flex justify-between items-start mb-3 gap-2">
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 grow">
              {event.title}
            </h3>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'p-2 rounded-full text-gray-400 hover:text-red-700/80 hover:bg-red-400/20  transition-colors duration-300 hover:border-red-700/80',
                  isFollowing && 'text-red-700/80 hover:bg-red-400/20'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggle();
                }}
                aria-label="Like event">
                <FiBell />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="p-2 rounded-full transition-colors duration-300"
                aria-label="Share event"
                onClick={handleShare}>
                <FiShare2 />
              </Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-y-2 justify-between">
            <div className="flex items-center text-gray-500 dark:text-gray-400 mr-6 space-x-2">
              <FiCalendar className="mr-2" />
              <span>{formatDate(event.startDate)}</span>
              {event.endDate && event.endDate !== event.startDate && (
                <>
                  <FaArrowRightLong />
                  <span>{formatDate(event.endDate)}</span>
                </>
              )}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FiMapPin className="mr-2" />
              <span>{event.location?.address || 'Online'}</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{event.description}</p>

          <div className="mt-auto flex justify-between items-center gap-4 flex-wrap">
            <div className="flex items-center grow">
              <FiDollarSign className="text-green-500" />
              <span className="font-bold text-gray-900 dark:text-white">
                {event.price ? `$${event.price.toFixed(2)}` : 'Free'}
              </span>
            </div>
            <div className="flex gap-2 grow *:grow">
              <p className={cn(buttonVariants({ variant: 'outline' }), '@max-sm:hidden')}>Learn More</p>
              <Button disabled={isEventPassed}>
                <CreditCard className="mr-2 h-4 w-4" />
                {isEventPassed ? 'Event Ended' : `Get ${event.price ? 'Tickets' : 'Free Ticket'}`}
              </Button>
            </div>
          </div>

          {/* Company info */}
          {event.company && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
              <CompanyLogo company={event.company} className="h-8 w-8" />
              <span className="text-sm text-muted-foreground flex items-center gap-0.5 grow">
                By
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    nav(`/companies/${event.company?.id}`);
                  }}
                  className="font-semibold text-foreground pl-1 line-clamp-1 hover:text-primary">
                  {event.company?.name}
                </span>
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};
