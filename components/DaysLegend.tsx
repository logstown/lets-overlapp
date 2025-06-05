export default function DaysLegend({
  includeUnavailable,
}: {
  includeUnavailable?: boolean
}) {
  return (
    <div className='bg-base-100 flex justify-center gap-2 rounded-2xl px-4 py-2 text-xs shadow-md sm:gap-4 sm:text-sm md:gap-8'>
      {includeUnavailable ? (
        <div className='flex items-center gap-2'>
          <div className='bg-base-300 h-4 w-4'></div>
          <span>Unavailable</span>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <div className='text-primary text-lg font-bold'>#</div>
          <span>Offered</span>
        </div>
      )}
      <div className='flex items-center gap-2'>
        <div className='bg-success/50 h-4 w-4'></div>
        <span>Available</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='bg-success h-4 w-4'></div>
        <span>Preferred</span>
      </div>
    </div>
  )
}
