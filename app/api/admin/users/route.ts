import { NextResponse } from 'next/server'
import prisma from '../../../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../src/lib/auth'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, verified: true, suspended: true, createdAt: true } })
  return NextResponse.json(users)
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session || (session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await request.json()
  const { id, action } = body
  if (!id || !action) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  if (action === 'suspend') await prisma.user.update({ where: { id }, data: { suspended: true } })
  if (action === 'unsuspend') await prisma.user.update({ where: { id }, data: { suspended: false } })
  if (action === 'delete') await prisma.user.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
