import Link from 'next/link'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-8 text-center'>
      <h1 className='mb-4 text-5xl font-bold'>Let&apos;s Overlapp</h1>
      <p className='mb-8 max-w-2xl text-xl'>
        Finding the perfect time to meet with friends shouldn&apos;t be a hassle.
        Let&apos;s Overlapp helps you coordinate schedules effortlessly.
      </p>

      <div className='flex gap-4'>
        <Link href='/event/create' className='btn btn-primary'>
          Create Event
        </Link>
        <button className='btn btn-outline'>Join Event</button>
      </div>

      <div className='mt-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3'>
        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title'>Share Your Schedule</h2>
            <p>
              Input your available times with our easy-to-use calendar interface.
            </p>
          </div>
        </div>

        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title'>Find Overlap</h2>
            <p>We&apos;ll automatically find the times that work for everyone.</p>
          </div>
        </div>

        <div className='card bg-base-100 shadow-xl'>
          <div className='card-body'>
            <h2 className='card-title'>Schedule Together</h2>
            <p>
              Pick the perfect time and get your event on everyone&apos;s calendar.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
