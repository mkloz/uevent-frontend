import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/shared/components/ui/form';
import { Switch } from '@/shared/components/ui/switch';
import { QueryKeys } from '@/shared/constants/query-keys';

import type { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

// Form validation schema
const privacyFormSchema = z.object({
  showInAttendeeList: z.boolean(),
  showFollowingList: z.boolean()
});

type PrivacyFormValues = z.infer<typeof privacyFormSchema>;

interface PrivacySettingsFormProps {
  currentUser: User;
}

export const PrivacySettingsForm = ({ currentUser }: PrivacySettingsFormProps) => {
  const queryClient = useQueryClient();
  const defaultValues = {
    showInAttendeeList: currentUser?.settings?.showInAttendeeList ?? true,
    showFollowingList: currentUser?.settings?.showFollowingList ?? true
  };
  const form = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues
  });

  const handleReset = () => {
    form.reset(defaultValues);
    toast.info('Privacy settings reset to original values');
  };

  // Update user settings mutation
  const updateUserSettings = useMutation({
    mutationFn: (data: PrivacyFormValues) => {
      return UserService.updateUserSettings(data);
    },
    onSuccess: () => {
      toast.success('Privacy settings updated successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS, currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS_ME] });
    },
    onError: (error) => {
      toast.error('Failed to update privacy settings', {
        description: error instanceof Error ? error.message : 'Please try again later'
      });
    }
  });

  const onSubmit = (data: PrivacyFormValues) => {
    updateUserSettings.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="showInAttendeeList"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show in Attendee Lists</FormLabel>
                  <FormDescription>Allow others to see you in event attendee lists</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Show in attendee lists" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showFollowingList"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Show Following List</FormLabel>
                  <FormDescription>Allow others to see companies and events you follow</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} aria-label="Show following list" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleReset} disabled={!form.formState.isDirty}>
            Reset Settings
          </Button>
          <Button type="submit" disabled={updateUserSettings.isPending || !form.formState.isDirty}>
            {updateUserSettings.isPending ? 'Saving...' : 'Save Privacy Settings'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
