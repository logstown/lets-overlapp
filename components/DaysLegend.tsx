export default function DaysLegend({ includeUnavailable }: { includeUnavailable?: boolean }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-4 justify-center mt-4 text-xs sm:text-sm">
      {includeUnavailable && (
        <div className="flex items-center gap-2">
          <div className="sm:w-6 sm:h-6 w-4 h-4 bg-base-300"></div>
          <span>Unavailable</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className="sm:w-6 sm:h-6 w-4 h-4 bg-success/50"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="sm:w-6 sm:h-6 w-4 h-4 bg-success"></div>
        <span>Preferred</span>
      </div>
    </div>
  );
}
