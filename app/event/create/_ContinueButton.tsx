import { ActionResponse, createEvent } from "@/lib/actions";
import { useActionState, useRef } from "react";

export default function ContinueButton({ availableDates }: { availableDates: Date[] }) {
  const initialState: ActionResponse = {
    success: false,
    message: "",
  };
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(async (state: ActionResponse | null, formData: FormData) => {
    const result = await createEvent(state, formData, availableDates);
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
          <h3 className="font-bold text-lg mb-4">Create Event</h3>
          <form action={formAction} ref={formRef}>
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
            <fieldset className="fieldset p-4 w-full">
              <label className="floating-label fieldset-label">
                <span>Your Name *</span>
                <input
                  type="text"
                  placeholder="Your name"
                  className="input input-lg"
                  name="name"
                  minLength={2}
                  maxLength={100}
                  required
                />
                {/* <div className="validator-hint">Enter event title</div> */}
              </label>
            </fieldset>
            <div className="modal-action">
              <button className="btn btn-primary" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
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
