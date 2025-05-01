import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '@/shared/components/ui/calendar';
import { Input } from '@/shared/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';

import { cn } from '../../../lib/utils';

interface DateButtonProps {
  id?: string;
  value?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  minDate?: Date;
  className?: string;
}

export const DateInput = ({
  id,
  value,
  onSelect,
  placeholder = 'Pick a date',
  minDate,
  className
}: DateButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn('relative w-full group min-w-30', className)}>
          <Input
            id={id}
            readOnly
            className="cursor-pointer pr-10"
            value={value ? dayjs(value).format('MMM D, YYYY') : ''}
            placeholder={placeholder}
          />
          <CalendarIcon className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onSelect(date ?? undefined)}
          disabled={minDate ? (date) => date < minDate : undefined}
        />
      </PopoverContent>
    </Popover>
  );
};
