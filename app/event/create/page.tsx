import EventStepper from '../../../components/EventStepper'

export default function CreateEvent() {
  return (
    <div className='flex flex-col gap-6'>
      <h1 className='text-base-content/50 text-2xl font-medium uppercase'>
        Create Event
      </h1>
      <EventStepper />
    </div>
  )
}
