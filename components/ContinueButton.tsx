'use client'

import { ActionResponseCreate, addDates, createEvent } from '@/lib/actions'
import { useActionState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function ContinueButton({
  availableDates,
  preferredDates,
  eventId,
}: {
  availableDates: Date[]
  preferredDates: Date[]
  eventId?: string
}) {
  const initialState: ActionResponseCreate = {
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
    async (state: ActionResponseCreate | null, formData: FormData) => {
      const result = await doAction(formData)
      return result || state
    },
    initialState,
  )

  useEffect(() => {
    if (state?.userId) {
      router.push(`/event/results/${state.userId}`)
    }
  }, [state, router])

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
              <fieldset className='fieldset w-full gap-4 p-4'>
                <legend className='fieldset-legend'>Event</legend>
                <label className='floating-label fieldset-label'>
                  <span>Title *</span>
                  <input
                    type='text'
                    placeholder='Title *'
                    className='input input-lg validator'
                    name='title'
                    minLength={2}
                    maxLength={100}
                    autoFocus
                    required
                  />
                  {/* <div className='validator-hint'>Enter event title</div> */}
                </label>
                <label className='floating-label fieldset-label'>
                  <span>Description (optional)</span>
                  <input
                    type='text'
                    placeholder='Description (optional)'
                    className='input input-lg'
                    name='description'
                  />
                </label>
                <label className='fieldset-label'>
                  <input
                    type='checkbox'
                    className='checkbox checkbox-primary'
                    defaultChecked
                    name='allowOthersToViewResults'
                  />
                  Allow others to view results
                </label>
              </fieldset>
            )}
            <fieldset className='fieldset w-full gap-4 p-4'>
              <legend className='fieldset-legend'>Your info</legend>
              <label className='floating-label fieldset-label'>
                <span>Name *</span>
                <input
                  type='text'
                  placeholder='Your name *'
                  className='input input-lg validator'
                  name='name'
                  autoFocus={!eventId}
                  minLength={2}
                  maxLength={100}
                  required
                />
                {/* <div className='validator-hint'>Enter event title</div> */}
              </label>
              <label className='floating-label fieldset-label'>
                <span>Email (optional)</span>
                <input
                  type='email'
                  placeholder='Email (optional)'
                  className='input input-lg validator'
                  name='email'
                  minLength={2}
                  maxLength={100}
                />
                {/* <div className='validator-hint'>Enter event title</div> */}
              </label>
            </fieldset>
            <div className='modal-action'>
              <button className='btn btn-primary' disabled={isPending}>
                {isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                type='button'
                className='btn btn-ghost'
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
