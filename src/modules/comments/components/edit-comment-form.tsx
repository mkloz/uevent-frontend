'use client';

import { Check, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../../../shared/components/ui/button';
import { Textarea } from '../../../shared/components/ui/textarea';
import { AddEmojiButton } from './add-emoji-button';

interface EditCommentFormProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  isReply?: boolean;
}

export const EditCommentForm = ({
  initialContent,
  onSave,
  onCancel,
  isSubmitting,
  isReply = false
}: EditCommentFormProps) => {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus the textarea and place cursor at the end
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(content.length, content.length);
    }
  }, [content.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;
    await onSave(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
    // Cancel on Escape
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`min-h-[80px] resize-none ${isReply ? 'text-sm' : ''}`}
          disabled={isSubmitting}
          maxLength={1000}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">{content.length}/1000</div>
      </div>
      <div className="flex justify-center gap-2">
        <AddEmojiButton onEmojiSelect={(emoji) => setContent((prev) => prev + emoji)} disabled={isSubmitting}>
          {''}
        </AddEmojiButton>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-8 ml-auto">
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || content === initialContent || isSubmitting}
          isLoading={isSubmitting}
          className="h-8">
          {!isSubmitting && <Check className="h-4 w-4 mr-1" />}
          Save
        </Button>
      </div>
    </form>
  );
};
