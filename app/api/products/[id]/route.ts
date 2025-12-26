import { NextResponse } from 'next/server'
import prisma from '../../../../src/lib/prisma'
import { z } from 'zod'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../../src/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const id = params.id
  const userId = (session.user as any).id

  // Simple admin approve/reject flow or owner edit
  if (body.action === 'approve' || body.action === 'reject') {
    if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const status = body.action === 'approve' ? 'APPROVED' : 'REJECTED'
    const p = await prisma.product.update({ where: { id }, data: { status } })
    return NextResponse.json(p)
  }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (product.sellerId !== userId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const schema = z.object({ title: z.string().optional(), description: z.string().optional(), price: z.number().optional(), images: z.array(z.string()).optional(), status: z.string().optional() })
  const data = schema.parse(body)
  const updated = await prisma.product.update({ where: { id }, data })
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = params.id
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if ((session.user as any).role !== 'ADMIN' && product.sellerId !== (session.user as any).id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
