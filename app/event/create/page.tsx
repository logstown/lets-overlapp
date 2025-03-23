import ChooseUserDates from '../../../components/ChooseUserDates'

export default function CreateEvent() {
  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-base-content/50 text-4xl font-light uppercase'>
        Create Event
      </h1>
      <ChooseUserDates />
    </div>
  )
}
