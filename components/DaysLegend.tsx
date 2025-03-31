export default function DaysLegend({
  includeUnavailable,
}: {
  includeUnavailable?: boolean
}) {
  return (
    <div className='bg-base-100 mt-4 flex flex-col justify-center gap-2 rounded-2xl p-5 text-xs sm:gap-4 sm:text-sm md:flex-row md:gap-8'>
      {includeUnavailable && (
        <div className='flex items-center gap-2'>
          <div className='bg-base-300 h-4 w-4 sm:h-6 sm:w-6'></div>
          <span>Unavailable</span>
        </div>
      )}
      <div className='flex items-center gap-2'>
        <div className='bg-success/50 h-4 w-4 sm:h-6 sm:w-6'></div>
        <span>Available</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='bg-success h-4 w-4 sm:h-6 sm:w-6'></div>
        <span>Preferred</span>
      </div>
    </div>
  )
}
