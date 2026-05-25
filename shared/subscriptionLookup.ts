import type { SubscriptionPlanId } from './subscriptionPlans'

export type SubscriptionLookupItem = {
  kind: 'subscription' | 'lifetime'
  planId: SubscriptionPlanId
  planName: string
  status: string
  subscriptionId?: string
  currentPeriodEnd?: number
  cancelAtPeriodEnd?: boolean
}

function pickPreferredSubscription(
  current: SubscriptionLookupItem,
  candidate: SubscriptionLookupItem
): SubscriptionLookupItem {
  if (current.cancelAtPeriodEnd !== candidate.cancelAtPeriodEnd) {
    return current.cancelAtPeriodEnd ? candidate : current
  }

  return (candidate.currentPeriodEnd ?? 0) >= (current.currentPeriodEnd ?? 0) ? candidate : current
}

/** One card per plan tier — prefer renewing over scheduled-cancel duplicates. */
export function consolidateSubscriptionItems(
  items: SubscriptionLookupItem[]
): SubscriptionLookupItem[] {
  const lifetime = items.filter((item) => item.kind === 'lifetime')
  const recurring = items.filter((item) => item.kind === 'subscription')
  const byPlan = new Map<SubscriptionPlanId, SubscriptionLookupItem>()

  for (const item of recurring) {
    const existing = byPlan.get(item.planId)
    byPlan.set(item.planId, existing ? pickPreferredSubscription(existing, item) : item)
  }

  return [...byPlan.values(), ...lifetime]
}

export function hasHiddenDuplicateSubscriptions(items: SubscriptionLookupItem[]): boolean {
  const consolidated = consolidateSubscriptionItems(items)
  return consolidated.length < items.length
}
