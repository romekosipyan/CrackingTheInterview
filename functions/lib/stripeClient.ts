import Stripe from 'stripe'
import {
  SUBSCRIPTION_PLANS,
  type PaidPlanId
} from '../../shared/subscriptionPlans'
import type { Env } from './env'

export function stripeClient(env: Env): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured.')
  }
  return new Stripe(env.STRIPE_SECRET_KEY)
}

export function priceIdForPlan(env: Env, planId: PaidPlanId): string {
  const plan = SUBSCRIPTION_PLANS.find((item) => item.id === planId)
  const envKey = plan?.stripePriceEnv
  if (!envKey) {
    throw new Error(`Missing Stripe price mapping for plan "${planId}".`)
  }
  const priceId = env[envKey as keyof Env]
  if (!priceId || typeof priceId !== 'string') {
    throw new Error(`${envKey} is not set. Create the price in Stripe and add it to Cloudflare env.`)
  }
  return priceId
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
