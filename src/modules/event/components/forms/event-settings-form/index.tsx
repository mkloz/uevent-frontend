'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Import all field components
import { Trash2 } from 'lucide-react';
import { type FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ConfirmModal } from '@/shared/components/common/confirm-modal';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Form } from '@/shared/components/ui/form';
import { QueryKeys } from '@/shared/constants/query-keys';

import { Tabs, TabsContent } from '../../../../../shared/components/ui/tabs';
import type { Event } from '../../../interfaces/event.interface';
import { type CreateEventDto, EventService, UpdateEventDto, UpdateEventSchema } from '../../../services/event.service';
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
import { EventFormTabs } from './event-form-tabs';

interface EventSettingsFormProps {
  event: Event;
  onSuccess?: () => void;
  onDelete?: () => void;
}

export const EventSettingsForm: FC<EventSettingsFormProps> = ({ event, onSuccess, onDelete }) => {
  const queryClient = useQueryClient();
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(event.posterUrl || null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const form = useForm<UpdateEventDto>({
    resolver: zodResolver(UpdateEventSchema),
    defaultValues: {
      ...event,
      posterUrl: event.posterUrl || undefined
    },
    mode: 'onChange'
  });

  useEffect(() => {
    form.trigger();
  }, []);

  const { mutate: updateEvent, isPending: isUpdating } = useMutation({
    mutationFn: (data: Partial<CreateEventDto>) => EventService.update(event.id, data),
    onSuccess: async () => {
      // If we have a poster file, upload it
      if (posterFile) {
        await uploadPosterMutation.mutateAsync({ file: posterFile });
      }

      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS, event.id] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_EVENTS, event.companyId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS] });
      toast.success('Event updated successfully!');
      onSuccess?.();
    }
  });

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: () => EventService.delete(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.COMPANY_EVENTS, event.companyId] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.EVENTS] });
      toast.success('Event deleted successfully!');
      onDelete?.();
    }
  });

  const uploadPosterMutation = useMutation({
    mutationFn: ({ file }: { file: File }) => EventService.uploadPoster(event.id, file),
    onSuccess: () => {
      toast.success('Poster uploaded successfully');
    }
  });

  const onSubmit = (data: UpdateEventDto) => {
    updateEvent(data);
  };

  const handleDeleteEvent = () => {
    setIsDeleteModalOpen(false);
    deleteEvent();
  };

  return (
    <div className="space-y-6 min-h-115">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Custom tabs component with an additional danger tab */}
            <div className="flex justify-between items-center mb-4">
              <div className="w-full">
                <EventFormTabs />
              </div>
              <Button
                type="submit"
                disabled={!form.formState.isValid || (!form.formState.isDirty && !posterFile) || isUpdating}
                isLoading={isUpdating}
                className="ml-4">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-0">
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
            <TabsContent value="media" className="mt-0">
              <PosterField
                setPosterFile={setPosterFile}
                posterPreview={posterPreview}
                setPosterPreview={setPosterPreview}
              />
            </TabsContent>

            {/* Date & Time Tab */}
            <TabsContent value="datetime" className="mt-0">
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <StartDateField />
                  <EndDateField />
                </div>
                <PublishDateField />
              </div>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location" className="mt-0">
              <LocationField />
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets" className="mt-0">
              <div className="space-y-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <PriceField disabled label="Price (Uneditable)" />
                  <MaxAttendeesField min={event.maxAttendees} />
                </div>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-0">
              <div className="space-y-6">
                <ShowAttendeeListField />
                <NotifyOnNewAttendeeField />
              </div>
            </TabsContent>

            {/* Danger Zone Tab */}
            <TabsContent value="danger" className="mt-0">
              <Card className="border-destructive/20">
                <CardHeader className="text-destructive">
                  <CardTitle>Danger Zone</CardTitle>
                  <CardDescription>
                    Actions in this section can lead to permanent data loss. Please proceed with caution.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-md bg-destructive/5">
                    <div>
                      <h4 className="font-medium">Delete this event</h4>
                      <p className="text-sm text-muted-foreground">
                        Once deleted, this event and all associated data will be permanently removed.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={isDeleting}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone and all associated data will be permanently removed."
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteEvent}
      />
    </div>
  );
};
