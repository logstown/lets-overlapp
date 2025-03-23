"use client";

import { min, max, differenceInCalendarMonths } from "date-fns";
import { DayPicker } from "react-day-picker";

export default function AggregatedDates({
  available,
  unavailable,
  preferred,
}: {
  available: Date[];
  unavailable: Date[];
  preferred: Date[];
}) {
  const minDate = min([...available, ...unavailable, ...preferred]);
  const maxDate = max([...available, ...unavailable, ...preferred]);
  const numberOfMonths = differenceInCalendarMonths(maxDate, minDate) + 1;

  return (
    <div className="flex justify-center">
      <DayPicker
        defaultMonth={minDate}
        numberOfMonths={numberOfMonths}
        modifiers={{
          available,
          unavailable,
          preferred,
        }}
        modifiersClassNames={{
          available: "bg-success/50 text-success-content border-2 border-base-100",
          unavailable: "bg-base-300 text-base-content border-2 border-base-100",
          preferred: "bg-success text-success-content border-2 border-base-100",
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
