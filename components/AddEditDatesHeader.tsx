import { formatDistance } from 'date-fns'

export default function AddEditDatesHeader({
  title,
  createdBy,
  createdAt,
}: {
  title: string
  createdAt: Date
  createdBy: string
}) {
  return (
    <div className='flex flex-col gap-1'>
      <h1 className='text-base-content/50 text-2xl font-medium uppercase'>
        {title}
      </h1>
      <h5 className='text-base-content/70 text-xs'>
        created by <span className='font-bold italic'>{createdBy}</span>{' '}
        {formatDistance(createdAt, new Date(), {
          addSuffix: true,
        })}
      </h5>
    </div>
  )
}
