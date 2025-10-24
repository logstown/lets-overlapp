import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Event Scheduling'
  const creator = searchParams.get('creator') || 'Organizer'
  const icon = searchParams.get('icon') || 'calendar'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_APP_URL || 'https://letsoverl.app'}/event-icons/${icon}.png`}
          alt={title}
          style={{ width: '200px', height: '200px', borderRadius: '20px' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <h1 style={{ fontSize: '4rem', fontWeight: 'bold', margin: 0 }}>
            {title}
          </h1>
          <h5
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.7rem',
              fontSize: '2rem',
              color: '#71717a',
              margin: 0,
            }}
          >
            <div>Created by</div>
            <div
              style={{
                fontWeight: 'bold',
                // textTransform: 'uppercase',
                color: 'black',
              }}
            >
              {creator}
            </div>
          </h5>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
