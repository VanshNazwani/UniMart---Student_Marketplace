import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '../../../src/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../src/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' })

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId } = await request.json()
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.status !== 'APPROVED') return NextResponse.json({ error: 'Invalid product' }, { status: 400 })

  const sessionStripe = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{ price_data: { currency: 'usd', product_data: { name: product.title }, unit_amount: Math.round(product.price * 100) }, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/products/${product.id}`,
    metadata: { productId: product.id, buyerId: (session.user as any).id }
  })

  // Create a notification for the seller
  try {
    await prisma.notification.create({ data: { userId: product.sellerId, title: 'Item purchased', body: `Your item ${product.title} was purchased`, meta: { productId: product.id }, read: false } })
  } catch (e) { console.warn('Notification error', e) }

  return NextResponse.json({ url: sessionStripe.url })
}
