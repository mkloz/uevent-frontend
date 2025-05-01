'use client';

import { Send } from 'lucide-react';
import type React from 'react';
import { useCallback, useRef, useState } from 'react';

import { useAuth } from '@/modules/auth/queries/use-auth.query';
import { UserAvatar } from '@/shared/components/common/user-avatar';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';

import { cn } from '../../../shared/lib/utils';
import { AddEmojiButton } from './add-emoji-button';

// Common emoji categories

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  isReply?: boolean;
  isSubmitting?: boolean;
}

export const CommentForm = ({
  onSubmit,
  onCancel,
  placeholder = 'Share your thoughts about this event...',
  autoFocus = false,
  isReply = false,
  isSubmitting = false
}: CommentFormProps) => {
  const [content, setContent] = useState('');
  const { data: user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertEmoji = useCallback((emoji: string) => {
    setContent((prev) => prev + emoji);
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isSubmitting) return;

    try {
      await onSubmit(content);
      setContent('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-lg border border-border">
        <p className="text-muted-foreground">Please log in to leave a comment</p>
        <Button variant="link" className="mt-2" onClick={() => (window.location.href = '/auth/login')}>
          Log in
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${isReply ? 'mt-2' : 'mt-6'}`}>
      <div className="flex gap-3">
        <UserAvatar user={user} className={cn('size-10', isReply && 'size-8')} />
        <div className="flex-1 space-y-2">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              className="min-h-[80px] resize-none"
              autoFocus={autoFocus}
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">{content.length}/1000</div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <AddEmojiButton onEmojiSelect={insertEmoji} disabled={isSubmitting} />

            <div className="flex gap-2 ml-auto">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="gap-2"
                size={isReply ? 'sm' : 'default'}
                isLoading={isSubmitting}>
                {!isSubmitting && <Send className="h-4 w-4" />}
                {isSubmitting ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
