import { NextResponse } from 'next/server'
import prisma from '../../../../src/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { sendEmail } from '../../../../src/lib/mailer'

const Body = z.object({ name: z.string().optional(), email: z.string().email(), password: z.string().min(6) })

export async function POST(request: Request) {
  const body = await request.json()
  const data = Body.parse(body)

  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 400 })

  // University email enforcement
  const allowed = process.env.ALLOWED_EMAIL_DOMAIN || '.edu'
  if (allowed === '.edu' && !data.email.endsWith('.edu')) return NextResponse.json({ error: 'University email required' }, { status: 400 })
  if (allowed !== '.edu' && !data.email.endsWith(allowed)) return NextResponse.json({ error: 'University email required' }, { status: 400 })

  const hashed = await bcrypt.hash(data.password, 10)
  const user = await prisma.user.create({ data: { name: data.name, email: data.email, password: hashed } })

  const token = nanoid(48)
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
  await prisma.verificationToken.create({ data: { token, userId: user.id, type: 'verify', expiresAt: expires } })

  const url = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`
  await sendEmail(user.email, 'Verify your UniMart account', `Click to verify: ${url}`)

  return NextResponse.json({ ok: true })
}
