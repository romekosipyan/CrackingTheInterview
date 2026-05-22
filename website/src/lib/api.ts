import type { PaidPlanId, SubscriptionPlan } from '@shared/subscriptionPlans'

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()
const API_URL =
  configuredApiUrl !== undefined && configuredApiUrl !== ''
    ? configuredApiUrl.replace(/\/$/, '')
    : import.meta.env.DEV
      ? 'http://localhost:4242'
      : ''

export type DownloadInfo = {
  platform: 'win' | 'mac'
  label: string
  filename: string
  url: string
}

export type SubscriptionItem = {
  kind: 'subscription' | 'lifetime'
  planId: string
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

function apiPath(path: string): string {
  return `${API_URL}${path}`
}

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  const response = await fetch(apiPath('/api/plans'))
  if (!response.ok) throw new Error('Could not load pricing plans.')
  const data = (await response.json()) as { plans: SubscriptionPlan[] }
  return data.plans
}

export async function fetchDownloads(): Promise<DownloadInfo[]> {
  const response = await fetch(apiPath('/api/downloads'))
  if (!response.ok) throw new Error('Could not load download links.')
  const data = (await response.json()) as { downloads: DownloadInfo[] }
  return data.downloads
}

export async function startCheckout(planId: PaidPlanId, email?: string): Promise<string> {
  const response = await fetch(apiPath('/api/create-checkout-session'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, email })
  })

  const data = (await response.json()) as { url?: string; error?: string }
  if (!response.ok || !data.url) {
    throw new Error(data.error ?? 'Could not start checkout.')
  }
  return data.url
}

export async function lookupSubscription(email: string): Promise<SubscriptionLookupResult> {
  const response = await fetch(apiPath('/api/subscription/lookup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  })
  const data = (await response.json()) as SubscriptionLookupResult & { error?: string }
  if (!response.ok) {
    throw new Error(data.error ?? 'Could not look up subscription.')
  }
  return data
}

export async function cancelSubscription(
  email: string,
  subscriptionId: string
): Promise<{ ok: true; cancelAtPeriodEnd: boolean; currentPeriodEnd: number }> {
  const response = await fetch(apiPath('/api/subscription/cancel'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, subscriptionId })
  })
  const data = (await response.json()) as {
    ok?: true
    cancelAtPeriodEnd?: boolean
    currentPeriodEnd?: number
    error?: string
  }
  if (!response.ok) {
    throw new Error(data.error ?? 'Could not cancel subscription.')
  }
  return data as { ok: true; cancelAtPeriodEnd: boolean; currentPeriodEnd: number }
}

export const API_BASE_URL = API_URL
