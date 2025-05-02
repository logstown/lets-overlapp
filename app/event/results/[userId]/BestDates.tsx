import { format } from 'date-fns'

export default function BestDates({ dates }: { dates: Date[] }) {
  return (
    <div className='lg:text-xl'>
      {dates.length === 0 ? (
        <p>No Dates work</p>
      ) : (
        <div className='flex flex-col gap-2 text-center'>
          {dates.length === 1 ? (
            <p>Based on the responses, the best date is</p>
          ) : (
            <p>Based on the responses, the best dates are</p>
          )}
          <div className='text-3xl font-bold md:text-4xl'>
            {dates.map((x, i) => {
              let str = format(x, 'MMMM d')
              if (i < dates.length - 2) {
                str += ', '
              } else if (i < dates.length - 1) {
                str += ' or '
              }
              return str
            })}
          </div>
        </div>
      )}
    </div>
  )
}
