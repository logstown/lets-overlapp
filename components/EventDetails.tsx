'use client'

import { eventIcons } from '@/lib/utilities'
import { FormDetails } from './EventStepper'

export default function EventDetails({
  formData,
  handleFormDataChange,
}: {
  formData: FormDetails
  handleFormDataChange: (formData: Partial<FormDetails>) => void
}) {
  return (
    <div className='flex flex-col items-center gap-4 md:w-full md:flex-row md:items-start md:justify-evenly'>
      <div>
        <fieldset className='fieldset w-full max-w-sm'>
          <legend className='fieldset-legend text-lg'>Event Title</legend>
          <input
            type='text'
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
        </fieldset>
        <fieldset className='fieldset w-full max-w-sm'>
          <legend className='fieldset-legend'>Description</legend>
          <textarea
            rows={4}
            className='textarea w-full'
            name='description'
            value={formData.description}
            onChange={e => handleFormDataChange({ description: e.target.value })}
          />
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
      </div>
      <fieldset className='fieldset'>
        <legend className='fieldset-legend text-lg'>Icon</legend>
        <div className='grid grid-cols-3 gap-2'>
          {eventIcons.map((icon: { event: string; fileName: string }) => (
            <button
              key={icon.fileName}
              className={`cursor-pointer rounded-md border-4 border-neutral-100 hover:border-neutral-300 ${
                formData.icon === icon.fileName ? '!border-accent' : ''
              }`}
              onClick={() => handleFormDataChange({ icon: icon.fileName })}
            >
              <img
                src={`/event-icons/${icon.fileName}.png`}
                alt={icon.event}
                className='h-16 w-16 object-cover'
              />
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  )
}
