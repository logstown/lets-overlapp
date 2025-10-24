import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Event Scheduling'
  const creator = searchParams.get('creator') || 'Organizer'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          fontSize: '48px',
          fontWeight: 'bold',
        }}
      >
        {title} - {creator}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
