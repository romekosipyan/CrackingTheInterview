/** Customer-facing promo codes — all apply the same launch discount unless overridden in Stripe. */
export const PROMO_CODES = [
  'LAUNCH10',
  'REDDIT10',
  'TWITTER10',
  'PHUNT10',
  'DISCORD10',
  // Referral & affiliate program (see /referral). FRIEND10 = peer referrals,
  // CREATOR10 = influencers/affiliates. Both apply the shared launch coupon in
  // Stripe once `npm run setup:promos` has been run.
  'FRIEND10',
  'CREATOR10',
] as const

export type PromoCode = (typeof PROMO_CODES)[number]

export const PROMO_DISCOUNT_LABEL = '10% off your first payment'

export function normalizePromoCode(value: string | null | undefined): PromoCode | null {
  if (!value) return null
  const code = value.trim().toUpperCase()
  return (PROMO_CODES as readonly string[]).includes(code) ? (code as PromoCode) : null
}

export const PROMO_CHANNEL_UTM: Record<PromoCode, { utm_source: string; utm_medium: string }> = {
  LAUNCH10: { utm_source: 'promo', utm_medium: 'launch' },
  REDDIT10: { utm_source: 'reddit', utm_medium: 'promo' },
  TWITTER10: { utm_source: 'twitter', utm_medium: 'promo' },
  PHUNT10: { utm_source: 'producthunt', utm_medium: 'promo' },
  DISCORD10: { utm_source: 'discord', utm_medium: 'promo' },
  FRIEND10: { utm_source: 'referral', utm_medium: 'friend' },
  CREATOR10: { utm_source: 'creator', utm_medium: 'affiliate' }
}
