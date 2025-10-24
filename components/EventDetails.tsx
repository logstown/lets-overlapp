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
    <div className='flex flex-col items-start gap-4 md:w-full md:flex-row md:justify-evenly'>
      <div className='flex w-full max-w-sm flex-col gap-4'>
        <fieldset className='fieldset'>
          <legend className='fieldset-legend text-base-content/60 text-base font-medium'>
            Title
          </legend>
          <input
            type='text'
            className='input validator input-lg w-full'
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
        <fieldset className='fieldset'>
          <legend className='fieldset-legend text-base-content/60 text-base font-medium'>
            Description (optional)
          </legend>
          <textarea
            rows={5}
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
        <legend className='fieldset-legend text-base-content/60 text-base font-medium'>
          Icon
        </legend>
        <div className='grid grid-cols-3 gap-2'>
          {eventIcons.map((icon: { event: string; fileName: string }) => (
            <button
              key={icon.fileName}
              className={`cursor-pointer rounded-md border-8 border-transparent hover:border-neutral-300 ${
                formData.icon === icon.fileName ? '!border-primary' : ''
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
