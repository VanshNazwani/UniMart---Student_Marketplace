import { NextResponse } from 'next/server'
import prisma from '../../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../src/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const notes = await prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(notes)
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await prisma.notification.update({ where: { id }, data: { read: true } })
  return NextResponse.json({ ok: true })
}
