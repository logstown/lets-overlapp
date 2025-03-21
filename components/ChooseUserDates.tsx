"use client";

import { useState } from "react";
import { ClassNames, DayEventHandler, DayPicker, Matcher } from "react-day-picker";
import { max, min, differenceInCalendarMonths, isSameDay } from "date-fns";
import { reject } from "lodash";
import ContinueButton from "@/components/ContinueButton";
import DaysLegend from "./DaysLegend";

export default function ChooseUserDates({ setDates, eventId }: { setDates?: Date[]; eventId?: string }) {
  const minDate = setDates ? min(setDates) : new Date();
  const classNames: Partial<ClassNames> = {
    root: "react-day-picker shadow-lg",
    today: "text-base-content bg-base-100",
    disabled: "!text-base-content/50",
    day_button: "rdp-day_button hover:!bg-transparent",
  };

  if (!!eventId) {
    classNames.day = "text-primary";
  }

  const [numberOfMonths] = useState(() => {
    if (setDates) {
      const maxDate = max(setDates);
      return differenceInCalendarMonths(maxDate, minDate) + 1;
    } else {
      return 2;
    }
  });
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [preferredDates, setPreferredDates] = useState<Date[]>([]);
  const disabledMatcher: Matcher = (day: Date) => {
    if (!setDates) {
      return day < new Date();
    }
    return !setDates.some((setDate) => setDate.toISOString() === day.toISOString());
  };

  const onSelected: DayEventHandler<React.MouseEvent> = (day, modifiers) => {
    let newAvailableDates = [...(availableDates ?? [])];
    let newPreferredDates = [...(preferredDates ?? [])];

    if (modifiers.availableDates) {
      newAvailableDates = reject(newAvailableDates, (d) => isSameDay(day, d));
      newPreferredDates.push(day);
    } else if (modifiers.preferredDates) {
      newPreferredDates = reject(newPreferredDates, (d) => isSameDay(day, d));
    } else {
      newAvailableDates.push(day);
    }

    setAvailableDates(newAvailableDates);
    setPreferredDates(newPreferredDates);
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-center items-center mb-6">
          <h2 className="card-title text-2xl">Choose Potential Dates</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-evenly items-center gap-4">
          <DayPicker
            startMonth={new Date()}
            fixedWeeks
            defaultMonth={minDate}
            disabled={disabledMatcher}
            numberOfMonths={numberOfMonths}
            onDayClick={onSelected}
            modifiers={{
              preferredDates,
              availableDates,
            }}
            modifiersClassNames={{
              preferredDates: "!bg-success !text-success-content",
              availableDates: "!bg-success/50 !text-success-content",
            }}
            classNames={classNames}
            hideNavigation={!!eventId}
          />
          <DaysLegend />
        </div>
        <div className="card-actions justify-end mt-6">
          {(availableDates.length > 0 || preferredDates.length > 0) && (
            <ContinueButton preferredDates={preferredDates} availableDates={availableDates} eventId={eventId} />
          )}
        </div>
      </div>
    </div>
  );
}
