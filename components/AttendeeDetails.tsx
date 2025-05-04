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
    <fieldset className='fieldset w-full max-w-sm gap-3 p-4'>
      <legend className='fieldset-legend'>Your info</legend>
      <label className='floating-label'>
        <span>Name</span>
        <input
          type='text'
          placeholder='Name'
          className='input validator w-full'
          name='name'
          value={formData.attendeeName}
          onChange={e => handleFormDataChange({ attendeeName: e.target.value })}
          autoFocus
          minLength={2}
          maxLength={100}
          required
        />
        {/* <div className='validator-hint'>Enter event title</div> */}
      </label>
      <div className='flex items-center gap-2'>
        <label className='floating-label grow'>
          <span>Email (optional)</span>
          <input
            type='email'
            placeholder='Email (optional)'
            className='input validator w-full'
            name='email'
            value={formData.attendeeEmail}
            onChange={e => handleFormDataChange({ attendeeEmail: e.target.value })}
            minLength={2}
            maxLength={100}
          />
        </label>
        {/* <div
          className='tooltip tooltip-left'
          data-tip='Enter your email to receive a link to the event results, and to be notified when others have voted'
        >
          <InfoIcon className='h-4 w-4' />
        </div> */}
      </div>
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
  )
}
