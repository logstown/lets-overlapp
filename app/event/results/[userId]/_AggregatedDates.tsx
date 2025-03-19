"use client";

import { min, max, differenceInCalendarMonths } from "date-fns";
import { DayPicker } from "react-day-picker";

export default function AggregatedDates({ available, unavailable }: { available: Date[]; unavailable: Date[] }) {
  const minDate = min([...available, ...unavailable]);
  const maxDate = max([...available, ...unavailable]);
  const numberOfMonths = differenceInCalendarMonths(maxDate, minDate) + 1;

  return (
    <div className="flex justify-center">
      <DayPicker
        defaultMonth={minDate}
        numberOfMonths={numberOfMonths}
        modifiers={{
          available,
          unavailable,
        }}
        modifiersClassNames={{
          available: "bg-success text-success-content",
          unavailable: "bg-error text-error-content",
        }}
        classNames={{
          root: "react-day-picker shadow-lg",
          today: "text-base-content bg-base-100",
        }}
        hideNavigation
      />
    </div>
  );
}
