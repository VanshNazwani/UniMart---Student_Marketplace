import { NextResponse } from 'next/server'
import prisma from '../../../../src/lib/prisma'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const token = url.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record) return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
  if (record.expiresAt < new Date()) return NextResponse.json({ error: 'Token expired' }, { status: 400 })

  await prisma.user.update({ where: { id: record.userId }, data: { verified: true } })
  await prisma.verificationToken.deleteMany({ where: { userId: record.userId, type: 'verify' } })

  return NextResponse.json({ ok: true })
}
