"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import ContinueButton from "@/components/ContinueButton";

export default function ChooseNewDates() {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const [numberOfMonths, setNumberOfMonths] = useState(1);

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
        <div className="flex justify-center">
          <DayPicker
            timeZone="UTC"
            numberOfMonths={numberOfMonths}
            mode="multiple"
            selected={selectedDates}
            onSelect={setSelectedDates}
            classNames={{
              root: "react-day-picker shadow-lg",
              today: "text-base-content bg-base-100",
            }}
          />
        </div>
        <div className="card-actions justify-end mt-6">{selectedDates && <ContinueButton availableDates={selectedDates} />}</div>
      </div>
    </div>
  );
}
