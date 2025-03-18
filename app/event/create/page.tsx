"use client";

import { CalendarMinusIcon, CalendarPlusIcon } from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";

export default function CreateEvent() {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h2 className="card-title text-2xl">Choose Potential Dates</h2>
            {numberOfMonths === 1 ? (
              <button className="btn btn-soft" onClick={() => setNumberOfMonths(numberOfMonths + 1)}>
                + Add Month
              </button>
            ) : (
              <div className="join">
                <button className="btn join-item btn-soft" onClick={() => setNumberOfMonths(Math.max(1, numberOfMonths - 1))}>
                  <CalendarMinusIcon size={20} />
                </button>
                <button className="btn join-item btn-soft" onClick={() => setNumberOfMonths(numberOfMonths + 1)}>
                  <CalendarPlusIcon size={20} />
                </button>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <DayPicker
              required
              numberOfMonths={numberOfMonths}
              mode="multiple"
              selected={selectedDates}
              onSelect={setSelectedDates}
              classNames={{
                root: "react-day-picker shadow-lg",
                // selected: "",
                // today: "text-primary bg-primary-content",
                // day_button: "rdp-day_button !hover:bg-accent-focus !hover:text-accent-content",
                // focused: "bg-accent text-accent-content rounded-full",
              }}
            />
          </div>
          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}
