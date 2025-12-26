import { NextResponse } from 'next/server'
import prisma from '../../../src/lib/prisma'
import { z } from 'zod'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../src/lib/auth'

const QuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  min: z.string().optional(),
  max: z.string().optional(),
  condition: z.string().optional(),
  sort: z.string().optional()
})

export async function GET(request: Request) {
  const url = new URL(request.url)
  const params = Object.fromEntries(url.searchParams.entries())
  const q = QuerySchema.parse(params)

  const where: any = {}
  if (q.q) where.title = { contains: q.q, mode: 'insensitive' }
  if (q.category) where.category = q.category
  if (q.condition) where.condition = q.condition
  if (q.min || q.max) where.price = {}
  if (q.min) where.price.gte = Number(q.min)
  if (q.max) where.price.lte = Number(q.max)
  where.status = 'APPROVED'

  const orderBy: any = { createdAt: 'desc' }
  if (q.sort === 'low') orderBy.price = 'asc'
  if (q.sort === 'high') orderBy.price = 'desc'

  const products = await prisma.product.findMany({ where, orderBy })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const schema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    category: z.string(),
    condition: z.string(),
    images: z.array(z.string()).min(1)
  })

  const data = schema.parse(body)
  const product = await prisma.product.create({
    data: {
      ...data,
      sellerId: (session.user as any).id,
      status: 'PENDING'
    }
  })
  return NextResponse.json(product)
}
