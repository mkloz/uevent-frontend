import dayjs, { Dayjs } from 'dayjs';
import { ArrowLeft } from 'lucide-react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { FiBell, FiCalendar, FiDollarSign, FiMapPin, FiSettings, FiShare2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Image } from '../../../../shared/components/common/image';
import { Badge } from '../../../../shared/components/ui/badge';
import { Button } from '../../../../shared/components/ui/button';
import { useShare } from '../../../../shared/hooks/use-share';
import { getStaticMapImageUrl } from '../../../../shared/utils/maps.utils';
import { useAuth } from '../../../auth/queries/use-auth.query';
import { useEventFollow } from '../../hooks/use-event-follow';
import type { Event, EventFormatType } from '../../interfaces/event.interface';
import { EventSettingsModal } from '../modals/event-settings-modal';

interface EventHeroProps {
  event: Event;
}

const FORMAT_COLORS: Record<EventFormatType, string> = {
  CONFERENCE: 'from-blue-900/70 to-blue-700/30',
  LECTURE: 'from-amber-900/70 to-amber-700/30',
  WORKSHOP: 'from-green-900/70 to-green-700/30',
  SEMINAR: 'from-cyan-900/70 to-cyan-700/30',
  MEETUP: 'from-purple-900/70 to-purple-700/30',
  PANEL_DISCUSSION: 'from-indigo-900/70 to-indigo-700/30',
  WEBINAR: 'from-sky-900/70 to-sky-700/30',
  NETWORKING: 'from-pink-900/70 to-pink-700/30',
  PERFORMANCE: 'from-rose-900/70 to-rose-700/30',
  EXHIBITION: 'from-violet-900/70 to-violet-700/30',
  COMPETITION: 'from-red-900/70 to-red-700/30',
  FESTIVAL: 'from-fuchsia-900/70 to-fuchsia-700/30',
  PARTY: 'from-orange-900/70 to-orange-700/30',
  CEREMONY: 'from-emerald-900/70 to-emerald-700/30',
  TRAINING: 'from-lime-900/70 to-lime-700/30',
  OTHER: 'from-gray-900/70 to-gray-700/30'
};

const DEFAULT_FORMAT_COLOR = 'from-gray-900/70 to-gray-700/30';

interface EventStatusBadgeProps {
  event: Event;
}

const EventStatusBadge = ({ event }: EventStatusBadgeProps) => {
  if (!event) return null;

  const now = dayjs();

  if (now.isBefore(event.startDate)) {
    return (
      <Badge variant="outline" className="bg-primary-light/70 text-primary border-primary">
        Upcoming
      </Badge>
    );
  }
  if (now.isAfter(event.endDate)) {
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        Past Event
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="bg-green-500/30 text-green-600 border-green-600">
      Happening Now
    </Badge>
  );
};

export const EventHero = ({ event }: EventHeroProps) => {
  const { isFollowing, toggle } = useEventFollow(event.id);
  const nav = useNavigate();
  const share = useShare();
  const me = useAuth();
  const handleShare = () => {
    if (!event) return;
    share({
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href
    });
  };

  const formatDate = (dateString: string | Date | Dayjs) => {
    return dayjs(dateString).format('dddd, MMMM D, YYYY');
  };

  // Get a color based on category for the gradient overlay
  const getFormatColor = () => {
    if (!event.format) return DEFAULT_FORMAT_COLOR;

    return FORMAT_COLORS[event.format] || DEFAULT_FORMAT_COLOR;
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-t ${getFormatColor()} z-10`}></div>
      <Image
        src={
          event.posterUrl ||
          (event.location &&
            getStaticMapImageUrl({
              center: event.location,
              zoom: 10,
              size: {
                width: 600,
                height: 300
              },
              markers: [{ position: event.location }]
            }))
        }
        alt={event.title}
        className="w-full h-full object-cover object-center "
      />

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10 text-white">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {event.themes && event.themes.length > 0 && (
              <div className="flex items-center gap-2">
                {event.themes.map((theme) => (
                  <Badge key={theme} variant="outline" className="bg-white/10 text-white border-white/20 capitalize">
                    {theme.replace(/_/g, ' ').toLowerCase()}
                  </Badge>
                ))}
              </div>
            )}
            <EventStatusBadge event={event} />
            {event.format && (
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 capitalize">
                {event.format.replace(/_/g, ' ').toLowerCase()}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-md line-clamp-2">{event.title}</h1>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/90">
            <div className="flex items-center mr-6 space-x-2">
              <FiCalendar className="mr-2" />
              <span>{formatDate(event.startDate)}</span>
              {event.endDate && event.endDate !== event.startDate && (
                <>
                  <FaArrowRightLong />
                  <span>{formatDate(event.endDate)}</span>
                </>
              )}
            </div>
            <div className="flex items-center">
              <FiMapPin className="mr-2 h-5 w-5" />
              <span>{event.location?.address || 'Online'}</span>
            </div>
            <div className="flex items-center">
              <FiDollarSign className="mr-2 h-5 w-5" />
              <span className="font-medium">{event.price ? `$${event.price.toFixed(2)}` : 'Free'}</span>
            </div>
          </div>
        </div>
      </div>
      <Button
        variant="link"
        size="icon"
        className="absolute top-4 left-8 z-20 justify-center flex items-center group hover:text-primary"
        onClick={() => nav(-1)}
        aria-label="Go back">
        <ArrowLeft className="size-6 transform group-hover:-translate-x-1 transition-transform" />
        Go Back
      </Button>
      <div className="flex space-x-2 absolute top-4 right-4 z-20">
        {me.data?.id === event.creatorId && (
          <EventSettingsModal event={event}>
            <Button
              variant="ghost"
              size={'icon'}
              className="text-white/90 hover:text-primary hover:bg-primary/30 transition-colors duration-300"
              aria-label="Event settings">
              <FiSettings className="size-6" />
            </Button>
          </EventSettingsModal>
        )}
        <Button
          variant="ghost"
          size={'icon'}
          className="text-white/90 hover:text-red-700/80 hover:bg-red-500/30 transition-colors duration-300 hover:border-red-700/80"
          onClick={toggle}
          aria-pressed={isFollowing}
          aria-label="Like event">
          <FiBell className="size-6" fill={isFollowing ? 'currentColor' : 'none'} />
        </Button>
        <Button
          variant="ghost"
          size={'icon'}
          onClick={handleShare}
          className="text-white/90 hover:text-primary hover:bg-primary/30 transition-colors duration-300"
          aria-label="Share event">
          <FiShare2 className="size-6" />
        </Button>
      </div>
    </div>
  );
};
