import 'react-day-picker/style.css';

import { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

function Calendar({ className, classNames, showOutsideDays = true, ...props }: ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(' select-none p-2 relative min-h-68', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row',
        month: 'flex flex-col gap-2',
        caption: 'flex justify-center pt-1 relative items-center w-full',
        caption_label: 'text-md font-medium text-center',
        month_caption: 'flex items-center justify-center w-full',
        nav: 'flex items-center gap-1 ',
        button_next: 'absolute right-2 top-2',
        chevron: 'fill-primary hover:fill-primary-dark transition-colors',
        button_previous: 'absolute left-2 top-2',

        table: 'w-full border-collapse space-x-1',
        head_row: 'flex',

        head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md ',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 font-normal aria-selected:opacity-100 hover:text-primary'
        ),

        range_start: 'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
        range_end: 'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full',
        today: 'bg-accent text-primary rounded-full',
        outside: 'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',

        range_middle: 'aria-selected:bg-primary-light aria-selected:text-foreground',
        day_hidden: 'invisible',
        ...classNames
      }}
      components={
        {
          // Dropdown(props) {
          //     return (
          //     )
          // },
        }
      }
      {...props}
    />
  );
}

export { Calendar };
