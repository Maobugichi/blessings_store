// components/DateRangePicker.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange as DayPickerDateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  from: Date | undefined;
  to: Date | undefined;
  onChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ from, to, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (range: DayPickerDateRange | undefined) => {
    onChange({ from: range?.from, to: range?.to });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-[280px] justify-start text-left font-normal', !from && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {from ? (
            to ? `${format(from, 'LLL dd, y')} - ${format(to, 'LLL dd, y')}` : format(from, 'LLL dd, y')
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
         
          mode="range"
          defaultMonth={from}
          selected={{ from, to }}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};