import type { Env } from '../lib/env'
import { websiteOrigin } from '../lib/env'
import { corsPreflight, json, withCors } from '../lib/responses'
import { priceIdForPlan, stripeClient } from '../lib/stripe'
import {
  PAID_PLAN_IDS,
  type PaidPlanId,
  type SubscriptionPlanId
} from '../../shared/subscriptionPlans'

export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return corsPreflight(request, env)
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = (await request.json()) as { planId?: SubscriptionPlanId; email?: string }
    const planId = body?.planId
    const email = typeof body?.email === 'string' ? body.email.trim() : undefined

    if (!planId || planId === 'free' || !PAID_PLAN_IDS.includes(planId as PaidPlanId)) {
      return withCors(request, env, json({ error: 'Invalid plan selected.' }, 400))
    }

    const stripe = stripeClient(env)
    const priceId = priceIdForPlan(env, planId as PaidPlanId)
    const isLifetime = planId === 'lifetime'
    const origin = websiteOrigin(env)

    const session = await stripe.checkout.sessions.create({
      mode: isLifetime ? 'payment' : 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=1`,
      customer_email: email || undefined,
      allow_promotion_codes: true,
      metadata: { planId }
    })

    return withCors(request, env, json({ url: session.url }))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Checkout failed.'
    return withCors(request, env, json({ error: message }, 500))
  }
}
