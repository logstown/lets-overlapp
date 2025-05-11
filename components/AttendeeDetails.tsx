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
    <div className='flex flex-col gap-4'>
      <fieldset className='fieldset w-full max-w-sm'>
        <legend className='fieldset-legend text-base-content/60 text-lg font-medium'>
          Name
        </legend>
        <input
          type='text'
          className='input validator input-xl w-full'
          name='name'
          value={formData.attendeeName}
          onChange={e => handleFormDataChange({ attendeeName: e.target.value })}
          autoFocus
          minLength={2}
          maxLength={100}
          required
        />
      </fieldset>
      <fieldset className='fieldset w-full max-w-sm'>
        <legend className='fieldset-legend text-base-content/60 text-lg font-medium'>
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
          className='input validator input-xl w-full'
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
