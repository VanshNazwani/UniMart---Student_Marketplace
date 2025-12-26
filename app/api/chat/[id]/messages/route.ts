import { NextResponse } from 'next/server'
import prisma from '../../../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../src/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const chatId = params.id
  const messages = await prisma.message.findMany({ where: { chatId }, orderBy: { createdAt: 'asc' } })
  return NextResponse.json(messages)
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const chatId = params.id
  const body = await request.json()
  const userId = (session.user as any).id
  const m = await prisma.message.create({ data: { chatId, senderId: userId, body: body.body } })
  return NextResponse.json(m)
}
