/**
 * Creates Kraken Interview marketing promotion codes on Stripe (live or test).
 *
 *   cd server && npx tsx scripts/create-promo-codes.ts
 *
 * Requires STRIPE_SECRET_KEY in server/.env (use live key for production codes).
 * Optional: STRIPE_PROMO_COUPON_ID — defaults to coupon named "Launch 10% Off First Payment".
 */
import 'dotenv/config'
import Stripe from 'stripe'
import { PROMO_CODES } from '../../shared/promoCodes'

const COUPON_NAME = 'Launch 10% Off First Payment'

async function findLaunchCoupon(stripe: Stripe): Promise<string> {
  const configured = process.env.STRIPE_PROMO_COUPON_ID?.trim()
  if (configured) return configured

  const coupons = await stripe.coupons.list({ limit: 100 })
  const match = coupons.data.find((c) => c.name === COUPON_NAME && c.valid)
  if (!match) {
    throw new Error(
      `Coupon "${COUPON_NAME}" not found. Set STRIPE_PROMO_COUPON_ID or run create_coupon first.`
    )
  }
  return match.id
}

async function main(): Promise<void> {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key) throw new Error('STRIPE_SECRET_KEY is required in server/.env')

  const stripe = new Stripe(key)
  const mode = key.startsWith('sk_live') ? 'live' : 'test'
  const couponId = await findLaunchCoupon(stripe)

  console.info(`Stripe mode: ${mode}`)
  console.info(`Coupon: ${couponId}`)

  for (const code of PROMO_CODES) {
    const existing = await stripe.promotionCodes.list({ code, limit: 1 })
    const active = existing.data.find((p) => p.active)
    if (active) {
      console.info(`✓ ${code} already active (${active.id})`)
      continue
    }

    const promo = await stripe.promotionCodes.create({
      promotion: { type: 'coupon', coupon: couponId },
      code,
      active: true,
      metadata: {
        campaign: code === 'LAUNCH10' ? 'launch' : 'week1',
        channel: code.replace(/10$/, '').toLowerCase()
      },
      ...(code === 'PHUNT10' ? { max_redemptions: 100 } : {})
    })
    console.info(`+ Created ${code} → ${promo.id}`)
  }

  console.info('Done.')
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
