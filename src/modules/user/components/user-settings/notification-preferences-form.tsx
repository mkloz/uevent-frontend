import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Label } from '@/shared/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Separator } from '@/shared/components/ui/separator';
import { QueryKeys } from '@/shared/constants/query-keys';

import type { User } from '../../interfaces/user.interface';
import { NotificationChannelType } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

// Form validation schema
const notificationFormSchema = z.object({
  eventReminderChannel: z.nativeEnum(NotificationChannelType),
  ticketPurchaseChannel: z.nativeEnum(NotificationChannelType),
  newCommentChannel: z.nativeEnum(NotificationChannelType),
  companyUpdateChannel: z.nativeEnum(NotificationChannelType)
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

interface NotificationPreferencesFormProps {
  currentUser: User;
}

export const NotificationPreferencesForm = ({ currentUser }: NotificationPreferencesFormProps) => {
  const queryClient = useQueryClient();
  const defaultValues = {
    eventReminderChannel: currentUser?.settings?.eventReminderChannel || NotificationChannelType.EMAIL,
    ticketPurchaseChannel: currentUser?.settings?.ticketPurchaseChannel || NotificationChannelType.EMAIL,
    newCommentChannel: currentUser?.settings?.newCommentChannel || NotificationChannelType.EMAIL,
    companyUpdateChannel: currentUser?.settings?.companyUpdateChannel || NotificationChannelType.EMAIL
  };
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues
  });

  const handleReset = () => {
    form.reset(defaultValues);
    toast.info('Notification preferences reset to original values');
  };
  useWatch({ control: form.control });

  // Update user settings mutation
  const updateUserSettings = useMutation({
    mutationFn: (data: NotificationFormValues) => {
      return UserService.updateUserSettings(data);
    },
    onSuccess: () => {
      toast.success('Notification preferences updated successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS, currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS_ME] });
    },
    onError: (error) => {
      toast.error('Failed to update notification preferences', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    }
  });

  const onSubmit = (data: NotificationFormValues) => {
    updateUserSettings.mutate(data);
  };

  const notificationTypes = [
    {
      name: 'eventReminderChannel',
      label: 'Event Reminders',
      description: "Notifications about upcoming events you're attending"
    },
    {
      name: 'ticketPurchaseChannel',
      label: 'Ticket Purchases',
      description: 'Confirmations and updates about your ticket purchases'
    },
    {
      name: 'newCommentChannel',
      label: 'New Comments',
      description: 'Notifications when someone comments on your activity'
    },
    {
      name: 'companyUpdateChannel',
      label: 'Company Updates',
      description: 'Updates from companies you follow'
    }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {notificationTypes.map((type, index) => (
            <div key={type.name}>
              {index > 0 && <Separator className="my-4" />}
              <FormField
                control={form.control}
                name={type.name as keyof NotificationFormValues}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <div>
                      <FormLabel className="text-base">{type.label}</FormLabel>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:space-x-2">
                        <div className="flex items-center space-x-2 rounded-md border p-2">
                          <RadioGroupItem value={NotificationChannelType.EMAIL} id={`${type.name}-email`} />
                          <Label htmlFor={`${type.name}-email`} className="cursor-pointer">
                            Email
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2">
                          <RadioGroupItem value={NotificationChannelType.IN_APP} id={`${type.name}-app`} />
                          <Label htmlFor={`${type.name}-app`} className="cursor-pointer">
                            In-App
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2">
                          <RadioGroupItem value={NotificationChannelType.BOTH} id={`${type.name}-both`} />
                          <Label htmlFor={`${type.name}-both`} className="cursor-pointer">
                            Both
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border p-2">
                          <RadioGroupItem value={NotificationChannelType.NONE} id={`${type.name}-none`} />
                          <Label htmlFor={`${type.name}-none`} className="cursor-pointer">
                            None
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleReset} disabled={!form.formState.isDirty}>
            Reset Preferences
          </Button>
          <Button type="submit" disabled={updateUserSettings.isPending || !form.formState.isDirty}>
            {updateUserSettings.isPending ? 'Saving...' : 'Save Notification Preferences'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
