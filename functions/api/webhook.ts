import type Stripe from 'stripe'
import type { Env } from '../lib/env'
import { stripeClient } from '../lib/stripeClient'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Stripe webhook is not configured.', { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing Stripe signature.', { status: 400 })
  }

  const body = await request.text()
  const stripe = stripeClient(env)

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid webhook payload.'
    return new Response(message, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    console.info('[stripe] checkout completed', {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      planId: session.metadata?.planId
    })
  }

  return Response.json({ received: true })
}
