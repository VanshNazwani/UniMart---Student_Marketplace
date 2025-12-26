import { NextResponse } from 'next/server'
import prisma from '../../../../src/lib/prisma'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { sendEmail } from '../../../../src/lib/mailer'

const Body = z.object({ email: z.string().email() })

export async function POST(request: Request) {
  const body = await request.json()
  const { email } = Body.parse(body)
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ ok: true }) // don't reveal

  const token = nanoid(48)
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1h
  await prisma.verificationToken.create({ data: { token, userId: user.id, type: 'reset', expiresAt: expires } })

  const url = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  await sendEmail(user.email, 'UniMart password reset', `Reset your password: ${url}`)
  return NextResponse.json({ ok: true })
}
