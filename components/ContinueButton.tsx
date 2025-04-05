'use client'

import { ActionResponse, addDates, createEvent, editUser } from '@/lib/actions'
import { useActionState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { InfoIcon } from 'lucide-react'
import { User } from '@prisma/client'

export default function ContinueButton({
  availableDates,
  preferredDates,
  eventId,
  user,
}: {
  availableDates: Date[]
  preferredDates: Date[]
  eventId?: string
  user?: User
}) {
  const initialState: ActionResponse = {
    userId: user?.id ?? '',
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

    if (eventId) {
      return addDates(formData, preferredDateStrs, availableDateStrs, eventId)
    } else if (user) {
      return editUser(formData, preferredDateStrs, availableDateStrs, user.id)
    } else {
      return createEvent(formData, preferredDateStrs, availableDateStrs)
    }
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

  const saveText = eventId || user ? 'Save' : 'Create Event'
  const savingText = eventId || user ? 'Saving...' : 'Creating...'
  let title = ''

  if (eventId) {
    title = 'Last Step'
  } else if (!user) {
    title = 'Just a few more details...'
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
          <h3 className='mb-4 text-lg font-bold'>{title}</h3>
          <form action={formAction} ref={formRef}>
            {!eventId && !user && (
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
                  defaultValue={user?.name ?? ''}
                  autoFocus={!eventId && !user}
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
                  defaultValue={user?.email ?? ''}
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
                {isPending ? savingText : saveText}
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
