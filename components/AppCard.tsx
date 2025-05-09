export default function AppCard({
  children,
  className,
  bodyClassName,
}: {
  children: React.ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <div className={`card bg-base-100 p-0 shadow-xl sm:p-3 ${className || ''}`}>
      <div className={`card-body ${bodyClassName || ''}`}>{children}</div>
    </div>
  )
}
