'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Form } from '@/shared/components/ui/form';
import { Tabs, TabsContent } from '@/shared/components/ui/tabs';
import { QueryKeys } from '@/shared/constants/query-keys';

import { EventFormatType, EventThemeType } from '../../../interfaces/event.interface';
import { type CreateEventDto, CreateEventSchema, EventService } from '../../../services/event.service';
// Import all field components
import {
  DescriptionField,
  EndDateField,
  FormatField,
  LocationField,
  MaxAttendeesField,
  NotifyOnNewAttendeeField,
  PosterField,
  PriceField,
  PublishDateField,
  ShowAttendeeListField,
  StartDateField,
  ThemesField,
  TitleField
} from '../fields';
import { EventFormFooter } from './event-form-footer';
import { EventFormTabs } from './event-form-tabs';

interface CreateEventFormProps {
  companyId: string;
  onSuccess?: () => void;
}

export const CreateEventForm: FC<CreateEventFormProps> = ({ companyId, onSuccess }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('basic');
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Track which tabs are accessible
  const [accessibleTabs, setAccessibleTabs] = useState<Record<string, boolean>>({
    basic: true,
    media: false,
    datetime: false,
    location: false,
    tickets: false,
    settings: false
  });

  const form = useForm<CreateEventDto>({
    resolver: zodResolver(CreateEventSchema),
    defaultValues: {
      companyId,
      price: 0,
      showAttendeeList: true,
      notifyOnNewAttendee: false,
      startDate: dayjs().add(15, 'minute').toDate(),
      endDate: dayjs().add(1, 'hour').toDate(),
      format: EventFormatType.CONFERENCE,
      themes: [EventThemeType.BUSINESS]
    },
    mode: 'onChange'
  });

  const { mutate: createEvent, isPending: isCreating } = useMutation({
    mutationFn: EventService.create,
    onSuccess: async (event) => {
      // If we have a poster file, upload it
      if (posterFile && event.id) {
        await uploadPosterMutation.mutateAsync({ id: event.id, file: posterFile });
      }

      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_EVENTS, companyId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS] });
      form.reset();
      setPosterFile(null);
      setPosterPreview(null);
      toast.success('Event created successfully!');
      onSuccess?.();
    }
  });

  const uploadPosterMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => EventService.uploadPoster(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_EVENTS, companyId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS] });
      toast.success('Poster uploaded successfully');
    }
  });

  const onSubmit = (data: CreateEventDto) => {
    createEvent(data);
  };

  const handleNextTab = async () => {
    let nextTab = '';

    switch (activeTab) {
      case 'basic':
        if (await form.trigger(['title', 'description', 'format', 'themes'])) {
          nextTab = 'media';
          setAccessibleTabs((prev) => ({ ...prev, media: true }));
        }
        break;
      case 'media':
        nextTab = 'datetime';
        setAccessibleTabs((prev) => ({ ...prev, datetime: true }));
        break;
      case 'datetime':
        if (await form.trigger(['startDate', 'endDate', 'publishAt'])) {
          nextTab = 'location';
          setAccessibleTabs((prev) => ({ ...prev, location: true }));
        }
        break;
      case 'location':
        if (await form.trigger(['location'])) {
          nextTab = 'tickets';
          setAccessibleTabs((prev) => ({ ...prev, tickets: true }));
        }
        break;
      case 'tickets':
        if (await form.trigger(['price', 'maxAttendees'])) {
          nextTab = 'settings';
          setAccessibleTabs((prev) => ({ ...prev, settings: true }));
        }
        break;
      default:
        break;
    }

    if (nextTab) {
      setActiveTab(nextTab);
    }
  };

  const handlePreviousTab = () => {
    switch (activeTab) {
      case 'media':
        setActiveTab('basic');
        break;
      case 'datetime':
        setActiveTab('media');
        break;
      case 'location':
        setActiveTab('datetime');
        break;
      case 'tickets':
        setActiveTab('location');
        break;
      case 'settings':
        setActiveTab('tickets');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col h-full min-h-140">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
            <EventFormTabs accessibleTabs={accessibleTabs} />

            <div className="flex-1 overflow-y-auto px-1 py-4">
              {/* Basic Info Tab */}
              <TabsContent value="basic" className="space-y-4 mt-0 h-auto">
                <div className="space-y-4">
                  <TitleField />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormatField />
                    <ThemesField />
                  </div>
                  <DescriptionField />
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-4 mt-0 h-auto">
                <div className="space-y-4">
                  <PosterField
                    setPosterFile={setPosterFile}
                    posterPreview={posterPreview}
                    setPosterPreview={setPosterPreview}
                  />
                </div>
              </TabsContent>

              {/* Date Time Tab */}
              <TabsContent value="datetime" className="space-y-4 mt-0 h-auto">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Date and Time</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-4 md:border-r md:pr-3">
                      <StartDateField />
                      <EndDateField />
                    </div>
                    <PublishDateField />
                  </div>
                </div>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="space-y-4 mt-0 h-auto">
                <div className="space-y-4">
                  <LocationField />
                </div>
              </TabsContent>

              {/* Tickets Tab */}
              <TabsContent value="tickets" className="space-y-4 mt-0 h-auto">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Tickets & Attendance</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <PriceField />
                    <MaxAttendeesField />
                  </div>
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4 mt-0 h-auto">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Privacy & Notifications</h3>
                  <div className="space-y-6">
                    <ShowAttendeeListField />
                    <NotifyOnNewAttendeeField />
                  </div>
                </div>
              </TabsContent>
            </div>

            <EventFormFooter
              activeTab={activeTab}
              handlePreviousTab={handlePreviousTab}
              handleNextTab={handleNextTab}
              isCreating={isCreating}
            />
          </Tabs>
        </form>
      </Form>
    </div>
  );
};
