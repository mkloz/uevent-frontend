'use client';

import dayjs from 'dayjs';
import { CalendarIcon, X } from 'lucide-react';
import { type FC, useEffect, useMemo, useState } from 'react';

import { cn } from '../../../lib/utils';
import { Button } from '../../ui/button';
import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { ScrollArea, ScrollBar } from '../../ui/scroll-area';

interface DateTimeInputProps {
  defaultValue?: Date;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export const DateTimeInput: FC<DateTimeInputProps> = ({
  value,
  onChange,
  min,
  max,
  disabled,
  defaultValue,
  className
}) => {
  const [date, setDate] = useState<Date | undefined>(value || defaultValue);
  const [isOpen, setIsOpen] = useState(false);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: 12 }, (_, i) => i * 5), []);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      if (min && dayjs(selectedDate).isBefore(dayjs(min))) {
        selectedDate = new Date(min);
      }
      if (max && dayjs(selectedDate).isAfter(dayjs(max))) {
        selectedDate = new Date(max);
      }
      const roundedMinutes = Math.round(selectedDate.getMinutes() / 5) * 5;
      selectedDate.setMinutes(roundedMinutes, 0, 0);
      setDate(selectedDate);
      onChange?.(selectedDate);
    }
  };

  useEffect(() => {
    if (value && !dayjs(value).isSame(date)) {
      setDate(value);
    }
  }, [value]);

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === 'hour') {
        newDate.setHours(Number.parseInt(value));
      } else if (type === 'minute') {
        newDate.setMinutes(Number.parseInt(value));
      }
      handleDateSelect(newDate);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? dayjs(date).format('DD/MM/YYYY HH:mm') : 'Select date and time'}

          <span className="ml-auto">
            {date && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setDate(undefined);
                  onChange?.(undefined);
                }}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full max-w-87">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date || undefined}
            className="max-sm:border-b-2"
            onSelect={handleDateSelect}
            initialFocus
            disabled={(day) =>
              (min ? dayjs(day).isBefore(dayjs(min), 'day') : false) ||
              (max ? dayjs(day).isAfter(dayjs(max), 'day') : false)
            }
          />
          <div className="flex flex-col sm:flex-row sm:h-68 divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={dayjs(date).hour() === hour ? 'default' : 'ghost'}
                    className="sm:w-full shrink-0 aspect-square"
                    disabled={
                      (min && dayjs(date).hour(hour).isBefore(dayjs(min))) ||
                      (max && dayjs(date).hour(hour).isAfter(dayjs(max)))
                    }
                    onClick={() => handleTimeChange('hour', hour.toString())}>
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={dayjs(date).minute() === minute ? 'default' : 'ghost'}
                    className="sm:w-full shrink-0 aspect-square"
                    disabled={
                      (min && dayjs(date).minute(minute).isBefore(dayjs(min))) ||
                      (max && dayjs(date).minute(minute).isAfter(dayjs(max)))
                    }
                    onClick={() => handleTimeChange('minute', minute.toString())}>
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
