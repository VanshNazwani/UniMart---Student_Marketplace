import { NextResponse } from 'next/server'
import prisma from '../../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../src/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const chats = await prisma.chat.findMany({ where: { participants: { some: { id: userId } } }, include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } } })
  return NextResponse.json(chats)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const { participantId } = body
  const userId = (session.user as any).id
  const chat = await prisma.chat.create({ data: { participants: { connect: [{ id: userId }, { id: participantId }] } } })
  return NextResponse.json(chat)
}
