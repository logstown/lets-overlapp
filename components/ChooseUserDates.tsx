"use client";

import { useState } from "react";
import { ClassNames, DayEventHandler, DayPicker, Matcher } from "react-day-picker";
import { max, min, differenceInCalendarMonths, isSameDay } from "date-fns";
import { reject } from "lodash";
import ContinueButton from "@/components/ContinueButton";
import { MinusIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";

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

  const [numberOfMonths, setNumberOfMonths] = useState(() => {
    if (setDates) {
      const maxDate = max(setDates);
      return differenceInCalendarMonths(maxDate, minDate) + 1;
    } else {
      return 1;
    }
  });
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [preferredDates, setPreferredDates] = useState<Date[]>([]);
  const disabledMatcher: Matcher = (day: Date) => {
    if (!setDates) return false;
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title text-2xl">Choose Potential Dates</h2>
          {!eventId && (
            <>
              {numberOfMonths === 1 ? (
                <button className="btn btn-soft" onClick={() => setNumberOfMonths(numberOfMonths + 1)}>
                  + Add month
                </button>
              ) : (
                <div className="join">
                  <button className="btn join-item btn-soft" onClick={() => setNumberOfMonths(Math.max(1, numberOfMonths - 1))}>
                    <MinusIcon size={20} />
                  </button>
                  <button className="btn join-item btn-soft" onClick={() => setNumberOfMonths(numberOfMonths + 1)}>
                    <PlusIcon size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-center">
          <DayPicker
            // required
            defaultMonth={minDate}
            disabled={disabledMatcher}
            numberOfMonths={numberOfMonths}
            // mode="multiple"
            // selected={availableDates}
            // onSelect={onSelected}
            onDayClick={onSelected}
            modifiers={{
              preferredDates,
              availableDates,
            }}
            modifiersClassNames={{
              preferredDates: "!bg-success !text-success-content",
              availableDates: "!bg-neutral !text-neutral-content",
            }}
            classNames={classNames}
            hideNavigation={!!eventId}
          />
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
