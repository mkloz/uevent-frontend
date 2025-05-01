import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { QueryKeys } from '@/shared/constants/query-keys';

import { UserAvatar } from '../../../../shared/components/common/user-avatar';
import { userGroupOptions } from '../../../auth/queries/use-auth.query';
import type { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';

interface AvatarUploadProps {
  currentUser: User;
}

export const AvatarUpload = ({ currentUser }: AvatarUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentUser.avatar || null);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadAvatar = useMutation({
    mutationFn: (file: File) => {
      return UserService.updateAvatar(file);
    },
    onSuccess: () => {
      toast.success('Avatar updated successfully');
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USERS, currentUser.id] });
      queryClient.invalidateQueries(userGroupOptions());
      setFile(null);
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 1
  });

  const handleUpload = () => {
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  const handleCancel = () => {
    setPreview(currentUser.avatar || null);
    setFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-muted">
          <UserAvatar
            user={{ ...currentUser, avatar: preview ? preview : currentUser.avatar }}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1 w-full">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 transition-colors cursor-pointer ${
              isDragActive && !isDragReject
                ? 'border-primary bg-primary/10'
                : isDragReject
                  ? 'border-destructive bg-destructive/10'
                  : 'border-muted-foreground/20'
            }`}
            aria-label="Drag and drop area for avatar upload">
            <input {...getInputProps()} aria-label="File input" />
            {isDragActive && !isDragReject ? (
              <p className="text-center text-sm">Drop the image here...</p>
            ) : isDragReject ? (
              <p className="text-center text-sm text-destructive">File type not supported</p>
            ) : (
              <p className="text-center text-sm">
                Drag and drop an image here, or click to select a file
                <br />
                <span className="text-xs text-muted-foreground">JPG, PNG or GIF (max. 5MB)</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {file && (
        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={uploadAvatar.isPending} className="flex-1">
            {uploadAvatar.isPending ? 'Uploading...' : 'Upload Avatar'}
          </Button>
          <Button variant="outline" onClick={handleCancel} disabled={uploadAvatar.isPending}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
