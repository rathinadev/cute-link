import { NextRequest, NextResponse } from 'next/server'
import { redis, type LinkData } from '@/lib/redis'
import { resend } from '@/lib/resend'

const DEV_MODE = process.env.DEV_MODE === 'true'

export async function POST(request: NextRequest) {
  try {
    const { id, answer } = await request.json()

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    if (answer !== 'yes' && answer !== 'no') {
      return NextResponse.json(
        { error: 'Answer must be "yes" or "no"' },
        { status: 400 }
      )
    }

    // In dev mode, skip Redis check and email sending
    if (DEV_MODE) {
      console.log('🔧 DEV MODE: Skipping Redis and email')
      console.log('🔧 Response would be:', { id, answer })
      return NextResponse.json({ success: true, devMode: true })
    }

    // Get current link data
    const linkData = await redis.get<LinkData>(`link:${id}`)

    if (!linkData) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    if (linkData.status !== 'pending') {
      return NextResponse.json(
        { error: 'Link already answered' },
        { status: 400 }
      )
    }

    // Update status
    const updatedData: LinkData = {
      ...linkData,
      status: answer,
    }

    await redis.set(`link:${id}`, updatedData, { ex: 7 * 24 * 60 * 60 })

    // Send email
    const subject = 'They responded 💌'
    const emailBody =
      answer === 'yes'
        ? `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #ec4899;">Great news! 🎉</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              They said <strong style="color: #10b981;">YES</strong>! 
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Time to plan that perfect date! 💕
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>This link will expire in 7 days.</p>
            </div>
          </div>`
        : `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6366f1;">They responded</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Unfortunately, they said <strong style="color: #ef4444;">NO</strong>.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Don't worry, there are plenty of fish in the sea! 🌊
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
              <p>This link will expire in 7 days.</p>
            </div>
          </div>`

    try {
      await resend.emails.send({
        from: 'Cute Date Link <onboarding@resend.dev>',
        to: linkData.email,
        subject,
        html: emailBody,
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error responding:', error)
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    )
  }
}

