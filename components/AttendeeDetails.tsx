'use client'

import { InfoIcon } from 'lucide-react'
import { FormDetails } from './EventStepper'

export default function AttendeeDetails({
  formData,
  handleFormDataChange,
}: {
  formData: FormDetails
  handleFormDataChange: (formData: Partial<FormDetails>) => void
}) {
  return (
    <div className='flex w-full max-w-sm flex-col gap-4 px-4 md:px-0'>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend text-base-content/60 text-base font-medium'>
          Name
        </legend>
        <input
          type='text'
          className='input validator input-lg w-full'
          name='name'
          value={formData.attendeeName}
          onChange={e => handleFormDataChange({ attendeeName: e.target.value })}
          autoFocus
          minLength={2}
          maxLength={100}
          required
        />
      </fieldset>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend text-base-content/60 text-base font-medium'>
          Email (optional)
          <div
            className='tooltip tooltip-top'
            data-tip='Enter your email to receive a link to the event results, and to be notified when others have voted'
          >
            <InfoIcon className='h-4 w-4' />
          </div>
        </legend>
        <input
          type='email'
          className='input validator input-lg w-full'
          name='email'
          value={formData.attendeeEmail}
          onChange={e => handleFormDataChange({ attendeeEmail: e.target.value })}
          minLength={2}
          maxLength={100}
        />
        {/* <div role='alert' className='alert alert-soft alert-info text-xs'>
                <InfoIcon
                  className='h-4 w-4'
                  onClick={() => setShowInfo(!showInfo)}
                />
                {showInfo && (
                  <span>
                    Enter your email to receive a link to the event results, and to
                    be notified when others have voted
                  </span>
                )}
              </div> */}
      </fieldset>
    </div>
  )
}
