'use client'

import { ActionResponse, addDates, createEvent } from '@/lib/actions'
import { useActionState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InfoIcon } from 'lucide-react'
export default function ContinueButton({
  availableDates,
  preferredDates,
  eventId,
}: {
  availableDates: Date[]
  preferredDates: Date[]
  eventId?: string
}) {
  const initialState: ActionResponse = {
    userId: '',
    message: '',
  }
  const formRef = useRef<HTMLFormElement>(null)
  const modal = useRef<HTMLDialogElement>(null)
  const router = useRouter()

  const doAction = async (formData: FormData) => {
    const availableDateStrs = availableDates.map(
      date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    )
    const preferredDateStrs = preferredDates.map(
      date => `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
    )
    return eventId
      ? addDates(formData, preferredDateStrs, availableDateStrs, eventId)
      : createEvent(formData, preferredDateStrs, availableDateStrs)
  }

  const [state, formAction, isPending] = useActionState(
    async (state: ActionResponse | null, formData: FormData) => {
      const result = await doAction(formData)

      if (result?.userId) {
        router.push(`/event/results/${result.userId}`)
      }

      return result || state
    },
    initialState,
  )

  const cancel = () => {
    modal.current?.close()
    setTimeout(() => formRef.current?.reset(), 100)
  }

  return (
    <>
      <button
        className='btn btn-primary btn-xl'
        onClick={() => modal.current?.showModal()}
      >
        Continue
      </button>
      <dialog ref={modal} className='modal'>
        <div className='modal-box'>
          <h3 className='mb-4 text-lg font-bold'>
            {eventId ? 'Last Step' : 'Just a few more details...'}
          </h3>
          <form action={formAction} ref={formRef}>
            {!eventId && (
              <fieldset className='fieldset gap-3 p-4'>
                <legend className='fieldset-legend'>Event</legend>
                <label className='floating-label'>
                  <span>Title</span>
                  <input
                    type='text'
                    placeholder='Title'
                    className='input validator w-full'
                    name='title'
                    minLength={2}
                    maxLength={100}
                    autoFocus
                    required
                  />
                  {/* <div className='validator-hint'>Enter event title</div> */}
                </label>
                <label className='floating-label'>
                  <span>Description (optional)</span>
                  <textarea
                    placeholder='Description (optional)'
                    className='textarea w-full'
                    name='description'
                  />
                </label>
                <label className='fieldset-label mt-2'>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-sm'
                    defaultChecked
                    name='allowOthersToViewResults'
                  />
                  Allow others to view results
                </label>
              </fieldset>
            )}
            <fieldset className='fieldset mt-6 w-full gap-3 p-4'>
              <legend className='fieldset-legend'>Your info</legend>
              <label className='floating-label'>
                <span>Name</span>
                <input
                  type='text'
                  placeholder='Name'
                  className='input validator w-full'
                  name='name'
                  autoFocus={!eventId}
                  minLength={2}
                  maxLength={100}
                  required
                />
                {/* <div className='validator-hint'>Enter event title</div> */}
              </label>
              <label className='floating-label'>
                <span>Email (optional)</span>
                <input
                  type='email'
                  placeholder='Email (optional)'
                  className='input validator w-full'
                  name='email'
                  minLength={2}
                  maxLength={100}
                />
              </label>
              {/* <p className='text-base-content/70'>
                Enter your email to receive a link to the event results, and to be
                notified when others have voted
              </p> */}
              <div role='alert' className='alert alert-soft alert-info text-xs'>
                <InfoIcon className='h-4 w-4' />
                <span>
                  Enter your email to receive a link to the event results, and to be
                  notified when others have voted
                </span>
              </div>
            </fieldset>
            <div className='modal-action'>
              <button className='btn btn-primary' disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Event'}
              </button>
              <button
                type='button'
                className='btn btn-ghost btn-soft'
                onClick={() => cancel()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}
