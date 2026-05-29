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
    intervalLabel: '',
    billingNote: 'One-time 30-minute trial per device',
    features: [
      'Coding interview overlay',
      'One-time 30-minute trial to experience the product',
      'Standard support',
      'Subscribe for unlimited access'
    ]
  },
  {
    id: 'weekly',
    name: 'Pro Weekly',
    priceUsd: 24,
    intervalLabel: '/ week',
    billingNote: 'Auto-renews weekly until you cancel',
    stripePriceEnv: 'STRIPE_PRICE_WEEKLY',
    features: [
      'Unlimited coding interviews',
      'Quick & deep AI answers',
      'Priority support',
      'Auto-renews weekly — cancel anytime'
    ]
  },
  {
    id: 'monthly',
    name: 'Pro Monthly',
    priceUsd: 54,
    intervalLabel: '/ month',
    billingNote: 'Auto-renews monthly until you cancel',
    highlight: true,
    stripePriceEnv: 'STRIPE_PRICE_MONTHLY',
    features: [
      'Everything in Pro Weekly',
      'General & no-code interviews',
      'JD + resume context',
      'System design diagrams',
      'Auto-renews monthly — cancel anytime'
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
