export type SubscriptionPlanId = 'free' | 'weekly' | 'monthly' | 'lifetime'

export type SubscriptionPlan = {
  id: SubscriptionPlanId
  name: string
  priceUsd: number
  intervalLabel: string
  billingNote: string
  highlight?: boolean
  stripePriceEnv?: string
  features: string[]
}

/** ShadeCoder-equivalent plans, $15 cheaper on paid tiers. */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceUsd: 0,
    intervalLabel: '/ month',
    billingNote: '0 credits / month',
    features: [
      'Best-in-class coding models',
      'Standard support',
      'Try the desktop overlay'
    ]
  },
  {
    id: 'weekly',
    name: 'Pro Weekly',
    priceUsd: 24,
    intervalLabel: '/ week',
    billingNote: 'Billed weekly',
    stripePriceEnv: 'STRIPE_PRICE_WEEKLY',
    features: [
      'All Kraken Interview features',
      'Unlimited credits',
      'Priority support',
      'JD + resume context',
      'System design diagrams'
    ]
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    priceUsd: 54,
    intervalLabel: '/ month',
    billingNote: 'Billed monthly',
    highlight: true,
    stripePriceEnv: 'STRIPE_PRICE_MONTHLY',
    features: [
      'All Kraken Interview features',
      'Unlimited credits',
      'Priority support',
      'JD + resume context',
      'System design diagrams'
    ]
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    priceUsd: 684,
    intervalLabel: '',
    billingNote: 'One-time payment · unlimited forever',
    stripePriceEnv: 'STRIPE_PRICE_LIFETIME',
    features: [
      'Everything in Pro',
      'Unlimited lifetime credits',
      'Priority feature requests',
      '24/7 priority support'
    ]
  }
]

export const PAID_PLAN_IDS = ['weekly', 'monthly', 'lifetime'] as const satisfies SubscriptionPlanId[]

export type PaidPlanId = (typeof PAID_PLAN_IDS)[number]

export function getPlan(id: SubscriptionPlanId): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id)
}
