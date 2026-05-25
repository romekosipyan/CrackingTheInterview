import type Stripe from 'stripe'
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId
} from '../../shared/subscriptionPlans.js'
import { consolidateSubscriptionItems } from '../../shared/subscriptionLookup.js'

export type SubscriptionItem = {
  kind: 'subscription' | 'lifetime'
  planId: SubscriptionPlanId
  planName: string
  status: string
  subscriptionId?: string
  currentPeriodEnd?: number
  cancelAtPeriodEnd?: boolean
}

export type SubscriptionLookupResult = {
  email: string
  items: SubscriptionItem[]
}

function priceIdToPlanId(priceId: string | undefined): SubscriptionPlanId | undefined {
  if (!priceId) return undefined
  if (priceId === process.env.STRIPE_PRICE_WEEKLY) return 'weekly'
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return 'monthly'
  if (priceId === process.env.STRIPE_PRICE_LIFETIME) return 'lifetime'
  return undefined
}

function planName(planId: SubscriptionPlanId): string {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId)?.name ?? planId
}

export async function lookupSubscriptionsByEmail(
  stripe: Stripe,
  email: string
): Promise<SubscriptionLookupResult> {
  const normalized = email.trim().toLowerCase()
  const customers = await stripe.customers.list({ email: normalized, limit: 20 })
  const items: SubscriptionItem[] = []
  let hasLifetime = false

  for (const customer of customers.data) {
    for (const status of ['active', 'trialing', 'past_due'] as const) {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        status,
        limit: 20
      })

      for (const subscription of subscriptions.data) {
        const planId = priceIdToPlanId(subscription.items.data[0]?.price.id)
        if (planId !== 'weekly' && planId !== 'monthly') continue

        items.push({
          kind: 'subscription',
          planId,
          planName: planName(planId),
          status: subscription.status,
          subscriptionId: subscription.id,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        })
      }
    }

    const sessions = await stripe.checkout.sessions.list({
      customer: customer.id,
      limit: 100
    })

    for (const session of sessions.data) {
      if (session.payment_status !== 'paid') continue
      if (session.metadata?.planId === 'lifetime') {
        hasLifetime = true
        break
      }
    }
  }

  if (hasLifetime) {
    items.push({
      kind: 'lifetime',
      planId: 'lifetime',
      planName: planName('lifetime'),
      status: 'active'
    })
  }

  return { email: normalized, items: consolidateSubscriptionItems(items) }
}

export async function cancelSubscription(
  stripe: Stripe,
  email: string,
  subscriptionId: string
): Promise<{ ok: true; cancelAtPeriodEnd: boolean; currentPeriodEnd: number }> {
  const normalized = email.trim().toLowerCase()
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const customerId =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id
  const customer = await stripe.customers.retrieve(customerId)
  if (customer.deleted) {
    throw new Error('Customer not found.')
  }
  if ((customer.email ?? '').toLowerCase() !== normalized) {
    throw new Error('Subscription does not belong to this email.')
  }

  const updated = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  })

  return {
    ok: true,
    cancelAtPeriodEnd: updated.cancel_at_period_end,
    currentPeriodEnd: updated.current_period_end
  }
}
