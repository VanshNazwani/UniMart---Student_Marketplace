import { NextResponse } from 'next/server'
import prisma from '../../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../src/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id
  const items = await prisma.wishlist.findMany({ where: { userId }, include: { product: true } })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId } = await request.json()
  const userId = (session.user as any).id
  const exists = await prisma.wishlist.findFirst({ where: { userId, productId } })
  if (exists) return NextResponse.json({ ok: true })
  const w = await prisma.wishlist.create({ data: { userId, productId } })
  return NextResponse.json(w)
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId } = await request.json()
  const userId = (session.user as any).id
  await prisma.wishlist.deleteMany({ where: { userId, productId } })
  return NextResponse.json({ ok: true })
}
