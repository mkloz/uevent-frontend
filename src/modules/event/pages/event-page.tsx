import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { Skeleton } from '@/shared/components/ui/skeleton';

import { QueryKeys } from '../../../shared/constants/query-keys';
import { NotFoundPage } from '../../../shared/pages/not-found-page';
import { Comments } from '../../comments/components/comments';
import { CompanyCard } from '../../company/components/company-card';
import { EventAttendees } from '../components/event-details/event-attendees';
import { EventHero } from '../components/event-details/event-hero';
import { EventMap } from '../components/event-details/event-map';
import { EventTickets } from '../components/event-details/event-tickets';
import { CompanyEvents } from '../components/event-details/organizer-events';
import { SimilarEvents } from '../components/event-details/similar-events';
import { UserEventTickets } from '../components/event-details/user-event-tickets';
import { EventService } from '../services/event.service';

export const EventPage = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch event details
  const {
    data: event,
    isLoading: isEventLoading,
    error
  } = useQuery({
    queryKey: [QueryKeys.EVENTS, id],
    queryFn: () => EventService.getById(id!),
    enabled: !!id
  });

  const { data: currentAttendeesCount, isLoading: isAttendeesCountLoading } = useQuery({
    queryKey: [QueryKeys.EVENT_ATTENDEES, id, 'count'],
    queryFn: () => EventService.getAttendeesCount(id!),
    select: (data) => data.currentAttendees,
    enabled: !!id
  });

  const isLoading = isEventLoading || isAttendeesCountLoading;

  // Handle error state
  if (error) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <EventSkeleton />;
  }

  if (!event) {
    return <NotFoundPage />;
  }

  return (
    <div className="bg-background min-h-screen-no-header">
      {/* Hero Section with Event Image */}
      <EventHero event={event} />
      <div className="container mx-auto px-4 py-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <div className="bg-card rounded-xl p-6 border">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 underline decoration-primary decoration-4 underline-offset-3">
                About This Event
              </h2>
              <div className="prose max-w-none">
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Event Location */}
            {event.location && <EventMap location={event.location} />}

            {/* Event Attendees - only show if the event has showAttendeeList enabled */}
            {event.showAttendeeList && (
              <EventAttendees
                eventId={event.id}
                maxAttendees={event.maxAttendees}
                currentAttendees={currentAttendeesCount}
              />
            )}

            {/* Event Comments */}
            <div className="hidden lg:block">
              <Comments eventId={event.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Event Actions */}
            <EventTickets event={event} currentAttendees={currentAttendeesCount || 0} />
            <UserEventTickets eventId={event.id} />
            {/* Organizer Info */}
            {event.company && <CompanyCard company={event.company} />}

            {/* More events from this organizer */}
            {event.company && <CompanyEvents companyId={event.company.id} />}

            {/* Related Events */}
            <SimilarEvents event={event} />

            <div className="lg:hidden block">
              <Comments eventId={event.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventSkeleton = () => (
  <div className="bg-background min-h-screen-no-header">
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-10">
        <div className="container mx-auto">
          <Skeleton className="h-8 w-24 mb-3" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex flex-wrap gap-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-8 relative z-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-60 w-full rounded-lg" />
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-2/3 mb-4" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="bg-card rounded-xl shadow-lg p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="flex items-center mb-4">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
