import { normalizePromoCode, type PromoCode } from './promoCodes'

export type CheckoutDiscount =
  | { type: 'promotion_code'; id: string }
  | { type: 'coupon'; id: string }

type StripeListPromos = {
  data: Array<{ id: string; active: boolean }>
}

type StripeLike = {
  promotionCodes: {
    list: (params: { code: string; active: boolean; limit: number }) => Promise<StripeListPromos>
  }
}

/**
 * Resolve a marketing promo code to a Stripe checkout discount.
 * Tries active promotion codes first, then falls back to a configured coupon id.
 */
export async function resolveCheckoutDiscount(
  stripe: StripeLike,
  promoCode: string | undefined,
  fallbackCouponId: string | undefined
): Promise<CheckoutDiscount | undefined> {
  const normalized = normalizePromoCode(promoCode)
  if (!normalized) return undefined

  const promos = await stripe.promotionCodes.list({ code: normalized, active: true, limit: 1 })
  const promo = promos.data[0]
  if (promo?.active) {
    return { type: 'promotion_code', id: promo.id }
  }

  if (fallbackCouponId) {
    return { type: 'coupon', id: fallbackCouponId }
  }

  return undefined
}

export function checkoutDiscountParam(
  discount: CheckoutDiscount | undefined
): Array<{ promotion_code: string } | { coupon: string }> | undefined {
  if (!discount) return undefined
  if (discount.type === 'promotion_code') return [{ promotion_code: discount.id }]
  return [{ coupon: discount.id }]
}

export function promoMetadata(promoCode: PromoCode | null): Record<string, string> {
  if (!promoCode) return {}
  return { promoCode }
}
