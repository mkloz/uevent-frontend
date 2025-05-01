import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { QueryKeys } from '@/shared/constants/query-keys';

import { EmailValidator } from '../../../../shared/validators/email.validator';
import { FullNameValidator } from '../../../../shared/validators/full-name.validator';
import type { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

// Form validation schema
const profileFormSchema = z.object({
  name: FullNameValidator.optional(),
  email: EmailValidator.optional(),
  bio: z.string().max(500, { message: 'Bio must not exceed 500 characters' }).optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  currentUser: User;
}

export const ProfileForm = ({ currentUser }: ProfileFormProps) => {
  const queryClient = useQueryClient();
  const defaultValues = {
    name: currentUser?.name,
    email: currentUser?.email,
    bio: currentUser?.bio
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  });
  const handleReset = () => {
    form.reset(defaultValues);
    toast.info('Form reset to original values');
  };
  // Update user data mutation
  const updateUserData = useMutation({
    mutationFn: (data: ProfileFormValues) => {
      return UserService.updateUserData(data);
    },
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS, currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS_ME] });
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateUserData.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email" type="email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself" className="resize-none min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>This will be displayed on your profile.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleReset} disabled={!form.formState.isDirty}>
            Reset Changes
          </Button>
          <Button type="submit" disabled={updateUserData.isPending || !form.formState.isDirty}>
            {updateUserData.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
