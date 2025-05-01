import { Smile } from 'lucide-react';
import { FC, useState } from 'react';

import { Button } from '../../../shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover';

const EMOJI_CATEGORIES = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'] },
  { name: 'Gestures', emojis: ['👍', '👎', '👌', '✌️', '🤞', '👏', '🙌', '🤝', '🙏', '🤲'] },
  { name: 'Love', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕'] },
  { name: 'Celebration', emojis: ['🎉', '🎊', '🎈', '🎂', '🎁', '🎆', '🎇', '✨', '🎃', '🎄'] }
];

interface AddEmojiButtonProps {
  disabled?: boolean;
  children?: React.ReactNode;
  onEmojiSelect: (emoji: string) => void;
}

export const AddEmojiButton: FC<AddEmojiButtonProps> = ({
  disabled = false,
  onEmojiSelect,
  children = 'Add Emoji'
}) => {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  return (
    <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-full flex gap-2 items-center justify-center"
          disabled={disabled}
          aria-label="Add emoji">
          <Smile className="h-4 w-4" />
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-55 p-2 pr-0" side="top">
        <div className="space-y-3 max-h-54 overflow-y-auto">
          {EMOJI_CATEGORIES.map((category) => (
            <div key={category.name}>
              <h4 className="text-xs font-medium text-muted-foreground mb-1">{category.name}</h4>
              <div className="flex flex-wrap gap-1">
                {category.emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      onEmojiSelect(emoji);
                      setIsEmojiPickerOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onEmojiSelect(emoji);
                        setIsEmojiPickerOpen(false);
                      }
                    }}
                    tabIndex={0}
                    aria-label={`${category.name} emoji: ${emoji}`}
                    title={category.name.toLowerCase()}>
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
