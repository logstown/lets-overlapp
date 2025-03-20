export default function DaysLegend({ includeUnavailable }: { includeUnavailable?: boolean }) {
  return (
    <div className="flex flex-col gap-4 justify-center mt-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-primary"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-success"></div>
        <span>Preferred</span>
      </div>
      {includeUnavailable && (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-error/70"></div>
          <span>Unavailable</span>
        </div>
      )}
    </div>
  );
}
