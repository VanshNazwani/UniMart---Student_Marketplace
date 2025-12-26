import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '../../../../src/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-08-16' })

export async function POST(request: Request) {
  const buf = await request.arrayBuffer()
  const rawBody = Buffer.from(buf)
  const sig = request.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature mismatch' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const productId = session.metadata?.productId as string
    const buyerId = session.metadata?.buyerId as string
    const amount = (session.amount_total || 0) / 100
    const txId = session.payment_intent as string

    await prisma.order.create({ data: { buyerId, productId, amount, paymentStatus: 'PAID', transactionId: txId } })
    await prisma.product.update({ where: { id: productId }, data: { status: 'SOLD' } })
    try {
      await prisma.notification.create({ data: { userId: buyerId, title: 'Purchase complete', body: `You purchased ${productId}`, meta: { productId }, read: false } })
    } catch (e) { console.warn('Notification create failed', e) }
  }

  return NextResponse.json({ received: true })
}
