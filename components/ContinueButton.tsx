"use client";

import { ActionResponseCreate, addDates, createEvent } from "@/lib/actions";
import { toZonedTime } from "date-fns-tz";
import { useActionState, useRef } from "react";

export default function ContinueButton({ availableDates, eventId }: { availableDates: Date[]; eventId?: string }) {
  const initialState: ActionResponseCreate = {
    success: false,
    message: "",
  };
  const formRef = useRef<HTMLFormElement>(null);

  const doAction = async (formData: FormData) => {
    const stringDates = availableDates.map((date) => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    return eventId ? addDates(formData, stringDates, eventId) : createEvent(formData, stringDates);
  };

  const [state, formAction, isPending] = useActionState(async (state: ActionResponseCreate | null, formData: FormData) => {
    const result = await doAction(formData);
    if (result) {
      return result;
    }
    return state;
  }, initialState);

  const cancel = () => {
    document.getElementById("my_modal_1")?.close();
    setTimeout(() => formRef.current?.reset(), 100);
  };

  if (state?.success) {
    return <div className="alert alert-success">{state.message}</div>;
  }

  return (
    <>
      <button className="btn btn-primary" onClick={() => document.getElementById("my_modal_1").showModal()}>
        Continue
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{eventId ? "Last Step" : "Create Event"}</h3>
          <form action={formAction} ref={formRef}>
            {!eventId && (
              <fieldset className="fieldset p-4 w-full gap-6">
                {/* <legend className="fieldset-legend">Event</legend> */}
                <label className="floating-label fieldset-label">
                  <span>Title *</span>
                  <input
                    type="text"
                    placeholder="Title"
                    className="input input-lg input-validator"
                    name="title"
                    minLength={2}
                    maxLength={100}
                    autoFocus
                    required
                  />
                  {/* <div className="validator-hint">Enter event title</div> */}
                </label>
                <label className="floating-label fieldset-label">
                  <span>Description (optional)</span>
                  <input type="text" placeholder="Description (optional)" className="input input-lg" name="description" />
                </label>
                <label className="fieldset-label">
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked name="allowOthersToViewResults" />
                  Allow others to view results
                </label>
                <label className="fieldset-label">
                  <input type="checkbox" className="checkbox checkbox-primary" name="allowOthersToPropose" />
                  Allow others to propose dates
                </label>
              </fieldset>
            )}
            <fieldset className="fieldset p-4 w-full">
              <label className="floating-label fieldset-label">
                <span>Your Name *</span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input input-lg"
                  name="name"
                  autoFocus={!eventId}
                  minLength={2}
                  maxLength={100}
                  required
                />
                {/* <div className="validator-hint">Enter event title</div> */}
              </label>
            </fieldset>
            <div className="modal-action">
              <button className="btn btn-primary" disabled={isPending}>
                {isPending ? "Saving..." : "Save"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => cancel()}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
