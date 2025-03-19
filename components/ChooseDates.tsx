"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import ContinueButton from "./ContinueButton";
import { max, min, differenceInCalendarMonths } from "date-fns";

export default function ChooseDates({ setDates, eventId }: { setDates?: Date[]; eventId?: string }) {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const [numberOfMonths, setNumberOfMonths] = useState(1);
  const [minDate, setMinDate] = useState<Date | undefined>();

  useEffect(() => {
    if (!setDates) return;
    const minDate = min(setDates);
    const maxDate = max(setDates);
    const numberOfMonths = differenceInCalendarMonths(maxDate, minDate) + 1;
    setNumberOfMonths(numberOfMonths);
    setMinDate(minDate);
  }, [setDates]);

  const disabledMatcher = (day: Date) => {
    if (!setDates) return false;
    return !setDates.some((setDate) => setDate.toUTCString() === day.toUTCString());
  };

  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-6">
          <h2 className="card-title text-2xl">Choose Potential Dates</h2>
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
        </div>
        {(minDate || !eventId) && (
          <div className="flex justify-center">
            <DayPicker
              defaultMonth={eventId ? minDate : new Date()}
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
                day: "text-info",
              }}
              hideNavigation={!!eventId}
            />
          </div>
        )}
        <div className="card-actions justify-end mt-6">
          {selectedDates && <ContinueButton availableDates={selectedDates} eventId={eventId} />}
        </div>
      </div>
    </div>
  );
}
