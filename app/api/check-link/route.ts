import { NextRequest, NextResponse } from 'next/server'
import { redis, type LinkData } from '@/lib/redis'

const DEV_MODE = process.env.DEV_MODE === 'true'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    // In dev mode, return mock data
    if (DEV_MODE) {
      return NextResponse.json({
        email: 'dev@example.com',
        status: 'pending',
        createdAt: Date.now(),
      })
    }

    const data = await redis.get<LinkData>(`link:${id}`)

    if (!data) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error checking link:', error)
    return NextResponse.json(
      { error: 'Failed to check link' },
      { status: 500 }
    )
  }
}

