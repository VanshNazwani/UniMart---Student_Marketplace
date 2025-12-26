import { NextResponse } from 'next/server'
import prisma from '../../../../src/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const Body = z.object({ token: z.string(), password: z.string().min(6) })

export async function POST(request: Request) {
  const body = await request.json()
  const { token, password } = Body.parse(body)
  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record || record.type !== 'reset') return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  if (record.expiresAt < new Date()) return NextResponse.json({ error: 'Token expired' }, { status: 400 })

  const hashed = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id: record.userId }, data: { password: hashed } })
  await prisma.verificationToken.deleteMany({ where: { userId: record.userId, type: 'reset' } })

  return NextResponse.json({ ok: true })
}
