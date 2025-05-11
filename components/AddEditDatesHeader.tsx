import { formatDistance } from 'date-fns'

export default function AddEditDatesHeader({
  title,
  createdBy,
  createdAt,
  icon,
}: {
  title: string
  createdAt: Date
  createdBy: string
  icon: string
}) {
  return (
    <div className='flex items-center justify-center gap-4'>
      <img
        src={`/event-icons/${icon}.png`}
        alt={title}
        className='h-20 w-20 rounded-2xl'
      />
      <div className='flex flex-col gap-1'>
        <h1 className='text-base-content/60 text-2xl font-medium uppercase'>
          {title}
        </h1>
        <h5 className='text-base-content/70 text-xs'>
          created by <span className='font-bold italic'>{createdBy}</span>{' '}
          {formatDistance(createdAt, new Date(), {
            addSuffix: true,
          })}
        </h5>
      </div>
    </div>
  )
}
