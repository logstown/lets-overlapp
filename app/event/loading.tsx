export default function Loading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='radial-progress animate-spin' role='progressbar'></div>
        <div className='text-lg'>Loading...</div>
      </div>
    </div>
  )
}
