import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { redis, type LinkData } from '@/lib/redis'

const DEV_MODE = process.env.DEV_MODE === 'true'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // In dev mode, skip email validation
    if (!DEV_MODE) {
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return NextResponse.json(
          { error: 'Valid email is required' },
          { status: 400 }
        )
      }
    }

    const id = nanoid()
    const linkData: LinkData = {
      email: DEV_MODE ? 'dev@example.com' : email,
      status: 'pending',
      createdAt: Date.now(),
      name: typeof name === 'string' && name.trim().length > 0 ? name.trim() : undefined,
    }

    // In dev mode, skip Redis storage
    if (!DEV_MODE) {
      // Store in Redis with 7 day expiration (in seconds)
      await redis.set(`link:${id}`, linkData, { ex: 7 * 24 * 60 * 60 })
    } else {
      console.log('🔧 DEV MODE: Skipping Redis storage')
      console.log('🔧 Link would be:', { id, linkData })
    }

    // Derive base URL from the incoming request (works locally and on Vercel)
    const url = `${request.nextUrl.origin}/ask/${id}`

    return NextResponse.json({ url, id, devMode: DEV_MODE })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json(
      { error: 'Failed to create link' },
      { status: 500 }
    )
  }
}

