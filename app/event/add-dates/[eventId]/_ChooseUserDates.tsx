"use client";

import { useState } from "react";
import { DayPicker, Matcher } from "react-day-picker";
import { max, min, differenceInCalendarMonths } from "date-fns";
import ContinueButton from "@/components/ContinueButton";
export default function ChooseDates({ setDates, eventId }: { setDates: Date[]; eventId: string }) {
  //   console.log(setDates, eventId);
  const minDate = min(setDates);
  const maxDate = max(setDates);
  const numberOfMonths = differenceInCalendarMonths(maxDate, minDate) + 1;

  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();

  const disabledMatcher: Matcher = (day: Date) => {
    return !setDates.some((setDate) => setDate.toUTCString() === day.toUTCString());
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-6">Choose Potential Dates</h2>
        <div className="flex justify-center">
          <DayPicker
            defaultMonth={minDate}
            disabled={disabledMatcher}
            timeZone="UTC"
            numberOfMonths={numberOfMonths}
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            classNames={{
              root: "react-day-picker shadow-lg",
              today: "text-base-content bg-base-100",
              disabled: "!text-base-content/50",
              day: "text-primary",
            }}
            hideNavigation
          />
        </div>
        <div className="card-actions justify-end mt-6">
          {selectedDates && <ContinueButton availableDates={selectedDates} eventId={eventId} />}
        </div>
      </div>
    </div>
  );
}
