'use client';

import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import type { CreateEventDto } from '@/modules/event/services/event.service';
import { Button } from '@/shared/components/ui/button';

interface EventFormFooterProps {
  activeTab: string;
  handlePreviousTab: () => void;
  handleNextTab: () => void;
  isCreating: boolean;
}

export const EventFormFooter: FC<EventFormFooterProps> = ({
  activeTab,
  handlePreviousTab,
  handleNextTab,
  isCreating
}) => {
  const { watch, reset } = useFormContext<CreateEventDto>();
  return (
    <div className="mt-auto pt-4 border-t">
      <div className="flex justify-between pb-4">
        {activeTab !== 'basic' ? (
          <Button type="button" variant="outline" onClick={handlePreviousTab}>
            Back
          </Button>
        ) : (
          <div></div> // Empty div to maintain flex layout
        )}

        {activeTab !== 'settings' ? (
          <Button
            type="button"
            onClick={handleNextTab}
            disabled={
              (activeTab === 'basic' &&
                (!watch('title') ||
                  !watch('description') ||
                  !watch('format') ||
                  !watch('themes') ||
                  watch('themes').length === 0)) ||
              (activeTab === 'datetime' && (!watch('startDate') || !watch('endDate'))) ||
              (activeTab === 'location' && watch('location') === undefined) ||
              (activeTab === 'tickets' && (watch('price') === undefined || isNaN(watch('price'))))
            }>
            Next:{' '}
            {activeTab === 'basic'
              ? 'Media'
              : activeTab === 'media'
                ? 'Date & Time'
                : activeTab === 'datetime'
                  ? 'Location'
                  : activeTab === 'location'
                    ? 'Tickets'
                    : 'Settings'}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => reset()}>
              Reset Form
            </Button>
            <Button type="submit" disabled={isCreating} className="min-w-35">
              {isCreating ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width:
              activeTab === 'basic'
                ? '16.67%'
                : activeTab === 'media'
                  ? '33.33%'
                  : activeTab === 'datetime'
                    ? '50%'
                    : activeTab === 'location'
                      ? '66.67%'
                      : activeTab === 'tickets'
                        ? '83.33%'
                        : '100%'
          }}
        />
      </div>
    </div>
  );
};
