'use client'

import { FormDetails } from './EventStepper'

export default function EventDetails({
  formData,
  handleFormDataChange,
}: {
  formData: FormDetails
  handleFormDataChange: (formData: Partial<FormDetails>) => void
}) {
  return (
    <fieldset className='fieldset w-full max-w-sm gap-3 p-4'>
      {/* <legend className='fieldset-legend'>Event</legend> */}
      <label className='floating-label'>
        <span>Event Title</span>
        <input
          type='text'
          placeholder='Event Title'
          className='input validator input-xl w-full'
          name='eventName'
          value={formData.eventName}
          onChange={e => handleFormDataChange({ eventName: e.target.value })}
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
          value={formData.description}
          onChange={e => handleFormDataChange({ description: e.target.value })}
        />
      </label>
      {/* <label className='fieldset-label mt-2'>
        <input
          type='checkbox'
          className='checkbox checkbox-sm'
          defaultChecked
          name='allowOthersToViewResults'
        />
        Allow others to view results
      </label> */}
    </fieldset>
  )
}
